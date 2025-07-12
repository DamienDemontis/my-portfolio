import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Code, Server, Cloud, Database, Wrench } from 'lucide-react'

export const Skills = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const skillCategories = [
    {
      key: 'frontend',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500'
    },
    {
      key: 'backend',
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500'
    },
    {
      key: 'devops',
      icon: Cloud,
      color: 'from-purple-500 to-violet-500',
      borderColor: 'border-purple-500'
    },
    {
      key: 'databases',
      icon: Database,
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-500'
    },
    {
      key: 'tools',
      icon: Wrench,
      color: 'from-pink-500 to-rose-500',
      borderColor: 'border-pink-500'
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
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
    <section id="skills" className="section-padding bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('skills.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => {
            const IconComponent = category.icon
            const technologies = t(`skills.categories.${category.key}.technologies`, { returnObjects: true }) as string[]
            
            return (
              <motion.div
                key={category.key}
                variants={cardVariants}
                className="card p-6 hover:shadow-xl transition-all duration-300 group hover:scale-105"
              >
                {/* Header */}
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} p-2.5 mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <IconComponent className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {t(`skills.categories.${category.key}.title`)}
                  </h3>
                </div>

                {/* Technologies */}
                <motion.div 
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                >
                  {technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      variants={tagVariants}
                      custom={index}
                      className={`px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium border-2 border-transparent hover:${category.borderColor} hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 cursor-default`}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Proficiency bar */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Proficiency
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {category.key === 'frontend' ? '95%' : 
                       category.key === 'backend' ? '90%' :
                       category.key === 'devops' ? '85%' :
                       category.key === 'databases' ? '80%' : '75%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { 
                        width: category.key === 'frontend' ? '95%' : 
                               category.key === 'backend' ? '90%' :
                               category.key === 'devops' ? '85%' :
                               category.key === 'databases' ? '80%' : '75%'
                      } : { width: 0 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                    />
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
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Always learning and staying up-to-date with the latest technologies and best practices. 
            Passionate about clean code, scalable architecture, and continuous improvement.
          </p>
        </motion.div>
      </div>
    </section>
  )
} 