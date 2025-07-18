import { ReactNode } from 'react'

interface PerformanceProfilerProps {
  id: string
  children: ReactNode
  enabled?: boolean
}

export const PerformanceProfiler = ({ 
  children, 
  enabled = process.env.NODE_ENV === 'development'
}: PerformanceProfilerProps) => {
  // Only enable profiling in development
  if (!enabled || process.env.NODE_ENV !== 'development') {
    return <>{children}</>
  }

  // In production builds, just return children without profiling
  return <>{children}</>
} 