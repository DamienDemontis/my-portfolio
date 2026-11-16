import '../styles/dev-sections.css'
import React from "react";
import { CaseSections } from "../components/case-detail/CaseSectionRenderer.jsx";
const o = {
    src: "/case/berco/berco-hero.webp",
    alt: "Berco interactive installation"
  },
  n = {
    src: "/case/aquatar-hero.webp",
    alt: "Aquatar interactive world"
  },
  s = "/case/video-test.mp4",
  l = "/home/homevertical.mp4",
  c = [{
    type: "splitIntro",
    component: "CaseSplitIntro",
    label: "Split intro",
    summary: "Titolo grande a sinistra, blocco di testo a destra.",
    description: "Il blocco narrativo del case study: un titolo in Syncopate colorato con l'accent del progetto affiancato da uno o piu paragrafi. E l'unica sezione fatta di solo testo, quindi e quella che scandisce i capitoli fra le sezioni visive. Su viewport strette titolo e testo vanno a capo uno sotto l'altro. Se mancano sia title che text la sezione non viene renderizzata.",
    props: [{
      name: "title",
      type: "string | {en, it}",
      required: !1,
      description: "Titolo del capitolo. Reso in maiuscolo dal CSS e colorato con l'accent del case study."
    }, {
      name: "text",
      type: "string | string[] | {en, it}",
      required: !1,
      description: "Corpo del testo. Passando un array si ottiene un <p> per elemento; larghezza massima 60ch."
    }],
    notes: ["L'array di paragrafi va localizzato come { en: ['...', '...'], it: ['...', '...'] }, non come array di oggetti {en, it}."],
    demo: {
      type: "splitIntro",
      title: "An experience to make you understand Berco",
      text: ["Studio MACACO is a Swiss creative studio designing and producing interactive experiences for brands, cultural institutions and destinations."]
    },
    snippet: `{
  type: 'splitIntro',
  title: {
    en: 'An experience to make you understand Berco',
    it: 'Un experience per farti capire Berco',
  },
  text: {
    en: 'Studio MACACO is a Swiss creative studio for interactive experiences...',
    it: 'Studio MACACO è uno studio creativo svizzero per esperienze interattive...',
  },
}`
  }, {
    type: "imageSingle",
    component: "CaseImageSingle",
    label: "Image single",
    summary: "Una sola immagine, a tutta larghezza della sezione.",
    description: "Il respiro fra due capitoli: una singola immagine che occupa l'intera colonna di contenuto. Da usare per il colpo d'occhio — il key visual, il frame piu forte del progetto — quando affiancarla ad altre la indebolirebbe. Caricamento lazy. Senza image.src la sezione non viene renderizzata.",
    props: [{
      name: "image",
      type: "{ src, alt }",
      required: !0,
      description: "src e obbligatorio; alt facoltativo (default stringa vuota, quindi immagine decorativa)."
    }],
    notes: [],
    demo: {
      type: "imageSingle",
      image: o
    },
    snippet: `{
  type: 'imageSingle',
  image: { src: '/case/berco/berco-hero.webp', alt: 'Berco Videogame' },
}`
  }, {
    type: "imageGrid",
    component: "CaseImageGrid",
    label: "Image grid",
    summary: "Da 1 a 4 immagini affiancate in una griglia statica.",
    description: "La galleria compatta: mostra piu frame insieme quando il valore sta nel confronto (schermate diverse, momenti diversi, varianti di uno stesso artefatto). Il layout cambia in base a quante immagini passi — la classe .case-image-grid--N segue il numero di elementi validi. Oltre la quarta immagine le altre vengono ignorate: se te ne servono di piu, usa imageCarousel.",
    props: [{
      name: "images",
      type: "[{ src, alt }]",
      required: !0,
      description: "Massimo 4. Gli elementi senza src vengono scartati prima del conteggio."
    }, {
      name: "ratio",
      type: "string (CSS aspect-ratio)",
      required: !1,
      description: "Forza il rapporto di tutte le celle, es. '4 / 3'. Omesso, vale il default del CSS."
    }],
    notes: ["Con 0 immagini valide la sezione non viene renderizzata."],
    demo: {
      type: "imageGrid",
      images: [o, n]
    },
    snippet: `{
  type: 'imageGrid',
  ratio: '4 / 3',
  images: [
    { src: '/case/berco/berco-hero.webp', alt: 'Berco interactive installation' },
    { src: '/case/aquatar-hero.webp', alt: 'Berco gameplay detail' },
  ],
}`
  }, {
    type: "imageCarousel",
    component: "CaseImageCarousel",
    label: "Image carousel",
    summary: "Slider di immagini navigabile con le frecce o trascinando.",
    description: "La galleria estesa: nessun limite al numero di slide, si scorre con le due frecce o trascinando con mouse/dito. Lo scorrimento e circolare (dopo l'ultima si torna alla prima). Il drag distingue il gesto orizzontale da quello verticale, cosi trascinare in diagonale non blocca lo scroll della pagina. Con una sola immagine i controlli spariscono.",
    props: [{
      name: "images",
      type: "[{ src, alt }]",
      required: !0,
      description: "Nessun limite. Gli elementi senza src vengono scartati."
    }, {
      name: "startIndex",
      type: "number",
      required: !1,
      description: "Slide attiva all'ingresso (default 0). Viene comunque limitata all'intervallo valido."
    }],
    notes: ["Le frecce arrivano da /general/carousel-arrow-left.svg e /general/carousel-arrow-right.svg."],
    demo: {
      type: "imageCarousel",
      images: [o, n, o]
    },
    snippet: `{
  type: 'imageCarousel',
  images: [
    { src: '/case/berco/berco-hero.webp', alt: 'Berco interactive installation' },
    { src: '/case/aquatar-hero.webp', alt: 'Aquatar interactive world' },
    { src: '/case/berco/berco-hero.webp', alt: 'Berco gameplay close-up' },
  ],
}`
  }, {
    type: "videoPlayer",
    component: "CaseVideoPlayer",
    label: "Video player",
    summary: "Un video con controlli completi: play, seek, volume, fullscreen.",
    description: "Il video che l'utente guarda deliberatamente — showreel, trailer, walkthrough. Ha i suoi controlli custom (barra di avanzamento, volume, tempo, fullscreen) e le scorciatoie da tastiera quando la sezione ha il focus: spazio/K play-pausa, M muto, F fullscreen, frecce laterali per +/-5s. Da fermo i controlli restano visibili; in riproduzione svaniscono dopo qualche secondo di inattivita e riappaiono al primo movimento. Il frame si adatta da solo ai video verticali, invece di ritagliarli nel box 16/9. Senza video.src la sezione non viene renderizzata.",
    props: [{
      name: "video.src",
      type: "string",
      required: !0,
      description: "Percorso del file video."
    }, {
      name: "video.poster",
      type: "string",
      required: !1,
      description: "Immagine mostrata prima del play."
    }, {
      name: "video.preload",
      type: "'none' | 'metadata' | 'auto'",
      required: !1,
      description: "Default 'metadata'."
    }, {
      name: "video.loop",
      type: "boolean",
      required: !1,
      description: "Riproduzione in loop."
    }, {
      name: "video.muted",
      type: "boolean",
      required: !1,
      description: "Parte muto (volume iniziale 0)."
    }, {
      name: "video.volume",
      type: "number 0-1",
      required: !1,
      description: "Volume iniziale se non muted (default 1)."
    }, {
      name: "video.ariaLabel",
      type: "string",
      required: !1,
      description: "Etichetta accessibile della sezione (default 'Project video player')."
    }, {
      name: "accent",
      type: "string (colore)",
      required: !1,
      description: "Sovrascrive --accent per questo player. Omesso, eredita l'accent del case study."
    }],
    notes: ["L'icona di play e un SVG inline nel componente: una prop playIcon nel file di contenuto viene ignorata."],
    demo: {
      type: "videoPlayer",
      video: {
        src: s,
        poster: "/case/aquatar-hero.webp",
        ariaLabel: "MACACO showreel",
        preload: "metadata"
      }
    },
    snippet: `{
  type: 'videoPlayer',
  video: {
    src: '/case/video-test.mp4',
    poster: '/case/aquatar-hero.webp',
    ariaLabel: 'MACACO showreel',
    preload: 'metadata',
  },
}`
  }, {
    type: "videoGrid",
    component: "CaseVideoGrid",
    label: "Video grid",
    summary: "Da 1 a 4 clip in loop, muti e senza controlli.",
    description: "L'equivalente in movimento di imageGrid: clip brevi che partono da sole, mute e in loop, come si guarda una vetrina. Nessun controllo — non sono video da guardare, sono immagini che si muovono. Il file viene scaricato solo quando la sezione si avvicina al viewport e la riproduzione si ferma quando esce; con prefers-reduced-motion attivo resta tutto fermo sul poster. Le clip verticali prendono il proprio rapporto, quelle orizzontali restano nel frame 16/9 condiviso cosi una riga mista resta allineata.",
    props: [{
      name: "videos",
      type: "[{ src, poster, ariaLabel }]",
      required: !0,
      description: "Massimo 4. Gli elementi senza src vengono scartati prima del conteggio."
    }, {
      name: "ratio",
      type: "string (CSS aspect-ratio)",
      required: !1,
      description: "Forza il rapporto di tutte le celle, es. '9 / 16', saltando la misurazione automatica."
    }],
    notes: ["Il poster e importante: e cio che si vede prima che il file venga scaricato e con reduced-motion."],
    demo: {
      type: "videoGrid",
      videos: [{
        src: s,
        poster: "/case/aquatar-hero.webp",
        ariaLabel: "Gameplay loop"
      }, {
        src: s,
        poster: "/case/berco/berco-hero.webp",
        ariaLabel: "Installation loop"
      }]
    },
    snippet: `{
  type: 'videoGrid',
  videos: [
    { src: '/case/video-test.mp4', poster: '/case/aquatar-hero.webp', ariaLabel: 'Gameplay loop' },
    { src: '/case/video-test.mp4', poster: '/case/berco/berco-hero.webp', ariaLabel: 'Installation loop' },
  ],
}`
  }, {
    type: "deviceShowcase",
    component: "CaseDeviceShowcase",
    label: "Device showcase",
    summary: "Una o due clip verticali dentro telefoni 3D che seguono il cursore.",
    description: "La sezione per le interfacce mobile: fino a due telefoni con dentro un video verticale ciascuno, che si inclinano verso il cursore. Il rendering 3D (three.js, caricato solo qui e solo quando serve) si attiva sopra gli 860px di larghezza, con puntatore di precisione, WebGL disponibile e reduced-motion disattivo; in tutti gli altri casi si vedono gli stessi video dentro cornici piatte in CSS. Le clip sono sempre mute, in loop, e si fermano quando la sezione esce dal viewport. Vuole video verticali: uno orizzontale dentro la cornice del telefono viene mostrato male.",
    props: [{
      name: "devices",
      type: "[{ src, poster, alt }]",
      required: !0,
      description: "Massimo 2. Gli elementi senza src vengono scartati."
    }, {
      name: "className",
      type: "string",
      required: !1,
      description: "Classe aggiuntiva sulla sezione, per aggiustamenti puntuali."
    }],
    notes: ["E la sezione piu costosa della pagina: una sola per case study, e solo quando i telefoni sono davvero il soggetto."],
    demo: {
      type: "deviceShowcase",
      devices: [{
        src: l,
        alt: "App home screen"
      }, {
        src: l,
        alt: "App gameplay screen"
      }]
    },
    snippet: `{
  type: 'deviceShowcase',
  devices: [
    { src: '/case/app-home.mp4', alt: 'App home screen' },
    { src: '/case/app-game.mp4', alt: 'App gameplay screen' },
  ],
}`
  }],
  u = "noindex, nofollow",
  v = "#feff00";
function g() {
  React.useEffect(() => {
    const a = document.createElement("meta");
    a.name = "robots", a.content = u, document.head.appendChild(a);
    const i = document.title;
    return document.title = "DEV // Case sections", () => {
      a.remove(), document.title = i;
    };
  }, []);
}
function DevCopy({
  text: a
}) {
  const [i, t] = React.useState(!1);
  React.useEffect(() => {
    if (!i) return;
    const p = window.setTimeout(() => t(!1), 1600);
    return () => window.clearTimeout(p);
  }, [i]);
  const d = async () => {
    try {
      await navigator.clipboard.writeText(a), t(!0);
    } catch {
      t(!1);
    }
  };
  return <button type="button" className="dev-copy" onClick={d}>{i ? "COPIATO" : "COPIA"}</button>;
}
function DevProps({
  props: a
}) {
  return a.length ? <table className="dev-props"><thead><tr><th>{"Prop"}</th><th>{"Tipo"}</th><th>{"Obbl."}</th><th>{"Descrizione"}</th></tr></thead><tbody>{a.map(i => <tr key={i.name}><td className="dev-props__name">{i.name}</td><td className="dev-props__type">{i.type}</td><td className="dev-props__req">{i.required ? "si" : "—"}</td><td>{i.description}</td></tr>)}</tbody></table> : null;
}
function DevEntry({
  entry: a
}) {
  return <article className="dev-entry" id={a.type}><header className="dev-entry__head"><div className="dev-entry__title"><h2>{a.label}</h2><code className="dev-entry__type">{"type: '"}{a.type}{"'"}</code></div><p className="dev-entry__summary">{a.summary}</p><p className="dev-entry__file">{"src/components/case-detail/"}{a.component}{".jsx"}</p></header><p className="dev-entry__description">{a.description}</p><DevProps props={a.props} />{!!a.notes.length && <ul className="dev-notes">{a.notes.map(i => <li key={i}>{i}</li>)}</ul>}<div className="dev-snippet"><div className="dev-snippet__bar"><span>{"Da incollare in `sections`"}</span><DevCopy text={a.snippet} /></div><pre><code>{a.snippet}</code></pre></div><div className="dev-preview"><span className="dev-preview__label">{"Anteprima"}</span><CaseSections sections={[a.demo]} /></div></article>;
}
function ScrollRoot() {
  return g(), <div className="scroll-root dev-page" style={{
    "--accent": v
  }}><header className="dev-header"><p className="dev-header__kicker">{"INTERNAL // NOT LINKED // NOINDEX"}</p><h1 className="dev-header__title">{"Case sections"}</h1><p className="dev-header__intro">{"Tutte le sezioni componibili di un case study. Ogni voce riporta il valore da usare come"}{" "}<code>{"type"}</code>{", le props accettate, uno snippet copiabile e un'anteprima dal vivo. Le sezioni si dichiarano nell'array "}<code>{"sections"}</code>{" del file del progetto in"}{" "}<code>{"src/content/case-histories/"}</code>{" e vengono renderizzate nell'ordine in cui compaiono."}</p><p className="dev-header__intro">{"Qualsiasi valore testuale puo essere scritto come "}<code>{"{ en, it }"}</code>{" a qualunque profondita: la localizzazione viene risolta ricorsivamente da"}{" "}<code>{"localizeCaseHistory"}</code>{" in "}<code>{"src/content/caseHistories.js"}</code>{". Un"}{" "}<code>{"type"}</code>{" non presente nel registry viene semplicemente ignorato in fase di render."}</p><p className="dev-header__intro">{"Oltre alle props elencate qui sotto, "}<strong>{"ogni"}</strong>{" sezione accetta"}{" "}<code>{"label"}</code>{": un titoletto opzionale stampato fra graffe sopra la sezione, anche questo localizzabile. Se non lo metti, non compare nulla e la sezione rende esattamente come prima."}</p><nav className="dev-toc">{c.map(a => <a href={`#${a.type}`} key={a.type}>{a.type}</a>)}</nav></header><main className="dev-list">{c.map(a => <DevEntry entry={a} key={a.type} />)}</main><footer className="dev-footer"><p>{"Registry delle sezioni: "}<code>{"src/components/case-detail/CaseSectionRenderer.jsx"}</code>{" — testi di questa pagina: "}<code>{"src/content/devSections.js"}</code>{". Aggiungendo un tipo nuovo al registry, aggiungi la sua voce anche qui."}</p></footer></div>;
}
export { ScrollRoot as default };
