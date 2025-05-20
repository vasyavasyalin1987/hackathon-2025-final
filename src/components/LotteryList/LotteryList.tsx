import { useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
} from "@mui/material";
import styles from "./LotteryList.module.scss";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { API_BASE_URL } from "@/api";
import { FillTicketModal } from "../FillTicketModal/FillTicketModal";

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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const authToken = req.cookies.auth_token || "";

  try {
    if (!authToken) {
      return {
        props: {
          initialTickets: [],
          error: null,
        },
      };
    }

    const response = await axios.get(`${API_BASE_URL}/api/current_tickets`, {
      headers: {
        Authorization: authToken,
      },
    });

    if (response.data.success) {
      return {
        props: {
          initialTickets: response.data.tickets,
          error: null,
        },
      };
    } else {
      return {
        props: {
          initialTickets: [],
          error: response.data.message,
        },
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      props: {
        initialTickets: [],
        error:
          error.response?.data?.message ||
          "Не получилось получить список лотерей",
      },
    };
  }
}

const LotteryList = ({
  initialTickets,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tickets] = useState(initialTickets || []);
  const [loading] = useState(false);
  const [errorMessage] = useState(error);

  const handleOpenModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
    setModalOpen(false);
  };

  if (loading) {
    return (
      <Container className={styles.loadingContainer}>
        <CircularProgress />
      </Container>
    );
  }

  if (errorMessage) {
    return (
      <Container className={styles.errorContainer}>
        <Alert severity="error">{errorMessage}</Alert>
      </Container>
    );
  }

  if (tickets.length === 0) {
    return (
      <Container className={styles.emptyContainer}>
        <Typography variant="h6">
          Не найдено активных лотерей. Зарегистрируйтесь или авторизуйтесь чтобы
          увидеть все лотереи.
        </Typography>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Доступные лотереи
      </Typography>
      <Grid container spacing={3}>
        {tickets.map((ticket: any) => (
          <Grid key={ticket.id}>
            <Card className={styles.card}>
              <CardContent>
                <Typography variant="h6" className={styles.cardTitle}>
                  Лотерея #{ticket.id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Сгенерировано: {formatDate(ticket.date_generated)}{" "}
                  {formatTime(ticket.time_generated)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Цена: {ticket.setting.price.toFixed(2)} ₽
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Время: {formatTime(ticket.setting.time)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Чисел для выбора: {ticket.setting.count_fill_user}
                </Typography>
                <Box className={styles.numbersGrid}>
                  <Typography variant="subtitle1">Числа:</Typography>
                  <Grid container spacing={1}>
                    {ticket.numbers.map((number: any, index: any) => (
                      <Grid key={index}>
                        <Box className={styles.numberCircle}>{number}</Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenModal(ticket)}
                  className={styles.fillButton}
                >
                  Заполнить билет
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedTicket && (
        <FillTicketModal
          open={modalOpen}
          onClose={handleCloseModal}
          ticket={selectedTicket}
        />
      )}
    </Container>
  );
};

export default LotteryList;
