import { act, render, waitFor } from '@testing-library/react'
import React from 'react'
import { PerspectiveCamera } from 'three'
import { shotAt, stillShot } from '../src/three/cinematic/shots.js'

// R3F, drei et postprocessing sont remplacés par des faux. Le faux Canvas relève ses props
// et rend ses enfants dans le DOM ; useFrame range les callbacks pour que le test dessine
// les images lui-même ; useThree lit un état factice (vraie caméra three, invalidate espionné).
// On compte les imports de fiber : seul le module du canvas l'importe, chargé en paresseux.
const vu = vi.hoisted(() => ({
  importsFiber: 0,
  canvas: null,
  frames: new Set(),
  etat: null,
  preloads: [],
  dof: null,
  decor: null,
  enfantsComposer: new Set(),
}))

vi.mock('@react-three/fiber', async () => {
  const React = await import('react')
  vu.importsFiber++
  return {
    Canvas: ({ children, ...props }) => {
      vu.canvas = props
      return React.createElement(
        React.Fragment,
        null,
        React.createElement('canvas', { 'data-testid': 'cinematic-canvas' }),
        children,
      )
    },
    // Comme R3F : le dernier callback rendu est celui qui s'exécute, abonné dans un effet de
    // mise en page (avant les effets ordinaires).
    useFrame: (callback) => {
      const ref = React.useRef(callback)
      ref.current = callback
      React.useLayoutEffect(() => {
        const frame = () => ref.current(vu.etat, 1 / 60)
        vu.frames.add(frame)
        return () => vu.frames.delete(frame)
      }, [])
    },
    useThree: (selecteur) => selecteur(vu.etat),
  }
})

vi.mock('@react-three/drei', () => ({
  useGLTF: Object.assign(() => ({}), { preload: (url) => vu.preloads.push(url) }),
}))

// Le faux EffectComposer rend un élément qui contient ses effets et relève l'identité de ses
// enfants : le vrai reconstruit ses passes (et recompile ses shaders) quand elle change.
vi.mock('@react-three/postprocessing', async () => {
  const React = await import('react')
  return {
    EffectComposer: ({ children }) => {
      vu.enfantsComposer.add(children)
      return React.createElement('i', { 'data-testid': 'composer' }, children)
    },
    DepthOfField: React.forwardRef(function DepthOfField(props, ref) {
      const effet = React.useMemo(() => ({ props, cocMaterial: { focusDistance: 0 } }), [])
      vu.dof = effet
      React.useImperativeHandle(ref, () => effet, [effet])
      return React.createElement('i', { 'data-testid': 'dof' })
    }),
  }
})

import CinematicSection from '../src/three/cinematic/CinematicSection.jsx'

const REDUIT = '(prefers-reduced-motion: reduce)'

const PLANS = [
  { at: 0, pos: [0, 1.6, 6], look: [0, 1.4, 0], fov: 35 },
  { at: 0.5, pos: [3, 0.4, 2], look: [0, 1.5, 0], fov: 22, roll: 8, focus: 3 },
  { at: 1, pos: [-2, 4, 1], look: [0, 1, 0], fov: 50 },
]
const PRELOAD = ['/props/boombox.glb', '/props/dandelion_01.glb']

// Décor de test : rendu dans le faux Canvas, il relève les props reçues.
function Decor(props) {
  vu.decor = props
  return <i data-testid="decor" />
}

// Effet de test pour le slot `effects` (un Bloom, par exemple).
function Eclat() {
  return <i data-testid="eclat" />
}

// Variante étroite des plans : plus loin, plus large.
const ETROIT = PLANS.map((plan) => ({ ...plan, pos: plan.pos.map((v) => v * 1.5), fov: plan.fov + 15 }))

// Taille de la fenêtre (le cadrage se choisit sur son rapport), annoncée par un resize.
function ecran(largeur, hauteur) {
  vi.stubGlobal('innerWidth', largeur)
  vi.stubGlobal('innerHeight', hauteur)
  window.dispatchEvent(new Event('resize'))
}

// IntersectionObserver piloté : chaque instance relève sa racine, sa marge et ses cibles ;
// voir(v) appelle les rappels comme le navigateur. jsdom n'en a pas : sans lui, la section
// se tient pour visible.
function observateurs() {
  const instances = []
  class FauxIO {
    constructor(rappel, options) {
      Object.assign(this, { rappel, options, cibles: [], coupe: false })
      instances.push(this)
    }
    observe(el) {
      this.cibles.push(el)
    }
    unobserve() {}
    disconnect() {
      this.coupe = true
    }
  }
  vi.stubGlobal('IntersectionObserver', FauxIO)
  const voir = (visible) =>
    act(() => {
      for (const io of instances) {
        if (!io.coupe) io.rappel(io.cibles.map((target) => ({ target, isIntersecting: visible })))
      }
    })
  return { instances, voir }
}

// Mise en page factice : racine de scroll de 800 px, section de 2 400 px qui commence à 4 000 px.
// Course de l'épinglage : 2 400 − 800 = 1 600 px. Elle est à moins d'un écran dès 2 400 px de scroll.
const mise = { scroll: 0, vh: 800, top: 4000, height: 2400 }
const scrollPour = (p) => mise.top + p * (mise.height - mise.vh)
let racine

beforeAll(() => {
  racine = document.createElement('div')
  racine.id = 'scroll-root'
  document.body.appendChild(racine)
  Object.defineProperty(racine, 'scrollTop', { configurable: true, get: () => mise.scroll })
  Object.defineProperty(racine, 'clientHeight', { configurable: true, get: () => mise.vh })
})

// matchMedia piloté : chaque requête suit `etat`, basculer() prévient ses écouteurs.
function medias(etat) {
  const ecouteurs = new Map()
  vi.stubGlobal('matchMedia', (q) => ({
    media: q,
    get matches() {
      return Boolean(etat[q])
    },
    addEventListener: (_, f) => ecouteurs.set(f, q),
    removeEventListener: (_, f) => ecouteurs.delete(f),
  }))
  return (q, valeur) => {
    etat[q] = valeur
    for (const [f, requete] of ecouteurs) if (requete === q) f()
  }
}

beforeEach(() => {
  Object.assign(mise, { scroll: 0, vh: 800, top: 4000, height: 2400 })
  vu.canvas = null
  vu.preloads = []
  vu.dof = null
  vu.decor = null
  vu.enfantsComposer = new Set()
  vu.etat = {
    camera: new PerspectiveCamera(50, 1.6, 0.1, 100),
    invalidate: vi.fn(),
    // advance() de R3F dessine une image quelle que soit la boucle.
    advance: vi.fn(() => {
      for (const frame of vu.frames) frame()
    }),
    size: { width: 1280, height: 800 },
  }
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect() {
    const section = this.classList?.contains('cinematic')
    const top = section ? mise.top - mise.scroll : 0
    const height = section ? mise.height : 0
    return { top, bottom: top + height, height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON() {} }
  })
  Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' })
  // jsdom n'a pas matchMedia (useIsCoarsePointer l'appelle) : aucune préférence par défaut.
  medias({})
  // Créneau d'inactivité immédiat : afterLoad rappelle dès l'événement load.
  vi.stubGlobal('requestIdleCallback', (f) => {
    f()
    return 1
  })
  vi.stubGlobal('cancelIdleCallback', () => {})
  // jsdom n'a pas WebGL : un faux contexte WebGL 2 suffit à la sonde.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((type) =>
    type === 'webgl2' ? { getExtension: () => null } : null,
  )
})

afterEach(() => {
  delete document.readyState
  vi.restoreAllMocks()
})

const defiler = (y) =>
  act(() => {
    mise.scroll = y
    racine.dispatchEvent(new Event('scroll'))
  })
const charger = () =>
  act(() => {
    window.dispatchEvent(new Event('load'))
  })
const dessiner = () =>
  act(() => {
    for (const frame of vu.frames) frame()
  })
const canvasDe = (container) => container.querySelector('[data-testid="cinematic-canvas"]')
// Laisse aboutir tout import dynamique lancé (le canvas paresseux), puis le rendu qui suit.
const importsFaits = () =>
  act(async () => {
    await vi.dynamicImportSettled()
  })

// Caméra attendue, construite à part avec les primitives de three.
function cameraPour(pose) {
  const c = new PerspectiveCamera()
  c.position.set(...pose.pos)
  c.up.set(...(pose.up ?? [0, 1, 0]))
  c.lookAt(...pose.look)
  c.rotateZ((pose.roll * Math.PI) / 180)
  return c
}
function memeCamera(camera, pose) {
  const attendue = cameraPour(pose)
  camera.position.toArray().forEach((v, i) => expect(v).toBeCloseTo(pose.pos[i], 9))
  camera.quaternion.toArray().forEach((v, i) => expect(v).toBeCloseTo(attendue.quaternion.toArray()[i], 9))
  expect(camera.fov).toBeCloseTo(pose.fov, 9)
}
// Compte les appels aux setters de useState (setters enveloppés, identité stable).
// Un setState qui ne change rien n'est pas gratuit : React garde la mise à jour en file
// jusqu'au prochain rendu du composant.
function compterSetters() {
  const original = React.useState
  const appels = { n: 0 }
  const enveloppes = new WeakMap()
  vi.spyOn(React, 'useState').mockImplementation((init) => {
    const [valeur, set] = original(init)
    if (!enveloppes.has(set)) {
      enveloppes.set(set, (x) => {
        appels.n++
        return set(x)
      })
    }
    return [valeur, enveloppes.get(set)]
  })
  return appels
}
const instantane = (c) => [...c.position.toArray(), ...c.quaternion.toArray(), c.fov].map((v) => +v.toFixed(9))

// L'ordre compte : fiber n'est importé qu'une fois par fichier, donc les cas où rien ne
// doit se charger passent avant le premier montage.
describe('CinematicSection', () => {
  test('structure : piste de la hauteur demandée, enfant collant, canvas masqué, texte en DOM', () => {
    const { container } = render(
      <CinematicSection id="projets" track="320svh" shots={PLANS}>
        <h2>Projets</h2>
      </CinematicSection>,
    )
    const section = container.querySelector('section#projets')
    expect(section.classList.contains('cinematic')).toBe(true)
    expect(section.style.height).toBe('320svh')
    const pin = section.querySelector(':scope > .cinematic__pin')
    expect(pin).not.toBeNull()
    expect(pin.querySelector('.cinematic__canvas').getAttribute('aria-hidden')).toBe('true')
    expect(pin.querySelector('h2').textContent).toBe('Projets')
    expect(pin.querySelector('.cinematic__canvas h2')).toBeNull()
  })

  test('piste par défaut : 300svh', () => {
    const { container } = render(<CinematicSection id="musique" shots={PLANS} />)
    expect(container.querySelector('section').style.height).toBe('300svh')
  })

  test('attributs de section transmis : classe, aria-labelledby, data-*, style (hauteur de piste gardée)', () => {
    const { container } = render(
      <CinematicSection
        id="attributs"
        track="250svh"
        shots={PLANS}
        className="projets sombre"
        aria-labelledby="projets-titre"
        data-teinte="cuivre"
        style={{ color: 'red', height: '10px' }}
      >
        <h2 id="projets-titre">Projets</h2>
      </CinematicSection>,
    )
    const section = container.querySelector('section#attributs')
    expect(section.className).toBe('cinematic projets sombre')
    expect(section.getAttribute('aria-labelledby')).toBe('projets-titre')
    expect(section.dataset.teinte).toBe('cuivre')
    expect(section.style.color).toBe('red')
    expect(section.style.height).toBe('250svh')
  })

  test('poster : un élément est rendu tel quel, dans le calque masqué ; sans poster, aucun calque', () => {
    const { container } = render(<CinematicSection id="affiche-el" shots={PLANS} poster={<svg data-testid="affiche-svg" />} />)
    const affiche = container.querySelector('.cinematic__canvas .cinematic__poster')
    expect(affiche.querySelector('[data-testid="affiche-svg"]')).not.toBeNull()
    expect(affiche.dataset.visible).toBe('true')
    const sans = render(<CinematicSection id="sans-affiche" shots={PLANS} />)
    expect(sans.container.querySelector('.cinematic__poster')).toBeNull()
  })

  test('une section jamais atteinte ne télécharge rien', async () => {
    const { container } = render(<CinematicSection id="loin" shots={PLANS} preload={PRELOAD} stage={Decor} />)
    charger()
    defiler(1000)
    defiler(2300) // encore à plus d'un écran : 4 000 − (2 300 + 800) = 900 px
    await importsFaits()
    expect(canvasDe(container)).toBeNull()
    expect(container.querySelector('[data-testid="decor"]')).toBeNull()
    expect(vu.importsFiber).toBe(0)
    expect(vu.preloads).toEqual([])
  })

  test('loin, le scroll ne touche à aucun état tant que la proximité ne change pas', () => {
    const appels = compterSetters()
    const { container } = render(<CinematicSection id="calme" shots={PLANS} />)
    const montage = appels.n
    for (let y = 0; y <= 2300; y += 100) defiler(y)
    expect(appels.n).toBe(montage)
    // Passage à moins d'un écran : un seul changement d'état, puis plus rien en approchant.
    defiler(2500)
    expect(appels.n).toBe(montage + 1)
    for (let y = 2600; y <= 4800; y += 200) defiler(y)
    expect(appels.n).toBe(montage + 1)
    // Retour au loin : un seul changement encore.
    defiler(0)
    defiler(500)
    expect(appels.n).toBe(montage + 2)
    expect(canvasDe(container)).toBeNull()
  })

  test('à moins d un écran mais avant load : rien ; après load : monté, préchargé, rendu à la demande', async () => {
    mise.scroll = 2500
    const { container } = render(<CinematicSection id="proche" shots={PLANS} preload={PRELOAD} stage={Decor} />)
    await importsFaits()
    expect(canvasDe(container)).toBeNull()
    expect(vu.importsFiber).toBe(0)
    expect(vu.preloads).toEqual([])

    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    expect(vu.importsFiber).toBe(1)
    expect(vu.preloads).toEqual(PRELOAD)
    expect(vu.canvas.frameloop).toBe('demand')
    expect(container.querySelector('.cinematic__canvas').contains(canvasDe(container))).toBe(true)
    expect(container.querySelector('[data-testid="decor"]')).not.toBeNull()
    expect(vu.decor.timeline.current.p).toBe(0)
    expect(vu.decor.policy).toEqual(expect.objectContaining({ frameloop: expect.any(String) }))
  })

  test('monté en approchant par le scroll, démonté une fois loin', async () => {
    const { container } = render(<CinematicSection id="approche" shots={PLANS} stage={Decor} />)
    charger()
    await importsFaits()
    expect(canvasDe(container)).toBeNull()
    defiler(2500)
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    // Entre un écran et un écran et demi : reste monté (pas de va-et-vient à la limite).
    defiler(2300)
    expect(canvasDe(container)).not.toBeNull()
    defiler(0)
    expect(canvasDe(container)).toBeNull()
    // Dépassée par le haut : remontée en repassant, démontée au-delà d'un écran et demi.
    defiler(scrollPour(1))
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    defiler(scrollPour(1) + mise.vh + 1300) // 1 300 px entre le bas de la section et l'écran
    expect(canvasDe(container)).toBeNull()
  })

  test('saut par ancre : la première image donne le plan de la position atteinte, puis suit le scroll', async () => {
    mise.scroll = scrollPour(0.75)
    const { container } = render(<CinematicSection id="ancre" shots={PLANS} />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    dessiner()
    memeCamera(vu.etat.camera, shotAt(PLANS, 0.75))

    const avant = vu.etat.invalidate.mock.calls.length
    defiler(scrollPour(0.25))
    expect(vu.etat.invalidate.mock.calls.length).toBeGreaterThan(avant)
    dessiner()
    memeCamera(vu.etat.camera, shotAt(PLANS, 0.25))
  })

  test('onProgress reçoit la progression 0→1 de la section épinglée', async () => {
    const onProgress = vi.fn()
    render(<CinematicSection id="progres" shots={PLANS} onProgress={onProgress} />)
    expect(onProgress).toHaveBeenLastCalledWith(0)
    defiler(scrollPour(0.5))
    expect(onProgress).toHaveBeenLastCalledWith(0.5)
    defiler(scrollPour(1) + 500)
    expect(onProgress).toHaveBeenLastCalledWith(1)
    const appels = onProgress.mock.calls.length
    defiler(scrollPour(1) + 900)
    expect(onProgress).toHaveBeenCalledTimes(appels)
  })

  test('sous mouvement réduit, une seule pose de caméra : le plan de p = 0.5', async () => {
    medias({ [REDUIT]: true })
    mise.scroll = scrollPour(0)
    const { container } = render(<CinematicSection id="reduit" shots={PLANS} />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    dessiner()
    const poses = new Set([JSON.stringify(instantane(vu.etat.camera))])
    const invalidations = vu.etat.invalidate.mock.calls.length
    for (const p of [0.1, 0.3, 0.8, 1, 0]) {
      defiler(scrollPour(p))
      dessiner()
      poses.add(JSON.stringify(instantane(vu.etat.camera)))
    }
    expect(poses.size).toBe(1)
    memeCamera(vu.etat.camera, stillShot(PLANS))
    // Rien à redessiner au scroll : la caméra ne bouge pas.
    expect(vu.etat.invalidate.mock.calls.length).toBe(invalidations)
  })

  test('sous mouvement réduit, la caméra prend still quand il est fourni', async () => {
    medias({ [REDUIT]: true })
    const still = { pos: [0, 2, 9], look: [0, 1.5, 0], fov: 30, roll: -5 }
    mise.scroll = scrollPour(0.2)
    const { container } = render(<CinematicSection id="still" shots={PLANS} still={still} />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    for (const p of [0.2, 0.9]) {
      defiler(scrollPour(p))
      dessiner()
      memeCamera(vu.etat.camera, stillShot(PLANS, still))
    }
  })

  test('le mouvement réduit suit la préférence en direct', async () => {
    const basculer = medias({})
    mise.scroll = scrollPour(0.2)
    const { container } = render(<CinematicSection id="direct" shots={PLANS} />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    dessiner()
    memeCamera(vu.etat.camera, shotAt(PLANS, 0.2))

    act(() => basculer(REDUIT, true))
    dessiner()
    memeCamera(vu.etat.camera, stillShot(PLANS))
    defiler(scrollPour(0.9))
    dessiner()
    memeCamera(vu.etat.camera, stillShot(PLANS))

    act(() => basculer(REDUIT, false))
    dessiner()
    memeCamera(vu.etat.camera, shotAt(PLANS, 0.9))
  })

  test('profondeur de champ : absente par défaut, pilotée par le focus du plan quand activée', async () => {
    mise.scroll = scrollPour(0.5)
    const sans = render(<CinematicSection id="net" shots={PLANS} />)
    charger()
    await waitFor(() => expect(canvasDe(sans.container)).not.toBeNull())
    dessiner()
    expect(vu.dof).toBeNull()
    sans.unmount()

    const avec = render(<CinematicSection id="flou" shots={PLANS} depthOfField />)
    charger()
    await waitFor(() => expect(canvasDe(avec.container)).not.toBeNull())
    dessiner()
    expect(vu.dof).not.toBeNull()
    expect(vu.dof.cocMaterial.focusDistance).toBeCloseTo(3, 9)
    defiler(scrollPour(1))
    dessiner()
    expect(vu.dof.cocMaterial.focusDistance).toBeCloseTo(shotAt(PLANS, 1).focus, 9)
  })

  // Une erreur jetée dans useFrame échappe à la barrière et casse la boucle partagée de R3F :
  // les plans sont vérifiés au rendu, où la barrière les attrape.
  test.each([
    ['aucun plan', []],
    ['easing inconnu', [{ ...PLANS[0], ease: 'bounce' }, PLANS[2]]],
    ['mouvement inconnu', [PLANS[0], { at: 0.5, move: { type: 'zoomBurst' } }]],
    ['plan sans pos', [PLANS[0], { at: 1, look: [0, 1, 0], fov: 40 }]],
    ['liste étroite invalide', { wide: PLANS, narrow: [ETROIT[0], { ...ETROIT[1], fov: 'x' }, ETROIT[2]] }],
  ])('plans invalides (%s) : la barrière les attrape, aucune image ne jette', async (_, plans) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mise.scroll = scrollPour(0.6)
    const { container } = render(<CinematicSection id="invalide" shots={plans} stage={Decor} />)
    charger()
    await waitFor(() => expect(warn).toHaveBeenCalled())
    expect(String(warn.mock.calls[0][0])).toContain('[cinematique]')
    // Le message de checkShots, qui nomme le plan fautif.
    expect(String(warn.mock.calls[0][1])).toMatch(/plans? .*:/)
    expect(canvasDe(container)).toBeNull()
    expect(container.querySelector('[data-testid="decor"]')).toBeNull()
    expect(vu.frames.size).toBe(0)
    expect(() => dessiner()).not.toThrow()
    // Le texte de la section reste en place.
    expect(container.querySelector('.cinematic__content')).not.toBeNull()
  })

  test('still invalide sous mouvement réduit : attrapé par la barrière aussi', async () => {
    medias({ [REDUIT]: true })
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mise.scroll = scrollPour(0.2)
    const { container } = render(<CinematicSection id="still-invalide" shots={PLANS} still={{ pos: [0, 1, 3], fov: 30 }} />)
    charger()
    await waitFor(() => expect(warn).toHaveBeenCalled())
    expect(canvasDe(container)).toBeNull()
    expect(vu.frames.size).toBe(0)
  })

  test('sous mouvement réduit, le décor lit une progression figée sur celle du plan fixe', async () => {
    const basculer = medias({ [REDUIT]: true })
    mise.scroll = scrollPour(0.1)
    const { container, rerender } = render(<CinematicSection id="fige" shots={PLANS} stage={Decor} />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    for (const p of [0.1, 0.4, 0.9, 1, 0]) {
      defiler(scrollPour(p))
      dessiner()
      expect(vu.decor.timeline.current.p).toBe(0.5)
    }
    // still numérique : la progression figée est la sienne.
    rerender(<CinematicSection id="fige" shots={PLANS} stage={Decor} still={0.8} />)
    defiler(scrollPour(0.3))
    expect(vu.decor.timeline.current.p).toBe(0.8)
    dessiner()
    memeCamera(vu.etat.camera, shotAt(PLANS, 0.8))

    // Préférence levée : le décor suit de nouveau le scroll.
    act(() => basculer(REDUIT, false))
    expect(vu.decor.timeline.current.p).toBeCloseTo(0.3, 9)
    defiler(scrollPour(0.6))
    expect(vu.decor.timeline.current.p).toBeCloseTo(0.6, 9)
  })

  test('la politique transmise au décor annonce le frameloop réel du canvas', async () => {
    const basculer = medias({})
    mise.scroll = scrollPour(0.3)
    const { container } = render(<CinematicSection id="politique" shots={PLANS} stage={Decor} />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    expect(vu.canvas.frameloop).toBe('demand')
    expect(vu.decor.policy.frameloop).toBe(vu.canvas.frameloop)
    // Pointeur fin, mouvement permis : le décor peut animer (idle), à lui de redemander des images.
    expect(vu.decor.policy.idle).toBe(true)
    act(() => basculer(REDUIT, true))
    expect(vu.decor.policy.frameloop).toBe(vu.canvas.frameloop)
    expect(vu.decor.policy.idle).toBe(false)
  })

  // I1 : le fov est vertical, le champ horizontal fond en portrait.
  test('cadrage par aspect : la liste large ou étroite selon le rapport de la fenêtre, suivi en direct', async () => {
    ecran(1440, 900)
    mise.scroll = scrollPour(0.25)
    const { container } = render(<CinematicSection id="cadre" shots={{ wide: PLANS, narrow: ETROIT }} />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    dessiner()
    memeCamera(vu.etat.camera, shotAt(PLANS, 0.25))

    act(() => ecran(390, 844))
    dessiner()
    memeCamera(vu.etat.camera, shotAt(ETROIT, 0.25))
    defiler(scrollPour(0.7))
    dessiner()
    memeCamera(vu.etat.camera, shotAt(ETROIT, 0.7))

    act(() => ecran(1280, 800))
    dessiner()
    memeCamera(vu.etat.camera, shotAt(PLANS, 0.7))
  })

  test('cadrage par aspect sous mouvement réduit : le plan fixe de la variante, et la progression figée qui va avec', async () => {
    medias({ [REDUIT]: true })
    ecran(390, 844)
    mise.scroll = scrollPour(0.1)
    const still = { wide: 0.2, narrow: 0.8 }
    const { container } = render(<CinematicSection id="cadre-fixe" shots={{ wide: PLANS, narrow: ETROIT }} still={still} stage={Decor} />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    dessiner()
    memeCamera(vu.etat.camera, stillShot(ETROIT, 0.8))
    expect(vu.decor.timeline.current.p).toBe(0.8)
    act(() => ecran(1440, 900))
    dessiner()
    memeCamera(vu.etat.camera, stillShot(PLANS, 0.2))
    expect(vu.decor.timeline.current.p).toBe(0.2)
  })

  // I2 : une scène animée a besoin d'images en continu, mais seulement à l'écran.
  test('rendu continu : always visible, animé et sans mouvement réduit ; never hors écran ; demand sinon', async () => {
    const { instances, voir } = observateurs()
    mise.scroll = scrollPour(0.3)
    const { container, rerender, unmount } = render(<CinematicSection id="anime" shots={PLANS} stage={Decor} animated />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    // Un seul observateur, sur l'enfant collant, dans la racine de scroll.
    expect(instances).toHaveLength(1)
    expect(instances[0].cibles).toEqual([container.querySelector('.cinematic__pin')])
    expect(instances[0].options.root).toBe(racine)
    // Avant le premier rappel : hors écran, la boucle est arrêtée…
    expect(vu.canvas.frameloop).toBe('never')
    expect(vu.decor.policy.frameloop).toBe('never')
    expect(vu.decor.timeline.current.visible).toBe(false)
    // … après une seule image d'amorce (delta nul), qui a placé la caméra.
    expect(vu.etat.advance).toHaveBeenCalledTimes(1)
    expect(vu.etat.advance).toHaveBeenCalledWith(0, true)
    memeCamera(vu.etat.camera, shotAt(PLANS, 0.3))

    voir(true)
    expect(vu.canvas.frameloop).toBe('always')
    expect(vu.decor.policy.frameloop).toBe('always')
    expect(vu.decor.timeline.current.visible).toBe(true)

    voir(false)
    expect(vu.canvas.frameloop).toBe('never')
    expect(vu.decor.policy.frameloop).toBe('never')
    expect(vu.decor.timeline.current.visible).toBe(false)
    // L'amorce ne sert qu'au montage.
    expect(vu.etat.advance).toHaveBeenCalledTimes(1)

    // Scène sans animation : à la demande, même à l'écran.
    rerender(<CinematicSection id="anime" shots={PLANS} stage={Decor} />)
    voir(true)
    expect(vu.canvas.frameloop).toBe('demand')
    expect(vu.decor.policy.frameloop).toBe('demand')

    unmount()
    expect(instances[0].coupe).toBe(true)
  })

  test('rendu continu : jamais sous mouvement réduit ; un écran tactile ne fige pas une scène animée', async () => {
    const basculer = medias({ '(pointer: coarse)': true })
    const { voir } = observateurs()
    mise.scroll = scrollPour(0.3)
    const { container } = render(<CinematicSection id="tactile" shots={PLANS} stage={Decor} animated />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    voir(true)
    expect(vu.canvas.frameloop).toBe('always')
    // Le personnage ne respire pas sur écran tactile, mais la scène s'anime.
    expect(vu.decor.policy).toEqual(expect.objectContaining({ idle: false, animate: true, frameloop: 'always' }))

    act(() => basculer(REDUIT, true))
    expect(vu.canvas.frameloop).toBe('demand')
    expect(vu.decor.policy).toEqual(expect.objectContaining({ animate: false, frameloop: 'demand' }))
    // Sous mouvement réduit, le décor lit aussi la visibilité.
    expect(vu.decor.timeline.current.visible).toBe(true)
    voir(false)
    expect(vu.decor.timeline.current.visible).toBe(false)
    expect(vu.canvas.frameloop).toBe('never')
  })

  // I3 : un seul EffectComposer par section, la DOF toujours pilotée par la timeline.
  test('effets : rendus dans le même composer que la profondeur de champ, qui suit toujours le focus', async () => {
    const { voir } = observateurs()
    mise.scroll = scrollPour(0.5)
    const { container } = render(<CinematicSection id="eclat" shots={PLANS} depthOfField effects={<Eclat />} />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    voir(true)
    dessiner()
    const composers = container.querySelectorAll('[data-testid="composer"]')
    expect(composers).toHaveLength(1)
    expect(composers[0].querySelector('[data-testid="dof"]')).not.toBeNull()
    expect(composers[0].querySelector('[data-testid="eclat"]')).not.toBeNull()
    expect(vu.dof.cocMaterial.focusDistance).toBeCloseTo(3, 9)
    defiler(scrollPour(1))
    dessiner()
    expect(vu.dof.cocMaterial.focusDistance).toBeCloseTo(shotAt(PLANS, 1).focus, 9)
    // La visibilité qui change re-rend le canvas, sans toucher aux enfants du composer :
    // le vrai reconstruirait ses passes et recompilerait ses shaders.
    const avant = vu.enfantsComposer.size
    voir(false)
    voir(true)
    expect(vu.enfantsComposer.size).toBe(avant)
  })

  test('effets sans profondeur de champ : un composer, sans DOF', async () => {
    mise.scroll = scrollPour(0.5)
    const { container } = render(<CinematicSection id="eclat-seul" shots={PLANS} effects={<Eclat />} />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    dessiner()
    const composers = container.querySelectorAll('[data-testid="composer"]')
    expect(composers).toHaveLength(1)
    expect(composers[0].querySelector('[data-testid="eclat"]')).not.toBeNull()
    expect(container.querySelector('[data-testid="dof"]')).toBeNull()
  })

  // 5 : le haut de l'image est posé avant lookAt.
  test('up du plan appliqué à la caméra avant lookAt : un plan zénithal ne vrille pas', async () => {
    const zenith = [
      { at: 0, pos: [0, 6, 0], look: [0, 0, 0], fov: 40, up: [1, 0, 0] },
      { at: 1, pos: [0, 5, 0], look: [0, 0, 0], fov: 30, up: [0, 0, 1] },
    ]
    mise.scroll = scrollPour(0.5)
    const { container } = render(<CinematicSection id="zenith" shots={zenith} />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    dessiner()
    const pose = shotAt(zenith, 0.5)
    memeCamera(vu.etat.camera, pose)
    vu.etat.camera.up.toArray().forEach((v, i) => expect(v).toBeCloseTo(pose.up[i], 9))
    defiler(scrollPour(0))
    dessiner()
    memeCamera(vu.etat.camera, shotAt(zenith, 0))
  })

  // 7 : props du décor, sans remontage quand le parent re-rend.
  test('stageProps transmis au décor ; la scène n est pas remontée quand le parent re-rend', async () => {
    let montages = 0
    function DecorCompte(props) {
      vu.decor = props
      React.useEffect(() => {
        montages++
      }, [])
      return <i data-testid="decor" />
    }
    // Plans, préchargements et props du décor recréés à chaque rendu, comme chez un appelant pressé.
    function Parent({ teinte }) {
      return (
        <CinematicSection
          id="parent"
          shots={PLANS.map((plan) => ({ ...plan }))}
          preload={[...PRELOAD]}
          stage={DecorCompte}
          stageProps={{ teinte, timeline: 'ignorée', policy: 'ignorée' }}
        />
      )
    }
    mise.scroll = scrollPour(0.4)
    const { container, rerender } = render(<Parent teinte="cuivre" />)
    charger()
    await waitFor(() => expect(container.querySelector('[data-testid="decor"]')).not.toBeNull())
    expect(vu.decor.teinte).toBe('cuivre')
    rerender(<Parent teinte="rouille" />)
    rerender(<Parent teinte="mousse" />)
    expect(vu.decor.teinte).toBe('mousse')
    expect(montages).toBe(1)
    // timeline et policy restent celles de la section.
    expect(vu.decor.timeline.current.p).toBeCloseTo(0.4, 9)
    expect(vu.decor.policy).toEqual(expect.objectContaining({ frameloop: vu.canvas.frameloop }))
  })

  test('scène chargée après le montage : une image est redemandée pour la montrer', async () => {
    let resoudre
    let charge = false
    const promesse = new Promise((r) => {
      resoudre = r
    })
    function DecorLent() {
      if (!charge) throw promesse
      return <i data-testid="decor" />
    }
    mise.scroll = scrollPour(0.4)
    const { container } = render(<CinematicSection id="lent" shots={PLANS} stage={DecorLent} poster="/lent.webp" />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    dessiner()
    expect(container.querySelector('[data-testid="decor"]')).toBeNull()
    // Scène pas encore là : l'affiche reste, même après une image.
    expect(container.querySelector('.cinematic__poster').dataset.visible).toBe('true')
    const avant = vu.etat.invalidate.mock.calls.length
    await act(async () => {
      charge = true
      resoudre()
      await promesse
    })
    expect(container.querySelector('[data-testid="decor"]')).not.toBeNull()
    expect(vu.etat.invalidate.mock.calls.length).toBeGreaterThan(avant)
    dessiner()
    expect(container.querySelector('.cinematic__poster').dataset.visible).toBe('false')
  })

  // 8 : une image à la place de la 3D, tant qu'elle n'a rien dessiné.
  test('poster : affiché pendant le chargement, retiré après la première image, remis au démontage', async () => {
    mise.scroll = 2500
    const { container } = render(<CinematicSection id="affiche" shots={PLANS} stage={Decor} poster="/posters/projets.webp" />)
    const affiche = () => container.querySelector('.cinematic__poster')
    // À l'écran (pas d'IntersectionObserver ici) : pas d'image d'amorce, la boucle s'en charge.
    expect(vu.etat.advance).not.toHaveBeenCalled()
    expect(affiche().querySelector('img').getAttribute('src')).toBe('/posters/projets.webp')
    expect(affiche().querySelector('img').getAttribute('alt')).toBe('')
    expect(affiche().dataset.visible).toBe('true')
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    // Monté, mais aucune image dessinée : l'affiche reste.
    expect(affiche().dataset.visible).toBe('true')
    dessiner()
    expect(affiche().dataset.visible).toBe('false')
    // Démonté au loin : l'affiche revient pour le prochain passage.
    defiler(0)
    expect(canvasDe(container)).toBeNull()
    expect(affiche().dataset.visible).toBe('true')
    defiler(2500)
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    expect(affiche().dataset.visible).toBe('true')
    dessiner()
    expect(affiche().dataset.visible).toBe('false')
  })

  test('poster : remis quand la barrière désactive le canvas', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    let casse = false
    function DecorFragile() {
      if (casse) throw new Error('décor cassé')
      return <i data-testid="decor" />
    }
    mise.scroll = scrollPour(0.2)
    const { container, rerender } = render(<CinematicSection id="fragile" shots={PLANS} stage={DecorFragile} poster="/a.webp" />)
    charger()
    await waitFor(() => expect(canvasDe(container)).not.toBeNull())
    dessiner()
    expect(container.querySelector('.cinematic__poster').dataset.visible).toBe('false')
    casse = true
    rerender(<CinematicSection id="fragile" shots={PLANS} stage={DecorFragile} poster="/a.webp" stageProps={{ k: 1 }} />)
    await waitFor(() => expect(canvasDe(container)).toBeNull())
    expect(container.querySelector('.cinematic__poster').dataset.visible).toBe('true')
  })

  // En dernier : un module neuf, pour une sonde WebGL 2 qui n'a pas encore répondu.
  test('poster : reste en place sans WebGL 2', async () => {
    vi.resetModules()
    const { default: SectionNeuve } = await import('../src/three/cinematic/CinematicSection.jsx')
    HTMLCanvasElement.prototype.getContext.mockImplementation(() => null)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mise.scroll = scrollPour(0.3)
    const { container } = render(<SectionNeuve id="sans-webgl" shots={PLANS} poster="/posters/repli.webp" />)
    charger()
    await waitFor(() => expect(warn).toHaveBeenCalled())
    expect(String(warn.mock.calls[0][0])).toContain('WebGL 2')
    await importsFaits()
    expect(canvasDe(container)).toBeNull()
    const affiche = container.querySelector('.cinematic__poster')
    expect(affiche.dataset.visible).toBe('true')
    expect(affiche.querySelector('img').getAttribute('src')).toBe('/posters/repli.webp')
  })
})
