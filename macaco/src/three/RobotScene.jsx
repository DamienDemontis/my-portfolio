import React from "react";
import { ACESFilmicToneMapping, AddEquation, Box3, Color, CustomBlending, CylinderGeometry, DoubleSide, LoopOnce, LoopRepeat, Mesh, MeshBasicMaterial, OneFactor, SRGBColorSpace, Vector3 } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, Lightformer, PerformanceMonitor, useAnimations, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { $a, config, Fn, Ha, La, qn, Un, Vn, Wn, Ya } from "../app-core.jsx";
import { m as mCore, n as nCore } from "./ditherMaterial.js";
function _e(t) {
  if (!t || !t.isMeshStandardMaterial) return null;
  if (t.userData.powerUniforms) return t.userData.powerUniforms;
  const i = {
    uPowerCharge: {
      value: 0
    },
    uPowerTime: {
      value: 0
    },
    uPowerColor: {
      value: new Color("#25f4ff")
    },
    uPowerIrid: {
      value: 0
    },
    uPowerIridSpeed: {
      value: 0.15
    },
    uPowerIridScale: {
      value: 1.2
    }
  };
  t.userData.powerUniforms = i;
  const o = t.onBeforeCompile;
  return t.onBeforeCompile = e => {
    o && o(e), Object.assign(e.uniforms, i), e.vertexShader = `varying vec3 vPowWPos;
` + e.vertexShader.replace("#include <project_vertex>", `#include <project_vertex>
  vPowWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`), e.fragmentShader = `uniform float uPowerCharge; uniform float uPowerTime; uniform vec3 uPowerColor;
       uniform float uPowerIrid, uPowerIridSpeed, uPowerIridScale;
       varying vec3 vPowWPos;
       // holographic thin-film palette (same as the city's glow/beams)
       vec3 powIridPal(float t){ return 0.6 + 0.4 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67))); }
       float powHash(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
       float powNoise(vec3 p){
         vec3 i = floor(p), f = fract(p);
         f = f * f * (3.0 - 2.0 * f);
         float a = powHash(i),                  b = powHash(i + vec3(1.,0.,0.));
         float c = powHash(i + vec3(0.,1.,0.)), d = powHash(i + vec3(1.,1.,0.));
         float e = powHash(i + vec3(0.,0.,1.)), g = powHash(i + vec3(1.,0.,1.));
         float h = powHash(i + vec3(0.,1.,1.)), k = powHash(i + vec3(1.,1.,1.));
         return mix(mix(mix(a,b,f.x), mix(c,d,f.x), f.y),
                    mix(mix(e,g,f.x), mix(h,k,f.x), f.y), f.z);
       }
` + e.fragmentShader.replace("#include <dithering_fragment>", `#include <dithering_fragment>
        if (uPowerCharge > 0.0001) {
          // Holographic charge (bodies reference): energy lives on the RIM
          // (fresnel-gated everywhere, so the robot stays readable inside) and
          // is broken up by soft wisps of noise drifting upward — no hard
          // pixels, it reads as gas/plasma licking the silhouette.
          vec3 nrm = normalize(vNormal);
          vec3 vd = normalize(vViewPosition);
          float fres = pow(1.0 - clamp(dot(nrm, vd), 0.0, 1.0), 2.0);
          vec3 np = vec3(vPowWPos.x * 5.0, vPowWPos.y * 2.2 - uPowerTime * 0.7, vPowWPos.z * 5.0);
          float wisp = powNoise(np) * 0.65 + powNoise(np * 2.7 + 11.3) * 0.35;
          wisp = smoothstep(0.35, 0.8, wisp);
          float pulse = 0.85 + 0.15 * sin(uPowerTime * 5.0);
          float e = fres * (0.35 + 0.65 * wisp) * pulse;
          // a slow, wide surge climbing the body (soft — no hard band edge)
          float surge = exp(-3.0 * abs(fract(vPowWPos.y * 0.3 - uPowerTime * 0.35) - 0.5));
          e += fres * wisp * surge * 0.6;
          // Iridescent option: shimmer the energy colour through the holographic
          // palette, driven by view angle (fresnel) + height + time — same
          // recipe as the city glow so the two effects read as one language.
          float pit = fres * uPowerIridScale + vPowWPos.y * 0.05 + uPowerTime * uPowerIridSpeed;
          vec3 pcol = mix(uPowerColor, powIridPal(pit), uPowerIrid);
          gl_FragColor.rgb += pcol * (e * 2.2 * uPowerCharge); // additive → blooms
        }`);
  }, t.needsUpdate = !0, i;
}
function De(t) {
  const i = {
      uTime: {
        value: 0
      },
      uCharge: {
        value: 0
      },
      uIntensity: {
        value: 1.5
      },
      uSpeed: {
        value: 1
      },
      uTwist: {
        value: 1.6
      },
      uBands: {
        value: 4
      },
      uSeed: {
        value: t
      },
      uColor: {
        value: new Color("#25f4ff")
      },
      uColorDark: {
        value: new Color("#140a4d")
      },
      uDitherPx: {
        value: 3
      },
      uIrid: {
        value: 0
      },
      uIridSpeed: {
        value: 0.15
      },
      uIridScale: {
        value: 1.2
      }
    },
    o = new MeshBasicMaterial({
      transparent: !0,
      depthWrite: !1,
      side: DoubleSide,
      fog: !1,
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor
    });
  return o.onBeforeCompile = e => {
    Object.assign(e.uniforms, i), e.vertexShader = `varying float vAng;
varying float vH;
varying vec3 vWPos;
varying vec3 vRad;
` + e.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
        vAng = atan(position.z, position.x);
        vH = position.y + 0.5;
        vRad = normalize(vec3(position.x, 0.0, position.z));
        vWPos = (modelMatrix * vec4(position, 1.0)).xyz;`), e.fragmentShader = `uniform float uTime, uCharge, uIntensity, uSpeed, uTwist, uBands, uSeed, uDitherPx, uIrid, uIridSpeed, uIridScale; uniform vec3 uColor, uColorDark;
       varying float vAng; varying float vH; varying vec3 vWPos; varying vec3 vRad;
       vec3 vxIridPal(float t){ return 0.6 + 0.4 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67))); }
       float vxHash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
       float vxNoise(vec2 p){
         vec2 i = floor(p), f = fract(p);
         f = f * f * (3.0 - 2.0 * f);
         float a = vxHash(i), b = vxHash(i + vec2(1., 0.));
         float c = vxHash(i + vec2(0., 1.)), d = vxHash(i + vec2(1., 1.));
         return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
       }
       float vxBayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
` + e.fragmentShader.replace("#include <dithering_fragment>", `#include <dithering_fragment>
        {
          float t = uTime * uSpeed;
          float a01 = vAng / 6.28318 + 0.5;
          // Spiral coordinate: uBands comet ribbons wrap around, climbing with
          // uTwist as they go — scrolling around the body over time.
          float s = a01 * uBands + vH * uTwist - t + uSeed;
          float p = fract(s);
          float rib = pow(p, 2.5);                                  // long soft tail → bright head
          // Wispy breakup: 2-octave flow noise drifting up and around, so the
          // ribbons look like gas/energy, not solid painted stripes.
          vec2 np = vec2(a01 * 4.0 + uSeed * 3.1 + t * 0.15, vH * 2.5 - uTime * 0.35);
          float n = vxNoise(np) * 0.65 + vxNoise(np * 2.7 + 13.1) * 0.35;
          float wisp = smoothstep(0.28, 0.75, n);
          // Vertical envelope: dense near the base, tapering upward (tornado).
          float env = smoothstep(0.0, 0.12, vH) * (1.0 - smoothstep(0.55, 1.0, vH));
          // Limb brightening: the shell is brighter where seen edge-on, so the
          // swirl reads as a volume instead of a flat texture.
          vec3 vd = normalize(cameraPosition - vWPos);
          float limb = pow(1.0 - abs(dot(vRad, vd)), 1.5);
          float e = rib * wisp * env * (0.35 + 0.65 * limb) * uCharge * uIntensity;
          // Dithered quantization (same Bayer trick as the background/city):
          // the energy becomes a screen-space dot pattern — the denser the
          // dots, the stronger the energy — matching the intro's dither look.
          vec2 bp = floor(gl_FragCoord.xy / max(uDitherPx, 1.0));
          float b4 = vxBayer2(0.25 * bp) * 0.25 + vxBayer2(bp);
          float b8 = vxBayer2(0.125 * bp) * 0.0625 + b4;
          b8 = (b8 * 63.0 + 0.5) / 64.0;
          float q = step(b8, clamp(e, 0.0, 1.0));                    // dithered coverage
          // Iridescent option: the light/dark pair drifts through the holographic
          // palette — hue cycling around the vortex (angle) + height + time.
          float vit = a01 * uIridScale + vH * 0.3 + uTime * uIridSpeed + uSeed * 0.1;
          vec3 pal = vxIridPal(vit);
          vec3 cLight = mix(uColor, pal, uIrid);
          vec3 cDark = mix(uColorDark, pal * 0.25, uIrid); // palette kept dark for the tails
          // Two-colour ramp: dark tails → bright heads (by local energy).
          vec3 col = mix(cDark, cLight, clamp(e * 1.4 - 0.1, 0.0, 1.0));
          col = mix(col, vec3(1.0), smoothstep(0.85, 1.0, p) * 0.35); // head sparkle
          float dotGain = 0.4 + 0.6 * clamp(e, 0.0, 1.0);            // keep energy grading in the dots
          // RGB blends One/One (linear); alpha carries the real coverage so the
          // DOM layers behind the canvas stay visible through the veils.
          gl_FragColor = vec4(col * (q * dotGain), q * min(0.35 + e, 1.0));
        }`);
  }, o.userData.uniforms = i, o;
}
function Re() {
  const t = React.useRef(),
    i = React.useMemo(() => {
      const o = new CylinderGeometry(1, 1, 1, 64, 1, !0);
      return [0, 1, 2].map(e => {
        const r = new Mesh(o, De(e * 7.31));
        return r.frustumCulled = !1, r.renderOrder = 10 + e, r;
      });
    }, []);
  return useFrame(o => {
    const e = config.power,
      r = Vn($a()),
      c = o.clock.elapsedTime;
    i.forEach((a, l) => {
      const s = a.material.userData.uniforms,
        x = 1 + l * 0.35;
      a.scale.set(e.auraRadius * 0.75 * x, e.auraHeight, e.auraRadius * 0.75 * x), a.visible = r > 0.001, s.uTime.value = c, s.uCharge.value = r * (1 - l * 0.25), s.uIntensity.value = e.auraIntensity, s.uSpeed.value = e.auraSwirl * (1 - l * 0.22), s.uTwist.value = e.auraTwist, s.uBands.value = Math.max(1, e.auraCount | 0), s.uColor.value.set(e.auraColor), s.uColorDark.value.set(e.auraColorDark), s.uDitherPx.value = e.auraDitherPx, s.uIrid.value = 1, s.uIridSpeed.value = e.iridSpeed, s.uIridScale.value = e.iridScale;
    });
    const n = config.robotCenter;
    t.current && t.current.position.set(n[0], n[1], n[2]);
  }), <group ref={t}>{i.map((o, e) => <primitive object={o} key={e} />)}</group>;
}
const oe = "/intro/Mecha_Full.glb",
  Be = "#FEFF00",
  He = 30,
  Fe = 0,
  We = ["MAT_Emissive_Limbs", "MAT_Emissive_Body", "MAT_Emissive_Head"],
  W = new Vector3();
useGLTF.preload(oe);
const Z = 10;
function Oe({
  source: t,
  fitScale: i
}) {
  const {
      ghosts: o,
      mainBones: e
    } = React.useMemo(() => {
      const n = [];
      return t.traverse(l => {
        l.isBone && n.push(l);
      }), {
        ghosts: Array.from({
          length: Z
        }, () => {
          const l = clone(t),
            s = mCore();
          l.traverse(p => {
            p.isMesh && (p.material = s, p.frustumCulled = !1, p.castShadow = !1, p.receiveShadow = !1);
          });
          const x = [];
          return l.traverse(p => {
            p.isBone && x.push(p);
          }), l.visible = !1, {
            obj: l,
            mat: s,
            bones: x,
            bornAt: -1,
            state: "idle"
          };
        }),
        mainBones: n
      };
    }, [t]),
    r = React.useRef(0),
    c = React.useRef(0);
  return useFrame(n => {
    const a = config.glitch,
      l = n.clock.elapsedTime * 1e3;
    if (config.glitchActive && l >= r.current) {
      r.current = l + Math.max(16, a.spawnIntervalMs);
      let s = null;
      for (const S of o) if (S.state === "idle") {
        s = S;
        break;
      }
      if (!s) for (const S of o) (!s || S.bornAt < s.bornAt) && (s = S);
      const x = Math.min(Math.max(1, Math.round(a.copies)), Z),
        p = c.current++ % x;
      for (let S = 0; S < s.bones.length; S++) {
        const C = e[S],
          I = s.bones[S];
        I.position.copy(C.position), I.quaternion.copy(C.quaternion), I.scale.copy(C.scale);
      }
      const P = a.jitter;
      s.obj.position.set(((p + 1) * a.offsetX + (Math.random() * 2 - 1) * P) / i, ((p + 1) * a.offsetY + (Math.random() * 2 - 1) * P) / i, ((p + 1) * a.offsetZ + (Math.random() * 2 - 1) * P) / i), s.mat.userData.uniforms.uPixel.value = a.ditherPx, s.mat.userData.uniforms.uGain.value = a.gain, s.mat.userData.uniforms.uColorLight.value.set(...nCore(a.colorLight)), s.mat.userData.uniforms.uColorDark.value.set(...nCore(a.colorDark)), s.mat.userData.uniforms.uOpacity.value = 1, s.obj.visible = !0, s.bornAt = l, s.state = "active";
    }
    for (const s of o) {
      if (s.state !== "active") continue;
      const x = l - s.bornAt,
        p = Math.max(1, a.fadeMs);
      x >= a.lifetimeMs ? (s.state = "idle", s.obj.visible = !1) : x > a.lifetimeMs - p && (s.mat.userData.uniforms.uOpacity.value = 1 - (x - (a.lifetimeMs - p)) / p);
    }
  }), <>{o.map((n, a) => <primitive object={n.obj} key={a} />)}</>;
}
function Le({
  phase: t,
  onDurations: i,
  onLanding: o
}) {
  const e = React.useRef(),
    {
      scene: r,
      animations: c
    } = useGLTF(oe),
    {
      actions: n,
      mixer: a
    } = useAnimations(c, e);
  React.useEffect(() => {
    r && (window.__macacoRobotReady = !0, window.dispatchEvent(new CustomEvent("macaco:robot-ready")));
  }, [r]);
  const l = React.useRef(!1),
    s = React.useRef(""),
    x = React.useRef(-1),
    p = React.useRef(o);
  p.current = o, React.useEffect(() => {
    const d = n.power_on,
      m = n.descent;
    !i || !d || !m || i({
      powerOnMs: d.getClip().duration * 1e3,
      descentMs: m.getClip().duration * 1e3
    });
  }, [n, i]);
  const P = React.useMemo(() => {
      const d = new Box3().setFromObject(r),
        m = new Vector3();
      return d.getSize(m), 2.4 / (m.y || 1);
    }, [r]),
    S = React.useMemo(() => {
      const d = [],
        m = new Color(Be);
      return r.traverse(f => {
        if (!f.isMesh) return;
        const y = Array.isArray(f.material) ? f.material : [f.material];
        for (const h of y) h && (h.transparent = !1, h.depthWrite = !0, h.opacity = 1, h.alphaTest = 0, h.needsUpdate = !0, We.includes(h.name) && (h.emissive = m.clone(), h.emissiveIntensity = 0, h.color = new Color("#0c0c0c"), h.toneMapped = !0, d.includes(h) || d.push(h)));
        f.castShadow = !1, f.receiveShadow = !1, f.frustumCulled = !1;
      }), d;
    }, [r]),
    C = React.useMemo(() => {
      const d = [],
        m = new Set();
      return r.traverse(f => {
        if (!f.isMesh) return;
        const y = Array.isArray(f.material) ? f.material : [f.material];
        for (const h of y) {
          if (!h || m.has(h)) continue;
          m.add(h);
          const A = _e(h);
          A && d.push(A);
        }
      }), d;
    }, [r]),
    I = React.useMemo(() => {
      const d = [];
      return r.traverse(f => {
        f.isBone && d.push(f);
      }), d.find(f => /spine|chest|hips|pelvis|torso|body/i.test(f.name)) || d[Math.floor(d.length * 0.4)] || null;
    }, [r]);
  return React.useEffect(() => {
    const {
      power_on: d,
      build: m,
      descent: f,
      idle: y
    } = n;
    if (!d || !m || !f || !y) {
      console.warn("[intro] missing clips", Object.keys(n));
      return;
    }
    d.setLoop(LoopOnce, 1), d.clampWhenFinished = !0, m.setLoop(LoopOnce, 1), m.clampWhenFinished = !0, f.setLoop(LoopOnce, 1), f.clampWhenFinished = !0, y.setLoop(LoopRepeat, 1 / 0);
  }, [n]), React.useEffect(() => {
    const d = n.idle,
      m = f => {
        var y;
        f.action === n.descent && d && (d.reset().play(), f.action.crossFadeTo(d, 0.4, !1), qn(), l.current && (l.current = !1, Ha(), (y = p.current) == null || y.call(p)));
      };
    return a.addEventListener("finished", m), () => a.removeEventListener("finished", m);
  }, [n, a]), useFrame(d => {
    var q;
    const m = n.power_on,
      f = n.build,
      y = n.descent,
      h = n.idle,
      A = m && f && y && h,
      L = $a();
    let k = "",
      B = -1 / 0;
    for (const w of config.cameraShots) w.anim && w.at <= L && w.at >= B && (B = w.at, k = w.anim);
    if (A) if (config.scrollDriven) {
      const w = k === "descent" ? B + y.getClip().duration * 1e3 : 1 / 0;
      if (config.scrollDriven && !0 && L >= w) {
        for (const b of [m, f, y]) b.enabled = !1, b.setEffectiveWeight(0);
        h.enabled = !0, h.setEffectiveWeight(1), h.paused = !1, (!h.isRunning() || s.current !== "idle") && h.reset().play(), s.current = "idle", qn();
      } else {
        const b = k ? n[k] : m;
        for (const _ of [m, f, y, h]) _ !== b && (_.enabled = !1, _.setEffectiveWeight(0));
        b.isRunning() || b.play(), b.enabled = !0, b.setEffectiveWeight(1), b.paused = !0, b.time = Math.max(0, Math.min(k ? (L - B) / 1e3 : 0, b.getClip().duration)), s.current = k;
      }
    } else {
      for (const w of [f, y, h]) w.stop();
      m.isRunning() || m.reset().play(), m.paused = !0, m.time = 0, s.current = "", x.current = -1;
    }
    const H = d.clock.elapsedTime,
      re = t !== "off";
    let F;
    if (!re) F = 0;else if (t === "igniting") {
      const w = 0.5 + 0.5 * Math.sin(H * 47) * Math.sin(H * 13) + 0.3 * Math.sin(H * 90);
      F = Math.max(0, w) * 2.6;
    } else F = 2.2 + Math.sin(H * 2) * 0.15;
    for (const w of S) w.emissiveIntensity += (F - w.emissiveIntensity) * 0.4;
    if (A && l.current && y.isRunning() && y.time >= config.shake.atFrame / He && (l.current = !1, Ha(), (q = p.current) == null || q.call(p)), I) {
      I.getWorldPosition(W);
      const w = config.robotCenter;
      w[0] = W.x, w[1] = W.y, w[2] = W.z;
    }
    if (C.length) {
      const w = Fn($a()),
        V = d.clock.elapsedTime,
        b = config.power.color,
        _ = config.power.intensity,
        U = config.power;
      for (const j of C) j.uPowerCharge.value = w * _, j.uPowerTime.value = V, j.uPowerColor.value.set(b), j.uPowerIrid.value = 1, j.uPowerIridSpeed.value = U.iridSpeed, j.uPowerIridScale.value = U.iridScale;
    }
  }), <group ref={e} scale={P} rotation={[0, Fe, 0]}><Center><primitive object={r} /><Oe source={r} fitScale={P} /></Center></group>;
}
const $ = new Vector3(),
  ee = new Vector3(),
  ne = new Vector3(),
  se = new Vector3(),
  O = new Vector3(),
  E = new Vector3(),
  ze = t => t < 0 ? 0 : t > 1 ? 1 : t,
  ie = t => t * t * (3 - 2 * t);
function N(t, i, o = 1 / 0) {
  let e = -1,
    r = -1 / 0;
  for (let c = 0; c < t.length; c++) {
    if (t[c].exit) continue;
    const n = t[c].at;
    n <= i && n < o && n >= r && (r = n, e = c);
  }
  return e;
}
function Ge(t, i, o, e) {
  const r = Ya();
  if (r <= 0) return e;
  const c = Un(t);
  if (!c) return e;
  const n = ie(r);
  return i.lerp(ne.set(...c.pos), n), o.lerp(se.set(...c.look), n), e + (c.fov - e) * n;
}
function Ne(t, i, o, e) {
  if (!t.length) return o.set(0, 0, 5), e.set(0, 0, 0), 35;
  let r = N(t, i);
  if (r < 0) {
    r = 0;
    for (let l = 0; l < t.length; l++) t[l].exit || (t[r].exit || t[l].at < t[r].at) && (r = l);
  }
  const c = t[r],
    n = c.transition === "lerp" ? N(t, 1 / 0, c.at) : -1;
  let a;
  if (c.transition === "lerp" && n >= 0) {
    const l = ie(ze((i - c.at) / Math.max(1, c.dur))),
      s = t[n];
    o.set(...s.pos).lerp(ne.set(...c.pos), l), e.set(...s.look).lerp(se.set(...c.look), l), a = s.fov + (c.fov - s.fov) * l;
  } else o.set(...c.pos), e.set(...c.look), a = c.fov;
  return Ge(t, o, e, a);
}
function Qe() {
  const t = React.useRef(-1 / 0),
    i = React.useRef(config.shakeFireId);
  return useFrame(({
    camera: o,
    clock: e
  }) => {
    const r = $a(),
      c = Ne(config.cameraShots, r, $, ee);
    config.shakeFireId !== i.current && (i.current = config.shakeFireId, t.current = e.elapsedTime), O.set(0, 0, 0);
    const n = config.shake,
      a = e.elapsedTime - t.current;
    if (a >= 0 && a < n.durationMs / 1e3 && n.amplitude > 0) {
      const s = 1 - a / (n.durationMs / 1e3),
        x = n.amplitude * s * s,
        p = a * n.frequency * Math.PI * 2;
      O.set(Math.sin(p * 1) * x * 0.6, Math.sin(p * 1.37 + 1.3) * x, Math.sin(p * 0.8 + 2.1) * x * 0.3);
    }
    o.position.copy($).add(O), E.copy(ee).add(O), E.y += (config.heroExit || 0) * config.heroExitPitch, o.lookAt(E), Math.abs(o.fov - c) > 0.001 && (o.fov = c, o.updateProjectionMatrix());
    const l = config.camSync;
    l.pos[0] = o.position.x, l.pos[1] = o.position.y, l.pos[2] = o.position.z, l.look[0] = E.x, l.look[1] = E.y, l.look[2] = E.z, l.fov = c, l.on = !0;
  }), null;
}
const Ve = new Color(),
  Ue = new Vector3();
function Xe() {
  const t = React.useRef({});
  return useFrame(({
    scene: i
  }) => {
    const o = config.cameraShots,
      e = (o[N(o, $a())] || o[0]).lights;
    if (!e) return;
    const r = 0.08;
    for (const c of La) {
      const n = t.current[c.id],
        a = e[c.id];
      !n || !a || (n.intensity += (a.intensity - n.intensity) * r, n.color.lerp(Ve.set(a.color), r), a.pos && n.position && n.position.lerp(Ue.set(a.pos[0], a.pos[1], a.pos[2]), r));
    }
    i.environmentIntensity += (e.env - i.environmentIntensity) * r;
  }), <>{La.map(i => {
      const o = r => t.current[i.id] = r,
        e = config.cameraShots[0].lights[i.id];
      return i.type === "ambient" ? <ambientLight ref={o} color={e.color} intensity={e.intensity} key={i.id} /> : i.type === "point" ? <pointLight ref={o} color={e.color} position={e.pos} intensity={e.intensity} distance={6} decay={2} key={i.id} /> : <directionalLight ref={o} color={e.color} position={e.pos} intensity={e.intensity} key={i.id} />;
    })}</>;
}
function Ye() {
  const [, t] = React.useState(0);
  React.useEffect(() => Wn(() => t(e => e + 1)), []);
  const i = config.post,
    o = [];
  return o.push(<Bloom intensity={i.bloomIntensity} luminanceThreshold={i.bloomThreshold} luminanceSmoothing={i.bloomSmoothing} radius={i.bloomRadius} mipmapBlur={!0} key="bloom" />), o.push(<Vignette darkness={i.vignetteDarkness} offset={i.vignetteOffset} key="vig" />), o.length ? <EffectComposer disableNormalPass={!0} multisampling={0}>{o}</EffectComposer> : null;
}
function Je({
  phase: t,
  onDurations: i,
  onLanding: o,
  onPerf: e
}) {
  return <><PerformanceMonitor factor={1} iterations={6} onChange={e} /><Qe /><Environment resolution={256}><Lightformer intensity={0.5} color="#cdd4e0" position={[3, 3, 2]} scale={[5, 5, 1]} /><Lightformer intensity={0.55} color="#ffe680" position={[-2, 3, -4]} scale={[4, 6, 1]} /><Lightformer intensity={0.25} color="#0c0c10" position={[0, -3, 2]} scale={[8, 4, 1]} /></Environment><Xe /><React.Suspense fallback={null}><Le phase={t} onDurations={i} onLanding={o} /></React.Suspense><Re /><Ye /></>;
}
function RobotCanvas({
  phase: t,
  onDurations: i,
  onLanding: o,
  onPerf: e,
  active: r = !0,
  dpr: c = [1, 1.75]
}) {
  return <div className="intro-robot-canvas"><Canvas frameloop={r ? "always" : "never"} gl={{
      alpha: !0,
      antialias: !1,
      powerPreference: "high-performance"
    }} dpr={c} camera={{
      near: 0.01,
      far: 100,
      fov: config.cameraShots[0].fov,
      position: config.cameraShots[0].pos
    }} onCreated={({
      gl: n,
      scene: a,
      camera: l
    }) => {
      l.near = 0.01, l.far = 100, l.updateProjectionMatrix(), n.setClearColor(0, 0), n.toneMapping = ACESFilmicToneMapping, n.toneMappingExposure = 1.05, n.outputColorSpace = SRGBColorSpace, a.background = null;
    }} style={{
      width: "100%",
      height: "100%",
      pointerEvents: "none"
    }}><Je phase={t} onDurations={i} onLanding={o} onPerf={e} /></Canvas></div>;
}
export { RobotCanvas as default };
