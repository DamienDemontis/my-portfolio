// Salle de projection : où sont les choses (mètres, y vers le haut) et les plans de caméra.
// Données pures, partagées par la scène, la section et les tests de cadrage.
//
// Le projecteur est au fond, perché sur un haut pied ; l'écran est devant lui, à 7 m. Il se
// tient debout entre les deux, le faisceau passe juste au-dessus de lui : sa tête découpe le bas
// de l'image en ombre chinoise, comme un spectateur dans une salle, et la lumière lui fait un
// liseré dans les cheveux.
import { PROJECT_ANCHORS } from './steps.js'

export const ROOM = {
  // Écran 16:9, tourné vers +z ; son centre est la cible du projecteur.
  screen: { center: [0, 1.75, -4.2], width: 3.6, height: 2.025 },
  // Projecteur posé sur un pied à 1,78 m, objectif vers l'écran (le modèle regarde vers +z :
  // on le tourne d'un demi-tour). `lens` : sortie de la lumière, en coordonnées du monde.
  projector: { position: [-0.35, 1.78, 3.0], rotationY: Math.PI, lens: [-0.29, 1.85, 2.86] },
  // Bobine débitrice (la rouge), pour le plan macro d'ouverture.
  reel: [-0.295, 2.037, 2.88],
  // Le personnage, 1,8 m, tourné vers l'écran ; `head` : ses yeux.
  character: { position: [0.5, 0, -0.4], rotationY: Math.PI, height: 1.8, head: [0.5, 1.68, -0.4] },
}

const [A0, A1, A2, A3, A4, A5] = PROJECT_ANCHORS

// Travelling latéral le long du faisceau : la caméra longe sa droite, du projecteur vers
// l'écran, un palier par projet ; elle vise en avant, l'écran entre peu à peu dans le cadre.
// `vise` : abscisse du point visé au premier et au dernier palier, `recul` : sa distance en z,
// `hauteur` : sa hauteur (plus basse, l'écran monte dans l'image).
function travelling(anchors, { x0, x1, y, z0, z1, fov, vise, recul, hauteur = 1.62 }) {
  return anchors.map((at, i) => {
    const s = i / (anchors.length - 1)
    const z = z0 + (z1 - z0) * s
    const x = x0 + (x1 - x0) * s
    const lx = vise[0] + (vise[1] - vise[0]) * s
    return { at, pos: [x, y + 0.12 * Math.sin(s * Math.PI), z], look: [lx, hauteur, z - recul], fov }
  })
}

const WIDE = [
  // Macro sur la bobine qui tourne (≈ 100 mm), la mise au point sur elle.
  { at: 0, pos: [0.22, 2.08, 2.98], look: ROOM.reel, fov: 14, focus: 0.53 },
  // La netteté glisse vers la poussière du faisceau : le projecteur flou au premier plan.
  { at: 0.08, pos: [0.14, 1.93, 3.12], look: [-0.16, 1.84, 1.5], fov: 24, focus: 1.2 },
  // Par-dessus son épaule vers l'écran : l'amorce tourne, le faisceau passe au-dessus de lui.
  { at: 0.16, pos: [0.98, 1.76, 0.8], look: [0.12, 1.62, -4.2], fov: 30, focus: 5.0 },
  // Le geste de la section : le travelling, un palier par projet, en contre-plongée sous le
  // faisceau.
  ...travelling([A0, A1, A2, A3, A4, A5], { x0: 1.75, x1: 1.5, y: 1.22, z0: 2.25, z1: -1.55, fov: 36, vise: [-0.5, -0.55], recul: 3.4 }),
  // Contrechamp depuis l'écran : son visage dans la couleur du projet, le faisceau derrière lui.
  { at: 0.92, pos: [0.3, 1.6, -3.4], look: ROOM.character.head, fov: 17, focus: 3.0 },
  { at: 1, pos: [0.32, 1.62, -3.15], look: ROOM.character.head, fov: 13, focus: 2.75 },
]

// Portrait : champs plus larges et caméras reculées, personnage et écran gardés dans l'axe.
const NARROW = [
  { at: 0, pos: [0.26, 2.1, 3.02], look: ROOM.reel, fov: 26, focus: 0.58 },
  { at: 0.08, pos: [0.18, 1.95, 3.22], look: [-0.16, 1.84, 1.5], fov: 40, focus: 1.3 },
  { at: 0.16, pos: [1.05, 1.8, 1.5], look: [0.2, 1.6, -4.2], fov: 52, focus: 5.6 },
  ...travelling([A0, A1, A2, A3, A4, A5], { x0: 1.6, x1: 1.3, y: 1.22, z0: 3.1, z1: -0.4, fov: 62, vise: [-0.05, 0.05], recul: 5, hauteur: 0.8 }),
  // contrechamp : on vise sous le visage, qui monte au-dessus de la carte
  { at: 0.92, pos: [0.32, 1.6, -3.3], look: [0.5, 1.22, -0.4], fov: 32, focus: 2.9 },
  { at: 1, pos: [0.33, 1.62, -3.0], look: [0.5, 1.28, -0.4], fov: 26, focus: 2.6 },
]

export const PROJECTION_SHOTS = { wide: WIDE, narrow: NARROW }

/** Plan fixe sous mouvement réduit : par-dessus son épaule, l'écran en face. */
export const PROJECTION_STILL = { wide: WIDE[2], narrow: NARROW[2] }

/** Progression des plans « par-dessus l'épaule » et « contrechamp » (tests de cadrage). */
export const SHOULDER_AT = 0.16
export const REVERSE_AT = 0.92
