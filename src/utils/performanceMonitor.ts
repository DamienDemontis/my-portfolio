/**
 * Performance Monitoring Utility
 * Tracks Core Web Vitals and provides optimization insights
 */

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private observer: PerformanceObserver | null = null

  constructor() {
    this.initializeObserver()
    this.trackNavigationTiming()
  }

  private initializeObserver() {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported')
      return
    }

    try {
      this.observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.handleNavigationEntry(entry as PerformanceNavigationTiming)
          } else if (entry.entryType === 'paint') {
            this.handlePaintEntry(entry as PerformancePaintTiming)
          } else if (entry.entryType === 'largest-contentful-paint') {
            this.handleLCPEntry(entry as any)
          } else if (entry.entryType === 'first-input') {
            this.handleFIDEntry(entry as any)
          } else if (entry.entryType === 'layout-shift') {
            this.handleCLSEntry(entry as any)
          }
        }
      })

      // Observe different entry types
      this.observer.observe({ entryTypes: ['navigation', 'paint'] })
      
      // Observe Web Vitals if supported
      try {
        this.observer.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observer.observe({ entryTypes: ['first-input'] })
        this.observer.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.log('Some Web Vitals metrics not supported')
      }
    } catch (error) {
      console.warn('Could not initialize PerformanceObserver:', error)
    }
  }

  private handleNavigationEntry(entry: PerformanceNavigationTiming) {
    const ttfb = entry.responseStart - entry.fetchStart
    this.addMetric('TTFB', ttfb, this.getTTFBRating(ttfb))
  }

  private handlePaintEntry(entry: PerformancePaintTiming) {
    if (entry.name === 'first-contentful-paint') {
      this.addMetric('FCP', entry.startTime, this.getFCPRating(entry.startTime))
    }
  }

  private handleLCPEntry(entry: any) {
    this.addMetric('LCP', entry.startTime, this.getLCPRating(entry.startTime))
  }

  private handleFIDEntry(entry: any) {
    this.addMetric('FID', entry.processingStart - entry.startTime, this.getFIDRating(entry.processingStart - entry.startTime))
  }

  private handleCLSEntry(entry: any) {
    if (!entry.hadRecentInput) {
      const clsValue = entry.value
      this.addMetric('CLS', clsValue, this.getCLSRating(clsValue))
    }
  }

  private addMetric(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor') {
    this.metrics.push({
      name,
      value,
      rating,
      timestamp: Date.now()
    })
  }

  private getTTFBRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 800) return 'good'
    if (value <= 1800) return 'needs-improvement'
    return 'poor'
  }

  private getFCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) return 'good'
    if (value <= 3000) return 'needs-improvement'
    return 'poor'
  }

  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good'
    if (value <= 4000) return 'needs-improvement'
    return 'poor'
  }

  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good'
    if (value <= 300) return 'needs-improvement'
    return 'poor'
  }

  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good'
    if (value <= 0.25) return 'needs-improvement'
    return 'poor'
  }

  private trackNavigationTiming() {
    // Track additional navigation metrics
    if ('navigation' in performance) {
      const navigation = performance.navigation
      const timing = performance.timing

      const pageLoadTime = timing.loadEventEnd - timing.navigationStart
      const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart
      const timeToFirstByte = timing.responseStart - timing.navigationStart

      setTimeout(() => {
        this.addMetric('Page Load Time', pageLoadTime, pageLoadTime <= 3000 ? 'good' : pageLoadTime <= 5000 ? 'needs-improvement' : 'poor')
        this.addMetric('DOM Ready Time', domReadyTime, domReadyTime <= 2000 ? 'good' : domReadyTime <= 3000 ? 'needs-improvement' : 'poor')
      }, 100)
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  public getLatestMetric(name: string): PerformanceMetric | undefined {
    return this.metrics
      .filter(metric => metric.name === name)
      .sort((a, b) => b.timestamp - a.timestamp)[0]
  }

  public logMetrics() {
    const groupedMetrics = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) acc[metric.name] = []
      acc[metric.name].push(metric)
      return acc
    }, {} as Record<string, PerformanceMetric[]>)

    console.group('🚀 Performance Metrics')
    Object.entries(groupedMetrics).forEach(([name, metrics]) => {
      const latest = metrics[metrics.length - 1]
      const emoji = latest.rating === 'good' ? '✅' : latest.rating === 'needs-improvement' ? '⚠️' : '❌'
      console.log(`${emoji} ${name}: ${latest.value.toFixed(2)}ms (${latest.rating})`)
    })
    console.groupEnd()
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor()

// Log metrics after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    performanceMonitor.logMetrics()
  }, 2000)
})

export default performanceMonitor