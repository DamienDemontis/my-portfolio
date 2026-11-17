import { describe, it, expect } from 'vitest'
import { Bone, Object3D, Quaternion, Vector3 } from 'three'
import { SCENES } from '../src/content/scenes.js'
import { SCENE_POSES, bindQuaternion, bonesByName, poseQuaternions, blendPose } from '../src/three/character/poses.js'

// Hiérarchie synthétique : Hips -> Spine -> LeftArm -> LeftForeArm -> LeftHand.
function makeRig() {
  const root = new Object3D()
  const mk = (name, parent, x, y = 0) => {
    const b = new Bone()
    b.name = name
    b.position.set(x, y, 0)
    parent.add(b)
    return b
  }
  const hips = mk('mixamorigHips', root, 0, 1)
  const spine = mk('mixamorigSpine', hips, 0, 0.3)
  const arm = mk('mixamorigLeftArm', spine, 0.2)
  const fore = mk('mixamorigLeftForeArm', arm, 0.25)
  const hand = mk('mixamorigLeftHand', fore, 0.25)
  root.updateMatrixWorld(true)
  return { root, bones: bonesByName(root), hand }
}

const handY = (hand) => hand.getWorldPosition(new Vector3()).y

describe('SCENE_POSES', () => {
  it('has one pose per scene', () => {
    expect(Object.keys(SCENE_POSES)).toEqual(SCENES.map((s) => s.id))
  })

  it('cameras are sane', () => {
    for (const { camera, yaw } of Object.values(SCENE_POSES)) {
      expect(Number.isFinite(yaw)).toBe(true)
      for (const v of [...camera.pos, ...camera.look, camera.fov]) expect(Number.isFinite(v)).toBe(true)
      expect(camera.fov).toBeGreaterThanOrEqual(20)
      expect(camera.fov).toBeLessThanOrEqual(60)
      expect(camera.look[1]).toBeGreaterThanOrEqual(0)
      expect(camera.look[1]).toBeLessThanOrEqual(1.8)
    }
  })
})

describe('poseQuaternions', () => {
  it('applies a rotation in world axes and restores bind', () => {
    const { root, bones, hand } = makeRig()
    const before = handY(hand)
    const q = poseQuaternions(bones, [['LeftArm', 'z', -45]])
    for (const b of Object.values(bones)) expect(b.quaternion.angleTo(bindQuaternion(b))).toBeLessThan(1e-6)
    expect(handY(hand)).toBeCloseTo(before, 9)
    blendPose(bones, {}, q, 1)
    root.updateMatrixWorld(true)
    expect(handY(hand)).toBeLessThan(before)
  })
})

describe('bind pose', () => {
  // Object3D.clone copie userData en passant par JSON : une liaison rangée là
  // deviendrait un tableau et les poses de la copie seraient NaN.
  it('survives cloning the rig after bonesByName', () => {
    const { root } = makeRig()
    const copie = root.clone()
    const bones = bonesByName(copie)
    const main = copie.getObjectByName('mixamorigLeftHand')
    const avant = handY(main)
    const q = poseQuaternions(bones, [['LeftArm', 'z', -45]])
    for (const t of [0, 0.5, 1]) {
      blendPose(bones, {}, q, t)
      for (const b of Object.values(bones)) {
        const { x, y, z, w } = b.quaternion
        expect([x, y, z, w].every(Number.isFinite)).toBe(true)
      }
    }
    copie.updateMatrixWorld(true)
    expect(handY(main)).toBeLessThan(avant)
  })
})

describe('blendPose', () => {
  it('blends between two poses', () => {
    const { bones } = makeRig()
    const a = poseQuaternions(bones, [['LeftArm', 'z', -30]])
    const b = poseQuaternions(bones, [['LeftArm', 'z', -60]])
    const bind = bindQuaternion(bones.LeftArm)
    blendPose(bones, a, b, 0)
    expect(bones.LeftArm.quaternion.angleTo(a.LeftArm)).toBeLessThan(1e-6)
    blendPose(bones, a, b, 1)
    expect(bones.LeftArm.quaternion.angleTo(b.LeftArm)).toBeLessThan(1e-6)
    blendPose(bones, a, b, 0.5)
    const half = a.LeftArm.angleTo(b.LeftArm) / 2
    expect(bones.LeftArm.quaternion.angleTo(a.LeftArm)).toBeCloseTo(half, 6)
    expect(bones.LeftArm.quaternion.angleTo(b.LeftArm)).toBeCloseTo(half, 6)
    // un os absent d'une pose reprend sa liaison
    blendPose(bones, {}, a, 0)
    expect(bones.LeftArm.quaternion.angleTo(bind)).toBeLessThan(1e-6)
    expect(bones.Spine.quaternion.angleTo(bindQuaternion(bones.Spine))).toBeLessThan(1e-6)
  })
})
