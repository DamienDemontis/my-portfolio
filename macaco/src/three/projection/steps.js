// Salle de projection : quel projet passe à l'écran pour une progression p du scroll.
// Fonction pure et sans état : un saut de scroll (ancre, lien) donne tout de suite le bon
// projet, au texte comme à la scène, qui l'appellent avec la même progression.
//
// Un palier par projet (PROJECT_ANCHORS) : la caméra s'y pose, le texte y montre la carte.
// Entre deux paliers, la pellicule brûle : sur une fenêtre centrée sur la frontière (le
// milieu des deux paliers), `burn` va de 0 à 1, de l'image `from` à l'image `to`. Avant le
// premier palier, le projecteur démarre sur l'amorce (LEADER), qui brûle à son tour pour
// laisser place au premier projet.

/** Progressions où la caméra se pose sur chaque projet, dans l'ordre des projets. */
export const PROJECT_ANCHORS = [0.26, 0.37, 0.48, 0.59, 0.7, 0.81]

/** Largeur de la brûlure, en fraction de l'écart entre deux paliers. */
export const BURN_WINDOW = 0.4

/** Index de l'amorce : le projecteur tourne, aucun projet n'est encore à l'écran. */
export const LEADER = -1

const ECART = PROJECT_ANCHORS[1] - PROJECT_ANCHORS[0]

// Frontières entre deux images : avant le premier palier (amorce → projet 0), puis au milieu
// de deux paliers voisins. FRONTIERES[k] sépare l'image k - 1 de l'image k.
const FRONTIERES = PROJECT_ANCHORS.map((a, k) => (k === 0 ? a - ECART / 2 : (PROJECT_ANCHORS[k - 1] + a) / 2))

const DEMI_FENETRE = (BURN_WINDOW * ECART) / 2

/**
 * Projet à l'écran pour la progression p.
 * @returns {{ index: number, from: number, to: number, burn: number }}
 *   index : le projet courant (LEADER avant la première frontière) ; il change au milieu de
 *   la brûlure. from, to : les deux images mêlées (égales hors brûlure) ; burn ∈ [0, 1].
 */
export function projectAt(p) {
  // NaN ou autre chose qu'un nombre : le début ; ±Infinity servent de bornes.
  const x = typeof p === 'number' && !Number.isNaN(p) ? p : 0
  let index = LEADER
  for (const f of FRONTIERES) if (x >= f) index++
  for (let k = 0; k < FRONTIERES.length; k++) {
    const debut = FRONTIERES[k] - DEMI_FENETRE
    const fin = FRONTIERES[k] + DEMI_FENETRE
    if (x > debut && x < fin) return { index, from: k - 1, to: k, burn: (x - debut) / (fin - debut) }
  }
  return { index, from: index, to: index, burn: 0 }
}
