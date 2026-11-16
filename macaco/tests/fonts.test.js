import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const stylesDir = resolve(dirname(import.meta.url.replace(/^file:\/{2,3}/, '')), '../src/styles')
const cssFiles = readdirSync(stylesDir).filter(f => f.endsWith('.css'))

test('il y a des feuilles de style a verifier', () => {
  expect(cssFiles.length).toBeGreaterThan(0)
})

test.each(cssFiles)('%s ne reference plus Roboto Mono (remplacee par Martian Mono)', file => {
  expect(readFileSync(join(stylesDir, file), 'utf8')).not.toMatch(/Roboto Mono/i)
})
