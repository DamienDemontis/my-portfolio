// La pellicule : ce que le projecteur projette, composé dans une cible de rendu carrée qui sert
// de texture à sa lumière (SpotLight.map). Le cadre 16:9 aux coins arrondis est inscrit dans le
// cône ; hors du cadre, noir (pas de lumière). Dedans : l'image du projet, ou l'amorce (le
// compte à rebours) avant le premier, la brûlure de pellicule qui passe de l'une à l'autre, le
// grain et le battement à 24 images/s, le léger flottement de la fenêtre.
import {
  CanvasTexture,
  Color,
  HalfFloatType,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  WebGLRenderTarget,
} from 'three'

/** Taille de la cible de rendu (carrée, comme la carte d'ombre du projecteur). */
export const FILM_SIZE = 1024

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const FRAGMENT = /* glsl */ `
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform sampler2D uDigits;
uniform float uFromLeader;
uniform float uToLeader;
uniform float uBurn;
uniform float uTime;
uniform float uLeader;
uniform vec2 uFrame;
varying vec2 vUv;

const float RATIO = 16.0 / 9.0;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

// L'amorce : fond chaud, cercles, croix, secteur qui balaie, et le chiffre (3, 2, 1).
vec3 amorce(vec2 f) {
  vec2 c = (f - 0.5) * vec2(RATIO, 1.0);
  float r = length(c);
  vec3 col = vec3(0.82, 0.76, 0.64);
  float tour = fract(uLeader * 3.0);
  float angle = atan(c.x, c.y) / 6.28318 + 0.5;
  col *= mix(1.0, 0.6, step(angle, tour) * step(r, 0.62));
  // smoothstep exige edge0 < edge1 : un front descendant s'écrit 1 - smoothstep(lo, hi, x).
  col *= 1.0 - 0.75 * ((1.0 - smoothstep(0.0, 0.007, abs(r - 0.36))) + (1.0 - smoothstep(0.0, 0.007, abs(r - 0.43))));
  col *= 1.0 - 0.6 * ((1.0 - smoothstep(0.0, 0.004, abs(c.x))) + (1.0 - smoothstep(0.0, 0.004, abs(c.y))));
  float chiffre = clamp(floor(uLeader * 3.0), 0.0, 2.0); // 0 → « 3 », 1 → « 2 », 2 → « 1 »
  vec2 g = c / vec2(0.36, 0.5) + 0.5;
  if (g.x > 0.0 && g.x < 1.0 && g.y > 0.0 && g.y < 1.0) {
    float a = texture2D(uDigits, vec2((chiffre + g.x) / 3.0, g.y)).a;
    col *= 1.0 - 0.88 * a;
  }
  return col;
}

vec3 image(sampler2D tex, float leader, vec2 f) {
  return leader > 0.5 ? amorce(f) : texture2D(tex, f).rgb;
}

void main() {
  float t24 = floor(uTime * 24.0);
  vec2 flotte = (vec2(hash(vec2(t24, 1.0)), hash(vec2(t24, 2.0))) - 0.5) * vec2(0.0016, 0.0024);
  vec2 f = (vUv - 0.5) / (2.0 * uFrame) + 0.5 + flotte;

  // Fenêtre : rectangle 16:9 aux coins arrondis, comme une image de pellicule 8 mm.
  vec2 q = abs(f - 0.5) * vec2(RATIO, 1.0);
  vec2 demi = vec2(0.5 * RATIO, 0.5);
  float rayon = 0.05;
  float d = length(max(q - (demi - rayon), 0.0)) - rayon;
  float fenetre = 1.0 - smoothstep(-0.006, 0.006, d);
  if (fenetre <= 0.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }

  // Hors brûlure (presque toujours), une seule image : ni bruit ni second échantillon. uBurn est
  // un uniforme, tous les pixels prennent la même branche. Aux bornes, la brûlure donne déjà
  // exactement l'une ou l'autre image (le bruit reste dans [-0,04 ; 0,98]).
  vec3 col;
  if (uBurn < 0.001) {
    col = image(uFrom, uFromLeader, f);
  } else if (uBurn > 0.999) {
    col = image(uTo, uToLeader, f);
  } else {
    vec3 a = image(uFrom, uFromLeader, f);
    vec3 b = image(uTo, uToLeader, f);

    // Brûlure : un foyer qui s'ouvre dans un bruit, un liseré incandescent, la pellicule
    // roussie autour ; un éclair blanc au plus fort.
    float n = fbm(f * vec2(5.3, 3.0) + 3.7) * 0.8 + 0.2 * (1.0 - 1.4 * length(f - vec2(0.62, 0.44)));
    float seuil = uBurn * 1.3 - 0.15;
    float brule = 1.0 - smoothstep(seuil - 0.015, seuil + 0.015, n);
    float lisere = 1.0 - smoothstep(0.0, 0.07, abs(n - seuil));
    float roussi = (1.0 - smoothstep(seuil, seuil + 0.18, n)) * (1.0 - brule);
    col = mix(a * (1.0 - 0.8 * roussi), b, brule);
    col += lisere * vec3(1.6, 0.7, 0.22) + lisere * lisere * vec3(0.8, 0.7, 0.5);
    // pas de pow() : une base négative y est indéfinie (NaN sur certains pilotes)
    float z = (uBurn - 0.5) / 0.07;
    col += vec3(1.0, 0.95, 0.85) * 0.22 * exp(-z * z);
  }

  // Grain, battement de la lampe, vignetage de l'objectif.
  col += (hash(f * 913.0 + t24) - 0.5) * 0.06;
  col *= 0.93 + 0.07 * hash(vec2(t24, 7.0));
  vec2 v = f - 0.5;
  col *= 1.0 - 0.7 * dot(v, v);
  gl_FragColor = vec4(max(col, 0.0) * fenetre, 1.0);
}
`

// Atlas des chiffres de l'amorce : « 3 », « 2 », « 1 » côte à côte, noirs sur transparent.
function atlasChiffres() {
  const canvas = document.createElement('canvas')
  canvas.width = 384
  canvas.height = 192
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '700 150px Georgia, "Times New Roman", serif'
  ;['3', '2', '1'].forEach((c, i) => ctx.fillText(c, 64 + i * 128, 104))
  const tex = new CanvasTexture(canvas)
  tex.flipY = true
  return tex
}

/**
 * Crée la pellicule : une cible de rendu, la scène d'un quad plein écran et son matériau.
 * `frame` : demi-largeur et demi-hauteur du cadre 16:9 dans la carte (fractions de 1).
 * Appeler `render(gl)` à chaque image, après avoir réglé les uniformes ; `dispose()` au démontage.
 */
export function createFilm(frame) {
  const target = new WebGLRenderTarget(FILM_SIZE, FILM_SIZE, {
    type: HalfFloatType,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    depthBuffer: false,
  })
  const digits = atlasChiffres()
  const material = new ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uFrom: { value: null },
      uTo: { value: null },
      uDigits: { value: digits },
      uFromLeader: { value: 1 },
      uToLeader: { value: 1 },
      uBurn: { value: 0 },
      uTime: { value: 0 },
      uLeader: { value: 0 },
      uFrame: { value: frame },
    },
  })
  const scene = new Scene()
  const quad = new Mesh(new PlaneGeometry(2, 2), material)
  quad.frustumCulled = false
  scene.add(quad)
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  return {
    texture: target.texture,
    uniforms: material.uniforms,
    render(gl) {
      const avant = gl.getRenderTarget()
      gl.setRenderTarget(target)
      gl.render(scene, camera)
      gl.setRenderTarget(avant)
    },
    dispose() {
      target.dispose()
      digits.dispose()
      material.dispose()
      quad.geometry.dispose()
    },
  }
}

// Rectangle aux coins arrondis, tracé à la main : ctx.roundRect manque avant Safari 16 et
// Firefox 112.
function rectangleArrondi(ctx, x, y, l, h, r) {
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + l, y, x + l, y + h, r)
  ctx.arcTo(x + l, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + l, y, r)
  ctx.closePath()
}

/**
 * Intertitre dessiné pour un projet sans capture (`media.kind === 'title'`) : fond sombre teinté
 * de la couleur du projet, et son glyphe — un tracé d'électrocardiogramme et une bulle de
 * message (`ecg`), ou un chat et le nom (`cat`). Aucun mot à traduire hors des noms propres.
 */
export function titleCard(media, name) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 576
  const ctx = canvas.getContext('2d')
  const fond = ctx.createRadialGradient(512, 288, 40, 512, 288, 620)
  fond.addColorStop(0, media.color)
  fond.addColorStop(0.55, '#141210')
  fond.addColorStop(1, '#050505')
  ctx.fillStyle = fond
  ctx.fillRect(0, 0, 1024, 576)
  ctx.fillStyle = 'rgba(5, 5, 5, 0.35)'
  ctx.fillRect(0, 0, 1024, 576)
  ctx.strokeStyle = '#f4efe6'
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  if (media.glyph === 'ecg') {
    ctx.lineWidth = 9
    ctx.beginPath()
    const y = 300
    const pts = [[80, y], [330, y], [370, y - 30], [405, y], [450, y], [480, y + 40], [520, y - 190], [565, y + 120], [600, y], [700, y], [745, y - 45], [800, y], [944, y]]
    pts.forEach(([x, yy], i) => (i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy)))
    ctx.stroke()
    // une bulle de message, en haut à droite
    ctx.lineWidth = 7
    ctx.beginPath()
    rectangleArrondi(ctx, 760, 96, 170, 108, 26)
    ctx.moveTo(800, 204)
    ctx.lineTo(786, 244)
    ctx.lineTo(834, 204)
    ctx.stroke()
  } else if (media.glyph === 'cat') {
    ctx.lineWidth = 8
    ctx.beginPath()
    // tête, oreilles, yeux et moustaches
    ctx.moveTo(392, 250)
    ctx.lineTo(420, 140)
    ctx.lineTo(470, 205)
    ctx.quadraticCurveTo(512, 192, 554, 205)
    ctx.lineTo(604, 140)
    ctx.lineTo(632, 250)
    ctx.bezierCurveTo(650, 360, 374, 360, 392, 250)
    ctx.stroke()
    ctx.fillStyle = '#f4efe6'
    ctx.beginPath()
    ctx.ellipse(468, 262, 10, 16, 0, 0, Math.PI * 2)
    ctx.ellipse(556, 262, 10, 16, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.lineWidth = 4
    ctx.beginPath()
    ;[[-1, -8], [-1, 8], [1, -8], [1, 8]].forEach(([s, dy]) => {
      ctx.moveTo(512 + s * 40, 300 + dy * 0.3)
      ctx.lineTo(512 + s * 120, 292 + dy * 2)
    })
    ctx.stroke()
    ctx.font = '600 64px Georgia, "Times New Roman", serif'
    ctx.textAlign = 'center'
    ctx.fillText(name, 512, 440)
  }
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  return tex
}

/**
 * Une texture de pellicule par projet, dans l'ordre des projets : les images chargées (`images`,
 * dans l'ordre des projets à image), passées en sRGB, et un intertitre dessiné par `makeTitle`
 * pour chaque projet sans capture, nommé par `media.label` (vide sans nom à écrire).
 */
export function filmTextures(projects, images, makeTitle = titleCard) {
  let i = 0
  return projects.map((p) => {
    if (p.media.kind === 'image') {
      const t = images[i++]
      t.colorSpace = SRGBColorSpace
      return t
    }
    return makeTitle(p.media, p.media.label ?? '')
  })
}

/**
 * Règle la pellicule pour une étape de projectAt : les deux images mêlées (ou l'amorce, index
 * -1) et la brûlure. `textures` : une texture par projet, dans l'ordre des projets.
 */
export function setFilmStep(uniforms, step, textures) {
  uniforms.uFrom.value = step.from < 0 ? null : textures[step.from]
  uniforms.uTo.value = step.to < 0 ? null : textures[step.to]
  uniforms.uFromLeader.value = step.from < 0 ? 1 : 0
  uniforms.uToLeader.value = step.to < 0 ? 1 : 0
  uniforms.uBurn.value = step.burn
}

/**
 * Couleur de la lumière renvoyée par l'écran pour une étape : celle du projet, ou de l'amorce,
 * fondue de l'image `from` à l'image `to` au rythme de la brûlure. Écrite dans `out`.
 */
export function screenColor(step, colors, leaderColor, out = new Color()) {
  const a = step.from < 0 ? leaderColor : colors[step.from]
  const b = step.to < 0 ? leaderColor : colors[step.to]
  return out.copy(a).lerp(b, step.burn)
}
