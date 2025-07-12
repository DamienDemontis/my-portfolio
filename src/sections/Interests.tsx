import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Globe, Palette, Users, Lightbulb, Sprout, BookOpen, Gamepad2 } from 'lucide-react'

export const Interests = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const interestCategories = [
    {
      key: 'technology',
      icon: Brain,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      key: 'world',
      icon: Globe,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      key: 'creativity',
      icon: Palette,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      key: 'community',
      icon: Users,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  }

  return (
    <section id="interests" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('interests.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('interests.subtitle')}
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-8"
        >
          {interestCategories.map((category) => {
            const IconComponent = category.icon
            const items = t(`interests.categories.${category.key}.items`, { returnObjects: true }) as string[]
            
            return (
              <motion.div
                key={category.key}
                variants={cardVariants}
                className="card p-0 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Header with gradient background */}
                <div className={`p-6 bg-gradient-to-br ${category.bgColor} border-b ${category.borderColor}`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} p-2.5 mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <IconComponent className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {t(`interests.categories.${category.key}.title`)}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <motion.div
                    variants={containerVariants}
                    className="space-y-3"
                  >
                    {items.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group/item"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 group-hover/item:from-primary-200 group-hover/item:to-primary-300 dark:group-hover/item:from-primary-800 dark:group-hover/item:to-primary-900 transition-all duration-200">
                          {category.key === 'technology' && index === 0 && <Brain className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                          {category.key === 'technology' && index === 1 && <Lightbulb className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                          {category.key === 'world' && index === 0 && <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                          {category.key === 'world' && index === 1 && <Sprout className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                          {category.key === 'creativity' && index === 0 && <BookOpen className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                          {category.key === 'creativity' && index === 1 && <Gamepad2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                          {category.key === 'creativity' && index === 2 && <Palette className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                          {category.key === 'community' && <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                          {(
                            (category.key === 'technology' && index > 1) ||
                            (category.key === 'world' && index > 1) ||
                            (category.key === 'creativity' && index > 2) ||
                            !['technology', 'world', 'creativity', 'community'].includes(category.key)
                          ) && <div className="w-2 h-2 bg-primary-500 rounded-full"></div>}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Personal note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-12"
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              These interests shape my perspective as a developer and help me bring creativity, 
              global awareness, and community focus to every project. I believe the best solutions 
              come from understanding both technology and the human experience.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 