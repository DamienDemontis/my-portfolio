// De la position de scroll au melange entre deux scenes.
// Fonction pure : memes entrees, meme sortie, quel que soit l'ordre des appels.
import { SCENES } from '../content/scenes.js'

// Fraction de chaque bord d'un intervalle ou la pose tient, le temps de lire.
export const HOLD = 0.25

const clamp01 = x => Math.min(1, Math.max(0, x))
const smoothstep = x => x * x * (3 - 2 * x)

// center = haut du scroll + demi-hauteur de vue ; anchors = centres des sections, croissants.
// Retourne { from, to, t } : la pose est melangee de `from` vers `to` avec le poids `t`.
export function sceneBlend(center, anchors) {
  const last = anchors.length - 1
  if (last < 0) return { from: 0, to: 0, t: 0 }

  // Un centre NaN est traite comme 0.
  const c = Number.isNaN(center) ? 0 : center

  if (c < anchors[0]) return { from: 0, to: 0, t: 0 }
  if (c >= anchors[last]) return { from: last, to: last, t: 0 }

  // Ancres egales : on repere le dernier index i (sans depasser last - 1) tel que anchors[i] <= c.
  // Une ancre dupliquee est donc franchie d'un coup, et l'intervalle retenu n'est jamais de longueur nulle,
  // ce qui evite toute division par zero. Pour deux ancres egales, on tient la scene suivante (t = 0).
  let i = 0
  while (i < last - 1 && anchors[i + 1] <= c) i++

  const span = anchors[i + 1] - anchors[i]
  const u = (c - anchors[i]) / span
  const t = smoothstep(clamp01((clamp01(u) - HOLD) / (1 - 2 * HOLD)))
  return { from: i, to: i + 1, t }
}

// Index de scene valide : entier entre 0 et le dernier, NaN ou absent ramene a 0.
const toSceneIndex = value => {
  if (!Number.isFinite(value)) return 0
  return Math.min(SCENES.length - 1, Math.max(0, Math.floor(value)))
}

// Progression (0 a 1) du melange, a passer a accentForProgress.
export function progressAt({ from, to, t }) {
  const a = SCENES[toSceneIndex(from)].progress
  const b = SCENES[toSceneIndex(to)].progress
  const w = Number.isFinite(t) ? clamp01(t) : 0
  // Forme (1 - w) * a + w * b : exacte aux bornes, w = 0 rend a, w = 1 rend b sans erreur d'arrondi.
  return (1 - w) * a + w * b
}
