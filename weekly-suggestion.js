(() => {
  const walletScreen = document.querySelector('[data-screen="wallet"]');
  const firstPanel = walletScreen?.querySelector('.panel');
  if (!walletScreen || !firstPanel) return;

  const copy = {
    nl: {
      label: 'SUGGESTIE VAN DE WEEK',
      title: 'Geisha Natural filterkoffie',
      description: 'Een uitgesproken en verfijnde koffie uit de bergen van Nicaragua.',
      stamp: '☕ 1 stempel',
      orderButton: 'Voeg toe aan bestelling',
      detailsButton: 'Ontdek deze koffie',
      closeDetails: 'Verberg herkomst',
      farmerLabel: 'Boer',
      farmer: 'Silvio Sánchez',
      originLabel: 'Herkomst',
      origin: 'Cerro Mogotón, Nueva Segovia, Nicaragua',
      varietyLabel: 'Variëteit',
      variety: 'Geisha',
      farmLabel: 'Plantage',
      farm: 'Santa Teresa de Mogotón',
      altitudeLabel: 'Teelthoogte',
      altitude: '1.600 meter',
      storyTitle: 'Het verhaal achter de koffie',
      story: 'Op 1.600 meter hoogte verbouwt Silvio Sánchez deze uitzonderlijke Geisha op Santa Teresa de Mogotón. De plantage ligt hoog in de bergen van Nueva Segovia, met veel regen en beschermende schaduwbomen. Die bomen temperen de sterke zon en laten de koffiebessen langzaam rijpen. De koele nachten en natuurlijke verwerking dragen bij aan de kenmerkende tonen van aardbei en donkere chocolade.',
      verification: 'Plantage en verhaal geverifieerd via Paso Paso; de teelthoogte is aangeleverd als productinformatie.'
    },
    fr: {
      label: 'SUGGESTION DE LA SEMAINE',
      title: 'Café filtre Geisha Natural',
      description: 'Un café expressif et raffiné provenant des montagnes du Nicaragua.',
      stamp: '☕ 1 tampon',
      orderButton: 'Ajouter à la commande',
      detailsButton: 'Découvrir ce café',
      closeDetails: 'Masquer l’origine',
      farmerLabel: 'Producteur',
      farmer: 'Silvio Sánchez',
      originLabel: 'Origine',
      origin: 'Cerro Mogotón, Nueva Segovia, Nicaragua',
      varietyLabel: 'Variété',
      variety: 'Geisha',
      farmLabel: 'Plantation',
      farm: 'Santa Teresa de Mogotón',
      altitudeLabel: 'Altitude de culture',
      altitude: '1 600 mètres',
      storyTitle: 'L’histoire derrière ce café',
      story: 'À 1 600 mètres d’altitude, Silvio Sánchez cultive ce Geisha exceptionnel à Santa Teresa de Mogotón. La plantation se trouve dans les montagnes de Nueva Segovia, avec des pluies abondantes et de nombreux arbres d’ombrage. Ils atténuent le fort soleil et permettent aux cerises de mûrir lentement. Les nuits fraîches et le procédé naturel contribuent aux notes caractéristiques de fraise et de chocolat noir.',
      verification: 'Plantation et récit vérifiés via Paso Paso ; l’altitude provient des informations produit fournies.'
    },
    en: {
      label: 'SUGGESTION OF THE WEEK',
      title: 'Geisha Natural filter coffee',
      description: 'An expressive and refined coffee from the mountains of Nicaragua.',
      stamp: '☕ 1 stamp',
      orderButton: 'Add to order',
      detailsButton: 'Discover this coffee',
      closeDetails: 'Hide origin',
      farmerLabel: 'Farmer',
      farmer: 'Silvio Sánchez',
      originLabel: 'Origin',
      origin: 'Cerro Mogotón, Nueva Segovia, Nicaragua',
      varietyLabel: 'Variety',
      variety: 'Geisha',
      farmLabel: 'Farm',
      farm: 'Santa Teresa de Mogotón',
      altitudeLabel: 'Growing altitude',
      altitude: '1,600 metres',
      storyTitle: 'The story behind the coffee',
      story: 'At 1,600 metres above sea level, Silvio Sánchez grows this exceptional Geisha at Santa Teresa de Mogotón. The farm sits high in the mountains of Nueva Segovia, with abundant rainfall and protective shade trees. These trees soften the strong sun and allow the coffee cherries to ripen slowly. Cool nights and natural processing contribute to its signature strawberry and dark-chocolate notes.',
      verification: 'Farm and story verified through Paso Paso; the altitude was supplied as product information.'
    },
    es: {
      label: 'SUGERENCIA DE LA SEMANA',
      title: 'Café de filtro Geisha Natural',
      description: 'Un café expresivo y refinado procedente de las montañas de Nicaragua.',
      stamp: '☕ 1 sello',
      orderButton: 'Añadir al pedido',
      detailsButton: 'Descubre este café',
      closeDetails: 'Ocultar origen',
      farmerLabel: 'Productor',
      farmer: 'Silvio Sánchez',
      originLabel: 'Origen',
      origin: 'Cerro Mogotón, Nueva Segovia, Nicaragua',
      varietyLabel: 'Variedad',
      variety: 'Geisha',
      farmLabel: 'Finca',
      farm: 'Santa Teresa de Mogotón',
      altitudeLabel: 'Altitud de cultivo',
      altitude: '1.600 metros',
      storyTitle: 'La historia detrás del café',
      story: 'A 1.600 metros de altitud, Silvio Sánchez cultiva este excepcional Geisha en Santa Teresa de Mogotón. La finca está situada en las montañas de Nueva Segovia, con abundantes lluvias y árboles de sombra protectores. Estos reducen la intensidad del sol y permiten que las cerezas maduren lentamente. Las noches frescas y el proceso natural contribuyen a sus notas características de fresa y chocolate negro.',
      verification: 'Finca e historia verificadas mediante Paso Paso; la altitud procede de la información de producto facilitada.'
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
      <div class="weekly-suggestion-actions">
        <button type="button" class="weekly-suggestion-details-button" id="weekly-suggestion-details-button" aria-expanded="false"></button>
        <button type="button" class="weekly-suggestion-button" id="weekly-suggestion-button"></button>
      </div>
      <div class="weekly-coffee-details" id="weekly-coffee-details" hidden>
        <dl class="weekly-coffee-facts">
          <div><dt id="weekly-farmer-label"></dt><dd id="weekly-farmer"></dd></div>
          <div><dt id="weekly-origin-label"></dt><dd id="weekly-origin"></dd></div>
          <div><dt id="weekly-variety-label"></dt><dd id="weekly-variety"></dd></div>
          <div><dt id="weekly-farm-label"></dt><dd id="weekly-farm"></dd></div>
          <div><dt id="weekly-altitude-label"></dt><dd id="weekly-altitude"></dd></div>
        </dl>
        <h3 id="weekly-story-title"></h3>
        <p id="weekly-story"></p>
        <p class="weekly-verification" id="weekly-verification"></p>
      </div>
    </div>
  `;
  firstPanel.insertAdjacentElement('beforebegin', card);

  const elements = {
    label: card.querySelector('#weekly-suggestion-label'),
    title: card.querySelector('#weekly-suggestion-title'),
    description: card.querySelector('#weekly-suggestion-description'),
    price: card.querySelector('#weekly-suggestion-price'),
    stamp: card.querySelector('#weekly-suggestion-stamp'),
    orderButton: card.querySelector('#weekly-suggestion-button'),
    detailsButton: card.querySelector('#weekly-suggestion-details-button'),
    details: card.querySelector('#weekly-coffee-details'),
    farmerLabel: card.querySelector('#weekly-farmer-label'),
    farmer: card.querySelector('#weekly-farmer'),
    originLabel: card.querySelector('#weekly-origin-label'),
    origin: card.querySelector('#weekly-origin'),
    varietyLabel: card.querySelector('#weekly-variety-label'),
    variety: card.querySelector('#weekly-variety'),
    farmLabel: card.querySelector('#weekly-farm-label'),
    farm: card.querySelector('#weekly-farm'),
    altitudeLabel: card.querySelector('#weekly-altitude-label'),
    altitude: card.querySelector('#weekly-altitude'),
    storyTitle: card.querySelector('#weekly-story-title'),
    story: card.querySelector('#weekly-story'),
    verification: card.querySelector('#weekly-verification')
  };

  function language() {
    return window.KH_I18N?.getLanguage?.() || 'nl';
  }

  function strings() {
    return copy[language()] || copy.nl;
  }

  function render() {
    const text = strings();
    elements.label.textContent = text.label;
    elements.title.textContent = text.title;
    elements.description.textContent = text.description;
    elements.price.textContent = typeof money === 'function' ? money(4) : '€ 4,00';
    elements.stamp.textContent = text.stamp;
    elements.orderButton.textContent = text.orderButton;
    elements.detailsButton.textContent = elements.details.hidden ? text.detailsButton : text.closeDetails;
    elements.farmerLabel.textContent = text.farmerLabel;
    elements.farmer.textContent = text.farmer;
    elements.originLabel.textContent = text.originLabel;
    elements.origin.textContent = text.origin;
    elements.varietyLabel.textContent = text.varietyLabel;
    elements.variety.textContent = text.variety;
    elements.farmLabel.textContent = text.farmLabel;
    elements.farm.textContent = text.farm;
    elements.altitudeLabel.textContent = text.altitudeLabel;
    elements.altitude.textContent = text.altitude;
    elements.storyTitle.textContent = text.storyTitle;
    elements.story.textContent = text.story;
    elements.verification.textContent = text.verification;
  }

  elements.detailsButton.addEventListener('click', () => {
    const willOpen = elements.details.hidden;
    elements.details.hidden = !willOpen;
    elements.detailsButton.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    render();
  });

  elements.orderButton.addEventListener('click', () => {
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
