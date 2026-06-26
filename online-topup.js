(() => {
  const walletCard = document.querySelector('.wallet-card');
  if (!walletCard) return;

  const cta = document.createElement('button');
  cta.type = 'button';
  cta.className = 'online-topup-cta';
  cta.id = 'open-online-topup';
  cta.innerHTML = `
    <span>
      <strong data-i18n="onlineCta">${tr('onlineCta')}</strong>
      <small data-i18n="onlineCtaSub">${tr('onlineCtaSub')}</small>
    </span>
    <span class="cta-arrow" aria-hidden="true">→</span>
  `;
  walletCard.insertAdjacentElement('afterend', cta);

  const overlay = document.createElement('div');
  overlay.className = 'online-topup-overlay';
  overlay.id = 'online-topup-modal';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <section class="online-topup-dialog" role="dialog" aria-modal="true" aria-labelledby="online-topup-title">
      <div class="online-topup-head">
        <div>
          <p class="eyebrow" data-i18n="onlineTopup">${tr('onlineTopup')}</p>
          <h2 id="online-topup-title" data-i18n="fillWallet">${tr('fillWallet')}</h2>
          <p data-i18n="onlineIntro">${tr('onlineIntro')}</p>
        </div>
        <button type="button" class="online-topup-close" data-i18n-aria="close" aria-label="${tr('close')}">×</button>
      </div>

      <div class="online-amounts" aria-label="${tr('chooseCredit')}">
        <button type="button" class="online-amount" data-online-amount="15" data-online-bonus="0"><strong>€ 15</strong><small data-i18n="noBonus">${tr('noBonus')}</small></button>
        <button type="button" class="online-amount selected" data-online-amount="25" data-online-bonus="2"><strong>€ 25</strong><small>+ € 2 bonus</small></button>
        <button type="button" class="online-amount" data-online-amount="50" data-online-bonus="5"><strong>€ 50</strong><small>+ € 5 bonus</small></button>
      </div>

      <div class="online-custom">
        <label for="online-custom-amount" data-i18n="customAmount">${tr('customAmount')}</label>
        <div><span>€</span><input id="online-custom-amount" type="number" min="5" max="250" step="0.01" inputmode="decimal" placeholder="0,00"></div>
      </div>

      <p class="payment-title" data-i18n="simulatedMethod">${tr('simulatedMethod')}</p>
      <div class="payment-methods">
        <button type="button" class="payment-method selected" data-payment-method="bancontact"><span><strong data-i18n="bancontact">${tr('bancontact')}</strong><small data-i18n="bancontactSub">${tr('bancontactSub')}</small></span></button>
        <button type="button" class="payment-method" data-payment-method="card"><span><strong data-i18n="card">${tr('card')}</strong><small data-i18n="cardSub">${tr('cardSub')}</small></span></button>
      </div>

      <div class="online-summary">
        <span data-i18n="addedToDemoWallet">${tr('addedToDemoWallet')}</span>
        <strong id="online-topup-total">${money(27)}</strong>
      </div>
      <button type="button" class="online-pay-button" id="confirm-online-topup" data-i18n="simulatePayment">${tr('simulatePayment')}</button>
      <p class="online-disclaimer" data-i18n="onlineDisclaimer">${tr('onlineDisclaimer')}</p>
    </section>
  `;
  document.body.appendChild(overlay);
  window.KH_I18N?.applyStaticTranslations?.();

  const amountButtons = [...overlay.querySelectorAll('[data-online-amount]')];
  const methodButtons = [...overlay.querySelectorAll('[data-payment-method]')];
  const customInput = overlay.querySelector('#online-custom-amount');
  const totalElement = overlay.querySelector('#online-topup-total');
  const confirmButton = overlay.querySelector('#confirm-online-topup');
  const closeButton = overlay.querySelector('.online-topup-close');

  let selectedAmount = 25;
  let selectedBonus = 2;
  let selectedMethod = 'bancontact';
  let processing = false;

  function calculateCustomBonus(amount) {
    return amount >= 50 ? round(amount * 0.1) : 0;
  }

  function updateSummary() {
    totalElement.textContent = selectedAmount >= 5 ? money(round(selectedAmount + selectedBonus)) : tr('chooseMinimum');
  }

  function updateLanguage() {
    window.KH_I18N?.applyStaticTranslations?.();
    updateSummary();
    if (!processing) confirmButton.textContent = tr('simulatePayment');
  }

  function openModal() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    cta.focus();
  }

  cta.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);

  overlay.addEventListener('click', event => {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  document.addEventListener('kh-language-change', updateLanguage);

  amountButtons.forEach(button => {
    button.addEventListener('click', () => {
      amountButtons.forEach(item => item.classList.toggle('selected', item === button));
      selectedAmount = Number(button.dataset.onlineAmount);
      selectedBonus = Number(button.dataset.onlineBonus);
      customInput.value = '';
      updateSummary();
    });
  });

  customInput.addEventListener('input', () => {
    const value = Number.parseFloat(customInput.value);
    if (!Number.isFinite(value) || value < 5) {
      selectedAmount = 0;
      selectedBonus = 0;
      updateSummary();
      return;
    }
    amountButtons.forEach(item => item.classList.remove('selected'));
    selectedAmount = round(value);
    selectedBonus = calculateCustomBonus(selectedAmount);
    updateSummary();
  });

  methodButtons.forEach(button => {
    button.addEventListener('click', () => {
      methodButtons.forEach(item => item.classList.toggle('selected', item === button));
      selectedMethod = button.dataset.paymentMethod;
    });
  });

  confirmButton.addEventListener('click', () => {
    if (!Number.isFinite(selectedAmount) || selectedAmount < 5) {
      toast(tr('validAmount'));
      return;
    }

    processing = true;
    confirmButton.disabled = true;
    confirmButton.textContent = tr('processingDemo');

    window.setTimeout(() => {
      topUp(selectedAmount, selectedBonus);
      closeModal();
      processing = false;
      confirmButton.disabled = false;
      confirmButton.textContent = tr('simulatePayment');
      toast(tr('demoPaymentSuccess', { method: tr(selectedMethod) }));
    }, 700);
  });

  updateSummary();
})();
