import { useEffect, useRef, useMemo } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import './SoftAurora.css';

/* ── Shaders ── */

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec3  uColorStops[3];
uniform vec2  uResolution;
uniform float uSpeed;
uniform float uScale;
uniform float uBrightness;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uBandHeight;
uniform float uBandSpread;
uniform float uOctaveDecay;
uniform float uLayerOffset;
uniform float uColorSpeed;
uniform vec2  uMouse;
uniform float uMouseInfluence;

out vec4 fragColor;

/* ── Simplex noise ── */
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x_) - 0.5;
  vec3 ox = floor(x_ + 0.5);
  vec3 a0 = x_ - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/* ── Fractional Brownian Motion ── */
float fbm(vec2 p, float freq, float amp, float decay, float offset) {
  float value = 0.0;
  float f = freq;
  float a = amp;
  for (int i = 0; i < 4; i++) {
    value += a * snoise(p * f + float(i) * offset);
    f *= 2.0;
    a *= decay;
  }
  return value;
}

/* ── Color ramp ── */
vec3 colorRamp(vec3 c0, vec3 c1, vec3 c2, float t) {
  t = clamp(t, 0.0, 1.0);
  if (t < 0.5) return mix(c0, c1, t * 2.0);
  return mix(c1, c2, (t - 0.5) * 2.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float t = uTime * uSpeed;

  // Mouse displacement
  vec2 mouseOffset = (uMouse - 0.5) * uMouseInfluence;
  vec2 p = uv * uScale + mouseOffset;

  // Color ramp with time shift
  float colorShift = uv.x + sin(t * uColorSpeed * 0.3) * 0.15;
  vec3 rampColor = colorRamp(uColorStops[0], uColorStops[1], uColorStops[2], colorShift);

  // Aurora band via fbm noise
  float noise = fbm(
    vec2(p.x + t * 0.08, t * 0.12 + uLayerOffset),
    uNoiseFreq, uNoiseAmp, uOctaveDecay, uLayerOffset + 3.7
  );

  // Band shape: gaussian-like around a moving center
  float bandCenter = uBandHeight + noise * 0.06;
  float dist = abs(uv.y - bandCenter);
  float band = exp(-dist * dist / (uBandSpread * uBandSpread * 0.02));

  // Add secondary layer for depth
  float noise2 = fbm(
    vec2(p.x * 1.3 + t * 0.05, t * 0.09 + uLayerOffset + 5.0),
    uNoiseFreq * 0.7, uNoiseAmp * 0.6, uOctaveDecay, uLayerOffset + 7.3
  );
  float band2Center = uBandHeight + 0.15 + noise2 * 0.04;
  float dist2 = abs(uv.y - band2Center);
  float band2 = exp(-dist2 * dist2 / (uBandSpread * uBandSpread * 0.03)) * 0.5;

  float combined = clamp((band + band2) * uBrightness, 0.0, 1.0);
  // Use combined as opacity, not as a color multiplier — keeps colors saturated without washing to white
  vec3 color = rampColor;

  fragColor = vec4(color * combined, combined);
}
`;

/* ── Flag color palettes ── */
const FLAG_COLORS: Record<string, [string, string, string]> = {
  FR: ['#002395', '#ffffff', '#ED2939'],
  GB: ['#3C3B6E', '#B22234', '#ffffff'],
  IT: ['#009246', '#ffffff', '#CE2B37'],
  KR: ['#003478', '#CD2E3A', '#ffffff'],
};

const DEFAULT_COLORS: [string, string, string] = ['#444455', '#666677', '#444455'];

/* ── Component ── */
interface SoftAuroraProps {
  activeFlag?: string | null;
  colorStops?: [string, string, string];
  speed?: number;
  scale?: number;
  brightness?: number;
  noiseFrequency?: number;
  noiseAmplitude?: number;
  bandHeight?: number;
  bandSpread?: number;
  octaveDecay?: number;
  layerOffset?: number;
  colorSpeed?: number;
  mouseInteraction?: boolean;
  mouseInfluence?: number;
  className?: string;
}

export default function SoftAurora({
  activeFlag,
  colorStops,
  speed = 0.6,
  scale = 1.1,
  brightness = 1.3,
  noiseFrequency = 2.5,
  noiseAmplitude = 3,
  bandHeight = 0.5,
  bandSpread = 1,
  octaveDecay = 0.1,
  layerOffset = 0,
  colorSpeed = 1,
  mouseInteraction = true,
  mouseInfluence = 0.25,
  className = '',
}: SoftAuroraProps) {
  const ctnRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);
  const smoothMouseRef = useRef<[number, number]>([0.5, 0.5]);

  // Current colors lerp toward target each frame
  const currentColorsRef = useRef<[number[], number[], number[]]>([
    [...new Color(DEFAULT_COLORS[0])],
    [...new Color(DEFAULT_COLORS[1])],
    [...new Color(DEFAULT_COLORS[2])],
  ]);

  const targetColors = useMemo(() => {
    const stops = colorStops || (activeFlag && FLAG_COLORS[activeFlag]) || DEFAULT_COLORS;
    return stops.map(hex => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    }) as [number[], number[], number[]];
  }, [activeFlag, colorStops]);

  const targetRef = useRef(targetColors);
  targetRef.current = targetColors;

  // Store latest props for the rAF loop
  const propsRef = useRef({
    speed, scale, brightness, noiseFrequency, noiseAmplitude,
    bandHeight, bandSpread, octaveDecay, layerOffset, colorSpeed,
    mouseInteraction, mouseInfluence,
  });
  propsRef.current = {
    speed, scale, brightness, noiseFrequency, noiseAmplitude,
    bandHeight, bandSpread, octaveDecay, layerOffset, colorSpeed,
    mouseInteraction, mouseInfluence,
  };

  useEffect(() => {
    const ctn = ctnRef.current;
    if (!ctn) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    const geometry = new Triangle(gl);
    if ((geometry as any).attributes.uv) delete (geometry as any).attributes.uv;

    const initColors = DEFAULT_COLORS.map(hex => { const c = new Color(hex); return [c.r, c.g, c.b]; });

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime:          { value: 0 },
        uColorStops:    { value: initColors },
        uResolution:    { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uSpeed:         { value: speed },
        uScale:         { value: scale },
        uBrightness:    { value: brightness },
        uNoiseFreq:     { value: noiseFrequency },
        uNoiseAmp:      { value: noiseAmplitude },
        uBandHeight:    { value: bandHeight },
        uBandSpread:    { value: bandSpread },
        uOctaveDecay:   { value: octaveDecay },
        uLayerOffset:   { value: layerOffset },
        uColorSpeed:    { value: colorSpeed },
        uMouse:         { value: [0.5, 0.5] },
        uMouseInfluence:{ value: mouseInfluence },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    function resize() {
      if (!ctn) return;
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.uResolution.value = [ctn.offsetWidth, ctn.offsetHeight];
    }
    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = ctn.getBoundingClientRect();
      mouseRef.current = [
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height,
      ];
    };
    if (mouseInteraction) {
      ctn.style.pointerEvents = 'auto';
      ctn.addEventListener('mousemove', onMouseMove);
    }

    const COLOR_LERP = 0.025;
    const MOUSE_LERP = 0.05;

    let raf = 0;
    const update = (t: number) => {
      raf = requestAnimationFrame(update);
      const p = propsRef.current;

      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uSpeed.value = p.speed;
      program.uniforms.uScale.value = p.scale;
      program.uniforms.uBrightness.value = p.brightness;
      program.uniforms.uNoiseFreq.value = p.noiseFrequency;
      program.uniforms.uNoiseAmp.value = p.noiseAmplitude;
      program.uniforms.uBandHeight.value = p.bandHeight;
      program.uniforms.uBandSpread.value = p.bandSpread;
      program.uniforms.uOctaveDecay.value = p.octaveDecay;
      program.uniforms.uLayerOffset.value = p.layerOffset;
      program.uniforms.uColorSpeed.value = p.colorSpeed;
      program.uniforms.uMouseInfluence.value = p.mouseInteraction ? p.mouseInfluence : 0;

      // Smooth mouse
      const sm = smoothMouseRef.current;
      const rm = mouseRef.current;
      sm[0] += (rm[0] - sm[0]) * MOUSE_LERP;
      sm[1] += (rm[1] - sm[1]) * MOUSE_LERP;
      program.uniforms.uMouse.value = sm;

      // Smooth color transition
      const cur = currentColorsRef.current;
      const tgt = targetRef.current;
      for (let i = 0; i < 3; i++) {
        for (let c = 0; c < 3; c++) {
          cur[i][c] += (tgt[i][c] - cur[i][c]) * COLOR_LERP;
        }
      }
      program.uniforms.uColorStops.value = cur;

      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ctn.removeEventListener('mousemove', onMouseMove);
      if (ctn && gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`soft-aurora-wrap ${className}`}>
      <div ref={ctnRef} className="aurora-container" />
    </div>
  );
}
