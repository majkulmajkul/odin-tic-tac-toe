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

const Player = (name, token, type, playerNumber, wins) => {
  const cpuDecision = () => {
    const emptyIndices = Gameboard.layout
      .map((item, index) => (item === "" ? index : false))
      .filter((item) => item === 0 || (item && item));

    const choice =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    return choice;
  };

  const incrementWins = () => {
    wins++;
  };

  const renderWins = () => {
    const playerWinsDisplay = document.querySelector(
      `.player${playerNumber}-wins`
    );
    playerWinsDisplay.textContent = wins;
  };

  const changeName = (newName) => {
    name = newName;
  };

  const renderName = () => {
    const playerNameContainer = document.querySelector(
      `.player${playerNumber}-name`
    );
    playerNameContainer.textContent = name;
  };

  const changeType = (newType) => {
    type = newType;
  };

  const renderType = () => {
    const playerTypeContainer = document.querySelector(
      `.player${playerNumber}-type`
    );
    playerTypeContainer.textContent = type;
  };

  return {
    name,
    token,
    type,
    cpuDecision,
    wins,
    renderWins,
    incrementWins,
    changeName,
    renderName,
    changeType,
    renderType,
  };
};

const Game = (() => {
  let activePlayer;
  let gameOn;
  let winnerText;
  let winnerPlayer;
  const player1NameContainer = document.querySelector(".player1-name");
  const player2NameContainer = document.querySelector(".player2-name");
  const gameOverContainer = document.querySelector(".game-over-container");
  const activePlayerNameConteiner = document.querySelector(
    ".active-player-name-container"
  );
  const boardAndPlayersDiv = document.querySelector(".players-and-board");
  const activePlayerNameDisplay = document.querySelector(".active-player-name");

  const startGame = (p1, p2) => {
    activePlayer = [p1, p2][Math.round(Math.random())];
    gameOn = true;
    winnerPlayer = undefined;
    winnerText = "It's a Tie!";
    boardAndPlayersDiv.style.visibility = "visible";
    gameOverContainer.style.visibility = "hidden";
    activePlayerNameConteiner.style.visibility = "visible";
    activePlayerNameDisplay.textContent = activePlayer.name;
    Gameboard.resetLayout();
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
          move(activePlayer.cpuDecision());
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
    player1NameContainer,
    player2NameContainer,
  };
})();

const Player1 = Player("", "O", "", 1, 0);
const Player2 = Player("Mikrobi", "X", "", 2, 0);

const setup = (() => {
  const setupFormContainer = document.querySelector(".setup-form-container");
  const setupForm = document.querySelector(".setup-form");

  const handleSetupForm = (Player1, Player2) => {
    const player1Name = document.querySelector("#player1-name-input").value;
    const player1Type = document.querySelector("#player1-type-input").value;
    const player2Name = document.querySelector("#player2-name-input").value;
    const player2Type = document.querySelector("#player2-type-input").value;
    Player1.changeName(player1Name);
    Player1.changeType(player1Type);
    Player2.changeName(player2Name);
    Player2.changeType(player2Type);

    for (const player of [Player1, Player2]) {
      player.renderName();
      player.renderType();
    }

    setupFormContainer.style.visibility = "hidden";
    Game.startGame(Player1, Player2);
  };

  const prepareSetupForm = (Player1, Player2) => {
    setupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSetupForm(Player1, Player2);
    });
    setupFormContainer.style.visibility = "visible";
    Game.boardAndPlayersDiv.style.visibility = "hidden";
    Game.activePlayerNameConteiner.style.visibility = "hidden";
  };

  return { prepareSetupForm };
})();

setup.prepareSetupForm(Player1, Player2);
