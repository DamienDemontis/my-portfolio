// Hero : bandes de danger, titre glitche, decors et scenes 3D.
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
import { DitherFill } from "../DitherFill.jsx";
import { Hud } from "./Hud.jsx";
import { applyCameraShots, config } from "../../config.js";
import { NARROW_ASPECT_QUERY, PIXEL_BUDGET, canHover, cssPixelRatioFor, hexToRgb01, isCoarsePointer, pixelRatioFor, useIsCoarsePointer, useViewportTier } from "../../lib/device.js";
import { getOffsetBottom, getOffsetTop, getScrollRoot, getScrollTop, getViewportHeight, onScroll, scrollRootTo, scrollToTop, useTouchScroll } from "../../lib/scroll.js";
import { ci, hexToRgbScaled, li, pickResponsive } from "../../lib/shared.js";
import { useAccent } from "../../state/accent.jsx";
const si = 60;
const SCROLL_SPAN_SVH = si + li + ci;
function fireIntroShake() {
  config.shakeFireId++;
}
function introScrollDurationMs() {
  return config.scrollDriven ? config.scrollMs : 0;
}
function introExitCamProgress() {
  const e = config.exitCam;
  return e < 0 ? 0 : e > 1 ? 1 : e;
}
function Ka(e) {
  return e.at + (e.transition === "lerp" ? e.dur : 0);
}
function He() {
  let e = 0;
  for (const i of config.cameraShots) i.exit || (e = Math.max(e, Ka(i)));
  return e;
}
function Ja({
  active: e = !0,
  stateName: i = null,
  accent: a = null,
  className: o = "intro-dither"
}) {
  const s = React.useRef(null),
    n = React.useRef({
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5
    }),
    d = React.useRef(e);
  d.current = e;
  const l = React.useRef(i);
  l.current = i;
  const h = React.useRef(a);
  return h.current = a, React.useEffect(() => {
    const c = s.current;
    if (!c) return;
    const m = `
      attribute vec2 aPos;
      void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
    `,
      v = `
      precision highp float;
      uniform vec2  uRes;
      uniform float uTime;
      uniform vec2  uMouse;
      uniform float uPixel;
      uniform float uLo;
      uniform float uHi;
      uniform float uScale;
      uniform float uSpeed;
      uniform float uHalo;
      uniform float uIrid; // 0 = flat dot colour, 1 = holographic palette
      uniform vec3  uColor;
      uniform vec3  uDot;

      // holographic thin-film palette (same as the city glow / power effects)
      vec3 iridPal(float t){ return 0.6 + 0.4 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67))); }

      float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float vnoise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f); // smooth interpolation → fluid, no blockiness
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++){
          v += a * vnoise(p);
          p = p * 2.0 + 11.3;
          a *= 0.5;
        }
        return v;
      }
      float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }

      void main(){
        // Coarse pixel grid so the dither reads as chunky pixels.
        vec2 px = floor(gl_FragCoord.xy / uPixel) * uPixel;
        // Aspect-correct UV so the flow isn't stretched on wide screens.
        vec2 uv = px / uRes.y;
        vec2 nuv = uv * uScale; // noise frequency (lower scale = bigger blobs)

        // Slow, domain-warped flow → liquid drifting clouds (the "fluid" look).
        float t = uTime * uSpeed;
        vec2 q = vec2(fbm(nuv * 1.6 + vec2(0.0, t)),
                      fbm(nuv * 1.6 + vec2(5.2, 1.3) - t * 0.8));
        float n = fbm(nuv * 1.8 + q * 1.7 + vec2(t * 0.6, -t * 0.4));

        // Cursor halo: a soft brightening that eases in near the pointer.
        vec2 m = uMouse * (uRes / uRes.y);
        float d = distance(uv, m);
        float halo = smoothstep(0.34, 0.0, d) * uHalo;
        n += halo;

        // Contrast curve: most of the screen stays dark, bright clouds dither in.
        n = smoothstep(uLo, uHi, n);

        // 8x8 ordered dither threshold from nested 2x2 Bayer.
        vec2 bp = px / uPixel;
        float b4 = bayer2(0.25 * bp) * 0.25 + bayer2(bp);
        float b8 = bayer2(0.125 * bp) * 0.0625 + b4;
        // Normalize thresholds to (0,1): the raw matrix has a cell at exactly 0,
        // which would light everywhere (a permanent dot grid in the dark).
        b8 = (b8 * 63.0 + 0.5) / 64.0;

        float lit = step(b8, n);          // hard two-colour quantization
        // Iridescent dots: the lit colour drifts through the holographic
        // palette across the clouds (driven by the flow noise + time), kept at
        // the flat colour's brightness so the coverage tuning still holds.
        float dotLum = max(max(uDot.r, uDot.g), uDot.b);
        vec3 dotCol = mix(uDot, iridPal(n * 1.5 + uTime * 0.06) * dotLum, uIrid);
        vec3 col = mix(uColor, dotCol, lit);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
      A = config.ditherStates[l.current] || config.ditherStates.boot,
      f = {
        pixel: A.pixel,
        lo: A.lo,
        hi: A.hi,
        scale: A.scale,
        speed: A.speed,
        halo: A.halo,
        irid: A.irid ? 1 : 0,
        dark: hexToRgb01(A.dark),
        light: hexToRgb01(A.light)
      },
      C = (p, S, T) => p + (S - p) * T,
      D = {
        draw: () => {},
        resize: () => {},
        live: !1
      };
    let b = 0;
    const _ = performance.now(),
      L = () => {
        const p = c.getContext("webgl", {
          antialias: !1,
          alpha: !0
        });
        if (!p || p.isContextLost()) {
          p || console.warn("[intro] WebGL unavailable — dithering background disabled");
          return;
        }
        const S = (k, q) => {
            const F = p.createShader(k);
            return p.shaderSource(F, q), p.compileShader(F), !p.getShaderParameter(F, p.COMPILE_STATUS) && !p.isContextLost() && console.error("[intro] shader error:", p.getShaderInfoLog(F)), F;
          },
          T = p.createProgram();
        p.attachShader(T, S(p.VERTEX_SHADER, m)), p.attachShader(T, S(p.FRAGMENT_SHADER, v)), p.linkProgram(T), p.useProgram(T);
        const R = p.createBuffer();
        p.bindBuffer(p.ARRAY_BUFFER, R), p.bufferData(p.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), p.STATIC_DRAW);
        const E = p.getAttribLocation(T, "aPos");
        p.enableVertexAttribArray(E), p.vertexAttribPointer(E, 2, p.FLOAT, !1, 0, 0);
        const I = {
          res: p.getUniformLocation(T, "uRes"),
          time: p.getUniformLocation(T, "uTime"),
          mouse: p.getUniformLocation(T, "uMouse"),
          pixel: p.getUniformLocation(T, "uPixel"),
          lo: p.getUniformLocation(T, "uLo"),
          hi: p.getUniformLocation(T, "uHi"),
          scale: p.getUniformLocation(T, "uScale"),
          speed: p.getUniformLocation(T, "uSpeed"),
          halo: p.getUniformLocation(T, "uHalo"),
          irid: p.getUniformLocation(T, "uIrid"),
          color: p.getUniformLocation(T, "uColor"),
          dot: p.getUniformLocation(T, "uDot")
        };
        let j = 1;
        D.resize = () => {
          const k = c.clientWidth,
            q = c.clientHeight,
            F = pixelRatioFor(k, q, PIXEL_BUDGET.background);
          j = cssPixelRatioFor(k, q, PIXEL_BUDGET.background);
          const ee = Math.floor(k * F),
            K = Math.floor(q * F);
          (c.width !== ee || c.height !== K) && (c.width = ee, c.height = K, p.viewport(0, 0, ee, K)), p.uniform2f(I.res, c.width, c.height);
        }, D.draw = k => {
          p.isContextLost() || (p.uniform1f(I.pixel, Math.max(1, f.pixel * j)), p.uniform1f(I.lo, f.lo), p.uniform1f(I.hi, f.hi), p.uniform1f(I.scale, f.scale), p.uniform1f(I.speed, f.speed), p.uniform1f(I.halo, f.halo), p.uniform1f(I.irid, f.irid), p.uniform3fv(I.color, f.dark), p.uniform3fv(I.dot, f.light), p.uniform1f(I.time, (performance.now() - _) / 1e3), p.uniform2f(I.mouse, k.x, k.y), p.drawArrays(p.TRIANGLES, 0, 3));
        }, D.live = !0, D.resize();
      },
      G = p => {
        n.current.tx = p.clientX / window.innerWidth, n.current.ty = 1 - p.clientY / window.innerHeight;
      },
      g = () => D.resize();
    canHover() && window.addEventListener("pointermove", G), window.addEventListener("resize", g);
    const P = () => {
        if (b = requestAnimationFrame(P), !d.current) return;
        const p = n.current;
        p.x += (p.tx - p.x) * 0.08, p.y += (p.ty - p.y) * 0.08;
        const S = config.ditherStates,
          T = l.current || config.ditherState,
          R = S[T] || S.boot,
          E = 0.04;
        f.pixel = C(f.pixel, R.pixel, E), f.lo = C(f.lo, R.lo, E), f.hi = C(f.hi, R.hi, E), f.scale = C(f.scale, R.scale, E), f.speed = C(f.speed, R.speed, E), f.halo = C(f.halo, R.halo, E), f.irid = C(f.irid, R.irid ? 1 : 0, E);
        const I = hexToRgb01(R.dark),
          j = h.current ? hexToRgbScaled(h.current) : hexToRgb01(R.light);
        for (let k = 0; k < 3; k++) f.dark[k] = C(f.dark[k], I[k], E), f.light[k] = C(f.light[k], j[k], E);
        D.live && D.draw(p);
      },
      M = p => {
        p.preventDefault(), D.live = !1;
      },
      u = () => {
        L();
      };
    return c.addEventListener("webglcontextlost", M), c.addEventListener("webglcontextrestored", u), L(), P(), () => {
      var p, S;
      cancelAnimationFrame(b), window.removeEventListener("pointermove", G), window.removeEventListener("resize", g), c.removeEventListener("webglcontextlost", M), c.removeEventListener("webglcontextrestored", u), (S = (p = c.getContext("webgl")) == null ? void 0 : p.getExtension("WEBGL_lose_context")) == null || S.loseContext();
    };
  }, []), <canvas ref={s} className={o} />;
}
function Hazard({
  visible: e
}) {
  return <motion.div className="intro-hazard" aria-hidden={!0} initial={!1} animate={{
    opacity: e ? 1 : 0
  }} transition={{
    duration: 0.5,
    ease: "easeInOut"
  }}><div className="intro-hazard__stripes" /><div className="intro-hazard__grunge" /></motion.div>;
}
function MarqueeTrack({
  on: e = !1
}) {
  const i = e ? "system: on" : "STUDIO MACACO",
    a = Array.from({
      length: 14
    }, () => i).join("   ");
  return <div className={`intro-marquee ${e ? "is-on" : ""}`} aria-hidden={!0}><div className="intro-marquee__track"><span>{a}{"   "}</span><span>{a}{"   "}</span></div></div>;
}
const LOGO_COMPLETE_SRC = "/general/macaco-logo-complete.svg";
const ze = {
  duration: 0.4
};
function Title({
  visible: e = !0
}) {
  const {
      t: i
    } = useTranslation(),
    a = {
      opacity: e ? 1 : 0
    };
  return <div className="intro-title" aria-hidden={!0}><motion.div className="intro-title__logo" initial={!1} animate={a} transition={ze} style={{
      WebkitMaskImage: `url(${LOGO_COMPLETE_SRC})`,
      maskImage: `url(${LOGO_COMPLETE_SRC})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
      backdropFilter: "invert(1)",
      WebkitBackdropFilter: "invert(1)"
    }} /><motion.p className="intro-title__tagline" initial={!1} animate={a} transition={ze}>{i("intro.tagline")}</motion.p><motion.p className="intro-title__scroll" initial={!1} animate={a} transition={ze}>{i("intro.scroll")}</motion.p><motion.div className="intro-title__line" initial={!1} animate={a} transition={ze} /></div>;
}
function MaskedSvg({
  src: e,
  color: i = "#ffffff",
  size: a = "contain",
  className: o = "",
  style: s
}) {
  const n = `/intro/svg/${e}`;
  return <span className={o} aria-hidden={!0} style={{
    display: "block",
    backgroundColor: i,
    WebkitMaskImage: `url(${n})`,
    maskImage: `url(${n})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: a,
    maskSize: a,
    ...s
  }} />;
}
const Ze = "#FEFF00";
const $e = {
  hidden: {},
  show: {}
};
const Co = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.14,
      ease: "linear"
    }
  },
  show: (e = 0) => ({
    opacity: [0, 1, 0, 1, 0.35, 1],
    x: [8, -7, 4, -2, 1, 0],
    transition: {
      duration: 0.34,
      ease: "linear",
      delay: 0.05 * e
    }
  })
};
const So = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.14,
      ease: "linear"
    }
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut"
    }
  }
};
function Outline({
  src: e,
  stroke: i = Ze,
  strokeWidth: a = 1.4,
  style: o
}) {
  const [s, n] = React.useState("");
  return React.useEffect(() => {
    let d = !0;
    return fetch(`/intro/svg/${e}`).then(l => l.text()).then(l => {
      d && n(l);
    }), () => {
      d = !1;
    };
  }, [e]), <span className="hero-outline" aria-hidden={!0} style={{
    "--hero-stroke": i,
    "--hero-sw": a,
    ...o
  }} dangerouslySetInnerHTML={{
    __html: s
  }} />;
}
function Glitch({
  className: e,
  i,
  children: a
}) {
  return <div className={e}><motion.div className="hero-glitch" variants={Co} custom={i}>{a}</motion.div></div>;
}
function Back({
  visible: e = !1
}) {
  const {
      t: i
    } = useTranslation(),
    a = e ? "show" : "hidden",
    o = {
      width: "100%",
      height: "100%"
    };
  return <><motion.div className="hero-back" aria-hidden={!0} variants={$e} initial="hidden" animate={a}><Glitch className="hero-studio" i={0}><MaskedSvg src="studio.svg" color="#FEFF00" style={o} /></Glitch><Glitch className="hero-macaco" i={1}><Outline src="macaco-logo.svg" stroke={Ze} strokeWidth={1.4} /></Glitch></motion.div><motion.div className="hero-underline" aria-hidden={!0} variants={$e} initial="hidden" animate={a}><Glitch className="hero-longstar" i={0}><MaskedSvg src="longstar.svg" color="#FEFF00" style={o} /></Glitch><Glitch className="hero-longlines" i={1}><MaskedSvg src="longlines.svg" color="#FEFF00" style={o} /></Glitch><Glitch className="hero-intricateline" i={2}><MaskedSvg src="intricateline.svg" color="#FEFF00" style={o} /></Glitch></motion.div><motion.div className="hero-front" aria-hidden={!0} variants={$e} initial="hidden" animate={a}><motion.div className="hero-scrim" variants={So} /><div className="hero-copy"><Glitch className="hero-headline" i={2}><p className="hero-headline__text">{i("intro.headline1")}<br />{i("intro.headline2")}</p></Glitch><Glitch className="hero-paragraph" i={4}><p>{i("intro.paragraph")}</p></Glitch></div><Glitch className="hero-side hero-side--l" i={5}>{"SYSTEMS ON // (_BOOT_COMPLETE)"}</Glitch><Glitch className="hero-side hero-side--r" i={5}>{"READY TO CREATE // (SOMETHING_AMAZING?)"}</Glitch><Glitch className="hero-doubleplus" i={6}><MaskedSvg src="doubleplus.svg" color={Ze} style={o} /></Glitch></motion.div></>;
}
const hi = {
  hidden: {
    opacity: 0
  },
  show: (e = 0) => ({
    opacity: [0, 1, 0, 1, 0.35, 1],
    x: [8, -7, 4, -2, 1, 0],
    transition: {
      duration: 0.34,
      ease: "linear",
      delay: 0.05 * e
    }
  }),
  exit: (e = 0) => ({
    opacity: [1, 0, 1, 0.3, 0, 0],
    x: [0, 4, -3, 1, 0, 0],
    transition: {
      duration: 0.26,
      ease: "linear",
      delay: 0.03 * e
    }
  })
};
function OvGlitch({
  className: e,
  i = 0,
  children: a,
  style: o
}) {
  return <div className={e} style={o}><motion.div className="ov-glitch" variants={hi} custom={i}>{a}</motion.div></div>;
}
function OvGlitch2({
  className: e,
  src: i,
  i: a = 0
}) {
  const o = `/intro/svg/${i}`;
  return <div className={e}><motion.div className="ov-glitch ov-neg" variants={hi} custom={a} style={{
      WebkitMaskImage: `url(${o})`,
      maskImage: `url(${o})`
    }} /></div>;
}
function Io(e) {
  const [i, a] = React.useState(!1);
  return React.useEffect(() => {
    let o;
    const s = () => {
      const n = config.overlays[e],
        d = introScrollDurationMs(),
        l = d >= n.startMs && d < n.endMs;
      a(h => h === l ? h : l), o = requestAnimationFrame(s);
    };
    return o = requestAnimationFrame(s), () => cancelAnimationFrame(o);
  }, [e]), i;
}
function Fi2({
  layoutKey: e,
  className: i,
  children: a
}) {
  const o = Io(e);
  return <AnimatePresence>{o && <motion.div className={`ov-root ${i}`} aria-hidden={!0} variants={{
      hidden: {},
      show: {},
      exit: {}
    }} initial="hidden" animate="show" exit="exit">{a}</motion.div>}</AnimatePresence>;
}
function Ov1() {
  const {
    t: e
  } = useTranslation();
  return <Fi2 layoutKey="l1" className="ov1"><OvGlitch className="ov1-starsUL" i={0}><MaskedSvg src="starlines1upleft.svg" color="#fff" size="100% 100%" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch2 className="ov1-webuild" src={e("intro.svg.webuild")} i={1} /><OvGlitch2 className="ov1-power" src={e("intro.svg.power")} i={1} /><OvGlitch className="ov1-starsDR" i={2}><MaskedSvg src="starlines1downright.svg" color="#fff" size="100% 100%" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch className="ov1-atom" i={3}><MaskedSvg src="atompixel.svg" color="#fff" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch className="ov-side ov1-side" i={4}>{"SYSTEMS ON // (_GENERATING_CITY)"}</OvGlitch><OvGlitch className="ov-jp ov1-jp" i={4}>{"つなぐ"}</OvGlitch></Fi2>;
}
function Ov2() {
  const {
    t: e
  } = useTranslation();
  return <Fi2 layoutKey="l2" className="ov2"><OvGlitch className="ov2-starsUL" i={0}><MaskedSvg src="starlines2upleft.svg" color="#fff" size="100% 100%" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch2 className="ov2-wecreate" src={e("intro.svg.wecreate")} i={1} /><OvGlitch2 className="ov2-amazing" src={e("intro.svg.amazing")} i={1} /><OvGlitch className="ov2-starsDR" i={2}><MaskedSvg src="starlines2downright.svg" color="#fff" size="100% 100%" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch className="ov2-vortex" i={3}><MaskedSvg src="vortexpixel.svg" color="#fff" style={{
        width: "100%",
        height: "100%"
      }} /></OvGlitch><OvGlitch className="ov-side ov2-proc" i={4}>{"PROCEDURE START // (_FBX_PROCEDURAL)"}</OvGlitch><OvGlitch className="ov-side ov2-side" i={4}>{"SYSTEMS ON // (_GENERATING_CITY)"}</OvGlitch><OvGlitch className="ov-jp ov2-jp" i={4}>{"うまれる"}</OvGlitch></Fi2>;
}
function Mo() {
  return <><Ov1 /><Ov2 /></>;
}
const vi = {
  transition: {
    duration: 0.4
  }
};
const ko = {
  base: [{
    top: "12%",
    left: "14%"
  }, {
    top: "18%",
    left: "82%"
  }, {
    top: "78%",
    left: "14%"
  }, {
    top: "82%",
    left: "82%"
  }]
};
const Lo = {
  base: [{
    top: "20%",
    left: "66%"
  }, {
    top: "71%",
    left: "31%"
  }]
};
function Crosshairs({
  visible: e = !0
}) {
  const {
      tier: i,
      orient: a
    } = useViewportTier(),
    o = pickResponsive(ko, i, a) || [],
    s = pickResponsive(Lo, i, a) || [];
  return <motion.div className="intro-crosshairs" aria-hidden={!0} animate={{
    opacity: e ? 1 : 0
  }} {...vi}>{o.map((n, d) => <MaskedSvg src="crosshair-big.svg" color="rgba(255,255,255,0.55)" className="intro-cross" style={{
      top: n.top,
      left: n.left,
      width: "calc(46 * var(--ipx))",
      height: "calc(86 * var(--ipx))"
    }} key={`b${d}`} />)}{s.map((n, d) => <MaskedSvg src="crosshair.svg" color="#FEFF00" className="intro-cross" style={{
      top: n.top,
      left: n.left,
      width: "calc(30 * var(--ipx))",
      height: "calc(30 * var(--ipx))"
    }} key={`s${d}`} />)}</motion.div>;
}
function MarginGlyphs({
  visible: e = !0
}) {
  const i = {
    height: "92vh",
    width: "calc(92vh * 0.204)"
  };
  return <motion.div className="intro-margin-glyphs" aria-hidden={!0} animate={{
    opacity: e ? 1 : 0
  }} {...vi}><MaskedSvg src="glyph.svg" color="#000000" className="intro-margin-glyphs__l" style={i} /><MaskedSvg src="glyph.svg" color="#000000" className="intro-margin-glyphs__r" style={{
      ...i,
      transform: "translateY(-50%) scaleX(-1)"
    }} /></motion.div>;
}
const Jo = React.lazy(() => import("../../three/RobotScene.jsx"));
const Oo = React.lazy(() => import("../../three/CityScene.jsx"));
function No({
  active: e
}) {
  const {
    accent: i
  } = useAccent();
  return <Ja active={e} accent={i} />;
}
const Bo = 30;
const Po = "macaco:intro-landed";
const Go = "macaco:yellow-nav";
const Rt = "macaco:scroll-hint";
const Fo = 1500;
const Vo = {
  powerOnMs: 2667,
  descentMs: 3833
};
let Re = !1;
const Uo = 1.75;
const Mt = 0.55;
const kt = 13e5;
const Lt = e => {
  let i = Math.min(typeof window < "u" && window.devicePixelRatio || 1, Uo);
  if (isCoarsePointer() && typeof window < "u") {
    const a = window.innerWidth * window.innerHeight * i * i;
    a > kt && (i *= Math.sqrt(kt / a));
  }
  return +(i * (Mt + (1 - Mt) * e)).toFixed(2);
};
function Intro({
  active: e = !0
}) {
  const i = React.useRef(!1),
    [a, o] = React.useState("off"),
    [s, n] = React.useState(!1),
    d = React.useRef(Vo),
    l = React.useRef(null),
    h = React.useRef(null),
    c = React.useRef(null),
    m = React.useRef(null),
    v = React.useRef(!1),
    A = useMotionValue(0),
    [f, C] = React.useState(!0),
    [D, b] = React.useState(!0),
    [_, L] = React.useState(!0),
    [G, g] = React.useState(!0),
    P = React.useRef(1),
    [M, u] = React.useState(() => Lt(1)),
    p = React.useCallback(() => {
      const y = Lt(P.current);
      u(z => z === y ? z : y);
    }, []),
    S = React.useCallback(({
      factor: y
    }) => {
      P.current = Math.round(y * 5) / 5, p();
    }, [p]);
  React.useEffect(() => (window.addEventListener("resize", p), () => window.removeEventListener("resize", p)), [p]);
  const T = useIsCoarsePointer(),
    R = config.scroll.enabled,
    E = T ? config.scroll.vhTouch : config.scroll.vh;
  React.useEffect(() => {
    const y = window.matchMedia(NARROW_ASPECT_QUERY),
      z = () => applyCameraShots(y.matches);
    return z(), y.addEventListener("change", z), () => y.removeEventListener("change", z);
  }, []);
  const I = y => {
      let z = 1 / 0;
      for (const V of config.cameraShots) V.anim === y && (z = Math.min(z, V.at));
      return z;
    },
    j = () => {
      const y = getViewportHeight(),
        z = Math.max(y, getScrollRoot().scrollHeight - y),
        V = l.current ? l.current.offsetHeight : z,
        Ce = Math.max(1, V - y),
        re = I("descent"),
        ue = (isFinite(re) ? re : He()) + d.current.descentMs,
        Se = Math.max(He(), ue) + config.scroll.tailMs;
      return {
        landAnchor: Ce,
        totalMs: Se
      };
    },
    k = () => {
      i.current = !0;
    },
    q = React.useRef(e);
  React.useLayoutEffect(() => {
    e && !q.current && (i.current = !0), q.current = e;
  }, [e]), React.useEffect(() => {
    if (!e || !R || !("scrollRestoration" in window.history)) return;
    const y = window.history.scrollRestoration;
    return window.history.scrollRestoration = "manual", () => {
      window.history.scrollRestoration = y;
    };
  }, [e, R]), React.useLayoutEffect(() => {
    if (!e || !R || !i.current) return;
    const {
      landAnchor: y,
      totalMs: z
    } = j();
    o("on"), n(!0), config.scrollDriven = !0, config.scrollMs = z, config.ditherState = "landed", config.glitchActive = !1, config.heroExit = 0, config.exitCam = 0, h.current && (h.current.style.transform = "translate3d(0, 0, 0)", h.current.style.pointerEvents = ""), scrollRootTo({
      top: y,
      behavior: "auto"
    });
  }, [e, R]), React.useEffect(() => {
    if (!e) return;
    const y = getScrollRoot(),
      z = document.body.style.background,
      V = y.style.overflowY;
    return document.body.style.background = "#000", y.style.overflowY = "", () => {
      document.body.style.background = z, y.style.overflowY = V;
    };
  }, [R, e]), React.useEffect(() => {
    if (!e) return;
    const y = i.current,
      z = j();
    config.scrollDriven = !0, config.scrollMs = y ? z.totalMs : 0, y ? (o("on"), n(!0), config.ditherState = "landed", config.glitchActive = !1, config.heroExit = 0, config.exitCam = 0) : scrollToTop();
    let V,
      Ce = y ? z.totalMs : 0,
      re = z.landAnchor,
      ue = !1,
      Se = getScrollTop(),
      ht = performance.now();
    const ft = () => {
        const H = j();
        re = H.landAnchor;
        const Y = getScrollTop();
        Y !== Se && (Se = Y, ht = performance.now()), Ce = Math.min(1, Math.max(0, Y / re)) * H.totalMs;
      },
      vt = () => {
        {
          config.scrollMs += (Ce - config.scrollMs) * config.scroll.smooth;
          const O = config.scrollMs;
          i.current && (Re = !0);
          const me = Math.min(I("build"), 1e9) || 2700,
            Te = I("descent"),
            Ei = d.current.descentMs,
            Ii = Math.min(config.shake.atFrame / Bo * 1e3, Ei),
            Ee = (isFinite(Te) ? Te : He()) + Ii,
            Ct = O < 30 ? "off" : O < me ? "igniting" : "on";
          o(ce => ce === Ct ? ce : Ct), n(ce => {
            const ge = O >= Ee;
            return ge && k(), ce !== ge && window.dispatchEvent(new CustomEvent(Po, {
              detail: ge
            })), ce === ge ? ce : ge;
          }), config.ditherState = O < me ? "boot" : O < Ee ? "powered" : "landed", config.glitchActive = !Re && isFinite(Te) && O >= Te && O < Ee, !Re && O >= Ee && (Re = !0, fireIntroShake());
        }
        const H = getViewportHeight(),
          Y = Math.max(0, getScrollTop() - re);
        (!c.current || !c.current.isConnected) && (c.current = document.querySelector(".craft"));
        const Fe = c.current;
        let te;
        if (Fe) {
          const O = getOffsetBottom(Fe),
            me = Math.max(H, O - re - H);
          Y <= H ? te = Y / H : Y <= me ? te = 1 : te = Math.max(0, 1 - (Y - me) / H);
        } else te = Math.min(1, Y / H);
        A.set(te), h.current && (h.current.style.pointerEvents = te >= 1 ? "none" : "", h.current.style.opacity = Y <= H ? "1" : "0"), config.exitCam = Math.min(1, Y / Math.max(1, H * config.scroll.exitCamVh));
        const bt = introExitCamProgress() <= 0.001;
        g(O => O === bt ? O : bt);
        const yt = Y <= H * 1.15;
        C(O => O === yt ? O : yt);
        const wt = te < 0.999;
        b(O => O === wt ? O : wt);
        const At = te > 5e-4;
        L(O => O === At ? O : At);
        const Ve = te > 0.5;
        v.current !== Ve && (v.current = Ve, window.dispatchEvent(new CustomEvent(Go, {
          detail: Ve
        }))), (!m.current || !m.current.isConnected) && (m.current = document.querySelector(".mcf"));
        const xt = m.current,
          Ti = xt ? getOffsetTop(xt) - si / 100 * H : 1 / 0,
          Ue = getScrollTop() < Ti && (config.scrollMs < 30 || performance.now() - ht >= Fo);
        ue !== Ue && (ue = Ue, window.dispatchEvent(new CustomEvent(Rt, {
          detail: Ue
        }))), V = requestAnimationFrame(vt);
      };
    ft();
    const Si = onScroll(ft);
    return V = requestAnimationFrame(vt), () => {
      Si(), cancelAnimationFrame(V), ue && window.dispatchEvent(new CustomEvent(Rt, {
        detail: !1
      })), config.scrollDriven = !1, config.heroExit = 0, config.exitCam = 0, C(!0), b(!0), g(!0);
    };
  }, [R, e]), useTouchScroll(() => l.current, {
    enabled: e && R,
    getParams: () => ({
      maxPxPerSec: config.scroll.touchMaxPxPerSec,
      friction: config.scroll.touchFriction
    })
  });
  const {
      tier: F,
      orient: ee
    } = useViewportTier(),
    K = a === "off",
    x = K;
  return <>{e && <div ref={l} className="intro-scroll-spacer" style={{
      height: `${E * 100}svh`
    }} />}<div className={`intro-root${e ? "" : " intro-hidden"}`} data-tier={F} data-orient={ee}><No active={e && D} /><div className="intro-hero-layers" ref={h}><React.Suspense fallback={null}><Oo phase={a} active={e && f} dpr={M} /></React.Suspense><Hazard visible={K} /><Hud active={a === "igniting"} /><React.Suspense fallback={null}><Jo phase={a} active={e && f} dpr={M} onPerf={S} onDurations={y => {
            d.current = y;
          }} onLanding={() => {
            n(!0), k(), config.ditherState = "landed";
          }} /></React.Suspense><Back visible={s && G} /><Mo /><Crosshairs visible={x} /><MarginGlyphs visible={x} /><motion.div className="intro-marquee-band" animate={{
          opacity: K ? 1 : 0
        }} transition={{
          duration: 0.4
        }} style={{
          pointerEvents: "none"
        }}><MarqueeTrack on={!1} /></motion.div><Title visible={K} /></div>{e && _ && <DitherFill fill={A} className="intro-home-cover" />}{!1}</div></>;
}
export { Intro, MaskedSvg, SCROLL_SPAN_SVH, fireIntroShake, introExitCamProgress, introScrollDurationMs, si };
