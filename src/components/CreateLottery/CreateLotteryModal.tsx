import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import styles from "./CreateLottery.module.scss";
import { API_BASE_URL } from "@/api";
import { SettingTicket } from "@/models/lottery";

const validationSchema = Yup.object({
  size_x: Yup.number()
    .required("Обязательное поле")
    .min(4, "Число должно быть больше 3"),
  size_y: Yup.number()
    .required("Обязательное поле")
    .min(4, "Число должно быть больше 3"),
  count_number_row: Yup.number()
    .required("Обязательное поле")
    .min(1, "Число должно быть больше 0"),
  price_ticket: Yup.number()
    .required("Обязательное поле")
    .min(1, "Число должно быть больше 0"),
  percent_fond: Yup.number()
    .required("Обязательное поле")
    .min(0, "Процент должен быть от 0 до 100")
    .max(100, "Процент должен быть от 0 до 100"),
  time: Yup.number()
    .required("Обязательное поле")
    .min(1, "Число должно быть больше 0"),
  count_fill_user: Yup.number()
    .required("Обязательное поле")
    .min(1, "Число должно быть больше 0"),
  is_start: Yup.boolean().required("Обязательное поле"),
});

interface SettingTicketFormValues {
  time: number | "";
  price_ticket: number | "";
  percent_fond: number | "";
  is_start: boolean;
  size_x: number | "";
  size_y: number | "";
  count_number_row: number | "";
  count_fill_user: number | "";
}

interface CreateLotteryModalProps {
  open: boolean;
  onClose: () => void;
  settingTicketId?: number;
  defaultValues?: SettingTicket; 
}

export function CreateLotteryModal({
  open,
  onClose,
  settingTicketId,
  defaultValues,
}: CreateLotteryModalProps) {
  const [winSum, setWinSum] = useState<{ [key: number]: number }>({});
  const [showWinInputs, setShowWinInputs] = useState(false);
  const [newWinCombination, setNewWinCombination] = useState<number>(0);
  const [newWinSum, setNewWinSum] = useState<number>(0);

  const initialValues: SettingTicketFormValues = defaultValues
    ? {
        time: defaultValues.time || "",
        price_ticket: defaultValues.price_ticket || "",
        percent_fond: defaultValues.percent_fond || "",
        is_start: defaultValues.is_start || false,
        size_x: defaultValues.size_x || "",
        size_y: defaultValues.size_y || "",
        count_number_row: defaultValues.count_number_row || "",
        count_fill_user: defaultValues.count_fill_user || "",
      }
    : {
        time: "",
        price_ticket: "",
        percent_fond: "",
        is_start: false,
        size_x: "",
        size_y: "",
        count_number_row: "",
        count_fill_user: "",
      };

  const addWin = (winCombination: number | undefined) => {
    if (
      newWinCombination > 0 &&
      winCombination &&
      newWinCombination <= winCombination &&
      newWinSum > 0
    ) {
      setWinSum((prev) => ({
        ...prev,
        [newWinCombination]: newWinSum,
      }));
      setNewWinCombination(0);
      setNewWinSum(0);
      setShowWinInputs(false);
    } else {
      alert("Введите корректные значения для приза.");
    }
  };

  const handleSubmit = async (
    values: SettingTicketFormValues,
    { resetForm }: any
  ) => {
    try {
      let response;
      if (settingTicketId) {
        response = await axios.put(
          `${API_BASE_URL}/update-setting_ticket/${settingTicketId}`,
          {
            time: values.time || null,
            price_ticket: values.price_ticket || null,
            percent_fond: values.percent_fond || null,
            is_start: values.is_start,
            size_x: values.size_x || null,
            size_y: values.size_y || null,
            count_number_row: values.count_number_row || null,
            count_fill_user: values.count_fill_user || null,
          }
        );
      } else {
        response = await axios.post(`${API_BASE_URL}/setting_ticket`, {
          time: values.time || null,
          price_ticket: values.price_ticket || null,
          percent_fond: values.percent_fond || null,
          is_start: values.is_start,
          size_x: values.size_x || null,
          size_y: values.size_y || null,
          count_number_row: values.count_number_row || null,
          count_fill_user: values.count_fill_user || null,
        });
      }

      if (response.data.success) {
        alert(settingTicketId ? "Настройки обновлены!" : "Лотерея создана!");
        console.log("Данные отправлены:", { ...values, winSum });
        resetForm();
        setWinSum({});
        onClose();
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка при сохранении. Попробуйте снова.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          maxWidth: "98%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {settingTicketId ? "Редактировать лотерею" : "Новая лотерея"}
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className={styles.form}>
              <div className={styles.inputContainer}>
                <Field
                  as={TextField}
                  name="size_x"
                  type="number"
                  label="Ширина поля"
                  className={styles.inputField}
                  helperText={<ErrorMessage name="size_x" />}
                  size="small"
                />
                <Field
                  as={TextField}
                  name="size_y"
                  type="number"
                  label="Высота поля"
                  className={styles.inputField}
                  helperText={<ErrorMessage name="size_y" />}
                  size="small"
                />
                <Field
                  as={TextField}
                  name="count_number_row"
                  type="number"
                  label="Количество билетов"
                  className={styles.inputField}
                  helperText={<ErrorMessage name="count_number_row" />}
                  size="small"
                />
              </div>
              <div className={styles.inputContainer}>
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
                <Field
                  as={TextField}
                  name="time"
                  type="number"
                  label="Время (минуты)"
                  className={styles.inputField}
                  helperText={<ErrorMessage name="time" />}
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
                className={styles.btnText}
                startIcon={<AddIcon fontSize="small" />}
                onClick={() => setShowWinInputs(true)}
                variant="outlined"
                size="small"
              >
                Добавить приз
              </Button>
              {showWinInputs && (
                <div className={styles.winInputContainer}>
                  <TextField
                    type="number"
                    label="Совпадений"
                    value={newWinCombination}
                    onChange={(e) =>
                      setNewWinCombination(Number(e.target.value))
                    }
                    className={styles.inputField}
                    size="small"
                  />
                  <TextField
                    type="number"
                    label="Сумма приза (₽)"
                    value={newWinSum}
                    onChange={(e) => setNewWinSum(Number(e.target.value))}
                    className={styles.inputField}
                    size="small"
                  />
                  <Button
                    className={styles.btnText}
                    onClick={() => addWin(Number(values.count_fill_user))}
                    variant="contained"
                    size="small"
                  >
                    Ок
                  </Button>
                </div>
              )}
              <div className={styles.winList}>
                {Object.entries(winSum).map(([key, value]) => (
                  <div key={key} className={styles.summ}>
                    <span>{key} совпадений</span>
                    <span>{value} ₽</span>
                  </div>
                ))}
              </div>
              <Button
                type="submit"
                className={styles.btn}
                variant="contained"
                size="small"
              >
                {settingTicketId ? "Сохранить" : "Создать лотерею"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
