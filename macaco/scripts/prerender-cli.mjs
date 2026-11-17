// Etape finale du build : ecrit les pages prerendues dans dist/ et echoue (code
// non nul) si l'une d'elles manque, pour qu'un deploiement ne parte jamais sans.
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LANGUAGES } from '../src/i18n/languages.js'
import { prerenderSite } from './prerender.mjs'

const dist = join(fileURLToPath(new URL('..', import.meta.url)), 'dist')
const pages = await prerenderSite(dist)
const manquantes = [...LANGUAGES.map(l => join(dist, l, 'index.html')), join(dist, 'index.html'), join(dist, 'sitemap.xml')].filter(f => !existsSync(f))
if (manquantes.length) {
  console.error(`prerender: pages manquantes :\n${manquantes.join('\n')}`)
  process.exit(1)
}
console.log(`prerender: ${pages.length} pages written`)
