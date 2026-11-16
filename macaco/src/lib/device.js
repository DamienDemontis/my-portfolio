// Capacites du terminal : pointeur, survol, densite de pixels, paliers responsive.
import React from "react";
const COARSE_POINTER_QUERY = "(pointer: coarse)";
function isCoarsePointer() {
  return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia(COARSE_POINTER_QUERY).matches;
}
const na = 1.2;
const sa = 1;
const la = 0.6;
const ca = 1.5;
const da = 2;
const PIXEL_BUDGET = {
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
function cssPixelRatioFor(e = 0, i = 0, a = PIXEL_BUDGET.background) {
  return pixelRatioFor(e, i, a) / devicePixelRatioCapped();
}
function hexToRgbFloat(e) {
  const i = e.replace("#", "");
  return [parseInt(i.slice(0, 2), 16) / 255, parseInt(i.slice(2, 4), 16) / 255, parseInt(i.slice(4, 6), 16) / 255];
}
function useIsCoarsePointer() {
  const [e, i] = React.useState(isCoarsePointer);
  return React.useEffect(() => {
    const a = window.matchMedia(COARSE_POINTER_QUERY),
      o = () => i(a.matches);
    return o(), a.addEventListener("change", o), () => a.removeEventListener("change", o);
  }, []), e;
}
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
function canHover() {
  return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia(HOVER_QUERY).matches;
}
const We = {
  mobile: 760,
  tablet: 1025
};
const Ia = 500;
const za = 1025;
const Ra = 3e3;
const ASPECT_RATIOS = {
  narrow: [3, 2],
  wide: [18, 9]
};
const Ma = ([e, i]) => `${e} / ${i}`;
const MEDIA_QUERIES = {
  mobileDown: `(max-width: ${We.mobile}px)`,
  tabletDown: `(max-width: ${We.tablet}px)`,
  desktopUp: `(min-width: ${We.tablet + 1}px)`,
  narrowAspect: `(max-aspect-ratio: ${Ma(ASPECT_RATIOS.narrow)})`
};
const NARROW_ASPECT_QUERY = MEDIA_QUERIES.narrowAspect;
function hexToRgb01(e) {
  const i = e.replace("#", "");
  return [parseInt(i.slice(0, 2), 16) / 255, parseInt(i.slice(2, 4), 16) / 255, parseInt(i.slice(4, 6), 16) / 255];
}
const eo = ASPECT_RATIOS.wide[0] / ASPECT_RATIOS.wide[1];
const NARROW_ASPECT_RATIO = ASPECT_RATIOS.narrow[0] / ASPECT_RATIOS.narrow[1];
function readViewportTier() {
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
  return a < Ia ? n = "mobile" : o >= eo ? n = "ultrawide" : e >= Ra ? n = "xl" : a < za && o <= NARROW_ASPECT_RATIO ? n = "tablet" : n = "base", {
    tier: n,
    orient: s
  };
}
function useViewportTier() {
  const [e, i] = React.useState(readViewportTier);
  return React.useEffect(() => {
    const a = () => i(o => {
      const s = readViewportTier();
      return s.tier === o.tier && s.orient === o.orient ? o : s;
    });
    return a(), window.addEventListener("resize", a), window.addEventListener("orientationchange", a), () => {
      window.removeEventListener("resize", a), window.removeEventListener("orientationchange", a);
    };
  }, []), e;
}
export { HOVER_QUERY, MEDIA_QUERIES, NARROW_ASPECT_QUERY, PIXEL_BUDGET, canHover, cssPixelRatioFor, hexToRgb01, hexToRgbFloat, isCoarsePointer, pixelRatioFor, useIsCoarsePointer, useViewportTier };
