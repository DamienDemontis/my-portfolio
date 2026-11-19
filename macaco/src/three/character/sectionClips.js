// Animations du personnage dans les sections (une par section, storyboard v6), écrites comme
// celles de l'intro (clips.js) : poses clés en axes du monde, cuites à 30 images/s. Les clips
// de l'intro gardent leurs noms et durées ; ceux-ci vivent à part.
import { buildClips, readySkinned } from "./clips.js";

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
};

const CACHE = new WeakMap();

/** Clips des sections pour une scène glTF chargée, construits une seule fois (pose de liaison). */
export function sectionClipsFor(scene) {
  if (!CACHE.has(scene)) {
    CACHE.set(scene, Object.values(buildClips(scene, SECTION_CLIPS).clips));
    readySkinned(scene);
  }
  return CACHE.get(scene);
}
