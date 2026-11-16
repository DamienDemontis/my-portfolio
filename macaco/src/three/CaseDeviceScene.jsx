import React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping, LinearFilter, Shape, ShapeGeometry, SRGBColorSpace, VideoTexture } from "three";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
const M = 2,
  S = M * (9 / 19.5),
  j = 0.036,
  m = S + j * 2,
  g = M + j * 2,
  d = 0.085,
  T = 0.1,
  R = 0.22,
  I = 0.2,
  A = 6,
  L = 26,
  W = 0.075,
  X = 0.15,
  _ = 0.05,
  E = (e, l, f) => e + (l - e) * f;
function b(e, l, f, s = 10) {
  const n = e / 2,
    i = l / 2,
    t = Math.min(f, n, i),
    r = new Shape();
  r.moveTo(-n + t, -i), r.lineTo(n - t, -i), r.absarc(n - t, -i + t, t, -Math.PI / 2, 0), r.lineTo(n, i - t), r.absarc(n - t, i - t, t, 0, Math.PI / 2), r.lineTo(-n + t, i), r.absarc(-n + t, i - t, t, Math.PI / 2, Math.PI), r.lineTo(-n, -i + t), r.absarc(-n + t, -i + t, t, Math.PI, Math.PI * 1.5);
  const o = new ShapeGeometry(r, s),
    c = o.attributes.position,
    p = o.attributes.uv;
  for (let u = 0; u < c.count; u++) p.setXY(u, (c.getX(u) + n) / e, (c.getY(u) + i) / l);
  return p.needsUpdate = !0, o;
}
const k = T - j,
  y = 0.008,
  v = b(S, M, k),
  z = b(m - y, g - y, T - y / 2);
function V({
  device: e,
  position: l,
  rotationY: f
}) {
  const s = React.useMemo(() => {
    if (!(e != null && e.videoEl)) return null;
    const n = new VideoTexture(e.videoEl);
    return n.colorSpace = SRGBColorSpace, n.minFilter = LinearFilter, n.magFilter = LinearFilter, n.generateMipmaps = !1, n;
  }, [e == null ? void 0 : e.videoEl]);
  return React.useEffect(() => () => s == null ? void 0 : s.dispose(), [s]), React.useEffect(() => {
    const n = e == null ? void 0 : e.videoEl;
    if (!n || !s) return;
    const i = () => {
      const {
        videoWidth: t,
        videoHeight: r
      } = n;
      if (!t || !r) return;
      const o = S / M,
        c = t / r;
      c > o ? (s.repeat.set(o / c, 1), s.offset.set((1 - o / c) / 2, 0)) : (s.repeat.set(1, c / o), s.offset.set(0, (1 - c / o) / 2));
    };
    return i(), n.addEventListener("loadedmetadata", i), () => n.removeEventListener("loadedmetadata", i);
  }, [e == null ? void 0 : e.videoEl, s]), <group position={l} rotation={[0, f, 0]}><RoundedBox args={[m, g, d]} radius={T} smoothness={6} creaseAngle={0.5}><meshPhysicalMaterial color="#08080a" metalness={0.45} roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.15} /></RoundedBox><mesh position={[0, 0, d / 2 + 0.0015]} geometry={v}>{s ? <meshBasicMaterial map={s} toneMapped={!1} /> : <meshBasicMaterial color="#050505" toneMapped={!1} />}</mesh><mesh position={[0, 0, d / 2 + 0.004]} geometry={z}><meshPhysicalMaterial color="#ffffff" transparent={!0} opacity={0.055} roughness={0.04} metalness={0} envMapIntensity={2.2} depthWrite={!1} /></mesh></group>;
}
function U({
  devices: e,
  pointerRef: l
}) {
  const f = React.useRef(null),
    {
      size: s
    } = useThree(),
    n = React.useMemo(() => {
      const t = 2 * Math.tan(L * Math.PI / 360) * A,
        r = t * (s.width / Math.max(1, s.height)),
        o = e.length < 2,
        c = o ? g : g + I * 2,
        p = o ? m : m * 2 + R;
      return Math.min(t * 0.95 / c, r * 0.9 / p);
    }, [s.width, s.height, e.length]);
  useFrame((t, r) => {
    const o = f.current;
    if (!o) return;
    const c = l.current,
      p = 1 - Math.exp(-4.5 * Math.min(r, 0.1));
    o.rotation.y = E(o.rotation.y, c.x * X, p), o.rotation.x = E(o.rotation.x, -c.y * W, p), o.position.x = E(o.position.x, c.x * _, p), o.position.y = E(o.position.y, -c.y * _ * 0.6, p);
  });
  const i = e.length === 1;
  return <group ref={f} scale={n}>{e.map((t, r) => {
      const o = r === 0 ? -1 : 1;
      return <V device={t} position={i ? [0, 0, 0] : [o * (m + R) / 2, o * -I, o * -0.12]} rotationY={i ? 0 : o * 0.1} key={t.key} />;
    })}</group>;
}
function Z() {
  return <Environment resolution={256} frames={1}><Lightformer form="rect" intensity={3.2} color="#ffffff" position={[-3, 2.5, 4]} scale={[7, 7, 1]} target={[0, 0, 0]} /><Lightformer form="rect" intensity={5} color="#ffffff" position={[3.2, 0, 3]} scale={[0.5, 8, 1]} target={[0, 0, 0]} /><Lightformer form="rect" intensity={2.2} color="#9fd8ff" position={[2.5, 1, -4]} scale={[6, 6, 1]} target={[0, 0, 0]} /><Lightformer form="rect" intensity={0.8} color="#ffffff" position={[0, -4, 2]} scale={[6, 3, 1]} target={[0, 0, 0]} /></Environment>;
}
function K({
  devices: e,
  pointerRef: l,
  active: f
}) {
  return <Canvas frameloop={f ? "always" : "never"} gl={{
    alpha: !0,
    antialias: !0,
    powerPreference: "high-performance"
  }} dpr={[1, 1.75]} camera={{
    fov: L,
    near: 0.1,
    far: 50,
    position: [0, 0, A]
  }} onCreated={({
    gl: s,
    scene: n
  }) => {
    s.setClearColor(0, 0), s.toneMapping = ACESFilmicToneMapping, s.toneMappingExposure = 1, s.outputColorSpace = SRGBColorSpace, n.background = null;
  }} style={{
    width: "100%",
    height: "100%",
    pointerEvents: "none"
  }}><ambientLight intensity={0.35} /><Z /><U devices={e} pointerRef={l} /></Canvas>;
}
export { K as default };
