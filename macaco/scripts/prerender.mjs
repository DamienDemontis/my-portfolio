// Prerendu : une page HTML indexable par langue, avec titre, description,
// hreflang, JSON-LD et le texte complet des huit scenes dans <noscript>.
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SCENES } from '../src/content/scenes.js'
import { SITE } from '../src/content/site.js'
import { DEFAULT_LANGUAGE, LANGUAGES } from '../src/i18n/languages.js'
import { buildMeta } from '../src/seo/meta.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const MARK_START = '<!--prerender:head-->'
const MARK_END = '<!--/prerender:head-->'

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function readLocale(lang) {
  return JSON.parse(await readFile(join(ROOT, 'src/i18n/locales', `${lang}.json`), 'utf8'))
}

function defaultTemplate() {
  const built = join(ROOT, 'dist/index.html')
  return existsSync(built) ? built : join(ROOT, 'index.html')
}

// Sans JavaScript la feuille de style de l'app reste chargee : elle fige la
// page (overflow:hidden, curseur masque, fond noir sans couleur de texte).
// Ce bloc restaure un vrai document lisible.
const NOSCRIPT_CSS = [
  "html,body,#root{height:auto;overflow:auto}",
  "html{cursor:auto}",
  "body{color:#E6E1D8;font-family:'Martian Mono',monospace}",
  "main,footer{max-width:68ch;margin:0 auto;padding:1.5rem 1rem}",
  "a{color:inherit}",
].join('')

function headBlock(m) {
  const lines = [
    MARK_START,
    `<title>${esc(m.title)}</title>`,
    `<meta data-seo name="description" content="${esc(m.description)}" />`,
    `<link data-seo rel="canonical" href="${esc(m.canonical)}" />`,
    ...m.alternates.map(a => `<link data-seo rel="alternate" hreflang="${esc(a.hreflang)}" href="${esc(a.href)}" />`),
    `<meta data-seo property="og:type" content="website" />`,
    `<meta data-seo property="og:title" content="${esc(m.title)}" />`,
    `<meta data-seo property="og:description" content="${esc(m.description)}" />`,
    `<meta data-seo property="og:url" content="${esc(m.canonical)}" />`,
    `<meta data-seo property="og:locale" content="${esc(m.ogLocale)}" />`,
    `<script data-seo type="application/ld+json">${JSON.stringify(m.jsonLd).replaceAll('</', '<\\/')}</script>`,
    `<noscript><style>${NOSCRIPT_CSS}</style></noscript>`,
    MARK_END,
  ]
  return lines.join('\n    ')
}

// Titre de la scene coreenne en ko, corps dans la langue de la page
// (meme regle que le mode lecture).
function noscriptBlock(lang, locale, ko) {
  const get = (l, key) => key.split('.').reduce((o, k) => o[k], l)
  const articles = SCENES.map(scene => {
    const isKo = scene.id === 'coree'
    const title = esc(get(isKo ? ko : locale, scene.titleKey))
    const body = esc(get(locale, scene.bodyKey))
    return isKo
      ? `<article data-scene="${scene.id}" lang="ko"><h2 lang="ko">${title}</h2><p lang="${lang}">${body}</p></article>`
      : `<article data-scene="${scene.id}"><h2>${title}</h2><p>${body}</p></article>`
  })
  const langLinks = LANGUAGES.map(l => `<a href="/${l}" hreflang="${l}">${l.toUpperCase()}</a>`).join(' · ')
  const footer = `<footer>${langLinks} · <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></footer>`
  return `<noscript>\n<main>\n<h1>${esc(SITE.name)}</h1>\n${articles.join('\n')}\n</main>\n${footer}\n</noscript>`
}

// Fonctions de remplacement partout : une chaine de remplacement interprete
// `$&`, `$1`, `$'`... et corromprait un texte contenant un `$`.
export function render(template, lang, locale, ko) {
  const m = buildMeta(lang, locale)
  let html = template
    .replace(/<!--prerender:head-->[\s\S]*?<!--\/prerender:head-->\s*/g, '')
    .replace(/<noscript>[\s\S]*?<\/noscript>\s*/g, '')
    .replace(/<title>[\s\S]*?<\/title>\s*/g, '')
    .replace(/<html\b([^>]*?)\slang="[^"]*"/, (_, attrs) => `<html${attrs}`)
    .replace(/<html\b/, () => `<html lang="${lang}"`)
  html = html.replace('</head>', () => `  ${headBlock(m)}\n  </head>`)
  html = html.replace(/<body([^>]*)>/, (_, attrs) => `<body${attrs}>\n    ${noscriptBlock(lang, locale, ko)}`)
  return html
}

async function write(file, template, lang) {
  const html = render(template, lang, await readLocale(lang), await readLocale('ko'))
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
  return file
}

// Point d'entree du build (scripts/prerender-cli.mjs).
export async function prerenderSite(dist, template = defaultTemplate()) {
  const pages = await prerender(dist, template)
  pages.push(await writeRootPage(dist, template))
  await writeFile(join(dist, 'sitemap.xml'), buildSitemap(SITE.url))
  return pages
}

export async function prerender(outDir, templatePath = defaultTemplate()) {
  const template = await readFile(templatePath, 'utf8')
  const written = []
  for (const lang of LANGUAGES) written.push(await write(join(outDir, lang, 'index.html'), template, lang))
  return written
}

export function buildSitemap(origin) {
  const urls = LANGUAGES.map(l => `  <url><loc>${origin}/${l}</loc></url>`)
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
}

export async function writeRootPage(outDir, templatePath = defaultTemplate()) {
  return write(join(outDir, 'index.html'), await readFile(templatePath, 'utf8'), DEFAULT_LANGUAGE)
}
