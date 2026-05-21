/**
 * Dither shader worker.
 *
 * Owns an OffscreenCanvas + WebGL2 context and runs the dither fragment shader
 * on a worker thread. The main thread sends:
 *   - 'init'     : { canvas: OffscreenCanvas, uniforms, dpr }
 *   - 'resize'   : { width, height, dpr }
 *   - 'uniforms' : partial uniform updates
 *   - 'mouse'    : { x, y } in canvas-relative coords
 *   - 'freeze'   : boolean — skip draws while frozen
 *   - 'active'   : boolean — page visibility
 *   - 'dispose'  : tear down
 *
 * Why a worker:
 *   - Removes uniform uploads + draw calls from the main thread completely.
 *     Under heavy React work during scroll (IntersectionObservers firing,
 *     setState, layout) the main thread's rAF can drop ~200µs jitter into the
 *     Dither frame; on a worker, the shader keeps rendering steady.
 *   - The GPU work is unchanged — this is about CPU jitter, not GPU throughput.
 *
 * Sized to fail gracefully: if anything in here throws, the main thread sees
 * the error and falls back to its in-thread Dither implementation.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

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
  // 3 octaves (was 4) — see Dither.tsx note. The 4th octave was visually
  // indistinguishable after Bayer + 4-color quantization.
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

interface InitMsg {
  type: 'init';
  canvas: OffscreenCanvas;
  uniforms: {
    waveSpeed: number;
    waveFrequency: number;
    waveAmplitude: number;
    waveColor: [number, number, number];
    colorNum: number;
    pixelSize: number;
    disableAnimation: boolean;
    mouseRadius: number;
  };
  dpr: number;
  width: number;
  height: number;
}

let canvas: OffscreenCanvas | null = null;
let gl: WebGL2RenderingContext | null = null;
let prog: WebGLProgram | null = null;
let uniformsLoc: Record<string, WebGLUniformLocation | null> = {};
let dpr = 1;
let active = true;
let frozen = false;
let raf = 0;
let lastFrameTime = 0;
let start = 0;
let mouseX = 0;
let mouseY = 0;
let mouseRadius = 1;

const state = {
  waveSpeed: 0.05,
  waveFrequency: 3,
  waveAmplitude: 0.3,
  waveColor: [0.5, 0.5, 0.5] as [number, number, number],
  colorNum: 4,
  pixelSize: 2,
  disableAnimation: false,
};

const FRAME_INTERVAL = 1000 / 30;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function linkSync(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  // KHR_parallel_shader_compile is mostly pointless in a worker — the worker
  // is the only consumer of its own thread, so blocking on link here doesn't
  // jank the main thread anyway. Plus it simplifies init.
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    // Surface to main thread for fallback.
    const err = gl.getProgramInfoLog(p) || 'link failed';
    (self as any).postMessage({ type: 'error', error: err });
    return null;
  }
  return p;
}

function init(msg: InitMsg) {
  canvas = msg.canvas;
  dpr = msg.dpr;
  Object.assign(state, msg.uniforms);
  mouseRadius = msg.uniforms.mouseRadius;
  canvas.width = Math.round(msg.width * dpr);
  canvas.height = Math.round(msg.height * dpr);

  gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
  }) as WebGL2RenderingContext | null;
  if (!gl) {
    (self as any).postMessage({ type: 'error', error: 'no webgl2 in worker' });
    return;
  }

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) {
    (self as any).postMessage({ type: 'error', error: 'compile failed' });
    return;
  }

  prog = linkSync(gl, vs, fs);
  if (!prog) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  uniformsLoc = {
    u_resolution: gl.getUniformLocation(prog, 'u_resolution'),
    u_time: gl.getUniformLocation(prog, 'u_time'),
    u_waveSpeed: gl.getUniformLocation(prog, 'u_waveSpeed'),
    u_waveFrequency: gl.getUniformLocation(prog, 'u_waveFrequency'),
    u_waveAmplitude: gl.getUniformLocation(prog, 'u_waveAmplitude'),
    u_waveColor: gl.getUniformLocation(prog, 'u_waveColor'),
    u_mouse: gl.getUniformLocation(prog, 'u_mouse'),
    u_mouseRadius: gl.getUniformLocation(prog, 'u_mouseRadius'),
    u_colorNum: gl.getUniformLocation(prog, 'u_colorNum'),
    u_pixelSize: gl.getUniformLocation(prog, 'u_pixelSize'),
  };

  gl.viewport(0, 0, canvas.width, canvas.height);
  start = performance.now();
  raf = requestAnimationFrame(frame);

  (self as any).postMessage({ type: 'ready' });
}

function frame(now: number) {
  if (!gl || !canvas) return;
  if (frozen) { raf = 0; return; }
  raf = requestAnimationFrame(frame);
  if (now - lastFrameTime < FRAME_INTERVAL) return;
  lastFrameTime = now;
  if (!active) return;

  const u = uniformsLoc;
  const t = state.disableAnimation ? 0 : (now - start) / 1000;

  gl.uniform2f(u.u_resolution, canvas.width, canvas.height);
  gl.uniform1f(u.u_time, t);
  gl.uniform1f(u.u_waveSpeed, state.waveSpeed);
  gl.uniform1f(u.u_waveFrequency, state.waveFrequency);
  gl.uniform1f(u.u_waveAmplitude, state.waveAmplitude);
  gl.uniform3f(u.u_waveColor, state.waveColor[0], state.waveColor[1], state.waveColor[2]);
  gl.uniform2f(u.u_mouse, mouseX, mouseY);
  gl.uniform1f(u.u_mouseRadius, mouseRadius);
  gl.uniform1f(u.u_colorNum, state.colorNum);
  gl.uniform1f(u.u_pixelSize, state.pixelSize);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

(self as any).onmessage = (e: MessageEvent) => {
  const msg = e.data;
  switch (msg.type) {
    case 'init':
      init(msg as InitMsg);
      break;
    case 'resize': {
      if (!gl || !canvas) return;
      dpr = msg.dpr ?? dpr;
      canvas.width = Math.round(msg.width * dpr);
      canvas.height = Math.round(msg.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      break;
    }
    case 'uniforms':
      Object.assign(state, msg.uniforms ?? {});
      if (typeof msg.mouseRadius === 'number') mouseRadius = msg.mouseRadius;
      break;
    case 'mouse':
      mouseX = msg.x * dpr;
      mouseY = msg.y * dpr;
      break;
    case 'freeze':
      if (msg.frozen) {
        frozen = true;
      } else if (frozen) {
        frozen = false;
        if (!raf) raf = requestAnimationFrame(frame);
      }
      break;
    case 'active':
      active = !!msg.active;
      break;
    case 'dispose':
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (gl && prog) gl.deleteProgram(prog);
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      gl = null;
      canvas = null;
      break;
  }
};
