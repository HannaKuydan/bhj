/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке.
 */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element.
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents().
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   */
  constructor(element) {
    if (!element) {
      throw new Error("Элемент не существует");
    }

    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта.
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount().
   */
  registerEvents() {
    this.element.addEventListener("click", (event) => {
      event.preventDefault();

      if (event.target.closest(".create-account")) {
        App.getModal("createAccount").open();
      }

      if (event.target.closest(".account")) {
        this.onSelectAccount(event.target.closest(".account"));
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User .current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem().
   */
  update() {
    const currentUser = User.current();
    if (!currentUser) {
      return;
    }

    Account.list(currentUser, (err, response) => {
      if (response.success) {
        this.clear();
        this.renderItem(response.data);
      } else {
        alert(err || response.error || "Не удалось загрузить счета.");
      }
    });
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке.
   */
  clear() {
    this.element.querySelectorAll(".account").forEach((element) => element.remove());
  }

  /**
   * Срабатывает в момент выбора счёта.
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage('transactions', { account_id: id_счёта }).
   */
  onSelectAccount(element) {
    this.element.querySelectorAll(".active").forEach((el) => el.classList.remove("active"));

    element.classList.add("active");
    App.showPage("transactions", { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего отображения в боковой колонке.
   */
  getAccountHTML(item) {
    const li = document.createElement('li')
    li.className = 'account'
    li.dataset.id = item.id
    const a = document.createElement('a')
    a.href = '#'
    const nameSpan = document.createElement('span')
    nameSpan.textContent = item.name
    const sumSpan = document.createElement('span')
    sumSpan.textContent = `${item.sum} ₽`

    a.appendChild(nameSpan)
    a.append(' / ')
    a.appendChild(sumSpan)
    li.appendChild(a)
    return li
  }


  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета.
   */
  renderItem(data) {
    data.forEach((item) => {
      this.element.appendChild(this.getAccountHTML(item));
    });
  }
}
