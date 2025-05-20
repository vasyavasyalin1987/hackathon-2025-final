import Image from "next/image";
import icon from "./icon.svg";
import styles from "./StolotoIcon.module.scss";

export const StolotoIcon = () => {
  return <Image className={styles.icon} src={icon} alt="Лотомагия" />;
};
