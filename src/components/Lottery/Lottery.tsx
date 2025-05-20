import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Chip,
} from "@mui/material";
import styles from "./Lottery.module.scss";
import { SettingTicket } from "@/models/lottery";

interface LotteryProps {
  ticket: SettingTicket;
  onEdit: (id: number) => void;
}

export function Lottery({ ticket, onEdit }: LotteryProps) {
  return (
    <Card className={styles.ticketCard} elevation={4}>
      <CardContent className={styles.cardContent}>
        <Typography variant="h5" className={styles.cardTitle}>
          Лотерея #{ticket.id}
        </Typography>
        <div className={styles.fieldset}>
          <Typography variant="subtitle2" className={styles.fieldsetLegend}>
            Основные настройки
          </Typography>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <Typography variant="body2" className={styles.fieldLabel}>
                Время (минуты)
              </Typography>
              <Typography variant="body1" className={styles.fieldValue}>
                {ticket.time ?? "Не указано"}
              </Typography>
            </div>
            <div className={styles.field}>
              <Typography variant="body2" className={styles.fieldLabel}>
                Цена билета (₽)
              </Typography>
              <Typography variant="body1" className={styles.fieldValue}>
                {ticket.price_ticket ?? "Не указано"}
              </Typography>
            </div>
            <div className={styles.field}>
              <Typography variant="body2" className={styles.fieldLabel}>
                Процент фонда (%)
              </Typography>
              <Typography variant="body1" className={styles.fieldValue}>
                {ticket.percent_fond ?? "Не указано"}
              </Typography>
            </div>
            <div className={styles.field}>
              <Typography variant="body2" className={styles.fieldLabel}>
                Статус
              </Typography>
              <Chip
                label={ticket.is_start ? "Запущена" : "Не запущена"}
                className={styles.statusChip}
                size="small"
              />
            </div>
          </div>
        </div>
        <div className={styles.fieldset}>
          <Typography variant="subtitle2" className={styles.fieldsetLegend}>
            Параметры поля
          </Typography>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <Typography variant="body2" className={styles.fieldLabel}>
                Размер поля (X)
              </Typography>
              <Typography variant="body1" className={styles.fieldValue}>
                {ticket.size_x ?? "Не указано"}
              </Typography>
            </div>
            <div className={styles.field}>
              <Typography variant="body2" className={styles.fieldLabel}>
                Размер поля (Y)
              </Typography>
              <Typography variant="body1" className={styles.fieldValue}>
                {ticket.size_y ?? "Не указано"}
              </Typography>
            </div>
            <div className={styles.field}>
              <Typography variant="body2" className={styles.fieldLabel}>
                Количество билетов
              </Typography>
              <Typography variant="body1" className={styles.fieldValue}>
                {ticket.count_number_row ?? "Не указано"}
              </Typography>
            </div>
            <div className={styles.field}>
              <Typography variant="body2" className={styles.fieldLabel}>
                Чисел для выбора
              </Typography>
              <Typography variant="body1" className={styles.fieldValue}>
                {ticket.count_fill_user ?? "Не указано"}
              </Typography>
            </div>
          </div>
        </div>
      </CardContent>
      <CardActions className={styles.cardActions}>
        <Button
          variant="contained"
          className={styles.editButton}
          onClick={() => onEdit(ticket.id)}
        >
          Редактировать настройки
        </Button>
      </CardActions>
    </Card>
  );
}
