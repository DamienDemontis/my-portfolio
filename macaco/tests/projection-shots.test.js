// Salle de projection : plans valides, paliers de caméra calés sur les projets, et cadrage
// vérifié par le calcul (le centre de l'écran, et sa tête là où le plan la montre, tombent
// dans l'image en paysage 1440 × 900 comme en portrait 390 × 844).
import { PerspectiveCamera, Vector3 } from 'three'
import { checkShots, shotAt } from '../src/three/cinematic/shots.js'
import { PROJECT_ANCHORS } from '../src/three/projection/steps.js'
import { PROJECTION_SHOTS, PROJECTION_STILL, REVERSE_AT, ROOM, SHOULDER_AT } from '../src/three/projection/layout.js'

const ECRANS = { wide: 1440 / 900, narrow: 390 / 844 }
const DEG = Math.PI / 180

// Même placement que la caméra du canvas : le haut, lookAt, puis le roll.
function camera(pose, aspect) {
  const c = new PerspectiveCamera(pose.fov, aspect, 0.05, 200)
  c.position.fromArray(pose.pos)
  c.up.fromArray(pose.up)
  c.lookAt(...pose.look)
  if (pose.roll) c.rotateZ(pose.roll * DEG)
  c.updateProjectionMatrix()
  c.updateMatrixWorld(true)
  return c
}

const dansLeCadre = (cam, point, marge = 0.9) => {
  const v = new Vector3().fromArray(point).project(cam)
  return Math.abs(v.x) <= marge && Math.abs(v.y) <= marge && v.z > -1 && v.z < 1
}

test('both framings pass checkShots, with the still shot', () => {
  expect(() => checkShots(PROJECTION_SHOTS, PROJECTION_STILL)).not.toThrow()
})

test('every project anchor is a camera anchor, in both framings', () => {
  for (const liste of Object.values(PROJECTION_SHOTS)) {
    const ancres = liste.map((s) => s.at)
    for (const a of PROJECT_ANCHORS) expect(ancres).toContain(a)
  }
})

for (const [cadrage, aspect] of Object.entries(ECRANS)) {
  test(`${cadrage}: the screen is in frame on every project step`, () => {
    for (const a of PROJECT_ANCHORS) {
      const cam = camera(shotAt(PROJECTION_SHOTS[cadrage], a), aspect)
      expect(dansLeCadre(cam, ROOM.screen.center), `palier ${a}`).toBe(true)
    }
  })

  test(`${cadrage}: his head and the screen over the shoulder, his face in the reverse shot`, () => {
    const epaule = camera(shotAt(PROJECTION_SHOTS[cadrage], SHOULDER_AT), aspect)
    expect(dansLeCadre(epaule, ROOM.screen.center)).toBe(true)
    expect(dansLeCadre(epaule, ROOM.character.head, 1)).toBe(true)
    const contre = camera(shotAt(PROJECTION_SHOTS[cadrage], REVERSE_AT), aspect)
    expect(dansLeCadre(contre, ROOM.character.head, 0.6)).toBe(true)
  })
}
