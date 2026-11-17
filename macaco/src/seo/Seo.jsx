// Titres, metas, hreflang, Open Graph et JSON-LD injectes au runtime.
import React from "react";
import { SITE } from "../content/site.js";
import i18next from "i18next";
import { DEFAULT_LANGUAGE } from "../i18n/index.js";
import { buildMeta, hreflangs, personLd } from "./meta.js";
const xe = SITE.url;
const Sr = "summary";
function B(e = "/") {
  return /^https?:\/\//i.test(e) ? e : `${xe}${e.startsWith("/") ? e : `/${e}`}`;
}
// Pages d'erreur ; l'accueil vient des locales (seo.title / seo.description).
const Yt = {
  fr: {
    notFound: {
      title: "Page introuvable — Damien Demontis",
      description: "La page demandée n’existe pas ou a été déplacée.",
      heading: "Page introuvable"
    },
    nav: {
      home: "Accueil"
    }
  },
  en: {
    notFound: {
      title: "Page not found — Damien Demontis",
      description: "The page you requested does not exist or has been moved.",
      heading: "Page not found"
    },
    nav: {
      home: "Home"
    }
  },
  ko: {
    notFound: {
      title: "페이지를 찾을 수 없습니다 — Damien Demontis",
      description: "요청하신 페이지가 존재하지 않거나 이동되었습니다.",
      heading: "페이지를 찾을 수 없습니다"
    },
    nav: {
      home: "홈"
    }
  }
};
function seoCopyFor(e) {
  return Yt[e] ?? Yt[DEFAULT_LANGUAGE];
}
function pe(e, i = "") {
  const a = i.replace(/^\/+/, "");
  return a ? `/${e}/${a}` : `/${e}`;
}
function metaFor(e) {
  const l = i18next.getResourceBundle(e, "common") ? e : DEFAULT_LANGUAGE;
  return buildMeta(l, i18next.getResourceBundle(l, "common"));
}
// Titre et description de l'accueil : locales, via meta.js (comme le prerendu).
function homeMeta(e) {
  const m = metaFor(e);
  return {
    title: m.title,
    description: m.description,
    heading: SITE.name
  };
}
function buildSeoData({
  lang: e = DEFAULT_LANGUAGE,
  kind: i = "home"
} = {}) {
  const d = i === "notFound" ? "notFound" : "home",
    h = d === "home" ? homeMeta(e) : seoCopyFor(e)[d];
  return {
    lang: e,
    localeTag: metaFor(e).ogLocale,
    siteName: SITE.name,
    type: "website",
    kind: d,
    subpath: "",
    path: pe(e),
    canonical: B(pe(e)),
    alternates: d === "notFound" ? [] : hreflangs(),
    robots: d === "notFound" ? "noindex,follow" : "index,follow,max-image-preview:large",
    title: h.title,
    description: h.description,
    heading: h.heading,
    bodyText: h.description
  };
}
const Ge = `${xe}/#person`;
const gt = `${xe}/#website`;
function dn() {
  return {
    "@type": "Person",
    "@id": Ge,
    ...personLd()
  };
}
function pn(e) {
  return {
    "@type": "WebSite",
    "@id": gt,
    url: xe,
    name: SITE.name,
    inLanguage: e,
    publisher: {
      "@id": Ge
    }
  };
}
function hn(e) {
  return {
    "@type": "WebPage",
    "@id": `${B(e.path)}#webpage`,
    url: B(e.path),
    name: e.title,
    description: e.description,
    inLanguage: e.lang,
    isPartOf: {
      "@id": gt
    },
    about: {
      "@id": Ge
    }
  };
}
function fn(e) {
  return {
    "@context": "https://schema.org",
    "@graph": [dn(), pn(e.lang), hn(e)]
  };
}
function vn(e) {
  return JSON.stringify(fn(e)).replaceAll("</", "<\\/");
}
const Xt = "[data-seo]";
function De(e, i, a, o) {
  const s = `${e}[${i}="${CSS.escape(a)}"][data-seo]`,
    n = document.head.querySelector(s);
  if (o == null) {
    n == null || n.remove();
    return;
  }
  const d = n ?? document.createElement(e);
  n || (d.setAttribute("data-seo", ""), d.setAttribute(i, a), document.head.appendChild(d)), d.setAttribute(e === "link" ? "href" : "content", o);
}
function bn(e) {
  document.title = e.title, document.documentElement.lang = e.lang, document.head.querySelectorAll(`link[rel="alternate"]${Xt}, script[type="application/ld+json"]${Xt}`).forEach(s => s.remove());
  const i = {
    description: e.description,
    robots: e.robots,
    "twitter:card": Sr,
    "twitter:title": e.title,
    "twitter:description": e.description
  };
  for (const [s, n] of Object.entries(i)) De("meta", "name", s, n);
  const a = {
    "og:type": e.type,
    "og:site_name": e.siteName,
    "og:title": e.title,
    "og:description": e.description,
    "og:url": e.canonical,
    "og:locale": e.localeTag
  };
  for (const [s, n] of Object.entries(a)) De("meta", "property", s, n);
  De("link", "rel", "canonical", e.canonical);
  for (const s of e.alternates) {
    const n = document.createElement("link");
    n.setAttribute("data-seo", ""), n.setAttribute("rel", "alternate"), n.setAttribute("hreflang", s.hreflang), n.setAttribute("href", s.href), document.head.appendChild(n);
  }
  const o = document.createElement("script");
  o.setAttribute("data-seo", ""), o.type = "application/ld+json", o.textContent = vn(e), document.head.appendChild(o);
}
function UseSeo({
  lang: e,
  kind: i
}) {
  return React.useEffect(() => {
    bn(buildSeoData({
      lang: e,
      kind: i
    }));
  }, [e, i]), null;
}
const NOT_FOUND_PAGE_STYLE = {
  minHeight: "100svh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  background: "#0a0a0a",
  color: "#fff",
  font: "400 14px/1.6 var(--font-body)",
  textAlign: "center",
  padding: "var(--nav-offset, 96px) 24px 24px"
};
const NOT_FOUND_TITLE_STYLE = {
  font: "400 clamp(56px,14vw,140px)/1 var(--font-display)",
  letterSpacing: "0.06em",
  color: "var(--cuivre)",
  margin: 0
};
const NOT_FOUND_LINK_STYLE = {
  color: "#0a0a0a",
  background: "var(--cuivre)",
  padding: "10px 18px",
  textDecoration: "none",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginTop: "8px"
};
export { NOT_FOUND_LINK_STYLE, NOT_FOUND_PAGE_STYLE, NOT_FOUND_TITLE_STYLE, UseSeo, buildSeoData, seoCopyFor };
