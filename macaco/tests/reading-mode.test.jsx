import { render, screen } from '@testing-library/react'
import { ReadingMode } from '../src/components/ReadingMode.jsx'

test('les huit scenes sont rendues dans l ordre', () => {
  render(<ReadingMode lang="fr" />)
  const titres = screen.getAllByRole('heading', { level: 2 })
  expect(titres).toHaveLength(8)
  expect(titres[0].textContent).toBeTruthy()
})

test('la scene coreenne porte son attribut lang', () => {
  const { container } = render(<ReadingMode lang="fr" />)
  const coree = container.querySelector('[data-scene="coree"]')
  expect(coree.getAttribute('lang')).toBe('ko')
  expect(coree.querySelector('p').getAttribute('lang')).toBe('fr')
  expect(container.querySelectorAll('[lang="ko"]')).toHaveLength(1)
})

// Review Focus 4
test('le mode lecture ne depend d aucune animation', () => {
  const { container } = render(<ReadingMode lang="fr" />)
  expect(container.querySelector('canvas')).toBeNull()
  expect(container.textContent.split(/\s+/).length).toBeGreaterThan(900)
})

test('le mode lecture a un seul h1 : le nom', () => {
  const { container } = render(<ReadingMode lang="fr" />)
  const h1 = container.querySelectorAll('h1')
  expect(h1).toHaveLength(1)
  expect(h1[0].textContent).toBe('Damien Demontis')
})
