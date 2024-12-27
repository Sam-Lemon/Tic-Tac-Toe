///// GLOBAL CONSTANTS AND VARIABLES //////

// Game Settings
const NUM_CELLS = 9;

// Player Settings
const DEFAULT_PLAYER_NAMES = ["Player One", "Player Two"];
const DEFAULT_MARKS = [
  new URL("./images/pinkAlienCharacter.png", window.location.href).href, //mungfali.com
  new URL("./images/greenAlienCharacter.png", window.location.href).href, //i.pinimg.com
];

// UI Elements
const boxes = document.querySelectorAll(".box");
const closeModalButtons = document.querySelectorAll(".close-modal");
const difficultyModal = document.getElementById("difficulty-modal");
const easyModeButton = document.getElementById("easy-mode");
const gameModeModal = document.getElementById("game-mode-modal");
const gameTextDiv = document.getElementById("new-game-text");
const hardModeButton = document.getElementById("hard-mode");
const message = document.getElementById("message");
const newGameButton = document.getElementById("new-game");
const playComputerButton = document.getElementById("play-computer-button");
const playFriendButton = document.getElementById("play-friend-button");
const playerNameModal = document.getElementById("player-name-modal");
const playerOneInput = document.getElementById("player-one-name");
const playerTwoInput = document.getElementById("player-two-name");
const resetNameButton = document.getElementById("reset-names-button");
const startPvPGameButton = document.getElementById("start-pvp-game");
const submitNamesButton = document.getElementById("submit-names-button");

// Game State
let board = Array(NUM_CELLS).fill("");
let currentMoveFunction;
let currentPlayer = DEFAULT_PLAYER_NAMES[0];
let difficulty = "easy";
let inRound = false;
let moveCount = 0;
let playComputer = false;
let playerOne = DEFAULT_PLAYER_NAMES[0];
let playerOneMark = "X";
let playerTwo = DEFAULT_PLAYER_NAMES[1];
let playerTwoMark = "O";

// Winning Combinations
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6], // Diagonals
];

// Debugging
const debug = true;
const log = (...args) => debug && console.log(...args);

/////////// EVENT LISTENERS ///////////

// Start new game button
newGameButton.addEventListener("click", () => {
  resetGame();
  gameModeModal.style.display = "flex";
  playerNameModal.style.display = "none";
  difficultyModal.style.display = "none";
});

// Modals
Array.from(closeModalButtons).forEach((button) => {
  button.addEventListener("click", () => {
    if (difficultyModal.style.display === "block" || "flex") {
      difficultyModal.style.display = "none";
    }
    if (gameModeModal.style.display === "block" || "flex") {
      gameModeModal.style.display = "none";
    }
    if (playerNameModal.style.display === "block" || "flex") {
      playerNameModal.style.display = "none";
    }
  });
});

/////////// GAME FUNCTIONS ///////////

// Reset game
function resetGame() {
  board.fill("");
  log("Board reset: ", board);

  boxes.forEach((box) => {
    box.classList.remove("winning-combination");
    box.textContent = "";
    box.innerHTML = "";
    box.removeEventListener("click", handlePVCBoxClick);
  });

  gameTextDiv.innerHTML = "";
  inRound = false;
  playComputer = false;
  moveCount = 0;
  playerOne = DEFAULT_PLAYER_NAMES[0];
  playerTwo = DEFAULT_PLAYER_NAMES[1];
  
  log("Player names have been reset to: ", playerOne, ", ", playerTwo);
  log("Move count reset to 0");
}

// Handle box click
function handleBoxClick(event) {
  const clickedBox = event.target;
  const index = Array.from(boxes).indexOf(clickedBox);

  if (inRound && board[index] === "") {
    const currentMark =
      currentPlayer === playerOne ? "X" : "O";

    board[index] = currentMark;
    renderMark(index, currentMark);

    moveCount++;
    log("Move count:", moveCount);

    if (checkWinner(currentMark)) {
      gameTextDiv.innerHTML = `${currentPlayer} wins!`;
      inRound = false;
      highlightWinner(currentMark);
    } else if (moveCount === NUM_CELLS) {
      gameTextDiv.innerHTML = "It's a tie!";
      inRound = false;
    } else {
      switchPlayer(); 
      updateGameText(`${currentPlayer}'s turn`);
    }
  }
}

// Convert logical marks to images
function renderMark(index, mark) {
  const markImages = {
    X: "images/pinkAlienCharacter.png",
    O: "images/greenAlienCharacter.png"
  };

  if (markImages[mark]) {
    boxes[index].innerHTML = `<img src="${markImages[mark]}" alt="${mark}">`;
  } else {
    log(`Invalid mark received: ${mark}. Valid options are: ${Object.keys(markImages).join(", ")}`);
  }
}

// Helper function that checks combinations
function findWinningCombination(board, mark) {
  return winningCombinations.find((combination) =>
    combination.every((index) => board[index] === mark)
  );
}

// Check for winner
function checkWinner(mark) {
  const winningCombination = findWinningCombination(board, mark);

  if (winningCombination) {
    winningCombination.forEach((index) =>
      boxes[index].classList.add("winning-combination")
    );

    inRound = false; 
    gameTextDiv.innerHTML = `${currentPlayer} wins!`;
    return true;
  }

  return false;
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
  log("Switching player from ", currentPlayer); 
  currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  log("New currentPlayer:", currentPlayer);
}

// Update game text
function updateGameText(text, isComputerThinking = false) {
  gameTextDiv.innerHTML = text;

  if (isComputerThinking) {
    gameTextDiv.classList.add("thinking");
  } else {
    gameTextDiv.classList.remove("thinking");
  }

  log("Updating game text to: ", text);
  log("Board before marking: ", board);
}

/////////// HELPER FUNCTIONS ///////////

// Clear player inputs
function clearPlayerInputs() {
  playerOneInput.value = "";
  playerTwoInput.value = "";
}

function updateMessage(text) {
  message.innerHTML = text;
}

/////////// EFFECTS ///////////

// Fireworks effect
function launchFireworks() {
  const duration = 3 * 1000; 
  const end = Date.now() + duration;

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
        y: Math.random() * 0.6, 
      },
    });
  }, 400); 

  setTimeout(() => {
    gameTextDiv.innerHTML = "Game Over!";
  }, duration);
}
