// Keep direct links predictable; remember the visitor's explicit language choice.
document.querySelectorAll('a[data-language]').forEach(link => {
  link.addEventListener('click', () => {
    try { localStorage.setItem('portfolio-language', link.dataset.language); } catch {}
  });
});
// A saved Portuguese preference applies to the main landing page only.
try {
  if (document.documentElement.lang === 'en' && localStorage.getItem('portfolio-language') === 'pt-BR') {
    location.replace(new URL('pt/', location.href).href + location.hash);
  }
} catch { /* The site still works when browser storage is unavailable. */ }
