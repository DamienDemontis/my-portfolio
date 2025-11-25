import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Code, Database, Cloud, Wrench, Smartphone, Zap, TestTube } from 'lucide-react'
import { useState, useEffect } from 'react'
import { isLowEndDevice } from '../utils/performanceOptimizations'

export const Skills = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

  const [isLowEnd, setIsLowEnd] = useState(false)

  useEffect(() => {
    setIsLowEnd(isLowEndDevice())
  }, [])

  // Technology logos mapping
  const technologyLogos: Record<string, string> = {
    // Frontend
    'React': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg',
    'Vue.js': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/vuedotjs.svg',
    'Nuxt.js': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nuxtdotjs.svg',
    'Next.js': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nextdotjs.svg',
    'TypeScript': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg',
    'JavaScript': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/javascript.svg',
    'HTML5': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/html5.svg',
    'CSS3': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/css3.svg',
    'Tailwind CSS': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tailwindcss.svg',

    // Backend
    'Node.js': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nodedotjs.svg',
    'Python': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/python.svg',
    'Django': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/django.svg',
    'PHP': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/php.svg',
    'Java': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/openjdk.svg',
    'C': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/c.svg',
    'C++': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/cplusplus.svg',
    'C#': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/csharp.svg',
    'Haskell': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/haskell.svg',
    'ECS': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gamemaker.svg',
    'REST APIs': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/fastapi.svg',
    'GraphQL': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/graphql.svg',

    // DevOps & Cloud
    'Docker': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docker.svg',
    'Kubernetes': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/kubernetes.svg',
    'Jenkins': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/jenkins.svg',
    'GitLab CI/CD': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gitlab.svg',
    'Firebase': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/firebase.svg',
    'Google Cloud Platform': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlecloud.svg',
    'Linux': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linux.svg',
    'Bash': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gnubash.svg',
    'Ansible': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/ansible.svg',

    // Databases
    'PostgreSQL': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/postgresql.svg',
    'MongoDB': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mongodb.svg',
    'Firestore': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/firebase.svg',
    'MySQL': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mysql.svg',
    'Redis': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/redis.svg',
    'NoSQL': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mongodb.svg',

    // Testing
    'Jest': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/jest.svg',
    'Cypress': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/cypress.svg',
    'Mocha': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mocha.svg',

    // AI/ML
    'TensorFlow': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tensorflow.svg',
    'PyTorch': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/pytorch.svg',
    'OpenCV': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/opencv.svg',

    // Tools
    'Git': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/git.svg',
    'Figma': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg',
    'Unity': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/unity.svg',
    'Unreal Engine': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/unrealengine.svg',
    'PyQt6': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/qt.svg',
    'Blender': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/blender.svg',
    'Zapier': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/zapier.svg',
    'Design Thinking': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg',

    // Mobile
    'React Native': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg',
    'Flutter': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/flutter.svg',
    'Expo': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/expo.svg',
    'Android': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/android.svg'
  }

  const skillCategories = [
    { key: 'frontend', icon: Code, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500' },
    { key: 'backend', icon: Database, color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/10', borderColor: 'border-green-500' },
    { key: 'devops', icon: Cloud, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500' },
    { key: 'databases', icon: Database, color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500' },
    { key: 'mobile', icon: Smartphone, color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500' },
    { key: 'testing', icon: TestTube, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500' },
    { key: 'aiml', icon: Zap, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500' },
    { key: 'tools', icon: Wrench, color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500' }
  ]

  const [activeCategory, setActiveCategory] = useState<string>(skillCategories[0].key)

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'from-blue-600 to-blue-700'
      case 'advanced':
        return 'from-blue-500 to-blue-600'
      case 'intermediate':
        return 'from-blue-400 to-blue-500'
      case 'beginner':
        return 'from-slate-400 to-slate-500'
      default:
        return 'from-blue-500 to-blue-600'
    }
  }

  const getProficiencyWidth = (level: string) => {
    switch (level) {
      case 'expert':
        return '100%'
      case 'advanced':
        return '80%'
      case 'intermediate':
        return '60%'
      case 'beginner':
        return '40%'
      default:
        return '50%'
    }
  }

  const getProficiencyLabel = (level: string) => {
    switch (level) {
      case 'expert':
        return 'Expert'
      case 'advanced':
        return 'Avancé'
      case 'intermediate':
        return 'Intermédiaire'
      case 'beginner':
        return 'Débutant'
      default:
        return 'Intermédiaire'
    }
  }

  return (
    <section id="skills" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Clean background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Clean Icon Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Code className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Beautiful Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
              {t('skills.title')}
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

        {/* Category Tabs */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {skillCategories.map((category) => {
              const IconComponent = category.icon
              const isActive = activeCategory === category.key

              return (
                <motion.button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  whileHover={!isLowEnd ? { scale: 1.05 } : {}}
                  whileTap={!isLowEnd ? { scale: 0.95 } : {}}
                  className={`
                    group relative px-4 py-3 md:px-6 md:py-4 rounded-2xl font-semibold
                    transition-all duration-300 flex items-center gap-2 md:gap-3
                    ${isActive
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg shadow-${category.color.split('-')[1]}-500/30`
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }
                  `}
                >
                  <IconComponent className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                  <span className="text-sm md:text-base">{t(`skills.categories.${category.key}.title`)}</span>

                  {isActive && !isLowEnd && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-2xl border-2 border-white/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Technologies Display */}
        <AnimatePresence mode="wait">
          {skillCategories.map((category) => {
            if (activeCategory !== category.key) return null

            const rawTechnologies = t(`skills.categories.${category.key}.technologies`, { returnObjects: true }) as any[]

            // Sort by proficiency
            const proficiencyOrder = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 }
            const technologies = rawTechnologies.sort((a, b) => {
              const aLevel = proficiencyOrder[a.level as keyof typeof proficiencyOrder] || 0
              const bLevel = proficiencyOrder[b.level as keyof typeof proficiencyOrder] || 0
              return bLevel - aLevel
            })

            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl mx-auto"
              >
                {/* Category Header */}
                <div className={`mb-6 p-6 rounded-3xl bg-gradient-to-br ${category.bgColor} border ${category.borderColor}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} p-3 shadow-lg`}>
                      <category.icon className="w-full h-full text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {t(`skills.categories.${category.key}.title`)}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {technologies.length} {t('skills.technologies')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technologies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {technologies.map((tech, index) => {
                    const logoUrl = technologyLogos[tech.name]

                    return (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: isLowEnd ? 0 : index * 0.05 }}
                        whileHover={!isLowEnd ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          {/* Logo */}
                          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 p-2.5 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-600">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={tech.name}
                                className="w-full h-full object-contain dark:invert"
                              />
                            ) : (
                              <Code className="w-full h-full text-gray-600 dark:text-gray-400" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                              {tech.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {tech.experience}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${getProficiencyColor(tech.level)} text-white`}>
                                {getProficiencyLabel(tech.level)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Proficiency bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: getProficiencyWidth(tech.level) }}
                            transition={{
                              duration: isLowEnd ? 0 : 0.8,
                              delay: isLowEnd ? 0 : index * 0.05,
                              ease: "easeOut"
                            }}
                            className={`h-full bg-gradient-to-r ${getProficiencyColor(tech.level)} rounded-full`}
                          />
                        </div>

                        {/* Description (optional, shown on hover or always) */}
                        {tech.description && (
                          <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                            {tech.description}
                          </p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-12"
        >
          <div className="max-w-3xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('skills.summary.title')}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('skills.summary.description')}
              <span className="block mt-4 font-semibold text-blue-600 dark:text-blue-400">
                {t('skills.summary.tagline')}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
