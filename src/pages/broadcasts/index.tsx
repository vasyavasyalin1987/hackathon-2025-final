import React from "react";
import { Container, Typography, Box, Button, Divider } from "@mui/material";
import styles from "./Broadcasts.module.scss";
import Link from "next/link";
import { Layout } from "@/components/Layout/Layout";

const BroadcastsPage: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="md" className={styles.placeholderContainer}>
        <Box my={4} textAlign="center">
          <Typography variant="h2" component="h1" className={styles.title}>
            Трансляции
          </Typography>
          <Divider className={styles.divider} />
          <Box mt={4}>
            <Typography variant="h4" component="h2" className={styles.message}>
              В разработке
            </Typography>
            <Typography
              variant="body1"
              paragraph
              className={styles.description}
            >
              Скоро вы сможете смотреть прямые трансляции игровых сессий,
              турниров и других захватывающих событий! Мы готовим платформу для
              интерактивного взаимодействия с игроками и зрителями. Следите за
              обновлениями, чтобы не пропустить запуск!
            </Typography>
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/"
                className={styles.backButton}
              >
                Вернуться на главную
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default BroadcastsPage;
