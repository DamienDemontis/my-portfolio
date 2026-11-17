// Canvas persistant du personnage, importé en paresseux par CharacterLayer.
// À chaque image, la position de scroll donne un mélange entre deux scènes
// (sceneBlend) : il pilote la pose des os, le yaw, la caméra et la couleur claire
// du tramage. Viennent ensuite la respiration et le regard, selon motionPolicy.
import React from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor, useGLTF } from '@react-three/drei'
import { Box3, MathUtils, Quaternion, Vector3 } from 'three'
import { SCENES } from '../content/scenes.js'
import { pixelRatioFor, useIsCoarsePointer } from '../lib/device.js'
import { accentForProgress } from '../lib/ramp.js'
import { progressAt, sceneBlend } from '../lib/sceneProgress.js'
import { getOffsetTop, getScrollRoot, getScrollTop, getViewportHeight, onScroll } from '../lib/scroll.js'
import { breathing, lookAngles, motionPolicy } from './character/motion.js'
import { SCENE_POSES, blendPose, bonesByName, poseQuaternions } from './character/poses.js'
import { CHARACTER_GLB } from './CharacterLayer.jsx'
import { hexToRgb01, makeDitherMaterial } from './ditherMaterial.js'

const HAUTEUR = 1.8
const DEG = Math.PI / 180
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const AXE_X = new Vector3(1, 0, 0)
const AXE_Y = new Vector3(0, 1, 0)

// Options de Canvas à identité stable : R3F ne reconfigure rien d'un rendu à l'autre.
const GL = { antialias: false, alpha: true }
const CAMERA = { fov: 30, near: 0.1, far: 50, position: [0, 0.95, 4.2] }
const RESIZE = { scroll: false } // couche fixe : inutile de remesurer au scroll
const STYLE = { pointerEvents: 'none' } // R3F met pointer-events: auto par défaut
const CLE = [2, 3, 4]
const CONTRE_JOUR = [-3, 2, -3]

// Préparation unique par scène chargée : le cache de useGLTF rend le même objet à
// chaque montage, et la normalisation (échelle multipliée) ne doit passer qu'une fois.
const rigs = new WeakMap()

function prepareRig(scene) {
  const deja = rigs.get(scene)
  if (deja) return deja

  // R3 : aucun ancêtre tourné pendant la mesure ni pendant le calcul des poses.
  scene.removeFromParent()

  // Normalisation, échelle et translation seulement : 1,80 m, pieds à y = 0, centré en x et z.
  // precise = true : pour un maillage skinné, la boîte suit le squelette.
  scene.updateMatrixWorld(true)
  const box = new Box3().setFromObject(scene, true)
  const size = box.getSize(new Vector3())
  if (!(size.y > 0)) throw new Error('personnage : boîte englobante vide')
  const centre = box.getCenter(new Vector3())
  const s = HAUTEUR / size.y
  const p0 = scene.position.clone()
  scene.scale.multiplyScalar(s)
  scene.position.set(-s * (centre.x - p0.x), -s * (box.min.y - p0.y), -s * (centre.z - p0.z))
  scene.updateMatrixWorld(true)

  // Matériau tramé, avec la texture d'origine pour garder le détail.
  const tramages = new Map()
  scene.traverse((o) => {
    if (!o.isMesh) return
    let m = tramages.get(o.material)
    if (!m) {
      m = makeDitherMaterial({
        transparent: false,
        pixel: 2,
        gain: 1.7,
        colorLight: accentForProgress(0),
        colorDark: '#0A0B0C',
      })
      m.map = o.material?.map ?? null
      tramages.set(o.material, m)
    }
    o.material = m
    // Les poses éloignent les sommets de la boîte de liaison : pas d'élagage.
    o.frustumCulled = false
  })

  // Les huit poses, calculées une fois ici, rig non tourné (poseQuaternions travaille en axes monde).
  const bones = bonesByName(scene)
  const poses = SCENES.map(({ id }) => {
    const { bones: recette, yaw, camera } = SCENE_POSES[id]
    return {
      quats: poseQuaternions(bones, recette),
      yaw: yaw * DEG,
      pos: new Vector3(...camera.pos),
      look: new Vector3(...camera.look),
      fov: camera.fov,
    }
  })

  const rig = { bones, poses, uniforms: [...tramages.values()].map((m) => m.userData.uniforms) }
  rigs.set(scene, rig)
  return rig
}

const _qRepere = new Quaternion()
const _qParent = new Quaternion()
const _qRot = new Quaternion()
const _axe = new Vector3()

// Tourne un os autour d'un axe du repère du personnage (celui des poses, avant le yaw).
// Même convention que poseQuaternions, mais valable une fois le yaw appliqué au groupe parent.
function tournerDansRepere(bone, axe, angle, repere) {
  if (!bone?.parent || angle === 0) return
  repere.getWorldQuaternion(_qRepere)
  bone.parent.getWorldQuaternion(_qParent)
  _axe.copy(axe).applyQuaternion(_qRepere).applyQuaternion(_qParent.invert())
  bone.quaternion.premultiply(_qRot.setFromAxisAngle(_axe, angle))
}

// Centres des sections [data-scene] dans la racine de scroll, et index de pose de chacune.
// Mesurés au montage, puis à chaque changement de taille de la racine (ou de la piste des scènes).
function useSceneAnchors(invalidate) {
  const ref = React.useRef({ centres: [], poses: [] })
  React.useEffect(() => {
    const racine = getScrollRoot()
    const mesurer = () => {
      const centres = []
      const poses = []
      for (const el of racine.querySelectorAll('[data-scene]')) {
        centres.push(getOffsetTop(el) + el.offsetHeight / 2)
        poses.push(Math.max(0, SCENES.findIndex((s) => s.id === el.dataset.scene)))
      }
      ref.current = { centres, poses }
      invalidate()
    }
    mesurer()
    if (typeof ResizeObserver !== 'function') return undefined
    const ro = new ResizeObserver(mesurer)
    ro.observe(racine)
    const piste = racine.querySelector('[data-scene]')?.parentElement
    if (piste) ro.observe(piste)
    return () => ro.disconnect()
  }, [invalidate])
  return ref
}

// Pointeur sur la fenêtre, normalisé dans [-1, 1], y vers le haut. Aucun écouteur si désactivé.
function usePointer(actif) {
  const ref = React.useRef({ x: 0, y: 0 })
  React.useEffect(() => {
    if (!actif) return undefined
    const bouger = (e) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ref.current.y = 1 - (e.clientY / window.innerHeight) * 2
    }
    window.addEventListener('pointermove', bouger, { passive: true })
    return () => window.removeEventListener('pointermove', bouger)
  }, [actif])
  return ref
}

function useReducedMotion() {
  const requete = () => (typeof window.matchMedia === 'function' ? window.matchMedia(REDUCED_MOTION) : null)
  const [reduit, setReduit] = React.useState(() => requete()?.matches ?? false)
  React.useEffect(() => {
    const mq = requete()
    if (!mq) return undefined
    const maj = () => setReduit(mq.matches)
    maj()
    mq.addEventListener('change', maj)
    return () => mq.removeEventListener('change', maj)
  }, [])
  return reduit
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

function Character({ policy }) {
  const { scene } = useGLTF(CHARACTER_GLB, false, true)
  const rig = React.useMemo(() => prepareRig(scene), [scene])
  const invalidate = useThree((s) => s.invalidate)
  const yawRef = React.useRef(null)
  const policyRef = React.useRef(policy)
  policyRef.current = policy
  const ancres = useSceneAnchors(invalidate)
  const pointeur = usePointer(policy.lookAt)
  const etat = React.useRef({ hex: '', regard: { x: 0, y: 0 }, look: new Vector3() })

  // Mode « demand » : une image par événement de scroll ou de redimensionnement.
  // Un changement de politique redessine aussi une fois (pose finale après un gel).
  React.useEffect(() => {
    invalidate()
    if (policy.frameloop !== 'demand') return undefined
    return onScroll(() => invalidate())
  }, [policy.frameloop, invalidate])

  useFrame(({ camera, clock, size }, delta) => {
    const p = policyRef.current
    const e = etat.current
    const yawGroup = yawRef.current
    if (!yawGroup) return

    const { centres, poses } = ancres.current
    const blend = sceneBlend(getScrollTop() + getViewportHeight() / 2, centres)
    const t = p.blend === 'snap' ? Math.round(blend.t) : blend.t
    const i = poses[blend.from] ?? 0
    const j = poses[blend.to] ?? 0
    const a = rig.poses[i]
    const b = rig.poses[j]

    // Pose des os (local) et yaw sur le groupe parent.
    yawGroup.rotation.y = MathUtils.lerp(a.yaw, b.yaw, t)
    blendPose(rig.bones, a.quats, b.quats, t)

    // Caméra. Sur écran étroit (portrait), le décalage latéral sortirait le
    // personnage du cadre : il s'efface entre les rapports 0,8 et 1,2.
    const lateral = MathUtils.smoothstep(size.width / Math.max(1, size.height), 0.8, 1.2)
    camera.position.lerpVectors(a.pos, b.pos, t)
    e.look.lerpVectors(a.look, b.look, t)
    camera.position.x *= lateral
    e.look.x *= lateral
    camera.lookAt(e.look)
    const fov = MathUtils.lerp(a.fov, b.fov, t)
    if (camera.fov !== fov) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    // Couleur claire du tramage : la rampe d'oxydation suit la progression.
    const hex = accentForProgress(progressAt({ from: i, to: j, t }))
    if (hex !== e.hex) {
      e.hex = hex
      const [r, g, bl] = hexToRgb01(hex)
      for (const u of rig.uniforms) u.uColorLight.value.set(r, g, bl)
    }

    if (p.idle) tournerDansRepere(rig.bones.Spine2, AXE_X, breathing(clock.elapsedTime), yawGroup)

    if (p.lookAt) {
      // Lissage exponentiel : la tête rejoint le pointeur sans à-coup.
      const k = 1 - Math.exp(-8 * delta)
      e.regard.x += (pointeur.current.x - e.regard.x) * k
      e.regard.y += (pointeur.current.y - e.regard.y) * k
      const { yaw, pitch } = lookAngles(e.regard.x, e.regard.y)
      // De dos (yaw 180°), le +X du personnage est à gauche de l'écran : le yaw du regard
      // est pondéré par l'orientation pour que la tête suive toujours le pointeur
      // (1 de face, -1 de dos, 0 de profil, sans saut pendant un mélange).
      const sens = Math.cos(yawGroup.rotation.y)
      // Le visage regarde +Z : lever la tête est une rotation négative autour de X.
      tournerDansRepere(rig.bones.Neck, AXE_Y, (yaw * sens) / 2, yawGroup)
      tournerDansRepere(rig.bones.Neck, AXE_X, -pitch / 2, yawGroup)
      tournerDansRepere(rig.bones.Head, AXE_Y, yaw * sens, yawGroup)
      tournerDansRepere(rig.bones.Head, AXE_X, -pitch, yawGroup)
    }
  })

  return (
    <group ref={yawRef}>
      <primitive object={scene} />
    </group>
  )
}

export default function CharacterCanvas() {
  const reducedMotion = useReducedMotion()
  const coarsePointer = useIsCoarsePointer()
  const [frozen, setFrozen] = React.useState(false)
  const policy = React.useMemo(
    () => motionPolicy({ reducedMotion, coarsePointer, frozen }),
    [reducedMotion, coarsePointer, frozen],
  )
  const dpr = useDpr()
  // Performances en baisse : le personnage se fige (plus de respiration ni de regard, rendu à la demande).
  const figer = React.useCallback(() => setFrozen(true), [])

  return (
    <Canvas frameloop={policy.frameloop} dpr={dpr} gl={GL} camera={CAMERA} resize={RESIZE} style={STYLE}>
      <PerformanceMonitor onDecline={figer}>
        {/* Le tramage lit la luminance : trois lumières simples, pas d'Environment. */}
        <ambientLight intensity={0.35} />
        <directionalLight position={CLE} intensity={1.6} />
        <directionalLight position={CONTRE_JOUR} intensity={0.9} />
        <React.Suspense fallback={null}>
          <Character policy={policy} />
        </React.Suspense>
      </PerformanceMonitor>
    </Canvas>
  )
}
