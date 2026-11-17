// Couche du personnage : un canvas fixe derrière les huit sections de scène.
// Module léger, chargé avec la page : il attend la fin du chargement (afterLoad)
// pour que le LCP reste le texte, vérifie que le GLB est servi, puis importe en
// paresseux le module du canvas (three, fiber, drei). Un échec ne casse jamais la
// page et ne laisse qu'un avertissement : les échecs prévisibles sont écartés sans
// rien jeter, car React logue en console.error toute erreur qu'une barrière intercepte.
import React from 'react'
import { afterLoad } from '../lib/afterLoad.js'
import '../styles/character.css'

export const CHARACTER_GLB = '/character/damien.glb'

const avertir = (message, detail) => console.warn(`[personnage] ${message}`, detail)

// Un module de canvas introuvable (déploiement remplacé, réseau coupé) rend une couche vide.
const CharacterCanvas = React.lazy(() =>
  import('./CharacterCanvas.jsx').catch((error) => {
    avertir('module du canvas introuvable :', error)
    return { default: () => null }
  }),
)

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

  // Dernier filet (fichier servi mais illisible, pas de WebGL) : React logue aussi l'erreur.
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
    // La requête HEAD part après load, comme tout le reste du personnage.
    const annuler = afterLoad(() => {
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
