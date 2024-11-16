/////////// EVENT LISTENERS ///////////

// Submit player names
submitNamesButton.addEventListener("click", () => {
  playerOne = playerOneInput.value || DEFAULT_PLAYER_NAMES[0];
  playerTwo = playerTwoInput.value || DEFAULT_PLAYER_NAMES[1];
  updateGameText(
    `Names updated! Ready to play, ${playerOne} and ${playerTwo}?`
  );
});




function startPvPGame() {
  boxes.forEach((box) => {
    box.addEventListener("click", handleBoxClick);
  });

  inRound = true;
  currentPlayer = playerOne;
  updateGameText(`${playerOne}'s turn`);
}
