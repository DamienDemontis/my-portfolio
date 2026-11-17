// @vitest-environment node
// v5 enregistrait /sw.js (cache-first, jamais revalide) : v6 le remplace par un
// kill-switch qui purge les caches, se desinscrit et recharge les onglets.
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const FILE = ROOT + 'public/sw.js'

test('public/sw.js existe et se desinscrit', () => {
  expect(existsSync(FILE)).toBe(true)
  const js = readFileSync(FILE, 'utf8')
  expect(js).toContain('skipWaiting')
  expect(js).toContain('caches.delete')
  expect(js).toContain('unregister')
  expect(js).toContain('navigate')
})

test('le kill-switch n intercepte aucune requete', () => {
  const js = readFileSync(FILE, 'utf8')
  expect(js).not.toMatch(/addEventListener\(\s*['"]fetch['"]/)
  expect(js).not.toMatch(/onfetch/)
})
