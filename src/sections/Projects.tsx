import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, Eye, Cpu, Palette, Building, Gamepad2 } from 'lucide-react'

export const Projects = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const projects = [
    {
      key: 'facial_recognition',
      icon: Cpu,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      github: 'https://github.com/damiendemontis/facial-recognition-system',
      demo: null,
      featured: true
    },
    {
      key: 'leonart',
      icon: Palette,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800',
      github: 'https://github.com/damiendemontis/leonart',
      demo: 'https://leonart-demo.vercel.app',
      featured: true
    },
    {
      key: 'tank_game',
      icon: Gamepad2,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      github: null,
      demo: 'https://youtu.be/jWfFh3oCJ2I',
      featured: true
    },
    {
      key: 'intranet',
      icon: Building,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      github: null,
      demo: 'https://youtu.be/fSEylEdaZiM',
      featured: false
    },
    {
      key: 'inept_intruder',
      icon: Cpu,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      github: 'https://github.com/damiendemontis/inept-intruder',
      demo: null,
      featured: false
    }
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  }

  return (
    <section id="projects" className="section-padding bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('projects.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-6 max-w-2xl mx-auto">
            A selection of projects that showcase my technical skills, creativity, and problem-solving abilities.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {projects.map((project) => {
            const IconComponent = project.icon
            const technologies = t(`projects.items.${project.key}.technologies`, { returnObjects: true }) as string[]
            const features = t(`projects.items.${project.key}.features`, { returnObjects: true }) as string[]
            
            return (
              <motion.div
                key={project.key}
                variants={cardVariants}
                className={`card p-0 overflow-hidden hover:shadow-xl transition-all duration-300 group relative ${
                  project.featured ? 'lg:col-span-2 xl:col-span-1' : ''
                }`}
              >
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Featured
                    </span>
                  </div>
                )}

                {/* Header with gradient background */}
                <div className={`p-6 bg-gradient-to-br ${project.bgColor} border-b ${project.borderColor}`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${project.color} p-2.5 mr-4 shadow-lg`}>
                      <IconComponent className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {t(`projects.items.${project.key}.title`)}
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t(`projects.items.${project.key}.description`)}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Video for tank_game */}
                  {project.key === 'tank_game' && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm flex items-center gap-2">
                        <Eye className="w-4 h-4 text-red-500" />
                        Game Demo
                      </h4>
                      <div className="relative overflow-hidden rounded-lg border border-green-200 dark:border-green-800">
                        <iframe
                          src="https://www.youtube.com/embed/jWfFh3oCJ2I"
                          title="Tank Game Demo"
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
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium group/btn"
                      >
                        <Github className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                        Code
                      </a>
                    )}
                    {project.demo && project.key !== 'tank_game' && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${project.color} text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium group/btn`}
                      >
                        {project.key === 'intranet' ? (
                          <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                        ) : (
                          <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                        )}
                        {project.key === 'intranet' ? 'Watch Demo' : 'Live Demo'}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-12"
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Each project represents a unique challenge and learning opportunity. 
              I focus on creating solutions that are not only technically sound but also 
              user-friendly and scalable. View my{' '}
              <a 
                href="https://github.com/damiendemontis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                GitHub profile
              </a>
              {' '}for more projects and contributions.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 