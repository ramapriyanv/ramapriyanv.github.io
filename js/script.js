// Mobile nav toggle
const menuIcon = document.querySelector('#menu-icon');
const navbar   = document.querySelector('.navbar');
menuIcon && (menuIcon.onclick = () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
});

// Scroll spy + sticky header
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('header nav a');
const header   = document.querySelector('header');

function onScroll(){
  const y = window.scrollY;

  // sticky header
  if (header) header.classList.toggle('sticky', y > 100);

  // active link
  sections.forEach(sec => {
    const top = sec.offsetTop - 160;
    const h   = sec.offsetHeight;
    if (y >= top && y < top + h){
      const id = sec.getAttribute('id');
      navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href')?.includes(id)) a.classList.add('active');
      });
    }
  });
}
window.addEventListener('scroll', onScroll);
onScroll(); // initialize state

// Subtle reveal on scroll
const revealables = document.querySelectorAll('.skills-column, .experience-content .content, .projects-box');
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if (entry.isIntersecting){
      entry.target.animate(
        [{ opacity:0, transform:'translateY(10px)' }, { opacity:1, transform:'translateY(0)' }],
        { duration:450, easing:'ease-out', fill:'forwards' }
      );
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealables.forEach(el=>observer.observe(el));
