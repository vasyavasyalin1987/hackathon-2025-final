import { Layout } from "@/components/Layout/Layout";
import { StolotoIconWOLetters } from "@/assets/icons/StolotoIconWOLetters/StolotoIconWOLetters";
import Value from "@/components/Value/Value";
import { Values } from "@/constants/Values.constants";
import styles from "@/styles/mainContainer.module.scss";
import * as LotteryList from "@/components/LotteryList/LotteryList";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export default function Home({
  ...props
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <div className={styles.mainContainer}>
        <div className={styles.description}>
          <div className={styles.text}>
            <h1>
              «Столото» — бренд крупнейшего распространителя государственных
              лотерей в России
            </h1>
            <p>
              Государственные лотереи, распространяемые под брендом «Столото»,
              продаются в каждом регионе РФ и в единственном в России лотерейном
              интернет-супермаркете www.stoloto.ru. Компания применяет
              современные технологии, благодаря которым каждый может выбрать
              подходящий ему способ участия в лотереях, а каждый желающий —
              смотреть розыгрыши лотерей в прямом эфире или лично приехать в
              единственный в мире лотерейный центр и своими глазами увидеть, как
              формируется выигрышная комбинация.
            </p>
          </div>
          <div className={styles.logo}>
            <StolotoIconWOLetters />
          </div>
        </div>
        <div className={styles.values}>
          <Value {...Values[0]} />
          <Value {...Values[1]} />
          <Value {...Values[2]} />
        </div>
        <div className={styles.mission}>
          <h3>Наша миссия</h3>
          <p>
            Миссия «Столото» — возрождение лотерейной культуры в стране.
            Формирование отношения россиян к лотереям как к приятной форме
            досуга, дающей участникам шанс реализовать потребность в ярких
            эмоциях, улучшить материальное благосостояние и внести вклад в
            поддержку российского спорта.
          </p>
        </div>
      </div>
      <LotteryList.default {...props} maxItems={3} />
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await LotteryList.getServerSideProps(context);
}
