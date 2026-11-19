// @vitest-environment node
import { existsSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PROJECTS } from '../src/content/projects.js'
import media from '../src/content/projectMedia.json'

const pub = (p) => fileURLToPath(new URL(`../public${p}`, import.meta.url))
const locale = (l) => JSON.parse(readFileSync(fileURLToPath(new URL(`../src/i18n/locales/${l}.json`, import.meta.url)), 'utf8'))
const LANGS = ['fr', 'en', 'ko']

test('les projets sont dans l ordre prévu', () => {
  expect(PROJECTS.map((p) => p.id)).toEqual(['esante', 'jobneko', 'leonart', 'wiitanks', 'presence', 'msc'])
})

test.each(LANGS)('chaque projet a title, meta et line en %s', (l) => {
  const items = locale(l).home.projects.items
  for (const p of PROJECTS)
    for (const k of ['title', 'meta', 'line']) expect(typeof items[p.id]?.[k]).toBe('string')
})

test.each(LANGS)('les clés de boutons et de dialogue existent en %s', (l) => {
  const t = locale(l).home.projects
  for (const k of ['title', 'kicker', 'play', 'source', 'demo', 'video', 'newTab', 'close', 'gameLabel', 'stack'])
    expect(t[k]).toBeTruthy()
})

test('les images existent, pèsent <= 150 Ko et le manifeste correspond au disque', () => {
  const withImage = PROJECTS.filter((p) => p.media.kind === 'image')
  expect(withImage.map((p) => p.id).sort()).toEqual(Object.keys(media).sort())
  for (const p of withImage) {
    const m = media[p.id]
    expect(p.media.src).toBe(`/projects/${p.id}.webp`)
    expect(m.src).toBe(p.media.src)
    expect(existsSync(pub(m.src))).toBe(true)
    const bytes = statSync(pub(m.src)).size
    expect(bytes).toBe(m.bytes)
    expect(bytes).toBeLessThanOrEqual(150000)
    expect([m.width, m.height]).toEqual([1024, 576])
    expect(p.media.color).toBe(m.color)
    expect(m.color).toMatch(/^#[0-9a-f]{6}$/)
  }
})

test('les projets sans image ont un glyphe et une couleur', () => {
  for (const p of PROJECTS.filter((p) => p.media.kind === 'title')) {
    expect(['ecg', 'cat']).toContain(p.media.glyph)
    expect(p.media.color).toMatch(/^#[0-9a-f]{6}$/)
  }
})

test('play n existe que pour wiitanks, les autres liens sont en https', () => {
  for (const p of PROJECTS) {
    expect(Array.isArray(p.stack) && p.stack.length > 0).toBe(true)
    for (const l of p.links) {
      expect(['play', 'source', 'demo', 'video']).toContain(l.kind)
      if (l.kind === 'play') {
        expect(p.id).toBe('wiitanks')
        expect(l.href).toBe('/games/wii-tanks/index.html')
        expect(existsSync(pub(l.href))).toBe(true)
      } else expect(l.href).toMatch(/^https:\/\//)
    }
  }
  expect(PROJECTS.filter((p) => p.links.some((l) => l.kind === 'play')).map((p) => p.id)).toEqual(['wiitanks'])
})
