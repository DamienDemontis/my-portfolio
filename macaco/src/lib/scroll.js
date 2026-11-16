// Le scroll se fait dans #scroll-root, pas sur le document : helpers de mesure et de defilement.
import React from "react";
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
function scrollRootTo(e) {
  getScrollRoot().scrollTo(e);
}
function scrollToTop() {
  getScrollRoot().scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });
}
function onScroll(e, {
  resize: i = !0
} = {}) {
  const a = getScrollRoot();
  return a.addEventListener("scroll", e, {
    passive: !0
  }), i && window.addEventListener("resize", e), () => {
    a.removeEventListener("scroll", e), i && window.removeEventListener("resize", e);
  };
}
function getScrollContainer() {
  const e = getScrollRoot();
  return e === document.documentElement || e === document.scrollingElement ? null : e;
}
const qe = new Set();
const Sa = 10;
function useTouchScroll(e, {
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
export { SCROLL_ROOT_ID, getMaxScroll, getOffsetBottom, getOffsetTop, getScrollContainer, getScrollRoot, getScrollTop, getViewportHeight, onScroll, scrollRootTo, scrollToTop, useTouchScroll };
