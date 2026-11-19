// L'anneau de particules de la salle d'écoute : la logique du visualiseur du v5 (graves qui
// poussent vers l'extérieur, médiums qui font tourbillonner, aigus qui font frémir), portée en
// 3D dans un shader. Les bandes viennent du moteur d'écoute (src/lib/listening.js), déjà
// lissées ; sans musique, l'anneau respire doucement.
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial } from 'three'

// Ces fonctions servent à chaque image : elles écrivent dans l'objet ou le tableau fourni (et le
// renvoient) plutôt que d'en allouer un nouveau. Sans objet fourni, elles en créent un.

/** Respiration de l'anneau au repos (sans musique) : un souffle lent, à peine visible. */
export function idleBands(t, out = {}) {
  out.bass = 0.06 + 0.04 * Math.sin(t * 0.9)
  out.mid = 0.05 + 0.03 * Math.sin(t * 0.55 + 1)
  out.high = 0.03
  return out
}

/**
 * Bandes à appliquer à l'anneau : celles de la musique quand elle joue, la respiration sinon ;
 * tout à zéro quand la scène ne doit pas bouger (mouvement réduit).
 */
export function ringBands(bands, t, animate, out = {}) {
  if (!animate) {
    out.bass = out.mid = out.high = 0
    return out
  }
  if (bands && bands.playing) {
    out.bass = bands.bass
    out.mid = bands.mid
    out.high = bands.high
    return out
  }
  return idleBands(t, out)
}

/** Nombre d'ondes au sol en même temps, et leur durée de vie (secondes). */
export const RIPPLES = 4
export const RIPPLE_LIFE = 1.4

/**
 * Fait vivre les ondes au sol : chaque coup de grosse caisse en lance une (la plus vieille est
 * recyclée), chacune grandit et s'éteint en RIPPLE_LIFE secondes. `ages` : âges en secondes,
 * Infinity pour une onde éteinte. Met `ages` à jour sur place et le renvoie.
 */
export function stepRipples(ages, kick, dt) {
  // la place de la prochaine onde : une onde éteinte, sinon la plus vieille
  let libre = -1
  let vieille = -1
  for (let i = 0; i < ages.length; i++) {
    let a = ages[i]
    if (Number.isFinite(a)) {
      a += dt
      if (a >= RIPPLE_LIFE) a = Infinity
      ages[i] = a
    }
    if (!Number.isFinite(a)) {
      if (libre < 0) libre = i
    } else if (vieille < 0 || a > ages[vieille]) vieille = i
  }
  if (kick) ages[libre >= 0 ? libre : vieille] = 0
  return ages
}

/** Échelle et opacité d'une onde selon son âge, écrites dans `out`. */
export function rippleLook(age, out = {}) {
  if (!Number.isFinite(age)) {
    out.scale = 1
    out.opacity = 0
    return out
  }
  const u = Math.min(1, age / RIPPLE_LIFE)
  out.scale = 1 + u * 2.4
  out.opacity = (1 - u) * (1 - u) * 0.9
  return out
}

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uBass;
uniform float uMid;
uniform float uHigh;
uniform float uRadius;
uniform float uSize;
attribute float aAngle;
attribute float aBand;
attribute vec2 aOffset;
attribute float aSeed;
varying float vBand;
varying float vGlow;
float hash(float n) { return fract(sin(n) * 43758.5453); }
void main() {
  // énergie de la bande de cette particule (0 graves, 1 médiums, 2 aigus)
  float e = aBand < 0.5 ? uBass : (aBand < 1.5 ? uMid : uHigh);
  // rotation lente, tourbillon des médiums
  float a = aAngle + uTime * (0.05 + 0.06 * aSeed) + uMid * 0.6 * sin(uTime * 0.7 + aSeed * 6.2831);
  // les graves poussent vers l'extérieur, surtout les particules des graves
  float r = uRadius * (1.0 + aOffset.x) + uBass * (aBand < 0.5 ? 0.55 : 0.25);
  float y = aOffset.y + 0.06 * sin(a * 3.0 + uTime * 0.6);
  // les aigus font frémir
  float f = floor(uTime * 30.0);
  vec3 tremble = (vec3(hash(aSeed * 91.0 + f), hash(aSeed * 37.0 + f), hash(aSeed * 13.0 + f)) - 0.5) * uHigh * 0.05;
  vec3 p = vec3(cos(a) * r, y, sin(a) * r) + tremble;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.55 + aSeed * 0.9) * (1.0 + e * 1.4) / -mv.z;
  vBand = aBand;
  vGlow = 0.45 + 0.55 * e;
}
`

const FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying float vBand;
varying float vGlow;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float disque = 1.0 - smoothstep(0.0, 0.5, d);
  vec3 c = vBand < 0.5 ? uColorA : (vBand < 1.5 ? uColorB : uColorC);
  gl_FragColor = vec4(c * disque * disque * vGlow, 1.0);
}
`

// Graine fixe : l'anneau garde la même forme d'une visite à l'autre.
function aleatoire(graine) {
  let s = graine >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Couleurs des trois bandes (graves, médiums, aigus), en sRGB : des cuivres de plus en plus pâles. */
export const RING_COLORS = ['#ff9a5a', '#ffd2a1', '#fff4e6']

/**
 * L'anneau (Points additifs) : `count` particules réparties en trois bandes (35 % graves,
 * 35 % médiums, 30 % aigus, comme le v5), autour de l'axe y, dans le repère local.
 */
export function createRing({ count = 900, radius = 1.35, colors = RING_COLORS } = {}) {
  const rand = aleatoire(5112026)
  const angles = new Float32Array(count)
  const bandes = new Float32Array(count)
  const decalages = new Float32Array(count * 2)
  const graines = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const b = rand()
    bandes[i] = b < 0.35 ? 0 : b < 0.7 ? 1 : 2
    angles[i] = rand() * Math.PI * 2
    // épaisseur de l'anneau : les graves au cœur, les aigus plus dispersés
    const ecart = bandes[i] === 0 ? 0.06 : bandes[i] === 1 ? 0.12 : 0.2
    decalages[i * 2] = (rand() - 0.5) * 2 * ecart
    decalages[i * 2 + 1] = (rand() - 0.5) * 2 * ecart * 1.4
    graines[i] = rand()
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3))
  geo.setAttribute('aAngle', new BufferAttribute(angles, 1))
  geo.setAttribute('aBand', new BufferAttribute(bandes, 1))
  geo.setAttribute('aOffset', new BufferAttribute(decalages, 2))
  geo.setAttribute('aSeed', new BufferAttribute(graines, 1))
  const material = new ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uBass: { value: 0 },
      uMid: { value: 0 },
      uHigh: { value: 0 },
      uRadius: { value: radius },
      uSize: { value: 22 },
      uColorA: { value: new Color(colors[0]) },
      uColorB: { value: new Color(colors[1]) },
      uColorC: { value: new Color(colors[2]) },
    },
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  })
  const points = new Points(geo, material)
  points.frustumCulled = false
  return points
}
