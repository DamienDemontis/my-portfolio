import { render } from '@testing-library/react'
import i18next from 'i18next'
import '../src/i18n/index.js'
import { ScenesTrack } from '../src/components/ScenesTrack.jsx'
import { SCENES } from '../src/content/scenes.js'

beforeAll(async () => {
  await i18next.changeLanguage('fr')
})

test('huit sections de scene dans l ordre du manifeste', () => {
  const { container } = render(<ScenesTrack />)
  const sections = [...container.querySelectorAll('section[data-scene]')]
  expect(sections.map(s => s.dataset.scene)).toEqual(SCENES.map(s => s.id))
})

test('chaque section est reliee a son h2 par aria-labelledby', () => {
  const { container } = render(<ScenesTrack />)
  for (const s of container.querySelectorAll('section[data-scene]')) {
    const h2 = s.querySelector('h2')
    expect(h2).not.toBeNull()
    expect(h2.id).toBe(`scene-${s.dataset.scene}-title`)
    expect(s.getAttribute('aria-labelledby')).toBe(h2.id)
    expect(s.id).toBe(`scene-${s.dataset.scene}`)
    expect(h2.textContent.trim()).not.toBe('')
  }
})
