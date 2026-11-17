// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SCENE_POSES } from '../src/three/character/poses.js'

const root = fileURLToPath(new URL('..', import.meta.url))

function skeletonNames() {
  const buf = readFileSync(join(root, 'assets-src/character/damien-tripo.glb'))
  const len = buf.readUInt32LE(12)
  const json = JSON.parse(buf.subarray(20, 20 + len).toString('utf8'))
  return new Set(json.skins[0].joints.map((j) => json.nodes[j].name.replace(/^mixamorig:?/, '')))
}

describe('SCENE_POSES', () => {
  it('only uses bones of the source skeleton', () => {
    const names = skeletonNames()
    expect(names.size).toBe(65)
    for (const [id, pose] of Object.entries(SCENE_POSES)) {
      for (const [bone] of pose.bones) expect(names.has(bone), `${id}: ${bone}`).toBe(true)
    }
  })
})
