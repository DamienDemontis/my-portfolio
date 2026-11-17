// Exécute callback après l'événement load puis un créneau d'inactivité,
// pour que le LCP reste le titre et non le canvas 3D.
// Renvoie cancel(), qui retire l'écouteur et annule toute attente.
export function afterLoad(callback, { timeout = 2000 } = {}) {
  let annule = false;
  let idleId = null;
  let timerId = null;

  const lancer = () => {
    if (annule) return;
    const appeler = () => {
      idleId = null;
      timerId = null;
      if (!annule) callback();
    };
    if (typeof requestIdleCallback === 'function') {
      idleId = requestIdleCallback(appeler, { timeout });
    } else {
      timerId = setTimeout(appeler, 200);
    }
  };

  const enCours = document.readyState !== 'complete';
  if (enCours) {
    window.addEventListener('load', lancer, { once: true });
  } else {
    lancer();
  }

  return () => {
    annule = true;
    window.removeEventListener('load', lancer);
    if (idleId !== null && typeof cancelIdleCallback === 'function') cancelIdleCallback(idleId);
    if (timerId !== null) clearTimeout(timerId);
    idleId = null;
    timerId = null;
  };
}
