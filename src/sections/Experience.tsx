import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Calendar, MapPin, CheckCircle, Briefcase, TrendingUp, Users } from 'lucide-react'

export const Experience = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

  const experiences = [
    'epitech_mentor',
    'epitech_assistant',
    'leonart',
    'simple',
    'acoris'
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900"></div>
      
      {/* Subtle floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 20, 0],
            y: [0, -15, 0],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-20 w-24 h-24 bg-blue-400/5 dark:bg-blue-400/3 rounded-2xl blur-xl"
        ></motion.div>
        <motion.div
          animate={{ 
            x: [0, -15, 0],
            y: [0, 20, 0],
            rotate: [0, -2, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-40 left-24 w-28 h-28 bg-slate-400/5 dark:bg-slate-400/3 rounded-full blur-xl"
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
              <Briefcase className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('experience.title')}
              </h2>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('experience.subtitle')}
            </p>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Enhanced Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:w-1 transform md:-translate-x-px">
            <div className="h-full bg-gradient-to-b from-blue-400 via-purple-500 via-pink-500 to-blue-600 rounded-full shadow-lg opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-300 via-purple-400 via-pink-400 to-blue-500 rounded-full animate-pulse opacity-40"></div>
          </div>

          {/* Experience items */}
          {experiences.map((exp, index) => (
            <motion.div
              key={exp}
              variants={itemVariants}
              className={`relative flex items-start mb-16 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Enhanced Timeline dot */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.6, type: "spring" }}
                className="absolute left-4 md:left-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform -translate-x-3 md:-translate-x-3 border-4 border-white dark:border-gray-900 z-10 shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping opacity-20"></div>
              </motion.div>

              {/* Enhanced Content card */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${
                index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
              }`}>
                <motion.div 
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="backdrop-blur-xl bg-white/70 dark:bg-black/30 rounded-3xl p-8 border border-white/40 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-300"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-gray-800/80 p-2 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
                        <img 
                          src={
                            exp.includes('epitech') ? '/Epitech_Official_Logo.png' :
                            exp === 'simple' ? '/Logo-plus-simple.png' :
                            exp === 'acoris' ? '/acoris_logo.jpg' :
                            exp === 'leonart' ? '/Logo_Leon\'Art.png' :
                            ''
                          }
                          alt={`${t(`experience.positions.${exp}.company`)} logo`}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {t(`experience.positions.${exp}.title`)}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold">
                          {t(`experience.positions.${exp}.company`)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-lg px-3 py-1">
                        <Calendar className="w-4 h-4" />
                        <span>{t(`experience.positions.${exp}.period`)}</span>
                        {exp === 'epitech_mentor' && (
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium ml-2">
                            {t('experience.current')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-lg px-3 py-1">
                        <MapPin className="w-4 h-4" />
                        <span>{t(`experience.positions.${exp}.location`)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6 p-4 bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {t(`experience.positions.${exp}.description`)}
                    </p>
                  </div>

                  {/* Key Technologies/Skills */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      {t('experience.keyTechnologies')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(t(`experience.positions.${exp}.technologies`, { returnObjects: true })) &&
                        (t(`experience.positions.${exp}.technologies`, { returnObjects: true }) as string[]).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-lg text-xs font-medium border border-blue-200 dark:border-blue-800"
                          >
                            {tech}
                          </span>
                        ))
                      }
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-500" />
                      {t('experience.keyAchievements')}
                    </h4>
                    {Array.isArray(t(`experience.positions.${exp}.achievements`, { returnObjects: true })) &&
                      (t(`experience.positions.${exp}.achievements`, { returnObjects: true }) as string[]).map((achievement, achIndex) => (
                        <motion.div 
                          key={achIndex} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * achIndex }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-green-50/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {achievement}
                          </span>
                        </motion.div>
                      ))
                    }
                  </div>

                  {/* Impact metrics if available */}
                  {t(`experience.positions.${exp}.impact`) && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        {t('experience.impactResults')}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {t(`experience.positions.${exp}.impact`)}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Enhanced End marker */}
          <motion.div
            variants={itemVariants}
            className="relative flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
              className="absolute left-4 md:left-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform -translate-x-4 md:-translate-x-4 border-4 border-white dark:border-gray-900 shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse opacity-40"></div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Professional summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <div 
            className="max-w-4xl mx-auto backdrop-blur-xl bg-white/70 dark:bg-black/30 rounded-3xl p-8 border border-white/40 dark:border-gray-700/40 shadow-xl"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('sections.experience.professionalSummary')}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('sections.experience.professionalSummaryText')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 