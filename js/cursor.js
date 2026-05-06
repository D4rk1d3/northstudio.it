/**
 * cursor.js
 * Custom cursor — solo su dispositivi con puntatore fine (desktop/hover).
 * Su touch/mobile non viene inizializzato e il cursore di sistema rimane attivo.
 */
(function () {
  // Esegui solo su dispositivi con puntatore preciso (no touch)
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let mX = 0, mY = 0, cX = 0, cY = 0;

  // Segui il mouse
  document.addEventListener('mousemove', function (e) {
    mX = e.clientX;
    mY = e.clientY;
  });

  // Nascondi quando il mouse esce dalla finestra
  document.addEventListener('mouseleave', function () {
    cursor.style.opacity = '0';
  });

  // Mostra quando il mouse rientra
  document.addEventListener('mouseenter', function () {
    cursor.style.opacity = '1';
  });

  // Stato hover su link e bottoni
  function addHoverListeners() {
    document.querySelectorAll('a, button, [role="button"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); });
    });
  }
  addHoverListeners();

  // Re-applica i listener se vengono aggiunti elementi dinamicamente (es. cookie banner)
  if (typeof MutationObserver !== 'undefined') {
    var mo = new MutationObserver(addHoverListeners);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // Loop fluido con lerp (smoothing 0.4 come nella vecchia versione)
  (function loop() {
    cX += (mX - cX) * 0.4;
    cY += (mY - cY) * 0.4;
    cursor.style.left = cX + 'px';
    cursor.style.top = cY + 'px';
    requestAnimationFrame(loop);
  })();
})();