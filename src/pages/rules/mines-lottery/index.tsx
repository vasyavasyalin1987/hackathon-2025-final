import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import styles from "./MinesRules.module.scss";
import { Layout } from "@/components/Layout/Layout";

const MinesRulesPage = () => {
  return (
    <Layout>
      <Container maxWidth="md" className={styles.rulesContainer}>
        <Box my={4}>
          <Typography variant="h2" component="h1" className={styles.title}>
            Правила игры «Мины»
          </Typography>
          <Divider className={styles.divider} />

          <section>
            <Typography
              variant="h4"
              component="h2"
              className={styles.sectionTitle}
            >
              Введение
            </Typography>
            <Typography variant="body1" paragraph>
              «Мины» — это захватывающая игра, сочетающая элементы риска,
              стратегии и удачи. Игроки открывают клетки на игровом поле, чтобы
              найти бонусы, конвертеры или избежать мин. Цель игры — заработать
              как можно больше бонусов и валюты за ограниченное количество
              ходов, выбирая подходящую сложность и управляя своими ресурсами.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              component="h2"
              className={styles.sectionTitle}
            >
              Основные правила игры
            </Typography>
            <Typography variant="body1" paragraph>
              Игра проходит на прямоугольном поле, состоящем из клеток, которые
              могут быть пустыми, содержать мины, бонусы или конвертеры. Игрок
              открывает клетки, чтобы получить награды, и может использовать
              конвертеры для обмена бонусов на валюту. Вот основные аспекты
              игры:
            </Typography>
            <ul className={styles.rulesList}>
              <li>
                <strong>Начало игры:</strong> Игрок выбирает уровень сложности
                («Лёгкий», «Классический» или «Удача»), который определяет
                размер поля и вероятность появления мин, бонусов и конвертеров.
                После выбора сложности игра начинается с заданным количеством
                шагов (60% от общего числа клеток).
              </li>
              <li>
                <strong>Типы клеток:</strong>
                <ul>
                  <li>
                    <strong>Пустая клетка (✓):</strong> Ничего не даёт, но
                    уменьшает количество оставшихся шагов при открытии.
                  </li>
                  <li>
                    <strong>Мина (💣):</strong> Не приносит бонусов или валюты,
                    уменьшает количество шагов.
                  </li>
                  <li>
                    <strong>Бонус (+10💎):</strong> Даёт 10 бонусов при
                    открытии.
                  </li>
                  <li>
                    <strong>Конвертер (💱):</strong> Позволяет обменять
                    указанное количество бонусов (от 1 до 5) на валюту (от 1 до
                    10) при нажатии кнопки «Остаться».
                  </li>
                </ul>
              </li>
              <li>
                <strong>Ходы:</strong> Игрок кликает по клетке, чтобы открыть
                её. Открытие клетки уменьшает количество оставшихся шагов. Если
                клетка уже открыта, повторное нажатие не считается ходом.
              </li>
              <li>
                <strong>Конвертеры:</strong> После открытия конвертера игрок
                может нажать кнопку «Остаться», чтобы обменять указанное
                количество бонусов на валюту. Для этого требуется достаточное
                количество бонусов, иначе действие не выполняется. Использование
                конвертера также уменьшает количество шагов.
              </li>
              <li>
                <strong>Ограничение шагов:</strong> Количество шагов равно 60%
                от общего числа клеток (округлено вниз). Когда шаги
                заканчиваются, игра автоматически завершается.
              </li>
              <li>
                <strong>Завершение игры:</strong> Игрок может завершить игру
                вручную, нажав кнопку «Завершить игру», или игра закончится
                автоматически, когда шаги исчерпаны. После этого отображаются
                результаты (потраченные бонусы и заработанная валюта), и баланс
                обновляется на сервере.
              </li>
            </ul>
          </section>

          <section>
            <Typography
              variant="h4"
              component="h2"
              className={styles.sectionTitle}
            >
              Уровни сложности
            </Typography>
            <Typography variant="body1" paragraph>
              Игра предлагает три уровня сложности, которые влияют на размер
              поля и вероятность появления клеток:
            </Typography>
            <ul className={styles.rulesList}>
              <li>
                <strong>Лёгкий:</strong> Поле 8x5 (40 клеток), 25% шанс мин, 25%
                шанс бонусов. Подходит для новичков, меньше риска.
              </li>
              <li>
                <strong>Классический:</strong> Поле 9x6 (54 клетки), 30% шанс
                мин, 20% шанс бонусов. Сбалансированный режим.
              </li>
              <li>
                <strong>Удача:</strong> Поле 10x7 (70 клеток), 40% шанс мин, 30%
                шанс бонусов. Высокий риск и высокая награда.
              </li>
              <li>
                Конвертеры имеют 15% шанс появления на всех уровнях, с
                случайными значениями обмена (1–5 бонусов за 1–10 валюты).
              </li>
            </ul>
          </section>

          <section>
            <Typography
              variant="h4"
              component="h2"
              className={styles.sectionTitle}
            >
              Баланс и ресурсы
            </Typography>
            <Typography variant="body1" paragraph>
              В игре используются два типа ресурсов:
            </Typography>
            <ul className={styles.rulesList}>
              <li>
                <strong>Бонусы (💎):</strong> Начисляются за открытие бонусных
                клеток (+10 бонусов). Используются для активации конвертеров.
              </li>
              <li>
                <strong>Валюта (💰):</strong> Зарабатывается через конвертеры.
                Начальный баланс бонусов и валюты берётся из профиля игрока.
              </li>
            </ul>
            <Typography variant="body1" paragraph>
              При завершении игры текущий баланс бонусов и валюты отправляется
              на сервер для обновления через API. Если обновление не удалось,
              отображается сообщение об ошибке.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              component="h2"
              className={styles.sectionTitle}
            >
              Интерфейс игры
            </Typography>
            <Typography variant="body1" paragraph>
              Игра состоит из трёх экранов:
            </Typography>
            <ul className={styles.rulesList}>
              <li>
                <strong>Меню:</strong> Игрок выбирает сложность («Лёгкий»,
                «Классический», «Удача»). Описание сложности отображается с
                кнопкой «Начать игру».
              </li>
              <li>
                <strong>Игровое поле:</strong> Сетка клеток (размер зависит от
                сложности), панель статуса (шаги, бонусы, валюта) и кнопки
                управления («Остаться» для конвертеров, «Завершить игру»).
              </li>
              <li>
                <strong>Результаты:</strong> Показывает потраченные бонусы и
                заработанную валюту. Кнопка «В меню» возвращает игрока к выбору
                сложности.
              </li>
            </ul>
            <Typography variant="body1" paragraph>
              Клетки подсвечиваются при выборе, а открытые клетки отображают
              свой тип (мина, бонус, конвертер или пустая). Ошибки, такие как
              неудачное обновление баланса, отображаются в виде уведомлений.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              component="h2"
              className={styles.sectionTitle}
            >
              Советы для игроков
            </Typography>
            <Typography variant="body1" paragraph>
              Чтобы добиться успеха в игре:
            </Typography>
            <ul className={styles.rulesList}>
              <li>
                Выбирайте сложность в зависимости от вашего стиля: «Лёгкий» для
                безопасной игры, «Удача» для риска и больших наград.
              </li>
              <li>
                Стремитесь открывать бонусные клетки, чтобы накопить бонусы для
                конвертеров.
              </li>
              <li>
                Используйте конвертеры стратегически: обменивайте бонусы на
                валюту, только если курс выгоден.
              </li>
              <li>
                Следите за количеством оставшихся шагов, чтобы завершить игру до
                их исчерпания.
              </li>
              <li>
                Если баланс не обновился, проверьте подключение к интернету и
                попробуйте снова.
              </li>
            </ul>
          </section>

          <Box mt={4}>
            <Typography variant="body1" paragraph>
              «Мины» — это игра, где удача и стратегия идут рука об руку.
              Открывайте клетки, собирайте бонусы и конвертируйте их в валюту,
              чтобы достичь максимального результата!
            </Typography>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default MinesRulesPage;
