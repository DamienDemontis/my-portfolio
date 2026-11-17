// Prerendu : une page HTML indexable par langue, avec titre, description,
// hreflang, JSON-LD et le texte complet des huit scenes dans <noscript>.
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SCENES } from '../src/content/scenes.js'
import { SEO_LANGUAGES, SEO_DEFAULT_LANGUAGE, buildMeta } from '../src/seo/meta.js'

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
    `<script data-seo type="application/ld+json">${JSON.stringify(m.jsonLd).replaceAll('<\/', '<\/')}</script>`,
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
  return `<noscript>\n<main>\n${articles.join('\n')}\n</main>\n</noscript>`
}

function render(template, lang, locale, ko) {
  const m = buildMeta(lang, locale)
  let html = template
    .replace(/<!--prerender:head-->[\s\S]*?<!--\/prerender:head-->\s*/g, '')
    .replace(/<noscript>[\s\S]*?<\/noscript>\s*/g, '')
    .replace(/<title>[\s\S]*?<\/title>\s*/g, '')
    .replace(/<html\b([^>]*?)\slang="[^"]*"/, '<html$1')
    .replace(/<html\b/, `<html lang="${lang}"`)
  html = html.replace('</head>', `  ${headBlock(m)}\n  </head>`)
  html = html.replace(/<body([^>]*)>/, `<body$1>\n    ${noscriptBlock(lang, locale, ko)}`)
  return html
}

async function write(file, template, lang) {
  const html = render(template, lang, await readLocale(lang), await readLocale('ko'))
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
  return file
}

export async function prerender(outDir, templatePath = defaultTemplate()) {
  const template = await readFile(templatePath, 'utf8')
  const written = []
  for (const lang of SEO_LANGUAGES) written.push(await write(join(outDir, lang, 'index.html'), template, lang))
  return written
}

export async function writeRootPage(outDir, templatePath = defaultTemplate()) {
  return write(join(outDir, 'index.html'), await readFile(templatePath, 'utf8'), SEO_DEFAULT_LANGUAGE)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dist = join(ROOT, 'dist')
  const template = defaultTemplate()
  const pages = await prerender(dist, template)
  pages.push(await writeRootPage(dist, template))
  console.log(`prerender: ${pages.length} pages written`)
}
