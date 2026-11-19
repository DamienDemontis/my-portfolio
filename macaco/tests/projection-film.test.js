// La pellicule suit la progression : images mêlées, amorce, brûlure, couleur renvoyée par l'écran.
import { Color, SRGBColorSpace } from 'three'
import { filmTextures, screenColor, setFilmStep } from '../src/three/projection/filmMaterial.js'
import { LEADER, PROJECT_ANCHORS, leaderAt, projectAt, stageStep } from '../src/three/projection/steps.js'
import { PROJECTS } from '../src/content/projects.js'

const uniformes = () => ({
  uFrom: { value: 'x' },
  uTo: { value: 'x' },
  uFromLeader: { value: -1 },
  uToLeader: { value: -1 },
  uBurn: { value: -1 },
})
const TEXTURES = ['t0', 't1', 't2', 't3', 't4', 't5']
const COULEURS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'].map((c) => new Color(c))
const AMORCE = new Color('#808080')

test('on an anchor, both film slots hold that project, unburnt', () => {
  const u = uniformes()
  setFilmStep(u, projectAt(PROJECT_ANCHORS[3]), TEXTURES)
  expect(u.uFrom.value).toBe('t3')
  expect(u.uTo.value).toBe('t3')
  expect(u.uFromLeader.value).toBe(0)
  expect(u.uToLeader.value).toBe(0)
  expect(u.uBurn.value).toBe(0)
})

test('between two anchors the film burns from one project to the next', () => {
  const u = uniformes()
  const milieu = (PROJECT_ANCHORS[1] + PROJECT_ANCHORS[2]) / 2
  setFilmStep(u, projectAt(milieu), TEXTURES)
  expect(u.uFrom.value).toBe('t1')
  expect(u.uTo.value).toBe('t2')
  expect(u.uBurn.value).toBeCloseTo(0.5, 9)
})

test('the leader has no texture and raises its flag', () => {
  const u = uniformes()
  setFilmStep(u, projectAt(0), TEXTURES)
  expect(u.uFrom.value).toBeNull()
  expect(u.uFromLeader.value).toBe(1)
  expect(u.uToLeader.value).toBe(1)
  const premier = PROJECT_ANCHORS[0] - (PROJECT_ANCHORS[1] - PROJECT_ANCHORS[0]) / 2
  setFilmStep(u, projectAt(premier), TEXTURES)
  expect(u.uFromLeader.value).toBe(1)
  expect(u.uTo.value).toBe('t0')
  expect(u.uToLeader.value).toBe(0)
})

test('the screen throws the colour of what it shows, blended through the burn', () => {
  expect(screenColor(projectAt(PROJECT_ANCHORS[2]), COULEURS, AMORCE).equals(COULEURS[2])).toBe(true)
  expect(screenColor(projectAt(0), COULEURS, AMORCE).equals(AMORCE)).toBe(true)
  const milieu = (PROJECT_ANCHORS[0] + PROJECT_ANCHORS[1]) / 2
  const c = screenColor(projectAt(milieu), COULEURS, AMORCE)
  expect(c.r).toBeCloseTo(0.5, 6)
  expect(c.g).toBeCloseTo(0.5, 6)
  const sortie = new Color()
  expect(screenColor({ from: LEADER, to: 0, burn: 1 }, COULEURS, AMORCE, sortie)).toBe(sortie)
})

test('animated, the stage shows the scroll; under reduced motion, the card on show, unburnt', () => {
  const milieu = (PROJECT_ANCHORS[1] + PROJECT_ANCHORS[2]) / 2
  expect(stageStep(milieu, true, 4)).toEqual(projectAt(milieu))
  expect(stageStep(milieu, false, 4)).toEqual({ index: 4, from: 4, to: 4, burn: 0 })
  expect(stageStep(milieu, false, LEADER)).toEqual({ index: LEADER, from: LEADER, to: LEADER, burn: 0 })
  // la pellicule, la couleur renvoyée et la teinte du faisceau suivent alors la carte
  const u = uniformes()
  setFilmStep(u, stageStep(milieu, false, 4), TEXTURES)
  expect(u.uFrom.value).toBe('t4')
  expect(u.uTo.value).toBe('t4')
  expect(u.uBurn.value).toBe(0)
  expect(screenColor(stageStep(milieu, false, 4), COULEURS, AMORCE).equals(COULEURS[4])).toBe(true)
})

test('one film texture per project: the images in order, a drawn title card for each title', () => {
  const projets = [
    { id: 'a', media: { kind: 'title', glyph: 'ecg', color: '#111111' } },
    { id: 'b', media: { kind: 'image', src: '/b.webp', color: '#222222' } },
    { id: 'c', media: { kind: 'title', glyph: 'cat', color: '#333333', label: 'Chat' } },
    { id: 'd', media: { kind: 'image', src: '/d.webp', color: '#444444' } },
  ]
  const images = [{ nom: 'b' }, { nom: 'd' }]
  const appels = []
  const fabrique = (media, nom) => {
    appels.push([media, nom])
    return { carte: media.glyph }
  }
  const t = filmTextures(projets, images, fabrique)
  expect(t).toHaveLength(4)
  expect(t[1]).toBe(images[0])
  expect(t[3]).toBe(images[1])
  expect(images.map((i) => i.colorSpace)).toEqual([SRGBColorSpace, SRGBColorSpace])
  expect(t[0]).toEqual({ carte: 'ecg' })
  expect(t[2]).toEqual({ carte: 'cat' })
  expect(appels).toEqual([
    [projets[0].media, ''],
    [projets[2].media, 'Chat'],
  ])
})

test('the title cards of the real projects take their name from the data', () => {
  const noms = []
  const images = PROJECTS.filter((p) => p.media.kind === 'image').map(() => ({}))
  const t = filmTextures(PROJECTS, images, (media, nom) => {
    noms.push([media.glyph, nom])
    return {}
  })
  expect(t).toHaveLength(PROJECTS.length)
  expect(noms).toEqual([
    ['ecg', ''],
    ['cat', 'JobNeko'],
  ])
})

test('the leader counts down before the first project, then stays done', () => {
  expect(leaderAt(0)).toBe(0)
  expect(leaderAt(0.08)).toBe(0)
  const premier = PROJECT_ANCHORS[0] - (PROJECT_ANCHORS[1] - PROJECT_ANCHORS[0]) / 2
  expect(leaderAt(premier)).toBeCloseTo(0.999, 9)
  expect(leaderAt(0.12)).toBeGreaterThan(0)
  expect(leaderAt(0.12)).toBeLessThan(leaderAt(0.16))
  expect(leaderAt(1)).toBeCloseTo(0.999, 9)
  expect(leaderAt(NaN)).toBe(0)
})
