import { useState, useEffect } from 'react'

interface PreloadedImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

// Global format support detection (runs once)
let formatSupport: { avif: boolean; webp: boolean } | null = null

const detectFormatSupport = async (): Promise<{ avif: boolean; webp: boolean }> => {
  if (formatSupport) return formatSupport

  const avifSupported = await new Promise<boolean>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg=='
  })

  const webpSupported = await new Promise<boolean>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })

  formatSupport = { avif: avifSupported, webp: webpSupported }
  return formatSupport
}

export const PreloadedImage = ({
  src,
  alt,
  className = '',
  style
}: PreloadedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>('')

  useEffect(() => {
    const getOptimalImageSrc = async () => {
      const support = await detectFormatSupport()
      const basePath = src.replace(/\.[^/.]+$/, '')
      
      if (support.avif) {
        setImageSrc(`${basePath}.avif`)
      } else if (support.webp) {
        setImageSrc(`${basePath}.webp`)
      } else {
        setImageSrc(src)
      }
    }

    getOptimalImageSrc()
  }, [src])

  if (!imageSrc) {
    return null // No placeholder, images should load instantly since preloaded
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
      loading="eager"
      decoding="sync" // Changed from async for instant rendering
    />
  )
}