// Curseur personnalise (point + anneau).
import { motion } from "framer-motion";
import React from "react";
function Cursor() {
  const e = React.useRef(null),
    i = React.useRef(null),
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
        m = i.current;
      if (c && (c.style.transform = `translate(${o.current.x}px, ${o.current.y}px) translate(-50%, -50%)`), m) {
        const A = n.current ? 1.9 : 1;
        m.style.transform = `translate(${s.current.x}px, ${s.current.y}px) translate(-50%, -50%) scale(${A}) rotate(45deg)`, m.style.borderColor = n.current ? "var(--mc-cyan)" : "var(--mc-accent)";
      }
      l = requestAnimationFrame(h);
    };
    return l = requestAnimationFrame(h), () => {
      window.removeEventListener("pointermove", d), cancelAnimationFrame(l);
    };
  }, []), <><div ref={e} className="mc-cursor mc-cursor--dot" aria-hidden={!0} /><div ref={i} className="mc-cursor mc-cursor--ring" aria-hidden={!0} /></>;
}
export { Cursor };
