// Couche du personnage : un canvas fixe derrière les huit sections de scène.
// Module léger, chargé avec la page : il attend la fin du chargement (afterLoad)
// pour que le LCP reste le texte, puis importe en paresseux le module du canvas
// (three, fiber, drei) et le GLB. Un échec du canvas ne casse jamais la page.
import React from 'react'
import { afterLoad } from '../lib/afterLoad.js'
import '../styles/character.css'

const CharacterCanvas = React.lazy(() => import('./CharacterCanvas.jsx'))

/** Barrière d'erreur discrète : si un enfant jette, rien n'est rendu et un seul avertissement est logué. */
export class QuietBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('[personnage] canvas désactivé :', error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function CharacterLayer() {
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => afterLoad(() => setReady(true)), [])
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
