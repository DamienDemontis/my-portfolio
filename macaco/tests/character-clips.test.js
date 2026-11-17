// Animations du personnage : mêmes noms et durées que les clips du mécha d'origine (les plans de caméra
// de l'intro en dépendent), une chute puis une réception calée sur la secousse, rien de non fini.
import { Bone, Group, Skeleton, SkinnedMesh, BufferGeometry, MeshBasicMaterial, Vector3 } from 'three'
import { CLIPS, buildClips, clipsFor } from '../src/three/character/clips.js'
import { config } from '../src/config.js'

const NOMS = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head',
  'LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand', 'RightShoulder', 'RightArm', 'RightForeArm', 'RightHand',
  'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase', 'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase']
const PARENT = { Spine: 'Hips', Spine1: 'Spine', Spine2: 'Spine1', Neck: 'Spine2', Head: 'Neck',
  LeftShoulder: 'Spine2', LeftArm: 'LeftShoulder', LeftForeArm: 'LeftArm', LeftHand: 'LeftForeArm',
  RightShoulder: 'Spine2', RightArm: 'RightShoulder', RightForeArm: 'RightArm', RightHand: 'RightForeArm',
  LeftUpLeg: 'Hips', LeftLeg: 'LeftUpLeg', LeftFoot: 'LeftLeg', LeftToeBase: 'LeftFoot',
  RightUpLeg: 'Hips', RightLeg: 'RightUpLeg', RightFoot: 'RightLeg', RightToeBase: 'RightFoot' }
const OFFSET = { Hips: [0, 1, 0], Spine: [0, 0.1, 0], Spine1: [0, 0.12, 0], Spine2: [0, 0.12, 0], Neck: [0, 0.15, 0], Head: [0, 0.1, 0],
  LeftShoulder: [0.05, 0.1, 0], LeftArm: [0.12, 0, 0], LeftForeArm: [0.28, 0, 0], LeftHand: [0.25, 0, 0],
  RightShoulder: [-0.05, 0.1, 0], RightArm: [-0.12, 0, 0], RightForeArm: [-0.28, 0, 0], RightHand: [-0.25, 0, 0],
  LeftUpLeg: [0.1, -0.05, 0], LeftLeg: [0, -0.45, 0], LeftFoot: [0, -0.42, 0], LeftToeBase: [0, -0.06, 0.1],
  RightUpLeg: [-0.1, -0.05, 0], RightLeg: [0, -0.45, 0], RightFoot: [0, -0.42, 0], RightToeBase: [0, -0.06, 0.1] }

// Rig synthétique au nommage de GLTFLoader (« mixamorigHips »), sous une racine tournée comme un export Z-up.
function rig() {
  const root = new Group()
  root.rotation.x = -Math.PI / 2
  const bones = {}
  for (const n of NOMS) {
    const b = new Bone()
    b.name = `mixamorig${n}`
    b.position.fromArray(OFFSET[n])
    bones[n] = b
  }
  for (const n of NOMS) (PARENT[n] ? bones[PARENT[n]] : root).add(bones[n])
  // la racine Z-up : on tourne les hanches pour que le rig reste debout dans le monde
  bones.Hips.rotation.x = Math.PI / 2
  const mesh = new SkinnedMesh(new BufferGeometry(), new MeshBasicMaterial())
  mesh.bind(new Skeleton(NOMS.map(n => bones[n])))
  root.add(mesh)
  root.updateMatrixWorld(true)
  return { root, bones }
}

const hipsY = (clip, t, scene) => {
  const track = clip.tracks.find(tr => tr.name.endsWith('Hips.position'))
  const f = Math.round(t * 30)
  const hips = scene.getObjectByName('mixamorigHips')
  const local = new Vector3().fromArray(track.values, f * 3)
  return local.applyMatrix4(hips.parent.matrixWorld).y
}

test('keeps the mecha clip names and durations', () => {
  expect(Object.keys(CLIPS).sort()).toEqual(['build', 'descent', 'idle', 'power_on'])
  expect(CLIPS.power_on.duration).toBe(2.67)
  expect(CLIPS.build.duration).toBe(7.33)
  expect(CLIPS.descent.duration).toBe(4.4)
  expect(CLIPS.idle.duration).toBe(1.83)
})

test('bakes every bone at 30 fps with finite values', () => {
  const { root } = rig()
  const { clips } = buildClips(root)
  for (const clip of Object.values(clips)) {
    const frames = Math.round(clip.duration * 30) + 1
    for (const track of clip.tracks) {
      expect(track.times.length).toBe(frames)
      expect(track.values.every(Number.isFinite)).toBe(true)
    }
    expect(clip.tracks.filter(t => t.name.endsWith('.quaternion')).length).toBe(NOMS.length)
  }
})

test('the descent falls from above and touches down on the shake frame', () => {
  const { root } = rig()
  const { clips } = buildClips(root)
  const standing = root.getObjectByName('mixamorigHips').getWorldPosition(new Vector3()).y
  const impact = config.shake.atFrame / 30
  expect(hipsY(clips.descent, 0, root)).toBeGreaterThan(standing * 2)
  expect(hipsY(clips.descent, impact, root)).toBeLessThan(standing)
  expect(hipsY(clips.descent, impact - 0.2, root)).toBeGreaterThan(hipsY(clips.descent, impact, root))
  expect(Math.abs(hipsY(clips.descent, 4.4, root) - standing)).toBeLessThan(1e-6)
})

test('idle loops seamlessly', () => {
  const { root } = rig()
  const { clips } = buildClips(root)
  for (const track of clips.idle.tracks) {
    const n = track.getValueSize()
    const first = Array.from(track.values.slice(0, n))
    const last = Array.from(track.values.slice(-n))
    first.forEach((v, i) => expect(v).toBeCloseTo(last[i], 6))
  }
})

test('leaves the rig in its bind pose and caches per scene', () => {
  const { root, bones } = rig()
  const before = NOMS.map(n => bones[n].quaternion.clone())
  const a = clipsFor(root)
  NOMS.forEach((n, i) => expect(bones[n].quaternion.angleTo(before[i])).toBeLessThan(1e-9))
  expect(clipsFor(root)).toBe(a)
})
