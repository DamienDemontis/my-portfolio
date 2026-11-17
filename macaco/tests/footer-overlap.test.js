// @vitest-environment node
// Le pied de page garde sa propre piste (revelation epinglee) mais ne doit pas
// remonter sur les scenes : sortie et transmission restent lisibles.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const css = readFileSync(`${ROOT}src/styles/home.css`, 'utf8')

test('the footer must not cover the scenes: no negative margin-top on .mcf', () => {
  const regle = css.match(/(^|\n)\.mcf\s*\{([^}]*)\}/)
  expect(regle).not.toBeNull()
  const corps = regle[2]
  expect(corps).not.toMatch(/margin-top\s*:\s*calc\(\s*-/)
  expect(corps).not.toMatch(/margin-top\s*:\s*-/)
  expect(corps).toMatch(/height\s*:\s*var\(--mcf-track/)
})
