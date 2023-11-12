import { apiConfig } from "./apiConfig";

class Api {
  /**
   * Отвечает за осуществление и обработку сетевых запросов к серверу
   * @constructor
   *
   * @param {object} Конфиг запросов к серверу:
   * - baseUrl - Базовая часть url-адреса сервера
   * - headers - Заголовки запроса, будут передаваться при каждом обращении
   */
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    // this._userInfoUrl = "/users/me";
    // this._cardsUrl = "/cards";
  }

  // _fetch(url, params) {
  //   return fetch(this._baseUrl + url, params).then((res) => {
  //     if (res.ok) {
  //       return res.json();
  //     }
  //     return Promise.reject(`Ну вот, все пропало (Ошибка: ${res.status})`);
  //   });
  // }

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

  setToken(token) {
    this._headers.authorization = `Bearer ${token}`;
  }

  /**
   * Получает данные текущего пользователя
   * @returns {Promise} Промис с ответом сервера: объект текущего пользователя
   */
  getUserInfo() {
    const url = `${this._baseUrl}/users/me`;

    return fetch(url, {
      method: "GET",
      headers: this._headers,
    }).then((res) => this._requestResult(res));
  }

  /**
   * Устанавливает новые имя и профессию текущего пользователя
   * @param {object} Объект с обновляемыми параметрами:
   * - name - имя пользователя
   * - job - профессия пользователя
   * @returns {Promise} Промис с ответом сервера: обновленный объект пользователя
   */
  setUserInfo({ name, about }) {
    const url = `${this._baseUrl}/users/me`;

    return fetch(url, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => this._requestResult(res));
  }

  /**
   * Устанавливает новый аватар пользователя
   * @param {string} link - Ссылка на картинку
   * @returns {Promise} Промис с ответом сервера: обновленный объект пользователя
   */
  changeAvatar(link) {
    const url = `${this._baseUrl}/users/me/avatar`;

    return fetch(url, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: link,
      }),
    }).then((res) => this._requestResult(res));
  }

  /**
   * Получает исходные карточки для отрисовки
   * @returns {Promise} Промис с ответом сервера: массив карточек
   */
  getInitialCards() {
    const url = `${this._baseUrl}/cards`;

    return fetch(url, {
      method: "GET",
      headers: this._headers,
    }).then((res) => this._requestResult(res));
  }

  /**
   * Добавляет новую карточку
   * @param {object} Параметры добавляемой карточки:
   * - name - отображаемое имя
   * - link - ссылка на добавляемую картинку
   * @returns {Promise} Промис с ответом сервера: объект созданной карточки
   */
  addNewCard({ name, link }) {
    const url = `${this._baseUrl}/cards`;

    return fetch(url, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => this._requestResult(res));
  }

  /**
   * Удаляет карточку с сервера
   * @param {string} cardId - ID карточки
   * @returns {Promise} Промис с ответом сервера
   */
  deleteCard(cardId) {
    const url = `${this._baseUrl}/cards/${cardId}`;

    return fetch(url, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._requestResult(res));
  }

  changeLikeCardStatus(cardId, like) {
    const url = `${this._baseUrl}/cards/${cardId}/likes`;
    return fetch(url, {
      method: like ? "PUT" : "DELETE",
      headers: this._headers,
    }).then((res) => this._requestResult(res));
  }

  /**
   * Ставит лайк на карточку
   * @param {string} cardId - ID карточки
   * @returns {Promise} Промис с массивом новых лайков карточки
   */
  // _setLike(cardId) {
  //   const url = `${this._baseUrl}/cards/${cardId}/likes`;

  //   return fetch(url, {
  //     method: "PUT",
  //     headers: this._headers,
  //   }).then((res) => this._requestResult(res));
  // }
  // /**
  //  * Удаляет лайк с карточки
  //  * @param {string} cardId - ID карточки
  //  * @returns {Promise} Промис с массивом новых лайков карточки
  //  */
  // _deleteLike(cardId) {
  //   const url = `${this._baseUrl}/cards/${cardId}/likes`;

  //   return fetch(url, {
  //     method: "DELETE",
  //     headers: this._headers,
  //   }).then((res) => this._requestResult(res));
  // }

  // /**
  //  * Переключает лайк карточки
  //  * @param {string} cardId - ID карточки
  //  * @param {boolean} isLiked - Текущий статус лайка
  //  * @returns {Promise} Промис с массивом новых лайков карточки
  //  */
  // toggleLike(cardId, isLiked) {
  //   if (isLiked) {
  //     return this._deleteLike(cardId).then((res) => {
  //       return res.likes;
  //     });
  //   } else {
  //     return this._setLike(cardId).then((res) => {
  //       return res.likes;
  //     });
  //   }
  // }
}

const api = new Api(apiConfig);
// const api = new Api({
//   address: "http://localhost:3000",
// });

export default api;
