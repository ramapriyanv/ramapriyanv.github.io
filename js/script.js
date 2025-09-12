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
// Elements
const menuBtn  = document.querySelector('.menu-btn');
const drawer   = document.querySelector('.side-nav');
const backdrop = document.querySelector('.backdrop');

// Open/close helpers
function openDrawer(){
  drawer.classList.add('open');
  backdrop.classList.remove('hidden');        // show backdrop
  menuBtn?.setAttribute('aria-expanded','true');
  // lock page scroll
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function closeDrawer(){
  drawer.classList.remove('open');
  backdrop.classList.add('hidden');           // hide backdrop
  menuBtn?.setAttribute('aria-expanded','false');
  // restore scroll
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

// Hamburger (iOS-safe)
menuBtn?.addEventListener('click', (e)=>{
  e.preventDefault();
  e.stopPropagation();
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});
menuBtn?.addEventListener('touchstart', (e)=>{
  e.preventDefault();
  e.stopPropagation();
}, { passive:false });

// Backdrop tap closes
backdrop?.addEventListener('click', closeDrawer);

// Close on nav link tap + Escape
drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeDrawer(); });

// Make sure desktop never keeps the drawer/backdrop open after resizing
function syncDesktopState(){
  if (window.matchMedia('(min-width: 881px)').matches) closeDrawer();
}
window.addEventListener('resize', syncDesktopState);
document.addEventListener('DOMContentLoaded', syncDesktopState);


