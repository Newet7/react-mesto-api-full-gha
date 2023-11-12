import React from "react";

import PopupWithForm from "./PopupWithForm";

function ConfirmActionPopup({ isOpen, onClose, onConfirm }) {
  function handleSubmit(event) {
    event.preventDefault();
    onConfirm();
  }

  return (
    <PopupWithForm
      name="confirm"
      title="Вы уверены?"
      buttonText="Да"
      isOpen={isOpen}
      onClose={onClose}
      //children={<></>}
      onSubmit={handleSubmit}
    />
  );
}

export default ConfirmActionPopup;
