/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const toggleButton = document.querySelector('.sidebar-toggle.visible-xs');
    const body = document.body;

    toggleButton.addEventListener('click', (event) => {
      event.preventDefault();

      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-collapse');
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const loginButton = document.querySelector('.menu-item_login');
    const registerButton = document.querySelector('.menu-item_register');
    const logoutButton = document.querySelector('.menu-item_logout');

    loginButton.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('login').open();
    });

    registerButton.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('register').open();
    });

    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      User.logout((error, response) => {
        if(error) {
          alert('Ошибка при выходе');
          console.log('Ошибка при выходе:', error);
          return;
        }
        if(response.success) {
          App.setState('init');
        } else {
          alert('Ошибка при выходе');
          console.log('Ошибка при выходе:', response.error);
        };
      });
    });
  };
}