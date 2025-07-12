import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Calendar, MapPin, CheckCircle } from 'lucide-react'

export const Experience = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const experiences = [
    'epitech_mentor',
    'epitech_assistant',
    'simple',
    'acoris'
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section id="experience" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('experience.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 to-primary-600 transform md:-translate-x-px"></div>

          {/* Experience items */}
          {experiences.map((exp, index) => (
            <motion.div
              key={exp}
              variants={itemVariants}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary-600 rounded-full transform -translate-x-2 md:-translate-x-2 border-4 border-white dark:border-gray-800 z-10"></div>

              {/* Content card */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${
                index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
              }`}>
                <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {t(`experience.positions.${exp}.title`)}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{t(`experience.positions.${exp}.period`)}</span>
                        {(exp === 'epitech_mentor' || exp === 'epitech_assistant') && (
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium ml-2">
                            {t('experience.current')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{t(`experience.positions.${exp}.company`)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {t(`experience.positions.${exp}.description`)}
                  </p>

                  {/* Achievements */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3">
                      Key Achievements:
                    </h4>
                    {Array.isArray(t(`experience.positions.${exp}.achievements`, { returnObjects: true })) &&
                      (t(`experience.positions.${exp}.achievements`, { returnObjects: true }) as string[]).map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {achievement}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* End marker */}
          <motion.div
            variants={itemVariants}
            className="relative flex items-center justify-center"
          >
            <div className="absolute left-4 md:left-1/2 w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transform -translate-x-3 md:-translate-x-3 border-4 border-white dark:border-gray-800"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 