import { act, render } from '@testing-library/react'

// Le canvas réel demande WebGL : Canvas et PerformanceMonitor sont remplacés par des
// faux qui relèvent leurs props (frameloop, onDecline). Le personnage n'est jamais rendu.
const vu = vi.hoisted(() => ({ canvas: null, onDecline: null }))
vi.mock('@react-three/fiber', async () => {
  const React = await import('react')
  return {
    Canvas: ({ children, ...props }) => {
      vu.canvas = props
      return React.createElement(React.Fragment, null, children)
    },
    useFrame: () => {},
    useThree: () => () => {},
  }
})
vi.mock('@react-three/drei', () => ({
  PerformanceMonitor: ({ onDecline }) => {
    vu.onDecline = onDecline
    return null
  },
  useGLTF: () => ({}),
}))

import CharacterCanvas from '../src/three/CharacterCanvas.jsx'

const REDUIT = '(prefers-reduced-motion: reduce)'
const TACTILE = '(pointer: coarse)'

// matchMedia piloté : chaque requête suit `etat`, basculer() prévient ses écouteurs.
function medias(etat) {
  const ecouteurs = new Map()
  vi.stubGlobal('matchMedia', (q) => ({
    media: q,
    get matches() {
      return Boolean(etat[q])
    },
    addEventListener: (_, f) => ecouteurs.set(f, q),
    removeEventListener: (_, f) => ecouteurs.delete(f),
  }))
  return (q, valeur) => {
    etat[q] = valeur
    for (const [f, requete] of ecouteurs) if (requete === q) f()
  }
}

afterEach(() => {
  vu.canvas = null
  vu.onDecline = null
})

describe('CharacterCanvas', () => {
  test('pointeur fin : rendu continu, figé quand les performances baissent', () => {
    medias({})
    render(<CharacterCanvas />)
    expect(vu.canvas.frameloop).toBe('always')
    act(() => vu.onDecline())
    expect(vu.canvas.frameloop).toBe('demand')
  })

  // Ruling R10 : sur écran tactile, rendu à la demande.
  test('pointeur grossier : rendu à la demande', () => {
    medias({ [TACTILE]: true })
    render(<CharacterCanvas />)
    expect(vu.canvas.frameloop).toBe('demand')
  })

  // m26 : en mode demand, le moniteur voit peu d'images et déclinerait à tort ; un gel
  // accepté là resterait pour toujours, même une fois le mouvement réduit désactivé.
  test('un déclin en mode demand ne fige rien', () => {
    const basculer = medias({ [REDUIT]: true })
    render(<CharacterCanvas />)
    expect(vu.canvas.frameloop).toBe('demand')
    act(() => vu.onDecline())
    act(() => basculer(REDUIT, false))
    expect(vu.canvas.frameloop).toBe('always')
  })
})
