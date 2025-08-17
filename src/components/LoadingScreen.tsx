import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Code, Palette, Globe, Zap } from 'lucide-react'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  const steps = [
    { label: 'Loading portfolio data...', icon: Code, duration: 800 },
    { label: 'Optimizing animations...', icon: Zap, duration: 600 },
    { label: 'Preparing assets...', icon: Palette, duration: 700 },
    { label: 'Finalizing experience...', icon: Globe, duration: 500 }
  ]

  useEffect(() => {
    const preloadAssets = async () => {
      // Preload hero image and ALL photography images for seamless experience
      const imagesToPreload = [
        '/Damien.jpg', // Hero image
        // All photography images
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

      const imagePromises = imagesToPreload.map((src) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = resolve
          img.onerror = resolve // Continue even if some images fail
          img.src = src
        })
      })

      // Simulate loading steps with actual work
      let currentProgress = 0
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        setCurrentStep(step.label)
        
        if (i === 0) {
          // Load critical images during first step
          await Promise.all(imagePromises)
        }
        
        // Gradual progress for this step - optimized for better performance
        const stepProgress = 25 // Each step is 25%
        const stepStartProgress = currentProgress
        const stepEndProgress = currentProgress + stepProgress
        
        const stepDuration = step.duration
        const progressInterval = 16 // 60fps updates
        const progressSteps = stepDuration / progressInterval
        const progressIncrement = stepProgress / progressSteps
        
        for (let j = 0; j < progressSteps; j++) {
          await new Promise(resolve => {
            requestAnimationFrame(() => {
              setTimeout(resolve, progressInterval)
            })
          })
          currentProgress = Math.min(stepStartProgress + (progressIncrement * (j + 1)), stepEndProgress)
          setProgress(currentProgress)
        }
      }

      // Final completion
      setProgress(100)
      setCurrentStep('Welcome!')
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Trigger the crossfade transition
      onLoadingComplete()
    }

    preloadAssets()
  }, [onLoadingComplete])

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)', // Force GPU acceleration
          }}
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)', // Force GPU acceleration
          }}
        />
      </div>

      {/* Main loading content */}
      <div className="text-center text-white relative z-10 max-w-md px-8">
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center shadow-2xl">
            <Code className="w-10 h-10" />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
        >
          Damien Demontis
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg text-blue-100 mb-12"
        >
          Full-Stack Developer
        </motion.p>

        {/* Current step with icon */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-center gap-3"
        >
          {steps.find(step => step.label === currentStep) && (
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              {(() => {
                const StepIcon = steps.find(step => step.label === currentStep)?.icon || Code
                return <StepIcon className="w-5 h-5 text-blue-300" />
              })()}
            </motion.div>
          )}
          <span className="text-blue-100 text-sm">{currentStep}</span>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full relative overflow-hidden"
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
        </div>

        {/* Progress percentage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-white/80 text-sm font-medium"
        >
          {Math.round(progress)}%
        </motion.div>
      </div>
    </div>
  )
} 