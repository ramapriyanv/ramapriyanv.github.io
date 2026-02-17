// Scroll spy for sidebar links (uses viewport middle for accuracy)
const sideLinks = document.querySelectorAll('.side-nav a');
const topLinks  = document.querySelectorAll('.mobile-topnav a[href^="#"]'); // mobile tabs
const allNavLinks = [...sideLinks, ...topLinks];
const sections = [...document.querySelectorAll('main .section')].filter(s => s.id);

topLinks.forEach(a => {
  a.addEventListener('click', () => {
    allNavLinks.forEach(l => l.classList.remove('active'));
    a.classList.add('active');
  });
});


function onScroll(){
  let current = sections[0]?.id || '';

for (const sec of sections){
  const top = sec.offsetTop - 100; // 100px threshold so header area counts
  const bottom = top + sec.offsetHeight;
  if (window.scrollY >= top && window.scrollY < bottom){
    current = sec.id;
    break;
  }
}

  allNavLinks.forEach(a => {
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

// Hide/show mobile top bar based on scroll direction
const topnav = document.querySelector('.mobile-topnav');
let lastY = window.scrollY;

function handleHideShow(){
  if (!topnav) return;
  const y = window.scrollY;
  const isMobile = window.matchMedia('(max-width: 880px)').matches;

  if (isMobile){
    if (y > lastY && y - lastY > 4) {         // scrolling down
      topnav.classList.add('hide');
    } else if (y < lastY && lastY - y > 4) {  // scrolling up
      topnav.classList.remove('hide');
    }
  } else {
    topnav.classList.remove('hide');          // safety on desktop
  }
  lastY = y;
}

window.addEventListener('scroll', handleHideShow, { passive: true });
window.addEventListener('resize', handleHideShow);

// Desktop-only scroll spy for sidebar
if (window.innerWidth > 880) {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".side-nav a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });
}
