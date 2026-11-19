import { EASINGS, checkShots, dollyZoom, orbit, shotAt, stillShot } from '../src/three/cinematic/shots.js'

const DEG = Math.PI / 180
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

// Compare deux poses composante par composante (tolérance des flottants).
function memePose(recu, attendu, digits = 9) {
  expect(Object.keys(recu).sort()).toEqual(['focus', 'fov', 'look', 'pos', 'roll'])
  for (const k of ['pos', 'look']) {
    expect(recu[k]).toHaveLength(3)
    recu[k].forEach((v, i) => expect(v).toBeCloseTo(attendu[k][i], digits))
  }
  for (const k of ['fov', 'roll', 'focus']) expect(recu[k]).toBeCloseTo(attendu[k], digits)
}

const A = { at: 0.2, pos: [0, 1, 5], look: [0, 1, 0], fov: 40, roll: 0, focus: 5 }
const B = { at: 0.6, pos: [4, 3, 1], look: [1, 2, 0], fov: 20, roll: 10, focus: 2 }
// Ni roll ni focus : roll 0, focus = distance de la caméra au point visé.
const C = { at: 0.9, pos: [-2, 0.5, 3], look: [0, 0, 0], fov: 60 }
const PLANS = [A, B, C]
const poseC = { pos: C.pos, look: C.look, fov: 60, roll: 0, focus: Math.hypot(2, 0.5, 3) }

describe('shotAt', () => {
  test('avant le premier plan : le premier', () => {
    memePose(shotAt(PLANS, 0), A)
    memePose(shotAt(PLANS, 0.1999), A)
    memePose(shotAt(PLANS, -3), A)
  })

  test('après le dernier plan : le dernier, avec roll 0 et focus sur le point visé', () => {
    memePose(shotAt(PLANS, 0.9), poseC)
    memePose(shotAt(PLANS, 1), poseC)
    memePose(shotAt(PLANS, 7), poseC)
  })

  test('sur une ancre : ce plan exactement', () => {
    memePose(shotAt(PLANS, 0.2), A)
    memePose(shotAt(PLANS, 0.6), B)
  })

  test('au milieu d un segment : la moyenne exacte', () => {
    memePose(shotAt(PLANS, 0.4), {
      pos: [2, 2, 3],
      look: [0.5, 1.5, 0],
      fov: 30,
      roll: 5,
      focus: 3.5,
    })
  })

  test('roll et focus interpolés, focus implicite compris', () => {
    const milieu = shotAt(PLANS, 0.75)
    expect(milieu.roll).toBeCloseTo(5, 9)
    expect(milieu.focus).toBeCloseTo((2 + poseC.focus) / 2, 9)
    // Monotones le long du segment : pas de saut.
    let avant = shotAt(PLANS, 0.6)
    for (let p = 0.62; p <= 0.9; p += 0.02) {
      const s = shotAt(PLANS, p)
      expect(s.roll).toBeLessThanOrEqual(avant.roll + 1e-12)
      expect(s.focus).toBeGreaterThanOrEqual(avant.focus - 1e-12)
      avant = s
    }
  })

  test('easing par segment : celui du plan qui ouvre le segment', () => {
    const quart = (ease) => shotAt([{ ...A, at: 0, ease }, { ...B, at: 1 }], 0.25).fov
    expect(quart('linear')).toBeCloseTo(40 - 20 * 0.25, 9)
    expect(quart('in')).toBeCloseTo(40 - 20 * EASINGS.in(0.25), 9)
    expect(quart('out')).toBeCloseTo(40 - 20 * EASINGS.out(0.25), 9)
    // Défaut 'inout' : lent au départ, symétrique.
    expect(quart(undefined)).toBeCloseTo(40 - 20 * EASINGS.inout(0.25), 9)
    expect(EASINGS.inout(0.25)).toBeLessThan(0.25)
    expect(EASINGS.inout(0.5)).toBe(0.5)
    // Une fonction est acceptée telle quelle.
    expect(quart((t) => t * t)).toBeCloseTo(40 - 20 * 0.0625, 9)
    // L'easing du plan d'arrivée n'a aucun effet sur ce segment.
    expect(shotAt([{ ...A, at: 0, ease: 'linear' }, { ...B, at: 1, ease: 'in' }], 0.25).fov).toBeCloseTo(35, 9)
  })

  test('sans état : des appels dans le désordre (saut par ancre) rendent les mêmes valeurs', () => {
    const ps = Array.from({ length: 41 }, (_, i) => i / 40)
    const balayage = new Map(ps.map((p) => [p, shotAt(PLANS, p)]))
    const desordre = [0.9, 0.05, 1, 0.425, 0, 0.6, 0.2, 0.775, 0.3, 0.95, 0.5, 0.125]
    for (let tour = 0; tour < 3; tour++) {
      for (const p of desordre) memePose(shotAt(PLANS, p), balayage.get(p), 12)
    }
    // Les plans fournis ne sont jamais modifiés.
    expect(A).toEqual({ at: 0.2, pos: [0, 1, 5], look: [0, 1, 0], fov: 40, roll: 0, focus: 5 })
    expect(C).toEqual({ at: 0.9, pos: [-2, 0.5, 3], look: [0, 0, 0], fov: 60 })
  })

  test('les tableaux rendus sont neufs : les modifier ne touche pas aux plans', () => {
    const s = shotAt(PLANS, 0.2)
    s.pos[0] = 99
    s.look[1] = 99
    expect(A.pos).toEqual([0, 1, 5])
    expect(A.look).toEqual([0, 1, 0])
  })

  test('progression invalide : traitée comme 0', () => {
    memePose(shotAt(PLANS, Number.NaN), A)
    memePose(shotAt(PLANS, undefined), A)
  })

  test('erreurs claires : aucun plan, mouvement inconnu', () => {
    expect(() => shotAt([], 0.5)).toThrow(/plan/)
    expect(() => shotAt(undefined, 0.5)).toThrow(/plan/)
    expect(() => shotAt([{ at: 0, move: { type: 'zoomBurst' } }], 0.5)).toThrow(/zoomBurst/)
  })
})

describe('mouvements nommés dans la timeline', () => {
  const ORBITE = { type: 'orbit', center: [0, 1, 0], radius: 4, height: 0.5, from: 0, to: 180, fov: 30 }
  const AVANT = { at: 0, pos: [0, 2, 8], look: [0, 1, 0], fov: 50 }
  const TOUR = { at: 0.5, move: ORBITE, roll: 6 }
  const APRES = { at: 0.8, pos: [1, 1, 1], look: [0, 1, 0], fov: 18, focus: 1.5 }
  const TIMELINE = [AVANT, TOUR, APRES]

  test('le segment qui suit le plan vient du mouvement, avec son easing', () => {
    const o = (u) => orbit(ORBITE, u)
    const debut = shotAt(TIMELINE, 0.5)
    expect(debut.pos.map((v) => +v.toFixed(9))).toEqual(o(0).pos.map((v) => +v.toFixed(9)))
    expect(debut.roll).toBe(6)
    // Milieu du segment 0.5 → 0.8, easing 'inout' : u = 0.5 exactement.
    const milieu = shotAt(TIMELINE, 0.65)
    milieu.pos.forEach((v, i) => expect(v).toBeCloseTo(o(0.5).pos[i], 9))
    expect(milieu.look).toEqual(ORBITE.center)
    expect(milieu.fov).toBe(30)
    // Focus implicite : la distance au centre de l'orbite.
    expect(milieu.focus).toBeCloseTo(Math.hypot(4, 0.5), 9)
    // Juste avant le plan suivant : la fin de l'orbite.
    shotAt(TIMELINE, 0.79999999).pos.forEach((v, i) => expect(v).toBeCloseTo(o(1).pos[i], 5))
    // Sur l'ancre suivante : le plan suivant.
    memePose(shotAt(TIMELINE, 0.8), { ...APRES, roll: 0 })
  })

  test('le segment qui mène au mouvement rejoint son départ', () => {
    const debut = orbit(ORBITE, 0)
    const p = shotAt(TIMELINE, 0.25)
    p.pos.forEach((v, i) => expect(v).toBeCloseTo((AVANT.pos[i] + debut.pos[i]) / 2, 9))
    expect(p.fov).toBeCloseTo(40, 9)
    expect(p.roll).toBeCloseTo(3, 9)
  })

  test('un mouvement en dernier plan court jusqu à p = 1', () => {
    const plans = [AVANT, { at: 0.5, move: { ...ORBITE }, ease: 'linear' }]
    const quart = shotAt(plans, 0.625)
    quart.pos.forEach((v, i) => expect(v).toBeCloseTo(orbit(ORBITE, 0.25).pos[i], 9))
    shotAt(plans, 1).pos.forEach((v, i) => expect(v).toBeCloseTo(orbit(ORBITE, 1).pos[i], 9))
    shotAt(plans, 3).pos.forEach((v, i) => expect(v).toBeCloseTo(orbit(ORBITE, 1).pos[i], 9))
  })

  test('dollyZoom dans la timeline : largeur cadrée constante, focus qui suit le sujet', () => {
    const vertigo = { type: 'dollyZoom', subject: [0, 1.5, 0], dir: [0, 0, 1], fovFrom: 20, fovTo: 70, width: 2 }
    const plans = [{ at: 0, move: vertigo }, { at: 1, pos: [0, 1.5, 3], look: [0, 1.5, 0], fov: 50 }]
    for (let p = 0; p < 1; p += 0.1) {
      const s = shotAt(plans, p)
      expect(2 * s.focus * Math.tan((s.fov * DEG) / 2)).toBeCloseTo(2, 9)
    }
  })
})

// Validation faite une fois, au rendu : une erreur jetée plus tard dans useFrame échapperait
// à la barrière d'erreur et casserait la boucle de rendu de R3F.
describe('checkShots', () => {
  const OK = { at: 0, pos: [0, 1, 5], look: [0, 1, 0], fov: 40 }

  test('timeline valide : rendue telle quelle, mouvements compris', () => {
    expect(checkShots(PLANS)).toBe(PLANS)
    const vertigo = { type: 'dollyZoom', subject: [0, 1, 0], dir: [0, 0, 1], fovFrom: 20, fovTo: 60, width: 2 }
    const orbite = { type: 'orbit', center: [0, 1, 0], radius: 3, from: 0, to: 90, fov: 30 }
    expect(() =>
      checkShots([OK, { at: 0.3, move: vertigo, ease: 'linear' }, { at: 0.6, move: orbite, roll: 4, focus: 2 }]),
    ).not.toThrow()
    expect(() => checkShots([{ ...OK, ease: (t) => t * t }])).not.toThrow()
  })

  test.each([
    ['aucun plan', [], /aucun plan/],
    ['pas un tableau', undefined, /aucun plan/],
    ['ancre manquante', [{ ...OK, at: undefined }], /plan 0.*at/],
    ['ancres dans le désordre', [{ ...OK, at: 0.5 }, { ...OK, at: 0.2 }], /plan 1.*tri/],
    ['easing inconnu', [{ ...OK, ease: 'bounce' }], /plan 0.*bounce/],
    ['mouvement inconnu', [OK, { at: 1, move: { type: 'zoomBurst' } }], /plan 1.*zoomBurst/],
    ['pos manquante', [OK, { at: 1, look: [0, 0, 0], fov: 30 }], /plan 1.*pos/],
    ['look mal formé', [{ ...OK, look: [0, 1] }], /plan 0.*look/],
    ['fov non numérique', [{ ...OK, fov: '40' }], /plan 0.*fov/],
    ['roll non fini', [{ ...OK, roll: Number.NaN }], /plan 0.*roll/],
    ['orbite incomplète', [{ at: 0, move: { type: 'orbit', radius: 2, from: 0, to: 90, fov: 30 } }], /plan 0/],
    ['dollyZoom sans direction', [{ at: 0, move: { type: 'dollyZoom', subject: [0, 0, 0], dir: [0, 0, 0], fovFrom: 20, fovTo: 60, width: 1 } }], /plan 0.*dir/],
  ])('%s : erreur claire', (_, plans, motif) => {
    expect(() => checkShots(plans)).toThrow(motif)
  })

  test('still vérifié aussi : nombre fini, ou plan complet', () => {
    expect(() => checkShots(PLANS, 0.3)).not.toThrow()
    expect(() => checkShots(PLANS, { pos: [0, 1, 4], look: [0, 1, 0], fov: 30 })).not.toThrow()
    expect(() => checkShots(PLANS, Number.NaN)).toThrow(/still/)
    expect(() => checkShots(PLANS, { pos: [0, 1, 4], fov: 30 })).toThrow(/still.*look/)
  })
})

describe('stillShot', () => {
  test('sans still : le plan de p = 0.5', () => {
    memePose(stillShot(PLANS), shotAt(PLANS, 0.5))
    memePose(stillShot(PLANS, null), shotAt(PLANS, 0.5))
  })

  test('still numérique : le plan de cette progression', () => {
    memePose(stillShot(PLANS, 0.85), shotAt(PLANS, 0.85))
  })

  test('still objet : ce plan, valeurs par défaut comprises', () => {
    const still = { pos: [1, 2, 3], look: [1, 2, 0], fov: 28 }
    memePose(stillShot(PLANS, still), { ...still, roll: 0, focus: 3 })
    memePose(stillShot(PLANS, { ...still, roll: -4, focus: 9 }), { ...still, roll: -4, focus: 9 })
  })
})

describe('orbit', () => {
  const O = { center: [1, 0.5, -2], radius: 3, height: 1.2, from: 30, to: 300, fov: 35 }

  test('u = 0 et u = 1 aux angles demandés (0° = +Z, 90° = +X)', () => {
    const a = orbit(O, 0)
    const b = orbit(O, 1)
    expect(a.pos[0]).toBeCloseTo(1 + 3 * Math.sin(30 * DEG), 12)
    expect(a.pos[2]).toBeCloseTo(-2 + 3 * Math.cos(30 * DEG), 12)
    expect(b.pos[0]).toBeCloseTo(1 + 3 * Math.sin(300 * DEG), 12)
    expect(b.pos[2]).toBeCloseTo(-2 + 3 * Math.cos(300 * DEG), 12)
    expect(a.pos[1]).toBeCloseTo(1.7, 12)
    const quart = orbit({ center: [0, 0, 0], radius: 2, from: 90, to: 90, fov: 40 }, 0.5)
    quart.pos.forEach((v, i) => expect(v).toBeCloseTo([2, 0, 0][i], 12))
  })

  test('distance au centre constante, regard sur le centre', () => {
    for (let u = 0; u <= 1; u += 0.05) {
      const s = orbit(O, u)
      expect(dist(s.pos, O.center)).toBeCloseTo(Math.hypot(3, 1.2), 12)
      expect(Math.hypot(s.pos[0] - 1, s.pos[2] + 2)).toBeCloseTo(3, 12)
      expect(s.look).toEqual(O.center)
      expect(s.fov).toBe(35)
    }
    expect(orbit(O, 0.5).look).not.toBe(O.center)
  })

  test('hauteur facultative : à la hauteur du centre', () => {
    expect(orbit({ center: [0, 2, 0], radius: 1, from: 0, to: 0, fov: 30 }, 0).pos[1]).toBe(2)
  })
})

describe('dollyZoom', () => {
  const D = { subject: [0.5, 1.6, -1], dir: [1, 0.5, 2], fovFrom: 15, fovTo: 75, width: 1.4 }

  test('largeur cadrée au sujet constante sur 10 valeurs de u', () => {
    for (let k = 0; k < 10; k++) {
      const u = k / 9
      const s = dollyZoom(D, u)
      const largeur = 2 * dist(s.pos, D.subject) * Math.tan((s.fov * DEG) / 2)
      expect(Math.abs(largeur - D.width)).toBeLessThan(1e-6)
    }
  })

  test('fov de fovFrom à fovTo, caméra sur l axe dir, regard sur le sujet', () => {
    expect(dollyZoom(D, 0).fov).toBe(15)
    expect(dollyZoom(D, 1).fov).toBe(75)
    const s = dollyZoom(D, 0.3)
    const n = Math.hypot(...D.dir)
    const d = dist(s.pos, D.subject)
    s.pos.forEach((v, i) => expect((v - D.subject[i]) / d).toBeCloseTo(D.dir[i] / n, 12))
    expect(s.look).toEqual(D.subject)
    // Le fov s'ouvre : la caméra avance vers le sujet.
    expect(dist(dollyZoom(D, 1).pos, D.subject)).toBeLessThan(dist(dollyZoom(D, 0).pos, D.subject))
  })

  test('direction nulle : erreur claire', () => {
    expect(() => dollyZoom({ ...D, dir: [0, 0, 0] }, 0.5)).toThrow(/dir/)
  })
})
