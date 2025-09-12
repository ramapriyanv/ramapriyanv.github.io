// Scroll spy for sidebar (works when sidebar is vertical or collapsed)
const links = document.querySelectorAll('.side-nav a');
const sections = [...document.querySelectorAll('main .section')].filter(s => s.id);

function onScroll(){
  const y = window.scrollY + 120;
  let current = sections[0]?.id || '';
  for (const sec of sections){
    if (y >= (sec.offsetTop)) current = sec.id;
  }
  links.forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', onScroll);
onScroll();

// Subtle reveal on intersect
const reveal = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if (e.isIntersecting){
      e.target.animate(
        [{opacity:0, transform:'translateY(10px)'},{opacity:1, transform:'translateY(0)'}],
        {duration:400, easing:'ease-out', fill:'forwards'}
      );
      reveal.unobserve(e.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.feature-card, .grid .card, .timeline .content, .about-wrap, .cert, .contact .card').forEach(el=>reveal.observe(el));
