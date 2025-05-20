import { Layout } from "@/components/Layout/Layout"
import GameRulesPreview from
    "@/components/GameRulesPreview/GameRulesPreview"
import { Games } from "@/constants/Games.constants"
import styles from "@/styles/pages/Rules.module.scss"

export default function Rules() {
  return (
    <>
      <Layout>
        <div className={styles.rules}>
          <h2>Правила игры</h2>
          <div className={styles.games}>
            {Games.map((game) => (
              <GameRulesPreview key={game.id} {...game} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  )
}