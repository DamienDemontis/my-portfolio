/** Keep the URL in sync with the selected language so shared links preserve
 *  locale and analytics can distinguish per-locale pageviews. */
export function syncLangUrl(lang: 'en' | 'fr' | 'ko') {
  const url = new URL(window.location.href);
  if (lang === 'en') url.searchParams.delete('lng');
  else url.searchParams.set('lng', lang);
  const next = url.pathname + (url.search ? url.search : '') + url.hash;
  window.history.replaceState(null, '', next);
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.('event', 'page_view', {
    page_location: url.href,
    page_path: url.pathname + url.search,
    page_title: document.title,
    language: lang,
  });
}
