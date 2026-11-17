// CLI : assets-src/character/damien-tripo.glb -> public/character/damien.glb
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { buildCharacter } from './build.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
mkdirSync(`${root}public/character`, { recursive: true });
const r = await buildCharacter({
  input: `${root}assets-src/character/damien-tripo.glb`,
  output: `${root}public/character/damien.glb`,
});
console.log(`octets: ${r.bytes}\ntriangles: ${r.triangles}\nos: ${r.joints}\nsommets corrigés: ${r.changed}`);
