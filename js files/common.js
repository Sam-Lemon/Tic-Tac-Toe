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
const closeModalButtons = document.getElementsByClassName("close-modal");
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
const startPvPGameButton = document.getElementById("start-pvp-game");
const submitNamesButton = document.getElementById("submit-names-button");

// Game State
let board = Array(NUM_CELLS).fill(""); // Initialize board with 9 spaces
let currentMoveFunction;
let currentPlayer = DEFAULT_PLAYER_NAMES[0];
let difficulty = "easy"; // Default difficulty
let inRound = false; // Initial status is not in a round
let moveCount = 0;
let playComputer = false;
let playerOne = DEFAULT_PLAYER_NAMES[0];
// let playerOneMark = DEFAULT_MARKS[0];
let playerOneMark = "X";
let playerTwo = DEFAULT_PLAYER_NAMES[1];
// let playerTwoMark = DEFAULT_MARKS[1];
let playerTwoMark = "O";

// Winning Combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

/////////// EVENT LISTENERS ///////////

// Start new game button
newGameButton.addEventListener("click", () => {
  resetGame();
  gameModeModal.style.display = "flex";
  playerNameModal.style.display = "none";
  difficultyModal.style.display = "none";
});

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
  console.log("Board reset: ", board);

  boxes.forEach((box) => {
    box.classList.remove("winning-combination");
    box.textContent = "";
    box.innerHTML = "";
  });

  gameTextDiv.innerHTML = "";
  inRound = false;
  playComputer = false;
  moveCount = 0;
  playerOne = DEFAULT_PLAYER_NAMES[0];
  playerTwo = DEFAULT_PLAYER_NAMES[1];
  
  console.log("Player names have been reset to: ", playerOne, ", ", playerTwo);
  console.log("Move count reset to 0");
}

// Handle box click
function handleBoxClick(event) {
  const clickedBox = event.target;
  const index = Array.from(boxes).indexOf(clickedBox);

  if (inRound && board[index] === "") {
    const currentMark =
      currentPlayer === playerOne ? "X" : "O";

    // Place the mark on the board
    board[index] = currentMark;
    renderMark(index, currentMark);

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
      updateGameText(`${currentPlayer}'s turn`);
    }
  }
}

// Convert logical marks to images
function renderMark(index, mark) {
  const markImages = {
    X: "images/pinkAlienCharacter.png",
    O: "images/greenAlienCharacter.png",
  };

  console.log(`Mark received: ${mark}`);

  if (!markImages[mark]) {
    console.error (`Invalid mark: ${mark}`);
    return;
  }

  boxes[index].innerHTML = `<img src="${markImages[mark]}" alt="${mark}">`;
}

// Helper function that checks combinations
function findWinningCombination(board, mark) {
  console.log("Board:", board);
  // console.log("Mark:", mark);
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

    inRound = false; // Ends round when winner found
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
  console.log("Switching player from ", currentPlayer); // Check current player
  currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  console.log("New currentPlayer:", currentPlayer); // currentPlayer after the switch
}

// Update game text
function updateGameText(text, isComputerThinking = false) {
  gameTextDiv.innerHTML = text;

  if (isComputerThinking) {
    gameTextDiv.classList.add("thinking");
  } else {
    gameTextDiv.classList.remove("thinking");
  }

  console.log("Updating game text to: ", text);
  console.log("Board before marking: ", board);

}

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
