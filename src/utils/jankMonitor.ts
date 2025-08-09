export function startJankMonitor() {
  const logs: any[] = [];
  let last = performance.now();
  let frames = 0;
  let fps = 60;

  // Create FPS display panel
  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "fixed",
    right: "8px",
    bottom: "8px",
    zIndex: "99999",
    background: "rgba(0,0,0,.7)",
    color: "#fff",
    padding: "6px 8px",
    font: "12px/1.2 monospace",
    borderRadius: "6px",
    pointerEvents: "none"
  });
  document.body.appendChild(panel);

  // FPS counter
  function raf(t: number) {
    frames++;
    if (t - last >= 1000) {
      fps = Math.round((frames * 1000) / (t - last));
      frames = 0;
      last = t;
      panel.textContent = `FPS: ${fps}`;
      logs.push({ ts: t, fps });
      
      // Warn on low FPS
      if (fps < 30) {
        console.warn(`[LOW FPS] ${fps} fps at ${t.toFixed(2)}ms`);
      }
    }
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Long Tasks observer
  let longTaskObserver: PerformanceObserver | null = null;
  
  if ('PerformanceObserver' in window && 'PerformanceLongTaskTiming' in window) {
    try {
      longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const longTask: any = {
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration,
            type: 'longtask'
          };
          
          // Some implementations expose attribution
          if ('attribution' in entry) {
            longTask.attribution = (entry as any).attribution;
          }
          
          logs.push({ longtask: longTask });
          console.warn("[LONG TASK]", longTask);
        }
        
        // Make data available globally
        (window as any).__JANK_LOGS__ = logs;
      });
      
      longTaskObserver.observe({ type: "longtask", buffered: true } as any);
    } catch (e) {
      console.warn("Long Task API not supported:", e);
    }
  }

  // Cleanup function
  return () => {
    panel.remove();
    if (longTaskObserver) {
      longTaskObserver.disconnect();
    }
  };
}

// Export function for debugging
export const exportJankLogs = () => {
  const data = (window as any).__JANK_LOGS__ ?? [];
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jank-logs.json";
  a.click();
  URL.revokeObjectURL(url);
};
