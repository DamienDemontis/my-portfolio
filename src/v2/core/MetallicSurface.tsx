import { useEffect, useRef, useState, useCallback, type CSSProperties, type ReactNode } from 'react';
import './MetallicSurface.css';
import { getDPRCap, usePageActiveRef } from './perf';
import { compileShader, linkProgramAsync, incContext, decContext } from './glUtils';
import { processImageInWorker } from './imageProcessPool';
import { useGPUTimer } from '../dev/perfRegistry';

// Exported so prewarmShaderCache() in glUtils can compile them on a temporary
// canvas at page load — populating Chromium's GPU shader binary cache before
// any real MetallicSurface instance tries to compile, which eliminates first-
// mount jank on cold visits.
export const vertexShader = `#version 300 es
precision highp float;
in vec2 a_position;
out vec2 vP;
void main(){vP=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;

export const fragmentShader = `#version 300 es
precision highp float;
in vec2 vP;
out vec4 oC;
uniform sampler2D u_tex;
uniform float u_time,u_ratio,u_imgRatio,u_seed,u_scale,u_refract,u_blur,u_liquid;
uniform float u_bright,u_contrast,u_angle,u_fresnel,u_sharp,u_wave,u_noise,u_chroma;
uniform float u_distort,u_contour,u_edgeFade;
uniform vec3 u_lightColor,u_darkColor,u_tint;

vec3 sC,sM;

vec3 pW(vec3 v){
  vec3 i=floor(v),f=fract(v),s=sign(fract(v*.5)-.5),h=fract(sM*i+i.yzx),c=f*(f-1.);
  return s*c*((h*16.-4.)*c-1.);
}

vec3 aF(vec3 b,vec3 c){return pW(b+c.zxy-pW(b.zxy+c.yzx)+pW(b.yzx+c.xyz));}
vec3 lM(vec3 s,vec3 p){return(p+aF(s,p))*.5;}

vec2 fA(){
  vec2 c=vP-.5;
  c.x*=u_ratio>u_imgRatio?u_ratio/u_imgRatio:1.;
  c.y*=u_ratio>u_imgRatio?1.:u_imgRatio/u_ratio;
  return vec2(c.x+.5,.5-c.y);
}

vec2 rot(vec2 p,float r){float c=cos(r),s=sin(r);return vec2(p.x*c+p.y*s,p.y*c-p.x*s);}

float bM(vec2 c,float t){
  vec2 l=smoothstep(vec2(0.),vec2(t),c),u=smoothstep(vec2(0.),vec2(t),1.-c);
  return l.x*l.y*u.x*u.y;
}

float mG(float hi,float lo,float t,float sh,float cv){
  sh*=(2.-u_sharp);
  float ci=smoothstep(.15,.85,cv),r=lo;
  float e1=.08/u_scale;
  r=mix(r,hi,smoothstep(0.,sh*1.5,t));
  r=mix(r,lo,smoothstep(e1-sh,e1+sh,t));
  float e2=e1+.05/u_scale*(1.-ci*.35);
  r=mix(r,hi,smoothstep(e2-sh,e2+sh,t));
  float e3=e2+.025/u_scale*(1.-ci*.45);
  r=mix(r,lo,smoothstep(e3-sh,e3+sh,t));
  float e4=e1+.1/u_scale;
  r=mix(r,hi,smoothstep(e4-sh,e4+sh,t));
  float rm=1.-e4,gT=clamp((t-e4)/rm,0.,1.);
  r=mix(r,mix(hi,lo,smoothstep(0.,1.,gT)),smoothstep(e4-sh*.5,e4+sh*.5,t));
  return r;
}

void main(){
  sC=fract(vec3(.7548,.5698,.4154)*(u_seed+17.31))+.5;
  sM=fract(sC.zxy-sC.yzx*1.618);
  vec2 sc=vec2(vP.x*u_ratio,1.-vP.y);
  float angleRad=u_angle*3.14159/180.;
  sc=rot(sc-.5,angleRad)+.5;
  sc=clamp(sc,0.,1.);
  float sl=sc.x-sc.y,an=u_time*.001;
  vec2 iC=fA();
  vec4 texSample=texture(u_tex,iC);
  float dp=texSample.r;
  float shapeMask=texSample.a;
  vec3 hi=u_lightColor*u_bright;
  vec3 lo=u_darkColor*(2.-u_bright);
  lo.b+=smoothstep(.6,1.4,sc.x+sc.y)*.08;
  vec2 fC=sc-.5;
  float rd=length(fC+vec2(0.,sl*.15));
  vec2 ag=rot(fC,(.22-sl*.18)*3.14159);
  float cv=1.-pow(rd*1.65,1.15);
  cv*=pow(sc.y,.35);
  float vs=shapeMask;
  vs*=mix(1.,bM(iC,.01),u_edgeFade);
  float fr=pow(1.-cv,u_fresnel)*.3;
  vs=min(vs+fr*vs,1.);
  float mT=an*.0625;
  vec3 wO=vec3(-1.05,1.35,1.55);
  vec3 wA=aF(vec3(31.,73.,56.),mT+wO)*.22*u_wave;
  vec3 wB=aF(vec3(24.,64.,42.),mT-wO.yzx)*.22*u_wave;
  vec2 nC=sc*45.*u_noise;
  nC+=aF(sC.zxy,an*.17*sC.yzx-sc.yxy*.35).xy*18.*u_wave;
  vec3 tC=vec3(.00041,.00053,.00076)*mT+wB*nC.x+wA*nC.y;
  tC=lM(sC,tC);
  tC=lM(sC+1.618,tC);
  float tb=sin(tC.x*3.14159)*.5+.5;
  tb=tb*2.-1.;
  float noiseVal=pW(vec3(sc*8.+an,an*.5)).x;
  float edgeFactor=smoothstep(0.,.5,dp)*smoothstep(1.,.5,dp);
  float lD=dp+(1.-dp)*u_liquid*tb;
  lD+=noiseVal*u_distort*.15*edgeFactor;
  float rB=clamp(1.-cv,0.,1.);
  float fl=ag.x+sl;
  fl+=noiseVal*sl*u_distort*edgeFactor;
  fl*=mix(1.,1.-dp*.5,u_contour);
  fl-=dp*u_contour*.8;
  float eI=smoothstep(0.,1.,lD)*smoothstep(1.,0.,lD);
  fl-=tb*sl*1.8*eI;
  float cA=cv*clamp(pow(sc.y,.12),.25,1.);
  fl*=.12+(1.05-lD)*cA;
  fl*=smoothstep(1.,.65,lD);
  float vA1=smoothstep(.08,.18,sc.y)*smoothstep(.38,.18,sc.y);
  float vA2=smoothstep(.08,.18,1.-sc.y)*smoothstep(.38,.18,1.-sc.y);
  fl+=vA1*.16+vA2*.025;
  fl*=.45+pow(sc.y,2.)*.55;
  fl*=u_scale;
  fl-=an;
  float rO=rB+cv*tb*.025;
  float vM1=smoothstep(-.12,.18,sc.y)*smoothstep(.48,.08,sc.y);
  float cM1=smoothstep(.35,.55,cv)*smoothstep(.95,.35,cv);
  rO+=vM1*cM1*4.5;
  rO-=sl;
  float bO=rB*1.25;
  float vM2=smoothstep(-.02,.35,sc.y)*smoothstep(.75,.08,sc.y);
  float cM2=smoothstep(.35,.55,cv)*smoothstep(.75,.35,cv);
  bO+=vM2*cM2*.9;
  bO-=lD*.18;
  rO*=u_refract*u_chroma;
  bO*=u_refract*u_chroma;
  float sf=u_blur;
  float rP=fract(fl+rO);
  float rC=mG(hi.r,lo.r,rP,sf+.018+u_refract*cv*.025,cv);
  float gP=fract(fl);
  float gC=mG(hi.g,lo.g,gP,sf+.008/max(.01,1.-sl),cv);
  float bP=fract(fl-bO);
  float bCC=mG(hi.b,lo.b,bP,sf+.008,cv);
  vec3 col=vec3(rC,gC,bCC);
  col=(col-.5)*u_contrast+.5;
  col=clamp(col,0.,1.);
  col=mix(col,1.-min(vec3(1.),(1.-col)/max(u_tint,vec3(.001))),length(u_tint-1.)*.5);
  col=clamp(col,0.,1.);
  oC=vec4(col*vs,vs);
}`;

type DepthPattern = 'edge' | 'noise' | 'radial' | 'flat' | 'wave' | 'diagonal';

interface MetallicSurfaceProps {
  mode?: 'procedural' | 'image';
  pattern?: DepthPattern;
  imageSrc?: string;
  seed?: number;
  scale?: number;
  refraction?: number;
  blur?: number;
  liquid?: number;
  speed?: number;
  brightness?: number;
  contrast?: number;
  angle?: number;
  fresnel?: number;
  lightColor?: string;
  darkColor?: string;
  patternSharpness?: number;
  waveAmplitude?: number;
  noiseScale?: number;
  chromaticSpread?: number;
  mouseAnimation?: boolean;
  distortion?: number;
  contour?: number;
  tintColor?: string;
  edgeFade?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  interactive?: boolean;
  /**
   * Cap on the effective devicePixelRatio. The fragment shader is expensive,
   * so callers that don't need full retina fidelity (e.g. shader-painted
   * titles, where the shader output is masked through text anyway) can pass
   * a lower cap. Default: getDPRCap() (1.5 on mobile, 2.0 on desktop).
   */
  dprCap?: number;
  /**
   * Frame interval in ms. Default 1000/30 (30fps). Components rendering very
   * slow shimmer (e.g. titles at speed=0.3) can pass 1000/24 with no visible
   * difference.
   */
  frameInterval?: number;
  /**
   * When true, the component keeps its WebGL context and last-drawn frame on
   * screen but stops uploading uniforms and issuing draw calls. Used by the
   * shaderTitleCoordinator to enforce a max number of simultaneously-animating
   * MetalShaderTitles.
   */
  frozen?: boolean;
  /**
   * Optional label for the PerfHUD's per-component GPU timer.
   */
  perfLabel?: string;
  /**
   * When true, do NOT request antialiasing. Default true (AA off) because the
   * shader covers a full quad — MSAA has no triangle edges to smooth.
   */
  disableAntialias?: boolean;
}

function generateProceduralTexture(width: number, height: number, pattern: DepthPattern, seed: number): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const seededRandom = (x: number, y: number) => {
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
    return n - Math.floor(n);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let depth = 0;
      const nx = x / width;
      const ny = y / height;

      switch (pattern) {
        case 'edge': {
          const dx = Math.min(nx, 1 - nx) * 2;
          const dy = Math.min(ny, 1 - ny) * 2;
          depth = Math.min(dx, dy);
          depth = Math.pow(depth, 0.7);
          break;
        }
        case 'radial': {
          const cx = (nx - 0.5) * 2;
          const cy = (ny - 0.5) * 2;
          depth = 1 - Math.min(1, Math.sqrt(cx * cx + cy * cy));
          depth = Math.pow(depth, 0.8);
          break;
        }
        case 'noise': {
          depth = seededRandom(x * 0.02, y * 0.02) * 0.4 + 0.3;
          const coarse = seededRandom(Math.floor(x * 0.005), Math.floor(y * 0.005));
          depth = depth * 0.6 + coarse * 0.4;
          break;
        }
        case 'wave': {
          depth = (Math.sin(nx * Math.PI * 6 + seed) * 0.3 + 0.5) *
                  (Math.cos(ny * Math.PI * 4 + seed * 0.7) * 0.3 + 0.5);
          break;
        }
        case 'diagonal': {
          depth = (nx + ny) * 0.5;
          depth = depth * 0.6 + 0.2;
          break;
        }
        case 'flat':
        default:
          depth = 0.5;
          break;
      }

      const gray = Math.round(255 * (1 - depth * depth));
      data[idx] = gray;
      data[idx + 1] = gray;
      data[idx + 2] = gray;
      data[idx + 3] = 255;
    }
  }

  return imageData;
}

// Cheap first pass on main thread: scale + sample the image into alpha/shape
// arrays. This is one O(N) loop over the pixels and is fast (~5ms typical).
// Returns the arrays + dimensions; SOR diffusion happens off-thread.
function extractAlphaShape(img: HTMLImageElement): {
  width: number; height: number;
  alpha: Float32Array; shape: Uint8Array;
} {
  const MAX_SIZE = 1000;
  const MIN_SIZE = 500;
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > MAX_SIZE || height > MAX_SIZE || width < MIN_SIZE || height < MIN_SIZE) {
    const scale =
      width > height
        ? width > MAX_SIZE ? MAX_SIZE / width : width < MIN_SIZE ? MIN_SIZE / width : 1
        : height > MAX_SIZE ? MAX_SIZE / height : height < MIN_SIZE ? MIN_SIZE / height : 1;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const d = imageData.data;
  const size = width * height;
  const alpha = new Float32Array(size);
  const shape = new Uint8Array(size);

  for (let i = 0; i < size; i++) {
    const px = i * 4;
    const r = d[px], g = d[px + 1], b = d[px + 2], a = d[px + 3];
    const isBackground = (r > 250 && g > 250 && b > 250 && a === 255) || a < 5;
    alpha[i] = isBackground ? 0 : a / 255;
    shape[i] = alpha[i] > 0.1 ? 1 : 0;
  }

  return { width, height, alpha, shape };
}

/**
 * Synchronous SOR fallback. Only used when the worker is unavailable
 * (e.g. very old browser or worker construction failed). Identical math to
 * imageProcess.worker.ts — keep them in sync.
 */
function processImageSync(
  width: number, height: number,
  alpha: Float32Array, shape: Uint8Array,
  iterations: number, c: number, omega: number,
): ImageData {
  const size = width * height;
  const boundary = new Uint8Array(size);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!shape[idx]) continue;
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1 ||
          !shape[idx - 1] || !shape[idx + 1] ||
          !shape[idx - width] || !shape[idx + width]) {
        boundary[idx] = 1;
      }
    }
  }

  const u = new Float32Array(size);
  for (let iter = 0; iter < iterations; iter++) {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (!shape[idx] || boundary[idx]) continue;
        const sum =
          (shape[idx + 1] ? u[idx + 1] : 0) +
          (shape[idx - 1] ? u[idx - 1] : 0) +
          (shape[idx + width] ? u[idx + width] : 0) +
          (shape[idx - width] ? u[idx - width] : 0);
        const newVal = (c + sum) / 4;
        u[idx] = omega * newVal + (1 - omega) * u[idx];
      }
    }
  }

  let maxVal = 0;
  for (let i = 0; i < size; i++) if (u[i] > maxVal) maxVal = u[i];
  if (maxVal === 0) maxVal = 1;

  const out = new Uint8ClampedArray(size * 4);
  for (let i = 0; i < size; i++) {
    const px = i * 4;
    const depth = u[i] / maxVal;
    const gray = Math.round(255 * (1 - depth * depth));
    out[px] = out[px + 1] = out[px + 2] = gray;
    out[px + 3] = Math.round(alpha[i] * 255);
  }
  return new ImageData(out, width, height);
}

const SOR_ITERATIONS = 40;
const SOR_C = 0.01;
const SOR_OMEGA = 1.85;

/**
 * Async processImage. Off-thread when possible (Worker), falls back to
 * synchronous main-thread compute if the worker is unavailable.
 *
 * Output is mathematically identical between paths — no visual difference.
 */
async function processImageAsync(img: HTMLImageElement): Promise<ImageData> {
  const { width, height, alpha, shape } = extractAlphaShape(img);
  try {
    // Note: this transfers alpha.buffer + shape.buffer to the worker, so the
    // arrays become unusable on this side. We don't reuse them.
    return await processImageInWorker(width, height, alpha, shape, SOR_ITERATIONS, SOR_C, SOR_OMEGA);
  } catch {
    // Worker failed. Fall back to in-thread compute. We need fresh copies of
    // alpha/shape because the buffers were transferred away — but only if
    // they ARE transferred. To be safe re-extract from the source image.
    const re = extractAlphaShape(img);
    return processImageSync(re.width, re.height, re.alpha, re.shape, SOR_ITERATIONS, SOR_C, SOR_OMEGA);
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
    : [1, 1, 1];
}

export default function MetallicSurface({
  mode = 'procedural',
  pattern = 'flat',
  imageSrc,
  seed = 42,
  scale = 4,
  refraction = 0.015,
  blur = 0.012,
  liquid = 0.07,
  speed = 0.2,
  brightness = 1.8,
  contrast = 0.6,
  angle = 0,
  fresnel = 0.8,
  lightColor = '#ffffff',
  darkColor = '#000000',
  patternSharpness = 1.2,
  waveAmplitude = 0.8,
  noiseScale = 0.4,
  chromaticSpread = 1.5,
  mouseAnimation = false,
  distortion = 0.8,
  contour = 0.15,
  tintColor = '#ffffff',
  edgeFade = 0,
  children,
  className = '',
  style,
  interactive = false,
  dprCap,
  frameInterval = 1000 / 30,
  frozen = false,
  perfLabel = 'MetalSurf',
  disableAntialias = true,
}: MetallicSurfaceProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const textureRef = useRef<WebGLTexture | null>(null);
  const animTimeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const mouseAnimRef = useRef(mouseAnimation);
  const sizeRef = useRef({ width: 0, height: 0 });
  const visibleRef = useRef(true);
  // Imperative tab-visibility ref — rAF loop reads this to skip GPU work
  // while the tab is hidden without triggering React re-renders.
  const pageActiveRef = usePageActiveRef();
  // Imperative freeze ref — rAF reads this to skip uniform upload + draw
  // calls without triggering re-renders.
  const frozenRef = useRef(frozen);

  // Dev-only GPU timing instrumentation. The hook is a no-op when the
  // PerfHUD is disabled (no ?perf=1 in the URL).
  const gpuTimer = useGPUTimer(perfLabel);
  const timerRef = useRef<ReturnType<typeof gpuTimer.makeTimer> | null>(null);

  const [ready, setReady] = useState(false);
  const [textureReady, setTextureReady] = useState(false);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { mouseAnimRef.current = mouseAnimation; }, [mouseAnimation]);
  useEffect(() => { frozenRef.current = frozen; }, [frozen]);

  const initGL = useCallback(async (): Promise<boolean> => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl2', {
      // MSAA is wasted on a full-quad procedural fragment shader — no
      // triangle edges to anti-alias. Saves a multisample backing store.
      antialias: !disableAntialias,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });
    if (!gl) return false;

    // Defensive WebGL context-loss handling. preventDefault() on `webglcontextlost`
    // tells the browser we want the context restored when possible (e.g. after the
    // GPU is reclaimed from a background tab). Full state re-initialization on
    // `webglcontextrestored` would require a larger refactor (re-run initGL,
    // re-upload texture, re-apply all uniforms); for now we only enable recovery
    // and log the restore event. The component will appear blank until remount
    // if the context is permanently lost.
    canvas.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
    canvas.addEventListener('webglcontextrestored', () => {
      // TODO: full re-init — currently a no-op. See comment above.
    }, false);

    const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return false;

    // Non-blocking link via KHR_parallel_shader_compile when available.
    // Without this extension, linkProgram stalls the main thread for the full
    // link duration — which on this shader can be 30–80ms on cold load.
    const prog = await linkProgramAsync(gl, vs, fs);
    if (!prog) return false;

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(prog, i);
      if (info) uniforms[info.name] = gl.getUniformLocation(prog, info.name);
    }

    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    gl.useProgram(prog);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    glRef.current = gl;
    programRef.current = prog;
    uniformsRef.current = uniforms;
    timerRef.current = gpuTimer.makeTimer(gl);
    incContext();

    return true;
    // gpuTimer.makeTimer is stable (the underlying id is captured in a ref);
    // the lint exhaustive-deps rule trips here but adding it would re-run
    // initGL on every render, which would re-create the context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableAntialias]);

  const uploadTexture = useCallback((imgData: ImageData) => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl || !imgData) return;

    if (textureRef.current) gl.deleteTexture(textureRef.current);

    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, imgData.width, imgData.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imgData.data);
    gl.uniform1i(uniforms.u_tex, 0);

    const ratio = imgData.width / imgData.height;
    gl.uniform1f(uniforms.u_imgRatio, ratio);

    textureRef.current = tex;
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const gl = glRef.current;
    if (!canvas || !wrapper || !gl) return;

    const rect = wrapper.getBoundingClientRect();
    // Caller can override the DPR cap (e.g. MetalShaderTitle uses 1.25 because
    // the shader output is masked through text and high-DPR isn't visible).
    const effectiveCap = typeof dprCap === 'number' ? dprCap : getDPRCap();
    const dpr = Math.min(window.devicePixelRatio, effectiveCap);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (w === sizeRef.current.width && h === sizeRef.current.height) return;

    sizeRef.current = { width: w, height: h };
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform1f(uniformsRef.current.u_ratio, w / h);
  }, [dprCap]);

  useEffect(() => {
    let cancelled = false;
    let contextWasInc = false;
    initGL().then((ok) => {
      if (cancelled) {
        // Component unmounted while we were waiting on the async link.
        // initGL ran incContext on success — undo that, but do NOT call
        // loseContext: WebGL's contract is that once a canvas has been given
        // a context, getContext() always returns that same context. Forcing
        // it lost permanently bricks the canvas — and React StrictMode's
        // setup/cleanup/setup cycle means we'd brick our own canvas before
        // the real GL effect even gets to use it. Just delete the program
        // and shaders; the browser will reclaim the context on unmount.
        if (ok) {
          decContext();
          if (timerRef.current) {
            timerRef.current.dispose();
            timerRef.current = null;
          }
          glRef.current = null;
        }
        return;
      }
      if (ok) {
        contextWasInc = true;
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) {
        timerRef.current.dispose();
        timerRef.current = null;
      }
      if (textureRef.current && glRef.current) {
        glRef.current.deleteTexture(textureRef.current);
        textureRef.current = null;
      }
      // IMPORTANT: do not call WEBGL_lose_context here. See note above —
      // StrictMode dev double-mount would brick the canvas before the real
      // mount even starts. The GPU resources are released when the canvas
      // is removed from the DOM.
      glRef.current = null;
      if (contextWasInc) decContext();
    };
  }, [initGL]);

  useEffect(() => {
    if (!ready) return;
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [ready, resizeCanvas]);

  useEffect(() => {
    if (!ready) return;

    if (mode === 'image' && imageSrc) {
      setTextureReady(false);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      let onloadCancelled = false;
      img.onload = () => {
        // processImageAsync moves the heavy SOR diffusion to a worker —
        // each title used to pay ~190ms on the main thread; now ~0ms.
        // Falls back to sync if the worker fails. Math is identical so
        // there is no visible difference in the output texture.
        processImageAsync(img).then((imgData) => {
          if (onloadCancelled) return;
          uploadTexture(imgData);
          setTextureReady(true);
        }).catch((err) => {
          // eslint-disable-next-line no-console
          console.warn('[MetallicSurface] processImage failed', err);
        });
      };
      img.src = imageSrc;
      // Hook into the outer effect cleanup so an unmount mid-flight doesn't
      // upload to a dead context.
      return () => { onloadCancelled = true; };
    } else {
      const size = 512;
      const imgData = generateProceduralTexture(size, size, pattern, seed);
      uploadTexture(imgData);
      const gl = glRef.current;
      if (gl) gl.uniform1f(uniformsRef.current.u_imgRatio, sizeRef.current.width / Math.max(1, sizeRef.current.height));
      setTextureReady(true);
    }
  }, [ready, mode, imageSrc, pattern, seed, uploadTexture]);

  useEffect(() => {
    const gl = glRef.current;
    const u = uniformsRef.current;
    if (!gl || !ready) return;

    gl.uniform1f(u.u_seed, seed);
    gl.uniform1f(u.u_scale, scale);
    gl.uniform1f(u.u_refract, refraction);
    gl.uniform1f(u.u_blur, blur);
    gl.uniform1f(u.u_liquid, liquid);
    gl.uniform1f(u.u_bright, brightness);
    gl.uniform1f(u.u_contrast, contrast);
    gl.uniform1f(u.u_angle, angle);
    gl.uniform1f(u.u_fresnel, fresnel);
    gl.uniform1f(u.u_edgeFade, edgeFade);

    const light = hexToRgb(lightColor);
    const dark = hexToRgb(darkColor);
    const tint = hexToRgb(tintColor);
    gl.uniform3f(u.u_lightColor, light[0], light[1], light[2]);
    gl.uniform3f(u.u_darkColor, dark[0], dark[1], dark[2]);
    gl.uniform1f(u.u_sharp, patternSharpness);
    gl.uniform1f(u.u_wave, waveAmplitude);
    gl.uniform1f(u.u_noise, noiseScale);
    gl.uniform1f(u.u_chroma, chromaticSpread);
    gl.uniform1f(u.u_distort, distortion);
    gl.uniform1f(u.u_contour, contour);
    gl.uniform3f(u.u_tint, tint[0], tint[1], tint[2]);
  }, [
    ready, seed, scale, refraction, blur, liquid, brightness, contrast, angle,
    fresnel, lightColor, darkColor, patternSharpness, waveAmplitude, noiseScale,
    chromaticSpread, distortion, contour, tintColor, edgeFade,
  ]);

  useEffect(() => {
    if (!ready || !textureReady) return;

    const gl = glRef.current;
    const u = uniformsRef.current;
    const canvas = canvasRef.current;
    const mouse = mouseRef.current;
    if (!gl || !canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) / rect.width;
      mouse.targetY = (e.clientY - rect.top) / rect.height;
    };

    if (interactive || mouseAnimation) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    const render = (time: number) => {
      if (!visibleRef.current) {
        rafRef.current = null;
        return;
      }

      const delta = time - lastTimeRef.current;

      // Throttle to the configured frame interval (default 30fps; titles
      // typically pass 24fps because their shimmer is too slow to perceive
      // any difference at lower rates).
      if (delta < frameInterval) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }
      lastTimeRef.current = time;

      if (mouseAnimRef.current) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
        animTimeRef.current = mouse.x * 3000 + mouse.y * 1500;
      } else {
        const t = animTimeRef.current * 0.0003;
        const wobble = 1 + 0.4 * Math.sin(t * 1.3) + 0.25 * Math.sin(t * 3.7) + 0.15 * Math.sin(t * 7.1);
        animTimeRef.current += delta * speedRef.current * wobble;
      }

      // Skip GPU work (uniform upload + draw) while the tab is hidden OR
      // the coordinator has frozen this component (out of the active title
      // slot quota). rAF keeps running so animTimeRef advances and we resume
      // without a visible jump when the gate flips back open.
      const shouldDraw = pageActiveRef.current && !frozenRef.current;
      if (shouldDraw) {
        const timer = timerRef.current;
        timer?.begin();
        gl.uniform1f(u.u_time, animTimeRef.current);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        timer?.end();
        timer?.poll();
        gpuTimer.markDraw();
      }
      rafRef.current = requestAnimationFrame(render);
    };

    const ioObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        // setVisible dedupes internally, so we can call it unconditionally
        // even when state didn't change. Keeping this unconditional fixes
        // the initial-mount case where visibleRef defaults to true but the
        // HUD record starts at visible=false.
        gpuTimer.setVisible(entry.isIntersecting);
        if (entry.isIntersecting && !rafRef.current) {
          lastTimeRef.current = performance.now();
          rafRef.current = requestAnimationFrame(render);
        }
      },
      { threshold: 0 },
    );
    if (wrapperRef.current) {
      ioObserver.observe(wrapperRef.current);
      // Seed the visible flag based on the current geometry, so the HUD
      // reflects reality immediately without waiting for IO to fire its
      // initial async callback (which can lag a frame or two and confuses
      // the live-context count).
      const rect = wrapperRef.current.getBoundingClientRect();
      const inViewport =
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < (window.innerHeight || 0) &&
        rect.left < (window.innerWidth || 0);
      if (inViewport) {
        visibleRef.current = true;
        gpuTimer.setVisible(true);
      }
    }

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      ioObserver.disconnect();
    };
    // gpuTimer.setVisible / .markDraw are stable wrappers around stable refs;
    // including them re-runs this effect needlessly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, textureReady, interactive, mouseAnimation, frameInterval]);

  return (
    <div ref={wrapperRef} className={`metallic-surface-wrapper ${className}`} style={style}>
      <canvas ref={canvasRef} className="metallic-surface-canvas" />
      {children && <div className="metallic-surface-content">{children}</div>}
    </div>
  );
}
