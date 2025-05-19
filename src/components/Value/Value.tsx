import styles from '../Value/Value.module.scss'

interface ValueProps {
  icoSrc: string
  icoAlt: string
  heading: string
  description: string
}

export default function Value(props: ValueProps) {
  const { icoSrc, icoAlt, heading, description } = props

  return (
    <>
      <div className={styles.value}>
        <div className={styles.heading}>
          <img src={icoSrc} alt={icoAlt}/>
          <h3>{heading}</h3>
        </div>
        <div className={styles.description}>
          <p>{description}</p>
        </div>
      </div>
    </>
  )
}