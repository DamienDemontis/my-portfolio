// Pipeline de l'asset : export Tripo (rig Mixamo) -> GLB web léger.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMaterialsVolume } from '@gltf-transform/extensions';
import { prune, dedup, meshopt, textureCompress } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import { stripArmInfluence } from './weights.mjs';

// Translation de l'inverse d'une matrice 4x4 colonne-major = position de liaison de l'os.
function bindPosition(m) {
  const [a, b, c, d, e, f, g, h, k] = [m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]];
  const det = a * (e * k - f * h) - d * (b * k - c * h) + g * (b * f - c * e);
  const i0 = (e * k - f * h) / det, i1 = (c * h - b * k) / det, i2 = (b * f - c * e) / det;
  const i3 = (f * g - d * k) / det, i4 = (a * k - c * g) / det, i5 = (c * d - a * f) / det;
  const i6 = (d * h - e * g) / det, i7 = (b * g - a * h) / det, i8 = (a * e - b * d) / det;
  const [x, y, z] = [m[12], m[13], m[14]];
  return [-(i0 * x + i3 * y + i6 * z), -(i1 * x + i4 * y + i7 * z), -(i2 * x + i5 * y + i8 * z)];
}

export async function buildCharacter({ input, output, radiusFactor = 0.18, textureSize = 1024 }) {
  await MeshoptEncoder.ready;
  await MeshoptDecoder.ready;
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
  const doc = await io.read(input);
  const root = doc.getRoot();

  // 2. Correctif de poids sur chaque primitive skinnée
  let changed = 0;
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    const skin = node.getSkin();
    if (!mesh || !skin) continue;
    const joints = skin.listJoints();
    const ibm = skin.getInverseBindMatrices().getArray();
    const jointPositions = joints.map((_, i) => bindPosition(ibm.subarray(i * 16, i * 16 + 16)));
    for (const prim of mesh.listPrimitives()) {
      const jAttr = prim.getAttribute('JOINTS_0');
      const wAttr = prim.getAttribute('WEIGHTS_0');
      if (!jAttr || !wAttr) continue;
      const res = stripArmInfluence({
        positions: prim.getAttribute('POSITION').getArray(),
        joints: jAttr.getArray(),
        weights: wAttr.getArray(),
        jointNames: joints.map((j) => j.getName()),
        jointPositions,
        radiusFactor,
      });
      jAttr.setArray(res.joints);
      wAttr.setArray(res.weights);
      changed += res.changed;
    }
  }

  // 3. KHR_materials_volume retiré ; FB_ngon_encoding disparaît à l'écriture
  for (const ext of root.listExtensionsUsed()) {
    if (ext.extensionName === KHRMaterialsVolume.EXTENSION_NAME) ext.dispose();
  }

  await doc.transform(
    textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [textureSize, textureSize] }),
    prune(),
    dedup(),
    meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
  );
  await io.write(output, doc);

  let triangles = 0;
  for (const mesh of root.listMeshes())
    for (const prim of mesh.listPrimitives()) {
      const idx = prim.getIndices();
      triangles += (idx ? idx.getCount() : prim.getAttribute('POSITION').getCount()) / 3;
    }
  const { statSync } = await import('node:fs');
  return { bytes: statSync(output).size, triangles, joints: root.listSkins()[0]?.listJoints().length ?? 0, changed };
}
