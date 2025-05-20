import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { API_BASE_URL } from "@/api";
import styles from "@/components/LotteryList/LotteryList.module.scss";
import stylesProfile from "./styles.module.scss";
import { Layout } from "@/components/Layout/Layout";

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

const formatDate = (date: string) => {
  try {
    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
};

const vipOffers = [
  { id: 1, name: "Мещанин", price: 500, days: 30 },
  { id: 2, name: "Буржуй", price: 1000, days: 30 },
  { id: 3, name: "Олигарх", price: 2000, days: 30 },
];

const UserProfile = ({ userData, error }: UserProfileProps) => {
  const [loading] = useState(false);
  const [errorMessage] = useState(error);
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [selectedVipOffer, setSelectedVipOffer] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [downgradeConfirmation, setDowngradeConfirmation] = useState(false);
  const [downgradeDetails, setDowngradeDetails] = useState<{
    currentCategory: number;
    newCategory: number;
  } | null>(null);

  const handleOpenVipModal = () => setVipModalOpen(true);

  const handleCloseVipModal = () => {
    setVipModalOpen(false);
    setSelectedVipOffer("");
    setDowngradeConfirmation(false);
    setDowngradeDetails(null);
  };

  const handlePurchaseVip = async () => {
    setPurchaseLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/buy_vip`,
        {
          vip_offer_id: selectedVipOffer,
          confirm_downgrade: downgradeConfirmation,
        },
        { headers: { Authorization: userData.account.token } }
      );

      if (response.data.success) {
        alert("VIP-статус успешно приобретен!");
        handleCloseVipModal();
        window.location.reload();
      } else {
        if (response.data.requires_confirmation) {
          setDowngradeDetails({
            currentCategory: response.data.current_category,
            newCategory: response.data.new_category,
          });
          setDowngradeConfirmation(true);
        } else {
          alert(response.data.message || "Ошибка при покупке VIP-статуса");
        }
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Вам отказано в доступе для приобретения/продления VIP-статуса, просим обратиться в поддержку"
      );
    } finally {
      setPurchaseLoading(false);
    }
  };

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

  const { account, info } = userData;

  return (
    <Layout>
      <Container className={styles.container}>
        <Typography variant="h4" className={styles.title}>
          Профиль пользователя
        </Typography>

        <Box className={stylesProfile.section}>
          <Typography variant="h5" className={stylesProfile.sectionTitle}>
            Информация об аккаунте
          </Typography>
          <Typography variant="body1">Логин: {account.login}</Typography>
          <Typography variant="body1">Роль: {account.role}</Typography>
        </Box>

        <Box className={stylesProfile.section}>
          <Typography variant="h5" className={stylesProfile.sectionTitle}>
            VIP-статус
          </Typography>
          {info.is_vip ? (
            <>
              <Typography variant="body1">
                Статус: {info.vip_category.name}
              </Typography>
              <Typography variant="body1">
                Действует до: {formatDate(info.vip_stop_date)}
              </Typography>
              <Typography variant="body1">
                Категория: {info.vip_category.category}
              </Typography>
            </>
          ) : (
            <Typography variant="body1">VIP-статус не активен</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenVipModal}
            className={stylesProfile.vipButton}
          >
            Купить VIP-статус
          </Button>
        </Box>

        <Box className={stylesProfile.section}>
          <Typography variant="h5" className={stylesProfile.sectionTitle}>
            Баланс
          </Typography>
          <Typography variant="body1">
            Реальная валюта: {info.balance_real} ₽
          </Typography>
          <Typography variant="body1">
            Виртуальная валюта: {info.balance_virtual} ₽
          </Typography>
        </Box>

        <Box className={stylesProfile.section}>
          <Typography variant="h5" className={stylesProfile.sectionTitle}>
            Бонусы
          </Typography>
          <Typography variant="body1">Нет активных бонусов</Typography>
        </Box>

        <Dialog open={vipModalOpen} onClose={handleCloseVipModal}>
          <DialogTitle>Покупка VIP-статуса</DialogTitle>
          <DialogContent>
            {downgradeDetails && (
              <Alert severity="warning" style={{ marginBottom: 16 }}>
                Новая категория VIP (
                {
                  vipOffers.find((o) => o.id === downgradeDetails.newCategory)
                    ?.name
                }
                ) ниже текущей (
                {
                  vipOffers.find(
                    (o) => o.id === downgradeDetails.currentCategory
                  )?.name
                }
                ). Подтвердите покупку.
              </Alert>
            )}
            <FormControl fullWidth className={stylesProfile.vipSelect}>
              <InputLabel>Категория VIP</InputLabel>
              <Select
                value={selectedVipOffer}
                onChange={(e) => setSelectedVipOffer(e.target.value)}
                label="Категория VIP"
              >
                {vipOffers.map((offer) => (
                  <MenuItem key={offer.id} value={offer.id}>
                    {offer.name} ({offer.days} дней, {offer.price} ₽)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseVipModal} color="secondary">
              Отмена
            </Button>
            <Button
              onClick={handlePurchaseVip}
              color="primary"
              variant="contained"
              disabled={!selectedVipOffer || purchaseLoading}
            >
              {purchaseLoading ? (
                <CircularProgress size={24} />
              ) : downgradeDetails ? (
                "Подтвердить"
              ) : (
                "Купить"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default UserProfile;
