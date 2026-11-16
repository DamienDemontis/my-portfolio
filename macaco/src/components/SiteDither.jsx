// Voile dithere plein ecran, derriere toutes les pages.
import React from "react";
import { PIXEL_BUDGET, canHover, cssPixelRatioFor, pixelRatioFor } from "../lib/device.js";
import { hexToRgbScaled } from "../lib/shared.js";
import { useAccent } from "../state/accent.jsx";
const ie = {
  dark: "#060606",
  light: "#3f3908",
  pixel: 1,
  lo: 0.4,
  hi: 1,
  scale: 0.9,
  speed: 0.065,
  halo: 0.3
};
function Ye(e) {
  const i = e.replace("#", "");
  return [parseInt(i.slice(0, 2), 16) / 255, parseInt(i.slice(2, 4), 16) / 255, parseInt(i.slice(4, 6), 16) / 255];
}
const Wo = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;
const Ho = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uPixel;
uniform float uLo;
uniform float uHi;
uniform float uScale;
uniform float uSpeed;
uniform float uHalo;
uniform vec3  uColor;
uniform vec3  uDot;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){
    v += a * vnoise(p);
    p = p * 2.0 + 11.3;
    a *= 0.5;
  }
  return v;
}
float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }

void main(){
  vec2 px = floor(gl_FragCoord.xy / uPixel) * uPixel;
  vec2 uv = px / uRes.y;
  vec2 nuv = uv * uScale;

  float t = uTime * uSpeed;
  vec2 q = vec2(fbm(nuv * 1.6 + vec2(0.0, t)),
                fbm(nuv * 1.6 + vec2(5.2, 1.3) - t * 0.8));
  float n = fbm(nuv * 1.8 + q * 1.7 + vec2(t * 0.6, -t * 0.4));

  vec2 m = uMouse * (uRes / uRes.y);
  float d = distance(uv, m);
  float halo = smoothstep(0.34, 0.0, d) * uHalo;
  n += halo;

  n = smoothstep(uLo, uHi, n);

  vec2 bp = px / uPixel;
  float b4 = bayer2(0.25 * bp) * 0.25 + bayer2(bp);
  float b8 = bayer2(0.125 * bp) * 0.0625 + b4;
  b8 = (b8 * 63.0 + 0.5) / 64.0;

  float lit = step(b8, n);
  vec3 col = mix(uColor, uDot, lit);
  gl_FragColor = vec4(col, 1.0);
}
`;
function $o({
  active: e = !0,
  accent: i = null,
  className: a = "site-dither"
}) {
  const o = React.useRef(null),
    s = React.useRef({
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5
    }),
    n = React.useRef(e);
  n.current = e;
  const d = React.useRef(i ? hexToRgbScaled(i) : Ye(ie.light));
  d.current = i ? hexToRgbScaled(i) : Ye(ie.light);
  const l = React.useRef(null),
    h = React.useRef(null);
  return React.useEffect(() => {
    const c = o.current;
    if (!c) return;
    const m = Ye(ie.dark),
      v = {
        render: () => {},
        resize: () => {},
        live: !1
      };
    let A = 0;
    const f = performance.now(),
      C = () => {
        const g = c.getContext("webgl", {
          antialias: !1,
          alpha: !0
        });
        if (!g || g.isContextLost()) {
          g || console.warn("[site-dither] WebGL unavailable — background disabled");
          return;
        }
        const P = (T, R) => {
            const E = g.createShader(T);
            return g.shaderSource(E, R), g.compileShader(E), !g.getShaderParameter(E, g.COMPILE_STATUS) && !g.isContextLost() && console.error("[site-dither] shader error:", g.getShaderInfoLog(E)), E;
          },
          M = g.createProgram();
        g.attachShader(M, P(g.VERTEX_SHADER, Wo)), g.attachShader(M, P(g.FRAGMENT_SHADER, Ho)), g.linkProgram(M), g.useProgram(M);
        const u = g.createBuffer();
        g.bindBuffer(g.ARRAY_BUFFER, u), g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
        const p = g.getAttribLocation(M, "aPos");
        g.enableVertexAttribArray(p), g.vertexAttribPointer(p, 2, g.FLOAT, !1, 0, 0);
        const S = {};
        for (const T of ["uRes", "uTime", "uMouse", "uPixel", "uLo", "uHi", "uScale", "uSpeed", "uHalo", "uColor", "uDot"]) S[T] = g.getUniformLocation(M, T);
        g.uniform1f(S.uLo, ie.lo), g.uniform1f(S.uHi, ie.hi), g.uniform1f(S.uScale, ie.scale), g.uniform1f(S.uSpeed, ie.speed), g.uniform1f(S.uHalo, ie.halo), g.uniform3fv(S.uColor, m), g.uniform3fv(S.uDot, d.current), l.current = g, h.current = S.uDot, v.resize = () => {
          const T = c.clientWidth,
            R = c.clientHeight,
            E = pixelRatioFor(T, R, PIXEL_BUDGET.background),
            I = Math.floor(T * E),
            j = Math.floor(R * E);
          (c.width !== I || c.height !== j) && (c.width = I, c.height = j, g.viewport(0, 0, I, j)), g.uniform2f(S.uRes, c.width, c.height), g.uniform1f(S.uPixel, Math.max(1, ie.pixel * cssPixelRatioFor(T, R, PIXEL_BUDGET.background)));
        }, v.render = T => {
          g.isContextLost() || (g.uniform1f(S.uTime, (performance.now() - f) / 1e3), g.uniform2f(S.uMouse, T.x, T.y), g.drawArrays(g.TRIANGLES, 0, 3));
        }, v.live = !0, v.resize();
      },
      D = g => {
        s.current.tx = g.clientX / window.innerWidth, s.current.ty = 1 - g.clientY / window.innerHeight;
      };
    canHover() && window.addEventListener("pointermove", D);
    const b = new ResizeObserver(() => v.resize());
    b.observe(c);
    const _ = () => {
        if (A = requestAnimationFrame(_), !n.current || !v.live) return;
        const g = s.current;
        g.x += (g.tx - g.x) * 0.08, g.y += (g.ty - g.y) * 0.08, v.render(g);
      },
      L = g => {
        g.preventDefault(), v.live = !1;
      },
      G = () => {
        C();
      };
    return c.addEventListener("webglcontextlost", L), c.addEventListener("webglcontextrestored", G), C(), _(), () => {
      cancelAnimationFrame(A), window.removeEventListener("pointermove", D), b.disconnect(), c.removeEventListener("webglcontextlost", L), c.removeEventListener("webglcontextrestored", G), l.current = null, h.current = null, Yo(c);
    };
  }, []), React.useEffect(() => {
    const c = l.current;
    c && !c.isContextLost() && h.current && c.uniform3fv(h.current, d.current);
  }, [i]), <canvas ref={o} className={`${a}${e ? "" : " site-dither--off"}`} aria-hidden="true" />;
}
function Yo(e) {
  var a;
  const i = e.getContext("webgl");
  (a = i == null ? void 0 : i.getExtension("WEBGL_lose_context")) == null || a.loseContext();
}
function SiteDitherLayer({
  active: e
}) {
  const {
    accent: i
  } = useAccent();
  return <$o active={e} accent={i} />;
}
export { SiteDitherLayer };
