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
const cachee = (li) => li.hasAttribute('inert') && li.getAttribute('aria-hidden') === 'true'
const active = (li) => !li.hasAttribute('inert') && !li.hasAttribute('aria-hidden')

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

  // Seul le bouton de la carte active est exposé.
  const jouer = screen.getByRole('button', { name: T.play })
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
