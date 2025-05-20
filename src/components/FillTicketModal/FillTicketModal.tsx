import { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import styles from "./FillTicketModal.module.scss";
import { API_BASE_URL } from "@/api";

export interface IFillTicketModalProps {
  open: boolean;
  ticket: any;
  onClose: () => void;
}

export const FillTicketModal = ({
  open,
  onClose,
  ticket,
}: IFillTicketModalProps) => {
  const authToken = Cookies.get("auth_token");
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<number[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<number | null>(null);

  // Parse price_ticket (e.g., "$100.50" to 100.50)
  const formatPrice = (priceString: string) => {
    try {
      return parseFloat(priceString.replace(/[^0-9.]/g, ""));
    } catch {
      return 0;
    }
  };

  const price = ticket?.price_ticket ? formatPrice(ticket.price_ticket) : 0;
  const count_number_row = ticket?.count_number_row || [3, 3, 3];
  const count_fill_user = ticket?.count_fill_user || 5;
  const arr_number =
    ticket?.arr_number || Array.from({ length: 9 }, (_, i) => i + 1);

  const multiplierFactors: { [key: number]: number } = {
    1.25: 3.25,
    1.5: 4,
    2: 5.25,
  };

  const adjustedPrice = multiplier
    ? price * multiplierFactors[multiplier]
    : price;
  const totalNumbers = count_number_row.reduce(
    (sum: number, num: number) => sum + num,
    0
  );
  const numbers = arr_number;
  const rows = count_number_row.length;
  const cols = Math.max(...count_number_row);
  const numberGridRows: number[][] = [];
  let currentIndex = 0;
  for (const rowSize of count_number_row) {
    numberGridRows.push(numbers.slice(currentIndex, currentIndex + rowSize));
    currentIndex += rowSize;
  }

  const generateLines = (
    rows: number,
    cols: number
  ): { [key: string]: number[] } => {
    const lines: { [key: string]: number[] } = {};
    for (let r = 0; r < rows; r++) {
      const rowIndices = [];
      for (let c = 0; c < count_number_row[r]; c++) {
        rowIndices.push(r * cols + c);
      }
      if (rowIndices.length >= 2) {
        lines[`h${r + 1}`] = rowIndices;
      }
    }

    for (let c = 0; c < cols; c++) {
      const colIndices = [];
      for (let r = 0; r < rows; r++) {
        const index = r * cols + c;
        if (index < totalNumbers) {
          colIndices.push(index);
        }
      }
      if (colIndices.length >= 2) {
        lines[`v${c + 1}`] = colIndices;
      }
    }

    if (rows >= 2 && cols >= 2) {
      const diag1 = [];
      for (let i = 0; i < Math.min(rows, cols); i++) {
        const index = i * cols + i;
        if (index < totalNumbers) {
          diag1.push(index);
        }
      }
      if (diag1.length >= 2) {
        lines["d1"] = diag1;
      }

      const diag2 = [];
      for (let i = 0; i < Math.min(rows, cols); i++) {
        const index = i * cols + (cols - 1 - i);
        if (index < totalNumbers) {
          diag2.push(index);
        }
      }
      if (diag2.length >= 2) {
        lines["d2"] = diag2;
      }
    }

    return lines;
  };

  const lines = generateLines(rows, cols);

  const handleNumberClick = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else if (selectedNumbers.length < count_fill_user) {
      setSelectedNumbers([...selectedNumbers, number]);
    } else {
      setError(`Вы можете выбрать только ${count_fill_user} чисел.`);
    }
  };

  const handleMouseDown = (index: number) => {
    if (!multiplier) return;
    setIsDragging(true);
    dragStart.current = index;
    setSelectedLine(null);
  };

  const handleMouseOver = (index: number) => {
    if (!isDragging || !multiplier || dragStart.current === null) return;

    for (const line of Object.values(lines)) {
      if (
        line.includes(dragStart.current) &&
        line.includes(index) &&
        line.length === 3
      ) {
        setSelectedLine(line);
        return;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
    if (!selectedLine && multiplier) {
      setError("Пожалуйста, выберите линию для мультипликатора.");
    }
  };

  const handleMultiplierChange = (event: any) => {
    const value = event.target.value;
    setMultiplier(value ? Number(value) : null);
    setSelectedLine(null);
  };

  const handleSubmit = async () => {
    if (selectedNumbers.length !== count_fill_user) {
      setError(`Пожалуйста, выберите ровно ${count_fill_user} чисел.`);
      return;
    }

    if (multiplier && !selectedLine) {
      setError("Пожалуйста, выберите линию для мультипликатора.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/filled_ticket`,
        {
          id_setting_ticket: ticket.id,
          arr_number: selectedNumbers,
          multiplier: multiplier || 1,
          price_multiplier: multiplierFactors[multiplier || 1] ?? 1,
          arr_multiplier_number: selectedLine
            ? selectedLine.map((i) => numbers[i])
            : null,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (response.data.success) {
        alert("Билет успешно оплачен!");
        onClose();
      } else {
        setError(response.data.message || "Ошибка при отправке билета.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка сервера.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Заполнить билет #{ticket?.id}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" className={styles.error}>
            {error}
          </Alert>
        )}
        <Typography variant="body1" gutterBottom>
          Цена билета: {adjustedPrice.toFixed(2)} ₽
        </Typography>
        <FormControl fullWidth className={styles.multiplierSelect}>
          <InputLabel>Мультипликатор</InputLabel>
          <Select
            value={multiplier || ""}
            onChange={handleMultiplierChange}
            label="Мультипликатор"
          >
            <MenuItem value="">Без мультипликатора</MenuItem>
            <MenuItem value={1.25}>1.25x (цена x3.25)</MenuItem>
            <MenuItem value={1.5}>1.5x (цена x4)</MenuItem>
            <MenuItem value={2}>2x (цена x5.25)</MenuItem>
          </Select>
        </FormControl>
        <Box className={styles.gridContainer}>
          <Box className={styles.gridSection}>
            <Typography variant="body1" gutterBottom>
              Выберите {count_fill_user} чисел:
            </Typography>
            <Box className={styles.numberGrid}>
              {numberGridRows.map((row, rowIndex) => (
                <Grid
                  container
                  spacing={2}
                  key={rowIndex}
                  className={styles.gridRow}
                >
                  {row.map((number: number) => (
                    <Grid key={number}>
                      <Box
                        className={`${styles.numberCircle} ${
                          selectedNumbers.includes(number)
                            ? styles.selectedNumber
                            : ""
                        }`}
                        onClick={() => handleNumberClick(number)}
                      >
                        {number}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Box>
          </Box>
          {multiplier && (
            <Box className={styles.gridSection}>
              <Typography variant="body1" gutterBottom>
                Перетащите для выбора линии:
              </Typography>
              <Box className={styles.numberGrid}>
                {numberGridRows.map((row, rowIndex) => (
                  <Grid
                    container
                    spacing={2}
                    key={rowIndex}
                    className={styles.gridRow}
                  >
                    {row.map((number: number, cellIndex: number) => {
                      const flatIndex = rowIndex * cols + cellIndex;
                      return (
                        <Grid key={number}>
                          <Box
                            className={`${styles.numberCircle} ${
                              selectedLine?.includes(flatIndex)
                                ? styles.selectedLine
                                : ""
                            } ${!multiplier ? styles.disabled : ""}`}
                            onMouseDown={() => handleMouseDown(flatIndex)}
                            onMouseOver={() => handleMouseOver(flatIndex)}
                            onMouseUp={handleMouseUp}
                          >
                            {number}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                ))}
              </Box>
            </Box>
          )}
        </Box>
        {selectedNumbers.length > 0 && (
          <Typography variant="body2" className={styles.selectedNumbers}>
            Выбранные числа: {selectedNumbers.join(", ")}
          </Typography>
        )}
        {selectedLine && (
          <Typography variant="body2" className={styles.selectedNumbers}>
            Выбранная линия: {selectedLine.map((i) => numbers[i]).join(", ")}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={
            loading ||
            selectedNumbers.length !== count_fill_user ||
            (Boolean(multiplier) && !selectedLine)
          }
        >
          {loading ? <CircularProgress size={24} /> : "Оплатить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
