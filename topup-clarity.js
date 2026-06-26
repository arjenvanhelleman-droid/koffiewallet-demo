(() => {
  const container = document.querySelector('.topups');
  if (!container) return;

  const copy = {
    nl: { hint: 'Tik op een bedrag om je demo-wallet direct op te laden.', pay: 'Je betaalt', receive: 'Je krijgt', popular: 'Populair', bonus: '+ {amount} bonus', aria: 'Laad {pay} op en ontvang {receive} wallettegoed' },
    fr: { hint: 'Touchez un montant pour recharger immédiatement votre portefeuille démo.', pay: 'Vous payez', receive: 'Vous recevez', popular: 'Populaire', bonus: '+ {amount} bonus', aria: 'Payez {pay} et recevez {receive} de crédit' },
    en: { hint: 'Tap an amount to add it directly to your demo wallet.', pay: 'You pay', receive: 'You receive', popular: 'Popular', bonus: '+ {amount} bonus', aria: 'Pay {pay} and receive {receive} wallet credit' },
    es: { hint: 'Toca un importe para recargar directamente tu monedero de demostración.', pay: 'Pagas', receive: 'Recibes', popular: 'Popular', bonus: '+ {amount} extra', aria: 'Paga {pay} y recibe {receive} de saldo' }
  };

  const hint = document.createElement('p');
  hint.className = 'topup-hint';
  container.insertAdjacentElement('beforebegin', hint);

  function language() {
    return window.KH_I18N?.getLanguage?.() || 'nl';
  }

  function format(value) {
    const locale = window.KH_I18N?.locale?.() || 'nl-BE';
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  }

  function render() {
    const t = copy[language()] || copy.nl;
    hint.textContent = t.hint;

    container.querySelectorAll('[data-topup]').forEach(button => {
      const amount = Number(button.dataset.topup) || 0;
      const bonus = Number(button.dataset.bonus) || 0;
      const total = amount + bonus;
      const featured = button.classList.contains('featured');

      button.innerHTML = `
        ${featured ? `<em>${t.popular}</em>` : ''}
        <span class="topup-pay"><small>${t.pay}</small><b>${format(amount)}</b></span>
        <span class="topup-arrow" aria-hidden="true">→</span>
        <span class="topup-receive"><small>${t.receive}</small><strong>${format(total)}</strong>${bonus ? `<i>${t.bonus.replace('{amount}', format(bonus))}</i>` : ''}</span>
      `;
      button.setAttribute('aria-label', t.aria.replace('{pay}', format(amount)).replace('{receive}', format(total)));
    });
  }

  document.addEventListener('kh-language-change', render);
  render();
})();
