/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';
  /**
   * Получает информацию о счёте
   * */
  static get(id = '', callback){
    createRequest({
      url: `${this.URL}/${id}`,
      method: 'GET',
      data: null,
      callback: (error, response) => {
        if (error) {
          return callback(error, null); 
        }
        if (response) {
          callback(null, response);
        }
      }
    });
  };
}