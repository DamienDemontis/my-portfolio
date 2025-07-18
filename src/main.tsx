import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config.ts'

// Initialize performance monitoring only in development
if (process.env.NODE_ENV === 'development') {
  import('./utils/performance').then(({ initPerformanceMonitoring, startFPSMonitoring, logMemoryUsage }) => {
    initPerformanceMonitoring()
    startFPSMonitoring()
    
    // Log memory usage every 10 seconds
    setInterval(logMemoryUsage, 10000)
  })
}
 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
) 