// Calculs purs du visualiseur : energie par bande, lissage asymetrique, coup
// de grosse caisse. Constantes reprises du visualiseur du v5, qui les appliquait
// une fois par image a 60 i/s ; ici, chaque calcul recoit le temps ecoule (dt, en
// secondes) et donne la meme courbe dans le temps a toute cadence (60, 120, 144 i/s).

// Energie moyenne des cases [from, to[ d'un AnalyserNode, normalisee a 0..1.
export function bandEnergy(data, from, to) {
  const fin = Math.min(to, data.length)
  if (fin <= from) return 0
  let somme = 0
  for (let i = from; i < fin; i++) somme += data[i]
  return somme / (fin - from) / 255
}

// Cases de l'analyseur (fftSize 2048 -> 1024 cases) : graves, mediums, aigus.
export const BANDS = { bass: [0, 16], mid: [16, 64], high: [64, 128] }

// Duree d'une image du v5 (60 i/s) : le pas par defaut.
export const REFERENCE_DT = 1 / 60

// Attaque rapide (on sent le transitoire), retombee lente (persistance visuelle).
// Coefficients du v5 : part du chemin parcourue en une image a 60 i/s. En dt secondes, la
// part est 1 - (1 - k) ** (dt * 60) : une decroissance exponentielle de constante de temps
// -1 / (60 ln(1 - k)), soit pour l'attaque ~24 ms (graves), ~58 ms (mediums), ~21 ms
// (aigus), pour la retombee ~0,27 s, ~0,41 s et ~0,13 s.
const ATTACK = { bass: 0.5, mid: 0.25, high: 0.55 }
const DECAY = { bass: 0.06, mid: 0.04, high: 0.12 }

/** Part du chemin parcourue en `dt` secondes par un lissage de coefficient `k` (par image a 60 i/s). */
export const smoothingStep = (k, dt) => 1 - (1 - k) ** (dt * 60)

const asym = (courant, cible, attaque, retombee, dt) =>
  courant + (cible - courant) * smoothingStep(cible > courant ? attaque : retombee, dt)

export function smoothBands(prev, raw, dt = REFERENCE_DT) {
  return {
    bass: asym(prev.bass, raw.bass, ATTACK.bass, DECAY.bass, dt),
    mid: asym(prev.mid, raw.mid, ATTACK.mid, DECAY.mid, dt),
    high: asym(prev.high, raw.high, ATTACK.high, DECAY.high, dt),
  }
}

// Coup de grosse caisse : graves >= seuil, saut >= delta depuis l'image
// precedente, et au moins KICK_GAP secondes depuis le dernier coup (12 images du v5).
export const KICK_LEVEL = 0.25
export const KICK_JUMP = 0.04
export const KICK_GAP = 0.2
// Tolerance sur le temps mort : 12 pas de 1/60 s font 0,2 s a l'arrondi pres.
const GAP_EPSILON = 1e-6

// `since` (secondes) part haut : le premier coup n'attend pas.
export const createKickState = () => ({ prev: 0, since: KICK_GAP })

export function detectKick(state, bass, dt = REFERENCE_DT) {
  const since = state.since + dt
  // Le saut se mesure d'une image a l'autre : a cadence plus haute, l'attaque des graves
  // monte moins par image. Le seuil suit la meme proportion que l'attaque (exact pour un
  // front franc), pour qu'un coup du v5 reste un coup a 144 i/s.
  const saut = (KICK_JUMP * smoothingStep(ATTACK.bass, dt)) / ATTACK.bass
  const kick = bass >= KICK_LEVEL && bass - state.prev >= saut && since >= KICK_GAP - GAP_EPSILON
  return { kick, state: { prev: bass, since: kick ? 0 : since } }
}
