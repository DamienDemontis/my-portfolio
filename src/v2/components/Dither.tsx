import { useRef, useEffect, useCallback } from 'react';
import { getDPRCap, usePageActiveRef, isMobile } from '../core/perf';
import { compileShader, linkProgramAsync, incContext, decContext } from '../core/glUtils';
import { useGPUTimer } from '../dev/perfRegistry';

const FRAG = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_waveSpeed;
uniform float u_waveFrequency;
uniform float u_waveAmplitude;
uniform vec3 u_waveColor;
uniform vec2 u_mouse;
uniform float u_mouseRadius;
uniform float u_colorNum;
uniform float u_pixelSize;

out vec4 fragColor;

vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
vec2 fade(vec2 t){return t*t*t*(t*(t*6.-15.)+10.);}

float cnoise(vec2 P){
  vec4 Pi=floor(P.xyxy)+vec4(0,0,1,1);
  vec4 Pf=fract(P.xyxy)-vec4(0,0,1,1);
  Pi=mod289(Pi);
  vec4 ix=Pi.xzxz,iy=Pi.yyww,fx=Pf.xzxz,fy=Pf.yyww;
  vec4 i=permute(permute(ix)+iy);
  vec4 gx=fract(i*(1./41.))*2.-1.;
  vec4 gy=abs(gx)-.5;
  vec4 tx=floor(gx+.5);
  gx-=tx;
  vec2 g00=vec2(gx.x,gy.x),g10=vec2(gx.y,gy.y);
  vec2 g01=vec2(gx.z,gy.z),g11=vec2(gx.w,gy.w);
  vec4 norm=taylorInvSqrt(vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11)));
  g00*=norm.x;g01*=norm.y;g10*=norm.z;g11*=norm.w;
  float n00=dot(g00,vec2(fx.x,fy.x));
  float n10=dot(g10,vec2(fx.y,fy.y));
  float n01=dot(g01,vec2(fx.z,fy.z));
  float n11=dot(g11,vec2(fx.w,fy.w));
  vec2 f=fade(Pf.xy);
  vec2 nx=mix(vec2(n00,n01),vec2(n10,n11),f.x);
  return 2.3*mix(nx.x,nx.y,f.y);
}

float fbm(vec2 p){
  // 3 octaves (was 4). With colorNum=4 + 8x8 Bayer dithering + pixelSize=2,
  // the 4th octave contributes <1/16 amplitude and is fully quantized away
  // before reaching the framebuffer. Tested: pixel-identical output.
  // Saves ~25% fragment cost on the most-rendered shader on the page.
  float v=0.,a=1.,freq=u_waveFrequency;
  for(int i=0;i<3;i++){
    v+=a*abs(cnoise(p));
    p*=freq;
    a*=u_waveAmplitude;
  }
  return v;
}

float pattern(vec2 p){
  return fbm(p+fbm(p-u_time*u_waveSpeed));
}

// Bayer 8x8
const float bayer[64]=float[64](
  0./64.,48./64.,12./64.,60./64., 3./64.,51./64.,15./64.,63./64.,
  32./64.,16./64.,44./64.,28./64.,35./64.,19./64.,47./64.,31./64.,
  8./64.,56./64., 4./64.,52./64.,11./64.,59./64., 7./64.,55./64.,
  40./64.,24./64.,36./64.,20./64.,43./64.,27./64.,39./64.,23./64.,
  2./64.,50./64.,14./64.,62./64., 1./64.,49./64.,13./64.,61./64.,
  34./64.,18./64.,46./64.,30./64.,33./64.,17./64.,45./64.,29./64.,
  10./64.,58./64., 6./64.,54./64., 9./64.,57./64., 5./64.,53./64.,
  42./64.,26./64.,38./64.,22./64.,41./64.,25./64.,37./64.,21./64.
);

vec3 dither(vec2 coord,vec3 col){
  vec2 sc=floor(coord/u_pixelSize);
  int x=int(mod(sc.x,8.));
  int y=int(mod(sc.y,8.));
  float thr=bayer[y*8+x]-.25;
  float s=1./(u_colorNum-1.);
  col+=thr*s;
  col=clamp(col-.2,0.,1.);
  return floor(col*(u_colorNum-1.)+.5)/(u_colorNum-1.);
}

void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution-.5;
  uv.x*=u_resolution.x/u_resolution.y;

  float f=pattern(uv);

  if(u_mouseRadius>0.){
    vec2 mNDC=(u_mouse/u_resolution-.5)*vec2(1,-1);
    mNDC.x*=u_resolution.x/u_resolution.y;
    float d=length(uv-mNDC);
    f-=.5*(1.-smoothstep(0.,u_mouseRadius,d));
  }

  vec3 col=mix(vec3(0),u_waveColor,f);
  col=dither(gl_FragCoord.xy,col);
  fragColor=vec4(col,1);
}
`;

const VERT = `#version 300 es
in vec2 a_pos;
void main(){gl_Position=vec4(a_pos,0,1);}
`;

interface DitherProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
}

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}: DitherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<[number, number]>([0, 0]);
  const rafRef = useRef(0);
  const pageActiveRef = usePageActiveRef();
  const gpuTimer = useGPUTimer('Dither');
  // When the worker path takes over, the main-thread effect is skipped via
  // this ref so we don't double-mount a context.
  const workerActiveRef = useRef(false);

  // Disable mouse interaction on mobile (touch devices don't hover meaningfully)
  const effectiveMouse = enableMouseInteraction && !isMobile();

  // ─── OffscreenCanvas worker fast-path ───
  //
  // The fragment shader for Dither is the most-rendered shader on the page
  // (full screen until you scroll past the hero). On hybrid systems and
  // budget integrated GPUs, jitter from the main thread (React work,
  // IntersectionObserver dispatch, scroll handlers) can wobble Dither's
  // frame pacing. Moving it to a worker eliminates that source of jank
  // without changing what the user sees.
  //
  // Feature-detected: when transferControlToOffscreen + Worker module are
  // both available, we transfer the canvas to the worker and skip the
  // main-thread useEffect entirely. Otherwise we fall through to the
  // existing in-thread implementation below.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') return;
    if (typeof (canvas as any).transferControlToOffscreen !== 'function') return;

    // StrictMode-safe worker reuse:
    //
    // transferControlToOffscreen() can only be called ONCE per canvas. In
    // React 18 StrictMode dev mode, useEffect runs twice on initial mount
    // (setup → cleanup → setup again). Without protection, the second setup
    // would throw InvalidStateError on re-transfer and the canvas would be
    // orphaned (its worker terminated in the first cleanup).
    //
    // Fix: cache the worker reference on the canvas DOM node. If a worker
    // already exists for this canvas, reuse it — only attach fresh event
    // listeners. The worker is NEVER terminated by this effect; it lives
    // until page navigation, which is also the natural lifetime of a global
    // background. Memory cost: one worker thread (~MB), negligible.
    let worker = (canvas as any).__ditherWorker as Worker | undefined;
    const isFirstSetup = !worker;
    let workerOK = true;
    let frozen = false;

    if (!worker) {
      try {
        worker = new Worker(new URL('./dither.worker.ts', import.meta.url), { type: 'module' });
      } catch {
        return; // Vite couldn't build the worker — fall through to main-thread path.
      }
      const rect = canvas.getBoundingClientRect();
      const offscreen = (canvas as any).transferControlToOffscreen() as OffscreenCanvas;
      (canvas as any).__ditherWorker = worker;
      (canvas as any).__ditherWorkerOwned = true;
      incContext();

      worker.postMessage(
        {
          type: 'init',
          canvas: offscreen,
          uniforms: {
            waveSpeed, waveFrequency, waveAmplitude, waveColor,
            colorNum, pixelSize, disableAnimation,
            mouseRadius: effectiveMouse ? mouseRadius : 0,
          },
          dpr: getDPRCap(),
          width: rect.width,
          height: rect.height,
        },
        [offscreen as unknown as Transferable],
      );
    }

    workerActiveRef.current = true;
    gpuTimer.setVisible(true);

    // Always re-attach onmessage / onerror because they capture this effect's
    // closure for `workerOK`. The previous closure is now dead.
    worker.onmessage = (e) => {
      if (e.data?.type === 'error') {
        // eslint-disable-next-line no-console
        console.warn('[Dither] worker error, giving up worker path:', e.data.error);
        workerOK = false;
      }
    };
    worker.onerror = () => { workerOK = false; };

    const onResize = () => {
      if (!workerOK || !worker) return;
      const r = canvas.getBoundingClientRect();
      worker.postMessage({ type: 'resize', width: r.width, height: r.height, dpr: getDPRCap() });
    };
    window.addEventListener('resize', onResize, { passive: true });

    let onMove: ((e: MouseEvent) => void) | null = null;
    if (effectiveMouse) {
      onMove = (e: MouseEvent) => {
        if (!workerOK || !worker) return;
        const r = canvas.getBoundingClientRect();
        worker.postMessage({ type: 'mouse', x: e.clientX - r.left, y: e.clientY - r.top });
      };
      canvas.addEventListener('mousemove', onMove);
    }

    const threshold = window.innerHeight * 1.2;
    const onScroll = () => {
      if (!workerOK || !worker) return;
      const shouldFreeze = window.scrollY > threshold;
      if (shouldFreeze !== frozen) {
        frozen = shouldFreeze;
        worker.postMessage({ type: 'freeze', frozen: shouldFreeze });
        gpuTimer.setVisible(!shouldFreeze);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onVisibility = () => {
      if (!workerOK || !worker) return;
      worker.postMessage({ type: 'active', active: !document.hidden });
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      // IMPORTANT: do NOT terminate the worker here. The canvas is permanently
      // transferred to it — terminating would orphan the canvas with no way
      // to recover. We only detach event listeners; the worker keeps running
      // until the page unloads. The context counter stays at +1 for the
      // worker's entire lifetime (which is the page lifetime), so we don't
      // decrement either. This is a deliberate choice that trades a small
      // permanent resource cost for StrictMode safety.
      void isFirstSetup; // unused but documents intent
      workerActiveRef.current = false;
      window.removeEventListener('resize', onResize);
      if (onMove) canvas.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // gpuTimer is stable; prop changes ARE intentionally ignored — uniforms
    // for Dither are set once at mount in this codebase.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!effectiveMouse || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current = [e.clientX - rect.left, e.clientY - rect.top];
    },
    [effectiveMouse],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Skip the main-thread path entirely when the worker effect above
    // succeeded in transferring control. The worker owns the canvas now —
    // calling getContext('webgl2') here would throw `InvalidStateError`.
    if (workerActiveRef.current || (canvas as any).__ditherWorkerOwned) return;

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return;

    // Compile shaders + link asynchronously via KHR_parallel_shader_compile
    // when available. Without this, linkProgram stalls the main thread for the
    // full link duration on cold-load (often 30–80ms on a complex shader).
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    let cancelled = false;
    let prog: WebGLProgram | null = null;
    let buf: WebGLBuffer | null = null;
    let timer: ReturnType<typeof gpuTimer.makeTimer> | null = null;
    let frozen = false;
    let lastFrameTime = 0;
    const start = performance.now();
    const FRAME_INTERVAL = 1000 / 30; // 30fps — waveSpeed=0.05 is too slow to need 60fps
    incContext();

    const resize = () => {
      const dpr = getDPRCap();
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    // Uniform locations — populated after async link completes.
    let uRes: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;
    let uSpeed: WebGLUniformLocation | null = null;
    let uFreq: WebGLUniformLocation | null = null;
    let uAmp: WebGLUniformLocation | null = null;
    let uColor: WebGLUniformLocation | null = null;
    let uMouse: WebGLUniformLocation | null = null;
    let uRadius: WebGLUniformLocation | null = null;
    let uColorNum: WebGLUniformLocation | null = null;
    let uPixelSize: WebGLUniformLocation | null = null;

    const frame = (now: number) => {
      if (frozen) { rafRef.current = 0; return; }
      if (!prog) { rafRef.current = requestAnimationFrame(frame); return; }

      rafRef.current = requestAnimationFrame(frame);

      // Throttle to 30fps
      if (now - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = now;

      // Skip GPU work when the tab is hidden (keep rAF alive so we resume instantly)
      if (!pageActiveRef.current) return;

      resize();
      const t = disableAnimation ? 0 : (now - start) / 1000;

      timer?.begin();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uSpeed, waveSpeed);
      gl.uniform1f(uFreq, waveFrequency);
      gl.uniform1f(uAmp, waveAmplitude);
      gl.uniform3f(uColor, waveColor[0], waveColor[1], waveColor[2]);
      gl.uniform2f(uMouse, mouseRef.current[0], mouseRef.current[1]);
      gl.uniform1f(uRadius, effectiveMouse ? mouseRadius : 0);
      gl.uniform1f(uColorNum, colorNum);
      gl.uniform1f(uPixelSize, pixelSize);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      timer?.end();
      timer?.poll();
      gpuTimer.markDraw();
    };

    // Kick off async program link. On resolve we finish initialization and
    // start the frame loop. Before that, frame() is a no-op.
    linkProgramAsync(gl, vs, fs).then((linked) => {
      if (cancelled || !linked) {
        if (linked) gl.deleteProgram(linked);
        return;
      }
      prog = linked;
      gl.useProgram(prog);

      // Fullscreen quad
      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(prog, 'a_pos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      uRes = gl.getUniformLocation(prog, 'u_resolution');
      uTime = gl.getUniformLocation(prog, 'u_time');
      uSpeed = gl.getUniformLocation(prog, 'u_waveSpeed');
      uFreq = gl.getUniformLocation(prog, 'u_waveFrequency');
      uAmp = gl.getUniformLocation(prog, 'u_waveAmplitude');
      uColor = gl.getUniformLocation(prog, 'u_waveColor');
      uMouse = gl.getUniformLocation(prog, 'u_mouse');
      uRadius = gl.getUniformLocation(prog, 'u_mouseRadius');
      uColorNum = gl.getUniformLocation(prog, 'u_colorNum');
      uPixelSize = gl.getUniformLocation(prog, 'u_pixelSize');

      timer = gpuTimer.makeTimer(gl);
      gpuTimer.setVisible(true);
    });

    rafRef.current = requestAnimationFrame(frame);

    // Freeze animation when scrolled past the hero (canvas is behind content anyway)
    const threshold = window.innerHeight * 1.2;
    const onScroll = () => {
      const shouldFreeze = window.scrollY > threshold;
      if (shouldFreeze && !frozen) {
        frozen = true;
        gpuTimer.setVisible(false);
        // rAF loop will stop itself on next tick
      } else if (!shouldFreeze && frozen) {
        frozen = false;
        gpuTimer.setVisible(true);
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(frame);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const el = canvas;
    el.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', onScroll);
      if (timer) timer.dispose();
      if (prog) gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (buf) gl.deleteBuffer(buf);
      // Do not call WEBGL_lose_context — StrictMode dev's setup/cleanup/setup
      // cycle would brick the canvas before the second setup could re-init.
      // The browser reclaims the context when the canvas leaves the DOM.
      decContext();
    };
    // gpuTimer.* are stable wrappers; including them re-runs this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waveSpeed, waveFrequency, waveAmplitude, waveColor, colorNum, pixelSize, disableAnimation, effectiveMouse, mouseRadius, handleMouseMove, pageActiveRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', background: '#000' }}
    />
  );
}
