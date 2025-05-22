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
   * @param {HTMLElement} element - Элемент виджета.
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
    this.element.addEventListener("click", (e) => {
      e.preventDefault();

      const createAccountBtn = e.target.closest(".create-account");
      const accountBtn = e.target.closest(".account");

      if (createAccountBtn) {
        return App.getModal("createAccount").open();
      }

      if (accountBtn) {
        this.onSelectAccount(accountBtn);
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
    const currentUser  = User.current();
    if (!currentUser ) {
      return;
    }

    Account.list(currentUser , (err, response) => {
      if (response && response.success) {
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
    const accounts = this.element.querySelectorAll(".account");
    accounts.forEach((element) => element.remove());
  }

  /**
   * Срабатывает в момент выбора счёта.
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage('transactions', { account_id: id_счёта }).
   * @param {HTMLElement} element - Элемент счета.
   */
  onSelectAccount(element) {
    const accounts = this.element.querySelectorAll(".active");
    accounts.forEach((el) => el.classList.remove("active"));

    element.classList.add("active");
    App.showPage("transactions", { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего отображения в боковой колонке.
   * @param {Object} item - Объект с данными о счёте.
   * @returns {string} - HTML-код счета.
   */
  getAccountHTML(item) {
    return `<li class="account" data-id="${item.id}">
              <a href="#">
                <span>${item.name}</span> /
                <span>${item.sum} ₽</span>
              </a>
            </li>`;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета.
   * @param {Array} data - Массив объектов счетов.
   */
  renderItem(data) {
    data.forEach((item) => {
      this.element.insertAdjacentHTML("beforeend", this.getAccountHTML(item));
    });
  }
} 