#!/usr/bin/env node
/**
 * Playwright-driven throttled perf harness.
 *
 * Boots Chromium, connects CDP, applies CPU throttling, navigates to the
 * dev server with ?perf=1, scrolls top-to-bottom, and reads back the
 * PerfHUD's FPS / long-task / GPU-time numbers at each section.
 *
 * Run:
 *   node scripts/perf-throttle-test.mjs --rate 6
 *
 * Flags:
 *   --rate <n>     CPU throttle multiplier (1 = unthrottled, 6 = ~6x slower)
 *   --url <url>    Page to load (default http://localhost:3000/?perf=1)
 *   --headed       Show the browser window (default headless)
 *   --warm-runs N  Discard the first N sample passes (default 1, accounts for
 *                  shader cold-compile cost on first visit)
 */

import { chromium } from 'playwright';
import { argv } from 'node:process';

/* ── CLI ────────────────────────────────────────────────────────────────── */
function arg(flag, fallback) {
  const i = argv.indexOf(flag);
  return i !== -1 ? argv[i + 1] : fallback;
}
const RATE = Number(arg('--rate', '6'));
const URL = arg('--url', 'http://localhost:3000/?perf=1');
const HEADED = argv.includes('--headed');
const WARM_RUNS = Number(arg('--warm-runs', '1'));

console.log(`[perf-harness] CPU rate=${RATE}x  url=${URL}  headed=${HEADED}`);

/* ── HUD reader (runs in page) ──────────────────────────────────────────── */
const READ_HUD = `
  (() => {
    const hud = document.querySelector('div[style*="z-index: 99999"]');
    if (!hud) return { ok: false, reason: 'no_hud' };
    const text = hud.innerText;
    const get = (label) => {
      const re = new RegExp(label.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&') + '\\\\s*\\\\n([^\\\\n]+)');
      const m = text.match(re);
      return m ? m[1].trim() : null;
    };
    const fpsLine = get('FPS \\\\(med\\\\)');
    const longTasks = get('Long tasks');
    const ctx = get('WebGL ctx');
    const dpr = get('DPR cap');
    // Per-component table — each line is "● Label  X.XX ms" or "● Label  —"
    // We capture only the ● (live) entries.
    const lines = text.split('\\n');
    const live = [];
    for (const line of lines) {
      if (/^[●○]/.test(line.trim())) {
        const t = line.trim();
        const isLive = t.startsWith('●');
        const m = t.match(/^[●○]\\s*(\\S+)\\s+(.+)$/);
        if (m) live.push({ live: isLive, label: m[1], gpuMs: m[2] });
      }
    }
    return {
      ok: true,
      fpsLine,
      longTasks: longTasks ? parseInt(longTasks, 10) : null,
      ctx,
      dpr,
      live,
      _raw: text.slice(0, 600),
    };
  })()
`;

/* ── Harness ────────────────────────────────────────────────────────────── */
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

  // Open a CDP session so we can throttle CPU.
  const client = await context.newCDPSession(page);
  if (RATE > 1) {
    await client.send('Emulation.setCPUThrottlingRate', { rate: RATE });
    console.log(`[perf-harness] CPU throttling set to ${RATE}x`);
  }

  // Capture page errors so we can surface them.
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') pageErrors.push(`[console] ${msg.text()}`);
  });

  console.log(`[perf-harness] navigating to ${URL}`);
  const navStart = Date.now();
  await page.goto(URL, { waitUntil: 'load', timeout: 60_000 });
  const navMs = Date.now() - navStart;
  console.log(`[perf-harness] page loaded in ${navMs} ms`);

  // Wait for the loading screen to finish (it lasts ~2.5s).
  await page.waitForTimeout(3500);

  // Wait until the HUD is present.
  await page.waitForFunction(
    () => !!document.querySelector('div[style*="z-index: 99999"]'),
    null,
    { timeout: 15_000 },
  );
  console.log('[perf-harness] HUD ready');

  // Section anchors to scroll past — we'll read the HUD at each.
  const SECTIONS = [
    { name: 'hero',          scrollY: 0 },
    { name: 'about',         scrollY: 1500 },
    { name: 'experience',    scrollY: 3000 },
    { name: 'skills',        scrollY: 4500 },
    { name: 'projects',      scrollY: 6000 },
    { name: 'education',     scrollY: 7500 },
    { name: 'certifications',scrollY: 8800 },
    { name: 'languages',     scrollY: 10000 },
    { name: 'interests',     scrollY: 11200 },
    { name: 'photography',   scrollY: 12500 },
    { name: 'contact',       scrollY: 14000 },
  ];

  // The PerfHUD updates its FPS reading every ~250ms. We let it settle 1500ms
  // at each section to get a stable median across ~6 samples.
  async function sampleAt(scrollY, name) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollY);
    await page.waitForTimeout(1500);
    const snap = await page.evaluate(READ_HUD);
    return { name, scrollY, ...snap };
  }

  // Warm-up pass(es) — discard. First visit pays shader compile cost.
  for (let i = 0; i < WARM_RUNS; i++) {
    console.log(`[perf-harness] warm-up pass ${i + 1}/${WARM_RUNS}`);
    for (const s of SECTIONS) await sampleAt(s.scrollY, s.name);
  }

  // Real measurement pass.
  console.log('[perf-harness] measurement pass');
  const samples = [];
  for (const s of SECTIONS) {
    const r = await sampleAt(s.scrollY, s.name);
    samples.push(r);
  }

  // Also do a continuous-scroll stress test: smooth-scroll through the whole
  // page and grab the HUD at the end. That captures coordinator behaviour
  // under fast scroll.
  console.log('[perf-harness] continuous-scroll stress test');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await page.evaluate(async () => {
    const start = performance.now();
    const maxY = document.documentElement.scrollHeight;
    const duration = 6000; // 6s top-to-bottom
    while (true) {
      const t = (performance.now() - start) / duration;
      if (t >= 1) break;
      const eased = t * t * (3 - 2 * t);
      window.scrollTo(0, eased * maxY);
      await new Promise(r => requestAnimationFrame(r));
    }
  });
  await page.waitForTimeout(500);
  const continuousScrollSample = await page.evaluate(READ_HUD);

  /* ── Report ───────────────────────────────────────────────────────────── */
  console.log('\n──────────────── RESULTS ────────────────');
  console.log(`CPU throttle: ${RATE}x`);
  console.log(`URL: ${URL}\n`);

  console.log('Section-by-section (after 1.5s settle):');
  console.log('Section           | FPS med | long | ctx              | live components');
  console.log('──────────────────┼─────────┼──────┼──────────────────┼──────────────────');
  for (const s of samples) {
    if (!s.ok) {
      console.log(`${s.name.padEnd(18)}| ERROR: ${s.reason}`);
      continue;
    }
    const liveLabels = s.live.filter(x => x.live).map(x => x.label).join(',') || '-';
    console.log(
      `${s.name.padEnd(18)}| ${(s.fpsLine || '').padEnd(8)}| ${String(s.longTasks ?? '?').padEnd(5)}| ${(s.ctx || '').padEnd(17)}| ${liveLabels}`
    );
  }

  console.log('\nAfter continuous 6s scroll:');
  console.log(`  FPS: ${continuousScrollSample.fpsLine}`);
  console.log(`  long tasks total: ${continuousScrollSample.longTasks}`);
  console.log(`  context count: ${continuousScrollSample.ctx}`);

  if (pageErrors.length) {
    console.log('\n⚠ Page errors observed:');
    for (const e of pageErrors.slice(0, 10)) console.log(`  ${e.slice(0, 200)}`);
  } else {
    console.log('\n✓ No page errors.');
  }

  /* ── Pass/fail verdict ────────────────────────────────────────────────── */
  let allOk = true;
  let lowestFps = Infinity;
  for (const s of samples) {
    if (!s.ok || !s.fpsLine) { allOk = false; continue; }
    const m = s.fpsLine.match(/(\d+)/);
    const fps = m ? parseInt(m[1], 10) : 0;
    lowestFps = Math.min(lowestFps, fps);
  }
  console.log(`\nLowest median FPS across sections: ${lowestFps}`);
  if (lowestFps >= 58) {
    console.log('✓ PASS: 60fps target met at this throttle level.');
  } else if (lowestFps >= 45) {
    console.log('~ PARTIAL: above 45fps everywhere but not solid 60fps.');
  } else {
    console.log('✗ FAIL: dropped below 45fps in at least one section.');
  }

  await browser.close();
}

run().catch((e) => {
  console.error('[perf-harness] FATAL:', e);
  process.exit(1);
});
