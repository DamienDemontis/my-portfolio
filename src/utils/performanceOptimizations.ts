// Performance optimization utilities

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to limit function call frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Detect low-end devices based on hardware concurrency and memory
 */
export const isLowEndDevice = (): boolean => {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 1;
  
  // Check device memory if available
  const memory = (navigator as any).deviceMemory || 4; // Default to 4GB
  
  // Consider device low-end if it has <= 2 cores or <= 2GB RAM
  return cores <= 2 || memory <= 2;
};

/**
 * Get optimized animation settings based on device capabilities and user preferences
 */
export const getAnimationSettings = () => {
  const reducedMotion = prefersReducedMotion();
  const lowEnd = isLowEndDevice();
  
  return {
    reducedMotion,
    lowEnd,
    // Reduce animation complexity on low-end devices
    enableComplexAnimations: !lowEnd && !reducedMotion,
    animationDuration: lowEnd ? 0.3 : reducedMotion ? 0.1 : 0.6,
    enableParticles: !lowEnd && !reducedMotion,
    enableBlur: !lowEnd,
    maxFPS: lowEnd ? 30 : 60
  };
};

/**
 * Apply GPU acceleration styles for better performance
 */
export const gpuAccelerationStyles = {
  transform: 'translateZ(0)',
  willChange: 'transform',
  backfaceVisibility: 'hidden' as const,
  perspective: '1000px'
};

/**
 * Optimized intersection observer options
 */
export const optimizedIntersectionObserverOptions = {
  threshold: 0,
  rootMargin: '0px 0px -10% 0px'
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Batch image preloading
 */
export const preloadImages = async (urls: string[]): Promise<void> => {
  try {
    await Promise.all(urls.map(preloadImage));
    console.log('✅ Images preloaded successfully');
  } catch (error) {
    console.warn('⚠️ Some images failed to preload:', error);
  }
};

/**
 * Request idle callback with fallback
 */
export const requestIdleCallback = (
  callback: () => void,
  timeout = 5000
): void => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 1);
  }
};

/**
 * Optimize scroll performance
 */
export const optimizeScrollPerformance = () => {
  let ticking = false;
  
  const updateScrollPosition = () => {
    // Update scroll-dependent elements here
    ticking = false;
  };
  
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition);
      ticking = true;
    }
  };
  
  return { onScroll };
};

// Export settings for global use
export const performanceSettings = getAnimationSettings();