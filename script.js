// ----- Footer year -----
document.getElementById('year').textContent = new Date().getFullYear();

// ----- Mobile nav toggle -----
const navToggle = document.querySelector('.nav__toggle');
const navLinks  = document.querySelector('.nav__links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') navLinks.classList.remove('open');
  });
}

// ----- Active-section highlight in nav -----
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav__links a');
const setActive = () => {
  const y = window.scrollY + 120;
  let current = '';
  sections.forEach(s => {
    if (s.offsetTop <= y) current = s.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--c-accent)' : '';
  });
};
window.addEventListener('scroll', setActive, { passive: true });
setActive();

// ----- Reveal on scroll -----
const targets = document.querySelectorAll('.about__card, .skill-group, .timeline__item, .edu__item, .cert');
targets.forEach(t => t.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(t => io.observe(t));
} else {
  targets.forEach(t => t.classList.add('visible'));
}
