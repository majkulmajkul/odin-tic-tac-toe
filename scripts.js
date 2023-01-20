const Gameboard = (() => {
  const boardLayoutContainer = document.querySelector(".board-layout");
  let layout = Array(9).fill("");

  const resetLayout = () => {
    layout.forEach((item, index, array) => (array[index] = ""));
    renderBoardLayout();
  };

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const renderBoardLayout = () => {
    boardLayoutContainer.innerHTML = "";
    layout.map((item, index) => {
      const boardCell = document.createElement("div");
      boardCell.className = "board-cell";
      boardCell.id = `board-cell-${index}`;
      boardCell.textContent = item;
      boardCell.addEventListener("click", (e) => activeGame.move(index));
      boardLayoutContainer.appendChild(boardCell);
    });
  };

  const registerMove = (player, position) => {
    if (!layout[position]) {
      layout[position] = player.token;
      renderBoardLayout();
      return true;
    } else {
      return false;
    }
  };

  const movePermitted = (position) => {
    return layout[position] === "";
  };

  return {
    layout,
    registerMove,
    renderBoardLayout,
    movePermitted,
    resetLayout,
    winningConditions,
  };
})();

const Player = (name, token, type) => {
  const cpuDecision = () => {
    const emptyIndices = Gameboard.layout
      .map((item, index) => (item === "" ? index : false))
      .filter((item) => item === 0 || (item && item));

    const choice =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    return choice;
  };

  return { name, token, type, cpuDecision };
};

const Game = (Gameboard, Player1, Player2) => {
  let activePlayer;
  let gameOn;
  let winnerText;
  const gameOverContainer = document.querySelector(".game-over-container");

  const startGame = () => {
    activePlayer = [Player1, Player2][Math.round(Math.random())];
    gameOn = true;
    winnerText = "It's a Tie!";
    gameOverContainer.style.visibility = "hidden";
    Gameboard.resetLayout();
    Gameboard.renderBoardLayout();
    if (activePlayer.type === "cpu") {
      move(activePlayer.cpuDecision());
    }
  };

  const gameIsWon = () => {
    for (const player of [Player1, Player2]) {
      for (const condition of Gameboard.winningConditions) {
        if (
          player.token === Gameboard.layout[condition[0]] &&
          player.token === Gameboard.layout[condition[1]] &&
          player.token === Gameboard.layout[condition[2]]
        ) {
          winnerText = `The winner is ${player.name}!`;
          return true;
        }
      }
    }
    return false;
  };

  const gameIsTie = () => {
    if (!gameIsWon()) {
      return !Gameboard.layout.some((item) => item === "");
    }
  };

  const handleGameOver = () => {
    gameOn = false;
    const winnerNameSpan = document.querySelector(".winner-name");
    const newGameButton = document.querySelector(".new-game");
    newGameButton.addEventListener("click", startGame);

    gameOverContainer.style.visibility = "visible";
    winnerNameSpan.textContent = winnerText;
  };

  const move = (position) => {
    if (gameOn && Gameboard.movePermitted(position)) {
      Gameboard.registerMove(activePlayer, position);

      if (!gameIsWon() && !gameIsTie()) {
        if (activePlayer.name === Player1.name) {
          activePlayer = Player2;
        } else {
          activePlayer = Player1;
        }

        if (activePlayer.type === "cpu") {
          move(activePlayer.cpuDecision());
        }
      } else if (gameIsWon()) {
        handleGameOver();
      } else if (gameIsTie()) {
        handleGameOver();
      }
    }
  };

  return { activePlayer, move, startGame, gameIsWon, gameIsTie };
};

const Player1 = Player("Majkul", "O", "");
const Player2 = Player("Nájt", "X", "cpu");
const activeGame = Game(Gameboard, Player1, Player2);

const setup = (() => {
  const setupFormContainer = document.querySelector(".setup-form-container");
  const setupForm = document.querySelector(".setup-form");

  const handleSetupForm = (Player) => {
    const playerName = document.querySelector("#player-name-input").value;
    const playerType = document.querySelector("#player-type-input").value;
    Player.name = playerName;
    Player.type = playerType;
    setupFormContainer.style.visibility = "hidden";
    activeGame.startGame();
  };

  const prepareSetupForm = () => {
    setupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSetupForm(Player1);
    });
    setupFormContainer.style.visibility = "visible";
  };

  return { prepareSetupForm };
})();

setup.prepareSetupForm();
