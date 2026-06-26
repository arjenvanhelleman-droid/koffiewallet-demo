const STORAGE_KEY="koffiewallet-demo-state-v2";
const OLD_STORAGE_KEY="koffiewallet-demo-state-v1";
const STARTING_BALANCE=20;

const products=[
  {id:"espresso",name:"Espresso",price:3,category:"coffee",icon:"☕",description:"Kort, krachtig en puur."},
  {id:"cappuccino",name:"Cappuccino",price:4,category:"coffee",icon:"☁️",description:"Espresso met zachte melkschuim."},
  {id:"flat-white",name:"Flat white",price:4.5,category:"coffee",icon:"🥛",description:"Dubbele espresso, fluweelzachte melk."},
  {id:"filter",name:"Filterkoffie",price:4,category:"coffee",icon:"🫗",description:"Helder, aromatisch en rustig gezet."},
  {id:"chai",name:"Chai",price:4.8,category:"other",icon:"🌿",description:"Kruidig, warm en zacht."},
  {id:"thee",name:"Thee",price:4,category:"other",icon:"🫖",description:"Een zorgvuldig gekozen infusie."},
  {id:"brownie",name:"Brownie",price:3.8,category:"food",icon:"🍫",description:"Rijk, smeuïg en chocoladevol."},
  {id:"bun",name:"Cinnamon bun",price:4,category:"food",icon:"🥮",description:"Zacht gebak met kaneel."},
  {id:"cookie",name:"Cookie",price:3.5,category:"food",icon:"🍪",description:"Krokant buiten, zacht vanbinnen."}
];

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const euro=new Intl.NumberFormat("nl-BE",{style:"currency",currency:"EUR",minimumFractionDigits:2});
const dateFormat=new Intl.DateTimeFormat("nl-BE",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
let toastTimer;
let activeCategory="all";
let state=loadState();

function uid(){return globalThis.crypto?.randomUUID?.()||`id-${Date.now()}-${Math.random().toString(16).slice(2)}`}
function money(value){return euro.format(value)}
function round(value){return Math.round((value+Number.EPSILON)*100)/100}

function initialState(){
  const walletId=`DKH-DEMO-${Math.floor(1000+Math.random()*9000)}`;
  return{
    balance:STARTING_BALANCE,
    bonusTotal:0,
    walletId,
    cart:{},
    transactions:[{id:uid(),type:"topup",description:"Demo-starttegoed",amount:STARTING_BALANCE,createdAt:new Date().toISOString()}]
  };
}

function loadState(){
  try{
    const current=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(current&&typeof current.balance==="number"&&Array.isArray(current.transactions)){
      return{...initialState(),...current,cart:current.cart||{}};
    }
    const old=JSON.parse(localStorage.getItem(OLD_STORAGE_KEY));
    if(old&&typeof old.balance==="number"&&Array.isArray(old.transactions)){
      const migrated=initialState();
      migrated.balance=old.balance;
      migrated.transactions=old.transactions;
      return migrated;
    }
  }catch(error){console.warn("Opgeslagen demo kon niet worden gelezen.",error)}
  return initialState();
}

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function addTransaction(type,description,amount){
  state.transactions.unshift({id:uid(),type,description,amount,createdAt:new Date().toISOString()});
  state.transactions=state.transactions.slice(0,50);
}

function signedAmount(transaction){return transaction.type==="purchase"?-Math.abs(transaction.amount):Math.abs(transaction.amount)}

function transactionMarkup(transaction){
  const value=signedAmount(transaction);
  return `<li class="transaction"><span class="transaction-copy"><b>${escapeHtml(transaction.description)}</b><small>${dateFormat.format(new Date(transaction.createdAt))}</small></span><strong class="transaction-amount ${value>=0?"positive":"negative"}">${value>=0?"+":"−"} ${money(Math.abs(value))}</strong></li>`;
}

function escapeHtml(value){
  return String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
}

function renderTransactions(){
  const all=state.transactions.length?state.transactions.map(transactionMarkup).join(""):'<li class="empty">Er zijn nog geen transacties.</li>';
  $("#transaction-list").innerHTML=all;
  $("#recent-transactions").innerHTML=state.transactions.length?state.transactions.slice(0,3).map(transactionMarkup).join(""):'<li class="empty">Er zijn nog geen transacties.</li>';
}

function renderProducts(){
  const visible=activeCategory==="all"?products:products.filter(product=>product.category===activeCategory);
  $("#product-grid").innerHTML=visible.map(product=>`<article class="product"><span class="product-icon" aria-hidden="true">${product.icon}</span><div><h3>${product.name}</h3><p>${product.description}</p></div><div class="product-bottom"><b>${money(product.price)}</b><button type="button" data-add-product="${product.id}" aria-label="Voeg ${product.name} toe">+</button></div></article>`).join("");
}

function cartEntries(){
  return Object.entries(state.cart).map(([id,quantity])=>({product:products.find(item=>item.id===id),quantity})).filter(item=>item.product&&item.quantity>0);
}

function cartTotal(){return round(cartEntries().reduce((sum,item)=>sum+item.product.price*item.quantity,0))}

function renderCart(){
  const entries=cartEntries();
  $("#cart-items").innerHTML=entries.length?entries.map(({product,quantity})=>`<div class="cart-item"><div><b>${product.name}</b><small>${money(product.price)} per stuk</small></div><div class="qty"><button type="button" data-change-product="${product.id}" data-delta="-1" aria-label="Eén ${product.name} minder">−</button><b>${quantity}</b><button type="button" data-change-product="${product.id}" data-delta="1" aria-label="Eén ${product.name} meer">+</button></div></div>`).join(""):'<div class="empty">Je winkelmandje is nog leeg.</div>';
  const total=cartTotal();
  $("#cart-total").textContent=money(total);
  $("#pay-cart").disabled=total<=0;
  $("#cart-note").textContent=total<=0?"Voeg eerst een product toe.":total>state.balance?`Je komt ${money(total-state.balance)} tekort.`:"Voldoende saldo om af te rekenen.";
}

function renderQr(){
  const payload=`https://arjenvanhelleman-droid.github.io/koffiewallet-demo/?wallet=${encodeURIComponent(state.walletId)}`;
  $("#qr-code").src=`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(payload)}`;
  $("#qr-code").alt=`QR-code voor wallet ${state.walletId}`;
}

function render(){
  $("#balance").textContent=money(state.balance);
  $("#order-balance").textContent=money(state.balance);
  $("#qr-balance").textContent=money(state.balance);
  $("#bonus-total").textContent=money(state.bonusTotal||0);
  $("#purchase-count").textContent=state.transactions.filter(item=>item.type==="purchase").length;
  $("#wallet-id").textContent=state.walletId;
  $("#wallet-short-id").textContent=state.walletId.replace("DKH-DEMO-", "KH-");
  renderProducts();
  renderCart();
  renderTransactions();
  renderQr();
  save();
}

function toast(message){
  clearTimeout(toastTimer);
  const element=$("#toast");
  element.textContent=message;
  element.classList.add("show");
  toastTimer=setTimeout(()=>element.classList.remove("show"),3200);
}

function topUp(amount,bonus=0){
  if(!Number.isFinite(amount)||amount<5){toast("Kies een geldig bedrag vanaf € 5.");return}
  amount=round(amount);bonus=round(bonus);
  state.balance=round(state.balance+amount+bonus);
  state.bonusTotal=round((state.bonusTotal||0)+bonus);
  addTransaction("topup",bonus>0?`Tegoed ${money(amount)} + bonus ${money(bonus)}`:`Tegoed toegevoegd`,amount+bonus);
  render();
  toast(`${money(amount+bonus)} toegevoegd${bonus?` inclusief ${money(bonus)} bonus`:""}.`);
}

function navigate(screenName){
  $$("[data-screen]").forEach(screen=>{const active=screen.dataset.screen===screenName;screen.hidden=!active;screen.classList.toggle("active",active)});
  $$(".bottom-nav [data-go]").forEach(button=>button.classList.toggle("active",button.dataset.go===screenName));
  window.scrollTo({top:0,behavior:"smooth"});
}

document.addEventListener("click",event=>{
  const go=event.target.closest("[data-go]");
  if(go){event.preventDefault();navigate(go.dataset.go);return}

  const topup=event.target.closest("[data-topup]");
  if(topup){topUp(Number(topup.dataset.topup),Number(topup.dataset.bonus));return}

  const add=event.target.closest("[data-add-product]");
  if(add){const id=add.dataset.addProduct;state.cart[id]=(state.cart[id]||0)+1;renderCart();save();toast("Toegevoegd aan je bestelling.");return}

  const change=event.target.closest("[data-change-product]");
  if(change){const id=change.dataset.changeProduct;state.cart[id]=Math.max(0,(state.cart[id]||0)+Number(change.dataset.delta));if(!state.cart[id])delete state.cart[id];renderCart();save();return}

  const category=event.target.closest("[data-category]");
  if(category){activeCategory=category.dataset.category;$$("[data-category]").forEach(button=>button.classList.toggle("active",button===category));renderProducts()}
});

$("#custom-topup-form").addEventListener("submit",event=>{
  event.preventDefault();
  const input=$("#custom-topup");
  const amount=Number.parseFloat(input.value);
  const bonus=amount>=50?round(amount*.1):0;
  topUp(amount,bonus);
  input.value="";
});

$("#clear-cart").addEventListener("click",()=>{state.cart={};renderCart();save();toast("Winkelmandje leeggemaakt.")});

$("#pay-cart").addEventListener("click",()=>{
  const entries=cartEntries();
  const total=cartTotal();
  if(!entries.length)return;
  if(total>state.balance){toast("Onvoldoende tegoed. Laad eerst je wallet op.");navigate("wallet");return}
  const description=entries.map(item=>`${item.quantity}× ${item.product.name}`).join(", ");
  state.balance=round(state.balance-total);
  addTransaction("purchase",description,total);
  state.cart={};
  render();
  toast(`${money(total)} afgerekend uit je wallet.`);
});

$("#copy-wallet-id").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(state.walletId);toast("Walletnummer gekopieerd.")}catch{toast(`Walletnummer: ${state.walletId}`)}
});

$("#reset-demo").addEventListener("click",()=>{
  if(!confirm("Wil je de hele demo terugzetten naar het beginsaldo?"))return;
  state=initialState();
  render();
  navigate("wallet");
  toast("De demo is opnieuw ingesteld.");
});

render();