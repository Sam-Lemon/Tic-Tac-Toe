/////////// GLOBAL CONSTANTS AND VARIABLES ///////////

// Game Settings
const NUM_CELLS = 9;
const DEFAULT_PLAYER_NAMES = ["Player One", "Player Two"];
const DEFAULT_MARKS = [
  new URL("./images/pinkAlienCharacter.png", window.location.href).href, //mungfali.com
  new URL("./images/greenAlienCharacter.png", window.location.href).href, //i.pinimg.com
];

// Elements
const gameTextDiv = document.getElementById("new-game-text");
const startGameButton = document.getElementById("start-game");
const submitNamesButton = document.getElementById("submit-names");
const difficultyModal = document.getElementById("difficulty-modal");
const playComputerButton = document.getElementById("play-computer");
const easyModeButton = document.getElementById("easy-mode");
const hardModeButton = document.getElementById("hard-mode");
const playerOneInput = document.getElementById("playerOneName");
const playerTwoInput = document.getElementById("playerTwoName");
const boxes = document.querySelectorAll(".box"); //Selects all of the boxes

// Game State
let board = Array(9).fill(""); //Initialize board with 9 spaces
let moveCount = 0;
let inRound = false; //initial status is not in a round
let playComputer = false;
let difficulty = "easy"; //Default difficulty
let currentPlayer = DEFAULT_PLAYER_NAMES[0];
let playerOne = DEFAULT_PLAYER_NAMES[0];
let playerTwo = DEFAULT_PLAYER_NAMES[1];
let playerOneMark = DEFAULT_MARKS[0];
let playerTwoMark = DEFAULT_MARKS[1];

// Winning Combinations
const winningCombinations = [
  [0, 1, 2], // first row
  [3, 4, 5], // second row
  [6, 7, 8], // third row
  [0, 3, 6], // first column
  [1, 4, 7], // second column
  [2, 5, 8], // third column
  [0, 4, 8], // left to right diagonal
  [2, 4, 6], // right to left diagonal
];

/////////// GAME FUNCTIONS ///////////

// Initialize the game
function initializeGame() {
  board.fill(""); // Clear board
  moveCount = 0;
  inRound = true;
  currentPlayer = playerOne;
  resetBoard();
  updateGameText(`${playerOne}'s turn`);
}

// Reset the board
function resetBoard() {
  boxes.forEach((box) => {
    box.innerHTML = "";
    box.classList.remove("winning-combination");
    box.addEventListener("click", handleBoxClick);
  });
}

// Handle box click
function handleBoxClick(event) {
  const index = Array.from(boxes).indexOf(event.target);

  if (inRound && board[index] === "") {
    board[index] = currentPlayer === playerOne ? playerOneMark : playerTwoMark;
    event.target.innerHTML = `<img src = "${board[index]}" alt="${currentPlayer}'s mark">`;

    moveCount++;
    if (checkWinner(board[index])) {
      gameTextDiv.innerHTML = `${currentPlayer} wins!`;
      inRound = false;
      highlightWinner(board[index]);
    } else if (moveCount === NUM_CELLS) {
      gameTextDiv.innerHTML = "It's a tie!";
      inRound = false;
    } else {
      switchPlayer();
    }
  }
}

// Check for winner
function checkWinner(mark) {
  return winningCombinations.some((combination) => {
    const isMatch = combination.every((index) => board[index] === mark);
    if (isMatch) {
      combination.forEach((index) =>
        boxes[index].classList.add("winning-combination")
      );
    }
    return isMatch;
  });
}

// Highlight the winning combination
function highlightWinner(mark) {
  winningCombinations.forEach((combination) => {
    if (combination.every((index) => board[index] === mark)) {
      combination.forEach((index) =>
        boxes[index].classList.add("winning-combination")
      );
    }
    launchFireworks();
  });
}

// Switch player turns
function switchPlayer() {
  currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  if (playComputer && currentPlayer === playerTwo) {
    setTimeout(computerMove, 1000); // Simulate thinking time
  } else {
    updateGameText(`${currentPlayer}'s turn`);
  }
}

// Update the game text
function updateGameText(text) {
  gameTextDiv.innerHTML = text;
}

// Start the game with the computer
function startGameWithComputer() {
  playComputer = true;
  resetGame();
  gameTextDiv.innerHTML = `${playerOne}, make your move against the ${difficulty} computer.`;
}

// Reset the game to initial state
function resetGame() {
  resetBoard();
  board.fill(""); // Reset board array
  moveCount = 0;
  inRound = true;
  currentPlayer = playerOne;
  updateGameText(`${playerOne}'s turn`);
  startGameButton.textContent = "Reset Game";
  playComputer = false;
  difficulty = "easy";
  difficultyModal.style.display = "none";
}

// Handle computer's move (easy/hard)
function computerMove() {
  if (difficulty === "easy") {
    makeEasyMove();
  } else {
    makeHardMove();
  }
}

// Easy mode move (random)
function makeEasyMove() {
  const emptyBoxes = Array.from(boxes).filter((box) => box.innerHTML === "");
  if (emptyBoxes.length > 0 && inRound) {
    const randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    const index = Array.from(boxes).indexOf(randomBox);
    randomBox.innerHTML = `<img src="${playerTwoMark}" alt="Computer's mark">`;
    board[index] = playerTwoMark;
    moveCount++;
    checkWinner(playerTwoMark);
    if (inRound) switchPlayer();
  }
}

// Minimax algorithm for hard mode
function minimax(board, player) {
  const emptyIndexes = board
    .map((val, index) => (val === "" ? index : null))
    .filter((index) => index !== null);

  //Check for winner or tie
  if (checkWinnerForMinimax(board, player)) return 10;
  if (
    checkWinnerForMinimax(
      board,
      player === playerOneMark ? playerTwoMark : playerOneMark
    )
  )
    return -10;
  if (emptyIndexes.length === 0) return 0;

  let bestMove = null;
  let bestScore = player === playerTwoMark ? -Infinity : Infinity;

  //Loop through empty cells and simulate moves
  for (let i = 0; i < emptyIndexes.length; i++) {
    const index = emptyIndexes[i];
    board[index] = player; //Make the move

    const score = minimax(
      board,
      player === playerTwoMark ? playerOneMark : playerTwoMark
    );

    board[index] = ""; //Undo the move

    if (player === playerTwoMark) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }
  }
  return bestMove;
}

// Hard mode move (best move using Minimax)
function makeHardMove() {
  const bestMove = minimax(board, playerTwoMark);
  if (bestMove !== null) {
    boxes[
      bestMove
    ].innerHTML = `<img src="${playerTwoMark}" alt="Computer's mark">`;
    board[bestMove] = playerTwoMark;
    moveCount++;
    checkWinner(playerTwoMark);
    if (inRound) switchPlayer();
  }
}

/////////// EVENT LISTENERS ///////////

// Start new game button
startGameButton.addEventListener("click", () => {
  resetGame();
  initializeGame();
});

// Submit player names
submitNamesButton.addEventListener("click", () => {
  playerOne = playerOneInput.value || DEFAULT_PLAYER_NAMES[0];
  playerTwo = playerTwoInput.value || DEFAULT_PLAYER_NAMES[1];
  updateGameText(
    `Names updated! Ready to play, ${playerOne} and ${playerTwo}?`
  );
});

// Play vs computer
playComputerButton.addEventListener("click", () => {
  playComputer = true;
  resetGame();
  difficultyModal.style.display = "flex";
});

// Set difficulty to easy
easyModeButton.addEventListener("click", () => {
  difficulty = "easy";
  difficultyModal.style.display = "none";
  console.log("Player vs Computer - Easy Mode");
  startGameWithComputer();
  console.log("Easy game with computer started");
});

// Set difficulty to hard
hardModeButton.addEventListener("click", () => {
  difficulty = "hard";
  difficultyModal.style.display = "none";
  console.log("Player vs Computer - Hard Mode");
  startGameWithComputer();
  console.log("Hard game with computer started");
});

/////////// EFFECTS ///////////

// Fireworks effect
function launchFireworks() {
  const duration = 3 * 1000; //Firework duration in milliseconds
  const end = Date.now() + duration;

  //Generate random fireworks over the duration
  const interval = setInterval(function () {
    if (Date.now() > end) {
      clearInterval(interval);
    }
    confetti({
      particleCount: 100,
      angle: Math.random() * 360,
      spread: 70,
      origin: {
        x: 0.5,
        y: Math.random() * 0.6, //Random Y to keep fireworks mostly above mid screen
      },
    });
  }, 400); //Interval between fireworks bursts

  setTimeout(() => {
    gameTextDiv.innerHTML = "Game Over!";
  }, duration);
}















// /////////// FUNCTIONS ///////////

// ///Vs Computer///
// playComputerButton.addEventListener("click", () => {
//   playComputer = true;
//   resetGame();
//   difficultyModal.style.display = "flex"; //Reveals modal
// });

// easyModeButton.addEventListener("click", () => {
//   difficulty = "easy";
//   difficultyModal.style.display = "none"; //Hides modal
//   startGameWithComputer();
// });

// hardModeButton.addEventListener("click", () => {
//   difficulty = "hard";
//   difficultyModal.style.display = "none"; //Hides modal
//   startGameWithComputer();
// });

// function startGameWithComputer() {
//   playComputer = true;
//   resetGame();
//   gameTextDiv.innerHTML = `${playerOne}, make your move against the ${difficulty} computer.`;
// }

// function computerMove() {
//   if (difficulty === "easy") {
//     makeEasyMove();
//   } else {
//     makeHardMove();
//   }
// }

// function makeEasyMove() {
//   const emptyBoxes = Array.from(boxes).filter((box) => box.innerHTML === "");

//   if (emptyBoxes.length > 0 && inRound) {
//     const randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
//     const index = Array.from(boxes).indexOf(randomBox); //Get index of selected box

//     randomBox.innerHTML = `<img src="${playerTwoMark}" alt="Computer's Mark">`;
//     board[index] = playerTwoMark; //Update the board array at the selected index

//     moveCount++;
//     checkWinner(playerTwoMark);

//     if (inRound) {
//       switchPlayer();
//       gameTextDiv.innerHTML = `${playerOne}'s turn`;
//     }

//     if (moveCount === 9 && inRound) {
//       gameTextDiv.innerHTML = "It's a tie!";
//       inRound = false;
//     }
//   }
// }

// function minimax(board, player) {
//   const emptyIndexes = board
//     .map((val, index) => (val === "" ? index : null))
//     .filter((index) => index !== null);

//   //Check for winner or tie
//   if (checkWinnerForMinimax(board, player)) return 10;
//   if (
//     checkWinnerForMinimax(
//       board,
//       player === playerOneMark ? playerTwoMark : playerOneMark
//     )
//   )
//     return -10;
//   if (emptyIndexes.length === 0) return 0;

//   let bestMove = null;
//   let bestScore = player === playerTwoMark ? -Infinity : Infinity;

//   //Loop through empty cells and simulate moves
//   for (let i = 0; i < emptyIndexes.length; i++) {
//     const index = emptyIndexes[i];
//     board[index] = player; //Make the move

//     const score = minimax(
//       board,
//       player === playerTwoMark ? playerOneMark : playerTwoMark
//     );

//     board[index] = ""; //Undo the move

//     if (player === playerTwoMark) {
//       if (score > bestScore) {
//         bestScore = score;
//         bestMove = index;
//       }
//     } else {
//       if (score < bestScore) {
//         bestScore = score;
//         bestMove = index;
//       }
//     }
//   }
//   return bestMove;
// }

// function makeHardMove() {
//   const bestMove = minimax(board, playerTwoMark);
//   console.log("Best Move (Hard Mode):", bestMove); //Check if bestMove is valid

//   if (bestMove !== null) {
//     boxes[
//       bestMove
//     ].innerHTML = `<img src="${playerTwoMark}" alt="Computer's mark">`;
//     board[bestMove] = playerTwoMark; //Updating board

//     moveCount++;
//     checkWinner(playerTwoMark);

//     if (inRound) {
//       switchPlayer();
//     }
//   }
// }

// ///Change player names///
// submitNamesButton.addEventListener("click", () => {
//   playerOne = playerOneInput.value || "Player One"; //Default to "Player One" if input is empty
//   playerTwo = playerTwoInput.value || "Player Two"; //Defalut to "Player Two" if input is empty
//   gameTextDiv.innerHTML = `Names updated! Ready to play, ${playerOne} and ${playerTwo}?`;
// });

// ///Vs Another Player///
// startGame.addEventListener("click", () => {
//   resetGame();
//   initializeGame();
// });

// function initializeGame() {
//   //Reset board state on new game start
//   board.fill(""); //Clear board array
//   moveCount = 0;
//   inRound = "true";
//   currentPlayer = playerOne;

//   boxes.forEach((box) => {
//     box.addEventListener("click", function handleBoxClick() {
//       const index = Array.from(boxes).indexOf(box); //Get index of clicked box

//       if (inRound && box.innerHTML === "") {
//         box.innerHTML =
//           currentPlayer === playerOne
//             ? `<img src="${playerOneMark}" alt="Player One's mark">`
//             : `<img src="${playerTwoMark}" alt="Player Two's mark">`;

//         //Update the board state array with the current player's mark
//         board[index] =
//           currentPlayer === playerOne ? playerOneMark : playerTwoMark;

//         moveCount++;
//         checkWinner(
//           currentPlayer === playerOne ? playerOneMark : playerTwoMark
//         );

//         if (inRound) {
//           switchPlayer();
//           gameTextDiv.innerHTML = `${currentPlayer}'s turn`;
//         }

//         if (moveCount === 9 && inRound) {
//           gameTextDiv.innerHTML = "It's a tie!";
//           inRound = false;
//         }
//       }
//     });
//   });
// }

// function resetGame() {
//   Array.from(boxes).forEach((box) => {
//     box.innerHTML = "";
//     box.classList.remove("winning-combination");
//   });

//   board.fill(""); //Reset board state array to empty
//   moveCount = 0;
//   inRound = true;
//   currentPlayer = playerOne;
//   gameTextDiv.innerHTML = `Starting a new game. ${playerOne}, make your play.`;
//   startGame.textContent = "Reset Game";
//   playComputer = false;
//   difficulty = "Easy"; //Reset difficulty
//   difficultyModal.style.display = "none"; //Hides difficulty modal
// }

// function switchPlayer() {
//   currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;

//   if (playComputer && currentPlayer === playerTwo) {
//     setTimeout(computerMove, 1000); //Brief delay
//   } else if (!playComputer) {
//     gameTextDiv.innerHTML = `${currentPlayer}'s turn`;
//   }
// }

// initializeGame();

// ///Checking Winner///
// function checkWinner(mark) {
//   const isWinner = winningCombinations.some((combination) => {
//     const isMatch = combination.every((index) => {
//       //Check if the current mark matches the board at each position
//       return board[index] === mark;
//     });

//     if (isMatch) {
//       //If there's a winner, add the winning combination class and update the game
//       combination.forEach((index) => {
//         boxes[index].classList.add("winning-combination");
//       });

//       gameTextDiv.innerHTML = `${
//         mark === playerOneMark ? playerOne : playerTwo
//       } wins!`;
//       inRound = false;
//       launchFireworks();
//     }

//     return isMatch;
//   });

//   return isWinner;
// }

// ///Fireworks///
// function launchFireworks() {
//   const duration = 2 * 1000; //Firework duration in milliseconds
//   const end = Date.now() + duration;

//   //Generate random fireworks over the duration
//   const interval = setInterval(function () {
//     if (Date.now() > end) {
//       clearInterval(interval);
//     }
//     confetti({
//       particleCount: 300,
//       angle: Math.random() * 360,
//       spread: 70,
//       origin: {
//         x: 0.5,
//         y: Math.random() * 0.6, //Random Y to keep fireworks mostly above mid screen
//       },
//     });
//   }, 200); //Interval between fireworks bursts

//   setTimeout(() => {
//     gameTextDiv.innerHTML = "Game Over!";
//   }, duration);
// }

// ///Flying UFO Effect///
// // const ufoContainer = document.querySelector('.ufo-container');

// // function createUFO() {
// //   const ufo =  document.createElement('div');
// //   ufo.classList.add('ufo');

// // //Randomize starting position on Y axis
// // const startY = Math.random() * window.innerHeight * 0.8; //Between 0 and 80% of the viewport height
// // ufo.style.top = `${startY}px`;

// // //Add animation with random speed
// // const flyDuration = Math.random() * 3 + 5; //Between 5 and 8 seconds
// // ufo.style.animation = `flyby ${flyDuration}s linear`;

// // //Remove the UFO after animation completes
// // ufo.addEventListener('animationend', () => {
// //   ufoContainer.removeChild(ufo);
// // });

// // //Append UFO to the container
// // ufoContainer.appendChild(ufo);
// // }

// // //Function to create UFOs at random intervals
// // function startUFOFlybys() {
// //   setTimeout(() => {
// //    setInterval(createUFO, Math.random() * 2000 + 3000);
// //   }, Math.random() * 2000);
// // }

// // startUFOFlybys();
