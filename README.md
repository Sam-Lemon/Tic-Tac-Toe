# Tic-Tac-UFO

    Tic-Tac-UFO is a modern, visually engaging twist on the classic Tic-Tac-Toe game. 
    Featuring alien-themed visuals, dynamic animations, and customizable game play, 
    this project allows users to play against friends or the computer with varying 
    levels of difficulty.

---

## Features
- **Game Modes:**
    - Player vs. Player (PvP)
    - Player vs. Computer (PvC) with Easy and Hard difficulty settings
    
- **Customizable Player Names:**<br>
    Players can input their names for a personalized experience. Player names only persist for a singular game, and can be reset to defaults after submitting.

- **Animated Visuals:**<br>
    Includes alien-themed marks and fireworks to celebrate wins.

- **Responsive Design:**<br>
    Optimized for desktop and mobile devices.

---

## Screen Shots

<img src="./images/TicTacUFO.png" alt="Front page of game" width="75%" height="auto">

<img src="./images/ChooseNameTicTacUFO.png" alt="Choose name screen" width="75%" height="auto">

<img src="./images/GamePlayTicTacUFO.png" alt="Game play" width="75%" height="auto">


---

## Technologies Used
- **HTML5** for structuring the web interface
- **CSS3** for styling and animations
- **JavaScript** for game logic and interactivity
- **Bootstrap** for layout and responsive design
- **Google Fonts** for custom typography
- **Canvas Confetti library** for celebratory effects

---

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/Sam-Lemon/Tic-Tac-Toe.git
    cd tic-tac-toe
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Open ```index.html``` in your web browser to start the game.

---

## How to Play
1. Click **New Game** to start.
2. Choose a game mode:
    - PvP: Play against a friend.
        - (Optional) Enter player names or proceed with default names
    - PvC: Play against the computer
        - Select the difficulty: Easy or Hard
3. Click on the board cells to place your marks and try to win by aligning three marks in a row, column, or diagonal.

---

## Project Structure
```
tic-tac-ufo/
├── index.html        # Main HTML file
├── style.css         # Stylesheet for the game
├── js/               # JavaScript files
│   ├── common.js     # Shared game logic
│   ├── pvpGame.js    # PvP mode logic
│   ├── pvcGame.js    # PVC mode logic
├── images/           # Alien mark images
└── node_modules/     # Bootstrap and dependencies
```

---

## Future Enhancements
- Adding a leaderboard to track player scores
- Adding sound effects for game events
- Adding options to choose player marks

---

## Contribution
Contributions are welcome! Please fork this repository and create a pull request with your proposed changes.

---

## Author
Sam Lemon <br>
[GitHub Profile](https://github.com/Sam-Lemon)







