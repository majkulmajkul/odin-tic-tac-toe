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
