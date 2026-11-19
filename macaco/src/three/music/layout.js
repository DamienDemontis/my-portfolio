// Salle d'écoute : où sont les choses (mètres, y vers le haut) et les plans de caméra.
// Données pures, partagées par la scène, la section et les tests de cadrage.
//
// Il se tient au centre, face à +z, le casque sur les oreilles ; la boombox est posée à ses
// pieds ; l'anneau de particules tourne autour de lui à hauteur de poitrine ; des tubes néon
// cuivre se dressent en arc de cercle derrière lui et se reflètent dans le sol noir.

export const ROOM = {
  character: { position: [0, 0, 0], rotationY: 0, height: 1.8, head: [0, 1.68, 0] },
  // La coque gauche du casque (sa gauche : +x, puisqu'il regarde vers +z).
  cup: [0.1, 1.66, 0.0],
  boombox: { position: [0.78, 0, 0.62], rotationY: -0.45 },
  ring: { center: [0, 1.15, 0], radius: 1.35 },
  // Tubes néon : arc derrière lui (angles en degrés, 0 = derrière, sur l'axe −z).
  neons: { radius: 3.3, height: 2.6, angles: [-70, -40, -14, 14, 40, 70] },
}

// L'orbite à 360° : un tour complet autour de lui, de 20° à 380°, la caméra un peu au-dessus
// de l'anneau. ORBIT_END est la pose sur laquelle elle s'achève (raccord sans coupe).
const ORBITE_WIDE = { center: [0, 1.25, 0], radius: 2.6, height: 0.25, from: 20, to: 380, fov: 38 }
const ORBITE_NARROW = { center: [0, 1.1, 0], radius: 3.6, height: 0.35, from: 20, to: 380, fov: 56 }

function finOrbite({ center, radius, height, to, fov }) {
  const a = (to * Math.PI) / 180
  return { pos: [center[0] + radius * Math.sin(a), center[1] + height, center[2] + radius * Math.cos(a)], look: center, fov }
}

/** Progressions des plans repères (tests de cadrage). */
export const CUP_AT = 0.22
export const ORBIT_FROM = 0.32
export const ORBIT_TO = 0.68
export const LOW_AT = 0.78
export const VERTIGO_AT = 0.86

const WIDE = [
  // Ouverture : grue large en plongée, haute et en mouvement (la section Projets finit sur un
  // gros plan fixe au téléobjectif) ; toute la salle, les néons dans le sol noir.
  { at: 0, pos: [2.6, 4.6, 6.0], look: [0, 0.9, 0], fov: 46 },
  // La grue descend vers lui.
  { at: 0.12, pos: [1.2, 1.9, 3.4], look: [0, 1.35, 0], fov: 38 },
  // Très gros plan sur la coque du casque, son liseré néon.
  { at: CUP_AT, pos: [0.55, 1.72, 0.34], look: ROOM.cup, fov: 16, focus: 0.57 },
  // Le geste de la section : l'orbite à 360°, lente ; l'anneau pulse sur les graves.
  { at: ORBIT_FROM, move: { type: 'orbit', ...ORBITE_WIDE } },
  { at: ORBIT_TO, ...finOrbite(ORBITE_WIDE) },
  // Contre-plongée au travers de l'anneau : les particules floues au premier plan.
  { at: LOW_AT, pos: [0.95, 0.3, 1.7], look: [0, 1.65, 0], fov: 52, focus: 2.3 },
  // Dolly zoom sur la fin : la caméra fonce, le champ s'ouvre, lui garde sa taille.
  { at: VERTIGO_AT, move: { type: 'dollyZoom', subject: [0, 1.45, 0], dir: [0.35, 0.08, 1], fovFrom: 20, fovTo: 72, width: 1.35 } },
]

// Portrait : champs plus larges, caméras reculées ; on vise plus bas pour que lui et l'anneau
// restent au-dessus du lecteur, en bas de l'écran.
const NARROW = [
  { at: 0, pos: [2.2, 5.4, 7.6], look: [0, 0.2, 0], fov: 58 },
  { at: 0.12, pos: [1.1, 2.1, 4.6], look: [0, 0.75, 0], fov: 52 },
  { at: CUP_AT, pos: [0.62, 1.74, 0.44], look: [0.1, 1.6, 0.0], fov: 30, focus: 0.68 },
  { at: ORBIT_FROM, move: { type: 'orbit', ...ORBITE_NARROW } },
  { at: ORBIT_TO, ...finOrbite(ORBITE_NARROW) },
  { at: LOW_AT, pos: [1.0, 0.3, 2.1], look: [0, 1.25, 0], fov: 64, focus: 2.6 },
  { at: VERTIGO_AT, move: { type: 'dollyZoom', subject: [0, 1.15, 0], dir: [0.35, 0.08, 1], fovFrom: 28, fovTo: 86, width: 1.5 } },
]

export const MUSIC_SHOTS = { wide: WIDE, narrow: NARROW }

/** Plan fixe sous mouvement réduit : face à lui, l'anneau et la boombox dans le cadre. */
export const MUSIC_STILL = {
  wide: { at: 0.5, pos: [0.9, 1.5, 3.2], look: [0, 1.2, 0], fov: 40 },
  narrow: { at: 0.5, pos: [1.0, 1.6, 4.4], look: [0, 0.85, 0], fov: 56 },
}
