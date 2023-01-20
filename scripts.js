const Gameboard = (() => {
  const boardLayoutContainer = document.querySelector(".board-layout");
  let layout = Array(9).fill("");

  const resetLayout = () => {
    layout = Array(9).fill("");
    renderBoardLayout();
  };

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [6, 7, 8],
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
  let activePlayer = [Player1, Player2][Math.round(Math.random())];
  let gameOn = false;

  const startGame = () => {
    gameOn = true;
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

  const move = (position) => {
    if (gameOn && Gameboard.movePermitted(position)) {
      Gameboard.registerMove(activePlayer, position);
      console.log(
        "Start of move function, active player is",
        activePlayer.name
      );

      if (!gameIsWon()) {
        if (activePlayer.name === Player1.name) {
          activePlayer = Player2;
        } else {
          activePlayer = Player1;
        }

        if (activePlayer.type === "cpu") {
          move(activePlayer.cpuDecision());
        }
      } else {
        gameOn = false;
      }

      console.log("End of move function, active player is", activePlayer.name);
    }
  };

  return { activePlayer, move, startGame, gameIsWon, gameIsTie };
};

majkul = Player("Majkul", "O", "cpu");
najt = Player("Nájt", "X", "human");
activeGame = Game(Gameboard, majkul, najt);
activeGame.startGame();
