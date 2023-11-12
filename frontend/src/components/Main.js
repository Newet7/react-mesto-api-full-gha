import React from "react";

import Card from "./Card";
import Header from "./Header";

import CurrentUserContext from "../contexts/CurrentUserContext";

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <>
      <Header isWrappable={true}>
        <p className="header__menu-item">{props.email}</p>
        <button href="#" className="header__menu-item" onClick={props.onLogout}>
          Выйти
        </button>
      </Header>

      <main>
        {/* <!-- Profile --> */}
        <section className="profile content__element">
          <div className="profile__avatar">
            <div //img
              //src={{ backgroundImage: `url(${userAvatar})` }}
              style={{ backgroundImage: `url(${currentUser.avatar})` }}
              alt="Фотография пользователя"
              className="profile__avatar-image"
            />
            <button
              className="profile__avatar-button"
              type="button"
              aria-label="Обновить аватар"
              onClick={props.onEditAvatar}
            ></button>
          </div>
          <div className="profile__info">
            <div className="profile__name-block">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                type="button"
                className="profile__button profile__button_type_edit"
                aria-label="Редактировать профиль"
                onClick={props.onEditProfile}
              ></button>
            </div>
            <p className="profile__job">{currentUser.about}</p>
          </div>
          <button
            type="button"
            className="profile__button profile__button_type_add"
            aria-label="Добавить фотографию"
            onClick={props.onAddPlace}
          ></button>
        </section>

        {/* <!-- Elements --> */}
        <section className="cards content__element" aria-label="Фотографии">
          {/* <!--  6 карточек, которые добавит JavaScript --> */}
          {props.cards.map((card) => (
            <Card
              card={card}
              key={card._id}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          ))}
          ;
        </section>
      </main>
    </>
  );
}

export default Main;
