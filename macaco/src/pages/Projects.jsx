import { AppLink } from "../components/Nav.jsx";
import { canHover, useIsCoarsePointer } from "../lib/device.js";
import { getAllCases, UseSeo } from "../seo/Seo.jsx";
import { useAccent } from "../state/accent.jsx";
import '../styles/projects.css';
import React from "react";
import { useParams } from "react-router-dom";
import { useCanHover } from "../hooks/useCanHover.js";
import { useTranslation } from "react-i18next";
const Z = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`,
  q = `
precision highp float;
uniform sampler2D uTex;
uniform vec2  uRes;
uniform vec2  uUvScale;
uniform vec2  uUvOffset;
uniform vec2  uMouse;
uniform float uStrength;
uniform float uTime;
uniform float uPixel;
uniform float uRadius;
uniform float uZoom;
uniform vec3  uAccent;
uniform vec3  uDark;

float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer8(vec2 p){
  float b4 = bayer2(0.25 * p) * 0.25 + bayer2(p);
  float b8 = bayer2(0.125 * p) * 0.0625 + b4;
  return (b8 * 63.0 + 0.5) / 64.0;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float d = distance(p, m);

  float f = smoothstep(uRadius, 0.0, d) * uStrength;
  f *= 1.0 + 0.045 * sin(uTime * 2.3);

  vec2 pd = m + (p - m) * (1.0 - uZoom * f);
  vec2 duv = vec2(pd.x / aspect, pd.y);

  vec2 tuv = clamp(duv * uUvScale + uUvOffset, 0.0, 1.0);
  vec3 col = texture2D(uTex, tuv).rgb;

  vec2 cell = floor(gl_FragCoord.xy / uPixel);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  lum = smoothstep(0.12, 0.82, lum + 0.10 * f);
  float lit = step(bayer8(cell), lum);
  vec3 dcol = mix(uDark, uAccent, lit);

  float mask = smoothstep(uRadius, uRadius * 0.30, d) * uStrength;
  float show = step(bayer8(cell + vec2(37.0, 19.0)), mask);

  gl_FragColor = vec4(mix(col, dcol, show), 1.0);
}
`;
function V(l) {
  const u = (l || "#feff00").replace("#", "");
  return [parseInt(u.slice(0, 2), 16) / 255, parseInt(u.slice(2, 4), 16) / 255, parseInt(u.slice(4, 6), 16) / 255];
}
const D = {
    enter() {},
    move() {},
    leave() {}
  },
  K = React.forwardRef(function ({
    className: u = "case-grid-lens"
  }, d) {
    const p = React.useRef(null),
      f = React.useRef(D);
    return React.useImperativeHandle(d, () => ({
      enter: (...s) => f.current.enter(...s),
      move: (...s) => f.current.move(...s),
      leave: (...s) => f.current.leave(...s)
    }), []), React.useEffect(() => {
      const s = p.current;
      if (!s) return;
      if (!(!window.matchMedia("(prefers-reduced-motion: reduce)").matches && canHover())) {
        f.current = D;
        return;
      }
      let e = null,
        c = null,
        m = !1;
      const T = new Map();
      let i = null,
        v = null;
      const r = {
        hover: !1,
        k: 0,
        mx: 0.5,
        my: 0.5,
        tx: 0.5,
        ty: 0.5
      };
      let N = 0,
        A = !1;
      const M = performance.now(),
        n = () => Math.min(window.devicePixelRatio || 1, 1.75),
        j = () => {
          if (e = s.getContext("webgl", {
            antialias: !1,
            alpha: !0
          }), !e || e.isContextLost()) {
            e = null;
            return;
          }
          const o = (y, C) => {
              const E = e.createShader(y);
              return e.shaderSource(E, C), e.compileShader(E), !e.getShaderParameter(E, e.COMPILE_STATUS) && !e.isContextLost() && console.error("[case-grid-lens] shader error:", e.getShaderInfoLog(E)), E;
            },
            a = e.createProgram();
          e.attachShader(a, o(e.VERTEX_SHADER, Z)), e.attachShader(a, o(e.FRAGMENT_SHADER, q)), e.linkProgram(a), e.useProgram(a);
          const _ = e.createBuffer();
          e.bindBuffer(e.ARRAY_BUFFER, _), e.bufferData(e.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), e.STATIC_DRAW);
          const h = e.getAttribLocation(a, "aPos");
          e.enableVertexAttribArray(h), e.vertexAttribPointer(h, 2, e.FLOAT, !1, 0, 0), c = {};
          for (const y of ["uRes", "uUvScale", "uUvOffset", "uMouse", "uStrength", "uTime", "uPixel", "uRadius", "uZoom", "uAccent", "uDark", "uTex"]) c[y] = e.getUniformLocation(a, y);
          e.uniform3fv(c.uDark, [0.04, 0.04, 0.04]), e.uniform1i(c.uTex, 0), e.uniform1f(c.uRadius, 0.55), e.uniform1f(c.uZoom, 0.34), m = !0;
        },
        R = o => {
          let a = T.get(o);
          if (a) return a;
          const _ = e.createTexture();
          e.bindTexture(e.TEXTURE_2D, _), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), a = {
            tex: _,
            w: 0,
            h: 0,
            ready: !1
          }, T.set(o, a);
          const h = new Image();
          return h.onload = () => {
            m && (a.w = h.naturalWidth, a.h = h.naturalHeight, e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0), e.bindTexture(e.TEXTURE_2D, _), e.texImage2D(e.TEXTURE_2D, 0, e.RGB, e.RGB, e.UNSIGNED_BYTE, h), a.ready = !0, i === a && r.hover && (P(), w(), s.style.opacity = "1"));
          }, h.src = o, a;
        },
        b = o => {
          const a = o.getBoundingClientRect(),
            h = (s.offsetParent || document.body).getBoundingClientRect();
          s.style.left = a.left - h.left + "px", s.style.top = a.top - h.top + "px", s.style.width = a.width + "px", s.style.height = a.height + "px";
        },
        P = () => {
          const o = Math.max(1, Math.floor(s.clientWidth * n())),
            a = Math.max(1, Math.floor(s.clientHeight * n()));
          if ((s.width !== o || s.height !== a) && (s.width = o, s.height = a, e.viewport(0, 0, o, a)), e.uniform2f(c.uRes, o, a), e.uniform1f(c.uPixel, 3 * n()), i && i.w && i.h) {
            const _ = Math.max(o / i.w, a / i.h),
              h = i.w * _,
              y = i.h * _;
            e.uniform2f(c.uUvScale, o / h, a / y), e.uniform2f(c.uUvOffset, (h - o) / 2 / h, (y - a) / 2 / y);
          }
        },
        w = () => {
          !m || e.isContextLost() || !i || !i.ready || (e.bindTexture(e.TEXTURE_2D, i.tex), e.uniform1f(c.uStrength, r.k), e.uniform2f(c.uMouse, r.mx, r.my), e.uniform1f(c.uTime, (performance.now() - M) / 1e3), e.drawArrays(e.TRIANGLES, 0, 3));
        },
        I = () => {
          r.k += ((r.hover ? 1 : 0) - r.k) * 0.09, r.mx += (r.tx - r.mx) * 0.16, r.my += (r.ty - r.my) * 0.16, w(), r.hover || r.k > 0.004 ? N = requestAnimationFrame(I) : (r.k = 0, w(), A = !1, s.style.opacity = "0");
        },
        U = () => {
          A || (A = !0, N = requestAnimationFrame(I));
        },
        L = () => {
          v && s.style.opacity !== "0" && (b(v), P());
        };
      return window.addEventListener("resize", L), f.current = {
        enter(o, a, _, h, y) {
          if (m || j(), !m) return;
          const C = o !== v;
          v = o, i = R(a), e.uniform3fv(c.uAccent, V(_)), b(o), P();
          const E = o.getBoundingClientRect();
          r.tx = (h - E.left) / Math.max(1, E.width), r.ty = 1 - (y - E.top) / Math.max(1, E.height), r.hover = !0, C && (r.k = 0, r.mx = r.tx, r.my = r.ty), i.ready ? (w(), s.style.opacity = "1") : s.style.opacity = "0", U();
        },
        move(o, a) {
          if (!m || !v) return;
          const _ = v.getBoundingClientRect();
          r.tx = (o - _.left) / Math.max(1, _.width), r.ty = 1 - (a - _.top) / Math.max(1, _.height), r.hover || (r.hover = !0, U());
        },
        leave() {
          r.hover = !1, U();
        }
      }, () => {
        var o;
        cancelAnimationFrame(N), window.removeEventListener("resize", L), f.current = D, e && ((o = e.getExtension("WEBGL_lose_context")) == null || o.loseContext());
      };
    }, []), <canvas ref={p} className={u} aria-hidden="true" />;
  });
function Card({
  item: l,
  onLensEnter: u,
  onLensMove: d,
  onLensLeave: p,
  onHoverEnter: f,
  onHoverLeave: s
}) {
  const {
      lang: g
    } = useParams(),
    [e, c] = React.useState(!1),
    m = l.image && !e,
    T = m && !!u;
  return <article className="pl-card" style={{
    "--accent": l.accent
  }} onPointerEnter={() => f == null ? void 0 : f(l)} onPointerLeave={() => s == null ? void 0 : s()}><AppLink to={`/${g}/projects/${l.slug}`} className="pl-card__link"><header className="pl-card__meta"><span>{String(l.category || "").toUpperCase()}</span><span>{l.year}</span></header><div className="pl-card__media" onPointerEnter={T ? i => u(i.currentTarget, l, i.clientX, i.clientY) : void 0} onPointerMove={T ? i => d == null ? void 0 : d(i) : void 0} onPointerLeave={T ? () => p == null ? void 0 : p() : void 0}>{m ? <img src={l.image} alt={l.title} className="pl-card__img pl-card__img--gl" loading="lazy" decoding="async" onError={() => c(!0)} /> : <div className="pl-card__img pl-card__img--placeholder" aria-label={l.title}><span className="pl-card__code">{l.code}</span><span className="pl-card__ph-label">{"IMG"}</span></div>}</div><footer className="pl-card__foot"><h3 className="pl-card__title">{l.title}</h3><p className="pl-card__excerpt">{l.excerpt}</p><span className="pl-card__arrow" aria-hidden={!0} /></footer></AppLink></article>;
}
const S = ["starting_artificial{lms}", "operating_ocean{_yellow}operating_", "starting_artificial{lms}", "loading_shader::dither[ok]", "sync_accent::#{hex}", "mount_case::{slug}", "render_pass::bayer_8x8", "operating_ocean{_yellow}", "ready_for_{awesomeness}"],
  F = 42,
  Q = 360,
  X = 40;
function ee() {
  var l;
  return typeof window < "u" && ((l = window.matchMedia) == null ? void 0 : l.call(window, "(prefers-reduced-motion: reduce)").matches);
}
function TerminalLine({
  className: l = "pl-terminal"
}) {
  const [u, d] = React.useState([]),
    [p, f] = React.useState("");
  return React.useEffect(() => {
    if (ee()) {
      d(S.slice(0, 4)), f(S[4]);
      return;
    }
    let s = 0,
      g = 0,
      e;
    const c = () => {
      const m = S[s % S.length];
      g < m.length ? (g += 1, f(m.slice(0, g)), e = setTimeout(c, F)) : (d(T => {
        const i = [...T, m];
        return i.length > X ? i.slice(i.length - X) : i;
      }), f(""), s += 1, g = 0, e = setTimeout(c, Q));
    };
    return e = setTimeout(c, F), () => clearTimeout(e);
  }, []), <div className={l} aria-hidden={!0}>{u.map((s, g) => <div className="pl-terminal__line" key={`${g}-${s}`}>{s}</div>)}<div className="pl-terminal__line">{p}<span className="pl-terminal__caret" /></div></div>;
}
const se = "/case/general-case-icon.svg";
function re(l) {
  const u = [...l];
  for (let d = u.length - 1; d > 0; d -= 1) {
    const p = Math.floor(Math.random() * (d + 1));
    [u[d], u[p]] = [u[p], u[d]];
  }
  return u;
}
function Strip() {
  const {
      lang: l
    } = useParams(),
    {
      t: u
    } = useTranslation(),
    d = React.useMemo(() => re(getAllCases(l)), [l]),
    {
      setAccent: p
    } = useAccent(),
    f = React.useMemo(() => {
      const n = [];
      for (const j of d) for (const R of j.projectTypes ?? []) n.includes(R) || n.push(R);
      return ["all", ...n];
    }, [d]),
    [s, g] = React.useState("all"),
    e = React.useMemo(() => s === "all" ? d : d.filter(n => (n.projectTypes ?? []).includes(s)), [s, d]),
    [c, m] = React.useState(null),
    T = n => {
      m({
        accent: n.accent,
        icon: n.icon
      }), p(n.accent);
    },
    i = () => {
      m(null), p(null);
    };
  React.useEffect(() => () => p(null), [p]);
  const v = useCanHover();
  React.useEffect(() => {
    v || (m(null), p(null));
  }, [v, p]);
  const r = useIsCoarsePointer(),
    N = React.useRef(null),
    A = (c == null ? void 0 : c.accent) || "#ffffff",
    M = (c == null ? void 0 : c.icon) || se;
  return <main className={`pl${c ? " pl--accent" : ""}`} style={{
    "--accent": A
  }}><UseSeo lang={l} kind="projects" /><div className="pl-strip"><div className="pl-strip__group"><span className="pl-ico pl-ico--spiral" aria-hidden={!0} /><span className="pl-strip__stars" aria-hidden={!0}><i className="pl-ico pl-ico--star" /><i className="pl-ico pl-ico--star" /><i className="pl-ico pl-ico--star" /></span><span className="pl-strip__ready">{u("projects.ready")}</span><i className="pl-ico pl-ico--star" aria-hidden={!0} /></div><span className="pl-strip__rule" aria-hidden={!0} /><p className="pl-strip__desc">{u("projects.description")}</p><span className="pl-strip__glyphs" aria-hidden={!0} /><span className="pl-strip__rule pl-strip__rule--short" aria-hidden={!0} /></div><aside className="pl-rail"><div className="pl-rail__filters"><span className="pl-select">{u("projects.select")}</span><ul className="pl-filters">{f.map(n => <li key={n}><button type="button" className={`pl-filter${s === n ? " is-active" : ""}`} onClick={() => g(n)}><span className="pl-filter__box" aria-hidden={!0} />{u(`projects.types.${n}`, n).toUpperCase()}</button></li>)}</ul><select className="pl-filter-native" value={s} onChange={n => g(n.target.value)} aria-label={u("projects.select")}>{f.map(n => <option value={n} key={n}>{u(`projects.types.${n}`, n).toUpperCase()}</option>)}</select></div><h1 className="pl-wordmark">{u("projects.title")}</h1><div className="pl-foot"><span className="pl-foot__icon" style={{
          "--icon": `url(${M})`
        }} aria-hidden={!0} /><TerminalLine className="pl-terminal" /></div></aside><section className="pl-scroll"><div className="pl-track">{e.map(n => <Card item={n} onLensEnter={r ? void 0 : (j, R, b, P) => {
          var w;
          return (w = N.current) == null ? void 0 : w.enter(j, R.image, R.accent, b, P);
        }} onLensMove={r ? void 0 : j => {
          var R;
          return (R = N.current) == null ? void 0 : R.move(j.clientX, j.clientY);
        }} onLensLeave={r ? void 0 : () => {
          var j;
          return (j = N.current) == null ? void 0 : j.leave();
        }} onHoverEnter={v ? T : void 0} onHoverLeave={v ? i : void 0} key={n.slug} />)}{!r && <K ref={N} className="pl-lens" />}</div></section></main>;
}
export { Strip as default };
