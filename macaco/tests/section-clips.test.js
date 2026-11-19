// Animations des sections : cuites comme celles de l'intro, en boucle sans couture, et sans
// toucher aux clips de l'intro.
import { Bone, Group, Skeleton, SkinnedMesh, BufferGeometry, MeshBasicMaterial } from 'three'
import { CLIPS } from '../src/three/character/clips.js'
import { SECTION_CLIPS, sectionClipsFor } from '../src/three/character/sectionClips.js'

const NOMS = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head', 'LeftArm', 'LeftForeArm', 'RightArm', 'RightForeArm',
  'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'RightUpLeg', 'RightLeg', 'RightFoot']
const PARENT = { Spine: 'Hips', Spine1: 'Spine', Spine2: 'Spine1', Neck: 'Spine2', Head: 'Neck',
  LeftArm: 'Spine2', LeftForeArm: 'LeftArm', RightArm: 'Spine2', RightForeArm: 'RightArm',
  LeftUpLeg: 'Hips', LeftLeg: 'LeftUpLeg', LeftFoot: 'LeftLeg', RightUpLeg: 'Hips', RightLeg: 'RightUpLeg', RightFoot: 'RightLeg' }
const OFFSET = { Hips: [0, 1, 0], Spine: [0, 0.1, 0], Spine1: [0, 0.12, 0], Spine2: [0, 0.12, 0], Neck: [0, 0.15, 0], Head: [0, 0.1, 0],
  LeftArm: [0.17, 0.1, 0], LeftForeArm: [0.28, 0, 0], RightArm: [-0.17, 0.1, 0], RightForeArm: [-0.28, 0, 0],
  LeftUpLeg: [0.1, -0.05, 0], LeftLeg: [0, -0.45, 0], LeftFoot: [0, -0.42, 0],
  RightUpLeg: [-0.1, -0.05, 0], RightLeg: [0, -0.45, 0], RightFoot: [0, -0.42, 0] }

function rig() {
  const root = new Group()
  const bones = {}
  for (const n of NOMS) {
    const b = new Bone()
    b.name = `mixamorig${n}`
    b.position.fromArray(OFFSET[n])
    bones[n] = b
  }
  for (const n of NOMS) (PARENT[n] ? bones[PARENT[n]] : root).add(bones[n])
  const mesh = new SkinnedMesh(new BufferGeometry(), new MeshBasicMaterial())
  mesh.bind(new Skeleton(NOMS.map((n) => bones[n])))
  root.add(mesh)
  root.updateMatrixWorld(true)
  return { root, bones }
}

test('the intro clips are untouched', () => {
  expect(Object.keys(CLIPS).sort()).toEqual(['build', 'descent', 'idle', 'power_on'])
})

test('watch: a slow loop baked at 30 fps with finite values', () => {
  const { root } = rig()
  const watch = sectionClipsFor(root).find((c) => c.name === 'watch')
  expect(watch.duration).toBe(SECTION_CLIPS.watch.duration)
  expect(watch.duration).toBeGreaterThanOrEqual(3)
  const frames = Math.round(watch.duration * 30) + 1
  for (const track of watch.tracks) {
    expect(track.times.length).toBe(frames)
    expect(track.values.every(Number.isFinite)).toBe(true)
    const k = track.getValueSize()
    Array.from(track.values.slice(0, k)).forEach((v, i) => expect(v).toBeCloseTo(track.values[track.values.length - k + i], 6))
  }
})

test('leaves the rig in its bind pose and caches per scene', () => {
  const { root, bones } = rig()
  const avant = NOMS.map((n) => bones[n].quaternion.clone())
  const a = sectionClipsFor(root)
  NOMS.forEach((n, i) => expect(bones[n].quaternion.angleTo(avant[i])).toBeLessThan(1e-9))
  expect(sectionClipsFor(root)).toBe(a)
})
