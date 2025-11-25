import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Code, Users, BookOpen, Trophy, Coffee, Heart, Brain } from 'lucide-react'
import { PokemonProfileCard } from '../components/PokemonProfileCard'
import { useState, useEffect } from 'react'
import { isLowEndDevice } from '../utils/performanceOptimizations'

export const About = () => {
  const { t } = useTranslation()
  const [isHeartFilled, setIsHeartFilled] = useState(false)
  const [isSmiling, setIsSmiling] = useState(false)
  const [isLowEnd, setIsLowEnd] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

  useEffect(() => {
    setIsLowEnd(isLowEndDevice())
  }, [])

  const stats = [
    {
      icon: Code,
      value: t('about.stats.experience'),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      icon: Trophy,
      value: t('about.stats.projects'),
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    {
      icon: BookOpen,
      value: t('about.stats.technologies'),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      icon: Users,
      value: t('about.stats.mentoring'),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20"></div>

      {/* Optimized background elements - Simple gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-10 w-32 h-32 rounded-full bg-blue-100/30 dark:bg-blue-400/10"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        ></div>
        <div
          className="absolute bottom-32 left-16 w-24 h-24 rounded-full bg-blue-100/30 dark:bg-blue-400/10"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Content */}
          <div className="order-2 lg:order-1">
            {/* Solid container for content */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 lg:p-12 border border-white/30 dark:border-gray-700/30 shadow-xl"
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)'
              }}
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                {/* Clean Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block mb-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                </motion.div>

                {/* Beautiful Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
                >
                  <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                    {t('about.title')}
                  </span>
                </motion.h2>

                {/* Elegant Decorative Line */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="relative mb-8 flex items-center justify-center"
                >
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full"></div>
                  <div className="absolute w-32 h-3 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-500/20 blur-sm rounded-full"></div>
                </motion.div>

              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('about.description')}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <Brain className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('about.aspiration')}
                  </p>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4"
              >
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <motion.div
                      key={index}
                      variants={statsVariants}
                      whileHover={!isLowEnd ? {
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      } : {}}
                      className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer`}
                      style={{
                        willChange: 'transform',
                        transform: 'translateZ(0)'
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} p-2.5 mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-200`}
                          style={{
                            willChange: 'transform',
                            transform: 'translateZ(0)'
                          }}
                        >
                          <IconComponent className="w-full h-full text-white" />
                        </div>
                        <p className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                          {stat.value}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </div>

          {/* Enhanced Visual */}
          <motion.div
            variants={itemVariants}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Pokemon Profile Card */}
              <PokemonProfileCard
                isSmiling={isSmiling}
                onContactClick={() => {
                  // Scroll to contact section
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="max-w-sm w-full"
              />

              {/* Floating elements around the Pokemon card - OPTIMIZED: removed rotate */}
              <motion.div
                animate={!isLowEnd ? {
                  y: [0, -8, 0]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-6 -right-6 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg"
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)'
                }}
              >
                <Coffee className="w-8 h-8 text-yellow-400" />
              </motion.div>

              {/* Interactive Heart Easter Egg - OPTIMIZED: removed rotate, simplified */}
              <motion.div
                animate={!isLowEnd ? {
                  y: [0, 5, 0]
                } : {}}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-6 -left-6 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none select-none"
                style={{
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  willChange: 'transform',
                  transform: 'translateZ(0)'
                }}
                onClick={() => {
                  setIsHeartFilled(!isHeartFilled);
                  setIsSmiling(!isSmiling);
                }}
                whileHover={!isLowEnd ? { scale: 1.02 } : {}}
                whileTap={!isLowEnd ? { scale: 0.95 } : {}}
                tabIndex={-1}
              >
                <motion.div
                  animate={{
                    scale: isHeartFilled ? [1, 1.2, 1.1] : 1
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                  style={{
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                  }}
                >
                  <Heart
                    className={`w-8 h-8 transition-all duration-200 ${isHeartFilled
                        ? 'text-red-500 fill-red-500'
                        : 'text-red-400'
                      }`}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}