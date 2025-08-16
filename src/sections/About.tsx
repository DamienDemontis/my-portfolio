import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Code, Users, BookOpen, Trophy, Coffee, Heart, Brain } from 'lucide-react'
import { PokemonProfileCard } from '../components/PokemonProfileCard'
import { useState } from 'react'

export const About = () => {
  const { t } = useTranslation()
  const [isHeartFilled, setIsHeartFilled] = useState(false)
  const [isSmiling, setIsSmiling] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

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
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
      
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
          className="absolute bottom-32 left-16 w-24 h-24 rounded-full bg-purple-100/30 dark:bg-purple-400/10"
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
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-3 mb-6">
                  <Coffee className="w-8 h-8 text-blue-500" />
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {t('about.title')}
                  </h2>
                </div>
                <h3 className="text-xl md:text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold mb-8">
                  {t('about.intro')}
                </h3>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('about.description')}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <Brain className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
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
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
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

              {/* Floating elements around the Pokemon card */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 5, 0]
                }}
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

              {/* Interactive Heart Easter Egg */}
              <motion.div
                animate={{ 
                  y: [0, 5, 0],
                  rotate: [0, -3, 0],
                  scale: isHeartFilled ? [1, 1.1, 1.05] : 1
                }}
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                tabIndex={-1}
              >
                <motion.div
                  animate={{
                    scale: isHeartFilled ? [1, 1.3, 1.1] : 1,
                    rotate: isHeartFilled ? [0, 15, -5, 0] : 0,
                    y: isHeartFilled ? [0, -5, 0] : 0
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  style={{
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                  }}
                >
                  <Heart 
                    className={`w-8 h-8 transition-all duration-200 ${
                      isHeartFilled 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-red-400'
                    }`} 
                  />
                  
                  {/* Simplified particle effects when heart is filled */}
                  {isHeartFilled && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {/* Simplified sparkle particles */}
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-red-400 rounded-full"
                          initial={{ 
                            x: 16, 
                            y: 16, 
                            scale: 0,
                            opacity: 1 
                          }}
                          animate={{ 
                            x: 16 + (Math.cos(i * 90 * Math.PI / 180) * 20),
                            y: 16 + (Math.sin(i * 90 * Math.PI / 180) * 20),
                            scale: [0, 1, 0],
                            opacity: [1, 1, 0]
                          }}
                          transition={{ 
                            duration: 0.4,
                            delay: 0.1,
                            ease: "easeOut"
                          }}
                          style={{
                            willChange: 'transform',
                            transform: 'translateZ(0)'
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 