import { useEffect, useState } from 'react'
import { getFlag } from '../../utils/flagEmojiDetector'

interface FlagIconProps {
  countryCode: string
  className?: string
  size?: number
  style?: React.CSSProperties
}

export const FlagIcon: React.FC<FlagIconProps> = ({ 
  countryCode, 
  className = '', 
  size = 24,
  style = {}
}) => {
  const [flagData, setFlagData] = useState<{
    type: 'emoji' | 'image'
    content: string
    alt: string
    fallbacks: string[]
  } | null>(null)
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Run flag detection on client side only
    const flag = getFlag(countryCode)
    setFlagData(flag)
    setCurrentImageIndex(0)
    setImageError(false)
  }, [countryCode])

  // Show loading placeholder while checking
  if (!flagData) {
    return (
      <span 
        className={`inline-block ${className}`} 
        style={{ width: size, height: size, ...style }}
      >
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </span>
    )
  }

  if (flagData.type === 'emoji') {
    return (
      <span 
        className={`flag-emoji ${className}`}
        style={{ 
          fontSize: size, 
          lineHeight: 1, 
          display: 'inline-block',
          ...style 
        }}
        role="img"
        aria-label={flagData.alt}
        title={flagData.alt}
      >
        {flagData.content}
      </span>
    )
  }

  // Handle image fallback logic
  const handleImageError = () => {
    if (currentImageIndex < flagData.fallbacks.length) {
      setCurrentImageIndex(currentImageIndex + 1)
      setImageError(false)
    } else {
      setImageError(true)
    }
  }

  // Get current image source
  const getCurrentImageSrc = () => {
    if (currentImageIndex === 0) {
      return flagData.content
    } else if (currentImageIndex <= flagData.fallbacks.length) {
      return flagData.fallbacks[currentImageIndex - 1]
    }
    return flagData.content
  }

  // If all images failed, show emoji fallback
  if (imageError) {
    return (
      <span 
        className={`flag-emoji ${className}`}
        style={{ 
          fontSize: size, 
          lineHeight: 1, 
          display: 'inline-block',
          color: '#6b7280',
          ...style 
        }}
        role="img"
        aria-label={flagData.alt}
        title={flagData.alt}
      >
        🏳️
      </span>
    )
  }

  // Render high-resolution image
  return (
    <img
      src={getCurrentImageSrc()}
      alt={flagData.alt}
      title={flagData.alt}
      className={`inline-block ${className}`}
      style={{ 
        width: size, 
        height: size * 0.75, // Maintain flag aspect ratio
        objectFit: 'cover',
        objectPosition: 'center',
        borderRadius: '2px',
        ...style 
      }}
      onError={handleImageError}
      onLoad={() => setImageError(false)}
    />
  )
} 