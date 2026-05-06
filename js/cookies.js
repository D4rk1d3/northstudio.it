/**
 * COOKIES.JS
 * Cookie banner functionality
 * Manages cookie consent and banner display
 */

function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const acceptBtn = banner.querySelector('.cookie-btn.accept');
  const rejectBtn = banner.querySelector('.cookie-btn.reject');
  const COOKIE_NAME = 'ns-cookie-consent';
  const COOKIE_DURATION = 365; // days

  // Check if user has already consented
  function hasCookieConsent() {
    const cookies = document.cookie.split(';');
    return cookies.some((cookie) =>
      cookie.trim().startsWith(COOKIE_NAME + '=')
    );
  }

  // Hide banner if consent already given
  if (hasCookieConsent()) {
    banner.classList.add('hidden');
  }

  // Set cookie
  function setCookie(value) {
    const date = new Date();
    date.setTime(date.getTime() + COOKIE_DURATION * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = COOKIE_NAME + '=' + value + ';' + expires + ';path=/';
  }

  // Accept cookies
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      setCookie('accepted');
      banner.classList.add('hidden');
      // Load analytics or other tracking scripts here
    });
  }

  // Reject cookies
  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      setCookie('rejected');
      banner.classList.add('hidden');
    });
  }
}

// Initialize cookie banner when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieBanner);
} else {
  initCookieBanner();
}
