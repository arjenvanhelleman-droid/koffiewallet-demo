(() => {
  const walletCard = document.querySelector('.wallet-card');
  if (!walletCard) return;

  const cta = document.createElement('button');
  cta.type = 'button';
  cta.className = 'online-topup-cta';
  cta.id = 'open-online-topup';
  cta.innerHTML = `
    <span>
      <strong>Saldo online opladen</strong>
      <small>Thuis of ter plaatse via je telefoon</small>
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
          <p class="eyebrow">ONLINE OPLADEN</p>
          <h2 id="online-topup-title">Vul je wallet aan</h2>
          <p>Kies een bedrag en betaal thuis of op locatie. In deze demo wordt de betaling nagebootst.</p>
        </div>
        <button type="button" class="online-topup-close" aria-label="Sluiten">×</button>
      </div>

      <div class="online-amounts" aria-label="Kies een bedrag">
        <button type="button" class="online-amount" data-online-amount="15" data-online-bonus="0"><strong>€ 15</strong><small>Zonder bonus</small></button>
        <button type="button" class="online-amount selected" data-online-amount="25" data-online-bonus="2"><strong>€ 25</strong><small>+ € 2 bonus</small></button>
        <button type="button" class="online-amount" data-online-amount="50" data-online-bonus="5"><strong>€ 50</strong><small>+ € 5 bonus</small></button>
      </div>

      <div class="online-custom">
        <label for="online-custom-amount">Of vul een ander bedrag in</label>
        <div><span>€</span><input id="online-custom-amount" type="number" min="5" max="250" step="0.01" inputmode="decimal" placeholder="0,00"></div>
      </div>

      <p class="payment-title">Betaalmethode</p>
      <div class="payment-methods">
        <button type="button" class="payment-method selected" data-payment-method="Bancontact"><span><strong>Bancontact</strong><small>Handig in België</small></span></button>
        <button type="button" class="payment-method" data-payment-method="Betaalkaart"><span><strong>Betaalkaart</strong><small>Debet- of kredietkaart</small></span></button>
        <button type="button" class="payment-method" data-payment-method="Payconiq"><span><strong>Payconiq</strong><small>Mobiel betalen</small></span></button>
      </div>

      <div class="online-summary">
        <span>Toegevoegd aan je wallet</span>
        <strong id="online-topup-total">€ 27,00</strong>
      </div>
      <button type="button" class="online-pay-button" id="confirm-online-topup">Ga naar veilige betaling</button>
      <p class="online-disclaimer">Demo: er wordt geen echt geld afgeschreven. Voor werkelijk gebruik is een beveiligde betaalprovider nodig.</p>
    </section>
  `;
  document.body.appendChild(overlay);

  const amountButtons = [...overlay.querySelectorAll('[data-online-amount]')];
  const methodButtons = [...overlay.querySelectorAll('[data-payment-method]')];
  const customInput = overlay.querySelector('#online-custom-amount');
  const totalElement = overlay.querySelector('#online-topup-total');
  const confirmButton = overlay.querySelector('#confirm-online-topup');
  const closeButton = overlay.querySelector('.online-topup-close');

  let selectedAmount = 25;
  let selectedBonus = 2;
  let selectedMethod = 'Bancontact';

  function calculateCustomBonus(amount) {
    return amount >= 50 ? round(amount * 0.1) : 0;
  }

  function updateSummary() {
    totalElement.textContent = money(round(selectedAmount + selectedBonus));
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
      totalElement.textContent = 'Kies minstens € 5';
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
      toast('Kies eerst een geldig bedrag vanaf € 5.');
      return;
    }

    confirmButton.disabled = true;
    confirmButton.textContent = 'Betaling wordt verwerkt…';

    window.setTimeout(() => {
      topUp(selectedAmount, selectedBonus);
      closeModal();
      confirmButton.disabled = false;
      confirmButton.textContent = 'Ga naar veilige betaling';
      toast(`Online oplading via ${selectedMethod} geslaagd in de demo.`);
    }, 700);
  });

  updateSummary();
})();
