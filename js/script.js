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