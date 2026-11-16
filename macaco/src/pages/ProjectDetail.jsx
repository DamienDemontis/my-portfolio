import '../styles/project-detail.css'
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLink, canHover, getMaxScroll, getScrollTop, Je, Kn, on, scrollToTop, useAccent, useIsCoarsePointer, usePageTransition, UseSeo } from "../app-core.jsx";
import { CaseSections } from "../components/case-detail/CaseSectionRenderer.jsx";
import { useFitHeading } from "../hooks/useFitHeading.js";
import { useTranslation } from "react-i18next";
import { ie } from "../components/case-detail/CaseVideoPlayer.jsx";
function CdNext({
  next: n,
  progress: a = 0
}) {
  const {
      t: c
    } = useTranslation(),
    A = useFitHeading(n == null ? void 0 : n.title);
  return n ? <section className="cd-next" aria-label={c("detail.nextProject")} style={{
    "--p": a
  }}><div className="cd-next__inner"><div className="cd-next__head"><p className="cd-next__label">{`// ${c("detail.keepScrolling")}`}</p><div className="cd-next__bar" role="progressbar" aria-valuemin={0} aria-valuemax={1} aria-valuenow={a}><span className="cd-next__bar-fill" /></div><p className="cd-next__kicker">{c("detail.nextProject")}</p></div><div className="cd-next__foot"><h2 className="cd-next__title" ref={A}>{n.title}</h2><div className="cd-next__meta"><span>{n.year}</span><span>{n.category}</span>{n.customer && <span><span className="cd-next__meta-k">{`{${c("detail.customer")}}`}</span>{" "}{n.customer}</span>}</div></div></div></section> : null;
}
function be({
  enabled: n = !0,
  threshold: a = 650,
  decayPerFrame: c = 0.04,
  onComplete: A
} = {}) {
  const [E, o] = React.useState(0),
    [S, P] = React.useState(!1),
    R = React.useRef(0),
    T = React.useRef(!1),
    d = React.useRef(n),
    s = React.useRef(A);
  return d.current = n, s.current = A, React.useEffect(() => {
    let u = 0,
      j = 0,
      y = null;
    const w = () => {
        const m = getMaxScroll();
        return m <= 0 || getScrollTop() >= m - 2;
      },
      i = m => {
        var F;
        R.current = m;
        const h = Math.min(1, Math.max(0, m / a));
        o(h), h >= 1 && !T.current && (T.current = !0, P(!0), (F = s.current) == null || F.call(s));
      },
      B = () => {
        j = 0, !T.current && (u !== 0 ? (i(R.current + u), u = 0) : R.current > 0 && !w() && (i(Math.max(0, R.current - c * a)), R.current > 0 && C()));
      },
      C = () => {
        j || (j = requestAnimationFrame(B));
      },
      D = m => {
        !d.current || T.current || m > 0 && !w() || m < 0 && R.current <= 0 || (u += m, C());
      },
      I = m => D(m.deltaY),
      U = m => {
        var h;
        y = ((h = m.touches[0]) == null ? void 0 : h.clientY) ?? null;
      },
      G = m => {
        var F;
        if (y == null) return;
        const h = ((F = m.touches[0]) == null ? void 0 : F.clientY) ?? y;
        D(y - h), y = h;
      },
      X = () => {
        y = null;
      };
    return window.addEventListener("wheel", I, {
      passive: !0
    }), window.addEventListener("touchstart", U, {
      passive: !0
    }), window.addEventListener("touchmove", G, {
      passive: !0
    }), window.addEventListener("touchend", X, {
      passive: !0
    }), () => {
      cancelAnimationFrame(j), window.removeEventListener("wheel", I), window.removeEventListener("touchstart", U), window.removeEventListener("touchmove", G), window.removeEventListener("touchend", X);
    };
  }, [a, c]), {
    progress: E,
    locked: S,
    reset: () => {
      R.current = 0, T.current = !1, P(!1), o(0);
    }
  };
}
const Ae = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`,
  we = `
precision highp float;
uniform sampler2D uTex;
uniform vec2  uRes;      // canvas size (device px)
uniform vec2  uUvScale;  // cover-fit mapping: tex uv = canvas uv * scale + offset
uniform vec2  uUvOffset;
uniform vec2  uMouse;    // canvas uv (y up), eased in JS
uniform float uStrength; // 0..1 eased hover strength
uniform float uTime;
uniform float uPixel;    // dither cell size (device px)
uniform float uRadius;   // lens radius (aspect-corrected uv units)
uniform float uZoom;     // spherical magnification amount
uniform vec3  uAccent;
uniform vec3  uDark;

float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer8(vec2 p){
  float b4 = bayer2(0.25 * p) * 0.25 + bayer2(p);
  float b8 = bayer2(0.125 * p) * 0.0625 + b4;
  return (b8 * 63.0 + 0.5) / 64.0; // normalized to (0,1), no always-lit cell
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;              // y-up canvas uv
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);            // aspect-corrected space
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float d = distance(p, m);

  // Lens influence: 1 under the cursor -> 0 at the radius. A soft breathing
  // keeps it alive while held still.
  float f = smoothstep(uRadius, 0.0, d) * uStrength;
  f *= 1.0 + 0.045 * sin(uTime * 2.3);

  // Spherical magnification toward the cursor (barrel-lens feel).
  vec2 pd = m + (p - m) * (1.0 - uZoom * f);
  vec2 duv = vec2(pd.x / aspect, pd.y);

  // Cover-fit sample (texture uploaded with FLIP_Y, so uv maps directly).
  vec2 tuv = clamp(duv * uUvScale + uUvOffset, 0.0, 1.0);
  vec3 col = texture2D(uTex, tuv).rgb;

  // Dither the lens zone: luminance -> contrast curve -> 8x8 ordered quantize.
  vec2 cell = floor(gl_FragCoord.xy / uPixel);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  lum = smoothstep(0.12, 0.82, lum + 0.10 * f); // slight lift near the cursor
  float lit = step(bayer8(cell), lum);
  vec3 dcol = mix(uDark, uAccent, lit);

  // Coverage mask, dissolved through a *decorrelated* Bayer so the edge breaks
  // into sparse dots (like the reference) instead of a smooth alpha blend.
  float mask = smoothstep(uRadius, uRadius * 0.30, d) * uStrength;
  float show = step(bayer8(cell + vec2(37.0, 19.0)), mask);

  gl_FragColor = vec4(mix(col, dcol, show), 1.0);
}
`;
function ye(n) {
  const a = (n || "#feff00").replace("#", "");
  return [parseInt(a.slice(0, 2), 16) / 255, parseInt(a.slice(2, 4), 16) / 255, parseInt(a.slice(4, 6), 16) / 255];
}
const M = [],
  Le = 3;
function Q(n) {
  const a = M.indexOf(n);
  a !== -1 && M.splice(a, 1), M.push(n);
  let c = 0;
  for (; M.length > Le && c < M.length;) if (M[c] !== n && !M[c].hovered) {
    const [A] = M.splice(c, 1);
    A.dispose();
  } else c++;
}
function ee(n) {
  const a = M.indexOf(n);
  a !== -1 && M.splice(a, 1);
}
function Se({
  src: n,
  alt: a,
  accent: c = "#feff00",
  className: A = "",
  onError: E
}) {
  const o = React.useRef(null),
    [S, P] = React.useState(!1),
    [R] = React.useState(() => typeof window < "u" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && canHover()),
    T = React.useRef(E);
  return T.current = E, React.useEffect(() => {
    if (!R) return;
    const d = o.current;
    if (!d) return;
    const s = {
        hover: !1,
        k: 0,
        mx: 0.5,
        my: 0.5,
        tx: 0.5,
        ty: 0.5
      },
      l = {
        updateCover: () => {},
        renderFrame: () => {},
        live: !1
      };
    let u = 0,
      j = !1,
      y = !1;
    const w = performance.now(),
      i = {
        hovered: !1,
        dispose: () => {}
      },
      B = () => {
        const t = d.getContext("webgl", {
          antialias: !1,
          alpha: !1
        });
        if (!t || t.isContextLost()) {
          t || P(!0);
          return;
        }
        const e = (b, f) => {
            const g = t.createShader(b);
            return t.shaderSource(g, f), t.compileShader(g), !t.getShaderParameter(g, t.COMPILE_STATUS) && !t.isContextLost() && console.error("[dither-lens] shader error:", t.getShaderInfoLog(g)), g;
          },
          p = t.createProgram();
        t.attachShader(p, e(t.VERTEX_SHADER, Ae)), t.attachShader(p, e(t.FRAGMENT_SHADER, we)), t.linkProgram(p), t.useProgram(p);
        const H = t.createBuffer();
        t.bindBuffer(t.ARRAY_BUFFER, H), t.bufferData(t.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), t.STATIC_DRAW);
        const Z = t.getAttribLocation(p, "aPos");
        t.enableVertexAttribArray(Z), t.vertexAttribPointer(Z, 2, t.FLOAT, !1, 0, 0);
        const _ = {};
        for (const b of ["uRes", "uUvScale", "uUvOffset", "uMouse", "uStrength", "uTime", "uPixel", "uRadius", "uZoom", "uAccent", "uDark", "uTex"]) _[b] = t.getUniformLocation(p, b);
        t.uniform3fv(_.uAccent, ye(c)), t.uniform3fv(_.uDark, [0.04, 0.04, 0.04]), t.uniform1i(_.uTex, 0), t.uniform1f(_.uRadius, 0.55), t.uniform1f(_.uZoom, 0.34), t.clearColor(0.043, 0.043, 0.043, 1);
        const x = t.createTexture();
        t.bindTexture(t.TEXTURE_2D, x), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR);
        let W = 0,
          k = 0,
          Y = !1;
        const O = new Image();
        O.onload = () => {
          l.live && (W = O.naturalWidth, k = O.naturalHeight, t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !0), t.bindTexture(t.TEXTURE_2D, x), t.texImage2D(t.TEXTURE_2D, 0, t.RGB, t.RGB, t.UNSIGNED_BYTE, O), Y = !0, l.updateCover(), l.renderFrame(), d.style.opacity = "1");
        }, O.onerror = () => {
          T.current ? T.current() : P(!0);
        }, O.src = n;
        const N = () => Math.min(window.devicePixelRatio || 1, 1.75);
        l.updateCover = () => {
          const b = Math.max(1, Math.floor(d.clientWidth * N())),
            f = Math.max(1, Math.floor(d.clientHeight * N()));
          if ((d.width !== b || d.height !== f) && (d.width = b, d.height = f, t.viewport(0, 0, b, f)), t.uniform2f(_.uRes, b, f), t.uniform1f(_.uPixel, 3 * N()), W && k) {
            const g = Math.max(b / W, f / k),
              L = W * g,
              $ = k * g;
            t.uniform2f(_.uUvScale, b / L, f / $), t.uniform2f(_.uUvOffset, (L - b) / 2 / L, ($ - f) / 2 / $);
          }
        }, l.renderFrame = () => {
          if (!t.isContextLost()) {
            if (!Y) {
              t.clear(t.COLOR_BUFFER_BIT);
              return;
            }
            t.uniform1f(_.uStrength, s.k), t.uniform2f(_.uMouse, s.mx, s.my), t.uniform1f(_.uTime, (performance.now() - w) / 1e3), t.drawArrays(t.TRIANGLES, 0, 3);
          }
        }, l.live = !0, l.updateCover(), l.renderFrame();
      },
      C = () => {
        var e;
        if (!l.live) return;
        l.live = !1, l.updateCover = () => {}, l.renderFrame = () => {}, cancelAnimationFrame(u), j = !1, d.style.opacity = "0", y = !0;
        const t = d.getContext("webgl");
        (e = t == null ? void 0 : t.getExtension("WEBGL_lose_context")) == null || e.loseContext(), y = !1;
      };
    i.dispose = C;
    const D = () => {
        if (l.live) {
          Q(i);
          return;
        }
        Q(i), B(), l.live || ee(i);
      },
      I = () => {
        s.k += ((s.hover ? 1 : 0) - s.k) * 0.09, s.mx += (s.tx - s.mx) * 0.16, s.my += (s.ty - s.my) * 0.16, l.renderFrame(), s.hover || s.k > 0.004 ? u = requestAnimationFrame(I) : (s.k = 0, l.renderFrame(), j = !1);
      },
      U = () => {
        !j && l.live && (j = !0, u = requestAnimationFrame(I));
      },
      G = t => {
        t.preventDefault(), l.live = !1;
      },
      X = () => {
        y || (B(), (s.hover || s.k > 0) && U());
      };
    d.addEventListener("webglcontextlost", G), d.addEventListener("webglcontextrestored", X);
    const m = new ResizeObserver(() => {
      l.updateCover(), l.renderFrame();
    });
    m.observe(d);
    const h = d.parentElement || d,
      F = t => {
        const e = d.getBoundingClientRect();
        s.tx = (t.clientX - e.left) / Math.max(1, e.width), s.ty = 1 - (t.clientY - e.top) / Math.max(1, e.height);
      },
      z = t => {
        i.hovered = !0, D(), l.updateCover(), F(t), s.mx = s.tx, s.my = s.ty, s.hover = !0, U();
      },
      q = t => {
        F(t), s.hover || (i.hovered = !0, D(), s.hover = !0, U());
      },
      V = () => {
        i.hovered = !1, s.hover = !1, U();
      };
    return h.addEventListener("pointerenter", z), h.addEventListener("pointermove", q), h.addEventListener("pointerleave", V), () => {
      cancelAnimationFrame(u), m.disconnect(), d.removeEventListener("webglcontextlost", G), d.removeEventListener("webglcontextrestored", X), h.removeEventListener("pointerenter", z), h.removeEventListener("pointermove", q), h.removeEventListener("pointerleave", V), C(), ee(i);
    };
  }, [n, c, R]), S || !R ? <img src={n} alt={a} className={A} loading="lazy" decoding="async" /> : <><img src={n} alt="" aria-hidden="true" className={A} loading="lazy" decoding="async" /><canvas ref={o} className={A} style={{
      opacity: 0
    }} role="img" aria-label={a} /></>;
}
const Pe = "#060606",
  je = "#3f3908",
  Ce = 0.9,
  Fe = 0.065,
  De = 0.34,
  Ue = 2,
  Ne = 0.1,
  Me = 0.03,
  te = 0.2;
function re(n) {
  const a = n.replace("#", "");
  return [parseInt(a.slice(0, 2), 16) / 255, parseInt(a.slice(2, 4), 16) / 255, parseInt(a.slice(4, 6), 16) / 255];
}
const Ie = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`,
  ke = `
precision highp float;
uniform sampler2D uTex;
uniform vec2  uRes;
uniform vec2  uUvScale;
uniform vec2  uUvOffset;
uniform vec2  uMouse;    // local canvas uv, y-up, eased
uniform float uTime;
uniform vec2  uEdge;     // per-axis dissolve band (spill fraction)
uniform float uPixel;
uniform float uScale;
uniform float uSpeed;
uniform float uHaloR;
uniform float uAmp;
uniform float uHaloPush;
uniform vec3  uDark;
uniform vec3  uAccent;

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
float bayer8(vec2 p){
  float b4 = bayer2(0.25 * p) * 0.25 + bayer2(p);
  float b8 = bayer2(0.125 * p) * 0.0625 + b4;
  return (b8 * 63.0 + 0.5) / 64.0;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;              // y-up canvas uv
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Domain-warped flow field, same shape as SiteDither.
  float t = uTime * uSpeed;
  vec2 nuv = p * uScale;
  vec2 q = vec2(fbm(nuv * 1.6 + vec2(0.0, t)),
                fbm(nuv * 1.6 + vec2(5.2, 1.3) - t * 0.8));

  // Cursor halo (same mechanic as the background).
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float halo = smoothstep(uHaloR, 0.0, distance(p, m));

  // The image is displaced by the flow (always) and pushed harder near the halo.
  vec2 disp = (q - 0.5) * (uAmp + halo * uHaloPush);
  vec2 duv = uv + disp;
  vec2 tuv = clamp(duv * uUvScale + uUvOffset, 0.0, 1.0);
  vec3 src = texture2D(uTex, tuv).rgb;

  // Two-tone Bayer halftone of the image luminance, in the background palette.
  float lum = dot(src, vec3(0.299, 0.587, 0.114));
  lum = smoothstep(0.10, 0.85, lum) + halo * 0.12;
  vec2 cell = floor(gl_FragCoord.xy / uPixel);
  float lit = step(bayer8(cell), lum);
  vec3 col = mix(uDark, uAccent, lit);

  // Coverage: solid across the media box, dissolving through the spill band to 0
  // at the outer edge. Dissolve via a *decorrelated* Bayer so the edge breaks
  // into sparse dots (blends into the background) instead of a soft alpha fade.
  vec2 dEdge = min(uv, 1.0 - uv);
  vec2 e = smoothstep(vec2(0.0), uEdge, dEdge);
  float cov = e.x * e.y;
  cov = min(1.0, cov + halo * 0.15 * cov);
  float show = step(bayer8(cell + vec2(37.0, 19.0)), cov);

  gl_FragColor = vec4(col, show);
}
`;
function Oe({
  src: n,
  accent: a = null,
  className: c = "cd-echo"
}) {
  const A = React.useRef(null),
    [E, o] = React.useState(!1),
    [S, P] = React.useState(0),
    R = React.useRef(0),
    [T] = React.useState(() => typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    d = ie(),
    s = useIsCoarsePointer(),
    l = d || s;
  return React.useEffect(() => {
    if (l) return;
    const u = A.current;
    if (!u) return;
    const j = re(Pe),
      y = a ? Je(a) : re(je),
      w = {
        x: 0.5,
        y: 0.5,
        tx: 0.5,
        ty: 0.5
      },
      i = {
        updateCover: () => {},
        renderFrame: () => {},
        live: !1
      };
    let B = 0,
      C = !1,
      D = !0,
      I = !1,
      U = 0;
    const G = performance.now(),
      X = () => {
        const e = u.getContext("webgl", {
          antialias: !1,
          alpha: !0,
          premultipliedAlpha: !1
        });
        if (!e || e.isContextLost()) {
          e || o(!0);
          return;
        }
        const p = (f, g) => {
            const L = e.createShader(f);
            return e.shaderSource(L, g), e.compileShader(L), !e.getShaderParameter(L, e.COMPILE_STATUS) && !e.isContextLost() && console.error("[dither-echo] shader error:", e.getShaderInfoLog(L)), L;
          },
          H = e.createProgram();
        e.attachShader(H, p(e.VERTEX_SHADER, Ie)), e.attachShader(H, p(e.FRAGMENT_SHADER, ke)), e.linkProgram(H), e.useProgram(H);
        const Z = e.createBuffer();
        e.bindBuffer(e.ARRAY_BUFFER, Z), e.bufferData(e.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), e.STATIC_DRAW);
        const _ = e.getAttribLocation(H, "aPos");
        e.enableVertexAttribArray(_), e.vertexAttribPointer(_, 2, e.FLOAT, !1, 0, 0);
        const x = {};
        for (const f of ["uTex", "uRes", "uUvScale", "uUvOffset", "uMouse", "uTime", "uEdge", "uPixel", "uScale", "uSpeed", "uHaloR", "uAmp", "uHaloPush", "uDark", "uAccent"]) x[f] = e.getUniformLocation(H, f);
        e.uniform1i(x.uTex, 0), e.uniform1f(x.uScale, Ce), e.uniform1f(x.uSpeed, Fe), e.uniform1f(x.uHaloR, De), e.uniform1f(x.uAmp, Ne), e.uniform1f(x.uHaloPush, Me), e.uniform3fv(x.uDark, j), e.uniform3fv(x.uAccent, y), e.enable(e.BLEND), e.blendFunc(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA), e.clearColor(0, 0, 0, 0);
        const W = e.createTexture();
        e.bindTexture(e.TEXTURE_2D, W), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR);
        let k = 0,
          Y = 0,
          O = !1;
        const N = new Image();
        N.onload = () => {
          i.live && (k = N.naturalWidth, Y = N.naturalHeight, e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0), e.bindTexture(e.TEXTURE_2D, W), e.texImage2D(e.TEXTURE_2D, 0, e.RGB, e.RGB, e.UNSIGNED_BYTE, N), O = !0, R.current = 0, i.updateCover(), i.renderFrame());
        }, N.onerror = () => o(!0), N.src = n;
        const b = () => Math.min(window.devicePixelRatio || 1, 1.75);
        i.updateCover = () => {
          const f = Math.max(1, Math.floor(u.clientWidth * b())),
            g = Math.max(1, Math.floor(u.clientHeight * b()));
          if ((u.width !== f || u.height !== g) && (u.width = f, u.height = g, e.viewport(0, 0, f, g)), e.uniform2f(x.uRes, f, g), e.uniform1f(x.uPixel, Ue * b()), e.uniform2f(x.uEdge, te, te), k && Y) {
            const L = Math.max(f / k, g / Y),
              $ = k * L,
              K = Y * L;
            e.uniform2f(x.uUvScale, f / $, g / K), e.uniform2f(x.uUvOffset, ($ - f) / 2 / $, (K - g) / 2 / K);
          }
        }, i.renderFrame = () => {
          e.isContextLost() || (e.clear(e.COLOR_BUFFER_BIT), O && (e.uniform2f(x.uMouse, w.x, w.y), e.uniform1f(x.uTime, (performance.now() - G) / 1e3), e.drawArrays(e.TRIANGLES, 0, 3)));
        }, i.live = !0, i.updateCover(), i.renderFrame();
      },
      m = () => {
        if (!i.live || !D) {
          C = !1;
          return;
        }
        w.x += (w.tx - w.x) * 0.08, w.y += (w.ty - w.y) * 0.08, i.renderFrame(), B = requestAnimationFrame(m);
      },
      h = () => {
        if (T) {
          i.renderFrame();
          return;
        }
        !C && i.live && D && (C = !0, B = requestAnimationFrame(m));
      },
      F = e => {
        const p = u.getBoundingClientRect();
        w.tx = (e.clientX - p.left) / Math.max(1, p.width), w.ty = 1 - (e.clientY - p.top) / Math.max(1, p.height);
      };
    canHover() && window.addEventListener("pointermove", F);
    const z = new ResizeObserver(() => {
      i.updateCover(), i.renderFrame();
    });
    z.observe(u);
    const q = new IntersectionObserver(([e]) => {
      D = e.isIntersecting, D && h();
    }, {
      threshold: 0
    });
    q.observe(u);
    const V = e => {
        e.preventDefault(), i.live = !1, C = !1, !I && R.current < 6 && (R.current += 1, U = setTimeout(() => P(p => p + 1), 300));
      },
      t = () => {
        I || (X(), h());
      };
    return u.addEventListener("webglcontextlost", V), u.addEventListener("webglcontextrestored", t), X(), h(), () => {
      var p;
      cancelAnimationFrame(B), clearTimeout(U), C = !1, window.removeEventListener("pointermove", F), z.disconnect(), q.disconnect(), u.removeEventListener("webglcontextlost", V), u.removeEventListener("webglcontextrestored", t), i.live = !1, I = !0;
      const e = u.getContext("webgl");
      (p = e == null ? void 0 : e.getExtension("WEBGL_lose_context")) == null || p.loseContext();
    };
  }, [n, a, T, S, l]), E || l ? null : <canvas ref={A} className={c} aria-hidden="true" key={S} />;
}
function Ne2({
  icon: n
}) {
  return n && n.startsWith("/") ? <img src={n} alt="" /> : null;
}
function CdSpec({
  label: n,
  items: a
}) {
  return !a || !a.length ? null : <dl className="cd-spec"><dt>{`{${n}}`}</dt>{a.map(c => <dd key={c}>{c}</dd>)}</dl>;
}
function Cd() {
  const {
      lang: n,
      slug: a
    } = useParams(),
    {
      t: c
    } = useTranslation(),
    A = useNavigate(),
    E = usePageTransition(),
    o = on(a, n),
    S = Kn(a, n),
    {
      setAccent: P
    } = useAccent(),
    R = useFitHeading(o == null ? void 0 : o.title);
  React.useLayoutEffect(() => {
    scrollToTop();
  }, [a]), React.useEffect(() => (P((o == null ? void 0 : o.accent) ?? null), () => P(null)), [o == null ? void 0 : o.accent, P]);
  const {
    progress: T
  } = be({
    enabled: !!S && !(E != null && E.busy),
    threshold: 700,
    onComplete: () => {
      S && (E == null || E.run(() => A(`/${n}/projects/${S.slug}`)));
    }
  });
  return React.useEffect(() => {
    E == null || E.preview(T);
  }, [T, E]), o ? <main className="cd" style={{
    "--accent": o.accent
  }}><UseSeo lang={n} kind="project" slug={a} /><section className="cd-hero"><Oe src={o.image} accent={o.accent} className="cd-echo" />{o.status && <div className="cd-status">{o.status}</div>}<div className="cd-media"><Se src={o.image} alt={o.title} accent={o.accent} className="cd-img" /><span className="cd-icon cd-icon--media" aria-hidden={!0}><Ne2 icon={o.icon} /></span></div><div className="cd-headline"><span className="cd-icon cd-icon--head" aria-hidden={!0}><Ne2 icon={o.icon} /></span><h1 className="cd-title" ref={R}>{o.title}</h1>{o.intro && <p className="cd-intro">{o.intro}</p>}<div className="cd-meta"><span>{o.year}</span><span>{o.category}</span>{(o.customer || o.partner) && <span className="cd-meta__party">{o.customer && <span><span className="cd-meta__k">{`{${c("detail.customer")}}`}</span>{" "}{o.customer}</span>}{o.partner && <span><span className="cd-meta__k">{`{${c("detail.partner")}}`}</span>{" "}{o.partner}</span>}</span>}</div></div><div className="cd-specs"><CdSpec label={c("detail.capabilities")} items={o.capabilities} /><CdSpec label={c("detail.platforms")} items={o.platforms} /></div></section><CaseSections sections={o.sections} /><CdNext next={S} progress={T} /></main> : <main className="cd"><UseSeo lang={n} kind="project" slug={a} /><div className="cd-notfound"><p className="cd-notfound__code">{"PROJECT_NOT_FOUND"}</p><AppLink to={`/${n}/projects`} className="cd-back">{"← "}{c("detail.back")}</AppLink></div></main>;
}
function qe() {
  const {
    slug: n
  } = useParams();
  return <Cd key={n} />;
}
export { qe as default };
