import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, Calendar, Building, CheckCircle, Star, Users, Target, MessageSquare, Briefcase } from 'lucide-react'

export const Certifications = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

  // The 4 actual certifications from IonisX
  const certifications = [
    {
      id: 'agile_coaching',
      name: t('certifications.items.agile_coaching.title'),
      provider: t('certifications.items.agile_coaching.provider'),
      year: t('certifications.items.agile_coaching.year'),
      description: t('certifications.items.agile_coaching.description'),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'team_management',
      name: t('certifications.items.team_management.title'),
      provider: t('certifications.items.team_management.provider'),
      year: t('certifications.items.team_management.year'),
      description: t('certifications.items.team_management.description'),
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'crisis_communication',
      name: t('certifications.items.crisis_communication.title'),
      provider: t('certifications.items.crisis_communication.provider'),
      year: t('certifications.items.crisis_communication.year'),
      description: t('certifications.items.crisis_communication.description'),
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      id: 'it_project_management',
      name: t('certifications.items.it_project_management.title'),
      provider: t('certifications.items.it_project_management.provider'),
      year: t('certifications.items.it_project_management.year'),
      description: t('certifications.items.it_project_management.description'),
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-cyan-800'
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

  return (
    <section id="certifications" className="section-padding relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20"></div>
      
      {/* Subtle floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-24 right-16 w-28 h-28 rounded-3xl bg-yellow-100/30 dark:bg-yellow-900/10"></div>
        <div className="absolute bottom-32 left-20 w-32 h-32 rounded-full bg-orange-100/30 dark:bg-orange-900/10"></div>
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
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Award className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Beautiful Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
          >
            <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              {t('certifications.title')}
            </span>
          </motion.h2>

          {/* Elegant Decorative Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mb-6 flex items-center justify-center"
          >
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full"></div>
            <div className="absolute w-32 h-3 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 blur-sm rounded-full"></div>
          </motion.div>

        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {certifications.map((cert, index) => {
            const IconComponent = cert.icon
            
            return (
              <motion.div
                key={cert.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)'
                }}
                className={`bg-gradient-to-br ${cert.bgColor} rounded-3xl p-8 border ${cert.borderColor} shadow-xl hover:shadow-2xl transition-all duration-200 group`}
              >
                {/* Header */}
                <div className="flex items-center mb-6">
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      willChange: 'transform',
                      transform: 'translateZ(0)'
                    }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${cert.color} p-3 mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-200`}
                  >
                    <IconComponent className="w-full h-full text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {cert.name}
                    </h3>
                    <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span className="font-semibold">{cert.provider}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{cert.year}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 p-4 bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-white/30 dark:border-gray-700/30">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                {/* Certification Status */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{t('certifications.verifiedCertification')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {t('certifications.active')}
                    </span>
                  </div>
                </div>

                {/* Floating element */}
                <motion.div
                  animate={{ 
                    y: [0, -4, 0],
                    rotate: [0, 3, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white/60 rounded-full border border-white/40 flex items-center justify-center"
                >
                  <Star className="w-3 h-3 text-yellow-500" />
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Enhanced footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div 
            className="max-w-4xl mx-auto bg-white/90 dark:bg-black/60 rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('sections.certifications.leadershipExcellence')}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('sections.certifications.leadershipExcellenceText')}
              <span className="block mt-2 font-semibold text-yellow-600 dark:text-yellow-400">
                {t('sections.certifications.continuousLearning')}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 