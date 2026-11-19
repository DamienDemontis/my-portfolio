// Salle d'écoute : décor de la section Musique (storyboard v6, section 5).
//
// Il se tient au centre, casque sur les oreilles, sur un sol noir qui reflète les tubes néon
// cuivre dressés derrière lui ; la boombox est à ses pieds. Un anneau de particules tourne
// autour de lui et suit la musique : les graves le dilatent, les médiums le font tourbillonner,
// les aigus le font frémir ; chaque coup de grosse caisse lance une onde au sol. Quand la musique
// joue, il bat la mesure.
//
// La couleur de l'anneau (particules et fil de lumière) et du liseré du casque glisse du cuivre
// vers la teinte de la pochette du morceau en cours (coverColor.js), et y revient sans pochette
// ou à l'arrêt.
//
// Props : listening (le moteur d'écoute : tick(), bands, state, current, subscribe ;
// src/lib/listening.js), plus { timeline, policy } de CinematicSection.
//
// Ordre des images (priorités de useFrame, toutes avant le rendu) : -2, le moteur lit les
// bandes de l'image (tick) et l'anneau prend ses uniformes ; -1, le mélangeur du personnage et
// les ondes, qui lisent ces bandes ; 0, la caméra et le réflecteur du sol, qui voit l'état à jour.
import React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial, useGLTF } from '@react-three/drei'
import { AdditiveBlending, Color, DoubleSide, Mesh, MeshBasicMaterial, RingGeometry, SpotLight, SRGBColorSpace, TorusGeometry } from 'three'
import { hexToRgb01, useIsCoarsePointer } from '../../lib/device.js'
import { useStageRig } from '../character/useStageRig.js'
import { ROOM } from './layout.js'
import { RING_COLORS, RIPPLES, createRing, ringBands, rippleLook, stepRipples } from './ring.js'
import { NEON, NEON_INTENSITY, createHeadphones, fitHeadphones } from './headphones.js'
import { glideStep, readCoverColor, tintToward } from './coverColor.js'
import { createTempoState, suivreTempo } from './tempo.js'

const BOOMBOX = '/props/boombox.glb'
const CUIVRE_HEX = '#ff8a4c'
const CUIVRE = new Color(CUIVRE_HEX)
const DEG = Math.PI / 180
// Flou du réflecteur, en constante de module : drei mémorise ses cibles de rendu sur l'identité
// de ce tableau (sans les libérer) ; un tableau écrit en ligne les recréerait à chaque rendu.
const BLUR = [320, 90]

// Les cuivres de base (sRGB 0..1) que la pochette vient teinter.
const BASE_A = hexToRgb01(RING_COLORS[0])
const BASE_B = hexToRgb01(RING_COLORS[1])
const BASE_NEON = hexToRgb01(NEON)
// Le fil de lumière au cœur de l'anneau : le cuivre de la salle, doublé pour le bloom.
const BASE_COEUR = hexToRgb01(CUIVRE_HEX)
const COEUR_INTENSITY = 2

/** Couleurs cibles (espace de travail de three) pour une pochette [r, g, b] 0..1, ou le cuivre (null). */
function viser(cible, pochette) {
  cible.a.setRGB(...tintToward(BASE_A, pochette), SRGBColorSpace)
  cible.b.setRGB(...tintToward(BASE_B, pochette), SRGBColorSpace)
  cible.neon.setRGB(...tintToward(BASE_NEON, pochette), SRGBColorSpace).multiplyScalar(NEON_INTENSITY)
  cible.coeur.setRGB(...tintToward(BASE_COEUR, pochette), SRGBColorSpace).multiplyScalar(COEUR_INTENSITY)
}

// Le personnage, son casque attaché à l'os de la tête, et le mélange des deux clips : `listen`
// sans musique, `listen_beat` quand elle joue (fondu d'une demi-seconde), calé sur le tempo
// des coups de grosse caisse (tempo.js).
function Auditeur({ listening, policy, casque }) {
  const { rig, k, offset, mixer, clip } = useStageRig({ height: ROOM.character.height })

  // Le casque : posé en pose de liaison (avant la première mise à jour du mélangeur, faite dans
  // un effet ordinaire, après celui-ci) entre les oreilles, puis rattaché à l'os de la tête,
  // qui l'emporte ensuite dans ses mouvements. Sa place n'est calculée qu'une fois par rig.
  React.useLayoutEffect(() => {
    if (!fitHeadphones(casque.group, rig)) return undefined
    return () => {
      casque.group.removeFromParent()
    }
  }, [rig, casque])

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

  // Le suivi du tempo : son état, son résultat réutilisé, et sa propre horloge (le temps réel
  // des images animées, entre deux coups).
  const tempo = React.useMemo(() => ({ etat: createTempoState(), sortie: {}, horloge: 0 }), [])

  useFrame((_, dt) => {
    if (!policy.animate) return
    const bandes = listening.bands
    const cible = bandes.playing ? 1 : 0
    poids.current += (cible - poids.current) * Math.min(1, dt * 2)
    actions.mesure.setEffectiveWeight(poids.current)
    actions.calme.setEffectiveWeight(1 - poids.current)
    tempo.horloge += Math.max(0, dt)
    const r = suivreTempo(tempo.etat, bandes.playing && bandes.kick, tempo.horloge, actions.mesure.time, tempo.sortie)
    // le tempo des coups, plus la remise en phase en cours (jamais négatif au total)
    actions.mesure.setEffectiveTimeScale(r.timeScale + r.rephase)
    mixer.update(dt)
  }, -1)

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
  // Âges des ondes et aspect d'une onde : mis à jour sur place à chaque image.
  const ondes = React.useMemo(() => ({ ages: Array(RIPPLES).fill(Infinity), aspect: { scale: 1, opacity: 0 } }), [])
  useFrame((_, dt) => {
    if (!policy.animate) return
    const { ages, aspect } = ondes
    stepRipples(ages, listening.bands.playing && listening.bands.kick, Math.min(dt, 0.1))
    for (let i = 0; i < ages.length; i++) {
      const m = refs.current[i]
      if (!m) continue
      rippleLook(ages[i], aspect)
      m.scale.setScalar(ROOM.ring.radius * aspect.scale)
      mats[i].opacity = aspect.opacity
      m.visible = aspect.opacity > 0.001
    }
  }, -1)
  return (
    <group position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {mats.map((m, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} geometry={geo} material={m} visible={false} />
      ))}
    </group>
  )
}

export default function ListeningRoom({ listening, timeline, policy }) {
  // Un booléen, pas la taille du canvas : un redimensionnement (la barre d'adresse d'un
  // téléphone) ne re-rend pas la scène. La densité de pixels est lue à chaque image.
  const mobile = useIsCoarsePointer()
  const invalidate = useThree((s) => s.invalidate)

  const anneau = React.useMemo(() => createRing({ radius: ROOM.ring.radius, count: mobile ? 650 : 900 }), [mobile])
  React.useEffect(
    () => () => {
      anneau.geometry.dispose()
      anneau.material.dispose()
    },
    [anneau],
  )
  // Le cœur de l'anneau : un fil de lumière cuivre, qui gonfle et s'allume sur les graves ; il
  // donne sa forme à la poussière de particules. Il prend la teinte de la pochette avec l'anneau.
  const coeur = React.useMemo(() => {
    const m = new MeshBasicMaterial({ color: CUIVRE.clone().multiplyScalar(COEUR_INTENSITY), transparent: true, opacity: 0.55, blending: AdditiveBlending, depthWrite: false, toneMapped: false })
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

  // Le casque, créé ici : son liseré prend la teinte de la pochette avec l'anneau.
  const casque = React.useMemo(() => createHeadphones(), [])
  React.useEffect(() => () => casque.dispose(), [casque])

  // La teinte de la pochette : les couleurs cibles (cuivre au départ), changées quand le morceau
  // change ; l'anneau, son fil de lumière et le liseré y glissent ensemble à chaque image. Seuls
  // un morceau en lecture ou en pause teintent la salle : sans pochette, en chargement, en
  // erreur ou à l'arrêt, le cuivre.
  const teinte = React.useMemo(() => {
    const cible = { a: new Color(), b: new Color(), neon: new Color(), coeur: new Color() }
    viser(cible, null)
    return cible
  }, [])
  React.useEffect(() => {
    let actif = true
    let pochette
    const suivre = () => {
      const { state, current } = listening
      const url = (state === 'playing' || state === 'paused') && current ? current.cover || null : null
      if (url === pochette) return
      pochette = url
      if (!url) {
        viser(teinte, null)
        invalidate()
        return
      }
      readCoverColor(url).then((couleur) => {
        if (!actif || pochette !== url) return
        viser(teinte, couleur)
        invalidate()
      })
    }
    suivre()
    // un moteur sans abonnement (ni pochettes) laisse la salle en cuivre
    const desabonner = typeof listening.subscribe === 'function' ? listening.subscribe(suivre) : null
    return () => {
      actif = false
      if (desabonner) desabonner()
    }
  }, [listening, teinte, invalidate])

  const temps = React.useRef(0)
  const bandes = React.useMemo(() => ({ bass: 0, mid: 0, high: 0 }), [])
  useFrame((state, dt) => {
    const pas = Math.min(dt, 0.1)
    if (policy.animate) temps.current += pas
    listening.tick()
    const b = ringBands(listening.bands, temps.current, policy.animate, bandes)
    const u = anneau.material.uniforms
    u.uTime.value = temps.current
    u.uBass.value = b.bass
    u.uMid.value = b.mid
    u.uHigh.value = b.high
    u.uSize.value = 16 * state.viewport.dpr
    const gonfle = 1 + b.bass * 0.35
    coeur.scale.set(gonfle, gonfle, 1)
    coeur.material.opacity = 0.35 + b.bass * 0.65
    // Fondu d'une seconde environ ; d'un coup sous mouvement réduit ou rendu à la demande
    // (pas d'image suivante garantie pour finir le fondu).
    const part = glideStep(pas, policy.animate && policy.frameloop === 'always')
    u.uColorA.value.lerp(teinte.a, part)
    u.uColorB.value.lerp(teinte.b, part)
    coeur.material.color.lerp(teinte.coeur, part)
    casque.neonMaterial.color.lerp(teinte.neon, part)
  }, -2)

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
          blur={BLUR}
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
      <Auditeur listening={listening} policy={policy} casque={casque} />
      <primitive object={anneau} position={ROOM.ring.center} />
      <primitive object={coeur} position={ROOM.ring.center} />
      {/* une lueur basse sur la boombox, qui la sort du noir */}
      <pointLight color="#ffb27a" intensity={0.9} distance={1.6} decay={2} position={[ROOM.boombox.position[0] - 0.1, 0.55, ROOM.boombox.position[2] + 0.55]} />
      <Ondes listening={listening} policy={policy} />
    </>
  )
}
