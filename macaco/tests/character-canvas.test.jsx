import { act, render, waitFor } from '@testing-library/react'

// Le module du canvas (three, fiber, drei) est remplacé par un faux : on compte
// ses imports pour vérifier qu'il n'est pas chargé avant l'événement load.
const canvasModule = vi.hoisted(() => ({ imports: 0 }))
vi.mock('../src/three/CharacterCanvas.jsx', async () => {
  const React = await import('react')
  canvasModule.imports++
  return {
    default: () => React.createElement('canvas', { 'data-testid': 'character-canvas' }),
  }
})

import CharacterLayer, { QuietBoundary } from '../src/three/CharacterLayer.jsx'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('QuietBoundary', () => {
  test('QuietBoundary renders nothing when its child throws', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // React signale lui-même l'erreur interceptée : on le fait taire.
    vi.spyOn(console, 'error').mockImplementation(() => {})
    function Boom() {
      throw new Error('damien.glb introuvable')
    }
    const { container } = render(
      <QuietBoundary>
        <Boom />
      </QuietBoundary>,
    )
    expect(container.innerHTML).toBe('')
    expect(warn).toHaveBeenCalledTimes(1)
  })

  test('QuietBoundary rend ses enfants tant que rien ne jette', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(
      <QuietBoundary>
        <p>texte</p>
      </QuietBoundary>,
    )
    expect(container.innerHTML).toBe('<p>texte</p>')
    expect(warn).not.toHaveBeenCalled()
  })
})

describe('CharacterLayer', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' })
  })
  afterEach(() => {
    delete document.readyState
  })

  test('CharacterLayer waits for load', async () => {
    const fetchSpy = vi.fn(() => Promise.reject(new Error('pas de réseau en test')))
    vi.stubGlobal('fetch', fetchSpy)

    const { container } = render(<CharacterLayer />)

    // Avant load : rien dans le DOM, module du canvas jamais importé, aucune requête.
    expect(container.innerHTML).toBe('')
    expect(canvasModule.imports).toBe(0)
    const glb = () => fetchSpy.mock.calls.filter(([url]) => String(url).includes('damien.glb'))
    expect(glb()).toHaveLength(0)

    // Après load et le créneau d'inactivité : la couche apparaît et charge le canvas.
    act(() => {
      window.dispatchEvent(new Event('load'))
    })
    await waitFor(() => {
      expect(container.querySelector('[data-testid="character-canvas"]')).not.toBeNull()
    })
    expect(canvasModule.imports).toBe(1)
    const layer = container.querySelector('.character-layer')
    expect(layer).not.toBeNull()
    expect(layer.getAttribute('aria-hidden')).toBe('true')
    expect(layer.contains(container.querySelector('canvas'))).toBe(true)
  })
})
