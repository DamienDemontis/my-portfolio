import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import i18next from 'i18next'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import '../src/i18n/index.js'
import fr from '../src/i18n/locales/fr.json'
import { PROJECTS } from '../src/content/projects.js'
import { PROJECTION_SHOTS, PROJECTION_STILL } from '../src/three/projection/layout.js'
import { PROJECT_ANCHORS, projectAt } from '../src/three/projection/steps.js'

// Le socle est remplacé par un faux : une <section> qui porte ses attributs et ses enfants,
// et relève ses props à chaque rendu (onProgress pour piloter la progression, stageProps pour
// en suivre l'identité). Sans canvas ni WebGL : c'est aussi la page sans WebGL 2.
// afterLoad garde ses rappels sans les lancer : le test décide quand la page a « chargé ».
const vu = vi.hoisted(() => ({ rendus: [], apresLoad: [], effets: [] }))

vi.mock('../src/three/cinematic/CinematicSection.jsx', async () => {
  const React = await import('react')
  return {
    default: function FauxSocle(props) {
      vu.rendus.push(props)
      const { id, className, children } = props
      return React.createElement('section', { id, className, 'aria-labelledby': props['aria-labelledby'] }, children)
    },
  }
})

vi.mock('../src/lib/afterLoad.js', () => ({
  afterLoad: (rappel) => {
    vu.apresLoad.push(rappel)
    return () => {}
  },
}))

vi.mock('../src/three/projection/effects.jsx', () => ({ PROJECTION_EFFECTS: vu.effets }))

import Projects from '../src/sections/Projects.jsx'

const T = fr.home.projects
const N = PROJECTS.length
const WII = PROJECTS.findIndex((p) => p.id === 'wiitanks')

const socle = () => vu.rendus[vu.rendus.length - 1]
const avancer = (p) => act(() => socle().onProgress(p))
const cartes = (container) => [...container.querySelectorAll('ol > li')]
const controles = (li) => [...li.querySelectorAll('a, button')]
// Toutes les cartes restent dans l'arbre d'accessibilité (ni inert ni aria-hidden) ; une carte
// cachée l'est à l'œil, et ses contrôles sont hors de la tabulation.
const exposee = (li) => !li.hasAttribute('inert') && !li.hasAttribute('aria-hidden')
const cachee = (li) => exposee(li) && li.dataset.active === 'false' && controles(li).every((c) => c.tabIndex === -1)
const active = (li) => exposee(li) && li.dataset.active === 'true' && controles(li).every((c) => !c.hasAttribute('tabindex'))

beforeAll(() => i18next.changeLanguage('fr'))

beforeEach(() => {
  vu.rendus = []
  vu.apresLoad = []
  // jsdom n'a ni showModal ni close : comme un navigateur, close() retire `open` et émet « close ».
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    if (!this.hasAttribute('open')) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
})

afterEach(() => {
  delete HTMLDialogElement.prototype.showModal
  delete HTMLDialogElement.prototype.close
})

test('le socle reçoit la piste, les plans, la scène en paresseux et le titre', () => {
  render(<Projects />)
  const props = socle()
  expect(props.id).toBe('projets')
  expect(props.track).toBe('1000svh')
  expect(props.shots).toBe(PROJECTION_SHOTS)
  expect(props.still).toBe(PROJECTION_STILL)
  expect(props.stage.$$typeof).toBe(Symbol.for('react.lazy'))
  expect(props.stageProps).toEqual({ projects: PROJECTS, index: -1 })
  expect(props.animated).toBe(true)
  expect(props.depthOfField).toBeTruthy()
  expect(props.shadows).toBe(true)
  expect(props.preload).toEqual(['/character/damien.glb', '/props/filmstrip_projector_8mm.glb'])
  expect(props.className).toBe('projects')
  expect(props['aria-labelledby']).toBe('projects-title')
  // l'affiche : une image par cadrage, portrait sous le même seuil que les plans
  const { container: affiche } = render(props.poster)
  expect(affiche.querySelector('source').getAttribute('media')).toBe('(max-aspect-ratio: 23/20)')
  expect(affiche.querySelector('source').getAttribute('srcset')).toBe('/projects/poster-narrow.webp')
  expect(affiche.querySelector('img').getAttribute('src')).toBe('/projects/poster-wide.webp')
  expect(affiche.querySelector('img').getAttribute('alt')).toBe('')
})

test('les effets arrivent après load, et une seule fois', async () => {
  render(<Projects />)
  expect(socle().effects).toBeUndefined()
  expect(vu.apresLoad).toHaveLength(1)
  act(() => vu.apresLoad[0]())
  await waitFor(() => expect(socle().effects).toBe(vu.effets))
  const identites = new Set(vu.rendus.map((r) => r.effects))
  expect([...identites]).toEqual([undefined, vu.effets])
})

test('p = 0 : l en-tête est visible, aucune carte n est active', () => {
  const { container } = render(<Projects />)
  avancer(0)
  const section = container.querySelector('section#projets')
  expect(section.getAttribute('aria-labelledby')).toBe('projects-title')
  const titre = screen.getByRole('heading', { level: 2, name: T.title })
  expect(titre.id).toBe('projects-title')
  expect(screen.getByText(T.kicker)).toBeTruthy()
  expect(container.querySelector('.projects__head').dataset.visible).toBe('true')
  const li = cartes(container)
  expect(li).toHaveLength(N)
  expect(li.every(cachee)).toBe(true)
})

test('p = 0 : la liste annonce six projets, leurs titres et leurs liens aux lecteurs d écran', () => {
  const { container } = render(<Projects />)
  avancer(0)
  // Rôles calculés comme un lecteur d'écran : un nœud aria-hidden (ou sous un tel nœud) en sort.
  const liste = container.querySelector('ol')
  const items = within(liste)
    .getAllByRole('listitem')
    .filter((el) => el.parentElement === liste)
  expect(items).toHaveLength(N)
  expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
    PROJECTS.map((p) => T.items[p.id].title),
  )
  const externes = PROJECTS.flatMap((p) => p.links.filter((l) => l.kind !== 'play'))
  const liens = screen.getAllByRole('link')
  expect(liens.map((a) => a.getAttribute('href'))).toEqual(externes.map((l) => l.href))
  const jouer = screen.getByRole('button', { name: T.play })
  // Aucune carte n'est active : tous leurs contrôles sont hors de la tabulation.
  for (const c of [...liens, jouer]) expect(c.tabIndex).toBe(-1)
})

test('les cartes cachées sont effacées à l œil seulement et ne captent pas les clics', () => {
  const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../src/styles/projects.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  )
  const regles = [...css.matchAll(/\.projects__card(\[data-active="true"\])?\s*\{([^}]*)\}/g)]
  const cachee = regles.find((r) => !r[1])?.[2]
  const montree = regles.find((r) => r[1])?.[2]
  expect(cachee).toMatch(/opacity:\s*0;/)
  expect(cachee).toMatch(/pointer-events:\s*none/)
  expect(montree).toMatch(/opacity:\s*1/)
  expect(montree).toMatch(/pointer-events:\s*auto/)
  expect(css).not.toMatch(/visibility/)
})

// La racine de scroll du site (#scroll-root) autour du rendu, et une géométrie : la piste
// commence à 2000 px et finit à 10000 px, l'écran fait 800 px. La progression d'une position y
// est donc (y − 2000) / (10000 − 2000 − 800), comme la mesure de CinematicSection.
function salle() {
  const racine = document.createElement('div')
  racine.id = 'scroll-root'
  document.body.appendChild(racine)
  Object.defineProperty(racine, 'clientHeight', { configurable: true, value: 800 })
  racine.getBoundingClientRect = () => ({ top: 0, bottom: 800 })
  racine.scrollTo = vi.fn()
  const rendu = render(<Projects />, { container: racine.appendChild(document.createElement('div')) })
  rendu.container.querySelector('section#projets').getBoundingClientRect = () => ({ top: 2000, bottom: 10000 })
  return { racine, ...rendu }
}
const COURSE = 10000 - 2000 - 800

test('focus sur un lien de la quatrième carte cachée : la piste défile jusqu à son palier', () => {
  const { racine, container, unmount } = salle()
  try {
    avancer(0)
    const lien = cartes(container)[3].querySelector('a')
    expect(lien.tabIndex).toBe(-1)
    act(() => lien.focus())
    expect(racine.scrollTo).toHaveBeenCalledTimes(1)
    const { top, behavior } = racine.scrollTo.mock.calls[0][0]
    expect(top).toBeCloseTo(2000 + PROJECT_ANCHORS[3] * COURSE, 6)
    expect(behavior).toBe('smooth')
    // Le scroll arrive au palier : la carte se montre, le lien garde le focus et rentre dans la tabulation.
    avancer((top - 2000) / COURSE)
    expect(active(cartes(container)[3])).toBe(true)
    expect(document.activeElement).toBe(lien)
    // Focus dans la carte active : aucun nouveau défilement.
    act(() => cartes(container)[3].querySelector('button').focus())
    expect(racine.scrollTo).toHaveBeenCalledTimes(1)
  } finally {
    unmount()
    racine.remove()
  }
})

test('sous mouvement réduit, le saut au palier se fait sans animation', () => {
  vi.stubGlobal('matchMedia', (q) => ({ matches: q === '(prefers-reduced-motion: reduce)', media: q }))
  const { racine, container, unmount } = salle()
  try {
    avancer(PROJECT_ANCHORS[0])
    act(() => cartes(container)[5].querySelector('a').focus())
    expect(racine.scrollTo).toHaveBeenCalledTimes(1)
    const { top, behavior } = racine.scrollTo.mock.calls[0][0]
    expect(top).toBeCloseTo(2000 + PROJECT_ANCHORS[5] * COURSE, 6)
    expect(behavior).toBe('auto')
  } finally {
    unmount()
    racine.remove()
  }
})

test('au palier du troisième projet, sa carte seule est visible, avec son compteur', () => {
  const { container } = render(<Projects />)
  avancer(PROJECT_ANCHORS[2])
  const li = cartes(container)
  expect(active(li[2])).toBe(true)
  expect(li[2].textContent).toContain('03 / 06')
  expect(li[2].querySelector('h3').textContent).toBe(T.items[PROJECTS[2].id].title)
  expect(li.filter((_, i) => i !== 2).every(cachee)).toBe(true)
  // Le compteur est décoratif : la liste ordonnée porte déjà la position.
  const compteur = [...li[2].querySelectorAll('[aria-hidden="true"]')].find((el) => el.textContent === '03 / 06')
  expect(compteur).toBeTruthy()
  // L'en-tête s'efface à l'œil mais son titre reste lisible par les lecteurs d'écran.
  expect(container.querySelector('.projects__head').dataset.visible).toBe('false')
  expect(screen.getByRole('heading', { level: 2, name: T.title })).toBeTruthy()
})

test('un saut direct de 0 à 0,7 donne la bonne carte', () => {
  const { container } = render(<Projects />)
  avancer(0)
  avancer(0.7)
  const index = projectAt(0.7).index
  const li = cartes(container)
  expect(active(li[index])).toBe(true)
  expect(li.filter((_, i) => i !== index).every(cachee)).toBe(true)
  expect(li[index].querySelector('h3').textContent).toBe(T.items[PROJECTS[index].id].title)
  expect(li[index].textContent).toContain(`${String(index + 1).padStart(2, '0')} / 06`)
  expect(socle().stageProps.index).toBe(index)
})

test('dans un même palier, ni rendu ni nouvelle identité de stageProps', () => {
  const { rerender } = render(<Projects />)
  avancer(PROJECT_ANCHORS[2])
  const rendus = vu.rendus.length
  const sp = socle().stageProps
  expect(sp).toEqual({ projects: PROJECTS, index: 2 })
  expect(sp.projects).toBe(PROJECTS)
  avancer(PROJECT_ANCHORS[2] + 0.01)
  avancer(PROJECT_ANCHORS[2] - 0.01)
  expect(vu.rendus.length).toBe(rendus)
  rerender(<Projects />)
  expect(vu.rendus.length).toBeGreaterThan(rendus)
  expect(socle().stageProps).toBe(sp)
  avancer(PROJECT_ANCHORS[3])
  expect(socle().stageProps).not.toBe(sp)
  expect(socle().stageProps.index).toBe(3)
})

test('Jouer : aucune iframe avant, une à l ouverture, aucune après Fermer ; le focus revient', () => {
  const { container } = render(<Projects />)
  avancer(PROJECT_ANCHORS[WII])
  const dialogue = container.querySelector('dialog.projects__game')
  expect(dialogue.getAttribute('aria-label')).toBe(T.gameLabel)
  expect(container.querySelectorAll('dialog')).toHaveLength(1)
  expect(document.querySelector('iframe')).toBeNull()

  // Un seul bouton « Jouer », sur la carte active : dans la tabulation.
  const jouer = screen.getByRole('button', { name: T.play })
  expect(jouer.hasAttribute('tabindex')).toBe(false)
  expect(jouer.getAttribute('type')).toBe('button')
  fireEvent.click(jouer)
  expect(dialogue.hasAttribute('open')).toBe(true)
  const iframes = document.querySelectorAll('iframe')
  expect(iframes).toHaveLength(1)
  expect(iframes[0].getAttribute('src')).toBe('/games/wii-tanks/index.html')
  expect(iframes[0].getAttribute('title')).toBe(T.gameLabel)
  expect(iframes[0].getAttribute('allow')).toBe('fullscreen; autoplay; gamepad')

  fireEvent.click(within(dialogue).getByRole('button', { name: T.close }))
  expect(dialogue.hasAttribute('open')).toBe(false)
  expect(document.querySelector('iframe')).toBeNull()
  expect(document.activeElement).toBe(jouer)
})

test('Échap (événement cancel) ferme le jeu, retire l iframe et rend le focus', () => {
  const { container } = render(<Projects />)
  avancer(PROJECT_ANCHORS[WII])
  const dialogue = container.querySelector('dialog.projects__game')
  const jouer = screen.getByRole('button', { name: T.play })
  fireEvent.click(jouer)
  expect(document.querySelectorAll('iframe')).toHaveLength(1)

  fireEvent(dialogue, new Event('cancel', { cancelable: true }))
  expect(dialogue.hasAttribute('open')).toBe(false)
  expect(document.querySelector('iframe')).toBeNull()
  expect(document.activeElement).toBe(jouer)

  // Rouvrir recrée l'iframe.
  fireEvent.click(jouer)
  expect(document.querySelectorAll('iframe')).toHaveLength(1)
})

test('sous « Jouer », une mention du jeu, reliée au bouton', () => {
  const { container } = render(<Projects />)
  avancer(PROJECT_ANCHORS[WII])
  const jouer = screen.getByRole('button', { name: T.play })
  const id = jouer.getAttribute('aria-describedby')
  expect(id).toBeTruthy()
  const note = document.getElementById(id)
  expect(note.textContent).toBe(T.playNote)
  expect(cartes(container)[WII].contains(note)).toBe(true)
  expect(jouer.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  // Une seule mention : celle du seul jeu.
  expect(container.querySelectorAll('[aria-describedby]')).toHaveLength(1)
})

test('jeu ouvert : la 3D cesse de tourner en continu, le dialogue garde le toucher natif', () => {
  const { container } = render(<Projects />)
  avancer(PROJECT_ANCHORS[WII])
  const dialogue = container.querySelector('dialog.projects__game')
  // Le défilement tactile du site (useTouchScroll, App.jsx) ignore ce qui porte cet attribut.
  expect(dialogue.hasAttribute('data-native-touch')).toBe(true)
  expect(socle().animated).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: T.play }))
  expect(socle().animated).toBe(false)
  fireEvent.click(within(dialogue).getByRole('button', { name: T.close }))
  expect(socle().animated).toBe(true)
})

test('le curseur du système revient dans le dialogue du jeu', () => {
  const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../src/styles/projects.css'), 'utf8')
  expect(css).toMatch(/\.projects__game\s*\{[^}]*cursor:\s*auto/)
})

// Le jeu « chargé » dans l'iframe (jsdom n'y charge rien) : un canvas qui reçoit les touches, et
// un document qui les capte comme Unity, sans les laisser remonter. Rend de quoi presser une touche.
function jeuCharge(iframe) {
  const fenetre = iframe.contentWindow
  const doc = fenetre.document
  const canvas = doc.appendChild(doc.createElement('html')).appendChild(doc.createElement('canvas'))
  doc.addEventListener('keydown', (e) => e.stopPropagation(), true)
  fireEvent.load(iframe)
  return (key) => act(() => canvas.dispatchEvent(new fenetre.KeyboardEvent('keydown', { key, bubbles: true })))
}

test('Échap dans le jeu (fenêtre de l iframe) ferme le dialogue, retire l iframe et rend le focus', () => {
  const { container } = render(<Projects />)
  avancer(PROJECT_ANCHORS[WII])
  const dialogue = container.querySelector('dialog.projects__game')
  const jouer = screen.getByRole('button', { name: T.play })
  fireEvent.click(jouer)
  const iframe = document.querySelector('iframe')
  const fenetre = iframe.contentWindow
  expect(fenetre).toBeTruthy()
  const touche = jeuCharge(iframe)

  touche('ArrowUp')
  expect(dialogue.hasAttribute('open')).toBe(true)

  const retirer = vi.spyOn(fenetre, 'removeEventListener')
  touche('Escape')
  expect(dialogue.hasAttribute('open')).toBe(false)
  expect(document.querySelector('iframe')).toBeNull()
  expect(document.activeElement).toBe(jouer)
  // L'écouteur posé sur la fenêtre du jeu est retiré à la fermeture.
  expect(retirer).toHaveBeenCalledWith('keydown', expect.any(Function), true)

  // Rouvert, le jeu suivant a de nouveau son Échap.
  fireEvent.click(jouer)
  jeuCharge(document.querySelector('iframe'))('Escape')
  expect(dialogue.hasAttribute('open')).toBe(false)
  expect(document.querySelector('iframe')).toBeNull()
})

test('sans showModal, le dialogue s ouvre quand même (attribut open)', () => {
  delete HTMLDialogElement.prototype.showModal
  delete HTMLDialogElement.prototype.close
  const { container } = render(<Projects />)
  avancer(PROJECT_ANCHORS[WII])
  const dialogue = container.querySelector('dialog.projects__game')
  const jouer = screen.getByRole('button', { name: T.play })
  fireEvent.click(jouer)
  expect(dialogue.hasAttribute('open')).toBe(true)
  expect(document.querySelectorAll('iframe')).toHaveLength(1)
  fireEvent.click(within(dialogue).getByRole('button', { name: T.close }))
  expect(dialogue.hasAttribute('open')).toBe(false)
  expect(document.querySelector('iframe')).toBeNull()
  expect(document.activeElement).toBe(jouer)
})

test('les liens externes s ouvrent dans un nouvel onglet, annoncé aux lecteurs d écran', () => {
  const { container } = render(<Projects />)
  const externes = PROJECTS.flatMap((p) => p.links.filter((l) => l.kind !== 'play'))
  expect(container.querySelectorAll('ol a')).toHaveLength(externes.length)
  for (const { kind, href } of externes) {
    const a = container.querySelector(`a[href="${href}"]`)
    expect(a, href).toBeTruthy()
    expect(a.getAttribute('target')).toBe('_blank')
    expect(a.getAttribute('rel')).toBe('noopener noreferrer')
    expect(a.textContent).toBe(`${T[kind]} ${T.newTab}`)
    const mention = a.querySelector('.sr-only')
    expect(mention.textContent.trim()).toBe(T.newTab)
  }
  // « Jouer » est un bouton, pas un lien : un seul, sur la carte du jeu.
  const boutons = container.querySelectorAll('ol button')
  expect(boutons).toHaveLength(1)
  expect(boutons[0].textContent).toBe(T.play)
  expect(cartes(container)[WII].contains(boutons[0])).toBe(true)
})

test('sans WebGL 2, tout le texte des six projets est dans le DOM', () => {
  const { container } = render(<Projects />)
  expect(container.querySelector('canvas')).toBeNull()
  const li = cartes(container)
  expect(li.map((el) => el.querySelector('h3').textContent)).toEqual(PROJECTS.map((p) => T.items[p.id].title))
  PROJECTS.forEach((p, i) => {
    const texte = li[i].textContent
    expect(texte).toContain(T.items[p.id].meta)
    expect(texte).toContain(T.items[p.id].line)
    expect(texte).toContain(`${String(i + 1).padStart(2, '0')} / 06`)
    const pile = li[i].querySelector('ul')
    expect([...pile.querySelectorAll('li')].map((el) => el.textContent)).toEqual(p.stack)
    // La pile est précédée de son libellé, masqué à l'œil.
    const libelle = li[i].querySelector('.sr-only')
    expect(libelle.textContent).toBe(T.stack)
    expect(libelle.compareDocumentPosition(pile) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})

test('sous mouvement réduit, aucune transition de carte', () => {
  // Chemin construit à la main : Vite réécrit new URL(…, import.meta.url) en adresse servie.
  const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../src/styles/projects.css'), 'utf8')
  const bloc = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
  expect(bloc.length).toBeLessThan(css.length)
  expect(bloc).toMatch(/\.projects__card[^{]*\{[^}]*transition:\s*none/)
})
