// Scroll spy for sidebar + mobile tabs
const sideLinks = document.querySelectorAll('.side-nav a');
const topLinks  = document.querySelectorAll('.mobile-topnav a[href^="#"]');
const allNavLinks = [...sideLinks, ...topLinks];

// Only track real sections that have an id
const sections = [...document.querySelectorAll('main .section')].filter(s => s.id);

function setActiveById(id){
  allNavLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
  });
}

topLinks.forEach(a => {
  a.addEventListener('click', () => setActiveById(a.getAttribute('href').slice(1)));
});

function onScroll(){
  if (!sections.length) return;
  let current = sections[0].id;

  for (const sec of sections){
    const top = sec.offsetTop - 120; // header threshold
    const bottom = top + sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom){
      current = sec.id;
      break;
    }
  }

  setActiveById(current);
}

window.addEventListener('scroll', onScroll, { passive:true });
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

// Hide/show mobile top bar based on scroll direction
const topnav = document.querySelector('.mobile-topnav');
let lastY = window.scrollY;

function handleHideShow(){
  if (!topnav) return;
  const y = window.scrollY;
  const isMobile = window.matchMedia('(max-width: 880px)').matches;

  if (isMobile){
    if (y > lastY && y - lastY > 4){
      topnav.classList.add('hide');
    } else if (y < lastY && lastY - y > 4){
      topnav.classList.remove('hide');
    }
  } else {
    topnav.classList.remove('hide');
  }
  lastY = y;
}

window.addEventListener('scroll', handleHideShow, { passive:true });
window.addEventListener('resize', handleHideShow);
