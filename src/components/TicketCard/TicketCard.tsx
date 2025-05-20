import { Card, CardContent, Typography, Grid, Box, Chip } from "@mui/material";
import styles from "./TicketCard.module.scss";

interface TicketCardProps {
  ticket: {
    id: number;
    date: string;
    time: string;
    filled_cell: number[];
    is_win: boolean;
    history_operation_id: number | null;
    generated_ticket: {
      arr_number: number[];
      arr_true_number: number[];
      date_generated: string;
      id: number;
      time_generated: string;
    } | null;
    history: {
      id: number;
      change: number;
      is_succesfull: boolean;
      type_transaction: string;
    } | null;
    setting: {
      count_fill_user: number;
      count_number_row: number[];
      id: number;
      price: number;
    };
  };
}

const formatTime = (timeString: string) => {
  try {
    const [hours, minutes, seconds] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(
      2,
      "0"
    )}:${seconds.padStart(2, "0")}`;
  } catch {
    return timeString;
  }
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const { generated_ticket, history, setting } = ticket;
  const { count_number_row } = setting || {
    count_number_row: [3, 3, 3],
  };

  const numberGridRows = [];
  let currentIndex = 0;
  for (const rowSize of count_number_row) {
    numberGridRows.push(
      generated_ticket?.arr_number.slice(
        currentIndex,
        currentIndex + rowSize
      ) || []
    );
    currentIndex += rowSize;
  }

  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography variant="h6" className={styles.cardTitle}>
          Билет #{ticket.id}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Дата: {formatDate(ticket.date)} {formatTime(ticket.time)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Лотерея: #{setting?.id || "N/A"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Цена: {setting?.price?.toFixed(2) || "N/A"} ₽
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Typography variant="body2" color="textSecondary">
            Статус:{" "}
          </Typography>
          <Chip
            label={ticket.is_win ? "Победа" : "Не выиграл"}
            color={ticket.is_win ? "success" : "default"}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="textSecondary">
          Транзакция: {history?.is_succesfull ? "Успешно" : "Успешно"} (
          {history?.type_transaction ?? "N/A"})
        </Typography>
        <Box className={styles.numbersGrid}>
          <Typography variant="subtitle1">Выбранные числа:</Typography>
          <Grid container spacing={1}>
            {numberGridRows.map((row, rowIndex) => (
              <Grid container spacing={1} key={rowIndex}>
                {row.map((number, cellIndex) => (
                  <Grid key={cellIndex}>
                    <Box
                      className={`${styles.numberCircle} ${
                        ticket.filled_cell.includes(number)
                          ? styles.selectedNumber
                          : ""
                      }`}
                    >
                      {number}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        </Box>
        {ticket.generated_ticket?.arr_true_number && (
          <Box className={styles.numbersGrid}>
            <Typography variant="subtitle1">Выигрышные числа:</Typography>
            <Grid container spacing={1}>
              {numberGridRows.map((row, rowIndex) => (
                <Grid container spacing={1} key={rowIndex}>
                  {row.map((number, cellIndex) => (
                    <Grid key={cellIndex}>
                      <Box
                        className={`${styles.numberCircle} ${
                          ticket.generated_ticket?.arr_true_number?.includes(
                            number
                          )
                            ? styles.winningNumber
                            : ""
                        }`}
                      >
                        {number}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
