import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Globe, Palette, Users, Lightbulb, BookOpen, Gamepad2, Music, Headphones, Leaf, TrendingUp, Zap, Heart } from 'lucide-react'

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
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800',
      interests: [
        { name: 'Japanese Pop', description: 'Contemporary J-Pop and traditional sounds', icon: Headphones },
        { name: 'Electronic Music', description: 'Synthesizers, ambient, and electronic beats', icon: Zap },
        { name: 'Jazz', description: 'Classic and modern jazz improvisation', icon: Music },
        { name: 'French Classics', description: 'Chanson française and timeless melodies', icon: Heart }
      ]
    },
    {
      key: 'global_affairs',
      icon: Globe,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      interests: [
        { name: 'Ecology', description: 'Environmental sustainability and climate action', icon: Leaf },
        { name: 'Geopolitics', description: 'International relations and global dynamics', icon: Globe },
        { name: 'Asian Culture', description: 'Cultural exchange and Asian perspectives', icon: BookOpen }
      ]
    },
    {
      key: 'technology',
      icon: Brain,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      interests: [
        { name: 'Tech Innovation', description: 'Emerging technologies and future trends', icon: Lightbulb },
        { name: 'AI & Machine Learning', description: 'Artificial intelligence applications', icon: Brain },
        { name: 'Game Development', description: 'Unity, VR/AR, and interactive experiences', icon: Gamepad2 }
      ]
    },
    {
      key: 'personal_growth',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      interests: [
        { name: 'Cultural Exchange', description: 'International perspectives and diversity', icon: Users },
        { name: 'Continuous Learning', description: 'Personal and professional development', icon: BookOpen },
        { name: 'Community Building', description: 'Mentorship and knowledge sharing', icon: Users }
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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section id="interests" className="section-padding relative overflow-hidden">
      {/* Creative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-rose-900/10 dark:to-purple-900/10"></div>
      
      {/* Subtle floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 45, 0],
            y: [0, -40, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-8 right-0 w-48 h-48 bg-pink-400/6 dark:bg-pink-400/3 rounded-full blur-2xl"
        ></motion.div>
        <motion.div
          animate={{ 
            x: [0, -40, 0],
            y: [0, 45, 0],
            rotate: [0, -12, 0]
          }}
          transition={{ 
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 9
          }}
          className="absolute bottom-12 left-0 w-52 h-52 bg-purple-400/6 dark:bg-purple-400/3 rounded-3xl blur-2xl"
        ></motion.div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Glass container for header */}
          <div 
            className="backdrop-blur-xl bg-white/80 dark:bg-black/40 rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl max-w-3xl mx-auto"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-rose-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('interests.title')}
              </h2>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-rose-500 to-purple-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Personal passions that inspire creativity and drive innovation
            </p>
          </div>
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
                className="backdrop-blur-xl bg-white/70 dark:bg-black/30 rounded-3xl p-0 border border-white/40 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Header with gradient background */}
                <div className={`p-6 bg-gradient-to-br ${category.bgColor} border-b ${category.borderColor}`}>
                  <div className="flex items-center mb-4">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${category.color} p-2.5 mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <IconComponent className="w-full h-full text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {category.key === 'music' && 'Musical Tastes'}
                      {category.key === 'global_affairs' && 'Global Perspectives'}
                      {category.key === 'technology' && 'Tech Enthusiasm'}
                      {category.key === 'personal_growth' && 'Personal Growth'}
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
                        >
                          <motion.div 
                            whileHover={{ scale: 1.2 }}
                            transition={{ duration: 0.2 }}
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

        {/* Personal philosophy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-16"
        >
          <div 
            className="max-w-4xl mx-auto backdrop-blur-xl bg-white/80 dark:bg-black/40 rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-rose-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('sections.interests.passionDriven')}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('sections.interests.passionDrivenText')}
              <span className="block mt-4 font-semibold text-rose-600 dark:text-rose-400">
                {t('sections.interests.passionQuote')}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 