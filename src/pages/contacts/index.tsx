import React, {useState, useEffect} from "react";
import { Layout } from '@/components/Layout/Layout'
import styles from "@/styles/pages/Contacts.module.scss";
import {Paper} from "@mui/material";


export default function Contacts() {
  return (
    <Layout>
      <div className={styles.container}>

        <h1 className={styles.con}>Контакты</h1>
        <div className={styles.contacts}>
          <Paper elevation={2} className={styles.address}>
            <h2>Наш адрес</h2>
            <address>Москва, 109316, Волгоградский проспект, д. 43, корп.3</address>
          </Paper>
          <Paper elevation={2} className={styles.address}>
            <h2>Мы работаем</h2>
            <time>9:00 - 21:00 без перерыва и выходных</time>
          </Paper>
          <Paper elevation={2} className={styles.address}>
            <h2>Позвоните нам</h2>
            <h3>Для участников лотерей:</h3>
            <a href="tel:8 900 555-00-55">8 900 555-00-55</a>
            <h3>Для партнеров:</h3>
            <a href="tel:8 900 614-55-55">8 900 614-55-555</a>
            <h3>Горячая линия для контрагентов:</h3>
            <a href="https://www.stoloto.ru/compliance/hotline">Этика и комплаенс</a>
          </Paper>
          <Paper elevation={2} className={styles.address}>
            <h2>Или напишите на элекртонную почту</h2>
            <a href='mailto:info@stoloto.ru'>info@stoloto.ru</a>
          </Paper>
        </div>
        <Paper elevation={2} className={styles.address}>
          <h2>Акционерное общество «Технологическая Компания «Центр»</h2>
          <h3>Почтовый адрес:</h3>
          <address>Москва, 109316, Россия, Москва, Волгоградский проспект, д. 43, корп. 3</address>
          <h3>Факс:</h3>
          <a href="tel:+7 495 204-85-86">+7 495 204-85-86</a>
        </Paper>
      </div>)
    </Layout>
  )
}