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

// Start the game with the computer
function startGameWithComputer() {
  playComputer = true;
  difficulty = "easy";
  initializeGame();
  gameTextDiv.innerHTML = `${currentPlayer}'s turn against the computer!`;
}

//Start a new game with PvP
function startGameWithPvP() {
  playComputer = false;
  initializeGame();
  gameTextDiv.innerHTML = `${currentPlayer}'s turn!`;
}


// Initialize the game
function initializeGame() {
  board.fill(""); // Clear board
  moveCount = 0;
  inRound = true;
  currentPlayer = playerOne;
  // resetBoard();
  updateGameText(`${playerOne}'s turn`);
}

// Reset the board
function resetBoard() {
  boxes.forEach((box) => {
    box.innerHTML = "";
    box.classList.remove("winning-combination");
    box.addEventListener("click", handleBoxClick);
  });
  inRound = false;
  playComputer = false;
}

// Handle box click
function handleBoxClick(event) {
  const clickedBox = event.target; // Using more descriptive variable
  const index = Array.from(boxes).indexOf(clickedBox);

  if (inRound && board[index] === "") {
    const currentMark = currentPlayer === playerOne ? playerOneMark : playerTwoMark;

    // Place the mark on the board
    board[index] = currentMark;
    clickedBox.innerHTML = `<img src = "${currentMark}" alt="${currentPlayer}'s mark">`;

    moveCount++;
    console.log("Move count:", moveCount);

    if (checkWinner(currentMark)) {
      gameTextDiv.innerHTML = `${currentPlayer} wins!`;
      inRound = false;
      highlightWinner(currentMark);
    } else if (moveCount === NUM_CELLS) {
      gameTextDiv.innerHTML = "It's a tie!";
      inRound = false;
    } else {
      console.log("Before switching player");
      switchPlayer(); // Switches to the other player
    }
  }
}


// Check for winner
function checkWinner(mark) {
  const winnerFound = winningCombinations.some((combination) => {
    const isMatch = combination.every((index) => board[index] === mark);
    if (isMatch) {
      combination.forEach((index) =>
        boxes[index].classList.add("winning-combination")
      );
    }
    return isMatch;
  });

  if (winnerFound) {
    inRound = false; // Ends round if a winner is found
    gameTextDiv.innerHTML = `${currentPlayer} wins!`;
  }
  return winnerFound;
}

// Highlight the winning combination
function highlightWinner(mark) 
  winningCombinations.forEach((combination) => {
    if (combination.every((index) => board[index] === mark)) {
      combination.forEach((index) =>
        boxes[index].classList.add("winning-combination")
      );
    }
    launchFireworks();
  });


// Switch player turns
function switchPlayer() {
  console.log("Switching player from ", currentPlayer); // Check current player
  currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  console.log("New currentPlayer:", currentPlayer); // currentPlayer after the switch

  if (playComputer) {
    // If playing against the computer and it's the computer's turn
    if (currentPlayer === playerTwo) {
      console.log("Computer's turn after player");
      if (inRound) {
        setTimeout (() => {
          console.log("setTimeout triggered, making computer move");
          computerMove();
        }, 1000);
      }
    }
  } else {
    // If playing against another human player
    console.log(`${currentPlayer}'s turn now`);
    updateGameText(`${currentPlayer}'s turn`);
  }
}

// Update the game text
function updateGameText(text) {
  console.log("Updating game text to:", text); // Log text that will be shown
  gameTextDiv.innerHTML = text;
}

// Start the game with the computer
function startGameWithComputer() {
  resetGame();
  inRound = true;
  gameTextDiv.innerHTML = `${playerOne}, make your move against the ${difficulty} computer.`;
  updateGameText(`${playerOne}'s turn`); // Update game text to reflect player one's turn
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
  console.log("Computer's turn...");
  if (difficulty === "easy") {
    console.log("Making easy move...");
    makeEasyMove();
  } else {
    console.log("Making hard move...");
    makeHardMove();
  }
}

// Easy mode move (random)
function makeEasyMove() {
  if (inRound) {
    console.log("Making easy move...");
    const emptyBoxes = Array.from(boxes).filter((box) => box.innerHTML === "");
    if (emptyBoxes.length > 0 && inRound) {
      const randomBox =
        emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
      const index = Array.from(boxes).indexOf(randomBox);
      console.log("Random box selected: ", randomBox);
      randomBox.innerHTML = `<img src="${playerTwoMark}" alt="Computer's mark">`;
      board[index] = playerTwoMark;
      moveCount++;
      checkWinner(playerTwoMark);
    }
    switchPlayer();
  } else {
    console.log("inRound is: ", inRound);
  }
}

// Minimax algorithm for hard mode
function minimax(board, player) {
  const emptyIndexes = board
    .map((val, index) => (val === "" ? index : null))
    .filter((index) => index !== null);

  //Check for winner or tie
  if (checkWinnerForMinimax(board, player)) {
    console.log(`Player ${player} wins with move!`);
    return 10;
  }
  if (
    checkWinnerForMinimax(
      board,
      player === playerOneMark ? playerTwoMark : playerOneMark
    )
  ) {
    console.log("Opponent wins with move!");
    return -10;
  }
  if (emptyIndexes.length === 0) {
    console.log("It's a tie!");
    return 0;
  }

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

  console.log(`Best move for ${player}: ${bestMove} with score: ${bestScore}`);
  return bestMove;
}

// Minimax helper function - Check winner for Minimax
function checkWinnerForMinimax(board, player) {
  console.log(`Checking winner for player: ${player}, board: `, board); // Log current player

  const isWinner = winningCombinations.some((combination) => {
    const isMatch = combination.every((index) => board[index] === player);
    if (isMatch) {
      console.log(`Player ${player} wins with combination: `, combination);
    }
    return isMatch;
  });

  console.log("Is winner: ", isWinner); // Lof if winner was found
  return isWinner;
}

// Hard mode move (best move using Minimax)
function makeHardMove() {
  if (inRound) {
    console.log("Making hard move...");
    const bestMove = minimax(board, playerTwoMark);
    console.log("Best move determined by Minimax: ", bestMove);

    if (bestMove !== null) {
      boxes[
        bestMove
      ].innerHTML = `<img src="${playerTwoMark}" alt="Computer's mark">`;
      board[bestMove] = playerTwoMark;
      moveCount++;
      checkWinner(playerTwoMark);
    }
  } else {
    console.log("inRound is: ", inRound);
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
  resetGame();
  playComputer = true;
  console.log("playComputer: ", playComputer);
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
