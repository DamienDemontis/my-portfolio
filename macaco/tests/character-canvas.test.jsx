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

// Réponse minimale à la requête HEAD de vérification du GLB.
const reponse = (status, type) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: (nom) => (nom.toLowerCase() === 'content-type' ? type : null) },
})

// Ordre voulu : le module mocké n'est importé qu'une fois par fichier, donc les cas
// d'échec (qui ne doivent jamais l'importer) passent avant le cas nominal.
describe('CharacterLayer', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' })
  })
  afterEach(() => {
    delete document.readyState
  })

  test('CharacterLayer reste muet quand le GLB est remplacé par la page HTML', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error')
    // Repli SPA de Vercel ou de vite preview : 200 avec la page HTML à la place du fichier.
    const fetchSpy = vi.fn(() => Promise.resolve(reponse(200, 'text/html; charset=utf-8')))
    vi.stubGlobal('fetch', fetchSpy)

    const { container } = render(<CharacterLayer />)
    act(() => {
      window.dispatchEvent(new Event('load'))
    })
    await waitFor(() => expect(warn).toHaveBeenCalledTimes(1))

    expect(fetchSpy).toHaveBeenCalledWith('/character/damien.glb', { method: 'HEAD' })
    expect(container.innerHTML).toBe('')
    expect(canvasModule.imports).toBe(0)
    expect(error).not.toHaveBeenCalled()
  })

  test('CharacterLayer reste muet hors ligne', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error')
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))))

    const { container } = render(<CharacterLayer />)
    act(() => {
      window.dispatchEvent(new Event('load'))
    })
    await waitFor(() => expect(warn).toHaveBeenCalledTimes(1))

    expect(container.innerHTML).toBe('')
    expect(canvasModule.imports).toBe(0)
    expect(error).not.toHaveBeenCalled()
  })

  test('CharacterLayer waits for load', async () => {
    const fetchSpy = vi.fn(() => Promise.resolve(reponse(200, 'model/gltf-binary')))
    vi.stubGlobal('fetch', fetchSpy)

    const { container } = render(<CharacterLayer />)

    // Avant load : rien dans le DOM, module du canvas jamais importé, aucune requête.
    expect(container.innerHTML).toBe('')
    expect(canvasModule.imports).toBe(0)
    const glb = () => fetchSpy.mock.calls.filter(([url]) => String(url).includes('damien.glb'))
    expect(glb()).toHaveLength(0)

    // Après load et le créneau d'inactivité : vérification HEAD du GLB, puis la couche
    // apparaît et charge le canvas.
    act(() => {
      window.dispatchEvent(new Event('load'))
    })
    await waitFor(() => {
      expect(container.querySelector('[data-testid="character-canvas"]')).not.toBeNull()
    })
    expect(glb()).toEqual([['/character/damien.glb', { method: 'HEAD' }]])
    expect(canvasModule.imports).toBe(1)
    const layer = container.querySelector('.character-layer')
    expect(layer).not.toBeNull()
    expect(layer.getAttribute('aria-hidden')).toBe('true')
    expect(layer.contains(container.querySelector('canvas'))).toBe(true)
  })
})
