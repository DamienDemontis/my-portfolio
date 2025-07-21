import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Camera, MapPin, Calendar, Heart, Globe, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'

export const PhotographyShowcase = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  // Photo data with metadata
  const photos = [
    {
      src: '/photography/IMG_20240701_151842.jpg',
      location: 'Seoul, South Korea',
      date: 'July 2024',
      description: 'A good meal in the heart of Seoul',
      category: 'city'
    },
    {
      src: '/photography/IMG_20231006_110254.jpg',
      location: 'Gyeongju, South Korea',
      date: 'October 2023',
      description: 'Autumn colors in the university campus',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20231117_160650.jpg',
      location: 'Busan, South Korea',
      date: 'November 2023',
      description: 'trees in the university campus',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20230820_063353.jpg',
      location: 'Keimyung University, South Korea',
      date: 'August 2023',
      description: 'Entrance of the university',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20231004_104055.jpg',
      location: 'KMU, South Korea',
      date: 'October 2023',
      description: 'Taekwondo class',
      category: 'culture'
    },
    {
      src: '/photography/IMG_20231107_155400.jpg',
      location: 'KMU, South Korea',
      date: 'November 2023',
      description: 'University church',
      category: 'city'
    },
    {
      src: '/photography/IMG_20231107_164957.jpg',
      location: 'KMU, South Korea',
      date: 'November 2023',
      description: 'University church',
      category: 'city'
    },
    {
      src: '/photography/IMG_20240111_184858.jpg',
      location: 'Kyoto, Japan',
      date: 'January 2024',
      description: 'Animal Rescue Coffee shop',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20240116_170340.jpg',
      location: 'Kyoto, South Korea',
      date: 'January 2024',
      description: 'Mermaid statue',
      category: 'culture'
    },
    {
      src: '/photography/IMG_20240503_183702.jpg',
      location: 'Seoul, South Korea',
      date: 'May 2024',
      description: 'Stroll (feat: the sun)',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20240504_110543.jpg',
      location: 'Seoul, South Korea',
      date: 'May 2024',
      description: 'Seoul sightseeing',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20240504_120923_1.jpg',
      location: 'Seoul, South Korea',
      date: 'May 2024',
      description: 'Traditional korean Hanbok',
      category: 'city'
    },
    {
      src: '/photography/IMG_20240505_120320.jpg',
      location: 'Seoul, South Korea',
      date: 'May 2024',
      description: 'Lotte World',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20240505_142203.jpg',
      location: 'Seoul, South Korea',
      date: 'May 2024',
      description: 'mmmmmh barbapapa',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20240602_034858.jpg',
      location: 'Seoul, South Korea',
      date: 'June 2024',
      description: 'International friends',
      category: 'city'
    },
    {
      src: '/photography/IMG_20240630_203416.jpg',
      location: 'Seoul, South Korea',
      date: 'June 2024',
      description: 'Summer night and han river',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20240701_150338.jpg',
      location: 'Seoul, South Korea',
      date: 'July 2024',
      description: 'Library or Mall ? No one knows',
      category: 'city'
    },
    {
      src: '/photography/IMG_20240701_200211.jpg',
      location: 'Seoul, South Korea',
      date: 'July 2024',
      description: 'Traditional Korean Street',
      category: 'city'
    },
    {
      src: '/photography/IMG_20240822_170729.jpg',
      location: 'KMU, Daegu, South Korea',
      date: 'August 2024',
      description: 'Keimyung main building',
      category: 'city'
    },
    {
      src: '/photography/IMG_20240403_130655.jpg',
      location: 'Daegu, South Korea',
      date: 'April 2024',
      description: 'Spring awakening (feat: the rain)',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20240419_184403.jpg',
      location: 'Seoul, South Korea',
      date: 'April 2024',
      description: 'Korean Flag',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20240504_110833.jpg',
      location: 'Gyeongju, South Korea',
      date: 'May 2024',
      description: 'Historical sites in spring bloom',
      category: 'culture'
    },
    {
      src: '/photography/IMG_20240504_114735.jpg',
      location: 'Seoul, South Korea',
      date: 'May 2024',
      description: 'Gardens and tranquility',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20240531_232815.jpg',
      location: 'Seoul, South Korea',
      date: 'May 2024',
      description: 'Those umbrella are not pointing the right way',
      category: 'city'
    },
    {
      src: '/photography/IMG_20240626_184532.jpg',
      location: 'Near Seoul, South Korea',
      date: 'June 2024',
      description: 'Meal with international student association',
      category: 'nature'
    },
    {
      src: '/photography/IMG_20240630_181716.jpg',
      location: 'Seoul, South Korea',
      date: 'June 2024',
      description: 'One last Picnic with friends',
      category: 'city'
    }
  ]

  // Preload next images for smoother transitions
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (currentPhotoIndex + 1) % photos.length
      const prevIndex = (currentPhotoIndex - 1 + photos.length) % photos.length
      
      const img1 = new Image()
      const img2 = new Image()
      
      img1.src = photos[nextIndex].src
      img2.src = photos[prevIndex].src
    }
    
    preloadImages()
  }, [currentPhotoIndex, photos])

  // Navigation functions with transition handling
  const goToNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [isTransitioning, photos.length])

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [isTransitioning, photos.length])

  const goToPhoto = useCallback((index: number) => {
    if (isTransitioning || index === currentPhotoIndex) return
    setIsTransitioning(true)
    setCurrentPhotoIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [isTransitioning, currentPhotoIndex])

  // Handle click navigation
  const handleImageClick = useCallback((e: React.MouseEvent) => {
    if (isTransitioning) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clickPosition = x / rect.width

    if (clickPosition > 0.6) {
      goToNext()
    } else if (clickPosition < 0.4) {
      goToPrevious()
    }
  }, [isTransitioning, goToNext, goToPrevious])

  // Auto-advance photos with infinite loop (optimized)
  useEffect(() => {
    if (!isHovered && !isTransitioning && inView) {
      const interval = setInterval(() => {
        goToNext()
      }, 5000) // Change photo every 5 seconds (slower for better performance)

      return () => clearInterval(interval)
    }
  }, [isHovered, isTransitioning, goToNext, inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <section id="photography" className="section-padding bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('photography.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            {t('photography.subtitle')}
          </p>
        </motion.div>

        <div ref={ref} className="relative">
          {/* Main Photo Display */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative"
          >
            {/* Simplified camera icon */}
            <div className="absolute -top-4 -right-4 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full p-3 shadow-lg border border-white/20">
              <Camera className="w-6 h-6 text-purple-600" />
            </div>

            {/* Main photo container */}
            <div 
              className="relative w-full max-w-4xl mx-auto h-80 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-600 cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleImageClick}
            >
              {/* Photo slideshow with optimized transitions */}
              <div className="absolute inset-0">
                <img
                  ref={imageRef}
                  src={photos[currentPhotoIndex].src}
                  alt={photos[currentPhotoIndex].description}
                  className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800 transition-opacity duration-300 ease-in-out"
                  style={{
                    willChange: 'opacity',
                    transform: 'translateZ(0)', // Force GPU acceleration
                  }}
                  crossOrigin="anonymous"
                />
                
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                
                {/* Photo information */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white pointer-events-none">
                  <div className="flex items-center gap-2 mb-2 text-sm md:text-base">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="font-semibold">{photos[currentPhotoIndex].location}</span>
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 ml-2 md:ml-4" />
                    <span>{photos[currentPhotoIndex].date}</span>
                  </div>
                  <p className="text-sm md:text-lg font-medium">
                    {photos[currentPhotoIndex].description}
                  </p>
                </div>
              </div>

              {/* Navigation arrows - Desktop */}
              <div className="hidden md:block">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  disabled={isTransitioning}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-xl rounded-full p-3 text-white hover:bg-black/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  disabled={isTransitioning}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-xl rounded-full p-3 text-white hover:bg-black/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation dots */}
              <div className="absolute bottom-4 right-4 flex gap-1 md:gap-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      goToPhoto(index)
                    }}
                    disabled={isTransitioning}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      index === currentPhotoIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                ))}
              </div>

              {/* Photo counter */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-xl rounded-full px-2 py-1 md:px-3 md:py-1 text-white text-xs md:text-sm font-medium">
                {currentPhotoIndex + 1} / {photos.length}
              </div>

              {/* Mobile navigation hint */}
              <div className="md:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-xl rounded-full px-4 py-2 text-white text-sm opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Tap left/right to navigate
              </div>
            </div>
          </motion.div>

          {/* Photo categories grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 md:mt-12 flex justify-center"
          >
            <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-md md:max-w-2xl w-full">
              {[
                { key: 'city', label: 'Urban Life', icon: Globe, color: 'from-blue-500 to-cyan-500' },
                { key: 'nature', label: 'Nature', icon: Sparkles, color: 'from-green-500 to-emerald-500' },
                { key: 'culture', label: 'Culture', icon: Heart, color: 'from-purple-500 to-pink-500' }
              ].map((category) => (
                <motion.div
                  key={category.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-gradient-to-r ${category.color} rounded-xl p-4 md:p-6 text-white text-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  onClick={() => {
                    const firstPhotoOfCategory = photos.findIndex(p => p.category === category.key)
                    if (firstPhotoOfCategory !== -1) {
                      goToPhoto(firstPhotoOfCategory)
                    }
                  }}
                >
                  <category.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 md:mb-3" />
                  <div className="font-semibold text-sm md:text-base">{category.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Photography description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 md:mt-16"
          >
            <div className="max-w-5xl mx-auto bg-white/50 dark:bg-gray-800/30 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 dark:border-gray-700/20 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                  <Camera className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
                  {t('photography.conclusion.title')}
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p className="text-base md:text-lg">
                    {t('photography.ambassador')} <span className="font-semibold text-purple-600 dark:text-purple-400">{t('photography.epitech')}</span> {t('photography.university')}.
                  </p>
                  <p className="text-base md:text-lg">
                    {t('photography.beyond')}
                  </p>
                  <p className="text-base md:text-lg">
                    Each image tells a story of <span className="font-semibold text-pink-600 dark:text-pink-400">cultural discovery</span>, natural wonders, and the vibrant energy of Korean cities.
                  </p>
                </div>
                <div className="hidden md:flex justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
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