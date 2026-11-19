// Le faisceau du projecteur : un cône elliptique ouvert, de l'objectif au cadre de l'écran,
// en lumière additive (plus dense au cœur, qui s'éteint sur les bords et en s'éloignant), et la
// poussière qui flotte dedans. Repère local : l'objectif à l'origine, l'axe vers +z ; placer
// l'objet sur l'objectif et le tourner vers l'écran (lookAt).
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  Mesh,
  Points,
  ShaderMaterial,
} from 'three'

const RAYON_OBJECTIF = 0.012

// Graine fixe : la poussière a toujours la même forme (rendu stable d'une visite à l'autre).
function aleatoire(graine) {
  let s = graine >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Géométrie du cône : `length` jusqu'à l'écran, `rx` et `ry` les demi-axes à l'écran. */
export function beamGeometry(length, rx, ry, segments = 64) {
  const geo = new CylinderGeometry(1, 1, 1, segments, 12, true)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const t = pos.getY(i) + 0.5 // 0 à l'objectif, 1 à l'écran
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const k = RAYON_OBJECTIF + (1 - RAYON_OBJECTIF) * t
    pos.setXYZ(i, x * rx * k, z * ry * k, t * length)
  }
  geo.computeVertexNormals()
  return geo
}

const BEAM_VERTEX = /* glsl */ `
uniform float uLength;
varying vec3 vNormalW;
varying vec3 vPosW;
varying float vT;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPosW = w.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vT = position.z / uLength;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

const BEAM_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
uniform float uTime;
varying vec3 vNormalW;
varying vec3 vPosW;
varying float vT;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
void main() {
  vec3 v = normalize(cameraPosition - vPosW);
  // De face, la vue traverse beaucoup de faisceau ; sur la tranche, presque rien.
  float face = pow(abs(dot(vNormalW, v)), 1.6);
  float le_long = smoothstep(0.0, 0.06, vT) * (1.0 - 0.7 * vT);
  // Volutes qui remontent lentement le faisceau.
  float volute = 0.78 + 0.22 * noise(vec2(vT * 14.0 - uTime * 0.35, vPosW.y * 3.0 + uTime * 0.1));
  float battement = 0.94 + 0.06 * hash(vec2(floor(uTime * 24.0), 3.0));
  gl_FragColor = vec4(uColor * face * le_long * volute * battement * uIntensity, 1.0);
}
`

/** Le cône de lumière (Mesh additif) ; régler `uniforms.uColor`, `uTime`, `uIntensity`. */
export function createBeam(length, rx, ry) {
  const material = new ShaderMaterial({
    vertexShader: BEAM_VERTEX,
    fragmentShader: BEAM_FRAGMENT,
    uniforms: {
      uLength: { value: length },
      uColor: { value: new Color('#ffe2b0') },
      uIntensity: { value: 0.16 },
      uTime: { value: 0 },
    },
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    side: DoubleSide,
  })
  const mesh = new Mesh(beamGeometry(length, rx, ry), material)
  mesh.renderOrder = 2
  return mesh
}

const DUST_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uLength;
attribute float aSeed;
attribute float aRadius;
varying float vLum;
void main() {
  vec3 p = position;
  // Dérive lente, propre à chaque grain.
  float s = aSeed * 6.2831;
  p += vec3(sin(uTime * 0.21 + s), sin(uTime * 0.17 + s * 1.7) * 1.4, cos(uTime * 0.13 + s * 2.3)) * 0.035;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float t = clamp(position.z / uLength, 0.0, 1.0);
  // plus vive au cœur du faisceau et près de l'objectif, où la lumière est dense
  vLum = (1.0 - 0.7 * t) * (1.0 - 0.75 * aRadius) * (0.55 + 0.45 * sin(uTime * (0.6 + aSeed) + s));
  gl_PointSize = uSize * (0.6 + aSeed) / -mv.z;
}
`

const DUST_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
varying float vLum;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor * a * a * vLum * uIntensity, 1.0);
}
`

/** La poussière dans le faisceau (Points additifs), même repère que le cône. */
export function createDust(length, rx, ry, count = 480) {
  const rand = aleatoire(20261119)
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const rayons = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    // plus dense près de l'objectif, où le faisceau est étroit et vif
    const t = 0.02 + 0.93 * rand() ** 1.6
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * 0.92
    const k = RAYON_OBJECTIF + (1 - RAYON_OBJECTIF) * t
    positions[i * 3] = Math.cos(a) * r * rx * k
    positions[i * 3 + 1] = Math.sin(a) * r * ry * k
    positions[i * 3 + 2] = t * length
    seeds[i] = rand()
    rayons[i] = r
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(positions, 3))
  geo.setAttribute('aSeed', new BufferAttribute(seeds, 1))
  geo.setAttribute('aRadius', new BufferAttribute(rayons, 1))
  const material = new ShaderMaterial({
    vertexShader: DUST_VERTEX,
    fragmentShader: DUST_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 12 },
      uLength: { value: length },
      uColor: { value: new Color('#ffe9c4') },
      uIntensity: { value: 1.0 },
    },
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  })
  const points = new Points(geo, material)
  points.renderOrder = 3
  points.frustumCulled = false
  return points
}
