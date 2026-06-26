(() => {
  const button = document.querySelector('#language-button');
  const menu = document.querySelector('#language-menu');
  if (!button || !menu || !window.KH_I18N) return;

  function closeMenu() {
    menu.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  }

  button.addEventListener('click', event => {
    event.stopPropagation();
    const open = menu.classList.toggle('open');
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  menu.addEventListener('click', event => {
    const choice = event.target.closest('[data-language]');
    if (!choice) return;
    window.KH_I18N.setLanguage(choice.dataset.language);
    closeMenu();
    button.focus();
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.language-switcher')) closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  window.KH_I18N.applyStaticTranslations();
})();
