import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, ChevronDown, User, Briefcase, GraduationCap, Code, MapPin, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '../common/ThemeToggle'
import { LanguageSwitcher } from '../common/LanguageSwitcher'

export const Navbar = () => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [currentSection, setCurrentSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 20)
      
      // Update current section for plane animation
      const sections = ['home', 'about', 'experience', 'skills', 'education', 'journey', 'projects', 'contact']
      const currentSec = sections.find(section => {
        const element = document.querySelector(`#${section}`)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSec) {
        setCurrentSection(currentSec)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navGroups = [
    {
      key: 'about',
      label: t('nav.about'),
      icon: <User className="w-4 h-4" />,
      items: [
        { key: 'home', href: '#home', icon: '🏠' },
        { key: 'about', href: '#about', icon: '👨‍💻' },
        { key: 'interests', href: '#interests', icon: '🎯' },
        { key: 'languages', href: '#languages', icon: '🌐' }
      ]
    },
    {
      key: 'experience',
      label: t('nav.experience'),
      icon: <Briefcase className="w-4 h-4" />,
      items: [
        { key: 'experience', href: '#experience', icon: '💼' },
        { key: 'skills', href: '#skills', icon: '⚡' },
        { key: 'projects', href: '#projects', icon: '🚀' }
      ]
    },
    {
      key: 'education',
      label: t('nav.education'),
      icon: <GraduationCap className="w-4 h-4" />,
      items: [
        { key: 'education', href: '#education', icon: '🎓' },
        { key: 'certifications', href: '#certifications', icon: '📜' }
      ]
    },
    {
      key: 'journey',
      label: 'Journey',
      icon: <MapPin className="w-4 h-4" />,
      items: [
        { key: 'journey', href: '#journey', icon: '🌏' }
      ]
    },
    {
      key: 'contact',
      label: t('nav.contact'),
      icon: <Mail className="w-4 h-4" />,
      items: [
        { key: 'contact', href: '#contact', icon: '📧' }
      ]
    }
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
    setActiveDropdown(null)
  }

  const handleDropdownToggle = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key)
  }

  const getPlaneRotation = () => {
    const rotations: { [key: string]: number } = {
      'home': 0,
      'about': 45,
      'experience': 90,
      'skills': 135,
      'education': 180,
      'journey': 225,
      'projects': 270,
      'contact': 315
    }
    return rotations[currentSection] || 0
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-20">
          {/* Logo with animated plane */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
          >
            <button
              onClick={() => scrollToSection('#home')}
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white text-xl font-bold">D²</span>
                </div>
                {/* Flying plane indicator */}
                <motion.div
                  className="absolute -top-2 -right-2 text-xl"
                  animate={{ rotate: getPlaneRotation() }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  ✈️
                </motion.div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold gradient-text">Damien Demontis</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Full-Stack Developer</div>
              </div>
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navGroups.map((group) => (
              <div key={group.key} className="relative">
                {group.items.length === 1 ? (
                  /* Single item - direct link */
                  <motion.button
                    onClick={() => scrollToSection(group.items[0].href)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {group.icon}
                    <span>{group.label}</span>
                  </motion.button>
                ) : (
                  /* Multiple items - dropdown */
                  <div>
                    <motion.button
                      onClick={() => handleDropdownToggle(group.key)}
                      className="flex items-center space-x-2 px-4 py-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {group.icon}
                      <span>{group.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === group.key ? 'rotate-180' : ''
                      }`} />
                    </motion.button>
                    
                    <AnimatePresence>
                      {activeDropdown === group.key && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                          {group.items.map((item) => (
                            <motion.button
                              key={item.key}
                              onClick={() => scrollToSection(item.href)}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                              whileHover={{ x: 5 }}
                            >
                              <span className="text-lg">{item.icon}</span>
                              <span className="font-medium">{t(`nav.${item.key}`)}</span>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg"
              aria-label="Toggle menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 shadow-2xl rounded-b-3xl overflow-hidden"
            >
              <div className="container-padding py-6">
                {navGroups.map((group) => (
                  <div key={group.key} className="mb-4">
                    <div className="flex items-center space-x-2 mb-3 px-2">
                      {group.icon}
                      <span className="font-bold text-gray-900 dark:text-gray-100">{group.label}</span>
                    </div>
                    <div className="space-y-2 ml-6">
                      {group.items.map((item) => (
                        <motion.button
                          key={item.key}
                          onClick={() => scrollToSection(item.href)}
                          className="flex items-center space-x-3 w-full text-left py-3 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{t(`nav.${item.key}`)}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
} 