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

interface SettingTicketFormValues {
  time: string;
  price_ticket: number;
  percent_fond: number;
  is_start: boolean;
  count_number_row: number[];
  count_fill_user: number;
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
  const [rowInputs, setRowInputs] = useState<number[]>(
    defaultValues?.count_number_row ?? [3]
  );

  const initialValues: SettingTicketFormValues = defaultValues
    ? {
        time: defaultValues.time || "",
        price_ticket: defaultValues.price_ticket || 0,
        percent_fond: defaultValues.percent_fond || 0,
        is_start: defaultValues.is_start || false,
        count_number_row: defaultValues.count_number_row || [3, 3, 3],
        count_fill_user: defaultValues.count_fill_user || 0,
      }
    : {
        time: "00:15:00",
        price_ticket: 0,
        percent_fond: 0,
        is_start: false,
        count_number_row: [3, 3, 3],
        count_fill_user: 0,
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

  const handleSubmit = async (
    values: SettingTicketFormValues,
    { resetForm }: any
  ) => {
    const authToken = Cookies.get("auth_token");
    try {
      let response;
      if (settingTicketId) {
        response = await axios.put(
          `${API_BASE_URL}/api/update-setting_ticket/${settingTicketId}`,
          {
            time: values.time || null,
            price_ticket: values.price_ticket || null,
            percent_fond: values.percent_fond || null,
            is_start: values.is_start,
            count_number_row: rowInputs,
            count_fill_user: values.count_fill_user || null,
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/api/setting_ticket`,
          {
            time: values.time || null,
            price_ticket: values.price_ticket || null,
            percent_fond: values.percent_fond || null,
            is_start: values.is_start,
            count_number_row: rowInputs,
            count_fill_user: values.count_fill_user || null,
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      }

      if (response.data.success) {
        alert(settingTicketId ? "Настройки обновлены!" : "Лотерея создана!");
        resetForm();
        setWinSum({});
        setRowInputs([3]);
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
