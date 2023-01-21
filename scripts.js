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
  let winnerName;
  const player1NameContainer = document.querySelector(".player1-name");
  const player2NameContainer = document.querySelector(".player2-name");
  const player1WinsDisplay = document.querySelector(".player1-wins");
  const player2WinsDisplay = document.querySelector(".player2-wins");
  const gameOverContainer = document.querySelector(".game-over-container");
  const activePlayerNameConteiner = document.querySelector(
    ".active-player-name-container"
  );
  const boardAndPlayersDiv = document.querySelector(".players-and-board");
  const activePlayerNameDisplay = document.querySelector(".active-player-name");

  const startGame = () => {
    activePlayer = [Player1, Player2][Math.round(Math.random())];
    gameOn = true;
    winnerName = "";
    winnerText = "It's a Tie!";
    boardAndPlayersDiv.style.visibility = "visible";
    gameOverContainer.style.visibility = "hidden";
    activePlayerNameConteiner.style.visibility = "visible";
    activePlayerNameDisplay.textContent = activePlayer.name;
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
          winnerName = player.name;
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
    if (winnerName) {
      if (winnerName === Player1.name) {
        const wins = parseInt(player1WinsDisplay.textContent);
        player1WinsDisplay.textContent = wins + 1;
      } else {
        const wins = parseInt(player2WinsDisplay.textContent);
        player2WinsDisplay.textContent = wins + 1;
      }
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
};

const Player1 = Player("Majkul", "O", "");
const Player2 = Player("Nájt", "X", "huaman");
const activeGame = Game(Gameboard, Player1, Player2);

const setup = (() => {
  const setupFormContainer = document.querySelector(".setup-form-container");
  const setupForm = document.querySelector(".setup-form");

  const handleSetupForm = (Player1, Player2) => {
    const player1Name = document.querySelector("#player1-name-input").value;
    const player1Type = document.querySelector("#player1-type-input").value;
    const player2Name = document.querySelector("#player2-name-input").value;
    const player2Type = document.querySelector("#player2-type-input").value;
    Player1.name = player1Name;
    Player1.type = player1Type;
    Player2.name = player2Name;
    Player2.type = player2Type;

    activeGame.player1NameContainer.textContent = player1Name;
    activeGame.player2NameContainer.textContent = player2Name;

    setupFormContainer.style.visibility = "hidden";
    activeGame.startGame();
  };

  const prepareSetupForm = () => {
    setupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSetupForm(Player1, Player2);
    });
    setupFormContainer.style.visibility = "visible";
    activeGame.boardAndPlayersDiv.style.visibility = "hidden";
    activeGame.activePlayerNameConteiner.style.visibility = "hidden";
  };

  return { prepareSetupForm };
})();

setup.prepareSetupForm();
