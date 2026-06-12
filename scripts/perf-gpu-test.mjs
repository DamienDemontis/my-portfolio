#!/usr/bin/env node
/**
 * GPU-bound perf test.
 *
 * Launches Chromium with a SOFTWARE WebGL backend (SwiftShader). This makes
 * every fragment-shader pixel cost CPU time, so it approximates (in fact
 * over-stresses) a weak discrete GPU — the situation on machines like a
 * Ryzen 3 4100 with a low-end / blocklisted card.
 *
 * Measures FPS in three states:
 *   1. hero idle (Dither full-screen shader running)
 *   2. scrolled to About (Lanyard 3D scene)
 *   3. scrolled to Languages (SoftAurora full-section shader)
 * plus the HUD per-component GPU timings.
 *
 * Usage:
 *   node scripts/perf-gpu-test.mjs [--url http://localhost:3000/?perf=1]
 */

import { chromium } from 'playwright';
import { argv } from 'node:process';

function arg(flag, fallback) {
  const i = argv.indexOf(flag);
  return i !== -1 ? argv[i + 1] : fallback;
}
const URL = arg('--url', 'http://localhost:3000/?perf=1');

console.log(`[gpu-test] url=${URL}  (software WebGL / SwiftShader)`);

async function measureFps(page, ms = 2500) {
  return await page.evaluate(async (dur) => {
    const intervals = [];
    let last = performance.now();
    let raf;
    const onFrame = (t) => { intervals.push(t - last); last = t; raf = requestAnimationFrame(onFrame); };
    raf = requestAnimationFrame(onFrame);
    await new Promise((r) => setTimeout(r, dur));
    cancelAnimationFrame(raf);
    intervals.sort((a, b) => a - b);
    const pctl = (p) => intervals[Math.floor(intervals.length * p)] || 0;
    return {
      frames: intervals.length,
      medianFps: Math.round(1000 / (pctl(0.5) || 1)),
      p95Fps: Math.round(1000 / (pctl(0.95) || 1)),
      worstMs: Math.round(pctl(1)),
    };
  }, ms);
}

async function readHud(page) {
  return await page.evaluate(() => {
    const hud = document.querySelector('div[style*="z-index: 99999"]');
    if (!hud) return null;
    const text = hud.innerText;
    const lines = text.split('\n').filter((l) => /^[●○]/.test(l.trim())).map((l) => l.trim());
    return lines.join(' | ');
  });
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--disable-gpu', // force the software path
    ],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });

  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  console.log('[gpu-test] loading ...');
  await page.goto(URL, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(5000); // let loader finish + shaders compile (slow in SwiftShader)

  // Detect actual renderer in use.
  const renderer = await page.evaluate(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
      return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown';
    } catch { return 'error'; }
  });
  console.log(`[gpu-test] WebGL renderer: ${renderer}`);

  // 1. Hero idle
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1500);
  const heroFps = await measureFps(page);
  const heroHud = await readHud(page);

  // 2. About (Lanyard)
  await page.evaluate(() => { const el = document.getElementById('about'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(2500);
  const aboutFps = await measureFps(page);
  const aboutHud = await readHud(page);

  // 3. Languages (SoftAurora)
  await page.evaluate(() => { const el = document.getElementById('languages'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(2500);
  const langFps = await measureFps(page);
  const langHud = await readHud(page);

  // 4. Continuous scroll
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  const scrollStats = await page.evaluate(async () => {
    const intervals = [];
    let last = performance.now();
    let raf;
    const onFrame = (t) => { intervals.push(t - last); last = t; raf = requestAnimationFrame(onFrame); };
    raf = requestAnimationFrame(onFrame);
    const start = performance.now();
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const DURATION = 6000;
    while (true) {
      const t = (performance.now() - start) / DURATION;
      if (t >= 1) break;
      window.scrollTo(0, (t * t * (3 - 2 * t)) * maxY);
      await new Promise((r) => requestAnimationFrame(r));
    }
    cancelAnimationFrame(raf);
    intervals.sort((a, b) => a - b);
    const pctl = (p) => intervals[Math.floor(intervals.length * p)] || 0;
    return {
      medianFps: Math.round(1000 / (pctl(0.5) || 1)),
      p95Fps: Math.round(1000 / (pctl(0.95) || 1)),
      worstMs: Math.round(pctl(1)),
    };
  });

  console.log('\n──────────── GPU-BOUND RESULTS (software WebGL) ────────────');
  console.log(`renderer: ${renderer}\n`);
  console.log(`hero idle (Dither):       ${JSON.stringify(heroFps)}`);
  console.log(`   live: ${heroHud}`);
  console.log(`about (Lanyard 3D):       ${JSON.stringify(aboutFps)}`);
  console.log(`   live: ${aboutHud}`);
  console.log(`languages (SoftAurora):   ${JSON.stringify(langFps)}`);
  console.log(`   live: ${langHud}`);
  console.log(`continuous scroll:        ${JSON.stringify(scrollStats)}`);
  if (errors.length) {
    console.log(`\npage errors: ${errors.length}`);
    errors.slice(0, 5).forEach((e) => console.log('  ' + e.slice(0, 160)));
  }

  await browser.close();
}

run().catch((e) => { console.error('[gpu-test] FATAL', e); process.exit(1); });
