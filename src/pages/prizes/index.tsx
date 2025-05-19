import { Layout } from '@/components/Layout/Layout'
import Prize from '@/components/Prize/Prize'
import { PrizesData } from '@/constants/Prizes.constants'
import styles from '@/styles/pages/Prizes.module.scss'

export default function Prizes() {
  const sortedPrizes = [...PrizesData].sort((a, b) => b.value - a.value)

  return (
    <Layout>
      <div className={styles.prizes}>
        <h4>Призовая структура</h4>
        <div className={styles.prizesGrid}>
          {sortedPrizes.map(prize => (
            <Prize key={prize.id} {...prize} />
          ))}
        </div>
      </div>
    </Layout>
  )
}