function PopupWithForm({
  isOpen,
  onClose,
  name,
  title,
  buttonText,
  children,
  onSubmit,
}) {
  return (
    // {/* <!-- Popup: редактировать профиль --> */}
    <div className={`popup popup_type_${name}` + (isOpen && " popup_opened")}>
      <div className="popup__container">
        <h2 className="popup__title">{title}</h2>
        <form className="popup__form" name={name} onSubmit={onSubmit}>
          {children}
          <button className="popup__save-button" type="submit">
            {buttonText || "Сохранить"}
          </button>
        </form>
        <button
          className="popup__cancel-button"
          type="button"
          aria-label="Закрыть окно"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

export default PopupWithForm;
