import { useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import styles from "@/styles/pages/Mines.module.scss";

export default function Mines() {
  useEffect(() => {
    class Cell {
      type: string;
      opened: boolean;
      rateFrom: number;
      rateTo: number;
      element: HTMLDivElement;

      constructor(type: string, rateFrom = 0, rateTo = 0) {
        this.type = type;
        this.opened = false;
        this.rateFrom = rateFrom;
        this.rateTo = rateTo;
        this.element = document.createElement("div");
        this.element.className = "cell";

        this.element.addEventListener("click", () => game.handleCellClick(this));
      }

      open() {
        if (this.opened) return false;
        this.opened = true;
        this.element.classList.add("opened");

        switch (this.type) {
          case "mine":
            this.element.textContent = "💣";
            this.element.classList.add("mine");
            break;
          case "bonus":
            this.element.textContent = "+10💎";
            this.element.classList.add("bonus");
            game.playerBonuses += 10;
            break;
          case "converter":
            this.element.textContent = `💱 ${this.rateFrom}→${this.rateTo}`;
            this.element.classList.add("converter");
            break;
          default:
            this.element.textContent = "✓";
        }
        return true;
      }

      stay() {
        if (this.type === "converter" && game.playerBonuses >= this.rateFrom) {
          game.playerBonuses -= this.rateFrom;
          game.playerCurrency += this.rateTo;
          this.element.textContent = `💱 ${this.rateFrom}→${this.rateTo}`;
          game.updateStatus();
          return true;
        }
        return false;
      }
    }

    class Game {
      cells: Cell[] = [];
      selectedCell: Cell | null = null;
      steps: number = 0;
      playerBonuses: number = 0;
      playerCurrency: number = 0;
      width: number = 0;
      height: number = 0;
      bonusChance: number = 0;
      mineChance: number = 0;

      init(settings: { width: number; height: number; bonusChance: number; mineChance: number }) {
        // Инициализация параметров игры
        this.width = settings.width;
        this.height = settings.height;
        this.bonusChance = settings.bonusChance;
        this.mineChance = settings.mineChance;
        this.steps = Math.floor(this.width * this.height * 0.6);
        this.playerBonuses = 100;
        this.playerCurrency = 100;
        this.cells = [];
        this.selectedCell = null;
        this.renderGrid();
        this.updateStatus();
      }

      renderGrid() {
        const grid = document.getElementById("game-grid");
        if (!grid) return;
        grid.innerHTML = "";
        grid.style.gridTemplateColumns = `repeat(${this.width}, 70px)`;

        for (let i = 0; i < this.width * this.height; i++) {
          const rand = Math.random();
          let type = "empty";
          let rateFrom = 0;
          let rateTo = 0;

          if (rand < this.mineChance) {
            type = "mine";
          } else if (rand < this.mineChance + this.bonusChance) {
            type = "bonus";
          } else if (rand < this.mineChance + this.bonusChance + 0.15) {
            type = "converter";
            rateFrom = Math.floor(Math.random() * 5) + 1;
            rateTo = Math.floor(Math.random() * 10) + 1;
          }

          const cell = new Cell(type, rateFrom, rateTo);
          grid.appendChild(cell.element);
          this.cells.push(cell);
        }
      }

      handleCellClick(cell: Cell) {
        if (this.steps <= 0) return;

        if (this.selectedCell) {
          this.selectedCell.element.classList.remove("selected");
        }
        this.selectedCell = cell;
        this.selectedCell.element.classList.add("selected");

        const openedNow = cell.open();
        if (openedNow) this.steps--;
        this.updateStatus();

        if (this.steps <= 0) {
          this.finish();
        }
      }

      stayOnCell() {
        if (!this.selectedCell || !this.selectedCell.opened) return;
        const used = this.selectedCell.stay();
        if (used) {
          this.steps--;
          this.updateStatus();
          if (this.steps <= 0) {
            this.finish();
          }
        }
      }

      updateStatus() {
        const stepsEl = document.getElementById("steps-count");
        const bonusEl = document.getElementById("bonus-count");
        const currencyEl = document.getElementById("currency-count");
        if (stepsEl) stepsEl.textContent = this.steps.toString();
        if (bonusEl) bonusEl.textContent = this.playerBonuses.toString();
        if (currencyEl) currencyEl.textContent = this.playerCurrency.toString();
      }

      finish() {
        screenManager.showScreen("results");
        const spentEl = document.getElementById("spent-bonuses");
        const earnedEl = document.getElementById("earned-currency");
        if (spentEl) spentEl.textContent = (100 - this.playerBonuses).toString();
        if (earnedEl) earnedEl.textContent = (this.playerCurrency - 100).toString();
      }
    }

    class ScreenManager {
      screens: { [key: string]: HTMLElement | null } = {
        menu: document.getElementById("menu"),
        game: document.getElementById("game"),
        results: document.getElementById("results"),
      };
      currentScreen = "menu";

      showScreen(name: string) {
        for (const key in this.screens) {
          const el = this.screens[key];
          if (el) {
            el.classList.remove("visible");
            el.classList.add("screen");
          }
        }
        const activeScreen = this.screens[name];
        if (activeScreen) {
          activeScreen.classList.remove("screen");
          activeScreen.classList.add("visible");
        }
      }
    }

    const difficulties: {
      [key: string]: {
        name: string;
        desc: string;
        settings: { width: number; height: number; bonusChance: number; mineChance: number };
      };
    } = {
      easy: {
        name: "Лёгкий",
        desc: `
          <p><strong>Правила игры:</strong> Нажимайте на клетки, чтобы открыть их. На клетках могут быть мины 💣, бонусы +10💎 и конвертеры 💱 (обменивайте бонусы на валюту). Нажмите "Остаться", чтобы воспользоваться конвертером. Играйте, пока не закончатся шаги.</p>
          <p>Меньше мин – больше бонусов. Отлично для новичков.</p>
        `,
        settings: { width: 8, height: 5, bonusChance: 0.25, mineChance: 0.25 },
      },
      classic: {
        name: "Классический",
        desc: `
          <p><strong>Правила игры:</strong> Стандартное соотношение мин и бонусов. Используйте конвертеры и стратегию, чтобы сохранить бонусы и заработать валюту.</p>
        `,
        settings: { width: 9, height: 6, bonusChance: 0.2, mineChance: 0.3 },
      },
      lucky: {
        name: "Удача",
        desc: `
          <p><strong>Правила игры:</strong> Много мин и бонусов – риск высокий! Можно выиграть много, но можно и быстро проиграть.</p>
        `,
        settings: { width: 10, height: 7, bonusChance: 0.3, mineChance: 0.4 },
      },
    };

    const game = new Game();
    const screenManager = new ScreenManager();

    let selectedDifficulty = "easy";
    const diffButtons = document.querySelectorAll(".difficulty-button");
    const infoDiv = document.getElementById("difficulty-info");

    function updateDifficultyDescription(diffKey: string) {
      const diff = difficulties[diffKey];
      if (infoDiv) {
        infoDiv.innerHTML = `<h5>${diff.name}</h5>${diff.desc} <button id="start-game">Начать игру</button>`;
        const startButton = document.getElementById("start-game");
        if (startButton) {
          startButton.addEventListener("click", () => {
            game.init(diff.settings);
            screenManager.showScreen("game");
          });
        }
      }
    }

    diffButtons.forEach((button) => {
      button.addEventListener("click", () => {
        diffButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        selectedDifficulty = button.getAttribute("data-diff") || "easy";
        updateDifficultyDescription(selectedDifficulty);
      });
    });

    if (diffButtons.length > 0) {
      diffButtons[0].classList.add("active");
      updateDifficultyDescription(selectedDifficulty);
    }

    const stayButton = document.getElementById("stay-on-cell");
    if (stayButton) {
      stayButton.addEventListener("click", () => game.stayOnCell());
    }
    const finishButton = document.getElementById("finish-game");
    if (finishButton) {
      finishButton.addEventListener("click", () => game.finish());
    }
    const menuButton = document.getElementById("results-to-menu");
    if (menuButton) {
      menuButton.addEventListener("click", () => screenManager.showScreen("menu"));
    }

    screenManager.showScreen("menu");
  }, []);

  return (
    <Layout>
      <div className={styles.mines}>
        <div id="menu" className={`visible screen ${styles.menuFlex}`}>
          <h4>Выбери сложность</h4>
          <div id="difficulty-buttons">
            <button className="difficulty-button" data-diff="easy">Лёгкий</button>
            <button className="difficulty-button" data-diff="classic">Классический</button>
            <button className="difficulty-button" data-diff="lucky">Удача</button>
          </div>
          <div id="difficulty-info"></div>
        </div>

        <div id="game" className="screen">
          <div id="status">
            Шаги: <span id="steps-count"></span> | 💎: <span id="bonus-count"></span> | 💰: <span id="currency-count"></span>
          </div>
          <div id="controls">
            <button id="stay-on-cell">Остаться</button>
            <button id="finish-game">Завершить игру</button>
          </div>
          <div id="game-grid"></div>
        </div>

        <div id="results" className="screen">
          <h5>Результаты</h5>
          Потрачено бонусов: <span id="spent-bonuses"></span>
          <br />
          Заработано валюты: <span id="earned-currency"></span>
          <br />
          <button id="results-to-menu">В меню</button>
        </div>
      </div>
    </Layout>
  );
}
