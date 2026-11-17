// Couche du personnage : un canvas fixe derrière les huit sections de scène.
// Module léger, chargé avec la page : il attend la fin du chargement (afterLoad)
// pour que le LCP reste le texte, vérifie que WebGL 2 est disponible et que le GLB
// est servi, puis importe en paresseux le module du canvas (three, fiber, drei).
// Un échec ne casse jamais la page et ne laisse qu'un avertissement : les échecs
// prévisibles sont écartés sans rien jeter, car React logue en console.error toute
// erreur qu'une barrière intercepte.
import React from 'react'
import { afterLoad } from '../lib/afterLoad.js'
import '../styles/character.css'

export const CHARACTER_GLB = '/character/damien.glb'

const avertir = (message, ...detail) => console.warn(`[personnage] ${message}`, ...detail)

// Un module de canvas introuvable (déploiement remplacé, réseau coupé) rend une couche vide.
const CharacterCanvas = React.lazy(() =>
  import('./CharacterCanvas.jsx').catch((error) => {
    avertir('module du canvas introuvable :', error)
    return { default: () => null }
  }),
)

// WebGL 2 est-il disponible ? three r171 n'accepte plus WebGL 1 : sans WebGL 2, le canvas
// de R3F jetterait une erreur que React loguerait. La sonde passe avant toute requête,
// sur un canvas jetable dont le contexte est libéré aussitôt (leur nombre est limité).
function webgl2Disponible() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

// Le GLB est-il servi ? Un hôte statique (Vercel, vite preview) répond 200 avec la page
// HTML de l'application pour un fichier absent : ce type-là compte comme un échec.
async function glbServi() {
  const r = await fetch(CHARACTER_GLB, { method: 'HEAD' })
  const type = r.headers.get('content-type') ?? ''
  if (!r.ok || type.startsWith('text/html')) {
    throw new Error(`${CHARACTER_GLB} non servi (${r.status}, ${type || 'sans type'})`)
  }
}

/** Barrière d'erreur discrète : si un enfant jette, rien n'est rendu et un seul avertissement est logué. */
export class QuietBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  // Dernier filet (fichier servi mais illisible, contexte refusé malgré la sonde) : React logue aussi l'erreur.
  componentDidCatch(error) {
    avertir('canvas désactivé :', error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function CharacterLayer() {
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    let vivant = true
    // La sonde et la requête HEAD partent après load, comme tout le reste du personnage.
    const annuler = afterLoad(() => {
      if (!webgl2Disponible()) {
        avertir('personnage désactivé : WebGL 2 indisponible')
        return
      }
      glbServi().then(
        () => vivant && setReady(true),
        (error) => vivant && avertir('personnage désactivé :', error),
      )
    })
    return () => {
      vivant = false
      annuler()
    }
  }, [])
  if (!ready) return null
  return (
    <QuietBoundary>
      <div className="character-layer" aria-hidden="true">
        <React.Suspense fallback={null}>
          <CharacterCanvas />
        </React.Suspense>
      </div>
    </QuietBoundary>
  )
}
