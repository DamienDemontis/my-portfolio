import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowDown, Download, Mail } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import Balatro from '../blocks/Backgrounds/Balatro/Balatro'

export const Hero = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    threshold: 0.1,
  })

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
    // Download English version by default
    const resumeUrl = '/CV_Demontis_Damien_2024_LINKEDIN_EN.pdf'
    window.open(resumeUrl, '_blank')
  }

  return (
    <section id="home" ref={ref} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 md:pt-0">
      {/* Balatro Animated Background */}
      <div className="absolute inset-0 z-0">
        <Balatro
          spinRotation={-1.5}
          spinSpeed={2.5}
          offset={[0.1, 0.1]}
          color1="#0ea5e9"
          color2="#0284c7"
          color3="#0f172a"
          contrast={2.0}
          lighting={0.3}
          spinAmount={0.3}
          pixelFilter={500.0}
          spinEase={0.6}
          isRotate={true}
          mouseInteraction={false}
          isVisible={inView}
        />
      </div>

      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 z-[1] bg-white/10 dark:bg-black/20 backdrop-blur-[0.5px]"></div>

      {/* Simplified Background decoration */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Section */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Glass container for text content */}
            <div className="backdrop-blur-xl bg-white/5 dark:bg-black/5 rounded-3xl p-8 lg:p-12 border border-white/10 shadow-2xl" 
                 style={{
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                 }}>
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <p className="text-lg md:text-xl text-white font-medium drop-shadow-lg">
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
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  {t('hero.name')}
                </span>
              </motion.h1>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-6 drop-shadow-lg"
              >
                {t('hero.title')}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-lg"
              >
                {t('hero.subtitle')}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-base md:text-lg text-white/80 mb-12 max-w-4xl mx-auto text-balance drop-shadow-lg"
              >
                {t('hero.description')}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-16"
              >
                <button
                  onClick={scrollToContact}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-2 group hover:scale-105"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  {t('hero.cta.contact')}
                </button>
                <button
                  onClick={handleResumeDownload}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-2 group hover:scale-105"
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
                className="flex flex-col items-center lg:justify-start"
              >
                <button
                  onClick={scrollToAbout}
                  className="text-white/80 hover:text-white transition-colors duration-200 group drop-shadow-lg"
                  aria-label="Scroll to about section"
                >
                  <ArrowDown className="w-6 h-6 animate-bounce group-hover:scale-110 transition-transform duration-200" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Photo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Photo placeholder with artistic design */}
              <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 relative">
                {/* Main photo container */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-blue-500 to-purple-600 rounded-3xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-700 border border-white/20">
                  {/* Actual photo */}
                  <img 
                    src="/Damien.jpg" 
                    alt="Damien Demontis in traditional Korean robe in Seoul"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating elements around photo */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-lg border border-white/20"
                >
                  D²
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 