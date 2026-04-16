import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SITE_URL = 'https://www.demontis.dev';
const OG_IMAGE = `${SITE_URL}/og-card.png`;

const OG_LOCALE: Record<string, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  ko: 'ko_KR',
};

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLinkCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function canonicalFor(lang: string): string {
  return lang === 'en' ? `${SITE_URL}/` : `${SITE_URL}/?lng=${lang}`;
}

export default function SEO() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const title = t('seo.title');
  const description = t('seo.description');
  const keywords = t('seo.keywords');
  const ogAlt = t('seo.ogAlt');
  const ogLocale = OG_LOCALE[lang] ?? 'en_US';
  const canonical = canonicalFor(lang);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.title = title;

    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[name="keywords"]', 'name', 'keywords', keywords);

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', ogLocale);
    upsertMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', ogAlt);

    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', ogAlt);

    upsertLinkCanonical(canonical);
  }, [lang, title, description, keywords, ogAlt, ogLocale, canonical]);

  // Inject per-locale ProfilePage JSON-LD to complement the static Person/WebSite in index.html
  useEffect(() => {
    const scriptId = 'ld-profile-localized';
    let el = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = scriptId;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    const json = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${canonical}#profile-${lang}`,
      url: canonical,
      name: title,
      description,
      inLanguage: lang,
      about: { '@id': `${SITE_URL}/#damien` },
      mainEntity: { '@id': `${SITE_URL}/#damien` },
      image: OG_IMAGE,
    };
    el.textContent = JSON.stringify(json);
    return () => {
      // Keep on unmount — SPA lifetime equals page lifetime.
    };
  }, [lang, title, description, canonical]);

  return null;
}
