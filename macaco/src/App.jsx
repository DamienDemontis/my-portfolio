// Routeur : redirection de langue, gabarit /:lang et pages en lazy.
import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Cursor } from "./components/Cursor.jsx";
import { NavBar } from "./components/Nav.jsx";
import { ReadingMode } from "./components/ReadingMode.jsx";
import { PageTransitionProvider } from "./components/PageTransition.jsx";
import { ScrollProgressBar } from "./components/ScrollProgress.jsx";
import { SiteDitherLayer } from "./components/SiteDither.jsx";
import { Intro } from "./components/intro/Intro.jsx";
import { config } from "./config.js";
import { detectBrowserLanguage, isSupportedLanguage } from "./i18n/index.js";
import { SCROLL_ROOT_ID, getScrollRoot, useTouchScroll } from "./lib/scroll.js";
import { NOT_FOUND_LINK_STYLE, NOT_FOUND_PAGE_STYLE, NOT_FOUND_TITLE_STYLE, UseSeo, seoCopyFor } from "./seo/Seo.jsx";
import { AccentProvider } from "./state/accent.jsx";
function NotFound() {
  const {
      lang: e
    } = useParams(),
    i = isSupportedLanguage(e) ? e : detectBrowserLanguage(),
    a = seoCopyFor(i);
  return <><UseSeo lang={i} kind="notFound" /><main style={NOT_FOUND_PAGE_STYLE}><h1 style={NOT_FOUND_TITLE_STYLE}>{"404"}</h1><p style={{
        opacity: 0.75,
        margin: 0
      }}>{a.notFound.heading}</p><a style={NOT_FOUND_LINK_STYLE} href={`/${i}`}>{a.nav.home}</a></main></>;
}
const Sn = ".intro-scroll-spacer, .mc-nav__overlay, input, textarea, select, [data-native-touch]";
function Tn() {
  return useTouchScroll(getScrollRoot, {
    getParams: () => ({
      maxPxPerSec: config.scroll.siteTouchMaxPxPerSec,
      friction: config.scroll.siteTouchFriction
    }),
    shouldIgnore: e => e instanceof Element && !!e.closest(Sn)
  }), null;
}
function LangLayout() {
  const {
      lang: e
    } = useParams(),
    i = useLocation(),
    {
      i18n: a
    } = useTranslation(),
    o = isSupportedLanguage(e);
  const reading = new URLSearchParams(i.search).get("lecture") === "1";
  if (React.useEffect(() => {
    document.documentElement.classList.toggle("is-reading", reading);
    return () => document.documentElement.classList.remove("is-reading");
  }, [reading]), React.useEffect(() => {
    o && (document.documentElement.lang = e, a.language !== e && a.changeLanguage(e));
  }, [o, e, a]), !o) return <NotFound />;
  const s = i.pathname.replace(/\/+$/, "") || `/${e}`,
    n = s === `/${e}`;
  if (reading) return <AccentProvider><div id={SCROLL_ROOT_ID} className="scroll-root reading-root"><div className="site-chrome"><NavBar isHome={!1} /></div><ReadingMode lang={e} /></div></AccentProvider>;
  return <PageTransitionProvider><AccentProvider><SiteDitherLayer active={!n} /><Cursor /><div id={SCROLL_ROOT_ID} className="scroll-root"><div className="site-chrome"><NavBar isHome={n} /><ScrollProgressBar /></div><Tn /><Intro active={n} /><React.Suspense fallback={null}><Outlet /></React.Suspense></div></AccentProvider></PageTransitionProvider>;
}
const HomePage = React.lazy(() => import("./pages/Home.jsx"));
function App() {
  return <BrowserRouter><Routes><Route path="/" element={<Navigate to={`/${detectBrowserLanguage()}`} replace={!0} />} /><Route path="/:lang" element={<LangLayout />}><Route index={!0} element={<HomePage />} /><Route path="*" element={<NotFound />} /></Route><Route path="*" element={<NotFound />} /></Routes></BrowserRouter>;
}
export { App };
