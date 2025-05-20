import React, { useState, useLayoutEffect } from "react";
import styles from "./Header.module.scss";
import bannerImageData from "@/assets/img/banner.jpg";
import Image from "next/image";
import { Registration } from "@/components/Auth/Registration";
import { StolotoIcon } from "@/assets/icons/StolotoIcon/StolotoIcon";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";

export const Header = () => {
  const router = useRouter();
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [showDrop1, setShowDrop1] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("");
  const [log, setLog] = useState<"logIn" | "logOut">("logIn");

  useLayoutEffect(() => {
    const checkAuth = () => {
      if (Cookies.get("auth_token")) {
        setLog("logOut");
      } else {
        setLog("logIn");
      }

      setRole(Cookies.get("auth_role") ?? "");
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      Cookies.remove("auth_token");
      Cookies.remove("auth_role");
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
                <Link href="/" onClick={closeMenu}>
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/broadcasts" onClick={closeMenu}>
                  Трансляции
                </Link>
              </li>
              <li className={styles.dropdown}>
                <Link href="/lotteries" className={styles.desktopItem}>
                  Лотереи
                </Link>
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
                    <Link href="/lotteries">Гибкий Ряд</Link>
                  </li>
                  <li>
                    <Link href="/sudoku-lottery">Лотерея-судоку</Link>
                  </li>
                  <li>
                    <Link href="/mines">Лотерея-сапер</Link>
                  </li>
                  <li>
                    <Link href="/tetris-lottery">Лотерея-тетрис</Link>
                  </li>
                </ul>
              </li>
              <li className={styles.megaMenu}>
                <Link href="/" className={styles.desktopItem}>
                  Информация
                </Link>
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
                          <Link href="/rules">Правила игры</Link>
                        </li>
                        <li>
                          <Link href="/prizes">Призовая структура</Link>
                        </li>
                        <li>
                          <Link href="/win-nums">Выигрышные номера</Link>
                        </li>
                      </ul>
                    </div>
                    <div className={styles.row}>
                      <header>Мой аккаунт</header>
                      <ul className={styles.megaLinks}>
                        {role === "Администратор" ? (
                          <li>
                            <Link href="/admin/lotteries">
                              Управление лотереями
                            </Link>
                          </li>
                        ) : (
                          <>
                            <li>
                              <Link href="/account/my-tickets">Мои билеты</Link>
                            </li>
                            <li>
                              <Link href="/account/profile">Мой профиль</Link>
                            </li>
                            <li>
                              <Link href="/account/history">
                                История бонусов
                              </Link>
                            </li>
                          </>
                        )}
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
                      {log === "logIn"
                        ? "Регистрация | Вход"
                        : "Мой аккаунт | Выйти"}
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
                        {role === "Администратор" ? (
                          <li>
                            <Link href="/admin/lotteries">
                              Управление лотереями
                            </Link>
                          </li>
                        ) : (
                          <>
                            <li>
                              <Link href="/account/my-tickets">Мои билеты</Link>
                            </li>
                            <li>
                              <Link href="/account/profile">Мой профиль</Link>
                            </li>
                            <li>
                              <Link href="/account/history">
                                История бонусов
                              </Link>
                            </li>
                          </>
                        )}
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
