// Salle de projection : où sont les choses (mètres, y vers le haut) et les plans de caméra.
// Données pures, partagées par la scène, la section et les tests de cadrage.
//
// Le projecteur est au fond, côté spectateurs ; l'écran est devant lui, à 7 m. Il se tient
// debout entre les deux, un peu à droite du faisceau, qui frôle son épaule gauche : son ombre
// mord le bas de l'image, sa silhouette se découpe dans la lumière.
import { PROJECT_ANCHORS } from './steps.js'

export const ROOM = {
  // Écran 16:9, tourné vers +z ; son centre est la cible du projecteur.
  screen: { center: [0, 1.55, -4.2], width: 3.6, height: 2.025 },
  // Projecteur posé sur un pied à 1,1 m, objectif vers l'écran (le modèle regarde vers +z :
  // on le tourne d'un demi-tour). `lens` : sortie de la lumière, en coordonnées du monde.
  projector: { position: [-0.35, 1.1, 3.0], rotationY: Math.PI, lens: [-0.29, 1.17, 2.86] },
  // Bobine débitrice (la rouge), pour le plan macro d'ouverture.
  reel: [-0.295, 1.357, 2.88],
  // Le personnage, 1,8 m, tourné vers l'écran ; `head` : ses yeux.
  character: { position: [0.35, 0, 0.6], rotationY: Math.PI, height: 1.8, head: [0.35, 1.68, 0.6] },
}

const [A0, A1, A2, A3, A4, A5] = PROJECT_ANCHORS

// Travelling latéral le long du faisceau : la caméra longe sa droite, du projecteur vers
// l'écran, un palier par projet ; elle vise en avant, l'écran entre peu à peu dans le cadre.
// `vise` : abscisse du point visé au premier et au dernier palier, `recul` : sa distance en z.
function travelling(anchors, { x0, x1, y, z0, z1, fov, vise, recul }) {
  return anchors.map((at, i) => {
    const s = i / (anchors.length - 1)
    const z = z0 + (z1 - z0) * s
    const x = x0 + (x1 - x0) * s
    const lx = vise[0] + (vise[1] - vise[0]) * s
    return { at, pos: [x, y + 0.12 * Math.sin(s * Math.PI), z], look: [lx, 1.42, z - recul], fov }
  })
}

const WIDE = [
  // Macro sur la bobine qui tourne (≈ 100 mm), la mise au point sur elle.
  { at: 0, pos: [0.22, 1.4, 2.98], look: ROOM.reel, fov: 14, focus: 0.53 },
  // La netteté glisse vers la poussière du faisceau, devant l'objectif.
  { at: 0.08, pos: [0.4, 1.32, 2.55], look: [-0.22, 1.24, 1.7], fov: 22, focus: 1.05 },
  // Par-dessus son épaule vers l'écran : l'amorce tourne, sa silhouette dans la lumière.
  { at: 0.16, pos: [0.78, 1.74, 1.6], look: [0.05, 1.45, -4.2], fov: 30, focus: 5.9 },
  // Le geste de la section : le travelling, un palier par projet.
  ...travelling([A0, A1, A2, A3, A4, A5], { x0: 1.75, x1: 1.45, y: 1.3, z0: 2.25, z1: -2.2, fov: 36, vise: [-0.35, -0.1], recul: 3.4 }),
  // Contrechamp depuis l'écran : son visage dans la couleur du projet, le faisceau derrière lui.
  { at: 0.92, pos: [0.12, 1.6, -3.55], look: ROOM.character.head, fov: 15, focus: 4.15 },
  { at: 1, pos: [0.14, 1.62, -3.3], look: ROOM.character.head, fov: 12, focus: 3.9 },
]

// Portrait : champs plus larges et caméras reculées, personnage et écran gardés dans l'axe.
const NARROW = [
  { at: 0, pos: [0.26, 1.42, 3.02], look: ROOM.reel, fov: 26, focus: 0.58 },
  { at: 0.08, pos: [0.55, 1.34, 2.7], look: [-0.22, 1.24, 1.7], fov: 40, focus: 1.25 },
  { at: 0.16, pos: [0.9, 1.78, 2.4], look: [0.12, 1.4, -4.2], fov: 52, focus: 6.8 },
  ...travelling([A0, A1, A2, A3, A4, A5], { x0: 1.6, x1: 1.2, y: 1.3, z0: 3.1, z1: -0.9, fov: 62, vise: [-0.05, 0.05], recul: 5 }),
  { at: 0.92, pos: [0.15, 1.6, -3.4], look: ROOM.character.head, fov: 30, focus: 4.0 },
  { at: 1, pos: [0.16, 1.62, -3.1], look: ROOM.character.head, fov: 25, focus: 3.7 },
]

export const PROJECTION_SHOTS = { wide: WIDE, narrow: NARROW }

/** Plan fixe sous mouvement réduit : par-dessus son épaule, l'écran en face. */
export const PROJECTION_STILL = { wide: WIDE[2], narrow: NARROW[2] }

/** Progression des plans « par-dessus l'épaule » et « contrechamp » (tests de cadrage). */
export const SHOULDER_AT = 0.16
export const REVERSE_AT = 0.92
