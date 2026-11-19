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
//   shots                  timeline de plans (voir shots.js)
//   still                  plan fixe sous prefers-reduced-motion (plan, ou progression) ;
//                          par défaut le plan de p = 0.5
//   onProgress(p)          appelé quand la progression change
//   preload                URL des modèles du décor, préchargés au montage du canvas
//   stage                  composant 3D rendu dans le canvas (idéalement React.lazy), qui
//                          reçoit { timeline, policy } : timeline.current.p est la progression
//   depthOfField = false   profondeur de champ pilotée par le focus des plans : true ou
//                          { focusRange, bokehScale }
import React from 'react'
import { afterLoad } from '../../lib/afterLoad.js'
import { getOffsetBottom, getOffsetTop, getScrollTop, getViewportHeight, onScroll } from '../../lib/scroll.js'
import '../../styles/cinematic.css'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
// Montage à moins d'un écran ; démontage au-delà d'un écran et demi, pour ne pas recréer
// le contexte WebGL à chaque aller-retour autour de la limite.
const MONTAGE = 1
const DEMONTAGE = 1.5

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

export default function CinematicSection({
  id,
  track = '300svh',
  shots,
  children,
  still,
  onProgress,
  preload,
  stage,
  depthOfField = false,
}) {
  const ref = React.useRef(null)
  // Partagé avec le canvas : la progression, et son invalidate() quand il est monté.
  const timeline = React.useRef({ p: 0, invalidate: null })
  const onProgressRef = React.useRef(onProgress)
  onProgressRef.current = onProgress
  const [pret, setPret] = React.useState(false)
  const [proche, setProche] = React.useState(false)
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
      setProche((avant) => ecart < (avant ? DEMONTAGE : MONTAGE) * vh)
    }
    mesurer()
    return onScroll(mesurer)
  }, [])

  return (
    <section ref={ref} id={id} className="cinematic" style={{ height: track }}>
      <div className="cinematic__pin">
        <div className="cinematic__canvas" aria-hidden="true">
          <Barriere>
            {pret && proche && (
              <React.Suspense fallback={null}>
                <CinematicCanvas
                  shots={shots}
                  still={still}
                  reduced={reduit}
                  timeline={timeline}
                  preload={preload}
                  stage={stage}
                  depthOfField={depthOfField}
                />
              </React.Suspense>
            )}
          </Barriere>
        </div>
        <div className="cinematic__content">{children}</div>
      </div>
    </section>
  )
}
