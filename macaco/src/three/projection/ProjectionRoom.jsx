// Salle de projection : décor de la section Projets (storyboard v6, section 4).
//
// Le projecteur éclaire pour de vrai : une SpotLight à ombres dont la texture (map) est la
// pellicule (filmMaterial.js), composée à chaque image. L'image du projet tombe sur l'écran, sur
// son manteau quand il est dans le faisceau, et son ombre mord le bas de l'image. L'écran renvoie
// la couleur du projet sur son visage (une SpotLight très ouverte posée sur la toile), visible au
// contrechamp. Un cône additif et de la poussière dessinent le faisceau ; les bobines tournent.
//
// Props : projects (PROJECTS), index (projet courant, utilisé sous mouvement réduit), plus
// { timeline, policy } de CinematicSection. Le projet à l'écran vient de stageStep : projectAt(p),
// le même calcul que le texte en DOM, ou la carte affichée sous mouvement réduit.
import React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import { Color, Group, Quaternion, SpotLight, Vector3 } from 'three'
import { useStageRig } from '../character/useStageRig.js'
import { LEADER, leaderAt, stageStep } from './steps.js'
import { ROOM } from './layout.js'
import { createFilm, filmTextures, screenColor, setFilmStep } from './filmMaterial.js'
import { createBeam, createDust } from './beam.js'

const PROJECTEUR = '/props/filmstrip_projector_8mm.glb'

// Intensité du rebond, atténuée avec la distance (decay 2) : sur son visage, à 3,8 m, environ
// 1,3, l'éclairement que donnait une lumière de surface d'intensité 3 grande comme la toile ;
// le fond de la salle (le projecteur, à 7 m) n'en reçoit plus qu'un reflet.
const REBOND = 19

const v3 = (a) => new Vector3().fromArray(a)

// Géométrie du faisceau, de l'objectif au centre de l'écran. Le cadre projeté est un peu plus
// petit que la toile (un liseré sombre, comme en salle) ; le cône de la lampe circonscrit ce
// cadre, dont la carte (carrée) garde la proportion.
const LENS = v3(ROOM.projector.lens)
const CIBLE = v3(ROOM.screen.center)
const PORTEE = LENS.distanceTo(CIBLE)
const DEMI_L = (ROOM.screen.width / 2) * 0.955
const DEMI_H = (ROOM.screen.height / 2) * 0.955
const T = Math.hypot(DEMI_L, DEMI_H) * 1.01
const ANGLE = Math.atan(T / PORTEE)
const FRAME = [DEMI_L / (2 * T), DEMI_H / (2 * T)]

const CHAUD = new Color('#ffe7c2')
const AMORCE_COULEUR = new Color('#e8d2a6')

// Couleur de lumière d'un projet : sa couleur dominante, éclaircie et un peu saturée pour
// éclairer (une couleur sombre donnerait un rebond éteint).
function couleurLumiere(hex) {
  const c = new Color(hex)
  const hsl = {}
  c.getHSL(hsl)
  return c.setHSL(hsl.h, Math.min(0.85, hsl.s * 1.1), Math.max(0.55, hsl.l))
}

function Personnage({ policy }) {
  // Le rig partagé des sections : clone en pose de liaison, à sa taille, pieds au sol ; il porte
  // son ombre sur l'écran.
  const { rig, k, offset, mixer, clip } = useStageRig({ height: ROOM.character.height, castShadow: true })
  React.useEffect(() => {
    const action = mixer.clipAction(clip('watch'))
    action.play()
    mixer.update(0)
    return () => action.stop()
  }, [mixer, clip])
  useFrame((_, dt) => {
    if (policy.animate) mixer.update(dt)
  })
  return (
    <group position={ROOM.character.position} rotation={[0, ROOM.character.rotationY, 0]}>
      <group scale={k} position={offset}>
        <primitive object={rig} />
      </group>
    </group>
  )
}

// Le projecteur et ses bobines : chaque bobine tourne autour de son axe le plus fin.
function Projecteur({ policy }) {
  const { scene } = useGLTF(PROJECTEUR, false, true)
  const { modele, bobines } = React.useMemo(() => {
    const m = scene.clone(true)
    const liste = []
    m.traverse((o) => {
      if (!o.isMesh || !/spool_(feed|takeup)$/.test(o.name)) return
      o.geometry = o.geometry.clone()
      o.geometry.computeBoundingBox()
      const b = o.geometry.boundingBox
      const centre = b.getCenter(new Vector3())
      const taille = b.getSize(new Vector3())
      o.geometry.translate(-centre.x, -centre.y, -centre.z)
      o.position.add(centre.multiply(o.scale).applyQuaternion(o.quaternion))
      const axe = taille.x <= taille.y && taille.x <= taille.z ? new Vector3(1, 0, 0) : taille.y <= taille.z ? new Vector3(0, 1, 0) : new Vector3(0, 0, 1)
      liste.push({ objet: o, depart: o.quaternion.clone(), axe, sens: /feed$/.test(o.name) ? 1 : 1.35 })
    })
    m.traverse((o) => {
      if (o.isMesh) o.receiveShadow = false
    })
    return { modele: m, bobines: liste }
  }, [scene])
  // les géométries des bobines sont des copies (recentrées) : à libérer
  React.useEffect(() => () => bobines.forEach((b) => b.objet.geometry.dispose()), [bobines])
  const angle = React.useRef(0)
  const q = React.useMemo(() => new Quaternion(), [])
  useFrame((_, dt) => {
    if (!policy.animate) return
    angle.current += dt * 1.9
    for (const b of bobines) b.objet.quaternion.copy(b.depart).multiply(q.setFromAxisAngle(b.axe, -angle.current * b.sens))
  })
  return <primitive object={modele} position={ROOM.projector.position} rotation={[0, ROOM.projector.rotationY, 0]} />
}

// Le pied du projecteur : un plateau rond sur trois jambes, métal sombre.
function Pied() {
  const [x, , z] = ROOM.projector.position
  const h = ROOM.projector.position[1]
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h - 0.015, 0]} castShadow={false}>
        <cylinderGeometry args={[0.26, 0.26, 0.03, 40]} />
        <meshStandardMaterial color="#17150f" metalness={0.6} roughness={0.45} />
      </mesh>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.4
        return (
          <mesh key={i} position={[Math.cos(a) * 0.17, (h - 0.03) / 2, Math.sin(a) * 0.17]} rotation={[Math.sin(a) * 0.14, 0, -Math.cos(a) * 0.14]}>
            <cylinderGeometry args={[0.014, 0.018, h - 0.02, 10]} />
            <meshStandardMaterial color="#121110" metalness={0.7} roughness={0.4} />
          </mesh>
        )
      })}
    </group>
  )
}

// Quelques rangées de fauteuils à gauche du faisceau : des silhouettes contre l'écran.
const FAUTEUILS = []
for (const zr of [-2.3, -1.25, -0.2]) for (let i = 0; i < 4; i++) FAUTEUILS.push([-3.05 + i * 0.58, zr])
function Fauteuils() {
  return (
    <group>
      {FAUTEUILS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[0.5, 0.1, 0.46]} />
            <meshStandardMaterial color="#1a0f0d" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.72, 0.21]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[0.5, 0.62, 0.09]} />
            <meshStandardMaterial color="#1a0f0d" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.08, 0.4, 0.3]} />
            <meshStandardMaterial color="#0c0b0a" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// La toile, son cadre noir, le mur du fond, le sol et les murs latéraux.
function Salle() {
  const { center, width, height } = ROOM.screen
  return (
    <group>
      <mesh position={center} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#d9d4ca" roughness={0.96} />
      </mesh>
      <mesh position={[center[0], center[1], center[2] - 0.02]}>
        <planeGeometry args={[width + 0.5, height + 0.4]} />
        <meshStandardMaterial color="#050505" roughness={1} />
      </mesh>
      <mesh position={[0, 3, center[2] - 0.06]} receiveShadow>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color="#0e0c0b" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 16]} />
        <meshStandardMaterial color="#0d0b0a" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-4.2, 3, 0]}>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color="#0b0a09" roughness={0.95} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[3.6, 3, 0]}>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color="#0b0a09" roughness={0.95} />
      </mesh>
    </group>
  )
}

export default function ProjectionRoom({ projects, index = LEADER, timeline, policy }) {
  const gl = useThree((s) => s.gl)
  const invalidate = useThree((s) => s.invalidate)
  const viewportDpr = useThree((s) => s.viewport.dpr)

  // Les images des projets (WebP) et les intertitres dessinés, dans l'ordre des projets.
  const urls = React.useMemo(() => projects.filter((p) => p.media.kind === 'image').map((p) => p.media.src), [projects])
  const images = useTexture(urls)
  const textures = React.useMemo(() => filmTextures(projects, images), [projects, images])
  const couleurs = React.useMemo(() => projects.map((p) => couleurLumiere(p.media.color)), [projects])
  React.useEffect(() => () => textures.forEach((t) => t.isCanvasTexture && t.dispose()), [textures])

  const film = React.useMemo(() => createFilm(FRAME), [])
  React.useEffect(() => () => film.dispose(), [film])

  // La lampe du projecteur : un cône juste assez ouvert pour le cadre, à ombres, qui projette
  // la pellicule.
  const lampe = React.useMemo(() => {
    const s = new SpotLight('#fff1dc', 4, 0, ANGLE, 0.02, 0)
    s.position.copy(LENS)
    s.target.position.copy(CIBLE)
    s.map = film.texture
    s.castShadow = true
    s.shadow.mapSize.set(1024, 1024)
    s.shadow.bias = -0.0004
    s.shadow.normalBias = 0.02
    s.shadow.camera.near = 0.4
    s.shadow.camera.far = PORTEE + 1
    return s
  }, [film])
  React.useEffect(() => () => lampe.dispose(), [lampe]) // sa carte d'ombre

  // Le rebond de l'écran : une lumière sans ombre au centre de la toile, très ouverte, tournée
  // vers sa tête, couleur du projet.
  const rebond = React.useMemo(() => {
    const r = new SpotLight('#ffffff', REBOND, 0, Math.PI / 3, 1, 2)
    r.position.set(CIBLE.x, CIBLE.y, CIBLE.z + 0.05)
    r.target.position.fromArray(ROOM.character.head)
    return r
  }, [])

  const { faisceau, poussiere } = React.useMemo(() => {
    const f = createBeam(PORTEE, DEMI_L, DEMI_H)
    const d = createDust(PORTEE, DEMI_L, DEMI_H)
    const groupe = new Group()
    groupe.position.copy(LENS)
    groupe.lookAt(CIBLE)
    groupe.add(f, d)
    return { faisceau: groupe, poussiere: d }
  }, [])
  const cone = faisceau.children[0]
  React.useEffect(
    () => () => {
      cone.geometry.dispose()
      cone.material.dispose()
      poussiere.geometry.dispose()
      poussiere.material.dispose()
    },
    [cone, poussiere],
  )

  // Mouvement réduit : la boucle est à la demande et la progression figée, rien ne redessine
  // quand la carte affichée change. Une image à chaque changement de projet.
  React.useEffect(() => {
    if (!policy.animate) invalidate()
  }, [index, policy.animate, invalidate])

  const temps = React.useRef(0)
  const couleur = React.useMemo(() => new Color(), [])
  useFrame((_, dt) => {
    if (policy.animate) temps.current += Math.min(dt, 0.1)
    const p = timeline.current.p
    // Mouvement réduit : le projet de la carte affichée, en coupe franche.
    const etape = stageStep(p, policy.animate, index)
    setFilmStep(film.uniforms, etape, textures)
    film.uniforms.uTime.value = temps.current
    film.uniforms.uLeader.value = leaderAt(p)
    film.render(gl)

    screenColor(etape, couleurs, AMORCE_COULEUR, couleur)
    rebond.color.copy(couleur)
    cone.material.uniforms.uColor.value.copy(CHAUD).lerp(couleur, 0.3)
    cone.material.uniforms.uTime.value = temps.current
    poussiere.material.uniforms.uTime.value = temps.current
    poussiere.material.uniforms.uSize.value = 12 * viewportDpr
  })

  return (
    <>
      <color attach="background" args={['#040404']} />
      <fog attach="fog" args={['#040404', 7, 18]} />
      <ambientLight color="#a89a88" intensity={0.05} />
      <directionalLight color="#9fb4c8" intensity={0.12} position={[4, 3, 1]} />
      <primitive object={lampe} />
      {/* la lampe du projecteur fuit par ses ouïes : une lueur chaude sur les bobines */}
      <pointLight color="#ffb46a" intensity={0.07} distance={1.0} decay={2} position={[ROOM.projector.position[0] + 0.25, ROOM.projector.position[1] + 0.12, ROOM.projector.position[2] - 0.05]} />
      <primitive object={lampe.target} />
      <primitive object={rebond} />
      <primitive object={rebond.target} />
      <primitive object={faisceau} />
      <Salle />
      <Fauteuils />
      <Pied />
      <Projecteur policy={policy} />
      <Personnage policy={policy} />
    </>
  )
}
