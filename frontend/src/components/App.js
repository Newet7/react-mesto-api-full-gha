import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmActionPopup from "./ConfirmActionPopup";
import InfoPopup from "./InfoPopup";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import auth from "../utils/auth";

import api from "../utils/Api";

import CurrentUserContext from "../contexts/CurrentUserContext";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  // const [isInfoPopupOpen, setIsInfoPopupOpen] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState(null);
  const [toBeDeletedCard, setToBeDeletedCard] = React.useState(null);
  //const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [infoMessage, setInfoMessage] = React.useState(null);

  const [currentUser, setCurrentUser] = React.useState({});

  const [cards, setCards] = React.useState([]);

  // Авторизация пользователя
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  //const [email, setEmail] = React.useState("");

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard;

  React.useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true);
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isLoggedIn]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    //setIsImagePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    //setIsImagePopupOpen(false);
    setToBeDeletedCard(null);
    setInfoMessage(null);
  }

  function handleUpdateUser(userInfo) {
    api
      .setUserInfo(userInfo)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleShowInfoMessage(message) {
    setInfoMessage(message);
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .changeAvatar(avatar)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlace(newPlaceData) {
    //const cardId = card._id;
    api
      .addNewCard(newPlaceData)
      .then((newCard) => {
        setCards((state) => [newCard, ...state]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    setToBeDeletedCard(card);
  }

  function handleConfirmDelete() {
    const cardId = toBeDeletedCard._id;
    api
      .deleteCard(cardId)
      .then(() => {
        setCards((state) => state.filter((card) => card._id !== cardId));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  React.useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    if (isOpen) {
      // навешиваем только при открытии
      document.addEventListener("keydown", closeByEscape);
      return () => {
        document.removeEventListener("keydown", closeByEscape);
      };
    }
  }, [isOpen]);

  // Авторизация
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          console.log(res);
          // setEmail(res.email);
          // setCurrentUser(res);
          api.setToken(token);
          setIsLoggedIn(true);
          navigate("/");
        })
        .catch(console.error);
    }
  }, [navigate]);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="content">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggiedIn={isLoggedIn}>
                <Main
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  email={currentUser.email}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sign-up"
            element={<Register handleShowInfoMessage={handleShowInfoMessage} />}
          />
          <Route
            path="/sign-in"
            element={
              <Login
                handleShowInfoMessage={handleShowInfoMessage}
                onLogin={handleLogin}
              />
            }
          />
          <Route
            path="*"
            element={
              isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
            }
          />
        </Routes>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />

        <ConfirmActionPopup
          isOpen={!!toBeDeletedCard}
          onClose={closeAllPopups}
          onConfirm={handleConfirmDelete}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          //isOpen={isImagePopupOpen}
        />

        <InfoPopup message={infoMessage} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
