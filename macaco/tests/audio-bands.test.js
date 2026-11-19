import { bandEnergy, smoothBands, detectKick, createKickState, KICK_GAP } from '../src/three/music/audioBands.js'

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

// ——— Indépendance de la cadence : 60 et 144 images par seconde ———

// Fait tourner l'analyse sur `duree` secondes à `fps` images/s : `brut(t)` donne les bandes
// brutes de l'image à l'instant t (fin de l'intervalle de l'image). Rend les valeurs lissées
// relevées aux instants `releves` (communs aux deux cadences) et les instants des coups.
function simuler(fps, duree, brut, releves = []) {
  const dt = 1 / fps
  let lisses = { bass: 0, mid: 0, high: 0 }
  let kick = createKickState()
  const vus = new Map()
  const coups = []
  for (let i = 1; i <= Math.round(duree * fps); i++) {
    const t = i / fps
    lisses = smoothBands(lisses, brut(t), dt)
    const r = detectKick(kick, lisses.bass, dt)
    kick = r.state
    if (r.kick) coups.push(t)
    for (const tr of releves) if (Math.abs(t - tr) < 1e-9) vus.set(tr, lisses)
  }
  return { vus, coups }
}
const aUnPourCentPres = (a, b) => Math.abs(a - b) <= 0.01 * Math.max(Math.abs(a), Math.abs(b)) + 1e-9

test('smoothBands : même courbe dans le temps à 60 et à 144 images/s (à 1 % près)', () => {
  // un front montant de 0,5 s, puis une retombée d'une seconde, sur les trois bandes
  const brut = (t) => (t <= 0.5 + 1e-9 ? { bass: 1, mid: 0.8, high: 0.6 } : { bass: 0, mid: 0, high: 0 })
  // instants communs aux deux grilles (multiples de 1/12 s)
  const releves = Array.from({ length: 18 }, (_, i) => (i + 1) / 12)
  const a = simuler(60, 1.5, brut, releves).vus
  const b = simuler(144, 1.5, brut, releves).vus
  expect(a.size).toBe(releves.length)
  expect(b.size).toBe(releves.length)
  for (const t of releves) {
    for (const bande of ['bass', 'mid', 'high']) {
      expect(aUnPourCentPres(a.get(t)[bande], b.get(t)[bande]), `${bande} à ${t.toFixed(3)} s`).toBe(true)
    }
  }
})

test('smoothBands : sans dt, le pas du v5 (une image à 60 i/s)', () => {
  const prev = { bass: 0.2, mid: 0.3, high: 0.4 }
  const raw = { bass: 0.9, mid: 0.1, high: 0.7 }
  expect(smoothBands(prev, raw)).toEqual(smoothBands(prev, raw, 1 / 60))
})

test('detectKick : mêmes coups à 60 et à 144 images/s (120 bpm, 4 s)', () => {
  // un coup de grosse caisse toutes les 0,5 s : graves forts 80 ms, faibles le reste du temps
  const brut = (t) => {
    const phase = t % 0.5
    const fort = phase < 0.08 - 1e-9
    return { bass: fort ? 0.9 : 0.1, mid: 0.2, high: 0.1 }
  }
  const a = simuler(60, 4, brut).coups
  const b = simuler(144, 4, brut).coups
  // un coup par temps : 0 ; 0,5 ; … ; 4 s (la dernière image tombe sur le neuvième temps)
  expect(a).toHaveLength(9)
  expect(b).toHaveLength(a.length)
  // au plus une image (à 60 i/s) d'écart
  a.forEach((t, i) => expect(Math.abs(t - b[i])).toBeLessThanOrEqual(1 / 60 + 1e-9))
})

test('detectKick : un front tout juste assez franc à 60 i/s l est aussi à 144 i/s', () => {
  // graves de 0,2 à 0,3 en une image : à 60 i/s le lissé saute de 0,05 (seuil 0,04)
  const brut = (t) => ({ bass: t <= 0.5 + 1e-9 ? 0.2 : 0.3, mid: 0, high: 0 })
  // départ établi à 0,2 : le lissé y est déjà
  for (const fps of [60, 144]) {
    const dt = 1 / fps
    let lisses = { bass: 0.2, mid: 0, high: 0 }
    let kick = { prev: 0.25, since: 1 }
    let coups = 0
    for (let i = 1; i <= fps; i++) {
      lisses = smoothBands(lisses, brut(i / fps), dt)
      // niveau relevé de 0,05 : le seuil de niveau (0,25) est atteint, seul le saut décide
      const r = detectKick(kick, lisses.bass + 0.05, dt)
      kick = r.state
      if (r.kick) coups++
    }
    expect(coups, `${fps} i/s`).toBe(1)
  }
})

test('detectKick : le temps mort se compte en secondes (0,2 s), quelle que soit la cadence', () => {
  expect(KICK_GAP).toBeCloseTo(0.2, 9)
  for (const fps of [60, 144]) {
    const dt = 1 / fps
    let r = detectKick(createKickState(), 0.9, dt)
    expect(r.kick).toBe(true)
    let s = r.state
    let prochain = null
    for (let i = 1; i <= fps; i++) {
      // un front franc à chaque image : seul le temps mort retient le coup
      r = detectKick({ ...s, prev: 0 }, 0.9, dt)
      s = r.state
      if (r.kick) {
        prochain = i * dt
        break
      }
    }
    expect(prochain, `${fps} i/s`).toBeGreaterThanOrEqual(0.2 - 1e-9)
    expect(prochain, `${fps} i/s`).toBeLessThan(0.2 + dt + 1e-9)
  }
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
