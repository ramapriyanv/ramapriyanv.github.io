// Scroll spy for sidebar links (uses viewport middle for accuracy)
const sideLinks = document.querySelectorAll('.side-nav a');
const sections = [...document.querySelectorAll('main .section')].filter(s => s.id);

function onScroll(){
  const mid = window.scrollY + window.innerHeight / 2;
  let current = sections[0]?.id || '';

  for (const sec of sections){
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (mid >= top && mid < bottom){
      current = sec.id;
      break;
    }
  }

  sideLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
document.addEventListener('DOMContentLoaded', onScroll);
onScroll();


// Reveal on scroll using IntersectionObserver
const reveal = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if (e.isIntersecting){
      e.target.animate(
        [{opacity:0, transform:'translateY(10px)'},{opacity:1, transform:'translateY(0)'}],
        {duration:420, easing:'ease-out', fill:'forwards'}
      );
      reveal.unobserve(e.target);
    }
  });
},{threshold:.12});

document.querySelectorAll(
  '.hero-copy, .about-wrap, .skill-card, .timeline .content, .cert, .card'
).forEach(el => reveal.observe(el));

// --- Mobile drawer toggle ---
const menuBtn  = document.querySelector('.menu-btn');
const drawer   = document.querySelector('.side-nav');     // the nav panel
const backdrop = document.querySelector('.backdrop');

function openDrawer(){
  drawer.classList.add('open');
  backdrop.classList.remove('hidden');
  menuBtn?.setAttribute('aria-expanded','true');
  // Lock page scroll under the drawer
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function closeDrawer(){
  drawer.classList.remove('open');
  backdrop.classList.add('hidden');
  menuBtn?.setAttribute('aria-expanded','false');
  // Restore scroll
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

// Replace your existing click listener with this (includes iOS fix)
menuBtn?.addEventListener('click', (e) => {
  e.preventDefault();      // stops jumping to #home
  e.stopPropagation();     // prevents bubbling into the brand <a>
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});

// iOS Safari: block ghost taps passing through to underlying elements
menuBtn?.addEventListener('touchstart', (e) => {
  e.preventDefault();
  e.stopPropagation();
}, { passive: false });


// Close on nav link tap (nice for single-page sites)
drawer?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeDrawer);
});

// Close on Escape key
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape') closeDrawer();
});
// --- Safely move socials + resume into the drawer on mobile, back on desktop
(function () {
  function placeDrawerExtras() {
    const drawerNav   = document.querySelector('.side-nav');
    const sidebarWrap = document.querySelector('.sidebar');
    const socialsEl   = document.querySelector('.side-socials');
    const resumeEl    = document.querySelector('.resume-btn');

    if (!drawerNav || !sidebarWrap) return;

    const isMobile = window.matchMedia('(max-width: 880px)').matches;

    if (isMobile) {
      if (socialsEl && socialsEl.parentElement !== drawerNav) drawerNav.appendChild(socialsEl);
      if (resumeEl  && resumeEl.parentElement  !== drawerNav) drawerNav.appendChild(resumeEl);
    } else {
      if (socialsEl && socialsEl.parentElement !== sidebarWrap) sidebarWrap.appendChild(socialsEl);
      if (resumeEl  && resumeEl.parentElement  !== sidebarWrap) sidebarWrap.appendChild(resumeEl);
    }
  }

  document.addEventListener('DOMContentLoaded', placeDrawerExtras);
  window.addEventListener('resize', placeDrawerExtras);
  setTimeout(placeDrawerExtras, 0);
})();

