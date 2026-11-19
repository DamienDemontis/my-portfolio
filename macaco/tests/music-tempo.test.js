// Le suivi du tempo : `listen_beat` est écrit à 112,5 bpm ; la scène accélère ou ralentit le
// clip sur le tempo des coups de grosse caisse, et le remet en phase, en douceur, quand un coup
// tombe loin d'une frappe du hochement.
import { BEAT_OFFSET, CLIP_BEAT, CLIP_BPM, CLIP_LENGTH, REPHASE_TIME, createTempoState, suivreTempo } from '../src/three/music/tempo.js'

const IMAGE = 1 / 60
// Les frappes du hochement : la tête arrive en bas, en accélérant, à 8/30 et 24/30 s.
const FRAPPES = [8 / 30, 24 / 30]

// Fait tourner le suivi image par image pendant `duree` secondes, depuis `depart`, avec un coup
// toutes les `periode` secondes (aucun si periode est nulle). Renvoie le dernier résultat.
function simuler(etat, { depart = 0, duree, periode = 0, clip = () => FRAPPES[0] }) {
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

// Une image sans coup juste avant `depart` (la cadence est établie), un coup à `depart` avec le
// clip à `tempsClip`, puis `duree` secondes sans coup. Renvoie, image par image, la remise en
// phase (ajoutée au facteur de vitesse) et le facteur du tempo.
function corriger(etat, tempsClip, { depart = 10, duree = 1 } = {}) {
  suivreTempo(etat, false, depart - IMAGE, tempsClip)
  const images = []
  const n = Math.round(duree / IMAGE)
  for (let i = 0; i <= n; i++) {
    const r = suivreTempo(etat, i === 0, depart + i * IMAGE, tempsClip)
    images.push({ rephase: r.rephase, timeScale: r.timeScale })
  }
  return images
}
// Décalage total apporté au temps du clip par la remise en phase.
const decalage = (images) => images.reduce((s, im) => s + im.rephase * IMAGE, 0)
// Durée (s) pendant laquelle la remise en phase agit.
const duree = (images) => images.filter((im) => im.rephase !== 0).length * IMAGE

test('the clip is written at 112.5 bpm, two beats per loop, the nod landing at 8/30 and 24/30', () => {
  expect(CLIP_BPM).toBeCloseTo(112.5, 6)
  expect(CLIP_BEAT).toBeCloseTo(16 / 30, 9)
  expect(CLIP_LENGTH).toBeCloseTo(32 / 30, 9)
  expect(BEAT_OFFSET).toBeCloseTo(8 / 30, 9)
  expect(BEAT_OFFSET + CLIP_BEAT).toBeCloseTo(24 / 30, 9)
})

test('without kicks the clip keeps its own tempo and phase', () => {
  const etat = createTempoState()
  const r = simuler(etat, { duree: 3 })
  expect(r.timeScale).toBe(1)
  expect(r.rephase).toBe(0)
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

test('a kick far from a strike shifts the clip onto the nearest strike, by exactly the error', () => {
  const total = (t) => decalage(corriger(createTempoState(), t))
  const [a, b] = FRAPPES
  // à moins de 0,08 s d'une frappe : rien
  expect(total(a + 0.03)).toBe(0)
  expect(total(b - 0.07)).toBe(0)
  // sinon, vers la frappe la plus proche, en avant ou en arrière
  expect(total(0.1)).toBeCloseTo(a - 0.1, 9)
  expect(total(0.45)).toBeCloseTo(a - 0.45, 9)
  expect(total(0.6)).toBeCloseTo(b - 0.6, 9)
  expect(total(1.0)).toBeCloseTo(b - 1.0, 9)
  expect(total(CLIP_LENGTH - 0.01)).toBeCloseTo(b - (CLIP_LENGTH - 0.01), 9)
})

test('the correction is spread over about 0.4 s, without jumps', () => {
  expect(REPHASE_TIME).toBeCloseTo(0.4, 6)
  for (const tempsClip of [0.02, 0.45, 0.54, 1.06]) {
    const images = corriger(createTempoState(), tempsClip)
    expect(duree(images)).toBeGreaterThan(0.35)
    expect(duree(images)).toBeLessThan(0.45)
    for (const im of images) {
      // avance du clip à chaque image : jamais en arrière, jamais plus de deux images d'un coup
      const avance = (im.timeScale + im.rephase) * IMAGE
      expect(avance).toBeGreaterThanOrEqual(0)
      expect(avance).toBeLessThanOrEqual(2 * IMAGE * Math.max(1, im.timeScale))
    }
  }
})

test('the head never runs backwards, even on a slow song: the correction just takes longer', () => {
  const etat = createTempoState()
  // 70,6 bpm : facteur ~0,63, le clip toujours sur une frappe (aucune correction)
  const r = simuler(etat, { duree: 12, periode: 0.85 })
  expect(r.timeScale).toBeLessThan(0.65)
  expect(r.rephase).toBe(0)
  // un coup avec le clip 0,26 s après la frappe : il faut reculer de 0,26 s
  const images = corriger(etat, FRAPPES[0] + 0.26, { depart: 12.85, duree: 1.5 })
  for (const im of images) expect(im.timeScale + im.rephase).toBeGreaterThanOrEqual(0)
  expect(decalage(images)).toBeCloseTo(-0.26, 9)
  expect(duree(images)).toBeGreaterThan(0.4)
})

test('no more than one correction per beat', () => {
  const etat = createTempoState()
  // deux coups à 0,2 s d'écart, tous deux loin d'une frappe : seul le premier corrige
  const premier = corriger(etat, 0.1, { depart: 10, duree: 0.2 })
  const second = corriger(etat, 0.6, { depart: 10.2 + IMAGE, duree: 0.6 })
  expect(decalage(premier) + decalage(second)).toBeCloseTo(FRAPPES[0] - 0.1, 9)
  // un temps plus tard, une nouvelle correction est permise
  const troisieme = corriger(etat, 0.6, { depart: 11.2, duree: 0.45 })
  expect(decalage(troisieme)).toBeCloseTo(FRAPPES[1] - 0.6, 9)
  // finie, mais à moins d'un temps (0,45 s < 16/30 s) de la précédente : pas de nouvelle
  const quatrieme = corriger(etat, 0.1, { depart: 11.65 + IMAGE, duree: 1 })
  expect(decalage(quatrieme)).toBe(0)
})

test('the result object can be reused frame after frame', () => {
  const etat = createTempoState()
  const sortie = {}
  expect(suivreTempo(etat, false, 0, 0, sortie)).toBe(sortie)
  expect(sortie).toEqual({ etat, timeScale: 1, rephase: 0 })
})
