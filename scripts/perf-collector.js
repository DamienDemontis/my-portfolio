/**
 * In-page perf collector — injected before any page script runs.
 *
 * Records, with high resolution timestamps:
 *   - Every frame's rAF interval (frames[])
 *   - Every `longtask` PerformanceEntry (longtasks[])
 *   - Every `layout-shift` entry — CLS sources (layoutShifts[])
 *   - Every `event` entry — Event Timing API (events[])
 *   - Every `paint` entry — FP/FCP
 *   - PerfHUD's "live" components every 250ms (hudSamples[])
 *   - Scroll position every frame (so we can map spikes → section)
 *
 * Why per-frame: the user sees yellow/red spikes — those are
 * INDIVIDUAL frames going long. We need per-frame data to identify them,
 * not aggregate FPS.
 *
 * All data buffered in window.__perf and dumped on demand by the harness.
 */

(() => {
  const perf = {
    startedAt: performance.now(),
    navigationStart: performance.timeOrigin,
    frames: [],            // { ts, dt, scrollY }
    longtasks: [],         // { ts, duration, attribution[] }
    layoutShifts: [],      // { ts, value, hadRecentInput, sources[] }
    events: [],            // { ts, duration, name, processingStart, processingEnd, target }
    paints: [],            // { ts, name }
    hudSamples: [],        // { ts, fpsMed, fpsP1, longTasksTotal, ctxLive, ctxReg, live: [{label, gpuMs}] }
    markers: [],           // user markers — e.g. "scroll_start", "scroll_end"
  };
  window.__perf = perf;

  /* ── rAF frame logger ─────────────────────────────────────────────────── */
  let lastT = performance.now();
  function tick(now) {
    const dt = now - lastT;
    lastT = now;
    perf.frames.push({
      ts: Math.round((now - perf.startedAt) * 100) / 100,
      dt: Math.round(dt * 100) / 100,
      scrollY: window.scrollY | 0,
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ── PerformanceObserver: longtask ────────────────────────────────────── */
  // longtask attribution gives us containerType/containerName/containerSrc.
  // The "container" is usually an iframe, but for top-level tasks it's the page.
  // Combined with the timestamp we can correlate to scroll position.
  if (typeof PerformanceObserver !== 'undefined') {
    try {
      const obs = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          const attribution = (e.attribution || []).map((a) => ({
            name: a.name,
            entryType: a.entryType,
            containerType: a.containerType,
            containerName: a.containerName,
            containerSrc: a.containerSrc,
            containerId: a.containerId,
          }));
          perf.longtasks.push({
            ts: Math.round((e.startTime - perf.startedAt + performance.timeOrigin - perf.navigationStart) * 100) / 100,
            startTime: Math.round(e.startTime * 100) / 100,
            duration: Math.round(e.duration * 100) / 100,
            attribution,
          });
        }
      });
      obs.observe({ entryTypes: ['longtask'] });
    } catch { /* not supported */ }

    /* ── layout-shift ───────────────────────────────────────────────────── */
    try {
      const obs = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          const sources = (e.sources || []).map((s) => ({
            node: s.node?.nodeName,
            nodeId: s.node?.id,
            nodeClass: s.node?.className,
            currentRect: s.currentRect && {
              x: s.currentRect.x | 0, y: s.currentRect.y | 0,
              w: s.currentRect.width | 0, h: s.currentRect.height | 0,
            },
            previousRect: s.previousRect && {
              x: s.previousRect.x | 0, y: s.previousRect.y | 0,
              w: s.previousRect.width | 0, h: s.previousRect.height | 0,
            },
          }));
          perf.layoutShifts.push({
            ts: Math.round(e.startTime * 100) / 100,
            value: Math.round(e.value * 10000) / 10000,
            hadRecentInput: !!e.hadRecentInput,
            sources,
          });
        }
      });
      obs.observe({ entryTypes: ['layout-shift'] });
    } catch { /* not supported */ }

    /* ── event timing (input latency) ───────────────────────────────────── */
    try {
      const obs = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          perf.events.push({
            ts: Math.round(e.startTime * 100) / 100,
            duration: Math.round(e.duration * 100) / 100,
            name: e.name,
            processingStart: Math.round((e.processingStart || 0) * 100) / 100,
            processingEnd: Math.round((e.processingEnd || 0) * 100) / 100,
            targetNode: e.target?.nodeName,
            targetId: e.target?.id,
          });
        }
      });
      obs.observe({ entryTypes: ['event'], durationThreshold: 16 });
    } catch { /* not supported */ }

    /* ── paint timing ──────────────────────────────────────────────────── */
    try {
      const obs = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          perf.paints.push({
            ts: Math.round(e.startTime * 100) / 100,
            name: e.name,
          });
        }
      });
      obs.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] });
    } catch { /* not supported */ }
  }

  /* ── HUD sampler ─────────────────────────────────────────────────────── */
  // Polls the PerfHUD every 250ms (same cadence it updates) to capture
  // per-component GPU times. Lets us correlate spikes to which WebGL
  // context was the most active at the time.
  function sampleHud() {
    const hud = document.querySelector('div[style*="z-index: 99999"]');
    if (hud) {
      const text = hud.innerText;
      const lookup = (label) => {
        const lines = text.split('\n');
        for (let i = 0; i < lines.length - 1; i++) {
          if (lines[i].trim() === label) return lines[i + 1].trim();
        }
        return null;
      };
      const fpsRaw = lookup('FPS (med)');
      const fpsM = fpsRaw && fpsRaw.match(/(\d+)\s*[·.]?\s*p1\s*(\d+)/);
      const ctx = lookup('WebGL ctx');
      const ctxM = ctx && ctx.match(/(\d+)\s+live\s+\/\s+(\d+)\s+reg/);
      const live = text.split('\n').filter((l) => /^[●○]/.test(l.trim()));
      const liveParsed = live.map((l) => {
        const m = l.trim().match(/^([●○])\s+(\S+)\s+(.+)$/);
        return m ? { active: m[1] === '●', label: m[2], gpuMs: m[3] } : null;
      }).filter(Boolean);
      perf.hudSamples.push({
        ts: Math.round((performance.now() - perf.startedAt) * 100) / 100,
        fpsMed: fpsM ? parseInt(fpsM[1], 10) : null,
        fpsP1: fpsM ? parseInt(fpsM[2], 10) : null,
        longTasksTotal: parseInt(lookup('Long tasks') || '0', 10),
        ctxLive: ctxM ? parseInt(ctxM[1], 10) : null,
        ctxReg: ctxM ? parseInt(ctxM[2], 10) : null,
        live: liveParsed,
      });
    }
    setTimeout(sampleHud, 250);
  }
  setTimeout(sampleHud, 500);

  /* ── User-facing API ───────────────────────────────────────────────── */
  window.__perf.mark = (label) => {
    perf.markers.push({
      ts: Math.round((performance.now() - perf.startedAt) * 100) / 100,
      label,
    });
  };

  window.__perf.dump = () => JSON.stringify(perf);
})();
