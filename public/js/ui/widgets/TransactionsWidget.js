/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода.
 */
class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * @param {HTMLElement} element - Элемент виджета.
   */
  constructor(element) {
    if (!element) {
      throw new Error("Элемент не существует");
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна.
   */
  registerEvents() {
    const createIncomeBtn = this.element.querySelector('.create-income-button');
    const createExpenseBtn = this.element.querySelector('.create-expense-button');

    // Проверка на существование кнопок
    if (createIncomeBtn) {
      createIncomeBtn.addEventListener('click', () => {
        App.getModal('newIncome').open();
      });
    } else {
      console.error("Кнопка 'Новый доход' не найдена.");
    }

    if (createExpenseBtn) {
      createExpenseBtn.addEventListener('click', () => {
        App.getModal('newExpense').open();
      });
    } else {
      console.error("Кнопка 'Новый расход' не найдена.");
    }
  }
}