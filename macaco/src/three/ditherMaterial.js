import { MeshStandardMaterial, Vector3 } from "three";
function hexToRgb01(o) {
  const e = (o || "#000000").replace("#", "");
  return [parseInt(e.slice(0, 2), 16) / 255, parseInt(e.slice(2, 4), 16) / 255, parseInt(e.slice(4, 6), 16) / 255];
}
function makeDitherMaterial({
  transparent: o = !0,
  opacity: e = 0,
  pixel: i = 3,
  gain: u = 1.6,
  colorLight: c = "#d9d9d9",
  colorDark: f = "#000000"
} = {}) {
  const t = {
      uOpacity: {
        value: o ? e : 1
      },
      uPixel: {
        value: i
      },
      uGain: {
        value: u
      },
      uColorLight: {
        value: new Vector3(...hexToRgb01(c))
      },
      uColorDark: {
        value: new Vector3(...hexToRgb01(f))
      }
    },
    r = new MeshStandardMaterial({
      color: 16777215,
      roughness: 1,
      metalness: 0,
      transparent: o
    });
  return r.onBeforeCompile = a => {
    Object.assign(a.uniforms, t), a.fragmentShader = `uniform float uOpacity;
uniform float uPixel;
uniform float uGain;
uniform vec3 uColorLight;
uniform vec3 uColorDark;
float ghostBayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
` + a.fragmentShader.replace("#include <dithering_fragment>", `#include <dithering_fragment>
        {
          float lum = clamp(dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114)) * uGain, 0.0, 1.0);
          vec2 dp = floor(gl_FragCoord.xy / max(uPixel, 1.0));
          float threshold = ghostBayer2(dp * 0.5) * 0.25 + ghostBayer2(dp) + 1.0 / 32.0;
          // Pick between the two dither colours per pixel (light dots vs dark bg).
          vec3 col = mix(uColorDark, uColorLight, step(threshold, lum));
          gl_FragColor = vec4(col, uOpacity);
        }`);
  }, r.userData.uniforms = t, r;
}
export { hexToRgb01, makeDitherMaterial };
