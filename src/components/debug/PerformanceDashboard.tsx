import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PerformanceStats {
  fps: number
  memory: {
    used: number
    total: number
    limit: number
  }
  renderTime: number
}

export const PerformanceDashboard = ({ enabled = process.env.NODE_ENV === 'development' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    memory: { used: 0, total: 0, limit: 0 },
    renderTime: 0
  })

  useEffect(() => {
    if (!enabled) return

    let frameCount = 0
    let lastTime = 0
    let animationFrameId: number

    const updateStats = (currentTime: number) => {
      frameCount++
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        frameCount = 0
        lastTime = currentTime

        // Get memory info
        let memory = { used: 0, total: 0, limit: 0 }
        if ('memory' in performance) {
          const perfMemory = (performance as any).memory
          memory = {
            used: Math.round(perfMemory.usedJSHeapSize / 1048576),
            total: Math.round(perfMemory.totalJSHeapSize / 1048576),
            limit: Math.round(perfMemory.jsHeapSizeLimit / 1048576)
          }
        }

        setStats(prev => ({ ...prev, fps, memory }))
      }
      
      animationFrameId = requestAnimationFrame(updateStats)
    }

    animationFrameId = requestAnimationFrame(updateStats)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white p-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20 hover:bg-black/90 transition-all duration-200"
        style={{ fontSize: '12px' }}
      >
        📊
      </button>

      {/* Dashboard */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-16 right-4 z-[9998] bg-black/90 text-white p-4 rounded-lg shadow-xl backdrop-blur-sm border border-white/20 min-w-[200px]"
            style={{ fontSize: '12px' }}
          >
            <h3 className="font-bold mb-2 text-center">Performance Monitor</h3>
            
            <div className="space-y-2">
              {/* FPS */}
              <div className="flex justify-between">
                <span>FPS:</span>
                <span className={stats.fps < 30 ? 'text-red-400' : stats.fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
                  {stats.fps}
                </span>
              </div>

              {/* Memory */}
              <div className="flex justify-between">
                <span>Memory:</span>
                <span className={stats.memory.used > stats.memory.limit * 0.8 ? 'text-red-400' : 'text-white'}>
                  {stats.memory.used}MB
                </span>
              </div>

              {/* Memory Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    stats.memory.used > stats.memory.limit * 0.8 ? 'bg-red-400' :
                    stats.memory.used > stats.memory.limit * 0.6 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                  style={{ 
                    width: `${Math.min((stats.memory.used / stats.memory.limit) * 100, 100)}%` 
                  }}
                />
              </div>

              {/* Memory Details */}
              <div className="text-xs text-gray-400">
                {stats.memory.used}/{stats.memory.limit}MB
              </div>

              {/* Performance Tips */}
              {stats.fps < 30 && (
                <div className="text-xs text-red-400 mt-2 p-2 bg-red-900/20 rounded">
                  ⚠️ Low FPS detected. Check animations and re-renders.
                </div>
              )}

              {stats.memory.used > stats.memory.limit * 0.8 && (
                <div className="text-xs text-red-400 mt-2 p-2 bg-red-900/20 rounded">
                  ⚠️ High memory usage. Check for memory leaks.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 