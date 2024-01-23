const grid = document.querySelector('.grid');
const timer = document.querySelector('.timer');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainBtn = document.querySelector('.play-again');

// Nested Array
const gridMatrix = [
  ['', '', '', '', 'falcon', '', '', '', ''], //finish line
  ['bridge','vader','bridge','vader','vader','bridge','vader','bridge','vader',], //vader line
  ['', '', '', '', '', '', '', '', ''], //empty line
  ['space', 'space', 'space', 'glass', 'glass', 'space', 'glass', 'glass', 'space'], //glass line
  ['space', 'glass', 'space', 'glass', 'glass', 'space', 'glass', 'space', 'glass'], //glass line
  ['', '', '', '', '', '', '', '', ''], //empty line
  ['floor', 'floor', 'floor', 'pipe', 'floor', 'floor', 'floor', 'floor', 'pipe'], //pipes obsticle line
  ['floor', 'floor', 'pipe', 'floor', 'floor', 'floor', 'pipe', 'floor', 'floor'], //pipes obsticle line
  ['', '', '', '', '', '', '', '', ''], //spawn line
];

// Initialise variables that control the game "settings"
const victoryCell = { x: 4, y: 0 };
const vaderRow = [1];
const glassRows = [3,4];
const pipeRows = [6,7];
const luckPosition = { x: 4, y: 8 };
let contentBeforeLuke = '';
let time = 15;

function drawGrid() {
  grid.innerHTML = '';

  // For each row in the gridMatrix, we need to process what is going to be drawn / displayed on the screen
  gridMatrix.forEach(function (gridRow, gridRowIndex) {
    gridRow.forEach(function (cellContent, cellContentIndex) {
      // Given the current grid row, create a cell for the grid in the game based on the cellContent
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');

      if (vaderRow.includes(gridRowIndex)) {
        cellDiv.classList.add('bridge');
      } else if (glassRows.includes(gridRowIndex)) {
        cellDiv.classList.add('space');
      } else if (pipeRows.includes(gridRowIndex)){
        cellDiv.classList.add('floor');
      }

      if (cellContent) {
        cellDiv.classList.add(cellContent);
      }

      grid.appendChild(cellDiv);
    });
  });
}

// -------------------
// Luke FUNCTIONS
// -------------------
function placeLuck() {
  contentBeforeLuck = gridMatrix[luckPosition.y][luckPosition.x];
  gridMatrix[luckPosition.y][luckPosition.x] = 'luck';
}

function moveLuck(event) {
  const key = event.key;
  console.log(key);
  gridMatrix[luckPosition.y][luckPosition.x] = contentBeforeLuck;
  // arrows and "WASD"
  switch (key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (luckPosition.y > 0) luckPosition.y--;
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (luckPosition.y < 8) luckkPosition.y++;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (luckPosition.x > 0) luckPosition.x--;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (luckPosition.x < 8) luckPosition.x++;
      break;
  }

  render();
}

function updateLuckPosition() {
  gridMatrix[luckPosition.y][luckPosition.x] = contentBeforeLuck;

  if (contentBeforeLuck === 'glass') {
    if (luckPosition.y === 1 && luckPosition.x < 8) luckPosition.x++;
    else if (luckPosition.y === 2 && luckPosition.x > 0) luckPosition.x--;
  }
}

function checkPosition() {
  if (luckPosition === victoryCell) endGame('luck-arrived');
  else if (contentBeforeLuck === 'vader') endGame('luck-died');
  else if(contentBeforeLuke === 'space') endGame('luck-drifted');
  else if (contentBeforeLuck === 'pipe' || contentBeforeDuck === 'pipe1')
    endGame('duck-hit');
}

// -------------------
// GAME ANIMATION
// -------------------
function moveRight(gridRowIndex) {
  // Get all of the cells in the current row
  const currentRow = gridMatrix[gridRowIndex];

  // Remove the last element...
  const lastElement = currentRow.pop();

  // And put it back to the beginning, i.e. index 0
  currentRow.unshift(lastElement);
}

function moveLeft(gridRowIndex) {
  const currentRow = gridMatrix[gridRowIndex];
  const firstElement = currentRow.shift();
  currentRow.push(firstElement);
}

function animateGame() {
  // Animate vader:
  moveRight(1);

  //Animate glass:
  moveLeft(3);
  moveRight(4);

  // Animate pipe:
  moveRight(6);
  moveRight(7);
}

// -------------------
// GAME WIN/LOSS LOGIC
// -------------------
function endGame(reason) {
  // Victory
  if (reason === 'luck-arrived') {
    endGameText.innerHTML = 'YOU<br>WIN!';
    endGameScreen.classList.add('win');
  }

  gridMatrix[luckPosition.y][luckPosition.x] = reason;

  // Stop the countdown timer
  clearInterval(countdownLoop);
  // Stop the game loop
  clearInterval(renderLoop);
  // Stop the player from being able to control the duck
  document.removeEventListener('keyup', moveLuck);
  // Display the game over screen
  endGameScreen.classList.remove('hidden');
}

function countdown() {
  if (time !== 0) {
    time--;
    timer.innerText = time.toString().padStart(5, '0');
  }

  if (time === 0) {
    // end the game -- player has lost!
    endGame();
  }
}

// RUNNING THE GAME

function render() {
  placeLuck();
  checkPosition();
  drawGrid();
}

// anonymous function
const renderLoop = setInterval(function () {
  updateLuckPosition();
  animateGame();
  render();
}, 600);

const countdownLoop = setInterval(countdown, 1000);

document.addEventListener('keyup', moveLuck);
playAgainBtn.addEventListener('click', function () {
  location.reload();
});