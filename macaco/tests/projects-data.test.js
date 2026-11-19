// @vitest-environment node
import { existsSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
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
  for (const k of ['title', 'kicker', 'play', 'playNote', 'source', 'demo', 'video', 'newTab', 'close', 'gameLabel', 'stack'])
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

// Le script de la page du jeu (gabarit Unity), lancé dans un bac à sable : des éléments factices
// qui relèvent leur classe et leur style, une fenêtre intégrée (top ≠ self) ou non.
function pageDuJeu({ integre, userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }) {
  const html = readFileSync(pub('/games/wii-tanks/index.html'), 'utf8')
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
  const element = (className = '') => ({ className, style: {}, appendChild() {} })
  const elements = { '#unity-container': element('unity-desktop') }
  const document = {
    querySelector: (s) => (elements[s] ??= element()),
    createElement: () => element(),
    getElementsByTagName: () => [element()],
    body: element(),
  }
  const window = {}
  window.self = window
  window.top = integre ? {} : window
  vm.runInNewContext(script, { window, document, navigator: { userAgent }, setTimeout, alert() {} })
  return { conteneur: elements['#unity-container'], canvas: elements['#unity-canvas'] }
}

test('la page du jeu, intégrée dans une iframe, remplit son cadre (gabarit mobile de Unity)', () => {
  const integree = pageDuJeu({ integre: true })
  expect(integree.conteneur.className).toBe('unity-mobile')
  expect(integree.canvas.className).toBe('unity-mobile')
  expect(integree.canvas.style.width).toBeUndefined()
  // Ouverte directement sur un ordinateur : le gabarit bureau, inchangé.
  const directe = pageDuJeu({ integre: false })
  expect(directe.conteneur.className).toBe('unity-desktop')
  expect([directe.canvas.style.width, directe.canvas.style.height]).toEqual(['960px', '600px'])
})

test('les affiches de la section existent et restent légères', () => {
  for (const f of ['/projects/poster-wide.webp', '/projects/poster-narrow.webp']) {
    expect(existsSync(pub(f)), f).toBe(true)
    expect(statSync(pub(f)).size).toBeLessThanOrEqual(60000)
  }
})

test('la section tient son budget : décor et images ≤ 1,5 Mo', () => {
  const fichiers = ['/props/filmstrip_projector_8mm.glb', '/projects/poster-wide.webp', '/projects/poster-narrow.webp', ...Object.values(media).map((m) => m.src)]
  const total = fichiers.reduce((s, f) => s + statSync(pub(f)).size, 0)
  expect(total).toBeLessThanOrEqual(1_500_000)
})
