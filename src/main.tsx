import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/performance.css'
import './i18n/config.ts'

// Initialize performance monitoring only in development
if (process.env.NODE_ENV === 'development') {
  import('./utils/performance').then(({ initPerformanceMonitoring, startFPSMonitoring, logMemoryUsage }) => {
    initPerformanceMonitoring()
    startFPSMonitoring()
    
    // Log memory usage every 10 seconds
    setInterval(logMemoryUsage, 10000)
  })
} else {
  // Register service worker in production for caching
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
  
  // Filter out YouTube tracking errors (caused by ad blockers)
  const originalError = console.error
  console.error = (...args) => {
    const message = args[0]?.toString() || ''
    if (message.includes('youtube.com') && message.includes('log_event')) {
      return // Suppress YouTube tracking errors
    }
    originalError.apply(console, args)
  }
}
 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
) 