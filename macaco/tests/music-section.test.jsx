import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import i18next from 'i18next'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import '../src/i18n/index.js'
import fr from '../src/i18n/locales/fr.json'
import en from '../src/i18n/locales/en.json'
import ko from '../src/i18n/locales/ko.json'
import { TRACKS } from '../src/content/music.js'
import { MUSIC_SHOTS, MUSIC_STILL } from '../src/three/music/layout.js'

// Le socle est remplacé par un faux (comme pour Projets) : une <section> qui porte ses
// attributs et ses enfants, et relève ses props à chaque rendu. Sans canvas ni WebGL : c'est
// aussi la page sans WebGL 2. afterLoad garde ses rappels : le test décide quand la page a
// « chargé ». Le moteur d'écoute est un faux : mêmes méthodes (espionnées), un vrai subscribe,
// et poser() pour changer son état comme le ferait le vrai moteur.
const vu = vi.hoisted(() => ({ rendus: [], apresLoad: [], effets: [] }))
const moteur = vi.hoisted(() => {
  const abonnes = new Set()
  const m = {
    state: 'idle',
    error: null,
    current: null,
    bands: { bass: 0, mid: 0, high: 0, kick: false, playing: false },
    play: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    stop: vi.fn(),
    tick: vi.fn(),
    subscribe(fn) {
      abonnes.add(fn)
      return () => abonnes.delete(fn)
    },
    abonnes,
    poser(etat) {
      Object.assign(m, etat)
      abonnes.forEach((fn) => fn())
    },
  }
  return m
})

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

vi.mock('../src/three/music/effects.jsx', () => ({ MUSIC_EFFECTS: vu.effets }))
vi.mock('../src/lib/listening.js', () => ({ listening: moteur }))

import Music from '../src/sections/Music.jsx'

const T = fr.home.music
const ICI = dirname(fileURLToPath(import.meta.url))
const lire = (chemin) => readFileSync(join(ICI, chemin), 'utf8')
const sansCommentaires = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '')

const socle = () => vu.rendus[vu.rendus.length - 1]
const avancer = (p) => act(() => socle().onProgress(p))
const poser = (etat) => act(() => moteur.poser(etat))
const region = (container) => container.querySelector('[aria-live="polite"]')
const liste = (container) => container.querySelector('ol')
const boutonsListe = (container) => [...liste(container).querySelectorAll('button')]
const bouton = (container, track) => boutonsListe(container)[TRACKS.indexOf(track)]
const annonce = (track) => `${T.nowPlaying} : ${track.title} — ${track.artist}`

const FEEL = TRACKS.find((t) => t.id === 'feel-good-inc')
const COVER = 'https://cdn-images.dzcdn.net/images/cover/feel/250x250.jpg'
const LINK = 'https://www.deezer.com/track/3129407'
const chargement = (track = FEEL) => ({ state: 'loading', error: null, current: { track, link: null, cover: null } })
const lecture = (track = FEEL) => ({ state: 'playing', error: null, current: { track, link: LINK, cover: COVER } })
const pause = (track = FEEL) => ({ ...lecture(track), state: 'paused' })
const erreur = (code, track = FEEL) => ({ state: 'error', error: code, current: { track, link: null, cover: null } })
const repos = { state: 'idle', error: null, current: null }

beforeAll(() => i18next.changeLanguage('fr'))

beforeEach(() => {
  vu.rendus = []
  vu.apresLoad = []
  Object.assign(moteur, repos)
  for (const f of ['play', 'pause', 'resume', 'stop', 'tick']) moteur[f].mockClear()
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('aucun réseau en test'))))
})

test('le socle reçoit la piste, les plans, la scène en paresseux, le moteur et le titre', () => {
  render(<Music />)
  const props = socle()
  expect(props.id).toBe('musique')
  expect(props.track).toBe('700svh')
  expect(props.shots).toBe(MUSIC_SHOTS)
  expect(props.still).toBe(MUSIC_STILL)
  expect(props.stage.$$typeof).toBe(Symbol.for('react.lazy'))
  expect(props.stageProps).toEqual({ listening: moteur })
  expect(props.stageProps.listening).toBe(moteur)
  expect(props.animated).toBe(true)
  expect(props.depthOfField).toEqual({ focusRange: 1.4, bokehScale: 3 })
  expect(props.preload).toEqual(['/character/damien.glb', '/props/boombox.glb'])
  expect(props.className).toBe('music')
  expect(props['aria-labelledby']).toBe('music-title')
  // l'affiche : une image par cadrage, portrait sous le même seuil que les plans
  const { container: affiche } = render(props.poster)
  expect(affiche.querySelector('source').getAttribute('media')).toBe('(max-aspect-ratio: 23/20)')
  expect(affiche.querySelector('source').getAttribute('srcset')).toBe('/musique/poster-narrow.webp')
  expect(affiche.querySelector('img').getAttribute('src')).toBe('/musique/poster-wide.webp')
  expect(affiche.querySelector('img').getAttribute('alt')).toBe('')
  expect(typeof props.onProgress).toBe('function')
})

test('stageProps, depthOfField et preload gardent leur identité (rendus, scroll, lecture)', () => {
  const { rerender } = render(<Music />)
  const { stageProps, depthOfField, preload, stage } = socle()
  avancer(0.5)
  poser(lecture())
  rerender(<Music />)
  poser(repos)
  expect(vu.rendus.length).toBeGreaterThan(2)
  for (const r of vu.rendus) {
    expect(r.stageProps).toBe(stageProps)
    expect(r.depthOfField).toBe(depthOfField)
    expect(r.preload).toBe(preload)
    expect(r.stage).toBe(stage)
  }
})

test('les effets arrivent après load, et une seule fois', async () => {
  render(<Music />)
  expect(socle().effects).toBeUndefined()
  expect(vu.apresLoad).toHaveLength(1)
  act(() => vu.apresLoad[0]())
  await waitFor(() => expect(socle().effects).toBe(vu.effets))
  expect([...new Set(vu.rendus.map((r) => r.effects))]).toEqual([undefined, vu.effets])
})

test('rien n est téléchargé avant un clic : ni extrait, ni pochette, ni appel au moteur', () => {
  const { container } = render(<Music />)
  avancer(0)
  avancer(0.6)
  expect(moteur.play).not.toHaveBeenCalled()
  expect(globalThis.fetch).not.toHaveBeenCalled()
  expect(container.querySelector('img, audio, video, iframe, source')).toBeNull()
  expect(container.querySelector('a')).toBeNull()
  // L'invite dit quand l'extrait se charge ; la région live est là, vide.
  expect(screen.getByText(T.hint)).toBeTruthy()
  expect(region(container)).toBeTruthy()
  expect(region(container).textContent).toBe('')
})

test('la liste : les 18 morceaux dans un <ol> sous son titre, chacun un bouton « Titre — Artiste »', () => {
  const { container } = render(<Music />)
  const h3 = screen.getByRole('heading', { level: 3, name: T.listTitle })
  const ol = liste(container)
  expect(h3.compareDocumentPosition(ol) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  const items = within(ol)
    .getAllByRole('listitem')
    .filter((li) => li.parentElement === ol)
  expect(items).toHaveLength(TRACKS.length)
  expect(TRACKS).toHaveLength(18)
  TRACKS.forEach((track, i) => {
    const b = within(items[i]).getByRole('button')
    expect(b.getAttribute('type')).toBe('button')
    // Nom accessible : titre, artiste, puis le genre.
    expect(b.textContent).toBe(`${track.title} — ${track.artist}, ${track.genre}`)
    expect(b.hasAttribute('aria-current')).toBe(false)
  })
  // Le calcul du nom accessible peut ajouter une espace au bord des séparateurs (masqués à l'œil).
  const nom = (n) => n.replace(/\s+/g, ' ').replace(/ ,/g, ',')
  expect(screen.getByRole('button', { name: (n) => nom(n) === `${FEEL.title} — ${FEEL.artist}, ${FEEL.genre}` })).toBe(
    bouton(container, FEEL),
  )
})

test('clic sur un morceau : le moteur le joue (dans le geste)', () => {
  const { container } = render(<Music />)
  fireEvent.click(bouton(container, FEEL))
  expect(moteur.play).toHaveBeenCalledTimes(1)
  expect(moteur.play).toHaveBeenCalledWith(FEEL)
  // Un autre morceau pendant la lecture : on le joue, sans pause.
  poser(lecture())
  fireEvent.click(bouton(container, TRACKS[0]))
  expect(moteur.play).toHaveBeenLastCalledWith(TRACKS[0])
  expect(moteur.pause).not.toHaveBeenCalled()
})

test('chargement : annoncé, morceau marqué, ni pochette ni lien tant qu ils ne sont pas connus', () => {
  const { container } = render(<Music />)
  fireEvent.click(bouton(container, FEEL))
  poser(chargement())
  expect(region(container).textContent).toBe(T.loading)
  const marques = container.querySelectorAll('[aria-current]')
  expect(marques).toHaveLength(1)
  expect(marques[0]).toBe(bouton(container, FEEL))
  expect(marques[0].getAttribute('aria-current')).toBe('true')
  expect(container.querySelector('img')).toBeNull()
  expect(container.querySelector('a')).toBeNull()
  expect(screen.queryByText(T.hint)).toBeNull()
  // La zone « en écoute » nomme déjà le morceau.
  const zone = container.querySelector('.music__now')
  expect(zone.textContent).toContain(FEEL.title)
  expect(zone.textContent).toContain(FEEL.artist)
  expect(zone.textContent).toContain(T.preview)
})

test('lecture : annoncée, pochette et lien Deezer (nouvel onglet annoncé)', () => {
  const { container } = render(<Music />)
  poser(chargement())
  poser(lecture())
  expect(region(container).textContent).toBe(annonce(FEEL))
  const img = container.querySelector('img')
  expect(img.getAttribute('src')).toBe(COVER)
  expect(img.getAttribute('alt')).toBe('')
  const zone = container.querySelector('.music__now')
  expect(zone.textContent).toContain(T.nowPlaying)
  expect(zone.textContent).toContain(T.preview)
  const a = within(zone).getByRole('link')
  expect(a.getAttribute('href')).toBe(LINK)
  expect(a.getAttribute('target')).toBe('_blank')
  expect(a.getAttribute('rel')).toBe('noopener noreferrer')
  expect(a.textContent).toBe(`${T.openDeezer} ${T.newTab}`)
  expect(a.querySelector('.sr-only').textContent.trim()).toBe(T.newTab)
  expect(bouton(container, FEEL).getAttribute('aria-current')).toBe('true')
  expect(within(zone).getByRole('button', { name: T.pause })).toBeTruthy()
  expect(within(zone).getByRole('button', { name: T.stop })).toBeTruthy()
})

test('la pochette n apparaît que lorsqu elle est connue', () => {
  const { container } = render(<Music />)
  poser(chargement())
  expect(container.querySelector('img')).toBeNull()
  poser({ ...lecture(), current: { track: FEEL, link: LINK, cover: null } })
  expect(container.querySelector('img')).toBeNull()
  expect(container.querySelector('a').getAttribute('href')).toBe(LINK)
  poser(lecture())
  expect(container.querySelectorAll('img')).toHaveLength(1)
})

test('le morceau en cours : un clic le met en pause, un autre le reprend', () => {
  const { container } = render(<Music />)
  poser(lecture())
  fireEvent.click(bouton(container, FEEL))
  expect(moteur.pause).toHaveBeenCalledTimes(1)
  expect(moteur.play).not.toHaveBeenCalled()
  poser(pause())
  fireEvent.click(bouton(container, FEEL))
  expect(moteur.resume).toHaveBeenCalledTimes(1)
  expect(moteur.play).not.toHaveBeenCalled()
})

test('Pause puis Reprendre, depuis la zone « en écoute »', () => {
  const { container } = render(<Music />)
  poser(lecture())
  const zone = container.querySelector('.music__now')
  fireEvent.click(within(zone).getByRole('button', { name: T.pause }))
  expect(moteur.pause).toHaveBeenCalledTimes(1)
  poser(pause())
  // En pause, l'annonce ne change pas (rien de nouveau à dire) ; le bouton devient Reprendre.
  expect(region(container).textContent).toBe(annonce(FEEL))
  fireEvent.click(within(zone).getByRole('button', { name: T.resume }))
  expect(moteur.resume).toHaveBeenCalledTimes(1)
})

test('Arrêter : le moteur s arrête, l invite revient, le focus revient au morceau de la liste', () => {
  const { container } = render(<Music />)
  poser(lecture())
  const arreter = screen.getByRole('button', { name: T.stop })
  arreter.focus()
  fireEvent.click(arreter)
  expect(moteur.stop).toHaveBeenCalledTimes(1)
  poser(repos)
  expect(document.activeElement).toBe(bouton(container, FEEL))
  expect(screen.queryByRole('button', { name: T.stop })).toBeNull()
  expect(screen.getByText(T.hint)).toBeTruthy()
  expect(container.querySelector('img, a')).toBeNull()
  expect(container.querySelector('[aria-current]')).toBeNull()
  expect(region(container).textContent).toBe('')
})

test.each([
  ['unavailable', T.errorUnavailable],
  ['network', T.errorNetwork],
  ['blocked', T.errorBlocked],
])('erreur « %s » : annoncée et lisible', (code, message) => {
  const { container } = render(<Music />)
  poser(chargement())
  poser(erreur(code))
  expect(region(container).textContent).toBe(message)
  // Lisible à l'œil : pas dans un nœud masqué.
  const texte = within(region(container)).getByText(message)
  expect(texte.closest('.sr-only')).toBeNull()
  expect(container.querySelector('img, a')).toBeNull()
})

test.each(['network', 'unavailable'])('après une erreur « %s », on peut relancer : depuis la zone ou depuis la liste', (code) => {
  const { container } = render(<Music />)
  poser(erreur(code))
  const zone = container.querySelector('.music__now')
  fireEvent.click(within(zone).getByRole('button', { name: T.play }))
  expect(moteur.play).toHaveBeenLastCalledWith(FEEL)
  fireEvent.click(bouton(container, FEEL))
  expect(moteur.play).toHaveBeenCalledTimes(2)
  expect(moteur.play).toHaveBeenLastCalledWith(FEEL)
  expect(moteur.pause).not.toHaveBeenCalled()
  expect(moteur.resume).not.toHaveBeenCalled()
})

test('lecture refusée par le navigateur (blocked) : la relance passe par resume(), dans le geste', () => {
  const { container } = render(<Music />)
  poser(erreur('blocked'))
  const zone = container.querySelector('.music__now')
  fireEvent.click(within(zone).getByRole('button', { name: T.play }))
  expect(moteur.resume).toHaveBeenCalledTimes(1)
  fireEvent.click(bouton(container, FEEL))
  expect(moteur.resume).toHaveBeenCalledTimes(2)
  expect(moteur.play).not.toHaveBeenCalled()
  // Un autre morceau de la liste : on le joue.
  fireEvent.click(bouton(container, TRACKS[0]))
  expect(moteur.play).toHaveBeenCalledWith(TRACKS[0])
  expect(moteur.resume).toHaveBeenCalledTimes(2)
})

test('extrait terminé (repos, morceau gardé) : le bouton le rejoue, la liste aussi', () => {
  // Le moteur repasse au repos à la fin de l'extrait sans oublier le morceau (événement ended).
  const { container } = render(<Music />)
  poser({ ...lecture(), state: 'idle' })
  expect(region(container).textContent).toBe('')
  const zone = container.querySelector('.music__now')
  fireEvent.click(within(zone).getByRole('button', { name: T.play }))
  expect(moteur.play).toHaveBeenLastCalledWith(FEEL)
  fireEvent.click(bouton(container, FEEL))
  expect(moteur.play).toHaveBeenCalledTimes(2)
  expect(moteur.pause).not.toHaveBeenCalled()
  expect(moteur.resume).not.toHaveBeenCalled()
})

test('clavier : des boutons natifs dans la tabulation ; pendant le chargement, le focus reste', () => {
  const { container } = render(<Music />)
  for (const b of boutonsListe(container)) {
    expect(b.tagName).toBe('BUTTON')
    expect(b.hasAttribute('tabindex')).toBe(false)
    expect(b.disabled).toBe(false)
  }
  // Relance au clavier depuis la zone : le bouton reste focalisable pendant le chargement
  // (aria-disabled plutôt que disabled, qui ferait perdre le focus) et n'appelle rien.
  poser(erreur('network'))
  const zone = container.querySelector('.music__now')
  const relance = within(zone).getByRole('button', { name: T.play })
  relance.focus()
  fireEvent.click(relance)
  poser(chargement())
  expect(document.activeElement).toBe(relance)
  expect(relance.disabled).toBe(false)
  expect(relance.getAttribute('aria-disabled')).toBe('true')
  fireEvent.click(relance)
  expect(moteur.play).toHaveBeenCalledTimes(1)
  expect(moteur.pause).not.toHaveBeenCalled()
  for (const b of zone.querySelectorAll('button')) {
    expect(b.getAttribute('type')).toBe('button')
    expect(b.hasAttribute('tabindex')).toBe(false)
  }
})

test('sans WebGL 2, la liste et le lecteur fonctionnent', () => {
  const { container } = render(<Music />)
  expect(container.querySelector('canvas')).toBeNull()
  fireEvent.click(bouton(container, TRACKS[3]))
  expect(moteur.play).toHaveBeenCalledWith(TRACKS[3])
  poser(chargement(TRACKS[3]))
  poser(lecture(TRACKS[3]))
  expect(region(container).textContent).toBe(annonce(TRACKS[3]))
  fireEvent.click(screen.getByRole('button', { name: T.pause }))
  expect(moteur.pause).toHaveBeenCalledTimes(1)
  fireEvent.click(screen.getByRole('button', { name: T.stop }))
  expect(moteur.stop).toHaveBeenCalledTimes(1)
})

test('l en-tête : visible à p = 0, effacé à p = 0,5 (le h2 reste lisible), sans rendu inutile', () => {
  const { container } = render(<Music />)
  avancer(0)
  const section = container.querySelector('section#musique')
  expect(section.getAttribute('aria-labelledby')).toBe('music-title')
  const titre = screen.getByRole('heading', { level: 2, name: T.title })
  expect(titre.id).toBe('music-title')
  expect(screen.getByText(T.kicker)).toBeTruthy()
  const tete = container.querySelector('.music__head')
  expect(tete.dataset.visible).toBe('true')
  avancer(0.1)
  avancer(0.5)
  expect(tete.dataset.visible).toBe('false')
  expect(screen.getByRole('heading', { level: 2, name: T.title })).toBe(titre)
  // Dans un même état d'en-tête, le scroll ne rend pas la section.
  const rendus = vu.rendus.length
  avancer(0.6)
  avancer(0.95)
  expect(vu.rendus.length).toBe(rendus)
  avancer(0.05)
  expect(tete.dataset.visible).toBe('true')
})

test('l invite existe dans les trois langues et passe le garde emploi', () => {
  expect(fr.home.music.hint).toBe("Choisissez un morceau : l'extrait ne se charge qu'à ce moment-là.")
  expect(en.home.music.hint).toBe('Pick a track: the preview only loads when you do.')
  expect(ko.home.music.hint).toBe('곡을 고르면 그때 미리듣기를 불러옵니다.')
})

test('la liste garde le toucher natif (défilement à la main)', () => {
  const { container } = render(<Music />)
  // Le défilement tactile du site (useTouchScroll, App.jsx) ignore ce qui porte cet attribut.
  expect(liste(container).hasAttribute('data-native-touch')).toBe(true)
  expect(lire('../src/App.jsx')).toMatch(/\[data-native-touch\]/)
})

test('sous mouvement réduit, ni transition ni animation', () => {
  const css = sansCommentaires(lire('../src/styles/music.css'))
  const debut = css.indexOf('@media (prefers-reduced-motion: reduce)')
  expect(debut).toBeGreaterThan(-1)
  const bloc = css.slice(debut)
  expect(bloc).toMatch(/transition:\s*none/)
  expect(bloc).toMatch(/animation:\s*none/)
  expect(bloc).toMatch(/\.music__head/)
})

test('cibles tactiles de 44 px au moins pour les morceaux et les boutons', () => {
  const css = sansCommentaires(lire('../src/styles/music.css'))
  expect(css).toMatch(/\.music__track\s*\{[^}]*min-height:\s*44px/)
  expect(css).toMatch(/\.music__button\s*\{[^}]*min-height:\s*44px/)
})

test('la page d accueil place la musique après les projets, la réserve sous le rideau après elle', () => {
  const home = lire('../src/pages/Home.jsx')
  expect(home).toMatch(/import Music from "\.\.\/sections\/Music\.jsx"/)
  expect(home).toMatch(/<Projects \/><Music \/><SousLeRideau \/><Mcf \/>/)
})

// ——— Ronde de corrections 1 : le mini-lecteur, l'arrêt au démontage, le bouton en chargement ———

// IntersectionObserver factice : garde le rappel, les options et les cibles ; voirPlatine(r)
// simule le ratio d'intersection de la platine (la zone « en écoute » de la section).
const io = { instances: [] }
function installerIO() {
  io.instances = []
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(rappel, options) {
        this.rappel = rappel
        this.options = options
        this.cibles = []
        io.instances.push(this)
      }
      observe(el) {
        this.cibles.push(el)
      }
      unobserve() {}
      disconnect() {
        this.cibles = []
      }
    },
  )
}
const voirPlatine = (ratio) =>
  act(() => {
    for (const o of io.instances)
      for (const target of o.cibles) o.rappel([{ target, isIntersecting: ratio > 0, intersectionRatio: ratio }], o)
  })
const mini = () => screen.queryByRole('region', { name: T.miniLabel })

test('mini-lecteur : caché tant que la platine est à l écran, même en lecture', () => {
  installerIO()
  const { container } = render(<Music />)
  // L'observateur suit la platine de la section, dans la racine de scroll.
  expect(io.instances).toHaveLength(1)
  expect(io.instances[0].cibles).toEqual([container.querySelector('.music__now')])
  poser(lecture())
  voirPlatine(1)
  expect(mini()).toBeNull()
  expect(screen.getAllByRole('button', { name: T.stop })).toHaveLength(1)
})

test('mini-lecteur : la platine quitte l écran pendant la lecture, il apparaît avec le morceau et ses commandes', () => {
  installerIO()
  render(<Music />)
  poser(lecture())
  voirPlatine(1)
  const avant = document.activeElement
  voirPlatine(0)
  const m = mini()
  expect(m).toBeTruthy()
  expect(m.getAttribute('role')).toBe('region')
  // Il ne prend pas le focus en apparaissant.
  expect(document.activeElement).toBe(avant)
  expect(m.querySelector('.music__mini-now').textContent).toBe(annonce(FEEL))
  const pauseMini = within(m).getByRole('button', { name: T.pause })
  fireEvent.click(pauseMini)
  expect(moteur.pause).toHaveBeenCalledTimes(1)
  poser(pause())
  fireEvent.click(within(mini()).getByRole('button', { name: T.resume }))
  expect(moteur.resume).toHaveBeenCalledTimes(1)
  poser(lecture())
  fireEvent.click(within(mini()).getByRole('button', { name: T.stop }))
  expect(moteur.stop).toHaveBeenCalledTimes(1)
  for (const b of within(mini()).getAllByRole('button')) {
    expect(b.getAttribute('type')).toBe('button')
    expect(b.hasAttribute('tabindex')).toBe(false)
  }
  // Arrêter depuis le mini-lecteur ne fait pas défiler la page vers la liste (focus inchangé).
  expect(document.activeElement).not.toBe(screen.getAllByRole('button').find((b) => b.dataset.track === FEEL.id))
})

test('mini-lecteur : caché au repos (arrêt ou fin de l extrait) et en erreur ; visible au chargement', () => {
  installerIO()
  render(<Music />)
  voirPlatine(0)
  expect(mini()).toBeNull()
  poser(chargement())
  expect(mini()).toBeTruthy()
  poser(lecture())
  expect(mini()).toBeTruthy()
  poser({ ...lecture(), state: 'idle' })
  expect(mini()).toBeNull()
  poser(erreur('network'))
  expect(mini()).toBeNull()
  poser(pause())
  expect(mini()).toBeTruthy()
  poser(repos)
  expect(mini()).toBeNull()
})

test('mini-lecteur : la platine revient à l écran, il s efface', () => {
  installerIO()
  render(<Music />)
  poser(lecture())
  voirPlatine(0)
  expect(mini()).toBeTruthy()
  voirPlatine(0.2)
  expect(mini()).toBeTruthy()
  voirPlatine(1)
  expect(mini()).toBeNull()
})

test('sans IntersectionObserver, la platine est tenue pour visible : pas de mini-lecteur', () => {
  vi.stubGlobal('IntersectionObserver', undefined)
  render(<Music />)
  poser(lecture())
  expect(mini()).toBeNull()
})

test('le mini-lecteur a son libellé dans les trois langues', () => {
  expect(fr.home.music.miniLabel).toBe('Lecteur de musique')
  expect(en.home.music.miniLabel).toBe('Music player')
  expect(ko.home.music.miniLabel).toBe('음악 플레이어')
})

test('mini-lecteur : fixé, au-dessus du rideau du pied de page, sans animation sous mouvement réduit', () => {
  const css = sansCommentaires(lire('../src/styles/music.css'))
  const regle = css.match(/\.music__mini\s*\{([^}]*)\}/)[1]
  expect(regle).toMatch(/position:\s*fixed/)
  const z = Number(regle.match(/z-index:\s*(\d+)/)[1])
  const rideau = sansCommentaires(lire('../src/styles/home.css')).match(/\.mcf\s*\{([^}]*)\}/)[1]
  expect(z).toBeGreaterThan(Number(rideau.match(/z-index:\s*(\d+)/)[1]))
  // Sous la navigation (.site-chrome, z-index 9000).
  expect(z).toBeLessThan(9000)
  const bloc = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
  expect(bloc).toMatch(/\.music__mini[^{]*\{[^}]*animation:\s*none/)
})

test('la musique s arrête quand la section est démontée', () => {
  const { unmount } = render(<Music />)
  poser(lecture())
  expect(moteur.stop).not.toHaveBeenCalled()
  unmount()
  expect(moteur.stop).toHaveBeenCalledTimes(1)
})

test('pendant le chargement, le bouton principal se nomme par le texte du chargement', () => {
  installerIO()
  const { container } = render(<Music />)
  poser(chargement())
  const zone = container.querySelector('.music__now')
  const principal = within(zone).getByRole('button', { name: T.loading })
  expect(principal.getAttribute('aria-disabled')).toBe('true')
  expect(within(zone).queryByRole('button', { name: T.pause })).toBeNull()
  voirPlatine(0)
  expect(within(mini()).getByRole('button', { name: T.loading }).getAttribute('aria-disabled')).toBe('true')
  fireEvent.click(principal)
  fireEvent.click(within(mini()).getByRole('button', { name: T.loading }))
  expect(moteur.play).not.toHaveBeenCalled()
  expect(moteur.pause).not.toHaveBeenCalled()
})

test('un clic sur le morceau en cours de chargement est ignoré (pas de nouvelle requête)', () => {
  const { container } = render(<Music />)
  poser(chargement())
  fireEvent.click(bouton(container, FEEL))
  expect(moteur.play).not.toHaveBeenCalled()
  // Un autre morceau pendant le chargement : il le remplace.
  fireEvent.click(bouton(container, TRACKS[0]))
  expect(moteur.play).toHaveBeenCalledWith(TRACKS[0])
})
