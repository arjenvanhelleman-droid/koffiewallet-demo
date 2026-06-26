(() => {
  const copy = {
    nl: {
      farm: 'Santa María de Mogotón',
      verification: 'De exacte teelthoogte wordt toegevoegd zodra die door de leverancier is bevestigd.'
    },
    fr: {
      farm: 'Santa María de Mogotón',
      verification: 'L’altitude exacte de culture sera ajoutée après confirmation par le fournisseur.'
    },
    en: {
      farm: 'Santa María de Mogotón',
      verification: 'The exact growing altitude will be added once confirmed by the supplier.'
    },
    es: {
      farm: 'Santa María de Mogotón',
      verification: 'La altitud exacta de cultivo se añadirá cuando el proveedor la confirme.'
    }
  };

  function applyOriginDetails() {
    const language = window.KH_I18N?.getLanguage?.() || 'nl';
    const strings = copy[language] || copy.nl;
    const farm = document.querySelector('#weekly-farm');
    const verification = document.querySelector('#weekly-verification');
    if (farm) farm.textContent = strings.farm;
    if (verification) verification.textContent = strings.verification;
  }

  document.addEventListener('kh-language-change', () => {
    window.setTimeout(applyOriginDetails, 0);
  });
  window.setTimeout(applyOriginDetails, 0);
})();
