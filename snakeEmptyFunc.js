let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
let grid = 16;
let snake = {
  x: 160,
  y: 160,
  dx: grid, //dx is the horizontal direction the snake is moving. Negative moves left, positive moves right
  dy: 0, //dy is the vertical direction the snake is moving. Negative moves up, positive moves down.
  cells: [],
  maxCells: 4
};
let count = 0;
let apple = {
  x: 320,
  y: 320
};
let keyMap = {
	"ArrowLeft": {dx : -grid, dy: 0}, //left arrow
	"ArrowUp": {dx : 0, dy : -grid}, //up arrow
	"ArrowRight": {dx : grid, dy : 0}, //right arrow
	"ArrowDown": {dx : 0, dy : grid}	//down arrow
}
let img = new Image();
img.height = grid;
img.width = grid;
img.src = "apple.svg";
let score = 0;
let directionQueue = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max-min)) + min;
}

function resetGame(){
  snake.x = 160;
  snake.y = 160;
  snake.dx = grid;
  snake.dy = 0; 
  snake.cells = [];
  snake.maxCells = 4;
  apple.x = 320;
  apple.y = 320;
  count = 0;
  score = 0;
  directionQueue = [];
  
}


function handleArrowKey(e){
    console.log("key pressed:", e.key);

    if (snake.canSwitchDirection(e.key)){
    /*   snake.dx = keyMap[e.key].dx; //Same as keyMap["ArrowLeft"].dx - when using brackets, it is called Bracket Notation
      snake.dy = keyMap[e.key].dy; */
      directionQueue.push(keyMap[e.key]);}
    
}

function handleWallHit() {
 if (snake.x >= canvas.width || snake.x < 0 || snake.y >= canvas.width || snake.y < 0)
 {
    resetGame();
 }
}

snake.canSwitchDirection = function(key) {
  if (
    ((key === "ArrowUp" || key === "ArrowDown") && snake.dy === 0) ||
    ((key === "ArrowLeft" || key === "ArrowRight") && snake.dx === 0 )
   )
  {
        return true;

  }
       
  return false;
     
}

snake.move = function() {
//dx and dy can be -16, 0 or +16
    snake.x = snake.x + snake.dx;
    snake.y = snake.y + snake.dy;
    snake.cells.unshift({x:snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells){
       snake.cells.pop();
    }
}

snake.handleDirectionChange = function() {
  let directionObj = directionQueue.shift();
  snake.dx = directionObj.dx;
  snake.dy = directionObj.dy;
}

snake.draw = function() {
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    context.beginPath();
    context.arc(cell.x + grid/2, cell.y + grid/2, grid/2,0,2*Math.PI);
    context.fill();
    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      score++;
      snake.maxCells++;
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
    // check collision with all cells after this one (modified bubble sort)
    for (let i = index + 1; i < snake.cells.length; i++) {
      // collision. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        resetGame();
      }
    }
  });
}

// game loop
function loop() {
  requestAnimationFrame(loop);
  // slow game loop to 15 fps instead of 60 - 60/15 = 4
  if (++count < 10) {
    return;
  }
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);
  if (directionQueue.length){
    snake.handleDirectionChange();
  }

  snake.move();
  handleWallHit();

  // draw apple
  context.drawImage(img, apple.x, apple.y, grid, grid);
  
  snake.draw();
 
  context.font="20px Arial"
  context.fillStyle = 'white';
  context.fillText(score, 30, 30);
}

document.addEventListener('keydown', function(e) {
	handleArrowKey(e);
});

requestAnimationFrame(loop);