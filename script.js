const boxes = document.querySelectorAll(".box"); //Selects all of the boxes
let gameTextDiv = document.getElementById("new-game-text");
let inRound = false; //initial status is not in a round

let playerOne = "Player One";
let playerTwo = "Player Two";
let playerOneMark = "X";
let playerTwoMark = "O";
// let playerOneMark = "./images/pinkAlienCharacter.png"; //mungfali.com
// let playerTwoMark = "./images/greenAlienCharacter.png"; //i.pinimg.com
let currentPlayer = playerOne;
let moveCount = 0;

let startGame = document.getElementById("start-game");

startGame.addEventListener("click", () => {
  Array.from(boxes).forEach((box) => {
    box.innerHTML = ""; //Clears each box
    box.classList.remove("winning-combination"); //Removes the win styling
  });

  inRound = true; //Starts a new game
  currentPlayer = playerOne; //making the first player playerOne
  gameTextDiv.innerHTML =
    "Starting a new game. Player One, make your first play.";
    moveCount = 0;
  playRound();
});

console.log("The current player is: " + currentPlayer);

function switchPlayer() {
  currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
}

// switchPlayer()
// console.log("After switching, the current player is: " + currentPlayer);

function playRound() {
  Array.from(boxes).forEach((box) => {
    box.addEventListener(
      "click",
      function handleBoxClick() {
        if (inRound && box.innerHTML === "") {
          box.innerHTML =
            currentPlayer === playerOne ? playerOneMark : playerTwoMark;
            moveCount++; //Increments move count with each click
            // currentPlayer === playerOne ? `<img src="${playerOneMark}" alt="Player One" />` : `<img src="${playerTwoMark}" alt="Player Two" />`;
          checkWinner(
            currentPlayer === playerOne ? playerOneMark : playerTwoMark
          );

          if (inRound) {
            gameTextDiv.innerHTML = `${currentPlayer}'s turn is over. ${
              currentPlayer === playerOne ? playerTwo : playerOne
            }, make your play.`;

            switchPlayer(); //Switches to next player after each click
          }

          if (moveCount === 9 && inRound) {
            gameTextDiv.innerHTML = "It's a draw! Press 'Start Game' to restart game.";
            inRound = false;
          }
        }
      },
      { once: true }
    ); //Each box only gets clicked once per game
  });
}

function checkWinner(mark) {
  const winningCombinations = [
    ["a", "b", "c"], //first row
    ["d", "e", "f"], //second row
    ["g", "h", "i"], //third row
    ["a", "d", "g"], //first column
    ["b", "e", "h"], //second column
    ["c", "f", "i"], //third column
    ["a", "e", "i"], //left to right diagonal
    ["c", "e", "g"], //right to left diagonal
  ];

 const isWinner = winningCombinations.some(combination => {
    const isMatch = combination.every(id => document.getElementById(id).innerHTML === mark);
    if (isMatch) {
        combination.forEach(id => document.getElementById(id).classList.add('winning-combination')); //Adding class for styling purposes
    }
    return isMatch;
 });

 if (isWinner) {
    gameTextDiv.innerHTML = `${mark === "X" ? playerOne : playerTwo} is the winner!`;
    inRound = false; //Stops the game if there's a winner
    launchFireworks();
 }
}

function launchFireworks() {
  const duration = 2 * 1000; //Firework duration in milliseconds
  const end = Date.now() + duration;

  //Generate random fireworks over the duration
  const interval = setInterval(function() {
    if (Date.now() > end) {
      clearInterval(interval);
    }
    confetti({
      particleCount: 300,
      angle: Math.random() * 360,
      spread: 70,
      origin: {
        x: 0.5,
        y: Math.random() * 0.6 //Random Y to keep fireworks mostly above mid screen
      }
    });
  }, 200) //Interval between fireworks bursts

  setTimeout(() => {
    gameTextDiv.innerHTML = "Game Over! Click 'Start Game' to play again.";
  }, duration);
}

