import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Code, Database, Cloud, Settings, Wrench, Smartphone, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Skills = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  })

  // Helper CSS to hide scrollbars while preserving scroll/swipe
  const hideScrollbarCss = `
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `

  // Technology logos mapping - using Simple Icons CDN
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
    'ECS': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gamemaker.svg', // Using gamemaker as proxy for ECS
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
    'NoSQL': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mongodb.svg', // Using MongoDB as proxy for NoSQL
    
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
    'Design Thinking': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg', // Using Figma as proxy for Design Thinking
    
    // Mobile
    'React Native': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg',
    'Flutter': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/flutter.svg',
    'Expo': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/expo.svg',
    'Android': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/android.svg'
  }

  const skillCategories = [
    { key: 'frontend', icon: Code, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20', borderColor: 'border-blue-200 dark:border-blue-800' },
    { key: 'backend', icon: Database, color: 'from-green-500 to-green-600', bgColor: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20', borderColor: 'border-green-200 dark:border-green-800' },
    { key: 'devops', icon: Cloud, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20', borderColor: 'border-orange-200 dark:border-orange-800' },
    { key: 'databases', icon: Database, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20', borderColor: 'border-purple-200 dark:border-purple-800' },
    { key: 'mobile', icon: Smartphone, color: 'from-indigo-500 to-indigo-600', bgColor: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20', borderColor: 'border-indigo-200 dark:border-indigo-800' },
    { key: 'testing', icon: Settings, color: 'from-emerald-500 to-emerald-600', bgColor: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20', borderColor: 'border-emerald-200 dark:border-emerald-800' },
    { key: 'aiml', icon: Zap, color: 'from-pink-500 to-pink-600', bgColor: 'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20', borderColor: 'border-pink-200 dark:border-pink-800' },
    { key: 'tools', icon: Wrench, color: 'from-gray-500 to-gray-600', bgColor: 'from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20', borderColor: 'border-gray-200 dark:border-gray-700' }
  ]

  // Mobile UX state: active category filter, show-more, and responsive detection
  const [activeCategory, setActiveCategory] = useState<string>(skillCategories[0].key)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isDesktop, setIsDesktop] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    setIsDesktop(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const toggleExpanded = (key: string) => {
    setExpandedCategories(prev => {
      const copy = new Set(prev)
      if (copy.has(key)) copy.delete(key)
      else copy.add(key)
      return copy
    })
  }

  const showAllLabel = t('common.showAll', { defaultValue: 'Show all' })
  const showLessLabel = t('common.showLess', { defaultValue: 'Show less' })

  const getProficiencyColor = () => {
    // Use a consistent blue gradient for all proficiency levels
    return 'from-blue-500 to-blue-600'
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
        return '★★★★★'
      case 'advanced':
        return '★★★★☆'
      case 'intermediate':
        return '★★★☆☆'
      case 'beginner':
        return '★★☆☆☆'
      default:
        return '★★★☆☆'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Scoped styles */}
      <style dangerouslySetInnerHTML={{ __html: hideScrollbarCss }} />
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      {/* Optimized static background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 right-20 w-40 h-40 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          }}
        ></div>
        <div
          className="absolute bottom-10 left-20 w-40 h-40 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(100, 116, 139, 0.1) 0%, transparent 70%)',
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
          {/* Elegant Header with Soft Impact */}
          <div className="relative max-w-4xl mx-auto">
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


            {/* Subtle Floating Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-40"></div>
              <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-30 delay-700"></div>
              <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-25 delay-1000"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile category chips */}
        <div className="md:hidden mb-4 -mt-2 overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex gap-2 pr-2">
            {skillCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors whitespace-nowrap ${
                  activeCategory === cat.key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                {t(`skills.categories.${cat.key}.title`)}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {skillCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon
            const rawTechnologies = t(`skills.categories.${category.key}.technologies`, { returnObjects: true }) as any[]
            
            // Sort technologies by proficiency level (expert -> advanced -> intermediate -> beginner)
            const proficiencyOrder = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 }
            const technologies = rawTechnologies.sort((a, b) => {
              const aLevel = proficiencyOrder[a.level as keyof typeof proficiencyOrder] || 0
              const bLevel = proficiencyOrder[b.level as keyof typeof proficiencyOrder] || 0
              return bLevel - aLevel
            })

            const isExpanded = expandedCategories.has(category.key)
            const displayTechs = isDesktop ? technologies : technologies.slice(0, isExpanded ? technologies.length : 8)
            const mobileVisibilityClass = activeCategory === category.key ? 'block md:block' : 'hidden md:block'
            
            return (
              <motion.div
                key={category.key}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.01,
                  transition: { duration: 0.15 }
                }}
                className={`bg-white/95 dark:bg-gray-800/95 rounded-3xl p-0 border border-gray-200/60 dark:border-gray-700/60 shadow-xl hover:shadow-2xl transition-shadow duration-200 group overflow-hidden ${mobileVisibilityClass}`}
                style={{
                  willChange: 'transform, box-shadow',
                  transform: 'translateZ(0)'
                }}
              >
                {/* Header */}
                <div className={`p-4 bg-gradient-to-br ${category.bgColor} border-b ${category.borderColor} relative overflow-hidden`}>
                  <div className="flex items-center mb-3 relative z-10">
                    <motion.div 
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-r ${category.color} p-2 mr-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <IconComponent className="w-full h-full text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {t(`skills.categories.${category.key}.title`)}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {technologies.length} {t('skills.technologies')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <motion.div 
                    variants={containerVariants}
                    className="grid grid-cols-2 gap-2 md:space-y-2 md:grid-cols-1"
                  >
                    {displayTechs.map((tech, index) => {
                      const logoUrl = technologyLogos[tech.name]
                      
                      return (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          whileHover={{ 
                            scale: 1.01,
                            transition: { duration: 0.1 }
                          }}
                          className="group/tech"
                        >
                          {/* Technology card */}
                          <div 
                            className="relative p-3 rounded-xl bg-white/90 dark:bg-gray-700/90 border border-gray-200/60 dark:border-gray-600/60 hover:bg-white/95 dark:hover:bg-gray-700/95 transition-colors duration-150 shadow-sm hover:shadow-md"
                            style={{
                              willChange: 'background-color',
                              transform: 'translateZ(0)'
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.1 }}
                                  className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 p-1.5 shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                                  style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                                >
                                  {logoUrl ? (
                                    <img
                                      src={logoUrl}
                                      alt={tech.name}
                                      className="w-5 h-5 object-contain dark:invert"
                                    />
                                  ) : (
                                    <Code className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                  )}
                                </motion.div>
                                <div>
                                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                                    {tech.name}
                                  </span>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 md:block hidden">
                                    {tech.experience}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right hidden md:block">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {getProficiencyLabel(tech.level)}
                                </div>
                              </div>
                            </div>
                            
                            {/* Proficiency bar (desktop only) */}
                            <div className="hidden md:block w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={inView ? { width: getProficiencyWidth(tech.level) } : { width: 0 }}
                                transition={{ 
                                  duration: 1.5, 
                                  delay: 0.5 + categoryIndex * 0.1 + index * 0.05,
                                  ease: "easeOut"
                                }}
                                className={`h-1.5 bg-gradient-to-r ${getProficiencyColor()} rounded-full relative overflow-hidden`}
                              >
                                {/* Simplified shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>

                  {/* Show more / less for mobile */}
                  {!isDesktop && technologies.length > 8 && (
                    <button
                      onClick={() => toggleExpanded(category.key)}
                      className="mt-3 md:hidden w-full text-xs py-2 rounded-lg bg-white/70 dark:bg-gray-700/70 border border-gray-200/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300"
                    >
                      {isExpanded ? showLessLabel : showAllLabel}
                    </button>
                  )}
                </div>

                {/* Simplified floating element */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-xl rounded-full border border-gray-200/50 dark:border-gray-600/50 flex items-center justify-center shadow-lg">
                  <Zap className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center mt-8"
        >
          <div 
            className="max-w-3xl mx-auto backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div>
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('skills.summary.title')}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {t('skills.summary.description')}
              <span className="block mt-3 font-semibold text-blue-600 dark:text-blue-400">
                {t('skills.summary.tagline')}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 