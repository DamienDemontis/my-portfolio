import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowDown, Download, Mail } from 'lucide-react'

export const Hero = () => {
  const { t } = useTranslation()

  const scrollToAbout = () => {
    const element = document.querySelector('#about')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleResumeDownload = () => {
    // This would typically link to your actual resume file
    const resumeUrl = '/resume-damien-demontis.pdf'
    window.open(resumeUrl, '_blank')
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center gradient-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 dark:bg-secondary-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="text-center">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
              {t('hero.greeting')}
            </p>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
          >
            <span className="gradient-text">{t('hero.name')}</span>
          </motion.h1>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-gray-200 mb-6"
          >
            {t('hero.title')}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-4xl mx-auto text-balance"
          >
            {t('hero.description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <button
              onClick={scrollToContact}
              className="btn-primary flex items-center gap-2 group"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {t('hero.cta.contact')}
            </button>
            <button
              onClick={handleResumeDownload}
              className="btn-secondary flex items-center gap-2 group"
            >
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {t('hero.cta.resume')}
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col items-center"
          >
            <button
              onClick={scrollToAbout}
              className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 group"
              aria-label="Scroll to about section"
            >
              <ArrowDown className="w-6 h-6 animate-bounce group-hover:scale-110 transition-transform duration-200" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 