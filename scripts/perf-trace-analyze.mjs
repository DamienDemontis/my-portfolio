#!/usr/bin/env node
/**
 * Chromium trace JSON analyzer.
 *
 * Reads a trace recorded by perf-trace-record.mjs and dumps:
 *   1. Long-task summary: every RunTask > 50ms, what ran inside it
 *   2. Layout/Reflow summary: count, total duration, biggest offenders
 *   3. Style Recalc summary: count, total duration, biggest offenders
 *   4. Paint/Composite summary
 *   5. JS execution hot-paths: which functions burned the most time
 *   6. Repeating patterns: same (callsite, kind) firing many times
 *   7. Per-frame timeline: every frame > 16ms with its breakdown
 *
 * Usage:
 *   node scripts/perf-trace-analyze.mjs perf-traces/trace-<timestamp>.json
 */

import { readFileSync } from 'node:fs';
import { argv } from 'node:process';

const inputPath = argv[2];
if (!inputPath) {
  console.error('usage: node scripts/perf-trace-analyze.mjs <trace.json>');
  process.exit(1);
}

console.log(`[analyze] loading ${inputPath} ...`);
const raw = readFileSync(inputPath, 'utf8');
const trace = JSON.parse(raw);
const events = trace.traceEvents || [];
console.log(`[analyze] ${events.length} events`);

/* ── Index events by category and name ─────────────────────────────────── */
const byName = new Map();
for (const e of events) {
  if (e.ph !== 'X' && e.ph !== 'B' && e.ph !== 'E') continue;
  if (!byName.has(e.name)) byName.set(e.name, []);
  byName.get(e.name).push(e);
}
// Track all distinct event names sorted by count for quick exploration.
const nameStats = [...byName.entries()]
  .map(([n, list]) => ({ name: n, count: list.length, totalUs: sumDur(list) }))
  .sort((a, b) => b.totalUs - a.totalUs);

function sumDur(list) {
  let s = 0;
  for (const e of list) if (typeof e.dur === 'number') s += e.dur;
  return s;
}
function us(n) { return `${(n / 1000).toFixed(1)}ms`; }

/* ── Discover the renderer thread (where the main JS + Layout happen) ──── */
// Renderer "CrRendererMain" thread — most main-thread work lives there.
// We filter to events on that thread to avoid polluting numbers with GPU /
// compositor / network threads.
const threadNameById = new Map();
for (const e of events) {
  if (e.name === 'thread_name' && e.args?.name) {
    threadNameById.set(`${e.pid}/${e.tid}`, e.args.name);
  }
}
const mainTids = new Set();
for (const [k, name] of threadNameById) {
  if (name === 'CrRendererMain') mainTids.add(k);
}
function isMain(e) { return mainTids.has(`${e.pid}/${e.tid}`); }

const mainEvents = events.filter(isMain);
console.log(`[analyze] ${mainEvents.length} renderer-main events on ${mainTids.size} thread(s)`);

/* ── 1. Long tasks (> 50ms) ────────────────────────────────────────────── */
// In the new tracing model, the "RunTask" event wraps a single main-thread
// task. Its child events tell us what ran. Long tasks (>50ms) are the
// things that cause visible jank.
const runTasks = (byName.get('RunTask') || []).filter(isMain).filter(e => (e.dur || 0) >= 50_000);
runTasks.sort((a, b) => (b.dur || 0) - (a.dur || 0));

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(' LONG TASKS (>50ms on renderer main)    ');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`count: ${runTasks.length}, total: ${us(runTasks.reduce((s, e) => s + (e.dur || 0), 0))}\n`);

for (const t of runTasks.slice(0, 20)) {
  const tsMs = ((t.ts || 0) / 1000).toFixed(1);
  console.log(`  ${us(t.dur)} @ ${tsMs}ms`);
  // What ran inside this RunTask? Find child events whose ts is within the
  // task's time range.
  const tStart = t.ts;
  const tEnd = t.ts + t.dur;
  const inside = mainEvents.filter(e =>
    e.ts >= tStart && e.ts < tEnd && e.ph === 'X' && e !== t &&
    typeof e.dur === 'number' && e.dur > 1000
  );
  // Aggregate by name
  const agg = new Map();
  for (const e of inside) {
    const k = e.name;
    if (!agg.has(k)) agg.set(k, { count: 0, dur: 0 });
    const a = agg.get(k);
    a.count++;
    a.dur += e.dur;
  }
  const rows = [...agg.entries()].sort((a, b) => b[1].dur - a[1].dur).slice(0, 6);
  for (const [name, a] of rows) {
    console.log(`     · ${name.padEnd(30)} ${String(a.count).padStart(4)}× ${us(a.dur)}`);
  }
}

/* ── 2. Layout / Reflow ────────────────────────────────────────────────── */
const layouts = [...(byName.get('Layout') || []), ...(byName.get('LayoutShift') || [])].filter(isMain);
const layoutsLong = layouts.filter(e => (e.dur || 0) > 4_000).sort((a, b) => (b.dur || 0) - (a.dur || 0));

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(' LAYOUT / REFLOW                        ');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`total Layout events: ${layouts.length}`);
console.log(`total Layout time: ${us(sumDur(layouts))}`);
console.log(`Layout events > 4ms: ${layoutsLong.length}\n`);

for (const l of layoutsLong.slice(0, 10)) {
  const tsMs = ((l.ts || 0) / 1000).toFixed(1);
  const args = l.args?.beginData || l.args || {};
  const dirty = args.dirtyObjects ?? args.totalObjects ?? '?';
  const partial = args.partialLayout ?? '?';
  const root = args.rootNode ?? args.frame ?? '';
  console.log(`  ${us(l.dur)} @ ${tsMs}ms  dirty=${dirty} partial=${partial} root=${root}`);
}

// Detect "layout thrash": >=3 Layout events within a 50ms window
console.log('\n  Layout thrash (≥3 Layouts in 50ms):');
const thrash = [];
for (let i = 0; i < layouts.length; i++) {
  const window = layouts.filter(l => l.ts >= layouts[i].ts && l.ts <= layouts[i].ts + 50_000);
  if (window.length >= 3) thrash.push({ ts: layouts[i].ts, count: window.length, dur: sumDur(window) });
}
// Dedup overlapping windows (keep the one with the most events)
thrash.sort((a, b) => b.count - a.count);
const seen = new Set();
const uniqueThrash = thrash.filter(t => {
  const bucket = Math.floor(t.ts / 50_000);
  if (seen.has(bucket)) return false;
  seen.add(bucket);
  return true;
}).sort((a, b) => a.ts - b.ts);
for (const t of uniqueThrash.slice(0, 10)) {
  console.log(`    @ ${(t.ts / 1000).toFixed(1)}ms — ${t.count} layouts, total ${us(t.dur)}`);
}

/* ── 3. Style recalc ───────────────────────────────────────────────────── */
const styles = [
  ...(byName.get('UpdateLayoutTree') || []),
  ...(byName.get('RecalculateStyles') || []),
  ...(byName.get('ScheduleStyleRecalculation') || []),
].filter(isMain);
const stylesLong = styles.filter(e => (e.dur || 0) > 2_000).sort((a, b) => (b.dur || 0) - (a.dur || 0));

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(' STYLE RECALC                           ');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`total: ${styles.length}  time: ${us(sumDur(styles))}  events >2ms: ${stylesLong.length}\n`);

for (const s of stylesLong.slice(0, 10)) {
  const args = s.args || {};
  const elements = args.elementCount ?? args.beginData?.elementCount ?? '?';
  console.log(`  ${us(s.dur)} @ ${(s.ts / 1000).toFixed(1)}ms  elementsAffected=${elements}`);
}

/* ── 4. Paint / Composite ──────────────────────────────────────────────── */
const paints = [
  ...(byName.get('Paint') || []),
  ...(byName.get('UpdateLayer') || []),
  ...(byName.get('CompositeLayers') || []),
  ...(byName.get('RasterTask') || []),
].filter(isMain);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(' PAINT / COMPOSITE                      ');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`total: ${paints.length}  time: ${us(sumDur(paints))}\n`);

const paintsLong = paints.filter(e => (e.dur || 0) > 4_000).sort((a, b) => (b.dur || 0) - (a.dur || 0));
for (const p of paintsLong.slice(0, 10)) {
  console.log(`  ${us(p.dur)} @ ${(p.ts / 1000).toFixed(1)}ms  ${p.name}`);
}

/* ── 5. JS hot-paths (FunctionCall + EvaluateScript) ───────────────────── */
const jsCalls = [
  ...(byName.get('FunctionCall') || []),
  ...(byName.get('EvaluateScript') || []),
  ...(byName.get('V8.Execute') || []),
].filter(isMain);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(' JS EXECUTION HOT-PATHS                 ');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`total JS calls: ${jsCalls.length}  time: ${us(sumDur(jsCalls))}\n`);

// Group by callsite (data.url:line:column for FunctionCall, data.url for EvaluateScript)
const bySite = new Map();
for (const e of jsCalls) {
  const data = e.args?.data || {};
  const fn = data.functionName || data.url || data.scriptName || '<anon>';
  const loc = data.url ? `${shortUrl(data.url)}:${data.lineNumber ?? '?'}` : '';
  const key = `${e.name}::${fn}::${loc}`;
  if (!bySite.has(key)) bySite.set(key, { kind: e.name, fn, loc, count: 0, dur: 0 });
  const a = bySite.get(key);
  a.count++;
  a.dur += e.dur || 0;
}
const topSites = [...bySite.values()].sort((a, b) => b.dur - a.dur).slice(0, 20);
console.log('  Top 20 by total time:');
console.log('  KIND               TIME     CALLS  WHERE');
console.log('  ──────────────────┼────────┼──────┼──────────────────────────');
for (const s of topSites) {
  console.log(`  ${s.kind.padEnd(18)}│${us(s.dur).padStart(7)} │${String(s.count).padStart(5)} │ ${s.fn.slice(0, 50)} ${s.loc}`.slice(0, 200));
}

function shortUrl(u) {
  if (!u) return '';
  return u.replace(/^https?:\/\/[^/]+/, '').replace(/^\/+/, '').slice(0, 60);
}

/* ── 6. Repeating patterns (same callsite firing N times in a hot loop) ─ */
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(' REPEATING PATTERNS                     ');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const repeaters = topSites.filter(s => s.count >= 20).sort((a, b) => b.count - a.count).slice(0, 15);
console.log('  KIND              CALLS  AVG     TOTAL   WHERE');
console.log('  ─────────────────┼──────┼───────┼───────┼──────────────────────');
for (const s of repeaters) {
  console.log(`  ${s.kind.padEnd(17)}│${String(s.count).padStart(5)} │${us(s.dur / s.count).padStart(6)} │${us(s.dur).padStart(6)} │ ${s.fn.slice(0, 40)} ${s.loc}`.slice(0, 200));
}

/* ── 7. Per-frame timeline ─────────────────────────────────────────────── */
// Use BeginFrame / DrawFrame events to find frame boundaries on the main thread.
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(' FRAMES > 16ms (the spikes you saw)     ');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Approach: walk RunTask events on the renderer main thread. Each gap between
// successive RunTask completion times represents the renderer being idle (or
// painting/compositing in another phase). Frame duration ≈ ts of one frame
// boundary to the next.
//
// Simpler proxy: any RunTask > 16ms IS a frame stall, by definition (browser
// blocks compositing during the task).
const taskFrames = (byName.get('RunTask') || []).filter(isMain).filter(e => (e.dur || 0) > 16_000);
taskFrames.sort((a, b) => (b.dur || 0) - (a.dur || 0));
console.log(`tasks > 16ms (stalled at least one frame): ${taskFrames.length}\n`);

for (const f of taskFrames.slice(0, 25)) {
  const tStart = f.ts;
  const tEnd = f.ts + f.dur;
  const inside = mainEvents.filter(e =>
    e.ts >= tStart && e.ts < tEnd && e.ph === 'X' && e !== f &&
    typeof e.dur === 'number' && e.dur > 500
  );
  const agg = new Map();
  for (const e of inside) {
    const k = e.name;
    if (!agg.has(k)) agg.set(k, { count: 0, dur: 0 });
    const a = agg.get(k);
    a.count++;
    a.dur += e.dur;
  }
  const top = [...agg.entries()].sort((a, b) => b[1].dur - a[1].dur).slice(0, 4);
  const summary = top.map(([n, a]) => `${n}×${a.count}=${us(a.dur)}`).join('  ');
  const tsMs = ((f.ts || 0) / 1000).toFixed(0);
  console.log(`  ${us(f.dur).padStart(8)} @ ${tsMs.padStart(6)}ms  ${summary}`);
}

/* ── Side panel: all distinct event names by total time ────────────────── */
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(' ALL EVENT KINDS (top 25 by total time) ');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  NAME                                          COUNT       TOTAL');
console.log('  ─────────────────────────────────────────────┼────────┼─────────');
for (const s of nameStats.slice(0, 25)) {
  console.log(`  ${s.name.padEnd(45)}│${String(s.count).padStart(7)} │${us(s.totalUs).padStart(8)}`);
}

console.log('\n[analyze] done. Open the raw trace in chrome://tracing for visual inspection.');
