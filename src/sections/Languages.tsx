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
      french: 'Native',
      english: 'C1 Fluent',
      italian: 'Conversational',
      korean: 'A2 Elementary'
    }
    return levels[language as keyof typeof levels] || 'Beginner'
  }

  const getLanguageDescription = (language: string) => {
    const descriptions = {
      french: 'Native speaker with perfect fluency',
      english: 'Fully fluent - professional proficiency (TEPITECH 945)',
      italian: 'Conversational level - half Italian heritage',
      korean: 'Elementary level from study abroad experience'
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <section id="languages" className="section-padding relative overflow-hidden">
      {/* Cultural Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/10 dark:to-purple-900/10"></div>
      
      {/* Subtle floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 40, 0],
            y: [0, -35, 0],
            rotate: [0, 12, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-12 right-4 w-40 h-40 bg-indigo-400/5 dark:bg-indigo-400/3 rounded-full blur-2xl"
        ></motion.div>
        <motion.div
          animate={{ 
            x: [0, -35, 0],
            y: [0, 40, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ 
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
          className="absolute bottom-16 left-8 w-44 h-44 bg-purple-400/5 dark:bg-purple-400/3 rounded-2xl blur-2xl"
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
              <Globe className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('languages.title')}
              </h2>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Multilingual communication across cultures and borders
            </p>
          </div>
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
                className="backdrop-blur-xl bg-white/70 dark:bg-black/30 rounded-3xl p-6 border border-white/40 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
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
                    <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
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
                      transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
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
                      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
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
                        TOEIC 945/990
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
                    y: [0, -12, 0],
                    rotate: [0, 15, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 1.2
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white/40 backdrop-blur-xl rounded-full border border-white/60 flex items-center justify-center shadow-lg"
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
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-16 text-center"
        >
          <div 
            className="max-w-4xl mx-auto backdrop-blur-xl bg-white/80 dark:bg-black/40 rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Multilingual Communication
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4">
                <div className="font-semibold text-green-800 dark:text-green-200">Native</div>
                <div className="text-green-600 dark:text-green-300">Mother Tongue</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                <div className="font-semibold text-blue-800 dark:text-blue-200">B1+</div>
                <div className="text-blue-600 dark:text-blue-300">Professional</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                <div className="font-semibold text-red-800 dark:text-red-200">Conversational</div>
                <div className="text-red-600 dark:text-red-300">Heritage</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4">
                <div className="font-semibold text-purple-800 dark:text-purple-200">A2</div>
                <div className="text-purple-600 dark:text-purple-300">Elementary</div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Language diversity enables effective communication across international teams and cultures, 
              essential for global technology collaboration and my upcoming relocation to Asia.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 