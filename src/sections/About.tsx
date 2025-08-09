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
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
      
      {/* Optimized background elements - No expensive blur filters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-20"
             style={{
               background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 70%, transparent 100%)',
               boxShadow: '0 0 60px 20px rgba(59, 130, 246, 0.05)'
             }}></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 rounded-full opacity-20"
             style={{
               background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0.02) 70%, transparent 100%)',
               boxShadow: '0 0 60px 20px rgba(147, 51, 234, 0.05)'
             }}></div>
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
            {/* Glass container for content */}
            <div 
              className="backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-3xl p-8 lg:p-12 border border-white/20 dark:border-gray-700/20 shadow-2xl"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
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
                        scale: 1.05,
                        rotateY: 5,
                        transition: { duration: 0.2 }
                      }}
                      className={`backdrop-blur-xl bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
                      style={{
                        backdropFilter: 'blur(15px)',
                        WebkitBackdropFilter: 'blur(15px)',
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} p-2.5 mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
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
                  y: [0, -15, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <Coffee className="w-8 h-8 text-yellow-400" />
              </motion.div>

              {/* Interactive Heart Easter Egg */}
              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                  scale: isHeartFilled ? [1, 1.5, 1.2] : 1
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg cursor-pointer hover:scale-110 transition-transform focus:outline-none select-none"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
                onClick={() => {
                  setIsHeartFilled(!isHeartFilled);
                  setIsSmiling(!isSmiling);
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                tabIndex={-1}
              >
                <motion.div
                  animate={{
                    scale: isHeartFilled ? [1, 2.5, 1.5, 1.8, 1.3] : 1,
                    rotate: isHeartFilled ? [0, 45, -30, 15, 0] : 0,
                    y: isHeartFilled ? [0, -20, 0, -10, 0] : 0
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    times: [0, 0.3, 0.6, 0.8, 1]
                  }}
                >
                  <Heart 
                    className={`w-8 h-8 transition-all duration-500 ${
                      isHeartFilled 
                        ? 'text-red-500 fill-red-500 drop-shadow-lg' 
                        : 'text-red-400'
                    }`} 
                  />
                  
                  {/* Particle effects when heart is filled */}
                  {isHeartFilled && (
                    <>
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      >
                        {/* Sparkle particles */}
                        {[...Array(8)].map((_, i) => (
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
                              x: 16 + (Math.cos(i * 45 * Math.PI / 180) * 40),
                              y: 16 + (Math.sin(i * 45 * Math.PI / 180) * 40),
                              scale: [0, 1, 0],
                              opacity: [1, 1, 0]
                            }}
                            transition={{ 
                              duration: 0.8,
                              delay: 0.2,
                              ease: "easeOut"
                            }}
                          />
                        ))}
                      </motion.div>
                    </>
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