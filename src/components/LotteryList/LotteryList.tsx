import { useState } from "react";
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
import Link from "next/link";
import styles from "./LotteryList.module.scss";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { API_BASE_URL } from "@/api";
import { FillTicketModal } from "../FillTicketModal/FillTicketModal";
import axios from "axios";

type LotteryListProps = InferGetServerSidePropsType<
  typeof getServerSideProps
> & {
  maxItems?: number;
};

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

const formatPrice = (priceString: string) => {
  try {
    const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ""));
    return numericPrice.toFixed(2);
  } catch {
    return priceString;
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

    if (response.data) {
      return {
        props: {
          initialTickets: response.data,
          error: null,
        },
      };
    } else {
      return {
        props: {
          initialTickets: [],
          error: response.data?.message,
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

const LotteryList = ({ initialTickets, error, maxItems }: LotteryListProps) => {
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

  const displayedTickets = maxItems ? tickets.slice(0, maxItems) : tickets;
  console.log(displayedTickets);
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
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          Доступные лотереи
        </Typography>
        {maxItems && tickets.length > maxItems && (
          <Link href="/lotteries" passHref>
            <Button variant="outlined" className={styles.viewAllButton}>
              Посмотреть все лотереи
            </Button>
          </Link>
        )}
      </Box>
      <Grid container justifyContent="space-between" spacing={3}>
        {displayedTickets.map((ticket: any) => (
          <Grid key={ticket.id} sx={{ maxWidth: 350 }}>
            <Card className={styles.card}>
              <CardContent>
                <Typography variant="h6" className={styles.cardTitle}>
                  Лотерея #{ticket.id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Время: {formatTime(ticket.time)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Цена: {formatPrice(ticket.price_ticket)} ₽
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Чисел для выбора: {ticket.count_fill_user}
                </Typography>
                {ticket.is_start && (
                  <Typography variant="body2" color="textSecondary">
                    Статус:{" "}
                    {ticket.generated_tickets?.length
                      ? "Завершилась"
                      : "Началась"}
                  </Typography>
                )}
                <Box className={styles.numbersGrid}>
                  <Typography variant="subtitle1">Числа:</Typography>
                  <Grid container spacing={1}>
                    {ticket.arr_number.map((number: number, index: number) => (
                      <Grid key={index}>
                        <Box className={styles.numberCircle}>{number}</Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                {!ticket.generated_tickets?.length && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(ticket)}
                    className={styles.fillButton}
                  >
                    Заполнить билет
                  </Button>
                )}
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
