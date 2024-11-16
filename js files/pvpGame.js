function startPvPGame() {
  boxes.forEach((box) => {
    box.addEventListener("click", handleBoxClick);
  });

  inRound = true;
  currentPlayer = playerOne;
  updateGameText(`${playerOne}'s turn`);
}
