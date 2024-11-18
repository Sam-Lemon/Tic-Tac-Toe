/////////// EVENT LISTENERS ///////////

// Play vs computer
playComputerButton.addEventListener("click", () => {
    resetGame();
    playComputer = true;
    console.log("playComputer: ", playComputer);
    
    gameModeModal.style.display = "none";
    difficultyModal.style.display = "flex";
  });
  
  // Set difficulty to easy
  easyModeButton.addEventListener("click", () => {
    difficulty = "easy";
    difficultyModal.style.display = "none";
    console.log("Player vs Computer - Easy Mode");
    startEasyGameWithComputer(); // Start game with computer
    console.log("Easy game with computer started");
  });
  
  // Set difficulty to hard
  hardModeButton.addEventListener("click", () => {
    difficulty = "hard";
    difficultyModal.style.display = "none";
    console.log("Player vs Computer - Hard Mode");
    startHardGameWithComputer(); // Start game with computer
    console.log("Hard game with computer started");
  });