import React, { useState } from "react";
import styles from "./Registration.module.scss";
import { TextField, Button } from "@mui/material";

export const Registration = () => {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSub, setSub] = useState(false);
  const [type, setType] = useState<"registration" | "enter">("registration");
  const [errors, setErrors] = useState({
    login: false,
    email: false,
    password: false,
  });

  const validateRegForm = () => {
    const newErrors = {
      login: !login,
      email: !email,
      password: !password,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const validateEnterForm = () => {
    const newErrors = {
      login: !login,
      password: !password,
      email: !email,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid =
      type === "registration" ? validateRegForm() : validateEnterForm();

    if (isValid) {
      setSub(true);

      console.log("Форма успешно отправлена");

      setLogin("");
      setEmail("");
      setPassword("");
      setSub(false);
    }
  };
  const changeType = () => {
    setType(type === "registration" ? "enter" : "registration");
  };
  return (
    <form onSubmit={handleSubmit} className={styles.registration}>
      <h1>{type === "registration" ? "Регистрация" : "Вход"}</h1>
      <TextField
        fullWidth
        margin="normal"
        error={errors.login}
        id={
          errors.login ? "outlined-helper-text" : "outlined-error-helper-text"
        }
        label={errors.login ? "Ошибка" : "Логин"}
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        helperText={errors.login ? "Вы не ввели свой логин!" : ""}
        className={styles.inputField}
      />
      {type === "registration" && (
        <TextField
          fullWidth
          margin="normal"
          error={errors.email}
          id={
            errors.email ? "outlined-helper-text" : "outlined-error-helper-text"
          }
          label={errors.email ? "Ошибка" : "Электронная почта"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText={errors.email ? "Вы не ввели свою электронную почту!" : ""}
          className={styles.inputField}
        />
      )}
      <TextField
        fullWidth
        type="password"
        margin="normal"
        error={errors.password}
        id={
          errors.password
            ? "outlined-helper-text"
            : "outlined-error-helper-text"
        }
        label={errors.password ? "Ошибка" : "Пароль"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        helperText={errors.password ? "Вы не ввели свой пароль!" : ""}
        className={styles.inputField}
      />
      <Button
        type="submit"
        size="large"
        disabled={isSub}
        className={styles.btn}
        variant="contained"
      >
        {type === "registration" ? "Зарегистрироваться" : "Войти"}
      </Button>{" "}
      <Button className={styles.btnText} onClick={changeType} variant="text">
        {type === "registration"
          ? "Уже зарегистрированы? Войти"
          : "Еще нет аккаунта? Регистрация"}
      </Button>
    </form>
  );
}
