// Donnees SEO pures (aucun React, aucun JSON) : partagees par le runtime
// (Seo.jsx) et par le prerendu Node (scripts/prerender.mjs).
import { SITE } from '../content/site.js'

export const SEO_LANGUAGES = ['fr', 'en', 'ko']
export const SEO_DEFAULT_LANGUAGE = 'en'

const OG_LOCALES = { fr: 'fr_FR', en: 'en_GB', ko: 'ko_KR' }

export const absoluteUrl = (path = '/') =>
  /^https?:\/\//i.test(path) ? path : `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`

export function hreflangs() {
  const list = SEO_LANGUAGES.map(l => ({ hreflang: l, href: absoluteUrl(`/${l}`) }))
  list.push({ hreflang: 'x-default', href: absoluteUrl(`/${SEO_DEFAULT_LANGUAGE}`) })
  return list
}

export function personLd() {
  return {
    '@type': 'Person',
    name: SITE.name,
    url: SITE.url,
    sameAs: SITE.sameAs,
    knowsAbout: ['WebGL', 'Three.js', 'React', 'Vue.js', 'Node.js', 'TypeScript', 'Unity', 'Real-time 3D', 'LLM', 'RAG', 'Health tech'],
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'EPITECH' },
    worksFor: { '@type': 'Organization', name: 'PandaLab' },
  }
}

// locale : l'objet JSON de la langue (cles `seo.title`, `seo.description`).
export function buildMeta(lang, locale) {
  return {
    lang,
    title: locale.seo.title,
    description: locale.seo.description,
    canonical: absoluteUrl(`/${lang}`),
    alternates: hreflangs(),
    ogLocale: OG_LOCALES[lang] ?? OG_LOCALES[SEO_DEFAULT_LANGUAGE],
    jsonLd: { '@context': 'https://schema.org', ...personLd() },
  }
}
