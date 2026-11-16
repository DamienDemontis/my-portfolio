import React from "react";
import { CaseVideoPlayerFrame, Q as QCore } from "./CaseVideoPlayer.jsx";
import { ka } from "../../app-core.jsx";
import { useFitHeading } from "../../hooks/useFitHeading.js";
function A({
  children: e
}) {
  const a = QCore(ka.desktopUp),
    t = QCore("(prefers-reduced-motion: reduce)"),
    o = a && !t,
    d = React.useRef(null),
    [f, h] = React.useState(!1);
  return React.useEffect(() => {
    if (!o || f) return;
    const b = d.current;
    if (!b) return;
    const p = new IntersectionObserver(([g]) => {
      g.isIntersecting && (h(!0), p.disconnect());
    }, {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08
    });
    return p.observe(b), () => p.disconnect();
  }, [o, f]), o ? <div ref={d} className={`case-reveal${f ? " is-in" : ""}`}>{e}</div> : <div>{e}</div>;
}
const K2 = React.lazy(() => import("../../three/CaseDeviceScene.jsx")),
  O = 2;
let M = null;
function T() {
  if (M !== null) return M;
  try {
    const e = document.createElement("canvas");
    M = !!(e.getContext("webgl2") || e.getContext("webgl"));
  } catch {
    M = !1;
  }
  return M;
}
function F() {
  const [e, a] = React.useState(!1);
  return React.useEffect(() => {
    const t = window.matchMedia(ka.desktopUp),
      o = window.matchMedia("(pointer: fine)"),
      d = window.matchMedia("(prefers-reduced-motion: reduce)"),
      f = () => {
        a(t.matches && o.matches && !d.matches && T());
      };
    return f(), t.addEventListener("change", f), o.addEventListener("change", f), d.addEventListener("change", f), () => {
      t.removeEventListener("change", f), o.removeEventListener("change", f), d.removeEventListener("change", f);
    };
  }, []), e;
}
function CaseDeviceShowcaseStage({
  devices: e = [],
  className: a = ""
}) {
  const t = React.useMemo(() => e.filter(c => c == null ? void 0 : c.src).slice(0, O), [e]),
    o = React.useRef(null),
    d = React.useRef({
      x: 0,
      y: 0
    }),
    f = React.useRef([]),
    [h, b] = React.useState(!1),
    [p, g] = React.useState(!1),
    n = F(),
    r = React.useMemo(() => typeof document > "u" ? [] : t.map(c => {
      const s = document.createElement("video");
      return s.src = c.src, s.muted = !0, s.loop = !0, s.playsInline = !0, s.preload = "auto", s.crossOrigin = "anonymous", c.poster && (s.poster = c.poster), s;
    }), [t]);
  if (React.useEffect(() => (g(r.length > 0), () => {
    for (const c of r) c.pause(), c.removeAttribute("src"), c.load(), c.remove();
  }), [r]), React.useEffect(() => {
    const c = o.current;
    if (!c) return;
    const s = new IntersectionObserver(([_]) => b(_.isIntersecting), {
      rootMargin: "200px 0px",
      threshold: 0.15
    });
    return s.observe(c), () => s.disconnect();
  }, []), React.useEffect(() => {
    const c = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const s of r) h && !c ? s.play().catch(() => {}) : s.pause();
  }, [h, r]), React.useEffect(() => {
    n || r.forEach((c, s) => {
      const _ = f.current[s];
      _ && c.parentNode !== _ && _.replaceChildren(c);
    });
  }, [n, r]), React.useEffect(() => {
    if (!n || !h) return;
    const c = s => {
      d.current.x = s.clientX / window.innerWidth * 2 - 1, d.current.y = s.clientY / window.innerHeight * 2 - 1;
    };
    return window.addEventListener("pointermove", c, {
      passive: !0
    }), () => window.removeEventListener("pointermove", c);
  }, [n, h]), !t.length) return null;
  const m = r.map((c, s) => ({
    key: `${t[s].src}-${s}`,
    videoEl: c
  }));
  return <section ref={o} className={`case-section case-device-showcase case-device-showcase--${t.length} ${n ? "is-webgl" : "is-flat"} ${a}`.trim()} aria-label="Product interface showcase"><div className="case-device-showcase__stage">{n && p ? <React.Suspense fallback={null}><K2 devices={m} pointerRef={d} active={h} /></React.Suspense> : <div className="case-device-showcase__flat">{t.map((c, s) => <figure className="case-device-showcase__frame" aria-label={c.alt || void 0} key={`${c.src}-${s}`}><span className="case-device-showcase__screen" ref={_ => {
            f.current[s] = _;
          }} /></figure>)}</div>}</div></section>;
}
function CaseSection({
  images: e = [],
  startIndex: a = 0
}) {
  const t = e.filter(l => l == null ? void 0 : l.src),
    [o, d] = React.useState(Math.min(Math.max(0, a), Math.max(0, t.length - 1))),
    [f, h] = React.useState(0),
    [b, p] = React.useState(!1),
    g = React.useRef(null),
    n = React.useRef(null),
    r = React.useRef({
      pointerId: null,
      startX: 0,
      startY: 0,
      dragging: !1
    });
  if (!t.length) return null;
  const m = l => {
      d((l + t.length) % t.length);
    },
    c = () => {
      r.current.pointerId = null, r.current.dragging = !1, p(!1), h(0);
    },
    s = () => {
      var j, N;
      const l = (j = g.current) == null ? void 0 : j.querySelector(".case-carousel__slide"),
        w = n.current ? window.getComputedStyle(n.current).columnGap || window.getComputedStyle(n.current).gap : "0",
        x = Number.parseFloat(w) || 0,
        R = (l == null ? void 0 : l.getBoundingClientRect().width) || ((N = g.current) == null ? void 0 : N.getBoundingClientRect().width) || 0;
      return {
        width: R,
        gap: x,
        span: R + x
      };
    },
    _ = l => {
      var w, x;
      t.length < 2 || l.isPrimary && (l.pointerType === "mouse" && l.button !== 0 || (r.current.pointerId = l.pointerId, r.current.startX = l.clientX, r.current.startY = l.clientY, r.current.dragging = !1, (x = (w = l.currentTarget).setPointerCapture) == null || x.call(w, l.pointerId)));
    },
    y = l => {
      var S, I;
      if (r.current.pointerId !== l.pointerId) return;
      const w = l.clientX - r.current.startX,
        x = l.clientY - r.current.startY;
      if (!r.current.dragging) {
        if (Math.abs(x) > Math.abs(w) && Math.abs(x) > 10) {
          (I = (S = l.currentTarget).releasePointerCapture) == null || I.call(S, l.pointerId), c();
          return;
        }
        if (Math.abs(w) < 6) return;
        r.current.dragging = !0, p(!0);
      }
      const {
          span: R
        } = s(),
        j = R > 0 ? R * 0.35 : 140,
        N = Math.max(-j, Math.min(j, w));
      h(N);
    },
    v = l => {
      var j, N;
      if (r.current.pointerId !== l.pointerId) return;
      const w = f,
        {
          span: x
        } = s(),
        R = Math.max(48, x * 0.14);
      (N = (j = l.currentTarget).releasePointerCapture) == null || N.call(j, l.pointerId), c(), Math.abs(w) >= R && m(o + (w < 0 ? 1 : -1));
    };
  return <section className="case-section case-carousel" aria-label="Project image carousel"><div ref={g} className="case-carousel__viewport" onPointerDown={_} onPointerMove={y} onPointerUp={v} onPointerCancel={v}><div ref={n} className={`case-carousel__track${b ? " is-dragging" : ""}`} style={{
        "--active-slide": o,
        "--drag-offset": `${f}px`
      }}>{t.map((l, w) => <figure className="case-carousel__slide" key={`${l.src}-${w}`}><img src={l.src} alt={l.alt || ""} loading="lazy" draggable="false" /></figure>)}</div></div>{t.length > 1 && <div className="case-carousel__controls"><button type="button" className="case-carousel__button" onClick={() => m(o - 1)} aria-label="Previous image"><img src="/general/carousel-arrow-left.svg" alt="" /></button><button type="button" className="case-carousel__button" onClick={() => m(o + 1)} aria-label="Next image"><img src="/general/carousel-arrow-right.svg" alt="" /></button></div>}</section>;
}
const U = 4;
function P(e) {
  if (typeof e != "string") return null;
  const [a, t = "1"] = e.split("/"),
    o = Number.parseFloat(a),
    d = Number.parseFloat(t);
  return !Number.isFinite(o) || !Number.isFinite(d) || d === 0 ? null : o / d;
}
function Y({
  image: e,
  ratio: a,
  index: t,
  onMeasure: o
}) {
  const d = React.useRef(null),
    [f, h] = React.useState(null),
    b = React.useCallback(m => {
      const {
        naturalWidth: c,
        naturalHeight: s
      } = m;
      c > 0 && s > 0 && (h({
        width: c,
        height: s
      }), o(t, c / s));
    }, [t, o]);
  React.useEffect(() => {
    const m = d.current;
    m != null && m.complete && b(m);
  }, [e.src, b]);
  const p = P(a),
    g = p ?? (f ? f.width / f.height : null),
    n = g !== null && g <= 1,
    r = {};
  return !p && f && n && (r["--item-ratio"] = `${f.width} / ${f.height}`), g !== null && (r["--item-ratio-value"] = g), <figure className={`case-image-grid__item ${n ? "is-tall" : ""}`} style={Object.keys(r).length ? r : void 0}><img ref={d} src={e.src} alt={e.alt || ""} loading="lazy" onLoad={m => b(m.currentTarget)} /></figure>;
}
function CaseImageGridInner({
  images: e = [],
  ratio: a
}) {
  const t = e.filter(g => g == null ? void 0 : g.src).slice(0, U),
    [o, d] = React.useState({}),
    f = React.useCallback((g, n) => {
      d(r => r[g] === n ? r : {
        ...r,
        [g]: n
      });
    }, []);
  if (!t.length) return null;
  const h = P(a),
    b = t.every((g, n) => {
      const r = h ?? o[n];
      return typeof r == "number" && r <= 1;
    }),
    p = {
      "--case-image-count": t.length
    };
  return a && (p["--case-image-ratio"] = a), <section className={`case-section case-image-grid case-image-grid--${t.length}${b ? " is-tall-row" : ""}`} style={p} aria-label="Project gallery"><div className="case-image-grid__inner">{t.map((g, n) => <Y image={g} ratio={a} index={n} onMeasure={f} key={`${g.src}-${n}`} />)}</div></section>;
}
function CaseSection2({
  image: e
}) {
  if (!e || !e.src) return null;
  const a = e.alt || "";
  return <section className="case-section case-image-single" aria-label="Project Single Image"><figure className="case-image-single__item"><img src={e.src} alt={a} loading="lazy" /></figure></section>;
}
function CaseSection3({
  title: e,
  text: a
}) {
  const t = useFitHeading(e);
  if (!e && !a) return null;
  const o = Array.isArray(a) ? a : a ? [a] : [];
  return <section className="case-section case-split-intro">{e && <h2 className="case-split-intro__title" ref={t}>{e}</h2>}{!!o.length && <div className="case-split-intro__body">{o.map((d, f) => <p key={f}>{d}</p>)}</div>}</section>;
}
const B = 4,
  Q = 16 / 9;
function E(e) {
  if (typeof e != "string") return null;
  const [a, t = "1"] = e.split("/"),
    o = Number.parseFloat(a),
    d = Number.parseFloat(t);
  return !Number.isFinite(o) || !Number.isFinite(d) || d === 0 ? null : o / d;
}
function CaseVideoGridMedia({
  video: e,
  ratio: a,
  index: t,
  onMeasure: o
}) {
  const d = React.useRef(null),
    [f, h] = React.useState(null),
    [b, p] = React.useState(null);
  React.useEffect(() => {
    if (!(e != null && e.poster) || E(a) !== null) return;
    const s = new Image();
    let _ = !1;
    return s.onload = () => {
      const {
        naturalWidth: y,
        naturalHeight: v
      } = s;
      _ || !(y > 0 && v > 0) || (p({
        width: y,
        height: v
      }), o(t, y / v));
    }, s.src = e.poster, () => {
      _ = !0, s.onload = null;
    };
  }, [e == null ? void 0 : e.poster, a, t, o]), React.useEffect(() => {
    const s = d.current;
    if (!s || !(e != null && e.src)) return;
    s.muted = !0;
    const _ = window.matchMedia("(prefers-reduced-motion: reduce)"),
      y = () => {
        const {
          videoWidth: l,
          videoHeight: w
        } = s;
        l > 0 && w > 0 && (h({
          width: l,
          height: w
        }), o(t, l / w));
      };
    s.addEventListener("loadedmetadata", y);
    const v = new IntersectionObserver(([l]) => {
      if (!l.isIntersecting) {
        s.pause();
        return;
      }
      s.getAttribute("src") || s.setAttribute("src", e.src), _.matches || s.play().catch(() => {});
    }, {
      rootMargin: "200px 0px",
      threshold: 0.2
    });
    return v.observe(s), () => {
      v.disconnect(), s.removeEventListener("loadedmetadata", y);
    };
  }, [e == null ? void 0 : e.src, t, o]);
  const g = E(a),
    n = f ?? b,
    r = g ?? (n ? n.width / n.height : null),
    m = r !== null && r <= 1,
    c = {};
  return !g && n && m && (c["--item-ratio"] = `${n.width} / ${n.height}`), r !== null && (c["--item-ratio-value"] = r), <figure className={`case-video-grid__item ${m ? "is-tall" : ""}`} style={Object.keys(c).length ? c : void 0}><video ref={d} className="case-video-grid__media" poster={e.poster} preload="none" loop={!0} muted={!0} playsInline={!0} disablePictureInPicture={!0} aria-label={e.ariaLabel || e.alt || void 0} /></figure>;
}
function CaseVideoGridInner({
  videos: e = [],
  ratio: a
}) {
  const t = e.filter(n => n == null ? void 0 : n.src).slice(0, B),
    [o, d] = React.useState({}),
    f = React.useCallback((n, r) => {
      d(m => m[n] === r ? m : {
        ...m,
        [n]: r
      });
    }, []);
  if (!t.length) return null;
  const h = E(a),
    b = t.map((n, r) => h ?? o[r]).filter(n => typeof n == "number"),
    p = b.length > 0 && b.every(n => n <= 1),
    g = {
      "--case-video-count": t.length
    };
  return a && (g["--case-video-ratio"] = a, g["--case-video-ratio-value"] = h ?? Q), <section className={`case-section case-video-grid case-video-grid--${t.length}${p ? " is-tall-row" : ""}`} style={g} aria-label="Project video gallery"><div className="case-video-grid__inner">{t.map((n, r) => <CaseVideoGridMedia video={n} ratio={a} index={r} onMeasure={f} key={`${n.src}-${r}`} />)}</div></section>;
}
const K = {
  deviceShowcase: CaseDeviceShowcaseStage,
  imageCarousel: CaseSection,
  imageGrid: CaseImageGridInner,
  imageSingle: CaseSection2,
  splitIntro: CaseSection3,
  videoGrid: CaseVideoGridInner,
  videoPlayer: CaseVideoPlayerFrame
};
function CaseSections({
  sections: e = []
}) {
  return e.length ? <div className="case-sections">{e.map((a, t) => {
      const O2 = K[a.type];
      return O2 ? <A key={`${a.type}-${t}`}>{a.label && <p className="case-section__label">{`{${a.label}}`}</p>}<O2 {...a} /></A> : null;
    })}</div> : null;
}
export { CaseSections };
