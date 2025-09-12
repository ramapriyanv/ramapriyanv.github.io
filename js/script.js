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


// Reveal on intersect
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

// Mobile menu slide toggle + autoclose + correct offset (robust for touch)
const menuBtn  = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const topBar    = document.querySelector('.sidebar');

function setMobileNavTop(){
  if (!topBar || !mobileNav) return;
  const h = topBar.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--bar-h', `${h}px`);
}
setMobileNavTop();
window.addEventListener('resize', setMobileNavTop, { passive: true });
window.addEventListener('load', setMobileNavTop);

function applyAria(open){
  menuBtn?.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuBtn?.classList.toggle('open', open);
  const icon = menuBtn?.querySelector('i');
  if (icon) icon.className = open ? 'bx bx-x' : 'bx bx-menu';
}

function setMenu(open){
  if (!mobileNav) return;
  mobileNav.classList.toggle('open', open);
  applyAria(open);
}

let lastToggleAt = 0;
function toggleOnce(e){
  // Prevent double-fire on touch devices (touch + synthesized click)
  e?.preventDefault?.();
  e?.stopPropagation?.();
  const now = Date.now();
  if (now - lastToggleAt < 250) return; // debounce
  lastToggleAt = now;
  setMenu(!mobileNav.classList.contains('open'));
}

// Use a single pointer handler (covers touch/mouse/pen)
menuBtn?.addEventListener('pointerup', toggleOnce, { passive: false });
// Safety: ignore the legacy click if it still fires
menuBtn?.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); }, { passive: false });

// Don’t let taps inside the open panel bubble up (in case there’s any global outside-click handler)
mobileNav?.addEventListener('pointerdown', (e)=> e.stopPropagation(), { passive: true });

// Auto-close when a link is tapped
mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('pointerup', () => setMenu(false), { passive: true });
});

// Initialize ARIA
applyAria(mobileNav?.classList.contains('open'));



