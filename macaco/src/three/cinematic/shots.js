// Timeline de plans de caméra pilotée par une progression 0 → 1 (le scroll d'une section).
// Fonctions pures, sans three : positions en tableaux [x, y, z], angles en degrés.
//
// Un plan : { at, pos, look, fov, roll = 0, up = [0, 1, 0], focus?, ease = 'inout' }
//   at     ancre dans [0, 1] ; les plans sont triés par `at`.
//   fov    champ vertical en degrés (convention three.js).
//   roll   rotation autour de l'axe de visée, en degrés ; roll > 0 fait tourner l'image
//          dans le sens horaire (plan débullé).
//   up     haut de l'image, appliqué à la caméra avant lookAt, interpolé d'un plan à l'autre.
//          Indispensable à un plan zénithal : visée et haut par défaut y sont parallèles et
//          l'image tournerait au moindre écart.
//   focus  distance de mise au point (profondeur de champ) ; par défaut la distance de
//          la caméra au point visé.
//   ease   courbe du segment qui part de ce plan : 'linear', 'in', 'out', 'inout' ou une
//          fonction [0, 1] → [0, 1].
// Un plan peut nommer un mouvement : { at, move: { type: 'orbit' | 'dollyZoom', ... },
// roll?, up?, focus?, ease? }. Sur le segment qui le suit (jusqu'au plan suivant, ou jusqu'à
// p = 1 s'il est le dernier), la caméra suit orbit() ou dollyZoom() ; le segment qui y
// mène rejoint le départ du mouvement. Le mouvement s'achève sur sa pose u = 1 : pour un
// raccord sans coupe, donner cette pose au plan suivant.
//
// Cadrage par aspect : là où une timeline (ou un plan fixe) est attendue, on peut donner
// { wide, narrow }, deux variantes choisies selon le rapport largeur / hauteur de l'écran
// (framing). Les deux listes partagent leurs ancres : le texte suit les mêmes étapes.

const DEG = Math.PI / 180
const HAUT = [0, 1, 0]
// Visée à moins d'un degré du haut : l'orientation de l'image n'est plus fiable.
const SIN_MIN = Math.sin(1 * DEG)

/**
 * Rapport largeur / hauteur sous lequel le cadrage étroit prend le relais : le même seuil
 * que le recadrage portrait de la scène des expertises (RobotStage).
 */
export const NARROW_ASPECT = 1.15
const CADRAGES = ['wide', 'narrow']

export const EASINGS = {
  linear: (t) => t,
  in: (t) => t * t * t,
  out: (t) => 1 - (1 - t) ** 3,
  inout: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a, b, t) => a + (b - a) * t
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
const norme = (v) => Math.hypot(v[0], v[1], v[2])
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
const unitaire = (v) => {
  const n = norme(v)
  return [v[0] / n, v[1] / n, v[2] / n]
}
const vectoriel = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const scalaire = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

// Interpolation de deux directions unitaires, renormalisée. Deux directions opposées
// s'annuleraient au milieu : checkShots les refuse, et l'on garde alors la première.
function nlerp(a, b, t) {
  const v = lerp3(a, b, t)
  return norme(v) > 1e-9 ? unitaire(v) : [a[0], a[1], a[2]]
}

// Progression lue par la timeline : NaN ou non numérique → 0 ; ±Infinity restent des bornes.
const progression = (p) => (typeof p === 'number' && !Number.isNaN(p) ? p : 0)

/** Variante de cadrage d'un rapport largeur / hauteur : 'narrow' sous NARROW_ASPECT, sinon 'wide'. */
export function framing(aspect) {
  return aspect < NARROW_ASPECT ? 'narrow' : 'wide'
}

const estPaire = (v) => v != null && typeof v === 'object' && !Array.isArray(v) && ('wide' in v || 'narrow' in v)

/** La variante `cadrage` ('wide' | 'narrow') d'une valeur { wide, narrow }, ou la valeur telle quelle. */
export function pickFraming(valeur, cadrage) {
  return estPaire(valeur) ? valeur[cadrage] : valeur
}

/** Orbite autour de `center` : 0° place la caméra en +Z du centre, 90° en +X. u ∈ [0, 1]. */
export function orbit({ center, radius, height = 0, from, to, fov }, u) {
  const a = lerp(from, to, u) * DEG
  return {
    pos: [center[0] + radius * Math.sin(a), center[1] + height, center[2] + radius * Math.cos(a)],
    look: [center[0], center[1], center[2]],
    fov,
  }
}

/**
 * Dolly zoom (effet vertigo) : le fov passe de fovFrom à fovTo pendant que la caméra glisse
 * sur l'axe `dir` (depuis le sujet) pour garder constante la taille cadrée au sujet :
 * distance = width / (2·tan(fov/2)). Le fov de three étant vertical, `width` est la hauteur
 * cadrée ; la largeur l'est aussi, à rapport d'image constant.
 */
export function dollyZoom({ subject, dir, fovFrom, fovTo, width }, u) {
  const n = Math.hypot(dir[0], dir[1], dir[2])
  if (!(n > 0)) throw new Error('dollyZoom : dir doit être un vecteur non nul')
  const fov = lerp(fovFrom, fovTo, u)
  const d = width / (2 * Math.tan((fov * DEG) / 2))
  return {
    pos: [subject[0] + (dir[0] / n) * d, subject[1] + (dir[1] / n) * d, subject[2] + (dir[2] / n) * d],
    look: [subject[0], subject[1], subject[2]],
    fov,
  }
}

const MOUVEMENTS = { orbit, dollyZoom }

function courbe(ease = 'inout') {
  if (typeof ease === 'function') return ease
  const f = EASINGS[ease]
  if (!f) throw new Error(`easing inconnu « ${ease} »`)
  return f
}

// Pose complète d'un plan ; u ne sert qu'aux mouvements nommés.
function pose(plan, u) {
  let base = plan
  if (plan.move) {
    const mouvement = MOUVEMENTS[plan.move.type]
    if (!mouvement) throw new Error(`mouvement inconnu « ${plan.move.type} »`)
    base = mouvement(plan.move, u)
  }
  return {
    pos: [base.pos[0], base.pos[1], base.pos[2]],
    look: [base.look[0], base.look[1], base.look[2]],
    fov: base.fov,
    roll: plan.roll ?? 0,
    up: unitaire(plan.up ?? HAUT),
    focus: plan.focus ?? distance(base.pos, base.look),
  }
}

// Segment de la progression q : i, dernier plan dont l'ancre est atteinte (−1 avant le
// premier), et t, l'avancement linéaire jusqu'au plan suivant (ou jusqu'à p = 1).
function segment(shots, q) {
  let i = -1
  while (i + 1 < shots.length && shots[i + 1].at <= q) i++
  if (i < 0) return { i, t: 0 }
  const debut = shots[i].at
  const fin = i + 1 < shots.length ? shots[i + 1].at : 1
  return { i, t: fin > debut ? clamp01((q - debut) / (fin - debut)) : 1 }
}

/**
 * Pose de la caméra à la progression p : { pos, look, fov, roll, up, focus }.
 * Sans état : la valeur ne dépend que de (shots, p), quel que soit l'ordre des appels.
 */
export function shotAt(shots, p) {
  if (!shots?.length) throw new Error('shotAt : aucun plan')
  const { i, t } = segment(shots, progression(p))
  if (i < 0) return pose(shots[0], 0) // avant le premier : le premier

  const a = shots[i]
  const b = shots[i + 1]
  const u = courbe(a.ease)(t)
  if (a.move) return pose(a, u)
  if (!b) return pose(a, 0) // après le dernier : le dernier

  const pa = pose(a, 0)
  const pb = pose(b, 0)
  return {
    pos: lerp3(pa.pos, pb.pos, u),
    look: lerp3(pa.look, pb.look, u),
    fov: lerp(pa.fov, pb.fov, u),
    roll: lerp(pa.roll, pb.roll, u),
    up: nlerp(pa.up, pb.up, u),
    focus: lerp(pa.focus, pb.focus, u),
  }
}

/**
 * Étape de la timeline à la progression p : { index, t }, index du plan qui ouvre le segment
 * (0 avant le premier) et t ∈ [0, 1] son avancement linéaire, sans easing. Mêmes bornes que
 * shotAt : le texte en DOM et la caméra changent d'étape ensemble. Accepte { wide, narrow },
 * dont les ancres sont communes.
 */
export function segmentAt(shots, p) {
  const liste = estPaire(shots) ? shots.wide : shots
  if (!liste?.length) throw new Error('segmentAt : aucun plan')
  const { i, t } = segment(liste, progression(p))
  return i < 0 ? { index: 0, t: 0 } : { index: i, t }
}

const est3 = (v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite)

// Vérifie un plan (hors ancre) en calculant ses poses de début et de fin de segment.
function verifierPlan(plan, nom) {
  if (!plan || typeof plan !== 'object') throw new Error(`${nom} : plan manquant`)
  if (!plan.move) {
    if (!est3(plan.pos)) throw new Error(`${nom} : pos doit être [x, y, z]`)
    if (!est3(plan.look)) throw new Error(`${nom} : look doit être [x, y, z]`)
  }
  if (plan.up !== undefined && !(est3(plan.up) && norme(plan.up) > 0)) {
    throw new Error(`${nom} : up doit être un vecteur [x, y, z] non nul`)
  }
  let poses
  try {
    courbe(plan.ease)
    poses = [pose(plan, 0), pose(plan, 1)]
  } catch (error) {
    throw new Error(`${nom} : ${error.message}`)
  }
  for (const p of poses) {
    if (!est3(p.pos) || !est3(p.look)) throw new Error(`${nom} : mouvement incomplet, pos ou look non calculable`)
    for (const k of ['fov', 'roll', 'focus']) {
      if (!Number.isFinite(p[k])) throw new Error(`${nom} : ${k} doit être un nombre fini`)
    }
    const axe = [p.look[0] - p.pos[0], p.look[1] - p.pos[1], p.look[2] - p.pos[2]]
    if (!(norme(axe) > 0)) throw new Error(`${nom} : pos et look confondus, aucune direction de visée`)
    if (norme(vectoriel(p.up, unitaire(axe))) < SIN_MIN) {
      throw new Error(`${nom} : visée parallèle à up (plan zénithal ?) ; donner un up qui ne l'est pas`)
    }
  }
}

// Vérifie une liste de plans ; `cadrage` préfixe les messages d'une variante { wide, narrow }.
function verifierListe(shots, cadrage) {
  const prefixe = cadrage ? `${cadrage} : ` : ''
  if (!Array.isArray(shots) || shots.length === 0) throw new Error(`${cadrage ?? 'plans'} : aucun plan`)
  shots.forEach((plan, i) => {
    const nom = `${prefixe}plan ${i}`
    if (!(Number.isFinite(plan?.at) && plan.at >= 0 && plan.at <= 1)) throw new Error(`${nom} : at doit être dans [0, 1]`)
    if (i > 0 && plan.at < shots[i - 1].at) throw new Error(`${nom} : plans à trier par at croissant`)
    verifierPlan(plan, nom)
    // Deux hauts opposés s'annuleraient au milieu du segment.
    if (i > 0 && scalaire(unitaire(plan.up ?? HAUT), unitaire(shots[i - 1].up ?? HAUT)) < -1 + 1e-9) {
      throw new Error(`${nom} : up opposé à celui du plan ${i - 1}, le sens de rotation de l'image est indéfini`)
    }
  })
}

function verifierStill(still, nom) {
  if (typeof still === 'number') {
    if (!Number.isFinite(still)) throw new Error(`${nom} : progression non finie`)
  } else if (still != null) {
    verifierPlan(still, nom)
  }
}

/**
 * Vérifie une timeline (et son plan fixe) une fois pour toutes, avec une erreur qui nomme le
 * plan fautif. À appeler au rendu : une erreur jetée plus tard, dans la boucle d'images, ne
 * serait attrapée par aucune barrière d'erreur. Une timeline vérifiée ne fait plus jeter
 * shotAt ni stillShot (sauf un easing fourni en fonction qui jetterait lui-même). Rend `shots`.
 * `shots` et `still` peuvent être des paires { wide, narrow } : les deux variantes sont
 * vérifiées, et les deux listes doivent avoir les mêmes ancres.
 */
export function checkShots(shots, still) {
  if (estPaire(shots)) {
    for (const cadrage of CADRAGES) verifierListe(shots[cadrage], cadrage)
    const { wide, narrow } = shots
    if (narrow.length !== wide.length) {
      throw new Error(`narrow : ${narrow.length} plans pour ${wide.length} en wide ; les deux cadrages partagent leurs ancres`)
    }
    narrow.forEach((plan, i) => {
      if (plan.at !== wide[i].at) {
        throw new Error(`narrow : plan ${i} : ancre ${plan.at} différente de wide (${wide[i].at}) ; les deux cadrages partagent leurs ancres`)
      }
    })
  } else {
    verifierListe(shots)
  }
  if (estPaire(still)) {
    for (const cadrage of CADRAGES) verifierStill(still[cadrage], `still.${cadrage}`)
  } else {
    verifierStill(still, 'still')
  }
  return shots
}

/**
 * Plan fixe (mouvement réduit) : `still` s'il est un plan, la pose de la timeline à cette
 * progression s'il est un nombre, sinon celle de p = 0.5.
 */
export function stillShot(shots, still) {
  if (still == null) return shotAt(shots, 0.5)
  if (typeof still === 'number') return shotAt(shots, still)
  return pose(still, 0)
}
