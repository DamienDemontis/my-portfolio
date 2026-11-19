// Le suivi du tempo : `listen_beat` (src/three/character/sectionClips.js) bat deux temps par
// boucle, à 112,5 bpm, et dériverait sur un vrai morceau. La scène l'accélère ou le ralentit
// sur le tempo des coups de grosse caisse détectés, et, quand un coup tombe loin d'une frappe
// du hochement, le remet en phase en douceur (une vitesse ajoutée pendant ~0,4 s, sans saut).
import { SECTION_CLIPS } from '../character/sectionClips.js'

/** Durée de la boucle (s, temps du clip), sa période de temps (deux par boucle), son tempo. */
export const CLIP_LENGTH = SECTION_CLIPS.listen_beat.duration
export const CLIP_BEAT = CLIP_LENGTH / 2
export const CLIP_BPM = 60 / CLIP_BEAT

// Frappes du hochement : BEAT_OFFSET et BEAT_OFFSET + CLIP_BEAT (8/30 et 24/30 s), où la tête
// arrive en bas en accélérant (segments en « in ») ; c'est là que doit tomber le coup.
export const BEAT_OFFSET = 8 / 30
/** Durée (s réelles) sur laquelle une remise en phase est étalée. */
export const REPHASE_TIME = 0.4
// Intervalles retenus entre deux coups (s) : 70 à 180 bpm ; on en moyenne les 4 derniers.
const GAP_MIN = 0.33
const GAP_MAX = 0.86
const GAPS = 4
// Bornes du facteur de vitesse, constante de temps de son lissage (s).
const SCALE_MIN = 0.6
const SCALE_MAX = 1.6
const SMOOTHING = 0.5
// Sans coup depuis SILENCE secondes, le clip revient à son propre tempo.
const SILENCE = 2
// Écart toléré entre un coup et la frappe la plus proche (s, temps du clip).
const TOLERANCE = 0.08
// Au plus une remise en phase par temps (marge pour la cadence des images).
const ONE_BEAT = 0.9

/**
 * État du suivi : derniers intervalles, dernier coup, facteur courant, dernier appel, et la
 * remise en phase en cours (décalage restant, sa vitesse, son départ).
 */
export const createTempoState = () => ({
  gaps: [],
  lastKick: -Infinity,
  timeScale: 1,
  t: null,
  shiftLeft: 0,
  shiftRate: 0,
  lastShift: -Infinity,
})

/**
 * Une image du suivi. `kick` : un coup de grosse caisse à cette image ; `maintenant` : l'heure
 * (s) ; `tempsClip` : le temps courant de l'action `listen_beat` (s). L'état est mis à jour sur
 * place ; le résultat est écrit dans `out` (réutilisable d'une image à l'autre) :
 *  - timeScale : tempo des coups / 112,5, lissé, borné à [0,6 ; 1,6] ; 1 sans tempo connu ;
 *  - rephase : vitesse à ajouter à timeScale pendant cette image pour remettre le clip en
 *    phase (0 hors correction). Sur un coup à plus de 0,08 s de la frappe la plus proche (et
 *    pas plus d'une fois par temps), l'écart est étalé sur REPHASE_TIME secondes ; la somme
 *    des rephase × dt vaut exactement l'écart, et timeScale + rephase ne descend jamais sous
 *    zéro (la tête ne repart pas en arrière : la correction prend alors plus de temps).
 */
export function suivreTempo(etat, kick, maintenant, tempsClip, out = {}) {
  const dt = etat.t === null ? 0 : Math.max(0, maintenant - etat.t)
  etat.t = maintenant

  if (kick) {
    const ecart = maintenant - etat.lastKick
    if (ecart >= GAP_MIN && ecart <= GAP_MAX) {
      etat.gaps.push(ecart)
      if (etat.gaps.length > GAPS) etat.gaps.shift()
    }
    etat.lastKick = maintenant
  }
  // un silence efface le tempo appris : le morceau suivant repart de zéro
  if (maintenant - etat.lastKick > SILENCE) etat.gaps.length = 0

  let cible = 1
  if (etat.gaps.length >= 2) {
    let somme = 0
    for (const g of etat.gaps) somme += g
    const bpm = 60 / (somme / etat.gaps.length)
    cible = Math.min(SCALE_MAX, Math.max(SCALE_MIN, bpm / CLIP_BPM))
  }
  etat.timeScale += (cible - etat.timeScale) * (1 - Math.exp(-dt / SMOOTHING))

  // Un coup loin d'une frappe lance une remise en phase, sauf s'il y en a déjà une en cours ou
  // s'il y en a eu une depuis moins d'un temps.
  const temps = CLIP_BEAT / etat.timeScale // un temps, en secondes réelles
  if (kick && Number.isFinite(tempsClip) && etat.shiftLeft === 0 && maintenant - etat.lastShift >= ONE_BEAT * temps) {
    const frappe = BEAT_OFFSET + Math.round((tempsClip - BEAT_OFFSET) / CLIP_BEAT) * CLIP_BEAT
    const erreur = frappe - tempsClip
    if (Math.abs(erreur) > TOLERANCE) {
      etat.shiftLeft = erreur
      etat.shiftRate = erreur / REPHASE_TIME
      etat.lastShift = maintenant
    }
  }

  let rephase = 0
  if (etat.shiftLeft !== 0 && dt > 0) {
    // jamais en arrière : la vitesse totale reste positive ou nulle
    rephase = Math.max(etat.shiftRate, -etat.timeScale)
    if (Math.abs(rephase * dt) >= Math.abs(etat.shiftLeft)) {
      // la dernière image : juste ce qui reste
      rephase = Math.max(etat.shiftLeft / dt, -etat.timeScale)
      etat.shiftLeft = 0
    } else etat.shiftLeft -= rephase * dt
  }

  out.etat = etat
  out.timeScale = etat.timeScale
  out.rephase = rephase
  return out
}
