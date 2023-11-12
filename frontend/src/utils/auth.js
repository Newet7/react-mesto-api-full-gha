import { apiConfig } from './apiConfig';

class Auth {
  /**
   * Отвечает за осуществление и обработку сетевых запросов, связанных с аутентификацией
   * @param {string} Базовый URL для обращения
   */
  constructor(baseUrl) {
    this._baseUrl = baseUrl;
  }

  //* Проверка статуса запроса
  _requestResult(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(
        `Что-то пошло не так: Ошибка ${res.status} - ${res.statusText}`
      );
    }
  }

  /**
   * Регистрирует пользователя в сервисе
   * @param {object} Параметры пользователя {email, password}
   * @returns {Promise} Ответ сервера/ошибка
   *
   * Формат ответа сервера:
   * {
   *    "data": {
   *        "_id": "5f5204c577488bcaa8b7bdf2",,
   *       "email": "email@yandex.ru"
   *    }
   * }
   */
  register({ email, password }) {
    const url = `${this._baseUrl}/signup`;
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => this._requestResult(res));
  }

  /**
   * Авторизует пользователя в сервисе
   * @param {object} Параметры пользователя {email, password}
   * @returns {Promise} Ответ сервера/ошибка
   *
   * Формат ответа сервера:
   * {
   *    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjUxNDhlNWJiODhmZGNhOTIxYjZhYzciLCJpYXQiOjE1OTkyMTExNzN9.Q3DVLh7t0f0BjyG9gh3UlUREYQxl2chdGTGy701lF6I"
   * }
   */
  authorize({ email, password }) {
    const url = `${this._baseUrl}/signin`;
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => this._requestResult(res));
  }

  /**
   * Провеляет валидность токена
   * @param {object} Параметры пользователя {email, password}
   * @returns {Promise} Ответ сервера/ошибка
   *
   * Формат ответа сервера:
   * {
   *    "_id":"1f525cf06e02630312f3fed7",
   *    "email":"email@email.ru"
   * }
   */
  checkToken(token) {
    const url = `${this._baseUrl}/users/me`;
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => this._requestResult(res));
  }
}

//const auth = new Auth("https://auth.nomoreparties.co");

const auth = new Auth(apiConfig.baseUrl);

export default auth;
