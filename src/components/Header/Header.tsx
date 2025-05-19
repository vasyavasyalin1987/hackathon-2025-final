import React, { useState } from "react";
import styles from "./Header.module.scss";
import bannerImageData from "@/assets/img/banner.jpg";
import Image from "next/image";
import { Registration } from "@/components/Auth/Registration";
import { StolotoIcon } from "@/assets/icons/StolotoIcon/StolotoIcon";

export const Header = () => {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.wrapper}>
          <div className={styles.logo}>
            <StolotoIcon />
          </div>
          <div
            className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}
          >
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
                  className={`${styles.dropMenu} ${
                    showDrop ? styles.show : ""
                  }`}
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
                <a
                  href="#"
                  onClick={() => {
                    setAuthOpen(true);
                  }}
                >
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
      <div className={styles.spacer}></div>
      <Registration
        open={isAuthOpen}
        onClose={() => {
          setAuthOpen(false);
        }}
      />
    </>
  );
};
