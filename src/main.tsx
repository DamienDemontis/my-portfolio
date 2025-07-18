import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config.ts'
import { initPerformanceMonitoring, startFPSMonitoring, logMemoryUsage } from './utils/performance'

// Initialize performance monitoring in development
if (import.meta.env.DEV) {
  initPerformanceMonitoring()
  startFPSMonitoring()
  
  // Log memory usage every 10 seconds
  setInterval(logMemoryUsage, 10000)
}
 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
) 