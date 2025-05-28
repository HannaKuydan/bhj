/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element, type) {
    super(element);
    this.type = type;
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(User.current(), (error, response) => {
      if (error) {
        alert("Ошибка сети");
        return;
      }
      if (response && response.success && response.data) {
        const select = this.element.querySelector(".accounts-select");

        const optionsHtml = response.data.reduce((html, account) => {
          return (
            html + `<option value="${account.id}">${account.name}</option>`
          );
        }, "");

        select.innerHTML = optionsHtml;
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (error, response) => {
      if (error) {
        alert("Ошибка сети");
        return;
      }
      if (response.success) {
        App.update();
        this.element.reset();

        const modalId = this.type === "income" ? "newIncome" : "newExpense";
        const modal = App.getModal(modalId);
        modal.close();
      } else {
        alert(response.error || "ошибка транзакции");
      }
    });
  }
}
