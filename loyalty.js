(() => {
  const api = window.KH_WALLET_API;
  const stats = document.querySelector('.stats');
  if (!api || !stats) return;

  const copy = {
    nl: {
      title:'Digitale stempelkaart', subtitle:'Elke afgerekende drank telt mee', loyalty:'SPAARKAART', heading:'Spaar voor een gratis koffie', intro:'Je ontvangt automatisch één stempel per afgerekende drank. Bij 10 stempels krijg je een gratis koffiereward.', progress:'Jouw voortgang', rewards:'Beschikbare gratis koffies', demoStamp:'Demo-stempel toevoegen', redeem:'Gratis koffie gebruiken', note:'Demo: in een echte versie kan alleen de kassa stempels toevoegen en een reward inwisselen.', close:'Sluiten', rewardReady:'Gratis koffie beschikbaar!', remaining:'Nog {count} stempel(s) te gaan', stampAdded:'1 demo-stempel toegevoegd.', rewardEarned:'Je hebt een gratis koffie verdiend!', noReward:'Je hebt nog geen gratis koffie beschikbaar.', rewardUsed:'Gratis koffiereward gebruikt.', purchaseOne:'1 stempel toegevoegd.', purchaseMany:'{count} stempels toegevoegd.', purchaseReward:'Gratis koffie verdiend!'
    },
    fr: {
      title:'Carte de fidélité numérique', subtitle:'Chaque boisson payée compte', loyalty:'CARTE DE FIDÉLITÉ', heading:'Épargnez pour un café gratuit', intro:'Vous recevez automatiquement un tampon par boisson payée. Après 10 tampons, vous obtenez une récompense café gratuite.', progress:'Votre progression', rewards:'Cafés gratuits disponibles', demoStamp:'Ajouter un tampon démo', redeem:'Utiliser un café gratuit', note:'Démo : dans une version réelle, seule la caisse peut ajouter des tampons et utiliser une récompense.', close:'Fermer', rewardReady:'Café gratuit disponible !', remaining:'Encore {count} tampon(s)', stampAdded:'1 tampon démo ajouté.', rewardEarned:'Vous avez gagné un café gratuit !', noReward:'Aucun café gratuit disponible.', rewardUsed:'Récompense café gratuite utilisée.', purchaseOne:'1 tampon ajouté.', purchaseMany:'{count} tampons ajoutés.', purchaseReward:'Café gratuit gagné !'
    },
    en: {
      title:'Digital stamp card', subtitle:'Every paid drink counts', loyalty:'LOYALTY CARD', heading:'Save for a free coffee', intro:'You automatically receive one stamp for every paid drink. At 10 stamps, you earn one free-coffee reward.', progress:'Your progress', rewards:'Free coffees available', demoStamp:'Add demo stamp', redeem:'Use free coffee', note:'Demo: in a real version, only the till can add stamps or redeem a reward.', close:'Close', rewardReady:'Free coffee available!', remaining:'{count} stamp(s) to go', stampAdded:'1 demo stamp added.', rewardEarned:'You earned a free coffee!', noReward:'You do not have a free coffee available yet.', rewardUsed:'Free-coffee reward used.', purchaseOne:'1 stamp added.', purchaseMany:'{count} stamps added.', purchaseReward:'Free coffee earned!'
    },
    es: {
      title:'Tarjeta digital de sellos', subtitle:'Cada bebida pagada cuenta', loyalty:'TARJETA DE FIDELIDAD', heading:'Ahorra para un café gratis', intro:'Recibes automáticamente un sello por cada bebida pagada. Con 10 sellos obtienes una recompensa de café gratis.', progress:'Tu progreso', rewards:'Cafés gratis disponibles', demoStamp:'Añadir sello de demo', redeem:'Usar café gratis', note:'Demo: en una versión real, solo la caja puede añadir sellos o canjear una recompensa.', close:'Cerrar', rewardReady:'¡Café gratis disponible!', remaining:'Faltan {count} sello(s)', stampAdded:'Se ha añadido 1 sello de demo.', rewardEarned:'¡Has ganado un café gratis!', noReward:'Todavía no tienes un café gratis disponible.', rewardUsed:'Recompensa de café gratis utilizada.', purchaseOne:'Se ha añadido 1 sello.', purchaseMany:'Se han añadido {count} sellos.', purchaseReward:'¡Café gratis conseguido!'
    }
  };

  function language(){return window.KH_I18N?.getLanguage?.()||'nl'}
  function text(key,variables={}){
    let value=copy[language()]?.[key]||copy.nl[key]||key;
    Object.entries(variables).forEach(([name,replacement])=>{value=value.replaceAll(`{${name}}`,replacement)});
    return value;
  }

  const cta=document.createElement('button');
  cta.type='button';
  cta.className='loyalty-cta';
  cta.innerHTML=`<span class="loyalty-cta-copy"><strong id="loyalty-cta-title"></strong><small id="loyalty-cta-subtitle"></small></span><span class="loyalty-progress-mini" id="loyalty-mini-progress">0/10</span>`;
  stats.insertAdjacentElement('afterend',cta);

  const overlay=document.createElement('div');
  overlay.className='loyalty-overlay';
  overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML=`
    <section class="loyalty-dialog" role="dialog" aria-modal="true" aria-labelledby="loyalty-heading">
      <div class="loyalty-head">
        <div><p class="eyebrow" id="loyalty-label"></p><h2 id="loyalty-heading"></h2><p id="loyalty-intro"></p></div>
        <button type="button" class="loyalty-close" aria-label="Sluiten">×</button>
      </div>
      <div class="stamp-card">
        <div class="stamp-card-top"><span id="loyalty-progress-label"></span><strong id="loyalty-progress-value">0 / 10</strong></div>
        <div class="stamp-grid" id="stamp-grid" aria-label="Digitale stempelkaart"></div>
      </div>
      <div class="loyalty-status">
        <div class="loyalty-status-card"><span id="loyalty-status-text"></span><strong id="loyalty-status-value"></strong></div>
        <div class="loyalty-status-card"><span id="loyalty-rewards-label"></span><strong id="loyalty-rewards-value">0</strong></div>
      </div>
      <div class="loyalty-actions">
        <button type="button" class="loyalty-demo-stamp" id="loyalty-demo-stamp"></button>
        <button type="button" class="loyalty-redeem" id="loyalty-redeem"></button>
      </div>
      <p class="loyalty-note" id="loyalty-note"></p>
    </section>`;
  document.body.appendChild(overlay);

  const closeButton=overlay.querySelector('.loyalty-close');
  const demoButton=overlay.querySelector('#loyalty-demo-stamp');
  const redeemButton=overlay.querySelector('#loyalty-redeem');

  function state(){return api.getState()}

  function render(){
    const current=state();
    const stamps=Math.max(0,Math.min(9,Number(current.stamps)||0));
    const rewards=Math.max(0,Number(current.rewards)||0);
    document.querySelector('#loyalty-cta-title').textContent=text('title');
    document.querySelector('#loyalty-cta-subtitle').textContent=rewards>0?text('rewardReady'):text('subtitle');
    document.querySelector('#loyalty-mini-progress').textContent=`${stamps}/10`;
    document.querySelector('#loyalty-label').textContent=text('loyalty');
    document.querySelector('#loyalty-heading').textContent=text('heading');
    document.querySelector('#loyalty-intro').textContent=text('intro');
    document.querySelector('#loyalty-progress-label').textContent=text('progress');
    document.querySelector('#loyalty-progress-value').textContent=`${stamps} / 10`;
    document.querySelector('#loyalty-status-text').textContent=rewards>0?text('rewardReady'):text('remaining',{count:10-stamps});
    document.querySelector('#loyalty-status-value').textContent=rewards>0?'🎁':'☕';
    document.querySelector('#loyalty-rewards-label').textContent=text('rewards');
    document.querySelector('#loyalty-rewards-value').textContent=String(rewards);
    demoButton.textContent=text('demoStamp');
    redeemButton.textContent=text('redeem');
    redeemButton.disabled=rewards<1;
    document.querySelector('#loyalty-note').textContent=text('note');
    closeButton.setAttribute('aria-label',text('close'));
    const grid=document.querySelector('#stamp-grid');
    grid.innerHTML=Array.from({length:10},(_,index)=>`<span class="stamp-slot ${index<stamps?'filled':''}" aria-label="${index<stamps?'✓':'○'}">${index<stamps?'☕':'○'}</span>`).join('');
  }

  function open(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';closeButton.focus()}
  function close(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.style.overflow='';cta.focus()}

  cta.addEventListener('click',open);
  closeButton.addEventListener('click',close);
  overlay.addEventListener('click',event=>{if(event.target===overlay)close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&overlay.classList.contains('open'))close()});

  demoButton.addEventListener('click',()=>{
    const result=api.addDemoStamp();
    render();
    api.toast(result.earned>0?text('rewardEarned'):text('stampAdded'));
  });

  redeemButton.addEventListener('click',()=>{
    if(!api.redeemReward()){api.toast(text('noReward'));return}
    render();
    api.toast(text('rewardUsed'));
  });

  document.addEventListener('kh-wallet-render',render);
  document.addEventListener('kh-language-change',render);

  window.KH_LOYALTY={
    purchaseMessage(stampsAdded,rewardsEarned){
      if(!stampsAdded)return'';
      const stamps=stampsAdded===1?text('purchaseOne'):text('purchaseMany',{count:stampsAdded});
      return rewardsEarned>0?`${stamps} ${text('purchaseReward')}`:stamps;
    },
    render
  };

  render();
})();
