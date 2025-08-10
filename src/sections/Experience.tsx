import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Calendar, MapPin, CheckCircle, Briefcase, TrendingUp, Users, ChevronDown, Building2, Award, Zap } from 'lucide-react'
import { useState } from 'react'

export const Experience = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const experiences = [
    'epitech_mentor',
    'epitech_assistant',
    'leonart',
    'simple',
    'acoris'
  ]

  const toggleCard = (exp: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(exp)) {
        newSet.delete(exp)
      } else {
        newSet.add(exp)
      }
      return newSet
    })
  }

  const getCompanyKey = (exp: string) => {
    if (exp.includes('epitech')) return 'epitech'
    if (exp === 'leonart') return 'leonart'
    if (exp === 'simple') return 'simple'
    if (exp === 'acoris') return 'acoris'
    return 'epitech'
  }

  const getIndustryBadgeColor = (industry: string) => {
    switch (industry) {
      case 'EdTech': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
      case 'Startup': return 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800'
      case 'Enterprise': return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
      case 'Fintech': return 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800'
      default: return 'bg-gray-100 dark:bg-gray-900/40 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800'
    }
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  }

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900"></div>
      
      {/* Enhanced floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-20 w-32 h-32 rounded-3xl opacity-20"
          style={{
            background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 60%, transparent 100%)',
            boxShadow: '0 0 80px 30px rgba(59, 130, 246, 0.06)',
            backdropFilter: 'blur(40px)'
          }}
        ></motion.div>
        <motion.div
          animate={{ 
            x: [0, -25, 0],
            y: [0, 30, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
          className="absolute bottom-40 left-24 w-36 h-36 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(100, 116, 139, 0.08) 0%, rgba(100, 116, 139, 0.02) 60%, transparent 100%)',
            boxShadow: '0 0 80px 30px rgba(100, 116, 139, 0.06)',
            backdropFilter: 'blur(40px)'
          }}
        ></motion.div>
      </div>

      <div className="max-w-6xl mx-auto container-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          {/* Enhanced glass container for header */}
          <div 
            className="backdrop-blur-xl bg-white/70 dark:bg-black/30 rounded-3xl p-6 md:p-8 lg:p-10 border border-white/40 dark:border-gray-700/40 shadow-2xl max-w-4xl mx-auto"
            style={{
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">
                {t('experience.title')}
              </h2>
            </div>
            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
              {t('experience.subtitle')}
            </p>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-4 md:space-y-6 lg:space-y-8"
        >
          {/* Enhanced experience cards with staggered animations */}
          {experiences.map((exp) => {
            const isExpanded = expandedCards.has(exp)
            const companyKey = getCompanyKey(exp)
            const companyProfile = t(`experience.companyProfiles.${companyKey}`, { returnObjects: true }) as any
            
            return (
              <motion.div
                key={exp}
                variants={cardVariants}
                className="group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  layout
                  className="backdrop-blur-2xl bg-white/60 dark:bg-black/20 rounded-2xl lg:rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  style={{
                    backdropFilter: 'blur(25px)',
                    WebkitBackdropFilter: 'blur(25px)',
                  }}
                >
                  {/* Always visible header - enhanced with glassmorphism */}
                  <motion.div 
                    layout
                    onClick={() => toggleCard(exp)}
                    className="p-4 md:p-6 lg:p-8 cursor-pointer hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                          {/* Enhanced company logo with bigger size */}
                          <motion.div 
                            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl bg-white/90 dark:bg-gray-800/90 p-3 shadow-lg border border-gray-200/50 dark:border-gray-600/50 flex-shrink-0"
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img 
                              src={
                                exp.includes('epitech') ? '/Epitech_Official_Logo.png' :
                                exp === 'simple' ? '/Logo-plus-simple.png' :
                                exp === 'acoris' ? '/acoris_logo.jpg' :
                                exp === 'leonart' ? '/Logo_Leon\'Art.png' :
                                ''
                              }
                              alt={`${t(`experience.positions.${exp}.company`)} logo`}
                              className="w-full h-full object-contain rounded-xl"
                            />
                          </motion.div>
                          
                          {/* Enhanced job info with better responsive layout */}
                          <div className="flex-1 min-w-0 space-y-3">
                            {/* Job title and company */}
                            <div>
                              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                {t(`experience.positions.${exp}.title`)}
                              </h3>
                              <p className="text-blue-600 dark:text-blue-400 font-semibold text-base md:text-lg">
                                {t(`experience.positions.${exp}.company`)}
                              </p>
                            </div>
                            
                            {/* Company mini-profile */}
                            <div className="hidden md:block">
                              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {companyProfile?.description}
                              </p>
                            </div>
                            
                            {/* Industry badges and context */}
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getIndustryBadgeColor(companyProfile?.industry)}`}>
                                {companyProfile?.industry}
                              </span>
                              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700">
                                <Users className="w-3 h-3 inline mr-1" />
                                {companyProfile?.size}
                              </span>
                              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700">
                                <Building2 className="w-3 h-3 inline mr-1" />
                                {companyProfile?.scope}
                              </span>
                            </div>
                            
                            {/* Period and location - enhanced responsive design */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{t(`experience.positions.${exp}.period`)}</span>
                                {exp === 'epitech_mentor' && (
                                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium ml-2">
                                    {t('experience.current')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{t(`experience.positions.${exp}.location`)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced expand/collapse icon */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="ml-2 flex-shrink-0 self-start mt-2"
                        >
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/60 dark:bg-gray-800/60 flex items-center justify-center shadow-md border border-gray-200/50 dark:border-gray-600/50">
                            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced expandable content with glassmorphism */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="border-t border-white/30 dark:border-gray-700/30"
                      >
                        <div 
                          className="p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4"
                          style={{
                            backdropFilter: 'blur(40px)',
                            WebkitBackdropFilter: 'blur(40px)',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                          }}
                        >
                          {/* Enhanced description with glassmorphism */}
                          <div 
                            className="p-2 md:p-3 rounded-2xl border border-white/30 dark:border-gray-700/30 relative overflow-hidden !mt-0"
                            style={{
                              backdropFilter: 'blur(20px)',
                              WebkitBackdropFilter: 'blur(20px)',
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)'
                            }}
                          >
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                              {t(`experience.positions.${exp}.description`)}
                            </p>
                          </div>

                          {/* Company mini-profile for mobile */}
                          <div className="md:hidden p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl border border-white/20 dark:border-gray-700/20">
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {companyProfile?.description}
                            </p>
                          </div>

                          {/* Enhanced technologies and achievements in responsive grid */}
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                            {/* Key Technologies with glassmorphism */}
                            <div 
                              className="p-4 md:p-6 rounded-2xl border border-white/30 dark:border-gray-700/30"
                              style={{
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)'
                              }}
                            >
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                {t('experience.keyTechnologies')}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(t(`experience.positions.${exp}.technologies`, { returnObjects: true })) &&
                                  (t(`experience.positions.${exp}.technologies`, { returnObjects: true }) as string[]).map((tech, techIndex) => (
                                    <motion.span
                                      key={techIndex}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: techIndex * 0.1 }}
                                      whileHover={{ scale: 1.05 }}
                                      className="px-3 py-2 bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-xl text-sm font-medium border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm"
                                    >
                                      {tech}
                                    </motion.span>
                                  ))
                                }
                              </div>
                            </div>

                            {/* Key Achievements with glassmorphism */}
                            <div 
                              className="p-4 md:p-6 rounded-2xl border border-white/30 dark:border-gray-700/30"
                              style={{
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
                              }}
                            >
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-green-500" />
                                {t('experience.keyAchievements')}
                              </h4>
                              <div className="space-y-3">
                                {Array.isArray(t(`experience.positions.${exp}.achievements`, { returnObjects: true })) &&
                                  (t(`experience.positions.${exp}.achievements`, { returnObjects: true }) as string[]).slice(0, 4).map((achievement, achIndex) => (
                                    <motion.div 
                                      key={achIndex}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: achIndex * 0.1 }}
                                      className="flex items-start gap-3 p-3 rounded-xl bg-green-50/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 backdrop-blur-sm"
                                    >
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {achievement}
                                      </span>
                                    </motion.div>
                                  ))
                                }
                              </div>
                            </div>
                          </div>

                          {/* Enhanced impact metrics with glassmorphism */}
                          {t(`experience.positions.${exp}.impact`) && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="p-4 md:p-6 rounded-2xl border border-white/30 dark:border-gray-700/30 relative overflow-hidden"
                              style={{
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)'
                              }}
                            >
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-3 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-purple-500" />
                                {t('experience.impactResults')}
                              </h4>
                              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                {t(`experience.positions.${exp}.impact`)}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Enhanced professional summary with glassmorphism */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-12 lg:mt-16"
        >
          <div 
            className="max-w-5xl mx-auto backdrop-blur-2xl bg-white/60 dark:bg-black/20 rounded-3xl p-6 md:p-8 lg:p-12 border border-white/50 dark:border-gray-700/50 shadow-2xl"
            style={{
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {t('sections.experience.professionalSummary')}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg lg:text-xl max-w-4xl mx-auto">
              {t('sections.experience.professionalSummaryText')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}