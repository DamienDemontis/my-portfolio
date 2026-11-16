import React from "react";
const f = 0.5;
function d(s) {
  const o = s.textContent.trim();
  if (!o) return 0;
  const t = getComputedStyle(s),
    e = document.createElement("span");
  e.setAttribute("aria-hidden", "true"), e.style.cssText = "position:absolute;left:-99999px;top:0;white-space:pre;visibility:hidden;", e.style.fontFamily = t.fontFamily, e.style.fontSize = t.fontSize, e.style.fontWeight = t.fontWeight, e.style.fontStyle = t.fontStyle, e.style.letterSpacing = t.letterSpacing, e.style.textTransform = t.textTransform, document.body.appendChild(e);
  let n = 0;
  for (const r of o.split(/\s+/)) e.textContent = r, n = Math.max(n, e.getBoundingClientRect().width);
  return e.remove(), n;
}
function useFitHeading(s) {
  const o = React.useRef(null);
  return React.useLayoutEffect(() => {
    var r;
    const t = o.current;
    if (!t) return;
    const e = () => {
      t.style.setProperty("--fit-scale", "1");
      const i = t.clientWidth;
      if (!i) return;
      const c = d(t),
        l = c > i ? Math.max(f, i / c * 0.995) : 1;
      t.style.setProperty("--fit-scale", l === 1 ? "1" : l.toFixed(3));
    };
    e(), (r = document.fonts) != null && r.ready && document.fonts.ready.then(e).catch(() => {});
    const n = new ResizeObserver(e);
    return n.observe(t), t.parentElement && n.observe(t.parentElement), () => {
      n.disconnect(), t.style.removeProperty("--fit-scale");
    };
  }, [s]), o;
}
export { useFitHeading };
