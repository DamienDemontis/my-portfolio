#!/usr/bin/env node
/**
 * Chrome DevTools Protocol trace recorder.
 *
 * Records the full trace data Chrome DevTools' Performance panel would record:
 * every Layout, RecalcStyle, Paint, Raster, Composite, JS task, GC, GPU command,
 * scroll event, and frame boundary — with microsecond timestamps and (when
 * available) JS call stacks.
 *
 * Output:
 *   perf-traces/trace-<timestamp>.json — raw Chromium trace, can be loaded into
 *     chrome://tracing or DevTools Performance panel (drag-drop)
 *   perf-traces/trace-<timestamp>.meta.json — scenario metadata
 *
 * Usage:
 *   node scripts/perf-trace-record.mjs --rate 6 --scenario cold-load-scroll
 *
 * Flags:
 *   --rate <n>       CPU throttle multiplier (default 6)
 *   --hwc <n>        navigator.hardwareConcurrency override (default 4)
 *   --url <url>      Page to load (default http://localhost:3000/?perf=1)
 *   --scenario <s>   "cold-load-scroll" (default) | "scroll-only" | "idle"
 *   --duration <s>   Scroll duration in seconds (default 8 — slow + thorough)
 *   --headed         Show the browser
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { argv } from 'node:process';

function arg(flag, fallback) {
  const i = argv.indexOf(flag);
  return i !== -1 ? argv[i + 1] : fallback;
}
const RATE = Number(arg('--rate', '6'));
const HWC = Number(arg('--hwc', '4'));
const URL = arg('--url', 'http://localhost:3000/?perf=1');
const SCENARIO = arg('--scenario', 'cold-load-scroll');
const DURATION_S = Number(arg('--duration', '8'));
const HEADED = argv.includes('--headed');

const OUT_DIR = 'perf-traces';
mkdirSync(OUT_DIR, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const tracePath = join(OUT_DIR, `trace-${stamp}.json`);
const metaPath = join(OUT_DIR, `trace-${stamp}.meta.json`);

console.log(`[trace] scenario=${SCENARIO}  rate=${RATE}x  hwc=${HWC}  duration=${DURATION_S}s`);
console.log(`[trace] output: ${tracePath}`);

/* ── Trace categories — match what DevTools Performance panel uses ──────── */
// The leading "-" disables a category; "disabled-by-default-*" categories
// are off by default and need to be explicitly enabled.
const CATEGORIES = [
  'devtools.timeline',
  'disabled-by-default-devtools.timeline',
  'disabled-by-default-devtools.timeline.frame',
  'disabled-by-default-devtools.timeline.stack',
  'disabled-by-default-devtools.timeline.invalidationTracking',
  'disabled-by-default-devtools.screenshot',
  'disabled-by-default-v8.cpu_profiler',
  'v8.execute',
  'v8',
  'blink',
  'blink.user_timing',
  'loading',
  'latencyInfo',
  'gpu',
  'cc',
  'toplevel',
];

async function run() {
  const browser = await chromium.launch({
    headless: !HEADED,
    args: ['--enable-gpu', '--ignore-gpu-blocklist'],
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  // Apply throttling BEFORE navigation so cold-load gets it too.
  if (RATE > 1) {
    await client.send('Emulation.setCPUThrottlingRate', { rate: RATE });
  }
  await client.send('Emulation.setHardwareConcurrencyOverride', { hardwareConcurrency: HWC });

  // Buffer trace events; they arrive as a stream of 'Tracing.dataCollected'
  // events when we stop. We start/stop multiple times in some scenarios so
  // collection lives across the whole run.
  const traceChunks = [];
  client.on('Tracing.dataCollected', (params) => {
    if (params.value && params.value.length) traceChunks.push(...params.value);
  });

  async function startTracing() {
    const done = new Promise((resolve) => { client.once('Tracing.tracingComplete', resolve); });
    await client.send('Tracing.start', {
      categories: CATEGORIES.join(','),
      options: 'sampling-frequency=10000',
      transferMode: 'ReportEvents',
    });
    return done;
  }

  let tracingComplete;
  if (SCENARIO !== 'scroll-only') {
    // Start tracing BEFORE navigation so we capture cold-load too.
    tracingComplete = await startTracing();
    console.log('[trace] tracing started (before nav)');
  }

  const scenarioMeta = await runScenario(page, client, SCENARIO, async () => {
    // scroll-only scenario calls this hook AFTER cold-load has settled
    // to start tracing only for the scroll phase.
    tracingComplete = await startTracing();
    console.log('[trace] tracing started (post-settle, scroll-only)');
  });

  await client.send('Tracing.end');
  await tracingComplete;
  console.log(`[trace] tracing stopped — ${traceChunks.length} events collected`);

  // Save raw trace in DevTools-compatible format.
  const traceFile = { traceEvents: traceChunks, metadata: { source: 'playwright-cdp', scenario: SCENARIO } };
  writeFileSync(tracePath, JSON.stringify(traceFile));
  writeFileSync(metaPath, JSON.stringify({
    rate: RATE, hwc: HWC, url: URL, scenario: SCENARIO, duration_s: DURATION_S,
    eventCount: traceChunks.length, ...scenarioMeta,
  }, null, 2));

  console.log(`[trace] saved trace (${(JSON.stringify(traceFile).length / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`[trace] open in chrome://tracing or DevTools Performance > Load profile`);

  await browser.close();
}

async function runScenario(page, client, name, startTracingNow) {
  if (name === 'cold-load-scroll') {
    const t0 = Date.now();
    await page.goto(URL, { waitUntil: 'load', timeout: 60_000 });
    const loadMs = Date.now() - t0;
    console.log(`[trace] page loaded in ${loadMs} ms (post-throttle)`);
    await page.waitForTimeout(4000);
    await scroll(page, DURATION_S);
    await page.waitForTimeout(500);
    return { loadMs };
  }
  if (name === 'scroll-only') {
    await page.goto(URL, { waitUntil: 'load', timeout: 60_000 });
    await page.waitForTimeout(6000); // let cold-load fully settle
    await startTracingNow();         // tracing starts here, not before
    await scroll(page, DURATION_S);
    await page.waitForTimeout(500);
    return { coldLoadDiscarded: true };
  }
  if (name === 'idle') {
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(4000 + DURATION_S * 1000);
    return {};
  }
  throw new Error(`unknown scenario: ${name}`);
}

async function scroll(page, durationS) {
  console.log(`[trace] scrolling for ${durationS}s ...`);
  await page.evaluate(async (durationMs) => {
    const start = performance.now();
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    while (true) {
      const t = (performance.now() - start) / durationMs;
      if (t >= 1) break;
      const eased = t * t * (3 - 2 * t);
      window.scrollTo(0, eased * maxY);
      await new Promise(r => requestAnimationFrame(r));
    }
  }, durationS * 1000);
}

run().catch((e) => { console.error('[trace] FATAL:', e); process.exit(1); });
