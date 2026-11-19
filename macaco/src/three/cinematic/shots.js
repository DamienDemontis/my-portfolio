// Timeline de plans de caméra pilotée par une progression 0 → 1 (le scroll d'une section).
// Fonctions pures, sans three : positions en tableaux [x, y, z], angles en degrés.
//
// Un plan : { at, pos, look, fov, roll = 0, focus?, ease = 'inout' }
//   at     ancre dans [0, 1] ; les plans sont triés par `at`.
//   fov    champ vertical en degrés (convention three.js).
//   roll   rotation autour de l'axe de visée, en degrés ; roll > 0 fait tourner l'image
//          dans le sens horaire (plan débullé).
//   focus  distance de mise au point (profondeur de champ) ; par défaut la distance de
//          la caméra au point visé.
//   ease   courbe du segment qui part de ce plan : 'linear', 'in', 'out', 'inout' ou une
//          fonction [0, 1] → [0, 1].
// Un plan peut nommer un mouvement : { at, move: { type: 'orbit' | 'dollyZoom', ... },
// roll?, focus?, ease? }. Sur le segment qui le suit (jusqu'au plan suivant, ou jusqu'à
// p = 1 s'il est le dernier), la caméra suit orbit() ou dollyZoom() ; le segment qui y
// mène rejoint le départ du mouvement. Le mouvement s'achève sur sa pose u = 1 : pour un
// raccord sans coupe, donner cette pose au plan suivant.

const DEG = Math.PI / 180

export const EASINGS = {
  linear: (t) => t,
  in: (t) => t * t * t,
  out: (t) => 1 - (1 - t) ** 3,
  inout: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a, b, t) => a + (b - a) * t
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

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
    focus: plan.focus ?? distance(base.pos, base.look),
  }
}

/**
 * Pose de la caméra à la progression p : { pos, look, fov, roll, focus }.
 * Sans état : la valeur ne dépend que de (shots, p), quel que soit l'ordre des appels.
 */
export function shotAt(shots, p) {
  if (!shots?.length) throw new Error('shotAt : aucun plan')
  const q = Number.isFinite(p) ? p : 0
  // Dernier plan dont l'ancre est atteinte.
  let i = -1
  while (i + 1 < shots.length && shots[i + 1].at <= q) i++
  if (i < 0) return pose(shots[0], 0) // avant le premier : le premier

  const a = shots[i]
  const b = shots[i + 1]
  const fin = b ? b.at : 1
  const t = fin > a.at ? clamp01((q - a.at) / (fin - a.at)) : 1
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
    focus: lerp(pa.focus, pb.focus, u),
  }
}

const est3 = (v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite)

// Vérifie un plan (hors ancre) en calculant ses poses de début et de fin de segment.
function verifierPlan(plan, nom) {
  if (!plan || typeof plan !== 'object') throw new Error(`${nom} : plan manquant`)
  if (!plan.move) {
    if (!est3(plan.pos)) throw new Error(`${nom} : pos doit être [x, y, z]`)
    if (!est3(plan.look)) throw new Error(`${nom} : look doit être [x, y, z]`)
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
  }
}

/**
 * Vérifie une timeline (et son plan fixe) une fois pour toutes, avec une erreur qui nomme le
 * plan fautif. À appeler au rendu : une erreur jetée plus tard, dans la boucle d'images, ne
 * serait attrapée par aucune barrière d'erreur. Une timeline vérifiée ne fait plus jeter
 * shotAt ni stillShot (sauf un easing fourni en fonction qui jetterait lui-même). Rend `shots`.
 */
export function checkShots(shots, still) {
  if (!Array.isArray(shots) || shots.length === 0) throw new Error('plans : aucun plan')
  shots.forEach((plan, i) => {
    const nom = `plan ${i}`
    if (!(Number.isFinite(plan?.at) && plan.at >= 0 && plan.at <= 1)) throw new Error(`${nom} : at doit être dans [0, 1]`)
    if (i > 0 && plan.at < shots[i - 1].at) throw new Error(`${nom} : plans à trier par at croissant`)
    verifierPlan(plan, nom)
  })
  if (typeof still === 'number') {
    if (!Number.isFinite(still)) throw new Error('still : progression non finie')
  } else if (still != null) {
    verifierPlan(still, 'still')
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
