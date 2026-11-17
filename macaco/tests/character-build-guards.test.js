// @vitest-environment node
// Le build refuse un export qu'il corromprait sans bruit : poids ou positions
// quantifiés (lus comme des entiers bruts), ou aucune primitive skinnée à corriger.
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Document, NodeIO } from '@gltf-transform/core'
import { buildCharacter } from '../scripts/character/build.mjs'

// Squelette Mixamo minimal : ce que le correctif de poids exige.
const OS = {
  Hips: [0, 1, 0],
  Spine: [0, 1.15, 0],
  Head: [0, 1.7, 0],
  LeftArm: [0.2, 1.45, 0],
  LeftForeArm: [0.45, 1.2, 0],
  LeftHand: [0.6, 1.0, 0],
  RightArm: [-0.2, 1.45, 0],
  RightForeArm: [-0.45, 1.2, 0],
  RightHand: [-0.6, 1.0, 0],
}

let dossier

beforeAll(() => {
  dossier = mkdtempSync(join(tmpdir(), 'damien-garde-'))
})

afterAll(() => {
  rmSync(dossier, { recursive: true, force: true })
})

// Un triangle près des hanches, skinné sur Hips, avec les variantes à refuser.
async function exporter(nom, { skinned = true, weights = 'float', positions = 'float' } = {}) {
  const doc = new Document()
  const buffer = doc.createBuffer()
  const acc = (type, array, normalized = false) =>
    doc.createAccessor().setType(type).setArray(array).setNormalized(normalized).setBuffer(buffer)

  const pos =
    positions === 'float'
      ? acc('VEC3', new Float32Array([0, 1, 0, 0.1, 1, 0, 0, 1.1, 0]))
      : acc('VEC3', new Int16Array([0, 1000, 0, 100, 1000, 0, 0, 1100, 0]), true)
  const prim = doc.createPrimitive().setAttribute('POSITION', pos)
  const corps = doc.createNode('corps').setMesh(doc.createMesh('corps').addPrimitive(prim))
  const scene = doc.createScene().addChild(corps)

  if (skinned) {
    const noms = Object.keys(OS)
    const ibm = new Float32Array(16 * noms.length)
    const skin = doc.createSkin()
    noms.forEach((n, i) => {
      const [x, y, z] = OS[n]
      ibm.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -x, -y, -z, 1], i * 16)
      const os = doc.createNode(`mixamorig:${n}`).setTranslation(OS[n])
      skin.addJoint(os)
      scene.addChild(os)
    })
    skin.setInverseBindMatrices(acc('MAT4', ibm))
    corps.setSkin(skin)
    prim.setAttribute('JOINTS_0', acc('VEC4', new Uint16Array(12)))
    prim.setAttribute(
      'WEIGHTS_0',
      weights === 'float'
        ? acc('VEC4', new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]))
        : acc('VEC4', new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0]), true),
    )
  }

  const input = join(dossier, `${nom}.glb`)
  await new NodeIO().write(input, doc)
  return { input, output: join(dossier, `${nom}-web.glb`) }
}

describe('character build guards', () => {
  // Témoin : l'export synthétique est valide, les refus ci-dessous viennent bien des gardes.
  it('builds the synthetic export when everything is float', async () => {
    const r = await buildCharacter(await exporter('temoin'))
    expect(r.joints).toBe(Object.keys(OS).length)
    expect(r.changed).toBe(0)
  })

  it('refuses quantized weights', async () => {
    await expect(buildCharacter(await exporter('poids', { weights: 'unorm8' }))).rejects.toThrow(
      /WEIGHTS_0 quantifié/,
    )
  })

  it('refuses quantized positions', async () => {
    await expect(buildCharacter(await exporter('positions', { positions: 'snorm16' }))).rejects.toThrow(
      /POSITION quantifié/,
    )
  })

  it('refuses an export without a skinned primitive', async () => {
    await expect(buildCharacter(await exporter('sans-rig', { skinned: false }))).rejects.toThrow(
      /aucune primitive skinnée/,
    )
  })
})
