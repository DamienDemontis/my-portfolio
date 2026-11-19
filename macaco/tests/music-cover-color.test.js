// La teinte de la pochette : sa couleur dominante (ni trop sombre ni trop claire), mêlée au
// cuivre en restant lumineuse, atteinte en douceur (en un instant sous mouvement réduit).
import { COVER_MIX, TINT_MIN_LUMINANCE, dominantColor, glideStep, luminance, tintToward } from '../src/three/music/coverColor.js'

const CUIVRE = [1, 138 / 255, 76 / 255]

// Une image RGBA (comme ImageData.data) faite de `n` pixels de chaque couleur donnée.
function image(...parts) {
  const px = []
  for (const [n, [r, g, b, a = 255]] of parts) for (let i = 0; i < n; i++) px.push(r, g, b, a)
  return Uint8ClampedArray.from(px)
}

const proche = (a, b, eps = 1e-6) => a.every((v, i) => Math.abs(v - b[i]) < eps)

test('a single-colour cover gives that colour', () => {
  const c = dominantColor(image([100, [200, 40, 40]]))
  expect(proche(c, [200 / 255, 40 / 255, 40 / 255])).toBe(true)
})

test('too dark, too bright or transparent covers give nothing (the copper stays)', () => {
  expect(dominantColor(image([100, [8, 8, 8]]))).toBeNull()
  expect(dominantColor(image([100, [250, 250, 250]]))).toBeNull()
  expect(dominantColor(image([100, [40, 90, 200, 0]]))).toBeNull()
  expect(dominantColor(new Uint8ClampedArray(0))).toBeNull()
  expect(tintToward(CUIVRE, null)).toEqual(CUIVRE)
})

test('the most frequent colour wins, the dark background does not count', () => {
  const c = dominantColor(image([600, [5, 5, 5]], [250, [30, 70, 190]], [150, [200, 40, 40]]))
  expect(proche(c, [30 / 255, 70 / 255, 190 / 255])).toBe(true)
  // des nuances proches tombent dans le même seau et sont moyennées
  const n = dominantColor(image([50, [33, 70, 190]], [50, [37, 74, 186]], [60, [200, 40, 40]]))
  expect(proche(n, [35 / 255, 72 / 255, 188 / 255])).toBe(true)
})

test('the tint sits between the copper and the cover, closer to the cover', () => {
  const vif = [1, 0.9, 0.2] // plus lumineux que le cuivre : pris tel quel
  const t = tintToward(CUIVRE, vif)
  expect(proche(t, CUIVRE.map((v, i) => v + (vif[i] - v) * COVER_MIX))).toBe(true)
  expect(COVER_MIX).toBeGreaterThan(0.5)
  expect(COVER_MIX).toBeLessThan(0.75)
})

test('a dark cover is lifted: the tint stays bright and keeps its hue', () => {
  const nuit = [0.05, 0.08, 0.3]
  const t = tintToward(CUIVRE, nuit)
  // aussi lumineuse que le plancher, au moins
  expect(luminance(t)).toBeGreaterThanOrEqual(TINT_MIN_LUMINANCE - 1e-9)
  // et tirée vers le bleu de la pochette
  expect(t[2]).toBeGreaterThan(CUIVRE[2] + 0.2)
  expect(t[0]).toBeLessThan(CUIVRE[0])
  for (const v of t) {
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThanOrEqual(1)
  }
  // même un bleu pur, qu'on ne peut pas éclaircir sans le blanchir
  expect(luminance(tintToward(CUIVRE, [0, 0, 1]))).toBeGreaterThanOrEqual(TINT_MIN_LUMINANCE - 1e-9)
})

test('the colour glides in about a second, and jumps under reduced motion', () => {
  expect(glideStep(1 / 60, true)).toBeGreaterThan(0)
  expect(glideStep(1 / 60, true)).toBeLessThan(0.1)
  // en une seconde d'images à 60 i/s, presque tout le chemin est fait
  let reste = 1
  for (let i = 0; i < 60; i++) reste *= 1 - glideStep(1 / 60, true)
  expect(reste).toBeLessThan(0.05)
  expect(reste).toBeGreaterThan(0.001)
  expect(glideStep(1 / 60, false)).toBe(1)
  expect(glideStep(0, true)).toBe(0)
})
