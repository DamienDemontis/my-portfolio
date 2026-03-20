import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

interface PerformanceMetric {
  name: string
  value: number
  delta: number
  id: string
}

// Log performance metrics to console
function logMetric(metric: PerformanceMetric) {
  console.group(`🔍 Performance Metric: ${metric.name}`)
  console.log(`Value: ${metric.value.toFixed(2)}ms`)
  console.log(`Delta: ${metric.delta.toFixed(2)}ms`)
  console.log(`ID: ${metric.id}`)
  
  // Color-coded warnings based on thresholds
  if (metric.name === 'LCP' && metric.value > 2500) {
    console.warn('⚠️ LCP is slow (>2.5s)')
  } else if (metric.name === 'FID' && metric.value > 100) {
    console.warn('⚠️ FID is slow (>100ms)')
  } else if (metric.name === 'CLS' && metric.value > 0.1) {
    console.warn('⚠️ CLS is high (>0.1)')
  } else if (metric.name === 'FCP' && metric.value > 1800) {
    console.warn('⚠️ FCP is slow (>1.8s)')
  } else if (metric.name === 'TTFB' && metric.value > 800) {
    console.warn('⚠️ TTFB is slow (>800ms)')
  } else {
    console.log('✅ Good performance')
  }
  console.groupEnd()
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  console.log('🚀 Performance monitoring initialized')
  
  onCLS(logMetric)  // Cumulative Layout Shift
  onINP(logMetric)  // Interaction to Next Paint (replaces FID)
  onFCP(logMetric)  // First Contentful Paint
  onLCP(logMetric)  // Largest Contentful Paint
  onTTFB(logMetric) // Time to First Byte
}

// React component performance profiler
export function measureComponentRender(componentName: string, renderFn: () => void) {
  const start = performance.now()
  renderFn()
  const end = performance.now()
  const renderTime = end - start
  
  console.log(`⏱️ ${componentName} render time: ${renderTime.toFixed(2)}ms`)
  
  if (renderTime > 16) {
    console.warn(`⚠️ ${componentName} is slow (>${renderTime.toFixed(2)}ms)`)
  }
}

// Memory usage monitoring
export function logMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    console.group('💾 Memory Usage')
    console.log(`Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`)
    console.log(`Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`)
    console.log(`Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`)
    console.groupEnd()
  }
}

// FPS monitoring — uses PerformanceObserver instead of a permanent rAF loop
export function startFPSMonitoring() {
  let frameCount = 0
  let lastTime = performance.now()

  // Count frames via a lightweight rAF that only increments a counter
  // The logging happens on a setInterval so it doesn't add rAF pressure
  const countFrame = () => {
    frameCount++
    rafId = requestAnimationFrame(countFrame)
  }
  let rafId = requestAnimationFrame(countFrame)

  const intervalId = setInterval(() => {
    const now = performance.now()
    const elapsed = now - lastTime
    if (elapsed > 0) {
      const fps = Math.round((frameCount * 1000) / elapsed)
      if (fps < 30) {
        console.warn(`⚠️ Low FPS: ${fps}`)
      } else if (fps < 50) {
        console.log(`📊 FPS: ${fps}`)
      }
    }
    frameCount = 0
    lastTime = now
  }, 2000) // Check every 2s instead of every frame

  console.log('📊 FPS monitoring started')

  // Return cleanup function (unused but available)
  return () => {
    cancelAnimationFrame(rafId)
    clearInterval(intervalId)
  }
}

// Animation performance tracker
export function trackAnimation(animationName: string) {
  const start = performance.now()
  
  return {
    end: () => {
      const duration = performance.now() - start
      console.log(`🎬 Animation "${animationName}" took ${duration.toFixed(2)}ms`)
      
      if (duration > 16) {
        console.warn(`⚠️ Animation "${animationName}" might cause jank (${duration.toFixed(2)}ms)`)
      }
    }
  }
} 