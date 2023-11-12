import React from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleChangeName(event) {
    const text = event.target.value;
    setName(text);
  }

  function handleChangeDescription(event) {
    const text = event.target.value;
    setDescription(text);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="edit-profile"
      title="Редактировать профиль"
      buttonText="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          id="name-input"
          type="text"
          className="popup__input popup__input_type_name"
          placeholder="Имя"
          name="name"
          minLength="2"
          maxLength="40"
          required
          onChange={handleChangeName}
          value={name ?? ""}
        />
        <span className="popup__input-error name-input-error popup__input-error_type_name">
          Вы пропустили это поле.
        </span>
      </label>
      <label className="popup__field">
        <input
          id="job-input"
          type="text"
          className="popup__input popup__input_type_job"
          placeholder="Профессия"
          name="job"
          minLength="2"
          maxLength="200"
          required
          onChange={handleChangeDescription}
          value={description ?? ""}
        />
        <span className="popup__input-error popup__input-error_type_job job-input-error">
          Вы пропустили это поле.
        </span>
      </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
