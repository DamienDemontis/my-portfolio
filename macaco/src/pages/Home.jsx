import '../styles/home.css'
import React from "react";
import { useParams } from "react-router-dom";
import { Aa, AppLink, Bn, buildSeoData, canHover, ci, DitherFill, getMaxScroll, getOffsetTop, getScrollRoot, getScrollTop, getViewportHeight, Gn, isCoarsePointer, li, lt as ltCore, Pn, si, SOCIAL_LINKS, Ta, useAccent, useIsCoarsePointer, UseSeo, W as WCore, Yn } from "../app-core.jsx";
import { CaseVideoPlayerFrame, ie, oe as oeCore } from "../components/case-detail/CaseVideoPlayer.jsx";
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
    const t = ltCore(m);
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
      V = ltCore(P),
      $ = {
        passive: !0
      };
    return u.addEventListener("wheel", r, $), u.addEventListener("touchstart", H, $), u.addEventListener("touchend", O, $), u.addEventListener("touchcancel", O, $), window.addEventListener("keydown", r), window.addEventListener("pointerdown", r), document.addEventListener("visibilitychange", L), () => {
      b && clearTimeout(b), T(), V(), u.removeEventListener("wheel", r), u.removeEventListener("touchstart", H), u.removeEventListener("touchend", O), u.removeEventListener("touchcancel", O), window.removeEventListener("keydown", r), window.removeEventListener("pointerdown", r), document.removeEventListener("visibilitychange", L);
    };
  }, [s, E, h, w, R]);
}
const qt = [{
    dx: 0.42,
    dy: 0.01,
    dw: 0.12,
    dh: 0.12,
    sx: 0.42,
    sy: 0.02,
    sw: 0.16,
    sh: 0.16,
    amp: 1.4
  }, {
    dx: 0.6,
    dy: 0.02,
    dw: 0.13,
    dh: 0.15,
    sx: 0.6,
    sy: 0.04,
    sw: 0.16,
    sh: 0.18,
    amp: 1.2
  }, {
    dx: 0.76,
    dy: 0.01,
    dw: 0.14,
    dh: 0.2,
    sx: 0.72,
    sy: 0.02,
    sw: 0.18,
    sh: 0.24,
    amp: 1
  }, {
    dx: 0.84,
    dy: 0.22,
    dw: 0.14,
    dh: 0.2,
    sx: 0.7,
    sy: 0.2,
    sw: 0.18,
    sh: 0.26,
    amp: 1.3
  }, {
    dx: 0.86,
    dy: 0.44,
    dw: 0.13,
    dh: 0.22,
    sx: 0.78,
    sy: 0.4,
    sw: 0.16,
    sh: 0.28,
    amp: 1.1
  }, {
    dx: 0.82,
    dy: 0.66,
    dw: 0.15,
    dh: 0.18,
    sx: 0.66,
    sy: 0.6,
    sw: 0.2,
    sh: 0.24,
    amp: 1.5
  }, {
    dx: 0.8,
    dy: 0.34,
    dw: 0.08,
    dh: 0.14,
    sx: 0.62,
    sy: 0.3,
    sw: 0.1,
    sh: 0.18,
    amp: 1.6
  }, {
    dx: 0.92,
    dy: 0.3,
    dw: 0.07,
    dh: 0.1,
    sx: 0.84,
    sy: 0.28,
    sw: 0.1,
    sh: 0.14,
    amp: 1.7
  }, {
    dx: 0.55,
    dy: 0.85,
    dw: 0.05,
    dh: 0.05,
    sx: 0.5,
    sy: 0.76,
    sw: 0.16,
    sh: 0.18,
    amp: 1.3
  }, {
    dx: 0.72,
    dy: 0.88,
    dw: 0.1,
    dh: 0.12,
    sx: 0.62,
    sy: 0.72,
    sw: 0.18,
    sh: 0.2,
    amp: 1.2
  }, {
    dx: 0.88,
    dy: 0.84,
    dw: 0.11,
    dh: 0.14,
    sx: 0.8,
    sy: 0.74,
    sw: 0.14,
    sh: 0.2,
    amp: 1.4
  }],
  zt = [{
    dx: -0.06,
    dy: 0.12,
    dw: 0.2,
    dh: 0.13,
    sx: 0.05,
    sy: 0.1,
    sw: 0.22,
    sh: 0.16,
    amp: 1.3
  }, {
    dx: -0.04,
    dy: 0.32,
    dw: 0.17,
    dh: 0.12,
    sx: 0.14,
    sy: 0.3,
    sw: 0.2,
    sh: 0.16,
    amp: 1.5
  }, {
    dx: -0.07,
    dy: 0.52,
    dw: 0.22,
    dh: 0.14,
    sx: 0.08,
    sy: 0.5,
    sw: 0.24,
    sh: 0.18,
    amp: 1.2
  }, {
    dx: -0.03,
    dy: 0.71,
    dw: 0.16,
    dh: 0.12,
    sx: 0.18,
    sy: 0.68,
    sw: 0.2,
    sh: 0.16,
    amp: 1.6
  }, {
    dx: 0.86,
    dy: 0.1,
    dw: 0.22,
    dh: 0.14,
    sx: 0.72,
    sy: 0.1,
    sw: 0.24,
    sh: 0.18,
    amp: 1.3
  }, {
    dx: 0.9,
    dy: 0.3,
    dw: 0.18,
    dh: 0.12,
    sx: 0.66,
    sy: 0.3,
    sw: 0.2,
    sh: 0.16,
    amp: 1.5
  }, {
    dx: 0.85,
    dy: 0.5,
    dw: 0.22,
    dh: 0.15,
    sx: 0.7,
    sy: 0.5,
    sw: 0.24,
    sh: 0.2,
    amp: 1.2
  }, {
    dx: 0.9,
    dy: 0.72,
    dw: 0.17,
    dh: 0.12,
    sx: 0.76,
    sy: 0.68,
    sw: 0.2,
    sh: 0.16,
    amp: 1.6
  }, {
    dx: 0.16,
    dy: 0,
    dw: 0.17,
    dh: 0.09,
    sx: 0.3,
    sy: 0.02,
    sw: 0.2,
    sh: 0.12,
    amp: 1.4
  }, {
    dx: 0.54,
    dy: 0.005,
    dw: 0.17,
    dh: 0.09,
    sx: 0.54,
    sy: 0.02,
    sw: 0.2,
    sh: 0.12,
    amp: 1.4
  }, {
    dx: 0.2,
    dy: 0.9,
    dw: 0.16,
    dh: 0.09,
    sx: 0.32,
    sy: 0.74,
    sw: 0.2,
    sh: 0.14,
    amp: 1.3
  }, {
    dx: 0.56,
    dy: 0.9,
    dw: 0.17,
    dh: 0.09,
    sx: 0.56,
    sy: 0.74,
    sw: 0.2,
    sh: 0.14,
    amp: 1.3
  }],
  Zt = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map(s => s.map(c => (c + 0.5) / 16)),
  Je = 3,
  Kt = 0.2,
  Jt = 0.3;
function Ie(s, c) {
  const h = document.createElement("canvas");
  h.width = s.naturalWidth, h.height = s.naturalHeight;
  const w = h.getContext("2d");
  w.drawImage(s, 0, 0);
  const R = w.getImageData(0, 0, h.width, h.height),
    E = R.data;
  for (let l = 0; l < E.length; l += 4) c !== 0 && (E[l] = 0), c !== 1 && (E[l + 1] = 0), c !== 2 && (E[l + 2] = 0);
  return w.putImageData(R, 0, 0), h;
}
function Qt(s, c) {
  return ((Math.imul(s, 73856093) ^ Math.imul(c, 19349663)) >>> 0) % 997 / 997;
}
function Es({
  image: s,
  progress: c,
  originRef: h,
  mobile: w = !1,
  className: R = "craft-glitch"
}) {
  const E = React.useRef(null),
    l = React.useRef({
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5
    }),
    i = React.useRef(c);
  i.current = c;
  const u = React.useRef(h);
  u.current = h;
  const b = React.useRef(w);
  return b.current = w, React.useEffect(() => {
    const m = E.current;
    if (!m) return;
    const t = m.getContext("2d");
    t.imageSmoothingEnabled = !1;
    const x = document.createElement("canvas"),
      N = x.getContext("2d", {
        willReadFrequently: !0
      });
    let I = null,
      T = 0,
      p = !1;
    const o = () => Math.min(window.devicePixelRatio || 1, 2),
      S = H => {
        const O = m.getBoundingClientRect();
        l.current.tx = Math.min(1, Math.max(0, (H.clientX - O.left) / O.width)), l.current.ty = Math.min(1, Math.max(0, (H.clientY - O.top) / O.height));
      },
      P = H => {
        var re, Z;
        if (p) return;
        T = requestAnimationFrame(P);
        const O = Math.max(1, Math.floor(m.clientWidth * o())),
          L = Math.max(1, Math.floor(m.clientHeight * o()));
        (m.width !== O || m.height !== L) && (m.width = O, m.height = L, t.imageSmoothingEnabled = !1);
        const V = Math.max(1, Math.round(m.clientWidth / Je)),
          $ = Math.max(1, Math.round(m.clientHeight / Je));
        if ((x.width !== V || x.height !== $) && (x.width = V, x.height = $), t.clearRect(0, 0, m.width, m.height), !I) return;
        const k = Math.min(1, Math.max(0, ((re = i.current) == null ? void 0 : re.current) ?? 1)),
          D = Math.min(1, Math.max(0, (k - Kt) / Jt));
        if (D <= 0) return;
        const g = Math.min(1, D / 0.25),
          _ = Math.min(1, Math.max(0, (D - 0.15) / 0.85)),
          M = _ * _ * (3 - 2 * _),
          f = 1 + (1 - M) * 4;
        let v = 0.5,
          d = 0.5,
          a = 0.28,
          y = 0.16;
        const C = (Z = u.current) == null ? void 0 : Z.current;
        if (C) {
          const F = C.getBoundingClientRect(),
            G = m.getBoundingClientRect();
          G.width && G.height && (v = (F.left + F.width / 2 - G.left) / G.width, d = (F.top + F.height / 2 - G.top) / G.height, a = F.width / G.width / 2, y = F.height / G.height / 2);
        }
        const A = 4,
          X = 3,
          B = l.current;
        B.x += (B.tx - B.x) * 0.08, B.y += (B.ty - B.y) * 0.08, N.clearRect(0, 0, V, $), N.globalCompositeOperation = "lighter";
        const U = H / 1e3,
          [j, z, ne] = I,
          se = b.current ? zt : qt;
        for (let F = 0; F < se.length; F++) {
          const G = se[F],
            Y = F % A,
            K = Math.floor(F / A) % X,
            J = 2 * a / A,
            Q = 2 * y / X,
            ee = v - a + (Y + 0.5) * J,
            te = d - y + (K + 0.5) * Q,
            Et = G.dx + G.dw / 2,
            Rt = G.dy + G.dh / 2,
            Ye = ee + (Et - ee) * M,
            Xe = te + (Rt - te) * M,
            bt = J * 0.96 + (G.dw - J * 0.96) * M,
            jt = Q * 0.96 + (G.dh - Q * 0.96) * M,
            fe = bt * V,
            he = jt * $,
            we = Ye * V - fe / 2,
            Ee = Xe * $ - he / 2,
            Re = Math.max(0, 1 - Math.hypot(Ye - B.x, Xe - B.y) * 1.6),
            be = G.amp * (0.3 + Re * 1.4),
            je = (Math.sin(U * 2.1 + F * 1.7) * 1.2 * be + (B.x - 0.5) * 9 * Re) * f,
            Ne = Math.cos(U * 1.7 + F * 2.3) * 0.8 * be * f,
            qe = ((0.8 + Math.sin(U * 3 + F) * 0.6) * be + Re * 5) * f,
            Te = G.sx * j.width,
            Me = G.sy * j.height,
            Se = G.sw * j.width,
            Ae = G.sh * j.height;
          N.drawImage(j, Te, Me, Se, Ae, we + je - qe, Ee + Ne, fe, he), N.drawImage(z, Te, Me, Se, Ae, we + je, Ee + Ne, fe, he), N.drawImage(ne, Te, Me, Se, Ae, we + je + qe, Ee + Ne, fe, he);
        }
        N.globalCompositeOperation = "source-over";
        const W = N.getImageData(0, 0, V, $),
          q = W.data;
        for (let F = 0; F < $; F++) {
          const G = Zt[F & 3];
          for (let Y = 0; Y < V; Y++) {
            const K = (F * V + Y) * 4;
            if (q[K + 3] === 0) continue;
            if (g <= Qt(Y, F)) {
              q[K + 3] = 0;
              continue;
            }
            const J = G[Y & 3],
              Q = q[K] / 255 > J ? 255 : 0,
              ee = q[K + 1] / 255 > J ? 255 : 0,
              te = q[K + 2] / 255 > J ? 255 : 0;
            q[K] = Q, q[K + 1] = ee, q[K + 2] = te, q[K + 3] = Q || ee || te ? 255 : 0;
          }
        }
        N.putImageData(W, 0, 0), t.drawImage(x, 0, 0, m.width, m.height);
      },
      r = new Image();
    return r.crossOrigin = "anonymous", r.onload = () => {
      p || (I = [Ie(r, 0), Ie(r, 1), Ie(r, 2)]);
    }, r.onerror = () => console.warn(`GlitchShards: source image failed to load (${s})`), r.src = s, canHover() && window.addEventListener("pointermove", S), T = requestAnimationFrame(P), () => {
      p = !0, cancelAnimationFrame(T), window.removeEventListener("pointermove", S);
    };
  }, [s]), <canvas ref={E} className={R} aria-hidden="true" />;
}
const ts = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map(s => s.map(c => (c + 0.5) / 16)),
  ss = 500;
function Qe(s) {
  const c = s.replace("#", "");
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
}
function CraftVideo({
  video: s,
  accent: c,
  darkColor: h = "#000000",
  lightColor: w = "#ffffff",
  staticPoster: R
}) {
  const [E, l] = React.useState(!1),
    [i, u] = React.useState(!1),
    b = React.useRef(null),
    m = React.useRef(null),
    t = React.useRef(null),
    x = React.useRef(null),
    N = React.useRef(null),
    I = React.useRef(null);
  return React.useEffect(() => {
    const T = b.current;
    if (!T || typeof IntersectionObserver > "u") {
      u(!0);
      return;
    }
    const p = new IntersectionObserver(([o]) => u(o.isIntersecting), {
      rootMargin: "200px 0px"
    });
    return p.observe(T), () => p.disconnect();
  }, []), React.useEffect(() => {
    var d, a, y;
    if (E || R || !i) {
      (a = (d = m.current) == null ? void 0 : d.pause) == null || a.call(d);
      return;
    }
    const T = t.current,
      p = m.current;
    if (!T || !p) return;
    const o = T.getContext("2d");
    o.imageSmoothingEnabled = !1, x.current || (x.current = document.createElement("canvas"));
    const S = x.current,
      P = S.getContext("2d", {
        willReadFrequently: !0
      }),
      [r, H, O] = Qe(h),
      [L, V, $] = Qe(w);
    let k = 0,
      D = !1;
    const g = () => Math.min(window.devicePixelRatio || 1, 2);
    !N.current && s.poster && (N.current = new Image(), N.current.src = s.poster);
    const _ = N.current;
    let M = "";
    const f = (C, A, X) => {
        const B = A / X,
          U = ss,
          j = Math.max(1, Math.round(U / B));
        (S.width !== U || S.height !== j) && (S.width = U, S.height = j);
        const z = Math.max(1, Math.floor(T.clientWidth * g())),
          ne = Math.max(1, Math.floor(T.clientHeight * g()));
        (T.width !== z || T.height !== ne) && (T.width = z, T.height = ne, o.imageSmoothingEnabled = !1), P.drawImage(C, 0, 0, U, j);
        const se = P.getImageData(0, 0, U, j),
          W = se.data;
        for (let q = 0; q < j; q++) {
          const re = ts[q & 3];
          for (let Z = 0; Z < U; Z++) {
            const F = (q * U + Z) * 4,
              Y = (W[F] * 0.299 + W[F + 1] * 0.587 + W[F + 2] * 0.114) / 255 > re[Z & 3];
            W[F] = Y ? L : r, W[F + 1] = Y ? V : H, W[F + 2] = Y ? $ : O, W[F + 3] = 255;
          }
        }
        P.putImageData(se, 0, 0), o.clearRect(0, 0, T.width, T.height), o.drawImage(S, 0, 0, T.width, T.height);
      },
      v = () => {
        if (D) return;
        if (k = requestAnimationFrame(v), p.readyState >= 2 && p.videoWidth) {
          M = "", f(p, p.videoWidth, p.videoHeight);
          return;
        }
        if (!(_ != null && _.complete) || !_.naturalWidth) return;
        const C = `${T.clientWidth}x${T.clientHeight}`;
        C !== M && (M = C, f(_, _.naturalWidth, _.naturalHeight));
      };
    return (y = p.play) == null || y.call(p).catch(() => {}), k = requestAnimationFrame(v), () => {
      D = !0, cancelAnimationFrame(k);
    };
  }, [E, R, i, h, w, s.poster]), React.useEffect(() => {
    var o, S, P;
    if (!E) return;
    (S = (o = m.current) == null ? void 0 : o.pause) == null || S.call(o);
    const T = (P = I.current) == null ? void 0 : P.querySelector("video");
    if (!T) return;
    const p = () => {
      var r;
      T.currentTime = 0, T.muted = !1, (r = T.play) == null || r.call(T).catch(() => {});
    };
    return T.readyState >= 1 ? p() : T.addEventListener("loadedmetadata", p, {
      once: !0
    }), () => T.removeEventListener("loadedmetadata", p);
  }, [E]), <div ref={b} className="craft-video" style={c ? {
    "--accent": c
  } : void 0}>{!E && <div className="craft-video__preview" key="preview">{R ? <img className="craft-video__poster" src={s.poster} alt="" aria-hidden="true" loading="lazy" decoding="async" /> : <><video ref={m} className="craft-video__source" src={s.src} poster={s.poster} muted={!0} loop={!0} playsInline={!0} preload="none" aria-hidden="true" /><canvas ref={t} className="craft-video__dither" style={{
          background: h
        }} aria-hidden="true" /></>}<button type="button" className="craft-video__play" onClick={() => l(!0)} aria-label="Play video"><svg viewBox="0 0 50 55" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M49.638,24.819l0,4.964l-2.482,0l0,2.482l-2.482,0l0,2.482l-4.964,0l0,2.482l-4.964,0l0,2.482l-2.482,0l0,2.482l-4.964,0l0,2.482l-4.964,0l0,2.482l-2.482,0l0,2.482l-4.964,0l0,2.482l-4.964,0l0,2.482l-7.446,0l0,-2.482l-2.482,0l0,-49.638l2.482,-0l0,-2.482l7.446,0l0,2.482l4.964,0l0,2.482l4.964,0l0,2.482l2.482,0l0,2.482l4.964,0l0,2.482l4.964,0l0,2.482l2.482,0l0,2.482l4.964,0l0,2.482l4.964,0l0,2.482l2.482,0l0,2.482l2.482,0Z" fill="currentColor" /></svg></button></div>}{E && <div ref={I} className="craft-video__player" key="player"><CaseVideoPlayerFrame video={{
        ...s,
        muted: !1,
        loop: !1
      }} accent={c} /></div>}</div>;
}
const rs = "/case/laselva/laselva-hero.webp",
  wt = "/home/videoposter.webp",
  as = {
    src: "/home/homehorizontal.mp4",
    poster: wt,
    ariaLabel: "MACACO showreel"
  },
  os = {
    src: "/home/homevertical.mp4",
    poster: wt,
    ariaLabel: "MACACO showreel"
  },
  cs = "#cfcfb6",
  is = "#080708",
  ls = [0.72];
function Craft() {
  const {
      t: s
    } = useTranslation(),
    c = React.useRef(null),
    h = React.useRef(null),
    w = oeCore(),
    R = ie(),
    E = useIsCoarsePointer(),
    l = R || E,
    i = Be(c);
  return We(c, ls, {
    resolve: !0
  }), <section ref={c} className="craft" aria-label={`${s("home.craftLine1", "WE CRAFT")} ${s("home.craftLine2", "INCREDIBLE THINGS")}`}><div className="craft__pin">{!l && <Es image={rs} progress={i} originRef={h} mobile={w} />}<div className="craft__frame" ref={h}><h2 className="craft__title craft-glitch-in" style={{
          "--s": 0,
          "--r": 0.15
        }}><span>{s("home.craftLine1", "WE CRAFT")}</span><span>{s("home.craftLine2", "INCREDIBLE THINGS")}</span></h2><span className="craft__readout craft-glitch-in" style={{
          "--s": 0.42,
          "--r": 0.12
        }}>{"show_reel"}{"{"}{"time!"}{"}"}</span><WCore src="barcode.svg" color="#0a0a0a" size="auto 100%" className="craft__barcode craft-glitch-in" style={{
          "--s": 0.48,
          "--r": 0.12
        }} /><span className="craft__comet craft-glitch-in" style={{
          "--s": 0.54,
          "--r": 0.12
        }} aria-hidden="true" /><div className="craft__video-wrap craft-glitch-in" style={{
          "--s": 0.2,
          "--r": 0.22
        }}><CraftVideo video={w ? os : as} accent="#feff00" darkColor={cs} lightColor={is} staticPoster={l} /></div></div></div></section>;
}
function TypeText({
  store: s,
  text: c,
  from: h = 0,
  to: w = 1
}) {
  const R = React.useRef(null),
    E = React.useRef(null);
  return React.useEffect(() => {
    const l = R.current,
      i = E.current;
    if (!l || !i) return;
    let u = -1,
      b = null;
    const m = t => {
      const x = Math.min(1, Math.max(0, (t - h) / Math.max(1e-4, w - h))),
        N = Math.round(x * c.length);
      N !== u && (l.textContent = c.slice(0, N), u = N);
      const I = x > 0 && x < 1;
      I !== b && (i.style.display = I ? "" : "none", b = I);
    };
    return m(s.p), s.subs.add(m), () => s.subs.delete(m);
  }, [s, c, h, w]), <span className="type-text" aria-label={c}><span className="type-text__ghost" aria-hidden="true">{c}</span><span className="type-text__live" aria-hidden="true"><span ref={R} /><span ref={E} className="type-text__cursor" style={{
        display: "none"
      }} /></span></span>;
}
const et = [0.25, 0.55],
  tt = [0.32, 0.6],
  st = [0.55, 0.85],
  nt = [0.65, 0.95],
  us = [0.9, 1];
function CaseCard({
  item: s,
  pageIndex: c = 0,
  onCardMount: h,
  onCardUnmount: w,
  onLensEnter: R,
  onLensMove: E,
  onLensLeave: l,
  onHoverEnter: i,
  onHoverLeave: u
}) {
  const {
      lang: b
    } = useParams(),
    [m, t] = React.useState(!1),
    [x, N] = React.useState(!1),
    I = React.useRef(null),
    T = React.useRef(null),
    p = React.useRef(null);
  p.current || (p.current = {
    p: 0,
    subs: new Set()
  });
  const o = s.image && !m,
    S = React.useCallback(r => {
      const H = p.current;
      H.p !== r && (H.p = r, H.subs.forEach(O => O(r)));
    }, []);
  React.useEffect(() => {
    const r = I.current;
    return h == null || h(r, s, N, S, c, o), () => w == null ? void 0 : w(r);
  }, [o, s, c, h, w, S]), React.useEffect(() => {
    const r = p.current,
      H = (L, [V, $]) => Math.min(1, Math.max(0, (L - V) / ($ - V))),
      O = L => {
        const V = T.current;
        V && (V.style.opacity = String(H(L, us)));
      };
    return O(r.p), r.subs.add(O), () => r.subs.delete(O);
  }, []);
  const P = p.current;
  return <article className="case-card" style={{
    "--accent": s.accent
  }} onPointerEnter={() => i == null ? void 0 : i(s)} onPointerLeave={() => u == null ? void 0 : u()}><AppLink to={`/${b}/projects/${s.slug}`} className="case-card__link"><header className="case-card__meta"><span><TypeText store={P} text={s.category} from={et[0]} to={et[1]} /></span><span><TypeText store={P} text={String(s.year)} from={tt[0]} to={tt[1]} /></span></header><div ref={I} className={`case-card__media${o && !x ? " case-card__media--veiled" : ""}`} onPointerEnter={o ? r => R == null ? void 0 : R(r.currentTarget, r.clientX, r.clientY) : void 0} onPointerMove={o ? r => E == null ? void 0 : E(r) : void 0} onPointerLeave={o ? () => l == null ? void 0 : l() : void 0}>{o ? <img src={s.image} alt={s.title} className={`case-card__img case-card__img--gl case-card__img--reveal${x ? " is-shown" : ""}`} loading="lazy" decoding="async" onError={() => t(!0)} /> : <><div className="case-card__img case-card__img--placeholder" aria-label={s.title}><span className="case-card__code">{s.code}</span><span className="case-card__ph-label">{"IMG"}</span></div><span className="case-card__dither" aria-hidden={!0} /></>}</div><footer className="case-card__foot"><h3 className="case-card__title"><TypeText store={P} text={s.title} from={st[0]} to={st[1]} /></h3><p className="case-card__excerpt"><TypeText store={P} text={s.excerpt} from={nt[0]} to={nt[1]} /></p><span ref={T} className="case-card__arrow" aria-hidden={!0} /></footer></AppLink></article>;
}
const hs = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`,
  ms = `
precision highp float;
uniform sampler2D uTex;
uniform vec2  uRes;      // card rect size, device px
uniform vec2  uOrigin;   // card rect origin (bottom-left), canvas device px
uniform vec2  uUvScale;  // cover-crop mapping
uniform vec2  uUvOffset;
uniform vec2  uMouse;    // hover cursor, 0..1 in card space, y up
uniform float uStrength; // hover lens strength
uniform float uTime;
uniform float uPixel;    // dither cell size, device px
uniform float uRadius;
uniform float uZoom;
uniform vec3  uAccent;
uniform vec3  uDark;
uniform float uProg;     // reveal progress 0..1

float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer8(vec2 p){
  float b4 = bayer2(0.25 * p) * 0.25 + bayer2(p);
  float b8 = bayer2(0.125 * p) * 0.0625 + b4;
  return (b8 * 63.0 + 0.5) / 64.0;
}
// Holographic thin-film palette, same as the intro's city glow / power aura.
vec3 irid(float t){ return 0.6 + 0.4 * cos(6.2831853 * (t + vec3(0.0, 0.33, 0.67))); }

// Reveal staging: the sweep covers the tile by SWEEP_END of the progress,
// the rest dissolves the dither into the real image.
const float SWEEP_END = 0.72;
const float EDGE = 0.55;

// Reveal and lens are ONE computation, not two branches: the cursor bubble
// locally raises the dither coverage (so hovering a half-revealed card
// materialises it under the pointer, iridescent, with the same bubble warp),
// while the REAL image only ever arrives through the global scroll resolve.
// At uProg 1 every reveal term collapses and the maths is exactly the legacy
// CaseGridLens; at uStrength 0 every lens term collapses and it is pure
// reveal.
void main(){
  vec2 frag = gl_FragCoord.xy - uOrigin;
  vec2 uv = frag / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 P = vec2(uv.x * aspect, uv.y);
  vec2 cell = floor(frag / uPixel);

  // ---- scroll reveal sweep ----
  float pSweep = min(1.0, uProg / SWEEP_END);
  float resolve = clamp((uProg - SWEEP_END) / (1.0 - SWEEP_END), 0.0, 1.0);
  float yn = 1.0 - uv.y;                                   // 0 at tile top
  float local = clamp((pSweep * (1.0 + EDGE) - yn) / EDGE, 0.0, 1.0);

  // The sweep front is a travelling bubble: strongest mid-transition,
  // relaxing to zero as the tile resolves so the image lands undistorted.
  float fBub = local * (1.0 - local) * 4.0 * (1.0 - resolve);
  float frontY = 1.0 - (pSweep * (1.0 + EDGE) - EDGE * 0.5); // front centre, gl y
  vec2 C = vec2(0.5 * aspect, frontY);
  float g = smoothstep(0.95, 0.0, distance(P, C)) * fBub;
  g *= 1.0 + 0.10 * sin(uTime * 2.1);

  // ---- hover lens bubble ----
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float dM = distance(P, m);
  float f = smoothstep(uRadius, 0.0, dM) * uStrength;
  f *= 1.0 + 0.045 * sin(uTime * 2.3);
  float lensMask = smoothstep(uRadius, uRadius * 0.30, dM) * uStrength;

  // Combined UV warp: both bubbles contribute their displacement.
  vec2 Pd = P + (C - P) * 0.42 * g + (m - P) * uZoom * f;
  vec2 tuv = clamp(vec2(Pd.x / aspect, Pd.y) * uUvScale + uUvOffset, 0.0, 1.0);
  vec3 col = texture2D(uTex, tuv).rgb;
  float lum = dot(col, vec3(0.299, 0.587, 0.114));

  // Luminous holographic dither: hue driven by luminance, position and
  // progress; the lum threshold is lifted so dark imagery still glows.
  float t = lum * 1.1 + uv.x * 0.10 + yn * 0.35 + uProg * 0.5 + uTime * 0.04;
  vec3 litC  = irid(t) * 0.78 + 0.24;
  vec3 darkC = irid(t + 0.12) * 0.38;
  vec3 dcolIrid = mix(darkC, litC, step(bayer8(cell), lum * 0.8 + 0.22));

  // Accent dither of the legacy lens.
  float lumL = smoothstep(0.12, 0.82, lum + 0.10 * f);
  vec3 dcolLens = mix(uDark, uAccent, step(bayer8(cell), lumL));

  // Coverage: the sweep OR the cursor bubble makes pixels exist; the real
  // image only shows through the global resolve, and the lens's accent
  // overlay applies only to resolved pixels.
  float cov = max(local, lensMask);
  float show = step(bayer8(cell + vec2(5.0, 41.0)), cov);
  float rmask = step(bayer8(cell + vec2(11.0, 53.0)), resolve);
  vec3 outc = mix(dcolIrid, col, rmask);
  outc = mix(outc, dcolLens, step(bayer8(cell + vec2(37.0, 19.0)), lensMask) * rmask);

  gl_FragColor = vec4(outc * show, show); // premultiplied
}
`,
  ps = 1,
  _s = 0.7,
  Xs = React.forwardRef(function ({
    className: c = "case-grid-fx",
    driven: h = !1
  }, w) {
    const R = React.useRef(null),
      E = React.useRef(new Map()),
      l = React.useRef(null);
    return React.useImperativeHandle(w, () => ({
      register(i, u, b, m, t) {
        var x;
        E.current.set(i, {
          src: u,
          accentRgb: Ta(b || "#feff00"),
          onReveal: m,
          onProgress: t,
          revealed: !1,
          p: 0,
          extP: 0,
          lastP: 0,
          holdUntil: 0
        }), m == null || m(!1), t == null || t(0), (x = l.current) == null || x.schedule();
      },
      unregister(i) {
        E.current.delete(i);
      },
      setProgress: (...i) => {
        var u, b;
        return (b = (u = l.current) == null ? void 0 : u.setProgress) == null ? void 0 : b.call(u, ...i);
      },
      enter: (...i) => {
        var u;
        return (u = l.current) == null ? void 0 : u.enter(...i);
      },
      move: (...i) => {
        var u;
        return (u = l.current) == null ? void 0 : u.move(...i);
      },
      leave: () => {
        var i;
        return (i = l.current) == null ? void 0 : i.leave();
      }
    }), []), React.useEffect(() => {
      const i = R.current;
      if (!i) return;
      const u = E.current,
        b = () => {
          var f, v;
          for (const d of u.values()) d.revealed || (d.revealed = !0, (f = d.onReveal) == null || f.call(d, !0)), d.lastP !== 1 && (d.lastP = 1, (v = d.onProgress) == null || v.call(d, 1));
        };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const f = (v, d) => {
          var C, A;
          const a = u.get(v);
          if (!a) return;
          a.lastP !== d && (a.lastP = d, (C = a.onProgress) == null || C.call(a, d));
          const y = d > 0.5;
          a.revealed !== y && (a.revealed = y, (A = a.onReveal) == null || A.call(a, y));
        };
        return l.current = {
          schedule: h ? () => {} : b,
          setProgress: f,
          enter() {},
          move() {},
          leave() {}
        }, h || b(), () => {
          l.current = null;
        };
      }
      const m = canHover();
      let t = null,
        x = null,
        N = !1,
        I = !1;
      const T = new Map();
      let p = null;
      const o = {
        hover: !1,
        k: 0,
        mx: 0.5,
        my: 0.5,
        tx: 0.5,
        ty: 0.5
      };
      let S = 0,
        P = !1;
      const r = performance.now(),
        H = () => Math.min(window.devicePixelRatio || 1, 1.75),
        O = () => {
          if (t = i.getContext("webgl", {
            antialias: !1,
            alpha: !0
          }), !t || t.isContextLost()) {
            t = null;
            return;
          }
          const f = (y, C) => {
              const A = t.createShader(y);
              return t.shaderSource(A, C), t.compileShader(A), !t.getShaderParameter(A, t.COMPILE_STATUS) && !t.isContextLost() && console.error("[case-grid-fx] shader error:", t.getShaderInfoLog(A)), A;
            },
            v = t.createProgram();
          t.attachShader(v, f(t.VERTEX_SHADER, hs)), t.attachShader(v, f(t.FRAGMENT_SHADER, ms)), t.linkProgram(v), t.useProgram(v);
          const d = t.createBuffer();
          t.bindBuffer(t.ARRAY_BUFFER, d), t.bufferData(t.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), t.STATIC_DRAW);
          const a = t.getAttribLocation(v, "aPos");
          t.enableVertexAttribArray(a), t.vertexAttribPointer(a, 2, t.FLOAT, !1, 0, 0), x = {};
          for (const y of ["uRes", "uOrigin", "uUvScale", "uUvOffset", "uMouse", "uStrength", "uTime", "uPixel", "uRadius", "uZoom", "uAccent", "uDark", "uProg", "uTex"]) x[y] = t.getUniformLocation(v, y);
          t.uniform3fv(x.uDark, [0.04, 0.04, 0.04]), t.uniform1i(x.uTex, 0), t.uniform1f(x.uRadius, 0.55), t.uniform1f(x.uZoom, 0.34), t.clearColor(0, 0, 0, 0), N = !0;
        },
        L = f => {
          let v = T.get(f);
          if (v) return v;
          const d = t.createTexture();
          t.bindTexture(t.TEXTURE_2D, d), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), v = {
            tex: d,
            w: 0,
            h: 0,
            ready: !1
          }, T.set(f, v);
          const a = new Image();
          return a.onload = () => {
            N && (v.w = a.naturalWidth, v.h = a.naturalHeight, t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !0), t.bindTexture(t.TEXTURE_2D, d), t.texImage2D(t.TEXTURE_2D, 0, t.RGB, t.RGB, t.UNSIGNED_BYTE, a), v.ready = !0, k());
          }, a.src = f, v;
        },
        V = (f, v) => Math.min(1, Math.max(0, (v * ps - f.top) / (v * _s))),
        $ = () => {
          var A, X, B;
          const f = performance.now(),
            v = window.innerHeight || 1;
          let d = !1;
          const a = new Map();
          for (const [U, j] of u) {
            const z = U.getBoundingClientRect();
            a.set(U, z), j.p = h ? j.extP : V(z, v), j.p !== j.lastP && (j.lastP = j.p, (A = j.onProgress) == null || A.call(j, j.p)), j.p >= 0.999 && !j.revealed ? (j.revealed = !0, j.holdUntil = f + 160, (X = j.onReveal) == null || X.call(j, !0)) : j.p < 0.98 && j.revealed && (j.revealed = !1, (B = j.onReveal) == null || B.call(j, !1)), (j.p > 1e-4 && j.p < 0.999 || f < j.holdUntil) && (d = !0);
          }
          p && !u.has(p) && (o.hover = !1, p = null), o.k += ((o.hover ? 1 : 0) - o.k) * 0.09, o.mx += (o.tx - o.mx) * 0.16, o.my += (o.ty - o.my) * 0.16;
          const y = o.hover || o.k > 0.004,
            C = d || y;
          if (C && !N && !I && (O(), N || (I = !0, h || b())), N && !t.isContextLost()) {
            const U = H(),
              j = Math.max(1, Math.floor(i.clientWidth * U)),
              z = Math.max(1, Math.floor(i.clientHeight * U));
            if ((i.width !== j || i.height !== z) && (i.width = j, i.height = z), t.disable(t.SCISSOR_TEST), t.viewport(0, 0, j, z), t.clear(t.COLOR_BUFFER_BIT), C) {
              const ne = i.getBoundingClientRect();
              t.enable(t.SCISSOR_TEST), t.uniform1f(x.uTime, (f - r) / 1e3);
              for (const [se, W] of u) {
                const q = p === se && y,
                  re = W.p > 1e-4 && W.p < 0.999 || f < W.holdUntil;
                if (!q && !re) continue;
                const Z = L(W.src);
                if (!Z.ready || !Z.w) continue;
                const F = a.get(se);
                if (F.bottom < -50 || F.top > v + 50) continue;
                const G = Math.max(1, Math.round(F.width * U)),
                  Y = Math.max(1, Math.round(F.height * U)),
                  K = Math.round((F.left - ne.left) * U),
                  J = Math.round((ne.bottom - F.bottom) * U);
                t.viewport(K, J, G, Y), t.scissor(K, J, G, Y);
                const Q = Math.max(G / Z.w, Y / Z.h),
                  ee = Z.w * Q,
                  te = Z.h * Q;
                t.uniform2f(x.uRes, G, Y), t.uniform2f(x.uOrigin, K, J), t.uniform2f(x.uUvScale, G / ee, Y / te), t.uniform2f(x.uUvOffset, (ee - G) / 2 / ee, (te - Y) / 2 / te), t.uniform1f(x.uPixel, 3 * U), t.uniform3fv(x.uAccent, W.accentRgb), t.uniform1f(x.uProg, W.revealed ? 1 : W.p), t.uniform1f(x.uStrength, q ? o.k : 0), t.uniform2f(x.uMouse, o.mx, o.my), t.bindTexture(t.TEXTURE_2D, Z.tex), t.drawArrays(t.TRIANGLES, 0, 3);
              }
            }
          }
          d || y ? S = requestAnimationFrame($) : (o.k = 0, P = !1);
        },
        k = () => {
          P || (P = !0, S = requestAnimationFrame($));
        },
        D = (f, v, d) => {
          if (!m || !u.has(f)) return;
          const a = p !== f;
          p = f;
          const y = f.getBoundingClientRect();
          o.tx = (v - y.left) / Math.max(1, y.width), o.ty = 1 - (d - y.top) / Math.max(1, y.height), o.hover = !0, a && (o.k = 0, o.mx = o.tx, o.my = o.ty), k();
        },
        g = (f, v) => {
          if (!p) return;
          const d = p.getBoundingClientRect();
          o.tx = (f - d.left) / Math.max(1, d.width), o.ty = 1 - (v - d.top) / Math.max(1, d.height), o.hover = !0, k();
        },
        _ = () => {
          o.hover = !1, k();
        },
        M = (f, v) => {
          const d = u.get(f);
          !d || d.extP === v || (d.extP = v, k());
        };
      return l.current = {
        schedule: k,
        setProgress: M,
        enter: D,
        move: g,
        leave: _
      }, window.addEventListener("scroll", k, {
        passive: !0,
        capture: !0
      }), window.addEventListener("resize", k), k(), () => {
        var f;
        cancelAnimationFrame(S), P = !0, window.removeEventListener("scroll", k, {
          capture: !0
        }), window.removeEventListener("resize", k), l.current = null, t && ((f = t.getExtension("WEBGL_lose_context")) == null || f.loseContext());
      };
    }, [h]), <canvas ref={R} className={c} aria-hidden="true" />;
  }),
  Fe = ["ready_for_{awesomeness}", "loading_shader::dither[ok]", "render_pass::bayer_8x8", "sync_accent::#{hex}", "mount_case::{slug}", "operating_ocean{_yellow}", "starting_artificial{lms}"],
  rt = 42,
  gs = 360,
  vs = "  ",
  ys = 26;
function ws() {
  var s;
  return typeof window < "u" && ((s = window.matchMedia) == null ? void 0 : s.call(window, "(prefers-reduced-motion: reduce)").matches);
}
function CasesDecoStream({
  className: s,
  width: c = ys
}) {
  const h = React.useRef(null);
  return React.useEffect(() => {
    const w = h.current;
    if (!w) return;
    if (ws()) {
      w.textContent = Fe[0].padStart(c);
      return;
    }
    let R = " ".repeat(c),
      E = 0,
      l = 0,
      i;
    const u = m => {
        R = (R + m).slice(-c), w.textContent = R;
      },
      b = () => {
        const m = Fe[E % Fe.length];
        l < m.length ? (u(m[l]), l += 1, i = setTimeout(b, rt)) : (u(vs), E += 1, l = 0, i = setTimeout(b, gs));
      };
    return w.textContent = R, i = setTimeout(b, rt), () => clearTimeout(i);
  }, [c]), <span className={s} aria-hidden={!0}><span className="cases__deco-stream" ref={h} /><span className="cases__deco-caret" /></span>;
}
const at = 60,
  ot = 70,
  Rs = 110,
  ge = 0.42,
  xe = 0.68,
  bs = (ge + xe) / 2;
function js(s, c) {
  const h = [];
  for (let w = 0; w < s.length; w += c) h.push(s.slice(w, w + c));
  return h;
}
function Ns(s, c) {
  return s <= 0 ? 0 : s < ge ? s / ge : c || s < xe ? 1 : Math.max(0, 1 - (s - xe) / (1 - xe));
}
function CasesTrack() {
  const {
      lang: s
    } = useParams(),
    {
      t: c
    } = useTranslation(),
    h = React.useMemo(() => Yn(s), [s]),
    w = oeCore(),
    R = useCanHover(),
    E = React.useMemo(() => js(h, w ? 1 : 2), [h, w]),
    l = React.useRef(null),
    i = React.useRef(null),
    u = React.useRef([]),
    b = React.useRef(null),
    m = React.useRef(new Map()),
    t = React.useRef(0),
    x = React.useRef(null),
    N = React.useCallback((a, y, C, A, X, B) => {
      var j, z;
      const U = {
        pageIndex: X,
        hasImage: B,
        onProgress: A
      };
      m.current.set(a, U), B && ((j = l.current) == null || j.register(a, y.image, y.accent, C, A)), (z = x.current) == null || z.call(x, a, U, t.current);
    }, []),
    I = React.useCallback(a => {
      var y;
      m.current.delete(a), (y = l.current) == null || y.unregister(a);
    }, []),
    T = React.useCallback((a, y, C) => {
      var A;
      return (A = l.current) == null ? void 0 : A.enter(a, y, C);
    }, []),
    p = React.useCallback(a => {
      var y;
      return (y = l.current) == null ? void 0 : y.move(a.clientX, a.clientY);
    }, []),
    o = React.useCallback(() => {
      var a;
      return (a = l.current) == null ? void 0 : a.leave();
    }, []),
    [S, P] = React.useState(null),
    {
      setAccent: r
    } = useAccent(),
    H = React.useCallback(a => {
      P(a.accent), r(a.accent);
    }, [r]),
    O = React.useCallback(() => {
      P(null), r(null);
    }, [r]);
  React.useEffect(() => () => r(null), [r]), React.useEffect(() => {
    R || (P(null), r(null));
  }, [R, r]);
  const L = E.length,
    V = at + ot + L * Rs,
    $ = at / V,
    k = ot / V,
    D = $ + k,
    g = (1 - D) / L,
    _ = `${100 + V}svh`,
    M = React.useCallback((a, y) => (a - D - y * g) / g, [D, g]),
    f = React.useCallback((a, y, C) => {
      var X;
      const A = Ns(M(C, y.pageIndex), y.pageIndex === L - 1);
      y.hasImage ? (X = l.current) == null || X.setProgress(a, A) : y.onProgress(A);
    }, [M, L]);
  x.current = f, u.current.length = L;
  const v = React.useCallback(a => {
    t.current = a;
    for (const [C, A] of m.current) f(C, A, a);
    b.current && (b.current.style.pointerEvents = a >= D - 0.001 ? "auto" : "none");
    const y = L - 1;
    u.current.forEach((C, A) => {
      if (!C) return;
      const X = M(a, A),
        B = X > ge * 0.6 && (A === y || X < 1);
      C.style.pointerEvents = B ? "auto" : "none";
    });
  }, [f, M, L, D]);
  Be(i, v);
  const d = React.useMemo(() => [D, ...Array.from({
    length: L
  }, (a, y) => D + (y + bs) * g)], [D, g, L]);
  return We(i, d, {
    resolve: !0
  }), <section className={`cases${S ? " cases--accent" : ""}`} style={{
    "--accent": S || "#ffffff"
  }} aria-labelledby="cases-title"><div className="cases__track" ref={i} style={{
      height: _
    }}><div className="cases__pin"><div className="cases__headline"><h2 id="cases-title" className="cases__title craft-glitch-in" style={{
            "--s": 0,
            "--r": ($ * 0.55).toFixed(4)
          }}>{c("home.featured", "Featured Works")}</h2><div className="cases__deco craft-glitch-in" style={{
            "--s": ($ * 0.4).toFixed(4),
            "--r": ($ * 0.5).toFixed(4)
          }} aria-hidden="true"><span className="cases__deco-line" /><CasesDecoStream className="cases__deco-readout" /></div></div><div className="cases__frame" style={{
          "--fs": $.toFixed(4),
          "--fr": k.toFixed(4)
        }}><span className="cases__fr cases__fr--top" aria-hidden="true" /><span className="cases__fr cases__fr--left" aria-hidden="true" /><span className="cases__fr cases__fr--right" aria-hidden="true" /><span className="cases__fr cases__fr--bot-l" aria-hidden="true" /><span className="cases__fr cases__fr--bot-r" aria-hidden="true" />{!w && <span className="cases__fr cases__fr--split" aria-hidden="true" />}<div className="cases__stage">{E.map((a, y) => <div className="cases__page" ref={C => {
              u.current[y] = C;
            }} key={a[0].slug}>{a.map(C => <CaseCard item={C} pageIndex={y} onCardMount={N} onCardUnmount={I} onLensEnter={T} onLensMove={p} onLensLeave={o} onHoverEnter={R ? H : void 0} onHoverLeave={R ? O : void 0} key={C.slug} />)}</div>)}<Xs ref={l} driven={!0} /></div><AppLink ref={b} to={`/${s}/projects`} className="cases__cta" style={{
            pointerEvents: "none"
          }}><span className="cases__cta-fill" aria-hidden="true" /><span className="cases__cta-label">{c("home.exploreProjects", "Explore Projects")}</span></AppLink></div></div></div></section>;
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
  ct = [{
    pos: [-4.2, 0.85, 0.1],
    look: [3.9, -0.85, 0],
    fov: 31.5
  }, {
    pos: [-0.95, 0.3, 0.1],
    look: [4, 0.25, -4],
    fov: 24
  }, {
    pos: [-1.95, 0.9, 0.55],
    look: [4, -1.45, 0.15],
    fov: 12
  }, {
    pos: [-1.45, 0.4, 0.4],
    look: [4, 0.6, 0.05],
    fov: 21
  }],
  Os = [{
    pos: [-9.03, 3.15, 0.2],
    look: [1.17, -0.4, 0],
    fov: 15
  }, {
    pos: [-0.75, 0.4, 0.65],
    look: [1.2, -0.05, -4],
    fov: 24
  }, {
    pos: [-2, 0.85, 2.4],
    look: [1.3, -0.45, -0.25],
    fov: 12
  }, {
    pos: [-0.75, 0.65, 0.72],
    look: [1.2, 0.32, 0.05],
    fov: 21
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
    pos: [0.6, 0.3, -1.2]
  }, {
    key: "h2",
    shot: 0,
    side: "left",
    color: "#7F3AEF",
    icon: oe.craft,
    pos: [0.19, 0.1, -1.1]
  }, {
    key: "h3",
    shot: 1,
    side: "right",
    color: "#A9FF00",
    icon: oe.strategy,
    pos: [1.45, -0.6, 0.55]
  }, {
    key: "h4",
    shot: 1,
    side: "right",
    color: "#5372FF",
    icon: oe.technology,
    pos: [-0.2, 0.25, 0.45]
  }, {
    key: "h5",
    shot: 2,
    side: "right",
    color: "#7F3AEF",
    icon: oe.innovation,
    pos: [1, 0.5, 0.55]
  }, {
    key: "h6",
    shot: 2,
    side: "left",
    color: "#7FFFFF",
    icon: oe.delivery,
    pos: [-0.5, 0.5, 0.28]
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
    const _ = Bn(),
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
    N = ie(),
    I = useCanHover();
  React.useEffect(() => {
    I || i();
  }, [I, i]);
  const [, T] = React.useState(0);
  React.useCallback(() => T(g => g + 1), []);
  const p = React.useMemo(() => Math.min(typeof window < "u" && window.devicePixelRatio || 1, isCoarsePointer() ? Bs : Gs), []),
    o = N ? Os : ct,
    S = ct.length - 1,
    P = it + S * lt + dt + Pn,
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
  }, (g, _) => r + (_ + Us) * H), O + L * Ls, O + L + Vs * Pn / P], [r, H, S, O, L, P]);
  return We(c, D, {
    resolve: !0,
    range: 0.3
  }), React.useCallback(g => {
    const _ = c.current;
    if (!_) return;
    const M = D[Math.max(0, Math.min(D.length - 1, g))];
    Aa({
      top: getOffsetTop(_) + M * (_.offsetHeight - getViewportHeight()),
      behavior: "auto"
    });
  }, [D]), <section className="rstage" aria-labelledby="rstage-title"><div className="rstage__track" ref={c} style={{
      height: $
    }}><div className="rstage__pin" ref={h} data-hot="0"><span className="rstage__bgico" aria-hidden="true" /><div className="rstage__frame" aria-hidden="true"><span className="rstage__fr rstage__fr--top" /><span className="rstage__fr rstage__fr--left" /><span className="rstage__fr rstage__fr--right" /><span className="rstage__fr rstage__fr--diag" /><span className="rstage__fr rstage__fr--bot" /><span className="rstage__cols" /><span className="rstage__logo" /><span className="rstage__blip" /><CodelineGhost className="rstage__code" text={s("home.stage.code", "initialize_core_analysis")} /><span className="rstage__ready">{s("home.stage.ready", "system_ready")}</span></div><div className="rstage__canvas craft-glitch-in" style={{
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
const _e = "/loading",
  ft = "Ludens Sagl 2026",
  ht = 4;
function StripSegment() {
  return <div className="mcf-strip__segment" aria-hidden="true"><span className="mcf-strip__jp">{"みらい"}</span><span className="mcf-strip__text">{ft}</span><span className="mcf-strip__icon mcf-strip__star" style={{
      "--m": `url('${_e}/singlestar-black.svg')`
    }} /><span className="mcf-strip__icon mcf-strip__line" style={{
      "--m": `url('${_e}/singleline-black.svg')`
    }} /><span className="mcf-strip__icon mcf-strip__arrow" style={{
      "--m": `url('${_e}/double-arrow.svg')`
    }} /><span className="mcf-strip__text">{ft}</span><span className="mcf-strip__icon mcf-strip__hazard" style={{
      "--m": `url('${_e}/hazard-stripe-outline.svg')`
    }} /></div>;
}
function Strip() {
  return <div className="mcf-strip" aria-hidden="true"><div className="mcf-strip__track" style={{
      "--copies": ht
    }}>{Array.from({
        length: ht
      }, (s, c) => <StripSegment key={c} />)}</div></div>;
}
const mt = "macaco:yellow-nav",
  zs = 0.1,
  Zs = 5e-4,
  Ks = SOCIAL_LINKS,
  pt = "info@studiomacaco.ch",
  _t = "+41 091 261 49 84",
  Js = ["Ludens Sagl", "Via Pestariso 5", "6982, Agno, Ticino Switzerland", "CHE-397.368.770"],
  de = s => s < 0 ? 0 : s > 1 ? 1 : s;
function Mcf() {
  const {
      t: s
    } = useTranslation(),
    {
      lang: c
    } = useParams(),
    h = React.useRef(null),
    w = React.useRef(null),
    R = React.useRef(null),
    E = React.useRef(null),
    l = React.useRef(null),
    i = useMotionValue(0),
    [u, b] = React.useState(!1),
    m = ie(),
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
  }, []);
  const I = React.useCallback(() => {
    const p = w.current,
      o = l.current,
      S = R.current;
    if (!p || !o || !S) return;
    const P = p.getBoundingClientRect(),
      r = o.getBoundingClientRect();
    S.style.setProperty("--wm-x", `${(r.left - P.left).toFixed(1)}px`), S.style.setProperty("--wm-y", `${(r.top - P.top).toFixed(1)}px`), S.style.setProperty("--wm-w", `${r.width.toFixed(1)}px`), S.style.setProperty("--wm-h", `${r.height.toFixed(1)}px`);
  }, []);
  React.useLayoutEffect(() => {
    if (m) return;
    I();
    const p = new ResizeObserver(I);
    for (const o of [w.current, E.current, l.current]) o && p.observe(o);
    return () => p.disconnect();
  }, [I, m]), React.useEffect(() => {
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
    const D = ltCore(k);
    return () => {
      r && cancelAnimationFrame(r), D(), O && window.dispatchEvent(new CustomEvent(mt, {
        detail: !1
      }));
    };
  }, [i]);
  const T = `${Gn}svh`;
  return <footer className="mcf" ref={h} style={{
    "--mcf-track": T
  }}><div className="mcf__pin" ref={w} data-live="0"><div className="mcf__layers" ref={R} aria-hidden="true"><div className="mcf__field" />{u && !x && <DitherFill fill={i} className="mcf__cover" />}</div><div className="mcf__inner" ref={E}><span className="mcf__mark craft-glitch-in" style={{
          "--s": 0,
          "--r": 0.3
        }} aria-hidden="true" /><div className="mcf__top craft-glitch-in" style={{
          "--s": 0,
          "--r": 0.3
        }} aria-hidden="true"><span className="mcf__rail"><span className="mcf__topline" /><span className="mcf__star" /><span className="mcf__star" /></span><span className="mcf__jp">{"準備完了"}</span></div><div className="mcf__lead craft-glitch-in" style={{
          "--s": 0.14,
          "--r": 0.34
        }}><h2 className="mcf__headline">{s("footer.headline1", "Ready to build")}<br />{s("footer.headline2", "something bold?")}</h2><div className="mcf__contact"><AppLink to={`/${c}/contact`} className="mcf__cta">{s("footer.cta", "Contact us")}<span className="mcf__cta-arrow" aria-hidden="true" /></AppLink><p className="mcf__lines"><span><b>{"E."}</b>{" "}<a className="mcf__link" href={`mailto:${pt}`}>{pt}</a></span><span><b>{"P."}</b>{" "}<a className="mcf__link" href={`tel:${_t.replace(/\s/g, "")}`}>{_t}</a></span></p></div></div><div className="mcf__wordmark" ref={l} aria-hidden="true" /><dl className="mcf__meta craft-glitch-in" style={{
          "--s": 0.5,
          "--r": 0.32
        }}><dt className="mcf__label">{s("footer.social", "Social")}</dt><dd className="mcf__values"><span className="mcf__rule" aria-hidden="true" /><div className="mcf__row">{Ks.map(p => <a className="mcf__link" href={p.href} key={p.key}>{p.label}</a>)}</div></dd><dt className="mcf__label">{s("footer.legal", "Legal")}</dt><dd className="mcf__values"><span className="mcf__rule" aria-hidden="true" /><div className="mcf__row mcf__row--legal">{Js.map(p => <span key={p}>{p}</span>)}</div></dd></dl></div><Strip /></div></footer>;
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
  return <main className="home-content"><UseSeo lang={s} kind="home" /><h1 className="sr-only">{c}</h1><Craft /><CasesTrack /><Rstage /><Mcf /></main>;
}
export { HomeContent as default };
