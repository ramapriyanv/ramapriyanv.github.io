(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  const sections = [...document.querySelectorAll('main .section[id]')];
  const navLinks = [...document.querySelectorAll('.side-nav a[href^="#"], .tabs-row a[href^="#"]')];
  const progress = document.querySelector('.page-progress');
  const topnav = document.querySelector('.mobile-topnav');
  const backToTop = document.querySelector('.back-to-top');
  const cursorGlow = document.querySelector('.cursor-glow');
  const year = document.querySelector('#year');

  if (year) year.textContent = new Date().getFullYear();

  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = `${progressValue}%`;
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 720);
  }

  function updateActiveNav() {
    if (!sections.length) return;

    const referenceLine = window.scrollY + Math.min(window.innerHeight * 0.42, 380);
    let current = sections[0].id;

    for (const section of sections) {
      if (section.offsetTop <= referenceLine) current = section.id;
    }

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
      if (isActive && link.closest('.tabs-row')) {
        link.scrollIntoView({ inline: 'center', block: 'nearest', behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  }

  let lastScrollY = window.scrollY;
  function handleMobileNav() {
    if (!topnav) return;
    const isMobile = window.matchMedia('(max-width: 880px)').matches;
    const currentY = window.scrollY;

    if (!isMobile || currentY < 80) {
      topnav.classList.remove('hide');
      lastScrollY = currentY;
      return;
    }

    const delta = currentY - lastScrollY;
    if (delta > 8) topnav.classList.add('hide');
    if (delta < -8) topnav.classList.remove('hide');
    lastScrollY = currentY;
  }

  function onScroll() {
    updateProgress();
    updateActiveNav();
    handleMobileNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
      if (topnav) topnav.classList.remove('hide');
    });
  });

  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((target, index) => {
      target.style.animationDelay = `${Math.min(index * 45, 360)}ms`;
      revealObserver.observe(target);
    });
  } else {
    revealTargets.forEach((target) => target.classList.add('in-view'));
  }

  const spotlightCards = document.querySelectorAll('.skill-card, .timeline-card, .cert, .project-card, .about-card, .contact-strip');
  spotlightCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  if (isFinePointer && !prefersReducedMotion) {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 8;
        const rotateX = ((0.5 - (y / rect.height)) * 8);
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });

    if (cursorGlow) {
      window.addEventListener('pointermove', (event) => {
        cursorGlow.style.opacity = '1';
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
      }, { passive: true });

      document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
      });
    }
  }

  document.querySelectorAll('.copy-email').forEach((button) => {
    button.addEventListener('click', async () => {
      const email = button.dataset.email;
      if (!email) return;

      const originalText = button.textContent;
      try {
        await navigator.clipboard.writeText(email);
        button.textContent = 'Copied';
      } catch (error) {
        button.textContent = email;
      }

      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1800);
    });
  });

  updateProgress();
  updateActiveNav();
  handleMobileNav();
})();
