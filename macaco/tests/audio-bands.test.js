import { bandEnergy, smoothBands, detectKick, createKickState } from '../src/three/music/audioBands.js'

test('bandEnergy : moyenne normalisee sur [from, to[', () => {
  const data = new Uint8Array(8).fill(255)
  expect(bandEnergy(data, 0, 4)).toBe(1)
  expect(bandEnergy(new Uint8Array(8), 0, 4)).toBe(0)
  const d = new Uint8Array([0, 255, 0, 255, 100, 100, 100, 100])
  expect(bandEnergy(d, 0, 4)).toBeCloseTo(0.5, 5)
  expect(bandEnergy(d, 6, 20)).toBeCloseTo(100 / 255, 5) // borne tronquee a la taille des donnees
})

test('smoothBands : attaque rapide, retombee lente, par bande', () => {
  const up = smoothBands({ bass: 0, mid: 0, high: 0 }, { bass: 1, mid: 1, high: 1 })
  expect(up.bass).toBeCloseTo(0.5, 5)
  expect(up.mid).toBeCloseTo(0.25, 5)
  expect(up.high).toBeCloseTo(0.55, 5)
  const down = smoothBands({ bass: 1, mid: 1, high: 1 }, { bass: 0, mid: 0, high: 0 })
  expect(down.bass).toBeCloseTo(0.94, 5)
  expect(down.mid).toBeCloseTo(0.96, 5)
  expect(down.high).toBeCloseTo(0.88, 5)
})

test('detectKick : un coup, puis temps mort de 12 images', () => {
  let s = createKickState()
  let r = detectKick(s, 0.1); s = r.state
  expect(r.kick).toBe(false)
  r = detectKick(s, 0.4); s = r.state // saut 0.3, niveau >= 0.25
  expect(r.kick).toBe(true)
  let kicks = 0
  for (let i = 0; i < 11; i++) { r = detectKick(s, i % 2 ? 0.3 : 0.6); s = r.state; if (r.kick) kicks++ }
  expect(kicks).toBe(0) // temps mort : 11 images, aucun coup malgre la hausse
  r = detectKick(s, 0.95); s = r.state // 12e image apres le coup
  expect(r.kick).toBe(true)
})

test('detectKick : pas de coup sous le seuil ou sans saut', () => {
  let s = createKickState()
  let r = detectKick(s, 0.2); s = r.state
  expect(r.kick).toBe(false) // saut ok, niveau insuffisant
  r = detectKick({ prev: 0.5, since: 99 }, 0.52)
  expect(r.kick).toBe(false) // niveau ok, saut < 0.04
  r = detectKick({ prev: 0.2, since: 99 }, 0.3)
  expect(r.kick).toBe(true)
})
