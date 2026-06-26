(() => {
  const slogans = {
    nl: 'De kickstart van jouw dag',
    fr: 'Le coup d’envoi de votre journée',
    en: 'The kickstart to your day',
    es: 'El impulso para empezar tu día'
  };

  function applySlogan() {
    const heading = document.querySelector('[data-i18n="ready"]');
    if (!heading) return;
    const language = window.KH_I18N?.getLanguage?.() || 'nl';
    heading.textContent = slogans[language] || slogans.nl;
  }

  document.addEventListener('kh-language-change', applySlogan);
  window.setTimeout(applySlogan, 0);
})();
