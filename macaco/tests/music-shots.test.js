// Salle d'écoute : plans valides, et cadrage vérifié par le calcul (la coque du casque au très
// gros plan ; lui dans le cadre sur toute l'orbite, en paysage 1440 × 900 et en portrait
// 390 × 844, au-dessus du lecteur en portrait).
import { PerspectiveCamera, Vector3 } from 'three'
import { checkShots, shotAt } from '../src/three/cinematic/shots.js'
import { CUP_AT, LOW_AT, MUSIC_SHOTS, MUSIC_STILL, ORBIT_FROM, ORBIT_TO, ROOM, VERTIGO_AT } from '../src/three/music/layout.js'

const ECRANS = { wide: 1440 / 900, narrow: 390 / 844 }
const DEG = Math.PI / 180

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
const ndc = (cam, p) => new Vector3().fromArray(p).project(cam)
const dedans = (v, marge = 0.92) => Math.abs(v.x) <= marge && Math.abs(v.y) <= marge && v.z > -1 && v.z < 1
const TETE = ROOM.character.head
const BUSTE = [0, 1.25, 0]

test('both framings pass checkShots, with the still shot', () => {
  expect(() => checkShots(MUSIC_SHOTS, MUSIC_STILL)).not.toThrow()
})

test('both framings share their anchors', () => {
  expect(MUSIC_SHOTS.narrow.map((s) => s.at)).toEqual(MUSIC_SHOTS.wide.map((s) => s.at))
})

for (const [cadrage, aspect] of Object.entries(ECRANS)) {
  test(`${cadrage}: the extreme close-up holds the headphone cup`, () => {
    const cam = camera(shotAt(MUSIC_SHOTS[cadrage], CUP_AT), aspect)
    expect(dedans(ndc(cam, ROOM.cup), 0.6)).toBe(true)
  })

  test(`${cadrage}: he stays in frame all around the orbit`, () => {
    for (let k = 0; k <= 24; k++) {
      const p = ORBIT_FROM + ((ORBIT_TO - ORBIT_FROM) * k) / 24
      const cam = camera(shotAt(MUSIC_SHOTS[cadrage], p), aspect)
      expect(dedans(ndc(cam, TETE)), `p = ${p.toFixed(3)}`).toBe(true)
      expect(dedans(ndc(cam, BUSTE)), `p = ${p.toFixed(3)}`).toBe(true)
    }
  })

  test(`${cadrage}: his head in the low angle and through the dolly zoom`, () => {
    for (const p of [LOW_AT, VERTIGO_AT, (VERTIGO_AT + 1) / 2, 1]) {
      const cam = camera(shotAt(MUSIC_SHOTS[cadrage], p), aspect)
      expect(dedans(ndc(cam, TETE)), `p = ${p}`).toBe(true)
    }
  })
}

// En portrait, le lecteur occupe le bas de l'écran : sa tête reste dans la moitié haute.
test('narrow: his head stays above the player', () => {
  for (const p of [0.12, ORBIT_FROM, (ORBIT_FROM + ORBIT_TO) / 2, ORBIT_TO, LOW_AT, VERTIGO_AT, 1]) {
    const cam = camera(shotAt(MUSIC_SHOTS.narrow, p), ECRANS.narrow)
    expect(ndc(cam, TETE).y, `p = ${p}`).toBeGreaterThan(0.1)
  }
})
