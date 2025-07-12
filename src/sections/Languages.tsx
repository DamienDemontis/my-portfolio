import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Languages as LanguagesIcon, Award, Globe } from 'lucide-react'

export const Languages = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const languages = ['french', 'english', 'korean']

  const getLanguageFlag = (language: string) => {
    const flags = {
      french: '🇫🇷',
      english: '🇬🇧',
      korean: '🇰🇷'
    }
    return flags[language as keyof typeof flags] || '🌐'
  }

  const getLanguageColor = (language: string) => {
    const colors = {
      french: 'from-blue-500 to-white',
      english: 'from-red-500 to-blue-600',
      korean: 'from-red-500 to-blue-500'
    }
    return colors[language as keyof typeof colors] || 'from-gray-400 to-gray-600'
  }

  const getProgressPercentage = (language: string) => {
    const percentages = {
      french: 100,    // C1 - Native
      english: 75,    // B1 - Professional
      korean: 40      // A2 - Elementary
    }
    return percentages[language as keyof typeof percentages] || 0
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section id="languages" className="section-padding bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('languages.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Communication across cultures and borders
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {languages.map((language) => {
            const progressPercentage = getProgressPercentage(language)
            
            return (
              <motion.div
                key={language}
                variants={cardVariants}
                className="card p-6 hover:shadow-xl transition-all duration-300 group hover:scale-105"
              >
                {/* Language Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">
                    {getLanguageFlag(language)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {t(`languages.items.${language}.name`)}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="text-primary-600 dark:text-primary-400 font-semibold">
                      {t(`languages.items.${language}.level`)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t(`languages.items.${language}.description`)}
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
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                      animate={inView ? { 
                        strokeDashoffset: 2 * Math.PI * 45 * (1 - progressPercentage / 100)
                      } : { strokeDashoffset: 2 * Math.PI * 45 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className="text-primary-400" stopColor="currentColor" />
                        <stop offset="100%" className="text-primary-600" stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Percentage in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span 
                      className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      {progressPercentage}%
                    </motion.span>
                  </div>
                </div>

                {/* Proficiency Description */}
                <div className="text-center">
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={inView ? { scale: 1 } : { scale: 0 }}
                        transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                        className={`w-3 h-3 rounded-full ${
                          index < Math.floor(progressPercentage / 20)
                            ? 'bg-primary-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Special badges */}
                  {language === 'french' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 mt-3">
                      <span className="text-blue-800 dark:text-blue-200 text-xs font-medium">
                        Native Speaker
                      </span>
                    </div>
                  )}
                  
                  {language === 'english' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 mt-3">
                      <span className="text-green-800 dark:text-green-200 text-xs font-medium">
                        TOEIC 945/990
                      </span>
                    </div>
                  )}
                  
                  {language === 'korean' && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-2 mt-3">
                      <span className="text-purple-800 dark:text-purple-200 text-xs font-medium">
                        Study Abroad
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Language proficiency scale */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-12 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              European Framework Reference
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="font-semibold text-green-800 dark:text-green-200">C1-C2</div>
                <div className="text-green-600 dark:text-green-300">Proficient User</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="font-semibold text-blue-800 dark:text-blue-200">B1-B2</div>
                <div className="text-blue-600 dark:text-blue-300">Independent User</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                <div className="font-semibold text-purple-800 dark:text-purple-200">A1-A2</div>
                <div className="text-purple-600 dark:text-purple-300">Basic User</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 