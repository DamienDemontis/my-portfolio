import { useEffect, useRef } from 'react'

interface MetalLottieProps {
  animationPath: string
  className?: string
}

const MetalLottie: React.FC<MetalLottieProps> = ({ animationPath, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationInstanceRef = useRef<any>(null)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let observer: IntersectionObserver | null = null

    const loadLottie = async () => {
      if (isLoadingRef.current || animationInstanceRef.current) {
        return
      }

      isLoadingRef.current = true

      try {
        const lottie = await import('lottie-web')

        if (animationInstanceRef.current || !container) {
          isLoadingRef.current = false
          return
        }

        container.innerHTML = ''

        const response = await fetch(animationPath)
        const animationData = await response.json()

        if (!container || animationInstanceRef.current) {
          isLoadingRef.current = false
          return
        }

        animationInstanceRef.current = lottie.default.loadAnimation({
          container,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
          },
        })

        // Pause/play based on visibility
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              animationInstanceRef.current?.play()
            } else {
              animationInstanceRef.current?.pause()
            }
          },
          { threshold: 0 },
        )
        observer.observe(container)
      } catch (error) {
        console.error('Error loading Lottie animation:', error)
      } finally {
        isLoadingRef.current = false
      }
    }

    loadLottie()

    return () => {
      observer?.disconnect()
      if (animationInstanceRef.current) {
        animationInstanceRef.current.destroy()
        animationInstanceRef.current = null
      }
      isLoadingRef.current = false
    }
  }, [animationPath])

  return <div ref={containerRef} className={className} />
}

export default MetalLottie
