import { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { API_BASE_URL } from "@/api";
import styles from "@/components/LotteryList/LotteryList.module.scss";
import { TicketCard } from "@/components/TicketCard/TicketCard";
import { Layout } from "@/components/Layout/Layout";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const authToken = req.cookies.auth_token || "";

  try {
    if (!authToken) {
      return {
        props: {
          initialTickets: [],
          error: "Пожалуйста, авторизуйтесь для просмотра ваших билетов",
        },
      };
    }

    const response = await axios.get(`${API_BASE_URL}/api/filled_ticket`, {
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
          error: response.data.message || "Не удалось получить список билетов",
        },
      };
    }
  } catch (error: any) {
    console.error("Error fetching filled tickets:", error);
    return {
      props: {
        initialTickets: [],
        error:
          error.response?.data?.message ||
          "Ошибка сервера при получении билетов",
      },
    };
  }
}

interface MyTicketsProps {
  initialTickets: any[];
  error: string | null;
}

const MyTickets = ({ initialTickets, error }: MyTicketsProps) => {
  const [tickets] = useState(initialTickets || []);
  const [loading] = useState(false);
  const [errorMessage] = useState(error);

  if (loading) {
    return (
      <Layout>
        <Container className={styles.loadingContainer}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  if (errorMessage) {
    return (
      <Layout>
        <Container className={styles.errorContainer}>
          <Alert severity="error">{errorMessage}</Alert>
        </Container>
      </Layout>
    );
  }

  if (tickets.length === 0) {
    return (
      <Layout>
        <Container className={styles.emptyContainer}>
          <Typography variant="h6">
            У вас нет заполненных билетов. Купите билет, чтобы участвовать в
            лотерее!
          </Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className={styles.container}>
        <Typography variant="h4" className={styles.title}>
          Мои билеты
        </Typography>
        <Grid container spacing={3}>
          {tickets.map((ticket: any) => (
            <Grid key={ticket.id}>
              <TicketCard ticket={ticket} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default MyTickets;
