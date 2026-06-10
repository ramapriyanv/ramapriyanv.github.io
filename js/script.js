// ============================================================
// Helpers
// ============================================================
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// Footer year
// ============================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// Scroll progress bar
// ============================================================
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
progressBar.setAttribute('aria-hidden', 'true');
document.body.appendChild(progressBar);

// ============================================================
// Back-to-top button
// ============================================================
const toTop = document.createElement('button');
toTop.className = 'back-to-top';
toTop.setAttribute('aria-label', 'Back to top');
toTop.innerHTML = "<i class='bx bx-up-arrow-alt'></i>";
toTop.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
);
document.body.appendChild(toTop);

// ============================================================
// Scroll spy + top bar behavior
// ============================================================
const navLinks = $$('.top-links a');
const sections = $$('main .section').filter(s => s.id);
const topbar = document.querySelector('.topbar');
let lastY = window.scrollY;
let lastActiveId = '';

function setActive(id) {
  navLinks.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
  );

  // keep the highlighted link visible in the scrollable mobile row
  if (id !== lastActiveId) {
    lastActiveId = id;
    const activeLink = document.querySelector(`.top-links a[href="#${id}"]`);
    if (activeLink) {
      const row = activeLink.parentElement;
      if (row.scrollWidth > row.clientWidth) {
        const target = activeLink.offsetLeft - (row.clientWidth - activeLink.offsetWidth) / 2;
        row.scrollTo({ left: Math.max(target, 0), behavior: 'smooth' });
      }
    }
  }
}

function onScroll() {
  const y = window.scrollY;

  // progress bar
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.setProperty('--p', max > 0 ? Math.min(y / max, 1) : 0);

  // scroll spy
  let current = sections[0]?.id || '';
  for (const sec of sections) {
    if (y >= sec.offsetTop - 220) current = sec.id;
  }
  if (max > 0 && y >= max - 2) current = sections[sections.length - 1]?.id || current;
  setActive(current);

  // back-to-top visibility
  toTop.classList.toggle('show', y > 600);

  // hide/show top bar on mobile based on scroll direction
  if (topbar) {
    const isMobile = window.matchMedia('(max-width: 880px)').matches;
    if (isMobile) {
      if (y > lastY && y - lastY > 4 && y > 120) topbar.classList.add('hide');
      else if (y < lastY && lastY - y > 4) topbar.classList.remove('hide');
    } else {
      topbar.classList.remove('hide');
    }
  }
  lastY = y;
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
document.addEventListener('DOMContentLoaded', onScroll);
onScroll();

// Immediate feedback when tapping nav links
navLinks.forEach(a => {
  a.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    a.classList.add('active');
  });
});

// ============================================================
// Staggered scroll-reveal
// ============================================================
const revealTargets = $$(
  '.hero-copy, .section-head, .about-img, .about-content, .skill-card, ' +
  '.timeline-flow .flow-title, .timeline-flow .item, .cert, .card, .footer'
);

if (!reducedMotion && 'IntersectionObserver' in window) {
  revealTargets.forEach(el => el.classList.add('reveal'));
  revealTargets.forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    const idx = Math.max(sibs.indexOf(el), 0);
    el.style.setProperty('--d', `${Math.min(idx, 6) * 90}ms`);
  });

  const reveal = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        reveal.unobserve(e.target);
        // Hand transform control back to hover effects once the
        // entrance animation has finished playing.
        const delay = parseInt(e.target.style.getPropertyValue('--d'), 10) || 0;
        setTimeout(() => e.target.classList.remove('reveal', 'in'), 750 + delay);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => reveal.observe(el));
}
