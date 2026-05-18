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
const targets = document.querySelectorAll('.about__card, .skill-group, .timeline__item, .edu__item, .cert, .project, .module');
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

// ----- Phone reveal form (Web3Forms) -----
const phoneForm    = document.getElementById('phoneForm');
const phoneReveal  = document.getElementById('phoneReveal');
const phoneError   = document.getElementById('phoneError');
const phoneCopyBtn = document.getElementById('phoneCopy');
const phoneNumEl   = document.getElementById('phoneNumber');

if (phoneForm) {
  phoneForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    phoneError.hidden = true;

    // Basic client-side validation
    const emailEl  = phoneForm.querySelector('#pf-email');
    const reasonEl = phoneForm.querySelector('#pf-reason');
    let ok = true;
    [emailEl, reasonEl].forEach(el => {
      const valid = el.checkValidity() && el.value.trim().length > 0;
      el.classList.toggle('is-invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) return;

    phoneForm.classList.add('is-loading');
    const submitBtn = phoneForm.querySelector('.phone-form__submit');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(phoneForm);
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data && data.success) {
        // Reveal phone with smooth transition
        phoneForm.style.display = 'none';
        phoneReveal.hidden = false;
        phoneReveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.warn('Phone-gate submission failed:', err);
      phoneError.hidden = false;
    } finally {
      phoneForm.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });

  // Clear invalid state as the user types
  phoneForm.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('is-invalid'));
  });
}

// Copy phone number to clipboard
if (phoneCopyBtn && phoneNumEl) {
  phoneCopyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(phoneNumEl.textContent.trim());
      phoneCopyBtn.classList.add('is-copied');
      phoneCopyBtn.textContent = 'Copied ✓';
      setTimeout(() => {
        phoneCopyBtn.classList.remove('is-copied');
        phoneCopyBtn.textContent = 'Copy';
      }, 1800);
    } catch (e) {
      // Clipboard API not available — silently ignore
    }
  });
}
