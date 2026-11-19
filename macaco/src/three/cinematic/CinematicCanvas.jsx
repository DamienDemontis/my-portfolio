// Canvas d'une section cinématique, importé en paresseux par CinematicSection quand la
// section approche (après load). Rendu à la demande : la section appelle invalidate() quand
// la progression du scroll change, et chaque image place la caméra sur la timeline de plans.
// Sous mouvement réduit, la caméra reste sur un plan fixe et rien ne redessine au scroll.
// Les plans sont vérifiés au rendu (checkShots) : une erreur y est attrapée par la barrière de
// la section, alors qu'elle échapperait à toute barrière si elle partait de useFrame.
import React from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import { pixelRatioFor, useIsCoarsePointer } from '../../lib/device.js'
import { motionPolicy } from '../character/motion.js'
import { checkShots, shotAt, stillShot } from './shots.js'

const DEG = Math.PI / 180

// Options de Canvas à identité stable : R3F ne reconfigure rien d'un rendu à l'autre.
const GL = { antialias: true, alpha: true, powerPreference: 'high-performance' }
const CAMERA = { fov: 35, near: 0.05, far: 200 } // la pose vient du premier rendu du Rig
const RESIZE = { scroll: false } // canvas épinglé : inutile de remesurer au scroll
const STYLE = { pointerEvents: 'none' } // R3F met pointer-events: auto par défaut
// Toujours à la demande : la caméra ne bouge qu'au scroll. Un décor qui anime (policy.idle)
// redemande lui-même ses images avec invalidate().
const FRAMELOOP = 'demand'

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

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

// `fixe` : la pose unique du mouvement réduit, ou null. Les plans sont déjà vérifiés.
function Rig({ shots, fixe, timeline, dofRef }) {
  const invalidate = useThree((s) => s.invalidate)

  // Une image au montage et à chaque changement de mode ; hors mouvement réduit, la section
  // redemande une image quand la progression change.
  const reduced = fixe !== null
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
  // En premier, avant tout effet : des plans invalides ne montent rien.
  React.useMemo(() => checkShots(shots, still), [shots, still])
  // Mouvement réduit : une seule pose pour toute la section.
  const fixe = React.useMemo(() => (reduced ? stillShot(shots, still) : null), [reduced, shots, still])
  // Le décor lit la même progression que la caméra : figée sur celle du plan fixe (le nombre
  // `still`, sinon 0.5) sous mouvement réduit, celle du scroll sinon.
  const pFixe = typeof still === 'number' ? clamp01(still) : 0.5
  const timelineDecor = React.useMemo(
    () => (reduced ? { current: { p: pFixe, invalidate: null } } : timeline),
    [reduced, pFixe, timeline],
  )
  const dpr = useDpr()
  const coarsePointer = useIsCoarsePointer()
  // La politique dit au décor s'il peut animer (idle, regard) et annonce le vrai frameloop.
  const policy = React.useMemo(
    () => ({ ...motionPolicy({ reducedMotion: reduced, coarsePointer }), frameloop: FRAMELOOP }),
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
    <Canvas frameloop={policy.frameloop} dpr={dpr} gl={GL} camera={CAMERA} resize={RESIZE} style={STYLE}>
      <Rig shots={shots} fixe={fixe} timeline={timeline} dofRef={dofRef} />
      {Stage && (
        <React.Suspense fallback={null}>
          <Stage timeline={timelineDecor} policy={policy} />
        </React.Suspense>
      )}
      {depthOfField && <Profondeur options={depthOfField} dofRef={dofRef} />}
    </Canvas>
  )
}
