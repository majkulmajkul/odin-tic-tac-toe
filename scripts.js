const Gameboard = (() => {
  const layout = ["", "", "", "", "", "", "", "", ""];

  const registerMove = (player, position) => {
    if (!layout[position]) {
      layout[position] = player.token;
      return true;
    } else {
      return false;
    }
  };

  return { layout, registerMove };
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
    if (activePlayer.type === "cpu") {
      move(activePlayer.cpuDecision());
      gameOn = true;
    }
  };

  const move = (position) => {
    Gameboard.registerMove(activePlayer, position);
    console.log("Start of move function, active player is", activePlayer.name);

    if (activePlayer.name === Player1.name) {
      activePlayer = Player2;
    } else {
      activePlayer = Player1;
    }

    if (activePlayer.type === "cpu") {
      move(activePlayer.cpuDecision());
    }

    console.log("End of move function, active player is", activePlayer.name);
  };

  return { activePlayer, move, startGame };
};

majkul = Player("Majkul", "O", "human");
najt = Player("Nájt", "X", "human");
thisGame = Game(Gameboard, majkul, najt);
thisGame.startGame();
