import React, { Profiler } from "react";

type Entry = {
  id: string;
  phase: "mount" | "update" | "nested-update";
  actualDuration: number;
  commitTime: number;
};

const store: Entry[] = [];

function onRender(
  id: string,
  phase: "mount" | "update" | "nested-update",
  actualDuration: number,
  _baseDuration: number,
  _startTime: number,
  commitTime: number
) {
  store.push({ id, phase, actualDuration, commitTime });

  // Mark "slow" commits > 16.6ms (~1 frame at 60fps)
  if (actualDuration > 16.6) {
    console.warn(`[SLOW COMMIT] ${id} ${phase} ${actualDuration.toFixed(2)}ms`);
  }

  // Make data available globally for export
  (window as any).__REACT_PROFILER__ = store;
}

export const WithProfiler: React.FC<{
  id?: string;
  children: React.ReactNode
}> = ({ id = "App", children }) => {
  // Only enable profiler in development
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
};

// Export function for debugging
export const exportProfilerData = () => {
  const data = (window as any).__REACT_PROFILER__ ?? [];
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "react-profiler.json";
  a.click();
  URL.revokeObjectURL(url);
};
