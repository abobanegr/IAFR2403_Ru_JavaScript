const fs = require('fs');

class TransactionAnalyzer {
  /**
   * @param {Object[]} transactions - массив транзакций
   */
  constructor(transactions = []) {
    this.transactions = transactions;
  }

  /**
   * Добавить новую транзакцию
   * @param {Object} transaction
   */
  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  /**
   * Получить все транзакции
   * @returns {Object[]}
   */
  getAllTransaction() {
    return this.transactions;
  }

  /**
   * Уникальные типы транзакций
   * @returns {string[]}
   */
  getUniqueTransactionType() {
    return [...new Set(this.transactions.map(t => t.transaction_type))];
  }

  /**
   * Общая сумма транзакций
   * @returns {number}
   */
  calculateTotalAmount() {
    return this.transactions.reduce((sum, t) => sum + parseFloat(t.transaction_amount), 0);
  }

  /**
   * Общая сумма за дату
   * @param {number} [year]
   * @param {number} [month]
   * @param {number} [day]
   * @returns {number}
   */
  calculateTotalAmountByDate(year, month, day) {
    return this.transactions.filter(t => {
      const [y, m, d] = t.transaction_date.split('-').map(Number);
      return (!year || y === year) &&
             (!month || m === month) &&
             (!day || d === day);
    }).reduce((sum, t) => sum + parseFloat(t.transaction_amount), 0);
  }

  /**
   * Получить транзакции по типу
   * @param {string} type
   * @returns {Object[]}
   */
  getTransactionByType(type) {
    return this.transactions.filter(t => t.transaction_type === type);
  }

  /**
   * Получить транзакции в диапазоне дат
   * @param {string} startDate
   * @param {string} endDate
   * @returns {Object[]}
   */
  getTransactionsInDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.transactions.filter(t => {
      const d = new Date(t.transaction_date);
      return d >= start && d <= end;
    });
  }

  /**
   * Получить транзакции по магазину
   * @param {string} merchantName
   * @returns {Object[]}
   */
  getTransactionsByMerchant(merchantName) {
    return this.transactions.filter(t => t.merchant_name === merchantName);
  }

  /**
   * Средняя сумма транзакции
   * @returns {number}
   */
  calculateAverageTransactionAmount() {
    if (this.transactions.length === 0) return 0;
    return this.calculateTotalAmount() / this.transactions.length;
  }

  /**
   * Транзакции в диапазоне суммы
   * @param {number} min
   * @param {number} max
   * @returns {Object[]}
   */
  getTransactionsByAmountRange(min, max) {
    return this.transactions.filter(t => {
      const amount = parseFloat(t.transaction_amount);
      return amount >= min && amount <= max;
    });
  }

  /**
   * Общая сумма дебетовых транзакций
   * @returns {number}
   */
  calculateTotalDebitAmount() {
    return this.transactions
      .filter(t => t.transaction_type === 'debit')
      .reduce((sum, t) => sum + parseFloat(t.transaction_amount), 0);
  }

  /**
   * Месяц с наибольшим числом транзакций
   * @returns {string}
   */
  findMostTransactionsMonth() {
    const counts = {};
    this.transactions.forEach(t => {
      const month = t.transaction_date.slice(0, 7);
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  /**
   * Месяц с наибольшим числом дебетовых транзакций
   * @returns {string}
   */
  findMostDebitTransactionMonth() {
    const counts = {};
    this.transactions
      .filter(t => t.transaction_type === 'debit')
      .forEach(t => {
        const month = t.transaction_date.slice(0, 7);
        counts[month] = (counts[month] || 0) + 1;
      });
    return Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  /**
   * Каких транзакций больше: debit / credit / equal
   * @returns {string}
   */
  mostTransactionTypes() {
    let debit = 0, credit = 0;
    this.transactions.forEach(t => {
      if (t.transaction_type === 'debit') debit++;
      else if (t.transaction_type === 'credit') credit++;
    });
    if (debit > credit) return 'debit';
    if (credit > debit) return 'credit';
    return 'equal';
  }

  /**
   * Транзакции до указанной даты
   * @param {string} date
   * @returns {Object[]}
   */
  getTransactionsBeforeDate(date) {
    const d = new Date(date);
    return this.transactions.filter(t => new Date(t.transaction_date) < d);
  }

  /**
   * Найти транзакцию по ID
   * @param {string} id
   * @returns {Object | undefined}
   */
  findTransactionById(id) {
    return this.transactions.find(t => t.transaction_id === id);
  }

  /**
   * Получить все описания транзакций
   * @returns {string[]}
   */
  mapTransactionDescriptions() {
    return this.transactions.map(t => t.transaction_description);
  }
}

// Загрузка JSON
function loadTransactions(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// ========== Тест ==========
const rawTransactions = loadTransactions('./JI_01/transactions.json');
const analyzer = new TransactionAnalyzer(rawTransactions);

console.log("1. Все транзакции:", analyzer.getAllTransaction());
console.log("2. Уникальные типы транзакций:", analyzer.getUniqueTransactionType());
console.log("3. Общая сумма всех транзакций:", analyzer.calculateTotalAmount());
console.log("4. Общая сумма за 2019-01-01:", analyzer.calculateTotalAmountByDate(2019, 1, 1));
console.log("5. Только дебетовые транзакции:", analyzer.getTransactionByType('debit'));
console.log("6. Транзакции в диапазоне 2019-01-01 - 2019-01-03:", analyzer.getTransactionsInDateRange('2019-01-01', '2019-01-03'));
console.log("7. Транзакции у SuperMart:", analyzer.getTransactionsByMerchant('SuperMart'));
console.log("8. Среднее значение транзакций:", analyzer.calculateAverageTransactionAmount());
console.log("9. Транзакции от 90 до 100:", analyzer.getTransactionsByAmountRange(90, 100));
console.log("10. Сумма всех дебетовых транзакций:", analyzer.calculateTotalDebitAmount());
console.log("11. Месяц с наибольшим числом транзакций:", analyzer.findMostTransactionsMonth());
console.log("12. Месяц с наибольшим числом дебетовых транзакций:", analyzer.findMostDebitTransactionMonth());
console.log("13. Какого типа транзакций больше:", analyzer.mostTransactionTypes());
console.log("14. Транзакции до 2019-01-03:", analyzer.getTransactionsBeforeDate('2019-01-03'));
console.log("15. Найти транзакцию с ID=2:", analyzer.findTransactionById('2'));
console.log("16. Только описания транзакций:", analyzer.mapTransactionDescriptions());