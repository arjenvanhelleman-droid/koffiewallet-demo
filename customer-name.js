(() => {
  const STORAGE_KEY = 'koffiewallet-customer-name';
  const defaultName = 'Arjen';
  const greeting = document.querySelector('[data-i18n="greeting"]');
  const avatar = document.querySelector('.avatar');
  if (!greeting) return;

  const copy = {
    nl: { greeting: 'Goedemorgen {name}', edit: 'Wijzig naam', prompt: 'Wat is je voornaam?' },
    fr: { greeting: 'Bonjour {name}', edit: 'Modifier le prénom', prompt: 'Quel est votre prénom ?' },
    en: { greeting: 'Good morning {name}', edit: 'Change name', prompt: 'What is your first name?' },
    es: { greeting: 'Buenos días {name}', edit: 'Cambiar nombre', prompt: '¿Cuál es tu nombre?' }
  };

  let customerName = (localStorage.getItem(STORAGE_KEY) || defaultName).trim() || defaultName;

  greeting.removeAttribute('data-i18n');
  greeting.id = 'customer-greeting';

  const row = document.createElement('div');
  row.className = 'customer-greeting-row';
  greeting.parentNode.insertBefore(row, greeting);
  row.appendChild(greeting);

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'customer-name-edit';
  editButton.textContent = '✎';
  row.appendChild(editButton);

  function language() {
    return window.KH_I18N?.getLanguage?.() || 'nl';
  }

  function render() {
    const lang = language();
    const strings = copy[lang] || copy.nl;
    greeting.textContent = strings.greeting.replace('{name}', customerName);
    editButton.setAttribute('aria-label', strings.edit);
    editButton.title = strings.edit;
    if (avatar) avatar.textContent = customerName.charAt(0).toUpperCase() || 'A';
  }

  editButton.addEventListener('click', () => {
    const strings = copy[language()] || copy.nl;
    const answer = window.prompt(strings.prompt, customerName);
    if (answer === null) return;
    const cleaned = answer.trim().slice(0, 30);
    if (!cleaned) return;
    customerName = cleaned;
    localStorage.setItem(STORAGE_KEY, customerName);
    render();
  });

  document.addEventListener('kh-language-change', render);
  render();
})();
