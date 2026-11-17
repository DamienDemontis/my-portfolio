// @vitest-environment node
import { EMPLOI, contientEmploi } from './helpers/forbidden.js'

test.each([
  'ouvert à de nouvelles opportunités',
  'open to new opportunities',
  'looking for my next role',
  "à l'écoute du marché",
  'en recherche active',
  'Je cherche un nouveau défi',
  'Available now',
  'disponible dès janvier',
  'open to work',
  '구직 중',
  '이직 준비',
  '채용 정보',
  '취업',
  'my next challenge',
  'nouveaux défis',
])('« %s » est attrape', phrase => {
  expect(contientEmploi(phrase), phrase).toBe(true)
})

test('une phrase neutre passe', () => {
  expect(contientEmploi('Lead developer building health-tech platforms')).toBe(false)
  expect(EMPLOI.test('Freelance 3D developer')).toBe(false)
})

// Tout le contenu localise passe le meme garde.
import { readFileSync } from 'node:fs'
test('les trois locales passent le garde emploi', () => {
  for (const l of ['fr', 'en', 'ko']) {
    const t = readFileSync(new URL(`../src/i18n/locales/${l}.json`, import.meta.url), 'utf8')
    expect(contientEmploi(t), l).toBe(false)
  }
})
