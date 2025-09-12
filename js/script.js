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
const drawer   = document.querySelector('.side-nav');   // drawer panel
const backdrop = document.querySelector('.backdrop');   // dim layer

function openDrawer(){
  drawer.classList.add('open');
  backdrop.classList.remove('hidden');          // show backdrop
  menuBtn?.setAttribute('aria-expanded','true');

  // lock page scroll behind drawer
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function closeDrawer(){
  drawer.classList.remove('open');
  backdrop.classList.add('hidden');             // hide backdrop
  menuBtn?.setAttribute('aria-expanded','false');

  // restore page scroll
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

// iOS-safe tap handling for the hamburger
menuBtn?.addEventListener('click', (e)=>{
  e.preventDefault();
  e.stopPropagation();
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});
menuBtn?.addEventListener('touchstart', (e)=>{
  e.preventDefault();
  e.stopPropagation();
}, { passive:false });

// Backdrop tap closes; nav links/ESC close
backdrop?.addEventListener('click', closeDrawer);
drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeDrawer(); });

// --- Move socials + resume into the drawer on mobile, back on desktop ---
(function () {
  function placeDrawerExtras() {
    const drawerNav   = document.querySelector('.side-nav');
    const sidebarWrap = document.querySelector('.sidebar');
    const socialsEl   = document.querySelector('.side-socials');
    const resumeEl    = document.querySelector('.resume-btn');

    if (!drawerNav || !sidebarWrap) return;

    const isMobile = window.matchMedia('(max-width: 880px)').matches;

    if (isMobile) {
      socialsEl && socialsEl.parentElement !== drawerNav && drawerNav.appendChild(socialsEl);
      resumeEl  && resumeEl.parentElement  !== drawerNav && drawerNav.appendChild(resumeEl);
    } else {
      socialsEl && socialsEl.parentElement !== sidebarWrap && sidebarWrap.appendChild(socialsEl);
      resumeEl  && resumeEl.parentElement  !== sidebarWrap && sidebarWrap.appendChild(resumeEl);
    }
  }

  // expose for resize cleanup
  window.placeDrawerExtras = placeDrawerExtras;

  document.addEventListener('DOMContentLoaded', placeDrawerExtras);
  window.addEventListener('resize', placeDrawerExtras);
  setTimeout(placeDrawerExtras, 0);
})();

// Never keep the drawer/backdrop open on desktop after resizing
function syncDesktopState(){
  if (window.matchMedia('(min-width: 881px)').matches){
    window.placeDrawerExtras?.();
    closeDrawer();
  }
}
window.addEventListener('resize', syncDesktopState);
document.addEventListener('DOMContentLoaded', syncDesktopState);
