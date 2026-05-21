#!/usr/bin/env node
/**
 * Spike inspector: take a trace + a target timestamp window, dump
 * EVERY event in that window with full context — name, args, JS stack,
 * data — so we can see exactly what happened around a known spike.
 *
 * Usage:
 *   node scripts/perf-trace-spike.mjs <trace.json> <ts_us> [--window 200]
 *   ts_us is the absolute timestamp in microseconds (from `ts` field).
 *   --window <ms> is the half-window in milliseconds (default 200).
 */

import { readFileSync } from 'node:fs';
import { argv } from 'node:process';

const inputPath = argv[2];
const targetTs = Number(argv[3]);
const windowMs = Number((() => {
  const i = argv.indexOf('--window');
  return i !== -1 ? argv[i + 1] : '200';
})());
if (!inputPath || !Number.isFinite(targetTs)) {
  console.error('usage: node scripts/perf-trace-spike.mjs <trace.json> <ts_us> [--window 200]');
  process.exit(1);
}

console.log(`[spike] loading ${inputPath} ...`);
const trace = JSON.parse(readFileSync(inputPath, 'utf8'));
const events = trace.traceEvents || [];

const lo = targetTs - windowMs * 1000;
const hi = targetTs + windowMs * 1000;
const inWindow = events.filter(e => typeof e.ts === 'number' && e.ts >= lo && e.ts <= hi);
console.log(`[spike] window [${lo}, ${hi}] (${windowMs}ms half-window)`);
console.log(`[spike] ${inWindow.length} events in window`);

// Identify renderer-main thread
const threadNameById = new Map();
for (const e of events) {
  if (e.name === 'thread_name' && e.args?.name) {
    threadNameById.set(`${e.pid}/${e.tid}`, e.args.name);
  }
}
const mainTids = new Set();
for (const [k, name] of threadNameById) if (name === 'CrRendererMain') mainTids.add(k);
const isMain = (e) => mainTids.has(`${e.pid}/${e.tid}`);

// Sort by ts, then by dur desc so top-level events come first.
const mainInWindow = inWindow.filter(isMain).sort((a, b) => a.ts - b.ts || (b.dur || 0) - (a.dur || 0));

console.log('\n──── main-thread events in window (ts | dur | name | summary) ────');
for (const e of mainInWindow.slice(0, 200)) {
  const offset = ((e.ts - targetTs) / 1000).toFixed(2);
  const dur = typeof e.dur === 'number' ? `${(e.dur / 1000).toFixed(2)}ms` : '-';
  let summary = '';
  if (e.args?.data) {
    const d = e.args.data;
    if (d.url) summary += ` url=${shortUrl(d.url)}`;
    if (d.functionName) summary += ` fn=${d.functionName}`;
    if (d.lineNumber !== undefined) summary += `:${d.lineNumber}`;
    if (d.elementCount !== undefined) summary += ` n=${d.elementCount}`;
    if (d.reason) summary += ` reason=${d.reason}`;
    if (d.nodeName) summary += ` node=${d.nodeName}`;
    if (d.selectorPart) summary += ` sel="${d.selectorPart}"`;
    if (d.type) summary += ` type=${d.type}`;
    if (d.dirtyObjects !== undefined) summary += ` dirty=${d.dirtyObjects}`;
    if (d.partialLayout !== undefined) summary += ` partial=${d.partialLayout}`;
  }
  if (e.args?.beginData) {
    const b = e.args.beginData;
    if (b.dirtyObjects !== undefined) summary += ` dirty=${b.dirtyObjects}`;
    if (b.partialLayout !== undefined) summary += ` partial=${b.partialLayout}`;
  }
  console.log(`  ${offset.padStart(8)}ms  ${dur.padStart(8)}  ${e.name.padEnd(40)} ${summary}`.slice(0, 250));
}

function shortUrl(u) {
  if (!u) return '';
  return u.replace(/^https?:\/\/[^/]+/, '').replace(/^\/+/, '').slice(0, 50);
}
