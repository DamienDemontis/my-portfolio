import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fishCounterRealtimeService } from '../services/fishCounterRealtimeService'

interface FishCounterProps {
  onFeedCat?: () => void
}

export const FishCounter = ({ onFeedCat }: FishCounterProps) => {
  const { t } = useTranslation()
  const [fishCount, setFishCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [justFed, setJustFed] = useState(false)
  const [floatingFish, setFloatingFish] = useState<{ id: number; x: number }[]>([])

  // Fetch initial count and subscribe to real-time updates
  useEffect(() => {
    fetchFishCount()

    // Subscribe to real-time updates
    const unsubscribe = fishCounterRealtimeService.subscribeToFishCount((newCount) => {
      setFishCount(newCount)
    })

    // Cleanup on unmount
    return () => {
      if (unsubscribe) unsubscribe()
      fishCounterRealtimeService.unsubscribe()
    }
  }, [])

  const fetchFishCount = async () => {
    try {
      const count = await fishCounterRealtimeService.getFishCount()
      setFishCount(count)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch fish count:', error)
      setLoading(false)
    }
  }

  const feedCat = async () => {
    // Prevent spam clicking
    if (justFed) return

    setJustFed(true)

    // Call parent callback if provided
    if (onFeedCat) onFeedCat()

    // Optimistic update (will be overridden by real-time update)
    const optimisticCount = fishCount + 1
    setFishCount(optimisticCount)

    // Add floating fish animation
    const newFish = {
      id: Date.now(),
      x: Math.random() * 80 - 40 // Random position
    }
    setFloatingFish(prev => [...prev, newFish])

    // Remove floating fish after animation
    setTimeout(() => {
      setFloatingFish(prev => prev.filter(f => f.id !== newFish.id))
    }, 1500)

    // Reset justFed after cooldown
    setTimeout(() => {
      setJustFed(false)
    }, 300)

    // Update backend (real-time will update all clients)
    try {
      await fishCounterRealtimeService.incrementFishCount()
      // No need to setFishCount here - real-time subscription will handle it
    } catch (error) {
      console.error('Failed to update fish count:', error)
    }
  }

  // Expose feedCat to parent via window for easy access
  useEffect(() => {
    (window as any).__feedCat = feedCat
    return () => {
      delete (window as any).__feedCat
    }
  }, [justFed, fishCount])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Floating Fish Animations */}
      <AnimatePresence>
        {floatingFish.map(fish => (
          <motion.div
            key={fish.id}
            initial={{ opacity: 1, y: 0, x: fish.x, scale: 1 }}
            animate={{ opacity: 0, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-50 select-none"
          >
            <img src="/fish.svg" alt="fish" className="w-10 h-10 select-none" draggable="false" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Fish Counter Display */}
      <div className="text-center select-none">
        <motion.div
          animate={justFed ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full border-2 border-orange-300 dark:border-orange-700 shadow-lg select-none"
        >
          <img src="/fish.svg" alt="fish" className="w-6 h-6 select-none" draggable="false" />
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {fishCount.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {fishCount === 1 ? t('contact.form.fishCounter.fish') : t('contact.form.fishCounter.fishes')}
          </span>
        </motion.div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 select-none">
          {t('contact.form.fishCounter.clickCat')}
        </p>
      </div>
    </div>
  )
}
