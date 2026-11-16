// Navigation principale, lien applicatif et panneau mobile.
import React from "react";
import { useTranslation } from "react-i18next";
import { useHref, useLocation, useParams } from "react-router-dom";
import { usePageTransitionContext } from "./PageTransition.jsx";
import { SOCIAL_LINKS } from "../content/site.js";
import { LANGUAGES } from "../i18n/index.js";
import { getScrollTop, onScroll } from "../lib/scroll.js";
const AppLink = React.forwardRef(function ({
  to: i,
  onClick: a,
  target: o,
  className: s,
  style: n,
  isActive: d,
  children: l,
  ...h
}, c) {
  const m = usePageTransitionContext(),
    v = useHref(i),
    A = C => {
      a == null || a(C), !C.defaultPrevented && (C.button !== 0 || C.metaKey || C.ctrlKey || C.shiftKey || C.altKey || o && o !== "_self" || (C.preventDefault(), m != null && m.navigate ? m.navigate(v) : window.location.assign(v)));
    },
    f = C => typeof C == "function" ? C({
      isActive: !!d
    }) : C;
  return <a ref={c} href={v} target={o} onClick={A} className={f(s)} style={f(n)} {...h}>{l}</a>;
});
const LOGO_YELLOW_SRC = "/general/macaco-logo-yellow.svg";
const qt = [{
  to: "",
  key: "nav.home"
}, {
  to: "/projects",
  key: "nav.projects"
}, {
  to: "/laboratory",
  key: "nav.laboratory"
}, {
  to: "/contact",
  key: "nav.contact"
}];
const Er = SOCIAL_LINKS;
const Wt = "info@studiomacaco.ch";
const Ht = "+41 091 261 49 84";
const Ir = 8;
const $t = "macaco:yellow-nav";
function NavBar({
  isHome: e = !1
}) {
  const {
      lang: i
    } = useParams(),
    {
      pathname: a
    } = useLocation(),
    {
      t: o
    } = useTranslation(),
    [s, n] = React.useState(!1),
    [d, l] = React.useState(!1),
    [h, c] = React.useState(!1),
    m = a.replace(/^\/[^/]+/, ""),
    v = a.replace(/\/+$/, "") || `/${i}`,
    A = b => b === "" ? v === `/${i}` : v.startsWith(`/${i}${b}`),
    f = LANGUAGES.find(b => b !== i) || i;
  React.useEffect(() => {
    let b = 0;
    const _ = () => {
        b = 0, n(getScrollTop() > Ir);
      },
      L = () => {
        b || (b = window.requestAnimationFrame(_));
      };
    _();
    const G = onScroll(L, {
      resize: !1
    });
    return () => {
      G(), b && window.cancelAnimationFrame(b);
    };
  }, []), React.useEffect(() => {
    if (!e) {
      c(!1);
      return;
    }
    const b = _ => c(!!_.detail);
    return window.addEventListener($t, b), () => window.removeEventListener($t, b);
  }, [e]), React.useEffect(() => l(!1), [a]), React.useEffect(() => {
    if (!d) return;
    const b = document.body.style.overflow;
    return document.body.style.overflow = "hidden", () => {
      document.body.style.overflow = b;
    };
  }, [d]);
  const C = () => l(!1),
    D = b => <AppLink to={`/${f}${m}`} onClick={C} className={`mc-nav__lang mc-nav__lang--${b}`} aria-label={`Switch language to ${f.toUpperCase()}`}>{i.toUpperCase()}</AppLink>;
  return <nav className={`mc-nav${s ? " mc-nav--scrolled" : ""}${h || d ? " mc-nav--on-yellow" : ""}${d ? " mc-nav--menu-open" : ""}`} aria-label="Primary"><div className="mc-nav__bar"><AppLink to={`/${i}`} onClick={C} className="mc-nav__logo" aria-label="Studio MACACO — home"><img src={LOGO_YELLOW_SRC} alt="Studio MACACO" width="393" height="44" /></AppLink><div className="mc-nav__links">{qt.map((b, _) => <AppLink to={`/${i}${b.to}`} isActive={A(b.to)} className={({
          isActive: L
        }) => `mc-nav__link${L ? " is-active" : ""}`} key={b.to}><span className="mc-nav__num">{String(_ + 1).padStart(2, "0")}</span><span className="mc-nav__label">{o(b.key)}</span><span className="mc-nav__ul" /></AppLink>)}</div><div className="mc-nav__actions">{D("bar")}<button type="button" className={`mc-nav__toggle${d ? " is-open" : ""}`} aria-label={d ? "Close menu" : "Open menu"} aria-expanded={d} aria-controls="mc-nav-panel" onClick={() => l(b => !b)}><span /><span /><span /></button></div></div><div className={`mc-nav__overlay${d ? " is-open" : ""}`} id="mc-nav-panel"><div className="mc-nav__overlay-inner"><section className="mc-nav__group" style={{
          "--i": 0
        }}><h2 className="mc-nav__group-label">{o("nav.menu", "Menu")}<span className="mc-nav__rule" aria-hidden="true" /></h2><div className="mc-nav__overlay-links">{qt.map((b, _) => <AppLink to={`/${i}${b.to}`} isActive={A(b.to)} onClick={C} className={({
              isActive: L
            }) => `mc-nav__overlay-link${L ? " is-active" : ""}`} style={{
              "--i": _
            }} key={b.to}><span className="mc-nav__overlay-idx">{String(_ + 1).padStart(2, "0")}</span><span className="mc-nav__overlay-label">{o(b.key)}</span></AppLink>)}</div></section><section className="mc-nav__group" style={{
          "--i": 4
        }}><h2 className="mc-nav__group-label">{o("footer.social", "Social")}<span className="mc-nav__rule" aria-hidden="true" /></h2><div className="mc-nav__group-row">{Er.map(b => <a className="mc-nav__meta-link" href={b.href} target="_blank" rel="noreferrer" onClick={C} key={b.key}>{b.label}</a>)}</div></section><section className="mc-nav__group" style={{
          "--i": 5
        }}><h2 className="mc-nav__group-label">{o("footer.contacts", "Contacts")}<span className="mc-nav__rule" aria-hidden="true" /></h2><div className="mc-nav__group-row mc-nav__group-row--stack"><span><b>{"E."}</b>{" "}<a className="mc-nav__meta-link" href={`mailto:${Wt}`} onClick={C}>{Wt}</a></span><span><b>{"P."}</b>{" "}<a className="mc-nav__meta-link" href={`tel:${Ht.replace(/s/g, "")}`} onClick={C}>{Ht}</a></span></div></section></div></div></nav>;
}
export { AppLink, NavBar };
