// Canvas d'une section cinématique, importé en paresseux par CinematicSection quand la
// section approche (après load). Chaque image place la caméra sur la timeline de plans.
// Boucle de rendu : 'never' hors écran (une seule image d'amorce, scène chargée) ; 'always' à
// l'écran pour une scène animée (prop `animated`) hors mouvement réduit ; 'demand' sinon, la
// section appelant invalidate() quand la progression du scroll change. R3F redemande une image
// à chaque changement de boucle. Sous mouvement réduit, la caméra reste sur un plan fixe et
// rien ne redessine au scroll.
// Les plans sont vérifiés au rendu (checkShots) : une erreur y est attrapée par la barrière de
// la section, alors qu'elle échapperait à toute barrière si elle partait de useFrame.
import React from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import { pixelRatioFor, useIsCoarsePointer } from '../../lib/device.js'
import { motionPolicy } from '../character/motion.js'
import { checkShots, framing, pickFraming, shotAt, stillShot } from './shots.js'

const DEG = Math.PI / 180

// Options de Canvas à identité stable : R3F ne reconfigure rien d'un rendu à l'autre.
const GL = { antialias: true, alpha: true, powerPreference: 'high-performance' }
const CAMERA = { fov: 35, near: 0.05, far: 200 } // la pose vient du premier rendu du Rig
const RESIZE = { scroll: false } // canvas épinglé : inutile de remesurer au scroll
const STYLE = { pointerEvents: 'none' } // R3F met pointer-events: auto par défaut

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

// Place la caméra sur une pose { pos, look, fov, roll, up } : le haut d'abord, que lookAt
// respecte, puis le roll autour de l'axe de visée.
function placer(camera, { pos, look, fov, roll, up }) {
  camera.position.set(pos[0], pos[1], pos[2])
  camera.up.set(up[0], up[1], up[2])
  camera.lookAt(look[0], look[1], look[2])
  if (roll) camera.rotateZ(roll * DEG)
  if (camera.fov !== fov) {
    camera.fov = fov
    camera.updateProjectionMatrix()
  }
}

// `shots` : la liste du cadrage courant ; `fixe` : la pose unique du mouvement réduit, ou null.
// Les plans sont déjà vérifiés.
function Rig({ shots, fixe, timeline, dofRef }) {
  const invalidate = useThree((s) => s.invalidate)

  // Une image au montage et à chaque changement de mode ou de cadrage ; hors mouvement réduit,
  // la section redemande une image quand la progression change.
  const reduced = fixe !== null
  React.useEffect(() => {
    invalidate()
    if (reduced) return undefined
    const t = timeline.current
    t.invalidate = invalidate
    return () => {
      if (t.invalidate === invalidate) t.invalidate = null
    }
  }, [reduced, invalidate, timeline, shots, fixe])

  useFrame(({ camera }) => {
    const pose = fixe ?? shotAt(shots, timeline.current.p)
    placer(camera, pose)
    // Profondeur de champ : la mise au point suit le plan (distance en unités du monde).
    if (dofRef.current) dofRef.current.cocMaterial.focusDistance = pose.focus
  })
  return null
}

// Signale la première image dessinée (onDrawn(true)), puis le démontage (onDrawn(false)) : la
// section retire l'affiche, puis la remet. Placé dans la même frontière Suspense que la scène,
// il ne monte qu'une fois la scène chargée, et demande alors une image qui la montre. Si la
// boucle est arrêtée (section hors écran), il la dessine lui-même, comme la scène des
// expertises : image d'amorce, delta nul, shaders compilés et textures envoyées avant l'entrée
// à l'écran.
function PremiereImage({ onDrawn, arretee }) {
  const advance = useThree((s) => s.advance)
  const invalidate = useThree((s) => s.invalidate)
  const rappel = React.useRef(onDrawn)
  rappel.current = onDrawn
  const fait = React.useRef(false)
  useFrame(() => {
    if (fait.current) return
    fait.current = true
    rappel.current?.(true)
  })
  const amorce = React.useRef(arretee)
  React.useEffect(() => {
    if (amorce.current) advance(0, true)
    else invalidate()
    return () => rappel.current?.(false)
  }, [advance, invalidate])
  return null
}

// Densité de pixels et cadrage ('wide' ou 'narrow', selon le rapport de la fenêtre, que le
// canvas épinglé remplit), relus au redimensionnement ; un nouvel état seulement s'ils changent.
function lireEcran() {
  const l = window.innerWidth
  const h = window.innerHeight
  return { dpr: pixelRatioFor(l, h), cadrage: framing(l / Math.max(1, h)) }
}
function useEcran() {
  const [ecran, setEcran] = React.useState(lireEcran)
  React.useEffect(() => {
    const maj = () =>
      setEcran((avant) => {
        const e = lireEcran()
        return e.dpr === avant.dpr && e.cadrage === avant.cadrage ? avant : e
      })
    window.addEventListener('resize', maj)
    return () => window.removeEventListener('resize', maj)
  }, [])
  return ecran
}

export default function CinematicCanvas({
  shots,
  still,
  reduced,
  visible,
  animated,
  timeline,
  preload,
  stage: Stage,
  stageProps,
  depthOfField,
  shadows = false,
  effects,
  onDrawn,
}) {
  // En premier, avant tout effet : des plans invalides ne montent rien. Les deux cadrages
  // sont vérifiés, celui qui ne sert pas encore compris (une rotation de l'écran suffit).
  React.useMemo(() => checkShots(shots, still), [shots, still])
  const { dpr, cadrage } = useEcran()
  const liste = pickFraming(shots, cadrage)
  const stillCadre = pickFraming(still, cadrage)
  // Mouvement réduit : une seule pose pour toute la section.
  const fixe = React.useMemo(() => (reduced ? stillShot(liste, stillCadre) : null), [reduced, liste, stillCadre])
  // Le décor lit la même progression que la caméra : figée sur celle du plan fixe (le nombre
  // `still`, sinon 0.5) sous mouvement réduit, celle du scroll sinon. La visibilité, elle,
  // reste celle de la section.
  const pFixe = typeof stillCadre === 'number' ? clamp01(stillCadre) : 0.5
  const timelineDecor = React.useMemo(() => {
    if (!reduced) return timeline
    const fige = { p: pFixe, invalidate: null }
    Object.defineProperty(fige, 'visible', { enumerable: true, get: () => timeline.current.visible })
    return { current: fige }
  }, [reduced, pFixe, timeline])
  const coarsePointer = useIsCoarsePointer()
  // La politique dit au décor ce qu'il peut animer (animate ; idle et lookAt concernent le
  // personnage) et annonce le vrai frameloop du canvas.
  const base = React.useMemo(() => motionPolicy({ reducedMotion: reduced, coarsePointer }), [reduced, coarsePointer])
  const frameloop = !visible ? 'never' : animated && base.animate ? 'always' : 'demand'
  const policy = React.useMemo(() => ({ ...base, frameloop }), [base, frameloop])
  const dofRef = React.useRef(null)

  // Un seul EffectComposer : la profondeur de champ (pilotée par le Rig) puis les effets de la
  // section. Mémorisé : le composer reconstruit ses passes, et recompile ses shaders, à chaque
  // nouvelle identité de ses enfants ; un changement de visibilité ne doit pas les toucher.
  const dof = Boolean(depthOfField)
  const { focusRange = 2, bokehScale = 2 } = depthOfField && depthOfField !== true ? depthOfField : {}
  const composer = React.useMemo(
    () =>
      dof || effects ? (
        <EffectComposer>
          {dof ? <DepthOfField ref={dofRef} focusRange={focusRange} bokehScale={bokehScale} /> : null}
          {effects ?? null}
        </EffectComposer>
      ) : null,
    [dof, focusRange, bokehScale, effects],
  )

  // Les modèles du décor partent dès le montage, en parallèle du rendu de la scène.
  // Décors en meshopt, sans Draco (comme le personnage). La dépendance est le contenu de
  // la liste, pas l'identité du tableau, souvent recréé à chaque rendu.
  const urls = (preload ?? []).join('\n')
  React.useEffect(() => {
    for (const url of urls ? urls.split('\n') : []) useGLTF.preload(url, false, true)
  }, [urls])

  return (
    <Canvas frameloop={frameloop} dpr={dpr} gl={GL} camera={CAMERA} resize={RESIZE} style={STYLE} shadows={shadows}>
      <Rig shots={liste} fixe={fixe} timeline={timeline} dofRef={dofRef} />
      <React.Suspense fallback={null}>
        {Stage ? <Stage {...stageProps} timeline={timelineDecor} policy={policy} /> : null}
        <PremiereImage onDrawn={onDrawn} arretee={frameloop === 'never'} />
      </React.Suspense>
      {composer}
    </Canvas>
  )
}
