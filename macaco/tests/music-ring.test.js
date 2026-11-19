// L'anneau de la salle d'écoute : il suit la musique quand elle joue, respire sans elle, se fige
// sous mouvement réduit ; les ondes au sol naissent sur les coups et s'éteignent.
import { RIPPLES, RIPPLE_LIFE, idleBands, ringBands, rippleLook, stepRipples } from '../src/three/music/ring.js'

const MUSIQUE = { bass: 0.8, mid: 0.4, high: 0.2, kick: true, playing: true }
const SILENCE = { bass: 0, mid: 0, high: 0, kick: false, playing: false }

test('the ring follows the music when it plays', () => {
  expect(ringBands(MUSIQUE, 3, true)).toEqual({ bass: 0.8, mid: 0.4, high: 0.2 })
})

test('without music the ring breathes, gently', () => {
  const a = ringBands(SILENCE, 0.5, true)
  const b = ringBands(SILENCE, 2.5, true)
  expect(a).toEqual(idleBands(0.5))
  expect(a.bass).not.toBeCloseTo(b.bass, 6)
  for (const t of [0, 1, 2, 3, 4, 5, 6, 7]) {
    const r = idleBands(t)
    for (const v of Object.values(r)) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(0.15)
    }
  }
  expect(ringBands(undefined, 1, true)).toEqual(idleBands(1))
})

test('under reduced motion the ring does not move, music or not', () => {
  expect(ringBands(MUSIQUE, 3, false)).toEqual({ bass: 0, mid: 0, high: 0 })
  expect(ringBands(SILENCE, 3, false)).toEqual({ bass: 0, mid: 0, high: 0 })
})

test('a kick launches a ripple that grows and fades out', () => {
  let ages = Array(RIPPLES).fill(Infinity)
  ages = stepRipples(ages, true, 0.016)
  expect(ages.filter(Number.isFinite)).toEqual([0])
  const debut = rippleLook(0)
  const milieu = rippleLook(RIPPLE_LIFE / 2)
  expect(milieu.scale).toBeGreaterThan(debut.scale)
  expect(milieu.opacity).toBeLessThan(debut.opacity)
  for (let i = 0; i < 100; i++) ages = stepRipples(ages, false, 0.02)
  expect(ages.every((a) => !Number.isFinite(a))).toBe(true)
  expect(rippleLook(Infinity).opacity).toBe(0)
})

test('more kicks than ripples recycle the oldest', () => {
  let ages = Array(RIPPLES).fill(Infinity)
  for (let i = 0; i < RIPPLES; i++) ages = stepRipples(ages, true, 0.1)
  expect(ages.every(Number.isFinite)).toBe(true)
  const plusVieille = ages.indexOf(Math.max(...ages))
  ages = stepRipples(ages, true, 0.1)
  expect(ages[plusVieille]).toBe(0)
  expect(ages.filter((a) => a === 0)).toHaveLength(1)
})
