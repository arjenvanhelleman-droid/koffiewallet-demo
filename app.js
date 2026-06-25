const STORAGE_KEY = "koffiewallet-demo-state-v1";
const STARTING_BALANCE = 20;

const balanceElement = document.getElementById("balance");
const transactionList = document.getElementById("transaction-list");
const topupForm = document.getElementById("topup-form");
const purchaseForm = document.getElementById("purchase-form");
const topupAmountInput = document.getElementById("topup-amount");
const purchaseAmountInput = document.getElementById("purchase-amount");
const purchaseDescriptionInput = document.getElementById("purchase-description");
const resetButton = document.getElementById("reset-button");
const messageElement = document.getElementById("message");
const quickAmountButtons = document.querySelectorAll("[data-amount]");

let messageTimer;
let state = loadState();

function createInitialState() {
  return {
    balance: STARTING_BALANCE,
    transactions: [
      {
        id: crypto.randomUUID(),
        type: "topup",
        description: "Demo-starttegoed",
        amount: STARTING_BALANCE,
        createdAt: new Date().toISOString()
      }
    ]
  };
}

function loadState() {
  try {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (!storedState) return createInitialState();

    const parsedState = JSON.parse(storedState);
    if (
      typeof parsedState.balance !== "number" ||
      !Array.isArray(parsedState.transactions)
    ) {
      return createInitialState();
    }

    return parsedState;
  } catch (error) {
    console.warn("De opgeslagen demo kon niet worden gelezen.", error);
    return createInitialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatCurrency(value, showSign = false) {
  const formatter = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2
  });

  if (!showSign) return formatter.format(value);
  const sign = value >= 0 ? "+" : "−";
  return `${sign} ${formatter.format(Math.abs(value))}`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateString));
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function parseAmount(input) {
  const amount = Number.parseFloat(input.value);
  return Number.isFinite(amount) ? roundMoney(amount) : NaN;
}

function addTransaction(type, description, amount) {
  state.transactions.unshift({
    id: crypto.randomUUID(),
    type,
    description,
    amount,
    createdAt: new Date().toISOString()
  });

  state.transactions = state.transactions.slice(0, 30);
}

function render() {
  balanceElement.textContent = formatCurrency(state.balance);
  transactionList.innerHTML = "";

  if (state.transactions.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "Er zijn nog geen transacties.";
    transactionList.appendChild(emptyItem);
    return;
  }

  state.transactions.forEach((transaction) => {
    const item = document.createElement("li");
    item.className = "transaction-item";

    const copy = document.createElement("div");
    copy.className = "transaction-copy";

    const title = document.createElement("span");
    title.className = "transaction-title";
    title.textContent = transaction.description;

    const date = document.createElement("span");
    date.className = "transaction-date";
    date.textContent = formatDate(transaction.createdAt);

    const amount = document.createElement("span");
    const signedAmount = transaction.type === "purchase"
      ? -Math.abs(transaction.amount)
      : Math.abs(transaction.amount);

    amount.className = `transaction-amount ${signedAmount >= 0 ? "positive" : "negative"}`;
    amount.textContent = formatCurrency(signedAmount, true);

    copy.append(title, date);
    item.append(copy, amount);
    transactionList.appendChild(item);
  });
}

function showMessage(text, type) {
  clearTimeout(messageTimer);
  messageElement.textContent = text;
  messageElement.className = `message ${type}`;

  messageTimer = window.setTimeout(() => {
    messageElement.textContent = "";
    messageElement.className = "message";
  }, 3500);
}

function addCredit(amount, description = "Tegoed toegevoegd") {
  if (!Number.isFinite(amount) || amount <= 0) {
    showMessage("Vul een geldig bedrag in.", "error");
    return;
  }

  state.balance = roundMoney(state.balance + amount);
  addTransaction("topup", description, amount);
  saveState();
  render();
  showMessage(`${formatCurrency(amount)} is aan je demo-wallet toegevoegd.`, "success");
}

topupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = parseAmount(topupAmountInput);
  addCredit(amount);
  topupForm.reset();
});

quickAmountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const amount = Number.parseFloat(button.dataset.amount);
    addCredit(amount, `Snel tegoed van ${formatCurrency(amount)}`);
  });
});

purchaseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = parseAmount(purchaseAmountInput);
  const description = purchaseDescriptionInput.value.trim() || "Koffie-aankoop";

  if (!Number.isFinite(amount) || amount <= 0) {
    showMessage("Vul een geldig aankoopbedrag in.", "error");
    return;
  }

  if (amount > state.balance) {
    showMessage("Er staat onvoldoende tegoed in de wallet.", "error");
    return;
  }

  state.balance = roundMoney(state.balance - amount);
  addTransaction("purchase", description, amount);
  saveState();
  render();
  showMessage(`${formatCurrency(amount)} is afgerekend uit de demo-wallet.`, "success");

  purchaseAmountInput.value = "";
  purchaseAmountInput.focus();
});

resetButton.addEventListener("click", () => {
  const confirmed = window.confirm("Wil je de demo terugzetten naar het beginsaldo?");
  if (!confirmed) return;

  state = createInitialState();
  saveState();
  render();
  showMessage("De demo is teruggezet naar het beginsaldo.", "success");
});

saveState();
render();
