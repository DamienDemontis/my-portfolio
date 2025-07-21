import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, Play, Code, Database, Lightbulb } from 'lucide-react'

export const Projects = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

  const projects = ['facial_recognition', 'leonart', 'intranet', 'inept_intruder', 'tank_game']

  const getProjectComplexity = (project: string) => {
    const complexities = {
      facial_recognition: 'Advanced',
      leonart: 'Expert',
      intranet: 'Intermediate',
      inept_intruder: 'Advanced',
      tank_game: 'Intermediate'
    }
    return complexities[project as keyof typeof complexities] || 'Beginner'
  }

  const getProjectColor = (project: string) => {
    const colors = {
      facial_recognition: 'from-blue-500 to-cyan-600',
      leonart: 'from-purple-500 to-pink-600',
      intranet: 'from-green-500 to-emerald-600',
      inept_intruder: 'from-orange-500 to-red-600',
      tank_game: 'from-indigo-500 to-blue-600'
    }
    return colors[project as keyof typeof colors] || 'from-gray-400 to-gray-600'
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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  }

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* Innovation Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-violet-900/10 dark:to-purple-900/10"></div>
      
      {/* Subtle floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 60, 0],
            y: [0, -50, 0],
            rotate: [0, 20, 0]
          }}
          transition={{ 
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-4 w-64 h-64 bg-violet-400/4 dark:bg-violet-400/2 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{ 
            x: [0, -50, 0],
            y: [0, 60, 0],
            rotate: [0, -18, 0]
          }}
          transition={{ 
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 12
          }}
          className="absolute bottom-4 left-8 w-72 h-72 bg-purple-400/4 dark:bg-purple-400/2 rounded-3xl blur-3xl"
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
              <Lightbulb className="w-8 h-8 text-violet-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('projects.title')}
              </h2>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-purple-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Innovative solutions showcasing technical expertise and creative problem-solving
            </p>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => {
            const technologies = t(`projects.items.${project}.technologies`, { returnObjects: true }) as string[]
            const features = t(`projects.items.${project}.features`, { returnObjects: true }) as string[]
            const projectColor = getProjectColor(project)
            const complexity = getProjectComplexity(project)
            const hasVideo = t(`projects.items.${project}.video`) && t(`projects.items.${project}.video`) !== `projects.items.${project}.video`
            const hasGithub = t(`projects.items.${project}.github`) && t(`projects.items.${project}.github`) !== `projects.items.${project}.github`
            
            return (
              <motion.div
                key={project}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="backdrop-blur-xl bg-white/70 dark:bg-black/30 rounded-3xl p-0 border border-white/40 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Header with gradient */}
                <div className={`p-6 bg-gradient-to-br ${projectColor.replace('500', '50').replace('600', '100')} dark:from-gray-800/20 dark:to-gray-700/20 relative overflow-hidden`}>
                  {/* Floating particles */}
                  <div className="absolute inset-0">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          x: [0, 25, 0],
                          y: [0, -20, 0],
                          opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                          duration: 5 + i,
                          repeat: Infinity,
                          delay: i * 2
                        }}
                        className={`absolute w-3 h-3 bg-gradient-to-r ${projectColor} rounded-full blur-sm opacity-20`}
                        style={{
                          left: `${15 + i * 25}%`,
                          top: `${20 + i * 15}%`
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        {t(`projects.items.${project}.title`)}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${projectColor} text-white shadow-lg`}>
                          {complexity}
                        </span>
                        {index < 2 && (
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 rounded-full text-xs font-semibold shadow-lg">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {t(`projects.items.${project}.description`)}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4 text-violet-500" />
                      Technologies Used
                    </h4>
                    <motion.div 
                      variants={containerVariants}
                      className="flex flex-wrap gap-2"
                    >
                      {technologies.map((tech) => (
                        <motion.span
                          key={tech}
                          variants={tagVariants}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className="px-3 py-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-800 dark:text-gray-200 rounded-xl text-xs font-medium border border-white/40 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                          style={{
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4 text-violet-500" />
                      Key Features
                    </h4>
                    <div className="space-y-2">
                      {features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * featureIndex }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${projectColor} flex-shrink-0`}></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Video section */}
                  {hasVideo && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <Play className="w-4 h-4 text-red-500" />
                        {t(`projects.items.${project}.videoTitle`)}
                      </h4>
                      <div className="relative overflow-hidden rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg">
                        <iframe
                          src={`https://www.youtube.com/embed/${t(`projects.items.${project}.video`).split('/').pop()}`}
                          title={t(`projects.items.${project}.videoTitle`)}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-48"
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    {hasGithub && (
                      <motion.a
                        href={t(`projects.items.${project}.github`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-800 dark:text-gray-200 rounded-xl font-semibold text-sm border border-white/40 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                        style={{
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                        }}
                      >
                        <Github className="w-4 h-4" />
                        Source Code
                      </motion.a>
                    )}
                    {hasVideo && !hasGithub && (
                      <motion.a
                        href={t(`projects.items.${project}.video`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-800 dark:text-gray-200 rounded-xl font-semibold text-sm border border-white/40 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                        style={{
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                        }}
                      >
                        <Play className="w-4 h-4" />
                        Watch Demo
                      </motion.a>
                    )}
                  </div>
                </div>


              </motion.div>
            )
          })}
        </motion.div>

        {/* Innovation summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
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
              <Lightbulb className="w-6 h-6 text-violet-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('sections.projects.innovationThroughCode')}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('sections.projects.innovationThroughCodeText')}
              <span className="block mt-4 font-semibold text-violet-600 dark:text-violet-400">
                {t('sections.projects.buildingTheFuture')}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 