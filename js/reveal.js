/**
 * Scroll Reveal
 * Gestisce le animazioni di reveal al scroll
 */

const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    observer.observe(el);
  });
}
