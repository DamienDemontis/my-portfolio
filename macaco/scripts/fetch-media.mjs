// Rapatrie les medias des case studies (/case, /og) depuis le site en ligne.
// Ils ne sont pas dans le depot : ~25 Mo d'images et ~1 Go de video.
//
//   npm run fetch-media            images seulement (par defaut, ~28 Mo)
//   npm run fetch-media -- --video images + video (~1,1 Go)
//
// Les chemins sont lus dans les sources, donc la liste reste juste meme apres
// modification du contenu.

import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ORIGIN = 'https://studiomacaco.ch'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = join(ROOT, 'public')
const WITH_VIDEO = process.argv.includes('--video')
const CONCURRENCY = 8

const MEDIA = /\.(webp|jpe?g|png|avif|gif|svg|mp4|webm|mov)$/i
const VIDEO = /\.(mp4|webm|mov)$/i

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) await walk(p, out)
    else if (/\.(jsx?|json|css|html)$/.test(entry.name)) out.push(p)
  }
  return out
}

async function collectPaths() {
  const urls = new Set()
  for (const file of await walk(join(ROOT, 'src'))) {
    const text = await readFile(file, 'utf8')
    for (const m of text.matchAll(/["'`](\/(?:case|og)\/[A-Za-z0-9_\-./]+)["'`]/g)) {
      if (MEDIA.test(m[1])) urls.add(m[1])
    }
    for (const m of text.matchAll(/https?:\/\/studiomacaco\.ch(\/(?:case|og)\/[A-Za-z0-9_\-./]+)/g)) {
      if (MEDIA.test(m[1])) urls.add(m[1])
    }
  }
  return [...urls].sort()
}

async function download(path) {
  const target = join(PUBLIC, path)
  try { await stat(target); return 'present' } catch {}
  const res = await fetch(ORIGIN + path)
  if (!res.ok) return `echec ${res.status}`
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, Buffer.from(await res.arrayBuffer()))
  return 'ok'
}

const all = await collectPaths()
const wanted = WITH_VIDEO ? all : all.filter((p) => !VIDEO.test(p))
console.log(`${wanted.length} fichier(s) a verifier${WITH_VIDEO ? ' (video comprise)' : ' (hors video : --video pour les inclure)'}`)

const counts = { ok: 0, present: 0, echec: 0 }
for (let i = 0; i < wanted.length; i += CONCURRENCY) {
  const batch = wanted.slice(i, i + CONCURRENCY)
  const results = await Promise.all(batch.map(download))
  results.forEach((r, k) => {
    if (r === 'ok') counts.ok++
    else if (r === 'present') counts.present++
    else { counts.echec++; console.log(`  ! ${batch[k]} : ${r}`) }
  })
  process.stdout.write(`\r  ${Math.min(i + CONCURRENCY, wanted.length)}/${wanted.length}`)
}
console.log(`\ntelecharges ${counts.ok} | deja la ${counts.present} | echecs ${counts.echec}`)
if (!WITH_VIDEO) console.log('Les video des case studies restent servies depuis studiomacaco.ch tant que --video n a pas ete lance.')
