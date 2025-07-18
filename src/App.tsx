import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import { Navbar } from './components/layout/Navbar'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Experience } from './sections/Experience'
import { Skills } from './sections/Skills'
import { Education } from './sections/Education'
import { PhotographyShowcase } from './sections/PhotographyShowcase'
import { Projects } from './sections/Projects'
import { Certifications } from './sections/Certifications'
import { Interests } from './sections/Interests'
import { Languages } from './sections/Languages'
import { Contact } from './sections/Contact'
import { Footer } from './components/layout/Footer'
import { PerformanceDashboard } from './components/debug/PerformanceDashboard'
import { LoadingScreen } from './components/LoadingScreen'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Main Content - Always rendered but initially hidden */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.4, 0, 0.2, 1],
            delay: isLoading ? 0 : 0.3 // Small delay to ensure smooth crossfade
          }}
          className="min-h-screen"
        >
          <Navbar />
          <main>
            <Hero />
            <About />
            <Experience />
            <Skills />
            <Education />
            <PhotographyShowcase />
            <Projects />
            <Certifications />
            <Interests />
            <Languages />
            <Contact />
          </main>
          <Footer />
          <PerformanceDashboard />
        </motion.div>

        {/* Loading Screen - Overlay that fades out */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ 
                opacity: 0,
                scale: 1.05,
                filter: "blur(8px)"
              }}
              transition={{ 
                duration: 1.2, 
                ease: [0.4, 0, 0.2, 1]
              }}
              className="fixed inset-0 z-[10000]"
            >
              <LoadingScreen onLoadingComplete={handleLoadingComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}

export default App 