// Le suivi du tempo : `listen_beat` (src/three/character/sectionClips.js) bat deux temps par
// boucle, à 112,5 bpm, et dériverait sur un vrai morceau. La scène l'accélère ou le ralentit
// sur le tempo des coups de grosse caisse détectés, et le recale sur un temps fort quand un
// coup tombe loin de l'un d'eux.
import { SECTION_CLIPS } from '../character/sectionClips.js'

/** Durée de la boucle (s, temps du clip), sa période de temps (deux par boucle), son tempo. */
export const CLIP_LENGTH = SECTION_CLIPS.listen_beat.duration
export const CLIP_BEAT = CLIP_LENGTH / 2
export const CLIP_BPM = 60 / CLIP_BEAT

// Temps forts du clip : BEAT_OFFSET et BEAT_OFFSET + CLIP_BEAT (0 et 16/30 s).
export const BEAT_OFFSET = 0
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
// Écart toléré entre un coup et le temps fort le plus proche (s, temps du clip).
const TOLERANCE = 0.08

/** État du suivi : derniers intervalles, dernier coup, facteur courant, dernier appel. */
export const createTempoState = () => ({ gaps: [], lastKick: -Infinity, timeScale: 1, t: null })

/**
 * Une image du suivi. `kick` : un coup de grosse caisse à cette image ; `maintenant` : l'heure
 * (s) ; `tempsClip` : le temps courant de l'action `listen_beat` (s). L'état est mis à jour sur
 * place ; le résultat est écrit dans `out` (réutilisable d'une image à l'autre) :
 *  - timeScale : tempo des coups / 112,5, lissé, borné à [0,6 ; 1,6] ; 1 sans tempo connu ;
 *  - recaler : sur un coup à plus de 0,08 s d'un temps fort, le temps du temps fort le plus
 *    proche, où ramener l'action ; null sinon.
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

  let recaler = null
  if (kick && Number.isFinite(tempsClip)) {
    // le temps fort le plus proche : BEAT_OFFSET + k × CLIP_BEAT, ramené dans la boucle
    const k = Math.round((tempsClip - BEAT_OFFSET) / CLIP_BEAT)
    const proche = BEAT_OFFSET + k * CLIP_BEAT
    if (Math.abs(tempsClip - proche) > TOLERANCE) recaler = BEAT_OFFSET + (((k % 2) + 2) % 2) * CLIP_BEAT
  }

  out.etat = etat
  out.timeScale = etat.timeScale
  out.recaler = recaler
  return out
}
