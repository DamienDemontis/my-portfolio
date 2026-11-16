// Parametres de scroll, de scenes 3D et de post-traitement.
import { NARROW_ASPECT_QUERY } from "./lib/device.js";
import { envelope } from "./lib/shared.js";
const LIGHT_RIG = [{
  id: "amb",
  label: "Ambient",
  type: "ambient"
}, {
  id: "key",
  label: "Key (cool front)",
  type: "dir"
}, {
  id: "fill",
  label: "Fill (shadow side)",
  type: "dir"
}, {
  id: "rimBack",
  label: "Rim back (yellow)",
  type: "dir"
}];
const Da = {
  env: 0,
  amb: {
    intensity: 1.3,
    color: "#29220f",
    pos: null
  },
  key: {
    intensity: 0,
    color: "#9b7e12",
    pos: [-4, -3.1, -6.5]
  },
  fill: {
    intensity: 0,
    color: "#50473f",
    pos: [-1.9, 8.6, -3.1]
  },
  rimBack: {
    intensity: 0.65,
    color: "#e6a800",
    pos: [10, 2.1, -10]
  }
};
const _a = {
  env: 1.5,
  amb: {
    intensity: 0,
    color: "#332b1e",
    pos: null
  },
  key: {
    intensity: 3.85,
    color: "#9f9475",
    pos: [-1.4, -0.4, 1.8]
  },
  fill: {
    intensity: 2.55,
    color: "#50473f",
    pos: [-7.4, 8.6, -3.1]
  },
  rimBack: {
    intensity: 3.8,
    color: "#e6a800",
    pos: [1, -10, 3]
  }
};
function ja(e) {
  const i = {
    env: e.env
  };
  for (const a of LIGHT_RIG) {
    const o = e[a.id];
    i[a.id] = {
      intensity: o.intensity,
      color: o.color,
      pos: o.pos ? [...o.pos] : null
    };
  }
  return i;
}
const CAMERA_SHOTS = [{
  pos: [1.3, 0.9, 0.3],
  look: [-1.2, 0.9, -0.4],
  fov: 27,
  at: 0,
  transition: "cut",
  dur: 2e3,
  anim: "power_on",
  lights: {
    env: 0,
    amb: {
      intensity: 1.3,
      color: "#29220f"
    },
    key: {
      intensity: 6,
      color: "#9b7e12",
      pos: [-20, -20, 11.5]
    },
    fill: {
      intensity: 0,
      color: "#50473f",
      pos: [-1.9, 8.6, -3.1]
    },
    rimBack: {
      intensity: 0.5,
      color: "#e6a800",
      pos: [10, 2.1, -10]
    }
  }
}, {
  pos: [1.3, 0.9, 0.3],
  look: [-1.2, 0.9, -0.4],
  fov: 27,
  at: 500,
  transition: "cut",
  dur: 2e3,
  anim: "",
  lights: {
    env: 0,
    amb: {
      intensity: 1.3,
      color: "#29220f"
    },
    key: {
      intensity: 6,
      color: "#9b7e12",
      pos: [4.3, -20, 11.5]
    },
    fill: {
      intensity: 3.5,
      color: "#50473f",
      pos: [-1.9, 8.6, -3.1]
    },
    rimBack: {
      intensity: 0.5,
      color: "#e6a800",
      pos: [10, 2.1, -10]
    }
  }
}, {
  pos: [2, 2, 2.9],
  look: [0.12, 3.44, -0.06],
  fov: 31,
  at: 2700,
  transition: "cut",
  dur: 2e3,
  anim: "build",
  lights: {
    env: 1.5,
    amb: {
      intensity: 0,
      color: "#332b1e"
    },
    key: {
      intensity: 0,
      color: "#9f9475",
      pos: [-3.5, -0.4, 1.8]
    },
    fill: {
      intensity: 0.4,
      color: "#3700ff",
      pos: [20, 20, -9.2]
    },
    rimBack: {
      intensity: 3.8,
      color: "#e6b400",
      pos: [-12.2, -20, -2]
    }
  }
}, {
  pos: [-0.4, 4.9, -0.7],
  look: [0, 2.6, 1],
  fov: 34,
  at: 5e3,
  transition: "cut",
  dur: 2e3,
  anim: "",
  lights: {
    env: 1.5,
    amb: {
      intensity: 0,
      color: "#332b1e"
    },
    key: {
      intensity: 0,
      color: "#9f9475",
      pos: [-3.5, -0.4, 1.8]
    },
    fill: {
      intensity: 0,
      color: "#50473f",
      pos: [-7.4, 8.6, -3.1]
    },
    rimBack: {
      intensity: 3.8,
      color: "#e6b400",
      pos: [-12.2, -10, 3]
    }
  }
}, {
  pos: [-0.4, 4.9, -0.7],
  look: [0, 2.6, 1],
  fov: 34,
  at: 7750,
  transition: "cut",
  dur: 2e3,
  anim: "",
  lights: {
    env: 0.53,
    amb: {
      intensity: 4.9,
      color: "#110820"
    },
    key: {
      intensity: 4.15,
      color: "#e5ffad",
      pos: [-7.2, -20, -7]
    },
    fill: {
      intensity: 4.6,
      color: "#aa4b67",
      pos: [2, -20, 20]
    },
    rimBack: {
      intensity: 6,
      color: "#5ca7c7",
      pos: [7.8, -20, 20]
    }
  }
}, {
  pos: [-2, -22, -6],
  look: [8, -24, 1],
  fov: 34,
  at: 9300,
  transition: "cut",
  dur: 2e3,
  anim: "",
  lights: {
    env: 1.5,
    amb: {
      intensity: 0,
      color: "#332b1e"
    },
    key: {
      intensity: 1.75,
      color: "#9f9475",
      pos: [-1.4, -0.4, 1.8]
    },
    fill: {
      intensity: 2.65,
      color: "#50473f",
      pos: [-7.4, 8.6, -3.1]
    },
    rimBack: {
      intensity: 2.1,
      color: "#e6a800",
      pos: [1, -10, 3]
    }
  }
}, {
  pos: [-4, 0, -1],
  look: [0.03, -0.45, -0.33],
  fov: 37,
  at: 9900,
  transition: "lerp",
  dur: 1e3,
  anim: "descent"
}, {
  pos: [-1.5, -7.7, -0.5],
  look: [40.8, -7.7, 4.6],
  fov: 54,
  at: 14e3,
  transition: "lerp",
  dur: 4e3,
  anim: "",
  exit: !0
}];
CAMERA_SHOTS.forEach((e, i) => {
  e.lights || (e.lights = ja(i === 0 ? Da : _a));
});
const CAMERA_SHOTS_NARROW = [{
  pos: [1.3, 0.75, 0.4],
  look: [-1.2, 0.9, -0.4],
  fov: 35
}, {
  pos: [1.3, 0.75, 0.4],
  look: [-1.2, 0.9, -0.4],
  fov: 35
}, {
  pos: [2, 2, 2.9],
  look: [0.12, 3.44, -0.06],
  fov: 31
}, {
  pos: [-0.55, 5.1, -0.7],
  look: [0, 2.6, 1],
  fov: 37
}, {
  pos: [-0.55, 5.1, -0.7],
  look: [0, 2.6, 1],
  fov: 37
}, {
  pos: [-2, -22, -6],
  look: [8, -24, 1],
  fov: 34
}, {
  pos: [-3.8, 0, -1],
  look: [0.03, -0.45, -0.33],
  fov: 37
}, {
  pos: [-1.5, -7.7, -0.5],
  look: [40.8, -7.7, 4.6],
  fov: 54
}];
const CAMERA_SHOTS_BASE = CAMERA_SHOTS.map(e => ({
  pos: [...e.pos],
  look: [...e.look],
  fov: e.fov
}));
function applyCameraShots(e) {
  const i = e ? CAMERA_SHOTS_NARROW : CAMERA_SHOTS_BASE;
  config.cameraShots.forEach((a, o) => {
    const s = i[o];
    s && (a.pos = [...s.pos], a.look = [...s.look], a.fov = s.fov);
  }), config.shotsVersion++;
}
const Ba = {
  enabled: !0,
  vh: 14,
  vhTouch: 5,
  touchMaxPxPerSec: 1200,
  touchFriction: 0.96,
  siteTouchMaxPxPerSec: 2400,
  siteTouchFriction: 0.95,
  smooth: 0.1,
  tailMs: 1200,
  exitCamVh: 0.85
};
const Pa = {
  l1: {
    startMs: 2700,
    endMs: 5e3
  },
  l2: {
    startMs: 7750,
    endMs: 9300
  }
};
const Ga = {
  copies: 1,
  spawnIntervalMs: 10,
  lifetimeMs: 650,
  fadeMs: 920,
  offsetX: 0.8,
  offsetY: 0.06,
  offsetZ: 0.06,
  jitter: 0.13,
  ditherPx: 3,
  gain: 2.1,
  colorLight: "#ffee00",
  colorDark: "#1f1e10"
};
const Fa = {
  atFrame: 35,
  durationMs: 800,
  amplitude: 0.12,
  frequency: 35
};
const Va = {
  count: 400,
  areaRadius: 31,
  clearRadius: 6,
  minH: 1,
  maxH: 34,
  minW: 0.5,
  maxW: 3.9,
  groundY: -30,
  buildingColor: "#080703",
  blend: 0.46,
  windowSize: 0.29,
  windowDensity: 0.15,
  windowMargin: 0.22,
  flicker: 0,
  brightness: 0.5,
  colorA: "#4e431d",
  colorB: "#333d00",
  colorC: "#322f1a",
  ditherPx: 3,
  fogColor: "#111103",
  fogNear: 1,
  fogFar: 70,
  seed: 3,
  exitColorA: "#e5ff00",
  exitColorB: "#e5ff00",
  exitColorC: "#e5ff00",
  exitBuildingColor: "#e5ff00",
  heroW: 2.5,
  heroD: 2,
  heroTopY: -1.2,
  heroX: 0.15,
  heroZ: -0.15,
  heroRotY: -12,
  heroDelay: 0.08,
  genStartMs: 7e3,
  genEndMs: 13e3,
  genStagger: 0.6,
  glowColor: "#00f7ff",
  glowWidth: 1.2,
  glowIntensity: 6,
  iridSpeed: 0.15,
  iridScale: 1.2,
  baseFogColor: "#e5ff00",
  baseFogHeight: 9,
  baseFogIntensity: 1,
  beamCount: 200,
  beamWidth: 0.35,
  beamMinH: 10,
  beamMaxH: 42,
  beamColor: "#e0ff33",
  beamIntensity: 1.4,
  bloomIntensity: 1.1,
  bloomThreshold: 0.35,
  bloomSmoothing: 0.5,
  bloomRadius: 0.7
};
const Ua = {
  bodyStartMs: 2300,
  bodyEndMs: 7750,
  bodyFadeMs: 700,
  vortexStartMs: 2300,
  vortexEndMs: 5e3,
  vortexFadeMs: 700,
  color: "#b1a62f",
  intensity: 3,
  auraColor: "#ffffff",
  auraColorDark: "#ffffff",
  auraDitherPx: 1,
  auraCount: 8,
  auraRadius: 1.05,
  auraHeight: 0.6,
  auraIntensity: 4,
  auraSwirl: 0.45,
  auraTwist: 0,
  iridSpeed: 1,
  iridScale: 4
};
const qa = {
  boot: {
    dark: "#080808",
    light: "#423d05",
    pixel: 1,
    lo: 0.36,
    hi: 1,
    scale: 2.05,
    speed: 0.1,
    halo: 0.26,
    irid: !1
  },
  powered: {
    dark: "#080808",
    light: "#323312",
    pixel: 1,
    lo: 0.34,
    hi: 0.83,
    scale: 2.05,
    speed: 0.3,
    halo: 0.3,
    irid: !0
  },
  landed: {
    dark: "#060606",
    light: "#2a2703",
    pixel: 1,
    lo: 0.36,
    hi: 1,
    scale: 2.4,
    speed: 0.1,
    halo: 0.2,
    irid: !1
  },
  content: {
    dark: "#060606",
    light: "#3f3908",
    pixel: 1,
    lo: 0.64,
    hi: 1,
    scale: 0.9,
    speed: 0.065,
    halo: 0.3,
    irid: !1
  }
};
const Wa = {
  bloomIntensity: 0.45,
  bloomThreshold: 0.58,
  bloomSmoothing: 0.3,
  bloomRadius: 0.14,
  vignetteDarkness: 0.75,
  vignetteOffset: 0.51
};
const config = {
  cameraShots: CAMERA_SHOTS,
  shotsVersion: 0,
  scroll: Ba,
  scrollDriven: !1,
  scrollMs: 0,
  overlays: Pa,
  post: Wa,
  ditherStates: qa,
  ditherState: "boot",
  heroExit: 0,
  exitCam: 0,
  heroExitPitch: -5,
  glitch: Ga,
  glitchActive: !1,
  shake: Fa,
  shakeFireId: 0,
  city: Va,
  cityVersion: 0,
  power: Ua,
  camSync: {
    pos: [1.3, 0.9, 0.3],
    look: [-1.2, 0.9, -0.4],
    fov: 27,
    on: !1
  },
  robotCenter: [0, 0, 0]
};
function powerBodyEnvelope(e) {
  const i = config.power;
  return envelope(e, i.bodyStartMs, i.bodyEndMs, i.bodyFadeMs);
}
function powerVortexEnvelope(e) {
  const i = config.power;
  return envelope(e, i.vortexStartMs, i.vortexEndMs, i.vortexFadeMs);
}
function stopGlitch(e) {
  config.glitchActive = !1;
}
typeof window < "u" && window.matchMedia && applyCameraShots(window.matchMedia(NARROW_ASPECT_QUERY).matches);
export { LIGHT_RIG, applyCameraShots, config, powerBodyEnvelope, powerVortexEnvelope, stopGlitch };
