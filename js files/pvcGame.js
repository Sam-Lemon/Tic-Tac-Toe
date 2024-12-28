/// CONSTANTS & VARIABLES ///

let playerComputer = "Computer";
let playerComputerMark = "O";

/// EVENT LISTENERS ///

// Play vs computer
playComputerButton.addEventListener("click", () => {
  playComputer = true;

  playerOne = "Player One";

  gameModeModal.style.display = "none";
  difficultyModal.style.display = "flex";
});

// Set difficulty to easy
easyModeButton.addEventListener("click", () => {
  difficulty = "easy";
  difficultyModal.style.display = "none";
  log("Player vs Computer - Easy Mode");
  startGameWithComputer();
});

// Set difficulty to hard
hardModeButton.addEventListener("click", () => {
  difficulty = "hard";
  difficultyModal.style.display = "none";
  log("Player vs Computer - Hard Mode");
  startGameWithComputer();
});

/// GAME FUNCTIONS ///

// Start game with computer
function startGameWithComputer() {
  boxes.forEach((box) => {
    box.addEventListener("click", handlePVCBoxClick);
  });

  inRound = true;
  currentPlayer = playerOne;

  if (playComputer) {
    playerTwo = playerComputer;
  }

  // Start the game based on selected difficulty
  if (difficulty === "easy") {
    currentMoveFunction = easyComputerMove;
  } else if (difficulty === "hard") {
    currentMoveFunction = hardComputerMove;
  }
  updateGameText(`${playerOne}'s turn`);
}

// PVC game function
function handlePVCBoxClick(event) {
  const clickedBox = event.target;
  const index = Array.from(boxes).indexOf(clickedBox);

  if (inRound && board[index] === "") {
    const currentMark =
      currentPlayer === playerOne ? playerOneMark : playerComputerMark;

    // Place the mark on the board
    board[index] = currentMark;
    renderMark(index, currentMark);

    moveCount++;
    log("Move count:", moveCount);

    if (checkWinner(currentMark)) {
      gameTextDiv.innerHTML = `${currentPlayer} wins!`;
      inRound = false;
      highlightWinner(currentMark);
      launchFireworks();
    } else if (moveCount === NUM_CELLS) {
      gameTextDiv.innerHTML = "It's a tie!";
      inRound = false;
    } else {
      switchPlayer();
      updateGameText(`${currentPlayer}'s turn`);
      log("Current player: ", currentPlayer);
    }
  }

  if (currentPlayer === playerComputer) {
    updateGameText(`${playerComputer} is thinking...`, true);

    setTimeout(() => {
      if (difficulty === "easy") {
        easyComputerMove();
      } else if (difficulty === "hard") {
        hardComputerMove();
      }
    }, 2000);
  }
}

// The computer's easy move
function easyComputerMove() {
  const emptyCells = board
    .map((value, index) => (value === "" ? index : null))
    .filter((index) => index !== null);

  if (emptyCells.length === 0) {
    console.log("No empty cells available for the computer to make a move.");
    return;
  }

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  board[randomIndex] = playerComputerMark;
  renderMark(randomIndex, playerComputerMark);
  boxes[randomIndex].removeEventListener("click", handlePVCBoxClick);
  switchPlayer();
  updateGameText(currentPlayer + "'s turn.");
}

// The computer's hard move
function hardComputerMove() {
  if (!playComputer) return;
  log("Computer's move in hard mode");

  const bestMove = getBestMove([...board], playerComputerMark);

  if (bestMove !== null && board[bestMove] === "") {
    board[bestMove] = playerComputerMark;

    renderMark(bestMove, playerComputerMark);

    boxes[bestMove].removeEventListener("click", handlePVCBoxClick);

    if (checkWinnerForMinimax([...board], playerComputerMark)) {
      log("AI wins!");
      updateGameText("Computer wins!");
      highlightWinner();
      return;
    }

    if (board.every((cell) => cell !== "")) {
      log("It's a tie!");
      updateGameText("It's a tie!");
      return;
    }

    switchPlayer();
    updateGameText(`${currentPlayer}'s turn.`);
  } else {
    log("Invalid move by computer or corrupted board state");
  }
}

// Minimax algorithm for the computer's hard move
function minimax(board, depth, isMaximizing, maxDepth = 4) {
  log("Current board state: ", board);

  if (depth === maxDepth) {
    return evaluateBoard(board, isMaximizing);
  }

  if (checkWinnerForMinimax(board, playerComputerMark)) {
    return 10 - depth;
  }
  if (checkWinnerForMinimax(board, playerOneMark)) {
    return depth - 10;
  }
  if (board.every((cell) => cell !== "")) {
    log("Tie detected");
    return 0;
  }

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = isMaximizing ? playerComputerMark : playerOneMark;

      const score = minimax(board, depth + 1, !isMaximizing, maxDepth);
      board[i] = "";

      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }
  }

  return bestScore;
}

function evaluateBoard(board, isMaximizing) {
  console.log("Evaluating board heuristically");
  return 0;
}

// Checking winner for minimax
function checkWinnerForMinimax(board, mark) {
  if (!Array.isArray(board) || board.length !== NUM_CELLS) {
    log("Invalid board detected!");
    return false;
  }

  return winningCombinations.some((combination) => {
    const result = combination.every((index) => board[index] === mark);
    return result;
  });
}

// Finding the best move
function getBestMove(board, playerComputerMark) {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = playerComputerMark;

      const score = minimax(board, 0, false);

      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }

      if (score === 10) {
        log("Immediate winning move found, returning early!");
        return i;
      }
    }
  }
  return move;
}
