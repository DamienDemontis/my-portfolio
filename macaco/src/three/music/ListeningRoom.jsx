// Salle d'écoute : décor de la section Musique (storyboard v6, section 5).
//
// Il se tient au centre, casque sur les oreilles, sur un sol noir qui reflète les tubes néon
// cuivre dressés derrière lui ; la boombox est à ses pieds. Un anneau de particules tourne
// autour de lui et suit la musique : les graves le dilatent, les médiums le font tourbillonner,
// les aigus le font frémir ; chaque coup de grosse caisse lance une onde au sol. Quand la musique
// joue, il bat la mesure.
//
// Props : listening (le moteur d'écoute : tick() et bands, src/lib/listening.js), plus
// { timeline, policy } de CinematicSection.
import React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial, useGLTF } from '@react-three/drei'
import { AdditiveBlending, Color, DoubleSide, MeshBasicMaterial, RingGeometry, SpotLight, TorusGeometry, Mesh, Vector3 } from 'three'
import { useStageRig } from '../character/useStageRig.js'
import { ROOM } from './layout.js'
import { RIPPLES, createRing, ringBands, rippleLook, stepRipples } from './ring.js'
import { createHeadphones } from './headphones.js'

const BOOMBOX = '/props/boombox.glb'
const CUIVRE = new Color('#ff8a4c')
const DEG = Math.PI / 180

// Le personnage, son casque attaché à l'os de la tête, et le mélange des deux clips : `listen`
// sans musique, `listen_beat` quand elle joue (fondu d'une demi-seconde).
function Auditeur({ listening, policy }) {
  const { rig, k, offset, mixer, clip } = useStageRig({ height: ROOM.character.height })

  // Le casque : créé une fois, posé en pose de liaison (avant la première mise à jour du
  // mélangeur, faite dans un effet ordinaire, après celui-ci) entre les oreilles, en mètres du
  // monde, puis rattaché à l'os de la tête, qui l'emporte ensuite dans ses mouvements.
  const casque = React.useMemo(() => createHeadphones(), [])
  React.useLayoutEffect(() => {
    const tete = rig.getObjectByName('mixamorigHead')
    if (!tete) return undefined
    rig.updateWorldMatrix(true, true)
    const centre = tete.getWorldPosition(new Vector3())
    casque.group.position.copy(centre).add(new Vector3(0, 0.088, 0.006))
    casque.group.quaternion.identity()
    casque.group.scale.setScalar(1)
    casque.group.updateMatrixWorld(true)
    tete.attach(casque.group)
    return () => {
      casque.group.removeFromParent()
    }
  }, [rig, casque])
  React.useEffect(() => () => casque.dispose(), [casque])

  const actions = React.useMemo(() => {
    const calme = mixer.clipAction(clip('listen'))
    const mesure = mixer.clipAction(clip('listen_beat'))
    return { calme, mesure }
  }, [mixer, clip])
  const poids = React.useRef(0)
  React.useEffect(() => {
    actions.calme.play()
    actions.mesure.play()
    actions.mesure.setEffectiveWeight(0)
    mixer.update(0)
    return () => mixer.stopAllAction()
  }, [actions, mixer])

  useFrame((_, dt) => {
    if (!policy.animate) return
    const cible = listening.bands.playing ? 1 : 0
    poids.current += (cible - poids.current) * Math.min(1, dt * 2)
    actions.mesure.setEffectiveWeight(poids.current)
    actions.calme.setEffectiveWeight(1 - poids.current)
    mixer.update(dt)
  })

  return (
    <group position={ROOM.character.position} rotation={[0, ROOM.character.rotationY, 0]}>
      <group scale={k} position={offset}>
        <primitive object={rig} />
      </group>
    </group>
  )
}

function Boombox() {
  const { scene } = useGLTF(BOOMBOX, false, true)
  const modele = React.useMemo(() => scene.clone(true), [scene])
  return <primitive object={modele} position={ROOM.boombox.position} rotation={[0, ROOM.boombox.rotationY, 0]} />
}

// Les tubes néon : un arc derrière lui, cuivre, plus vif que 1 pour le bloom ; une lumière
// ponctuelle sur deux pour qu'ils éclairent aussi le sol et son manteau.
function Neons() {
  const { radius, height, angles } = ROOM.neons
  const lueur = React.useMemo(() => {
    const m = new MeshBasicMaterial({ color: CUIVRE.clone().multiplyScalar(3.2), toneMapped: false })
    return m
  }, [])
  React.useEffect(() => () => lueur.dispose(), [lueur])
  return (
    <group>
      {angles.map((a, i) => {
        const x = Math.sin(a * DEG) * radius
        const z = -Math.cos(a * DEG) * radius
        return (
          <group key={a} position={[x, 0, z]}>
            <mesh position={[0, height / 2 + 0.05, 0]} material={lueur}>
              <cylinderGeometry args={[0.022, 0.022, height, 12]} />
            </mesh>
            {i % 2 === 0 && <pointLight color={CUIVRE} intensity={2.2} distance={5.5} decay={2} position={[0, height * 0.55, 0.3]} />}
          </group>
        )
      })}
    </group>
  )
}

// Les ondes au sol, lancées par les coups de grosse caisse.
function Ondes({ listening, policy }) {
  const { geo, mats } = React.useMemo(() => {
    const g = new RingGeometry(0.98, 1.0, 96)
    const m = Array.from({ length: RIPPLES }, () => new MeshBasicMaterial({ color: CUIVRE.clone().multiplyScalar(2.4), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, side: DoubleSide, toneMapped: false }))
    return { geo: g, mats: m }
  }, [])
  React.useEffect(
    () => () => {
      geo.dispose()
      mats.forEach((m) => m.dispose())
    },
    [geo, mats],
  )
  const refs = React.useRef([])
  const ages = React.useRef(Array(RIPPLES).fill(Infinity))
  useFrame((_, dt) => {
    if (!policy.animate) return
    ages.current = stepRipples(ages.current, listening.bands.playing && listening.bands.kick, Math.min(dt, 0.1))
    ages.current.forEach((age, i) => {
      const { scale, opacity } = rippleLook(age)
      const m = refs.current[i]
      if (!m) return
      m.scale.setScalar(ROOM.ring.radius * scale)
      mats[i].opacity = opacity
      m.visible = opacity > 0.001
    })
  })
  return (
    <group position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {mats.map((m, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} geometry={geo} material={m} visible={false} />
      ))}
    </group>
  )
}

export default function ListeningRoom({ listening, timeline, policy }) {
  const dpr = useThree((s) => s.viewport.dpr)
  const taille = useThree((s) => s.size)
  const mobile = Math.min(taille.width, taille.height) < 700

  const anneau = React.useMemo(() => createRing({ radius: ROOM.ring.radius, count: mobile ? 650 : 900 }), [mobile])
  React.useEffect(
    () => () => {
      anneau.geometry.dispose()
      anneau.material.dispose()
    },
    [anneau],
  )
  // Le cœur de l'anneau : un fil de lumière cuivre, qui gonfle et s'allume sur les graves ; il
  // donne sa forme à la poussière de particules.
  const coeur = React.useMemo(() => {
    const m = new MeshBasicMaterial({ color: CUIVRE.clone().multiplyScalar(2), transparent: true, opacity: 0.55, blending: AdditiveBlending, depthWrite: false, toneMapped: false })
    const mesh = new Mesh(new TorusGeometry(ROOM.ring.radius, 0.0045, 6, 160), m)
    mesh.rotation.x = Math.PI / 2
    return mesh
  }, [])
  React.useEffect(
    () => () => {
      coeur.geometry.dispose()
      coeur.material.dispose()
    },
    [coeur],
  )

  // La lumière du haut, un douche de studio, qui le modèle sans éclairer la salle.
  const douche = React.useMemo(() => {
    const s = new SpotLight('#ffe2c4', 26, 0, 0.42, 0.85, 2)
    s.position.set(0.4, 4.6, 1.4)
    s.target.position.set(0, 1.0, 0)
    return s
  }, [])
  React.useEffect(() => () => douche.dispose(), [douche])

  const temps = React.useRef(0)
  useFrame((_, dt) => {
    if (policy.animate) temps.current += Math.min(dt, 0.1)
    listening.tick()
    const b = ringBands(listening.bands, temps.current, policy.animate)
    const u = anneau.material.uniforms
    u.uTime.value = temps.current
    u.uBass.value = b.bass
    u.uMid.value = b.mid
    u.uHigh.value = b.high
    u.uSize.value = 16 * dpr
    const gonfle = 1 + b.bass * 0.35
    coeur.scale.set(gonfle, gonfle, 1)
    coeur.material.opacity = 0.35 + b.bass * 0.65
  })

  return (
    <>
      <color attach="background" args={['#050302']} />
      <fog attach="fog" args={['#050302', 6, 16]} />
      <ambientLight color="#8a7768" intensity={0.06} />
      <primitive object={douche} />
      <primitive object={douche.target} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial
          resolution={mobile ? 256 : 512}
          blur={[320, 90]}
          mixBlur={1}
          mixStrength={2.4}
          mirror={0.55}
          roughness={0.9}
          depthScale={0.8}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color="#060505"
          metalness={0.5}
        />
      </mesh>
      <Neons />
      <Boombox />
      <Auditeur listening={listening} policy={policy} />
      <primitive object={anneau} position={ROOM.ring.center} />
      <primitive object={coeur} position={ROOM.ring.center} />
      {/* une lueur basse sur la boombox, qui la sort du noir */}
      <pointLight color="#ffb27a" intensity={0.9} distance={1.6} decay={2} position={[ROOM.boombox.position[0] - 0.1, 0.55, ROOM.boombox.position[2] + 0.55]} />
      <Ondes listening={listening} policy={policy} />
    </>
  )
}
