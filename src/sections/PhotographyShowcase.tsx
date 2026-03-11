import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Camera, MapPin, Calendar, Heart, Globe, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { isLowEndDevice } from '../utils/performanceOptimizations'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const photos = [
  { src: '/photography/IMG_20240701_151842.webp', location: 'Seoul, South Korea', date: 'July 2024', description: 'A good meal in the heart of Seoul', category: 'city' },
  { src: '/photography/IMG_20231006_110254.webp', location: 'Gyeongju, South Korea', date: 'October 2023', description: 'Autumn colors in the university campus', category: 'nature' },
  { src: '/photography/IMG_20231117_160650.webp', location: 'Daegu, South Korea', date: 'November 2023', description: 'trees in the university campus', category: 'nature' },
  { src: '/photography/IMG_20230820_063353.webp', location: 'Keimyung University, South Korea', date: 'August 2023', description: 'Entrance of the university', category: 'nature' },
  { src: '/photography/IMG_20231004_104055.webp', location: 'KMU, South Korea', date: 'October 2023', description: 'Taekwondo class', category: 'culture' },
  { src: '/photography/IMG_20231107_155400.webp', location: 'KMU, South Korea', date: 'November 2023', description: 'University church', category: 'city' },
  { src: '/photography/IMG_20231107_164957.webp', location: 'KMU, South Korea', date: 'November 2023', description: 'University church', category: 'city' },
  { src: '/photography/IMG_20240111_184858.webp', location: 'Kyoto, Japan', date: 'January 2024', description: 'Animal Rescue Coffee shop', category: 'nature' },
  { src: '/photography/IMG_20240116_170340.webp', location: 'Kyoto, South Korea', date: 'January 2024', description: 'Mermaid statue', category: 'culture' },
  { src: '/photography/IMG_20240503_183702.webp', location: 'Seoul, South Korea', date: 'May 2024', description: 'Stroll (feat: the sun)', category: 'nature' },
  { src: '/photography/IMG_20240504_110543.webp', location: 'Seoul, South Korea', date: 'May 2024', description: 'Seoul sightseeing', category: 'culture' },
  { src: '/photography/IMG_20240504_120923_1.webp', location: 'Seoul, South Korea', date: 'May 2024', description: 'Traditional korean Hanbok', category: 'city' },
  { src: '/photography/IMG_20240505_120320.webp', location: 'Seoul, South Korea', date: 'May 2024', description: 'Lotte World', category: 'nature' },
  { src: '/photography/IMG_20240505_142203.webp', location: 'Seoul, South Korea', date: 'May 2024', description: 'mmmmmh barbapapa', category: 'nature' },
  { src: '/photography/IMG_20240602_034858.webp', location: 'Seoul, South Korea', date: 'June 2024', description: 'International friends', category: 'city' },
  { src: '/photography/IMG_20240630_203416.webp', location: 'Seoul, South Korea', date: 'June 2024', description: 'Summer night and han river', category: 'city' },
  { src: '/photography/IMG_20240701_150338.webp', location: 'Seoul, South Korea', date: 'July 2024', description: 'Library or Mall ? No one knows', category: 'city' },
  { src: '/photography/IMG_20240701_200211.webp', location: 'Seoul, South Korea', date: 'July 2024', description: 'Traditional Korean Street', category: 'city' },
  { src: '/photography/IMG_20240822_170729.webp', location: 'KMU, Daegu, South Korea', date: 'August 2024', description: 'Keimyung main building', category: 'city' },
  { src: '/photography/IMG_20240403_130655.webp', location: 'Daegu, South Korea', date: 'April 2024', description: 'Spring awakening (feat: the rain)', category: 'nature' },
  { src: '/photography/IMG_20240419_184403.webp', location: 'Seoul, South Korea', date: 'April 2024', description: 'Korean Flag', category: 'nature' },
  { src: '/photography/IMG_20240504_110833.webp', location: 'Gyeongju, South Korea', date: 'May 2024', description: 'Historical sites in spring bloom', category: 'culture' },
  { src: '/photography/IMG_20240504_114735.webp', location: 'Seoul, South Korea', date: 'May 2024', description: 'Gardens and tranquility', category: 'nature' },
  { src: '/photography/IMG_20240531_232815.webp', location: 'Seoul, South Korea', date: 'May 2024', description: 'Those umbrella are not pointing the right way', category: 'city' },
  { src: '/photography/IMG_20240626_184532.webp', location: 'Near Seoul, South Korea', date: 'June 2024', description: 'Meal with international student association', category: 'nature' },
  { src: '/photography/IMG_20240630_181716.webp', location: 'Seoul, South Korea', date: 'June 2024', description: 'One last Picnic with friends', category: 'city' }
]

/** Simple fade transition component - optimized for preloaded images */
const FadeSlide: React.FC<{
  src: string
  alt: string
  duration?: number
}> = ({ src, alt, duration = 0.4 }) => {
  // Since images are preloaded, directly use the best format
  const getImageSrc = (originalSrc: string) => {
    const basePath = originalSrc.replace(/\.[^/.]+$/, '')
    // Try AVIF first (most browsers support it now), then WebP, then original
    return `${basePath}.avif` // We'll handle fallback in CSS
  }

  return (
    <motion.div
      key={src}
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, ease: 'easeInOut' }}
    >
      {/* Use multiple sources for instant fallback */}
      <picture className="w-full h-full absolute inset-0">
        <source srcSet={getImageSrc(src)} type="image/avif" />
        <source srcSet={src.replace(/\.[^/.]+$/, '.webp')} type="image/webp" />
        <img
          src={src}
          alt={alt}
          className="w-full h-full absolute inset-0"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            objectFit: 'contain',
            objectPosition: 'center'
          }}
          loading="eager"
          decoding="sync"
        />
      </picture>
    </motion.div>
  )
}

/* ========================= Your component ========================= */
export const PhotographyShowcase = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0, rootMargin: '0px 0px -10% 0px' })
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLowEnd, setIsLowEnd] = useState(false)

  useEffect(() => {
    setIsLowEnd(isLowEndDevice())
  }, [])

  // All images are preloaded during app loading screen for instant transitions
  useEffect(() => {
    // Reset transition state when photo changes - OPTIMIZED: reduced from 800ms to 400ms
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 400) // Match FadeSlide duration

    return () => clearTimeout(timer)
  }, [currentPhotoIndex])

  const goToNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }, [isTransitioning, photos.length])

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [isTransitioning, photos.length])

  const goToPhoto = useCallback((index: number) => {
    if (isTransitioning || index === currentPhotoIndex) return
    setIsTransitioning(true)
    setCurrentPhotoIndex(index)
  }, [isTransitioning, currentPhotoIndex])

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    if (isTransitioning) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clickPosition = x / rect.width
    if (clickPosition > 0.6) goToNext()
    else if (clickPosition < 0.4) goToPrevious()
  }, [isTransitioning, goToNext, goToPrevious])

  // Auto-advance photos - OPTIMIZED: Disable on low-end devices
  useEffect(() => {
    if (!isLowEnd && !isHovered && !isTransitioning && inView) {
      const interval = setInterval(() => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => goToNext())
        } else {
          goToNext()
        }
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [isHovered, isTransitioning, goToNext, inView, isLowEnd])

  return (
    <section id="photography" className="section-padding bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Clean Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Beautiful Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              {t('photography.title')}
            </span>
          </motion.h2>

          {/* Elegant Decorative Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mb-6 flex items-center justify-center"
          >
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full"></div>
            <div className="absolute w-32 h-3 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-500/20 blur-sm rounded-full"></div>
          </motion.div>

        </motion.div>

        <div ref={ref} className="relative">
          <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="relative">
            <div
              className="relative w-full max-w-4xl mx-auto h-80 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-600 cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleImageClick}
              style={{ containIntrinsicSize: '100% 500px', contentVisibility: 'auto' }}
            >
              {/* Simple fade transition */}
              <div className="absolute inset-0">
                <AnimatePresence
                  mode="wait"
                  initial={false}
                  onExitComplete={() => setIsTransitioning(false)}
                >
                  <FadeSlide
                    key={photos[currentPhotoIndex].src}
                    src={photos[currentPhotoIndex].src}
                    alt={photos[currentPhotoIndex].description}
                    duration={0.3}
                  />
                </AnimatePresence>

                {/* Camera icon in corner */}
                <div className="absolute top-4 right-4 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full p-3 shadow-lg border border-white/20">
                  <Camera className="w-5 h-5 text-purple-600" />
                </div>

                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Photo information */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white pointer-events-none">
                  <div className="flex items-center gap-2 mb-2 text-sm md:text-base">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="font-semibold">{photos[currentPhotoIndex].location}</span>
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 ml-2 md:ml-4" />
                    <span>{photos[currentPhotoIndex].date}</span>
                  </div>
                  <p className="text-sm md:text-lg font-medium">{photos[currentPhotoIndex].description}</p>
                </div>
              </div>

              {/* Arrows */}
              <div className="hidden md:block">
                <button
                  onClick={(e) => { e.stopPropagation(); goToPrevious() }}
                  disabled={isTransitioning}
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-xl rounded-full p-3 text-white hover:bg-black/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goToNext() }}
                  disabled={isTransitioning}
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-xl rounded-full p-3 text-white hover:bg-black/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Dots */}
              <div className="absolute bottom-4 right-4 flex gap-1 md:gap-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); goToPhoto(index) }}
                    disabled={isTransitioning}
                    aria-label={`Go to photo ${index + 1}`}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentPhotoIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-xl rounded-full px-2 py-1 md:px-3 md:py-1 text-white text-xs md:text-sm font-medium">
                {currentPhotoIndex + 1} / {photos.length}
              </div>
            </div>
          </motion.div>

          {/* (rest of your categories + description unchanged) */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-8 md:mt-12 flex justify-center">
            <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-md md:max-w-2xl w-full">
              {[
                { key: 'city', label: 'Urban Life', icon: Globe, color: 'from-blue-500 to-cyan-500' },
                { key: 'nature', label: 'Nature', icon: Sparkles, color: 'from-green-500 to-emerald-500' },
                { key: 'culture', label: 'Culture', icon: Heart, color: 'from-blue-500 to-cyan-500' }
              ].map((category) => (
                <motion.div key={category.key} whileHover={!isLowEnd ? { scale: 1.05 } : {}} whileTap={!isLowEnd ? { scale: 0.95 } : {}} className={`bg-gradient-to-r ${category.color} rounded-xl p-4 md:p-6 text-white text-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  onClick={() => {
                    // Go to specific photos as requested by user
                    let targetIndex = -1
                    if (category.key === 'city') {
                      // Urban Life -> "Summer night and han river"
                      targetIndex = photos.findIndex(p => p.description === 'Summer night and han river')
                    } else if (category.key === 'nature') {
                      // Nature -> "trees in the university campus" 
                      targetIndex = photos.findIndex(p => p.description === 'trees in the university campus')
                    } else if (category.key === 'culture') {
                      // Culture -> "Seoul sightseeing"
                      targetIndex = photos.findIndex(p => p.description === 'Seoul sightseeing')
                    }
                    if (targetIndex !== -1) goToPhoto(targetIndex)
                  }}>
                  <category.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 md:mb-3" />
                  <div className="font-semibold text-sm md:text-base">{category.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.6, delay: 1 }} className="mt-12 md:mt-16">
            <div className="max-w-5xl mx-auto bg-white/50 dark:bg-gray-800/30 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 dark:border-gray-700/20 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                  <Camera className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                  {t('photography.conclusion.title')}
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full mb-6" />
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p className="text-base md:text-lg">{t('photography.ambassador')} <span className="font-semibold text-blue-600 dark:text-blue-400">{t('photography.epitech')}</span>{t('photography.university')}</p>
                </div>
                <div className="hidden md:flex justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-40 h-40 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center">
                      <Camera className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
