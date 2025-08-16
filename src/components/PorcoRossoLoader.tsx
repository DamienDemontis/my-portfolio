import { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Sky, PerspectiveCamera, useAnimations } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { useTranslation } from 'react-i18next'

// Helper to detect mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

// Water surface level constant - used throughout the scene
const WATER_SURFACE_Y = -3.0

// Water surface constant (kept for other components that may use it)
// const PLANE_LANDING_HEIGHT = WATER_SURFACE_Y + 20 // No longer needed for flyby system

// Preload assets
const imagesToPreload = [
  '/Damien.jpg',
  '/about_pfp.png',
  '/about_pfp_smiling.png',
  '/photography/IMG_20240701_151842.jpg',
  '/photography/IMG_20231006_110254.jpg',
  '/photography/IMG_20231117_160650.jpg',
  '/Epitech_Official_Logo.png',
  '/Logo-plus-simple.png',
  '/acoris_logo.jpg',
  "/Logo_Leon'Art.png"
]

// Flight state enum for flyby animation
enum FlightState {
  FLYING = 'flying',
  FLYBY = 'flyby',
  DEPARTED = 'departed'
}

// Plane model component - flyby system
function PlaneModel({ 
  mousePosition, 
  isTriggered, 
  positionRef,
  onFlybyComplete
}: { 
  mousePosition: { x: number, y: number }, 
  isTriggered: boolean,
  positionRef?: React.MutableRefObject<THREE.Vector3>,
  onFlybyComplete?: () => void
}) {
  const group = useRef<THREE.Group>(null!)
  const { scene, animations } = useGLTF('/Plane_model.glb')

  // Model setup
  const model = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions, names } = useAnimations(animations, model)

  // State machine for flyby
  const [flightState, setFlightState] = useState<FlightState>(FlightState.FLYING)
  const flybyStartTime = useRef<number>(0)
  const flybyStartPosition = useRef<THREE.Vector3>(new THREE.Vector3())
  const transitionTriggered = useRef<boolean>(false)

  // Configuration
  const FLIGHT_ALTITUDE = 0 // Lower altitude to center plane in screen
  const FLYBY_DURATION = 4 // seconds for cinematic flyby
  const FLYBY_SPEED = 8 // units per second

  // Animation setup
  useEffect(() => {
    if (!names.length) return
    
    const clip = names.find(n => n.includes('Saviola')) ?? names[0]
    if (actions[clip]) {
      actions[clip].reset().fadeIn(0.2).play()
    }
    
    return () => {
      if (actions[clip]) {
        actions[clip].fadeOut(0.2).stop()
      }
    }
  }, [actions, names])

  // State machine transitions
  useEffect(() => {
    if (isTriggered && flightState === FlightState.FLYING) {
      // Start flyby sequence
      setFlightState(FlightState.FLYBY)
      flybyStartTime.current = 0 // Will be set in useFrame
      transitionTriggered.current = false // Reset transition flag
      console.log(`🛩️ Flyby initiated - plane will pass camera on the right`)
    }
  }, [isTriggered, flightState])

  // Single position update system for flyby
  useFrame((state, delta) => {
    if (!group.current) return

    const time = state.clock.elapsedTime

    switch (flightState) {
      case FlightState.FLYING: {
        // Natural floating flight - centered in scene
        const baseY = FLIGHT_ALTITUDE + Math.sin(time * 0.8) * 0.3
        const baseX = Math.sin(time * 0.3) * 0.15
        
        if (!isMobile) {
          group.current.position.set(
            baseX + mousePosition.x * 0.1,
            baseY + mousePosition.y * 0.2,
            group.current.position.z
          )
          // Banking
          group.current.rotation.z = Math.sin(time * 0.5) * 0.05 - mousePosition.x * 0.02
          group.current.rotation.x = mousePosition.y * 0.015
        } else {
          group.current.position.set(baseX, baseY, group.current.position.z)
          group.current.rotation.z = Math.sin(time * 0.5) * 0.05
          group.current.rotation.x = 0
        }
        break
      }

      case FlightState.FLYBY: {
        // Initialize flyby if not started
        if (flybyStartTime.current === 0) {
          flybyStartTime.current = time
          flybyStartPosition.current.copy(group.current.position)
          console.log(`🛩️ Starting flyby from position: X=${flybyStartPosition.current.x.toFixed(2)}`)
        }

        // Calculate flyby progress (0 to 1)
        const elapsed = time - flybyStartTime.current
        const progress = Math.min(elapsed / FLYBY_DURATION, 1)
        
        // More progressive acceleration - starts slow, builds up gradually
        const easeProgress = progress * progress * (3 - 2 * progress) // Smooth S-curve
        
        // Flyby trajectory - move from left to right past camera
        const startX = flybyStartPosition.current.x
        const endX = startX + 15 // Fly 15 units to the right
        const currentX = startX + (endX - startX) * easeProgress
        
        // Keep constant altitude during flyby
        const startY = flybyStartPosition.current.y
        const currentY = startY // No vertical movement
        
        // Progressive forward acceleration - very gradual buildup
        const accelerationCurve = progress * progress * progress // Cubic for very gradual start
        const acceleratedZ = flybyStartPosition.current.z + (accelerationCurve * FLYBY_SPEED * FLYBY_DURATION)
        
        group.current.position.set(currentX, currentY, acceleratedZ)
        
        // Banking turn as plane passes camera
        const bankAngle = Math.sin(progress * Math.PI) * 0.3
        group.current.rotation.z = bankAngle
        group.current.rotation.y = Math.PI * 0.5 + bankAngle * 0.2 // Slight turn
        
        // Debug log
        if (Math.floor(progress * 10) % 2 === 0 && progress < 1) {
          console.log(`Flyby progress: ${(progress * 100).toFixed(0)}% - X: ${currentX.toFixed(2)}, Y: ${currentY.toFixed(2)}`)
        }
        
        // Trigger transition earlier for smoother flow
        if (progress >= 0.75 && !transitionTriggered.current) {
          transitionTriggered.current = true
          setFlightState(FlightState.DEPARTED)
          console.log(`🛩️ Flyby 75% complete - starting transition to hero`)
          // Quick transition to hero section
          setTimeout(() => {
            onFlybyComplete?.()
          }, 300)
        }
        break
      }

      case FlightState.DEPARTED: {
        // Continue flying away into the distance
        group.current.position.z += delta * FLYBY_SPEED
        group.current.position.x += delta * 2 // Continue right
        break
      }
    }

    // Update position reference
    if (positionRef) {
      positionRef.current.copy(group.current.position)
    }
  })

  return (
    <group 
      ref={group} 
      position={[-3, FLIGHT_ALTITUDE, 2]} // More to the left (-3) and closer to camera (z=2)
      rotation={[0, Math.PI * 0.5, 0]}
      scale={isMobile ? 0.4 : 0.5} // Slightly larger since it's closer
    >
      <primitive object={model} />
    </group>
  )
}

// Varied cloud component with different types
function VariedCloud({ position, scale = 1, opacity = 0.3, type = 0 }: { 
  position: [number, number, number], 
  scale?: number, 
  opacity?: number,
  type?: number
}) {
  const cloudType = type % 4 // 4 different cloud types
  
  return (
    <group position={position}>
      {cloudType === 0 && (
        // Fluffy cumulus - fixed materials to prevent blinking and transparency issues
        <>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[scale * 0.8, 8, 8]} />
            <meshLambertMaterial 
              color="#ffffff" 
              transparent 
              opacity={opacity} 
              depthWrite={true}
              alphaTest={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[scale * 0.7, 0.2, 0.1]}>
            <sphereGeometry args={[scale * 0.6, 6, 6]} />
            <meshLambertMaterial 
              color="#ffffff" 
              transparent 
              opacity={opacity * 0.9} 
              depthWrite={true}
              alphaTest={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[-scale * 0.5, -0.1, 0.2]}>
            <sphereGeometry args={[scale * 0.5, 6, 6]} />
            <meshLambertMaterial 
              color="#ffffff" 
              transparent 
              opacity={opacity * 0.8} 
              depthWrite={true}
              alphaTest={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      
      {cloudType === 1 && (
        // Stretched cirrus - fixed materials
        <>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[scale * 1.2, 6, 4]} />
            <meshLambertMaterial 
              color="#ffffff" 
              transparent 
              opacity={opacity * 0.7} 
              depthWrite={true}
              alphaTest={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[scale * 0.8, 0, 0]}>
            <sphereGeometry args={[scale * 0.8, 6, 4]} />
            <meshLambertMaterial 
              color="#ffffff" 
              transparent 
              opacity={opacity * 0.5} 
              depthWrite={true}
              alphaTest={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      
      {cloudType === 2 && (
        // Puffy cloud - fixed materials
        <>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[scale * 0.9, 10, 10]} />
            <meshLambertMaterial 
              color="#ffffff" 
              transparent 
              opacity={opacity} 
              depthWrite={true}
              alphaTest={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[scale * 0.3, scale * 0.4, 0]}>
            <sphereGeometry args={[scale * 0.6, 8, 8]} />
            <meshLambertMaterial 
              color="#ffffff" 
              transparent 
              opacity={opacity * 0.8} 
              depthWrite={true}
              alphaTest={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[-scale * 0.3, scale * 0.3, 0]}>
            <sphereGeometry args={[scale * 0.5, 6, 6]} />
            <meshLambertMaterial 
              color="#ffffff" 
              transparent 
              opacity={opacity * 0.7} 
              depthWrite={true}
              alphaTest={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      
      {cloudType === 3 && (
        // Small wispy cloud - fixed materials
        <>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[scale * 0.6, 6, 6]} />
            <meshLambertMaterial 
              color="#ffffff" 
              transparent 
              opacity={opacity * 0.6} 
              depthWrite={true}
              alphaTest={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[scale * 0.4, 0.1, 0]}>
            <sphereGeometry args={[scale * 0.4, 5, 5]} />
            <meshLambertMaterial 
              color="#ffffff" 
              transparent 
              opacity={opacity * 0.4} 
              depthWrite={true}
              alphaTest={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
    </group>
  )
}



// Varied procedural island generator (without cone shapes)
function ProceduralIsland({ position, seed }: { position: [number, number, number], seed: number }) {
  const islandRef = useRef<THREE.Group>(null)
  
  // Generate deterministic random values based on seed
  const random = (index: number) => {
    const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453
    return x - Math.floor(x)
  }

  const islandType = Math.floor(random(0) * 2) + 1 // Only types 1 and 2 (no cones)
  const baseRadius = 1.5 + random(1) * 2.5
  const baseHeight = 1.2 + random(2) * 2.5
  const treeCount = Math.floor(2 + random(3) * 5)

  useFrame((state) => {
    if (islandRef.current) {
      // Gentle floating motion
      islandRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + seed) * 0.1
    }
  })

  // Island colors and materials
  const islandColors = ['#6B8E5A', '#5A7C4A'] // Different greens (no cone color)
  const rockColors = ['#A0896B', '#7A6B47'] // Different browns

  return (
    <group ref={islandRef} position={position}>
      {/* Only multi-level and rounded hill islands */}
      {islandType === 1 && (
        // Multi-level island
        <>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[baseRadius * 0.8, baseRadius, baseHeight * 0.6, 8]} />
            <meshLambertMaterial color={islandColors[0]} />
          </mesh>
          <mesh position={[0, baseHeight * 0.4, 0]}>
            <cylinderGeometry args={[baseRadius * 0.5, baseRadius * 0.6, baseHeight * 0.4, 6]} />
            <meshLambertMaterial color={islandColors[0]} />
          </mesh>
        </>
      )}
      
      {islandType === 2 && (
        // Rounded hill island
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[baseRadius, 8, 6]} />
          <meshLambertMaterial color={islandColors[1]} />
        </mesh>
      )}
      
      {/* Rocky outcrops */}
      {[...Array(3)].map((_, i) => {
        const rockX = (random(i + 10) - 0.5) * baseRadius * 0.7
        const rockZ = (random(i + 20) - 0.5) * baseRadius * 0.7
        const rockY = baseHeight * 0.4
        
        return (
          <mesh
            key={i}
            position={[rockX, rockY, rockZ]}
            scale={[
              0.3 + random(i + 30) * 0.3,
              0.5 + random(i + 40) * 0.5,
              0.3 + random(i + 50) * 0.3
            ]}
          >
            <dodecahedronGeometry args={[0.3]} />
            <meshLambertMaterial color={rockColors[islandType - 1]} />
          </mesh>
        )
      })}
      
      {/* Trees */}
      {[...Array(treeCount)].map((_, i) => {
        const treeX = (random(i + 100) - 0.5) * baseRadius * 0.5
        const treeZ = (random(i + 200) - 0.5) * baseRadius * 0.5
        const treeHeight = 1.5 + random(i + 300) * 1
        const treeY = baseHeight * 0.6
        
        return (
          <group key={i} position={[treeX, treeY, treeZ]}>
            <mesh position={[0, treeHeight * 0.3, 0]}>
              <cylinderGeometry args={[0.05, 0.08, treeHeight * 0.6]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, treeHeight * 0.7, 0]}>
              <sphereGeometry args={[0.3 + random(i + 400) * 0.2, 6, 6]} />
              <meshLambertMaterial color="#228B22" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// Enhanced infinite mountain range
function MountainRange({ distance }: { distance: number }) {
  const mountainsRef = useRef<THREE.Group>(null)
  const [mountains, setMountains] = useState<Array<{ x: number, height: number, width: number, z: number, id: number }>>([])
  const mountainIdRef = useRef(0)

  // Initialize mountains with natural, organic generation
  useEffect(() => {
    const initialMountains = []
    let currentX = -400 // Start position
    
    // Create natural mountain clusters with gaps
    for (let cluster = 0; cluster < 8; cluster++) {
      const clusterSize = 15 + Math.random() * 25 // 15-40 mountains per cluster
      const clusterBaseHeight = 2 + Math.random() * 3 // Each cluster has different base height
      
      for (let i = 0; i < clusterSize; i++) {
        // Irregular spacing within cluster
        const spacing = 1.5 + Math.random() * 2.5 // Varied spacing 1.5-4 units
        currentX += spacing
        
        // Natural height variation within cluster
        const clusterProgress = i / clusterSize
        const clusterShape = Math.sin(clusterProgress * Math.PI) // Bell curve for cluster
        const randomVariation = (Math.random() - 0.5) * 1.5 // Random variation
        const noiseHeight = Math.sin(currentX * 0.1) * 0.8 + Math.cos(currentX * 0.15) * 0.6
        
        const finalHeight = Math.max(
          1.2, 
          clusterBaseHeight + clusterShape * 2.5 + randomVariation + noiseHeight
        )
        
        // Width varies naturally with height and has some randomness
        const baseWidth = 1.2 + finalHeight * 0.4 + (Math.random() - 0.5) * 0.8
        
        // Depth variation for more natural look
        const zPosition = (Math.random() - 0.5) * 4 // Random Z depth
        
        initialMountains.push({
          x: currentX,
          height: finalHeight,
          width: Math.max(0.8, baseWidth),
          z: zPosition, // Add Z position for depth
          id: mountainIdRef.current++
        })
      }
      
      // Gap between clusters
      currentX += 8 + Math.random() * 12 // 8-20 unit gaps between clusters
    }
    
    setMountains(initialMountains)
  }, [])

  useFrame((_, delta) => {
    if (mountainsRef.current) {
      const speed = 0.05 + (distance > 40 ? 0 : 0.03) // Farther mountains move slower
      mountainsRef.current.position.x -= delta * speed
      
      // Infinite generation - no teleporting
      setMountains(prevMountains => {
        const newMountains = [...prevMountains]
        
        // Remove mountains far behind
        const filteredMountains = newMountains.filter(mountain => 
          mountain.x + mountainsRef.current!.position.x > -200
        )
        
        // Add new natural mountains ahead
        while (filteredMountains.length < 200) { // Reduce count since we have clusters now
          const lastMountain = filteredMountains[filteredMountains.length - 1]
          const spacing = 2 + Math.random() * 3 // Irregular spacing
          const newX = lastMountain ? lastMountain.x + spacing : 300
          
          // Natural height generation for new mountains
          const baseHeight = 2 + Math.random() * 3
          const randomVariation = (Math.random() - 0.5) * 1.5
          const noiseHeight = Math.sin(newX * 0.1) * 0.8 + Math.cos(newX * 0.15) * 0.6
          const finalHeight = Math.max(1.2, baseHeight + randomVariation + noiseHeight)
          
          const baseWidth = 1.2 + finalHeight * 0.4 + (Math.random() - 0.5) * 0.8
          const zPosition = (Math.random() - 0.5) * 4
          
          filteredMountains.push({
            x: newX,
            height: finalHeight,
            width: Math.max(0.8, baseWidth),
            z: zPosition,
            id: mountainIdRef.current++
          })
        }
        
        return filteredMountains
      })
    }
  })

  const baseColor = distance > 40 ? "#8B9DC3" : "#6B7280"
  
  return (
    <group ref={mountainsRef} position={[0, -3, -distance]}>
      {mountains.map((mountain) => (
        <mesh
          key={mountain.id}
          position={[mountain.x, mountain.height * 0.5, mountain.z]} // Use natural Z depth
          scale={[mountain.width, mountain.height, mountain.width * 0.9]}
        >
          <coneGeometry args={[1, 1, 8]} />
          <meshLambertMaterial 
            color={baseColor} 
            fog={true}
          />
        </mesh>
      ))}
      
      {/* Additional smaller peaks for natural density - fewer and more natural */}
      {mountains.filter((mountain, i) => i % 6 === 0 && mountain.height > 3.5).map((mountain) => {
        // Pre-calculate fixed values to avoid jittering
        const seedOffset = mountain.id * 0.1
        const xOffset = 0.8 + (Math.sin(seedOffset) * 0.4 + 0.4)
        const zOffset = Math.cos(seedOffset * 1.3) * 1.5
        const scaleX = 0.4 + (Math.sin(seedOffset * 2) * 0.1 + 0.1)
        const scaleY = 0.5 + (Math.cos(seedOffset * 1.7) * 0.1 + 0.1)
        const scaleZ = 0.3 + (Math.sin(seedOffset * 2.3) * 0.1 + 0.1)
        
        return (
          <mesh
            key={`peak-${mountain.id}`}
            position={[
              mountain.x + xOffset,
              mountain.height * 0.45, 
              mountain.z + zOffset
            ]}
            scale={[
              mountain.width * scaleX, 
              mountain.height * scaleY,
              mountain.width * scaleZ
            ]}
          >
            <coneGeometry args={[1, 1, 6]} />
            <meshLambertMaterial 
              color={baseColor} 
              fog={true}
              transparent
              opacity={0.6}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Ocean with infinite island generation (no cone islands)
function ProceduralOcean() {
  const oceanRef = useRef<THREE.Group>(null)
  const [islands, setIslands] = useState<Array<{ x: number, seed: number, id: number }>>([])
  const islandIdRef = useRef(0)

  // Initialize islands
  useEffect(() => {
    const initialIslands = []
    for (let i = 0; i < 8; i++) {
      initialIslands.push({
        x: i * 15 - 45,
        seed: i * 137.5,
        id: islandIdRef.current++
      })
    }
    setIslands(initialIslands)
  }, [])

  useFrame((_, delta) => {
    if (oceanRef.current) {
      const speed = 0.5
      oceanRef.current.position.x -= delta * speed
      
      // Ocean Y movement removed - not needed for flyby system

      // Infinite island generation - add new islands as we move forward
      setIslands(prevIslands => {
        const newIslands = [...prevIslands]
        
        // Remove islands that are far behind
        const filteredIslands = newIslands.filter(island => 
          island.x + oceanRef.current!.position.x > -60
        )
        
        // Add new islands ahead if needed
        while (filteredIslands.length < 8) {
          const lastIsland = filteredIslands[filteredIslands.length - 1]
          const newX = lastIsland ? lastIsland.x + 15 + Math.random() * 10 : 45
          filteredIslands.push({
            x: newX,
            seed: islandIdRef.current * 137.5,
            id: islandIdRef.current++
          })
        }
        
        return filteredIslands
      })
    }
  })

    return (
    <group ref={oceanRef}>
      {/* Infinite ocean surface - with sun reflection */}
      <mesh position={[0, WATER_SURFACE_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2000, 800]} />
        <meshStandardMaterial
          color="#1e88e5"
          roughness={0.02}
          metalness={0.9}
          transparent
          opacity={0.9}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* Infinite ocean depth layer - lighter blue */}
      <mesh position={[0, WATER_SURFACE_Y - 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2000, 800]} />
        <meshBasicMaterial
          color="#0d47a1"
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Water splash effect removed for flyby system */}
      
      {/* Procedural islands - enabled (no cone shapes) */}
      {!isMobile && islands.map((island) => (
        <ProceduralIsland
          key={island.id}
          position={[
            island.x, 
            -2.5, 
            -8 + Math.sin(island.seed) * 6
          ]}
          seed={island.seed}
        />
      ))}
      
      {/* Mountain ranges for far horizon */}
      <MountainRange distance={30} />
      <MountainRange distance={50} />
    </group>
  )
}

// Loading progress tracker
function LoadingProgress({ onComplete }: { onComplete: () => void }) {
  const [, setProgress] = useState(0)

  useEffect(() => {
    let loadedCount = 0
    const totalAssets = imagesToPreload.length + 1 // +1 for the GLB model

    // Preload images
    imagesToPreload.forEach((src) => {
      const img = new Image()
      img.onload = () => {
        loadedCount++
        setProgress((loadedCount / totalAssets) * 100)
        if (loadedCount === totalAssets) {
          setTimeout(onComplete, 500) // Small delay for smooth transition
        }
      }
      img.onerror = () => {
        loadedCount++
        setProgress((loadedCount / totalAssets) * 100)
        if (loadedCount === totalAssets) {
          setTimeout(onComplete, 500)
        }
      }
      img.src = src
    })

    // GLB is loaded via useGLTF, so we count it as loaded
    loadedCount++
    setProgress((loadedCount / totalAssets) * 100)
  }, [onComplete])

  return null
}

// Animated water wake effects behind the plane
// WaterWake component removed - no longer needed for flyby system

// Sunset volumetric rays (positioned behind mountains, aligned with sun)
function SunRays({ sunPosition }: { sunPosition: [number, number, number] }) {
  const raysRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (raysRef.current) {
      raysRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  // Position rays further back than the sun and slightly more to the left for better alignment
  const raysPosition: [number, number, number] = [sunPosition[0] - 2, sunPosition[1], sunPosition[2] - 5]

  return (
    <group ref={raysRef} position={raysPosition}>
      {[...Array(20)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 20) * Math.PI * 2) * 1.5,
            0,
            Math.cos((i / 20) * Math.PI * 2) * 1.5
          ]}
          rotation={[0, 0, (i / 20) * Math.PI * 2]}
        >
          <planeGeometry args={[0.8, 80]} />
          <meshBasicMaterial 
            color="#FF6B35"
            transparent 
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// Main 3D Scene
function Scene({ onLoadComplete, onFlybyComplete, isLanding }: { onLoadComplete: () => void, onFlybyComplete: () => void, isLanding: boolean }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const planePositionRef = useRef(new THREE.Vector3(-1, 0, 0))
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  
  // Configurable sun position - easy to adjust
  const sunPosition: [number, number, number] = [-25, -1.0, -55] // Slightly higher for better reflection

  // Cloud layer that moves left with parallax - closer clouds move faster
  function CloudLayer({ z, opacity = 0.3, count = 6 }: { 
    z: number, 
    opacity?: number,
    count?: number 
  }) {
    const cloudsRef = useRef<THREE.Group>(null)
    
    // Calculate speed based on Z position - closer clouds (higher Z) move faster
    const speed = 0.5 + (z + 10) * 0.1 // Parallax effect
    
    const [clouds, setClouds] = useState<Array<{ x: number, y: number, scale: number, type: number, opacity: number, id: number }>>([])
    const cloudIdRef = useRef(0)

    // Generate initial cloud positions - spread across entire sky, adjusted for camera visibility
    const initialCloudData = useMemo(() => {
      const clouds = []
      for (let i = 0; i < count; i++) {
        clouds.push({
          x: (Math.random() - 0.5) * 60, // Spread across X axis (-30 to 30) - closer to camera
          y: 1 + Math.random() * 8, // Y from 1 to 9 - higher in sky for better visibility
          scale: 0.8 + Math.random() * 1.5, // Larger scale for better visibility
          type: i % 4,
          opacity: opacity * (0.7 + Math.random() * 0.3)
        })
      }
      return clouds
    }, [count, opacity])

    // Initialize clouds
    useEffect(() => {
      setClouds(initialCloudData.map((cloud) => ({
        x: cloud.x,
        y: cloud.y,
        scale: cloud.scale,
        type: cloud.type,
        opacity: cloud.opacity,
        id: cloudIdRef.current++
      })))
    }, [initialCloudData])

    useFrame((_, delta) => {
      if (cloudsRef.current) {
        cloudsRef.current.position.x -= delta * speed
        
        // Infinite generation - no teleporting
        setClouds(prevClouds => {
          const newClouds = [...prevClouds]
          
          // Remove clouds far behind
          const filteredClouds = newClouds.filter(cloud => 
            cloud.x + cloudsRef.current!.position.x > -30
          )
          
          // Add new clouds ahead - more varied positioning
          while (filteredClouds.length < count * 2) { // Keep more clouds for seamless generation
            const newX = 30 + Math.random() * 15 // Random position ahead, closer to camera
            filteredClouds.push({
              x: newX,
              y: 1 + Math.random() * 8, // Higher in sky for better visibility
              scale: 0.8 + Math.random() * 1.5, // Larger scale
              type: cloudIdRef.current % 4,
              opacity: opacity * (0.7 + Math.random() * 0.3),
              id: cloudIdRef.current++
            })
          }
          
          return filteredClouds
        })
      }
    })

    return (
      <group ref={cloudsRef} position={[10, 0, z]}>
        {clouds.map((cloud) => (
          <VariedCloud
            key={cloud.id}
            position={[cloud.x, cloud.y, 0]}
            scale={cloud.scale}
            opacity={cloud.opacity}
            type={cloud.type}
          />
        ))}
      </group>
    )
  }

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Completely static camera - no movement at all during flyby
  useFrame(() => {
    if (!cameraRef.current) return
    
    const camera = cameraRef.current
    
    // Lock camera in fixed position - tilted slightly up for better view
    const targetY = 1.5 // Lower camera position
    camera.position.set(2, targetY, isMobile ? 6 : 5)
    camera.lookAt(0, -0.5, 0) // Look slightly downward for better angle
    
    // Debug - remove after testing
    // console.log(`Camera Y: ${camera.position.y.toFixed(2)} (should be ${targetY})`)
  })

  return (
    <>
      {/* Static camera for cinematic flyby */}
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        position={[2, 1.5, isMobile ? 6 : 5]} 
        fov={isMobile ? 55 : 50} 
      />
      
      {/* Enhanced sunset lighting - brighter and more vibrant */}
      <ambientLight intensity={1.2} color="#FFB347" />
      <directionalLight
        position={sunPosition}
        intensity={2.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#FF6B35"
      />
      <directionalLight position={[5, 5, 10]} intensity={0.8} color="#87CEEB" />
      <directionalLight position={[0, 10, 0]} intensity={0.6} color="#FFD700" />
      
      {/* Twilight sky */}
      {isMobile ? (
        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial
            side={THREE.BackSide}
            color="#FF7F50" // Coral sunset sky
          />
        </mesh>
      ) : (
        <Sky
          distance={450000}
          sunPosition={sunPosition}
          inclination={0.4}
          azimuth={0.2}
          turbidity={25}
          rayleigh={0.3}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
      )}
      
      {/* Distant fog - much farther away for clearer view */}
      <fog attach="fog" args={['#FFB347', 100, 200]} />
      
      {/* Volumetric sun rays - far behind everything */}
      <SunRays sunPosition={sunPosition} />
      
      {/* Sunset sun - spherical cap on horizon */}
      <mesh position={sunPosition} rotation={[0, 0, 0]}>
        <sphereGeometry args={[7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#FF4500" side={THREE.FrontSide} />
      </mesh>
      
      {/* Enhanced lighting for better water reflection */}
      <directionalLight
        position={[sunPosition[0], sunPosition[1] + 5, sunPosition[2] - 10]}
        intensity={2.0}
        color="#FFB347"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* The plane */}
      <Suspense fallback={null}>
        <PlaneModel 
          mousePosition={mousePosition} 
          isTriggered={isLanding} 
          positionRef={planePositionRef}
          onFlybyComplete={onFlybyComplete}
        />
      </Suspense>
      


      
             {/* Massive cloud coverage - clouds everywhere in the sky */}
       
       <CloudLayer z={8} opacity={0.6} count={isMobile ? 12 : 24} />
       <CloudLayer z={6} opacity={0.55} count={isMobile ? 10 : 20} />
       <CloudLayer z={4} opacity={0.5} count={isMobile ? 8 : 16} />
       <CloudLayer z={2} opacity={0.45} count={isMobile ? 7 : 14} />
       <CloudLayer z={0} opacity={0.4} count={isMobile ? 6 : 12} />
       <CloudLayer z={-2} opacity={0.35} count={isMobile ? 5 : 10} />
       <CloudLayer z={-4} opacity={0.3} count={isMobile ? 4 : 8} />
       <CloudLayer z={-6} opacity={0.25} count={isMobile ? 3 : 6} />
       <CloudLayer z={-8} opacity={0.2} count={isMobile ? 2 : 4} />
       <CloudLayer z={-12} opacity={0.15} count={isMobile ? 2 : 4} />
       <CloudLayer z={-16} opacity={0.1} count={isMobile ? 2 : 3} />
       <CloudLayer z={-20} opacity={0.08} count={isMobile ? 1 : 2} />
       <CloudLayer z={-25} opacity={0.05} count={isMobile ? 1 : 2} />
      
      {/* Procedural ocean and islands */}
      <ProceduralOcean />

      {/* Loading progress tracker */}
      <LoadingProgress onComplete={onLoadComplete} />
    </>
  )
}

interface PorcoRossoLoaderProps {
  onLoadingComplete: () => void
}

export function PorcoRossoLoader({ onLoadingComplete }: PorcoRossoLoaderProps) {
  const { t } = useTranslation()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const handleLoadComplete = () => {
    setIsLoaded(true)
  }

  const handleClick = () => {
    if (isLoaded && !isClicked) {
      setIsClicked(true)
      // The flyby will call onLoadingComplete when it's done
      // No need for a fixed timeout
    }
  }

  const handleFlybyComplete = () => {
    // Called when the plane completes its flyby
    console.log('🎬 Flyby complete - transitioning to hero')
    onLoadingComplete()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-gradient-to-b from-sky-300 via-sky-200 to-blue-200"
      onClick={handleClick}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      style={{ cursor: isLoaded && !isClicked ? 'pointer' : 'default' }}
    >
      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0"
        gl={{ 
          antialias: !isMobile,
          alpha: false,
          powerPreference: isMobile ? "low-power" : "high-performance"
        }}
        shadows
        dpr={[1, isMobile ? 1.5 : 2]}
      >
        <Scene onLoadComplete={handleLoadComplete} onFlybyComplete={handleFlybyComplete} isLanding={isClicked} />
      </Canvas>

      {/* Loading UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-16 md:pb-20">
        <AnimatePresence mode="wait">
          {!isLoaded ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full px-6 py-3 md:px-8 md:py-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium text-sm md:text-base">
                    {t('preloader.loading', { defaultValue: 'Preparing for flight...' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : !isClicked ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: [0, -5, 0],
                scale: 1
              }}
              transition={{
                opacity: { duration: 0.5 },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.5 }
              }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full px-6 py-3 md:px-8 md:py-4 shadow-xl border-2 border-white/50 dark:border-gray-700/50">
                <p className="text-gray-800 dark:text-gray-200 font-bold text-sm md:text-base flex items-center gap-2">
                  <span className="animate-pulse">👆</span>
                  {t('preloader.clickToFly', { defaultValue: 'Click anywhere to fly' })}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full px-6 py-3 md:px-8 md:py-4 shadow-lg">
                <p className="text-gray-800 dark:text-gray-200 font-medium text-sm md:text-base">
                  {t('preloader.flying', { defaultValue: 'Flying away...' })} ✈️
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.1) 100%)'
        }}
      />

      {/* Water landing transition overlay */}
      <AnimatePresence>
        {isClicked && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(30, 144, 255, 0.3) 0%, transparent 70%)'
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Preload the GLB model
useGLTF.preload('/Plane_model.glb')