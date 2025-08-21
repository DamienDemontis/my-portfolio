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
  width?: number
  height?: number
}

// Helper function to generate next-gen format URLs
const generateImageSources = (src: string) => {
  const basePath = src.replace(/\.[^/.]+$/, '') // Remove extension
  const extension = src.split('.').pop()?.toLowerCase()
  
  return {
    avif: `${basePath}.avif`,
    webp: `${basePath}.webp`,
    original: src
  }
}

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  style,
  loading = 'lazy',
  priority = false,
  sizes = '100vw',
  width,
  height,
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)
  const [supportedFormat, setSupportedFormat] = useState<'avif' | 'webp' | 'original'>('original')
  const imageRef = useRef<HTMLImageElement>(null)
  
  const { ref: intersectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px' // Increased rootMargin for better UX
  })

  const shouldLoad = priority || loading === 'eager' || inView

  // Detect supported image formats
  useEffect(() => {
    const detectImageSupport = async () => {
      // Check AVIF support
      const avifSupported = await new Promise((resolve) => {
        const avif = new Image()
        avif.onload = () => resolve(true)
        avif.onerror = () => resolve(false)
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg=='
      })
      
      if (avifSupported) {
        setSupportedFormat('avif')
        return
      }

      // Check WebP support
      const webpSupported = await new Promise((resolve) => {
        const webp = new Image()
        webp.onload = () => resolve(true)
        webp.onerror = () => resolve(false)
        webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
      })
      
      if (webpSupported) {
        setSupportedFormat('webp')
      }
    }

    detectImageSupport()
  }, [])

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
      const sources = generateImageSources(src)
      let finalSrc = sources.original

      // Select the best supported format
      if (supportedFormat === 'avif') {
        finalSrc = sources.avif
      } else if (supportedFormat === 'webp') {
        finalSrc = sources.webp
      }

      const img = new Image()
      
      img.onload = () => {
        setCurrentSrc(finalSrc)
        setIsLoaded(true)
        onLoad?.()
      }
      
      img.onerror = () => {
        // Fallback to original format if next-gen format fails
        if (finalSrc !== sources.original) {
          const fallbackImg = new Image()
          fallbackImg.onload = () => {
            setCurrentSrc(sources.original)
            setIsLoaded(true)
            onLoad?.()
          }
          fallbackImg.onerror = () => {
            setHasError(true)
            onError?.()
          }
          fallbackImg.src = sources.original
        } else {
          setHasError(true)
          onError?.()
        }
      }
      
      img.src = finalSrc
    }
  }, [shouldLoad, src, currentSrc, hasError, supportedFormat, onLoad, onError])

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
          width={width}
          height={height}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
            willChange: 'opacity',
            aspectRatio: width && height ? `${width} / ${height}` : 'auto'
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