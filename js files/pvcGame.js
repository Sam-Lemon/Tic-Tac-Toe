/// CONSTANTS & VARIABLES ///

let playerComputer = "Computer";
let playerComputerMark = "X";

/// EVENT LISTENERS ///

// Play vs computer
playComputerButton.addEventListener("click", () => {
  playComputer = true;
  console.log("playComputer: ", playComputer);

  playerOne = DEFAULT_PLAYER_NAMES[0];

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

  // Start the game based on selected difficulty
  if (difficulty === "easy") {
    console.log("Starting game in Easy mode.");

    currentMoveFunction = easyComputerMove; // Start the first move with easy mode
  } else if (difficulty === "hard") {
    console.log("Starting game in Hard mode.");

    currentMoveFunction = hardComputerMove; // Start the first move with hard mode
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
    clickedBox.innerHTML = `<img src="${currentMark}" alt="${currentPlayer}'s mark">`;

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
      console.log("Before switching player - PvC game");
      switchPlayerPVC(); // Switches to the other player
      updateGameText(`${currentPlayer}'s turn`);
      console.log("End of turn. Player switched, current player: ", currentPlayer);

    }
  }

  if (playComputer && currentPlayer === playerTwo && inRound) {
    console.log("Computer's turn after player");
    setTimeout(() => {
      console.log("setTimeout triggered, making computer move");
      currentMoveFunction();
    }, 1000);
  }
}

// Switch player turns
function switchPlayerPVC() {
  console.log("Switching player from current player: ", currentPlayer); // Check current player
  currentPlayer = currentPlayer === playerOne ? playerComputer : playerOne;
  console.log("New currentPlayer:", currentPlayer); // currentPlayer after the switch
}

// The computer's easy move
function easyComputerMove() {
  console.log("Computer's Move in an easy game");

  const emptyCells = board
    .map((value, index) => (value === "" ? index : null))
    .filter((index) => index !== null);

  if (emptyCells.length > 0) {
    const randomIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    boxes[randomIndex].click();
  } else {
    console.error(
      "No empty cells found which shouldn't happen in a valid game."
    );
  }
  // console.log("End of turn. Player switched, current player: ", currentPlayer);

}

// The computer's hard move
function hardComputerMove() {
  console.log("Computer's move in hard mode");
  const bestMove = getBestMove(board, playerTwoMark);

  if (bestMove !== null) {
    board[bestMove] = playerTwoMark;
    console.log(`Placing computer mark at index ${bestMove}`);
    console.log(`AI mark: ${playerTwoMark}`);
    boxes[bestMove].innerHTML = `<img src="${playerTwoMark}" alt="AI's mark">`;
    boxes[bestMove].removeEventListener("click", handleComputerBoxClick);

    console.log(`Best move for AI is at index ${bestMove}`);
    console.log("Updated board after AI move: ", board);

    if (checkWinnerForMinimax(board, playerTwoMark)) {
      console.log("AI wins!");
      updateGameText("Computer wins!");
      resetGame();
      return;
    }

    // currentPlayer = playerOne;
    // switchPlayer();
    // console.log("Player switched");
    // console.log("inRound: ", inRound, "move");

    // console.log("End of turn. Player switched, current player: ", currentPlayer);

  }
}

// Minimax algorithm for the computer's hard move
function minimax(board, depth, isMaximizing) {
  if (depth > 20) {
    // Arbitrary failsafe depth
    console.error("Failsafe triggered: Depth exceeded limit");
    return 0;
  }

  if (checkWinnerForMinimax(board, playerTwoMark)) {
    console.log(`AI wins detected at depth ${depth}`);
    return 10 - depth; // Human player wins
  }
  if (checkWinnerForMinimax(board, playerOneMark)) {
    console.log(`Player wins detected at depth ${depth}`);
    return depth - 10; // AI wins
  }
  if (board.every((cell) => cell !== "")) {
    console.log("Tie detected");
    return 0; // Tie
  }

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = isMaximizing ? playerTwoMark : playerOneMark;
      const score = minimax(board, depth + 1, !isMaximizing);
      board[i] = "";

      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }
  }
  return bestScore;
}

function checkWinnerForMinimax(board, mark) {
  console.log(
    "checkWinnerForMinimax called with board: ",
    board,
    "and mark: ",
    mark
  );

  if (!Array.isArray(board) || board.length !== NUM_CELLS) {
    console.log("Invalid board detected!");
    return false; // Prevent unnecessary recursion
  }

  return winningCombinations.some((combination) => {
    const result = combination.every((index) => {
      const cell = board[index];
      console.log(`Checking cell ${index}: ${cell} === ${mark}`);
      return cell === mark;
    });
    console.log(`Combination ${combination} result: `, result);
    return result;
  });
}

// Finding the best move
function getBestMove(board, aiMark) {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = aiMark; // AI makes a move
      const score = minimax(board, 0, false); // Evaluate the move's score
      board[i] = ""; // Undo the move

      console.log(`Move at index ${i} has score ${score}`);

      if (score > bestScore) {
        bestScore = score;
        move = i; // Storing the index of the best move
      }
    }
  }
  return move;
}
