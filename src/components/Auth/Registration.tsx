import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { API_BASE_URL } from "@/api";

const registrationSchema = yup.object({
  login: yup
    .string()
    .min(3, "Логин должен содержать минимум 3 символа")
    .required("Обязательное поле"),
  email: yup.string().email("Некорректный email"),
  password: yup
    .string()
    .min(4, "Пароль должен содержать минимум 6 символов")
    .required("Обязательное поле"),
});

const loginSchema = yup.object({
  login: yup
    .string()
    .min(3, "Логин должен содержать минимум 3 символа")
    .required("Обязательное поле"),
  password: yup
    .string()
    .min(4, "Пароль должен содержать минимум 6 символов")
    .required("Обязательное поле"),
});

type FormType = "registration" | "enter";

interface RegistrationProps {
  open: boolean;
  onClose: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({
  open,
  onClose,
}) => {
  const [type, setType] = React.useState<FormType>("registration");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      login: "",
      email: "",
      password: "",
    },
    validationSchema:
      type === "registration" ? registrationSchema : loginSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const endpoint = type === "registration" ? "/register_user" : "/login";
        const payload =
          type === "registration"
            ? {
                login: values.login,
                password: values.password,
                email: values.email,
              }
            : { identifier: values.login, password: values.password };

        const response = await axios.post(
          `${API_BASE_URL}${endpoint}`,
          payload
        );

        const { token } = response.data;
        Cookies.set("auth_token", token, {
          expires: 356,
          secure: true,
          sameSite: "strict",
        });

        setSubmitting(false);
        resetForm();
        onClose();
      } catch (error: any) {
        setSubmitting(false);
        if (error.response) {
          setErrors({
            login: error.response.data.message || "Произошла ошибка",
          });
        } else {
          setErrors({ login: "Не удалось подключиться к серверу" });
        }
      }
    },
  });

  const changeType = () => {
    setType(type === "registration" ? "enter" : "registration");
    formik.resetForm();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {type === "registration" ? "Регистрация" : "Вход"}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              id="login"
              name="login"
              label="Логин*"
              value={formik.values.login}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.login && Boolean(formik.errors.login)}
              helperText={formik.touched.login && formik.errors.login}
            />
            {type === "registration" && (
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Электронная почта"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            )}
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Пароль*"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", p: 3 }}>
          <Button
            type="button"
            onClick={changeType}
            color="primary"
            variant="text"
          >
            {type === "registration"
              ? "Уже зарегистрированы? Войти"
              : "Еще нет аккаунта? Регистрация"}
          </Button>
          <Box>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{ mr: 1 }}
            >
              {type === "registration" ? "Зарегистрироваться" : "Войти"}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};
