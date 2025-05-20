import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import styles from "./FlexibleRowRules.module.scss";
import { Layout } from "@/components/Layout/Layout";

const FlexibleRowRulesPage = () => {
  return (
    <Layout>
      <Container maxWidth="md" className={styles.rulesContainer}>
        <Box my={4}>
          <Typography variant="h2" component="h1" className={styles.title}>
            Правила игры «Гибкий Ряд»
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
              «Гибкий Ряд» — это увлекательная лотерейная игра, в которой игроки
              заполняют билет, выбирая числа и, при желании, линию для
              мультипликатора, чтобы увеличить потенциальный выигрыш. Игра
              сочетает в себе элементы стратегии и удачи, позволяя игрокам
              влиять на стоимость билета и возможные выплаты через выбор
              мультипликатора.
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
              В «Гибком Ряде» игрок заполняет лотерейный билет, выбирая
              определённое количество чисел из предложенной сетки и,
              опционально, линию для применения мультипликатора. Вот основные
              аспекты игры:
            </Typography>
            <ul className={styles.rulesList}>
              <li>
                <Typography variant="body1">
                  <strong>Структура билета:</strong> Билет состоит из сетки
                  чисел, организованной в строки. Количество чисел в каждой
                  строке определяется параметром <code>count_number_row</code>{" "}
                  (например, [3, 3, 3] для трёх строк по три числа). Общее
                  количество чисел в билете — сумма чисел в строках.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Выбор чисел:</strong> Игрок должен выбрать ровно{" "}
                  <code>count_fill_user</code> чисел (например, 5) из доступных
                  чисел билета (по умолчанию числа от 1 до 9, указанные в{" "}
                  <code>arr_number</code>). Числа выбираются кликом по ячейкам в
                  сетке.
                </Typography>
              </li>
              <li>
                <div>
                  <Typography variant="body1">
                    <strong>Мультипликатор (опционально):</strong> Игрок может
                    выбрать мультипликатор (1.25x, 1.5x или 2x), который
                    увеличивает потенциальный выигрыш, но также повышает
                    стоимость билета:
                  </Typography>
                  <ul>
                    <li>1.25x: цена билета умножается на 3.25.</li>
                    <li>1.5x: цена билета умножается на 4.</li>
                    <li>2x: цена билета умножается на 5.25.</li>
                  </ul>
                  <Typography variant="body1">
                    Если выбран мультипликатор, игрок обязан выбрать линию
                    (горизонтальную, вертикальную или диагональную), содержащую
                    три числа.
                  </Typography>
                </div>
              </li>
              <li>
                <div>
                  <Typography variant="body1">
                    <strong>Выбор линии для мультипликатора:</strong> Линии
                    формируются автоматически на основе структуры билета:
                  </Typography>
                  <ul>
                    <li>
                      <strong>Горизонтальные линии:</strong> Каждая строка
                      билета, содержащая не менее двух чисел.
                    </li>
                    <li>
                      <strong>Вертикальные линии:</strong> Каждый столбец, если
                      в нём есть числа из всех строк.
                    </li>
                    <li>
                      <strong>Диагональные линии:</strong> Две диагонали (слева
                      направо и справа налево), если билет имеет не менее двух
                      строк и столбцов.
                    </li>
                  </ul>
                  <Typography variant="body1">
                    Линия выбирается перетаскиванием (drag-and-drop) по ячейкам
                    сетки, при этом выбирается линия из трёх чисел, включающая
                    начальную и конечную ячейки.
                  </Typography>
                </div>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Оплата билета:</strong> После выбора чисел и, при
                  необходимости, линии для мультипликатора, игрок оплачивает
                  билет, отправляя данные на сервер через API. Стоимость билета
                  отображается с учётом мультипликатора.
                </Typography>
              </li>
              <li>
                <div>
                  <Typography variant="body1">
                    <strong>Условия отправки:</strong> Билет можно отправить
                    только если:
                  </Typography>
                  <ul>
                    <li>
                      Выбрано ровно <code>count_fill_user</code> чисел.
                    </li>
                    <li>
                      Если выбран мультипликатор, указана линия из трёх чисел.
                    </li>
                  </ul>
                  <Typography variant="body1">
                    При несоблюдении условий отображается сообщение об ошибке.{" "}
                  </Typography>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <Typography
              variant="h4"
              component="h2"
              className={styles.sectionTitle}
            >
              Стоимость и выплаты
            </Typography>
            <Typography variant="body1" paragraph>
              Стоимость билета определяется базовой ценой (
              <code>price_ticket</code>, например, 100.50 ₽) и мультипликатором:
            </Typography>
            <ul className={styles.rulesList}>
              <li>Без мультипликатора: стоимость равна базовой цене билета.</li>
              <li>
                С мультипликатором: базовая цена умножается на соответствующий
                коэффициент (3.25, 4 или 5.25).
              </li>
            </ul>
            <Typography variant="body1" paragraph>
              Выигрыш зависит от совпадения выбранных чисел с результатами
              лотереи и применённого мультипликатора. Если мультипликатор
              использован, выигрыш увеличивается, если выбранные числа на линии
              совпадают с выигрышными.
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
              Игра реализована в виде модального окна с интерактивными
              элементами:
            </Typography>
            <ul className={styles.rulesList}>
              <li>
                <Typography variant="body1">
                  <strong>Сетка чисел:</strong> Числа отображаются в виде строк,
                  где каждая строка содержит заданное количество чисел
                  (например, три строки по три числа). Игрок кликает по числам,
                  чтобы выбрать их. Выбранные числа подсвечиваются.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Выбор мультипликатора:</strong> Выпадающий список
                  позволяет выбрать мультипликатор (1.25x, 1.5x, 2x или без
                  мультипликатора). При выборе мультипликатора активируется
                  возможность выбора линии.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Выбор линии:</strong> Если мультипликатор выбран,
                  игрок перетаскивает курсор по сетке, чтобы выбрать линию из
                  трёх чисел. Линии подсвечиваются при выборе.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Сообщения об ошибках:</strong> Если игрок выбирает
                  неверное количество чисел или не указывает линию при
                  мультипликаторе, отображается сообщение об ошибке.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Кнопка оплаты:</strong> Кнопка «Оплатить» активна
                  только при выполнении всех условий. Во время отправки данных
                  отображается индикатор загрузки.
                </Typography>
              </li>
            </ul>
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
              Чтобы увеличить свои шансы на успех:
            </Typography>
            <ul className={styles.rulesList}>
              <li>
                Тщательно выбирайте числа, основываясь на своих предположениях о
                возможных выигрышных комбинациях.
              </li>
              <li>
                Используйте мультипликатор с осторожностью: он увеличивает
                потенциальный выигрыш, но значительно повышает стоимость билета.
              </li>
              <li>
                При выборе линии для мультипликатора предпочтите комбинации
                чисел, которые, по вашему мнению, имеют больше шансов совпасть с
                результатами лотереи.
              </li>
              <li>
                Следите за сообщениями об ошибках, чтобы убедиться, что билет
                заполнен корректно перед отправкой.
              </li>
            </ul>
          </section>

          <Box mt={4}>
            <Typography variant="body1" paragraph>
              «Гибкий Ряд» — это захватывающая игра, где ваши решения влияют на
              шансы на победу. Выбирайте числа, применяйте мультипликаторы и
              испытайте удачу!
            </Typography>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default FlexibleRowRulesPage;
