import { Profiler, ProfilerOnRenderCallback, ReactNode } from 'react'

interface PerformanceProfilerProps {
  id: string
  children: ReactNode
  enabled?: boolean
}

export const PerformanceProfiler = ({ 
  id, 
  children, 
  enabled = import.meta.env.DEV 
}: PerformanceProfilerProps) => {
  const onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    if (!enabled) return

    console.group(`🔍 Performance Profile: ${id}`)
    console.log(`Phase: ${phase}`)
    console.log(`Actual Duration: ${actualDuration.toFixed(2)}ms`)
    console.log(`Base Duration: ${baseDuration.toFixed(2)}ms`)
    console.log(`Start Time: ${startTime.toFixed(2)}ms`)
    console.log(`Commit Time: ${commitTime.toFixed(2)}ms`)
    
    if (interactions.size > 0) {
      console.log(`Interactions:`, Array.from(interactions))
    }

    // Performance warnings
    if (actualDuration > 16) {
      console.warn(`⚠️ ${id} took ${actualDuration.toFixed(2)}ms (might cause frame drops)`)
    } else if (actualDuration > 8) {
      console.warn(`⚠️ ${id} took ${actualDuration.toFixed(2)}ms (slower than optimal)`)
    } else {
      console.log(`✅ ${id} performed well`)
    }

    console.groupEnd()
  }

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  )
} 