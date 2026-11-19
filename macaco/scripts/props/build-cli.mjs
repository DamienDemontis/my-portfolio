// CLI : catalogue Poly Haven -> public/props/<id>.glb + manifest.json (seul script qui touche le réseau).
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cpSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createIO, optimizeGlb } from '../character/build.mjs';
import { PROPS, SECTION_BUDGET } from './catalog.mjs';
import { fetchProp } from './fetch.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const out = join(root, 'public/props');
const tmp = mkdtempSync(join(tmpdir(), 'props-'));
const io = await createIO();

function triangles(doc) {
  let n = 0;
  for (const mesh of doc.getRoot().listMeshes())
    for (const prim of mesh.listPrimitives()) {
      const idx = prim.getIndices();
      n += (idx ? idx.getCount() : prim.getAttribute('POSITION').getCount()) / 3;
    }
  return n;
}

// Tout est construit dans un dossier temporaire puis copié : un échec ne touche pas public/props/.
const staged = join(tmp, 'out');
mkdirSync(staged);
const manifest = [];
const totals = {};
try {
  for (const p of PROPS) {
    const gltf = await fetchProp(p.id, join(tmp, 'src'));
    const document = await io.read(gltf);
    const before = triangles(document);
    await optimizeGlb({
      document, textureSize: p.textureSize ?? 1024, simplifyRatio: p.simplify,
      simplifyError: p.simplifyError, meshoptLevel: 'high',
    });
    const file = join(staged, `${p.id}.glb`);
    await io.write(file, document);
    const bytes = statSync(file).size;
    manifest.push({
      id: p.id, section: p.section, file: `/props/${p.id}.glb`, bytes,
      source: 'Poly Haven', url: `https://polyhaven.com/a/${p.id}`, license: 'CC0',
    });
    totals[p.section] = (totals[p.section] ?? 0) + bytes;
    console.log(`${p.id.padEnd(34)} ${p.section.padEnd(13)} ${String(bytes).padStart(8)} ${before} -> ${triangles(document)} triangles`);
  }
  for (const [s, t] of Object.entries(totals)) {
    console.log(`total ${s}: ${t}`);
    if (t > SECTION_BUDGET) throw new Error(`section « ${s} » : ${t} octets, budget ${SECTION_BUDGET} dépassé`);
  }
  mkdirSync(out, { recursive: true });
  for (const m of manifest) cpSync(join(staged, `${m.id}.glb`), join(out, `${m.id}.glb`));
  writeFileSync(join(out, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
