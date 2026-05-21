/**
 * PerfHUD — floating performance overlay for dev/debug.
 *
 * Activate by appending `?perf=1` to the URL. Sticky via localStorage; turn off
 * with `?perf=0`.
 *
 * Shows:
 *   • Median FPS over the last second (and p1 — the slowest frame in window)
 *   • Frame-time histogram (last 120 frames)
 *   • Long-task counter (PerformanceObserver, tasks > 50ms)
 *   • Live WebGL context count + per-component GPU time
 *   • Current effective DPR (getDPRCap)
 *
 * Never imported in production code paths unless the flag is on, but even the
 * worst case is a few hundred bytes of JS and a single rAF loop — fine.
 */

import { useEffect, useRef, useState } from 'react';
import {
  isPerfHudEnabled,
  snapshotContexts,
} from './perfRegistry';
import { getDPRCap } from '../core/perf';

const FRAME_WINDOW = 120;            // samples kept in the histogram
const REPORT_INTERVAL_MS = 250;      // how often we refresh the displayed numbers

export default function PerfHUD() {
  const enabled = isPerfHudEnabled();
  const [, force] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Frame samples: rolling buffer of frame durations in ms.
  const framesRef = useRef<number[]>([]);
  const lastTRef = useRef<number>(0);
  const longTasksRef = useRef<number>(0);
  const displayRef = useRef({ median: 0, p1: 0, longTasks: 0, sample: 0 });

  // rAF loop — runs only when enabled.
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let lastReport = 0;
    lastTRef.current = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = now - lastTRef.current;
      lastTRef.current = now;
      if (dt > 0 && dt < 1000) {
        const arr = framesRef.current;
        arr.push(dt);
        if (arr.length > FRAME_WINDOW) arr.shift();
      }
      if (now - lastReport >= REPORT_INTERVAL_MS) {
        lastReport = now;
        const arr = framesRef.current.slice().sort((a, b) => a - b);
        if (arr.length > 0) {
          const median = arr[Math.floor(arr.length / 2)];
          const p1 = arr[arr.length - 1]; // worst frame
          displayRef.current = {
            median: median > 0 ? 1000 / median : 0,
            p1: p1 > 0 ? 1000 / p1 : 0,
            longTasks: longTasksRef.current,
            sample: displayRef.current.sample + 1,
          };
          force((n) => n + 1);
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  // Long-task observer.
  useEffect(() => {
    if (!enabled) return;
    if (typeof PerformanceObserver === 'undefined') return;
    try {
      const obs = new PerformanceObserver((list) => {
        longTasksRef.current += list.getEntries().length;
      });
      obs.observe({ entryTypes: ['longtask'] });
      return () => obs.disconnect();
    } catch {
      return;
    }
  }, [enabled]);

  // Note: we don't subscribe to the perf registry — the FPS report tick above
  // already triggers a re-render every ~250ms, which is plenty of refresh
  // latency for context-list updates. Polling avoids the "setState during
  // render" hazard that synchronous notifications introduce.

  if (!enabled) return null;

  const contexts = snapshotContexts();
  const live = contexts.filter((c) => c.visible).length;
  const dpr = typeof window !== 'undefined' ? getDPRCap() : 1;
  const { median, p1, longTasks } = displayRef.current;

  const fpsColor =
    median >= 58 ? '#7fdc8a' : median >= 45 ? '#f0c674' : median >= 30 ? '#d77878' : '#d04040';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 8,
        right: 8,
        zIndex: 99999,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: 11,
        lineHeight: 1.35,
        background: 'rgba(8, 8, 10, 0.82)',
        color: '#d4d4d4',
        padding: '8px 10px',
        borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(6px)',
        minWidth: 230,
        maxWidth: 280,
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontWeight: 700, letterSpacing: 0.5, fontSize: 10, color: '#9a9a9a' }}>
          PERF · ?perf=0 to hide
        </span>
      </div>

      <Row label="FPS (med)">
        <span style={{ color: fpsColor, fontWeight: 700 }}>{median.toFixed(0)}</span>
        <span style={{ color: '#6a6a6a', marginLeft: 4 }}>· p1 {p1.toFixed(0)}</span>
      </Row>
      <FrameBar frames={framesRef.current} />
      <Row label="Long tasks">{longTasks}</Row>
      <Row label="WebGL ctx">
        {live} live <span style={{ color: '#6a6a6a' }}>/ {contexts.length} reg</span>
      </Row>
      <Row label="DPR cap">{dpr.toFixed(2)}</Row>

      {contexts.length > 0 && (
        <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {contexts
            .slice()
            .sort((a, b) => Number(b.visible) - Number(a.visible) || a.label.localeCompare(b.label))
            .slice(0, 12)
            .map((c) => {
              const avg = c.gpuTimings.length
                ? c.gpuTimings.reduce((s, x) => s + x, 0) / c.gpuTimings.length
                : 0;
              return (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: c.visible ? '#d4d4d4' : '#5a5a5a',
                  }}
                >
                  <span>
                    {c.visible ? '●' : '○'} {c.label}
                  </span>
                  <span style={{ color: avg > 4 ? '#d77878' : avg > 1.5 ? '#f0c674' : '#7fdc8a' }}>
                    {avg > 0 ? `${avg.toFixed(2)} ms` : '—'}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a8a8a8' }}>
      <span style={{ color: '#6a6a6a' }}>{label}</span>
      <span>{children}</span>
    </div>
  );
}

function FrameBar({ frames }: { frames: number[] }) {
  // Simple inline canvas-free bar — each frame is one bar, height proportional to ms.
  // Red over 33ms (≈30fps), yellow over 20ms (≈50fps), green otherwise.
  const max = 50; // ms, anything above gets clipped
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        height: 24,
        gap: 1,
        margin: '4px 0 6px',
        background: 'rgba(255,255,255,0.04)',
        padding: 2,
        borderRadius: 3,
      }}
    >
      {frames.slice(-FRAME_WINDOW).map((ms, i) => {
        const h = Math.min(20, (ms / max) * 20);
        const color = ms > 33 ? '#d04040' : ms > 20 ? '#f0c674' : '#7fdc8a';
        return (
          <div
            key={i}
            style={{
              width: 2,
              height: Math.max(1, h),
              background: color,
              opacity: 0.85,
            }}
          />
        );
      })}
    </div>
  );
}
