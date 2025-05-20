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
} from "@mui/material";
import styles from "./LotteryList.module.scss";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { API_BASE_URL } from "@/api";

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
    console.log('AUTH TOKEN', authToken);
    const response = await axios.get(`${API_BASE_URL}/api/current_tickets`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
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
  const [tickets] = useState(initialTickets || []);
  const [loading] = useState(false);
  const [errorMessage] = useState(error);

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
        <Typography variant="h6">Не найдено активных лотерей.</Typography>
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
                  Generated: {formatDate(ticket.date_generated)}{" "}
                  {formatTime(ticket.time_generated)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Price: ${ticket.setting.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Time: {formatTime(ticket.setting.time)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  User Fill: {ticket.setting.count_fill_user}
                </Typography>
                <Box className={styles.numbersGrid}>
                  <Typography variant="subtitle1">Numbers:</Typography>
                  <Grid container spacing={1}>
                    {ticket.numbers.map((number: any, index: number) => (
                      <Grid key={index}>
                        <Box className={styles.numberCircle}>{number}</Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LotteryList;
