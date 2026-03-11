import { useRef, useEffect, useCallback } from 'react';

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
  float v=0.,a=1.,freq=u_waveFrequency;
  for(int i=0;i<4;i++){
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

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enableMouseInteraction || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current = [e.clientX - rect.left, e.clientY - rect.top];
    },
    [enableMouseInteraction],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return;

    // Compile shaders
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uSpeed = gl.getUniformLocation(prog, 'u_waveSpeed');
    const uFreq = gl.getUniformLocation(prog, 'u_waveFrequency');
    const uAmp = gl.getUniformLocation(prog, 'u_waveAmplitude');
    const uColor = gl.getUniformLocation(prog, 'u_waveColor');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uRadius = gl.getUniformLocation(prog, 'u_mouseRadius');
    const uColorNum = gl.getUniformLocation(prog, 'u_colorNum');
    const uPixelSize = gl.getUniformLocation(prog, 'u_pixelSize');

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const start = performance.now();
    let frozen = false;

    const frame = () => {
      if (frozen) { rafRef.current = 0; return; }

      resize();
      const t = disableAnimation ? 0 : (performance.now() - start) / 1000;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uSpeed, waveSpeed);
      gl.uniform1f(uFreq, waveFrequency);
      gl.uniform1f(uAmp, waveAmplitude);
      gl.uniform3f(uColor, waveColor[0], waveColor[1], waveColor[2]);
      gl.uniform2f(uMouse, mouseRef.current[0], mouseRef.current[1]);
      gl.uniform1f(uRadius, enableMouseInteraction ? mouseRadius : 0);
      gl.uniform1f(uColorNum, colorNum);
      gl.uniform1f(uPixelSize, pixelSize);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    // Freeze animation when scrolled past the hero (canvas is behind content anyway)
    const threshold = window.innerHeight * 1.2;
    const onScroll = () => {
      const shouldFreeze = window.scrollY > threshold;
      if (shouldFreeze && !frozen) {
        frozen = true;
        // rAF loop will stop itself on next tick
      } else if (!shouldFreeze && frozen) {
        frozen = false;
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(frame);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const el = canvas;
    el.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', onScroll);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [waveSpeed, waveFrequency, waveAmplitude, waveColor, colorNum, pixelSize, disableAnimation, enableMouseInteraction, mouseRadius, handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', background: '#000' }}
    />
  );
}
