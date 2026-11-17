import { HOLD, sceneBlend, progressAt } from '../src/lib/sceneProgress.js'
import { SCENES } from '../src/content/scenes.js'

// Huit ancres régulières, 100 px d'écart, de 0 à 700.
const ANCHORS = [0, 100, 200, 300, 400, 500, 600, 700]
const LAST = ANCHORS[ANCHORS.length - 1]

test('HOLD vaut un quart de l’intervalle', () => {
  expect(HOLD).toBe(0.25)
})

test('holds the first scene before the first anchor', () => {
  expect(sceneBlend(-500, ANCHORS)).toEqual({ from: 0, to: 0, t: 0 })
  expect(sceneBlend(-1, ANCHORS)).toEqual({ from: 0, to: 0, t: 0 })
})

test('holds the last scene past the last anchor (footer)', () => {
  expect(sceneBlend(LAST + 5000, ANCHORS)).toEqual({ from: 7, to: 7, t: 0 })
  expect(sceneBlend(LAST, ANCHORS)).toEqual({ from: 7, to: 7, t: 0 })
})

test('holds a pose near each anchor', () => {
  // Entre les ancres 0 et 100 : u = 0.2 tient la pose de la scène 0, u = 0.8 celle de la scène 1.
  expect(sceneBlend(20, ANCHORS).t).toBe(0)
  expect(sceneBlend(80, ANCHORS).t).toBe(1)
  expect(sceneBlend(80, ANCHORS)).toEqual({ from: 0, to: 1, t: 1 })
})

test('is monotonic between anchors', () => {
  let previous = -Infinity
  for (let i = 0; i < 50; i++) {
    const center = (LAST * i) / 49
    const { from, t } = sceneBlend(center, ANCHORS)
    const position = from + t
    expect(position).toBeGreaterThanOrEqual(previous)
    previous = position
  }
})

test('is stateless', () => {
  // Saut direct vers l'ancre #scene-coree (index 4), puis retour en arrière et retour au même point.
  const jumpToCoree = sceneBlend(400, ANCHORS)
  sceneBlend(0, ANCHORS)
  sceneBlend(650, ANCHORS)
  expect(sceneBlend(400, ANCHORS)).toEqual(jumpToCoree)
  expect(jumpToCoree).toEqual({ from: 4, to: 5, t: 0 })
})

test('never returns NaN', () => {
  // Pas d'ancres : pose d'ouverture.
  expect(sceneBlend(123, [])).toEqual({ from: 0, to: 0, t: 0 })

  // Deux ancres égales : l'ancre dupliquée est franchie, on tient la scène suivante, sans NaN.
  const equal = [0, 100, 100, 200]
  const atEqual = sceneBlend(100, equal)
  expect(atEqual).toEqual({ from: 2, to: 3, t: 0 })
  for (const v of [atEqual.from, atEqual.to, atEqual.t]) expect(Number.isFinite(v)).toBe(true)

  // Ancres égales en fin de liste : on est arrivé à la dernière scène.
  expect(sceneBlend(100, [0, 100, 100])).toEqual({ from: 2, to: 2, t: 0 })

  // Centre NaN : traité comme 0.
  const fromNaN = sceneBlend(NaN, ANCHORS)
  expect(fromNaN).toEqual(sceneBlend(0, ANCHORS))
  for (const v of [fromNaN.from, fromNaN.to, fromNaN.t]) expect(Number.isFinite(v)).toBe(true)
})

test('progressAt matches the ramp ends', () => {
  expect(progressAt({ from: 0, to: 0, t: 0 })).toBe(0)
  expect(progressAt({ from: 7, to: 7, t: 0 })).toBe(1)
})

test('progressAt interpolates between scene progress values', () => {
  expect(progressAt({ from: 0, to: 1, t: 0.5 })).toBeCloseTo((SCENES[0].progress + SCENES[1].progress) / 2)
  expect(progressAt({ from: 2, to: 3, t: 1 })).toBe(SCENES[3].progress)
})

test('progressAt clamps stray indices and values without NaN', () => {
  expect(progressAt({ from: -3, to: -3, t: 0 })).toBe(0)
  expect(progressAt({ from: 99, to: 99, t: 0 })).toBe(1)
  expect(Number.isFinite(progressAt({ from: NaN, to: undefined, t: NaN }))).toBe(true)
  expect(progressAt({ from: 0, to: 99, t: 2 })).toBe(1)
})
