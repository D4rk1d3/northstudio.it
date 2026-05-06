/**
 * Navigation
 * Gestisce la navigazione e gli effetti della navbar
 */

const nav = document.querySelector('nav');

if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Smooth scroll per i link interni
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
