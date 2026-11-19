// Canvas d'une section cinématique, importé en paresseux par CinematicSection quand la
// section approche (après load). Rendu à la demande : la section appelle invalidate() quand
// la progression du scroll change, et chaque image place la caméra sur la timeline de plans.
// Sous mouvement réduit, la caméra reste sur un plan fixe et rien ne redessine au scroll.
import React from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import { pixelRatioFor, useIsCoarsePointer } from '../../lib/device.js'
import { motionPolicy } from '../character/motion.js'
import { shotAt, stillShot } from './shots.js'

const DEG = Math.PI / 180

// Options de Canvas à identité stable : R3F ne reconfigure rien d'un rendu à l'autre.
const GL = { antialias: true, alpha: true, powerPreference: 'high-performance' }
const CAMERA = { fov: 35, near: 0.05, far: 200 } // la pose vient du premier rendu du Rig
const RESIZE = { scroll: false } // canvas épinglé : inutile de remesurer au scroll
const STYLE = { pointerEvents: 'none' } // R3F met pointer-events: auto par défaut

// Place la caméra sur une pose { pos, look, fov, roll } ; le roll tourne autour de l'axe de visée.
function placer(camera, { pos, look, fov, roll }) {
  camera.position.set(pos[0], pos[1], pos[2])
  camera.lookAt(look[0], look[1], look[2])
  if (roll) camera.rotateZ(roll * DEG)
  if (camera.fov !== fov) {
    camera.fov = fov
    camera.updateProjectionMatrix()
  }
}

function Rig({ shots, still, reduced, timeline, dofRef }) {
  const invalidate = useThree((s) => s.invalidate)
  // Mouvement réduit : une seule pose pour toute la section.
  const fixe = React.useMemo(() => (reduced ? stillShot(shots, still) : null), [reduced, shots, still])

  // Une image au montage et à chaque changement de mode ; hors mouvement réduit, la section
  // redemande une image quand la progression change.
  React.useEffect(() => {
    invalidate()
    if (reduced) return undefined
    const t = timeline.current
    t.invalidate = invalidate
    return () => {
      if (t.invalidate === invalidate) t.invalidate = null
    }
  }, [reduced, invalidate, timeline])

  useFrame(({ camera }) => {
    const pose = fixe ?? shotAt(shots, timeline.current.p)
    placer(camera, pose)
    // Profondeur de champ : la mise au point suit le plan (distance en unités du monde).
    if (dofRef.current) dofRef.current.cocMaterial.focusDistance = pose.focus
  })
  return null
}

// Profondeur de champ en option : true, ou { focusRange, bokehScale } (unités du monde).
function Profondeur({ options, dofRef }) {
  const { focusRange = 2, bokehScale = 2 } = options === true ? {} : options
  return (
    <EffectComposer>
      <DepthOfField ref={dofRef} focusRange={focusRange} bokehScale={bokehScale} />
    </EffectComposer>
  )
}

function useDpr() {
  const lire = () => pixelRatioFor(window.innerWidth, window.innerHeight)
  const [dpr, setDpr] = React.useState(lire)
  React.useEffect(() => {
    const maj = () => setDpr(lire())
    window.addEventListener('resize', maj)
    return () => window.removeEventListener('resize', maj)
  }, [])
  return dpr
}

export default function CinematicCanvas({ shots, still, reduced, timeline, preload, stage: Stage, depthOfField }) {
  const dpr = useDpr()
  const coarsePointer = useIsCoarsePointer()
  const policy = React.useMemo(
    () => motionPolicy({ reducedMotion: reduced, coarsePointer }),
    [reduced, coarsePointer],
  )
  const dofRef = React.useRef(null)

  // Les modèles du décor partent dès le montage, en parallèle du rendu de la scène.
  // Décors en meshopt, sans Draco (comme le personnage). La dépendance est le contenu de
  // la liste, pas l'identité du tableau, souvent recréé à chaque rendu.
  const urls = (preload ?? []).join('\n')
  React.useEffect(() => {
    for (const url of urls ? urls.split('\n') : []) useGLTF.preload(url, false, true)
  }, [urls])

  return (
    <Canvas frameloop="demand" dpr={dpr} gl={GL} camera={CAMERA} resize={RESIZE} style={STYLE}>
      <Rig shots={shots} still={still} reduced={reduced} timeline={timeline} dofRef={dofRef} />
      {Stage && (
        <React.Suspense fallback={null}>
          <Stage timeline={timeline} policy={policy} />
        </React.Suspense>
      )}
      {depthOfField && <Profondeur options={depthOfField} dofRef={dofRef} />}
    </Canvas>
  )
}
