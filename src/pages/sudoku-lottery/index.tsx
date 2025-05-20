import { API_BASE_URL } from "@/api";
import { Layout } from "@/components/Layout/Layout";
import SudokuLottery from "@/components/SudokuLottery/SudokuLottery";
import { Alert, Container } from "@mui/material";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import styles from "@/components/LotteryList/LotteryList.module.scss";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const authToken = req.cookies.auth_token || "";

  try {
    if (!authToken) {
      return {
        props: {
          userData: null,
          error: "Пожалуйста, авторизуйтесь для просмотра профиля",
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

interface UserProfileProps {
  userData: any;
  error: string | null;
}

export default function SudokuPage({ userData, error }: UserProfileProps) {
  const [errorMessage] = useState(error);

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

  return (
    <Layout>
      <SudokuLottery idSettingGame={1} userData={userData} />
    </Layout>
  );
}
