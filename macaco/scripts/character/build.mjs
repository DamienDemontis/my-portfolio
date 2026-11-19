// Pipeline de l'asset : export Tripo (rig Mixamo) -> GLB web léger.
import { statSync } from 'node:fs';
import { Accessor, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMaterialsVolume } from '@gltf-transform/extensions';
import { prune, dedup, meshopt, textureCompress, weld, simplify } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
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

// Le correctif lit les valeurs brutes : un attribut quantifié (entiers normalisés,
// KHR_mesh_quantization) serait lu comme des entiers et le résultat faux passerait sans bruit.
function exigerFlottants(prim, semantic, node) {
  const attr = prim.getAttribute(semantic);
  if (attr.getComponentType() !== Accessor.ComponentType.FLOAT) {
    const nature = attr.getNormalized() ? 'entiers normalisés' : 'entiers';
    throw new Error(
      `${semantic} quantifié sur le nœud « ${node.getName()} » (${nature}) : le correctif de poids exige des flottants, réexporter sans quantification`,
    );
  }
}

// NodeIO prêt pour lire et écrire du meshopt (partagé avec le pipeline des décors).
export async function createIO() {
  await MeshoptEncoder.ready;
  await MeshoptDecoder.ready;
  return new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
}

// Optimisation commune : textures WebP bornées, maillage éventuellement réduit, meshopt.
// simplifyRatio (0..1, absent = pas de réduction) garde la silhouette (erreur tolérée simplifyError, 1 % de l’emprise par défaut).
export async function optimizeGlb({ document, textureSize = 1024, simplifyRatio, simplifyError = 0.01, meshoptLevel = 'medium' }) {
  const steps = [textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [textureSize, textureSize] })];
  if (simplifyRatio !== undefined && simplifyRatio < 1) {
    await MeshoptSimplifier.ready;
    // Permissive : le maillage peut se réduire à travers les coutures d'UV et de normales ;
    // Prune : les petits morceaux isolés qui ne comptent plus pour la silhouette disparaissent.
    const simplifier = {
      ready: MeshoptSimplifier.ready,
      supported: MeshoptSimplifier.supported,
      simplify: (idx, pos, stride, target, err, flags) =>
        MeshoptSimplifier.simplify(idx, pos, stride, target, err, [...flags, 'Permissive', 'Prune']),
      simplifyPoints: (...a) => MeshoptSimplifier.simplifyPoints(...a),
    };
    steps.push(weld(), simplify({ simplifier, ratio: simplifyRatio, error: simplifyError }));
  }
  steps.push(prune(), dedup(), meshopt({ encoder: MeshoptEncoder, level: meshoptLevel }));
  await document.transform(...steps);
}

export async function buildCharacter({ input, output, radiusFactor = 0.18, textureSize = 1024 }) {
  const io = await createIO();
  const doc = await io.read(input);
  const root = doc.getRoot();

  // 2. Correctif de poids sur chaque primitive skinnée
  let changed = 0;
  let skinned = 0;
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
      exigerFlottants(prim, 'POSITION', node);
      exigerFlottants(prim, 'WEIGHTS_0', node);
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
      skinned++;
    }
  }
  if (skinned === 0) {
    throw new Error('aucune primitive skinnée (JOINTS_0 et WEIGHTS_0 sur un nœud avec skin) : export sans rig Mixamo ?');
  }

  // 3. KHR_materials_volume retiré ; FB_ngon_encoding disparaît à l'écriture
  for (const ext of root.listExtensionsUsed()) {
    if (ext.extensionName === KHRMaterialsVolume.EXTENSION_NAME) ext.dispose();
  }

  await optimizeGlb({ document: doc, textureSize });
  await io.write(output, doc);

  let triangles = 0;
  for (const mesh of root.listMeshes())
    for (const prim of mesh.listPrimitives()) {
      const idx = prim.getIndices();
      triangles += (idx ? idx.getCount() : prim.getAttribute('POSITION').getCount()) / 3;
    }
  return { bytes: statSync(output).size, triangles, joints: root.listSkins()[0]?.listJoints().length ?? 0, changed };
}
