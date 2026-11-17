// Poses du personnage par scène, exprimées comme données.
// Chaque recette est une liste de rotations [os, axe du MONDE, degrés],
// appliquées dans l'ordre à partir de la pose de liaison (A-pose).
// Repère : 1,80 m, pieds à y = 0, face vers +Z, côté gauche du personnage = +X.
// Le texte occupe la colonne gauche aux index pairs, la droite aux impairs :
// la caméra (pos et look décalés ensemble) place le personnage dans l'autre moitié.
import { Quaternion, Vector3 } from 'three'

/** Retire le préfixe `mixamorig:` ou `mixamorig` (même règle que scripts/). */
export const normalizeJointName = (name) => name.replace(/^mixamorig:?/, '')

// Caméra de face qui cadre tout le corps, décalée de dx sur l'axe X.
const cam = (dx, fov = 30) => ({ pos: [dx, 0.95, 4.2], look: [dx, 0.92, 0], fov })

// Bras le long du corps (autour de ±33° : au-delà les mains s'enfoncent dans le manteau).
const ARMS_DOWN = [
  ['LeftArm', 'z', -33],
  ['RightArm', 'z', 33],
]

export const SCENE_POSES = {
  // De dos, bras le long du corps.
  ouverture: { bones: [...ARMS_DOWN], yaw: 180, camera: cam(-0.6) },
  // Trois-quarts, tête légèrement levée vers un mur.
  metier: {
    bones: [...ARMS_DOWN, ['Head', 'x', -12], ['Head', 'y', 20]],
    yaw: 35,
    camera: cam(0.6),
  },
  // Avant-bras levés devant lui, paumes vers le haut.
  construire: {
    bones: [
      ['LeftArm', 'z', -30],
      ['RightArm', 'z', 30],
      ['LeftArm', 'x', -25],
      ['RightArm', 'x', -25],
      ['LeftForeArm', 'x', -75],
      ['RightForeArm', 'x', -75],
      ['LeftHand', 'x', -20],
      ['RightHand', 'x', -20],
    ],
    yaw: 0,
    camera: cam(-0.6),
  },
  // Les deux mains aux oreilles (casque).
  musique: {
    bones: [
      ['LeftArm', 'z', 50],
      ['LeftForeArm', 'z', 168],
      ['LeftHand', 'z', 25],
      ['RightArm', 'z', -50],
      ['RightForeArm', 'z', -168],
      ['RightHand', 'z', -25],
    ],
    yaw: 0,
    camera: cam(0.6),
  },
  // Épaules rentrées, bras serrés contre le corps.
  coree: {
    bones: [
      ...ARMS_DOWN,
      ['LeftShoulder', 'z', 8],
      ['RightShoulder', 'z', -8],
      ['LeftForeArm', 'x', -25],
      ['RightForeArm', 'x', -25],
      ['Spine1', 'x', 10],
      ['Head', 'x', 10],
    ],
    yaw: 0,
    camera: cam(-0.6),
  },
  // Tête baissée, une main tendue vers le sol.
  vivant: {
    bones: [
      ['LeftArm', 'z', -33],
      ['RightArm', 'z', 15],
      ['RightArm', 'x', -30],
      ['RightForeArm', 'x', -15],
      ['Spine1', 'x', 8],
      ['Head', 'x', 30],
    ],
    yaw: -15,
    camera: cam(0.6),
  },
  // Buste penché en avant, une main ouverte tendue vers l'avant.
  transmission: {
    bones: [
      ['Spine', 'x', 6],
      ['Spine1', 'x', 14],
      ['LeftArm', 'z', 15],
      ['LeftArm', 'x', -35],
      ['LeftForeArm', 'x', -35],
      ['LeftForeArm', 'z', 15],
      ['RightArm', 'z', 33],
      ['Head', 'y', 15],
      ['Head', 'x', 12],
    ],
    yaw: -20,
    camera: cam(-0.6),
  },
  // De dos, en marche : jambes et bras en opposition.
  sortie: {
    bones: [
      ['RightUpLeg', 'x', -30],
      ['RightLeg', 'x', 40],
      ['LeftUpLeg', 'x', 20],
      ['LeftLeg', 'x', 5],
      ['LeftArm', 'z', -33],
      ['RightArm', 'z', 33],
      ['LeftArm', 'x', -25],
      ['RightArm', 'x', 20],
    ],
    yaw: 180,
    camera: cam(0.6),
  },
}

const AXES = { x: new Vector3(1, 0, 0), y: new Vector3(0, 1, 0), z: new Vector3(0, 0, 1) }

// Pose de liaison de chaque os, hors de userData : Object3D.clone copie userData en
// passant par JSON, ce qui changerait un Quaternion en tableau. Un os cloné n'est pas
// dans la table : bonesByName lui mémorise sa propre liaison.
const binds = new WeakMap()

/** Os indexés par nom normalisé ; mémorise la liaison une seule fois. */
export function bonesByName(root) {
  const out = {}
  root.traverse((o) => {
    if (!o.isBone) return
    if (!binds.has(o)) binds.set(o, o.quaternion.clone())
    out[normalizeJointName(o.name)] = o
  })
  return out
}

/** Liaison mémorisée par bonesByName (undefined pour un os jamais vu). */
export const bindQuaternion = (bone) => binds.get(bone)

const restoreBind = (bones) => {
  for (const b of Object.values(bones)) b.quaternion.copy(binds.get(b))
}

/** Quaternions locaux de chaque os pour une recette ; les os reviennent ensuite en liaison. */
export function poseQuaternions(bones, recipe) {
  const all = Object.values(bones)
  restoreBind(bones)
  const first = all[0]
  if (first) {
    let top = first
    while (top.parent) top = top.parent
    top.updateMatrixWorld(true)
  }
  const rot = new Quaternion()
  const boneWorld = new Quaternion()
  const parentWorld = new Quaternion()
  for (const [name, axis, deg] of recipe) {
    const bone = bones[name]
    if (!bone) continue
    rot.setFromAxisAngle(AXES[axis], (deg * Math.PI) / 180)
    bone.getWorldQuaternion(boneWorld)
    if (bone.parent) bone.parent.getWorldQuaternion(parentWorld)
    else parentWorld.identity()
    // local = parentWorld⁻¹ · R · boneWorld
    bone.quaternion.copy(parentWorld.invert()).multiply(rot).multiply(boneWorld)
    bone.updateMatrixWorld(true)
  }
  const result = {}
  for (const [name, b] of Object.entries(bones)) result[name] = b.quaternion.clone()
  restoreBind(bones)
  if (first) {
    let top = first
    while (top.parent) top = top.parent
    top.updateMatrixWorld(true)
  }
  return result
}

/**
 * Mélange deux poses : slerp par os, liaison pour les os absents d'une pose.
 * Appelé à chaque image : une seule boucle, aucune allocation
 * (un os absent des deux poses donne slerp(liaison, liaison, t) = liaison).
 */
export function blendPose(bones, from, to, t) {
  for (const name in bones) {
    const b = bones[name]
    const bind = binds.get(b)
    b.quaternion.copy(from[name] ?? bind).slerp(to[name] ?? bind, t)
  }
}
