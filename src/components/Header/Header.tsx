import React, { useState } from "react";
import styles from "./Header.module.scss";
import bannerImageData from "@/assets/img/banner.jpg";
import Image from "next/image";

export const Header = () => {
  const [showDrop, setShowDrop] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <svg
            className={styles.logo_image}
            viewBox="0 0 138 40"
            id="logo-horizontal-0.58ddf62b"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              fillRule="evenodd"
              d="m14.337 7.53 1.802-.915c.157-.077.235-.305.157-.496l-2.076-3.93c-.118-.19-.314-.228-.51-.152l-1.801.915c-.196.115-.236.306-.157.496l2.076 3.93c.117.19.313.229.51.152ZM9.99 25.193c-.04.42-.196.992-.392 1.374L8.11 29.542c0 .077-.079.077-.157.077C3.369 28.398 0 24.278 0 19.433 0 13.596 4.897 8.827 10.93 8.866c.665 0 1.292.038 1.919.152.039 0 .078.038.078.077-.062.5-.21 1.596-.347 2.62v.001c-.125.93-.242 1.8-.28 2.109-.14.99-.688 1.277-1.25 1.573-.067.034-.133.07-.2.106l-.054.027c-.872.444-1.5.763-2.805.278-.947-.348-1.69-.633-2.333-.879a65.71 65.71 0 0 0-2.054-.762c-.392-.152-.94 0-1.097.42-.157.42 0 .84.43.992 0 0 2.195.801 3.096 1.182.335.149.646.276.935.393 1.196.486 2 .813 2.473 1.858.274.649.822 2.022.822 2.632-.039.878-.274 3.548-.274 3.548Zm11.752-5.302c-.235 5.493-4.858 9.956-10.498 10.109-.431 0-.862 0-1.293-.038-.079 0-.118-.115-.079-.153l1.528-2.632c.235-.381.392-.763.431-1.22l.313-2.29c.04-.458.275-.915.705-1.068l.745-.19c.43-.153.783 0 .98.38.156.268.547 1.03.704 1.336.118.19.079.42-.039.534l-.523.58c-.29.32-.544.601-.848.946-.313.344-.588.878-.04 1.335.51.458 1.02-.038 1.333-.343.391-.381 1.018-1.106 1.41-1.564.352-.382.548-.649.587-1.145 0-.19 0-.381-.078-.61-.073-.214-.36-.91-.729-1.806-.42-1.022-.948-2.302-1.386-3.42-.705-1.832-1.058-3.7-.823-5.646l.392-3.51c0-.038.04-.076.117-.076 4.27 1.602 7.287 5.722 7.09 10.49ZM8.853 10.582c-1.136.115-1.998 1.107-1.88 2.213.117 1.106 1.136 1.907 2.272 1.831 1.136-.114 1.998-1.106 1.88-2.212-.117-1.107-1.136-1.946-2.272-1.832Zm121.582 1.649c-4.203 0-7.566 2.828-7.566 7.18 0 4.35 3.363 7.179 7.566 7.179 4.203 0 7.565-2.829 7.565-7.18 0-4.297-3.362-7.18-7.565-7.18Zm-3.373 7.359c0 2.078 1.452 3.41 3.464 3.41 2.011 0 3.463-1.332 3.463-3.41 0-2.078-1.452-3.41-3.463-3.41-2.012 0-3.464 1.332-3.464 3.41Zm-27.436-7.36c-4.203 0-7.565 2.829-7.565 7.18 0 4.351 3.362 7.18 7.565 7.18s7.565-2.829 7.565-7.18c0-4.297-3.362-7.18-7.565-7.18Zm-3.555 7.36c0 2.078 1.453 3.41 3.464 3.41s3.463-1.332 3.463-3.41c0-2.078-1.452-3.41-3.463-3.41s-3.464 1.332-3.464 3.41Zm-18.439-7h10.783v13.945h-4.079V16.254h-3.184l-.335 4.758-.036.377v.006c-.257 2.747-.485 5.195-4.49 5.195H74.56l.503-3.39c2.023-.05 2.041-.396 2.403-7.453.048-.93.101-1.978.166-3.157Zm-20.208 6.82c0-4.351 3.363-7.18 7.566-7.18 4.203 0 7.565 2.883 7.565 7.18 0 4.351-3.362 7.18-7.565 7.18s-7.566-2.829-7.566-7.18ZM65.081 23c-2.012 0-3.464-1.332-3.464-3.41 0-2.078 1.452-3.41 3.464-3.41 2.01 0 3.463 1.332 3.463 3.41 0 2.078-1.452 3.41-3.463 3.41Zm-28.558-.322c-2.223 0-4.224-.38-4.224-3.314 0-2.119 1.167-3.15 3.502-3.097 1.112 0 2.39.218 3.335.544l1.334-3.369c-1.445-.706-3.168-1.032-4.836-1.032-4.78 0-7.56 2.988-7.56 7.117 0 4.944 3.446 7.063 7.56 7.063 1.557 0 3.169-.272 4.503-.707l-.056-3.694c-1 .272-2.335.49-3.558.49ZM43.57 12.59h12.214l-.718 3.577h-3.537V26.41h-4.035V16.221H43.57V12.59Zm77.831.054.011-.054v.054h-.011Zm0 0h-12.568l.717 3.577h3.531v10.19h4.082V16.166h3.531l.707-3.523Z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
          <button
            className={`${styles.btn} ${styles.closeBtn}`}
            onClick={closeMenu}
          >
            <i className="fas fa-times"></i>
          </button>
          <ul>
            <li>
              <a href="#" onClick={closeMenu}>
                Главная
              </a>
            </li>
            <li>
              <a href="#" onClick={closeMenu}>
                Трансляции
              </a>
            </li>
            <li className={styles.dropdown}>
              <a href="#" className={styles.desktopItem}>
                Лотереи
              </a>
              <span
                className={styles.mobileItem}
                onClick={() => setShowDrop(!showDrop)}
              >
                Лотереи
              </span>
              <ul
                className={`${styles.dropMenu} ${showDrop ? styles.show : ""}`}
              >
                <li>
                  <a href="#">Гибкое Бинго</a>
                </li>
                <li>
                  <a href="#">Лотерея-судоку</a>
                </li>
                <li>
                  <a href="#">Лотерея-сапер</a>
                </li>
                <li>
                  <a href="#">Лотерея-тетрис</a>
                </li>
              </ul>
            </li>
            <li className={styles.megaMenu}>
              <a href="#" className={styles.desktopItem}>
                Информация
              </a>
              <span
                className={styles.mobileItem}
                onClick={() => setShowMega(!showMega)}
              >
                Информация
              </span>
              <div
                className={`${styles.megaBox} ${showMega ? styles.show : ""}`}
              >
                <div className={styles.content}>
                  <div className={styles.row}>
                    <Image src={bannerImageData} alt="Lottery Banner" />
                  </div>
                  <div className={styles.row}>
                    <header>Как играть</header>
                    <ul className={styles.megaLinks}>
                      <li>
                        <a href="#">Правила игры</a>
                      </li>
                      <li>
                        <a href="#">Призовая структура</a>
                      </li>
                      <li>
                        <a href="#">Выигрышные номера</a>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.row}>
                    <header>Мой аккаунт</header>
                    <ul className={styles.megaLinks}>
                      <li>
                        <a href="#">Мои билеты</a>
                      </li>
                      <li>
                        <a href="#">Мои достижения</a>
                      </li>
                      <li>
                        <a href="#">История бонусов</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <a href="#" onClick={closeMenu}>
                Выйти
              </a>
            </li>
          </ul>
        </div>
        <button
          className={`${styles.btn} ${styles.menuBtn}`}
          onClick={toggleMenu}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </nav>
  );
};
