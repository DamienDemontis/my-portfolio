// Section cinématique épinglée : une piste haute de `track`, un enfant collant d'un écran qui
// porte le canvas 3D (décoratif, aria-hidden) et le texte en DOM. Le scroll de la piste donne
// une progression 0 → 1 que le canvas applique à la timeline de plans (shots.js).
//
// Module léger, chargé avec la page : le canvas (three, fiber, drei) n'est importé et monté
// qu'après load (afterLoad) ET quand la section est à moins d'un écran ; une section jamais
// atteinte ne télécharge rien. Il est démonté au-delà d'un écran et demi : le nombre de
// contextes WebGL est limité, et les modèles restent dans le cache de useGLTF.
//
// Props :
//   id, track = '300svh'  identifiant et hauteur de la piste (unité CSS)
//   shots                  timeline de plans (voir shots.js), ou { wide, narrow } : un cadrage
//                          par rapport d'image (étroit sous NARROW_ASPECT, 1,15), mêmes ancres
//   still                  plan fixe sous prefers-reduced-motion (plan, ou progression, ou
//                          { wide, narrow } de l'un ou l'autre) ; par défaut le plan de p = 0.5
//   onProgress(p)          appelé quand la progression change (celle du scroll, même sous
//                          mouvement réduit : le texte en DOM reste l'affaire de l'appelant,
//                          qui peut le caler sur segmentAt(shots, p))
//   preload                URL des modèles du décor, préchargés au montage du canvas
//   stage                  composant 3D rendu dans le canvas (idéalement React.lazy), qui
//                          reçoit stageProps, plus { timeline, policy } qu'ils ne peuvent pas
//                          remplacer. timeline.current : p, la progression (figée sur celle du
//                          plan fixe sous mouvement réduit), et visible, la section à l'écran ou
//                          presque. policy vient de motionPolicy (animate : la scène peut
//                          s'animer), avec le frameloop réel du canvas
//   stageProps             props du décor
//   animated = false       scène animée : rendu continu ('always') quand la section est à
//                          l'écran et le mouvement permis ; sinon rendu à la demande, et rien
//                          hors écran ('never'). Animer dans useFrame avec le delta, sans
//                          invalidate()
//   depthOfField = false   profondeur de champ pilotée par le focus des plans : true ou
//                          { focusRange, bokehScale }
//   shadows = false        ombres portées (la carte d'ombre de three) : une lumière qui projette
//                          une texture (SpotLight.map) en a besoin
//   effects                effets de post-traitement (Bloom…), rendus dans le même
//                          EffectComposer que la profondeur de champ
//   poster                 URL d'image ou élément, affiché tant que la 3D n'a rien dessiné :
//                          chargement, absence de WebGL 2, canvas en échec
//   className, aria-*, …   transmis à la <section> (la classe s'ajoute à « cinematic », la
//                          hauteur de piste l'emporte sur style.height)
//
// Identités stables : `stage` est un composant défini une fois (au niveau du module, ou
// React.lazy) ; un composant recréé à chaque rendu remonterait la scène et rechargerait tout.
// `shots`, `still` et `effects` aussi (constantes de module ou useMemo) : de nouveaux plans sont
// revérifiés, de nouveaux effets reconstruisent les passes et recompilent leurs shaders.
import React from 'react'
import { afterLoad } from '../../lib/afterLoad.js'
import {
  getOffsetBottom,
  getOffsetTop,
  getScrollContainer,
  getScrollTop,
  getViewportHeight,
  onScroll,
} from '../../lib/scroll.js'
import '../../styles/cinematic.css'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
// Montage à moins d'un écran ; démontage au-delà d'un écran et demi, pour ne pas recréer
// le contexte WebGL à chaque aller-retour autour de la limite.
const MONTAGE = 1
const DEMONTAGE = 1.5
// « Visible » un peu avant l'écran (même marge que la scène des expertises) : la première
// image est prête quand la section entre.
const MARGE_VISIBLE = '30% 0px'

const avertir = (message, ...detail) => console.warn(`[cinematique] ${message}`, ...detail)
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

// Un module de canvas introuvable (déploiement remplacé, réseau coupé) rend une section sans 3D.
const CinematicCanvas = React.lazy(() =>
  import('./CinematicCanvas.jsx').catch((error) => {
    avertir('module du canvas introuvable :', error)
    return { default: () => null }
  }),
)

// three r171 exige WebGL 2 : sans lui, R3F jetterait une erreur que React loguerait.
// Une seule sonde par page, sur un canvas jetable dont le contexte est libéré aussitôt.
let webgl2 = null
function aWebGL2() {
  if (webgl2 === null) {
    try {
      const gl = document.createElement('canvas').getContext('webgl2')
      webgl2 = Boolean(gl)
      gl?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      webgl2 = false
    }
  }
  return webgl2
}

// Barrière discrète : un canvas qui jette laisse la section sans 3D, avec un avertissement.
class Barriere extends React.Component {
  constructor(props) {
    super(props)
    this.state = { echec: false }
  }

  static getDerivedStateFromError() {
    return { echec: true }
  }

  componentDidCatch(error) {
    avertir('canvas désactivé :', error)
  }

  render() {
    return this.state.echec ? null : this.props.children
  }
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

// Affiche à la place de la 3D : une image (URL) ou un élément fourni.
function Affiche({ poster, visible }) {
  return (
    <div className="cinematic__poster" data-visible={visible ? 'true' : 'false'}>
      {typeof poster === 'string' ? <img src={poster} alt="" decoding="async" loading="lazy" /> : poster}
    </div>
  )
}

export default function CinematicSection({
  id,
  track = '300svh',
  shots,
  children,
  still,
  onProgress,
  preload,
  stage,
  stageProps,
  animated = false,
  depthOfField = false,
  shadows = false,
  effects,
  poster,
  className,
  style,
  ...attributs
}) {
  const ref = React.useRef(null)
  const pinRef = React.useRef(null)
  // Sans IntersectionObserver, la section se tient pour visible (rendu à la demande).
  const sansObservateur = typeof IntersectionObserver === 'undefined'
  // Partagé avec le canvas : la progression, la visibilité, et invalidate() quand il est monté.
  const timeline = React.useRef({ p: 0, visible: sansObservateur, invalidate: null })
  const onProgressRef = React.useRef(onProgress)
  onProgressRef.current = onProgress
  const [pret, setPret] = React.useState(false)
  const [proche, setProche] = React.useState(false)
  const [visible, setVisible] = React.useState(sansObservateur)
  // Le canvas a dessiné une image, scène chargée : l'affiche peut partir.
  const [dessine, setDessine] = React.useState(false)
  // Copie de `proche` lue au scroll : setProche ne part que sur un vrai changement. Un
  // setState sans effet n'est pas gratuit, React garde la mise à jour en file jusqu'au
  // prochain rendu ; sur une section lointaine, elles s'empileraient à chaque scroll.
  const procheRef = React.useRef(false)
  const reduit = useReducedMotion()

  // Rien avant load et le créneau d'inactivité qui suit : le LCP reste le texte.
  React.useEffect(
    () =>
      afterLoad(() => {
        if (aWebGL2()) setPret(true)
        else avertir('section sans 3D : pas de WebGL 2')
      }),
    [],
  )

  React.useEffect(() => {
    let signale = null
    const mesurer = () => {
      const el = ref.current
      if (!el) return
      const haut = getOffsetTop(el)
      const bas = getOffsetBottom(el)
      const y = getScrollTop()
      const vh = getViewportHeight()
      // 0 quand le haut de la piste touche le haut de l'écran, 1 quand son bas touche le bas.
      const p = clamp01((y - haut) / Math.max(1, bas - haut - vh))
      const t = timeline.current
      if (p !== t.p) {
        t.p = p
        t.invalidate?.()
      }
      if (p !== signale) {
        signale = p
        onProgressRef.current?.(p)
      }
      // Écart entre l'écran [y, y + vh] et la piste [haut, bas], nul quand ils se recouvrent.
      const ecart = Math.max(haut - (y + vh), y - bas, 0)
      const vise = ecart < (procheRef.current ? DEMONTAGE : MONTAGE) * vh
      if (vise !== procheRef.current) {
        procheRef.current = vise
        setProche(vise)
      }
    }
    mesurer()
    return onScroll(mesurer)
  }, [])

  // Visibilité de l'enfant collant : elle choisit la boucle de rendu du canvas, et la scène
  // la lit dans timeline.current.visible.
  React.useEffect(() => {
    const pin = pinRef.current
    if (!pin || typeof IntersectionObserver === 'undefined') return undefined
    const observateur = new IntersectionObserver(
      (entrees) => {
        const v = entrees[entrees.length - 1].isIntersecting
        timeline.current.visible = v
        setVisible(v)
      },
      { root: getScrollContainer(), rootMargin: MARGE_VISIBLE },
    )
    observateur.observe(pin)
    return () => observateur.disconnect()
  }, [])

  return (
    <section
      {...attributs}
      ref={ref}
      id={id}
      className={className ? `cinematic ${className}` : 'cinematic'}
      style={{ ...style, height: track }}
    >
      <div className="cinematic__pin" ref={pinRef}>
        <div className="cinematic__canvas" aria-hidden="true">
          <Barriere>
            {pret && proche && (
              <React.Suspense fallback={null}>
                <CinematicCanvas
                  shots={shots}
                  still={still}
                  reduced={reduit}
                  visible={visible}
                  animated={animated}
                  timeline={timeline}
                  preload={preload}
                  stage={stage}
                  stageProps={stageProps}
                  depthOfField={depthOfField}
                  shadows={shadows}
                  effects={effects}
                  onDrawn={setDessine}
                />
              </React.Suspense>
            )}
          </Barriere>
          {poster != null && <Affiche poster={poster} visible={!dessine} />}
        </div>
        <div className="cinematic__content">{children}</div>
      </div>
    </section>
  )
}
