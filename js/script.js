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

// ===== Revelado al hacer scroll (tarjetas, stats, encabezados de sección) =====
(function scrollReveal() {
  const REVEAL_SELECTOR = [
    '.feature-card',
    '.team-card',
    '.grid-cards .card',
    '.dj-card',
    '.stat',
    '.stats-about',
    '.section .eyebrow',
    '.section .section-title',
    '.section .section-text'
  ].join(', ');

  const items = document.querySelectorAll(REVEAL_SELECTOR);
  if (!items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sin soporte de IntersectionObserver o con "reducir movimiento" activado:
  // se muestra todo de inmediato, sin animación, para no dejar contenido invisible.
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  // Escalonado sutil por grupo de 6 elementos (para que las cuadrículas no
  // tarden demasiado en aparecer completas), agrupado por elemento padre.
  const counter = {};
  items.forEach(el => {
    const key = el.parentElement ? el.parentElement.className || 'root' : 'root';
    counter[key] = (counter[key] || 0);
    const delayStep = counter[key] % 6;
    el.style.setProperty('--reveal-delay', `${delayStep * 70}ms`);
    counter[key]++;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => revealObserver.observe(el));
})();

// ===== Contador animado en las estadísticas (10K+, 50+, 24/7, 100%) =====
(function animateStats() {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return; // se deja el valor final tal cual está en el HTML

  function animateCount(el) {
    const original = el.textContent.trim();
    const match = original.match(/^(\d+)(.*)$/); // separa el número inicial del resto (K+, %, /7...)
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = original; // asegura el valor exacto al final
      }
    }
    requestAnimationFrame(tick);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNums.forEach(el => statObserver.observe(el));
})();
