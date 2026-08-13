const header = document.querySelector('#header');
const menuButton = document.querySelector('#menu-button');
const mobileMenu = document.querySelector('#mobile-menu');
const menuLines = menuButton.querySelectorAll('.menu-line');

function setMenu(open) {
  mobileMenu.classList.toggle('hidden', !open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menuLines[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
  menuLines[1].style.opacity = open ? '0' : '1';
  menuLines[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  document.body.classList.toggle('overflow-hidden', open);
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

function updateHeader() {
  const scrolled = window.scrollY > 24;
  header.classList.toggle('bg-ink/80', scrolled);
  header.classList.toggle('backdrop-blur-xl', scrolled);
  header.classList.toggle('border-white/[.07]', scrolled);
  header.classList.toggle('shadow-lg', scrolled);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('active', active);
      link.classList.toggle('text-white', active);
    });
  });
}, { rootMargin: '-35% 0px -60% 0px' });
sections.forEach(section => sectionObserver.observe(section));

const form = document.querySelector('#contact-form');
const feedback = document.querySelector('#form-feedback');
const fields = form.querySelectorAll('input, textarea');

function validateField(field) {
  const error = field.parentElement.querySelector('.field-error');
  const valid = field.checkValidity();
  field.classList.toggle('border-red-400', !valid);
  field.setAttribute('aria-invalid', String(!valid));
  error?.classList.toggle('hidden', valid);
  return valid;
}

fields.forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validateField(field); });
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const valid = [...fields].map(validateField).every(Boolean);
  feedback.classList.remove('hidden', 'border-emerald-400/30', 'bg-emerald-400/10', 'text-emerald-300', 'border-red-400/30', 'bg-red-400/10', 'text-red-300');
  if (!valid) {
    feedback.textContent = 'Revise os campos destacados antes de enviar.';
    feedback.classList.add('border-red-400/30', 'bg-red-400/10', 'text-red-300');
    form.querySelector(':invalid')?.focus();
    return;
  }
  const data = new FormData(form);
  const subject = encodeURIComponent(`Contato pelo portfólio — ${data.get('name')}`);
  const body = encodeURIComponent(`${data.get('message')}\n\nNome: ${data.get('name')}\nE-mail: ${data.get('email')}`);
  feedback.textContent = 'Tudo certo! Seu aplicativo de e-mail será aberto para concluir o envio.';
  feedback.classList.add('border-emerald-400/30', 'bg-emerald-400/10', 'text-emerald-300');
  window.location.href = `mailto:leonsn2008@gmail.com?subject=${subject}&body=${body}`;
});

document.querySelector('#year').textContent = new Date().getFullYear();
