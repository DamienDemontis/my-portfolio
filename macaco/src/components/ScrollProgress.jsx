// Barre de progression du scroll et bandeau de chargement.
import React from "react";
import { getMaxScroll, getScrollTop, onScroll } from "../lib/scroll.js";
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
    const c = onScroll(h);
    return () => {
      c(), o && window.cancelAnimationFrame(o);
    };
  }, [e]), <div className={`scroll-progress${e ? " is-visible" : ""}`} aria-hidden={!0}><div className="scroll-progress__bar" style={{
      transform: `scaleX(${i})`
    }} /></div>;
}
function StripSegment() {
  return <div className="ldg-strip__segment" aria-hidden="true"><span className="ldg-strip__text">{"ready_for_"}{"{"}{"awesomeness"}{"}"}</span><span className="ldg-strip__jp">{"つくる"}</span><span className="ldg-strip__jp">{"かえる"}</span></div>;
}
function Strip() {
  return <div className="ldg-strip" aria-hidden="true"><div className="ldg-strip__track"><StripSegment /><StripSegment /></div></div>;
}
function useMarquee(e, {
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
export { ScrollProgressBar, Strip, useMarquee };
