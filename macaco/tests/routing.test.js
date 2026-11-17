// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildSitemap } from '../scripts/prerender.mjs'
import { resolveLanguagePath } from '../src/lib/routing.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const vercel = JSON.parse(readFileSync(ROOT + 'vercel.json', 'utf8'))

test.each(['fr', 'ko', 'en'])('lng=%s redirige en permanent vers /%s', l => {
  const r = vercel.redirects.find(x => x.source === '/' && x.has?.some(h => h.type === 'query' && h.key === 'lng' && h.value === l))
  expect(r, `redirection manquante pour lng=${l}`).toBeTruthy()
  expect(r.permanent).toBe(true)
  expect(r.destination).toBe(`/${l}`)
})

test('aucune redirection ne touche le jeu', () => {
  expect(vercel.redirects.find(r => r.source.startsWith('/games'))).toBeUndefined()
})

test('le jeu et les CV sont servis depuis macaco/public', () => {
  const g = 'public/games/wii-tanks/'
  for (const f of ['index.html', 'Build/WebGL.data.gz', 'Build/WebGL.framework.js.gz', 'Build/WebGL.loader.js', 'Build/WebGL.wasm.gz'])
    expect(existsSync(ROOT + g + f), f).toBe(true)
  for (const f of ['public/CV_Damien_DEMONTIS_EN.pdf', 'public/CV_Damien_DEMONTIS_FR.pdf'])
    expect(existsSync(ROOT + f), f).toBe(true)
})

test('les en-tetes gzip du jeu sont portes', () => {
  for (const ext of ['data', 'wasm', 'js']) {
    const rule = vercel.headers.find(h => h.source === '/games/wii-tanks/Build/(.*)\\.' + ext + '\\.gz')
    expect(rule, ext).toBeTruthy()
    expect(rule.headers).toContainEqual({ key: 'Content-Encoding', value: 'gzip' })
  }
  const wasm = vercel.headers.find(h => h.source.includes('wasm'))
  expect(wasm.headers).toContainEqual({ key: 'Content-Type', value: 'application/wasm' })
})

test('les rewrites du jeu precedent le repli SPA', () => {
  const src = vercel.rewrites.map(r => r.source)
  const spa = src.indexOf('/(.*)')
  expect(spa).toBe(src.length - 1)
  expect(src.indexOf('/games/wii-tanks')).toBeGreaterThanOrEqual(0)
  expect(src.indexOf('/games/wii-tanks/')).toBeGreaterThanOrEqual(0)
  expect(src.indexOf('/games/wii-tanks')).toBeLessThan(spa)
  expect(src.indexOf('/games/wii-tanks/')).toBeLessThan(spa)
  expect(vercel.rewrites[spa].destination).toBe('/index.html')
})

test('le sitemap liste trois URL et aucun PDF', () => {
  const xml = buildSitemap('https://www.demontis.dev')
  expect(xml.match(/<loc>/g)).toHaveLength(3)
  for (const l of ['fr', 'en', 'ko']) expect(xml).toContain(`<loc>https://www.demontis.dev/${l}</loc>`)
  expect(xml).not.toMatch(/\.pdf/)
})

test('robots.txt autorise tout et pointe vers le sitemap', () => {
  const t = readFileSync(ROOT + 'public/robots.txt', 'utf8')
  expect(t).toMatch(/User-agent: \*/)
  expect(t).toMatch(/Allow: \//)
  expect(t).toContain('Sitemap: https://www.demontis.dev/sitemap.xml')
})

test('resolveLanguagePath', () => {
  expect(resolveLanguagePath('/de')).toBe('/en')
  expect(resolveLanguagePath('/it/x')).toBe('/en/x')
  expect(resolveLanguagePath('/DE')).toBe('/en')
  expect(resolveLanguagePath('/de/')).toBe('/en/')
  for (const p of ['/fr', '/en/x', '/KO', '/', '/games/wii-tanks/', '/abc', '/a1']) expect(resolveLanguagePath(p), p).toBeNull()
})
