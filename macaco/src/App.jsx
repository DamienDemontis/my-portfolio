// Routeur : redirection de langue, gabarit /:lang et pages en lazy.
import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Cursor } from "./components/Cursor.jsx";
import { NavBar } from "./components/Nav.jsx";
import { PageTransitionProvider } from "./components/PageTransition.jsx";
import { ScrollProgressBar } from "./components/ScrollProgress.jsx";
import { SiteDitherLayer } from "./components/SiteDither.jsx";
import { Intro } from "./components/intro/Intro.jsx";
import { config } from "./config.js";
import { trackPageView } from "./features/measure/measure.js";
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
const Sn = ".intro-scroll-spacer, .mc-nav__overlay, .pl-scroll, input, textarea, select, [data-native-touch]";
function Tn() {
  return useTouchScroll(getScrollRoot, {
    getParams: () => ({
      maxPxPerSec: config.scroll.siteTouchMaxPxPerSec,
      friction: config.scroll.siteTouchFriction
    }),
    shouldIgnore: e => e instanceof Element && !!e.closest(Sn)
  }), null;
}
const En = ["/projects"];
function LangLayout() {
  const {
      lang: e
    } = useParams(),
    i = useLocation(),
    {
      i18n: a
    } = useTranslation(),
    o = isSupportedLanguage(e);
  if (React.useEffect(() => {
    o && (document.documentElement.lang = e, a.language !== e && a.changeLanguage(e));
  }, [o, e, a]), React.useEffect(() => {
    o && trackPageView(i.pathname + i.search);
  }, [o, i.pathname, i.search]), !o) return <NotFound />;
  const s = i.pathname.replace(/\/+$/, "") || `/${e}`,
    n = s === `/${e}`,
    d = s.replace(`/${e}`, "") || "/",
    l = En.includes(d),
    h = d === "/laboratory";
  return <PageTransitionProvider><AccentProvider><SiteDitherLayer active={!n && !h} /><Cursor /><div id={SCROLL_ROOT_ID} className="scroll-root"><div className="site-chrome"><NavBar isHome={n} /><ScrollProgressBar enabled={!l} /></div><Tn /><Intro active={n} /><React.Suspense fallback={null}><Outlet /></React.Suspense></div></AccentProvider></PageTransitionProvider>;
}
const HomePage = React.lazy(() => import("./pages/Home.jsx"));
const ProjectsPage = React.lazy(() => import("./pages/Projects.jsx"));
const ProjectDetailPage = React.lazy(() => import("./pages/ProjectDetail.jsx"));
const LaboratoryPage = React.lazy(() => import("./pages/Laboratory.jsx"));
const ContactPage = React.lazy(() => import("./pages/Contact.jsx"));
const DevSectionsPage = React.lazy(() => import("./pages/DevSections.jsx"));
function App() {
  return <BrowserRouter><Routes><Route path="/" element={<Navigate to={`/${detectBrowserLanguage()}`} replace={!0} />} /><Route path="/dev/sections" element={<React.Suspense fallback={null}><DevSectionsPage /></React.Suspense>} /><Route path="/:lang" element={<LangLayout />}><Route index={!0} element={<HomePage />} /><Route path="projects" element={<ProjectsPage />} /><Route path="projects/:slug" element={<ProjectDetailPage />} /><Route path="laboratory" element={<LaboratoryPage />} /><Route path="contact" element={<ContactPage />} /><Route path="*" element={<NotFound />} /></Route><Route path="*" element={<NotFound />} /></Routes></BrowserRouter>;
}
export { App };
