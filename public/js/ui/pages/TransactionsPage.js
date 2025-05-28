/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    this.element = element;
    if (!element) {
      throw new Error ('Элемент не существует');
    }
    this.lastOptions = null;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.querySelector('.remove-account').addEventListener('click', () =>{
      this.removeAccount();
    });

    this.element.addEventListener('click', (event) => {
      const transactionElement = event.target.closest('.transaction__remove');
      if (transactionElement) {
        const transactionId = transactionElement.dataset.id;
        this.removeTransaction(transactionId);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    };
    if (confirm('Вы действительно хотите удалить аккаунт?')) {
      Account.remove({ id: this.lastOptions.account_id },  (err,response) => {
        if (response?.success) {
          this.clear();
          App.updateWidgets();
          App.updateForms();
        };
      });
    };
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({ id: id }, (err, response) => {
        if(response?.success) {
          App.update()
        };
      });
    };
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){  
    if(!options) {
      return;
    }
    this.lastOptions = options;

    Account.get(options.account_id, (error, accountResponse) => {
      if(error) {
        return;
      }
      if(accountResponse?.success) {
        this.renderTitle(accountResponse.data.name);
        Transaction.list({ account_id: options.account_id }, (error, transactionResponse) => {
          if (error) {
            return;
          }
          if (transactionResponse?.success) {
            this.renderTransactions(transactionResponse.data);
          }
        });
      };
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() { 
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.element.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    return new Date(date).toLocaleString('ru-RU', {
      dateStyle: "long",
      timeStyle: "short"
    });
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
getTransactionHTML(item) {
  const formattedDate = this.formatDate(item.created_at);
  const transactionType = item.type === 'income' ? 'transaction_income' : 'transaction_expense';

  const wrapper = document.createElement('div');
  wrapper.className = `transaction ${transactionType} row`;

  const detailsCol = document.createElement('div');
  detailsCol.className = 'col-md-7 transaction__details';

  const iconDiv = document.createElement('div');
  iconDiv.className = 'transaction__icon';
  const iconSpan = document.createElement('span');
  iconSpan.className = 'fa fa-money fa-2x';
  iconDiv.appendChild(iconSpan);

  const infoDiv = document.createElement('div');
  infoDiv.className = 'transaction__info';

  const title = document.createElement('h4');
  title.className = 'transaction__title';
  title.textContent = item.name;

  const dateDiv = document.createElement('div');
  dateDiv.className = 'transaction__date';
  dateDiv.textContent = formattedDate;

  infoDiv.appendChild(title);
  infoDiv.appendChild(dateDiv);

  detailsCol.appendChild(iconDiv);
  detailsCol.appendChild(infoDiv);

  const sumCol = document.createElement('div');
  sumCol.className = 'col-md-3';

  const sumDiv = document.createElement('div');
  sumDiv.className = 'transaction__summ';
  sumDiv.textContent = item.sum + ' ';

  const currencySpan = document.createElement('span');
  currencySpan.className = 'currency';
  currencySpan.textContent = '₽';

  sumDiv.appendChild(currencySpan);
  sumCol.appendChild(sumDiv);

  const controlCol = document.createElement('div');
  controlCol.className = 'col-md-2 transaction__controls';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-danger transaction__remove';
  deleteBtn.dataset.id = item.id;

  const trashIcon = document.createElement('i');
  trashIcon.className = 'fa fa-trash';

  deleteBtn.appendChild(trashIcon);
  controlCol.appendChild(deleteBtn);

  wrapper.appendChild(detailsCol);
  wrapper.appendChild(sumCol);
  wrapper.appendChild(controlCol);

  return wrapper.outerHTML;
}
  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const contentElement = this.element.querySelector('.content');
    contentElement.innerHTML = data.map(item => this.getTransactionHTML(item)).join('');
  };
}