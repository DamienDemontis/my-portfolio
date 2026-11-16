import { MEDIA_QUERIES } from "../../lib/device.js";
import '../../styles/case-video-player.css';
import React from "react";
function useMediaQuery(t) {
  const [m, h] = React.useState(() => typeof window < "u" && window.matchMedia(t).matches);
  return React.useEffect(() => {
    const l = window.matchMedia(t),
      p = () => h(l.matches);
    return p(), l.addEventListener("change", p), () => l.removeEventListener("change", p);
  }, [t]), m;
}
function useCompactViewport() {
  return useMediaQuery(`${MEDIA_QUERIES.mobileDown}, ${MEDIA_QUERIES.tabletDown} and ${MEDIA_QUERIES.narrowAspect}`);
}
function useIsTabletDown() {
  return useMediaQuery(MEDIA_QUERIES.tabletDown);
}
const K = 2800;
function H(t) {
  if (!Number.isFinite(t) || t < 0) return "00:00";
  const m = Math.floor(t),
    h = Math.floor(m / 60),
    l = m % 60;
  return `${String(h).padStart(2, "0")}:${String(l).padStart(2, "0")}`;
}
function D() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}
function re(t) {
  return t.requestFullscreen ? t.requestFullscreen({
    navigationUI: "hide"
  }) : t.webkitRequestFullscreen ? t.webkitRequestFullscreen() : Promise.reject(new Error("Fullscreen API not supported"));
}
function se() {
  return document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : Promise.reject(new Error("Fullscreen API not supported"));
}
function CaseVideoPlayerFrame({
  video: t,
  accent: m,
  className: h = ""
}) {
  const l = React.useRef(null),
    p = React.useRef(null),
    i = React.useRef(null),
    c = React.useRef(!1),
    v = React.useRef(null),
    o = React.useRef(() => {
      var e;
      return (e = v.current) == null ? void 0 : e.call(v);
    }).current,
    L = React.useRef(e => {
      var n;
      e.buttons === 0 && ((n = v.current) == null || n.call(v));
    }).current,
    [u, R] = React.useState(!1),
    [x, _] = React.useState(!1),
    [I, V] = React.useState(!1),
    [d, Y] = React.useState(0),
    [N, j] = React.useState(0),
    [S, T] = React.useState(t != null && t.muted ? 0 : (t == null ? void 0 : t.volume) ?? 1),
    [W, w] = React.useState(!0),
    [E, Z] = React.useState(null);
  React.useEffect(() => {
    const e = l.current;
    if (!e || !(t != null && t.src)) return;
    const n = () => {
        c.current || j(e.currentTime || 0);
      },
      a = () => Y(e.duration || 0),
      g = () => {
        const {
          videoWidth: B,
          videoHeight: O
        } = e;
        B > 0 && O > 0 && Z({
          width: B,
          height: O
        });
      },
      f = () => R(!e.paused && !e.ended),
      C = () => {
        _(e.muted || e.volume === 0), T(e.muted ? 0 : e.volume);
      };
    return f(), C(), a(), n(), g(), e.addEventListener("play", f), e.addEventListener("pause", f), e.addEventListener("ended", f), e.addEventListener("timeupdate", n), e.addEventListener("loadedmetadata", a), e.addEventListener("durationchange", a), e.addEventListener("volumechange", C), e.addEventListener("loadedmetadata", g), e.addEventListener("resize", g), () => {
      e.removeEventListener("play", f), e.removeEventListener("pause", f), e.removeEventListener("ended", f), e.removeEventListener("timeupdate", n), e.removeEventListener("loadedmetadata", a), e.removeEventListener("durationchange", a), e.removeEventListener("volumechange", C), e.removeEventListener("loadedmetadata", g), e.removeEventListener("resize", g);
    };
  }, [t == null ? void 0 : t.src]), React.useEffect(() => {
    const e = () => {
      V(D() === p.current);
    };
    return document.addEventListener("fullscreenchange", e), document.addEventListener("webkitfullscreenchange", e), () => {
      document.removeEventListener("fullscreenchange", e), document.removeEventListener("webkitfullscreenchange", e);
    };
  }, []), React.useEffect(() => {
    if (window.clearTimeout(i.current), !u) {
      w(!0);
      return;
    }
    return i.current = window.setTimeout(() => {
      c.current || w(!1);
    }, K), () => window.clearTimeout(i.current);
  }, [u]), React.useEffect(() => () => {
    window.clearTimeout(i.current), window.removeEventListener("pointerup", o), window.removeEventListener("pointercancel", o), window.removeEventListener("blur", o), window.removeEventListener("pointermove", L);
  }, [o, L]);
  const $ = React.useMemo(() => d ? N / d * 100 : 0, [N, d]);
  if (!(t != null && t.src)) return null;
  const b = () => {
      window.clearTimeout(i.current), w(!0), u && !c.current && (i.current = window.setTimeout(() => {
        c.current || w(!1);
      }, K));
    },
    G = () => {
      u && !c.current && (window.clearTimeout(i.current), w(!1));
    },
    k = async () => {
      const e = l.current;
      if (e) {
        if (e.paused || e.ended) {
          try {
            await e.play();
          } catch {
            R(!1);
          }
          return;
        }
        e.pause();
      }
    },
    A = e => {
      const n = l.current;
      if (!n || !d) return;
      const a = Math.min(Math.max(n.currentTime + e, 0), d);
      n.currentTime = a, j(a);
    },
    J = e => {
      const n = l.current;
      if (!n || !d) return;
      const a = Number(e.target.value) / 100 * d;
      n.currentTime = a, j(a);
    },
    X = () => {
      c.current = !0, window.clearTimeout(i.current), w(!0), window.addEventListener("pointerup", o), window.addEventListener("pointercancel", o), window.addEventListener("blur", o), window.addEventListener("pointermove", L);
    },
    M = () => {
      if (window.removeEventListener("pointerup", o), window.removeEventListener("pointercancel", o), window.removeEventListener("blur", o), window.removeEventListener("pointermove", L), !c.current) return;
      c.current = !1;
      const e = l.current;
      e && j(e.currentTime || 0), b();
    };
  v.current = M;
  const ee = e => {
      const n = l.current;
      if (!n) return;
      const a = Number(e.target.value) / 100;
      n.volume = a, n.muted = a === 0, T(a), _(a === 0);
    },
    U = () => {
      const e = l.current;
      if (e) {
        if (e.muted || e.volume === 0) {
          const n = S > 0 ? S : 1;
          e.muted = !1, e.volume = n, T(n), _(!1);
          return;
        }
        e.muted = !0, _(!0);
      }
    },
    q = async () => {
      const e = p.current,
        n = l.current;
      if (!e) return;
      if (!!!(e.requestFullscreen || e.webkitRequestFullscreen) && n != null && n.webkitEnterFullscreen) {
        n.webkitEnterFullscreen();
        return;
      }
      try {
        if (D() === e) {
          await se();
          return;
        }
        await re(e);
      } catch {
        V(D() === e);
      }
    },
    te = e => {
      if (e.target.tagName === "BUTTON" || e.target.type === "range") {
        b();
        return;
      }
      switch (e.key) {
        case " ":
        case "k":
        case "K":
          e.preventDefault(), k();
          break;
        case "m":
        case "M":
          U();
          break;
        case "f":
        case "F":
          q();
          break;
        case "ArrowRight":
          e.preventDefault(), A(5);
          break;
        case "ArrowLeft":
          e.preventDefault(), A(-5);
          break;
      }
      b();
    },
    P = E ? E.width / E.height : null,
    z = P !== null && P < 1,
    ne = ["case-section", "case-video-player", z ? "is-portrait" : "", W ? "" : "is-controls-hidden", h].filter(Boolean).join(" "),
    y = {};
  return m && (y["--accent"] = m), z && (y["--player-ratio"] = `${E.width} / ${E.height}`, y["--player-ratio-value"] = P), <section ref={p} className={ne} style={Object.keys(y).length ? y : void 0} aria-label={t.ariaLabel || "Project video player"} tabIndex={0} onKeyDown={te} onPointerMove={b} onPointerDown={b} onPointerLeave={G}><div className="case-video-player__frame"><button type="button" className={`case-video-player__overlay ${u ? "is-hidden" : ""}`} onClick={k} aria-label={u ? "Pause video" : "Play video"} tabIndex={-1}><span className="case-video-player__overlay-icon" aria-hidden="true"><svg viewBox="0 0 50 55" className="case-video-player__play-icon" xmlns="http://www.w3.org/2000/svg"><path d="M49.638,24.819l0,4.964l-2.482,0l0,2.482l-2.482,0l0,2.482l-4.964,0l0,2.482l-4.964,0l0,2.482l-2.482,0l0,2.482l-4.964,0l0,2.482l-4.964,0l0,2.482l-2.482,0l0,2.482l-4.964,0l0,2.482l-4.964,0l0,2.482l-7.446,0l0,-2.482l-2.482,0l0,-49.638l2.482,-0l0,-2.482l7.446,0l0,2.482l4.964,0l0,2.482l4.964,0l0,2.482l2.482,0l0,2.482l4.964,0l0,2.482l4.964,0l0,2.482l2.482,0l0,2.482l4.964,0l0,2.482l4.964,0l0,2.482l2.482,0l0,2.482l2.482,0Z" fill="currentColor" /></svg></span></button><video ref={l} className="case-video-player__media" src={t.src} poster={t.poster} preload={t.preload || "metadata"} playsInline={!0} loop={t.loop} muted={t.muted} onClick={k} /><div className="case-video-player__chrome"><div className="case-video-player__meters"><input type="range" className="case-video-player__progress" min="0" max="100" step="0.1" value={$} onChange={J} onPointerDown={X} onPointerUp={M} onPointerCancel={M} aria-label="Seek video" style={{
            "--progress-value": `${$}%`
          }} /><input type="range" className="case-video-player__volume" min="0" max="100" value={Math.round((x ? 0 : S) * 100)} onChange={ee} aria-label="Video volume" style={{
            "--volume-value": `${Math.round((x ? 0 : S) * 100)}%`
          }} /></div><div className="case-video-player__controls"><div className="case-video-player__controls-group"><button type="button" className="case-video-player__text-button" onClick={k} aria-label={u ? "Pause video" : "Play video"}>{u ? "PAUSE" : "PLAY"}</button><div className="case-video-player__time" aria-live="off"><span>{H(N)}</span><span>{"/"}</span><span>{H(d)}</span></div></div><div className="case-video-player__controls-group case-video-player__controls-group--end"><button type="button" className="case-video-player__icon-button" onClick={U} aria-label={x ? "Unmute video" : "Mute video"}>{x ? "MUTE" : "VOL"}</button><button type="button" className="case-video-player__icon-button" onClick={q} aria-label={I ? "Exit fullscreen" : "Enter fullscreen"}>{I ? "MIN" : "FULL"}</button></div></div></div></div></section>;
}
export { CaseVideoPlayerFrame, useIsTabletDown, useMediaQuery, useCompactViewport };
