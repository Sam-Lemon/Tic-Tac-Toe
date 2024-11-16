///// GLOBAL CONSTANTS AND VARIABLES //////

// Game Settings
const NUM_CELLS = 9;
const DEFAULT_PLAYER_NAMES = ["Player One", "Player Two"];
const DEFAULT_MARKS = [
  new URL("./images/pinkAlienCharacter.png", window.location.href).href, //mungfali.com
  new URL("./images/greenAlienCharacter.png", window.location.href).href, //i.pinimg.com
];

// Elements
const gameTextDiv = document.getElementById("new-game-text");
const newGameButton = document.getElementById("new-game");
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

function resetGame() {
  board = Array(9).fill("");

  boxes.forEach((box) => {
    box.classList.remove("winning-combination");
  });

  inRound = false;
  moveCount = 0;
}

// Handle box click
function handleBoxClick(event) {
  const clickedBox = event.target; // Using more descriptive variable
  const index = Array.from(boxes).indexOf(clickedBox);

  if (inRound && board[index] === "") {
    const currentMark =
      currentPlayer === playerOne ? playerOneMark : playerTwoMark;

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
function highlightWinner(mark) {
  for (const combination of winningCombinations) {
    if (combination.every((index) => board[index] === mark)) {
      combination.forEach((index) =>
        boxes[index].classList.add("winning-combination")
      );
    }
    launchFireworks();
    break;
  }
}

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
        setTimeout(() => {
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

function updateGameText(text) {
  gameTextDiv.innerHTML = text;
  console.log("Updating game text to: ", text);
}

/////////// EVENT LISTENERS ///////////

// Start new game button
newGameButton.addEventListener("click", () => {
  resetGame();
  startPvPGame();
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
