import React from "react";
import { Container, Typography, Box, Button, Divider } from "@mui/material";
import styles from "./TetrisLottery.module.scss";
import Link from "next/link";
import { Layout } from "@/components/Layout/Layout";

const TetrisLotteryPage = () => {
  return (
    <Layout>
      <Container maxWidth="md" className={styles.placeholderContainer}>
        <Box my={4} textAlign="center">
          <Typography variant="h2" component="h1" className={styles.title}>
            Тетрис-лотерея
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
              Скоро вы сможете насладиться уникальной игрой «Tetris Lottery»,
              сочетающей классический геймплей Тетриса с азартом лотереи! Мы
              работаем над созданием захватывающего опыта, где вы сможете
              собирать фигуры и выигрывать бонусы. Следите за обновлениями!
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

export default TetrisLotteryPage;
