#!/usr/bin/env node
/**
 * DEEP Chromium trace analyzer.
 *
 * Goes far past the surface-level "long tasks" summary. Extracts:
 *
 *   A. Style invalidation tracking — for each ScheduleStyleInvalidationTracking
 *      and StyleRecalcInvalidationTracking event, WHO triggered it (JS line +
 *      reason + affected nodes).
 *   B. Forced synchronous reflows — Layout events that ran INSIDE a JS task,
 *      with the JS callsite that caused the forced read.
 *   C. Per-phase breakdown — split the timeline into cold-load / settle / scroll,
 *      report cost per phase.
 *   D. Per-frame walk during scroll — every frame's anatomy: layout/style/paint/js.
 *   E. Event handler costs — per event type (mousemove, scroll, wheel...).
 *   F. WebGL command stats — count of each gl call, identify redundant state.
 *   G. GC events — count + total time spent in MinorGC / MajorGC.
 *   H. Idle gaps — periods where the main thread did nothing.
 *   I. Recurring intervals — detect periodic patterns (60Hz rAF, setIntervals).
 *   J. JS callsite hot list grouped by file:line, with calls/sec.
 *   K. Long animation frames — periods where compositor couldn't draw a frame.
 *   L. Layout-thrash chains — groups of N>=3 layouts in a 50ms window with
 *      the JS that caused each.
 *
 * Usage:
 *   node scripts/perf-trace-deep.mjs <trace.json> [--phase scroll]
 */

import { readFileSync } from 'node:fs';
import { argv } from 'node:process';

const inputPath = argv[2];
if (!inputPath) {
  console.error('usage: node scripts/perf-trace-deep.mjs <trace.json> [--phase cold|settle|scroll|all]');
  process.exit(1);
}
const PHASE = (() => {
  const i = argv.indexOf('--phase');
  return i !== -1 ? argv[i + 1] : 'all';
})();

console.log(`[deep] loading ${inputPath} (phase filter: ${PHASE}) ...`);
const trace = JSON.parse(readFileSync(inputPath, 'utf8'));
const events = trace.traceEvents || [];
console.log(`[deep] ${events.length} events`);

/* ── Helpers ───────────────────────────────────────────────────────────── */
function us(n) { return `${(n / 1000).toFixed(1)}ms`; }
function pct(n, of) { return of > 0 ? `${((n / of) * 100).toFixed(1)}%` : '?'; }
function shortUrl(u) {
  if (!u) return '';
  return u.replace(/^https?:\/\/[^/]+/, '').replace(/^\/+/, '').slice(0, 80);
}
function shortFn(fn) {
  if (!fn) return '<anon>';
  return fn.length > 50 ? fn.slice(0, 47) + '...' : fn;
}

/* ── Identify renderer-main thread(s) ──────────────────────────────────── */
const threadNameById = new Map();
for (const e of events) {
  if (e.name === 'thread_name' && e.args?.name) {
    threadNameById.set(`${e.pid}/${e.tid}`, e.args.name);
  }
}
const mainTids = new Set();
const gpuTids = new Set();
const compositorTids = new Set();
const workerTids = new Set();
for (const [k, name] of threadNameById) {
  if (name === 'CrRendererMain') mainTids.add(k);
  else if (name === 'CrGpuMain' || name === 'GpuMain') gpuTids.add(k);
  else if (name?.includes('Compositor')) compositorTids.add(k);
  else if (name?.includes('Worker')) workerTids.add(k);
}
const isMain = (e) => mainTids.has(`${e.pid}/${e.tid}`);

/* ── Timeline phases ───────────────────────────────────────────────────── */
// Define cold-load = up to first 'PageLoad' or load event; settle = next 1s;
// scroll = remaining time. If we can't find these markers, approximate.
const navStart = events.find(e => e.name === 'navigationStart')?.ts ?? 0;
const loadEnd = events.find(e => e.name === 'loadEventEnd' || e.name === 'MarkLoad')?.ts;
const firstFrame = events.find(e => e.name === 'firstContentfulPaint')?.ts ?? 0;

// Iterate rather than spread — half a million events overflows the call stack.
let tsMin = Infinity, tsMax = -Infinity;
for (const e of events) {
  if (typeof e.ts !== 'number') continue;
  if (e.ts < tsMin) tsMin = e.ts;
  const end = e.ts + (e.dur || 0);
  if (end > tsMax) tsMax = end;
}
const totalDurUs = tsMax - tsMin;

// Find first scroll event to mark scroll-phase start.
const firstScrollEvent = events.find(e =>
  isMain(e) && (e.name === 'ScrollEvent' || e.name === 'ScrollUpdate' || e.name === 'EventDispatch'
    && e.args?.data?.type?.includes('scroll'))
);
let scrollStartTs = firstScrollEvent?.ts ?? null;
// Fallback: find first place where window.scrollY changed by looking for
// large bursts of work after a 1s+ idle.
if (!scrollStartTs && loadEnd) scrollStartTs = loadEnd + 4_000_000; // +4s after load

const phases = {
  cold:   { tsStart: tsMin,         tsEnd: loadEnd ?? (tsMin + 4_000_000) },
  settle: { tsStart: loadEnd ?? (tsMin + 4_000_000), tsEnd: scrollStartTs ?? (tsMin + 5_000_000) },
  scroll: { tsStart: scrollStartTs ?? (tsMin + 5_000_000), tsEnd: tsMax },
};
console.log(`[deep] phases (ms from trace start):`);
console.log(`        cold:   0 → ${((phases.cold.tsEnd - tsMin) / 1000).toFixed(0)}`);
console.log(`        settle: ${((phases.settle.tsStart - tsMin) / 1000).toFixed(0)} → ${((phases.settle.tsEnd - tsMin) / 1000).toFixed(0)}`);
console.log(`        scroll: ${((phases.scroll.tsStart - tsMin) / 1000).toFixed(0)} → ${((phases.scroll.tsEnd - tsMin) / 1000).toFixed(0)}`);

function inPhase(e) {
  if (PHASE === 'all') return true;
  const p = phases[PHASE];
  if (!p) return true;
  return e.ts >= p.tsStart && e.ts < p.tsEnd;
}
function phaseOf(ts) {
  if (ts < phases.cold.tsEnd) return 'cold';
  if (ts < phases.settle.tsEnd) return 'settle';
  return 'scroll';
}

const filtered = events.filter(e => isMain(e) && inPhase(e));
console.log(`[deep] ${filtered.length} renderer-main events after phase filter`);

/* ── (A) Style invalidation tracking ──────────────────────────────────── */
section('A. STYLE INVALIDATION SOURCES');

// Categories of invalidation events to look for. Names depend on Chrome
// version — we try a few.
const invalidateNames = [
  'ScheduleStyleInvalidationTracking',
  'StyleInvalidatorInvalidationTracking',
  'StyleRecalcInvalidationTracking',
  'InvalidationTracking',
  'LayoutInvalidationTracking',
];
const invalidations = filtered.filter(e => invalidateNames.includes(e.name));
console.log(`  total invalidation events: ${invalidations.length}`);

// Aggregate by reason+selector.
const invAgg = new Map();
for (const e of invalidations) {
  const d = e.args?.data || {};
  const reason = d.reason || d.invalidationSet || '?';
  const nodeName = d.nodeName || d.target?.nodeName || '?';
  const selector = d.selectorPart || d.invalidatedSelectorId || '';
  const url = d.stackTrace?.[0]?.url ? shortUrl(d.stackTrace[0].url) : '';
  const line = d.stackTrace?.[0]?.lineNumber ?? '';
  const fn = d.stackTrace?.[0]?.functionName ?? '';
  const key = `${e.name}|${reason}|${nodeName}|${selector}|${url}:${line}|${fn}`;
  if (!invAgg.has(key)) invAgg.set(key, { kind: e.name, reason, nodeName, selector, url, line, fn, count: 0 });
  invAgg.get(key).count++;
}
const invTop = [...invAgg.values()].sort((a, b) => b.count - a.count).slice(0, 25);
console.log(`  top 25 invalidation patterns:`);
console.log(`  KIND                          COUNT  REASON         NODE     SELECTOR / WHERE`);
console.log(`  ─────────────────────────────┼──────┼──────────────┼────────┼─────────────────────────────`);
for (const r of invTop) {
  const where = r.url ? `${r.url}:${r.line} ${r.fn}` : '';
  console.log(`  ${r.kind.padEnd(30)}│${String(r.count).padStart(5)} │ ${(r.reason || '').slice(0, 13).padEnd(13)}│ ${(r.nodeName || '').slice(0, 7).padEnd(7)}│ ${(r.selector || '').slice(0, 25).padEnd(25)} ${where}`.slice(0, 220));
}

/* ── (B) Forced synchronous reflows ────────────────────────────────────── */
section('B. FORCED SYNCHRONOUS REFLOWS (Layout inside FunctionCall)');

// Build a quick interval tree on FunctionCall events (their time ranges).
const funcCalls = filtered.filter(e => e.name === 'FunctionCall' && typeof e.dur === 'number')
  .sort((a, b) => a.ts - b.ts);
const layoutsAll = filtered.filter(e => e.name === 'Layout' && typeof e.dur === 'number');

// For each Layout, find the deepest FunctionCall that fully contains it.
const forced = [];
for (const lay of layoutsAll) {
  let containing = null;
  for (const fc of funcCalls) {
    if (fc.ts > lay.ts) break;
    if (fc.ts <= lay.ts && fc.ts + fc.dur >= lay.ts + lay.dur) {
      if (!containing || fc.dur < containing.dur) containing = fc; // deepest = smallest
    }
  }
  if (containing) {
    const d = containing.args?.data || {};
    forced.push({
      layMs: lay.dur / 1000,
      url: shortUrl(d.url || ''),
      line: d.lineNumber ?? '?',
      fn: d.functionName || '<anon>',
    });
  }
}
const forcedAgg = new Map();
for (const f of forced) {
  const k = `${f.fn}|${f.url}:${f.line}`;
  if (!forcedAgg.has(k)) forcedAgg.set(k, { fn: f.fn, url: f.url, line: f.line, count: 0, totalMs: 0, maxMs: 0 });
  const a = forcedAgg.get(k);
  a.count++;
  a.totalMs += f.layMs;
  a.maxMs = Math.max(a.maxMs, f.layMs);
}
const forcedTop = [...forcedAgg.values()].sort((a, b) => b.totalMs - a.totalMs).slice(0, 20);
console.log(`  total forced reflows: ${forced.length}`);
console.log(`  top callsites by total layout time:`);
console.log(`  COUNT  TOTAL    MAX     WHERE`);
console.log(`  ──────┼────────┼───────┼─────────────────────────────────────────`);
for (const r of forcedTop) {
  console.log(`  ${String(r.count).padStart(5)} │${us(r.totalMs * 1000).padStart(7)} │${us(r.maxMs * 1000).padStart(6)} │ ${shortFn(r.fn)}  ${r.url}:${r.line}`.slice(0, 220));
}

/* ── (C) Per-phase breakdown ───────────────────────────────────────────── */
section('C. PER-PHASE BREAKDOWN (cold / settle / scroll)');

const phaseTotals = { cold: {}, settle: {}, scroll: {} };
function accum(ph, k, dur) {
  if (!phaseTotals[ph][k]) phaseTotals[ph][k] = { count: 0, dur: 0 };
  phaseTotals[ph][k].count++;
  phaseTotals[ph][k].dur += dur;
}
for (const e of events.filter(isMain)) {
  if (e.ph !== 'X' || typeof e.dur !== 'number') continue;
  const ph = phaseOf(e.ts);
  accum(ph, e.name, e.dur);
}
const interestingKinds = [
  'Layout', 'UpdateLayoutTree', 'Paint', 'RasterTask', 'CompositeLayers',
  'FunctionCall', 'EvaluateScript', 'MinorGC', 'MajorGC',
  'EventDispatch', 'FireAnimationFrame', 'RunTask',
];
console.log(`  KIND                       COLD            SETTLE          SCROLL`);
console.log(`  ──────────────────────────┼───────────────┼───────────────┼───────────────`);
for (const k of interestingKinds) {
  const c = phaseTotals.cold[k] || { count: 0, dur: 0 };
  const s = phaseTotals.settle[k] || { count: 0, dur: 0 };
  const r = phaseTotals.scroll[k] || { count: 0, dur: 0 };
  const fmt = (x) => `${String(x.count).padStart(5)}×${us(x.dur).padStart(8)}`;
  console.log(`  ${k.padEnd(26)}│ ${fmt(c)} │ ${fmt(s)} │ ${fmt(r)}`);
}

/* ── (D) Per-frame walk during scroll ──────────────────────────────────── */
section('D. SCROLL-PHASE FRAME WALK (frames > 16ms only)');

const scrollEvents = events.filter(e => isMain(e) && e.ts >= phases.scroll.tsStart && e.ts < phases.scroll.tsEnd && e.ph === 'X');
const scrollTasks = scrollEvents.filter(e => e.name === 'RunTask' && (e.dur || 0) > 16_000).sort((a, b) => a.ts - b.ts);
console.log(`  tasks > 16ms during scroll: ${scrollTasks.length}`);
console.log(`  total scroll-phase main-thread time: ${us(scrollEvents.filter(e => e.name === 'RunTask').reduce((s, e) => s + (e.dur || 0), 0))}\n`);

// For each scroll task, sum children by name.
for (const t of scrollTasks.slice(0, 40)) {
  const inside = scrollEvents.filter(e => e !== t && e.ts >= t.ts && e.ts + (e.dur || 0) <= t.ts + t.dur && (e.dur || 0) > 1000);
  const agg = new Map();
  for (const e of inside) {
    if (!agg.has(e.name)) agg.set(e.name, { count: 0, dur: 0 });
    const a = agg.get(e.name);
    a.count++;
    a.dur += e.dur;
  }
  const top = [...agg.entries()].sort((a, b) => b[1].dur - a[1].dur).slice(0, 4);
  const summary = top.map(([n, a]) => `${n}×${a.count}=${us(a.dur)}`).join('  ');
  const rel = ((t.ts - phases.scroll.tsStart) / 1000).toFixed(0);
  console.log(`  ${us(t.dur).padStart(7)} @ scroll+${rel.padStart(5)}ms  ${summary}`);
}

/* ── (E) Event handler costs by event type ─────────────────────────────── */
section('E. EVENT HANDLER COSTS');

const dispatches = filtered.filter(e => e.name === 'EventDispatch' && typeof e.dur === 'number');
const evAgg = new Map();
for (const e of dispatches) {
  const type = e.args?.data?.type || 'unknown';
  if (!evAgg.has(type)) evAgg.set(type, { count: 0, dur: 0, max: 0 });
  const a = evAgg.get(type);
  a.count++;
  a.dur += e.dur;
  a.max = Math.max(a.max, e.dur);
}
console.log(`  TYPE              COUNT    TOTAL     AVG      MAX`);
console.log(`  ─────────────────┼────────┼─────────┼────────┼────────`);
for (const [type, a] of [...evAgg.entries()].sort((x, y) => y[1].dur - x[1].dur).slice(0, 20)) {
  console.log(`  ${type.padEnd(17)}│${String(a.count).padStart(7)} │${us(a.dur).padStart(8)} │${us(a.dur / a.count).padStart(7)} │${us(a.max).padStart(7)}`);
}

/* ── (F) WebGL command stats ───────────────────────────────────────────── */
section('F. WEBGL COMMAND STATS');

// WebGL commands show up in trace as e.name === 'gl' or specific call names
// under args.gl_call. Different Chrome versions vary; we collect everything
// whose category includes 'gpu' or 'angle'.
const glCalls = events.filter(e => (e.cat || '').includes('gpu') || e.name?.startsWith('gl') || e.name?.startsWith('GL'));
console.log(`  total gpu/gl events: ${glCalls.length}`);
const glByName = new Map();
for (const e of glCalls) {
  const k = e.name;
  if (!glByName.has(k)) glByName.set(k, { count: 0, dur: 0 });
  const a = glByName.get(k);
  a.count++;
  a.dur += e.dur || 0;
}
const glTop = [...glByName.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, 25);
console.log(`  top 25 by count:`);
for (const [n, a] of glTop) {
  console.log(`    ${String(a.count).padStart(7)}× ${n.padEnd(40)} total ${us(a.dur)}`);
}

/* ── (G) GC events ─────────────────────────────────────────────────────── */
section('G. GARBAGE COLLECTION');

const gcs = filtered.filter(e =>
  e.name === 'MinorGC' || e.name === 'MajorGC' ||
  e.name === 'V8.GCScavenger' || e.name === 'V8.GCMarkSweep' || e.name === 'V8.GCFinalize'
);
const gcAgg = new Map();
for (const e of gcs) {
  if (!gcAgg.has(e.name)) gcAgg.set(e.name, { count: 0, dur: 0, max: 0 });
  const a = gcAgg.get(e.name);
  a.count++;
  a.dur += e.dur || 0;
  a.max = Math.max(a.max, e.dur || 0);
}
console.log(`  KIND             COUNT    TOTAL     MAX`);
console.log(`  ────────────────┼────────┼─────────┼────────`);
for (const [n, a] of [...gcAgg.entries()].sort((x, y) => y[1].dur - x[1].dur)) {
  console.log(`  ${n.padEnd(16)}│${String(a.count).padStart(7)} │${us(a.dur).padStart(8)} │${us(a.max).padStart(7)}`);
}

/* ── (H) Idle gaps ─────────────────────────────────────────────────────── */
section('H. IDLE GAPS (main thread idle > 100ms)');

const runTasks = filtered.filter(e => e.name === 'RunTask' && typeof e.dur === 'number').sort((a, b) => a.ts - b.ts);
const gaps = [];
for (let i = 1; i < runTasks.length; i++) {
  const prev = runTasks[i - 1];
  const next = runTasks[i];
  const prevEnd = prev.ts + prev.dur;
  const gap = next.ts - prevEnd;
  if (gap > 100_000) gaps.push({ ts: prevEnd, gap, after: prev.name, before: next.name });
}
console.log(`  gaps > 100ms: ${gaps.length}`);
for (const g of gaps.sort((a, b) => b.gap - a.gap).slice(0, 10)) {
  console.log(`    ${us(g.gap).padStart(8)} idle @ ${((g.ts - tsMin) / 1000).toFixed(0)}ms`);
}

/* ── (I) Recurring intervals (rAF / setInterval-like patterns) ─────────── */
section('I. RECURRING INTERVALS (periodic patterns)');

// For each FunctionCall callsite that fires >= 30 times, compute median delta
// between fires. Tight median = periodic source (rAF, setInterval).
const fcSites = new Map();
for (const e of funcCalls) {
  const d = e.args?.data || {};
  const fn = d.functionName || '<anon>';
  const url = shortUrl(d.url || '');
  const line = d.lineNumber ?? '?';
  const k = `${fn}|${url}:${line}`;
  if (!fcSites.has(k)) fcSites.set(k, { fn, url, line, fires: [], totalDur: 0 });
  fcSites.get(k).fires.push(e.ts);
  fcSites.get(k).totalDur += e.dur || 0;
}
const periodic = [];
for (const [k, s] of fcSites) {
  if (s.fires.length < 30) continue;
  s.fires.sort((a, b) => a - b);
  const deltas = [];
  for (let i = 1; i < s.fires.length; i++) deltas.push(s.fires[i] - s.fires[i - 1]);
  deltas.sort((a, b) => a - b);
  const medianDelta = deltas[Math.floor(deltas.length / 2)];
  periodic.push({ ...s, count: s.fires.length, medianDeltaMs: medianDelta / 1000, hz: 1_000_000 / medianDelta });
}
console.log(`  callsites firing >=30 times:`);
console.log(`  HZ      DELTA    COUNT    TOTAL    WHERE`);
console.log(`  ───────┼────────┼────────┼────────┼─────────────────────────────`);
for (const p of periodic.sort((a, b) => b.totalDur - a.totalDur).slice(0, 20)) {
  console.log(`  ${p.hz.toFixed(1).padStart(6)} │${(`${p.medianDeltaMs.toFixed(1)}ms`).padStart(7)} │${String(p.count).padStart(7)} │${us(p.totalDur).padStart(7)} │ ${shortFn(p.fn)} ${p.url}:${p.line}`.slice(0, 220));
}

/* ── (J) JS callsite hot list grouped by file:line ─────────────────────── */
section('J. JS CALLSITES BY TIME (file:line aggregated)');

const callSiteAgg = new Map();
for (const e of funcCalls) {
  const d = e.args?.data || {};
  const url = shortUrl(d.url || '');
  const line = d.lineNumber ?? '?';
  const fn = d.functionName || '<anon>';
  const k = `${url}:${line}`;
  if (!callSiteAgg.has(k)) callSiteAgg.set(k, { url, line, fnSet: new Set(), count: 0, dur: 0 });
  const a = callSiteAgg.get(k);
  a.fnSet.add(fn);
  a.count++;
  a.dur += e.dur || 0;
}
const callSiteTop = [...callSiteAgg.values()].sort((a, b) => b.dur - a.dur).slice(0, 25);
console.log(`  TOTAL    COUNT  WHERE                                                       FNs`);
console.log(`  ────────┼──────┼────────────────────────────────────────────────────────────┼─────`);
for (const c of callSiteTop) {
  console.log(`  ${us(c.dur).padStart(7)} │${String(c.count).padStart(5)} │ ${(c.url + ':' + c.line).slice(0, 58).padEnd(58)} │ ${[...c.fnSet].slice(0, 3).join(', ').slice(0, 60)}`);
}

/* ── (K) Long animation frames ─────────────────────────────────────────── */
section('K. ANIMATION FRAMES (rAF callback durations)');

const rafs = filtered.filter(e => e.name === 'FireAnimationFrame' && typeof e.dur === 'number');
rafs.sort((a, b) => (b.dur || 0) - (a.dur || 0));
console.log(`  total rAF callbacks: ${rafs.length}`);
console.log(`  total time in rAF callbacks: ${us(rafs.reduce((s, e) => s + (e.dur || 0), 0))}`);
console.log(`  longest 10:`);
for (const r of rafs.slice(0, 10)) {
  console.log(`    ${us(r.dur).padStart(7)} @ +${((r.ts - tsMin) / 1000).toFixed(0)}ms`);
}

/* ── (L) Layout-thrash chains ──────────────────────────────────────────── */
section('L. LAYOUT THRASH CHAINS (≥3 layouts in a 50ms window)');

const layoutsSorted = layoutsAll.slice().sort((a, b) => a.ts - b.ts);
const chains = [];
for (let i = 0; i < layoutsSorted.length; i++) {
  let j = i;
  while (j < layoutsSorted.length && layoutsSorted[j].ts - layoutsSorted[i].ts <= 50_000) j++;
  const chainLen = j - i;
  if (chainLen >= 3) {
    chains.push({
      tsStart: layoutsSorted[i].ts,
      tsEnd: layoutsSorted[j - 1].ts + (layoutsSorted[j - 1].dur || 0),
      count: chainLen,
      totalDur: layoutsSorted.slice(i, j).reduce((s, l) => s + (l.dur || 0), 0),
    });
    i = j - 1;
  }
}
console.log(`  chains found: ${chains.length}`);
for (const c of chains.sort((a, b) => b.totalDur - a.totalDur).slice(0, 15)) {
  console.log(`    @ +${((c.tsStart - tsMin) / 1000).toFixed(0)}ms  ${c.count} layouts in ${us(c.tsEnd - c.tsStart)}, total layout time ${us(c.totalDur)}`);
}

console.log('\n[deep] done.');

/* ── tiny formatting helper ────────────────────────────────────────────── */
function section(title) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(` ${title}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}
