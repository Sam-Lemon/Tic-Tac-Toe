/// HELPER FUNCTIONS ////
function updateMessage(text) {
  message.innerHTML = text;
}

/// EVENT LISTENERS ////

// PvP Game Mode
playFriendButton.addEventListener("click", () => {
  playerNameModal.style.display = "flex";
});

// Submit player names
submitNamesButton.addEventListener("click", () => {
  playerOne = playerOneInput.value || DEFAULT_PLAYER_NAMES[0];
  playerTwo = playerTwoInput.value || DEFAULT_PLAYER_NAMES[1];

  updateMessage(`Names updated! Ready to play, ${playerOne} and ${playerTwo}?`);
  gameModeModal.style.display = "none";
  clearPlayerInputs();
});

resetNameButton.addEventListener("click", () => {
  playerOne = DEFAULT_PLAYER_NAMES[0];
  playerTwo = DEFAULT_PLAYER_NAMES[1];

  updateMessage("Player names reset to defaults!");
  clearPlayerInputs();
});

startPvPGameButton.addEventListener("click", () => {
  startPvPGame();
  playComputer = false;
});


/// GAME FUNCTIONS ////

// Start game
function startPvPGame() {
  boxes.forEach((box) => {
    box.removeEventListener("click", handleBoxClick)
    box.addEventListener("click", handleBoxClick);
  });

  gameModeModal.style.display = "none";
  playerNameModal.style.display = "none";
  inRound = true;
  currentPlayer = playerOne;
  updateGameText(`${playerOne}'s turn`);
}
