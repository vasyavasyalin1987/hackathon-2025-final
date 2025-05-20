import React, { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import bannerImageData from "@/assets/img/banner.jpg";
import Image from "next/image";
import { Registration } from "@/components/Auth/Registration";
import { StolotoIcon } from "@/assets/icons/StolotoIcon/StolotoIcon";
import Cookies from "js-cookie";
import { useRouter } from "next/router"; // Импортируем useRouter

export const Header = () => {
  const router = useRouter(); // Инициализируем router
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [showDrop1, setShowDrop1] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [log, setLog] = useState<"logIn" | "logOut">("logIn");
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе

  useEffect(() => {
    const checkAuth = () => {
      if (Cookies.get("auth_token")) {
        setLog("logOut");
        // Здесь можно добавить логику для получения данных о пользователе
      } else {
        setLog("logIn");
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      Cookies.remove("auth_token");
      await router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

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
                <div className={styles.row}>
                  <div className={styles.dropdown}>
                    <a
                      href="#"
                      onClick={() =>
                        log === "logIn" ? setAuthOpen(true) : handleLogout()
                      }
                    >
                      {log === "logIn" ? "Регистрация | Вход" : "Выйти"}
                    </a>
                    <span
                      className={styles.mobileItem}
                      onClick={() => setShowDrop1(!showDrop1)}
                    >
                      Мой аккаунт
                    </span>
                    {log !== "logIn" && (
                      <ul
                        className={`${styles.dropMenu} ${
                          showDrop1 ? styles.show : ""
                        }`}
                      >
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
                    )}
                  </div>
                </div>
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
      <Registration open={isAuthOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};
