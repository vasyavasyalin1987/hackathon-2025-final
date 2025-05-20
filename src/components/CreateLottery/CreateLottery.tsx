import React, { useState } from "react";
import styles from "./CreateLottery.module.scss";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_BASE_URL } from "@/api";
import Cookies from "js-cookie";

const validationSchema = Yup.object({
  time: Yup.string()
    .required("Обязательное поле")
    .matches(/^\d{2}:\d{2}:\d{2}$/, "Формат времени должен быть HH:mm:ss"),
  price_ticket: Yup.number()
    .required("Обязательное поле")
    .min(1, "Число должно быть больше 0"),
  percent_fond: Yup.number()
    .required("Обязательное поле")
    .min(0, "Процент должен быть от 0 до 100")
    .max(100, "Процент должен быть от 0 до 100"),
  is_start: Yup.boolean().required("Обязательное поле"),
  count_number_row: Yup.array()
    .of(Yup.number().min(1, "Число должно быть больше 0"))
    .min(1, "Необходимо указать хотя бы одну строку")
    .required("Обязательное поле"),
  count_fill_user: Yup.number()
    .required("Обязательное поле")
    .min(1, "Число должно быть больше 0"),
});

export function CreateGame() {
  const [winSum, setWinSum] = useState<{ [key: number]: number }>({});
  const [rowInputs, setRowInputs] = useState<number[]>([3]);

  const handleAddRowInput = () => {
    setRowInputs((prev) => [...prev, 3]);
  };

  const handleRemoveRowInput = (index: number) => {
    setRowInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRowInputChange = (index: number, value: number) => {
    setRowInputs((prev) => {
      const newRows = [...prev];
      newRows[index] = value;
      return newRows;
    });
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const authToken = Cookies.get("auth_token");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/setting_ticket`,
        {
          time: values.time,
          price_ticket: values.price_ticket,
          percent_fond: values.percent_fond,
          is_start: values.is_start,
          count_number_row: rowInputs,
          count_fill_user: values.count_fill_user,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (response.data.success) {
        alert("Лотерея успешно создана!");
        resetForm();
        setWinSum({});
        setRowInputs([3]);
      }
    } catch (error) {
      console.error("Ошибка при создании лотереи:", error);
      alert("Ошибка при создании лотереи. Попробуйте снова.");
    }
  };

  return (
    <Paper elevation={4} className={styles.createGame}>
      <Formik
        initialValues={{
          time: "",
          price_ticket: "",
          percent_fond: "",
          is_start: false,
          count_number_row: [3],
          count_fill_user: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className={styles.form}>
            <h2 className={styles.title}>Новая лотерея</h2>
            <div className={styles.inputContainer}>
              <Field
                as={TextField}
                name="time"
                type="text"
                label="Время (HH:mm:ss)"
                className={styles.inputField}
                helperText={<ErrorMessage name="time" />}
                size="small"
              />
              <Field
                as={TextField}
                name="price_ticket"
                type="number"
                label="Цена билета (₽)"
                className={styles.inputField}
                helperText={<ErrorMessage name="price_ticket" />}
                size="small"
              />
              <Field
                as={TextField}
                name="percent_fond"
                type="number"
                label="Процент фонда (%)"
                className={styles.inputField}
                helperText={<ErrorMessage name="percent_fond" />}
                size="small"
              />
            </div>
            <div className={styles.inputContainer}>
              <Field
                as={TextField}
                name="count_fill_user"
                type="number"
                label="Чисел для выбора"
                className={styles.inputField}
                helperText={<ErrorMessage name="count_fill_user" />}
                size="small"
              />
            </div>
            <div className={styles.inputContainer}>
              <Typography variant="subtitle1">
                Количество чисел в строках:
              </Typography>
              {rowInputs.map((row, index) => (
                <div key={index} className={styles.rowInput}>
                  <TextField
                    type="number"
                    label={`Строка ${index + 1}`}
                    value={row}
                    onChange={(e) =>
                      handleRowInputChange(index, Number(e.target.value))
                    }
                    className={styles.inputField}
                    size="small"
                    error={rowInputs[index] < 1}
                    helperText={
                      rowInputs[index] < 1 ? "Число должно быть больше 0" : ""
                    }
                  />
                  {rowInputs.length > 1 && (
                    <Button
                      onClick={() => handleRemoveRowInput(index)}
                      variant="outlined"
                      size="small"
                      color="error"
                    >
                      Удалить
                    </Button>
                  )}
                </div>
              ))}
              <Button
                startIcon={<AddIcon fontSize="small" />}
                onClick={handleAddRowInput}
                variant="outlined"
                size="small"
              >
                Добавить строку
              </Button>
            </div>
            <div className={styles.inputContainer}>
              <FormControlLabel
                name="is_start"
                label="Запустить сразу"
                control={
                  <Checkbox
                    checked={values.is_start}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue("is_start", e.target.checked)
                    }
                  />
                }
              />
            </div>
            <Button
              type="submit"
              className={styles.btn}
              variant="contained"
              size="small"
            >
              Создать лотерею
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
