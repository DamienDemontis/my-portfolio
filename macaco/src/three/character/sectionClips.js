// Animations du personnage dans les sections (une par section, storyboard v6), écrites comme
// celles de l'intro (clips.js) : poses clés en axes du monde, cuites à 30 images/s. Les clips
// de l'intro gardent leurs noms et durées ; ceux-ci vivent à part.
import { Matrix4 } from "three";
import { buildClips } from "./clips.js";

// Debout, bras le long du manteau, avant-bras un peu pliés : les mains près des poches.
const MAINS_POCHES = [
  ["LeftArm", "z", -40], ["LeftArm", "x", 6], ["LeftForeArm", "x", -14],
  ["RightArm", "z", 40], ["RightArm", "x", 6], ["RightForeArm", "x", -14],
];

// Le poids sur la jambe droite, le genou gauche relâché.
const APPUI = [["LeftUpLeg", "x", -4], ["LeftLeg", "x", 8], ["Spine", "z", -1.5]];

export const SECTION_CLIPS = {
  // Projets : il regarde l'écran. Une respiration lente, la tête qui suit l'image.
  watch: { duration: 4, keys: [
    { t: 0, pose: [...MAINS_POCHES, ...APPUI, ["Head", "x", 3]], hips: 0 },
    { t: 1.6, pose: [...MAINS_POCHES, ...APPUI, ["Spine2", "x", -1.5], ["Head", "x", 1], ["Head", "y", 4]], hips: 0.004 },
    { t: 2.9, pose: [...MAINS_POCHES, ...APPUI, ["Spine2", "x", -0.5], ["Head", "x", 4], ["Head", "y", -2], ["Head", "z", 2]], hips: 0.002 },
    { t: 4, pose: [...MAINS_POCHES, ...APPUI, ["Head", "x", 3]], hips: 0 },
  ] },
  // Musique, sans son : il écoute, la tête un peu penchée, un balancement lent.
  listen: { duration: 3.2, keys: [
    { t: 0, pose: [...MAINS_POCHES, ...APPUI, ["Head", "x", 8], ["Head", "z", -3]], hips: 0 },
    { t: 1.6, pose: [...MAINS_POCHES, ...APPUI, ["Spine2", "z", 1.5], ["Head", "x", 10], ["Head", "z", 2]], hips: 0.003 },
    { t: 3.2, pose: [...MAINS_POCHES, ...APPUI, ["Head", "x", 8], ["Head", "z", -3]], hips: 0 },
  ] },
  // Musique, en écoute : la tête bat la mesure, les épaules suivent. Deux temps en 32 images
  // (112,5 bpm), une durée multiple de l'image pour une boucle exacte. La scène le mêle à
  // `listen` selon la lecture.
  listen_beat: { duration: 32 / 30, keys: [
    { t: 0, pose: [...MAINS_POCHES, ...APPUI, ["Head", "x", 2], ["Neck", "x", 1]], hips: 0.004 },
    { t: 8 / 30, pose: [...MAINS_POCHES, ...APPUI, ["Spine2", "x", 2], ["Neck", "x", 5], ["Head", "x", 14], ["LeftShoulder", "z", 3], ["RightShoulder", "z", -3]], hips: -0.004, ease: "in" },
    { t: 16 / 30, pose: [...MAINS_POCHES, ...APPUI, ["Head", "x", 2], ["Neck", "x", 1]], hips: 0.004, ease: "out" },
    { t: 24 / 30, pose: [...MAINS_POCHES, ...APPUI, ["Spine2", "x", 2], ["Neck", "x", 5], ["Head", "x", 13], ["Head", "z", 3], ["LeftShoulder", "z", 3], ["RightShoulder", "z", -3]], hips: -0.004, ease: "in" },
    { t: 32 / 30, pose: [...MAINS_POCHES, ...APPUI, ["Head", "x", 2], ["Neck", "x", 1]], hips: 0.004, ease: "out" },
  ] },
};

const CACHE = new WeakMap();

/**
 * Remet un rig (la scène glTF ou un clone) dans la pose de liaison : chaque os reprend la
 * transformation de son nœud (parser.json.nodes), retrouvé par son nom dans `source`, la scène
 * chargée. La scène partagée (cache de useGLTF) garde la pose que l'intro lui a laissée, que
 * clone() copie. Pas de Skeleton.pose() : il donne à l'os racine (les hanches) sa matrice de
 * liaison comme s'il n'avait pas de parent, alors que l'armature, au-dessus, est tournée.
 */
export function poseDeLiaison(rig, source, parser) {
  const noeuds = new Map();
  source.traverse((o) => {
    const n = o.isBone ? parser.associations.get(o)?.nodes : undefined;
    if (n !== undefined) noeuds.set(o.name, parser.json.nodes[n]);
  });
  rig.traverse((o) => {
    const n = o.isBone ? noeuds.get(o.name) : undefined;
    if (!n) return;
    if (n.matrix) new Matrix4().fromArray(n.matrix).decompose(o.position, o.quaternion, o.scale);
    else {
      o.position.fromArray(n.translation ?? [0, 0, 0]);
      o.quaternion.fromArray(n.rotation ?? [0, 0, 0, 1]);
      o.scale.fromArray(n.scale ?? [1, 1, 1]);
    }
  });
  return rig;
}

/**
 * Clips des sections pour une scène glTF chargée (et son parser), cuits une seule fois par
 * scène sur une copie remise en pose de liaison. La scène partagée garde la pose vivante de
 * l'intro (lévitation, genoux pliés) : buildClips y lirait une fausse position des hanches et
 * une fausse hauteur des pieds. Elle n'est pas touchée. La copie est un clone simple (ses os
 * suffisent à la cuisson) ; les pistes visent les os par leur nom et valent pour tout clone.
 */
export function sectionClipsFor(scene, parser) {
  if (!CACHE.has(scene)) {
    const liaison = poseDeLiaison(scene.clone(), scene, parser);
    CACHE.set(scene, Object.values(buildClips(liaison, SECTION_CLIPS).clips));
  }
  return CACHE.get(scene);
}
