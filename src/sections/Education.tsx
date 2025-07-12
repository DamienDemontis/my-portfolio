import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GraduationCap, MapPin, Calendar, Award, Star } from 'lucide-react'

export const Education = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const institutions = ['epitech', 'keimyung', 'henri_poincare']

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  }

  return (
    <section id="education" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('education.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {institutions.map((institution, index) => {
            const highlights = t(`education.institutions.${institution}.highlights`, { returnObjects: true }) as string[]
            
            return (
              <motion.div
                key={institution}
                variants={cardVariants}
                className="card p-8 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start mb-6">
                  <div className={`w-16 h-16 rounded-xl ${
                    institution === 'epitech' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                      : institution === 'keimyung'
                      ? 'bg-gradient-to-r from-red-600 to-red-700'
                      : 'bg-gradient-to-r from-green-600 to-green-700'
                  } p-3 mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <GraduationCap className="w-full h-full text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {t(`education.institutions.${institution}.name`)}
                    </h3>
                    <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-3">
                      {t(`education.institutions.${institution}.degree`)}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{t(`education.institutions.${institution}.period`)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{t(`education.institutions.${institution}.location`)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GPA (only for EPITECH) */}
                {institution === 'epitech' && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {t(`education.institutions.${institution}.gpa`)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Top Student
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Highlights */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Key Highlights
                  </h4>
                  {highlights.map((highlight, highlightIndex) => (
                    <motion.div
                      key={highlightIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.5, delay: 0.5 + highlightIndex * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {highlight}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Special badge for international experience */}
                {institution === 'keimyung' && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🌏</span>
                      </div>
                      <span className="font-semibold text-purple-900 dark:text-purple-200">
                        International Experience
                      </span>
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Gained valuable cross-cultural experience and expanded global perspective through immersive study abroad program.
                    </p>
                  </div>
                )}

                {/* Special badge for academic foundation */}
                {institution === 'henri_poincare' && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🎓</span>
                      </div>
                      <span className="font-semibold text-green-900 dark:text-green-200">
                        Academic Foundation
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Built strong fundamentals in mathematics, sciences, and computer science that paved the way for advanced studies.
                    </p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional achievements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-12"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Academic Philosophy
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Education is not just about acquiring knowledge, but about developing critical thinking, 
              problem-solving skills, and the ability to adapt to rapidly changing technologies. 
              My journey through EPITECH and Keimyung University has shaped me into a well-rounded 
              developer with both technical expertise and global perspective.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 