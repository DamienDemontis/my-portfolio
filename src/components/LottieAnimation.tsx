import { useEffect, useRef } from 'react'

interface LottieAnimationProps {
  animationPath: string
  className?: string
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationPath, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationInstanceRef = useRef<any>(null)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    const loadLottie = async () => {
      // Prevent double loading with multiple checks
      if (isLoadingRef.current || animationInstanceRef.current || !containerRef.current) {
        return
      }

      isLoadingRef.current = true

      try {
        // Dynamically import lottie-web only when needed
        const lottie = await import('lottie-web')

        // Double check after async operation
        if (animationInstanceRef.current || !containerRef.current) {
          isLoadingRef.current = false
          return
        }

        // Clear any existing content
        containerRef.current.innerHTML = ''

        // Fetch the animation JSON
        const response = await fetch(animationPath)
        const animationData = await response.json()

        // Final check before creating animation
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
