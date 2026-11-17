// Remplissage dithere en WebGL (bayer 8x8 + fbm), pilote par une MotionValue.
import React from "react";
import { PIXEL_BUDGET, hexToRgbFloat, pixelRatioFor } from "../lib/device.js";
const pa = "#B87333";
const ua = 0.9;
const ma = 0.08;
const ga = 0.45;
const DITHER_VERTEX_SHADER = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;
const DITHER_FRAGMENT_SHADER = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform float uPixel;
uniform float uScale;
uniform float uSpeed;
uniform float uSpread;
uniform float uFill;   // 0..1 coverage driver
uniform vec3  uColor;

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
  float flow = fbm(nuv * 1.8 + q * 1.7 + vec2(t * 0.6, -t * 0.4));

  // Coverage grows with fill; the flow field spreads which cells cross first,
  // and the +uSpread margin guarantees full coverage exactly at fill == 1.
  float cov = uFill * (1.0 + uSpread) - (1.0 - flow) * uSpread;

  vec2 bp = px / uPixel;
  float b4 = bayer2(0.25 * bp) * 0.25 + bayer2(bp);
  float b8 = bayer2(0.125 * bp) * 0.0625 + b4;
  b8 = (b8 * 63.0 + 0.5) / 64.0;

  float lit = step(b8, clamp(cov, 0.0, 1.0));
  gl_FragColor = vec4(uColor, lit); // transparent where unlit
}
`;
function DitherFill({
  fill: e,
  pixel: i = 3,
  color: a = pa,
  className: o,
  onReady: s
}) {
  const n = React.useRef(null),
    d = React.useRef(s);
  return d.current = s, React.useEffect(() => {
    const l = n.current;
    if (!l) return;
    const h = hexToRgbFloat(a),
      c = {
        current: e.get()
      },
      m = {
        render: () => {},
        resize: () => {},
        live: !1,
        U: null
      };
    let v = 0,
      A = !1,
      f = !1,
      C = !1;
    const D = performance.now(),
      b = () => {
        const u = l.getContext("webgl", {
          antialias: !1,
          alpha: !0,
          premultipliedAlpha: !1
        });
        if (!u || u.isContextLost()) return;
        const p = (I, j) => {
            const k = u.createShader(I);
            return u.shaderSource(k, j), u.compileShader(k), !u.getShaderParameter(k, u.COMPILE_STATUS) && !u.isContextLost() && console.error("[dither-fill] shader error:", u.getShaderInfoLog(k)), k;
          },
          S = u.createProgram();
        u.attachShader(S, p(u.VERTEX_SHADER, DITHER_VERTEX_SHADER)), u.attachShader(S, p(u.FRAGMENT_SHADER, DITHER_FRAGMENT_SHADER)), u.linkProgram(S), u.useProgram(S);
        const T = u.createBuffer();
        u.bindBuffer(u.ARRAY_BUFFER, T), u.bufferData(u.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), u.STATIC_DRAW);
        const R = u.getAttribLocation(S, "aPos");
        u.enableVertexAttribArray(R), u.vertexAttribPointer(R, 2, u.FLOAT, !1, 0, 0);
        const E = {};
        for (const I of ["uRes", "uTime", "uPixel", "uScale", "uSpeed", "uSpread", "uFill", "uColor"]) E[I] = u.getUniformLocation(S, I);
        u.uniform1f(E.uScale, ua), u.uniform1f(E.uSpeed, ma), u.uniform1f(E.uSpread, ga), u.uniform3fv(E.uColor, h), u.enable(u.BLEND), u.blendFunc(u.SRC_ALPHA, u.ONE_MINUS_SRC_ALPHA), u.clearColor(0, 0, 0, 0), m.U = E, m.resize = () => {
          const I = l.clientWidth,
            j = l.clientHeight,
            k = pixelRatioFor(I, j, PIXEL_BUDGET.fill),
            q = Math.max(1, Math.floor(I * k)),
            F = Math.max(1, Math.floor(j * k));
          (l.width !== q || l.height !== F) && (l.width = q, l.height = F, u.viewport(0, 0, q, F)), u.uniform2f(E.uRes, l.width, l.height), u.uniform1f(E.uPixel, Math.max(1, i * k));
        }, m.render = () => {
          var I;
          u.isContextLost() || (u.clear(u.COLOR_BUFFER_BIT), u.uniform1f(E.uTime, (performance.now() - D) / 1e3), u.uniform1f(E.uFill, c.current), u.drawArrays(u.TRIANGLES, 0, 3), C || (C = !0, (I = d.current) == null || I.call(d)));
        }, m.live = !0, m.resize();
      },
      _ = () => {
        if (!m.live || c.current <= 0.001) {
          A = !1, m.live && m.render();
          return;
        }
        m.render(), v = requestAnimationFrame(_);
      },
      L = () => {
        !A && m.live && c.current > 0.001 && (A = !0, v = requestAnimationFrame(_));
      },
      G = e.on("change", u => {
        c.current = u, L();
      }),
      g = new ResizeObserver(() => {
        m.resize(), A || m.render();
      });
    g.observe(l);
    const P = u => {
        u.preventDefault(), m.live = !1, A = !1;
      },
      M = () => {
        f || (b(), L());
      };
    return l.addEventListener("webglcontextlost", P), l.addEventListener("webglcontextrestored", M), b(), L(), () => {
      var p;
      cancelAnimationFrame(v), A = !1, G(), g.disconnect(), l.removeEventListener("webglcontextlost", P), l.removeEventListener("webglcontextrestored", M), m.live = !1, f = !0;
      const u = l.getContext("webgl");
      (p = u == null ? void 0 : u.getExtension("WEBGL_lose_context")) == null || p.loseContext();
    };
  }, [e, i, a]), <canvas ref={n} className={o} aria-hidden="true" />;
}
export { DitherFill };
