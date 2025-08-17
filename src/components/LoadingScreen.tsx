import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Code, Palette, Globe, Zap } from 'lucide-react'
import Hyperspeed from '../blocks/Backgrounds/Hyperspeed/Hyperspeed'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  // Motion values for smooth mouse tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Optimized spring animations for smooth movement with better performance
  const springX = useSpring(mouseX, { stiffness: 400, damping: 35, restSpeed: 0.01 })
  const springY = useSpring(mouseY, { stiffness: 400, damping: 35, restSpeed: 0.01 })
  
  // Transform values for 3D rotation - facing downward with dramatic inclination
  const rotateX = useTransform(springY, [-1, 1], [10, -60])
  const rotateY = useTransform(springX, [-1, 1], [-25, 25])
  
  // Transform values for individual element depths - increased reactivity
  const iconZ = useTransform(springY, [-1, 1], [15, 35])
  const titleZ = useTransform(springX, [-1, 1], [10, 25])
  const subtitleZ = useTransform(springX, [-1, 1], [18, 5])
  const stepZ = useTransform(springY, [-1, 1], [3, 15])
  const progressZ = useTransform(springX, [-1, 1], [20, 2])

  // Optimized mouse/touch movement handler with throttling
  useEffect(() => {
    let rafId: number | null = null
    
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return // Throttle to 60fps
      
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2 // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2 // -1 to 1
        mouseX.set(x)
        mouseY.set(y)
        rafId = null
      })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (rafId || e.touches.length === 0) return
      
      rafId = requestAnimationFrame(() => {
        const touch = e.touches[0]
        const x = (touch.clientX / window.innerWidth - 0.5) * 2
        const y = (touch.clientY / window.innerHeight - 0.5) * 2
        mouseX.set(x)
        mouseY.set(y)
        rafId = null
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [mouseX, mouseY])

  const steps = [
    { label: 'Loading portfolio data...', icon: Code, duration: 800 },
    { label: 'Optimizing animations...', icon: Zap, duration: 600 },
    { label: 'Preparing assets...', icon: Palette, duration: 700 },
    { label: 'Finalizing experience...', icon: Globe, duration: 500 }
  ]

  useEffect(() => {
    const preloadAssets = async () => {
      // Preload critical images first, then others progressively
      const criticalImages = [
        '/Damien.jpg' // Hero image - highest priority
      ]
      
      const photographyImages = [
        '/photography/IMG_20240701_151842.jpg',
        '/photography/IMG_20231006_110254.jpg',
        '/photography/IMG_20231117_160650.jpg',
        '/photography/IMG_20230820_063353.jpg',
        '/photography/IMG_20231004_104055.jpg',
        '/photography/IMG_20231107_155400.jpg',
        '/photography/IMG_20231107_164957.jpg',
        '/photography/IMG_20240111_184858.jpg',
        '/photography/IMG_20240116_170340.jpg',
        '/photography/IMG_20240503_183702.jpg',
        '/photography/IMG_20240504_110543.jpg',
        '/photography/IMG_20240504_120923_1.jpg',
        '/photography/IMG_20240505_120320.jpg',
        '/photography/IMG_20240505_142203.jpg',
        '/photography/IMG_20240602_034858.jpg',
        '/photography/IMG_20240630_203416.jpg',
        '/photography/IMG_20240701_150338.jpg',
        '/photography/IMG_20240701_200211.jpg',
        '/photography/IMG_20240822_170729.jpg',
        '/photography/IMG_20240403_130655.jpg',
        '/photography/IMG_20240419_184403.jpg',
        '/photography/IMG_20240504_110833.jpg',
        '/photography/IMG_20240504_114735.jpg',
        '/photography/IMG_20240531_232815.jpg',
        '/photography/IMG_20240626_184532.jpg',
        '/photography/IMG_20240630_181716.jpg'
      ]

      const totalImages = criticalImages.length + photographyImages.length
      let loadedImages = 0

      // Optimized image loader with progress tracking
      const createImageLoader = (src: string) => {
        return new Promise<boolean>((resolve) => {
          const img = new Image()
          
          const onLoad = () => {
            loadedImages++
            resolve(true)
          }
          
          const onError = () => {
            console.warn(`Failed to load image: ${src}`)
            loadedImages++
            resolve(false)
          }
          
          // Set up listeners before setting src to avoid race conditions
          img.addEventListener('load', onLoad, { once: true })
          img.addEventListener('error', onError, { once: true })
          
          // Use loading="eager" equivalent and add to cache
          img.decoding = 'async'
          img.src = src
        })
      }

      // Real progress tracking based on actual loading
      let currentProgress = 0
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        setCurrentStep(step.label)
        
        if (i === 0) {
          // Load critical images during first step
          await Promise.all(criticalImages.map(createImageLoader))
          currentProgress = 25
          setProgress(currentProgress)
        } else if (i === 1) {
          // Load photography images in batches during second step
          const batchSize = 8
          for (let j = 0; j < photographyImages.length; j += batchSize) {
            const batch = photographyImages.slice(j, j + batchSize)
            await Promise.all(batch.map(createImageLoader))
            
            // Update progress based on actual loaded images
            const imageProgress = (loadedImages / totalImages) * 50 // Images are 50% of total progress
            currentProgress = 25 + imageProgress
            setProgress(Math.min(currentProgress, 75))
          }
        } else if (i === 2) {
          // Prepare assets and cache optimization
          currentProgress = 85
          setProgress(currentProgress)
          
          // Simulate asset optimization work
          await new Promise(resolve => setTimeout(resolve, step.duration))
        } else if (i === 3) {
          // Final preparations
          currentProgress = 95
          setProgress(currentProgress)
          
          // Simulate final setup work
          await new Promise(resolve => setTimeout(resolve, step.duration))
        }
        
        // Smooth progress animation for visual feedback
        if (i > 1) {
          const targetProgress = i === 2 ? 85 : 95
          const stepDuration = step.duration
          const startProgress = currentProgress
          const progressRange = targetProgress - startProgress
          
          const startTime = performance.now()
          const animateProgress = () => {
            const elapsed = performance.now() - startTime
            const progress = Math.min(elapsed / stepDuration, 1)
            const easedProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic
            
            currentProgress = startProgress + (progressRange * easedProgress)
            setProgress(currentProgress)
            
            if (progress < 1) {
              requestAnimationFrame(animateProgress)
            }
          }
          requestAnimationFrame(animateProgress)
          
          await new Promise(resolve => setTimeout(resolve, stepDuration))
        }
      }

      // Final completion with smooth transition
      setProgress(100)
      setCurrentStep('Welcome!')
      
      // Brief pause to show completion
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Trigger the transition to main app
      onLoadingComplete()
    }

    preloadAssets()
  }, [onLoadingComplete])

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-black">
      {/* Hyperspeed background */}
      <div className="absolute inset-0">
        <Hyperspeed
          effectOptions={{
            colors: {
              roadColor: 0x0a0a0a,
              islandColor: 0x0f0f0f,
              background: 0x000000,
              shoulderLines: 0x333333,
              brokenLines: 0x444444,
              leftCars: [0x6366f1, 0x8b5cf6, 0xa855f7],
              rightCars: [0x06b6d4, 0x0ea5e9, 0x3b82f6],
              sticks: 0x06b6d4,
            },
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            distortion: 'turbulentDistortion'
          }}
        />
      </div>

      {/* 3D Perspective container - Center top positioning with performance optimizations */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ 
          perspective: '1200px',
          willChange: 'transform',
          transform: 'translateZ(0)' // Force GPU acceleration
        }}
      >
        {/* Main loading content - positioned at center top with mouse-reactive tilt */}
        <motion.div 
          className="absolute text-white top-16 sm:top-20 left-1/2 w-80 sm:w-96 text-center"
          initial={{ 
            opacity: 0,
            y: -50,
            scale: 0.9,
            x: "-50%"
          }}
          animate={{ 
            opacity: 1,
            y: 0,
            scale: 1,
            x: "-50%"
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut"
          }}
          style={{
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%)',
            backdropFilter: 'blur(4px)',
            borderRadius: '20px',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            padding: '2rem',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(6, 182, 212, 0.08)',
            rotateX,
            rotateY,
            translateZ: 60,
            // Performance optimizations
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitFontSmoothing: 'antialiased'
          }}
        >
          {/* Logo/Icon with 3D depth and mouse reactivity */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-5 flex justify-center"
            style={{ 
              transformStyle: 'preserve-3d',
              translateZ: iconZ
            }}
          >
            <div 
              className="w-16 h-16 sm:w-18 sm:h-18 bg-black/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 flex items-center justify-center shadow-2xl"
              style={{ 
                boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(6, 182, 212, 0.15)'
              }}
            >
              <Code className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </motion.div>

          {/* Name with 3D depth and mouse reactivity */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent"
            style={{ 
              translateZ: titleZ,
              textShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
            }}
          >
            Damien Demontis
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg text-gray-300 mb-8"
            style={{ 
              translateZ: subtitleZ
            }}
          >
            Full-Stack Developer
          </motion.p>

          {/* Current step with icon and mouse reactivity */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex items-center justify-center gap-3"
            style={{ 
              translateZ: stepZ
            }}
          >
            {steps.find(step => step.label === currentStep) && (
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {(() => {
                  const StepIcon = steps.find(step => step.label === currentStep)?.icon || Code
                  return <StepIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                })()}
              </motion.div>
            )}
            <span className="text-gray-300 text-sm">{currentStep}</span>
          </motion.div>

          {/* Progress bar with 3D depth and mouse reactivity */}
          <motion.div 
            className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-gray-600/30"
            style={{ 
              translateZ: progressZ,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-full relative overflow-hidden"
            >
              {/* Shine effect */}
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </motion.div>

          {/* Progress percentage with 3D positioning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-3 text-gray-400 text-sm font-medium text-center"
            style={{ 
              translateZ: useTransform(springY, [-1, 1], [5, 7])
            }}
          >
            {Math.round(progress)}%
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 