import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fishCounterRealtimeService } from '../../services/fishCounterRealtimeService'

interface MetalFishCounterProps {
  onFeedCat?: () => void
}

export default function MetalFishCounter({ onFeedCat }: MetalFishCounterProps) {
  const { t } = useTranslation()
  const [fishCount, setFishCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [justFed, setJustFed] = useState(false)
  const [floatingFish, setFloatingFish] = useState<{ id: number; x: number }[]>([])

  useEffect(() => {
    fetchFishCount()

    const unsubscribe = fishCounterRealtimeService.subscribeToFishCount((newCount) => {
      setFishCount(newCount)
    })

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
    if (justFed) return

    setJustFed(true)

    if (onFeedCat) onFeedCat()

    const optimisticCount = fishCount + 1
    setFishCount(optimisticCount)

    const newFish = {
      id: Date.now(),
      x: Math.random() * 80 - 40,
    }
    setFloatingFish((prev) => [...prev, newFish])

    setTimeout(() => {
      setFloatingFish((prev) => prev.filter((f) => f.id !== newFish.id))
    }, 1500)

    setTimeout(() => {
      setJustFed(false)
    }, 300)

    try {
      await fishCounterRealtimeService.incrementFishCount()
    } catch (error) {
      console.error('Failed to update fish count:', error)
    }
  }

  useEffect(() => {
    ;(window as any).__feedCat = feedCat
    return () => {
      delete (window as any).__feedCat
    }
  }, [justFed, fishCount])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-[rgba(255,255,255,0.12)] border-t-[rgba(255,255,255,0.4)] rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {floatingFish.map((fish) => (
          <motion.div
            key={fish.id}
            initial={{ opacity: 1, y: 0, x: fish.x, scale: 1 }}
            animate={{ opacity: 0, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-50 select-none"
          >
            <img src="/fish.svg" alt="fish" className="w-10 h-10 select-none" draggable="false" />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="text-center select-none">
        <motion.div
          animate={justFed ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-full select-none"
        >
          <img src="/fish.svg" alt="fish" className="w-6 h-6 select-none" draggable="false" />
          <span className="metal-chrome-text text-2xl font-bold">
            {fishCount.toLocaleString()}
          </span>
          <span className="text-[#8a8a8a] text-sm">
            {fishCount === 1 ? t('contact.form.fishCounter.fish') : t('contact.form.fishCounter.fishes')}
          </span>
        </motion.div>
        <p className="text-[#6b6b6b] text-xs mt-2 select-none">
          {t('contact.form.fishCounter.clickCat')}
        </p>
      </div>
    </div>
  )
}
