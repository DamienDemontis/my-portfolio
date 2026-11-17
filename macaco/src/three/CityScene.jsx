import { introExitCamProgress, introScrollDurationMs } from "../components/intro/Intro.jsx";
import { config } from "../config.js";
import { onSceneRefresh } from "../lib/shared.js";
import React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping, BoxGeometry, DoubleSide, DynamicDrawUsage, InstancedBufferAttribute, InstancedMesh, MeshBasicMaterial, Object3D, PlaneGeometry, SRGBColorSpace, Vector3 } from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
const x = 400;
function h(a) {
  const e = (a || "#000000").replace("#", "");
  return [parseInt(e.slice(0, 2), 16) / 255, parseInt(e.slice(2, 4), 16) / 255, parseInt(e.slice(4, 6), 16) / 255];
}
function p(a, e, r) {
  const u = h(a);
  if (r <= 0) return u;
  const n = h(e);
  return [u[0] + (n[0] - u[0]) * r, u[1] + (n[1] - u[1]) * r, u[2] + (n[2] - u[2]) * r];
}
function N(a) {
  return function () {
    a |= 0, a = a + 1831565813 | 0;
    let e = Math.imul(a ^ a >>> 15, 1 | a);
    return e = e + Math.imul(e ^ e >>> 7, 61 | e) ^ e, ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function L() {
  const a = {
      uTime: {
        value: 0
      },
      uTurnOn: {
        value: 0
      },
      uWindowSize: {
        value: 0.55
      },
      uDensity: {
        value: 0.5
      },
      uMargin: {
        value: 0.28
      },
      uFlicker: {
        value: 0.15
      },
      uBright: {
        value: 2.2
      },
      uDitherPx: {
        value: 3
      },
      uBlend: {
        value: 0.7
      },
      uGen: {
        value: 0
      },
      uStagger: {
        value: 0.6
      },
      uHeroOff: {
        value: 0
      },
      uGroundY: {
        value: -6
      },
      uMaxH: {
        value: 31
      },
      uGlowWidth: {
        value: 1.2
      },
      uGlowIntensity: {
        value: 2
      },
      uGlowColor: {
        value: new Vector3(1, 0.9, 0.35)
      },
      uIrid: {
        value: 1
      },
      uIridSpeed: {
        value: 0.15
      },
      uIridScale: {
        value: 1.2
      },
      uFogColor: {
        value: new Vector3(0.5, 0.55, 0.35)
      },
      uFogHeight: {
        value: 6
      },
      uFogIntensity: {
        value: 0.6
      },
      uBuilding: {
        value: new Vector3(0.03, 0.04, 0.05)
      },
      uColorA: {
        value: new Vector3(1, 0.82, 0.23)
      },
      uColorB: {
        value: new Vector3(0, 0.7, 0.56)
      },
      uColorC: {
        value: new Vector3(0.5, 0.23, 0.94)
      }
    },
    e = new MeshBasicMaterial({
      color: 16777215,
      fog: !0,
      transparent: !0
    });
  return e.onBeforeCompile = r => {
    Object.assign(r.uniforms, a), r.vertexShader = `attribute float aSeed;
uniform float uGen, uStagger, uHeroOff;
varying vec3 vWPos; varying vec3 vWNorm; varying float vSeed; varying float vGrow; varying float vHFrac; varying float vHeight;
float cvHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
` + r.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
        vSeed = aSeed;
        vHFrac = position.y + 0.5;                     // 0 = base, 1 = top of the box
        vHeight = length(vec3(instanceMatrix[1]));     // world height of this tower
        vec3 instBase = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        float bOff = cvHash(floor(instBase.xz * 0.35) + aSeed * 0.7);
        // Hero building (aSeed < 0 sentinel): no random stagger — it takes the
        // deterministic uHeroOff slot in the stagger window instead (0 = grows
        // among the first towers, 1 = among the last).
        bOff = mix(uHeroOff, bOff, step(0.0, aSeed));
        float g = clamp(uGen * (1.0 + uStagger) - bOff * uStagger, 0.0, 1.0);
        vGrow = g;
        // PHYSICALLY grow the box height from its base (base stays at groundY).
        transformed.y = -0.5 + (position.y + 0.5) * max(g, 0.0001);
        vec4 wp = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
        vWPos = wp.xyz;
        vWNorm = normalize(mat3(modelMatrix * instanceMatrix) * normal);`), r.fragmentShader = `uniform float uTime, uTurnOn, uWindowSize, uDensity, uMargin, uFlicker, uBright, uDitherPx, uBlend, uGroundY, uMaxH, uGlowWidth, uGlowIntensity, uFogHeight, uFogIntensity, uIrid, uIridSpeed, uIridScale;
       uniform vec3 uBuilding, uColorA, uColorB, uColorC, uGlowColor, uFogColor;
       varying vec3 vWPos; varying vec3 vWNorm; varying float vSeed; varying float vGrow; varying float vHFrac; varying float vHeight;
       // holographic thin-film palette (pastel iridescence, IQ cosine palette)
       vec3 iridPal(float t){ return 0.6 + 0.4 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67))); }
       float cityHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
       float cityBayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
` + r.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
          {
            vec3 an = abs(normalize(vWNorm));
            float roof = step(max(an.x, an.z), an.y); // 1 on roof/floor faces
            float col = an.x > an.z ? vWPos.z : vWPos.x; // horizontal facade axis
            vec2 uv = vec2(col, vWPos.y) / max(uWindowSize, 0.02);
            vec2 cell = floor(uv);
            vec2 f = fract(uv);
            float m = uMargin;
            float inWin = step(m, f.x) * step(f.x, 1.0 - m) * step(m, f.y) * step(f.y, 1.0 - m);
            float h = cityHash(cell + vSeed);
            float lit = step(h, uDensity * clamp(uTurnOn, 0.0, 1.0)) * inWin * (1.0 - roof);
            float fl = cityHash(cell + vSeed + 7.3);
            float blink = fl < uFlicker ? (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 6.0 + fl * 40.0))) : 1.0;
            float cpick = cityHash(cell + vSeed + 3.1);
            vec3 wcol = cpick < 0.45 ? uColorA : (cpick < 0.78 ? uColorB : uColorC);
            diffuseColor.rgb = mix(uBuilding, wcol * uBright * blink, lit);
          }`).replace("#include <dithering_fragment>", `#include <dithering_fragment>
          {
            vec2 dp = floor(gl_FragCoord.xy / max(uDitherPx, 1.0));
            float thr = cityBayer2(dp * 0.5) * 0.25 + cityBayer2(dp) + 1.0 / 32.0;
            float lum = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
            // Quantize toward the dither pattern — keeps the dotty look but
            // preserves colour so lit windows still read.
            float q = step(thr, lum * 1.4);
            gl_FragColor.rgb *= mix(0.55, 1.0, q);
            // Blend into the background dither: dark facades fade toward
            // transparent (bg dither shows through & mixes), bright windows
            // stay opaque. uBlend dials how much the dark dissolves.
            float lum2 = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
            gl_FragColor.a = mix(1.0, smoothstep(0.0, 0.32, lum2), uBlend);
            // Towers now grow PHYSICALLY (vertex scales the geometry from the
            // base). Hide the ones that haven't started yet.
            gl_FragColor.a *= step(0.004, vGrow);
            float genActive = smoothstep(0.0, 0.04, vGrow) * (1.0 - smoothstep(0.9, 1.0, vGrow));
            float rthr = cityBayer2(dp * 0.5) * 0.5 + cityBayer2(dp) * 0.5;
            // GLOW + dithered fizzle at the physical top edge while it grows
            // (vHFrac≈1 is the top). Feeds bloom → glowing construction front.
            float distToTop = (1.0 - vHFrac) * vGrow * vHeight;
            float glow = exp(-distToTop / max(uGlowWidth, 0.05)) * genActive;
            // Iridescent glow: shimmer the top-edge colour through a holographic
            // palette driven by view angle (fresnel) + height + time, so it
            // shifts pink→cyan→purple as the camera moves past the towers.
            vec3 V = normalize(cameraPosition - vWPos);
            float fres = 1.0 - abs(dot(normalize(vWNorm), V));
            float it = fres * uIridScale + vWPos.y * 0.05 + uTime * uIridSpeed + vSeed * 0.5;
            vec3 gcol = mix(uGlowColor, iridPal(it), uIrid);
            gl_FragColor.rgb += gcol * (glow * uGlowIntensity);
            gl_FragColor.a = max(gl_FragColor.a, glow * genActive);
            float topFizz = clamp((1.0 - vHFrac) / 0.09, 0.0, 1.0);
            gl_FragColor.a *= mix(step(rthr, topFizz), 1.0, smoothstep(0.85, 1.0, vGrow));
            // GROUND FOG rising from the base: soft glow near groundY that fades
            // up (drifting), reading as mist creeping up the tower bases.
            float hAbove = vWPos.y - uGroundY;
            float fogT = 1.0 - smoothstep(0.0, max(uFogHeight, 0.1), hAbove);
            float fogN = 0.65 + 0.35 * sin(uTime * 1.3 + vWPos.x * 0.5 + vWPos.z * 0.4);
            float fog = fogT * fogN * uFogIntensity * step(0.02, vGrow);
            gl_FragColor.rgb += uFogColor * fog;
            gl_FragColor.a = max(gl_FragColor.a, clamp(fog, 0.0, 0.8));
          }`);
  }, e.userData.uniforms = a, e;
}
function U() {
  const {
      scene: a
    } = useThree(),
    e = React.useRef(-1),
    {
      mesh: r,
      seeds: u
    } = React.useMemo(() => {
      const o = new BoxGeometry(1, 1, 1),
        t = new Float32Array(x);
      o.setAttribute("aSeed", new InstancedBufferAttribute(t, 1));
      const l = new InstancedMesh(o, L(), x);
      return l.frustumCulled = !1, l.instanceMatrix.setUsage(DynamicDrawUsage), {
        mesh: l,
        seeds: t
      };
    }, []),
    n = () => {
      const o = config.city,
        t = N((o.seed | 0) * 1013904223 + 1 | 0),
        l = new Object3D();
      let s = 0;
      {
        const c = Math.max(0.1, o.heroTopY - o.groundY);
        l.position.set(o.heroX, o.groundY + c / 2, o.heroZ), l.rotation.set(0, o.heroRotY * Math.PI / 180, 0), l.scale.set(o.heroW, c, o.heroD), l.updateMatrix(), r.setMatrixAt(0, l.matrix), u[0] = -1, s = 1;
      }
      const i = Math.min(s + Math.max(1, o.count | 0), x);
      for (let c = s; c < i; c++) {
        const f = t() * Math.PI * 2,
          w = o.clearRadius + Math.pow(t(), 0.7) * (o.areaRadius - o.clearRadius),
          S = o.minH + Math.pow(t(), 1.8) * (o.maxH - o.minH),
          W = o.minW + t() * (o.maxW - o.minW),
          P = o.minW + t() * (o.maxW - o.minW);
        l.position.set(Math.cos(f) * w, o.groundY + S / 2, Math.sin(f) * w), l.rotation.set(0, 0, 0), l.scale.set(W, S, P), l.updateMatrix(), r.setMatrixAt(c, l.matrix), u[c] = t() * 1e3;
      }
      r.count = i, r.instanceMatrix.needsUpdate = !0, r.geometry.getAttribute("aSeed").needsUpdate = !0;
    };
  return useFrame(o => {
    const t = config.city;
    if (e.current !== config.cityVersion && (e.current = config.cityVersion, n()), a.fog) {
      const f = h(t.fogColor);
      a.fog.color.setRGB(f[0], f[1], f[2]), a.fog.near = t.fogNear, a.fog.far = t.fogFar;
    }
    const l = introScrollDurationMs(),
      s = Math.max(0, Math.min(1, (l - t.genStartMs) / Math.max(1, t.genEndMs - t.genStartMs))),
      i = r.material.userData.uniforms;
    i.uTime.value = o.clock.elapsedTime, i.uGen.value = s, i.uStagger.value = t.genStagger, i.uHeroOff.value = t.heroDelay, i.uGroundY.value = t.groundY, i.uMaxH.value = t.maxH, i.uGlowWidth.value = t.glowWidth, i.uGlowIntensity.value = t.glowIntensity, i.uGlowColor.value.set(...h(t.glowColor)), i.uIrid.value = 1, i.uIridSpeed.value = t.iridSpeed, i.uIridScale.value = t.iridScale, i.uFogColor.value.set(...h(t.baseFogColor)), i.uFogHeight.value = t.baseFogHeight, i.uFogIntensity.value = t.baseFogIntensity, i.uTurnOn.value = s, i.uWindowSize.value = t.windowSize, i.uDensity.value = t.windowDensity, i.uMargin.value = t.windowMargin, i.uFlicker.value = t.flicker, i.uBright.value = t.brightness, i.uDitherPx.value = t.ditherPx, i.uBlend.value = t.blend;
    const c = introExitCamProgress();
    i.uBuilding.value.set(...p(t.buildingColor, t.exitBuildingColor, c)), i.uColorA.value.set(...p(t.colorA, t.exitColorA, c)), i.uColorB.value.set(...p(t.colorB, t.exitColorB, c)), i.uColorC.value.set(...p(t.colorC, t.exitColorC, c));
  }), <primitive object={r} />;
}
const b = 200;
function V(a) {
  const e = a.replace("#", "");
  return [parseInt(e.slice(0, 2), 16) / 255, parseInt(e.slice(2, 4), 16) / 255, parseInt(e.slice(4, 6), 16) / 255];
}
function q(a) {
  return function () {
    a |= 0, a = a + 1831565813 | 0;
    let e = Math.imul(a ^ a >>> 15, 1 | a);
    return e = e + Math.imul(e ^ e >>> 7, 61 | e) ^ e, ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function X() {
  const a = {
      uTime: {
        value: 0
      },
      uGen: {
        value: 0
      },
      uStagger: {
        value: 0.6
      },
      uIntensity: {
        value: 1.4
      },
      uColor: {
        value: new Vector3(1, 0.93, 0.33)
      },
      uIrid: {
        value: 1
      },
      uIridSpeed: {
        value: 0.15
      },
      uIridScale: {
        value: 1.2
      }
    },
    e = new MeshBasicMaterial({
      transparent: !0,
      blending: DoubleSide,
      depthWrite: !1,
      fog: !1
    });
  return e.onBeforeCompile = r => {
    Object.assign(r.uniforms, a), r.vertexShader = `attribute float aSeed;
varying float vY;
varying float vEdge;
varying float vSeed;
varying float vOff;
float beamHash(float n){ return fract(sin(n * 127.1) * 43758.5453); }
` + r.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
        vY = position.y; vEdge = position.x; vSeed = aSeed; vOff = beamHash(aSeed);`).replace("#include <project_vertex>", `
        vec3 bbBase = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        float bbW = length(vec3(instanceMatrix[0]));
        float bbH = length(vec3(instanceMatrix[1]));
        vec3 bbRight = normalize(vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]));
        bbRight.y = 0.0; bbRight = normalize(bbRight);
        vec3 bbWorld = bbBase + bbRight * (position.x * bbW) + vec3(0.0, position.y * bbH, 0.0);
        vec4 mvPosition = viewMatrix * vec4(bbWorld, 1.0);
        gl_Position = projectionMatrix * mvPosition;`), r.fragmentShader = `uniform float uTime, uGen, uStagger, uIntensity, uIrid, uIridSpeed, uIridScale; uniform vec3 uColor;
       varying float vY; varying float vEdge; varying float vSeed; varying float vOff;
       vec3 iridPal(float t){ return 0.6 + 0.4 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67))); }
` + r.fragmentShader.replace("#include <dithering_fragment>", `#include <dithering_fragment>
        {
          float bOff = vOff; // per-instance stagger hash, computed in the vertex stage (see note there)
          float gp = clamp(uGen * (1.0 + uStagger) - bOff * uStagger, 0.0, 1.0);
          float below = step(vY, gp);                                  // 1 below the rising head
          // Squared by hand, NOT pow(x, 2.0): GLSL leaves pow() undefined for a
          // negative base, and (vY - gp) is negative all along the trail below
          // the head. Drivers that don't fold it to x*x emit exp2(2*log2(x))
          // and hand back NaN, which then smears through the bloom's mip chain
          // as horizontal bands (Safari, discrete GPUs).
          float hd = (vY - gp) / 0.05;
          float head = exp(-hd * hd);                                  // bright head at the line
          float trail = below * (0.10 + 0.90 * (1.0 - vY / max(gp, 0.001)));
          float vert = clamp(max(head * 1.6, trail), 0.0, 2.0);
          float horiz = 1.0 - smoothstep(0.14, 0.5, abs(vEdge));       // soft thin line
          float life = smoothstep(0.0, 0.08, gp) * (1.0 - smoothstep(0.7, 1.0, gp)); // fade in / out as tower completes
          float flick = 0.82 + 0.18 * sin(uTime * 22.0 + vSeed * 10.0);
          float a = vert * horiz * life * uIntensity * flick;
          float it = vY * uIridScale + uTime * uIridSpeed + vSeed;
          vec3 bcol = mix(uColor, iridPal(it), uIrid);
          gl_FragColor = vec4(bcol * a, a);
        }`);
  }, e.userData.uniforms = a, e;
}
function Q() {
  const a = React.useRef(-1),
    {
      mesh: e,
      seeds: r
    } = React.useMemo(() => {
      const n = new PlaneGeometry(1, 1);
      n.translate(0, 0.5, 0);
      const o = new Float32Array(b);
      n.setAttribute("aSeed", new InstancedBufferAttribute(o, 1));
      const t = new InstancedMesh(n, X(), b);
      return t.frustumCulled = !1, t.instanceMatrix.setUsage(DynamicDrawUsage), {
        mesh: t,
        seeds: o
      };
    }, []),
    u = () => {
      const n = config.city,
        o = q((n.seed | 0) * 2654435761 + 7 | 0),
        t = Math.min(Math.max(0, n.beamCount | 0), b),
        l = new Object3D();
      for (let s = 0; s < t; s++) {
        const i = o() * Math.PI * 2,
          c = n.clearRadius + Math.pow(o(), 0.7) * (n.areaRadius - n.clearRadius),
          f = n.beamMinH + Math.pow(o(), 1.3) * (n.beamMaxH - n.beamMinH);
        l.position.set(Math.cos(i) * c, n.groundY, Math.sin(i) * c), l.rotation.set(0, 0, 0), l.scale.set(n.beamWidth, f, 1), l.updateMatrix(), e.setMatrixAt(s, l.matrix), r[s] = o() * 1e3;
      }
      e.count = t, e.instanceMatrix.needsUpdate = !0, e.geometry.getAttribute("aSeed").needsUpdate = !0;
    };
  return useFrame(n => {
    const o = config.city;
    a.current !== config.cityVersion && (a.current = config.cityVersion, u());
    const t = introScrollDurationMs(),
      l = Math.max(0, Math.min(1, (t - o.genStartMs) / Math.max(1, o.genEndMs - o.genStartMs))),
      s = e.material.userData.uniforms;
    s.uTime.value = n.clock.elapsedTime, s.uGen.value = l, s.uStagger.value = o.genStagger, s.uIntensity.value = o.beamIntensity, s.uColor.value.set(...V(o.beamColor)), s.uIrid.value = 1, s.uIridSpeed.value = o.iridSpeed, s.uIridScale.value = o.iridScale;
  }), <primitive object={e} />;
}
const M = new Vector3();
function $() {
  const a = React.useRef(!1);
  return useFrame(({
    camera: e
  }) => {
    const r = config.camSync;
    r.on && (e.position.set(r.pos[0], r.pos[1], r.pos[2]), M.set(r.look[0], r.look[1], r.look[2]), e.lookAt(M), (!a.current || Math.abs(e.fov - r.fov) > 0.001) && (e.fov = r.fov, e.updateProjectionMatrix(), a.current = !0));
  }), null;
}
function J() {
  const [, a] = React.useState(0);
  React.useEffect(() => onSceneRefresh(() => a(r => r + 1)), []);
  const e = config.city;
  return <EffectComposer disableNormalPass={!0} multisampling={0}><Bloom intensity={e.bloomIntensity} luminanceThreshold={e.bloomThreshold} luminanceSmoothing={e.bloomSmoothing} radius={e.bloomRadius} mipmapBlur={!0} /></EffectComposer>;
}
function CityCanvas({
  phase: a,
  active: e = !0,
  dpr: r = [1, 1.75]
}) {
  return <div className="intro-city-canvas"><Canvas frameloop={e ? "always" : "never"} gl={{
      alpha: !0,
      antialias: !1,
      powerPreference: "high-performance"
    }} dpr={r} camera={{
      near: 0.1,
      far: 300,
      fov: config.camSync.fov,
      position: config.camSync.pos
    }} onCreated={({
      gl: u,
      scene: n
    }) => {
      u.setClearColor(0, 0), u.toneMapping = ACESFilmicToneMapping, u.toneMappingExposure = 1.05, u.outputColorSpace = SRGBColorSpace, n.background = null;
    }} style={{
      width: "100%",
      height: "100%",
      pointerEvents: "none"
    }}><$ /><fog attach="fog" args={["#080a0a", 16, 96]} /><U phase={a} /><Q /><J /></Canvas></div>;
}
export { CityCanvas as default };
