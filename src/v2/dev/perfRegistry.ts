/**
 * Performance instrumentation registry.
 *
 * Components that own a WebGL context register themselves here so the PerfHUD
 * can show:
 *  - how many WebGL contexts are alive RIGHT NOW
 *  - per-component GPU time (via EXT_disjoint_timer_query_webgl2 when supported)
 *  - which components are currently visible & rendering
 *
 * Everything is a no-op unless the dev flag is on (`?perf=1` or localStorage
 * `perf=1`). Production builds without the flag pay essentially zero cost: the
 * registry calls become trivial Map ops on a Map that nobody reads.
 *
 * The reason this is its own module: the GPU-timer state has to live outside
 * React because rAF loops read it on every frame, and we don't want to trigger
 * re-renders from inside the draw loop.
 */

import { useEffect, useLayoutEffect, useRef } from 'react';

/* ── Public flag ───────────────────────────────────────────────────────── */

let _enabled: boolean | null = null;
export function isPerfHudEnabled(): boolean {
  if (_enabled !== null) return _enabled;
  if (typeof window === 'undefined') return false;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get('perf') === '1') {
      _enabled = true;
      try { window.localStorage.setItem('perf', '1'); } catch { /* ignore */ }
      return true;
    }
    if (url.searchParams.get('perf') === '0') {
      _enabled = false;
      try { window.localStorage.removeItem('perf'); } catch { /* ignore */ }
      return false;
    }
    _enabled = window.localStorage?.getItem('perf') === '1';
  } catch {
    _enabled = false;
  }
  return _enabled;
}

/* ── Live WebGL context registry ───────────────────────────────────────── */

interface ContextRecord {
  id: number;
  label: string;
  /** Timestamp of last successful draw (performance.now()). */
  lastDrawAt: number;
  /** Rolling GPU-time samples in ms, oldest first. Max 60 samples. */
  gpuTimings: number[];
  /** Whether this component is currently visible / drawing. */
  visible: boolean;
}

const _contexts = new Map<number, ContextRecord>();
let _nextId = 1;

// Note: we deliberately do NOT expose a subscribe/notify API any more. The
// PerfHUD polls this registry on its own rAF report tick (~4 Hz, see
// PerfHUD.tsx). Synchronous notifications were causing "setState during
// render" warnings because component effects can register a context while
// React is still committing siblings. Polling sidesteps the problem entirely
// and 250ms latency on the HUD is invisible to humans.

export function registerContext(label: string): number {
  const id = _nextId++;
  _contexts.set(id, {
    id,
    label,
    lastDrawAt: 0,
    gpuTimings: [],
    visible: false,
  });
  return id;
}

export function unregisterContext(id: number): void {
  _contexts.delete(id);
}

export function markDraw(id: number, gpuMs?: number): void {
  const rec = _contexts.get(id);
  if (!rec) return;
  rec.lastDrawAt = performance.now();
  if (typeof gpuMs === 'number' && Number.isFinite(gpuMs)) {
    rec.gpuTimings.push(gpuMs);
    if (rec.gpuTimings.length > 60) rec.gpuTimings.shift();
  }
}

export function setVisible(id: number, visible: boolean): void {
  const rec = _contexts.get(id);
  if (!rec || rec.visible === visible) return;
  rec.visible = visible;
}

export function snapshotContexts(): ContextRecord[] {
  return Array.from(_contexts.values());
}

/* ── Renderer string (hardware vs software diagnosis) ──────────────────── */

let _rendererMain = '';
let _rendererWorker = '';

/** Read the WebGL renderer once from a throwaway context (cheap, cached). */
export function detectMainRenderer(): string {
  if (_rendererMain) return _rendererMain;
  if (typeof document === 'undefined') return '';
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) { _rendererMain = 'no-webgl'; return _rendererMain; }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    _rendererMain = ext
      ? String(gl.getParameter((ext as { UNMASKED_RENDERER_WEBGL: number }).UNMASKED_RENDERER_WEBGL))
      : String(gl.getParameter(gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    _rendererMain = 'error';
  }
  return _rendererMain;
}

export function setWorkerRenderer(s: string): void { _rendererWorker = s; }
export function getWorkerRenderer(): string { return _rendererWorker; }

/** True if a renderer string looks like a software rasterizer. */
export function isSoftwareRenderer(s: string): boolean {
  return /swiftshader|software|llvmpipe|microsoft basic|mesa offscreen/i.test(s || '');
}

/* ── GPU timer (EXT_disjoint_timer_query_webgl2) ───────────────────────── */

/**
 * Wrap a WebGL2 draw call with a GPU-time query.
 *
 * Usage:
 *   const timer = createGPUTimer(gl, contextId);
 *   ...
 *   timer.begin();
 *   gl.drawArrays(...);
 *   timer.end();
 *   timer.poll(); // call once per frame to drain ready queries
 *
 * If the extension is unavailable, begin/end/poll become no-ops and you still
 * get CPU-side timing via markDraw.
 *
 * Spec: https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/
 */
export interface GPUTimer {
  begin: () => void;
  end: () => void;
  poll: () => void;
  dispose: () => void;
}

export function createGPUTimer(
  gl: WebGL2RenderingContext | null,
  contextId: number,
): GPUTimer {
  if (!gl || !isPerfHudEnabled()) {
    return { begin: noop, end: noop, poll: noop, dispose: noop };
  }
  const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  if (!ext) {
    return { begin: noop, end: noop, poll: noop, dispose: noop };
  }

  const TIME_ELAPSED_EXT = 0x88BF;
  const GPU_DISJOINT_EXT = 0x8FBB;

  type Pending = { query: WebGLQuery };
  const pending: Pending[] = [];
  let active: Pending | null = null;

  const begin = () => {
    if (active) return; // can't nest
    const q = gl.createQuery();
    if (!q) return;
    gl.beginQuery(TIME_ELAPSED_EXT, q);
    active = { query: q };
  };

  const end = () => {
    if (!active) return;
    gl.endQuery(TIME_ELAPSED_EXT);
    pending.push(active);
    active = null;
  };

  const poll = () => {
    // Drain any completed queries. We only ever look at the oldest one per
    // frame — if backlog grows large, we drop intermediate samples (better
    // than blocking the main thread checking dozens of queries).
    const disjoint = gl.getParameter(GPU_DISJOINT_EXT);
    if (disjoint) {
      // GPU was disjointed — discard all pending samples, they're unreliable.
      for (const p of pending) gl.deleteQuery(p.query);
      pending.length = 0;
      return;
    }
    while (pending.length > 0) {
      const head = pending[0];
      const available = gl.getQueryParameter(head.query, gl.QUERY_RESULT_AVAILABLE);
      if (!available) break;
      const ns = gl.getQueryParameter(head.query, gl.QUERY_RESULT) as number;
      const ms = ns / 1_000_000;
      markDraw(contextId, ms);
      gl.deleteQuery(head.query);
      pending.shift();
    }
  };

  const dispose = () => {
    if (active) {
      gl.endQuery(TIME_ELAPSED_EXT);
      gl.deleteQuery(active.query);
      active = null;
    }
    for (const p of pending) gl.deleteQuery(p.query);
    pending.length = 0;
  };

  return { begin, end, poll, dispose };
}

function noop() {}

/* ── React helper: useGPUTimer ─────────────────────────────────────────── */

/**
 * Convenience hook for components that own a WebGL context. Registers a label,
 * returns a stable id + timer factory. Use from inside the effect that owns
 * the GL context:
 *
 *   const { id, makeTimer, setVisible: setVis } = useGPUTimer('Dither');
 *   useEffect(() => {
 *     const timer = makeTimer(gl);
 *     ...
 *     setVis(true);
 *     return () => { timer.dispose(); setVis(false); };
 *   }, []);
 */
export function useGPUTimer(label: string) {
  const idRef = useRef<number | null>(null);

  // Register in a layout effect, not during render. Two reasons:
  //   1) Mutating the registry mid-render is "side effect during render",
  //      which React flags as a violation under StrictMode + concurrent.
  //   2) useLayoutEffect runs synchronously after commit but BEFORE the
  //      paint, which means subsequent useEffects (e.g. the one that owns
  //      the GL context) read a populated idRef.
  useLayoutEffect(() => {
    if (!isPerfHudEnabled()) return;
    idRef.current = registerContext(label);
    return () => {
      if (idRef.current !== null) {
        unregisterContext(idRef.current);
        idRef.current = null;
      }
    };
  }, [label]);

  // Also clean up on unmount in case useLayoutEffect cleanup didn't fire
  // (it always does, but being defensive — the GL context could leak the
  // record otherwise).
  useEffect(() => () => {
    if (idRef.current !== null) {
      unregisterContext(idRef.current);
      idRef.current = null;
    }
  }, []);

  return {
    get id() { return idRef.current; },
    makeTimer: (gl: WebGL2RenderingContext | null): GPUTimer =>
      createGPUTimer(gl, idRef.current ?? -1),
    setVisible: (v: boolean) => {
      if (idRef.current !== null) setVisible(idRef.current, v);
    },
    markDraw: () => {
      if (idRef.current !== null) markDraw(idRef.current);
    },
  };
}
