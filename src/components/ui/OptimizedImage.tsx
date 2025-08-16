import { useState, useRef, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  loading?: 'lazy' | 'eager'
  priority?: boolean
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  style,
  loading = 'lazy',
  priority = false,
  sizes = '100vw',
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  
  const { ref: intersectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px'
  })

  const shouldLoad = priority || loading === 'eager' || inView

  useEffect(() => {
    // Reset states when src changes
    if (currentSrc !== src) {
      setIsLoaded(false)
      setHasError(false)
      setCurrentSrc(null)
    }
  }, [src, currentSrc])

  useEffect(() => {
    if (shouldLoad && currentSrc !== src && !hasError) {
      const img = new Image()
      
      img.onload = () => {
        setCurrentSrc(src)
        setIsLoaded(true)
        onLoad?.()
      }
      
      img.onerror = () => {
        setHasError(true)
        onError?.()
      }
      
      img.src = src
    }
  }, [shouldLoad, src, currentSrc, hasError, onLoad, onError])

  const combinedRef = (node: HTMLImageElement | null) => {
    if (imageRef.current !== node) {
      // @ts-ignore - We need to assign to ref for image handling
      imageRef.current = node
    }
    intersectionRef(node)
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite linear'
          }}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Failed to load image
        </div>
      )}
      
      {/* Actual image */}
      {currentSrc && (
        <img
          ref={combinedRef}
          src={currentSrc}
          alt={alt}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
            willChange: 'opacity'
          }}
          loading={loading}
          decoding="async"
          sizes={sizes}
        />
      )}
      
      {/* Intersection observer target for lazy loading */}
      {!priority && loading === 'lazy' && (
        <div ref={intersectionRef} className="absolute inset-0 pointer-events-none" />
      )}
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}