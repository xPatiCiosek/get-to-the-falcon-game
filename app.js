const grid = document.querySelector('.grid');
const timer = document.querySelector('.timer');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainBtn = document.querySelector('.play-again');
const scene= document.querySelector('.end-game-scene');


// Nested Array
const gridMatrix = [
  ['', '', '', '', 'falcon', '', '', '', ''],
  ['bridge','vader','bridge','bridge','vader','bridge','vader','bridge','vader',],
  ['', '', '', '', '', '', '', '', ''],
  ['space', 'space', 'space', 'glass', 'glass', 'space', 'glass', 'glass', 'space'],
  ['space', 'glass', 'space', 'glass', 'glass', 'space', 'glass', 'space', 'glass'],
  ['', '', '', '', '', '', '', '', ''],
  ['sword', 'floor', 'floor', 'sword', 'floor', 'floor', 'floor', 'floor', 'sword'], 
  ['floor', 'floor', 'sword', 'floor', 'floor', 'floor', 'sword', 'floor', 'floor'], 
  ['', '', '', '', '', '', '', '', ''],
];

// Initialise variables that control the game "settings"
const vaderRow = [1];
const glassRows = [3,4];
const swordRows = [6,7];
const lukePosition = { x: 4, y: 8 };
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
      } else if (swordRows.includes(gridRowIndex)){
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
// Luke's FUNCTIONS
// -------------------
function placeLuke() {
  contentBeforeLuke = gridMatrix[lukePosition.y][lukePosition.x];
  gridMatrix[lukePosition.y][lukePosition.x] = 'luke';
}

function moveLuke(event) {
  const key = event.key;
  console.log(key);
  gridMatrix[lukePosition.y][lukePosition.x] = contentBeforeLuke;
  // arrows and "WASD"
  switch (key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (lukePosition.y > 0) lukePosition.y--;
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (lukePosition.y < 8) lukePosition.y++;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (lukePosition.x > 0) lukePosition.x--;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (lukePosition.x < 8) lukePosition.x++;
      break;
  }

  render();
}

function updateLukePosition() {
  gridMatrix[lukePosition.y][lukePosition.x] = contentBeforeLuke;

  if (contentBeforeLuke === 'glass') {
    if (lukePosition.y === 3 && lukePosition.x >0) lukePosition.x--;
    else if (lukePosition.y === 4 && lukePosition.x <8) lukePosition.x++;
  }
}

function checkPosition() {
  if (contentBeforeLuke === 'falcon') { endGame('luke-arrived'); 
  scene.classList.add('falcon-scene');}
  else if (contentBeforeLuke === 'vader') { endGame('luke-died'); 
  scene.classList.add('vader-scene');}
  else if(contentBeforeLuke === 'space') endGame('luke-drifted'); //going through the window scene
  else if (contentBeforeLuke === 'sword') endGame('luke-hit'); //lose a hand scene? change order of the obsticles 
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

  // Animate sword:
  moveLeft(6);
  moveRight(7);
}

// -------------------
// GAME WIN/LOSS LOGIC
// -------------------
function endGame(reason) {
  // Victory
  if (reason === 'luke-arrived') {
    endGameText.innerHTML = 'YOU<br>WIN!';
    endGameScreen.classList.add('win');
  }

  gridMatrix[lukePosition.y][lukePosition.x] = reason;

  // Stop the countdown timer
  clearInterval(countdownLoop);
  // Stop the game loop
  clearInterval(renderLoop);
  // Stop the player from being able to control the duck
  document.removeEventListener('keyup', moveLuke);
  // Display the game over screen
  setTimeout(()=>{
    scene.classList.remove('hidden'); 
   },1000)
  setTimeout(()=>{
    endGameScreen.classList.remove('hidden'); 
   },3500)
  
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
  placeLuke();
  checkPosition();
  drawGrid();
}

// anonymous function
const renderLoop = setInterval(function () {
  updateLukePosition();
  animateGame();
  render();
}, 600);

const countdownLoop = setInterval(countdown, 1000);

document.addEventListener('keyup', moveLuke);
playAgainBtn.addEventListener('click', function () {
  location.reload();
});
