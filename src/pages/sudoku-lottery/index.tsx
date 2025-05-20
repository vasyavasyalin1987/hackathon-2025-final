import { Layout } from '@/components/Layout/Layout';
import { useEffect, useState } from 'react';
import styles from '@/styles/pages/SudokuLottery.module.scss';

const BASE_MOVE_COST = 5;
const INITIAL_SKILL_COST = 3;
const PAYOUT_ROW_COL = 15;
const PAYOUT_BLOCK = 50;
const PAYOUT_COMPLETE = 500;
const SIZE = 9;
const INITIAL_FILLED_CELLS = 40;

type MessageType = 'info' | 'error';

export default function SudokuLottery() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [skipCount, setSkipCount] = useState<number>(0);
  const [totalBets, setTotalBets] = useState<number>(0);
  const [totalPayouts, setTotalPayouts] = useState<number>(0);
  const [bonusBalance, setBonusBalance] = useState<number>(100);
  const [realBalance, setRealBalance] = useState<number>(10.0);
  const [currentMoveCost, setCurrentMoveCost] = useState<number>(BASE_MOVE_COST);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<MessageType>('info');

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const newGrid = initializeGrid();
    setGrid(newGrid);
    setCurrentMoveCost(BASE_MOVE_COST);
    setSkipCount(0);
    setTotalBets(0);
    setTotalPayouts(0);
    setBonusBalance(100);
    setRealBalance(10.0);
    setCurrentNumber(getNewNumber());
  };

  const showMessage = (msg: string, type: MessageType = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const getNewNumber = (): number => {
    return Math.floor(Math.random() * 9) + 1;
  };

  const initializeGrid = (): number[][] => {
    const newGrid: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    generateFullGrid(newGrid);
    let cellsToRemove = SIZE * SIZE - INITIAL_FILLED_CELLS;
    while (cellsToRemove > 0) {
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      if (newGrid[r][c] !== 0) {
        newGrid[r][c] = 0;
        cellsToRemove--;
      }
    }
    return newGrid;
  };

  const generateFullGrid = (grid: number[][]): boolean => {
    fillDiagonalBlocks(grid);
    return fillGrid(grid, 0, 0);
  };

  const fillDiagonalBlocks = (grid: number[][]) => {
    for (let i = 0; i < 3; i++) {
      const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      let index = 0;
      for (let r = i * 3; r < i * 3 + 3; r++) {
        for (let c = i * 3; c < i * 3 + 3; c++) {
          grid[r][c] = numbers[index++];
        }
      }
    }
  };

  const fillGrid = (grid: number[][], row: number, col: number): boolean => {
    if (row === SIZE) return true;
    if (col === SIZE) return fillGrid(grid, row + 1, 0);
    if (grid[row][col] !== 0) return fillGrid(grid, row, col + 1);

    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let num of numbers) {
      if (canPlaceNumber(grid, row, col, num)) {
        grid[row][col] = num;
        if (fillGrid(grid, row, col + 1)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  };

  const canPlaceNumber = (grid: number[][], row: number, col: number, num: number): boolean => {
    for (let c = 0; c < SIZE; c++) {
      if (grid[row][c] === num) return false;
    }
    for (let r = 0; r < SIZE; r++) {
      if (grid[r][col] === num) return false;
    }
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    for (let r = blockRow; r < blockRow + 3; r++) {
      for (let c = blockCol; c < blockCol + 3; c++) {
        if (grid[r][c] === num) return false;
      }
    }
    return true;
  };

  const shuffle = (array: number[]): number[] => {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const cellClick = (r: number, c: number) => {
    console.log(`Нажата ячейка [${r}, ${c}]`);
    if (grid[r][c] !== 0) {
      showMessage('Клетка уже заполнена.', 'error');
      return;
    }
    if (currentNumber === 0) {
      showMessage('Сначала получите число.', 'error');
      return;
    }
    const cost = currentMoveCost + skipCount * INITIAL_SKILL_COST;
    if (bonusBalance < cost) {
      showMessage('Недостаточно бонусов.', 'error');
      return;
    }
    const newGrid = grid.map(row => row.slice());
    newGrid[r][c] = currentNumber;
    setGrid(newGrid);
    setBonusBalance(bonusBalance - cost);
    setTotalBets(totalBets + cost);
    setSkipCount(0);
    setCurrentMoveCost(BASE_MOVE_COST);
    checkCompletions(newGrid);
    setCurrentNumber(getNewNumber());
    showMessage('Ход успешен!', 'info');
  };

  const skipMove = () => {
    const cost = INITIAL_SKILL_COST * (skipCount + 1);
    if (bonusBalance < cost) {
      showMessage('Недостаточно бонусов.', 'error');
      return;
    }
    setBonusBalance(bonusBalance - cost);
    setTotalBets(totalBets + cost);
    const newSkipCount = skipCount + 1;
    setSkipCount(newSkipCount);
    setCurrentMoveCost(BASE_MOVE_COST * (1 + newSkipCount * 0.5));
    setCurrentNumber(getNewNumber());
    showMessage(`Пропуск. Новое число: ${getNewNumber()}`, 'info');
  };

  const calculateCompletionProbability = (cells: [number, number][]): number => {
    if (grid.length !== SIZE) return 0;
    const seen = new Set<number>();
    let duplicates = false;
    let filledCount = 0;
    for (const [r, c] of cells) {
      if (!grid[r]) continue;
      const val = grid[r][c];
      if (val !== 0) {
        filledCount++;
        if (seen.has(val)) {
          duplicates = true;
          break;
        }
        seen.add(val);
      }
    }
    if (duplicates) return 0;
    if (filledCount === SIZE) return 100;
    return Math.round((seen.size / SIZE) * 100);
  };

  const checkCompletions = (currentGrid: number[][]) => {
    let payout = 0;
    const newGrid = currentGrid.map(row => row.slice());
    const isCompleteGroup = (cells: [number, number][]): boolean => {
      const seen = new Set<number>();
      for (const [r, c] of cells) {
        const val = newGrid[r][c];
        if (val === 0 || seen.has(val)) return false;
        seen.add(val);
      }
      return true;
    };

    for (let r = 0; r < SIZE; r++) {
      const cells: [number, number][] = [];
      for (let c = 0; c < SIZE; c++) {
        cells.push([r, c]);
      }
      if (isCompleteGroup(cells)) {
        payout += PAYOUT_ROW_COL;
        cells.forEach(([r, c]) => (newGrid[r][c] = 0));
      }
    }

    for (let c = 0; c < SIZE; c++) {
      const cells: [number, number][] = [];
      for (let r = 0; r < SIZE; r++) {
        cells.push([r, c]);
      }
      if (isCompleteGroup(cells)) {
        payout += PAYOUT_ROW_COL;
        cells.forEach(([r, c]) => (newGrid[r][c] = 0));
      }
    }

    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        const cells: [number, number][] = [];
        for (let r = br * 3; r < br * 3 + 3; r++) {
          for (let c = bc * 3; c < bc * 3 + 3; c++) {
            cells.push([r, c]);
          }
        }
        if (isCompleteGroup(cells)) {
          payout += PAYOUT_BLOCK;
          cells.forEach(([r, c]) => (newGrid[r][c] = 0));
        }
      }
    }

    let isComplete = true;
    outer: for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (newGrid[r][c] === 0) {
          isComplete = false;
          break outer;
        }
      }
    }
    if (isComplete) {
      payout += PAYOUT_COMPLETE;
      showMessage('Поздравляем! Судоку полностью решено!', 'info');
    }
    if (payout > 0) {
      setTotalPayouts(totalPayouts + payout);
      setBonusBalance(bonusBalance + payout);
      setGrid(newGrid);
      showMessage(`Выплата за завершённые группы: ${payout} бонусов.`, 'info');
    }
  };

  if (grid.length !== SIZE) {
    return (
      <Layout>
        <div className={styles.sudokuLottery}>
          <h1 className={styles.title}>Судоку‑Лотерея PRO</h1>
          <p>Загрузка...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.sudokuLottery}>
        <h4 className={styles.title}>Судоку‑Лотерея PRO</h4>
        <div className={styles.balancePanel}>
          <div>
            Бонусы: <span>{bonusBalance}</span>
          </div>
          <div>
            Реальная валюта: $<span>{realBalance.toFixed(2)}</span>
          </div>
        </div>
        <div id="current-number" className={styles.currentNumber}>
          Текущий номер: <span>{currentNumber || '-'}</span>
          <button id="skip-btn" className={styles.skipBtn} onClick={skipMove}>
            Пропустить ход (-{INITIAL_SKILL_COST * (skipCount + 1)} бонуса)
          </button>
        </div>
        <table className={styles.sudokuTable}>
          <tbody>
          {grid.map((row, r) => (
            <tr key={r}>
              {row.map((val, c) => {
                const cellClasses = [styles.cell];
                if (val !== 0) cellClasses.push(styles.filled);
                if ((c + 1) % 3 === 0 && c !== SIZE - 1) cellClasses.push(styles.blockRight);
                if ((r + 1) % 3 === 0 && r !== SIZE - 1) cellClasses.push(styles.blockBottom);
                return (
                  <td key={c} className={cellClasses.join(' ')} onClick={() => cellClick(r, c)}>
                    {val !== 0 ? val : ''}
                  </td>
                );
              })}
            </tr>
          ))}
          </tbody>
        </table>
        <div className={styles.probabilityContainer}>
          <div className={styles.probabilitySection}>
            <h3>Вероятности строк</h3>
            {Array.from({ length: SIZE }).map((_, r) => {
              const cells: [number, number][] = [];
              for (let c = 0; c < SIZE; c++) {
                cells.push([r, c]);
              }
              const prob = calculateCompletionProbability(cells);
              return (
                <div key={r} className={styles.probabilityItem}>
                  <div>Строка {r + 1}: {prob}%</div>
                  <div className={styles.probabilityBar}>
                    <div className={styles.probabilityFill} style={{ width: `${prob}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.probabilitySection}>
            <h3>Вероятности столбцов</h3>
            {Array.from({ length: SIZE }).map((_, c) => {
              const cells: [number, number][] = [];
              for (let r = 0; r < SIZE; r++) {
                cells.push([r, c]);
              }
              const prob = calculateCompletionProbability(cells);
              return (
                <div key={c} className={styles.probabilityItem}>
                  <div>Столбец {c + 1}: {prob}%</div>
                  <div className={styles.probabilityBar}>
                    <div className={styles.probabilityFill} style={{ width: `${prob}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.probabilitySection}>
            <h3>Вероятности блоков</h3>
            {Array.from({ length: 3 }).map((_, br) =>
              Array.from({ length: 3 }).map((_, bc) => {
                const cells: [number, number][] = [];
                for (let r = br * 3; r < br * 3 + 3; r++) {
                  for (let c = bc * 3; c < bc * 3 + 3; c++) {
                    cells.push([r, c]);
                  }
                }
                const prob = calculateCompletionProbability(cells);
                const blockNum = br * 3 + bc + 1;
                return (
                  <div key={`${br}-${bc}`} className={styles.probabilityItem}>
                    <div>Блок {blockNum}: {prob}%</div>
                    <div className={styles.probabilityBar}>
                      <div className={styles.probabilityFill} style={{ width: `${prob}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div id="stats" className={styles.stats}>
          <div>Ставок сделано: <span>{totalBets}</span> бонусов</div>
          <div>Призовой фонд: <span>{totalBets - totalPayouts}</span> бонусов</div>
          <div>Выплачено: <span>{totalPayouts}</span> бонусов</div>
          <div>Прибыль: <span>{totalBets - totalPayouts}</span> бонусов</div>
        </div>
        {message && (
          <div id="messages" className={`${styles.messages} ${messageType === 'error' ? styles.error : ''}`}>
            {message}
          </div>
        )}
      </div>
    </Layout>
  );
}
