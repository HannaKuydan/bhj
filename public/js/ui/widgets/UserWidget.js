/**
 * Класс UserWidget отвечает за
 * отображение информации о имени пользователя
 * после авторизации или его выхода из системы.
 */
class UserWidget {
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
  }

  /**
   * Получает информацию о текущем пользователе
   * с помощью User.current().
   * Если пользователь авторизован,
   * в элемент .user-name устанавливает имя
   * авторизованного пользователя.
   * Если пользователь не авторизован,
   * очищает поле с именем пользователя.
   */
  update() {
    const currentUser = User.current();
    const userNameElement = this.element.querySelector(".user-name");

    if (!userNameElement) {
      console.error("Элемент '.user-name' не найден.");
      return;
    }

    if (currentUser) {
      userNameElement.textContent = currentUser.name;
    } else {
      userNameElement.textContent = ""; // Очистка имени пользователя при выходе
    }
  }
}