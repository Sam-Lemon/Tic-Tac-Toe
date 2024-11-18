/// EVENT LISTENERS ////

// PvP Game Mode
playFriendButton.addEventListener("click", () => {
  playerNameModal.style.display = "flex";
})

// Submit player names
submitNamesButton.addEventListener("click", () => {
  playerOne = playerOneInput.value || DEFAULT_PLAYER_NAMES[0];
  playerTwo = playerTwoInput.value || DEFAULT_PLAYER_NAMES[1];

  message.innerHTML = `Names updated! Ready to play, ${playerOne} and ${playerTwo}?`;
  gameModeModal.style.display = "none";

  playerOneInput.value = "";
  playerTwoInput.value = "";
});

startPvPGameButton.addEventListener("click", () => {
  startPvPGame();
})


/// GAME FUNCTIONS ////

// Start game
function startPvPGame() {
  boxes.forEach((box) => {
    box.addEventListener("click", handleBoxClick);
  });

  gameModeModal.style.display = "none";
  playerNameModal.style.display = "none";
  inRound = true;
  currentPlayer = playerOne;
  updateGameText(`${playerOne}'s turn`);
}
