import '../styles/laboratory.css'
import React from "react";
import { useParams } from "react-router-dom";
import { canHover, PIXEL_BUDGET, pixelRatioFor, UseSeo, W as WCore } from "../app-core.jsx";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
function U({
  className: a = "lab__orb"
}) {
  const s = React.useRef(null),
    n = React.useRef({
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5
    });
  return React.useEffect(() => {
    const r = s.current;
    if (!r) return;
    const o = `
      attribute vec2 aPos;
      void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
    `,
      l = `
      precision highp float;
      uniform vec2  uRes;
      uniform float uTime;
      uniform vec2  uMouse;
      uniform float uPixel;

      // Holographic thin-film palette — same family as the intro's city glow.
      vec3 pal(float t){ return 0.55 + 0.45 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67))); }

      float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float vnoise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 4; i++){
          v += a * vnoise(p);
          p = p * 2.0 + 11.3;
          a *= 0.5;
        }
        return v;
      }
      float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }

      void main(){
        // Chunky cell grid: everything below is computed once per dither cell.
        vec2 px = floor(gl_FragCoord.xy / uPixel) * uPixel + uPixel * 0.5;
        // Normalized by the SHORT side, so the orb keeps its size relative to
        // the narrow dimension — portrait phones get a whole orb, not a wall.
        vec2 uv = (px - 0.5 * uRes) / min(uRes.x, uRes.y);
        uv -= uMouse * 0.05; // cursor parallax (still on touch)

        float t = uTime;
        float r = length(uv);
        vec2 dir = uv / max(r, 1e-4);

        // Horizon radius wobbles organically. Sampling the noise on the unit
        // circle (dir) keeps it continuous around the full turn — no atan seam.
        float wob = fbm(dir * 1.4 + vec2(t * 0.12, -t * 0.09)) - 0.5;
        float R = 0.30 + wob * 0.05;

        // Vortex surface: the sample domain rotates faster toward the core.
        float tw = t * 0.22 + 2.2 / (r + 0.35);
        vec2 q = mat2(cos(tw), -sin(tw), sin(tw), cos(tw)) * uv;
        float n = fbm(q * 3.0 + vec2(t * 0.22, -t * 0.16));

        // Body: luminous rim falling to a near-black core (the event horizon).
        float inside = smoothstep(R + 0.012, R - 0.012, r);
        float rim = pow(smoothstep(0.0, R, r), 2.4);
        float core = smoothstep(R * 0.72, R * 0.25, r);
        float body = n * mix(0.32, 1.25, rim) * (1.0 - core * 0.93);

        // Horizon ring + breathing outer halo. The halo is CONFINED: a hard
        // radial fade zeroes it by ~1.9R, because its exponential tail alone
        // stays above the dither's minimum threshold forever and reads as a
        // faint dot grid across the whole screen. Strong near the blob,
        // clean black beyond.
        float ring = exp(-abs(r - R) * 34.0) * 1.15;
        float halo = smoothstep(R * 1.45, R * 1.02, r);
        float glow = exp(-max(r - R, 0.0) * 9.0) * 0.55
                   * (0.6 + 0.4 * fbm(dir * 2.0 + t * 0.1))
                   * halo;

        // Tilted accretion streak — the flattened bright ellipse that sells the
        // black-hole read; dimmed on the half that passes behind the sphere.
        vec2 d = mat2(cos(-0.5), -sin(-0.5), sin(-0.5), cos(-0.5)) * uv;
        d.y *= 3.4;
        float disk = exp(-abs(length(d) - R * 1.12) * 26.0) * 0.9;
        disk *= mix(1.0, 0.25, smoothstep(0.0, 0.05, d.y) * step(r, R));

        float lum = body * inside + ring + glow * step(R, r) + disk;

        // The forever colour drift: palette phase advances with time, spread
        // across the surface by the flow noise and the radius.
        vec3 col = pal(t * 0.02 + n * 0.30 + r * 0.35);

        // 8x8 ordered dither (nested 2x2 Bayer — WebGL1 safe, no arrays).
        vec2 bp = px / uPixel;
        float b4 = bayer2(0.25 * bp) * 0.25 + bayer2(bp);
        float b8 = bayer2(0.125 * bp) * 0.0625 + b4;
        b8 = (b8 * 63.0 + 0.5) / 64.0;

        float lit = step(b8, clamp(lum, 0.0, 1.0));
        // Overflow (lum > 1 + threshold) reads as hot specks: brighter cells
        // along the ring and streak, so the horizon sparkles instead of banding.
        float hot = step(b8 + 1.0, lum);

        vec3 outCol = mix(vec3(0.008), col * mix(0.9, 1.6, hot), lit);

        // Faint TV static over the void: a sparse scatter of dim grey cells
        // (~0.4% of them, re-rolled a few times a second) so the background
        // reads as a live signal instead of dead black. Kept OFF the lit
        // pixels, and neutral grey — it must never look like the site's
        // dither field coming back.
        float spark = step(0.996, hash(bp + floor(t * 6.0) * vec2(11.3, 7.1)));
        outCol += spark * (1.0 - lit) * vec3(0.14);

        gl_FragColor = vec4(outCol, 1.0);
      }
    `,
      i = {
        draw: () => {},
        resize: () => {},
        live: !1
      };
    let h = 0;
    const u = performance.now(),
      d = () => {
        const t = r.getContext("webgl", {
          antialias: !1,
          alpha: !1
        });
        if (!t || t.isContextLost()) {
          t || console.warn("[lab] WebGL unavailable — orb disabled");
          return;
        }
        const g = (f, j) => {
            const x = t.createShader(f);
            return t.shaderSource(x, j), t.compileShader(x), !t.getShaderParameter(x, t.COMPILE_STATUS) && !t.isContextLost() && console.error("[lab] shader error:", t.getShaderInfoLog(x)), x;
          },
          m = t.createProgram();
        t.attachShader(m, g(t.VERTEX_SHADER, o)), t.attachShader(m, g(t.FRAGMENT_SHADER, l)), t.linkProgram(m), t.useProgram(m);
        const F = t.createBuffer();
        t.bindBuffer(t.ARRAY_BUFFER, F), t.bufferData(t.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), t.STATIC_DRAW);
        const P = t.getAttribLocation(m, "aPos");
        t.enableVertexAttribArray(P), t.vertexAttribPointer(P, 2, t.FLOAT, !1, 0, 0);
        const _ = {
          res: t.getUniformLocation(m, "uRes"),
          time: t.getUniformLocation(m, "uTime"),
          mouse: t.getUniformLocation(m, "uMouse"),
          pixel: t.getUniformLocation(m, "uPixel")
        };
        i.resize = () => {
          const f = r.clientWidth,
            j = r.clientHeight,
            x = pixelRatioFor(f, j, PIXEL_BUDGET.background),
            N = Math.floor(f * x),
            R = Math.floor(j * x);
          (r.width !== N || r.height !== R) && (r.width = N, r.height = R, t.viewport(0, 0, N, R)), t.uniform2f(_.res, r.width, r.height), t.uniform1f(_.pixel, Math.max(1, 3 * (f > 0 ? r.width / f : 1)));
        }, i.draw = f => {
          t.isContextLost() || (t.uniform1f(_.time, (performance.now() - u) / 1e3), t.uniform2f(_.mouse, f.x - 0.5, f.y - 0.5), t.drawArrays(t.TRIANGLES, 0, 3));
        }, i.live = !0, i.resize();
      },
      L = t => {
        n.current.tx = t.clientX / window.innerWidth, n.current.ty = 1 - t.clientY / window.innerHeight;
      },
      A = () => i.resize();
    canHover() && window.addEventListener("pointermove", L), window.addEventListener("resize", A);
    const C = () => {
        h = requestAnimationFrame(C);
        const t = n.current;
        t.x += (t.tx - t.x) * 0.06, t.y += (t.ty - t.y) * 0.06, i.live && i.draw(t);
      },
      S = t => {
        t.preventDefault(), i.live = !1;
      },
      I = () => {
        d();
      };
    return r.addEventListener("webglcontextlost", S), r.addEventListener("webglcontextrestored", I), d(), C(), () => {
      var t, g;
      cancelAnimationFrame(h), window.removeEventListener("pointermove", L), window.removeEventListener("resize", A), r.removeEventListener("webglcontextlost", S), r.removeEventListener("webglcontextrestored", I), (g = (t = r.getContext("webgl")) == null ? void 0 : t.getExtension("WEBGL_lose_context")) == null || g.loseContext();
    };
  }, []), <canvas ref={s} className={a} aria-hidden={!0} />;
}
const G = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.15
      }
    }
  },
  b = {
    hidden: {
      opacity: 0,
      y: 6
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
function y(a, s, n = 600, {
  decimals: r = 0,
  min: o = -1 / 0,
  max: l = 1 / 0
} = {}) {
  const [i, h] = React.useState(a);
  return React.useEffect(() => {
    const u = setInterval(() => {
      let d = a + (Math.random() * 2 - 1) * s;
      d = Math.max(o, Math.min(l, d)), h(r ? +d.toFixed(r) : Math.round(d));
    }, n);
    return () => clearInterval(u);
  }, [a, s, n, r, o, l]), i;
}
function W(a = 1420.5, s = 12.8, n = 3.4, r = 240) {
  const [o, l] = React.useState(a);
  return React.useEffect(() => {
    const i = setInterval(() => {
      l(h => {
        const u = h - n * (0.4 + Math.random());
        return u <= s ? a : u;
      });
    }, r);
    return () => clearInterval(i);
  }, [a, s, n, r]), o;
}
function V(a = 44, s = 80) {
  const [n, r] = React.useState(() => Array.from({
    length: a
  }, () => 16));
  return React.useEffect(() => {
    const o = setInterval(() => {
      r(l => [...l.slice(1), 16 + (Math.random() * 2 - 1) * 11]);
    }, s);
    return () => clearInterval(o);
  }, [a, s]), n.map((o, l) => `${(l / (a - 1) * 160).toFixed(1)},${o.toFixed(1)}`).join(" ");
}
const E = ["approach_vector::locked", "route_sync::lab_module", "scanning_horizon[ok]", "gravity_well::stable", "dither_pass::bayer_8x8", "docking_bay_03::standby", "assembling_{laboratory}"],
  T = 26;
function LhudStream() {
  const a = React.useRef(null);
  return React.useEffect(() => {
    var u;
    const s = a.current;
    if (!s) return;
    if ((u = window.matchMedia) != null && u.call(window, "(prefers-reduced-motion: reduce)").matches) {
      s.textContent = E[0].padStart(T);
      return;
    }
    let n = " ".repeat(T),
      r = 0,
      o = 0,
      l;
    const i = d => {
        n = (n + d).slice(-T), s.textContent = n;
      },
      h = () => {
        const d = E[r % E.length];
        o < d.length ? (i(d[o]), o += 1, l = setTimeout(h, 42)) : (i("  "), r += 1, o = 0, l = setTimeout(h, 360));
      };
    return s.textContent = n, l = setTimeout(h, 42), () => clearTimeout(l);
  }, []), <span className="lhud-stream"><span className="lhud-stream__txt" ref={a} /><span className="lhud-stream__caret" /></span>;
}
function LhudStat({
  label: a,
  children: s,
  flicker: n
}) {
  return <div className="lhud-stat"><span className="lhud-dim">{a}</span><span className="lhud-arrow">{">>"}</span><span className={n || ""}>{s}</span></div>;
}
function LhudMeter({
  label: a,
  base: s
}) {
  const n = y(s, 1.8, 700, {
    min: 0,
    max: 100
  });
  return <div className="lhud-meter"><span className="lhud-dim">{a}</span><span className="lhud-track"><span className="lhud-fill" style={{
        width: `${n}%`
      }} /></span><span>{n}{"%"}</span></div>;
}
function LhudWave() {
  const a = V();
  return <svg className="lhud-wave" viewBox="0 0 160 32" preserveAspectRatio="none"><polyline points={a} fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
}
function LhudTitle() {
  const a = W(),
    s = y(114, 6, 500, {
      min: 96,
      max: 130
    });
  return <><div className="lhud-title">{"APPROACH VECTOR "}<span className="lhud-arrow">{">>"}</span>{" "}<span className="lhud-ok lhud-flicker">{"LOCKED"}</span></div><div className="lhud-progress"><span /></div><div style={{
      marginTop: 12
    }}><LhudStat label="TARGET">{"LAB_MODULE // 01"}</LhudStat><LhudStat label="DISTANCE" flicker="lhud-flicker lhud-flicker--b">{a.toFixed(1)}{" KM"}</LhudStat><LhudStat label="VELOCITY">{s}{" M/S"}</LhudStat><LhudStat label="TRAJECTORY">{"NOMINAL"}</LhudStat></div></>;
}
function LhudBox() {
  const a = y(46.02, 0.008, 600, {
      decimals: 3
    }),
    s = y(8.9, 0.008, 700, {
      decimals: 3
    });
  return <div className="lhud-box"><div className="lhud-dim">{"NAV // TRIANGULATION"}</div><LhudWave /><LhudStat label="LAT">{a.toFixed(3)}{"_N"}</LhudStat><LhudStat label="LON">{s.toFixed(3)}{"_E"}</LhudStat><div style={{
      marginTop: 6
    }}><span className="lhud-arrow">{">>"}</span>{" "}<span className="lhud-flicker lhud-flicker--c">{"SIGNAL EXCELLENT"}</span></div></div>;
}
function LhudBox2() {
  return <div className="lhud-box"><div className="lhud-dim" style={{
      marginBottom: 6
    }}>{"TELEMETRY"}</div><LhudMeter label="SIGNAL" base={96} /><LhudMeter label="THRUST" base={72} /><LhudMeter label="SYNC" base={99} /><LhudMeter label="SHIELD" base={88} /></div>;
}
function LhudDim() {
  return <><WCore src="barcode.svg" color="rgba(247, 247, 240, 0.7)" size="contain" style={{
      width: 110,
      height: 26
    }} /><div className="lhud-dim" style={{
      marginTop: 6
    }}>{"DOCKING BAY 03"}</div><div>{"STATUS: "}<span className="lhud-ok lhud-flicker lhud-flicker--c">{"AWAITING"}</span></div><div className="lhud-jp">{"つなぐ"}</div></>;
}
function LabHud({
  compact: a = !1
}) {
  return <motion.div className="lab-hud" aria-hidden={!0} variants={G} initial="hidden" animate="show"><span className="lab-hud__corner lab-hud__corner--tl" /><span className="lab-hud__corner lab-hud__corner--tr" /><span className="lab-hud__corner lab-hud__corner--bl" /><span className="lab-hud__corner lab-hud__corner--br" /><motion.div className="lab-hud__mark lab-hud__mark--l" variants={b}><WCore src="crosshair.svg" color="rgba(255,255,255,0.5)" size="contain" style={{
        width: "100%",
        height: "100%"
      }} /></motion.div><motion.div className="lab-hud__mark lab-hud__mark--r" variants={b}><WCore src="crosshair.svg" color="rgba(255,255,255,0.5)" size="contain" style={{
        width: "100%",
        height: "100%"
      }} /></motion.div><span className="lab-hud__scan" />{!a && <motion.div className="lab-hud__panel lab-hud__panel--tl" variants={b}><LhudTitle /></motion.div>}{!a && <motion.div className="lab-hud__panel lab-hud__panel--tr" variants={b}><LhudBox /></motion.div>}{!a && <motion.div className="lab-hud__panel lab-hud__panel--bl" variants={b}><LhudBox2 /></motion.div>}{!a && <motion.div className="lab-hud__panel lab-hud__panel--br" variants={b}><LhudDim /></motion.div>}<motion.div className="lab-hud__panel lab-hud__panel--stream" variants={b}><LhudStream /></motion.div></motion.div>;
}
function Z() {
  const [a, s] = React.useState(() => typeof window < "u" && window.matchMedia("(max-width: 1025px)").matches);
  return React.useEffect(() => {
    const n = window.matchMedia("(max-width: 1025px)"),
      r = o => s(o.matches);
    return n.addEventListener("change", r), () => n.removeEventListener("change", r);
  }, []), a;
}
function Lab() {
  const {
      lang: a
    } = useParams(),
    {
      t: s
    } = useTranslation(),
    n = Z();
  return <main className="lab"><UseSeo lang={a} kind="laboratory" /><U /><div className="lab__dim" aria-hidden={!0} /><LabHud compact={n} /><div className="lab__center"><p className="lab__eyebrow">{s("laboratory.eyebrow")}</p><h1 className="lab__heading"><span className="lab__soon">{s("laboratory.soon")}</span><span className="lab__name">{s("laboratory.title")}</span></h1><p className="lab__desc">{s("laboratory.description")}</p></div></main>;
}
export { Lab as default };
