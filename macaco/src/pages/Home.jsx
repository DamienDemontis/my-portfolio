import { DitherFill } from "../components/DitherFill.jsx";
import { ScenesTrack } from "../components/ScenesTrack.jsx";
import { SITE, SOCIAL_LINKS } from "../content/site.js";
import { useIsCoarsePointer } from "../lib/device.js";
import { getViewportHeight, onScroll } from "../lib/scroll.js";
import { ci, li, STAGE_HEIGHT_SVH } from "../lib/shared.js";
import { buildSeoData, UseSeo } from "../seo/Seo.jsx";
import '../styles/home.css';
import React from "react";
import { useParams } from "react-router-dom";
import { useIsTabletDown } from "../components/VideoPlayer.jsx";
import { useTranslation } from "react-i18next";
import { useMotionValue } from "framer-motion";
// Hauteur (svh) de la zone de recouvrement du pied de page, heritee de l'intro.
const si = 60;
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
  return <main className="home-content"><UseSeo lang={s} kind="home" /><h1 className="sr-only">{c}</h1><ScenesTrack /><Mcf /></main>;
}
export { HomeContent as default };
