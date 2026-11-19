// Animations des sections : cuites comme celles de l'intro, en boucle sans couture, et sans
// toucher aux clips de l'intro.
import { Bone, Group, Skeleton, SkinnedMesh, BufferGeometry, MeshBasicMaterial } from 'three'
import { CLIPS } from '../src/three/character/clips.js'
import { bonesByName } from '../src/three/character/poses.js'
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

// Rig synthétique en pose de liaison, et le parser glTF qui la décrit : un nœud par os
// (translation, rotation), associé à l'os comme le fait GLTFLoader.
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
  const parser = { associations: new Map(), json: { nodes: [] } }
  for (const n of NOMS) {
    parser.associations.set(bones[n], { nodes: parser.json.nodes.length })
    parser.json.nodes.push({ translation: bones[n].position.toArray(), rotation: bones[n].quaternion.toArray() })
  }
  return { root, bones, parser }
}

// La pose que l'intro laisse à la scène partagée : hanches soulevées et décalées (lévitation),
// genoux pliés, tête tournée. Comme dans l'intro, la liaison est d'abord mémorisée (clipsFor
// passe par bonesByName avant toute animation).
function poseVivante(root, bones) {
  bonesByName(root)
  bones.Hips.position.set(0.3, 3.6, -0.2)
  bones.LeftUpLeg.rotation.x = -0.8
  bones.LeftLeg.rotation.x = 0.8
  bones.RightUpLeg.rotation.x = -0.1
  bones.RightLeg.rotation.x = 0.7
  bones.Head.rotation.y = 0.4
}

test('the intro clips are untouched', () => {
  expect(Object.keys(CLIPS).sort()).toEqual(['build', 'descent', 'idle', 'power_on'])
})

test('watch: a slow loop baked at 30 fps with finite values', () => {
  const { root, parser } = rig()
  const watch = sectionClipsFor(root, parser).find((c) => c.name === 'watch')
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

test('watch is baked on the bind pose, whatever live pose the shared scene holds', () => {
  const liaison = rig()
  const attendu = sectionClipsFor(liaison.root, liaison.parser).find((c) => c.name === 'watch')
  const vivant = rig()
  poseVivante(vivant.root, vivant.bones)
  vivant.root.updateMatrixWorld(true)
  const watch = sectionClipsFor(vivant.root, vivant.parser).find((c) => c.name === 'watch')
  expect(watch.tracks.map((t) => t.name)).toEqual(attendu.tracks.map((t) => t.name))
  watch.tracks.forEach((track, i) => {
    expect(track.values.length).toBe(attendu.tracks[i].values.length)
    track.values.forEach((v, j) => expect(v, `${track.name}[${j}]`).toBeCloseTo(attendu.tracks[i].values[j], 9))
  })
  // Les hanches restent à leur hauteur de liaison (au souffle près), pas à celle de la lévitation.
  const hanches = watch.tracks.find((t) => t.name === 'mixamorigHips.position')
  for (let j = 1; j < hanches.values.length; j += 3) expect(Math.abs(hanches.values[j] - 1)).toBeLessThan(0.01)
})

test('leaves the shared scene in its live pose and caches per scene', () => {
  const { root, bones, parser } = rig()
  poseVivante(root, bones)
  root.updateMatrixWorld(true)
  const quaternions = NOMS.map((n) => bones[n].quaternion.clone())
  const hanches = bones.Hips.position.clone()
  const a = sectionClipsFor(root, parser)
  // Égalité exacte : la scène n'est pas touchée (angleTo, par son acos, ne descend pas sous ~1e-8).
  NOMS.forEach((n, i) => expect(bones[n].quaternion.equals(quaternions[i]), n).toBe(true))
  expect(bones.Hips.position.equals(hanches)).toBe(true)
  expect(sectionClipsFor(root, parser)).toBe(a)
})

test.each(['listen', 'listen_beat'])('%s: baked at 30 fps, finite, looping seamlessly', (nom) => {
  const { root, parser } = rig()
  const clip = sectionClipsFor(root, parser).find((c) => c.name === nom)
  expect(clip.duration).toBe(SECTION_CLIPS[nom].duration)
  const frames = Math.round(clip.duration * 30) + 1
  for (const track of clip.tracks) {
    expect(track.times.length).toBe(frames)
    expect(track.values.every(Number.isFinite)).toBe(true)
    const k = track.getValueSize()
    Array.from(track.values.slice(0, k)).forEach((v, i) => expect(v).toBeCloseTo(track.values[track.values.length - k + i], 6))
  }
})
