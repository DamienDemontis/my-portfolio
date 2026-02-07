import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowDown, Download, Mail } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import Balatro from '../blocks/Backgrounds/Balatro/Balatro'
import { OptimizedImage } from '../components/ui/OptimizedImage'
import { isLowEndDevice } from '../utils/performanceOptimizations'
import { useState, useEffect } from 'react'

export const Hero = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '0px 0px -30% 0px', // Animation stays active until Hero is 30% out of view
  })

  const [isLowEnd, setIsLowEnd] = useState(false)

  useEffect(() => {
    setIsLowEnd(isLowEndDevice())
  }, [])

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
    const resumeUrl = '/CV_Damien_DEMONTIS_EN.pdf'
    window.open(resumeUrl, '_blank')
  }

  return (
    <section id="home" ref={ref} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-8 sm:pb-0 md:pt-20 lg:pt-20">
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
          pixelFilter={2000.0}
          spinEase={0.6}
          isRotate={true}
          mouseInteraction={!isLowEnd}
          isVisible={inView}
        />
      </div>

      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 z-[1] bg-white/10 dark:bg-black/20"></div>

      {/* Optimized Background decoration - No expensive blur filters */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)',
            boxShadow: '0 0 120px 40px rgba(59, 130, 246, 0.1)'
          }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)',
            boxShadow: '0 0 120px 40px rgba(59, 130, 246, 0.1)'
          }}></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Content Section */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Optimized container for text content */}
            <div className="bg-white/10 dark:bg-black/15 rounded-3xl p-4 sm:p-5 md:p-8 lg:p-10 border border-white/20 shadow-xl"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                willChange: 'transform',
                transform: 'translateZ(0)'
              }}>
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-3"
              >
                <p className="text-lg md:text-xl text-white font-medium drop-shadow-lg">
                  {t('hero.greeting')}
                </p>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2"
              >
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  {t('hero.name')}
                </span>
              </motion.h1>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4 drop-shadow-lg"
              >
                {t('hero.title')}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl mx-auto drop-shadow-lg"
              >
                {t('hero.subtitle')}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-base md:text-lg text-white/80 mb-8 max-w-4xl mx-auto text-balance drop-shadow-lg"
              >
                {t('hero.description')}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8"
              >
                <button
                  onClick={scrollToContact}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl shadow-2xl border border-white/20 hover:border-white/40 transition-colors duration-200 flex items-center gap-2 group hover:scale-[1.02]"
                  style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  {t('hero.cta.contact')}
                </button>
                <button
                  onClick={handleResumeDownload}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl shadow-2xl border border-white/20 hover:border-white/40 transition-colors duration-200 flex items-center gap-2 group hover:scale-[1.02]"
                  style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                >
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  {t('hero.cta.resume')}
                </button>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Photo placeholder with artistic design */}
              <div className="w-40 h-40 sm:w-80 sm:h-80 md:w-96 md:h-96 relative">
                {/* Main photo container */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-3xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-white/20"
                  style={{ willChange: 'transform', transform: 'translateZ(0) rotate(3deg)' }}>
                  {/* Actual photo with optimized loading */}
                  <OptimizedImage
                    src="/Damien.jpg"
                    alt="Damien Demontis in traditional Korean robe in Seoul"
                    className="w-full h-full"
                    priority={true}
                    loading="eager"
                    width={953}
                    height={1271}
                    sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                </div>

                {/* Optimized floating element around photo */}
                <motion.div
                  animate={!isLowEnd ? { rotate: 360 } : {}}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  style={{ willChange: 'transform', transform: 'translateZ(0)' }}
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