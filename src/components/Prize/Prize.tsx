import styles from './Prize.module.scss'

interface PrizeProps {
  id: number
  name: string
  imgSrc: string
  imgAlt: string
  value: number
}

export default function Prize(props: PrizeProps) {
  const { id, name, imgSrc, imgAlt, value } = props

  return (
    <>
      <div className={`${styles.prize} ${styles[`prize--${value}`]}`}>
        <div className={styles.image}>
          <img src={imgSrc} alt={imgAlt} />
        </div>
        <div className={styles.text}>
          <p>{name}</p>
        </div>
      </div>
    </>
  )
}