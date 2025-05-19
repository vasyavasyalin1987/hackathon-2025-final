import React, { useState } from "react";
import styles from "./CreateLottery.module.scss";
import { Button, Paper, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  size: Yup.number().required("Обязательное поле").min(4, "Число > 3"),
  count: Yup.number().required("Обязательное поле").min(1, "Число > 0"),
  winCombination: Yup.number()
    .required("Обязательное поле")
    .min(1, "Число > 0"),
});

export function CreateGame() {
  const [winSum, setWinSum] = useState<{ [key: number]: number }>({});
  const [showWinInputs, setShowWinInputs] = useState(false);
  const [newWinCombination, setNewWinCombination] = useState<number>(0);
  const [newWinSum, setNewWinSum] = useState<number>(0);

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
      alert("Введите корректные значения.");
    }
  };

  return (
    <Paper elevation={4} className={styles.createGame}>
      <Formik
        initialValues={{
          size: "",
          count: "",
          winCombination: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          if (Object.keys(winSum).length === 0) {
            alert("Добавьте хотя бы один приз!");
            return;
          }
          console.log("Форма отправлена", { ...values, winSum });
          resetForm();
          setWinSum({});
        }}
      >
        {({ values }) => (
          <Form className={styles.form}>
            <h2 className={styles.title}>Новая лотерея</h2>

            <div className={styles.inputContainer}>
              <Field
                as={TextField}
                name="size"
                type="number"
                label="Поле"
                className={styles.inputField}
                helperText={<ErrorMessage name="size" />}
                error={Boolean(<ErrorMessage name="size" />)}
                size="small"
              />
              <Field
                as={TextField}
                name="count"
                type="number"
                label="Билетов"
                className={styles.inputField}
                helperText={<ErrorMessage name="count" />}
                error={Boolean(<ErrorMessage name="count" />)}
                size="small"
              />
              <Field
                as={TextField}
                name="winCombination"
                type="number"
                label="Чисел"
                className={styles.inputField}
                helperText={<ErrorMessage name="winCombination" />}
                error={Boolean(<ErrorMessage name="winCombination" />)}
                size="small"
              />
            </div>

            <Button
              className={styles.btnText}
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => setShowWinInputs(true)}
              variant="outlined"
              size="small"
            >
              Приз
            </Button>

            {showWinInputs && (
              <div className={styles.winInputContainer}>
                <TextField
                  type="number"
                  label="Совп."
                  value={newWinCombination}
                  onChange={(e) => setNewWinCombination(Number(e.target.value))}
                  className={styles.inputField}
                  size="small"
                />
                <TextField
                  type="number"
                  label="Сумма"
                  value={newWinSum}
                  onChange={(e) => setNewWinSum(Number(e.target.value))}
                  className={styles.inputField}
                  size="small"
                />
                <Button
                  className={styles.btnText}
                  onClick={() => addWin(Number(values.winCombination))}
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
                  <span>{key} совп.</span>
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
              Создать
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
