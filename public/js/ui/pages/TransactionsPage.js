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
    const buttonAccountRemove = this.element.querySelector('.remove-account');
    
    buttonAccountRemove.addEventListener('click', () =>{
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
    }
    const confirmation = confirm('Вы действительно хотите удалить аккаунт?');
    if (confirmation) {
      Account.remove({ id: this.lastOptions.account_id }, (error, response) => {
        if (error) {
          console.error('Ошибка удаления аккаунта: ', error);
          return;
        }
        if (response.success) {
          App.updateWidgets();
          App.updateForms();
          this.clear();
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
    const confirmation = confirm('Вы действительно хотите удалить эту транзакцию?');
    if (confirmation) {
      Transaction.remove({ id: id }, (error, response) => {
        if (error) {
          console.error('Ошибка удаления транзакции: ', error);
          return;
        }
        if(response.success) {
          this.update()
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
        console.error('Ошибка при получении названия счёта: ', error);
        return;
      }
      if(accountResponse && accountResponse.success) {
        this.renderTitle(accountResponse.data.name);
        Transaction.list({ account_id: options.account_id }, (error, transactionResponse) => {
          if (error) {
            console.error('Ошибка при получении транзакций:', error);
            return;
          }
          if (transactionResponse && transactionResponse.success) {
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
    const titleElement = this.element.querySelector('.content-title');
    titleElement.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const options = { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return new Date(date).toLocaleString('ru-RU', options);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const formattedDate = this.formatDate(item.created_at);
    const transactionType = item.type === 'income' ? 'transaction_income' : 'transaction_expense';

    return `
      <div class="transaction ${transactionType} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>    
            <div class="transaction__date">${formattedDate}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
          </button>
        </div>
      </div>
    `
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