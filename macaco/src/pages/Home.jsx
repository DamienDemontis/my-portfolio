import { DitherFill } from "../components/DitherFill.jsx";
import { SCROLL_SPAN_SVH, si } from "../components/intro/Intro.jsx";
import { SITE, SOCIAL_LINKS } from "../content/site.js";
import { isCoarsePointer, useIsCoarsePointer } from "../lib/device.js";
import { getMaxScroll, getOffsetTop, getScrollContainer, getScrollRoot, getScrollTop, getViewportHeight, onScroll, scrollRootTo } from "../lib/scroll.js";
import { ci, li, STAGE_HEIGHT_SVH } from "../lib/shared.js";
import { buildSeoData, UseSeo } from "../seo/Seo.jsx";
import '../styles/home.css';
import React from "react";
import { useParams } from "react-router-dom";
import { useIsTabletDown } from "../components/VideoPlayer.jsx";
import { useTranslation } from "react-i18next";
import { useCanHover } from "../hooks/useCanHover.js";
import { useMotionValue } from "framer-motion";
const $t = 0.1,
  Gt = 5e-4;
function Be(s, c) {
  const h = React.useRef(0),
    w = React.useRef(c);
  return w.current = c, React.useEffect(() => {
    const R = s.current;
    if (!R) return;
    const E = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : $t;
    let l = 0;
    const i = () => {
        const x = R.getBoundingClientRect(),
          N = getViewportHeight() || 1,
          I = Math.max(1, R.offsetHeight - N);
        return Math.min(1, Math.max(0, -x.top / I));
      },
      u = x => {
        var N;
        h.current = x, R.style.setProperty("--p", x.toFixed(4)), (N = w.current) == null || N.call(w, x);
      },
      b = () => {
        const x = i(),
          N = x - h.current;
        if (Math.abs(N) < Gt) {
          l = 0, u(x);
          return;
        }
        l = requestAnimationFrame(b), u(h.current + N * E);
      },
      m = () => {
        l || (l = requestAnimationFrame(b));
      };
    u(i());
    const t = onScroll(m);
    return () => {
      l && cancelAnimationFrame(l), t();
    };
  }, [s]), h;
}
const Ze = 140,
  Bt = 220,
  Wt = 560,
  Ke = 2,
  me = 12,
  Yt = 2,
  Xt = s => 1 - (1 - s) ** 3;
function We(s, c, {
  range: h = 0.18,
  backFactor: w = 0.5,
  resolve: R = !1,
  enabled: E = !0
} = {}) {
  const l = React.useRef(c);
  l.current = c, React.useEffect(() => {
    const i = s.current;
    if (!i || !E || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const u = getScrollRoot();
    let b = 0,
      m = 0,
      t = !1,
      x = !1,
      N = getScrollTop(),
      I = 0;
    const T = () => {
        m && cancelAnimationFrame(m), m = 0, t = !1;
      },
      p = k => getOffsetTop(i) + k * (i.offsetHeight - getViewportHeight()),
      o = (k, D) => {
        const g = getScrollTop(),
          _ = performance.now(),
          M = Math.min(Wt, Math.max(Bt, Math.abs(D) * 1.6));
        t = !0;
        const f = v => {
          const d = Math.min(1, (v - _) / M);
          if (u.scrollTop = g + (k - g) * Xt(d), d < 1) {
            m = requestAnimationFrame(f);
            return;
          }
          m = 0, requestAnimationFrame(() => {
            t = !1, N = getScrollTop();
          });
        };
        m = requestAnimationFrame(f);
      },
      S = () => {
        if (b = 0, t || x) return;
        const k = i.offsetHeight - getViewportHeight();
        if (k <= 0) return;
        const D = getScrollTop(),
          g = getOffsetTop(i);
        if (D <= g + me || D >= g + k - me || D >= getMaxScroll() - me) return;
        if (R && I >= 0) {
          if (D > p(Math.max(...l.current)) + me) return;
          let v = 0,
            d = 0,
            a = 1 / 0;
          for (const y of l.current) {
            const C = p(y) - D,
              A = Math.abs(C) * (I !== 0 && Math.sign(C) !== I ? Yt : 1);
            A < a && (a = A, v = p(y), d = C);
          }
          if (a === 1 / 0 || Math.abs(d) < Ke) return;
          o(v, d);
          return;
        }
        const _ = getViewportHeight();
        let M = 0,
          f = 1 / 0;
        for (const v of l.current) {
          const d = p(v) - D,
            a = _ * h * (I !== 0 && Math.sign(d) !== I ? w : 1);
          Math.abs(d) <= a && Math.abs(d) < Math.abs(f) && (f = d, M = p(v));
        }
        f === 1 / 0 || Math.abs(f) < Ke || o(M, f);
      },
      P = () => {
        if (t) return;
        const k = getScrollTop();
        k !== N && (I = Math.sign(k - N)), N = k, b && clearTimeout(b), b = setTimeout(S, Ze);
      },
      r = () => {
        T(), N = getScrollTop(), b && clearTimeout(b), b = setTimeout(S, Ze);
      },
      H = () => {
        x = !0, r();
      },
      O = () => {
        x = !1, r();
      },
      L = () => {
        document.hidden && T();
      },
      V = onScroll(P),
      $ = {
        passive: !0
      };
    return u.addEventListener("wheel", r, $), u.addEventListener("touchstart", H, $), u.addEventListener("touchend", O, $), u.addEventListener("touchcancel", O, $), window.addEventListener("keydown", r), window.addEventListener("pointerdown", r), document.addEventListener("visibilitychange", L), () => {
      b && clearTimeout(b), T(), V(), u.removeEventListener("wheel", r), u.removeEventListener("touchstart", H), u.removeEventListener("touchend", O), u.removeEventListener("touchcancel", O), window.removeEventListener("keydown", r), window.removeEventListener("pointerdown", r), document.removeEventListener("visibilitychange", L);
    };
  }, [s, E, h, w, R]);
}
const ls = [0.72];
function Craft() {
  const {
      t: s
    } = useTranslation(),
    c = React.useRef(null);
  return Be(c), We(c, ls, {
    resolve: !0
  }), <section ref={c} className="craft" aria-label={`${s("home.craftLine1", "WE CRAFT")} ${s("home.craftLine2", "INCREDIBLE THINGS")}`}><div className="craft__pin"><div className="craft__frame"><h2 className="craft__title craft-glitch-in" style={{
          "--s": 0,
          "--r": 0.15
        }}><span>{s("home.craftLine1", "WE CRAFT")}</span><span>{s("home.craftLine2", "INCREDIBLE THINGS")}</span></h2><span className="craft__readout craft-glitch-in" style={{
          "--s": 0.42,
          "--r": 0.12
        }}>{"show_reel"}{"{"}{"time!"}{"}"}</span></div></div></section>;
}
const Oe = 52,
  Ms = 2600,
  Ss = 18;
function CodelineGhost({
  text: s,
  className: c = ""
}) {
  const h = React.useRef(null),
    w = React.useRef(null);
  return React.useEffect(() => {
    const R = h.current,
      E = w.current;
    if (!R) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      R.textContent = s, E && (E.style.display = "none");
      return;
    }
    let l = 0,
      i = 1,
      u = 0;
    const b = () => {
      l += i, R.textContent = s.slice(0, l);
      let m = i > 0 ? Oe : Ss;
      i > 0 && l >= s.length ? (i = -1, m = Ms) : i < 0 && l <= 0 && (i = 1, m = Oe * 6), u = window.setTimeout(b, m);
    };
    return u = window.setTimeout(b, Oe), () => window.clearTimeout(u);
  }, [s]), <span className={`codeline ${c}`} aria-hidden="true"><span className="codeline__ghost">{s}</span><span className="codeline__live" ref={h} /><span className="codeline__cursor" ref={w} /></span>;
}
const Ps = React.forwardRef(function ({
    index: c,
    side: h,
    color: w,
    icon: R,
    title: E,
    body: l,
    interact: i,
    onEnter: u,
    onLeave: b
  }, m) {
    return <div className="rhot craft-glitch-in" data-side={h} style={{
      "--s": 0,
      "--r": 0.55,
      "--hc": w,
      "--ico": R ? `url('${R}')` : void 0
    }} ref={m}><svg className="rhot__link" viewBox="0 0 140 90" aria-hidden="true" focusable="false"><polyline points="140,78 78,78 78,12 0,12" /></svg><div className="rhot__marker" tabIndex={-1} role="button" aria-label={E} onMouseEnter={u} onMouseLeave={b} onFocus={u} onBlur={b}><span className="rhot__ico" aria-hidden="true" /><span className="rhot__num">{c}</span><span className="rhot__title">{E}</span><span className="rhot__interact">{i}</span></div><div className="rhot__content"><p className="rhot__body">{l}</p></div></div>;
  }),
  Cs = React.lazy(() => import("../three/RobotStage.jsx")),
  Is = {
    light: "#0f0f0b",
    dark: "#a5a595",
    pixel: 2,
    gain: 1.5
  },
  Fs = {
    copies: 3,
    spawnIntervalMs: 95,
    lifetimeMs: 430,
    fadeMs: 380,
    offsetX: 0.72,
    offsetY: 0.02,
    offsetZ: -0.2,
    jitter: 0.1,
    gain: 2.1,
    opacity: 0.4,
    light: null,
    dark: null
  },
  // Six plans, un par expertise, chacun avec sa focale (storyboard) ; le personnage regarde la caméra (−X).
  ct = [{
    pos: [-1.6, 1.08, 0.15],
    look: [0, 1.03, 0.02],
    fov: 12
  }, {
    pos: [-1.1, 0.15, -0.75],
    look: [0, -0.07, -0.33],
    fov: 28
  }, {
    pos: [-0.4, 4.2, 0.05],
    look: [0, -1, 0],
    fov: 40
  }, {
    pos: [0.1, 1.05, 2.4],
    look: [0, 1, 0],
    fov: 24
  }, {
    pos: [-1.6, -1.1, -1],
    look: [0, 0.4, 0.2],
    fov: 50
  }, {
    pos: [-5.5, 0.6, 1.2],
    look: [0, 0.1, 0],
    fov: 34
  }],
  Os = [{
    pos: [-2.2, 1.06, 0.15],
    look: [0, 1.0, 0.02],
    fov: 16
  }, {
    pos: [-1.6, 0.1, -0.9],
    look: [0, -0.07, -0.33],
    fov: 34
  }, {
    pos: [-0.4, 5.2, 0.05],
    look: [0, -1, 0],
    fov: 48
  }, {
    pos: [0.1, 1.0, 3.2],
    look: [0, 0.95, 0],
    fov: 30
  }, {
    pos: [-2.2, -1.1, -1.2],
    look: [0, 0.3, 0.2],
    fov: 60
  }, {
    pos: [-7.5, 0.6, 1.4],
    look: [0, 0.1, 0],
    fov: 40
  }],
  oe = {
    creativity: "/home/creativity-icon.svg",
    craft: "/home/craft-icon.svg",
    strategy: "/home/strategy-icon.svg",
    technology: "/home/technology-icon.svg",
    delivery: "/home/delivery-icon.svg",
    innovation: "/home/innovation-icon.svg"
  },
  ke = [{
    key: "h1",
    shot: 0,
    side: "left",
    color: "#7FFFFF",
    icon: oe.creativity,
    pos: [-0.11, 1.04, 0.04]
  }, {
    key: "h2",
    shot: 1,
    side: "left",
    color: "#7F3AEF",
    icon: oe.craft,
    pos: [-0.05, -0.07, -0.33]
  }, {
    key: "h3",
    shot: 2,
    side: "right",
    color: "#A9FF00",
    icon: oe.strategy,
    pos: [-0.05, -1.15, 0.12]
  }, {
    key: "h4",
    shot: 3,
    side: "right",
    color: "#5372FF",
    icon: oe.technology,
    pos: [0, 1.15, 0]
  }, {
    key: "h5",
    shot: 4,
    side: "right",
    color: "#7F3AEF",
    icon: oe.innovation,
    pos: [-0.12, 0.6, 0]
  }, {
    key: "h6",
    shot: 5,
    side: "left",
    color: "#7FFFFF",
    icon: oe.delivery,
    pos: [0, 0.73, 0.27]
  }],
  it = 60,
  lt = 130,
  dt = 70,
  ks = 0.55,
  Ls = 0.72,
  ue = 0.5,
  Le = 0.34,
  ut = 0.64,
  De = 0.88,
  Ds = 0.98,
  Hs = 0.94,
  Vs = 0.88,
  Us = (ue + 1) / 2,
  $s = 5,
  Gs = 1.35,
  Bs = 1,
  ce = s => s < 0 ? 0 : s > 1 ? 1 : s;
function Ws(s, c) {
  return s <= Le ? 0 : s < ut ? (s - Le) / (ut - Le) : c || s < De ? 1 : Math.max(0, 1 - (s - De) / (1 - De));
}
function Rstage() {
  const {
      t: s
    } = useTranslation(),
    c = React.useRef(null),
    h = React.useRef(null),
    w = React.useRef([]),
    R = React.useRef([]),
    E = React.useRef({
      camT: 0,
      moving: !1,
      lock: null,
      tint: null,
      idle: !1
    }),
    l = React.useCallback((g, _) => {
      E.current.tint = g;
      const M = h.current;
      M && (_ && M.style.setProperty("--bgico", `url('${_}')`), M.style.setProperty("--bghc", g), M.dataset.hot = "1");
    }, []),
    i = React.useCallback(() => {
      E.current.tint = null, h.current && (h.current.dataset.hot = "0");
    }, []);
  React.useEffect(() => {
    const g = () => {
      import("../three/RobotStage.jsx");
    };
    if (typeof requestIdleCallback == "function") {
      const M = requestIdleCallback(g, {
        timeout: 4e3
      });
      return () => cancelIdleCallback(M);
    }
    const _ = setTimeout(g, 3e3);
    return () => clearTimeout(_);
  }, []);
  const [u, b] = React.useState(!1),
    [m, t] = React.useState(!1);
  React.useEffect(() => {
    const g = c.current;
    if (!g || typeof IntersectionObserver > "u") return;
    const _ = getScrollContainer(),
      M = new IntersectionObserver(([v]) => b(v.isIntersecting), {
        root: _,
        rootMargin: "150% 0px"
      }),
      f = new IntersectionObserver(([v]) => t(v.isIntersecting), {
        root: _,
        rootMargin: "30% 0px"
      });
    return M.observe(g), f.observe(g), () => {
      M.disconnect(), f.disconnect();
    };
  }, []);
  const x = useIsCoarsePointer(),
    N = useIsTabletDown(),
    I = useCanHover();
  React.useEffect(() => {
    I || i();
  }, [I, i]);
  const [, T] = React.useState(0);
  React.useCallback(() => T(g => g + 1), []);
  const p = React.useMemo(() => Math.min(typeof window < "u" && window.devicePixelRatio || 1, isCoarsePointer() ? Bs : Gs), []),
    o = N ? Os : ct,
    S = ct.length - 1,
    P = it + S * lt + dt + SCROLL_SPAN_SVH,
    r = it / P,
    H = lt / P,
    O = r + S * H,
    L = dt / P,
    V = O + L + si * 0.9 / P,
    $ = `${100 + P}svh`,
    k = React.useCallback(g => {
      const _ = h.current,
        M = (g - r) / H,
        f = Math.max(0, Math.min(S - 1, Math.floor(M))),
        v = M - f,
        d = E.current;
      if (d.camT = g < r ? 0 : f + ce(v / ue), d.moving = g >= r && v > 0 && v < ue, d.idle = g >= V, !_) return;
      const a = ce((g - O) / (L * ks));
      _.style.setProperty("--out", a.toFixed(4)), _.style.setProperty("--fp", ce(g / (r * 0.9)).toFixed(4)), _.style.setProperty("--fe", ce((g - r) / (H * ue)).toFixed(4));
      const y = ce(g / (r * 0.55)),
        C = 1 - ce((g - r) / (H * ue * 0.6));
      _.style.setProperty("--pt", Math.min(y, Math.max(0, C)).toFixed(4));
      for (let A = 0; A < S; A++) {
        const X = M - A,
          B = Ws(X, A === S - 1) * (1 - a);
        _.style.setProperty(`--p${A}`, B.toFixed(4));
        const U = R.current[A];
        if (!U) continue;
        const j = B > Ds ? "1" : "0";
        if (U.dataset.live !== j) {
          U.dataset.live = j;
          for (const z of U.querySelectorAll(".rhot__marker")) z.tabIndex = j === "1" ? 0 : -1;
          j === "0" && (E.current.tint = null, _.dataset.hot = "0", U.contains(document.activeElement) && document.activeElement.blur());
        }
      }
    }, [r, H, S, O, L, V]);
  Be(c, k);
  const D = React.useMemo(() => [r * Hs, ...Array.from({
    length: S
  }, (g, _) => r + (_ + Us) * H), O + L * Ls, O + L + Vs * SCROLL_SPAN_SVH / P], [r, H, S, O, L, P]);
  return We(c, D, {
    resolve: !0,
    range: 0.3
  }), React.useCallback(g => {
    const _ = c.current;
    if (!_) return;
    const M = D[Math.max(0, Math.min(D.length - 1, g))];
    scrollRootTo({
      top: getOffsetTop(_) + M * (_.offsetHeight - getViewportHeight()),
      behavior: "auto"
    });
  }, [D]), <section className="rstage" aria-labelledby="rstage-title"><div className="rstage__track" ref={c} style={{
      height: $
    }}><div className="rstage__pin" ref={h} data-hot="0"><span className="rstage__bgico" aria-hidden="true" /><div className="rstage__frame" aria-hidden="true"><span className="rstage__fr rstage__fr--top" /><span className="rstage__fr rstage__fr--left" /><span className="rstage__fr rstage__fr--right" /><span className="rstage__fr rstage__fr--diag" /><span className="rstage__fr rstage__fr--bot" /><span className="rstage__cols" /><span className="rstage__blip" /><CodelineGhost className="rstage__code" text={s("home.stage.code", "initialize_core_analysis")} /><span className="rstage__ready">{s("home.stage.ready", "system_ready")}</span></div><div className="rstage__canvas craft-glitch-in" style={{
          "--s": 0.05,
          "--r": (r * 0.55).toFixed(4)
        }}>{u && <React.Suspense fallback={null}><Cs shots={o} colors={Is} glitch={Fs} hotspots={ke} markersRef={w} stageRef={E} active={m} dpr={p} maxGhosts={x ? 0 : $s} portraitFit={!N} projectHotspots={!N} /></React.Suspense>}</div>{!1}<h2 id="rstage-title" className="rstage__title craft-glitch-in" style={{
          "--s": 0,
          "--r": 1
        }}>{s("home.stage.title", "CAPABILITIES")}</h2>{[0, 1, 2].map(g => <div className="rstage__hots" data-i={g} data-live="0" ref={_ => {
          R.current[g] = _;
        }} key={g}>{ke.map((_, M) => _.shot === g ? <Ps ref={f => {
            w.current[M] = f;
          }} index={ke.filter(f => f.shot === g).indexOf(_) + 1} side={_.side} color={_.color} icon={_.icon} onEnter={I ? () => l(_.color, _.icon) : void 0} onLeave={I ? i : void 0} interact={s("home.stage.interact", "INTERACT")} title={s(`home.stage.${_.key}.title`, _.key.toUpperCase())} body={s(`home.stage.${_.key}.body`, "")} key={_.key} /> : null)}</div>)}</div></div></section>;
}
const ft = "Damien Demontis 2026",
  ht = 4;
function StripSegment() {
  return <div className="mcf-strip__segment" aria-hidden="true"><span className="mcf-strip__jp">{"みらい"}</span><span className="mcf-strip__text">{ft}</span><span className="mcf-strip__text">{ft}</span></div>;
}
function Strip() {
  return <div className="mcf-strip" aria-hidden="true"><div className="mcf-strip__track" style={{
      "--copies": ht
    }}>{Array.from({
        length: ht
      }, (s, c) => <StripSegment key={c} />)}</div></div>;
}
const mt = "site:yellow-nav",
  zs = 0.1,
  Zs = 5e-4,
  Ks = SOCIAL_LINKS,
  pt = SITE.email,
  de = s => s < 0 ? 0 : s > 1 ? 1 : s;
function Mcf() {
  const {
      t: s
    } = useTranslation(),
    h = React.useRef(null),
    w = React.useRef(null),
    i = useMotionValue(0),
    [u, b] = React.useState(!1),
    m = useIsTabletDown(),
    t = useIsCoarsePointer(),
    x = m || t,
    N = React.useRef(x);
  N.current = x, React.useEffect(() => {
    const p = h.current;
    if (!p || typeof IntersectionObserver > "u") return;
    const o = new IntersectionObserver(([S]) => b(S.isIntersecting), {
      rootMargin: `0px 0px ${si + 40}% 0px`
    });
    return o.observe(p), () => o.disconnect();
  }, []), React.useEffect(() => {
    const p = h.current,
      o = w.current;
    if (!p || !o) return;
    const P = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : zs;
    let r = 0,
      H = 0,
      O = !1;
    const L = () => {
        const g = getViewportHeight() || 1,
          _ = si / 100 * g,
          M = (si + li + ci) / 100 * g,
          f = _ - p.getBoundingClientRect().top;
        return de(f / M);
      },
      V = g => {
        H = g;
        const _ = si + li + ci,
          M = si / _,
          f = li / _,
          v = ci / _,
          d = de(g / M);
        i.set(d), o.style.setProperty("--field", N.current ? d.toFixed(4) : de((g - 0.55 * M) / (0.45 * M)).toFixed(4)), o.style.setProperty("--cover", (1 - de((g - M) / f)).toFixed(4)), o.style.setProperty("--p", de((g - M - 0.3 * f) / v).toFixed(4));
        const a = d > 0.98 ? "1" : "0";
        o.dataset.live !== a && (o.dataset.live = a);
        const y = d > 0.5;
        y !== O && (O = y, window.dispatchEvent(new CustomEvent(mt, {
          detail: y
        })));
      },
      $ = () => {
        const g = L(),
          _ = g - H;
        if (Math.abs(_) < Zs) {
          r = 0, V(g);
          return;
        }
        r = requestAnimationFrame($), V(H + _ * P);
      },
      k = () => {
        r || (r = requestAnimationFrame($));
      };
    V(L());
    const D = onScroll(k);
    return () => {
      r && cancelAnimationFrame(r), D(), O && window.dispatchEvent(new CustomEvent(mt, {
        detail: !1
      }));
    };
  }, [i]);
  const T = `${STAGE_HEIGHT_SVH}svh`;
  return <footer className="mcf" ref={h} style={{
    "--mcf-track": T
  }}><div className="mcf__pin" ref={w} data-live="0"><div className="mcf__layers" aria-hidden="true"><div className="mcf__field" />{u && !x && <DitherFill fill={i} className="mcf__cover" />}</div><div className="mcf__inner"><div className="mcf__top craft-glitch-in" style={{
          "--s": 0,
          "--r": 0.3
        }} aria-hidden="true"><span className="mcf__rail"><span className="mcf__topline" /></span><span className="mcf__jp">{"準備完了"}</span></div><div className="mcf__lead craft-glitch-in" style={{
          "--s": 0.14,
          "--r": 0.34
        }}><h2 className="mcf__headline">{s("footer.headline1", "Damien Demontis")}<br />{s("footer.headline2", "Portfolio")}</h2><div className="mcf__contact"><a href={`mailto:${pt}`} className="mcf__cta">{s("footer.cta", "Contact")}</a><p className="mcf__lines"><span><b>{"E."}</b>{" "}<a className="mcf__link" href={`mailto:${pt}`}>{pt}</a></span></p></div></div><div className="mcf__wordmark" aria-hidden="true">{"DEMONTIS"}</div><dl className="mcf__meta craft-glitch-in" style={{
          "--s": 0.5,
          "--r": 0.32
        }}><dt className="mcf__label">{s("footer.social", "Social")}</dt><dd className="mcf__values"><span className="mcf__rule" aria-hidden="true" /><div className="mcf__row">{Ks.map(p => <a className="mcf__link" href={p.href} key={p.key}>{p.label}</a>)}</div></dd></dl></div><Strip /></div></footer>;
}
function HomeContent() {
  const {
      lang: s
    } = useParams(),
    {
      heading: c
    } = buildSeoData({
      lang: s,
      kind: "home"
    });
  return <main className="home-content"><UseSeo lang={s} kind="home" /><h1 className="sr-only">{c}</h1><Craft /><Rstage /><Mcf /></main>;
}
export { HomeContent as default };
