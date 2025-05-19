import styles from './PlayedTicket.module.scss'

interface PlayedTicketProps {
  id: number
  number: string
  prize: string
  win: boolean
}

export default function PlayedTicket(props: PlayedTicketProps) {
  const { id, number, prize, win } = props

  return (
    <div className={styles.playedTicket}>
      <div className={styles.text}>
        <p>Лотерейный билет</p>
        <p>{number}</p>
      </div>
      <div className={`${styles.prize} ${win ? styles.win : styles.lose}`}>
        <p>₽ {prize}</p>
      </div>
    </div>
  )
}