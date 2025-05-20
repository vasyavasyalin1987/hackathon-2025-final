import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import styles from "./Rules.module.scss";
import { Layout } from "@/components/Layout/Layout";

const RulesPage = () => {
  return (
    <Layout>
      <Container maxWidth="md" className={styles.rulesContainer}>
        <Box my={4}>
          <Typography variant="h2" component="h1" className={styles.title}>
            Правила игры
            <br />
            «Судоку-Лотерея PRO»
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
              «Судоку-Лотерея PRO» — это уникальная комбинация классической
              головоломки судоку и азартной лотереи. Игра предлагает игрокам
              решать судоку, размещая числа на поле, чтобы завершать строки,
              столбцы и блоки 3x3, зарабатывая при этом бонусы. Каждое действие
              в игре связано с балансом виртуальных бонусов, которые можно
              тратить на ходы или пропуски, а также получать в качестве выплат
              за успешно завершённые группы.
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
              Игра проходит на стандартном поле судоку размером 9x9, разделённом
              на девять блоков 3x3. Цель — заполнить пустые клетки числами от 1
              до 9, соблюдая правила судоку, и зарабатывать бонусы за
              завершённые группы (строки, столбцы, блоки). Вот основные аспекты
              игры:
            </Typography>
            <ul className={styles.rulesList}>
              <li>
                <Typography variant="body1">
                  <strong>Начало игры:</strong> При запуске игры создаётся новая
                  сетка судоку с заранее заполненными клетками (количество
                  определяется настройками игры). Игроку предоставляется
                  случайное число (от 1 до 9), которое он должен разместить на
                  поле.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Ходы:</strong> Игрок выбирает пустую клетку, чтобы
                  разместить текущее число. Число можно поставить только в
                  клетку, где оно не нарушает правила судоку (отсутствие
                  одинаковых чисел в одной строке, столбце или блоке 3x3).
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Стоимость хода:</strong> Каждый ход требует затрат
                  виртуальных бонусов. Базовая стоимость хода определяется
                  настройками игры, но может увеличиваться в зависимости от
                  количества пропусков.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Пропуск хода:</strong> Если игрок не хочет или не
                  может разместить текущее число, он может пропустить ход,
                  заплатив определённое количество бонусов (начальная стоимость
                  пропуска — 5 бонусов, умноженная на количество предыдущих
                  пропусков + 1). После пропуска генерируется новое случайное
                  число.
                </Typography>
              </li>
              <li>
                <div>
                  <Typography variant="body1">
                    <strong>Выплаты:</strong> Игрок получает бонусы за
                    завершённые группы:
                  </Typography>
                  <ul>
                    <li>
                      Завершённая строка или столбец: выплата, указанная в
                      настройках игры.
                    </li>
                    <li>
                      Завершённый блок 3x3: выплата, указанная в настройках
                      игры.
                    </li>
                    <li>
                      Полностью завершённая сетка: дополнительная выплата за
                      полное решение судоку.
                    </li>
                  </ul>
                  <Typography variant="body1">
                    После завершения группы (строки, столбца или блока) все
                    клетки в этой группе очищаются (становятся пустыми), что
                    позволяет продолжить игру.
                  </Typography>
                </div>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Окончание игры:</strong> Игра завершается, когда все
                  клетки на поле заполнены (игрок получает бонус за полное
                  решение) или если игрок вручную завершает игру через
                  соответствующий API-эндпоинт.
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
              Баланс и транзакции
            </Typography>
            <Typography variant="body1" paragraph>
              В игре используются два типа баланса:
            </Typography>
            <ul className={styles.rulesList}>
              <li>
                <Typography variant="body1">
                  <strong>Виртуальный баланс (бонусы):</strong> Используется для
                  оплаты ходов и пропусков. Выплаты за завершённые группы
                  начисляются на этот баланс.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Реальный баланс:</strong> Отображается в игре, но не
                  используется для транзакций.
                </Typography>
              </li>
            </ul>
            <Typography variant="body1" paragraph>
              Если у игрока недостаточно бонусов для хода или пропуска, действие
              будет отклонено с соответствующим сообщением об ошибке.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              component="h2"
              className={styles.sectionTitle}
            >
              Правила размещения чисел
            </Typography>
            <Typography variant="body1" paragraph>
              Чтобы разместить число в клетке, оно должно соответствовать
              стандартным правилам судоку:
            </Typography>
            <ul className={styles.rulesList}>
              <li>Число не должно уже присутствовать в той же строке.</li>
              <li>Число не должно уже присутствовать в том же столбце.</li>
              <li>Число не должно уже присутствовать в том же блоке 3x3.</li>
            </ul>
            <Typography variant="body1" paragraph>
              Если игрок пытается поставить число в недопустимую клетку, игра
              подсветит конфликтующие клетки и покажет сообщение об ошибке.
              Конфликтующие клетки выделяются на 1 секунду, после чего подсветка
              исчезает.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              component="h2"
              className={styles.sectionTitle}
            >
              Завершение групп и очистка
            </Typography>
            <Typography variant="body1" paragraph>
              Когда строка, столбец или блок 3x3 полностью заполняются числами
              от 1 до 9 без повторов, эта группа считается завершённой. Игрок
              получает выплату, а клетки в завершённой группе очищаются
              (становятся пустыми). Это позволяет продолжать игру, заполняя поле
              новыми числами.
            </Typography>
            <Typography variant="body1" paragraph>
              Если игрок полностью решает судоку (все клетки заполнены числами
              от 1 до 9 без конфликтов), он получает дополнительную выплату, и
              игра завершается.
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
              Чтобы максимизировать свои шансы на успех:
            </Typography>
            <ul className={styles.rulesList}>
              <li>
                Следите за балансом бонусов, чтобы не остаться без возможности
                сделать ход или пропуск.
              </li>
              <li>
                Старайтесь завершать строки, столбцы или блоки, чтобы получать
                выплаты и очищать поле для новых ходов.
              </li>
              <li>
                Используйте пропуск хода с осторожностью, так как его стоимость
                увеличивается с каждым использованием.
              </li>
              <li>
                Анализируйте сетку перед размещением числа, чтобы избежать
                конфликтов и ненужных ошибок.
              </li>
            </ul>
          </section>

          <Box mt={4}>
            <Typography variant="body1" paragraph>
              «Судоку-Лотерея PRO» сочетает в себе стратегию, удачу и азарт.
              Погрузитесь в игру, решайте головоломки и зарабатывайте бонусы!
            </Typography>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default RulesPage;
