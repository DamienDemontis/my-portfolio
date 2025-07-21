import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Code, Users, BookOpen, Trophy, Sparkles, Heart, Brain } from 'lucide-react'

export const About = () => {
  const { t } = useTranslation()
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
      
      {/* Simplified background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-400/5 dark:bg-blue-400/3 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-purple-400/5 dark:bg-purple-400/3 rounded-full blur-xl"></div>
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
                  <Sparkles className="w-8 h-8 text-blue-500" />
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
              {/* Main visual container */}
              <div 
                className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl shadow-2xl relative overflow-hidden border border-white/20"
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                {/* Animated overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30"></div>
                
                {/* Floating decorative elements */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-6 right-6 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30"
                ></motion.div>
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-6 left-6 w-20 h-20 bg-white/15 backdrop-blur-sm rounded-full border border-white/30"
                ></motion.div>
                
                {/* Enhanced floating tech stack */}
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-12 left-12 bg-white/20 backdrop-blur-xl rounded-xl px-4 py-2 text-sm font-bold text-white border border-white/30 shadow-lg"
                >
                  React
                </motion.div>
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-16 right-8 bg-white/20 backdrop-blur-xl rounded-xl px-4 py-2 text-sm font-bold text-white border border-white/30 shadow-lg"
                >
                  TypeScript
                </motion.div>
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [-3, 7, -3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-24 left-8 bg-white/20 backdrop-blur-xl rounded-xl px-4 py-2 text-sm font-bold text-white border border-white/30 shadow-lg"
                >
                  Python
                </motion.div>
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [7, -3, 7] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="absolute bottom-12 right-12 bg-white/20 backdrop-blur-xl rounded-xl px-4 py-2 text-sm font-bold text-white border border-white/30 shadow-lg"
                >
                  Docker
                </motion.div>

                {/* Center content with enhanced styling */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <motion.div 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 mx-auto border border-white/30 shadow-2xl"
                    >
                      <Code className="w-16 h-16" />
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-xl font-bold mb-2 drop-shadow-lg"
                    >
                      Full Stack
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-lg drop-shadow-lg"
                    >
                      Developer
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Floating elements around the main visual */}
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
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <Heart className="w-8 h-8 text-red-400" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 