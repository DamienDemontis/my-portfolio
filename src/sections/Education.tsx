import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GraduationCap, MapPin, Calendar, Award, Play, Globe, BookOpen, Trophy, Users } from 'lucide-react'

export const Education = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

  const institutions = ['epitech', 'keimyung', 'henri_poincare']

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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <section id="education" className="section-padding relative overflow-hidden">
      {/* Academic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-indigo-900/10"></div>
      
      {/* Subtle floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            y: [0, -25, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ 
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-12 w-32 h-32 bg-purple-400/6 dark:bg-purple-400/3 rounded-full blur-2xl"
        ></motion.div>
        <motion.div
          animate={{ 
            x: [0, -25, 0],
            y: [0, 30, 0],
            rotate: [0, -6, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
          className="absolute bottom-24 left-16 w-36 h-36 bg-blue-400/6 dark:bg-blue-400/3 rounded-2xl blur-2xl"
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
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('education.title')}
              </h2>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('education.subtitle')}
            </p>
          </div>
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
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="backdrop-blur-xl bg-white/70 dark:bg-black/30 rounded-3xl p-8 border border-white/40 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Header */}
                <div className="flex items-start mb-6">
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-700 p-2 mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-600"
                  >
                    <img 
                      src={
                        institution === 'epitech' ? '/Epitech_Official_Logo.png' :
                        institution === 'keimyung' ? '/keimyung_logo.png' :
                        institution === 'henri_poincare' ? '/Henri_poincaré_logo.png' :
                        ''
                      }
                      alt={`${t(`education.institutions.${institution}.name`)} logo`}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {t(`education.institutions.${institution}.name`)}
                    </h3>
                    <div className="mb-3">
                      <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                        {institution === 'epitech' ? t('education.institutions.epitech.msc') : t(`education.institutions.${institution}.degree`)}
                      </p>
                      {institution === 'epitech' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {t('education.institutions.epitech.expert')}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{t(`education.institutions.${institution}.period`)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{t(`education.institutions.${institution}.location`)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special badges */}
                {institution === 'epitech' && (
                  <div className="mb-6 space-y-3">
                    {/* GPA */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          GPA: 3.7/4.0
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {t('education.campusLeader')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Leadership roles */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {t('education.leadershipRoles')}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {t('education.pedagogicalAssistant')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {t('education.codingClubMember')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Highlights */}
                <div className="space-y-2 mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    {t('education.keyHighlights')}
                  </h4>
                  {highlights.map((highlight, highlightIndex) => (
                    <motion.div
                      key={highlightIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.5, delay: 0.5 + highlightIndex * 0.1 }}
                      className="flex items-start gap-3 p-2 rounded-xl bg-white/50 dark:bg-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all duration-200 border border-white/30 dark:border-gray-700/30"
                    >
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                        {highlight}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Video section for Keimyung */}
                {institution === 'keimyung' && t(`education.institutions.${institution}.video`) && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <Play className="w-4 h-4 text-red-500" />
                      {t(`education.institutions.${institution}.videoTitle`)}
                    </h4>
                    <div className="relative overflow-hidden rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg">
                      <iframe
                        src={`https://www.youtube.com/embed/${t(`education.institutions.${institution}.video`).split('/').pop()}`}
                        title={t(`education.institutions.${institution}.videoTitle`)}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-48 md:h-56"
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Special experience badges */}
                {institution === 'keimyung' && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="font-semibold text-purple-900 dark:text-purple-200">
                        {t('education.internationalExchange')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-purple-700 dark:text-purple-300">
                          {t('education.gameDevAI')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-sm text-purple-700 dark:text-purple-300">
                          {t('education.koreanLanguageCulture')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span className="text-sm text-purple-700 dark:text-purple-300">
                          {t('education.vrArResearch')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Foundation badge for Henri Poincaré */}
                {institution === 'henri_poincare' && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-green-900 dark:text-green-200">
                        {t('education.academicFoundation.title')}
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {t('education.academicFoundation.description')}
                    </p>
                  </div>
                )}

                {/* Floating academic elements */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 8, 0]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.8
                  }}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-white/40 backdrop-blur-xl rounded-full border border-white/60 flex items-center justify-center shadow-lg"
                >
                  <BookOpen className="w-4 h-4 text-purple-500" />
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Academic Philosophy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <div 
            className="max-w-4xl mx-auto backdrop-blur-xl bg-white/80 dark:bg-black/40 rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <GraduationCap className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('education.philosophy.title')}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('education.philosophy.description')}
              <span className="block mt-4 font-semibold text-purple-600 dark:text-purple-400">
                {t('education.philosophy.quote')}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 