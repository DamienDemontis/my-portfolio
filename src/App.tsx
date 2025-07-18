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

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
      </div>
    </ThemeProvider>
  )
}

export default App 