// // Imported functions
// import {
//     board,
//     checkWinner,
//     currentMoveFunction,
//     currentPlayer,
//     difficulty,
//     difficultyModal,
//     easyModeButton,
//     gameModeModal,
//     hardModeButton,
//     moveCount,
//     NUM_CELLS,
//     playComputer,
//     playComputerButton,
//     playerOne,
//     playerTwo,
//     resetGame,
//     switchPlayer,
//     updateGameText
// } from "./common.js";

/// EVENT LISTENERS ///

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
  startGameWithComputer(); // Start game with computer
  console.log("Easy game with computer started");
});

// Set difficulty to hard
hardModeButton.addEventListener("click", () => {
  difficulty = "hard";
  difficultyModal.style.display = "none";
  console.log("Player vs Computer - Hard Mode");
  startGameWithComputer(); // Start game with computer
  console.log("Hard game with computer started");
});

/// GAME FUNCTIONS ///

// Start game with computer
function startGameWithComputer() {
  // Enable the board and assign the correct player marks
  boxes.forEach((box) => {
    box.addEventListener("click", handleBoxClick);
  });

  inRound = true;
  currentPlayer = playerOne;

  // Start the game based on selected difficulty
  if (difficulty === "easy") {
    console.log("Starting game in Easy mode.");
    playComputer = true;
    currentMoveFunction = easyComputerMove; // Start the first move with easy mode
  } else if (difficulty === "hard") {
    console.log("Starting game in Hard mode.");
    playComputer = true;
    currentMoveFunction = hardComputerMove; // Start the first move with hard mode
  }
  updateGameText(`${playerOne}'s turn`);
}

function easyComputerMove() {
  console.log("Beginning easy game");
}

function hardComputerMove() {
  console.log("Beginning hard game");
}






























// // Computer move - Easy mode
// function easyComputerMove() {
//   console.log("Computer is thinking...");
//   updateGameText("Computer is thinking...", true); // Show thinking effect

//   setTimeout(() => {
//     const availableCells = board
//       .map((cell, index) => (cell === "" ? index : null))
//       .filter((index) => index !== null);

//     if (availableCells.length > 0) {
//       const randomIndex = Math.floor(Math.random() * availableCells.length);
//       const move = availableCells[randomIndex];
//       const currentMark = playerTwoMark; // Computer uses player two's mark

//       // Update the board and UI
//       board[move] = currentMark;
//       boxes[
//         move
//       ].innerHTML = `<img src="${currentMark}" alt="Computer's mark">`;

//       moveCount++;
//       console.log("Move count: ", moveCount);

//       if (checkWinner(currentMark)) {
//         updateGameText(`${playerTwo} (Computer) wins!`);
//         inRound = false;
//       } else if (moveCount === NUM_CELLS) {
//         updateGameText("It's a tie!");
//         inRound = false;
//       } else {
//         updateGameText(`${playerOne}'s turn`);
//         switchPlayer(); // Back to human player
//       }
//     }
//   }, 1000); // Delay the computer's move
// }

// function hardComputerMove() {
//   setTimeout(() => {
//     const move = minimaxMove();
//     const currentMark = playerTwoMark;

//     // Update the board and UI
//     board[move] = currentMark;
//     boxes[move].innerHTML = `<img src="${currentMark}" alt="Computer's mark">`;

//     moveCount++;
//     console.log("Move count: ", moveCount);

//     if (checkWinner(currentMark)) {
//       updateGameText(`${playerTwo} (Computer) wins!`);
//       inRound = false;
//     } else if (moveCount === NUM_CELLS) {
//       updateGameText("It's a tie!");
//       inRound = false;
//     } else {
//       updateGameText(`${playerOne}'s turn`);
//       switchPlayer();
//     }
//   }, 1000);
// }
