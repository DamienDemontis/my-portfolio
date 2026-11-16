// Titres, metas, hreflang, Open Graph et JSON-LD injectes au runtime.
import { caseHistories } from "../content/caseHistories.js";
import React from "react";
import { Routes } from "react-router-dom";
import { SITE } from "../content/site.js";
import { DEFAULT_LANGUAGE, LANGUAGES } from "../i18n/index.js";
import { FEATURED_SLUGS, STUDIO_NAME } from "../lib/shared.js";
const xe = "https://studiomacaco.ch";
const yr = !0;
const Ai = {
  it: "it-CH",
  en: "en"
};
const wr = "/general/og-default.jpg";
const Ar = 1200;
const xr = 630;
function Cr(e) {
  return `/og/${e}.jpg`;
}
const Sr = "summary_large_image";
function B(e = "/") {
  return /^https?:\/\//i.test(e) ? e : `${xe}${e.startsWith("/") ? e : `/${e}`}`;
}
const caseList = caseHistories;
const tn = e => e === "it" ? "it" : "en";
function an(e) {
  return (Array.isArray(e) ? e : [e]).map(a => typeof a == "string" ? a.trim() : "").filter(Boolean);
}
function je(e, i) {
  return Array.isArray(e) ? e.map(a => je(a, i)) : !e || typeof e != "object" ? e : "en" in e || "it" in e ? e[i] ?? e.en ?? e.it : Object.fromEntries(Object.entries(e).map(([a, o]) => [a, je(o, i)]));
}
function localizeCase(e, i) {
  const a = tn(i),
    {
      copy: o,
      ...s
    } = e;
  return {
    ...s,
    projectTypes: an(s.projectTypes ?? s.projectType),
    ...je(o, a),
    sections: je(s.sections, a)
  };
}
function getAllCases(e) {
  return caseList.map(i => localizeCase(i, e));
}
function getFeaturedCases(e) {
  const i = FEATURED_SLUGS.map(o => caseList.find(s => s.slug === o)).filter(Boolean);
  return (i.length ? i : caseList).map(o => localizeCase(o, e));
}
function getCaseBySlug(e, i) {
  const a = caseList.find(o => o.slug === e);
  return a ? localizeCase(a, i) : null;
}
function getAdjacentCase(e, i) {
  const a = caseList.findIndex(s => s.slug === e);
  if (a === -1) return null;
  const o = caseList[(a + 1) % caseList.length];
  return localizeCase(o, i);
}
const Yt = {
  it: {
    defaultImageAlt: "Robot e logo Studio MACACO su sfondo nero e giallo",
    home: {
      title: "Studio MACACO | Studio creativo ed esperienze interattive",
      description: "Studio creativo svizzero per brand, cultura e destinazioni. Direzione creativa, storytelling e tecnologia per giochi, installazioni ed esperienze interattive.",
      heading: "Studio MACACO — studio creativo per esperienze interattive"
    },
    projects: {
      title: "Progetti ed esperienze interattive | Studio MACACO",
      description: "Esperienze di brand, installazioni culturali, giochi e mondi digitali: scopri i progetti di Studio MACACO tra direzione creativa, storytelling e tecnologia.",
      bodyText: "Esperienze di brand, installazioni culturali, giochi e avventure sul territorio. Idee che prendono forma attraverso direzione creativa, storytelling e tecnologia.",
      heading: "Progetti"
    },
    laboratory: {
      title: "Laboratorio: prototipi tra fisico e digitale | Studio MACACO",
      description: "Stampa 3D, taglio laser ed elettronica su misura: nel nostro laboratorio prototipiamo installazioni interattive dove il fisico incontra il digitale.",
      heading: "Laboratorio"
    },
    contact: {
      title: "Contatti | Studio MACACO",
      description: "Hai un’esperienza da immaginare? Contatta Studio MACACO, studio creativo svizzero per brand, istituzioni culturali e destinazioni, dal concept alla produzione.",
      bodyText: "Parlaci del tuo progetto. Studio MACACO — Ludens Sagl, Via Pestariso 5, 6982 Agno (Ticino, Svizzera).",
      heading: "Contatti"
    },
    notFound: {
      title: "Pagina non trovata — Studio MACACO",
      description: "La pagina richiesta non esiste o è stata spostata.",
      heading: "Pagina non trovata"
    },
    projectSuffix: "Case History",
    nav: {
      home: "Home",
      projects: "Progetti",
      laboratory: "Laboratorio",
      contact: "Contatti"
    },
    projectsListLabel: "Tutte le case history"
  },
  en: {
    defaultImageAlt: "Robot and Studio MACACO logo against a black and yellow background",
    home: {
      title: "Studio MACACO | Creative Studio & Interactive Experiences",
      description: "Swiss creative studio for brands, culture and destinations. Creative direction, storytelling and technology for games, installations and interactive experiences.",
      heading: "Studio MACACO — Creative Studio for Interactive Experiences"
    },
    projects: {
      title: "Projects & Interactive Experiences | Studio MACACO",
      description: "Explore brand experiences, cultural installations, games and digital worlds by Studio MACACO, combining creative direction, storytelling and technology.",
      bodyText: "Brand experiences, cultural installations, games and adventures through real places. Ideas brought to life through creative direction, storytelling and technology.",
      heading: "Projects"
    },
    laboratory: {
      title: "Laboratory: physical and digital prototyping | Studio MACACO",
      description: "3D printing, laser cutting and custom electronics: in our lab we prototype interactive installations where the physical meets the digital.",
      heading: "Laboratory"
    },
    contact: {
      title: "Contact | Studio MACACO",
      description: "Have an experience in mind? Contact Studio MACACO, a Swiss creative studio for brands, cultural institutions and destinations, from concept to production.",
      bodyText: "Tell us about your project. Studio MACACO — Ludens Sagl, Via Pestariso 5, 6982 Agno (Ticino, Switzerland).",
      heading: "Contact"
    },
    notFound: {
      title: "Page not found — Studio MACACO",
      description: "The page you requested does not exist or has been moved.",
      heading: "Page not found"
    },
    projectSuffix: "Case History",
    nav: {
      home: "Home",
      projects: "Projects",
      laboratory: "Laboratory",
      contact: "Contact"
    },
    projectsListLabel: "All case histories"
  }
};
function seoCopyFor(e) {
  return Yt[e] ?? Yt.it;
}
const rn = {
  "berco-supersize": {
    it: {
      title: "Berco Supersize — Esperienza di brand | Studio MACACO",
      description: "Un’esperienza di brand per lo stand Berco a Bauma 2025, realizzata con PoliedroStudio. Il gioco arcade coinvolge il pubblico nella scoperta dei prodotti."
    },
    en: {
      title: "Berco Supersize — Brand Experience | Studio MACACO",
      description: "A brand experience created with PoliedroStudio for Berco at Bauma 2025. Arcade gameplay invites the trade-show audience to explore industrial products."
    }
  },
  "digitart-3d-giulia-caffo": {
    it: {
      title: "Digiart 3D: Giulia Caffo — Esperienza museale",
      description: "La storia di Giulia Caffo incontra le ceramiche del Museo Giuseppe Roi: tavoli touch, esplorazione 3D e riproduzioni tattili."
    },
    en: {
      title: "Digiart 3D: Giulia Caffo — Museum Experience | Studio MACACO",
      description: "Giulia Caffo’s story meets the Giuseppe Roi Ceramics Museum collection through touch tables, 3D exploration and tactile reproductions."
    }
  },
  "segui-il-tubo": {
    it: {
      title: "Segui il Tubo — Giochi web educativi | Studio MACACO",
      description: "Due giochi web per CDALED raccontano il viaggio dell’acqua e spiegano cosa non gettare nel WC, tra azioni quotidiane e scoperta della depurazione."
    },
    en: {
      title: "Segui il Tubo — Educational Web Games | Studio MACACO",
      description: "Two web games for CDALED follow the journey of water and explain what must not be flushed, connecting everyday actions with wastewater treatment."
    }
  },
  pastawar: {
    it: {
      title: "PastaWar — Arte generativa | Studio MACACO",
      description: "8.333 Pasta Warrior, una collezione NFT e un configuratore web. Un esperimento interno tra arte generativa, identità visiva e personalizzazione."
    },
    en: {
      title: "PastaWar — Generative Art | Studio MACACO",
      description: "8,333 Pasta Warriors, an NFT collection and a web customiser. An in-house experiment in generative art, visual identity and personalisation."
    }
  },
  "kebhouze-the-game": {
    it: {
      title: "Kebhouze The Game — Art direction arcade | Studio MACACO",
      description: "La mascotte Keb diventa protagonista di un runner arcade. Personaggi, ambienti e art direction portano l’identità Kebhouze dentro il gioco."
    },
    en: {
      title: "Kebhouze The Game — Arcade Art Direction | Studio MACACO",
      description: "Keb, the Kebhouze mascot, steps into an arcade runner. Characters, environments and art direction turn the brand into a world to play in."
    }
  },
  mulm: {
    it: {
      title: "MULM — App per musei e territorio | Studio MACACO",
      description: "Dal San Gottardo al Museo della Scienza di Milano: un’app accompagna la scoperta di musei e luoghi attraverso racconti, itinerari e una guida virtuale."
    },
    en: {
      title: "MULM — Museums & Interactive Routes | Studio MACACO",
      description: "From the Gotthard to the Museum of Science in Milan, an app connects museums and places through stories, interactive routes and a virtual guide."
    }
  },
  "omicidio-sulla-centovallina": {
    it: {
      title: "Omicidio sulla Centovallina — Evento interattivo",
      description: "Un evento investigativo per RSI e Ferrovia Vigezzina-Centovalli: un’app, attori sul territorio e una finalissima dal vivo."
    },
    en: {
      title: "Omicidio sulla Centovallina — Interactive Event",
      description: "An investigative event for RSI and the Vigezzina-Centovalli railway, combining an app, actors along the route and a live grand final."
    }
  },
  "top-networker": {
    it: {
      title: "Top Networker — Networking interattivo | Studio MACACO",
      description: "Carte fisiche, QR personali e una classifica live: un’esperienza per Business Matching 2024 che invita a conoscere persone e scoprire gli espositori."
    },
    en: {
      title: "Top Networker — Interactive Networking | Studio MACACO",
      description: "Physical cards, personal QR codes and a live leaderboard: an experience for Business Matching 2024 that invites people to connect and discover exhibitors."
    }
  },
  "neko-music-video": {
    it: {
      title: "Neko Music Video — Videoclip 3D | Studio MACACO",
      description: "Videoclip musicali tra mondi onirici e fantascientifici, con l’artista ricostruito in 3D e una produzione interamente in game engine real-time."
    },
    en: {
      title: "Neko Music Video — Real-Time 3D | Studio MACACO",
      description: "Music videos set in dreamlike, science-fiction worlds, featuring a 3D version of the artist and produced entirely in a real-time game engine."
    }
  },
  "tesori-delle-vette-del-ceresio": {
    it: {
      title: "Tesori delle vette del Ceresio — App per il turismo",
      description: "Sei montagne del Ceresio collegate da una storia. Un’app per famiglie intreccia missioni, personaggi e illustrazioni con la scoperta dei luoghi."
    },
    en: {
      title: "Tesori delle vette del Ceresio — Tourism App",
      description: "Six Ceresio mountains connected by one story. A family app brings missions, characters and illustrations together with the discovery of real places."
    }
  },
  "tesori-della-valle-di-blenio": {
    it: {
      title: "Tesori della valle di Blenio — App e caccia al tesoro",
      description: "Una caccia al tesoro per famiglie nella Valle di Blenio, tra app mobile, mappa cartacea, monete da ricalcare e racconti illustrati del territorio."
    },
    en: {
      title: "Tesori della valle di Blenio — Family Treasure Hunt",
      description: "A family treasure hunt in the Blenio Valley, combining a mobile app, a paper map, coin rubbings and illustrated stories about the area."
    }
  },
  "tesori-di-brissago": {
    it: {
      title: "Tesori di Brissago — App per famiglie | Studio MACACO",
      description: "Un’app e una mappa cartacea guidano le famiglie tra gli indizi di Brissago. Dobloni reali e racconti illustrati collegano gioco e scoperta del territorio."
    },
    en: {
      title: "Tesori di Brissago — Family Tourism App | Studio MACACO",
      description: "An app and a paper map guide families through Brissago’s clues. Real doubloons and illustrated stories connect play with the discovery of local places."
    }
  },
  "segreti-del-lago": {
    it: {
      title: "I Segreti del Lago — Concept app turistica | Studio MACACO",
      description: "Un concept di app turistica per Brissago e Ronco sopra Ascona: informazioni, racconti e attività si incontrano in un concierge digitale."
    },
    en: {
      title: "I Segreti del Lago — Tourism App Concept | Studio MACACO",
      description: "A tourism app concept for Brissago and Ronco sopra Ascona, bringing information, stories and activities together in a digital concierge."
    }
  },
  "forest-jump": {
    it: {
      title: "Forest Jump — Art direction arcade | Studio MACACO",
      description: "Dal personaggio al cabinato, l’art direction di Forest Jump collega ambienti, branding e design della macchina in un’unica identità visiva."
    },
    en: {
      title: "Forest Jump — Arcade Art Direction | Studio MACACO",
      description: "From character to cabinet, Forest Jump’s art direction connects environments, branding and the physical machine through one visual identity."
    }
  },
  playstorming: {
    it: {
      title: "Playstorming — Piattaforma di ricerca | Studio MACACO",
      description: "Il concept di Elma Research prende forma in una piattaforma multiplayer su misura per ricerca qualitativa, sessioni collaborative e raccolta dati."
    },
    en: {
      title: "Playstorming — Custom Research Platform | Studio MACACO",
      description: "Elma Research’s concept takes shape as a custom multiplayer platform for qualitative research, collaborative sessions and data collection."
    }
  },
  "vivi-gambarogno": {
    it: {
      title: "Vivi Gambarogno — App e dashboard | Studio MACACO",
      description: "Luoghi, eventi e itinerari anche offline in un’app per esplorare il Gambarogno. Una dashboard permette al Comune di aggiornare i contenuti."
    },
    en: {
      title: "Vivi Gambarogno — Tourism App & Dashboard | Studio MACACO",
      description: "Places, events and offline routes in an app for exploring Gambarogno. A dashboard lets the municipality keep the content up to date."
    }
  },
  "la-selva": {
    it: {
      title: "La Selva — Assessment in VR | Studio MACACO",
      description: "Un percorso per PC e VR ispirato alla Divina Commedia. Scelte e situazioni narrative si collegano a una piattaforma di raccolta dati per l’assessment."
    },
    en: {
      title: "La Selva — Narrative VR Assessment | Studio MACACO",
      description: "A PC and VR journey inspired by the Divine Comedy. Choices and narrative situations connect with a data collection platform designed for assessment."
    }
  },
  "every-dei-at-work": {
    it: {
      title: "Every DEI at work — Concept di piattaforma DEI",
      description: "Un concept di piattaforma aziendale per la formazione DEI, con percorsi educativi, certificazioni e uno spazio dedicato alle segnalazioni."
    },
    en: {
      title: "Every DEI at work — DEI Platform Concept | Studio MACACO",
      description: "A corporate platform concept for DEI training, combining learning paths, certifications and a dedicated space for workplace reports."
    }
  },
  "cube-up": {
    it: {
      title: "Cube Up — Gioco mobile | Studio MACACO",
      description: "Un cubo da completare contro il tempo, livelli che cambiano con la musica e avatar da sbloccare. Un casual game per Android e iOS pubblicato nel 2017."
    },
    en: {
      title: "Cube Up — Mobile Game | Studio MACACO",
      description: "A cube to complete against the clock, levels that change with the music and avatars to unlock. A casual game released for Android and iOS in 2017."
    }
  },
  respect: {
    it: {
      title: "Respect — Serious game sul bullismo | Studio MACACO",
      description: "Un serious game in realtà virtuale sul bullismo. Scelte narrative volutamente limitate portano il giocatore a confrontarsi con le proprie azioni."
    },
    en: {
      title: "Respect — VR Bullying Awareness | Studio MACACO",
      description: "A virtual reality serious game about bullying. Deliberately limited narrative choices confront players with the consequences of their actions."
    }
  },
  "im-fading": {
    it: {
      title: "I'm Fading — Gioco sull’Alzheimer | Studio MACACO",
      description: "Un serious game dimostrativo sull’Alzheimer. Fotografie e ricordi da ricostruire raccontano la memoria e il rapporto tra una nonna e sua nipote."
    },
    en: {
      title: "I'm Fading — Alzheimer’s Awareness Game | Studio MACACO",
      description: "A demo serious game about Alzheimer’s, using photographs and memories to explore the relationship between a grandmother and her granddaughter."
    }
  },
  "the-black-cat": {
    it: {
      title: "The Black Cat — Videogioco narrativo | Studio MACACO",
      description: "Il Memory incontra Edgar Allan Poe in un videogioco sperimentale. Ricordi, errori e contrasti noir accompagnano la ricostruzione di una storia."
    },
    en: {
      title: "The Black Cat — Narrative Game | Studio MACACO",
      description: "A memory game meets Edgar Allan Poe in an experimental video game. Recollections, mistakes and noir contrasts drive the unravelling of a story."
    }
  },
  "become-this-way": {
    it: {
      title: "Become this way — Storia e character design | Studio MACACO",
      description: "Un robot aspirapolvere vuole diventare un pesce. Una storia originale sviluppata tra scrittura, character design, concept art e prototipazione."
    },
    en: {
      title: "Become this way — Story & Character Design | Studio MACACO",
      description: "A robot vacuum wants to become a fish. An original story developed through writing, character design, concept art and prototyping."
    }
  },
  aquatar: {
    it: {
      title: "Aquatar — Concierge AI in real time | Studio MACACO",
      description: "Un acquario 3D risponde alle richieste dell’utente. Un prototipo di concierge AI sviluppato con Artificialy per Abacus Research AG."
    },
    en: {
      title: "Aquatar — Real-Time AI Concierge | Studio MACACO",
      description: "A real-time 3D aquarium responds to user requests. An AI concierge prototype developed with Artificialy for Abacus Research AG."
    }
  },
  "bullying-vr": {
    it: {
      title: "Bullying VR — Esperienza educativa VR | Studio MACACO",
      description: "Bullo, vittima e spettatore: tre prospettive sullo stesso episodio. Un’esperienza educativa VR per Croce Rossa Svizzera Sottoceneri."
    },
    en: {
      title: "Bullying VR — Educational VR Experience | Studio MACACO",
      description: "Bully, victim and bystander: three perspectives on the same incident. An educational VR experience for the Swiss Red Cross Sottoceneri."
    }
  }
};
function nn(e, i) {
  var a;
  return ((a = rn[e]) == null ? void 0 : a[i]) ?? null;
}
function sn(e, i = 158) {
  const a = String(e ?? "").replace(/\s+/g, " ").trim();
  if (a.length <= i) return a;
  const o = a.slice(0, i - 1);
  return `${o.slice(0, o.lastIndexOf(" ")).trimEnd()}…`;
}
function Kt(e) {
  return Array.isArray(e) ? e.filter(Boolean).join(" ") : e ?? "";
}
function ln(e, i) {
  const a = typeof e.seoTag == "string" ? e.seoTag.trim() : "";
  if (a) return a;
  const o = String(e.category ?? "").split("/")[0].trim();
  return o && o.length <= 30 ? o : i.projectSuffix;
}
function cn(e, i) {
  const a = `${e.title} — ${ln(e, i)}`,
    o = `${a} | ${STUDIO_NAME}`;
  return o.length <= 60 ? o : a;
}
function pe(e, i = "") {
  const a = i.replace(/^\/+/, "");
  return a ? `/${e}/${a}` : `/${e}`;
}
function tt(e, i = null) {
  return i === "laboratory" ? !1 : e === DEFAULT_LANGUAGE || yr;
}
function Jt(e, i = null) {
  if (i === "laboratory") return [];
  const a = LANGUAGES.map(o => ({
    hreflang: Ai[o] ?? o,
    href: B(pe(o, e))
  }));
  return a.push({
    hreflang: "x-default",
    href: B(pe(DEFAULT_LANGUAGE, e))
  }), a;
}
function buildSeoData({
  lang: e = DEFAULT_LANGUAGE,
  kind: i = "home",
  slug: a = null
} = {}) {
  const o = seoCopyFor(e),
    s = Ai[e] ?? e,
    n = {
      lang: e,
      localeTag: s,
      siteName: STUDIO_NAME,
      type: "website",
      robots: tt(e) ? "index,follow,max-image-preview:large" : "noindex,follow",
      image: wr,
      imageAlt: o.defaultImageAlt
    };
  if (i === "project") {
    const c = a ? getCaseBySlug(a, e) : null;
    if (!c) return buildSeoData({
      lang: e,
      kind: "notFound"
    });
    const m = `projects/${c.slug}`,
      v = nn(c.slug, e),
      A = (v == null ? void 0 : v.description) ?? sn(Kt(c.intro) || Kt(c.excerpt));
    return {
      ...n,
      kind: i,
      subpath: m,
      path: pe(e, m),
      canonical: B(pe(e, m)),
      alternates: Jt(m),
      title: (v == null ? void 0 : v.title) ?? cn(c, o),
      description: A,
      heading: c.title,
      bodyText: A,
      type: "article",
      image: Cr(c.slug),
      imageAlt: `${c.title} — ${STUDIO_NAME}`,
      item: c
    };
  }
  const d = ["home", "projects", "laboratory", "contact", "notFound"].includes(i) ? i : "home",
    l = d === "home" || d === "notFound" ? "" : d,
    h = o[d];
  return {
    ...n,
    kind: d,
    subpath: l,
    path: pe(e, l),
    canonical: B(pe(e, l)),
    alternates: d === "notFound" ? [] : Jt(l, d),
    robots: d === "notFound" || !tt(e, d) ? "noindex,follow" : "index,follow,max-image-preview:large",
    title: h.title,
    description: h.description,
    heading: h.heading,
    bodyText: h.bodyText ?? h.description
  };
}
const Ge = `${xe}/#organization`;
const gt = `${xe}/#website`;
function dn(e) {
  const {
    address: i
  } = SITE;
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": Ge,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description[e] ?? SITE.description.it,
    url: xe,
    email: SITE.email,
    telephone: SITE.telephone,
    vatID: SITE.vatID,
    foundingDate: SITE.foundingDate,
    areaServed: SITE.areaServed,
    logo: {
      "@type": "ImageObject",
      url: B(SITE.logo)
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: SITE.email,
      telephone: SITE.telephone,
      availableLanguage: ["it", "en"],
      areaServed: SITE.areaServed
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: i.street,
      postalCode: i.postalCode,
      addressLocality: i.locality,
      addressRegion: i.region,
      addressCountry: i.country
    },
    ...(SITE.sameAs.length ? {
      sameAs: SITE.sameAs
    } : {})
  };
}
function pn(e) {
  return {
    "@type": "WebSite",
    "@id": gt,
    url: xe,
    name: STUDIO_NAME,
    inLanguage: e,
    publisher: {
      "@id": Ge
    }
  };
}
function un(e) {
  const i = seoCopyFor(e.lang),
    a = [{
      name: i.nav.home,
      path: `/${e.lang}`
    }];
  if (e.kind === "projects") a.push({
    name: i.nav.projects,
    path: `/${e.lang}/projects`
  });else if (e.kind === "project") a.push({
    name: i.nav.projects,
    path: `/${e.lang}/projects`
  }), a.push({
    name: e.heading,
    path: e.path
  });else if (e.kind === "laboratory" || e.kind === "contact") a.push({
    name: i.nav[e.kind],
    path: e.path
  });else return null;
  return {
    "@type": "BreadcrumbList",
    "@id": `${B(e.path)}#breadcrumb`,
    itemListElement: a.map((o, s) => ({
      "@type": "ListItem",
      position: s + 1,
      name: o.name,
      item: B(o.path)
    }))
  };
}
function mn(e) {
  const i = e.item;
  if (!(i != null && i.sections)) return [];
  const a = [],
    o = l => {
      if (Array.isArray(l)) return l.forEach(o);
      !l || typeof l != "object" || (typeof l.src == "string" && /\.(mp4|webm|mov)$/i.test(l.src) && a.push(l), Object.values(l).forEach(o));
    };
  o(i.sections);
  const s = new Set(),
    n = new Set(),
    d = (l, h) => {
      const c = l.title || l.alt;
      if (c && !n.has(c)) return n.add(c), c;
      const m = l.src.split("/").pop().replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      return c ? `${c} — ${m}` : `${i.title} — video ${h + 1}`;
    };
  return a.filter(l => !s.has(l.src) && s.add(l.src)).map((l, h) => ({
    "@type": "VideoObject",
    "@id": `${B(e.path)}#video-${h + 1}`,
    name: d(l, h),
    description: e.description,
    contentUrl: B(l.src),
    thumbnailUrl: B(l.poster || i.image),
    uploadDate: i.year ? `${i.year}-01-01` : void 0,
    isPartOf: {
      "@id": B(e.path)
    }
  }));
}
function gn(e) {
  var a, o;
  const i = e.item;
  return i ? {
    "@type": "CreativeWork",
    "@id": B(e.path),
    url: B(e.path),
    name: i.title,
    headline: i.title,
    description: e.description,
    inLanguage: e.lang,
    image: B(i.image),
    ...(i.year ? {
      dateCreated: String(i.year)
    } : {}),
    ...(i.category ? {
      genre: i.category
    } : {}),
    ...((a = i.projectTypes) != null && a.length ? {
      keywords: i.projectTypes.join(", ")
    } : {}),
    ...((o = i.capabilities) != null && o.length ? {
      about: i.capabilities
    } : {}),
    creator: {
      "@id": Ge
    },
    ...(i.customer ? {
      sourceOrganization: {
        "@type": "Organization",
        name: i.customer
      }
    } : {}),
    isPartOf: {
      "@id": gt
    }
  } : null;
}
function hn(e) {
  return {
    "@type": e.kind === "project" ? "ItemPage" : "WebPage",
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
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: B(e.image)
    }
  };
}
function fn(e) {
  const i = [dn(e.lang), pn(e.lang), hn(e)],
    a = un(e);
  if (a && i.push(a), e.kind === "project") {
    const o = gn(e);
    o && i.push(o), i.push(...mn(e));
  }
  return {
    "@context": "https://schema.org",
    "@graph": i
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
    "twitter:description": e.description,
    "twitter:image": B(e.image),
    "twitter:image:alt": e.imageAlt
  };
  for (const [s, n] of Object.entries(i)) De("meta", "name", s, n);
  const a = {
    "og:type": e.type,
    "og:site_name": e.siteName,
    "og:title": e.title,
    "og:description": e.description,
    "og:url": e.canonical,
    "og:locale": e.localeTag.replace("-", "_"),
    "og:image": B(e.image),
    "og:image:alt": e.imageAlt,
    "og:image:type": "image/jpeg",
    "og:image:width": String(Ar),
    "og:image:height": String(xr)
  };
  for (const [s, n] of Object.entries(a)) De("meta", "property", s, n);
  if (De("link", "rel", "canonical", e.canonical), De("link", "rel", "describedby", B("/llms.txt")), tt(e.lang, e.kind) && e.kind !== "notFound") {
    const s = document.createElement("link");
    s.setAttribute("data-seo", ""), s.rel = "alternate", s.type = "text/markdown", s.href = B(`${e.path}/index.md`), document.head.appendChild(s);
  }
  for (const s of e.alternates) {
    const n = document.createElement("link");
    n.setAttribute("data-seo", ""), n.setAttribute("rel", "alternate"), n.setAttribute("hreflang", s.hreflang), n.setAttribute("href", s.href), document.head.appendChild(n);
  }
  const o = document.createElement("script");
  o.setAttribute("data-seo", ""), o.type = "application/ld+json", o.textContent = vn(e), document.head.appendChild(o);
}
function UseSeo({
  lang: e,
  kind: i,
  slug: a = null
}) {
  return React.useEffect(() => {
    bn(buildSeoData({
      lang: e,
      kind: i,
      slug: a
    }));
  }, [e, i, a]), null;
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
  font: '400 14px/1.6 "Roboto Mono", ui-monospace, monospace',
  textAlign: "center",
  padding: "var(--nav-offset, 96px) 24px 24px"
};
const NOT_FOUND_TITLE_STYLE = {
  font: '700 clamp(56px,14vw,140px)/1 "Syncopate", sans-serif',
  letterSpacing: "0.06em",
  color: "#FEFF00",
  margin: 0
};
const NOT_FOUND_LINK_STYLE = {
  color: "#0a0a0a",
  background: "#FEFF00",
  padding: "10px 18px",
  textDecoration: "none",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginTop: "8px"
};
export { NOT_FOUND_LINK_STYLE, NOT_FOUND_PAGE_STYLE, NOT_FOUND_TITLE_STYLE, UseSeo, buildSeoData, getAdjacentCase, getAllCases, getCaseBySlug, getFeaturedCases, seoCopyFor };
