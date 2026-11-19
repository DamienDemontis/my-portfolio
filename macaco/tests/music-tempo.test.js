// Le suivi du tempo : `listen_beat` est écrit à 112,5 bpm ; la scène accélère ou ralentit le
// clip sur le tempo des coups de grosse caisse, et le recale sur un temps fort quand il dérive.
import { CLIP_BEAT, CLIP_BPM, CLIP_LENGTH, createTempoState, suivreTempo } from '../src/three/music/tempo.js'

const IMAGE = 1 / 60

// Fait tourner le suivi image par image pendant `duree` secondes, depuis `depart`, avec un coup
// toutes les `periode` secondes (aucun si periode est nulle). Renvoie le dernier résultat.
function simuler(etat, { depart = 0, duree, periode = 0, clip = () => 0 }) {
  let r = null
  let prochain = depart + (periode || Infinity)
  const n = Math.round(duree / IMAGE)
  for (let i = 1; i <= n; i++) {
    const t = depart + i * IMAGE
    const coup = periode > 0 && t >= prochain - 1e-9
    if (coup) prochain += periode
    r = suivreTempo(etat, coup, t, clip(t))
  }
  return r
}

test('the clip is written at 112.5 bpm, two beats per loop', () => {
  expect(CLIP_BPM).toBeCloseTo(112.5, 6)
  expect(CLIP_BEAT).toBeCloseTo(16 / 30, 9)
  expect(CLIP_LENGTH).toBeCloseTo(32 / 30, 9)
})

test('without kicks the clip keeps its own tempo', () => {
  const etat = createTempoState()
  const r = simuler(etat, { duree: 3 })
  expect(r.timeScale).toBe(1)
  expect(r.recaler).toBeNull()
  expect(r.etat).toBe(etat)
})

test('the clip follows the tempo of the kicks, smoothly', () => {
  const etat = createTempoState()
  // 120 bpm : un coup toutes les 0,5 s
  const debut = simuler(etat, { duree: 1.6, periode: 0.5 })
  expect(debut.timeScale).toBeGreaterThan(1)
  expect(debut.timeScale).toBeLessThan(120 / 112.5) // lissé : pas d'un coup
  const r = simuler(etat, { depart: 1.6, duree: 6, periode: 0.5 })
  expect(r.timeScale).toBeCloseTo(120 / 112.5, 2)
  // le morceau passe à 150 bpm : la moyenne des 4 derniers intervalles suit
  const r2 = simuler(etat, { depart: 7.6, duree: 6, periode: 0.4 })
  expect(r2.timeScale).toBeCloseTo(150 / 112.5, 2)
  // 90 bpm
  const r3 = simuler(etat, { depart: 13.6, duree: 8, periode: 60 / 90 })
  expect(r3.timeScale).toBeCloseTo(90 / 112.5, 2)
})

test('intervals outside 70-180 bpm are ignored, and the scale stays within [0.6, 1.6]', () => {
  const lent = createTempoState()
  expect(simuler(lent, { duree: 8, periode: 1.2 }).timeScale).toBe(1)
  const serre = createTempoState()
  expect(simuler(serre, { duree: 8, periode: 0.25 }).timeScale).toBe(1)
  const bord = createTempoState()
  const r = simuler(bord, { duree: 10, periode: 0.335 })
  expect(r.timeScale).toBeLessThanOrEqual(1.6)
  expect(r.timeScale).toBeGreaterThan(1.5)
  const bas = createTempoState()
  const r2 = simuler(bas, { duree: 12, periode: 0.85 })
  expect(r2.timeScale).toBeGreaterThanOrEqual(0.6)
  expect(r2.timeScale).toBeLessThan(0.65)
})

test('after two seconds without a kick the clip drifts back to its own tempo', () => {
  const etat = createTempoState()
  simuler(etat, { duree: 8, periode: 0.4 })
  const juste = simuler(etat, { depart: 8, duree: 1.5 })
  expect(juste.timeScale).toBeCloseTo(150 / 112.5, 2) // pas encore
  const pendant = simuler(etat, { depart: 9.5, duree: 1 })
  expect(pendant.timeScale).toBeGreaterThan(1.02)
  expect(pendant.timeScale).toBeLessThan(150 / 112.5 - 0.02) // progressif
  const apres = simuler(etat, { depart: 10.5, duree: 5 })
  expect(apres.timeScale).toBeCloseTo(1, 2)
})

test('on a kick far from a strong beat, the clip is pulled back onto the nearest one', () => {
  const sur = (t) => suivreTempo(createTempoState(), true, 10, t).recaler
  const temps = 16 / 30
  expect(sur(0.03)).toBeNull() // à moins de 0,08 s de 0
  expect(sur(temps + 0.07)).toBeNull()
  expect(sur(temps - 0.05)).toBeNull()
  expect(sur(0.2)).toBeCloseTo(0, 9) // plus près de 0 que de 16/30
  expect(sur(0.3)).toBeCloseTo(temps, 9)
  expect(sur(temps + 0.2)).toBeCloseTo(temps, 9)
  expect(sur(CLIP_LENGTH - 0.1)).toBeCloseTo(0, 9) // la fin de boucle revient au début
  // sans coup, on ne touche à rien
  expect(suivreTempo(createTempoState(), false, 10, 0.3).recaler).toBeNull()
})

test('the result object can be reused frame after frame', () => {
  const etat = createTempoState()
  const sortie = {}
  expect(suivreTempo(etat, false, 0, 0, sortie)).toBe(sortie)
  expect(sortie).toEqual({ etat, timeScale: 1, recaler: null })
})
