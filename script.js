const boxes = document.querySelectorAll(".box"); //Selects all of the boxes
let gameTextDiv = document.getElementById("new-game-text");
let inRound = false; //initial status is not in a round

let playerOne = "Player One";
let playerTwo = "Player Two";
let playerOneMark = new URL("./images/pinkAlienCharacter.png", window.location.href).href; //mungfali.com
let playerTwoMark = new URL("./images/greenAlienCharacter.png", window.location.href).href; //i.pinimg.com
let currentPlayer = playerOne;
let moveCount = 0;

let startGame = document.getElementById("start-game");

startGame.addEventListener("click", () => {
  resetGame();
  playRound();
});

function initializeGame() {
  boxes.forEach((box) => {
    box.addEventListener("click", function handleBoxClick() {
      if (inRound && box.innerHTML === "") {
        box.innerHTML = currentPlayer === playerOne
        ? `<img src="${playerOneMark}" alt="Player One's mark">`
        : `<img src="${playerTwoMark}" alt="Player Two's mark">`;


        moveCount++;
        checkWinner(currentPlayer === playerOne ? playerOneMark : playerTwoMark);

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
  gameTextDiv.innerHTML = "Starting a new game. Player One, make your play.";
  startGame.textContent = "Reset Game";
  moveCount = 0;
}

function switchPlayer() {
  currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
}

initializeGame();

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

  const isWinner = winningCombinations.some((combination) => {
    const isMatch = combination.every((id) => {
      const box = document.getElementById(id);
      const img = box.querySelector("img"); //Selects image element within box
      return img && img.src === mark; //Checks if img exists, and its src matches the player's mark
    });

    if (isMatch) {
      combination.forEach((id) =>
        document.getElementById(id).classList.add("winning-combination")
      ); //Adding class for styling purposes

    gameTextDiv.innerHTML = `${mark === playerOneMark ? playerOne : playerTwo} is the winner!`;
    inRound = false;
    launchFireworks();
    }

    return isMatch;
  });
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



