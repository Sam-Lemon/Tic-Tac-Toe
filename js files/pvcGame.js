/// CONSTANTS & VARIABLES ///

let playerComputer = "Computer";
let playerComputerMark = "O";

/// EVENT LISTENERS ///

// Play vs computer
playComputerButton.addEventListener("click", () => {
  playComputer = true;
  console.log("playComputer set to true at: ", new Date());

  playerOne = "Player One";

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
});

/// GAME FUNCTIONS ///

// Start game with computer
function startGameWithComputer() {
  // Enable the board and assign the correct player marks
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
    // console.log("Starting game in Easy mode.");
    currentMoveFunction = easyComputerMove; // Start the first move with easy mode
  } else if (difficulty === "hard") {
    console.log("Starting game in Hard mode.");
    currentMoveFunction = hardComputerMove; // Start the first move with hard mode
  }
  updateGameText(`${playerOne}'s turn`);
}

// PVC game function
function handlePVCBoxClick(event) {
  // console.log("handlePVCBoxClick called");

  const clickedBox = event.target;
  const index = Array.from(boxes).indexOf(clickedBox);
  console.log("Clicked box index: ", index);

  if (inRound && board[index] === "") {
    const currentMark =
      currentPlayer === playerOne ? playerOneMark : playerComputerMark;

    // Place the mark on the board
    board[index] = currentMark;
    renderMark(index, currentMark);

    console.log("Board after marking: ", board);

    moveCount++;
    console.log("Move count:", moveCount);

    if (checkWinner(currentMark)) {
      gameTextDiv.innerHTML = `${currentPlayer} wins!`;
      inRound = false;
      highlightWinner(currentMark);
      launchFireworks()
    } else if (moveCount === NUM_CELLS) {
      gameTextDiv.innerHTML = "It's a tie!";
      inRound = false;
    } else {
      console.log("Before switching player - PvC game");
      switchPlayer(); // Switches to the other player
      updateGameText(`${currentPlayer}'s turn`);
      console.log("Current player: ", currentPlayer);
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
  // console.log("Computer's Move in an easy game");

  const emptyCells = board
    .map((value, index) => (value === "" ? index : null))
    .filter((index) => index !== null);

  if (emptyCells.length > 0) {
    const randomIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[randomIndex] = playerComputerMark;

    renderMark(randomIndex, playerComputerMark);

    boxes[randomIndex].removeEventListener("click", handlePVCBoxClick);
    switchPlayer();

    // console.log(`AI mark placed at index ${randomIndex}`);
    // console.log("Updated board after AI's move: ", board);

    // console.log("End of turn. Player switched, current player: ", currentPlayer);
  }
}

// The computer's hard move
function hardComputerMove() {
  // console.log("Player computer mark in hard mode: ", playerComputerMark);

  if (!playComputer) return; // only running in PvC mode
  console.log("Computer's move in hard mode");

  const bestMove = getBestMove([...board], playerComputerMark);

  if (bestMove !== null && board[bestMove] === "") {
    console.log(`Placing computer mark at index ${bestMove}`);
    board[bestMove] = playerComputerMark;

    console.log(
      `Calling renderMark with bestMove: ${bestMove}, mark: ${playerComputerMark}`
    );

    console.log("Before rendering mark: ", bestMove, playerComputerMark);
    renderMark(bestMove, playerComputerMark);
    console.log("After rendering mark>");

    boxes[bestMove].removeEventListener("click", handlePVCBoxClick);

    console.log(`AI mark placed at index ${bestMove}`);
    console.log("Updated board after AI's move: ", board);

    if (checkWinnerForMinimax([...board], playerComputerMark)) {
      console.log("AI wins!");
      updateGameText("Computer wins!");
      launchFireworks();
      resetGame();
      return;
    }

    if (board.every((cell) => cell !== "")) {
      console.log("It's a tie!");
      updateGameText("It's a tie!");
      resetGame();
      return;
    }

    console.log("Switching to player's turn");
    switchPlayer();
    updateGameText(`${currentPlayer}'s turn.`);
  } else {
    console.log("Invalid move by computer or corrupted board state");
  }
}

// Minimax algorithm for the computer's hard move
function minimax(board, depth, isMaximizing, maxDepth = 4) {
  console.log(
    `Minimax called at depth ${depth}, isMaximizing: ${isMaximizing}`
  );
  console.log("Current board state: ", board);

  if (depth === maxDepth) {
    console.log(`Depth limit reached at depth ${depth}`);
    return evaluateBoard(board, isMaximizing);
  }

  // Bad cases
  if (checkWinnerForMinimax(board, playerComputerMark)) {
    console.log(`AI wins detected at depth ${depth}`);
    return 10 - depth;
  }
  if (checkWinnerForMinimax(board, playerOneMark)) {
    console.log(`Player wins detected at depth ${depth}`);
    return depth - 10;
  }
  if (board.every((cell) => cell !== "")) {
    console.log("Tie detected");
    return 0;
  }

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = isMaximizing ? playerComputerMark : playerOneMark;
      console.log(
        `Simulating move at index ${i} for ${isMaximizing ? "AI" : "Player"}`
      );

      const score = minimax(board, depth + 1, !isMaximizing, maxDepth);
      board[i] = "";
      console.log(`Backtracking from index ${i}, resetting the board`);

      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }
  }

  return bestScore;
}

function evaluateBoard (board, isMaximizing) {
  console.log("Evaluating board heuristically");
  return 0;
}


// Checking winner for minimax
function checkWinnerForMinimax(board, mark) {
  console.log(
    "checkWinnerForMinimax called with board: ",
    JSON.stringify(board),
    "and mark: ",
    mark
  );

  if (!Array.isArray(board) || board.length !== NUM_CELLS) {
    console.log("Invalid board detected!");
    return false; // Prevent unnecessary recursion
  }

  return winningCombinations.some((combination) => {
    const result = combination.every((index) => 
      board[index] === mark);
      console.log(`Checking combination ${JSON.stringify(combination)} result:`, result);
      return result;
    });

  };

// Finding the best move
function getBestMove(board, playerComputerMark) {
  console.log("Called getBestMove");
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = playerComputerMark; // AI makes a move
      console.log(`Simulating move at index ${i} for AI`);

      const score = minimax(board, 0, false); // Evaluate the move's score

      board[i] = ""; // Undo the move
      console.log(`Backtracked from index ${i}, board reset`);
      console.log(`Move at index ${i} has score ${score}`);

      if (score > bestScore) {
        bestScore = score;
        move = i; // Storing the index of the best move
        console.log(`New best move found at index${i} with score ${score}`);
      }

      if (score === 10) {
        console.log("Immediate winning move found, returning early!");
        return i;
      }
    }
  }
  return move;
}
