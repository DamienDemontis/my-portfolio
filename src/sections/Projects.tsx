import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, ExternalLink, Code, Layers, Smartphone, Database, Server, Layout, Box, Cpu, Terminal, Cloud, Youtube } from 'lucide-react'
import { useState, useEffect } from 'react'
import { OptimizedImage } from '../components/ui/OptimizedImage'
import { isLowEndDevice } from '../utils/performanceOptimizations'

export const Projects = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [isLowEnd, setIsLowEnd] = useState(false)

  useEffect(() => {
    setIsLowEnd(isLowEndDevice())
  }, [])

  const projects = ['facial_recognition', 'leonart', 'intranet', 'inept_intruder', 'tank_game', 'msc_decouverte']

  const projectImages: Record<string, string> = {
    facial_recognition: '/projects/facial_recognition.png',
    leonart: '/projects/leonart.png',
    intranet: '/projects/intranet.png',
    inept_intruder: '/projects/inept_intruder.png',
    tank_game: '/projects/tank_game.png',
    msc_decouverte: '/projects/msc_decouverte.png'
  }

  const getProjectIcon = (tech: string) => {
    const lowerTech = tech.toLowerCase()
    if (lowerTech.includes('react') || lowerTech.includes('vue') || lowerTech.includes('front')) return Layout
    if (lowerTech.includes('node') || lowerTech.includes('back') || lowerTech.includes('api')) return Server
    if (lowerTech.includes('mobile') || lowerTech.includes('native')) return Smartphone
    if (lowerTech.includes('data') || lowerTech.includes('sql') || lowerTech.includes('mongo')) return Database
    if (lowerTech.includes('cloud') || lowerTech.includes('aws') || lowerTech.includes('docker')) return Cloud
    if (lowerTech.includes('c++') || lowerTech.includes('c') || lowerTech.includes('rust')) return Cpu
    if (lowerTech.includes('python') || lowerTech.includes('script')) return Terminal
    return Box
  }

  const getProjectColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-green-500 to-emerald-500',
      'from-indigo-500 to-violet-500',
      'from-rose-500 to-orange-500'
    ]
    return colors[index % colors.length]
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900"></div>

      {/* Optimized background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/20"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent dark:from-purple-900/20"></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <motion.div
          ref={ref}
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Layers className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Beautiful Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
          >
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
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
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 rounded-full"></div>
            <div className="absolute w-32 h-3 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-500/20 blur-sm rounded-full"></div>
          </motion.div>

          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => {
            const isHovered = hoveredProject === project
            const gradientColor = getProjectColor(index)

            return (
              <motion.div
                key={project}
                variants={cardVariants}
                onMouseEnter={() => !isLowEnd && setHoveredProject(project)}
                onMouseLeave={() => !isLowEnd && setHoveredProject(null)}
                className="group relative h-full"
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)'
                }}
              >
                <div
                  className="relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
                  style={{
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                  }}
                >
                  {/* Project Image/Video Area */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">                    {/* Project Preview (Image or Placeholder) */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
                      <OptimizedImage
                        src={projectImages[project]}
                        alt={t(`projects.items.${project}.title`)}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    {/* Floating Tech Badges */}
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
                        <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex-1 flex flex-col relative z-20 bg-white dark:bg-gray-800">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {t(`projects.items.${project}.title`)}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                        {t(`projects.items.${project}.description`)}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(() => {
                          const technologies = t(`projects.items.${project}.technologies`, { returnObjects: true });
                          const techArray = Array.isArray(technologies) ? technologies : [];
                          return techArray.map((tech, i) => {
                            const Icon = getProjectIcon(tech)
                            return (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              >
                                <Icon className="w-3 h-3" />
                                {tech}
                              </span>
                            )
                          })
                        })()}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-4 flex-wrap">
                          {(() => {
                            const githubUrl = t(`projects.items.${project}.github`, { defaultValue: "" })
                            const demoUrl = t(`projects.items.${project}.demo`, { defaultValue: "" })
                            const videoUrl = t(`projects.items.${project}.video`, { defaultValue: "" })

                            return (
                              <>
                                {githubUrl && (
                                  <a
                                    href={githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                  >
                                    <Github className="w-4 h-4" />
                                    Code
                                  </a>
                                )}
                                {demoUrl && (
                                  <a
                                    href={demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    Live Demo
                                  </a>
                                )}
                                {videoUrl && (
                                  <a
                                    href={videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                                  >
                                    <Youtube className="w-4 h-4" />
                                    Watch Video
                                  </a>
                                )}
                              </>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
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