import { SCENES } from '../src/content/scenes.js'
import fr from '../src/i18n/locales/fr.json'
import en from '../src/i18n/locales/en.json'
import ko from '../src/i18n/locales/ko.json'

const LOCALES = { fr, en, ko }

test('huit scenes, identifiants uniques, progression croissante', () => {
  expect(SCENES).toHaveLength(8)
  expect(new Set(SCENES.map(s => s.id)).size).toBe(8)
  expect(SCENES.map(s => s.progress)).toEqual([...SCENES.map(s => s.progress)].sort((a, b) => a - b))
  expect(SCENES.map(s => s.id)).toEqual([
    'ouverture', 'metier', 'construire', 'musique', 'coree', 'vivant', 'transmission', 'sortie',
  ])
})

test.each(Object.entries(LOCALES))('%s : chaque scene a son titre et son corps', (nom, locale) => {
  for (const s of SCENES) {
    expect(locale.scenes?.[s.id]?.title, `${nom}/${s.id}/title`).toBeTruthy()
    expect(locale.scenes?.[s.id]?.body, `${nom}/${s.id}/body`).toBeTruthy()
  }
})

test.each(Object.entries(LOCALES))('%s : le budget de 150 mots est tenu', (nom, locale) => {
  for (const s of SCENES) {
    const mots = locale.scenes[s.id].body.trim().split(/\s+/).length
    expect(mots, `${nom}/${s.id} : ${mots} mots`).toBeGreaterThanOrEqual(120)
    expect(mots, `${nom}/${s.id} : ${mots} mots`).toBeLessThanOrEqual(180)
  }
})

// En attente : Damien doit dire si la locale coreenne du site precedent etait ecrite par un humain.
test.skip('le coreen n est plus un doublon de l anglais (attend la reponse de Damien sur le coreen)', () => {
  for (const s of SCENES) expect(ko.scenes[s.id].body.startsWith('[KO]')).toBe(false)
})
