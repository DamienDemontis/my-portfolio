import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Code, Users, BookOpen, Trophy } from 'lucide-react'

export const About = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const stats = [
    {
      icon: Code,
      value: t('about.stats.experience'),
      color: 'text-blue-600'
    },
    {
      icon: Trophy,
      value: t('about.stats.projects'),
      color: 'text-green-600'
    },
    {
      icon: BookOpen,
      value: t('about.stats.technologies'),
      color: 'text-purple-600'
    },
    {
      icon: Users,
      value: t('about.stats.mentoring'),
      color: 'text-orange-600'
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section id="about" className="section-padding bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Content */}
          <div className="order-2 lg:order-1">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('about.title')}
              </h2>
              <h3 className="text-xl md:text-2xl gradient-text font-semibold mb-6">
                {t('about.intro')}
              </h3>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6 mb-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('about.description')}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('about.aspiration')}
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="card p-4 text-center hover:scale-105 transition-transform duration-200"
                  >
                    <div className="flex flex-col items-center">
                      <IconComponent className={`w-8 h-8 ${stat.color} mb-2`} />
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {stat.value}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Image/Visual */}
          <motion.div
            variants={itemVariants}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Placeholder for profile image - you can replace this with an actual image */}
              <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-2xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full"></div>
                
                {/* Tech stack floating elements */}
                <div className="absolute top-8 left-8 bg-white/90 dark:bg-gray-800/90 rounded-lg px-3 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 backdrop-blur-sm">
                  React
                </div>
                <div className="absolute top-20 right-12 bg-white/90 dark:bg-gray-800/90 rounded-lg px-3 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 backdrop-blur-sm">
                  TypeScript
                </div>
                <div className="absolute bottom-20 left-6 bg-white/90 dark:bg-gray-800/90 rounded-lg px-3 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 backdrop-blur-sm">
                  Python
                </div>
                <div className="absolute bottom-8 right-8 bg-white/90 dark:bg-gray-800/90 rounded-lg px-3 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 backdrop-blur-sm">
                  Docker
                </div>

                {/* Center content placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Code className="w-16 h-16" />
                    </div>
                    <p className="text-lg font-semibold">Full Stack</p>
                    <p className="text-sm">Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 