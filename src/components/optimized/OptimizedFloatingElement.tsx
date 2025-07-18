import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface OptimizedFloatingElementProps {
  children: ReactNode
  className?: string
  duration?: number
  delay?: number
  range?: number
  enabled?: boolean
}

export const OptimizedFloatingElement = ({ 
  children, 
  className = '', 
  duration = 6, 
  delay = 0, 
  range = 10,
  enabled = true 
}: OptimizedFloatingElementProps) => {
  if (!enabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      animate={{
        y: [-range, range, -range]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
      className={className}
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)' // Force GPU acceleration
      }}
    >
      {children}
    </motion.div>
  )
} 