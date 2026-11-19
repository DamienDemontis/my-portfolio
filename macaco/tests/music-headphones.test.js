// Le casque posé sur la tête : entre les oreilles, dans le repère du personnage (où qu'il
// regarde dans la salle), une seule fois par personnage, puis emporté par l'os de la tête.
import { Bone, Object3D, Quaternion, Vector3 } from 'three'
import { HEAD_OFFSET, createHeadphones, fitHeadphones } from '../src/three/music/headphones.js'

// Un personnage comme celui de la scène : groupe de la salle (tourné de `yaw`), groupe
// d'échelle, racine du rig, armature Mixamo couchée au centième, os de la tête.
function personnage(yaw = 0) {
  const salle = new Object3D()
  salle.position.set(0.4, 0, -0.3)
  salle.rotation.y = yaw
  const echelle = new Object3D()
  echelle.scale.setScalar(1.7)
  echelle.position.set(0.02, 0.01, 0)
  const rig = new Object3D()
  const armature = new Object3D()
  armature.rotation.x = Math.PI / 2
  armature.scale.setScalar(0.01)
  const hanches = new Bone()
  hanches.name = 'mixamorigHips'
  hanches.position.set(0, 0, 95)
  const tete = new Bone()
  tete.name = 'mixamorigHead'
  tete.position.set(0, 2, 60)
  tete.rotation.set(-1.4, 0.1, 0.05)
  salle.add(echelle)
  echelle.add(rig)
  rig.add(armature)
  armature.add(hanches)
  hanches.add(tete)
  return { salle, rig, tete }
}

const monde = (o) => {
  o.updateWorldMatrix(true, false)
  const p = new Vector3()
  const q = new Quaternion()
  const s = new Vector3()
  o.matrixWorld.decompose(p, q, s)
  return { p, q, s }
}

test('the headphones sit on the head, in the character frame, at world scale', () => {
  for (const yaw of [0, Math.PI / 2, -2.3]) {
    const { rig, tete } = personnage(yaw)
    const casque = createHeadphones()
    expect(fitHeadphones(casque.group, rig)).toBe(tete)
    expect(casque.group.parent).toBe(tete)

    const racine = monde(rig).q
    const attendu = monde(tete).p.add(new Vector3(...HEAD_OFFSET).applyQuaternion(racine))
    const c = monde(casque.group)
    expect(c.p.distanceTo(attendu)).toBeLessThan(1e-6)
    // orienté comme le personnage, pas comme la salle
    expect(c.q.angleTo(racine)).toBeLessThan(1e-6)
    expect(c.s.x).toBeCloseTo(1, 6)
    expect(c.s.y).toBeCloseTo(1, 6)
    casque.dispose()
  }
})

test('a replayed effect does not re-fit the headphones on an animated head', () => {
  const { rig, tete } = personnage(0.7)
  const premier = createHeadphones()
  fitHeadphones(premier.group, rig)
  premier.group.updateMatrix()
  const local = premier.group.matrix.clone()
  premier.group.removeFromParent()

  // le mélangeur a bougé la tête entre-temps
  tete.rotation.x += 0.4
  tete.rotation.z -= 0.2
  const second = createHeadphones()
  fitHeadphones(second.group, rig)
  second.group.updateMatrix()
  expect(second.group.parent).toBe(tete)
  expect(second.group.matrix.equals(local)).toBe(true)
  premier.dispose()
  second.dispose()
})

test('without a head bone, it says so and leaves the headphones alone', () => {
  const avertir = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const casque = createHeadphones()
  expect(fitHeadphones(casque.group, new Object3D())).toBeNull()
  expect(casque.group.parent).toBeNull()
  expect(avertir).toHaveBeenCalledTimes(1)
  avertir.mockRestore()
  casque.dispose()
})
