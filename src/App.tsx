import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import { Navbar } from './components/layout/Navbar'
import { Hero } from './sections/Hero'
import { WithProfiler } from './utils/ProfilerLog'
import { LoadingScreen } from './components/LoadingScreen'

// Lazy load non-critical sections for better performance
const About = lazy(() => import('./sections/About').then(m => ({ default: m.About })))
const Experience = lazy(() => import('./sections/Experience').then(m => ({ default: m.Experience })))
const Skills = lazy(() => import('./sections/Skills').then(m => ({ default: m.Skills })))
const Education = lazy(() => import('./sections/Education').then(m => ({ default: m.Education })))
const PhotographyShowcase = lazy(() => import('./sections/PhotographyShowcase').then(m => ({ default: m.PhotographyShowcase })))
const Projects = lazy(() => import('./sections/Projects').then(m => ({ default: m.Projects })))
const Certifications = lazy(() => import('./sections/Certifications').then(m => ({ default: m.Certifications })))
const Interests = lazy(() => import('./sections/Interests').then(m => ({ default: m.Interests })))
const Languages = lazy(() => import('./sections/Languages').then(m => ({ default: m.Languages })))
const Contact = lazy(() => import('./sections/Contact').then(m => ({ default: m.Contact })))
const Footer = lazy(() => import('./components/layout/Footer').then(m => ({ default: m.Footer })))

// Fallback component for lazy loading
const SectionFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

// Import debug utils in development
if (process.env.NODE_ENV === 'development') {
  import('./utils/debugUtils');
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <ThemeProvider>
      <WithProfiler id="Root">
        <div className="relative min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Fixed Navbar - Always visible and positioned */}
        <Navbar />
        
        {/* Main Content - Always rendered but initially hidden - OPTIMIZED */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{
            duration: 0.5, // Further reduced from 0.8
            ease: "easeOut", // Simpler easing for better performance
            delay: isLoading ? 0 : 0
          }}
          className="min-h-screen"
          style={{
            willChange: 'opacity',
            transform: 'translateZ(0)'
          }}
        >
          <main>
            <Hero />
            <Suspense fallback={<SectionFallback />}>
              <About />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Experience />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Skills />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Education />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <PhotographyShowcase />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Projects />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Certifications />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Interests />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Languages />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Contact />
            </Suspense>
          </main>
          <Suspense fallback={<SectionFallback />}>
            <Footer />
          </Suspense>
          {process.env.NODE_ENV === 'development' && (
            <>
              {/* Dynamic imports for debug components */}
              {/* These will only be loaded in development */}
            </>
          )}
        </motion.div>

        {/* Loading Screen - Overlay that fades out - OPTIMIZED */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0
              }}
              transition={{
                duration: 0.6, // Further reduced from 0.8
                ease: "easeOut" // Simpler easing
              }}
              className="fixed inset-0 z-[10000]"
              style={{
                willChange: 'opacity',
                transform: 'translateZ(0)'
              }}
            >
              <LoadingScreen onLoadingComplete={handleLoadingComplete} />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </WithProfiler>
    </ThemeProvider>
  )
}

export default App 