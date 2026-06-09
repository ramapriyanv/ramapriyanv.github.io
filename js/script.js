// ============================================================
// Helpers
// ============================================================
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// Scroll progress bar
// ============================================================
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
progressBar.setAttribute('aria-hidden', 'true');
document.body.appendChild(progressBar);

// ============================================================
// Unified scroll spy (sidebar + mobile tabs)
// ============================================================
const allNavLinks = $$('.side-nav a, .mobile-topnav .tabs-row a');
const sections = $$('main .section').filter(s => s.id);
const topnav = document.querySelector('.mobile-topnav');
let lastY = window.scrollY;

function setActive(id) {
  allNavLinks.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
  );
}

function onScroll() {
  const y = window.scrollY;

  // progress bar
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.setProperty('--p', max > 0 ? Math.min(y / max, 1) : 0);

  // scroll spy
  let current = sections[0]?.id || '';
  for (const sec of sections) {
    if (y >= sec.offsetTop - 180) current = sec.id;
  }
  // snap to last section when at the very bottom
  if (max > 0 && y >= max - 2) current = sections[sections.length - 1]?.id || current;
  setActive(current);

  // hide/show mobile top bar based on scroll direction
  if (topnav) {
    const isMobile = window.matchMedia('(max-width: 880px)').matches;
    if (isMobile) {
      if (y > lastY && y - lastY > 4 && y > 120) topnav.classList.add('hide');
      else if (y < lastY && lastY - y > 4) topnav.classList.remove('hide');
    } else {
      topnav.classList.remove('hide');
    }
  }
  lastY = y;
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
document.addEventListener('DOMContentLoaded', onScroll);
onScroll();

// Immediate feedback when tapping mobile tabs
$$('.mobile-topnav .tabs-row a').forEach(a => {
  a.addEventListener('click', () => {
    allNavLinks.forEach(l => l.classList.remove('active'));
    a.classList.add('active');
  });
});

// ============================================================
// Staggered scroll-reveal
// ============================================================
const revealTargets = $$(
  '.hero-copy, .section-head, .about-wrap, .skill-card, .timeline .item, .cert, .card, .footer'
);

if (!reducedMotion && 'IntersectionObserver' in window) {
  // tag elements + compute stagger delay among revealed siblings
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
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => reveal.observe(el));
}

// ============================================================
// Mouse-tracking spotlight on cards
// ============================================================
if (window.matchMedia('(pointer: fine)').matches) {
  $$('.skill-card, .card, .cert, .timeline .content').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}
