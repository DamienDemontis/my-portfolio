import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const optimizedLoading = async () => {
      // Critical images (AVIF = ~50% smaller than JPG/PNG)
      const criticalImages = [
        '/Damien.avif',
        '/about_pfp.avif'
      ]

      // All photography images used in PhotographyShowcase (AVIF format)
      const photographyImages = [
        '/photography/IMG_20240701_151842.avif',
        '/photography/IMG_20231006_110254.avif',
        '/photography/IMG_20231117_160650.avif',
        '/photography/IMG_20230820_063353.avif',
        '/photography/IMG_20231004_104055.avif',
        '/photography/IMG_20231107_155400.avif',
        '/photography/IMG_20231107_164957.avif',
        '/photography/IMG_20240111_184858.avif',
        '/photography/IMG_20240116_170340.avif',
        '/photography/IMG_20240503_183702.avif',
        '/photography/IMG_20240504_110543.avif',
        '/photography/IMG_20240504_120923_1.avif',
        '/photography/IMG_20240505_120320.avif',
        '/photography/IMG_20240505_142203.avif',
        '/photography/IMG_20240602_034858.avif',
        '/photography/IMG_20240630_203416.avif',
        '/photography/IMG_20240701_150338.avif',
        '/photography/IMG_20240701_200211.avif',
        '/photography/IMG_20240822_170729.avif',
        '/photography/IMG_20240403_130655.avif',
        '/photography/IMG_20240419_184403.avif',
        '/photography/IMG_20240504_110833.avif',
        '/photography/IMG_20240504_114735.avif',
        '/photography/IMG_20240531_232815.avif',
        '/photography/IMG_20240626_184532.avif',
        '/photography/IMG_20240630_181716.avif'
      ]

      const allImages = [...criticalImages, ...photographyImages]
      let loadedCount = 0

      // Function to preload an image with error handling
      const preloadImage = (src: string): Promise<void> => {
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = () => {
            loadedCount++
            const newProgress = Math.min(95, (loadedCount / allImages.length) * 95)
            setProgress(newProgress)
            resolve()
          }
          img.onerror = () => {
            console.warn(`Failed to preload image: ${src}`)
            loadedCount++
            const newProgress = Math.min(95, (loadedCount / allImages.length) * 95)
            setProgress(newProgress)
            resolve()
          }
          img.src = src
        })
      }

      // Load critical images first
      await Promise.all(criticalImages.map(src => preloadImage(src)))

      // Then load photography images in parallel with a limit
      const loadInBatches = async (images: string[], batchSize = 4) => {
        for (let i = 0; i < images.length; i += batchSize) {
          const batch = images.slice(i, i + batchSize)
          await Promise.all(batch.map(src => preloadImage(src)))
        }
      }

      await loadInBatches(photographyImages, 4)

      // Complete loading
      setProgress(100)

      // Wait for the progress animation to complete
      await new Promise(resolve => setTimeout(resolve, 500))
      onLoadingComplete()
    }

    optimizedLoading()
  }, [onLoadingComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8">
        {/* D² Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8
          }}
          className="mb-8"
        >
          <div className="relative inline-block">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-50"></div>

            {/* Logo container */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl border border-white/10">
              <span className="text-4xl font-bold text-white tracking-tight">D²</span>
            </div>

            {/* Rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-cyan-400/30"
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white mb-2"
        >
          Damien Demontis
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg text-blue-200 mb-12"
        >
          Full-Stack Developer
        </motion.p>

        {/* Progress bar container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-64 md:w-80 mx-auto"
        >
          {/* Progress text */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-300">Loading</span>
            <motion.span
              className="text-sm text-blue-300 font-mono"
              key={progress}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {progress}%
            </motion.span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-xl">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 rounded-full relative overflow-hidden"
            >
              {/* Shine effect */}
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 0.5
                }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-1 mt-8"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Add custom animations to global styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </motion.div>
  )
}