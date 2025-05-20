import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SudokuLottery.module.scss";
import { API_BASE_URL } from "@/api";
import Cookies from "js-cookie";

type MessageType = "info" | "error";

interface SudokuLotteryProps {
  userData: any;
  idSettingGame: number;
}

const SIZE = 9;
const INITIAL_SKILL_COST = 5;

const SudokuLottery: React.FC<SudokuLotteryProps> = ({
  idSettingGame,
  userData,
}) => {
  const [gameId, setGameId] = useState<number | null>(null);
  const [grid, setGrid] = useState<number[][]>([]);
  const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set());
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [skipCount, setSkipCount] = useState<number>(0);
  const [totalBets, setTotalBets] = useState<number>(0);
  const [totalPayouts, setTotalPayouts] = useState<number>(0);
  const [bonusBalance, setBonusBalance] = useState<number>(
    userData.info.balance_virtual
  );
  const [realBalance, setRealBalance] = useState<number>(
    userData.info.balance_real
  );
  const [currentMoveCost, setCurrentMoveCost] = useState<number>(0);
  const [isSubmitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<MessageType>("info");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const showMessage = (msg: string, type: MessageType = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const startGame = async () => {
    const token = Cookies.get("auth_token");
    setIsLoading(true);
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/game/start`,
        { id_setting_game: idSettingGame },
        { headers: { Authorization: token } }
      );
      const { game } = response.data;
      setGameId(game.id);
      setGrid(game.grid);
      setCurrentNumber(game.current_number);
      setSkipCount(game.skip_count);
      setCurrentMoveCost(game.current_move_cost);
      setTotalBets(game.total_bets);
      setTotalPayouts(game.total_payouts);
      setIsLoading(false);
      showMessage("Игра началась!", "info");
    } catch (error: any) {
      setIsLoading(false);
      showMessage(
        error.response?.data?.message || "Ошибка при создании игры",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const cellClick = async (r: number, c: number) => {
    const token = Cookies.get("auth_token");
    if (!gameId) {
      showMessage("Игра не начата", "error");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/game/move`,
        { game_id: gameId, cells: { row: r, col: c } },
        { headers: { Authorization: token } }
      );
      const { game, payout } = response.data;
      setGrid(game.grid);
      setCurrentNumber(game.current_number);
      setSkipCount(game.skip_count);
      setCurrentMoveCost(game.current_move_cost);
      setTotalBets(game.total_bets);
      setTotalPayouts(game.total_payouts);
      setBonusBalance(game.bonus_balance);
      if (payout > 0) {
        showMessage(
          `Выплата за завершённые группы: ${payout} бонусов.`,
          "info"
        );
      } else {
        showMessage("Ход успешен!", "info");
      }
      if (!game.is_active) {
        showMessage("Поздравляем! Судоку полностью решено!", "info");
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData?.invalid_cells) {
        setInvalidCells(new Set([...errorData.invalid_cells, `${r}-${c}`]));
        setTimeout(() => setInvalidCells(new Set()), 1000);
      }
      showMessage(errorData?.message || "Ошибка при выполнении хода", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const skipMove = async () => {
    const token = Cookies.get("auth_token");
    if (!gameId) {
      showMessage("Игра не начата", "error");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/game/skip`,
        { game_id: gameId },
        { headers: { Authorization: token } }
      );
      const { game, new_balance } = response.data;
      setGrid(game.grid);
      setCurrentNumber(game.current_number);
      setSkipCount(game.skip_count);
      setCurrentMoveCost(game.current_move_cost);
      setTotalBets(game.total_bets);
      setTotalPayouts(game.total_payouts);
      setBonusBalance(new_balance);
      showMessage(`Пропуск. Новое число: ${game.current_number}`, "info");
    } catch (error: any) {
      showMessage(
        error.response?.data?.message || "Ошибка при пропуске хода",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  if (isLoading || grid.length !== SIZE) {
    return (
      <div className={styles.sudokuLottery}>
        <h1 className={styles.title}>Судоку‑Лотерея PRO</h1>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div
      className={`${styles.sudokuLottery} ${
        isSubmitting ? styles.boardTransparent : undefined
      }`}
    >
      <h1 className={styles.title}>Судоку‑Лотерея PRO</h1>
      <div className={styles.balancePanel}>
        <div>
          Бонусы: <span>{bonusBalance}</span>
        </div>
        <div>
          Реальная валюта: $<span>{realBalance.toFixed(2)}</span>
        </div>
      </div>
      <div id="current-number" className={styles.currentNumber}>
        Текущий номер: <span>{currentNumber || "-"}</span>
        <button id="skip-btn" className={styles.skipBtn} onClick={skipMove}>
          Пропустить ход (-{skipCount + 1 * INITIAL_SKILL_COST} бонуса)
        </button>
      </div>
      <table className={styles.sudokuTable}>
        <tbody>
          {grid.map((row, r) => (
            <tr key={r}>
              {row.map((val, c) => {
                const cellClasses = [styles.cell];
                if (val !== 0) cellClasses.push(styles.filled);
                if (invalidCells.has(`${r}-${c}`))
                  cellClasses.push(styles.invalid);
                if ((c + 1) % 3 === 0 && c !== SIZE - 1)
                  cellClasses.push(styles.blockRight);
                if ((r + 1) % 3 === 0 && r !== SIZE - 1)
                  cellClasses.push(styles.blockBottom);
                return (
                  <td
                    key={c}
                    className={cellClasses.join(" ")}
                    onClick={() => cellClick(r, c)}
                  >
                    {val !== 0 ? val : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.messagesWrap}>
        {message && (
          <div className={`${styles.messages} ${styles[messageType]}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SudokuLottery;
