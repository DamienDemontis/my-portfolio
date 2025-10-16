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
      leonart: 'from-blue-500 to-cyan-600',
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
        staggerChildren: 0.05 // OPTIMIZED: Further reduced from 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 10 }, // OPTIMIZED: Reduced from 20
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25, // OPTIMIZED: Reduced from 0.4
        ease: "easeOut"
      }
    }
  }

  const tagVariants = {
    hidden: { opacity: 0 }, // OPTIMIZED: Removed scale
    visible: {
      opacity: 1,
      transition: { duration: 0.2 } // OPTIMIZED: Reduced from 0.4
    }
  }

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* Innovation Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-blue-900/10 dark:to-cyan-900/10"></div>
      
      {/* Optimized static background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-4 w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          }}
        ></div>
        <div
          className="absolute bottom-4 left-8 w-72 h-72 rounded-3xl opacity-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
          }}
        ></div>
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Lightbulb className="w-6 h-6 text-white" />
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
              {t('projects.title')}
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
                  scale: 1.005, // OPTIMIZED: Reduced from 1.01
                  transition: { duration: 0.15 } // OPTIMIZED: Reduced from 0.2
                }}
                className="bg-white/80 dark:bg-black/40 rounded-3xl p-0 border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-shadow duration-200 group overflow-hidden"
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)', // Force GPU acceleration
                }}
              >
                {/* Header with gradient */}
                <div className={`p-6 bg-gradient-to-br ${projectColor.replace('500', '50').replace('600', '100')} dark:from-gray-800/20 dark:to-gray-700/20 relative`}>

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
                      <Code className="w-4 h-4 text-blue-500" />
                      {t('projects.technologiesUsed')}
                    </h4>
                    <motion.div 
                      variants={containerVariants}
                      className="flex flex-wrap gap-2"
                    >
                      {technologies.map((tech) => (
                        <motion.span
                          key={tech}
                          variants={tagVariants}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.1 }}
                          className="px-3 py-1.5 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-medium border border-white/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors duration-150"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-500" />
                      {t('projects.keyFeatures')}
                    </h4>
                    <div className="space-y-2">
                      {features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0 }} // OPTIMIZED: Removed x translation
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.03 * featureIndex, duration: 0.15 }} // OPTIMIZED: Reduced delays
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
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 rounded-xl font-semibold text-sm border border-white/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors duration-150"
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
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 rounded-xl font-semibold text-sm border border-white/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors duration-150"
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
            className="max-w-4xl mx-auto bg-white/90 dark:bg-black/50 rounded-3xl p-8 border border-white/40 dark:border-gray-700/40 shadow-xl"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('sections.projects.innovationThroughCode')}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('sections.projects.innovationThroughCodeText')}
              <span className="block mt-4 font-semibold text-blue-600 dark:text-blue-400">
                {t('sections.projects.buildingTheFuture')}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 