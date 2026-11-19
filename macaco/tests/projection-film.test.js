// La pellicule suit la progression : images mêlées, amorce, brûlure, couleur renvoyée par l'écran.
import { Color } from 'three'
import { screenColor, setFilmStep } from '../src/three/projection/filmMaterial.js'
import { LEADER, PROJECT_ANCHORS, leaderAt, projectAt } from '../src/three/projection/steps.js'

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
