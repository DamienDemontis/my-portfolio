// Le casque, en géométrie simple : un arceau qui passe sur la tête, deux coques, un liseré néon
// cuivre autour de chaque coque. Construit en mètres, centré entre les oreilles, arceau vers +y,
// coques sur l'axe x (le personnage regarde vers +z).
import { CylinderGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, TorusGeometry } from 'three'

/** Demi-écart entre les coques (m), centre à centre. */
export const CUP_OFFSET = 0.089

/**
 * Crée le casque. `neon` : couleur du liseré (émissive, au-dessus de 1 pour le bloom).
 * Renvoie { group, dispose }.
 */
export function createHeadphones({ neon = '#ff8a4c', intensity = 4 } = {}) {
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
  const liseréGeo = new TorusGeometry(0.045, 0.0032, 8, 40)
  for (const cote of [-1, 1]) {
    const coque = new Mesh(coqueGeo, metal)
    coque.rotation.z = Math.PI / 2
    coque.position.x = cote * CUP_OFFSET
    group.add(coque)
    const coussin = new Mesh(coussinGeo, mousse)
    coussin.rotation.z = Math.PI / 2
    coussin.position.x = cote * (CUP_OFFSET - 0.024)
    group.add(coussin)
    const liseré = new Mesh(liseréGeo, lueur)
    liseré.rotation.y = Math.PI / 2
    liseré.position.x = cote * (CUP_OFFSET + 0.019)
    group.add(liseré)
  }
  group.traverse((o) => {
    if (o.isMesh) o.frustumCulled = false
  })

  return {
    group,
    neonMaterial: lueur,
    dispose() {
      for (const g of [arceauGeo, coqueGeo, coussinGeo, liseréGeo]) g.dispose()
      for (const m of [metal, mousse, lueur]) m.dispose()
    },
  }
}
