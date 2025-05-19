import { Layout } from '@/components/Layout/Layout'
import PlayedTicket from '@/components/PlayedTicket/PlayedTicket'
import { Tickets } from '@/constants/PlayedTickets.constants'
import styles from '@/styles/pages/WinNums.module.scss'

export default function WinNums() {
  const sortedTickets = [...Tickets].sort((a, b) =>
    b.win === a.win ? 0 : b.win ? 1 : -1
  )

  return (
    <Layout>
      <div className={styles.winNums}>
        <h4>Выигрышные номера</h4>
        <div className={styles.tickets}>
          {sortedTickets.map(ticket => (
            <PlayedTicket
              key={ticket.id}
              {...ticket}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}