// @vitest-environment node
// Événements internes `site:*` : tout ce qu'un module écoute doit être envoyé
// quelque part dans src/. Un écouteur sans émetteur attend pour rien (le chargeur
// d'accueil a ainsi attendu 6 s un `site:robot-ready` que plus rien n'envoyait).
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SRC = join(ROOT, 'src')

function sources(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const chemin = join(dir, e.name)
    if (e.isDirectory()) return sources(chemin)
    return /\.(jsx?|mjs)$/.test(e.name) ? [chemin] : []
  })
}

const LITTERAL = /^["'`](site:[\w-]+)["'`]$/

// Nom d'événement désigné par un argument : littéral `site:*` ou constante du même fichier.
function resoudre(arg, constantes) {
  const m = arg.match(LITTERAL)
  return m ? m[1] : constantes.get(arg)
}

function inventaire() {
  const ecoutes = new Map() // événement -> fichiers qui l'écoutent (Set)
  const envois = new Set()
  for (const fichier of sources(SRC)) {
    const code = readFileSync(fichier, 'utf8')
    const constantes = new Map()
    for (const [, nom, evt] of code.matchAll(/([\w$]+)\s*=\s*["'`](site:[\w-]+)["'`]/g)) {
      constantes.set(nom, evt)
    }
    const ARG = String.raw`\(\s*([\w$]+|["'\`]site:[\w-]+["'\`])`
    for (const [, arg] of code.matchAll(new RegExp(String.raw`addEventListener` + ARG, 'g'))) {
      const evt = resoudre(arg, constantes)
      if (!evt) continue
      if (!ecoutes.has(evt)) ecoutes.set(evt, new Set())
      ecoutes.get(evt).add(relative(ROOT, fichier).split('\\').join('/'))
    }
    for (const [, arg] of code.matchAll(new RegExp(String.raw`new\s+(?:Custom)?Event` + ARG, 'g'))) {
      const evt = resoudre(arg, constantes)
      if (evt) envois.add(evt)
    }
  }
  return { ecoutes, envois }
}

test('every listened site:* event has a sender in src/', () => {
  const { ecoutes, envois } = inventaire()
  // Garde-fou du garde-fou : l'inventaire voit bien la paire Home -> Nav.
  expect([...ecoutes.keys()]).toContain('site:yellow-nav')
  expect([...envois]).toContain('site:yellow-nav')

  const orphelins = [...ecoutes].filter(([evt]) => !envois.has(evt)).map(([evt, f]) => `${evt} (${[...f].join(', ')})`)
  expect(orphelins).toEqual([])
})
