import React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping, Box3, LoopRepeat, SRGBColorSpace, Vector3 } from "three";
import { Center, useAnimations, useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { hexToRgb01, makeDitherMaterial } from "./ditherMaterial.js";
import { clipsFor, readySkinned } from "./character/clips.js";
const B = "/character/damien.glb";
useGLTF.preload(B);
const R = 1.15,
  U = 0.03,
  W = e => e < 0 ? 0 : e > 1 ? 1 : e,
  X = e => e * e * (3 - 2 * e),
  _ = (e, i, t) => e.set(e.x + (i[0] - e.x) * t, e.y + (i[1] - e.y) * t, e.z + (i[2] - e.z) * t),
  A = new Vector3(),
  g = new Vector3(),
  Y = new Vector3(),
  J = new Vector3();
function K({
  colors: e,
  glitch: i,
  stageRef: t,
  maxGhosts: s
}) {
  const v = React.useRef(null),
    a = React.useRef(),
    {
      scene: c
    } = useGLTF(B),
    m = React.useMemo(() => clipsFor(c), [c]),
    r = React.useMemo(() => readySkinned(clone(c)), [c]),
    {
      actions: M
    } = useAnimations(m, a),
    l = React.useMemo(() => makeDitherMaterial({
      transparent: !1,
      pixel: e.pixel,
      gain: e.gain,
      colorLight: e.light,
      colorDark: e.dark
    }), [r]);
  React.useMemo(() => {
    r.traverse(o => {
      o.isMesh && (o.material = l, o.castShadow = !1, o.receiveShadow = !1, o.frustumCulled = !1);
    });
  }, [r, l]), useFrame((o, d) => {
    var L;
    const n = l.userData.uniforms;
    n.uPixel.value = e.pixel, n.uGain.value = e.gain;
    const f = (L = t.current) == null ? void 0 : L.tint,
      b = 1 - Math.exp(-11 * Math.min(0.1, d)),
      k = hexToRgb01(f || e.dark),
      j = f ? hexToRgb01(f).map(z => 1 - z) : hexToRgb01(e.light);
    _(n.uColorDark.value, k, b), _(n.uColorLight.value, j, b);
    const p = v.current;
    if (!p) return;
    const y = t.current,
      T = ((y == null ? void 0 : y.lock) != null ? y.lock : (y == null ? void 0 : y.camT) ?? 0) > U && !(y != null && y.idle);
    p.paused !== T && (p.paused = T);
  });
  const u = React.useMemo(() => {
    const o = new Vector3();
    return new Box3().setFromObject(r).getSize(o), 2.4 / (o.y || 1);
  }, [r]);
  return React.useEffect(() => {
    const o = M.idle;
    if (o) return o.reset().setLoop(LoopRepeat, 1 / 0).play(), v.current = o, () => {
      o.stop(), v.current = null;
    };
  }, [M]), <group ref={a} scale={u} rotation={[0, -Math.PI / 2, 0]}><Center precise={!1}><primitive object={r} />{s > 0 && <N source={r} fitScale={u} glitch={i} colors={e} stageRef={t} maxGhosts={s} />}</Center></group>;
}
function N({
  source: e,
  fitScale: i,
  glitch: t,
  colors: s,
  stageRef: v,
  maxGhosts: a
}) {
  const {
    ghosts: c,
    mainBones: m
  } = React.useMemo(() => {
    const l = [];
    return e.traverse(o => {
      o.isBone && l.push(o);
    }), {
      ghosts: Array.from({
        length: a
      }, () => {
        const o = clone(e),
          d = makeDitherMaterial();
        o.traverse(f => {
          f.isMesh && (f.material = d, f.frustumCulled = !1, f.castShadow = !1, f.receiveShadow = !1);
        });
        const n = [];
        return o.traverse(f => {
          f.isBone && n.push(f);
        }), o.visible = !1, {
          obj: o,
          mat: d,
          bones: n,
          bornAt: -1,
          active: !1
        };
      }),
      mainBones: l
    };
  }, [e, a]);
  React.useEffect(() => () => {
    for (const l of c) l.mat.dispose();
  }, [c]);
  const r = React.useRef(0),
    M = React.useRef(0);
  return useFrame(l => {
    var d;
    const u = l.clock.elapsedTime * 1e3;
    if (((d = v.current) == null ? void 0 : d.moving) && u >= r.current) {
      r.current = u + Math.max(16, t.spawnIntervalMs);
      let n = c.find(p => !p.active);
      if (!n) for (const p of c) (!n || p.bornAt < n.bornAt) && (n = p);
      const f = Math.min(Math.max(1, Math.round(t.copies)), a),
        b = M.current++ % f;
      for (let p = 0; p < n.bones.length; p++) n.bones[p].position.copy(m[p].position), n.bones[p].quaternion.copy(m[p].quaternion), n.bones[p].scale.copy(m[p].scale);
      const k = t.jitter;
      n.obj.position.set(((b + 1) * t.offsetX + (Math.random() * 2 - 1) * k) / i, ((b + 1) * t.offsetY + (Math.random() * 2 - 1) * k) / i, ((b + 1) * t.offsetZ + (Math.random() * 2 - 1) * k) / i);
      const j = n.mat.userData.uniforms;
      j.uPixel.value = s.pixel, j.uGain.value = t.gain, j.uColorLight.value.set(...hexToRgb01(t.light || s.light)), j.uColorDark.value.set(...hexToRgb01(t.dark || s.dark)), j.uOpacity.value = t.opacity, n.obj.visible = !0, n.bornAt = u, n.active = !0;
    }
    for (const n of c) {
      if (!n.active) continue;
      const f = u - n.bornAt,
        b = Math.max(1, t.fadeMs);
      f >= t.lifetimeMs ? (n.active = !1, n.obj.visible = !1) : f > t.lifetimeMs - b && (n.mat.userData.uniforms.uOpacity.value = t.opacity * (1 - (f - (t.lifetimeMs - b)) / b));
    }
  }), c.map((l, u) => <primitive object={l.obj} key={u} />);
}
function Q({
  shots: e,
  stageRef: i,
  portraitFit: t = !0
}) {
  return useFrame(({
    camera: s,
    size: v
  }) => {
    const a = i.current,
      c = (a == null ? void 0 : a.lock) != null ? a.lock : (a == null ? void 0 : a.camT) ?? 0,
      m = Math.max(0, Math.min(e.length - 1, c)),
      r = Math.min(e.length - 2, Math.floor(m)),
      M = X(W(m - r)),
      l = e[r],
      u = e[r + 1];
    A.set(...l.pos).lerp(Y.set(...u.pos), M), g.set(...l.look).lerp(J.set(...u.look), M);
    const o = l.fov + (u.fov - l.fov) * M,
      d = v.width / Math.max(1, v.height);
    if (t && d < R) {
      const n = Math.min(2, R / d);
      g.x *= 0.3, A.sub(g).multiplyScalar(n).add(g), g.y -= 0.18 * (n - 1) + 0.12;
    }
    s.position.copy(A), s.lookAt(g), Math.abs(s.fov - o) > 0.001 && (s.fov = o, s.updateProjectionMatrix());
  }), null;
}
const S = new Vector3();
function Ee({
  hotspots: e,
  markersRef: i,
  project: t = !0
}) {
  return React.useEffect(() => {
    if (!t) for (const s of i.current || []) s && (s.style.transform = "", s.style.visibility = "", s.style.removeProperty("--mx"));
  }, [t, i]), useFrame(({
    camera: s,
    size: v
  }) => {
    const a = i.current;
    if (!(!a || !t)) for (let c = 0; c < e.length; c++) {
      const m = a[c];
      if (!m) continue;
      if (S.set(...e[c].pos).project(s), S.z > 1) {
        m.style.visibility = "hidden";
        continue;
      }
      m.style.visibility = "";
      const r = (S.x * 0.5 + 0.5) * v.width,
        M = (0.5 - S.y * 0.5) * v.height;
      m.style.transform = `translate3d(${r.toFixed(1)}px, ${M.toFixed(1)}px, 0)`, m.style.setProperty("--mx", `${r.toFixed(1)}px`);
    }
  }), null;
}
function Te() {
  const e = useThree(i => i.advance);
  return React.useEffect(() => {
    e(performance.now(), !0);
  }, [e]), null;
}
function ie({
  shots: e,
  colors: i,
  glitch: t,
  hotspots: s,
  markersRef: v,
  stageRef: a,
  active: c,
  dpr: m,
  maxGhosts: r,
  portraitFit: M = !0,
  projectHotspots: l = !0
}) {
  return <Canvas frameloop={c ? "always" : "never"} resize={{
    scroll: !1,
    debounce: {
      scroll: 0,
      resize: 0
    }
  }} gl={{
    alpha: !0,
    antialias: !1,
    powerPreference: "high-performance"
  }} dpr={m} camera={{
    near: 0.01,
    far: 100,
    fov: e[0].fov,
    position: e[0].pos
  }} onCreated={({
    gl: u,
    scene: o,
    camera: d
  }) => {
    d.near = 0.01, d.far = 100, d.updateProjectionMatrix(), u.setClearColor(0, 0), u.toneMapping = ACESFilmicToneMapping, u.toneMappingExposure = 1.05, u.outputColorSpace = SRGBColorSpace, o.background = null;
  }} style={{
    width: "100%",
    height: "100%",
    pointerEvents: "none"
  }}><Q shots={e} stageRef={a} portraitFit={M} /><Ee hotspots={s} markersRef={v} project={l} /><ambientLight intensity={0.16} /><directionalLight position={[3, 4, 4]} intensity={1.05} /><directionalLight position={[-4, 1.5, -3]} intensity={0.5} /><React.Suspense fallback={null}><K colors={i} glitch={t} stageRef={a} maxGhosts={r} /><Te /></React.Suspense></Canvas>;
}
export { ie as default };
