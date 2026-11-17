// @vitest-environment node
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { prerender, render, writeRootPage } from '../scripts/prerender.mjs'
import { SCENES } from '../src/content/scenes.js'
import { SITE } from '../src/content/site.js'
import { contientEmploi } from './helpers/forbidden.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const locale = l => JSON.parse(readFileSync(join(ROOT, 'src/i18n/locales', `${l}.json`), 'utf8'))
// Gabarit explicite : le defaut depend de la presence de dist/.
const TEMPLATE = join(ROOT, 'index.html')
const tmp = () => mkdtempSync(join(tmpdir(), 'pre-'))
const page = (dir, l) => readFileSync(join(dir, l, 'index.html'), 'utf8')
// Le noscript du document : celui du <body> (la tete porte un noscript de style).
const noscriptOf = html => html.slice(html.indexOf('<body')).match(/<noscript>([\s\S]*?)<\/noscript>/)[1]

test('trois pages de langue sont ecrites', async () => {
  const ecrits = await prerender(tmp(), TEMPLATE)
  expect(ecrits).toHaveLength(3)
})

test('le noscript contient titre et corps des huit scenes, dans l ordre', async () => {
  const dir = tmp()
  await prerender(dir, TEMPLATE)
  const fr = locale('fr')
  const ko = locale('ko')
  const ns = noscriptOf(page(dir, 'fr'))
  let at = -1
  for (const s of SCENES) {
    const title = s.id === 'coree' ? ko.scenes.coree.title : fr.scenes[s.id].title
    const i = ns.indexOf(title, at + 1)
    expect(i).toBeGreaterThan(at)
    at = i
    expect(ns).toContain(fr.scenes[s.id].body)
  }
})

test('la scene coree : titre en ko, corps dans la langue de la page', async () => {
  const dir = tmp()
  await prerender(dir, TEMPLATE)
  const ns = noscriptOf(page(dir, 'fr'))
  const art = ns.match(/<article[^>]*data-scene="coree"[\s\S]*?<\/article>/)[0]
  expect(art).toMatch(/<h2 lang="ko">/)
  expect(art).toContain(locale('ko').scenes.coree.title)
  expect(art).toMatch(/<p lang="fr">/)
  expect(art).toContain(locale('fr').scenes.coree.body)
  expect(ns.match(/<article[^>]*data-scene="metier"[^>]*>/)[0]).not.toContain('lang=')
})

test('titre, description, hreflang et JSON-LD Person', async () => {
  const dir = tmp()
  await prerender(dir, TEMPLATE)
  const html = page(dir, 'en')
  expect(html).toContain(`<title>${locale('en').seo.title}</title>`)
  expect(html).toContain('<html lang="en">')
  expect(html).toContain('og:locale" content="en_GB"')
  expect(html).toContain('rel="canonical" href="https://www.demontis.dev/en"')
  for (const l of ['fr', 'en', 'ko', 'x-default']) expect(html).toContain(`hreflang="${l}"`)
  const ld = JSON.parse(html.match(/<script[^>]*type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  expect(ld['@type']).toBe('Person')
  expect(ld.name).toBe('Damien Demontis')
  expect(ld.knowsAbout).toContain('WebGL')
})

test('un seul noscript, un seul title', async () => {
  const dir = tmp()
  await prerender(dir, TEMPLATE)
  const html = page(dir, 'ko')
  expect(html.slice(html.indexOf('<body')).match(/<noscript>/g)).toHaveLength(1)
  expect(html.match(/<title>/g)).toHaveLength(1)
})

test('la page racine reprend le contenu en', async () => {
  const dir = tmp()
  await writeRootPage(dir, TEMPLATE)
  const html = readFileSync(join(dir, 'index.html'), 'utf8')
  expect(html).toContain(`<title>${locale('en').seo.title}</title>`)
  expect(noscriptOf(html)).toContain(locale('en').scenes.ouverture.title)
})

test('aucune formule de recherche d emploi', async () => {
  const dir = tmp()
  await prerender(dir, TEMPLATE)
  for (const l of ['fr', 'en', 'ko']) expect(contientEmploi(page(dir, l)), l).toBe(false)
})

test('les motifs $ des textes sont reproduits tels quels', () => {
  const tricky = "$& $' $` $1 $$"
  const escaped = tricky.replace('&', '&amp;') // seul le & est echappe en HTML
  const fr = locale('fr')
  const scenes = { ...fr.scenes, metier: { ...fr.scenes.metier, body: tricky } }
  const seo = { title: `T ${tricky}`, description: `D ${tricky}` }
  const tpl = '<!doctype html><html lang="en"><head><title>x</title></head><body><div id="root"></div></body></html>'
  const html = render(tpl, 'fr', { ...fr, scenes, seo }, locale('ko'))
  expect(noscriptOf(html)).toContain(`<p>${escaped}</p>`)
  expect(html).toContain(`<title>T ${escaped}</title>`)
  expect(html).toContain(`content="D ${escaped}"`)
  expect(html).toContain('<body>')
})

test('le noscript injecte une feuille de style lisible, une seule fois, dans le bloc de tete', async () => {
  const dir = tmp()
  await prerender(dir, TEMPLATE)
  await prerender(dir, join(dir, 'fr', 'index.html')) // relance sur une page deja prerendue
  const html = page(dir, 'fr')
  const blocs = html.match(/<noscript><style>[\s\S]*?<\/style><\/noscript>/g)
  expect(blocs).toHaveLength(1)
  expect(blocs[0]).toContain('overflow:auto')
  expect(blocs[0]).toMatch(/color:\s*#E6E1D8/)
  expect(blocs[0]).toContain('cursor:auto')
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  expect(head).toContain(blocs[0])
  expect(html.match(/<noscript>/g)).toHaveLength(2)
})

test('le noscript a un h1 et un pied de page avec les trois langues et le mail', async () => {
  const dir = tmp()
  await prerender(dir, TEMPLATE)
  const ns = noscriptOf(page(dir, 'en'))
  expect(ns.match(/<h1>/g)).toHaveLength(1)
  expect(ns).toContain(`<h1>${SITE.name}</h1>`)
  const footer = ns.match(/<footer>[\s\S]*?<\/footer>/)[0]
  for (const l of ['fr', 'en', 'ko']) expect(footer).toContain(`href="/${l}"`)
  expect(footer).toContain(`href="mailto:${SITE.email}"`)
})
