// Panneaux HUD du hero (compteurs, jauges, radars).
import { AnimatePresence, animate, motion } from "framer-motion";
import React from "react";
import { useViewportTier } from "../../lib/device.js";
import { pickResponsive } from "../../lib/shared.js";
const oo = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};
const ro = {
  hidden: {
    opacity: 0,
    y: 6
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};
function pt(e, i, a = 600, {
  decimals: o = 0,
  min: s = -1 / 0,
  max: n = 1 / 0
} = {}) {
  const [d, l] = React.useState(e);
  return React.useEffect(() => {
    const h = setInterval(() => {
      let c = e + (Math.random() * 2 - 1) * i;
      c = Math.max(s, Math.min(n, c)), l(o ? +c.toFixed(o) : Math.round(c));
    }, a);
    return () => clearInterval(h);
  }, [e, i, a, o, s, n]), d;
}
function no(e = 16, i = 120) {
  const [a, o] = React.useState(() => Array.from({
    length: e
  }, () => 30 + Math.random() * 60));
  return React.useEffect(() => {
    const s = setInterval(() => o(Array.from({
      length: e
    }, () => 18 + Math.random() * 80)), i);
    return () => clearInterval(s);
  }, [e, i]), a;
}
function so(e = 44, i = 70, a = "noise") {
  const [o, s] = React.useState(() => Array.from({
      length: e
    }, () => 16)),
    n = React.useRef(0);
  return React.useEffect(() => {
    const d = setInterval(() => {
      s(l => {
        const h = l.slice(1);
        let c;
        if (a === "heart") {
          const m = n.current % 16;
          c = m === 3 ? 3 : m === 4 ? 29 : m === 5 ? 8 : 16;
        } else c = 16 + (Math.random() * 2 - 1) * 11;
        return n.current++, h.push(c), h;
      });
    }, i);
    return () => clearInterval(d);
  }, [e, i, a]), o.map((d, l) => `${(l / (e - 1) * 160).toFixed(1)},${d.toFixed(1)}`).join(" ");
}
function HudPanel({
  style: e,
  children: i
}) {
  return <motion.div className="intro-hud__panel" style={e} variants={ro}>{i}</motion.div>;
}
function Qe({
  base: e,
  amp: i,
  period: a = 600,
  decimals: o = 0,
  suffix: s = "",
  min: n,
  max: d
}) {
  const l = pt(e, i, a, {
    decimals: o,
    min: n,
    max: d
  });
  return <>{(o ? l.toFixed(o) : l) + s}</>;
}
function Stat({
  label: e,
  value: i,
  flicker: a
}) {
  return <div className="hud-stat"><span className="hud-dim">{e}</span><span className="hud-arrow">{">>"}</span><span className={a || ""}>{i}</span></div>;
}
function Meter({
  label: e,
  base: i
}) {
  const a = pt(i, 1.6, 700, {
    min: 0,
    max: 100
  });
  return <div className="hud-meter"><span className="hud-dim">{e}</span><span className="hud-track"><motion.span className="hud-fill" initial={{
        width: 0
      }} animate={{
        width: `${a}%`
      }} transition={{
        duration: 0.4
      }} /></span><span>{a}{"%"}</span></div>;
}
function Bars() {
  const e = no();
  return <div className="hud-bars">{e.map((i, a) => <span style={{
      height: `${i}%`
    }} key={a} />)}</div>;
}
function Wave({
  mode: e
}) {
  const i = so(44, e === "heart" ? 90 : 70, e);
  return <svg className="hud-wave" viewBox="0 0 160 32" preserveAspectRatio="none"><polyline points={i} fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
}
function Radial({
  label: e,
  value: i
}) {
  const a = 2 * Math.PI * 26,
    o = pt(72, 6, 500, {
      min: 55,
      max: 92
    });
  return <div className="hud-radial"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="rgba(254,255,0,0.18)" strokeWidth="2" /><motion.circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform="rotate(-90 32 32)" animate={{
        strokeDasharray: `${a * o / 100} ${a}`
      }} transition={{
        duration: 0.4
      }} /></svg><div className="hud-radial__txt"><small className="hud-dim">{e}</small><strong className="hud-flicker hud-flicker--b">{i}</strong></div></div>;
}
function Title2() {
  return <><div className="hud-title">{"SYSTEM INITIALIZATION "}<span className="hud-arrow">{">>"}</span>{" "}<span className="hud-ok hud-flicker">{"COMPLETE"}</span></div><div className="hud-progress"><span /></div><div style={{
      marginTop: 14
    }}><Stat label="POWER CORE" value="ONLINE" flicker="hud-flicker" /><Stat label="NEURAL LINK" value="ESTABLISHED" /><Stat label="MOTORS" value="ACTIVE" /><Stat label="SENSORS" value="CALIBRATED" /><Stat label="ARMOR SYSTEMS" value="NOMINAL" /><Stat label="WEAPONS INTERFACE" value="STANDBY" flicker="hud-flicker hud-flicker--c" /></div></>;
}
function Dim() {
  return <><div className="hud-dim">{"SYS_STATUS"}</div><Wave mode="heart" /><div>{"NOMINAL"}</div></>;
}
function Dim2() {
  return <><div className="hud-dim">{"POWER OUTPUT"}</div><div className="hud-poweline"><Bars /><strong className="hud-big"><Qe base={97} amp={2} period={350} min={94} max={99} suffix="%" /></strong></div><div className="hud-dim" style={{
      marginTop: 4
    }}>{"STABLE // OK"}</div><div style={{
      marginTop: 12
    }}><span className="hud-dim">{"CORE TEMP. "}</span><strong className="hud-big"><Qe base={36.2} amp={0.25} period={800} decimals={1} suffix="°C" /></strong><div className="hud-dim">{"OPTIMAL"}</div></div></>;
}
function Big2() {
  return <><div className="hud-big2 hud-flicker hud-flicker--b">{"UNIT // M-01"}</div><div style={{
      fontFamily: "var(--font-jp)"
    }}>{"ハウウン"}</div><div className="hud-dim" style={{
      marginTop: 6
    }}>{"CLASS: CREATOR"}</div><div className="hud-dim">{"STATUS: "}<span className="hud-ok">{"ACTIVE"}</span></div></>;
}
function Dim3() {
  return <><div className="hud-dim">{"VISOR MODE"}</div><div className="hud-ok hud-flicker hud-flicker--c">{"ACTIVE"}</div></>;
}
function PanelBox() {
  return <div className="hud-panel-box"><div className="hud-dim">{"NEURAL SYNC"}</div><div className="hud-big"><Qe base={99} amp={1.4} period={450} min={97} max={100} suffix="%" /></div><Wave mode="noise" /><div style={{
      marginTop: 8
    }}><span className="hud-dim">{"SIGNAL QUALITY"}</span></div><div><span className="hud-arrow">{">>"}</span>{" "}<span className="hud-flicker hud-flicker--b">{"EXCELLENT"}</span></div></div>;
}
function bo() {
  return <Radial label="CORE" value="LIVE" />;
}
function PanelBox2() {
  return <div className="hud-panel-box"><div className="hud-dim" style={{
      marginBottom: 6
    }}>{"DIAGNOSTICS"}</div><Meter label="MOBILITY" base={98} /><Meter label="REACTORS" base={100} /><Meter label="SENSORS" base={97} /><Meter label="COMMS" base={100} /><Meter label="BALANCE" base={98} /></div>;
}
function Dim4() {
  return <div style={{
    display: "flex",
    alignItems: "center",
    gap: 10
  }}><span style={{
      fontFamily: "var(--font-jp)"
    }} className="hud-dim">{"ハウウン フラ"}</span><span className="hud-lock hud-flicker hud-flicker--c">{"LOCK"}</span></div>;
}
const Ao = [{
  id: "sysinit",
  Body: Title2,
  mobile: !1,
  base: {
    top: "10%",
    left: "10%",
    width: 350
  }
}, {
  id: "sysstatus",
  Body: Dim,
  base: {
    top: "50%",
    left: "20%",
    width: 150
  },
  mobile: {
    top: "10%",
    left: "10%"
  },
  "tablet-portrait": {
    top: "50%",
    left: "10%",
    width: 150
  }
}, {
  id: "power",
  Body: Dim2,
  base: {
    bottom: "6%",
    left: "10%",
    width: 220
  },
  mobile: {
    bottom: "10%",
    left: "10%"
  },
  "tablet-portrait": {
    bottom: "20%",
    left: "10%",
    width: 220
  }
}, {
  id: "unit",
  Body: Big2,
  base: {
    top: "34%",
    left: "60%"
  },
  mobile: {
    top: "45%",
    left: "60%"
  },
  "tablet-portrait": {
    top: "30%",
    left: "80%",
    width: 220
  }
}, {
  id: "visor",
  Body: Dim3,
  mobile: !1,
  base: {
    top: "60%",
    left: "31%"
  }
}, {
  id: "neural",
  Body: PanelBox,
  mobile: !1,
  base: {
    top: "14%",
    right: "20%",
    width: 240
  },
  "tablet-portrait": {
    top: "14%",
    right: "10%",
    width: 240
  }
}, {
  id: "thruster",
  Body: bo,
  mobile: !1,
  "tablet-portrait": !1,
  base: {
    top: "50%",
    right: "30%"
  }
}, {
  id: "diagnostics",
  Body: PanelBox2,
  mobile: !1,
  base: {
    bottom: "5%",
    right: "10%",
    width: 240
  },
  "tablet-portrait": {
    bottom: "20%",
    right: "10%",
    width: 220
  }
}, {
  id: "lock",
  Body: Dim4,
  mobile: !1,
  base: {
    bottom: "10%",
    left: "50%",
    transform: "translateX(-50%)"
  }
}];
function Hud({
  active: e
}) {
  const {
    tier: i,
    orient: a
  } = useViewportTier();
  return <AnimatePresence>{e && <motion.div className="intro-hud" aria-hidden={!0} variants={oo} initial="hidden" animate="show" exit={{
      opacity: 0,
      transition: {
        duration: 0.25
      }
    }}>{Ao.map(({
        id: o,
        Body: S,
        ...n
      }) => {
        const d = pickResponsive(n, i, a);
        return d ? <HudPanel style={d} key={o}><S /></HudPanel> : null;
      })}</motion.div>}</AnimatePresence>;
}
export { Hud };
