import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, ChevronDown, User, Briefcase, GraduationCap, MapPin, Mail } from 'lucide-react'
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
      // Change to trigger when leaving hero section (around viewport height)
      setIsScrolled(scrollTop > window.innerHeight * 0.8)
      
      // Update current section for plane animation
      const sections = ['home', 'about', 'experience', 'skills', 'education', 'photography', 'projects', 'contact']
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
      key: 'photography',
      label: t('nav.photography'),
      icon: <MapPin className="w-4 h-4" />,
      items: [
        { key: 'photography', href: '#photography', icon: '📸' }
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
      'photography': 225,
      'projects': 270,
      'contact': 315
    }
    return rotations[currentSection] || 0
  }

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-black/80 border border-white/30 dark:border-gray-700/40 shadow-2xl'
          : 'bg-white/15 dark:bg-black/15 border border-white/15 dark:border-gray-700/25'
      }`}
      style={{
        boxShadow: isScrolled 
          ? '0 8px 32px rgba(0, 0, 0, 0.15)' 
          : '0 4px 16px rgba(0, 0, 0, 0.1)',
        borderRadius: '2rem',
        width: 'fit-content',
        maxWidth: 'calc(100vw - 2rem)',
        willChange: 'transform, opacity',
        transform: 'translateZ(0) translateX(-50%)'
      }}
    >
      <div className="px-6 lg:px-8">
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
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border border-white/20">
                  <span className="text-white text-xl font-bold">D²</span>
                </div>
                {/* Flying plane indicator */}
                <motion.div
                  className="absolute -top-2 -right-2 text-xl filter drop-shadow-lg"
                  animate={{ rotate: getPlaneRotation() }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  ✈️
                </motion.div>
              </div>
              <div className="hidden sm:block">
                <div className={`text-base lg:text-lg font-bold drop-shadow-lg ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                  Damien Demontis
                </div>
              </div>
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 ml-8">
            {navGroups.map((group) => (
              <div key={group.key} className="relative">
                {group.items.length === 1 ? (
                  /* Single item - direct link */
                  <motion.button
                    onClick={() => scrollToSection(group.items[0].href)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-colors duration-150 font-medium border whitespace-nowrap ${
                      isScrolled 
                        ? 'text-gray-800 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/20 dark:hover:bg-white/10 border-gray-300/20 dark:border-white/10 hover:border-gray-400/30 dark:hover:border-white/20' 
                        : 'text-white/90 hover:text-white hover:bg-white/10 border-white/10 hover:border-white/20'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                  >
                    {group.icon}
                    <span>{group.label}</span>
                  </motion.button>
                ) : (
                  /* Multiple items - dropdown */
                  <div>
                    <motion.button
                      onClick={() => handleDropdownToggle(group.key)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-colors duration-150 font-medium border whitespace-nowrap ${
                        isScrolled 
                          ? 'text-gray-800 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/20 dark:hover:bg-white/10 border-gray-300/20 dark:border-white/10 hover:border-gray-400/30 dark:hover:border-white/20' 
                          : 'text-white/90 hover:text-white hover:bg-white/10 border-white/10 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
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
                          initial={{ opacity: 0, y: -5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-2xl border overflow-hidden ${
                            isScrolled 
                              ? 'bg-white/90 dark:bg-black/85 border-gray-300/30 dark:border-white/20' 
                              : 'bg-white/80 dark:bg-black/80 border-white/20 dark:border-gray-700/30'
                          }`}
                          style={{
                            willChange: 'transform, opacity',
                            transform: 'translateZ(0)'
                          }}
                        >
                          {group.items.map((item) => (
                            <motion.button
                              key={item.key}
                              onClick={() => scrollToSection(item.href)}
                              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 border-b last:border-b-0 ${
                                isScrolled 
                                  ? 'text-gray-800 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/20 dark:hover:bg-white/10 border-gray-300/10 dark:border-white/5' 
                                  : 'text-white/90 hover:text-white hover:bg-white/10 border-white/5'
                              }`}
                              whileHover={{ x: 5 }}
                            >
                              <span className="text-lg drop-shadow-md">{item.icon}</span>
                              <span className="font-medium drop-shadow-md">{t(`nav.${item.key}`)}</span>
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
          <div className="flex items-center space-x-3 ml-8">
            <div className={`p-2 rounded-xl backdrop-blur-sm border ${
              isScrolled 
                ? 'bg-gray-100/20 dark:bg-white/10 border-gray-300/20 dark:border-white/20' 
                : 'bg-white/10 border-white/20'
            }`}>
              <ThemeToggle />
            </div>
            <div className={`p-2 rounded-xl backdrop-blur-sm border ${
              isScrolled 
                ? 'bg-gray-100/20 dark:bg-white/10 border-gray-300/20 dark:border-white/20' 
                : 'bg-white/10 border-white/20'
            }`}>
              <LanguageSwitcher />
            </div>
            
            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-3 rounded-2xl backdrop-blur-sm border transition-all duration-200 shadow-lg ${
                isScrolled 
                  ? 'bg-gray-100/20 dark:bg-white/10 text-gray-800 dark:text-white border-gray-300/20 dark:border-white/20 hover:bg-gray-200/30 dark:hover:bg-white/20' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
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
              transition={{ duration: 0.2 }}
              className={`lg:hidden mt-4 border-t shadow-2xl rounded-2xl overflow-hidden max-h-[70vh] overflow-y-auto ${
                isScrolled 
                  ? 'bg-white/90 dark:bg-black/85 border-gray-300/30 dark:border-white/20' 
                  : 'bg-white/80 dark:bg-black/80 border-white/20 dark:border-gray-700/30'
              }`}
              style={{
                willChange: 'height, opacity',
                transform: 'translateZ(0)'
              }}
            >
              <div className="p-4">
                {navGroups.map((group) => (
                  <div key={group.key} className="mb-4">
                    <div className="flex items-center space-x-2 mb-3 px-2">
                      {group.icon}
                      <span className="font-bold drop-shadow-lg text-gray-800 dark:text-white">
                        {group.label}
                      </span>
                    </div>
                    <div className="space-y-2 ml-6">
                      {group.items.map((item) => (
                        <motion.button
                          key={item.key}
                          onClick={() => scrollToSection(item.href)}
                          className="flex items-center space-x-3 w-full text-left py-3 px-4 rounded-xl transition-all duration-200 font-medium border text-gray-800 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/20 dark:hover:bg-white/10 border-gray-300/10 dark:border-white/5 hover:border-gray-400/20 dark:hover:border-white/20"
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-lg drop-shadow-md">{item.icon}</span>
                          <span className="drop-shadow-md">{t(`nav.${item.key}`)}</span>
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