
/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (error, response) => {
      if (error) {
        console.error('Ошибка сети: ', error);
        alert('Ошибка сети');
        return;
      }

      if(response.success) {
        App.getModal('createAccount').close();
        App.update();
        this.element.reset();
      } else {
        console.error(response.error);
        alert(response.error || 'Не получилось создать аккаунт:');
      };
    });
  };
}