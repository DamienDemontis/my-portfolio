// GA4, charge seulement apres consentement (callback iubenda dans index.html).
function mr(e) {
  return e === "localhost" || e === "127.0.0.1" || e === "[::1]" || e === "::1" || e === "" || e.endsWith(".local") || /^192\.168\./.test(e) || /^10\./.test(e) || /^172\.(1[6-9]|2\d|3[01])\./.test(e);
}
function bi() {
  return typeof window > "u" ? !1 : !mr(window.location.hostname);
}
const gr = "e62ec4a4aa4555220b6f453c0fee882d";
const hr = "https://tracker.metricool.com/resources/be.js";
let Ft = !1;
function fr() {
  if (Ft || typeof window > "u" || !bi()) return;
  Ft = !0;
  const e = document.createElement("script");
  e.async = !0, e.src = hr, e.onload = () => {
    window.beTracker && window.beTracker.t({
      hash: gr
    });
  }, document.head.appendChild(e);
}
const yi = "G-DMV02V7X2W";
const vr = `https://www.googletagmanager.com/gtag/js?id=${yi}`;
let et = !1;
function ye() {
  window.dataLayer = window.dataLayer || [], window.dataLayer.push(arguments);
}
function Vt() {
  if (et || typeof window > "u" || !bi()) return;
  et = !0, ye("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  }), ye("consent", "update", {
    analytics_storage: "granted"
  });
  const e = document.createElement("script");
  e.async = !0, e.src = vr, document.head.appendChild(e), ye("js", new Date()), ye("config", yi, {
    send_page_view: !1
  }), trackPageView(window.location.pathname + window.location.search), fr();
}
function trackPageView(e) {
  et && ye("event", "page_view", {
    page_path: e,
    page_location: window.location.href,
    page_title: document.title
  });
}
typeof window < "u" && (window.macacoStartAnalytics = Vt, window.macacoAnalyticsConsent && Vt());
export { trackPageView };
