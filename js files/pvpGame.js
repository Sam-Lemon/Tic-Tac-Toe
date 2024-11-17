/////////// EVENT LISTENERS ///////////

// PvP Game Mode
playFriendButton.addEventListener("click", () => {
  playerNameModal.style.display = "flex";
})

// Submit player names
submitNamesButton.addEventListener("click", () => {
  playerOne = playerOneInput.value || DEFAULT_PLAYER_NAMES[0];
  playerTwo = playerTwoInput.value || DEFAULT_PLAYER_NAMES[1];
  // updateGameText(
  //   `Names updated! Ready to play, ${playerOne} and ${playerTwo}?`
  // );
  message.innerHTML = `Names updated! Ready to play, ${playerOne} and ${playerTwo}?`;
  gameModeModal.style.display = "none";
});

function startPvPGame() {
  boxes.forEach((box) => {
    box.addEventListener("click", handleBoxClick);
  });

  playerNameModal.style.display = "none";
  inRound = true;
  currentPlayer = playerOne;
  updateGameText(`${playerOne}'s turn`);
}
