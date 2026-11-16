import enCommon from "./i18n/locales/en.json";
import itCommon from "./i18n/locales/it.json";
import { caseHistories } from "./content/caseHistories.js";
import './styles/index.css';
import React from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useHref, useLocation, useNavigate, useNavigationType, useParams } from "react-router-dom";
import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { animate, AnimatePresence, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
const LANGUAGES = ["it", "en"],
  DEFAULT_LANGUAGE = "it",
  FALLBACK_LANGUAGE = "en";
function isSupportedLanguage(e) {
  return LANGUAGES.includes(e);
}
function detectBrowserLanguage() {
  var e;
  return typeof navigator < "u" && ((e = navigator.languages) != null && e.length ? navigator.languages : [navigator.language]).some(o => (o || "").slice(0, 2).toLowerCase() === "it") ? "it" : FALLBACK_LANGUAGE;
}
const oa = {
    en: {
      common: enCommon
    },
    it: {
      common: itCommon
    }
  },
  St = typeof window < "u" ? window.location.pathname.split("/")[1] : "",
  ra = isSupportedLanguage(St) ? St : detectBrowserLanguage();
i18next.use(initReactI18next).init({
  resources: oa,
  lng: ra,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: LANGUAGES,
  ns: ["common"],
  defaultNS: "common",
  interpolation: {
    escapeValue: !1
  },
  react: {
    useSuspense: !1
  }
});
const COARSE_POINTER_QUERY = "(pointer: coarse)";
function isCoarsePointer() {
  return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia(COARSE_POINTER_QUERY).matches;
}
const na = 1.2,
  sa = 1,
  la = 0.6,
  ca = 1.5,
  da = 2,
  PIXEL_BUDGET = {
    background: 1366 * 768,
    fill: 100 * 900
  };
function devicePixelRatioCapped() {
  return Math.min(typeof window < "u" && window.devicePixelRatio || 1, da);
}
function pixelRatioFor(e = 0, i = 0, a = PIXEL_BUDGET.background) {
  const o = devicePixelRatioCapped(),
    s = isCoarsePointer(),
    n = s ? sa : na,
    d = s ? a * la : a;
  let l = s || o >= ca ? Math.min(o, n) : o;
  if (e > 0 && i > 0) {
    const h = e * i * l * l;
    h > d && (l *= Math.sqrt(d / h));
  }
  return l;
}
function ti(e = 0, i = 0, a = PIXEL_BUDGET.background) {
  return pixelRatioFor(e, i, a) / devicePixelRatioCapped();
}
const pa = "#feff00",
  ua = 0.9,
  ma = 0.08,
  ga = 0.45;
function hexToRgbFloat(e) {
  const i = e.replace("#", "");
  return [parseInt(i.slice(0, 2), 16) / 255, parseInt(i.slice(2, 4), 16) / 255, parseInt(i.slice(4, 6), 16) / 255];
}
const DITHER_VERTEX_SHADER = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`,
  DITHER_FRAGMENT_SHADER = `
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
const SCROLL_ROOT_ID = "scroll-root";
let he = null;
function getScrollRoot() {
  return he && he.isConnected || (he = document.getElementById(SCROLL_ROOT_ID) || document.scrollingElement || document.documentElement), he;
}
function getScrollTop() {
  return getScrollRoot().scrollTop;
}
function getMaxScroll() {
  const e = getScrollRoot();
  return Math.max(0, e.scrollHeight - e.clientHeight);
}
function getViewportHeight() {
  return getScrollRoot().clientHeight || window.innerHeight;
}
function getOffsetTop(e) {
  return e.getBoundingClientRect().top + getScrollTop() - getScrollRoot().getBoundingClientRect().top;
}
function getOffsetBottom(e) {
  return e.getBoundingClientRect().bottom + getScrollTop() - getScrollRoot().getBoundingClientRect().top;
}
function Aa(e) {
  getScrollRoot().scrollTo(e);
}
function scrollToTop() {
  getScrollRoot().scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });
}
function lt(e, {
  resize: i = !0
} = {}) {
  const a = getScrollRoot();
  return a.addEventListener("scroll", e, {
    passive: !0
  }), i && window.addEventListener("resize", e), () => {
    a.removeEventListener("scroll", e), i && window.removeEventListener("resize", e);
  };
}
function Bn() {
  const e = getScrollRoot();
  return e === document.documentElement || e === document.scrollingElement ? null : e;
}
const AccentContext = React.createContext({
    accent: null,
    setAccent: () => {}
  }),
  useAccent = () => React.useContext(AccentContext);
function AccentProvider({
  children: e
}) {
  const [i, a] = React.useState(null);
  return <AccentContext.Provider value={{
    accent: i,
    setAccent: a
  }}>{e}</AccentContext.Provider>;
}
function useIsCoarsePointer() {
  const [e, i] = React.useState(isCoarsePointer);
  return React.useEffect(() => {
    const a = window.matchMedia(COARSE_POINTER_QUERY),
      o = () => i(a.matches);
    return o(), a.addEventListener("change", o), () => a.removeEventListener("change", o);
  }, []), e;
}
const qe = new Set(),
  Sa = 10;
function ni(e, {
  enabled: i = !0,
  getParams: a,
  shouldIgnore: o
} = {}) {
  const s = React.useRef();
  s.current = {
    getEl: e,
    getParams: a,
    shouldIgnore: o
  }, React.useEffect(() => {
    if (!i) return;
    const n = s.current.getEl();
    if (!n) return;
    const d = getScrollRoot();
    let l = 0,
      h = 1,
      c = 0,
      m = 0,
      v = 0,
      A = 0,
      f = !1,
      C = 0,
      D = 0,
      b = null;
    const _ = () => {
      A && cancelAnimationFrame(A), A = 0;
    };
    qe.add(_);
    const L = () => {
        const M = performance.now(),
          u = Math.min(32, M - m);
        m = M;
        const p = v * u;
        if (Math.abs(p) < 0.15) {
          A = 0;
          return;
        }
        const S = d.scrollTop;
        if (d.scrollTop += p, d.scrollTop === S) {
          A = 0;
          return;
        }
        v *= Math.pow(h, u / 16.67), A = requestAnimationFrame(L);
      },
      G = M => {
        qe.forEach(S => S()), v = 0;
        const u = s.current.shouldIgnore;
        if (f = M.touches.length === 1 && !(u && u(M.target)), !f) return;
        const p = s.current.getParams();
        l = p.maxPxPerSec / 1e3, h = p.friction, C = M.touches[0].clientX, D = M.touches[0].clientY, b = null, c = D, m = performance.now();
      },
      g = M => {
        if (!f) return;
        if (M.touches.length > 1) {
          f = !1;
          return;
        }
        const u = M.touches[0].clientY,
          p = performance.now();
        if (b === null) {
          const I = Math.abs(M.touches[0].clientX - C),
            j = Math.abs(u - D);
          if (Math.max(I, j) < Sa) {
            c = u, m = p, M.preventDefault();
            return;
          }
          b = j >= I ? "y" : "x";
        }
        if (b === "x") {
          M.preventDefault();
          return;
        }
        const S = Math.max(1, p - m),
          T = c - u,
          R = l * S,
          E = Math.max(-R, Math.min(R, T));
        d.scrollTop += E, v = v * 0.4 + E / S * 0.6, c = u, m = p, M.preventDefault();
      },
      P = () => {
        f && (f = !1, m = performance.now(), Math.abs(v) > 0.02 && !A && (A = requestAnimationFrame(L)));
      };
    return n.addEventListener("touchstart", G, {
      passive: !0
    }), n.addEventListener("touchmove", g, {
      passive: !1
    }), n.addEventListener("touchend", P, {
      passive: !0
    }), n.addEventListener("touchcancel", P, {
      passive: !0
    }), () => {
      _(), qe.delete(_), n.removeEventListener("touchstart", G), n.removeEventListener("touchmove", g), n.removeEventListener("touchend", P), n.removeEventListener("touchcancel", P);
    };
  }, [i]);
}
const si = 60,
  li = 35,
  ci = 75,
  Pn = si + li + ci,
  Gn = 100 + li + ci;
function Ta(e) {
  const i = e.replace("#", "");
  return [parseInt(i.slice(0, 2), 16) / 255, parseInt(i.slice(2, 4), 16) / 255, parseInt(i.slice(4, 6), 16) / 255];
}
function Je(e, i = 0.3) {
  return Ta(e).map(a => a * i);
}
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
function canHover() {
  return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia(HOVER_QUERY).matches;
}
const We = {
    mobile: 760,
    tablet: 1025
  },
  Ia = 500,
  za = 1025,
  Ra = 3e3,
  we = {
    narrow: [3, 2],
    wide: [18, 9]
  },
  Ma = ([e, i]) => `${e} / ${i}`,
  ka = {
    mobileDown: `(max-width: ${We.mobile}px)`,
    tabletDown: `(max-width: ${We.tablet}px)`,
    desktopUp: `(min-width: ${We.tablet + 1}px)`,
    narrowAspect: `(max-aspect-ratio: ${Ma(we.narrow)})`
  },
  La = [{
    id: "amb",
    label: "Ambient",
    type: "ambient"
  }, {
    id: "key",
    label: "Key (cool front)",
    type: "dir"
  }, {
    id: "fill",
    label: "Fill (shadow side)",
    type: "dir"
  }, {
    id: "rimBack",
    label: "Rim back (yellow)",
    type: "dir"
  }],
  Da = {
    env: 0,
    amb: {
      intensity: 1.3,
      color: "#29220f",
      pos: null
    },
    key: {
      intensity: 0,
      color: "#9b7e12",
      pos: [-4, -3.1, -6.5]
    },
    fill: {
      intensity: 0,
      color: "#50473f",
      pos: [-1.9, 8.6, -3.1]
    },
    rimBack: {
      intensity: 0.65,
      color: "#e6a800",
      pos: [10, 2.1, -10]
    }
  },
  _a = {
    env: 1.5,
    amb: {
      intensity: 0,
      color: "#332b1e",
      pos: null
    },
    key: {
      intensity: 3.85,
      color: "#9f9475",
      pos: [-1.4, -0.4, 1.8]
    },
    fill: {
      intensity: 2.55,
      color: "#50473f",
      pos: [-7.4, 8.6, -3.1]
    },
    rimBack: {
      intensity: 3.8,
      color: "#e6a800",
      pos: [1, -10, 3]
    }
  };
function ja(e) {
  const i = {
    env: e.env
  };
  for (const a of La) {
    const o = e[a.id];
    i[a.id] = {
      intensity: o.intensity,
      color: o.color,
      pos: o.pos ? [...o.pos] : null
    };
  }
  return i;
}
const ct = [{
  pos: [1.3, 0.9, 0.3],
  look: [-1.2, 0.9, -0.4],
  fov: 27,
  at: 0,
  transition: "cut",
  dur: 2e3,
  anim: "power_on",
  lights: {
    env: 0,
    amb: {
      intensity: 1.3,
      color: "#29220f"
    },
    key: {
      intensity: 6,
      color: "#9b7e12",
      pos: [-20, -20, 11.5]
    },
    fill: {
      intensity: 0,
      color: "#50473f",
      pos: [-1.9, 8.6, -3.1]
    },
    rimBack: {
      intensity: 0.5,
      color: "#e6a800",
      pos: [10, 2.1, -10]
    }
  }
}, {
  pos: [1.3, 0.9, 0.3],
  look: [-1.2, 0.9, -0.4],
  fov: 27,
  at: 500,
  transition: "cut",
  dur: 2e3,
  anim: "",
  lights: {
    env: 0,
    amb: {
      intensity: 1.3,
      color: "#29220f"
    },
    key: {
      intensity: 6,
      color: "#9b7e12",
      pos: [4.3, -20, 11.5]
    },
    fill: {
      intensity: 3.5,
      color: "#50473f",
      pos: [-1.9, 8.6, -3.1]
    },
    rimBack: {
      intensity: 0.5,
      color: "#e6a800",
      pos: [10, 2.1, -10]
    }
  }
}, {
  pos: [2, 2, 2.9],
  look: [0.12, 3.44, -0.06],
  fov: 31,
  at: 2700,
  transition: "cut",
  dur: 2e3,
  anim: "build",
  lights: {
    env: 1.5,
    amb: {
      intensity: 0,
      color: "#332b1e"
    },
    key: {
      intensity: 0,
      color: "#9f9475",
      pos: [-3.5, -0.4, 1.8]
    },
    fill: {
      intensity: 0.4,
      color: "#3700ff",
      pos: [20, 20, -9.2]
    },
    rimBack: {
      intensity: 3.8,
      color: "#e6b400",
      pos: [-12.2, -20, -2]
    }
  }
}, {
  pos: [-0.4, 4.9, -0.7],
  look: [0, 2.6, 1],
  fov: 34,
  at: 5e3,
  transition: "cut",
  dur: 2e3,
  anim: "",
  lights: {
    env: 1.5,
    amb: {
      intensity: 0,
      color: "#332b1e"
    },
    key: {
      intensity: 0,
      color: "#9f9475",
      pos: [-3.5, -0.4, 1.8]
    },
    fill: {
      intensity: 0,
      color: "#50473f",
      pos: [-7.4, 8.6, -3.1]
    },
    rimBack: {
      intensity: 3.8,
      color: "#e6b400",
      pos: [-12.2, -10, 3]
    }
  }
}, {
  pos: [-0.4, 4.9, -0.7],
  look: [0, 2.6, 1],
  fov: 34,
  at: 7750,
  transition: "cut",
  dur: 2e3,
  anim: "",
  lights: {
    env: 0.53,
    amb: {
      intensity: 4.9,
      color: "#110820"
    },
    key: {
      intensity: 4.15,
      color: "#e5ffad",
      pos: [-7.2, -20, -7]
    },
    fill: {
      intensity: 4.6,
      color: "#aa4b67",
      pos: [2, -20, 20]
    },
    rimBack: {
      intensity: 6,
      color: "#5ca7c7",
      pos: [7.8, -20, 20]
    }
  }
}, {
  pos: [-2, -22, -6],
  look: [8, -24, 1],
  fov: 34,
  at: 9300,
  transition: "cut",
  dur: 2e3,
  anim: "",
  lights: {
    env: 1.5,
    amb: {
      intensity: 0,
      color: "#332b1e"
    },
    key: {
      intensity: 1.75,
      color: "#9f9475",
      pos: [-1.4, -0.4, 1.8]
    },
    fill: {
      intensity: 2.65,
      color: "#50473f",
      pos: [-7.4, 8.6, -3.1]
    },
    rimBack: {
      intensity: 2.1,
      color: "#e6a800",
      pos: [1, -10, 3]
    }
  }
}, {
  pos: [-4, 0, -1],
  look: [0.03, -0.45, -0.33],
  fov: 37,
  at: 9900,
  transition: "lerp",
  dur: 1e3,
  anim: "descent"
}, {
  pos: [-1.5, -7.7, -0.5],
  look: [40.8, -7.7, 4.6],
  fov: 54,
  at: 14e3,
  transition: "lerp",
  dur: 4e3,
  anim: "",
  exit: !0
}];
ct.forEach((e, i) => {
  e.lights || (e.lights = ja(i === 0 ? Da : _a));
});
const Oa = [{
    pos: [1.3, 0.75, 0.4],
    look: [-1.2, 0.9, -0.4],
    fov: 35
  }, {
    pos: [1.3, 0.75, 0.4],
    look: [-1.2, 0.9, -0.4],
    fov: 35
  }, {
    pos: [2, 2, 2.9],
    look: [0.12, 3.44, -0.06],
    fov: 31
  }, {
    pos: [-0.55, 5.1, -0.7],
    look: [0, 2.6, 1],
    fov: 37
  }, {
    pos: [-0.55, 5.1, -0.7],
    look: [0, 2.6, 1],
    fov: 37
  }, {
    pos: [-2, -22, -6],
    look: [8, -24, 1],
    fov: 34
  }, {
    pos: [-3.8, 0, -1],
    look: [0.03, -0.45, -0.33],
    fov: 37
  }, {
    pos: [-1.5, -7.7, -0.5],
    look: [40.8, -7.7, 4.6],
    fov: 54
  }],
  pi = ka.narrowAspect,
  Na = ct.map(e => ({
    pos: [...e.pos],
    look: [...e.look],
    fov: e.fov
  }));
function ui(e) {
  const i = e ? Oa : Na;
  config.cameraShots.forEach((a, o) => {
    const s = i[o];
    s && (a.pos = [...s.pos], a.look = [...s.look], a.fov = s.fov);
  }), config.shotsVersion++;
}
const Ba = {
    enabled: !0,
    vh: 14,
    vhTouch: 5,
    touchMaxPxPerSec: 1200,
    touchFriction: 0.96,
    siteTouchMaxPxPerSec: 2400,
    siteTouchFriction: 0.95,
    smooth: 0.1,
    tailMs: 1200,
    exitCamVh: 0.85
  },
  Pa = {
    l1: {
      startMs: 2700,
      endMs: 5e3
    },
    l2: {
      startMs: 7750,
      endMs: 9300
    }
  },
  Ga = {
    copies: 1,
    spawnIntervalMs: 10,
    lifetimeMs: 650,
    fadeMs: 920,
    offsetX: 0.8,
    offsetY: 0.06,
    offsetZ: 0.06,
    jitter: 0.13,
    ditherPx: 3,
    gain: 2.1,
    colorLight: "#ffee00",
    colorDark: "#1f1e10"
  },
  Fa = {
    atFrame: 35,
    durationMs: 800,
    amplitude: 0.12,
    frequency: 35
  },
  Va = {
    count: 400,
    areaRadius: 31,
    clearRadius: 6,
    minH: 1,
    maxH: 34,
    minW: 0.5,
    maxW: 3.9,
    groundY: -30,
    buildingColor: "#080703",
    blend: 0.46,
    windowSize: 0.29,
    windowDensity: 0.15,
    windowMargin: 0.22,
    flicker: 0,
    brightness: 0.5,
    colorA: "#4e431d",
    colorB: "#333d00",
    colorC: "#322f1a",
    ditherPx: 3,
    fogColor: "#111103",
    fogNear: 1,
    fogFar: 70,
    seed: 3,
    exitColorA: "#e5ff00",
    exitColorB: "#e5ff00",
    exitColorC: "#e5ff00",
    exitBuildingColor: "#e5ff00",
    heroW: 2.5,
    heroD: 2,
    heroTopY: -1.2,
    heroX: 0.15,
    heroZ: -0.15,
    heroRotY: -12,
    heroDelay: 0.08,
    genStartMs: 7e3,
    genEndMs: 13e3,
    genStagger: 0.6,
    glowColor: "#00f7ff",
    glowWidth: 1.2,
    glowIntensity: 6,
    iridSpeed: 0.15,
    iridScale: 1.2,
    baseFogColor: "#e5ff00",
    baseFogHeight: 9,
    baseFogIntensity: 1,
    beamCount: 200,
    beamWidth: 0.35,
    beamMinH: 10,
    beamMaxH: 42,
    beamColor: "#e0ff33",
    beamIntensity: 1.4,
    bloomIntensity: 1.1,
    bloomThreshold: 0.35,
    bloomSmoothing: 0.5,
    bloomRadius: 0.7
  },
  Ua = {
    bodyStartMs: 2300,
    bodyEndMs: 7750,
    bodyFadeMs: 700,
    vortexStartMs: 2300,
    vortexEndMs: 5e3,
    vortexFadeMs: 700,
    color: "#b1a62f",
    intensity: 3,
    auraColor: "#ffffff",
    auraColorDark: "#ffffff",
    auraDitherPx: 1,
    auraCount: 8,
    auraRadius: 1.05,
    auraHeight: 0.6,
    auraIntensity: 4,
    auraSwirl: 0.45,
    auraTwist: 0,
    iridSpeed: 1,
    iridScale: 4
  },
  qa = {
    boot: {
      dark: "#080808",
      light: "#423d05",
      pixel: 1,
      lo: 0.36,
      hi: 1,
      scale: 2.05,
      speed: 0.1,
      halo: 0.26,
      irid: !1
    },
    powered: {
      dark: "#080808",
      light: "#323312",
      pixel: 1,
      lo: 0.34,
      hi: 0.83,
      scale: 2.05,
      speed: 0.3,
      halo: 0.3,
      irid: !0
    },
    landed: {
      dark: "#060606",
      light: "#2a2703",
      pixel: 1,
      lo: 0.36,
      hi: 1,
      scale: 2.4,
      speed: 0.1,
      halo: 0.2,
      irid: !1
    },
    content: {
      dark: "#060606",
      light: "#3f3908",
      pixel: 1,
      lo: 0.64,
      hi: 1,
      scale: 0.9,
      speed: 0.065,
      halo: 0.3,
      irid: !1
    }
  },
  Wa = {
    bloomIntensity: 0.45,
    bloomThreshold: 0.58,
    bloomSmoothing: 0.3,
    bloomRadius: 0.14,
    vignetteDarkness: 0.75,
    vignetteOffset: 0.51
  },
  config = {
    cameraShots: ct,
    shotsVersion: 0,
    scroll: Ba,
    scrollDriven: !1,
    scrollMs: 0,
    overlays: Pa,
    post: Wa,
    ditherStates: qa,
    ditherState: "boot",
    heroExit: 0,
    exitCam: 0,
    heroExitPitch: -5,
    glitch: Ga,
    glitchActive: !1,
    shake: Fa,
    shakeFireId: 0,
    city: Va,
    cityVersion: 0,
    power: Ua,
    camSync: {
      pos: [1.3, 0.9, 0.3],
      look: [-1.2, 0.9, -0.4],
      fov: 27,
      on: !1
    },
    robotCenter: [0, 0, 0]
  };
function Ha() {
  config.shakeFireId++;
}
function $a() {
  return config.scrollDriven ? config.scrollMs : 0;
}
function mi(e, i, a, o) {
  if (e <= i || e >= a) return 0;
  const s = (l, h, c) => {
      const m = Math.min(1, Math.max(0, (c - l) / Math.max(1, h - l)));
      return m * m * (3 - 2 * m);
    },
    n = s(i, i + o, e) * (1 - s(a - o, a, e)),
    d = 0.4 + 0.6 * Math.min(1, (e - i) / Math.max(1, a - i));
  return n * d;
}
function Fn(e) {
  const i = config.power;
  return mi(e, i.bodyStartMs, i.bodyEndMs, i.bodyFadeMs);
}
function Vn(e) {
  const i = config.power;
  return mi(e, i.vortexStartMs, i.vortexEndMs, i.vortexFadeMs);
}
function Ya() {
  const e = config.exitCam;
  return e < 0 ? 0 : e > 1 ? 1 : e;
}
function Un(e) {
  for (const i of e) if (i.exit) return i;
  return null;
}
function Ka(e) {
  return e.at + (e.transition === "lerp" ? e.dur : 0);
}
function He() {
  let e = 0;
  for (const i of config.cameraShots) i.exit || (e = Math.max(e, Ka(i)));
  return e;
}
function qn(e) {
  config.glitchActive = !1;
}
const Et = new Set();
function Wn(e) {
  return Et.add(e), () => Et.delete(e);
}
typeof window < "u" && window.matchMedia && ui(window.matchMedia(pi).matches);
function Ie(e) {
  const i = e.replace("#", "");
  return [parseInt(i.slice(0, 2), 16) / 255, parseInt(i.slice(2, 4), 16) / 255, parseInt(i.slice(4, 6), 16) / 255];
}
function Ja({
  active: e = !0,
  stateName: i = null,
  accent: a = null,
  className: o = "intro-dither"
}) {
  const s = React.useRef(null),
    n = React.useRef({
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5
    }),
    d = React.useRef(e);
  d.current = e;
  const l = React.useRef(i);
  l.current = i;
  const h = React.useRef(a);
  return h.current = a, React.useEffect(() => {
    const c = s.current;
    if (!c) return;
    const m = `
      attribute vec2 aPos;
      void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
    `,
      v = `
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
      uniform float uIrid; // 0 = flat dot colour, 1 = holographic palette
      uniform vec3  uColor;
      uniform vec3  uDot;

      // holographic thin-film palette (same as the city glow / power effects)
      vec3 iridPal(float t){ return 0.6 + 0.4 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67))); }

      float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float vnoise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f); // smooth interpolation → fluid, no blockiness
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
        // Coarse pixel grid so the dither reads as chunky pixels.
        vec2 px = floor(gl_FragCoord.xy / uPixel) * uPixel;
        // Aspect-correct UV so the flow isn't stretched on wide screens.
        vec2 uv = px / uRes.y;
        vec2 nuv = uv * uScale; // noise frequency (lower scale = bigger blobs)

        // Slow, domain-warped flow → liquid drifting clouds (the "fluid" look).
        float t = uTime * uSpeed;
        vec2 q = vec2(fbm(nuv * 1.6 + vec2(0.0, t)),
                      fbm(nuv * 1.6 + vec2(5.2, 1.3) - t * 0.8));
        float n = fbm(nuv * 1.8 + q * 1.7 + vec2(t * 0.6, -t * 0.4));

        // Cursor halo: a soft brightening that eases in near the pointer.
        vec2 m = uMouse * (uRes / uRes.y);
        float d = distance(uv, m);
        float halo = smoothstep(0.34, 0.0, d) * uHalo;
        n += halo;

        // Contrast curve: most of the screen stays dark, bright clouds dither in.
        n = smoothstep(uLo, uHi, n);

        // 8x8 ordered dither threshold from nested 2x2 Bayer.
        vec2 bp = px / uPixel;
        float b4 = bayer2(0.25 * bp) * 0.25 + bayer2(bp);
        float b8 = bayer2(0.125 * bp) * 0.0625 + b4;
        // Normalize thresholds to (0,1): the raw matrix has a cell at exactly 0,
        // which would light everywhere (a permanent dot grid in the dark).
        b8 = (b8 * 63.0 + 0.5) / 64.0;

        float lit = step(b8, n);          // hard two-colour quantization
        // Iridescent dots: the lit colour drifts through the holographic
        // palette across the clouds (driven by the flow noise + time), kept at
        // the flat colour's brightness so the coverage tuning still holds.
        float dotLum = max(max(uDot.r, uDot.g), uDot.b);
        vec3 dotCol = mix(uDot, iridPal(n * 1.5 + uTime * 0.06) * dotLum, uIrid);
        vec3 col = mix(uColor, dotCol, lit);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
      A = config.ditherStates[l.current] || config.ditherStates.boot,
      f = {
        pixel: A.pixel,
        lo: A.lo,
        hi: A.hi,
        scale: A.scale,
        speed: A.speed,
        halo: A.halo,
        irid: A.irid ? 1 : 0,
        dark: Ie(A.dark),
        light: Ie(A.light)
      },
      C = (p, S, T) => p + (S - p) * T,
      D = {
        draw: () => {},
        resize: () => {},
        live: !1
      };
    let b = 0;
    const _ = performance.now(),
      L = () => {
        const p = c.getContext("webgl", {
          antialias: !1,
          alpha: !0
        });
        if (!p || p.isContextLost()) {
          p || console.warn("[intro] WebGL unavailable — dithering background disabled");
          return;
        }
        const S = (k, q) => {
            const F = p.createShader(k);
            return p.shaderSource(F, q), p.compileShader(F), !p.getShaderParameter(F, p.COMPILE_STATUS) && !p.isContextLost() && console.error("[intro] shader error:", p.getShaderInfoLog(F)), F;
          },
          T = p.createProgram();
        p.attachShader(T, S(p.VERTEX_SHADER, m)), p.attachShader(T, S(p.FRAGMENT_SHADER, v)), p.linkProgram(T), p.useProgram(T);
        const R = p.createBuffer();
        p.bindBuffer(p.ARRAY_BUFFER, R), p.bufferData(p.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), p.STATIC_DRAW);
        const E = p.getAttribLocation(T, "aPos");
        p.enableVertexAttribArray(E), p.vertexAttribPointer(E, 2, p.FLOAT, !1, 0, 0);
        const I = {
          res: p.getUniformLocation(T, "uRes"),
          time: p.getUniformLocation(T, "uTime"),
          mouse: p.getUniformLocation(T, "uMouse"),
          pixel: p.getUniformLocation(T, "uPixel"),
          lo: p.getUniformLocation(T, "uLo"),
          hi: p.getUniformLocation(T, "uHi"),
          scale: p.getUniformLocation(T, "uScale"),
          speed: p.getUniformLocation(T, "uSpeed"),
          halo: p.getUniformLocation(T, "uHalo"),
          irid: p.getUniformLocation(T, "uIrid"),
          color: p.getUniformLocation(T, "uColor"),
          dot: p.getUniformLocation(T, "uDot")
        };
        let j = 1;
        D.resize = () => {
          const k = c.clientWidth,
            q = c.clientHeight,
            F = pixelRatioFor(k, q, PIXEL_BUDGET.background);
          j = ti(k, q, PIXEL_BUDGET.background);
          const ee = Math.floor(k * F),
            K = Math.floor(q * F);
          (c.width !== ee || c.height !== K) && (c.width = ee, c.height = K, p.viewport(0, 0, ee, K)), p.uniform2f(I.res, c.width, c.height);
        }, D.draw = k => {
          p.isContextLost() || (p.uniform1f(I.pixel, Math.max(1, f.pixel * j)), p.uniform1f(I.lo, f.lo), p.uniform1f(I.hi, f.hi), p.uniform1f(I.scale, f.scale), p.uniform1f(I.speed, f.speed), p.uniform1f(I.halo, f.halo), p.uniform1f(I.irid, f.irid), p.uniform3fv(I.color, f.dark), p.uniform3fv(I.dot, f.light), p.uniform1f(I.time, (performance.now() - _) / 1e3), p.uniform2f(I.mouse, k.x, k.y), p.drawArrays(p.TRIANGLES, 0, 3));
        }, D.live = !0, D.resize();
      },
      G = p => {
        n.current.tx = p.clientX / window.innerWidth, n.current.ty = 1 - p.clientY / window.innerHeight;
      },
      g = () => D.resize();
    canHover() && window.addEventListener("pointermove", G), window.addEventListener("resize", g);
    const P = () => {
        if (b = requestAnimationFrame(P), !d.current) return;
        const p = n.current;
        p.x += (p.tx - p.x) * 0.08, p.y += (p.ty - p.y) * 0.08;
        const S = config.ditherStates,
          T = l.current || config.ditherState,
          R = S[T] || S.boot,
          E = 0.04;
        f.pixel = C(f.pixel, R.pixel, E), f.lo = C(f.lo, R.lo, E), f.hi = C(f.hi, R.hi, E), f.scale = C(f.scale, R.scale, E), f.speed = C(f.speed, R.speed, E), f.halo = C(f.halo, R.halo, E), f.irid = C(f.irid, R.irid ? 1 : 0, E);
        const I = Ie(R.dark),
          j = h.current ? Je(h.current) : Ie(R.light);
        for (let k = 0; k < 3; k++) f.dark[k] = C(f.dark[k], I[k], E), f.light[k] = C(f.light[k], j[k], E);
        D.live && D.draw(p);
      },
      M = p => {
        p.preventDefault(), D.live = !1;
      },
      u = () => {
        L();
      };
    return c.addEventListener("webglcontextlost", M), c.addEventListener("webglcontextrestored", u), L(), P(), () => {
      var p, S;
      cancelAnimationFrame(b), window.removeEventListener("pointermove", G), window.removeEventListener("resize", g), c.removeEventListener("webglcontextlost", M), c.removeEventListener("webglcontextrestored", u), (S = (p = c.getContext("webgl")) == null ? void 0 : p.getExtension("WEBGL_lose_context")) == null || S.loseContext();
    };
  }, []), <canvas ref={s} className={o} />;
}
function Hazard({
  visible: e
}) {
  return <motion.div className="intro-hazard" aria-hidden={!0} initial={!1} animate={{
    opacity: e ? 1 : 0
  }} transition={{
    duration: 0.5,
    ease: "easeInOut"
  }}><div className="intro-hazard__stripes" /><div className="intro-hazard__grunge" /></motion.div>;
}
function MarqueeTrack({
  on: e = !1
}) {
  const i = e ? "system: on" : "STUDIO MACACO",
    a = Array.from({
      length: 14
    }, () => i).join("   ");
  return <div className={`intro-marquee ${e ? "is-on" : ""}`} aria-hidden={!0}><div className="intro-marquee__track"><span>{a}{"   "}</span><span>{a}{"   "}</span></div></div>;
}
const LOGO_COMPLETE_SRC = "/general/macaco-logo-complete.svg",
  ze = {
    duration: 0.4
  };
function Title({
  visible: e = !0
}) {
  const {
      t: i
    } = useTranslation(),
    a = {
      opacity: e ? 1 : 0
    };
  return <div className="intro-title" aria-hidden={!0}><motion.div className="intro-title__logo" initial={!1} animate={a} transition={ze} style={{
      WebkitMaskImage: `url(${LOGO_COMPLETE_SRC})`,
      maskImage: `url(${LOGO_COMPLETE_SRC})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
      backdropFilter: "invert(1)",
      WebkitBackdropFilter: "invert(1)"
    }} /><motion.p className="intro-title__tagline" initial={!1} animate={a} transition={ze}>{i("intro.tagline")}</motion.p><motion.p className="intro-title__scroll" initial={!1} animate={a} transition={ze}>{i("intro.scroll")}</motion.p><motion.div className="intro-title__line" initial={!1} animate={a} transition={ze} /></div>;
}
const eo = we.wide[0] / we.wide[1],
  to = we.narrow[0] / we.narrow[1];
function zt() {
  if (typeof window > "u") return {
    tier: "base",
    orient: "landscape"
  };
  const e = window.innerWidth,
    i = window.innerHeight,
    a = Math.min(e, i),
    o = e / i,
    s = i > e ? "portrait" : "landscape";
  let n;
  return a < Ia ? n = "mobile" : o >= eo ? n = "ultrawide" : e >= Ra ? n = "xl" : a < za && o <= to ? n = "tablet" : n = "base", {
    tier: n,
    orient: s
  };
}
function dt() {
  const [e, i] = React.useState(zt);
  return React.useEffect(() => {
    const a = () => i(o => {
      const s = zt();
      return s.tier === o.tier && s.orient === o.orient ? o : s;
    });
    return a(), window.addEventListener("resize", a), window.addEventListener("orientationchange", a), () => {
      window.removeEventListener("resize", a), window.removeEventListener("orientationchange", a);
    };
  }, []), e;
}
const io = {
  ultrawide: ["ultrawide", "base"],
  xl: ["xl", "base"],
  base: ["base"],
  tablet: ["tablet", "base"],
  mobile: ["mobile", "tablet", "base"]
};
function ao(e, i = "landscape") {
  const a = [];
  for (const o of io[e] || ["base"]) o !== "base" && a.push(`${o}-${i}`), a.push(o);
  return a;
}
function Xe(e, i, a) {
  for (const o of ao(i, a)) if (o in e) return e[o];
}
const oo = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  },
  ro = {
    hidden: {
      opacity: 0,
      y: 6
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
function pt(e, i, a = 600, {
  decimals: o = 0,
  min: s = -1 / 0,
  max: n = 1 / 0
} = {}) {
  const [d, l] = React.useState(e);
  return React.useEffect(() => {
    const h = setInterval(() => {
      let c = e + (Math.random() * 2 - 1) * i;
      c = Math.max(s, Math.min(n, c)), l(o ? +c.toFixed(o) : Math.round(c));
    }, a);
    return () => clearInterval(h);
  }, [e, i, a, o, s, n]), d;
}
function no(e = 16, i = 120) {
  const [a, o] = React.useState(() => Array.from({
    length: e
  }, () => 30 + Math.random() * 60));
  return React.useEffect(() => {
    const s = setInterval(() => o(Array.from({
      length: e
    }, () => 18 + Math.random() * 80)), i);
    return () => clearInterval(s);
  }, [e, i]), a;
}
function so(e = 44, i = 70, a = "noise") {
  const [o, s] = React.useState(() => Array.from({
      length: e
    }, () => 16)),
    n = React.useRef(0);
  return React.useEffect(() => {
    const d = setInterval(() => {
      s(l => {
        const h = l.slice(1);
        let c;
        if (a === "heart") {
          const m = n.current % 16;
          c = m === 3 ? 3 : m === 4 ? 29 : m === 5 ? 8 : 16;
        } else c = 16 + (Math.random() * 2 - 1) * 11;
        return n.current++, h.push(c), h;
      });
    }, i);
    return () => clearInterval(d);
  }, [e, i, a]), o.map((d, l) => `${(l / (e - 1) * 160).toFixed(1)},${d.toFixed(1)}`).join(" ");
}
function HudPanel({
  style: e,
  children: i
}) {
  return <motion.div className="intro-hud__panel" style={e} variants={ro}>{i}</motion.div>;
}
function Qe({
  base: e,
  amp: i,
  period: a = 600,
  decimals: o = 0,
  suffix: s = "",
  min: n,
  max: d
}) {
  const l = pt(e, i, a, {
    decimals: o,
    min: n,
    max: d
  });
  return <>{(o ? l.toFixed(o) : l) + s}</>;
}
function Stat({
  label: e,
  value: i,
  flicker: a
}) {
  return <div className="hud-stat"><span className="hud-dim">{e}</span><span className="hud-arrow">{">>"}</span><span className={a || ""}>{i}</span></div>;
}
function Meter({
  label: e,
  base: i
}) {
  const a = pt(i, 1.6, 700, {
    min: 0,
    max: 100
  });
  return <div className="hud-meter"><span className="hud-dim">{e}</span><span className="hud-track"><motion.span className="hud-fill" initial={{
        width: 0
      }} animate={{
        width: `${a}%`
      }} transition={{
        duration: 0.4
      }} /></span><span>{a}{"%"}</span></div>;
}
function Bars() {
  const e = no();
  return <div className="hud-bars">{e.map((i, a) => <span style={{
      height: `${i}%`
    }} key={a} />)}</div>;
}
function Wave({
  mode: e
}) {
  const i = so(44, e === "heart" ? 90 : 70, e);
  return <svg className="hud-wave" viewBox="0 0 160 32" preserveAspectRatio="none"><polyline points={i} fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
}
function Radial({
  label: e,
  value: i
}) {
  const a = 2 * Math.PI * 26,
    o = pt(72, 6, 500, {
      min: 55,
      max: 92
    });
  return <div className="hud-radial"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="rgba(254,255,0,0.18)" strokeWidth="2" /><motion.circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform="rotate(-90 32 32)" animate={{
        strokeDasharray: `${a * o / 100} ${a}`
      }} transition={{
        duration: 0.4
      }} /></svg><div className="hud-radial__txt"><small className="hud-dim">{e}</small><strong className="hud-flicker hud-flicker--b">{i}</strong></div></div>;
}
function Title2() {
  return <><div className="hud-title">{"SYSTEM INITIALIZATION "}<span className="hud-arrow">{">>"}</span>{" "}<span className="hud-ok hud-flicker">{"COMPLETE"}</span></div><div className="hud-progress"><span /></div><div style={{
      marginTop: 14
    }}><Stat label="POWER CORE" value="ONLINE" flicker="hud-flicker" /><Stat label="NEURAL LINK" value="ESTABLISHED" /><Stat label="MOTORS" value="ACTIVE" /><Stat label="SENSORS" value="CALIBRATED" /><Stat label="ARMOR SYSTEMS" value="NOMINAL" /><Stat label="WEAPONS INTERFACE" value="STANDBY" flicker="hud-flicker hud-flicker--c" /></div></>;
}
function Dim() {
  return <><div className="hud-dim">{"SYS_STATUS"}</div><Wave mode="heart" /><div>{"NOMINAL"}</div></>;
}
function Dim2() {
  return <><div className="hud-dim">{"POWER OUTPUT"}</div><div className="hud-poweline"><Bars /><strong className="hud-big"><Qe base={97} amp={2} period={350} min={94} max={99} suffix="%" /></strong></div><div className="hud-dim" style={{
      marginTop: 4
    }}>{"STABLE // OK"}</div><div style={{
      marginTop: 12
    }}><span className="hud-dim">{"CORE TEMP. "}</span><strong className="hud-big"><Qe base={36.2} amp={0.25} period={800} decimals={1} suffix="°C" /></strong><div className="hud-dim">{"OPTIMAL"}</div></div></>;
}
function Big2() {
  return <><div className="hud-big2 hud-flicker hud-flicker--b">{"UNIT // M-01"}</div><div style={{
      fontFamily: "var(--font-jp)"
    }}>{"ハウウン"}</div><div className="hud-dim" style={{
      marginTop: 6
    }}>{"CLASS: CREATOR"}</div><div className="hud-dim">{"STATUS: "}<span className="hud-ok">{"ACTIVE"}</span></div></>;
}
function Dim3() {
  return <><div className="hud-dim">{"VISOR MODE"}</div><div className="hud-ok hud-flicker hud-flicker--c">{"ACTIVE"}</div></>;
}
function PanelBox() {
  return <div className="hud-panel-box"><div className="hud-dim">{"NEURAL SYNC"}</div><div className="hud-big"><Qe base={99} amp={1.4} period={450} min={97} max={100} suffix="%" /></div><Wave mode="noise" /><div style={{
      marginTop: 8
    }}><span className="hud-dim">{"SIGNAL QUALITY"}</span></div><div><span className="hud-arrow">{">>"}</span>{" "}<span className="hud-flicker hud-flicker--b">{"EXCELLENT"}</span></div></div>;
}
function bo() {
  return <Radial label="CORE" value="LIVE" />;
}
function PanelBox2() {
  return <div className="hud-panel-box"><div className="hud-dim" style={{
      marginBottom: 6
    }}>{"DIAGNOSTICS"}</div><Meter label="MOBILITY" base={98} /><Meter label="REACTORS" base={100} /><Meter label="SENSORS" base={97} /><Meter label="COMMS" base={100} /><Meter label="BALANCE" base={98} /></div>;
}
function Dim4() {
  return <div style={{
    display: "flex",
    alignItems: "center",
    gap: 10
  }}><span style={{
      fontFamily: "var(--font-jp)"
    }} className="hud-dim">{"ハウウン フラ"}</span><span className="hud-lock hud-flicker hud-flicker--c">{"LOCK"}</span></div>;
}
const Ao = [{
  id: "sysinit",
  Body: Title2,
  mobile: !1,
  base: {
    top: "10%",
    left: "10%",
    width: 350
  }
}, {
  id: "sysstatus",
  Body: Dim,
  base: {
    top: "50%",
    left: "20%",
    width: 150
  },
  mobile: {
    top: "10%",
    left: "10%"
  },
  "tablet-portrait": {
    top: "50%",
    left: "10%",
    width: 150
  }
}, {
  id: "power",
  Body: Dim2,
  base: {
    bottom: "6%",
    left: "10%",
    width: 220
  },
  mobile: {
    bottom: "10%",
    left: "10%"
  },
  "tablet-portrait": {
    bottom: "20%",
    left: "10%",
    width: 220
  }
}, {
  id: "unit",
  Body: Big2,
  base: {
    top: "34%",
    left: "60%"
  },
  mobile: {
    top: "45%",
    left: "60%"
  },
  "tablet-portrait": {
    top: "30%",
    left: "80%",
    width: 220
  }
}, {
  id: "visor",
  Body: Dim3,
  mobile: !1,
  base: {
    top: "60%",
    left: "31%"
  }
}, {
  id: "neural",
  Body: PanelBox,
  mobile: !1,
  base: {
    top: "14%",
    right: "20%",
    width: 240
  },
  "tablet-portrait": {
    top: "14%",
    right: "10%",
    width: 240
  }
}, {
  id: "thruster",
  Body: bo,
  mobile: !1,
  "tablet-portrait": !1,
  base: {
    top: "50%",
    right: "30%"
  }
}, {
  id: "diagnostics",
  Body: PanelBox2,
  mobile: !1,
  base: {
    bottom: "5%",
    right: "10%",
    width: 240
  },
  "tablet-portrait": {
    bottom: "20%",
    right: "10%",
    width: 220
  }
}, {
  id: "lock",
  Body: Dim4,
  mobile: !1,
  base: {
    bottom: "10%",
    left: "50%",
    transform: "translateX(-50%)"
  }
}];
function Hud({
  active: e
}) {
  const {
    tier: i,
    orient: a
  } = dt();
  return <AnimatePresence>{e && <motion.div className="intro-hud" aria-hidden={!0} variants={oo} initial="hidden" animate="show" exit={{
      opacity: 0,
      transition: {
        duration: 0.25
      }
    }}>{Ao.map(({
        id: o,
        Body: S,
        ...n
      }) => {
        const d = Xe(n, i, a);
        return d ? <HudPanel style={d} key={o}><S /></HudPanel> : null;
      })}</motion.div>}</AnimatePresence>;
}
function W({
  src: e,
  color: i = "#ffffff",
  size: a = "contain",
  className: o = "",
  style: s
}) {
  const n = `/intro/svg/${e}`;
  return <span className={o} aria-hidden={!0} style={{
    display: "block",
    backgroundColor: i,
    WebkitMaskImage: `url(${n})`,
    maskImage: `url(${n})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: a,
    maskSize: a,
    ...s
  }} />;
}
const Ze = "#FEFF00",
  $e = {
    hidden: {},
    show: {}
  },
  Co = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.14,
        ease: "linear"
      }
    },
    show: (e = 0) => ({
      opacity: [0, 1, 0, 1, 0.35, 1],
      x: [8, -7, 4, -2, 1, 0],
      transition: {
        duration: 0.34,
        ease: "linear",
        delay: 0.05 * e
      }
    })
  },
  So = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.14,
        ease: "linear"
      }
    },
    show: {
      opacity: 1,
      transition: {
        duration: 0.45,
        ease: "easeOut"
      }
    }
  };
function Outline({
  src: e,
  stroke: i = Ze,
  strokeWidth: a = 1.4,
  style: o
}) {
  const [s, n] = React.useState("");
  return React.useEffect(() => {
    let d = !0;
    return fetch(`/intro/svg/${e}`).then(l => l.text()).then(l => {
      d && n(l);
    }), () => {
      d = !1;
    };
  }, [e]), <span className="hero-outline" aria-hidden={!0} style={{
    "--hero-stroke": i,
    "--hero-sw": a,
    ...o
  }} dangerouslySetInnerHTML={{
    __html: s
  }} />;
}
function Glitch({
  className: e,
  i,
  children: a
}) {
  return <div className={e}><motion.div className="hero-glitch" variants={Co} custom={i}>{a}</motion.div></div>;
}
function Back({
  visible: e = !1
}) {
  const {
      t: i
    } = useTranslation(),
    a = e ? "show" : "hidden",
    o = {
      width: "100%",
      height: "100%"
    };
  return <><motion.div className="hero-back" aria-hidden={!0} variants={$e} initial="hidden" animate={a}><Glitch className="hero-studio" i={0}><W src="studio.svg" color="#FEFF00" style={o} /></Glitch><Glitch className="hero-macaco" i={1}><Outline src="macaco-logo.svg" stroke={Ze} strokeWidth={1.4} /></Glitch></motion.div><motion.div className="hero-underline" aria-hidden={!0} variants={$e} initial="hidden" animate={a}><Glitch className="hero-longstar" i={0}><W src="longstar.svg" color="#FEFF00" style={o} /></Glitch><Glitch className="hero-longlines" i={1}><W src="longlines.svg" color="#FEFF00" style={o} /></Glitch><Glitch className="hero-intricateline" i={2}><W src="intricateline.svg" color="#FEFF00" style={o} /></Glitch></motion.div><motion.div className="hero-front" aria-hidden={!0} variants={$e} initial="hidden" animate={a}><motion.div className="hero-scrim" variants={So} /><div className="hero-copy"><Glitch className="hero-headline" i={2}><p className="hero-headline__text">{i("intro.headline1")}<br />{i("intro.headline2")}</p></Glitch><Glitch className="hero-paragraph" i={4}><p>{i("intro.paragraph")}</p></Glitch></div><Glitch className="hero-side hero-side--l" i={5}>{"SYSTEMS ON // (_BOOT_COMPLETE)"}</Glitch><Glitch className="hero-side hero-side--r" i={5}>{"READY TO CREATE // (SOMETHING_AMAZING?)"}</Glitch><Glitch className="hero-doubleplus" i={6}><W src="doubleplus.svg" color={Ze} style={o} /></Glitch></motion.div></>;
}
const hi = {
  hidden: {
    opacity: 0
  },
  show: (e = 0) => ({
    opacity: [0, 1, 0, 1, 0.35, 1],
    x: [8, -7, 4, -2, 1, 0],
    transition: {
      duration: 0.34,
      ease: "linear",
      delay: 0.05 * e
    }
  }),
  exit: (e = 0) => ({
    opacity: [1, 0, 1, 0.3, 0, 0],
    x: [0, 4, -3, 1, 0, 0],
    transition: {
      duration: 0.26,
      ease: "linear",
      delay: 0.03 * e
    }
  })
};
function OvGlitch({
  className: e,
  i = 0,
  children: a,
  style: o
}) {
  return <div className={e} style={o}><motion.div className="ov-glitch" variants={hi} custom={i}>{a}</motion.div></div>;
}
function OvGlitch2({
  className: e,
  src: i,
  i: a = 0
}) {
  const o = `/intro/svg/${i}`;
  return <div className={e}><motion.div className="ov-glitch ov-neg" variants={hi} custom={a} style={{
      WebkitMaskImage: `url(${o})`,
      maskImage: `url(${o})`
    }} /></div>;
}
function Io(e) {
  const [i, a] = React.useState(!1);
  return React.useEffect(() => {
    let o;
    const s = () => {
      const n = config.overlays[e],
        d = $a(),
        l = d >= n.startMs && d < n.endMs;
      a(h => h === l ? h : l), o = requestAnimationFrame(s);
    };
    return o = requestAnimationFrame(s), () => cancelAnimationFrame(o);
  }, [e]), i;
}
function Fi2({
  layoutKey: e,
  className: i,
  children: a
}) {
  const o = Io(e);
  return <AnimatePresence>{o && <motion.div className={`ov-root ${i}`} aria-hidden={!0} variants={{
      hidden: {},
      show: {},
      exit: {}
    }} initial="hidden" animate="show" exit="exit">{a}</motion.div>}</AnimatePresence>;
}
function Ov1() {
  const {
    t: e
  } = useTranslation();
  return <Fi2 layoutKey="l1" className="ov1"><OvGlitch className="ov1-starsUL" i={0}><W src="starlines1upleft.svg" color="#fff" size="100% 100%" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch2 className="ov1-webuild" src={e("intro.svg.webuild")} i={1} /><OvGlitch2 className="ov1-power" src={e("intro.svg.power")} i={1} /><OvGlitch className="ov1-starsDR" i={2}><W src="starlines1downright.svg" color="#fff" size="100% 100%" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch className="ov1-atom" i={3}><W src="atompixel.svg" color="#fff" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch className="ov-side ov1-side" i={4}>{"SYSTEMS ON // (_GENERATING_CITY)"}</OvGlitch><OvGlitch className="ov-jp ov1-jp" i={4}>{"つなぐ"}</OvGlitch></Fi2>;
}
function Ov2() {
  const {
    t: e
  } = useTranslation();
  return <Fi2 layoutKey="l2" className="ov2"><OvGlitch className="ov2-starsUL" i={0}><W src="starlines2upleft.svg" color="#fff" size="100% 100%" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch2 className="ov2-wecreate" src={e("intro.svg.wecreate")} i={1} /><OvGlitch2 className="ov2-amazing" src={e("intro.svg.amazing")} i={1} /><OvGlitch className="ov2-starsDR" i={2}><W src="starlines2downright.svg" color="#fff" size="100% 100%" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch className="ov2-vortex" i={3}><W src="vortexpixel.svg" color="#fff" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch className="ov-side ov2-proc" i={4}>{"PROCEDURE START // (_FBX_PROCEDURAL)"}</OvGlitch><OvGlitch className="ov-side ov2-side" i={4}>{"SYSTEMS ON // (_GENERATING_CITY)"}</OvGlitch><OvGlitch className="ov-jp ov2-jp" i={4}>{"うまれる"}</OvGlitch></Fi2>;
}
function Mo() {
  return <><Ov1 /><Ov2 /></>;
}
const vi = {
    transition: {
      duration: 0.4
    }
  },
  ko = {
    base: [{
      top: "12%",
      left: "14%"
    }, {
      top: "18%",
      left: "82%"
    }, {
      top: "78%",
      left: "14%"
    }, {
      top: "82%",
      left: "82%"
    }]
  },
  Lo = {
    base: [{
      top: "20%",
      left: "66%"
    }, {
      top: "71%",
      left: "31%"
    }]
  };
function Crosshairs({
  visible: e = !0
}) {
  const {
      tier: i,
      orient: a
    } = dt(),
    o = Xe(ko, i, a) || [],
    s = Xe(Lo, i, a) || [];
  return <motion.div className="intro-crosshairs" aria-hidden={!0} animate={{
    opacity: e ? 1 : 0
  }} {...vi}>{o.map((n, d) => <W src="crosshair-big.svg" color="rgba(255,255,255,0.55)" className="intro-cross" style={{
      top: n.top,
      left: n.left,
      width: "calc(46 * var(--ipx))",
      height: "calc(86 * var(--ipx))"
    }} key={`b${d}`} />)}{s.map((n, d) => <W src="crosshair.svg" color="#FEFF00" className="intro-cross" style={{
      top: n.top,
      left: n.left,
      width: "calc(30 * var(--ipx))",
      height: "calc(30 * var(--ipx))"
    }} key={`s${d}`} />)}</motion.div>;
}
function MarginGlyphs({
  visible: e = !0
}) {
  const i = {
    height: "92vh",
    width: "calc(92vh * 0.204)"
  };
  return <motion.div className="intro-margin-glyphs" aria-hidden={!0} animate={{
    opacity: e ? 1 : 0
  }} {...vi}><W src="glyph.svg" color="#000000" className="intro-margin-glyphs__l" style={i} /><W src="glyph.svg" color="#000000" className="intro-margin-glyphs__r" style={{
      ...i,
      transform: "translateY(-50%) scaleX(-1)"
    }} /></motion.div>;
}
const Jo = React.lazy(() => import("./three/RobotScene.jsx")),
  Oo = React.lazy(() => import("./three/CityScene.jsx"));
function No({
  active: e
}) {
  const {
    accent: i
  } = useAccent();
  return <Ja active={e} accent={i} />;
}
const Bo = 30,
  Po = "macaco:intro-landed",
  Go = "macaco:yellow-nav",
  Rt = "macaco:scroll-hint",
  Fo = 1500,
  Vo = {
    powerOnMs: 2667,
    descentMs: 3833
  };
let Re = !1;
const Uo = 1.75,
  Mt = 0.55,
  kt = 13e5,
  Lt = e => {
    let i = Math.min(typeof window < "u" && window.devicePixelRatio || 1, Uo);
    if (isCoarsePointer() && typeof window < "u") {
      const a = window.innerWidth * window.innerHeight * i * i;
      a > kt && (i *= Math.sqrt(kt / a));
    }
    return +(i * (Mt + (1 - Mt) * e)).toFixed(2);
  };
function ScrollSpacer({
  active: e = !0
}) {
  const i = React.useRef(!1),
    [a, o] = React.useState("off"),
    [s, n] = React.useState(!1),
    d = React.useRef(Vo),
    l = React.useRef(null),
    h = React.useRef(null),
    c = React.useRef(null),
    m = React.useRef(null),
    v = React.useRef(!1),
    A = useMotionValue(0),
    [f, C] = React.useState(!0),
    [D, b] = React.useState(!0),
    [_, L] = React.useState(!0),
    [G, g] = React.useState(!0),
    P = React.useRef(1),
    [M, u] = React.useState(() => Lt(1)),
    p = React.useCallback(() => {
      const y = Lt(P.current);
      u(z => z === y ? z : y);
    }, []),
    S = React.useCallback(({
      factor: y
    }) => {
      P.current = Math.round(y * 5) / 5, p();
    }, [p]);
  React.useEffect(() => (window.addEventListener("resize", p), () => window.removeEventListener("resize", p)), [p]);
  const T = useIsCoarsePointer(),
    R = config.scroll.enabled,
    E = T ? config.scroll.vhTouch : config.scroll.vh;
  React.useEffect(() => {
    const y = window.matchMedia(pi),
      z = () => ui(y.matches);
    return z(), y.addEventListener("change", z), () => y.removeEventListener("change", z);
  }, []);
  const I = y => {
      let z = 1 / 0;
      for (const V of config.cameraShots) V.anim === y && (z = Math.min(z, V.at));
      return z;
    },
    j = () => {
      const y = getViewportHeight(),
        z = Math.max(y, getScrollRoot().scrollHeight - y),
        V = l.current ? l.current.offsetHeight : z,
        Ce = Math.max(1, V - y),
        re = I("descent"),
        ue = (isFinite(re) ? re : He()) + d.current.descentMs,
        Se = Math.max(He(), ue) + config.scroll.tailMs;
      return {
        landAnchor: Ce,
        totalMs: Se
      };
    },
    k = () => {
      i.current = !0;
    },
    q = React.useRef(e);
  React.useLayoutEffect(() => {
    e && !q.current && (i.current = !0), q.current = e;
  }, [e]), React.useEffect(() => {
    if (!e || !R || !("scrollRestoration" in window.history)) return;
    const y = window.history.scrollRestoration;
    return window.history.scrollRestoration = "manual", () => {
      window.history.scrollRestoration = y;
    };
  }, [e, R]), React.useLayoutEffect(() => {
    if (!e || !R || !i.current) return;
    const {
      landAnchor: y,
      totalMs: z
    } = j();
    o("on"), n(!0), config.scrollDriven = !0, config.scrollMs = z, config.ditherState = "landed", config.glitchActive = !1, config.heroExit = 0, config.exitCam = 0, h.current && (h.current.style.transform = "translate3d(0, 0, 0)", h.current.style.pointerEvents = ""), Aa({
      top: y,
      behavior: "auto"
    });
  }, [e, R]), React.useEffect(() => {
    if (!e) return;
    const y = getScrollRoot(),
      z = document.body.style.background,
      V = y.style.overflowY;
    return document.body.style.background = "#000", y.style.overflowY = "", () => {
      document.body.style.background = z, y.style.overflowY = V;
    };
  }, [R, e]), React.useEffect(() => {
    if (!e) return;
    const y = i.current,
      z = j();
    config.scrollDriven = !0, config.scrollMs = y ? z.totalMs : 0, y ? (o("on"), n(!0), config.ditherState = "landed", config.glitchActive = !1, config.heroExit = 0, config.exitCam = 0) : scrollToTop();
    let V,
      Ce = y ? z.totalMs : 0,
      re = z.landAnchor,
      ue = !1,
      Se = getScrollTop(),
      ht = performance.now();
    const ft = () => {
        const H = j();
        re = H.landAnchor;
        const Y = getScrollTop();
        Y !== Se && (Se = Y, ht = performance.now()), Ce = Math.min(1, Math.max(0, Y / re)) * H.totalMs;
      },
      vt = () => {
        {
          config.scrollMs += (Ce - config.scrollMs) * config.scroll.smooth;
          const O = config.scrollMs;
          i.current && (Re = !0);
          const me = Math.min(I("build"), 1e9) || 2700,
            Te = I("descent"),
            Ei = d.current.descentMs,
            Ii = Math.min(config.shake.atFrame / Bo * 1e3, Ei),
            Ee = (isFinite(Te) ? Te : He()) + Ii,
            Ct = O < 30 ? "off" : O < me ? "igniting" : "on";
          o(ce => ce === Ct ? ce : Ct), n(ce => {
            const ge = O >= Ee;
            return ge && k(), ce !== ge && window.dispatchEvent(new CustomEvent(Po, {
              detail: ge
            })), ce === ge ? ce : ge;
          }), config.ditherState = O < me ? "boot" : O < Ee ? "powered" : "landed", config.glitchActive = !Re && isFinite(Te) && O >= Te && O < Ee, !Re && O >= Ee && (Re = !0, Ha());
        }
        const H = getViewportHeight(),
          Y = Math.max(0, getScrollTop() - re);
        (!c.current || !c.current.isConnected) && (c.current = document.querySelector(".craft"));
        const Fe = c.current;
        let te;
        if (Fe) {
          const O = getOffsetBottom(Fe),
            me = Math.max(H, O - re - H);
          Y <= H ? te = Y / H : Y <= me ? te = 1 : te = Math.max(0, 1 - (Y - me) / H);
        } else te = Math.min(1, Y / H);
        A.set(te), h.current && (h.current.style.pointerEvents = te >= 1 ? "none" : "", h.current.style.opacity = Y <= H ? "1" : "0"), config.exitCam = Math.min(1, Y / Math.max(1, H * config.scroll.exitCamVh));
        const bt = Ya() <= 0.001;
        g(O => O === bt ? O : bt);
        const yt = Y <= H * 1.15;
        C(O => O === yt ? O : yt);
        const wt = te < 0.999;
        b(O => O === wt ? O : wt);
        const At = te > 5e-4;
        L(O => O === At ? O : At);
        const Ve = te > 0.5;
        v.current !== Ve && (v.current = Ve, window.dispatchEvent(new CustomEvent(Go, {
          detail: Ve
        }))), (!m.current || !m.current.isConnected) && (m.current = document.querySelector(".mcf"));
        const xt = m.current,
          Ti = xt ? getOffsetTop(xt) - si / 100 * H : 1 / 0,
          Ue = getScrollTop() < Ti && (config.scrollMs < 30 || performance.now() - ht >= Fo);
        ue !== Ue && (ue = Ue, window.dispatchEvent(new CustomEvent(Rt, {
          detail: Ue
        }))), V = requestAnimationFrame(vt);
      };
    ft();
    const Si = lt(ft);
    return V = requestAnimationFrame(vt), () => {
      Si(), cancelAnimationFrame(V), ue && window.dispatchEvent(new CustomEvent(Rt, {
        detail: !1
      })), config.scrollDriven = !1, config.heroExit = 0, config.exitCam = 0, C(!0), b(!0), g(!0);
    };
  }, [R, e]), ni(() => l.current, {
    enabled: e && R,
    getParams: () => ({
      maxPxPerSec: config.scroll.touchMaxPxPerSec,
      friction: config.scroll.touchFriction
    })
  });
  const {
      tier: F,
      orient: ee
    } = dt(),
    K = a === "off",
    x = K;
  return <>{e && <div ref={l} className="intro-scroll-spacer" style={{
      height: `${E * 100}svh`
    }} />}<div className={`intro-root${e ? "" : " intro-hidden"}`} data-tier={F} data-orient={ee}><No active={e && D} /><div className="intro-hero-layers" ref={h}><React.Suspense fallback={null}><Oo phase={a} active={e && f} dpr={M} /></React.Suspense><Hazard visible={K} /><Hud active={a === "igniting"} /><React.Suspense fallback={null}><Jo phase={a} active={e && f} dpr={M} onPerf={S} onDurations={y => {
            d.current = y;
          }} onLanding={() => {
            n(!0), k(), config.ditherState = "landed";
          }} /></React.Suspense><Back visible={s && G} /><Mo /><Crosshairs visible={x} /><MarginGlyphs visible={x} /><motion.div className="intro-marquee-band" animate={{
          opacity: K ? 1 : 0
        }} transition={{
          duration: 0.4
        }} style={{
          pointerEvents: "none"
        }}><MarqueeTrack on={!1} /></motion.div><Title visible={K} /></div>{e && _ && <DitherFill fill={A} className="intro-home-cover" />}{!1}</div></>;
}
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
`,
  Ho = `
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
  const d = React.useRef(i ? Je(i) : Ye(ie.light));
  d.current = i ? Je(i) : Ye(ie.light);
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
          (c.width !== I || c.height !== j) && (c.width = I, c.height = j, g.viewport(0, 0, I, j)), g.uniform2f(S.uRes, c.width, c.height), g.uniform1f(S.uPixel, Math.max(1, ie.pixel * ti(T, R, PIXEL_BUDGET.background)));
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
function ScrollProgressBar({
  enabled: e = !0
}) {
  const [i, a] = React.useState(0);
  return React.useEffect(() => {
    if (!e) {
      a(0);
      return;
    }
    let o = 0,
      s = 0,
      n = 0;
    const d = () => {
        const m = Math.max(1, getMaxScroll());
        n = Math.min(1, Math.max(0, getScrollTop() / m));
      },
      l = () => {
        s += (n - s) * 0.16, Math.abs(n - s) < 4e-4 ? (s = n, o = 0) : o = window.requestAnimationFrame(l), a(s);
      },
      h = () => {
        d(), o || (o = window.requestAnimationFrame(l));
      };
    d(), s = n, a(s);
    const c = lt(h);
    return () => {
      c(), o && window.cancelAnimationFrame(o);
    };
  }, [e]), <div className={`scroll-progress${e ? " is-visible" : ""}`} aria-hidden={!0}><div className="scroll-progress__bar" style={{
      transform: `scaleX(${i})`
    }} /></div>;
}
const Me = "/loading";
function StripSegment() {
  return <div className="ldg-strip__segment" aria-hidden="true"><img className="ldg-strip__icon ldg-strip__star" src={`${Me}/singlestar-black.svg`} alt="" width="28" height="29" /><span className="ldg-strip__text">{"ready_for_"}{"{"}{"awesomeness"}{"}"}</span><span className="ldg-strip__jp">{"つくる"}</span><img className="ldg-strip__icon ldg-strip__arrow" src={`${Me}/double-arrow.svg`} alt="" width="83" height="44" /><img className="ldg-strip__line" src={`${Me}/singleline-black.svg`} alt="" width="440" height="29" /><span className="ldg-strip__jp">{"かえる"}</span><img className="ldg-strip__hazard" src={`${Me}/hazard-stripe-outline.svg`} alt="" width="726" height="29" /></div>;
}
function Strip() {
  return <div className="ldg-strip" aria-hidden="true"><div className="ldg-strip__track"><StripSegment /><StripSegment /></div></div>;
}
function Xo(e, {
  speed: i = 45,
  start: a = !0
} = {}) {
  const [o, s] = React.useState(0),
    n = React.useRef(0);
  return React.useEffect(() => {
    if (s(0), !a || !e) return;
    let d = 0;
    const l = () => {
      d += 1, s(d), d < e.length && (n.current = window.setTimeout(l, i));
    };
    return n.current = window.setTimeout(l, i), () => window.clearTimeout(n.current);
  }, [e, i, a]), {
    typed: e ? e.slice(0, o) : "",
    done: o >= ((e == null ? void 0 : e.length) ?? 0)
  };
}
const Qo = "/loading/robot-icon.svg",
  Zo = `WE TURN ORDINARY
INTO EXTRORDINARY`;
function Er2({
  value: e
}) {
  const [i, a] = React.useState(() => Math.round(e.get()));
  return useMotionValueEvent(e, "change", o => a(Math.round(o))), <>{i}</>;
}
function OverlaySolid({
  mode: e,
  fill: i,
  content: a,
  backing: o,
  percent: s,
  label: n,
  typing: d,
  passthrough: l,
  onDitherReady: h
}) {
  const c = e === "type1",
    m = e === "type2",
    v = e === "wipe",
    {
      typed: A
    } = Xo(c ? Zo : `${n} {loading}`, {
      start: (c || m) && d
    });
  return React.useEffect(() => {
    if (v) return;
    const f = document.body.style.overflow;
    return document.body.style.overflow = "hidden", () => {
      document.body.style.overflow = f;
    };
  }, [v]), <div className={`ldg-overlay ldg-overlay--${e}${l ? " ldg-overlay--pass" : ""}`} role={v ? "presentation" : "status"} aria-live={v ? void 0 : "polite"} aria-label={v ? void 0 : "Loading"}><motion.div className="ldg-overlay__solid" style={{
      opacity: o
    }} aria-hidden="true" /><DitherFill fill={i} className="ldg-overlay__dither" onReady={h} />{v ? null : <motion.div className="ldg-overlay__content" style={{
      opacity: a
    }}>{c && <div className="ldg-top">{"PREPARING SYSTEM // "}{"{"}<Er2 value={s} />{"%"}{"}"}</div>}<div className="ldg-center"><img className="ldg-robot" src={Qo} alt="" aria-hidden="true" width="242" height="269" />{c ? <div className="ldg-headline">{A}<span className="ldg-caret" aria-hidden="true" /></div> : <div className="ldg-pagename">{A}<span className="ldg-caret" aria-hidden="true" /></div>}</div><Strip /></motion.div>}</div>;
}
const _t = "macaco:loading-seen",
  ke = "macaco:robot-ready",
  jt = {
    type1: 2200,
    type2: 1300
  },
  Ot = {
    duration: 0.42,
    ease: "easeIn"
  },
  Nt = {
    duration: 0.7,
    ease: "easeOut"
  },
  Bt = {
    duration: 0.3,
    ease: "easeOut"
  },
  ir = {
    duration: 0.25,
    ease: "easeIn"
  },
  ar = 0.82,
  or = 6e3,
  Pt = e => new Promise(i => setTimeout(i, e)),
  rr = () => new Promise(e => requestAnimationFrame(() => requestAnimationFrame(e))),
  nr = (e = 6) => new Promise(i => {
    let a = 0;
    const o = () => {
      a += 1, a >= e ? i() : requestAnimationFrame(o);
    };
    requestAnimationFrame(o);
  }),
  sr = e => Math.max(0, Math.min(1, e)),
  lr = 250,
  ve = e => e.replace(/\/+$/, "").replace(/^\/[^/]+/, "") || "/",
  Gt = e => /^\/projects\/[^/]+$/.test(e),
  cr = e => (typeof e == "string" ? e : String(e)).split("#")[0].split("?")[0];
function dr(e) {
  return e.startsWith("/projects") ? "nav.projects" : e.startsWith("/laboratory") ? "nav.laboratory" : e.startsWith("/contact") ? "nav.contact" : "nav.home";
}
const PageTransitionContext = React.createContext(null),
  pr = () => React.useContext(PageTransitionContext),
  usePageTransition = () => React.useContext(PageTransitionContext);
function Ur2({
  children: e
}) {
  var K;
  const i = useLocation(),
    a = useNavigationType(),
    o = useNavigate(),
    {
      t: s
    } = useTranslation(),
    n = useMotionValue(1),
    d = useMotionValue(1),
    l = useMotionValue(1),
    h = useMotionValue(0),
    c = React.useRef(null);
  if (c.current === null) {
    const x = ve(i.pathname),
      y = typeof window < "u" && !((K = window.sessionStorage) != null && K.getItem(_t));
    c.current = {
      kind: y ? "type1" : "type2",
      rel: x
    };
  }
  const [m, v] = React.useState(c.current),
    [A, f] = React.useState(c.current.kind === "type1"),
    [C, D] = React.useState(!1),
    [b, _] = React.useState(!0),
    L = React.useRef(!0),
    G = React.useRef(!1),
    g = React.useRef(!0),
    P = React.useRef(i.pathname),
    M = React.useRef(null),
    u = x => {
      L.current = x, _(x);
    },
    p = React.useCallback(() => {
      const x = M.current;
      x && !x.done && (x.done = !0, x.resolve());
    }, []),
    S = () => {
      let x;
      const y = new Promise(z => {
        x = z;
      });
      return M.current = {
        resolve: x,
        done: !1
      }, y;
    };
  React.useEffect(() => {
    typeof window < "u" && window.__macacoRobotReady && (G.current = !0);
    const x = () => {
      G.current = !0;
    };
    return window.addEventListener(ke, x), () => window.removeEventListener(ke, x);
  }, []);
  const T = React.useCallback(() => G.current || typeof window < "u" && window.__macacoRobotReady ? Promise.resolve() : new Promise(x => {
      const y = () => {
          clearTimeout(z), window.removeEventListener(ke, y), x();
        },
        z = setTimeout(y, or);
      window.addEventListener(ke, y);
    }), []),
    R = React.useCallback(x => {
      var y;
      return Promise.all([nr(), ((y = document.fonts) == null ? void 0 : y.ready) ?? Promise.resolve(), x ? T() : Promise.resolve()]);
    }, [T]),
    E = React.useCallback(async (x, y) => {
      f(!0);
      let z;
      x === "type1" && (z = animate(h, 90, {
        duration: 2,
        ease: "easeOut"
      })), await Promise.all([Pt(jt[x] ?? jt.type2), R(y)]), x === "type1" && (z == null || z.stop(), await animate(h, 100, {
        duration: 0.3,
        ease: "easeOut"
      })), l.set(0), animate(d, 0, ir), await animate(n, 0, Nt), v(null), f(!1), u(!1);
    }, [l, d, n, h, R]);
  React.useEffect(() => {
    var x;
    (x = window.sessionStorage) == null || x.setItem(_t, "1"), E(c.current.kind, c.current.rel === "/");
  }, []);
  const I = React.useCallback(x => {
      const y = cr(x),
        z = ve(y);
      if (L.current || z === ve(i.pathname)) {
        o(x);
        return;
      }
      u(!0), n.set(0), l.set(0), d.set(0), h.set(0), f(!1);
      const V = S();
      v({
        kind: "type2",
        rel: z
      }), (async () => (await Promise.race([V, Pt(lr)]), await animate(n, 1, Ot), l.set(1), o(x), scrollToTop(), animate(d, 1, Bt), await E("type2", z === "/")))();
    }, [o, i.pathname, n, l, d, h, E]),
    j = React.useCallback(x => {
      if (L.current) return;
      const y = sr(x) * ar;
      n.set(y), y > 0.001 && D(!0);
    }, [n]),
    k = React.useCallback(x => {
      L.current || (u(!0), D(!0), animate(n, 1, Ot).then(() => {
        x(), scrollToTop(), requestAnimationFrame(() => requestAnimationFrame(() => {
          animate(n, 0, Nt).then(() => u(!1));
        }));
      }));
    }, [n]),
    q = React.useCallback(() => {
      L.current || animate(n, 0, {
        duration: 0.25,
        ease: "easeOut"
      });
    }, [n]);
  React.useEffect(() => {
    let x = 0;
    const y = n.on("change", z => {
      if (z > 0.001) {
        clearTimeout(x);
        return;
      }
      clearTimeout(x), x = setTimeout(() => {
        !L.current && !m && D(!1);
      }, 300);
    });
    return () => {
      clearTimeout(x), y();
    };
  }, [n, m]), React.useEffect(() => {
    if (g.current) {
      g.current = !1, P.current = i.pathname;
      return;
    }
    const x = P.current,
      y = i.pathname;
    if (P.current = y, x === y || a !== "POP" || L.current) return;
    const z = ve(x),
      V = ve(y);
    Gt(z) && Gt(V) || (u(!0), n.set(1), l.set(1), d.set(0), f(!1), v({
      kind: "type2",
      rel: V
    }), (async () => (await rr(), animate(d, 1, Bt), await E("type2", V === "/")))());
  }, [i.pathname]);
  const F = React.useMemo(() => ({
      busy: b,
      isBusy: () => L.current,
      navigate: I,
      preview: j,
      run: k,
      cancel: q
    }), [b, I, j, k, q]),
    ee = (m == null ? void 0 : m.kind) ?? (C ? "wipe" : null);
  return <PageTransitionContext.Provider value={F}>{e}{ee && <OverlaySolid mode={ee} label={m ? s(dr(m.rel)) : ""} fill={n} content={d} backing={l} percent={h} typing={A} passthrough={ee === "wipe" && !b} onDitherReady={p} />}</PageTransitionContext.Provider>;
}
function mr(e) {
  return e === "localhost" || e === "127.0.0.1" || e === "[::1]" || e === "::1" || e === "" || e.endsWith(".local") || /^192\.168\./.test(e) || /^10\./.test(e) || /^172\.(1[6-9]|2\d|3[01])\./.test(e);
}
function bi() {
  return typeof window > "u" ? !1 : !mr(window.location.hostname);
}
const gr = "e62ec4a4aa4555220b6f453c0fee882d",
  hr = "https://tracker.metricool.com/resources/be.js";
let Ft = !1;
function fr() {
  if (Ft || typeof window > "u" || !bi()) return;
  Ft = !0;
  const e = document.createElement("script");
  e.async = !0, e.src = hr, e.onload = () => {
    window.beTracker && window.beTracker.t({
      hash: gr
    });
  }, document.head.appendChild(e);
}
const yi = "G-DMV02V7X2W",
  vr = `https://www.googletagmanager.com/gtag/js?id=${yi}`;
let et = !1;
function ye() {
  window.dataLayer = window.dataLayer || [], window.dataLayer.push(arguments);
}
function Vt() {
  if (et || typeof window > "u" || !bi()) return;
  et = !0, ye("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  }), ye("consent", "update", {
    analytics_storage: "granted"
  });
  const e = document.createElement("script");
  e.async = !0, e.src = vr, document.head.appendChild(e), ye("js", new Date()), ye("config", yi, {
    send_page_view: !1
  }), wi(window.location.pathname + window.location.search), fr();
}
function wi(e) {
  et && ye("event", "page_view", {
    page_path: e,
    page_location: window.location.href,
    page_title: document.title
  });
}
typeof window < "u" && (window.macacoStartAnalytics = Vt, window.macacoAnalyticsConsent && Vt());
const Ut = "macaco:scroll-hint";
function Cursor() {
  const e = React.useRef(null),
    i = React.useRef(null),
    a = React.useRef(null),
    o = React.useRef({
      x: -100,
      y: -100
    }),
    s = React.useRef({
      x: -100,
      y: -100
    }),
    n = React.useRef(!1);
  return React.useEffect(() => {
    const d = l => {
      var h;
      return (h = a.current) == null ? void 0 : h.classList.toggle("is-on", !!l.detail);
    };
    return window.addEventListener(Ut, d), () => window.removeEventListener(Ut, d);
  }, []), React.useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const d = c => {
      var A;
      o.current = {
        x: c.clientX,
        y: c.clientY
      };
      const m = c.target,
        v = (A = m.closest) == null ? void 0 : A.call(m, "a, button, [data-cursor], input, textarea, select");
      n.current = !!v;
    };
    window.addEventListener("pointermove", d, {
      passive: !0
    });
    let l;
    const h = () => {
      s.current.x += (o.current.x - s.current.x) * 0.18, s.current.y += (o.current.y - s.current.y) * 0.18;
      const c = e.current,
        m = i.current,
        v = a.current;
      if (c && (c.style.transform = `translate(${o.current.x}px, ${o.current.y}px) translate(-50%, -50%)`), v && (v.style.transform = `translate(${o.current.x}px, ${o.current.y}px) translate(-50%, -100%) translateY(-31px)`), m) {
        const A = n.current ? 1.9 : 1;
        m.style.transform = `translate(${s.current.x}px, ${s.current.y}px) translate(-50%, -50%) scale(${A}) rotate(45deg)`, m.style.borderColor = n.current ? "var(--mc-cyan)" : "var(--mc-yellow)";
      }
      l = requestAnimationFrame(h);
    };
    return l = requestAnimationFrame(h), () => {
      window.removeEventListener("pointermove", d), cancelAnimationFrame(l);
    };
  }, []), <><div ref={e} className="mc-cursor mc-cursor--dot" aria-hidden={!0} /><div ref={i} className="mc-cursor mc-cursor--ring" aria-hidden={!0} /><div ref={a} className="mc-cursor-hint" aria-hidden={!0}>{"scroll"}</div></>;
}
const xe = "https://studiomacaco.ch",
  Ae = "Studio MACACO",
  yr = !0,
  Ai = {
    it: "it-CH",
    en: "en"
  },
  wr = "/general/og-default.jpg",
  Ar = 1200,
  xr = 630;
function Cr(e) {
  return `/og/${e}.jpg`;
}
const SOCIAL_LINKS = [{
    key: "linkedin",
    label: "Linkedin",
    href: "https://www.linkedin.com/company/28663057"
  }, {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/studiomacaco_ch/"
  }, {
    key: "youtube",
    label: "Youtube",
    href: "https://www.youtube.com/@studio_macaco"
  }],
  SITE = {
    legalName: "Ludens Sagl",
    name: Ae,
    email: "info@studiomacaco.ch",
    telephone: "+41912614984",
    vatID: "CHE-397.368.770",
    logo: "/general/macaco-logo-complete.svg",
    foundingDate: "2022",
    areaServed: "Worldwide",
    description: {
      it: "Studio MACACO è uno studio creativo svizzero che progetta e realizza esperienze interattive per brand, istituzioni culturali e destinazioni. Uniamo direzione creativa, design, storytelling e tecnologia per trasformare identità, storie e contenuti in giochi, installazioni e mondi digitali da esplorare.",
      en: "Studio MACACO is a Swiss creative studio designing and producing interactive experiences for brands, cultural institutions and destinations. We combine creative direction, design, storytelling and technology to turn identities, stories and content into games, installations and digital worlds to explore."
    },
    address: {
      street: "Via Pestariso 5",
      postalCode: "6982",
      locality: "Agno",
      region: "Ticino",
      country: "CH"
    },
    sameAs: SOCIAL_LINKS.map(e => e.href)
  },
  Sr = "summary_large_image";
function B(e = "/") {
  return /^https?:\/\//i.test(e) ? e : `${xe}${e.startsWith("/") ? e : `/${e}`}`;
}
const AppLink = React.forwardRef(function ({
    to: i,
    onClick: a,
    target: o,
    className: s,
    style: n,
    isActive: d,
    children: l,
    ...h
  }, c) {
    const m = pr(),
      v = useHref(i),
      A = C => {
        a == null || a(C), !C.defaultPrevented && (C.button !== 0 || C.metaKey || C.ctrlKey || C.shiftKey || C.altKey || o && o !== "_self" || (C.preventDefault(), m != null && m.navigate ? m.navigate(v) : window.location.assign(v)));
      },
      f = C => typeof C == "function" ? C({
        isActive: !!d
      }) : C;
    return <a ref={c} href={v} target={o} onClick={A} className={f(s)} style={f(n)} {...h}>{l}</a>;
  }),
  LOGO_YELLOW_SRC = "/general/macaco-logo-yellow.svg",
  qt = [{
    to: "",
    key: "nav.home"
  }, {
    to: "/projects",
    key: "nav.projects"
  }, {
    to: "/laboratory",
    key: "nav.laboratory"
  }, {
    to: "/contact",
    key: "nav.contact"
  }],
  Er = SOCIAL_LINKS,
  Wt = "info@studiomacaco.ch",
  Ht = "+41 091 261 49 84",
  Ir = 8,
  $t = "macaco:yellow-nav";
function NavBar({
  isHome: e = !1
}) {
  const {
      lang: i
    } = useParams(),
    {
      pathname: a
    } = useLocation(),
    {
      t: o
    } = useTranslation(),
    [s, n] = React.useState(!1),
    [d, l] = React.useState(!1),
    [h, c] = React.useState(!1),
    m = a.replace(/^\/[^/]+/, ""),
    v = a.replace(/\/+$/, "") || `/${i}`,
    A = b => b === "" ? v === `/${i}` : v.startsWith(`/${i}${b}`),
    f = LANGUAGES.find(b => b !== i) || i;
  React.useEffect(() => {
    let b = 0;
    const _ = () => {
        b = 0, n(getScrollTop() > Ir);
      },
      L = () => {
        b || (b = window.requestAnimationFrame(_));
      };
    _();
    const G = lt(L, {
      resize: !1
    });
    return () => {
      G(), b && window.cancelAnimationFrame(b);
    };
  }, []), React.useEffect(() => {
    if (!e) {
      c(!1);
      return;
    }
    const b = _ => c(!!_.detail);
    return window.addEventListener($t, b), () => window.removeEventListener($t, b);
  }, [e]), React.useEffect(() => l(!1), [a]), React.useEffect(() => {
    if (!d) return;
    const b = document.body.style.overflow;
    return document.body.style.overflow = "hidden", () => {
      document.body.style.overflow = b;
    };
  }, [d]);
  const C = () => l(!1),
    D = b => <AppLink to={`/${f}${m}`} onClick={C} className={`mc-nav__lang mc-nav__lang--${b}`} aria-label={`Switch language to ${f.toUpperCase()}`}>{i.toUpperCase()}</AppLink>;
  return <nav className={`mc-nav${s ? " mc-nav--scrolled" : ""}${h || d ? " mc-nav--on-yellow" : ""}${d ? " mc-nav--menu-open" : ""}`} aria-label="Primary"><div className="mc-nav__bar"><AppLink to={`/${i}`} onClick={C} className="mc-nav__logo" aria-label="Studio MACACO — home"><img src={LOGO_YELLOW_SRC} alt="Studio MACACO" width="393" height="44" /></AppLink><div className="mc-nav__links">{qt.map((b, _) => <AppLink to={`/${i}${b.to}`} isActive={A(b.to)} className={({
          isActive: L
        }) => `mc-nav__link${L ? " is-active" : ""}`} key={b.to}><span className="mc-nav__num">{String(_ + 1).padStart(2, "0")}</span><span className="mc-nav__label">{o(b.key)}</span><span className="mc-nav__ul" /></AppLink>)}</div><div className="mc-nav__actions">{D("bar")}<button type="button" className={`mc-nav__toggle${d ? " is-open" : ""}`} aria-label={d ? "Close menu" : "Open menu"} aria-expanded={d} aria-controls="mc-nav-panel" onClick={() => l(b => !b)}><span /><span /><span /></button></div></div><div className={`mc-nav__overlay${d ? " is-open" : ""}`} id="mc-nav-panel"><div className="mc-nav__overlay-inner"><section className="mc-nav__group" style={{
          "--i": 0
        }}><h2 className="mc-nav__group-label">{o("nav.menu", "Menu")}<span className="mc-nav__rule" aria-hidden="true" /></h2><div className="mc-nav__overlay-links">{qt.map((b, _) => <AppLink to={`/${i}${b.to}`} isActive={A(b.to)} onClick={C} className={({
              isActive: L
            }) => `mc-nav__overlay-link${L ? " is-active" : ""}`} style={{
              "--i": _
            }} key={b.to}><span className="mc-nav__overlay-idx">{String(_ + 1).padStart(2, "0")}</span><span className="mc-nav__overlay-label">{o(b.key)}</span></AppLink>)}</div></section><section className="mc-nav__group" style={{
          "--i": 4
        }}><h2 className="mc-nav__group-label">{o("footer.social", "Social")}<span className="mc-nav__rule" aria-hidden="true" /></h2><div className="mc-nav__group-row">{Er.map(b => <a className="mc-nav__meta-link" href={b.href} target="_blank" rel="noreferrer" onClick={C} key={b.key}>{b.label}</a>)}</div></section><section className="mc-nav__group" style={{
          "--i": 5
        }}><h2 className="mc-nav__group-label">{o("footer.contacts", "Contacts")}<span className="mc-nav__rule" aria-hidden="true" /></h2><div className="mc-nav__group-row mc-nav__group-row--stack"><span><b>{"E."}</b>{" "}<a className="mc-nav__meta-link" href={`mailto:${Wt}`} onClick={C}>{Wt}</a></span><span><b>{"P."}</b>{" "}<a className="mc-nav__meta-link" href={`tel:${Ht.replace(/s/g, "")}`} onClick={C}>{Ht}</a></span></div></section></div></div></nav>;
}
const ne = caseHistories,
  en = ["berco-supersize", "kebhouze-the-game", "digitart-3d-giulia-caffo", "aquatar", "become-this-way", "playstorming"],
  tn = e => e === "it" ? "it" : "en";
function an(e) {
  return (Array.isArray(e) ? e : [e]).map(a => typeof a == "string" ? a.trim() : "").filter(Boolean);
}
function je(e, i) {
  return Array.isArray(e) ? e.map(a => je(a, i)) : !e || typeof e != "object" ? e : "en" in e || "it" in e ? e[i] ?? e.en ?? e.it : Object.fromEntries(Object.entries(e).map(([a, o]) => [a, je(o, i)]));
}
function Pe(e, i) {
  const a = tn(i),
    {
      copy: o,
      ...s
    } = e;
  return {
    ...s,
    projectTypes: an(s.projectTypes ?? s.projectType),
    ...je(o, a),
    sections: je(s.sections, a)
  };
}
function $n(e) {
  return ne.map(i => Pe(i, e));
}
function Yn(e) {
  const i = en.map(o => ne.find(s => s.slug === o)).filter(Boolean);
  return (i.length ? i : ne).map(o => Pe(o, e));
}
function on(e, i) {
  const a = ne.find(o => o.slug === e);
  return a ? Pe(a, i) : null;
}
function Kn(e, i) {
  const a = ne.findIndex(s => s.slug === e);
  if (a === -1) return null;
  const o = ne[(a + 1) % ne.length];
  return Pe(o, i);
}
const Yt = {
  it: {
    defaultImageAlt: "Robot e logo Studio MACACO su sfondo nero e giallo",
    home: {
      title: "Studio MACACO | Studio creativo ed esperienze interattive",
      description: "Studio creativo svizzero per brand, cultura e destinazioni. Direzione creativa, storytelling e tecnologia per giochi, installazioni ed esperienze interattive.",
      heading: "Studio MACACO — studio creativo per esperienze interattive"
    },
    projects: {
      title: "Progetti ed esperienze interattive | Studio MACACO",
      description: "Esperienze di brand, installazioni culturali, giochi e mondi digitali: scopri i progetti di Studio MACACO tra direzione creativa, storytelling e tecnologia.",
      bodyText: "Esperienze di brand, installazioni culturali, giochi e avventure sul territorio. Idee che prendono forma attraverso direzione creativa, storytelling e tecnologia.",
      heading: "Progetti"
    },
    laboratory: {
      title: "Laboratorio: prototipi tra fisico e digitale | Studio MACACO",
      description: "Stampa 3D, taglio laser ed elettronica su misura: nel nostro laboratorio prototipiamo installazioni interattive dove il fisico incontra il digitale.",
      heading: "Laboratorio"
    },
    contact: {
      title: "Contatti | Studio MACACO",
      description: "Hai un’esperienza da immaginare? Contatta Studio MACACO, studio creativo svizzero per brand, istituzioni culturali e destinazioni, dal concept alla produzione.",
      bodyText: "Parlaci del tuo progetto. Studio MACACO — Ludens Sagl, Via Pestariso 5, 6982 Agno (Ticino, Svizzera).",
      heading: "Contatti"
    },
    notFound: {
      title: "Pagina non trovata — Studio MACACO",
      description: "La pagina richiesta non esiste o è stata spostata.",
      heading: "Pagina non trovata"
    },
    projectSuffix: "Case History",
    nav: {
      home: "Home",
      projects: "Progetti",
      laboratory: "Laboratorio",
      contact: "Contatti"
    },
    projectsListLabel: "Tutte le case history"
  },
  en: {
    defaultImageAlt: "Robot and Studio MACACO logo against a black and yellow background",
    home: {
      title: "Studio MACACO | Creative Studio & Interactive Experiences",
      description: "Swiss creative studio for brands, culture and destinations. Creative direction, storytelling and technology for games, installations and interactive experiences.",
      heading: "Studio MACACO — Creative Studio for Interactive Experiences"
    },
    projects: {
      title: "Projects & Interactive Experiences | Studio MACACO",
      description: "Explore brand experiences, cultural installations, games and digital worlds by Studio MACACO, combining creative direction, storytelling and technology.",
      bodyText: "Brand experiences, cultural installations, games and adventures through real places. Ideas brought to life through creative direction, storytelling and technology.",
      heading: "Projects"
    },
    laboratory: {
      title: "Laboratory: physical and digital prototyping | Studio MACACO",
      description: "3D printing, laser cutting and custom electronics: in our lab we prototype interactive installations where the physical meets the digital.",
      heading: "Laboratory"
    },
    contact: {
      title: "Contact | Studio MACACO",
      description: "Have an experience in mind? Contact Studio MACACO, a Swiss creative studio for brands, cultural institutions and destinations, from concept to production.",
      bodyText: "Tell us about your project. Studio MACACO — Ludens Sagl, Via Pestariso 5, 6982 Agno (Ticino, Switzerland).",
      heading: "Contact"
    },
    notFound: {
      title: "Page not found — Studio MACACO",
      description: "The page you requested does not exist or has been moved.",
      heading: "Page not found"
    },
    projectSuffix: "Case History",
    nav: {
      home: "Home",
      projects: "Projects",
      laboratory: "Laboratory",
      contact: "Contact"
    },
    projectsListLabel: "All case histories"
  }
};
function mt(e) {
  return Yt[e] ?? Yt.it;
}
const rn = {
  "berco-supersize": {
    it: {
      title: "Berco Supersize — Esperienza di brand | Studio MACACO",
      description: "Un’esperienza di brand per lo stand Berco a Bauma 2025, realizzata con PoliedroStudio. Il gioco arcade coinvolge il pubblico nella scoperta dei prodotti."
    },
    en: {
      title: "Berco Supersize — Brand Experience | Studio MACACO",
      description: "A brand experience created with PoliedroStudio for Berco at Bauma 2025. Arcade gameplay invites the trade-show audience to explore industrial products."
    }
  },
  "digitart-3d-giulia-caffo": {
    it: {
      title: "Digiart 3D: Giulia Caffo — Esperienza museale",
      description: "La storia di Giulia Caffo incontra le ceramiche del Museo Giuseppe Roi: tavoli touch, esplorazione 3D e riproduzioni tattili."
    },
    en: {
      title: "Digiart 3D: Giulia Caffo — Museum Experience | Studio MACACO",
      description: "Giulia Caffo’s story meets the Giuseppe Roi Ceramics Museum collection through touch tables, 3D exploration and tactile reproductions."
    }
  },
  "segui-il-tubo": {
    it: {
      title: "Segui il Tubo — Giochi web educativi | Studio MACACO",
      description: "Due giochi web per CDALED raccontano il viaggio dell’acqua e spiegano cosa non gettare nel WC, tra azioni quotidiane e scoperta della depurazione."
    },
    en: {
      title: "Segui il Tubo — Educational Web Games | Studio MACACO",
      description: "Two web games for CDALED follow the journey of water and explain what must not be flushed, connecting everyday actions with wastewater treatment."
    }
  },
  pastawar: {
    it: {
      title: "PastaWar — Arte generativa | Studio MACACO",
      description: "8.333 Pasta Warrior, una collezione NFT e un configuratore web. Un esperimento interno tra arte generativa, identità visiva e personalizzazione."
    },
    en: {
      title: "PastaWar — Generative Art | Studio MACACO",
      description: "8,333 Pasta Warriors, an NFT collection and a web customiser. An in-house experiment in generative art, visual identity and personalisation."
    }
  },
  "kebhouze-the-game": {
    it: {
      title: "Kebhouze The Game — Art direction arcade | Studio MACACO",
      description: "La mascotte Keb diventa protagonista di un runner arcade. Personaggi, ambienti e art direction portano l’identità Kebhouze dentro il gioco."
    },
    en: {
      title: "Kebhouze The Game — Arcade Art Direction | Studio MACACO",
      description: "Keb, the Kebhouze mascot, steps into an arcade runner. Characters, environments and art direction turn the brand into a world to play in."
    }
  },
  mulm: {
    it: {
      title: "MULM — App per musei e territorio | Studio MACACO",
      description: "Dal San Gottardo al Museo della Scienza di Milano: un’app accompagna la scoperta di musei e luoghi attraverso racconti, itinerari e una guida virtuale."
    },
    en: {
      title: "MULM — Museums & Interactive Routes | Studio MACACO",
      description: "From the Gotthard to the Museum of Science in Milan, an app connects museums and places through stories, interactive routes and a virtual guide."
    }
  },
  "omicidio-sulla-centovallina": {
    it: {
      title: "Omicidio sulla Centovallina — Evento interattivo",
      description: "Un evento investigativo per RSI e Ferrovia Vigezzina-Centovalli: un’app, attori sul territorio e una finalissima dal vivo."
    },
    en: {
      title: "Omicidio sulla Centovallina — Interactive Event",
      description: "An investigative event for RSI and the Vigezzina-Centovalli railway, combining an app, actors along the route and a live grand final."
    }
  },
  "top-networker": {
    it: {
      title: "Top Networker — Networking interattivo | Studio MACACO",
      description: "Carte fisiche, QR personali e una classifica live: un’esperienza per Business Matching 2024 che invita a conoscere persone e scoprire gli espositori."
    },
    en: {
      title: "Top Networker — Interactive Networking | Studio MACACO",
      description: "Physical cards, personal QR codes and a live leaderboard: an experience for Business Matching 2024 that invites people to connect and discover exhibitors."
    }
  },
  "neko-music-video": {
    it: {
      title: "Neko Music Video — Videoclip 3D | Studio MACACO",
      description: "Videoclip musicali tra mondi onirici e fantascientifici, con l’artista ricostruito in 3D e una produzione interamente in game engine real-time."
    },
    en: {
      title: "Neko Music Video — Real-Time 3D | Studio MACACO",
      description: "Music videos set in dreamlike, science-fiction worlds, featuring a 3D version of the artist and produced entirely in a real-time game engine."
    }
  },
  "tesori-delle-vette-del-ceresio": {
    it: {
      title: "Tesori delle vette del Ceresio — App per il turismo",
      description: "Sei montagne del Ceresio collegate da una storia. Un’app per famiglie intreccia missioni, personaggi e illustrazioni con la scoperta dei luoghi."
    },
    en: {
      title: "Tesori delle vette del Ceresio — Tourism App",
      description: "Six Ceresio mountains connected by one story. A family app brings missions, characters and illustrations together with the discovery of real places."
    }
  },
  "tesori-della-valle-di-blenio": {
    it: {
      title: "Tesori della valle di Blenio — App e caccia al tesoro",
      description: "Una caccia al tesoro per famiglie nella Valle di Blenio, tra app mobile, mappa cartacea, monete da ricalcare e racconti illustrati del territorio."
    },
    en: {
      title: "Tesori della valle di Blenio — Family Treasure Hunt",
      description: "A family treasure hunt in the Blenio Valley, combining a mobile app, a paper map, coin rubbings and illustrated stories about the area."
    }
  },
  "tesori-di-brissago": {
    it: {
      title: "Tesori di Brissago — App per famiglie | Studio MACACO",
      description: "Un’app e una mappa cartacea guidano le famiglie tra gli indizi di Brissago. Dobloni reali e racconti illustrati collegano gioco e scoperta del territorio."
    },
    en: {
      title: "Tesori di Brissago — Family Tourism App | Studio MACACO",
      description: "An app and a paper map guide families through Brissago’s clues. Real doubloons and illustrated stories connect play with the discovery of local places."
    }
  },
  "segreti-del-lago": {
    it: {
      title: "I Segreti del Lago — Concept app turistica | Studio MACACO",
      description: "Un concept di app turistica per Brissago e Ronco sopra Ascona: informazioni, racconti e attività si incontrano in un concierge digitale."
    },
    en: {
      title: "I Segreti del Lago — Tourism App Concept | Studio MACACO",
      description: "A tourism app concept for Brissago and Ronco sopra Ascona, bringing information, stories and activities together in a digital concierge."
    }
  },
  "forest-jump": {
    it: {
      title: "Forest Jump — Art direction arcade | Studio MACACO",
      description: "Dal personaggio al cabinato, l’art direction di Forest Jump collega ambienti, branding e design della macchina in un’unica identità visiva."
    },
    en: {
      title: "Forest Jump — Arcade Art Direction | Studio MACACO",
      description: "From character to cabinet, Forest Jump’s art direction connects environments, branding and the physical machine through one visual identity."
    }
  },
  playstorming: {
    it: {
      title: "Playstorming — Piattaforma di ricerca | Studio MACACO",
      description: "Il concept di Elma Research prende forma in una piattaforma multiplayer su misura per ricerca qualitativa, sessioni collaborative e raccolta dati."
    },
    en: {
      title: "Playstorming — Custom Research Platform | Studio MACACO",
      description: "Elma Research’s concept takes shape as a custom multiplayer platform for qualitative research, collaborative sessions and data collection."
    }
  },
  "vivi-gambarogno": {
    it: {
      title: "Vivi Gambarogno — App e dashboard | Studio MACACO",
      description: "Luoghi, eventi e itinerari anche offline in un’app per esplorare il Gambarogno. Una dashboard permette al Comune di aggiornare i contenuti."
    },
    en: {
      title: "Vivi Gambarogno — Tourism App & Dashboard | Studio MACACO",
      description: "Places, events and offline routes in an app for exploring Gambarogno. A dashboard lets the municipality keep the content up to date."
    }
  },
  "la-selva": {
    it: {
      title: "La Selva — Assessment in VR | Studio MACACO",
      description: "Un percorso per PC e VR ispirato alla Divina Commedia. Scelte e situazioni narrative si collegano a una piattaforma di raccolta dati per l’assessment."
    },
    en: {
      title: "La Selva — Narrative VR Assessment | Studio MACACO",
      description: "A PC and VR journey inspired by the Divine Comedy. Choices and narrative situations connect with a data collection platform designed for assessment."
    }
  },
  "every-dei-at-work": {
    it: {
      title: "Every DEI at work — Concept di piattaforma DEI",
      description: "Un concept di piattaforma aziendale per la formazione DEI, con percorsi educativi, certificazioni e uno spazio dedicato alle segnalazioni."
    },
    en: {
      title: "Every DEI at work — DEI Platform Concept | Studio MACACO",
      description: "A corporate platform concept for DEI training, combining learning paths, certifications and a dedicated space for workplace reports."
    }
  },
  "cube-up": {
    it: {
      title: "Cube Up — Gioco mobile | Studio MACACO",
      description: "Un cubo da completare contro il tempo, livelli che cambiano con la musica e avatar da sbloccare. Un casual game per Android e iOS pubblicato nel 2017."
    },
    en: {
      title: "Cube Up — Mobile Game | Studio MACACO",
      description: "A cube to complete against the clock, levels that change with the music and avatars to unlock. A casual game released for Android and iOS in 2017."
    }
  },
  respect: {
    it: {
      title: "Respect — Serious game sul bullismo | Studio MACACO",
      description: "Un serious game in realtà virtuale sul bullismo. Scelte narrative volutamente limitate portano il giocatore a confrontarsi con le proprie azioni."
    },
    en: {
      title: "Respect — VR Bullying Awareness | Studio MACACO",
      description: "A virtual reality serious game about bullying. Deliberately limited narrative choices confront players with the consequences of their actions."
    }
  },
  "im-fading": {
    it: {
      title: "I'm Fading — Gioco sull’Alzheimer | Studio MACACO",
      description: "Un serious game dimostrativo sull’Alzheimer. Fotografie e ricordi da ricostruire raccontano la memoria e il rapporto tra una nonna e sua nipote."
    },
    en: {
      title: "I'm Fading — Alzheimer’s Awareness Game | Studio MACACO",
      description: "A demo serious game about Alzheimer’s, using photographs and memories to explore the relationship between a grandmother and her granddaughter."
    }
  },
  "the-black-cat": {
    it: {
      title: "The Black Cat — Videogioco narrativo | Studio MACACO",
      description: "Il Memory incontra Edgar Allan Poe in un videogioco sperimentale. Ricordi, errori e contrasti noir accompagnano la ricostruzione di una storia."
    },
    en: {
      title: "The Black Cat — Narrative Game | Studio MACACO",
      description: "A memory game meets Edgar Allan Poe in an experimental video game. Recollections, mistakes and noir contrasts drive the unravelling of a story."
    }
  },
  "become-this-way": {
    it: {
      title: "Become this way — Storia e character design | Studio MACACO",
      description: "Un robot aspirapolvere vuole diventare un pesce. Una storia originale sviluppata tra scrittura, character design, concept art e prototipazione."
    },
    en: {
      title: "Become this way — Story & Character Design | Studio MACACO",
      description: "A robot vacuum wants to become a fish. An original story developed through writing, character design, concept art and prototyping."
    }
  },
  aquatar: {
    it: {
      title: "Aquatar — Concierge AI in real time | Studio MACACO",
      description: "Un acquario 3D risponde alle richieste dell’utente. Un prototipo di concierge AI sviluppato con Artificialy per Abacus Research AG."
    },
    en: {
      title: "Aquatar — Real-Time AI Concierge | Studio MACACO",
      description: "A real-time 3D aquarium responds to user requests. An AI concierge prototype developed with Artificialy for Abacus Research AG."
    }
  },
  "bullying-vr": {
    it: {
      title: "Bullying VR — Esperienza educativa VR | Studio MACACO",
      description: "Bullo, vittima e spettatore: tre prospettive sullo stesso episodio. Un’esperienza educativa VR per Croce Rossa Svizzera Sottoceneri."
    },
    en: {
      title: "Bullying VR — Educational VR Experience | Studio MACACO",
      description: "Bully, victim and bystander: three perspectives on the same incident. An educational VR experience for the Swiss Red Cross Sottoceneri."
    }
  }
};
function nn(e, i) {
  var a;
  return ((a = rn[e]) == null ? void 0 : a[i]) ?? null;
}
function sn(e, i = 158) {
  const a = String(e ?? "").replace(/\s+/g, " ").trim();
  if (a.length <= i) return a;
  const o = a.slice(0, i - 1);
  return `${o.slice(0, o.lastIndexOf(" ")).trimEnd()}…`;
}
function Kt(e) {
  return Array.isArray(e) ? e.filter(Boolean).join(" ") : e ?? "";
}
function ln(e, i) {
  const a = typeof e.seoTag == "string" ? e.seoTag.trim() : "";
  if (a) return a;
  const o = String(e.category ?? "").split("/")[0].trim();
  return o && o.length <= 30 ? o : i.projectSuffix;
}
function cn(e, i) {
  const a = `${e.title} — ${ln(e, i)}`,
    o = `${a} | ${Ae}`;
  return o.length <= 60 ? o : a;
}
function pe(e, i = "") {
  const a = i.replace(/^\/+/, "");
  return a ? `/${e}/${a}` : `/${e}`;
}
function tt(e, i = null) {
  return i === "laboratory" ? !1 : e === DEFAULT_LANGUAGE || yr;
}
function Jt(e, i = null) {
  if (i === "laboratory") return [];
  const a = LANGUAGES.map(o => ({
    hreflang: Ai[o] ?? o,
    href: B(pe(o, e))
  }));
  return a.push({
    hreflang: "x-default",
    href: B(pe(DEFAULT_LANGUAGE, e))
  }), a;
}
function buildSeoData({
  lang: e = DEFAULT_LANGUAGE,
  kind: i = "home",
  slug: a = null
} = {}) {
  const o = mt(e),
    s = Ai[e] ?? e,
    n = {
      lang: e,
      localeTag: s,
      siteName: Ae,
      type: "website",
      robots: tt(e) ? "index,follow,max-image-preview:large" : "noindex,follow",
      image: wr,
      imageAlt: o.defaultImageAlt
    };
  if (i === "project") {
    const c = a ? on(a, e) : null;
    if (!c) return buildSeoData({
      lang: e,
      kind: "notFound"
    });
    const m = `projects/${c.slug}`,
      v = nn(c.slug, e),
      A = (v == null ? void 0 : v.description) ?? sn(Kt(c.intro) || Kt(c.excerpt));
    return {
      ...n,
      kind: i,
      subpath: m,
      path: pe(e, m),
      canonical: B(pe(e, m)),
      alternates: Jt(m),
      title: (v == null ? void 0 : v.title) ?? cn(c, o),
      description: A,
      heading: c.title,
      bodyText: A,
      type: "article",
      image: Cr(c.slug),
      imageAlt: `${c.title} — ${Ae}`,
      item: c
    };
  }
  const d = ["home", "projects", "laboratory", "contact", "notFound"].includes(i) ? i : "home",
    l = d === "home" || d === "notFound" ? "" : d,
    h = o[d];
  return {
    ...n,
    kind: d,
    subpath: l,
    path: pe(e, l),
    canonical: B(pe(e, l)),
    alternates: d === "notFound" ? [] : Jt(l, d),
    robots: d === "notFound" || !tt(e, d) ? "noindex,follow" : "index,follow,max-image-preview:large",
    title: h.title,
    description: h.description,
    heading: h.heading,
    bodyText: h.bodyText ?? h.description
  };
}
const Ge = `${xe}/#organization`,
  gt = `${xe}/#website`;
function dn(e) {
  const {
    address: i
  } = SITE;
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": Ge,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description[e] ?? SITE.description.it,
    url: xe,
    email: SITE.email,
    telephone: SITE.telephone,
    vatID: SITE.vatID,
    foundingDate: SITE.foundingDate,
    areaServed: SITE.areaServed,
    logo: {
      "@type": "ImageObject",
      url: B(SITE.logo)
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: SITE.email,
      telephone: SITE.telephone,
      availableLanguage: ["it", "en"],
      areaServed: SITE.areaServed
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: i.street,
      postalCode: i.postalCode,
      addressLocality: i.locality,
      addressRegion: i.region,
      addressCountry: i.country
    },
    ...(SITE.sameAs.length ? {
      sameAs: SITE.sameAs
    } : {})
  };
}
function pn(e) {
  return {
    "@type": "WebSite",
    "@id": gt,
    url: xe,
    name: Ae,
    inLanguage: e,
    publisher: {
      "@id": Ge
    }
  };
}
function un(e) {
  const i = mt(e.lang),
    a = [{
      name: i.nav.home,
      path: `/${e.lang}`
    }];
  if (e.kind === "projects") a.push({
    name: i.nav.projects,
    path: `/${e.lang}/projects`
  });else if (e.kind === "project") a.push({
    name: i.nav.projects,
    path: `/${e.lang}/projects`
  }), a.push({
    name: e.heading,
    path: e.path
  });else if (e.kind === "laboratory" || e.kind === "contact") a.push({
    name: i.nav[e.kind],
    path: e.path
  });else return null;
  return {
    "@type": "BreadcrumbList",
    "@id": `${B(e.path)}#breadcrumb`,
    itemListElement: a.map((o, s) => ({
      "@type": "ListItem",
      position: s + 1,
      name: o.name,
      item: B(o.path)
    }))
  };
}
function mn(e) {
  const i = e.item;
  if (!(i != null && i.sections)) return [];
  const a = [],
    o = l => {
      if (Array.isArray(l)) return l.forEach(o);
      !l || typeof l != "object" || (typeof l.src == "string" && /\.(mp4|webm|mov)$/i.test(l.src) && a.push(l), Object.values(l).forEach(o));
    };
  o(i.sections);
  const s = new Set(),
    n = new Set(),
    d = (l, h) => {
      const c = l.title || l.alt;
      if (c && !n.has(c)) return n.add(c), c;
      const m = l.src.split("/").pop().replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      return c ? `${c} — ${m}` : `${i.title} — video ${h + 1}`;
    };
  return a.filter(l => !s.has(l.src) && s.add(l.src)).map((l, h) => ({
    "@type": "VideoObject",
    "@id": `${B(e.path)}#video-${h + 1}`,
    name: d(l, h),
    description: e.description,
    contentUrl: B(l.src),
    thumbnailUrl: B(l.poster || i.image),
    uploadDate: i.year ? `${i.year}-01-01` : void 0,
    isPartOf: {
      "@id": B(e.path)
    }
  }));
}
function gn(e) {
  var a, o;
  const i = e.item;
  return i ? {
    "@type": "CreativeWork",
    "@id": B(e.path),
    url: B(e.path),
    name: i.title,
    headline: i.title,
    description: e.description,
    inLanguage: e.lang,
    image: B(i.image),
    ...(i.year ? {
      dateCreated: String(i.year)
    } : {}),
    ...(i.category ? {
      genre: i.category
    } : {}),
    ...((a = i.projectTypes) != null && a.length ? {
      keywords: i.projectTypes.join(", ")
    } : {}),
    ...((o = i.capabilities) != null && o.length ? {
      about: i.capabilities
    } : {}),
    creator: {
      "@id": Ge
    },
    ...(i.customer ? {
      sourceOrganization: {
        "@type": "Organization",
        name: i.customer
      }
    } : {}),
    isPartOf: {
      "@id": gt
    }
  } : null;
}
function hn(e) {
  return {
    "@type": e.kind === "project" ? "ItemPage" : "WebPage",
    "@id": `${B(e.path)}#webpage`,
    url: B(e.path),
    name: e.title,
    description: e.description,
    inLanguage: e.lang,
    isPartOf: {
      "@id": gt
    },
    about: {
      "@id": Ge
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: B(e.image)
    }
  };
}
function fn(e) {
  const i = [dn(e.lang), pn(e.lang), hn(e)],
    a = un(e);
  if (a && i.push(a), e.kind === "project") {
    const o = gn(e);
    o && i.push(o), i.push(...mn(e));
  }
  return {
    "@context": "https://schema.org",
    "@graph": i
  };
}
function vn(e) {
  return JSON.stringify(fn(e)).replaceAll("</", "<\\/");
}
const Xt = "[data-seo]";
function De(e, i, a, o) {
  const s = `${e}[${i}="${CSS.escape(a)}"][data-seo]`,
    n = document.head.querySelector(s);
  if (o == null) {
    n == null || n.remove();
    return;
  }
  const d = n ?? document.createElement(e);
  n || (d.setAttribute("data-seo", ""), d.setAttribute(i, a), document.head.appendChild(d)), d.setAttribute(e === "link" ? "href" : "content", o);
}
function bn(e) {
  document.title = e.title, document.documentElement.lang = e.lang, document.head.querySelectorAll(`link[rel="alternate"]${Xt}, script[type="application/ld+json"]${Xt}`).forEach(s => s.remove());
  const i = {
    description: e.description,
    robots: e.robots,
    "twitter:card": Sr,
    "twitter:title": e.title,
    "twitter:description": e.description,
    "twitter:image": B(e.image),
    "twitter:image:alt": e.imageAlt
  };
  for (const [s, n] of Object.entries(i)) De("meta", "name", s, n);
  const a = {
    "og:type": e.type,
    "og:site_name": e.siteName,
    "og:title": e.title,
    "og:description": e.description,
    "og:url": e.canonical,
    "og:locale": e.localeTag.replace("-", "_"),
    "og:image": B(e.image),
    "og:image:alt": e.imageAlt,
    "og:image:type": "image/jpeg",
    "og:image:width": String(Ar),
    "og:image:height": String(xr)
  };
  for (const [s, n] of Object.entries(a)) De("meta", "property", s, n);
  if (De("link", "rel", "canonical", e.canonical), De("link", "rel", "describedby", B("/llms.txt")), tt(e.lang, e.kind) && e.kind !== "notFound") {
    const s = document.createElement("link");
    s.setAttribute("data-seo", ""), s.rel = "alternate", s.type = "text/markdown", s.href = B(`${e.path}/index.md`), document.head.appendChild(s);
  }
  for (const s of e.alternates) {
    const n = document.createElement("link");
    n.setAttribute("data-seo", ""), n.setAttribute("rel", "alternate"), n.setAttribute("hreflang", s.hreflang), n.setAttribute("href", s.href), document.head.appendChild(n);
  }
  const o = document.createElement("script");
  o.setAttribute("data-seo", ""), o.type = "application/ld+json", o.textContent = vn(e), document.head.appendChild(o);
}
function UseSeo({
  lang: e,
  kind: i,
  slug: a = null
}) {
  return React.useEffect(() => {
    bn(buildSeoData({
      lang: e,
      kind: i,
      slug: a
    }));
  }, [e, i, a]), null;
}
const wn = {
    minHeight: "100svh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    background: "#0a0a0a",
    color: "#fff",
    font: '400 14px/1.6 "Roboto Mono", ui-monospace, monospace',
    textAlign: "center",
    padding: "var(--nav-offset, 96px) 24px 24px"
  },
  An = {
    font: '700 clamp(56px,14vw,140px)/1 "Syncopate", sans-serif',
    letterSpacing: "0.06em",
    color: "#FEFF00",
    margin: 0
  },
  xn = {
    color: "#0a0a0a",
    background: "#FEFF00",
    padding: "10px 18px",
    textDecoration: "none",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginTop: "8px"
  };
function NotFound() {
  const {
      lang: e
    } = useParams(),
    i = isSupportedLanguage(e) ? e : detectBrowserLanguage(),
    a = mt(i);
  return <><UseSeo lang={i} kind="notFound" /><main style={wn}><h1 style={An}>{"404"}</h1><p style={{
        opacity: 0.75,
        margin: 0
      }}>{a.notFound.heading}</p><a style={xn} href={`/${i}`}>{a.nav.home}</a></main></>;
}
function Cn({
  active: e
}) {
  const {
    accent: i
  } = useAccent();
  return <$o active={e} accent={i} />;
}
const Sn = ".intro-scroll-spacer, .mc-nav__overlay, .pl-scroll, input, textarea, select, [data-native-touch]";
function Tn() {
  return ni(getScrollRoot, {
    getParams: () => ({
      maxPxPerSec: config.scroll.siteTouchMaxPxPerSec,
      friction: config.scroll.siteTouchFriction
    }),
    shouldIgnore: e => e instanceof Element && !!e.closest(Sn)
  }), null;
}
const En = ["/projects"];
function LangLayout() {
  const {
      lang: e
    } = useParams(),
    i = useLocation(),
    {
      i18n: a
    } = useTranslation(),
    o = isSupportedLanguage(e);
  if (React.useEffect(() => {
    o && (document.documentElement.lang = e, a.language !== e && a.changeLanguage(e));
  }, [o, e, a]), React.useEffect(() => {
    o && wi(i.pathname + i.search);
  }, [o, i.pathname, i.search]), !o) return <NotFound />;
  const s = i.pathname.replace(/\/+$/, "") || `/${e}`,
    n = s === `/${e}`,
    d = s.replace(`/${e}`, "") || "/",
    l = En.includes(d),
    h = d === "/laboratory";
  return <Ur2><AccentProvider><Cn active={!n && !h} /><Cursor /><div id={SCROLL_ROOT_ID} className="scroll-root"><div className="site-chrome"><NavBar isHome={n} /><ScrollProgressBar enabled={!l} /></div><Tn /><ScrollSpacer active={n} /><React.Suspense fallback={null}><Outlet /></React.Suspense></div></AccentProvider></Ur2>;
}
const HomePage = React.lazy(() => import("./pages/Home.jsx")),
  ProjectsPage = React.lazy(() => import("./pages/Projects.jsx")),
  ProjectDetailPage = React.lazy(() => import("./pages/ProjectDetail.jsx")),
  LaboratoryPage = React.lazy(() => import("./pages/Laboratory.jsx")),
  ContactPage = React.lazy(() => import("./pages/Contact.jsx")),
  DevSectionsPage = React.lazy(() => import("./pages/DevSections.jsx"));
function App() {
  return <BrowserRouter><Routes><Route path="/" element={<Navigate to={`/${detectBrowserLanguage()}`} replace={!0} />} /><Route path="/dev/sections" element={<React.Suspense fallback={null}><DevSectionsPage /></React.Suspense>} /><Route path="/:lang" element={<LangLayout />}><Route index={!0} element={<HomePage />} /><Route path="projects" element={<ProjectsPage />} /><Route path="projects/:slug" element={<ProjectDetailPage />} /><Route path="laboratory" element={<LaboratoryPage />} /><Route path="contact" element={<ContactPage />} /><Route path="*" element={<NotFound />} /></Route><Route path="*" element={<NotFound />} /></Routes></BrowserRouter>;
}
export { App, pixelRatioFor, PIXEL_BUDGET, config, DitherFill, Vn, Pn, $a, HOVER_QUERY, W, Wn, qn, La, ka, Ha, SITE, Fn, Un, Ya, SOCIAL_LINKS, AppLink, getOffsetTop, getMaxScroll, canHover, Yn, useAccent, Bn, getScrollRoot, Ta, isCoarsePointer, Aa, si, Gn, li, ci, lt, buildSeoData, UseSeo, $n, getScrollTop, Je, useIsCoarsePointer, getViewportHeight, usePageTransition, on, Kn, scrollToTop };
