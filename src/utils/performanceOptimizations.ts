// Performance optimization utilities

// Debounce function to limit rapid function calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function to limit function calls to a specific rate
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Optimize intersection observer options for better performance
export const optimizedIntersectionObserverOptions = {
  rootMargin: '100px',
  threshold: 0.1,
}

// Lazy loading utility for images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

// GPU acceleration CSS properties
export const gpuAccelerationStyles = {
  willChange: 'transform',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
}

// Detect if device has limited performance
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  
  // Check for navigator.hardwareConcurrency (number of CPU cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    return true
  }
  
  // Check for slow connection
  if ('connection' in navigator) {
    const connection = (navigator as any).connection
    if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      return true
    }
  }
  
  return false
}

// Performance-aware animation settings
export function getAnimationSettings() {
  const reducedMotion = prefersReducedMotion()
  const lowEndDevice = isLowEndDevice()
  
  return {
    enableAnimations: !reducedMotion && !lowEndDevice,
    reducedAnimations: reducedMotion || lowEndDevice,
    animationDuration: lowEndDevice ? 0.3 : 0.6,
    staggerDelay: lowEndDevice ? 0.05 : 0.1,
  }
} 