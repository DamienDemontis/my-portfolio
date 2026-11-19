// Récupération d'un modèle Poly Haven (glTF 1k + dépendances) dans un dossier temporaire.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, normalize, sep } from 'node:path';

const API = 'https://api.polyhaven.com/files';
const HEADERS = { 'User-Agent': 'portfolio-props-builder' };

async function get(id, url, what) {
  let res;
  try {
    res = await fetch(url, { headers: HEADERS });
  } catch (err) {
    throw new Error(`${id} : échec réseau sur ${what} (${err.message})`);
  }
  if (!res.ok) throw new Error(`${id} : ${what} a répondu ${res.status}`);
  return res;
}

// Écrit dans <dir>/<id>/ ; renvoie le chemin du .gltf. Rien n'est écrit si l'API est inattendue
// ou si un téléchargement échoue : tout passe en mémoire avant la première écriture.
export async function fetchProp(id, dir) {
  const api = await get(id, `${API}/${id}`, "l'API Poly Haven");
  let files;
  try {
    files = await api.json();
  } catch {
    throw new Error(`${id} : réponse de l'API illisible`);
  }
  const entry = files?.gltf?.['1k']?.gltf;
  if (!entry?.url || typeof entry.include !== 'object' || entry.include === null) {
    throw new Error(`${id} : format inattendu, pas de glTF 1k dans la réponse de l'API`);
  }

  const target = join(dir, id);
  const gltfName = `${id}.gltf`;
  const list = [[gltfName, entry.url], ...Object.entries(entry.include).map(([rel, f]) => [rel, f.url])];
  const downloaded = [];
  for (const [rel, url] of list) {
    const dest = normalize(join(target, rel));
    if (!dest.startsWith(target + sep)) throw new Error(`${id} : chemin suspect « ${rel} » dans l'API`);
    const res = await get(id, url, rel);
    downloaded.push([dest, Buffer.from(await res.arrayBuffer())]);
  }
  for (const [dest, data] of downloaded) {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, data);
  }
  return join(target, gltfName);
}
