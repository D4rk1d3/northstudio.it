/**
 * Cookie Banner
 * Gestisce il banner dei cookie
 */

const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');

if (cookieBanner && cookieAccept) {
  const cookieKey = 'north_cookies_accepted';

  // Controlla se i cookie sono già stati accettati
  if (localStorage.getItem(cookieKey)) {
    cookieBanner.style.display = 'none';
  } else {
    cookieBanner.style.display = 'flex';
  }

  // Gestisci il click su "Accetta"
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem(cookieKey, 'true');
    cookieBanner.style.display = 'none';
  });
}
