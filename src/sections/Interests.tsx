import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Globe, Palette, Users, Lightbulb, BookOpen, Gamepad2, Music, Headphones, Leaf, Zap, Heart } from 'lucide-react'

export const Interests = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

  const interestCategories = [
    {
      key: 'music',
      icon: Music,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-cyan-800',
      interests: [
        { name: t('interests.japanesePopTitle'), description: t('interests.japanesePopDesc'), icon: Headphones },
        { name: t('interests.electronicMusicTitle'), description: t('interests.electronicMusicDesc'), icon: Zap },
        { name: t('interests.jazzTitle'), description: t('interests.jazzDesc'), icon: Music },
        { name: t('interests.frenchClassicsTitle'), description: t('interests.frenchClassicsDesc'), icon: Heart }
      ]
    },
    {
      key: 'global_affairs',
      icon: Globe,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      interests: [
        { name: t('interests.ecologyTitle'), description: t('interests.ecologyDesc'), icon: Leaf },
        { name: t('interests.geopoliticsTitle'), description: t('interests.geopoliticsDesc'), icon: Globe },
        { name: t('interests.asianCultureTitle'), description: t('interests.asianCultureDesc'), icon: BookOpen }
      ]
    },
    {
      key: 'technology',
      icon: Brain,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      interests: [
        { name: t('interests.techInnovationTitle'), description: t('interests.techInnovationDesc'), icon: Lightbulb },
        { name: t('interests.aiMlTitle'), description: t('interests.aiMlDesc'), icon: Brain },
        { name: t('interests.gameDevTitle'), description: t('interests.gameDevDesc'), icon: Gamepad2 }
      ]
    },
    {
      key: 'personal_growth',
      icon: Users,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20',
      borderColor: 'border-cyan-200 dark:border-blue-800',
      interests: [
        { name: t('interests.culturalExchangeTitle'), description: t('interests.culturalExchangeDesc'), icon: Users },
        { name: t('interests.continuousLearningTitle'), description: t('interests.continuousLearningDesc'), icon: BookOpen },
        { name: t('interests.communityBuildingTitle'), description: t('interests.communityBuildingDesc'), icon: Heart }
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <section id="interests" className="section-padding relative overflow-hidden">
      {/* Creative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900"></div>
      
      {/* Subtle floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-8 right-0 w-48 h-48 bg-blue-100/30 dark:bg-blue-900/10 rounded-full"></div>
        <div className="absolute bottom-12 left-0 w-52 h-52 bg-cyan-100/30 dark:bg-cyan-900/10 rounded-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Clean Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Beautiful Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              {t('interests.title')}
            </span>
          </motion.h2>

          {/* Elegant Decorative Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mb-6 flex items-center justify-center"
          >
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full"></div>
            <div className="absolute w-32 h-3 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-500/20 blur-sm rounded-full"></div>
          </motion.div>

        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-8"
        >
          {interestCategories.map((category) => {
            const IconComponent = category.icon
            
            return (
              <motion.div
                key={category.key}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)'
                }}
                className="bg-white/80 dark:bg-black/50 rounded-3xl p-0 border border-white/40 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-200 group overflow-hidden"
              >
                {/* Header with gradient background */}
                <div className={`p-6 bg-gradient-to-br ${category.bgColor} border-b ${category.borderColor}`}>
                  <div className="flex items-center mb-4">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        willChange: 'transform',
                        transform: 'translateZ(0)'
                      }}
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${category.color} p-2.5 mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-200`}
                    >
                      <IconComponent className="w-full h-full text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {category.key === 'music' && t('interests.musicalTastes')}
                      {category.key === 'global_affairs' && t('interests.globalPerspectives')}
                      {category.key === 'technology' && t('interests.techEnthusiasm')}
                      {category.key === 'personal_growth' && t('interests.personalGrowth')}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <motion.div
                    variants={containerVariants}
                    className="space-y-4"
                  >
                    {category.interests.map((interest, index) => {
                      const InterestIcon = interest.icon
                      
                      return (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 group/item border border-white/30 dark:border-gray-700/30"
                          style={{
                            willChange: 'transform',
                            transform: 'translateZ(0)'
                          }}
                        >
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              willChange: 'transform',
                              transform: 'translateZ(0)'
                            }}
                            className={`flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-r ${category.color} shadow-lg`}
                          >
                            <InterestIcon className="w-5 h-5 text-white" />
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {interest.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {interest.description}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>

              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
} 