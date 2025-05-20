import Link from "next/link";
import styles from "./GameRulesPreview.module.scss";

interface GameRulesPreviewProps {
  srcImg: string;
  altImg: string;
  name: string;
  description: string;
  href?: string;
}

export default function GameRulesPreview(props: GameRulesPreviewProps) {
  const { srcImg, altImg, name, description, href } = props;

  return (
    <div className={styles.gameRulesPreview}>
      <div className={styles.image}>
        <img src={srcImg} alt={altImg} />
      </div>
      <div className={styles.info}>
        <div className={styles.text}>
          <h4>{name}</h4>
          <p>{description}</p>
        </div>
        <div className={styles.buttonContainer}>
          {href && (
            <Link href={href} className={styles.button}>
              Читать больше
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
