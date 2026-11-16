import { OXIDATION_RAMP, accentForProgress } from '../src/lib/ramp.js'

test('la rampe va du chrome a la mousse', () => {
  expect(OXIDATION_RAMP).toHaveLength(8)
  expect(OXIDATION_RAMP[0].hex).toBe('#D6D9DC')
  expect(OXIDATION_RAMP.at(-1).hex).toBe('#3A4A3C')
  expect(OXIDATION_RAMP.map(s => s.stop)).toEqual([...OXIDATION_RAMP.map(s => s.stop)].sort((a, b) => a - b))
})

test('les arrets sont equidistants de 0 a 1', () => {
  OXIDATION_RAMP.forEach((s, i) => expect(s.stop).toBeCloseTo(i / 7, 10))
})

test('les deux intermediaires sont la moyenne de leurs voisins', () => {
  const byName = Object.fromEntries(OXIDATION_RAMP.map(s => [s.name, s.hex]))
  expect(byName.acier).toBe('#8A8F98')
  expect(byName.cuivre).toBe('#B87333')
  expect(byName.rouille).toBe('#8C3A1E')
  expect(byName.verdigris).toBe('#2F6E63')
  expect(OXIDATION_RAMP.map(s => s.hex)).toContain('#A18166')
  expect(OXIDATION_RAMP.map(s => s.hex)).toContain('#5E5441')
})

test('les bornes rendent les couleurs extremes', () => {
  expect(accentForProgress(0)).toBe('#D6D9DC')
  expect(accentForProgress(1)).toBe('#3A4A3C')
})

test('hors bornes, on borne au lieu de casser', () => {
  expect(accentForProgress(-3)).toBe('#D6D9DC')
  expect(accentForProgress(42)).toBe('#3A4A3C')
  expect(accentForProgress(NaN)).toBe('#D6D9DC')
})

test('le milieu interpole entre deux arrets', () => {
  const mid = accentForProgress(0.5)
  expect(mid).toMatch(/^#[0-9A-F]{6}$/)
  expect(OXIDATION_RAMP.map(s => s.hex)).not.toContain(mid)
})

test('chaque arret rend exactement sa couleur', () => {
  OXIDATION_RAMP.forEach(s => expect(accentForProgress(s.stop)).toBe(s.hex))
})
