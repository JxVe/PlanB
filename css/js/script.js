// ===== Año en el footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Menú móvil =====
const navToggle = document.getElementById('navToggle');
const sidenav = document.getElementById('sidenav');
if (navToggle && sidenav) {
  navToggle.addEventListener('click', () => {
    const isOpen = sidenav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  sidenav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      sidenav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Sección activa en el menú (scroll) =====
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.sidenav a[href^="#"]');
if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.sidenav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => observer.observe(s));
}

// ===== Animación del título de la pestaña: "PLAN B" letra por letra =====
(function animateTitle() {
  const word = 'PLAN B';
  const reversed = word.split('').reverse().join('');
  const typeSpeed = 260;   // ms entre letras al escribir
  const eraseSpeed = 220;  // ms entre letras al borrar
  const holdFull = 1400;   // pausa con el nombre completo
  const holdEmpty = 500;   // pausa antes de reiniciar

  let i = 0;

  function typeForward() {
    if (i <= word.length) {
      document.title = word.slice(0, i) || 'Plan B';
      i++;
      setTimeout(typeForward, typeSpeed);
    } else {
      setTimeout(eraseBackward, holdFull);
    }
  }

  let j = 0;
  function eraseBackward() {
    if (j <= word.length) {
      document.title = word.slice(0, word.length - j) || '·';
      j++;
      setTimeout(eraseBackward, eraseSpeed);
    } else {
      i = 0; j = 0;
      setTimeout(typeForward, holdEmpty);
    }
  }

  typeForward();
})();

// ===== Bloqueo de copiado / selección / menú contextual =====
// Nota: esto evita el copiado casual, no es una medida de seguridad real
// (el código fuente sigue siendo visible en el navegador).
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('cut', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const blockedCombo = (e.ctrlKey || e.metaKey) && ['c', 'x', 'a', 'u', 's'].includes(e.key.toLowerCase());
  if (blockedCombo) e.preventDefault();
});
