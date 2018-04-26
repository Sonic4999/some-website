var score = 0;

var draw = function(snakeToDraw, apple, snake2ToDraw) {
  var drawableSnake = { color: "green", pixels: snakeToDraw };
  var drawableApple = { color: "red", pixels: [apple] };
  var drawableSnake2 = { color: "blue", pixels: snake2ToDraw };
  var drawableObjects = [drawableSnake, drawableApple, drawableSnake2];
  CHUNK.draw(drawableObjects);
}

var moveSegment = function(segment) {
  switch(segment.direction) {
    case "down":
      return { top: segment.top + 1, left: segment.left };
    case "up":
      return { top: segment.top - 1, left: segment.left };
    case "right":
      return { top: segment.top, left: segment.left + 1 }
    case "left":
      return { top: segment.top, left: segment.left - 1 }
    default:
      return segment;
  }
}

var segmentFurtherForwardThan = function(index, snake) {
  if (snake[index - 1] === undefined) {
    return snake[index];
  } else {
    return snake[index - 1];
  }
}

var moveSnake = function(snake) {
  return snake.map(function(oldSegment, segmentIndex) {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
    return newSegment;
  });
}

var growSnake = function(snake) {
  var indexOfLastSegment = snake.length - 1;
  var lastSegment = snake[indexOfLastSegment];
  snake.push({ top: lastSegment.top, left: lastSegment.left });
  return snake;
}

var ate = function(snake, otherThing) {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 13) {
        location.reload();
    }
};

var advanceGame = function() {
  var newSnake = moveSnake(snake);
  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself! Press enter to restart.");
  }
  if (ate(newSnake, [apple])) {
    score = score + 1;
    document.getElementById("button").innerText = 'Score: ' + score;
    newSnake = growSnake(newSnake);
    apple = CHUNK.randomLocation();
  }
  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You hit a wall! Press enter to restart.");
  }
  snake = newSnake;
  draw(snake, apple, snake2);
}

var changeDirection = function(direction) {
  snake[0].direction = direction;
}

var apple = CHUNK.randomLocation();
var snake = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }];
var snake2 = [{ top: 5, left: 0}];

CHUNK.executeNTimesPerSecond(advanceGame, 8);
CHUNK.onArrowKey(changeDirection);
