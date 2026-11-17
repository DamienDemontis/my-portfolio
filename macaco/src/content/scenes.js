// Manifeste des scenes : source unique du texte. JS pur, sans aucun import,
// pour que le script de prerendu Node puisse le charger tel quel.
const IDS = ['ouverture', 'metier', 'construire', 'musique', 'coree', 'vivant', 'transmission', 'sortie']

export const SCENES = IDS.map((id, i) => ({
  id,
  progress: i / (IDS.length - 1),
  titleKey: `scenes.${id}.title`,
  bodyKey: `scenes.${id}.body`,
}))

export function sceneText(scene, t) {
  return { title: t(scene.titleKey), body: t(scene.bodyKey) }
}
