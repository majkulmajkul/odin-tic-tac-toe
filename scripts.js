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
      boardCell.addEventListener("click", (e) => Game.move(index));
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

class Player {
  constructor(name, token, type, playerNumber, wins) {
    this.name = name;
    this.token = token;
    (this.type = type), (this.playerNumber = playerNumber), (this.wins = wins);
  }

  cpuDecision = () => {
    const emptyIndices = Gameboard.layout
      .map((item, index) => (item === "" ? index : false))
      .filter((item) => item === 0 || (item && item));

    const choice =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    setTimeout(() => {
      console.log("waiting"), 500;
    });
    return choice;
  };

  incrementWins = () => {
    this.wins++;
  };

  renderWins = () => {
    const playerWinsDisplay = document.querySelector(
      `.player${this.playerNumber}-wins`
    );
    playerWinsDisplay.textContent = this.wins;
  };

  changeName = (newName) => {
    this.name = newName;
  };

  renderName = () => {
    const playerNameContainer = document.querySelector(
      `.player${this.playerNumber}-name`
    );
    playerNameContainer.textContent = this.name;
  };

  changeType = (newType) => {
    this.type = newType;
  };

  renderType = () => {
    const playerTypeContainer = document.querySelector(
      `.player${this.playerNumber}-type`
    );
    playerTypeContainer.textContent = this.type;
  };
}

const Game = (() => {
  let activePlayer;
  let gameOn;
  let winnerText;
  let winnerPlayer;
  const gameOverContainer = document.querySelector(".game-over-container");
  const activePlayerNameConteiner = document.querySelector(
    ".active-player-name-container"
  );
  const boardAndPlayersDiv = document.querySelector(".players-and-board");
  const activePlayerNameDisplay = document.querySelector(".active-player-name");

  const startGame = () => {
    activePlayer = [Player1, Player2][Math.round(Math.random())];
    gameOn = true;
    winnerPlayer = undefined;
    winnerText = "It's a Tie!";
    boardAndPlayersDiv.style.visibility = "visible";
    gameOverContainer.style.visibility = "hidden";
    activePlayerNameConteiner.style.visibility = "visible";
    activePlayerNameDisplay.textContent = activePlayer.name;
    Gameboard.resetLayout();
    if (activePlayer.type === "cpu") {
      setTimeout(() => {
        move(activePlayer.cpuDecision());
      }, 500);
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
          winnerPlayer = player;
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
    if (winnerPlayer) {
      winnerPlayer.incrementWins();
      winnerPlayer.renderWins();
    }
    activePlayerNameConteiner.style.visibility = "hidden";
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

        activePlayerNameDisplay.textContent = activePlayer.name;

        if (activePlayer.type === "cpu") {
          setTimeout(() => {
            move(activePlayer.cpuDecision());
          }, 500);
        }
      } else if (gameIsWon()) {
        handleGameOver();
      } else if (gameIsTie()) {
        handleGameOver();
      }
    }
  };

  return {
    activePlayer,
    move,
    startGame,
    gameIsWon,
    gameIsTie,
    activePlayerNameConteiner,
    boardAndPlayersDiv,
  };
})();

const setup = (() => {
  const Player1 = new Player("", "O", "", 1, 0);
  const Player2 = new Player("", "X", "", 2, 0);
  const setupFormContainer = document.querySelector(".setup-form-container");
  const setupForm = document.querySelector(".setup-form");

  const handleSetupForm = () => {
    const player1Name = document.querySelector("#player1-name-input").value;
    const player1Type = document.querySelector("#player1-type-input").value;
    const player2Name = document.querySelector("#player2-name-input").value;
    const player2Type = document.querySelector("#player2-type-input").value;
    Player1.changeName(player1Name);
    Player1.changeType(player1Type);
    Player2.changeName(player2Name);
    Player2.changeType(player2Type);

    console.log("Player1 from HandleSetupForm", Player1);

    for (const player of [Player1, Player2]) {
      player.renderName();
      player.renderType();
    }

    setupFormContainer.style.visibility = "hidden";
    Game.startGame();
  };

  const prepareSetupForm = () => {
    setupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSetupForm();
    });
    setupFormContainer.style.visibility = "visible";
    Game.boardAndPlayersDiv.style.visibility = "hidden";
    Game.activePlayerNameConteiner.style.visibility = "hidden";
  };

  return { prepareSetupForm, Player1, Player2 };
})();

const Player1 = setup.Player1;
const Player2 = setup.Player2;
setup.prepareSetupForm();
