import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, Globe, BookOpen } from 'lucide-react'
import { FlagIcon } from '../components/common/FlagIcon'

export const Languages = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

  const languages = [
    { key: 'french', countryCode: 'fr' },
    { key: 'english', countryCode: 'gb' },
    { key: 'italian', countryCode: 'it' },
    { key: 'korean', countryCode: 'kr' }
  ]

  const getProgressPercentage = (language: string) => {
    const percentages = {
      french: 100,    // Native
      english: 95,    // C1/TEPITECH 945
      italian: 60,    // Conversational (half Italian)
      korean: 40      // A2
    }
    return percentages[language as keyof typeof percentages] || 0
  }

  const getLanguageLevel = (language: string) => {
    const levels = {
      french: t('languages.native'),
      english: t('languages.c2Fluent'),
      italian: t('languages.conversational'),
      korean: t('languages.a2Elementary')
    }
    return levels[language as keyof typeof levels] || 'Beginner'
  }

  const getLanguageDescription = (language: string) => {
    const descriptions = {
      french: t('languages.nativeSpeaker'),
      english: t('languages.fullyFluent'),
      italian: t('languages.conversationalLevel'),
      korean: t('languages.elementaryLevel')
    }
    return descriptions[language as keyof typeof descriptions] || 'Learning'
  }

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

  return (
    <section id="languages" className="section-padding relative overflow-hidden">
      {/* Cultural Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20"></div>
      
      {/* Subtle floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-12 right-4 w-40 h-40 bg-blue-100/30 dark:bg-blue-900/10 rounded-full"></div>
        <div className="absolute bottom-16 left-8 w-44 h-44 bg-cyan-100/30 dark:bg-cyan-900/10 rounded-2xl"></div>
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
              <Globe className="w-6 h-6 text-white" />
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
              {t('languages.title')}
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
          className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {languages.map((language, index) => {
            const progressPercentage = getProgressPercentage(language.key)
            
            return (
              <motion.div
                key={language.key}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)'
                }}
                className="bg-white/80 dark:bg-black/50 rounded-3xl p-6 border border-white/40 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-200 group"
              >
                {/* Language Header */}
                <div className="text-center mb-6">
                  <div className="mb-4 flex justify-center">
                    <FlagIcon countryCode={language.countryCode} size={64} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {t(`languages.items.${language.key}.name`) || language.key.charAt(0).toUpperCase() + language.key.slice(1)}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      {getLanguageLevel(language.key)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {getLanguageDescription(language.key)}
                  </p>
                </div>

                {/* Progress Circle */}
                <div className="relative flex items-center justify-center mb-6">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={`url(#gradient-${language.key})`}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                      animate={inView ? { 
                        strokeDashoffset: 2 * Math.PI * 45 * (1 - progressPercentage / 100)
                      } : { strokeDashoffset: 2 * Math.PI * 45 }}
                      transition={{ duration: 1.0, delay: 0.3 + index * 0.1 }}
                    />
                    <defs>
                      <linearGradient id={`gradient-${language.key}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className={`text-${language.key === 'french' ? 'blue' : language.key === 'english' ? 'red' : language.key === 'korean' ? 'purple' : 'green'}-400`} stopColor="currentColor" />
                        <stop offset="100%" className={`text-${language.key === 'french' ? 'red' : language.key === 'english' ? 'blue' : language.key === 'korean' ? 'blue' : 'red'}-600`} stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Percentage in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span 
                      className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      {progressPercentage}%
                    </motion.span>
                  </div>
                </div>

                {/* Special badges */}
                <div className="space-y-2">
                  {language.key === 'french' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                      <span className="text-blue-800 dark:text-blue-200 text-xs font-medium flex items-center gap-2">
                        <FlagIcon countryCode="fr" size={16} />
                        Native Speaker
                      </span>
                    </div>
                  )}
                  
                  {language.key === 'english' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
                      <span className="text-green-800 dark:text-green-200 text-xs font-medium flex items-center gap-2">
                        <FlagIcon countryCode="gb" size={16} />
                        TEPITECH 945/990
                      </span>
                    </div>
                  )}
                  
                  {language.key === 'korean' && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-3">
                      <span className="text-purple-800 dark:text-purple-200 text-xs font-medium flex items-center gap-2">
                        <FlagIcon countryCode="kr" size={16} />
                        Study Abroad
                      </span>
                    </div>
                  )}

                  {language.key === 'italian' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                      <span className="text-red-800 dark:text-red-200 text-xs font-medium flex items-center gap-2">
                        <FlagIcon countryCode="it" size={16} />
                        Half Italian
                      </span>
                    </div>
                  )}
                </div>

                {/* Floating element */}
                <motion.div
                  animate={{ 
                    y: [0, -6, 0],
                    rotate: [0, 8, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 1.2
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white/70 rounded-full border border-white/60 flex items-center justify-center shadow-lg"
                >
                  <BookOpen className="w-3 h-3 text-indigo-500" />
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Language proficiency framework */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div 
            className="max-w-4xl mx-auto bg-white/90 dark:bg-black/60 rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('languages.multilingualCommunication')}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4">
                <div className="font-semibold text-green-800 dark:text-green-200">{t('languages.native')}</div>
                <div className="text-green-600 dark:text-green-300">{t('languages.motherTongue')}</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                <div className="font-semibold text-blue-800 dark:text-blue-200">{t('languages.b1Plus')}</div>
                <div className="text-blue-600 dark:text-blue-300">{t('languages.professional')}</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                <div className="font-semibold text-red-800 dark:text-red-200">{t('languages.conversational')}</div>
                <div className="text-red-600 dark:text-red-300">{t('languages.heritage')}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4">
                <div className="font-semibold text-purple-800 dark:text-purple-200">{t('languages.a2')}</div>
                <div className="text-purple-600 dark:text-purple-300">{t('languages.elementary')}</div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('languages.languageDiversityDesc')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 