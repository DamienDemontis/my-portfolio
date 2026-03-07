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
    const loadLottie = async () => {
      if (isLoadingRef.current || animationInstanceRef.current || !containerRef.current) {
        return
      }

      isLoadingRef.current = true

      try {
        const lottie = await import('lottie-web')

        if (animationInstanceRef.current || !containerRef.current) {
          isLoadingRef.current = false
          return
        }

        containerRef.current.innerHTML = ''

        const response = await fetch(animationPath)
        const animationData = await response.json()

        if (!containerRef.current || animationInstanceRef.current) {
          isLoadingRef.current = false
          return
        }

        animationInstanceRef.current = lottie.default.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
          },
        })
      } catch (error) {
        console.error('Error loading Lottie animation:', error)
      } finally {
        isLoadingRef.current = false
      }
    }

    loadLottie()

    return () => {
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
