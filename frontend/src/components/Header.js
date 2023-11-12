import React from "react";

import logo from "../images/Vector.svg";

function Header({ children, isWrappable }) {
  // let links;
  // if (children.length > 1) {
  //   links = children;
  // } else {
  //   links = [children];
  // }

  const [isMenuOpened, setIsMenuOpened] = React.useState(false);

  function handleOpenMenu() {
    setIsMenuOpened((state) => !state);
  }

  return (
    // {/* <!-- Header --> */}
    <header
      className={
        "header content__element content__element_type_header" +
        (isWrappable ? " header_wrappable" : "")
      }
    >
      <div className="header__main">
        <img src={logo} alt="Место. Логотип проекта" className="header__logo" />
        {isWrappable && (
          <button
            type="button"
            className={
              "header__menu-button" +
              (isMenuOpened ? " header__menu-button_opened" : "")
            }
            aria-label="Открыть меню"
            onClick={handleOpenMenu}
          ></button>
        )}
      </div>

      {children && (
        <ul
          className={
            "header__menu" + (isMenuOpened ? " header__menu_opened" : "")
          }
        >
          {(children.length > 1 ? children : [children]).map((item, pos) => (
            <li className="header__menu-item" key={pos}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

export default Header;
