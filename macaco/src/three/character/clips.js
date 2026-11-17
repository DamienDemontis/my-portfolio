// Animations du personnage, écrites à la main : des poses clés (rotations en axes du monde, comme
// SCENE_POSES) et une hauteur de hanches, cuites à 30 images/s avec un easing par segment.
// Mêmes noms et durées que les clips du mécha d'origine, pour garder les plans de caméra de l'intro.
import { AnimationClip, Matrix3, QuaternionKeyframeTrack, Vector3, VectorKeyframeTrack } from "three";
import { bonesByName, poseQuaternions } from "./poses.js";

const FPS = 30;
const STAND = [["LeftArm", "z", -33], ["RightArm", "z", 33]];

const DORMANT = [
  ["LeftUpLeg", "x", -10], ["LeftLeg", "x", 16], ["RightUpLeg", "x", -6], ["RightLeg", "x", 12],
  ["Spine", "x", 6], ["Spine1", "x", 12], ["Spine2", "x", 6], ["Neck", "x", 14], ["Head", "x", 34],
  ["LeftArm", "z", -36], ["LeftArm", "x", -8], ["LeftForeArm", "x", -10],
  ["RightArm", "z", 36], ["RightArm", "x", -8], ["RightForeArm", "x", -10],
];

const RISING = [
  ["LeftUpLeg", "x", -45], ["LeftLeg", "x", 45],
  ["RightUpLeg", "x", -5], ["RightLeg", "x", 40],
  ["Spine1", "x", 10], ["LeftArm", "z", -33], ["RightArm", "z", 33],
];

const FALL = [
  ["LeftArm", "z", 60], ["RightArm", "z", -60], ["LeftForeArm", "z", 20], ["RightForeArm", "z", -20],
  ["LeftUpLeg", "x", -20], ["LeftLeg", "x", 30], ["RightUpLeg", "x", 10], ["RightLeg", "x", 40],
  ["Spine", "x", -5], ["Head", "x", 12],
];

const LANDING = [
  ["LeftUpLeg", "x", -50], ["LeftLeg", "x", 88], ["RightUpLeg", "x", -38], ["RightLeg", "x", 80],
  ["Spine", "x", 18], ["Spine1", "x", 14], ["Head", "x", -22],
  ["RightArm", "z", 18], ["RightArm", "x", -48], ["RightForeArm", "x", -8],
  ["LeftArm", "z", -58], ["LeftArm", "x", 28], ["LeftForeArm", "x", -15],
];

// Lévitation pendant l'assemblage : en hauteurs de hanches (≈ 3,3 unités de scène, là où l'intro cadrait le mécha).
const LEVITATE = 2.6;

const FLOAT = [
  ["LeftArm", "z", -18], ["RightArm", "z", 18], ["LeftForeArm", "z", 8], ["RightForeArm", "z", -8],
  ["LeftUpLeg", "x", -6], ["LeftLeg", "x", 14], ["RightUpLeg", "x", 4], ["RightLeg", "x", 22],
  ["Spine2", "x", -2],
];

// t en secondes ; hips = décalage vertical en fraction de la hauteur des hanches debout ;
// ease = courbe du segment qui MÈNE à cette clé.
export const CLIPS = {
  power_on: { duration: 2.67, keys: [
    { t: 0, pose: DORMANT, hips: -0.03 },
    { t: 0.9, pose: [...DORMANT.filter(([b]) => b !== "Head"), ["Head", "x", 26]], hips: -0.03 },
    { t: 1.8, pose: [...STAND, ["Spine2", "x", -2], ["Head", "x", 6]], hips: 0 },
    { t: 2.67, pose: [...STAND, ["Spine2", "x", -3]], hips: 0, ease: "out" },
  ] },
  // Comme le mécha : il s'élève pendant l'« assemblage » irisé (les plans de caméra de l'intro visent ~3,3 au-dessus du sol),
  // flotte en regardant sa main, puis la descente le ramène au sol.
  build: { duration: 7.33, keys: [
    { t: 0, pose: STAND, hips: 0 },
    { t: 1.3, pose: [...FLOAT, ["Head", "x", -8]], hips: LEVITATE },
    { t: 2.4, pose: [...FLOAT.filter(([b]) => !/^Left(Arm|ForeArm)$/.test(b)), ["LeftArm", "z", -20], ["LeftArm", "x", -40], ["LeftForeArm", "x", -70], ["Head", "y", 25], ["Head", "x", 15]], hips: LEVITATE + 0.04 },
    { t: 3.6, pose: [...FLOAT.filter(([b]) => !/^Left(Arm|ForeArm|Hand)$/.test(b)), ["LeftArm", "z", -20], ["LeftArm", "x", -40], ["LeftForeArm", "x", -70], ["LeftHand", "y", 35], ["Head", "y", 25], ["Head", "x", 15]], hips: LEVITATE - 0.03 },
    { t: 5.0, pose: [...FLOAT, ["Head", "y", -25]], hips: LEVITATE + 0.04 },
    { t: 6.3, pose: [...FLOAT, ["Spine2", "x", -4]], hips: LEVITATE - 0.02 },
    { t: 7.33, pose: FALL, hips: LEVITATE },
  ] },
  descent: { duration: 4.4, keys: [
    { t: 0, pose: FALL, hips: LEVITATE },
    { t: 1.167, pose: LANDING, hips: -0.32, ease: "in" },
    { t: 1.5, pose: LANDING, hips: -0.37, ease: "out" },
    { t: 2.6, pose: [...LANDING.filter(([b]) => b !== "Head"), ["Head", "x", -28]], hips: -0.34 },
    { t: 3.6, pose: RISING, hips: -0.12 },
    { t: 4.4, pose: STAND, hips: 0, ease: "out" },
  ] },
  idle: { duration: 1.83, keys: [
    { t: 0, pose: STAND, hips: 0 },
    { t: 0.915, pose: [["LeftArm", "z", -32], ["RightArm", "z", 32], ["Spine2", "x", 2], ["Head", "x", 2]], hips: 0.004 },
    { t: 1.83, pose: STAND, hips: 0 },
  ] },
};

const EASE = {
  linear: (u) => u,
  in: (u) => u * u,
  out: (u) => 1 - (1 - u) * (1 - u),
  inout: (u) => u * u * (3 - 2 * u),
};

const CACHE = new WeakMap();

/** Clips du personnage pour une scène glTF chargée, construits une seule fois (avant toute animation). */
export function clipsFor(scene) {
  if (!CACHE.has(scene)) {
    CACHE.set(scene, Object.values(buildClips(scene).clips));
    readySkinned(scene);
  }
  return CACHE.get(scene);
}

/**
 * Prépare un rig pour la mesure : matrices d'os à jour, puis boîte englobante figée en pose de liaison.
 * Sans ça, Box3.setFromObject(…, true) et <Center> (précis par défaut) lisent des matrices d'os périmées
 * dès que le rig est reparenté, et décentrent le personnage. Mesurer ensuite en mode non précis.
 */
export function readySkinned(object) {
  object.updateMatrixWorld(true);
  object.traverse((o) => {
    if (!o.isSkinnedMesh) return;
    o.skeleton.update();
    if (!o.geometry.attributes.position) return;
    o.computeBoundingBox();
    o.computeBoundingSphere();
  });
  return object;
}

/** Construit les AnimationClip three pour un rig chargé (scène non tournée, pose de liaison). */
export function buildClips(scene, defs = CLIPS) {
  scene.updateMatrixWorld(true);
  const bones = bonesByName(scene);
  const hips = bones.Hips;
  // hauteur des hanches au-dessus des pieds, en unités du monde, et passage monde -> repère du parent des hanches
  let minY = Infinity;
  scene.traverse((o) => {
    if (o.isBone && /Toe|Foot/.test(o.name)) minY = Math.min(minY, o.getWorldPosition(new Vector3()).y);
  });
  const hipsW = hips.getWorldPosition(new Vector3());
  const hipsH = hipsW.y - minY;
  const toParent = new Matrix3().setFromMatrix4(hips.parent.matrixWorld.clone().invert());
  const up = new Vector3(0, 1, 0).applyMatrix3(toParent);
  const bindPos = hips.position.clone();
  const names = Object.keys(bones);
  const out = {};
  for (const [name, def] of Object.entries(defs)) {
    const keyQ = def.keys.map((k) => poseQuaternions(bones, k.pose));
    const frames = Math.round(def.duration * FPS);
    const times = [];
    const quat = Object.fromEntries(names.map((n) => [n, []]));
    const pos = [];
    for (let f = 0; f <= frames; f++) {
      const t = Math.min(def.duration, f / FPS);
      let i = 0;
      while (i < def.keys.length - 2 && t > def.keys[i + 1].t) i++;
      const a = def.keys[i], b = def.keys[i + 1];
      const raw = Math.min(1, Math.max(0, (t - a.t) / Math.max(1e-6, b.t - a.t)));
      const u = EASE[b.ease || "inout"](raw);
      times.push(t);
      for (const n of names) {
        const bind = bones[n].quaternion; // poseQuaternions restaure la liaison
        const qa = keyQ[i][n] || bind, qb = keyQ[i + 1][n] || bind;
        const q = qa.clone().slerp(qb, u);
        quat[n].push(q.x, q.y, q.z, q.w);
      }
      const dy = (a.hips + (b.hips - a.hips) * u) * hipsH;
      const p = bindPos.clone().addScaledVector(up, dy);
      pos.push(p.x, p.y, p.z);
    }
    const tracks = names.map((n) => new QuaternionKeyframeTrack(`${bones[n].name}.quaternion`, times, quat[n]));
    tracks.push(new VectorKeyframeTrack(`${hips.name}.position`, times, pos));
    out[name] = new AnimationClip(name, def.duration, tracks);
  }
  return { clips: out, hipsH };
}
