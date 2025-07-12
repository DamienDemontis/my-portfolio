import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, Calendar, Building, CheckCircle } from 'lucide-react'

export const Certifications = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const certifications = ['ionis']

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
    <section id="certifications" className="section-padding bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('certifications.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('certifications.subtitle')}
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-1 gap-8 max-w-4xl mx-auto"
        >
          {certifications.map((cert) => {
            const topics = t(`certifications.items.${cert}.topics`, { returnObjects: true }) as string[]
            
            return (
              <motion.div
                key={cert}
                variants={cardVariants}
                className="card p-8 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 p-3 mr-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Award className="w-full h-full text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {t(`certifications.items.${cert}.name`)}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        <span>{t(`certifications.items.${cert}.provider`)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{t(`certifications.items.${cert}.year`)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Topics */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Certification Topics
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {topics.map((topic, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                      >
                        <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                          {topic}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Badge */}
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Verified Certification
                  </div>
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 px-4 py-2 rounded-full">
                    <span className="text-yellow-800 dark:text-yellow-200 text-sm font-semibold">
                      {t(`certifications.items.${cert}.year`)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
} 