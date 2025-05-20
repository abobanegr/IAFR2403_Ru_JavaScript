/**
 * @typedef {Object} Transaction
 * @property {string} id - Уникальный идентификатор
 * @property {string} date - Дата и время транзакции
 * @property {number} amount - Сумма транзакции
 * @property {string} category - Категория транзакции
 * @property {string} description - Описание транзакции
 */

/**
 * Массив для хранения транзакций
 * @type {Transaction[]}
 */
const transactions = [];

// Элементы формы и таблицы
const form = document.getElementById('transaction-form');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const tableBody = document.querySelector('#transactions-table tbody');
const totalSumElem = document.getElementById('total-sum');
const fullDescriptionElem = document.getElementById('full-description');

/**
 * Генерирует уникальный ID (UUID v4 упрощённый вариант)
 * @returns {string}
 */
function generateId() {
  return 'xxxxxx'.replace(/[x]/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );
}

/**
 * Добавляет транзакцию в массив и таблицу
 * @param {Transaction} transaction
 */
function addTransaction(transaction) {
  transactions.push(transaction);

  // Создаём строку таблицы
  const tr = document.createElement('tr');
  tr.dataset.id = transaction.id;

  // Цвет строки по сумме
  tr.classList.add(transaction.amount >= 0 ? 'positive' : 'negative');

  // Краткое описание — первые 4 слова
  const shortDesc = transaction.description.split(' ').slice(0, 4).join(' ');

  tr.innerHTML = `
    <td>${transaction.id}</td>
    <td>${transaction.date}</td>
    <td>${transaction.category}</td>
    <td>${shortDesc}</td>
    <td><button class="delete-btn">Удалить</button></td>
  `;

  tableBody.appendChild(tr);

  calculateTotal();
}

/**
 * Подсчитывает и отображает общую сумму транзакций
 */
function calculateTotal() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  totalSumElem.textContent = total.toFixed(2);
}

/**
 * Удаляет транзакцию из массива и таблицы по ID
 * @param {string} id
 */
function removeTransactionById(id) {
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions.splice(index, 1);
  }
  // Удаляем строку из таблицы
  const row = tableBody.querySelector(`tr[data-id="${id}"]`);
  if (row) row.remove();

  calculateTotal();
  // Очистим подробное описание, если удалили выбранную транзакцию
  fullDescriptionElem.textContent = 'Выберите транзакцию из таблицы';
}

/**
 * Обработчик отправки формы — добавляет новую транзакцию
 * @param {Event} e
 */
function handleFormSubmit(e) {
  e.preventDefault();

  // Валидация (простейшая)
  if (!amountInput.value || !categorySelect.value || !descriptionInput.value) {
    alert('Пожалуйста, заполните все поля.');
    return;
  }

  const newTransaction = {
    id: generateId(),
    date: new Date().toLocaleString(),
    amount: parseFloat(amountInput.value),
    category: categorySelect.value,
    description: descriptionInput.value.trim(),
  };

  addTransaction(newTransaction);

  // Очистка формы
  amountInput.value = '';
  categorySelect.value = '';
  descriptionInput.value = '';
}

/**
 * Обработчик кликов по таблице — делегирование
 * Используется для удаления и показа полного описания
 * @param {MouseEvent} e
 */
function handleTableClick(e) {
  const target = e.target;

  if (target.classList.contains('delete-btn')) {
    const row = target.closest('tr');
    const id = row.dataset.id;
    removeTransactionById(id);
  } else {
    const row = target.closest('tr');
    if (row) {
      const id = row.dataset.id;
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        fullDescriptionElem.textContent = transaction.description;
      }
    }
  }
}

form.addEventListener('submit', handleFormSubmit);
tableBody.addEventListener('click', handleTableClick);