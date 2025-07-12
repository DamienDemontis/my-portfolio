import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MapPin, Calendar, Plane, Heart, Target } from 'lucide-react'
import { useState } from 'react'

export const JourneyMap = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [activeLocation, setActiveLocation] = useState<string | null>(null)

  const journeyPoints = [
    {
      id: 'nancy',
      name: 'Nancy, France',
      position: { x: 20, y: 40 },
      period: '2020 - 2025',
      status: 'completed',
      description: 'Born and raised. EPITECH studies and professional development.',
      icon: '🇫🇷',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    },
    {
      id: 'daegu',
      name: 'Daegu, South Korea',
      position: { x: 80, y: 35 },
      period: 'Sept 2023 - July 2024',
      status: 'completed',
      description: 'Exchange year at Keimyung University. Game development, AI, and Korean culture immersion.',
      icon: '🇰🇷',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    },
    {
      id: 'seoul',
      name: 'Seoul, South Korea',
      position: { x: 80, y: 25 },
      period: '2025+',
      status: 'planned',
      description: 'Future tech hub destination. Seeking opportunities in innovative Korean companies.',
      icon: '🌟',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
    },
    {
      id: 'tokyo',
      name: 'Tokyo, Japan',
      position: { x: 85, y: 40 },
      period: '2025+',
      status: 'planned',
      description: 'Alternative destination. Fascinated by Japanese tech innovation and work culture.',
      icon: '🗾',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800'
    },
    {
      id: 'singapore',
      name: 'Singapore',
      position: { x: 70, y: 75 },
      period: '2025+',
      status: 'planned',
      description: 'International business hub. Perfect blend of East and West tech cultures.',
      icon: '🇸🇬',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const pointVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, type: "spring", bounce: 0.4 }
    }
  }

  return (
    <section id="journey" className="section-padding bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            My Journey to Asia
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From France to Korea and beyond - following my passion for Asian tech culture and innovation
          </p>
        </motion.div>

        <div ref={ref} className="relative">
          {/* Map Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
            className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-blue-100 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-2xl"
          >
            {/* Continents silhouettes */}
            <div className="absolute inset-0 opacity-20">
              {/* Europe */}
              <div className="absolute top-12 left-8 w-20 h-16 bg-gray-400 dark:bg-gray-600 rounded-lg transform rotate-12"></div>
              {/* Asia */}
              <div className="absolute top-8 right-8 w-32 h-24 bg-gray-400 dark:bg-gray-600 rounded-2xl transform -rotate-6"></div>
              {/* Southeast Asia */}
              <div className="absolute bottom-16 right-12 w-16 h-12 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Flight paths */}
            <svg className="absolute inset-0 w-full h-full">
              {/* France to Korea path - using percentage coordinates */}
              <motion.path
                d="M 20% 40% Q 50% 25% 80% 35%"
                stroke="url(#flightGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="10,5"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2, delay: 1 }}
              />
              {/* Korea to Seoul path */}
              <motion.path
                d="M 80% 35% Q 82% 30% 80% 25%"
                stroke="url(#futureGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.5, delay: 2.5 }}
              />
              {/* Korea to Tokyo path */}
              <motion.path
                d="M 80% 35% Q 82% 37% 85% 40%"
                stroke="url(#futureGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.5, delay: 3 }}
              />
              {/* Korea to Singapore path */}
              <motion.path
                d="M 80% 35% Q 75% 55% 70% 75%"
                stroke="url(#futureGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.5, delay: 3.5 }}
              />
              
              <defs>
                <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
                <linearGradient id="futureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Journey Points */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="absolute inset-0"
            >
              {journeyPoints.map((point, index) => (
                <motion.div
                  key={point.id}
                  variants={pointVariants}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  style={{ 
                    left: `${point.position.x}%`, 
                    top: `${point.position.y}%` 
                  }}
                  onClick={() => setActiveLocation(activeLocation === point.id ? null : point.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Point indicator */}
                  <div className={`relative w-6 h-6 rounded-full ${
                    point.status === 'completed' 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-purple-500 animate-bounce'
                  } shadow-lg border-2 border-white dark:border-gray-800`}>
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-2xl pointer-events-none">
                      {point.icon}
                    </div>
                    
                    {/* Ripple effect */}
                    <div className={`absolute inset-0 rounded-full ${
                      point.status === 'completed' ? 'bg-green-400' : 'bg-purple-400'
                    } animate-ping opacity-20`}></div>
                  </div>

                  {/* Location name */}
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none">
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg backdrop-blur-sm shadow-sm">
                      {point.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Floating plane animation following percentage coordinates */}
            <motion.div
              className="absolute text-2xl pointer-events-none z-20 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ left: "20%", top: "40%", rotate: 0 }}
              animate={inView ? { 
                left: ["20%", "50%", "80%"], 
                top: ["40%", "25%", "35%"],
                rotate: [0, 45, 0]
              } : { left: "20%", top: "40%", rotate: 0 }}
              transition={{ 
                duration: 3, 
                delay: 1,
                ease: "easeInOut" 
              }}
            >
              ✈️
            </motion.div>
          </motion.div>

          {/* Active location details */}
          {activeLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8"
            >
              {journeyPoints
                .filter(point => point.id === activeLocation)
                .map(point => (
                  <div key={point.id} className={`card p-6 ${point.bgColor} border`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl">{point.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {point.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {point.period}
                          {point.status === 'completed' && (
                            <span className="flex items-center gap-1 ml-2">
                              <Heart className="w-4 h-4 text-red-500 fill-current" />
                              <span className="text-green-600 dark:text-green-400 font-medium">Completed</span>
                            </span>
                          )}
                          {point.status === 'planned' && (
                            <span className="flex items-center gap-1 ml-2">
                              <Target className="w-4 h-4 text-purple-500" />
                              <span className="text-purple-600 dark:text-purple-400 font-medium">Planned</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                ))}
            </motion.div>
          )}
        </div>

        {/* Journey timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mt-12 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              The Adventure Continues...
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              My journey represents more than just geographic movement – it's about bridging cultures, 
              embracing innovation, and finding opportunities where East meets West. Each destination 
              has shaped my perspective as a developer and global citizen.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 