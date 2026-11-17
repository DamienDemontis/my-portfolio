// Transition entre pages : contexte, voile et sequence d'animation.
import { animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { DitherFill } from "./DitherFill.jsx";
import { Strip, useMarquee } from "./ScrollProgress.jsx";
import { scrollToTop } from "../lib/scroll.js";
const Qo = "/loading/robot-icon.svg";
const Zo = `WE TURN ORDINARY
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
    } = useMarquee(c ? Zo : `${n} {loading}`, {
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
const _t = "site:loading-seen";
const jt = {
  type1: 2200,
  type2: 1300
};
const Ot = {
  duration: 0.42,
  ease: "easeIn"
};
const Nt = {
  duration: 0.7,
  ease: "easeOut"
};
const Bt = {
  duration: 0.3,
  ease: "easeOut"
};
const ir = {
  duration: 0.25,
  ease: "easeIn"
};
const ar = 0.82;
const Pt = e => new Promise(i => setTimeout(i, e));
const rr = () => new Promise(e => requestAnimationFrame(() => requestAnimationFrame(e)));
const nr = (e = 6) => new Promise(i => {
  let a = 0;
  const o = () => {
    a += 1, a >= e ? i() : requestAnimationFrame(o);
  };
  requestAnimationFrame(o);
});
const sr = e => Math.max(0, Math.min(1, e));
const lr = 250;
const ve = e => e.replace(/\/+$/, "").replace(/^\/[^/]+/, "") || "/";
const cr = e => (typeof e == "string" ? e : String(e)).split("#")[0].split("?")[0];
const PageTransitionContext = React.createContext(null);
const usePageTransitionContext = () => React.useContext(PageTransitionContext);
const usePageTransition = () => React.useContext(PageTransitionContext);
function PageTransitionProvider({
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
  // Le voile attend quelques images et les polices, jamais la 3D : le personnage
  // se charge après l'événement load, derrière un texte déjà lisible.
  const R = React.useCallback(() => {
      var x;
      return Promise.all([nr(), ((x = document.fonts) == null ? void 0 : x.ready) ?? Promise.resolve()]);
    }, []),
    E = React.useCallback(async x => {
      f(!0);
      let z;
      x === "type1" && (z = animate(h, 90, {
        duration: 2,
        ease: "easeOut"
      })), await Promise.all([Pt(jt[x] ?? jt.type2), R()]), x === "type1" && (z == null || z.stop(), await animate(h, 100, {
        duration: 0.3,
        ease: "easeOut"
      })), l.set(0), animate(d, 0, ir), await animate(n, 0, Nt), v(null), f(!1), u(!1);
    }, [l, d, n, h, R]);
  React.useEffect(() => {
    var x;
    (x = window.sessionStorage) == null || x.setItem(_t, "1"), E(c.current.kind);
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
      }), (async () => (await Promise.race([V, Pt(lr)]), await animate(n, 1, Ot), l.set(1), o(x), scrollToTop(), animate(d, 1, Bt), await E("type2")))();
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
    const V = ve(y);
    u(!0), n.set(1), l.set(1), d.set(0), f(!1), v({
      kind: "type2",
      rel: V
    }), (async () => (await rr(), animate(d, 1, Bt), await E("type2")))();
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
  return <PageTransitionContext.Provider value={F}>{e}{ee && <OverlaySolid mode={ee} label={m ? s("nav.home") : ""} fill={n} content={d} backing={l} percent={h} typing={A} passthrough={ee === "wipe" && !b} onDitherReady={p} />}</PageTransitionContext.Provider>;
}
export { PageTransitionProvider, usePageTransition, usePageTransitionContext };
