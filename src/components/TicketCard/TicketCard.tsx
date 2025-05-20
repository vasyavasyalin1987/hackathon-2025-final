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
      id: number;
      setting_ticket_id: number;
      numbers: number[];
      winning_numbers: number[] | null;
      setting: {
        id: number;
        price: number;
        count_number_row: number[];
        count_fill_user: number;
      } | null;
    } | null;
    history: {
      id: number;
      change: number;
      is_succesfull: boolean;
      transaction_type: { id: number; naim: string } | null;
    } | null;
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
  const { generated_ticket, history } = ticket;
  const { count_number_row } = generated_ticket?.setting || {
    count_number_row: [3, 3, 3],
  };

  const numberGridRows = [];
  let currentIndex = 0;
  for (const rowSize of count_number_row) {
    numberGridRows.push(
      generated_ticket?.numbers.slice(currentIndex, currentIndex + rowSize) ||
        []
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
          Лотерея: #{generated_ticket?.id || "N/A"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Цена: {generated_ticket?.setting?.price?.toFixed(2) || "N/A"} ₽
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
          Транзакция: {history?.is_succesfull ? "Успешно" : "Неуспешно"} (
          {history?.transaction_type?.naim || "N/A"})
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
        {ticket.generated_ticket?.winning_numbers && (
          <Box className={styles.numbersGrid}>
            <Typography variant="subtitle1">Выигрышные числа:</Typography>
            <Grid container spacing={1}>
              {numberGridRows.map((row, rowIndex) => (
                <Grid container spacing={1} key={rowIndex}>
                  {row.map((number, cellIndex) => (
                    <Grid key={cellIndex}>
                      <Box
                        className={`${styles.numberCircle} ${
                          ticket.generated_ticket?.winning_numbers?.includes(
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
