import Head from "next/head";
import { Header } from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./Layout.module.scss";

export interface ILayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: ILayoutProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
      </Head>
      <Header />
      <div className={styles.layout}>{children}</div>
      <Footer />
    </>
  );
};
