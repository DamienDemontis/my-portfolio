import { act, render, waitFor } from '@testing-library/react'

// Le chunk du canvas ne se charge pas (déploiement remplacé, réseau coupé) :
// l'import paresseux échoue, la couche reste vide avec un seul avertissement.
vi.mock('../src/three/CharacterCanvas.jsx', () => {
  throw new Error('chunk introuvable')
})

import CharacterLayer from '../src/three/CharacterLayer.jsx'

afterEach(() => {
  vi.restoreAllMocks()
  delete document.readyState
})

test('CharacterLayer reste muet quand le module du canvas ne se charge pas', async () => {
  Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' })
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const error = vi.spyOn(console, 'error')
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({ ok: true, status: 200, headers: { get: () => 'model/gltf-binary' } }),
    ),
  )

  const { container } = render(<CharacterLayer />)
  act(() => {
    window.dispatchEvent(new Event('load'))
  })
  await waitFor(() => expect(warn).toHaveBeenCalledTimes(1))
  // Laisse React finir le rendu de la couche vide.
  await act(async () => {})

  expect(container.querySelector('canvas')).toBeNull()
  expect(container.querySelector('.character-layer')?.innerHTML ?? '').toBe('')
  expect(error).not.toHaveBeenCalled()
  expect(warn).toHaveBeenCalledTimes(1)
  expect(warn.mock.calls[0][0]).toContain('module du canvas')
})
