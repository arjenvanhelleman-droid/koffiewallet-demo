const STORAGE_KEY="koffiewallet-demo-state-v2";
const OLD_STORAGE_KEY="koffiewallet-demo-state-v1";
const STARTING_BALANCE=20;

const products=[
  {id:"espresso",nameKey:"product_espresso",descriptionKey:"desc_espresso",price:3,category:"coffee",icon:"☕",stampEligible:true},
  {id:"cappuccino",nameKey:"product_cappuccino",descriptionKey:"desc_cappuccino",price:4,category:"coffee",icon:"☁️",stampEligible:true},
  {id:"flat-white",nameKey:"product_flatwhite",descriptionKey:"desc_flatwhite",price:4.5,category:"coffee",icon:"🥛",stampEligible:true},
  {id:"filter",nameKey:"product_filter",descriptionKey:"desc_filter",price:4,category:"coffee",icon:"🫗",stampEligible:true},
  {id:"chai",nameKey:"product_chai",descriptionKey:"desc_chai",price:4.8,category:"other",icon:"🌿",stampEligible:true},
  {id:"thee",nameKey:"product_tea",descriptionKey:"desc_tea",price:4,category:"other",icon:"🫖",stampEligible:true},
  {id:"brownie",nameKey:"product_brownie",descriptionKey:"desc_brownie",price:3.8,category:"food",icon:"🍫",stampEligible:false},
  {id:"bun",nameKey:"product_bun",descriptionKey:"desc_bun",price:4,category:"food",icon:"🥮",stampEligible:false},
  {id:"cookie",nameKey:"product_cookie",descriptionKey:"desc_cookie",price:3.5,category:"food",icon:"🍪",stampEligible:false}
];

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
let currencyFormatter;
let dateFormatter;
let toastTimer;
let activeCategory="all";
let state=loadState();

function tr(key,variables={}){return window.KH_I18N?.t(key,variables)??key}
function refreshFormatters(){
  const locale=window.KH_I18N?.locale?.()||"nl-BE";
  currencyFormatter=new Intl.NumberFormat(locale,{style:"currency",currency:"EUR",minimumFractionDigits:2});
  dateFormatter=new Intl.DateTimeFormat(locale,{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
}
refreshFormatters();

function uid(){return globalThis.crypto?.randomUUID?.()||`id-${Date.now()}-${Math.random().toString(16).slice(2)}`}
function money(value){return currencyFormatter.format(value)}
function round(value){return Math.round((value+Number.EPSILON)*100)/100}
function productName(product){return tr(product.nameKey)}

function initialState(){
  const walletId=`DKH-DEMO-${Math.floor(1000+Math.random()*9000)}`;
  return{
    balance:STARTING_BALANCE,
    bonusTotal:0,
    stamps:0,
    rewards:0,
    walletId,
    cart:{},
    transactions:[{id:uid(),type:"topup",descriptionKey:"startCredit",amount:STARTING_BALANCE,createdAt:new Date().toISOString()}]
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
  }catch(error){console.warn("Stored demo data could not be read.",error)}
  return initialState();
}

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function addTransaction(type,description,amount,details={}){
  state.transactions.unshift({id:uid(),type,description,amount,createdAt:new Date().toISOString(),...details});
  state.transactions=state.transactions.slice(0,50);
}

function signedAmount(transaction){return transaction.type==="purchase"?-Math.abs(transaction.amount):Math.abs(transaction.amount)}

function transactionDescription(transaction){
  if(Array.isArray(transaction.items)){
    return transaction.items.map(item=>{
      const product=products.find(entry=>entry.id===item.id);
      return `${item.quantity}× ${product?productName(product):item.id}`;
    }).join(", ");
  }
  if(transaction.descriptionKey==="creditWithBonus"){
    return tr("creditWithBonus",{amount:money(transaction.creditAmount||0),bonus:money(transaction.bonusAmount||0)});
  }
  if(transaction.descriptionKey)return tr(transaction.descriptionKey);
  const legacy={"Demo-starttegoed":"startCredit","Tegoed toegevoegd":"creditAddedTransaction"};
  if(legacy[transaction.description])return tr(legacy[transaction.description]);
  return transaction.description||tr("creditAddedTransaction");
}

function transactionMarkup(transaction){
  const value=signedAmount(transaction);
  return `<li class="transaction"><span class="transaction-copy"><b>${escapeHtml(transactionDescription(transaction))}</b><small>${dateFormatter.format(new Date(transaction.createdAt))}</small></span><strong class="transaction-amount ${value>=0?"positive":"negative"}">${value>=0?"+":"−"} ${money(Math.abs(value))}</strong></li>`;
}

function escapeHtml(value){
  return String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
}

function renderTransactions(){
  const empty=`<li class="empty">${tr("emptyTransactions")}</li>`;
  const all=state.transactions.length?state.transactions.map(transactionMarkup).join(""):empty;
  $("#transaction-list").innerHTML=all;
  $("#recent-transactions").innerHTML=state.transactions.length?state.transactions.slice(0,3).map(transactionMarkup).join(""):empty;
}

function renderProducts(){
  const visible=activeCategory==="all"?products:products.filter(product=>product.category===activeCategory);
  $("#product-grid").innerHTML=visible.map(product=>`<article class="product"><span class="product-icon" aria-hidden="true">${product.icon}</span><div><h3>${escapeHtml(productName(product))}</h3><p>${escapeHtml(tr(product.descriptionKey))}</p></div><div class="product-bottom"><b>${money(product.price)}</b><button type="button" data-add-product="${product.id}" aria-label="${escapeHtml(tr("addProductAria",{product:productName(product)}))}">+</button></div></article>`).join("");
}

function cartEntries(){
  return Object.entries(state.cart).map(([id,quantity])=>({product:products.find(item=>item.id===id),quantity})).filter(item=>item.product&&item.quantity>0);
}

function cartTotal(){return round(cartEntries().reduce((sum,item)=>sum+item.product.price*item.quantity,0))}

function renderCart(){
  const entries=cartEntries();
  $("#cart-items").innerHTML=entries.length?entries.map(({product,quantity})=>`<div class="cart-item"><div><b>${escapeHtml(productName(product))}</b><small>${money(product.price)} ${tr("perItem")}</small></div><div class="qty"><button type="button" data-change-product="${product.id}" data-delta="-1" aria-label="${escapeHtml(tr("oneLessAria",{product:productName(product)}))}">−</button><b>${quantity}</b><button type="button" data-change-product="${product.id}" data-delta="1" aria-label="${escapeHtml(tr("oneMoreAria",{product:productName(product)}))}">+</button></div></div>`).join(""):`<div class="empty">${tr("cartEmpty")}</div>`;
  const total=cartTotal();
  $("#cart-total").textContent=money(total);
  $("#pay-cart").disabled=total<=0;
  $("#cart-note").textContent=total<=0?tr("addProductFirst"):total>state.balance?tr("shortBy",{amount:money(total-state.balance)}):tr("enoughBalance");
}

function renderQr(){
  const payload=`https://arjenvanhelleman-droid.github.io/koffiewallet-demo/?wallet=${encodeURIComponent(state.walletId)}`;
  $("#qr-code").src=`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(payload)}`;
  $("#qr-code").alt=tr("qrAlt",{id:state.walletId});
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
  document.dispatchEvent(new CustomEvent("kh-wallet-render",{detail:{state:{...state}}}));
}

function toast(message){
  clearTimeout(toastTimer);
  const element=$("#toast");
  element.textContent=message;
  element.classList.add("show");
  toastTimer=setTimeout(()=>element.classList.remove("show"),3200);
}

function topUp(amount,bonus=0){
  if(!Number.isFinite(amount)||amount<5){toast(tr("validAmount"));return}
  amount=round(amount);bonus=round(bonus);
  state.balance=round(state.balance+amount+bonus);
  state.bonusTotal=round((state.bonusTotal||0)+bonus);
  addTransaction("topup","",amount+bonus,bonus>0?{descriptionKey:"creditWithBonus",creditAmount:amount,bonusAmount:bonus}:{descriptionKey:"creditAddedTransaction"});
  render();
  toast(tr("creditAdded",{amount:money(amount+bonus),bonus:bonus?tr("bonusIncluded",{bonus:money(bonus)}):""}));
}

function navigate(screenName){
  $$("[data-screen]").forEach(screen=>{const active=screen.dataset.screen===screenName;screen.hidden=!active;screen.classList.toggle("active",active)});
  $$(".bottom-nav [data-go]").forEach(button=>button.classList.toggle("active",button.dataset.go===screenName));
  window.scrollTo({top:0,behavior:"smooth"});
}

function addStamps(amount){
  const count=Math.max(0,Math.floor(amount));
  if(!count)return{added:0,earned:0};
  const total=(state.stamps||0)+count;
  const earned=Math.floor(total/10);
  state.stamps=total%10;
  state.rewards=(state.rewards||0)+earned;
  return{added:count,earned};
}

function addDemoStamp(){
  const result=addStamps(1);
  render();
  return result;
}

function redeemReward(){
  if((state.rewards||0)<1)return false;
  state.rewards-=1;
  render();
  return true;
}

document.addEventListener("click",event=>{
  const go=event.target.closest("[data-go]");
  if(go){event.preventDefault();navigate(go.dataset.go);return}

  const topup=event.target.closest("[data-topup]");
  if(topup){topUp(Number(topup.dataset.topup),Number(topup.dataset.bonus));return}

  const add=event.target.closest("[data-add-product]");
  if(add){const id=add.dataset.addProduct;state.cart[id]=(state.cart[id]||0)+1;renderCart();save();toast(tr("addedToOrder"));return}

  const change=event.target.closest("[data-change-product]");
  if(change){const id=change.dataset.changeProduct;state.cart[id]=Math.max(0,(state.cart[id]||0)+Number(change.dataset.delta));if(!state.cart[id])delete state.cart[id];renderCart();save();return}

  const category=event.target.closest("[data-category]");
  if(category){activeCategory=category.dataset.category;$$('[data-category]').forEach(button=>button.classList.toggle("active",button===category));renderProducts()}
});

$("#custom-topup-form").addEventListener("submit",event=>{
  event.preventDefault();
  const input=$("#custom-topup");
  const amount=Number.parseFloat(input.value);
  const bonus=amount>=50?round(amount*.1):0;
  topUp(amount,bonus);
  input.value="";
});

$("#clear-cart").addEventListener("click",()=>{state.cart={};renderCart();save();toast(tr("cartCleared"))});

$("#pay-cart").addEventListener("click",()=>{
  const entries=cartEntries();
  const total=cartTotal();
  if(!entries.length)return;
  if(total>state.balance){toast(tr("insufficient"));navigate("wallet");return}
  const qualifyingStamps=entries.filter(item=>item.product.stampEligible).reduce((sum,item)=>sum+item.quantity,0);
  const stampResult=addStamps(qualifyingStamps);
  state.balance=round(state.balance-total);
  addTransaction("purchase","",total,{items:entries.map(item=>({id:item.product.id,quantity:item.quantity}))});
  state.cart={};
  render();
  const paymentMessage=tr("paidFromWallet",{amount:money(total)});
  const stampMessage=window.KH_LOYALTY?.purchaseMessage?.(stampResult.added,stampResult.earned)||"";
  toast(stampMessage?`${paymentMessage} ${stampMessage}`:paymentMessage);
});

$("#copy-wallet-id").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(state.walletId);toast(tr("walletCopied"))}catch{toast(state.walletId)}
});

$("#reset-demo").addEventListener("click",()=>{
  if(!confirm(tr("resetConfirm")))return;
  state=initialState();
  render();
  navigate("wallet");
  toast(tr("resetDone"));
});

document.addEventListener("kh-language-change",()=>{
  refreshFormatters();
  render();
});

window.KH_WALLET_API={
  getState:()=>state,
  commit:render,
  toast,
  addDemoStamp,
  redeemReward
};

render();