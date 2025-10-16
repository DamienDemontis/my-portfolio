import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GraduationCap, MapPin, Award, Play, Globe, BookOpen, Trophy, Users, ChevronDown, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export const Education = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '0px 0px -20% 0px',
  })

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const toggleCard = (itemId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  // Timeline data with chronological order (most recent first)
  const timelineData = [
    {
      id: 'epitech',
      year: '2020-2025',
      institution: 'epitech',
      isMain: true,
      side: 'right'
    },
    {
      id: 'keimyung',
      year: '2023-2024',
      institution: 'keimyung',
      isMain: false,
      side: 'left'
    },
    {
      id: 'henri_poincare',
      year: '2017-2019',
      institution: 'henri_poincare',
      isMain: false,
      side: 'right'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // OPTIMIZED: Reduced from 0.3
        delayChildren: 0.1 // OPTIMIZED: Reduced from 0.2
      }
    }
  }

  const timelineVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 0.8, // OPTIMIZED: Reduced from 1.5
        ease: "easeOut"
      }
    }
  }

  const cardVariants = (_side: string) => ({ // OPTIMIZED: Removed x translation based on side
    hidden: {
      opacity: 0,
      y: 10 // OPTIMIZED: Removed x translation, reduced y
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // OPTIMIZED: Reduced from 0.8
        ease: "easeOut"
      }
    }
  })


  return (
    <section id="education" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.05),transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              <GraduationCap className="w-6 h-6 text-white" />
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
              {t('education.title')}
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

        {/* Timeline Container */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative max-w-6xl mx-auto"
        >
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px hidden lg:block">
            <motion.div
              variants={timelineVariants}
              className="h-full w-full bg-gradient-to-b from-blue-400 via-cyan-500 to-blue-600 rounded-full origin-top"
              style={{ willChange: 'transform' }}
            />
          </div>

          {/* Mobile Timeline Line */}
          <div className="absolute left-8 h-full w-px lg:hidden">
            <motion.div
              variants={timelineVariants}
              className="h-full w-full bg-gradient-to-b from-blue-400 via-cyan-500 to-blue-600 rounded-full origin-top"
              style={{ willChange: 'transform' }}
            />
          </div>

          {/* Timeline Items - Completely Redesigned */}
          <div className="space-y-12">
            {timelineData.map((item) => {
              const highlights = t(`education.institutions.${item.institution}.highlights`, { returnObjects: true }) as string[]
              const isExpanded = expandedCards.has(item.id)
              
              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants('center')}
                  className="relative"
                >

                  {/* Hover Badge - Appears on card hover */}
                  <div className="absolute right-0 top-8 transform translate-x-4 w-12 h-12 lg:w-14 lg:h-14 z-30 pointer-events-none">
                    <motion.div
                      initial={{ opacity: 0, x: -20, scale: 0.8 }}
                      animate={{ 
                        opacity: 0, 
                        x: -20, 
                        scale: 0.8 
                      }}
                      whileHover={{ 
                        opacity: 1, 
                        x: 0, 
                        scale: 1 
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-full h-full group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 opacity-0 transform -translate-x-5 scale-75 transition-all duration-300"
                    >
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${
                        item.isMain 
                          ? 'from-yellow-400 via-orange-500 to-red-500 shadow-lg shadow-orange-500/30' 
                          : 'from-blue-400 via-cyan-500 to-blue-600 shadow-lg shadow-blue-500/30'
                      } flex items-center justify-center border-3 border-white dark:border-gray-800 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        {item.isMain ? (
                          <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-white relative z-10" />
                        ) : (
                          <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-white relative z-10" />
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Clean Card Layout */}
                  <motion.div
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                    className="group max-w-4xl mx-auto relative"
                    style={{
                      willChange: 'transform',
                      transform: 'translateZ(0)',
                    }}
                  >
                    <div className={`bg-white/90 dark:bg-gray-800/90 rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-200 overflow-hidden ${
                      item.isMain ? 'ring-2 ring-yellow-400/30' : ''
                    }`}>
                      
                      {/* Always visible header - clickable */}
                      <motion.div 
                        onClick={() => toggleCard(item.id)}
                        className="p-6 lg:p-8 cursor-pointer hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-200 relative overflow-hidden"
                        style={{
                          willChange: 'transform',
                          transform: 'translateZ(0)',
                        }}
                      >
                        {/* Subtle gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        
                        <div className="relative z-10">
                          {/* Card Header with Year */}
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4 mb-4 lg:mb-0 flex-1 min-w-0">
                              {/* Institution Logo */}
                              <motion.div
                                whileHover={{ rotate: 5, scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0"
                                style={{
                                  willChange: 'transform',
                                  transform: 'translateZ(0)',
                                }}
                              >
                                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white dark:bg-gray-700 p-2 shadow-lg border border-gray-200 dark:border-gray-600">
                                  <img 
                                    src={
                                      item.institution === 'epitech' ? '/Epitech_Official_Logo.png' :
                                      item.institution === 'keimyung' ? '/keimyung_logo.png' :
                                      item.institution === 'henri_poincare' ? '/Henri_poincaré_logo.png' :
                                      ''
                                    }
                                    alt={`${t(`education.institutions.${item.institution}.name`)} logo`}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </motion.div>
                              
                              {/* Institution Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                  {t(`education.institutions.${item.institution}.name`)}
                                </h3>
                                <div className="space-y-1 mb-3">
                                  <p className="text-base lg:text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                    {item.institution === 'epitech' ? t('education.institutions.epitech.msc') : t(`education.institutions.${item.institution}.degree`)}
                                  </p>
                                  {item.institution === 'epitech' && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                      {t('education.institutions.epitech.expert')}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <MapPin className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-sm font-medium">
                                    {t(`education.institutions.${item.institution}.location`)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              {/* Year Badge */}
                              <div className={`px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r ${
                                item.isMain 
                                  ? 'from-yellow-400 to-orange-500 text-white' 
                                  : 'from-blue-500 to-cyan-600 text-white'
                              } rounded-full font-bold text-sm lg:text-lg shadow-lg`}>
                                {item.year}
                              </div>

                              {/* Expand/collapse icon */}
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="flex-shrink-0"
                                style={{
                                  willChange: 'transform',
                                  transform: 'translateZ(0)',
                                }}
                              >
                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/60 dark:bg-gray-800/60 flex items-center justify-center shadow-md border border-gray-200/50 dark:border-gray-600/50">
                                  <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 dark:text-gray-400" />
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Expandable content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }} // OPTIMIZED: Reduced from 0.3
                            className="border-t border-white/30 dark:border-gray-700/30"
                            style={{
                              willChange: 'height, opacity',
                              transform: 'translateZ(0)',
                            }}
                          >
                            <div className="p-6 lg:p-8 space-y-6 bg-white/20 dark:bg-black/20">
                              
                              {/* Special Achievement Badges */}
                              {item.institution === 'epitech' && (
                                <div className="grid gap-3">
                                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                    <div className="flex items-center gap-2">
                                      <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                                        GPA: 3.7/4.0
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Trophy className="w-4 h-4 text-yellow-500" />
                                      <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                                        {t('education.campusLeader')}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                                        {t('education.leadershipRoles')}
                                      </h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <div className="flex items-center gap-1 bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">
                                          {t('education.pedagogicalAssistant')}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1 bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-lg">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">
                                          {t('education.codingClubMember')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Keimyung Special Badges */}
                              {item.institution === 'keimyung' && (
                                <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-cyan-800">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm">
                                      {t('education.internationalExchange')}
                                    </h4>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-1 bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-lg">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                      <span className="text-purple-800 dark:text-purple-300 font-medium text-xs">
                                        {t('education.gameDevAI')}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-lg">
                                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                      <span className="text-purple-800 dark:text-purple-300 font-medium text-xs">
                                        {t('education.koreanLanguageCulture')}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-lg">
                                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                      <span className="text-purple-800 dark:text-purple-300 font-medium text-xs">
                                        {t('education.vrArResearch')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Henri Poincaré Foundation */}
                              {item.institution === 'henri_poincare' && (
                                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <h4 className="font-bold text-green-900 dark:text-green-200 text-sm">
                                      {t('education.academicFoundation.title')}
                                    </h4>
                                  </div>
                                  <p className="text-green-800 dark:text-green-300 font-medium leading-relaxed text-xs">
                                    {t('education.academicFoundation.description')}
                                  </p>
                                </div>
                              )}

                              {/* Key Highlights */}
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <BookOpen className="w-4 h-4 text-indigo-600" />
                                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                                    {t('education.keyHighlights')}
                                  </h4>
                                </div>
                                <div className={`${
                                  item.institution === 'epitech' || item.institution === 'keimyung'
                                    ? 'grid grid-cols-1 sm:grid-cols-2 gap-2' 
                                    : 'grid gap-2'
                                }`}>
                                  {highlights.map((highlight, highlightIndex) => (
                                    <motion.div
                                      key={highlightIndex}
                                      initial={{ opacity: 0 }} // OPTIMIZED: Removed x translation
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: highlightIndex * 0.02, duration: 0.15 }} // OPTIMIZED: Reduced delays
                                      className="flex items-start gap-2 p-2 rounded-lg bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-100/80 dark:hover:bg-gray-700/70 transition-colors"
                                    >
                                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-xs">
                                        {highlight}
                                      </p>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>

                              {/* Video Section for Keimyung */}
                              {item.institution === 'keimyung' && t(`education.institutions.${item.institution}.video`) && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <Play className="w-4 h-4 text-red-500" />
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                                      {t(`education.institutions.${item.institution}.videoTitle`)}
                                    </h4>
                                    <ExternalLink className="w-3 h-3 text-gray-400" />
                                  </div>
                                  <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 dark:border-purple-700 shadow-lg">
                                    <iframe
                                      src={`https://www.youtube.com/embed/${t(`education.institutions.${item.institution}.video`).split('/').pop()}`}
                                      title={t(`education.institutions.${item.institution}.videoTitle`)}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="w-full h-48"
                                    ></iframe>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Academic Excellence summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="text-center mt-16"
        >
          <div 
            className="max-w-4xl mx-auto bg-white/90 dark:bg-black/50 rounded-3xl p-8 border border-white/40 dark:border-gray-700/40 shadow-xl"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('education.philosophy.title')}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('education.philosophy.description')}
              <span className="block mt-4 font-semibold text-indigo-600 dark:text-indigo-400">
                {t('education.philosophy.quote')}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}