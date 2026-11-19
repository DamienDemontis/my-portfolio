// @vitest-environment node
// Salle d'écoute : affiches légères et budget de la section (décor et images ≤ 1,5 Mo).
import { existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const pub = (p) => fileURLToPath(new URL(`../public${p}`, import.meta.url))

test('les affiches de la salle d écoute existent et restent légères', () => {
  for (const f of ['/musique/poster-wide.webp', '/musique/poster-narrow.webp']) {
    expect(existsSync(pub(f)), f).toBe(true)
    expect(statSync(pub(f)).size).toBeLessThanOrEqual(60000)
  }
})

test('la salle d écoute tient son budget : décor et images ≤ 1,5 Mo', () => {
  const fichiers = ['/props/boombox.glb', '/musique/poster-wide.webp', '/musique/poster-narrow.webp']
  const total = fichiers.reduce((s, f) => s + statSync(pub(f)).size, 0)
  expect(total).toBeLessThanOrEqual(1_500_000)
})

test('aucun fichier audio dans le dépôt public', async () => {
  const { readdirSync } = await import('node:fs')
  const tous = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? tous(`${dir}/${e.name}`) : [`${dir}/${e.name}`]))
  const audio = tous(fileURLToPath(new URL('../public', import.meta.url))).filter((f) => /\.(mp3|m4a|aac|ogg|wav|flac|lrc)$/i.test(f))
  expect(audio).toEqual([])
})
