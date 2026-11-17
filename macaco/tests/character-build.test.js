// @vitest-environment node
// Le pipeline de l'asset : source Tripo -> GLB web (meshopt + webp).
import { describe, it, expect, beforeAll } from 'vitest';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { statSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import { buildCharacter } from '../scripts/character/build.mjs';
import { stripArmInfluence, normalizeJointName } from '../scripts/character/weights.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const input = join(root, 'assets-src/character/damien-tripo.glb');
const output = join(tmpdir(), `damien-test-${process.pid}.glb`);
const served = join(root, 'public/character/damien.glb');

async function read(path) {
  await MeshoptDecoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
  return io.read(path);
}

function triangles(doc) {
  let n = 0;
  for (const mesh of doc.getRoot().listMeshes())
    for (const prim of mesh.listPrimitives()) {
      const idx = prim.getIndices();
      n += idx ? idx.getCount() / 3 : prim.getAttribute('POSITION').getCount() / 3;
    }
  return n;
}

let result;
let built;
let source;
let servedDoc;

beforeAll(async () => {
  result = await buildCharacter({ input, output });
  built = await read(output);
  source = await read(input);
  servedDoc = await read(served);
}, 120_000);

describe('character build', () => {
  it('stays within the character budget', () => {
    expect(result.bytes).toBeLessThanOrEqual(2_000_000);
    expect(statSync(output).size).toBe(result.bytes);
  });

  it('keeps the Mixamo skeleton', () => {
    const skins = built.getRoot().listSkins();
    expect(skins).toHaveLength(1);
    const names = skins[0].listJoints().map((j) => normalizeJointName(j.getName()));
    expect(names).toHaveLength(65);
    expect(names.filter((n) => n === 'Hips')).toHaveLength(1);
    expect(names.filter((n) => n === 'Head')).toHaveLength(1);
  });

  it('keeps every triangle', () => {
    expect(triangles(built)).toBe(triangles(source));
    expect(result.triangles).toBe(triangles(source));
  });

  it('uses meshopt and webp, nothing else exotic', () => {
    const used = built.getRoot().listExtensionsUsed().map((e) => e.extensionName);
    expect(used).toContain('EXT_meshopt_compression');
    expect(used).toContain('EXT_texture_webp');
    expect(used).not.toContain('KHR_materials_volume');
    expect(used).not.toContain('FB_ngon_encoding');
  });

  it('textures are at most 1024 px', async () => {
    const textures = built.getRoot().listTextures();
    expect(textures.length).toBeGreaterThan(0);
    for (const tex of textures) {
      const meta = await sharp(Buffer.from(tex.getImage())).metadata();
      expect(meta.width).toBeLessThanOrEqual(1024);
      expect(meta.height).toBeLessThanOrEqual(1024);
    }
  });

  it('the fix is idempotent', () => {
    const again = refix(built);
    expect(again.primitives).toBeGreaterThan(0);
    expect(again.changed).toBe(0);
  });

  it('the served file is the built file', () => {
    expect(statSync(served).size).toBeLessThanOrEqual(2_000_000);
    expect(servedDoc.getRoot().listSkins()[0].listJoints()).toHaveLength(65);
  });

  // Le fichier servi, commité, porte bien le correctif (pas seulement le build temporaire).
  it('the served file is already fixed', () => {
    const again = refix(servedDoc);
    expect(again.primitives).toBeGreaterThan(0);
    expect(again.changed).toBe(0);
  });
});

// Relance le correctif sur chaque primitive skinnée d'un fichier relu, avec 2 % de marge
// sur le rayon pour la quantification meshopt (ruling R1) : plus rien ne doit changer.
function refix(doc) {
  let changed = 0;
  let primitives = 0;
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    const skin = node.getSkin();
    if (!mesh || !skin) continue;
    const joints = skin.listJoints();
    const ibm = skin.getInverseBindMatrices().getArray();
    const jointPositions = joints.map((_, i) => bindPosition(ibm, i));
    for (const prim of mesh.listPrimitives()) {
      if (!prim.getAttribute('JOINTS_0') || !prim.getAttribute('WEIGHTS_0')) continue;
      changed += stripArmInfluence({
        positions: decoded(prim.getAttribute('POSITION')),
        joints: decoded(prim.getAttribute('JOINTS_0')),
        weights: decoded(prim.getAttribute('WEIGHTS_0')),
        jointNames: joints.map((j) => j.getName()),
        jointPositions,
        radiusFactor: 0.18 * 1.02,
      }).changed;
      primitives++;
    }
  }
  return { changed, primitives };
}

// Valeurs décodées (dénormalisées) : meshopt quantifie POSITION en int16 normalisé
// et reporte l'échelle dans les inverseBindMatrices, les deux restent cohérents.
function decoded(accessor) {
  const size = accessor.getElementSize();
  const out = new Float32Array(accessor.getCount() * size);
  const tmp = [];
  for (let i = 0; i < accessor.getCount(); i++) {
    accessor.getElement(i, tmp);
    for (let k = 0; k < size; k++) out[i * size + k] = tmp[k];
  }
  return out;
}

// Translation de l'inverse d'une matrice 4x4 colonne-major (rotation/échelle + translation).
function bindPosition(ibm, i) {
  const m = ibm.subarray(i * 16, i * 16 + 16);
  const [a, b, c, d, e, f, g, h, k] = [m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]];
  const det = a * (e * k - f * h) - d * (b * k - c * h) + g * (b * f - c * e);
  const inv = [
    (e * k - f * h) / det, (c * h - b * k) / det, (b * f - c * e) / det,
    (f * g - d * k) / det, (a * k - c * g) / det, (c * d - a * f) / det,
    (d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det,
  ];
  const t = [m[12], m[13], m[14]];
  return [
    -(inv[0] * t[0] + inv[3] * t[1] + inv[6] * t[2]),
    -(inv[1] * t[0] + inv[4] * t[1] + inv[7] * t[2]),
    -(inv[2] * t[0] + inv[5] * t[1] + inv[8] * t[2]),
  ];
}
