// @vitest-environment node
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { prerender, render, writeRootPage } from '../scripts/prerender.mjs'
import { SCENES } from '../src/content/scenes.js'
import { EMPLOI } from './helpers/forbidden.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const locale = l => JSON.parse(readFileSync(join(ROOT, 'src/i18n/locales', `${l}.json`), 'utf8'))
const tmp = () => mkdtempSync(join(tmpdir(), 'pre-'))
const page = (dir, l) => readFileSync(join(dir, l, 'index.html'), 'utf8')
const noscriptOf = html => html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1]

test('trois pages de langue sont ecrites', async () => {
  const ecrits = await prerender(tmp())
  expect(ecrits).toHaveLength(3)
})

test('le noscript contient titre et corps des huit scenes, dans l ordre', async () => {
  const dir = tmp()
  await prerender(dir)
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
  await prerender(dir)
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
  await prerender(dir)
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
  await prerender(dir)
  const html = page(dir, 'ko')
  expect(html.match(/<noscript>/g)).toHaveLength(1)
  expect(html.match(/<title>/g)).toHaveLength(1)
})

test('la page racine reprend le contenu en', async () => {
  const dir = tmp()
  await writeRootPage(dir)
  const html = readFileSync(join(dir, 'index.html'), 'utf8')
  expect(html).toContain(`<title>${locale('en').seo.title}</title>`)
  expect(noscriptOf(html)).toContain(locale('en').scenes.ouverture.title)
})

test('aucune formule de recherche d emploi', async () => {
  const dir = tmp()
  await prerender(dir)
  for (const l of ['fr', 'en', 'ko']) expect(page(dir, l)).not.toMatch(EMPLOI)
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
