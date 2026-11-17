// @vitest-environment node
// Nothing left of the client site this base was reconstructed from: no name,
// logo, yellow, display face, cookie banner or hazard stripes — and no
// reference to a public asset that is not actually served.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PUBLIC = join(ROOT, 'public')

// #fef{2}00 is the client yellow #FEFF00, alpha suffixes included (#FEFF0026);
// 254,255,0 is the same yellow written as rgb()/rgba().
const INTERDIT = [/#fef{2}00/i, /\b254,\s*255,\s*0\b/, /Syncopate/, /iubenda/i, /macaco/i, /hazard/i]
const EMPLOI = /disponible|ouvert aux opportunit|recherche un poste|available for|open to work|\bhiring\b|\bseeking\b/i

function fichiers(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) fichiers(p, acc)
    else if (/\.(jsx?|css|html|json)$/.test(e)) acc.push(p)
  }
  return acc
}

const nom = f => relative(ROOT, f).split(sep).join('/')
const SOURCES = [...fichiers(join(ROOT, 'src')), join(ROOT, 'index.html')]
const lire = f => readFileSync(f, 'utf8')

test('plus rien n identifie MACACO', () => {
  const coupables = []
  for (const f of [...SOURCES, join(ROOT, 'README.md'), join(ROOT, 'package.json')]) {
    const texte = lire(f)
    for (const motif of INTERDIT) if (motif.test(texte)) coupables.push(`${nom(f)} :: ${motif}`)
  }
  expect(coupables).toEqual([])
})

test('aucune formule de recherche d emploi', () => {
  expect(SOURCES.filter(f => EMPLOI.test(lire(f))).map(nom)).toEqual([])
})

const EXT = 'svg|png|jpe?g|webp|avif|gif|ico|mp4|webm|mov|mp3|wav|ogg|glb|gltf|bin|hdr|ktx2|woff2?|ttf|otf|txt|json|webmanifest|md|pdf'
// "/x.svg", '/x.svg', `/x.svg`, url(/x.svg) — an absolute path to a public file.
const ABSOLU = new RegExp(String.raw`["'\x60(](\/[\w./-]+\.(?:${EXT}))(?=["'\x60)?#])`, 'g')
// <MaskedSvg src="x.svg" /> is served from /intro/svg/x.svg.
const MASQUE = /<MaskedSvg\s[^>]*?\bsrc="([^"]+)"/g
// `${prefix}/x.svg`: the prefix cannot be checked statically, so it is refused.
const CONCATENE = new RegExp(String.raw`\}(\/[\w./-]+\.(?:${EXT}))\b`, 'g')

// Directories that .gitignore keeps out of public/ do not exist on a clean clone.
const IGNORES = lire(join(ROOT, '.gitignore'))
  .split(/\r?\n/)
  .filter(l => l.startsWith('public/'))
  .map(l => l.slice('public'.length))
const servi = p => existsSync(join(PUBLIC, p)) && !IGNORES.some(d => p.startsWith(d))

test('chaque asset reference existe dans public/', () => {
  const absents = []
  for (const f of SOURCES) {
    const texte = lire(f)
    for (const [, p] of texte.matchAll(ABSOLU)) if (!servi(p)) absents.push(`${nom(f)} :: ${p}`)
    for (const [, s] of texte.matchAll(MASQUE)) {
      if (!servi(`/intro/svg/${s}`)) absents.push(`${nom(f)} :: /intro/svg/${s}`)
    }
  }
  expect(absents).toEqual([])
})

test('aucun chemin d asset construit par concatenation', () => {
  const dynamiques = []
  for (const f of SOURCES) for (const [m] of lire(f).matchAll(CONCATENE)) dynamiques.push(`${nom(f)} :: ${m}`)
  expect(dynamiques).toEqual([])
})
