const boxes = document.querySelectorAll(".box"); //Selects all of the boxes
let gameTextDiv = document.getElementById("new-game-text");
let inRound = false; //initial status is not in a round

let playerOne = "Player One";
let playerTwo = "Player Two";
let playerOneMark = new URL(
  "./images/pinkAlienCharacter.png",
  window.location.href
).href; //mungfali.com
let playerTwoMark = new URL(
  "./images/greenAlienCharacter.png",
  window.location.href
).href; //i.pinimg.com
let currentPlayer = playerOne;
let moveCount = 0;
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

let startGame = document.getElementById("start-game");
let submitNamesButton = document.getElementById("submit-names");
let playerOneInput = document.getElementById("playerOneName");
let playerTwoInput = document.getElementById("playerTwoName");
const playComputerButton = document.getElementById("play-computer");

submitNamesButton.addEventListener("click", () => {
  playerOne = playerOneInput.value || "Player One"; //Default to "Player One" if input is empty
  playerTwo = playerTwoInput.value || "Player Two"; //Defalut to "Player Two" if input is empty
  gameTextDiv.innerHTML = `Names updated! Ready to play, ${playerOne} and ${playerTwo}?`;
});

let playComputer = false;
let difficulty = "easy"; //Default to easy

const difficultyModal = document.getElementById("difficulty-modal");
const easyModeButton = document.getElementById("easy-mode");
const hardModeButton = document.getElementById("hard-mode");
let board = Array(9).fill(""); //Initialize board with 9 spaces

playComputerButton.addEventListener("click", () => {
  playComputer = true;
  resetGame();
  difficultyModal.style.display = "flex"; //Reveals modal
});

easyModeButton.addEventListener("click", () => {
  difficulty = "easy";
  difficultyModal.style.display = "none"; //Hides modal
  startGameWithComputer();
});

hardModeButton.addEventListener("click", () => {
  difficulty = "hard";
  difficultyModal.style.display = "none"; //Hides modal
  startGameWithComputer();
});

function startGameWithComputer() {
  playComputer = true;
  resetGame();
  gameTextDiv.innerHTML = `${playerOne}, make your move against the ${difficulty} computer.`;
}

function computerMove() {
  if (difficulty === "easy") {
    makeEasyMove();
  } else {
    makeHardMove();
  }
}

function makeEasyMove() {
  const emptyBoxes = Array.from(boxes).filter((box) => box.innerHTML === "");
  if (emptyBoxes.length > 0 && inRound) {
    const randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    randomBox.innerHTML = `<img src="${playerTwoMark}" alt="Computer's Mark">`;

    moveCount++;
    checkWinner(playerTwoMark);

    if (inRound) {
      switchPlayer();
      gameTextDiv.innerHTML = `${playerOne}'s turn`;
    }

    if (moveCount === 9 && inRound) {
      gameTextDiv.innerHTML = "It's a tie!";
      inRound = false;
    }
  }
}

function minimax(board, player) {
  const emptyIndexes = board
    .map((val, index) => (val === "" ? index : null))
    .filter((index) => index !== null);

  //Check for winner or tie
  if (checkWinnerForMinimax(board, player)) return 10;
  if (checkWinnerForMinimax(
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
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = index;
        }
      }
    }
  }
  return bestMove;
}

function makeHardMove() {
  const bestMove = minimax(board, playerTwoMark);
  console.log("Best Move (Hard Mode):", bestMove); //Check if bestMove is valid

  if (bestMove != null) {
    boxes[
      bestMove
    ].innerHTML = `<img src="${playerTwoMark}" alt="Computer's mark">`;
    board[bestMove] = playerTwoMark; //Updating array

    moveCount++;

    if (checkWinner(playerTwoMark)) {
      gameTextDiv.innerHTML = `${playerTwo} wins!`;
      inRound = false;
    } else {
      switchPlayer();
    }
  }
}

startGame.addEventListener("click", () => {
  resetGame();
  playRound();
});

function initializeGame() {
  boxes.forEach((box) => {
    box.addEventListener("click", function handleBoxClick() {
      if (inRound && box.innerHTML === "") {
        box.innerHTML =
          currentPlayer === playerOne
            ? `<img src="${playerOneMark}" alt="Player One's mark">`
            : `<img src="${playerTwoMark}" alt="Player Two's mark">`;

        moveCount++;
        checkWinner(
          currentPlayer === playerOne ? playerOneMark : playerTwoMark
        );

        if (inRound) {
          switchPlayer();
          gameTextDiv.innerHTML = `${currentPlayer}'s turn`;
        }

        if (moveCount === 9 && inRound) {
          gameTextDiv.innerHTML = "It's a tie!";
          inRound = false;
        }
      }
    });
  });
}

function resetGame() {
  Array.from(boxes).forEach((box) => {
    box.innerHTML = "";
    box.classList.remove("winning-combination");
  });

  inRound = true;
  currentPlayer = playerOne;
  gameTextDiv.innerHTML = `Starting a new game. ${playerOne}, make your play.`;
  startGame.textContent = "Reset Game";
  moveCount = 0;
}

function switchPlayer() {
  currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;

  if (playComputer && currentPlayer === playerTwo) {
    setTimeout(computerMove, 1000); //Brief delay
  }
}

initializeGame();

function checkWinnerForMinimax(board, mark) {
  return winningCombinations.some((combination) => {
    return combination.every((index) => board[index] === mark);
  });
}

const isWinner = winningCombinations.some((combination) => {
  const isMatch = combination.every((index) => {
    const box = boxes[index];
    const img = box.querySelector("img"); //Selects image element within box
    return img && img.src === mark; //Checks if img exists, and its src matches the player's mark
  });

  if (isMatch) {
    combination.forEach((id) =>
      document.getElementById(id).classList.add("winning-combination")
    ); //Adding class for styling purposes

    gameTextDiv.innerHTML = `${
      mark === playerOneMark ? playerOne : playerTwo
    } is the winner!`;
    inRound = false;
    launchFireworks();
  }

  return isMatch;
});

function launchFireworks() {
  const duration = 2 * 1000; //Firework duration in milliseconds
  const end = Date.now() + duration;

  //Generate random fireworks over the duration
  const interval = setInterval(function () {
    if (Date.now() > end) {
      clearInterval(interval);
    }
    confetti({
      particleCount: 300,
      angle: Math.random() * 360,
      spread: 70,
      origin: {
        x: 0.5,
        y: Math.random() * 0.6, //Random Y to keep fireworks mostly above mid screen
      },
    });
  }, 200); //Interval between fireworks bursts

  setTimeout(() => {
    gameTextDiv.innerHTML = "Game Over!";
  }, duration);
}

// const ufoContainer = document.querySelector('.ufo-container');

// function createUFO() {
//   const ufo =  document.createElement('div');
//   ufo.classList.add('ufo');

// //Randomize starting position on Y axis
// const startY = Math.random() * window.innerHeight * 0.8; //Between 0 and 80% of the viewport height
// ufo.style.top = `${startY}px`;

// //Add animation with random speed
// const flyDuration = Math.random() * 3 + 5; //Between 5 and 8 seconds
// ufo.style.animation = `flyby ${flyDuration}s linear`;

// //Remove the UFO after animation completes
// ufo.addEventListener('animationend', () => {
//   ufoContainer.removeChild(ufo);
// });

// //Append UFO to the container
// ufoContainer.appendChild(ufo);
// }

// //Function to create UFOs at random intervals
// function startUFOFlybys() {
//   setTimeout(() => {
//    setInterval(createUFO, Math.random() * 2000 + 3000);
//   }, Math.random() * 2000);
// }

// startUFOFlybys();
