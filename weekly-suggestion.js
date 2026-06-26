(() => {
  const walletScreen = document.querySelector('[data-screen="wallet"]');
  const firstPanel = walletScreen?.querySelector('.panel');
  if (!walletScreen || !firstPanel) return;

  const copy = {
    nl: {
      label: 'SUGGESTIE VAN DE WEEK',
      title: 'Filterkoffie',
      description: 'Helder, aromatisch en rustig gezet. Deze week extra in de kijker.',
      stamp: '☕ 1 stempel',
      button: 'Voeg toe aan bestelling'
    },
    fr: {
      label: 'SUGGESTION DE LA SEMAINE',
      title: 'Café filtre',
      description: 'Clair, aromatique et préparé lentement. Notre suggestion de la semaine.',
      stamp: '☕ 1 tampon',
      button: 'Ajouter à la commande'
    },
    en: {
      label: 'SUGGESTION OF THE WEEK',
      title: 'Filter coffee',
      description: 'Bright, aromatic and slowly brewed. This week’s featured coffee.',
      stamp: '☕ 1 stamp',
      button: 'Add to order'
    },
    es: {
      label: 'SUGERENCIA DE LA SEMANA',
      title: 'Café de filtro',
      description: 'Claro, aromático y preparado lentamente. La recomendación de esta semana.',
      stamp: '☕ 1 sello',
      button: 'Añadir al pedido'
    }
  };

  const card = document.createElement('section');
  card.className = 'weekly-suggestion';
  card.innerHTML = `
    <div class="weekly-suggestion-icon" aria-hidden="true">🫗</div>
    <div class="weekly-suggestion-copy">
      <p class="weekly-suggestion-label" id="weekly-suggestion-label"></p>
      <h2 id="weekly-suggestion-title"></h2>
      <p class="weekly-suggestion-description" id="weekly-suggestion-description"></p>
      <div class="weekly-suggestion-meta">
        <span class="weekly-suggestion-price" id="weekly-suggestion-price">€ 4,00</span>
        <span class="weekly-suggestion-stamp" id="weekly-suggestion-stamp"></span>
      </div>
      <button type="button" class="weekly-suggestion-button" id="weekly-suggestion-button"></button>
    </div>
  `;
  firstPanel.insertAdjacentElement('beforebegin', card);

  const label = card.querySelector('#weekly-suggestion-label');
  const title = card.querySelector('#weekly-suggestion-title');
  const description = card.querySelector('#weekly-suggestion-description');
  const price = card.querySelector('#weekly-suggestion-price');
  const stamp = card.querySelector('#weekly-suggestion-stamp');
  const button = card.querySelector('#weekly-suggestion-button');

  function language() {
    return window.KH_I18N?.getLanguage?.() || 'nl';
  }

  function render() {
    const strings = copy[language()] || copy.nl;
    label.textContent = strings.label;
    title.textContent = strings.title;
    description.textContent = strings.description;
    price.textContent = typeof money === 'function' ? money(4) : '€ 4,00';
    stamp.textContent = strings.stamp;
    button.textContent = strings.button;
  }

  button.addEventListener('click', () => {
    const orderNavigation = document.querySelector('.bottom-nav [data-go="order"]');
    orderNavigation?.click();
    window.setTimeout(() => {
      const addFilter = document.querySelector('[data-add-product="filter"]');
      addFilter?.click();
    }, 0);
  });

  document.addEventListener('kh-language-change', render);
  render();
})();
