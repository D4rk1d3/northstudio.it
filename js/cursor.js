/**
 * Custom Cursor
 * Gestisce il cursore personalizzato
 */

const cursor = document.getElementById('cursor');

if (cursor) {
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animazione smooth del cursore
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Hover effect su link e button
  const hoverElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');

  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });
}
