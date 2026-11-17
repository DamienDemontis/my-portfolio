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

// Sonde WebGL : jsdom n'a pas de WebGL, chaque test choisit les contextes disponibles.
// Un faux contexte suffit, la couche ne fait que le libérer.
const contextes = (...disponibles) =>
  vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation((type) => (disponibles.includes(type) ? { getExtension: () => null } : null))

// Ordre voulu : le module mocké n'est importé qu'une fois par fichier, donc les cas
// d'échec (qui ne doivent jamais l'importer) passent avant le cas nominal.
describe('CharacterLayer', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' })
    contextes('webgl2', 'webgl')
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

  test('CharacterLayer reste muet sur un vrai 404', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error')
    // Hôte qui renvoie un vrai 404 (pas de repli SPA) : ok = false, type sans importance.
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(reponse(404, 'text/plain'))))

    const { container } = render(<CharacterLayer />)
    act(() => {
      window.dispatchEvent(new Event('load'))
    })
    await waitFor(() => expect(warn).toHaveBeenCalledTimes(1))
    await act(async () => {})

    expect(String(warn.mock.calls[0][1])).toContain('404')
    expect(container.innerHTML).toBe('')
    expect(canvasModule.imports).toBe(0)
    expect(error).not.toHaveBeenCalled()
  })

  // Review Focus 2 : sans WebGL, R3F jetterait une erreur que React loguerait en console.error.
  test('CharacterLayer reste muet sans WebGL', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error')
    contextes()
    const fetchSpy = vi.fn(() => Promise.resolve(reponse(200, 'model/gltf-binary')))
    vi.stubGlobal('fetch', fetchSpy)

    const { container } = render(<CharacterLayer />)
    act(() => {
      window.dispatchEvent(new Event('load'))
    })
    await waitFor(() => expect(warn).toHaveBeenCalledTimes(1))
    await act(async () => {})

    expect(warn.mock.calls[0][0]).toContain('WebGL')
    // La sonde passe avant la requête HEAD : rien ne part sur le réseau.
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(container.innerHTML).toBe('')
    expect(canvasModule.imports).toBe(0)
    expect(error).not.toHaveBeenCalled()
  })

  // three r171 n'accepte que WebGL 2 (WebGL 1 abandonné en r163) : WebGL 1 seul vaut absence.
  test('CharacterLayer reste muet avec WebGL 1 seulement', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error')
    contextes('webgl')
    const fetchSpy = vi.fn(() => Promise.resolve(reponse(200, 'model/gltf-binary')))
    vi.stubGlobal('fetch', fetchSpy)

    const { container } = render(<CharacterLayer />)
    act(() => {
      window.dispatchEvent(new Event('load'))
    })
    await waitFor(() => expect(warn).toHaveBeenCalledTimes(1))
    await act(async () => {})

    expect(warn.mock.calls[0][0]).toContain('WebGL')
    expect(fetchSpy).not.toHaveBeenCalled()
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
