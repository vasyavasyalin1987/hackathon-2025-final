import { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Divider,
} from "@mui/material";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { API_BASE_URL } from "@/api";
import styles from "@/components/LotteryList/LotteryList.module.scss";
import stylesHistory from "./styles.module.scss";
import { TicketCard } from "@/components/TicketCard/TicketCard";
import { Layout } from "@/components/Layout/Layout";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const authToken = req.cookies.auth_token || "";

  try {
    if (!authToken) {
      return {
        props: {
          userData: null,
          error: "Пожалуйста, авторизуйтесь для просмотра истории",
        },
      };
    }

    const response = await axios.get(`${API_BASE_URL}/api/user_info`, {
      headers: {
        Authorization: authToken,
      },
    });

    if (response.data.success) {
      return {
        props: {
          userData: response.data.user,
          error: null,
        },
      };
    } else {
      return {
        props: {
          userData: null,
          error:
            response.data.message || "Не удалось получить данные пользователя",
        },
      };
    }
  } catch (error: any) {
    console.error("Error fetching user info:", error);
    return {
      props: {
        userData: null,
        error:
          error.response?.data?.message ||
          "Ошибка сервера при получении данных",
      },
    };
  }
}

interface UserHistoryProps {
  userData: any;
  error: string | null;
}

const formatDateTime = (date: string, time: string) => {
  try {
    return `${new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })} ${time.split(".")[0]}`;
  } catch {
    return `${date} ${time}`;
  }
};

const UserHistory = ({ userData, error }: UserHistoryProps) => {
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

  if (errorMessage || !userData) {
    return (
      <Layout>
        <Container className={styles.errorContainer}>
          <Alert severity="error">
            {errorMessage || "Данные пользователя недоступны"}
          </Alert>
        </Container>
      </Layout>
    );
  }

  const { history_operations, filled_tickets } = userData;
  return (
    <Layout>
      <Container className={styles.container}>
        <Typography variant="h4" className={styles.title}>
          История пользователя
        </Typography>

        <Box className={stylesHistory.section}>
          <Typography variant="h5" className={stylesHistory.sectionTitle}>
            История операций
          </Typography>
          {history_operations.length === 0 ? (
            <Typography variant="body1">Нет операций</Typography>
          ) : (
            <Grid container spacing={3}>
              {history_operations.map((operation: any) => (
                <Grid key={operation.id}>
                  <Box className={stylesHistory.operationCard}>
                    <Typography variant="h6">
                      Операция #{operation.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Тип: {operation.operation_type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Дата: {formatDateTime(operation.date, operation.time)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Сумма: {operation.amount} ₽
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        operation.is_successful ? "success.main" : "success.main"
                      }
                    >
                      Статус:{" "}
                      {operation.is_successful ? "Успешно" : "Успешно"}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default UserHistory;
