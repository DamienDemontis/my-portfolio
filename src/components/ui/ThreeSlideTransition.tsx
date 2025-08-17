import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

interface SlideTransitionProps {
  currentImage: string
  targetImage: string
  isTransitioning: boolean
  onTransitionComplete: () => void
  width: number
  height: number
}

class SlideGeometry extends THREE.BufferGeometry {
  faceCount: number
  modelGeometry: THREE.PlaneGeometry

  constructor(model: THREE.PlaneGeometry) {
    super()
    this.modelGeometry = model
    this.faceCount = model.attributes.position.count / 3
    this.bufferPositions()
    this.bufferUVs()
  }

  bufferPositions() {
    const vertices = this.modelGeometry.attributes.position.array
    this.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
  }

  bufferUVs() {
    const uvs = this.modelGeometry.attributes.uv.array
    this.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  }

  createAttribute(name: string, size: number) {
    const array = new Float32Array(this.faceCount * 3 * size)
    const attribute = new THREE.BufferAttribute(array, size)
    this.setAttribute(name, attribute)
    return attribute
  }
}

class Slide extends THREE.Mesh<SlideGeometry, THREE.ShaderMaterial> {
  totalDuration: number
  animationPhase: 'in' | 'out'

  constructor(width: number, height: number, animationPhase: 'in' | 'out') {
    // Create plane geometry with subdivisions
    const plane = new THREE.PlaneGeometry(width, height, width * 2, height * 2)
    
    const geometry = new SlideGeometry(plane)
    
    const aAnimation = geometry.createAttribute('aAnimation', 2)
    const aStartPosition = geometry.createAttribute('aStartPosition', 3)
    const aControl0 = geometry.createAttribute('aControl0', 3)
    const aControl1 = geometry.createAttribute('aControl1', 3)
    const aEndPosition = geometry.createAttribute('aEndPosition', 3)

    const minDuration = 0.8
    const maxDuration = 1.2
    const maxDelayX = 0.9
    const maxDelayY = 0.125
    const stretch = 0.11

    const totalDuration = maxDuration + maxDelayX + maxDelayY + stretch

    const vertexCount = geometry.attributes.position.count
    const faceCount = vertexCount / 3

    // Helper functions
    const getControlPoint0 = (centroid: THREE.Vector3) => {
      const signY = Math.sign(centroid.y)
      return new THREE.Vector3(
        (Math.random() * 0.2 + 0.1) * 50,
        signY * (Math.random() * 0.2 + 0.1) * 70,
        (Math.random() - 0.5) * 40
      )
    }

    const getControlPoint1 = (centroid: THREE.Vector3) => {
      const signY = Math.sign(centroid.y)
      return new THREE.Vector3(
        (Math.random() * 0.3 + 0.3) * 50,
        -signY * (Math.random() * 0.3 + 0.3) * 70,
        (Math.random() - 0.5) * 40
      )
    }

    // Process each face (triangle)
    for (let i = 0; i < faceCount; i++) {
      const i3 = i * 3
      const i6 = i * 6
      const i9 = i * 9

      // Calculate centroid of the triangle
      const v1 = new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, i3)
      const v2 = new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, i3 + 1)
      const v3 = new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, i3 + 2)
      const centroid = new THREE.Vector3().addVectors(v1, v2).add(v3).divideScalar(3)

      // Animation timing
      const duration = Math.random() * (maxDuration - minDuration) + minDuration
      const delayX = ((centroid.x + width * 0.5) / width) * maxDelayX
      const delayY = animationPhase === 'in' 
        ? (Math.abs(centroid.y) / (height * 0.5)) * maxDelayY
        : ((height * 0.5) - Math.abs(centroid.y)) / (height * 0.5) * maxDelayY

      // Set animation data for all vertices of this face
      for (let v = 0; v < 3; v++) {
        aAnimation.array[i6 + v * 2] = delayX + delayY + (Math.random() * stretch * duration)
        aAnimation.array[i6 + v * 2 + 1] = duration
      }

      // Calculate control points
      const startPosition = centroid.clone()
      const endPosition = centroid.clone()
      
      let control0: THREE.Vector3, control1: THREE.Vector3
      
      if (animationPhase === 'in') {
        control0 = centroid.clone().sub(getControlPoint0(centroid))
        control1 = centroid.clone().sub(getControlPoint1(centroid))
      } else {
        control0 = centroid.clone().add(getControlPoint0(centroid))
        control1 = centroid.clone().add(getControlPoint1(centroid))
      }

      // Set position data for all vertices of this face
      for (let v = 0; v < 3; v++) {
        const idx = i9 + v * 3
        
        aStartPosition.array[idx] = startPosition.x
        aStartPosition.array[idx + 1] = startPosition.y
        aStartPosition.array[idx + 2] = startPosition.z

        aControl0.array[idx] = control0.x
        aControl0.array[idx + 1] = control0.y
        aControl0.array[idx + 2] = control0.z

        aControl1.array[idx] = control1.x
        aControl1.array[idx + 1] = control1.y
        aControl1.array[idx + 2] = control1.z

        aEndPosition.array[idx] = endPosition.x
        aEndPosition.array[idx + 1] = endPosition.y
        aEndPosition.array[idx + 2] = endPosition.z
      }
    }

    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        map: { value: new THREE.Texture() }
      },
      vertexShader: `
        attribute vec2 aAnimation;
        attribute vec3 aStartPosition;
        attribute vec3 aControl0;
        attribute vec3 aControl1;
        attribute vec3 aEndPosition;
        
        uniform float uTime;
        varying vec2 vUv;

        // Cubic bezier function
        vec3 cubicBezier(vec3 p0, vec3 p1, vec3 p2, vec3 p3, float t) {
          float oneMinusT = 1.0 - t;
          return oneMinusT * oneMinusT * oneMinusT * p0 + 
                 3.0 * oneMinusT * oneMinusT * t * p1 + 
                 3.0 * oneMinusT * t * t * p2 + 
                 t * t * t * p3;
        }

        // Ease in-out cubic
        float ease(float t) {
          return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
        }

        void main() {
          vUv = uv;
          
          float tDelay = aAnimation.x;
          float tDuration = aAnimation.y;
          float tTime = clamp(uTime - tDelay, 0.0, tDuration);
          float tProgress = ease(tTime / tDuration);
          
          vec3 transformed = position;
          
          ${animationPhase === 'in' ? 'transformed *= tProgress;' : 'transformed *= 1.0 - tProgress;'}
          
          transformed += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        varying vec2 vUv;

        void main() {
          gl_FragColor = texture2D(map, vUv);
        }
      `,
      side: THREE.DoubleSide
    })

    super(geometry, material)
    
    this.totalDuration = totalDuration
    this.animationPhase = animationPhase
    this.frustumCulled = false
  }

  get time() {
    return this.material.uniforms.uTime.value
  }

  set time(value: number) {
    this.material.uniforms.uTime.value = value
  }

  setImage(texture: THREE.Texture) {
    this.material.uniforms.map.value = texture
  }
}

export const ThreeSlideTransition: React.FC<SlideTransitionProps> = ({
  currentImage,
  targetImage,
  isTransitioning,
  onTransitionComplete,
  width,
  height
}) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const slideOutRef = useRef<Slide>()
  const slideInRef = useRef<Slide>()
  const animationIdRef = useRef<number>()
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    renderer.setClearColor(0x000000, 0)
    
    camera.position.set(0, 0, 60)
    
    mountRef.current.appendChild(renderer.domElement)

    // Create slides
    const slideOut = new Slide(100, 60, 'out')
    const slideIn = new Slide(100, 60, 'in')
    
    scene.add(slideOut)
    scene.add(slideIn)

    sceneRef.current = scene
    rendererRef.current = renderer
    cameraRef.current = camera
    slideOutRef.current = slideOut
    slideInRef.current = slideIn

    setIsInitialized(true)

    // Animation loop
    const animate = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
      animationIdRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [width, height])

  // Load textures
  const loadTexture = useCallback((url: string): Promise<THREE.Texture> => {
    return new Promise((resolve) => {
      const loader = new THREE.TextureLoader()
      loader.crossOrigin = 'Anonymous'
      loader.load(url, resolve)
    })
  }, [])

  // Handle image changes
  useEffect(() => {
    if (!isInitialized || !slideOutRef.current || !slideInRef.current) return

    loadTexture(currentImage).then(texture => {
      slideOutRef.current!.setImage(texture)
    })

    if (targetImage !== currentImage) {
      loadTexture(targetImage).then(texture => {
        slideInRef.current!.setImage(texture)
      })
    }
  }, [currentImage, targetImage, isInitialized, loadTexture])

  // Handle transition
  useEffect(() => {
    if (!isTransitioning || !slideOutRef.current || !slideInRef.current) return

    const duration = 3000 // 3 seconds
    const startTime = performance.now()

    const animateTransition = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const totalDuration = slideOutRef.current!.totalDuration

      if (slideOutRef.current && slideInRef.current) {
        slideOutRef.current.time = progress * totalDuration
        slideInRef.current.time = progress * totalDuration
      }

      if (progress < 1) {
        requestAnimationFrame(animateTransition)
      } else {
        // Reset slides
        if (slideOutRef.current && slideInRef.current) {
          slideOutRef.current.time = 0
          slideInRef.current.time = 0
        }
        onTransitionComplete()
      }
    }

    requestAnimationFrame(animateTransition)
  }, [isTransitioning, onTransitionComplete])

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  )
}