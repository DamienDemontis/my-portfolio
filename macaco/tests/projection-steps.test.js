// Salle de projection : la progression du scroll donne le projet à l'écran, sans état.
import { BURN_WINDOW, LEADER, PROJECT_ANCHORS, projectAt } from '../src/three/projection/steps.js'
import { PROJECTS } from '../src/content/projects.js'

const n = PROJECT_ANCHORS.length

test('one anchor per project, increasing, inside the track', () => {
  expect(n).toBe(PROJECTS.length)
  PROJECT_ANCHORS.forEach((a, i) => {
    expect(a).toBeGreaterThan(0)
    expect(a).toBeLessThan(1)
    if (i) expect(a).toBeGreaterThan(PROJECT_ANCHORS[i - 1])
  })
})

test('each anchor shows its project, unburnt', () => {
  PROJECT_ANCHORS.forEach((a, i) => {
    expect(projectAt(a)).toEqual({ index: i, from: i, to: i, burn: 0 })
  })
})

test('the projector starts on the leader', () => {
  expect(projectAt(0)).toEqual({ index: LEADER, from: LEADER, to: LEADER, burn: 0 })
  expect(projectAt(-1).index).toBe(LEADER)
  expect(projectAt(Number.NEGATIVE_INFINITY).index).toBe(LEADER)
  expect(projectAt(NaN)).toEqual(projectAt(0))
  expect(projectAt(undefined)).toEqual(projectAt(0))
})

test('after the last anchor, the last project stays', () => {
  for (const p of [0.9, 1, 2, Number.POSITIVE_INFINITY]) expect(projectAt(p)).toEqual({ index: n - 1, from: n - 1, to: n - 1, burn: 0 })
})

test('between two anchors the film burns from one to the next, centred on the midpoint', () => {
  const ecart = PROJECT_ANCHORS[1] - PROJECT_ANCHORS[0]
  for (let k = 1; k < n; k++) {
    const milieu = (PROJECT_ANCHORS[k - 1] + PROJECT_ANCHORS[k]) / 2
    const m = projectAt(milieu)
    expect(m.from).toBe(k - 1)
    expect(m.to).toBe(k)
    expect(m.burn).toBeCloseTo(0.5, 9)
    expect(m.index).toBe(k) // le texte change au milieu de la brûlure
    const avant = projectAt(milieu - 0.25 * BURN_WINDOW * ecart)
    const apres = projectAt(milieu + 0.25 * BURN_WINDOW * ecart)
    expect(avant.burn).toBeGreaterThan(0)
    expect(avant.burn).toBeLessThan(m.burn)
    expect(apres.burn).toBeGreaterThan(m.burn)
    expect(apres.burn).toBeLessThan(1)
    expect(avant.index).toBe(k - 1)
    // hors fenêtre : plus de brûlure
    expect(projectAt(milieu - 0.6 * BURN_WINDOW * ecart).burn).toBe(0)
  }
})

test('the leader burns into the first project before the first anchor', () => {
  const ecart = PROJECT_ANCHORS[1] - PROJECT_ANCHORS[0]
  const m = projectAt(PROJECT_ANCHORS[0] - ecart / 2)
  expect(m).toMatchObject({ from: LEADER, to: 0, index: 0 })
  expect(m.burn).toBeCloseTo(0.5, 9)
})

test('answers do not depend on call order (anchor jumps)', () => {
  const ps = Array.from({ length: 41 }, (_, i) => i / 40)
  const dans = ps.map(projectAt)
  const desordre = [...ps].reverse().map(projectAt).reverse()
  expect(desordre).toEqual(dans)
})
