import { render } from '@testing-library/react'
import { App } from '../src/App.jsx'

// Le mode lecture ne doit afficher aucun loader ni overlay de transition.
test.each(['/fr/?lecture=1', '/en?lecture=1'])('%s : lisible des le premier rendu, sans canvas', (url) => {
  window.history.pushState({}, '', url)
  const { container } = render(<App />)
  expect(container.querySelectorAll('article[data-scene] h2')).toHaveLength(8)
  expect(container.querySelector('canvas')).toBeNull()
  expect(document.body.querySelector('canvas')).toBeNull()
  expect(document.documentElement.classList.contains('is-reading')).toBe(true)
})

// Racine : la requete ?lecture=1 survit a la redirection de langue.
test.each(['/?lecture=1', '/?lecture=1#lecture'])('%s : la racine garde le mode lecture', (url) => {
  window.history.pushState({}, '', url)
  const { container } = render(<App />)
  expect(container.querySelectorAll('article[data-scene] h2')).toHaveLength(8)
  expect(document.documentElement.classList.contains('is-reading')).toBe(true)
  expect(window.location.search).toBe('?lecture=1')
})
