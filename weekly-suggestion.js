(() => {
  const walletScreen = document.querySelector('[data-screen="wallet"]');
  const firstPanel = walletScreen?.querySelector('.panel');
  if (!walletScreen || !firstPanel) return;

  const copy = {
    nl: {
      label: 'SUGGESTIE VAN DE WEEK',
      title: 'Catuai Natural filterkoffie',
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
      variety: 'Catuai',
      farmLabel: 'Plantage',
      farm: 'Santa Teresa de Mogotón',
      altitudeLabel: 'Teelthoogte',
      altitude: '1.600 meter',
      storyTitle: 'Het verhaal achter de koffie',
      story: 'Op 1.600 meter hoogte, hoog in de bergen van Cerro Mogotón, verbouwt Silvio Sánchez deze Catuai-koffie op Santa Teresa de Mogotón. De constante mist, overvloedige regen en diverse schaduwbomen beschermen de planten tegen de sterke zon en laten de koffiebessen langzaam rijpen. Na de oogst worden de intacte bessen naar de droge vallei van Ocotal gebracht en volgens de natural-methode verwerkt. Paso Paso beschrijft de smaak als chocoladecrème en aardbeienmelk.',
      verification: 'Boer, plantage, variëteit, hoogte, herkomst, verwerking en smaaknotities geverifieerd via Paso Paso.'
    },
    fr: {
      label: 'SUGGESTION DE LA SEMAINE',
      title: 'Café filtre Catuai Natural',
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
      variety: 'Catuai',
      farmLabel: 'Plantation',
      farm: 'Santa Teresa de Mogotón',
      altitudeLabel: 'Altitude de culture',
      altitude: '1 600 mètres',
      storyTitle: 'L’histoire derrière ce café',
      story: 'À 1 600 mètres d’altitude, dans les montagnes du Cerro Mogotón, Silvio Sánchez cultive ce Catuai à Santa Teresa de Mogotón. La brume constante, les pluies abondantes et les nombreux arbres d’ombrage protègent les caféiers du soleil intense et permettent aux cerises de mûrir lentement. Après la récolte, les cerises intactes sont transportées dans la vallée sèche d’Ocotal et traitées selon la méthode naturelle. Paso Paso décrit des notes de crème au chocolat et de lait à la fraise.',
      verification: 'Producteur, plantation, variété, altitude, origine, procédé et notes gustatives vérifiés via Paso Paso.'
    },
    en: {
      label: 'SUGGESTION OF THE WEEK',
      title: 'Catuai Natural filter coffee',
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
      variety: 'Catuai',
      farmLabel: 'Farm',
      farm: 'Santa Teresa de Mogotón',
      altitudeLabel: 'Growing altitude',
      altitude: '1,600 metres',
      storyTitle: 'The story behind the coffee',
      story: 'At 1,600 metres above sea level, high in the mountains of Cerro Mogotón, Silvio Sánchez grows this Catuai coffee at Santa Teresa de Mogotón. Constant mist, abundant rainfall and diverse shade trees protect the plants from the strong sun and allow the cherries to ripen slowly. After harvest, the intact cherries are transported to the dry valley of Ocotal and processed using the natural method. Paso Paso describes flavours of chocolate cream and strawberry milk.',
      verification: 'Farmer, farm, variety, altitude, origin, process and tasting notes verified through Paso Paso.'
    },
    es: {
      label: 'SUGERENCIA DE LA SEMANA',
      title: 'Café de filtro Catuai Natural',
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
      variety: 'Catuai',
      farmLabel: 'Finca',
      farm: 'Santa Teresa de Mogotón',
      altitudeLabel: 'Altitud de cultivo',
      altitude: '1.600 metros',
      storyTitle: 'La historia detrás del café',
      story: 'A 1.600 metros de altitud, en las montañas del Cerro Mogotón, Silvio Sánchez cultiva este café Catuai en Santa Teresa de Mogotón. La niebla constante, las lluvias abundantes y los diversos árboles de sombra protegen las plantas del fuerte sol y permiten que las cerezas maduren lentamente. Tras la cosecha, las cerezas intactas se transportan al valle seco de Ocotal y se procesan mediante el método natural. Paso Paso describe notas de crema de chocolate y leche de fresa.',
      verification: 'Productor, finca, variedad, altitud, origen, proceso y notas de cata verificados mediante Paso Paso.'
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
