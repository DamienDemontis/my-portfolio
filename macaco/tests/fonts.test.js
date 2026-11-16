// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

function fichiers(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) fichiers(p, acc)
    else if (/\.(css|jsx?)$/.test(e)) acc.push(p)
  }
  return acc
}

const sources = fichiers(join(ROOT, 'src')).map(f => [relative(ROOT, f).split(sep).join('/'), f])

test('il y a des feuilles de style et des scripts a verifier', () => {
  expect(sources.some(([n]) => n.endsWith('.css'))).toBe(true)
  expect(sources.some(([n]) => /\.jsx?$/.test(n))).toBe(true)
})

test.each(sources)('%s ne reference plus Roboto Mono (remplacee par Martian Mono)', (_, f) => {
  expect(readFileSync(f, 'utf8')).not.toMatch(/Roboto Mono/i)
})
