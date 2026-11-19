// Le casque, en géométrie simple : un arceau qui passe sur la tête, deux coques, un liseré néon
// cuivre autour de chaque coque. Construit en mètres, centré entre les oreilles, arceau vers +y,
// coques sur l'axe x, dans le repère du personnage (il regarde vers +z).
import { CylinderGeometry, Group, Matrix4, Mesh, MeshBasicMaterial, MeshStandardMaterial, Quaternion, TorusGeometry, Vector3 } from 'three'
import { bonesByName } from '../character/poses.js'

/** Demi-écart entre les coques (m), centre à centre. */
export const CUP_OFFSET = 0.089
/** Couleur du liseré (sRGB) et son intensité (au-dessus de 1 pour le bloom). */
export const NEON = '#ff8a4c'
export const NEON_INTENSITY = 4
/** Centre du casque par rapport à l'os de la tête (m, repère du personnage). */
export const HEAD_OFFSET = [0, 0.088, 0.006]

/**
 * Crée le casque. `neon` : couleur du liseré (émissive, au-dessus de 1 pour le bloom).
 * Renvoie { group, neonMaterial, dispose }.
 */
export function createHeadphones({ neon = NEON, intensity = NEON_INTENSITY } = {}) {
  const metal = new MeshStandardMaterial({ color: '#141312', metalness: 0.65, roughness: 0.32 })
  const mousse = new MeshStandardMaterial({ color: '#0b0b0b', metalness: 0, roughness: 0.9 })
  const lueur = new MeshBasicMaterial({ color: neon, toneMapped: false })
  lueur.color.multiplyScalar(intensity)

  const group = new Group()
  group.name = 'casque'

  // Arceau : un demi-tore dans le plan x-y, au-dessus de la tête.
  const arceauGeo = new TorusGeometry(CUP_OFFSET + 0.004, 0.011, 10, 40, Math.PI)
  const arceau = new Mesh(arceauGeo, metal)
  arceau.position.y = 0.012
  group.add(arceau)

  const coqueGeo = new CylinderGeometry(0.043, 0.046, 0.034, 32)
  const coussinGeo = new CylinderGeometry(0.043, 0.043, 0.014, 28)
  const lisereGeo = new TorusGeometry(0.045, 0.0032, 8, 40)
  for (const cote of [-1, 1]) {
    const coque = new Mesh(coqueGeo, metal)
    coque.rotation.z = Math.PI / 2
    coque.position.x = cote * CUP_OFFSET
    group.add(coque)
    const coussin = new Mesh(coussinGeo, mousse)
    coussin.rotation.z = Math.PI / 2
    coussin.position.x = cote * (CUP_OFFSET - 0.024)
    group.add(coussin)
    const lisere = new Mesh(lisereGeo, lueur)
    lisere.rotation.y = Math.PI / 2
    lisere.position.x = cote * (CUP_OFFSET + 0.019)
    group.add(lisere)
  }
  group.traverse((o) => {
    if (o.isMesh) o.frustumCulled = false
  })

  return {
    group,
    neonMaterial: lueur,
    dispose() {
      for (const g of [arceauGeo, coqueGeo, coussinGeo, lisereGeo]) g.dispose()
      for (const m of [metal, mousse, lueur]) m.dispose()
    },
  }
}

// Place du casque sous l'os de la tête (matrice locale), calculée une fois par os : un effet
// rejoué (mode strict, remontage) la reprend telle quelle, sans la recalculer sur une tête
// que le mélangeur a déjà bougée.
const PLACES = new WeakMap()

/**
 * Pose le casque sur la tête de `rig` (encore en pose de liaison au premier appel) et le
 * rattache à l'os de la tête, qui l'emporte ensuite dans ses mouvements. Le centre est à
 * `offset` mètres de l'os et le casque est orienté dans le repère de la racine du rig (le
 * personnage, où qu'il regarde dans la salle), à l'échelle du monde (en mètres). Renvoie l'os
 * de la tête, ou null (avec un avertissement) s'il manque.
 */
export function fitHeadphones(group, rig, offset = HEAD_OFFSET) {
  const tete = bonesByName(rig).Head
  if (!tete) {
    console.warn("Casque : pas d'os Head dans le personnage, le casque n'est pas posé.")
    return null
  }
  let place = PLACES.get(tete)
  if (!place) {
    rig.updateWorldMatrix(true, true)
    const orientation = rig.getWorldQuaternion(new Quaternion())
    const centre = tete.getWorldPosition(new Vector3()).add(new Vector3(...offset).applyQuaternion(orientation))
    const voulue = new Matrix4().compose(centre, orientation, new Vector3(1, 1, 1))
    place = tete.matrixWorld.clone().invert().multiply(voulue)
    PLACES.set(tete, place)
  }
  place.decompose(group.position, group.quaternion, group.scale)
  tete.add(group)
  return tete
}
