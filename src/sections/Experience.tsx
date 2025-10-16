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
      case 'Startup': return 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800'
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
        staggerChildren: 0.08 // OPTIMIZED: Reduced from 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 5 }, // OPTIMIZED: Reduced from 10, removed scale
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" } // OPTIMIZED: Reduced from 0.3
    }
  }

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900"></div>
      
      {/* Simplified background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-32 right-20 w-32 h-32 rounded-3xl opacity-10 bg-blue-500/20"
        ></div>
        <div
          className="absolute bottom-40 left-24 w-36 h-36 rounded-full opacity-10 bg-slate-500/20"
        ></div>
      </div>

      <div className="max-w-6xl mx-auto container-padding relative z-10">
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Briefcase className="w-6 h-6 text-white" />
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
              {t('experience.title')}
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
                whileHover={{ scale: 1.005 }} // OPTIMIZED: Reduced from 1.02
                transition={{ duration: 0.15 }} // OPTIMIZED: Reduced from 0.2
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              >
                <motion.div 
                  layout
                  className="bg-white/90 dark:bg-black/70 rounded-2xl lg:rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-200 overflow-hidden"
                  style={{
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                  }}
                >
                  {/* Always visible header - optimized */}
                  <motion.div 
                    layout
                    onClick={() => toggleCard(exp)}
                    className="p-4 md:p-6 lg:p-8 cursor-pointer hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-200 relative overflow-hidden"
                    style={{
                      willChange: 'transform',
                      transform: 'translateZ(0)',
                    }}
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                          {/* Optimized company logo */}
                          <motion.div 
                            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl bg-white/90 dark:bg-gray-800/90 p-3 shadow-lg border border-gray-200/50 dark:border-gray-600/50 flex-shrink-0"
                            whileHover={{ rotate: 2, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              willChange: 'transform',
                              transform: 'translateZ(0)',
                            }}
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
                        
                        {/* Optimized expand/collapse icon */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="ml-2 flex-shrink-0 self-start mt-2"
                          style={{
                            willChange: 'transform',
                            transform: 'translateZ(0)',
                          }}
                        >
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/60 dark:bg-gray-800/60 flex items-center justify-center shadow-md border border-gray-200/50 dark:border-gray-600/50">
                            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Optimized expandable content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }} // OPTIMIZED: Reduced from 0.3, simplified easing
                        className="border-t border-white/30 dark:border-gray-700/30"
                        style={{
                          willChange: 'height, opacity',
                          transform: 'translateZ(0)',
                        }}
                      >
                        <div 
                          className="p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4 bg-white/20 dark:bg-black/20"
                        >
                          {/* Optimized description */}
                          <div 
                            className="p-2 md:p-3 rounded-2xl border border-white/30 dark:border-gray-700/30 relative overflow-hidden !mt-0 bg-white/40 dark:bg-black/40"
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
                            {/* Optimized Key Technologies */}
                            <div 
                              className="p-4 md:p-6 rounded-2xl border border-white/30 dark:border-gray-700/30 bg-blue-50/80 dark:bg-blue-900/40"
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
                                      initial={{ opacity: 0 }} // OPTIMIZED: Removed scale
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: techIndex * 0.02, duration: 0.15 }} // OPTIMIZED: Reduced delays and duration
                                      className="px-3 py-2 bg-blue-100/90 dark:bg-blue-900/70 text-blue-800 dark:text-blue-200 rounded-xl text-sm font-medium border border-blue-200/50 dark:border-blue-800/50"
                                    >
                                      {tech}
                                    </motion.span>
                                  ))
                                }
                              </div>
                            </div>

                            {/* Optimized Key Achievements */}
                            <div 
                              className="p-4 md:p-6 rounded-2xl border border-white/30 dark:border-gray-700/30 bg-green-50/80 dark:bg-green-900/40"
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
                                      initial={{ opacity: 0 }} // OPTIMIZED: Removed x translation
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: achIndex * 0.02, duration: 0.15 }} // OPTIMIZED: Reduced delays
                                      className="flex items-start gap-3 p-3 rounded-xl bg-green-50/90 dark:bg-green-900/70 border border-green-200/50 dark:border-green-800/50"
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

                          {/* Optimized impact metrics */}
                          {t(`experience.positions.${exp}.impact`) && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2, duration: 0.3 }}
                              className="p-4 md:p-6 rounded-2xl border border-white/30 dark:border-gray-700/30 relative overflow-hidden bg-blue-50/80 dark:bg-blue-900/40"
                              style={{
                                willChange: 'transform',
                                transform: 'translateZ(0)',
                              }}
                            >
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-3 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-blue-500" />
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

        {/* Optimized professional summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="text-center mt-12 lg:mt-16"
        >
          <div 
            className="max-w-5xl mx-auto bg-white/90 dark:bg-black/80 rounded-3xl p-6 md:p-8 lg:p-12 border border-white/50 dark:border-gray-700/50 shadow-2xl"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
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