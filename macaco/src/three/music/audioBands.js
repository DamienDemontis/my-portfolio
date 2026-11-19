// Calculs purs du visualiseur : energie par bande, lissage asymetrique, coup
// de grosse caisse. Constantes reprises du visualiseur du v5.

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

// Attaque rapide (on sent le transitoire), retombee lente (persistance visuelle).
const ATTACK = { bass: 0.5, mid: 0.25, high: 0.55 }
const DECAY = { bass: 0.06, mid: 0.04, high: 0.12 }

const asym = (courant, cible, attaque, retombee) =>
  courant + (cible - courant) * (cible > courant ? attaque : retombee)

export function smoothBands(prev, raw) {
  return {
    bass: asym(prev.bass, raw.bass, ATTACK.bass, DECAY.bass),
    mid: asym(prev.mid, raw.mid, ATTACK.mid, DECAY.mid),
    high: asym(prev.high, raw.high, ATTACK.high, DECAY.high),
  }
}

// Coup de grosse caisse : graves >= seuil, saut >= delta depuis l'image
// precedente, et au moins MIN_GAP images depuis le dernier coup.
export const KICK_LEVEL = 0.25
export const KICK_JUMP = 0.04
export const KICK_GAP = 12

// `since` part haut : le premier coup n'attend pas.
export const createKickState = () => ({ prev: 0, since: KICK_GAP })

export function detectKick(state, bass) {
  const since = state.since + 1
  const kick = bass >= KICK_LEVEL && bass - state.prev >= KICK_JUMP && since >= KICK_GAP
  return { kick, state: { prev: bass, since: kick ? 0 : since } }
}
