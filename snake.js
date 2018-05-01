var score = 0;
var score2 = 0;

var draw = function(snakeToDraw, apple, snake2ToDraw, apple2) {
  var drawableSnake = { color: "green", pixels: snakeToDraw };
  var drawableApple = { color: "red", pixels: [apple] };
  var drawableApple2 = { color: "red", pixels: [apple2] };
  var drawableSnake2 = { color: "blue", pixels: snake2ToDraw };
  var drawableObjects = [drawableSnake, drawableApple, drawableSnake2, drawableApple2];
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

var moveSegment2 = function(segment2) {
  if (segment2.direction === "S") {
    return { top: segment2.top + 1, left: segment2.left }
  } else if (segment2.direction === "W") {
    return { top: segment2.top - 1, left: segment2.left }
  } else if (segment2.direction === "D") {
    return { top: segment2.top, left: segment2.left + 1 }
  } else if (segment2.direction === "A") {
    return { top: segment2.top, left: segment2.left - 1 }
  }
  return segment2;
}

var segmentFurtherForwardThan = function(index, snake) {
  if (snake[index - 1] === undefined) {
    return snake[index];
  } else {
    return snake[index - 1];
  }
}

var segmentFurtherForwardThan2 = function(index2, snake2) {
  if (snake2[index2 - 1] === undefined) {
    return snake2[index2];
  } else {
    return snake2[index2 - 1];
  }
}

var moveSnake = function(snake) {
  return snake.map(function(oldSegment, segmentIndex) {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
    return newSegment;
  });
}

var moveSnake2 = function(snake2) {
   return snake2.map(function(oldSegment2, segmentIndex2) {
    var newSegment2 = moveSegment2(oldSegment2);
    newSegment2.direction = segmentFurtherForwardThan2(segmentIndex2, snake2).direction;
    return newSegment2;
  });
}

var growSnake = function(snake) {
  var indexOfLastSegment = snake.length - 1;
  var lastSegment = snake[indexOfLastSegment];
  snake.push({ top: lastSegment.top, left: lastSegment.left });
  return snake;
}

var growSnake2 = function(snake2) {
  var indexOfLastSegment2 = snake2.length - 1;
  var lastSegment2 = snake2[indexOfLastSegment2];
  snake2.push({ top: lastSegment2.top, left: lastSegment2.left });
  return snake2;
}

var ate = function(snake, otherThing) {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

var ate2 = function(snake2, otherThing2) {
  var head2 = snake2[0];
  return CHUNK.detectCollisionBetween([head2], otherThing2);
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 13) {
        location.reload();
    }
};

var advanceGame = function() {
  var newSnake2 = moveSnake2(snake2);
  var newSnake = moveSnake(snake);
  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself, player 1! Press enter to restart.");
  }
  if (ate(newSnake, [apple])) {
    score = score + 1;
    document.getElementById("button").innerText = 'P1 Score: ' + score;
    newSnake = growSnake(newSnake);
    apple = CHUNK.randomLocation();
  }
    if (ate(newSnake, [apple2])) {
    score = score + 1;
    document.getElementById("button").innerText = 'P1 Score: ' + score;
    newSnake = growSnake(newSnake);
    apple2 = CHUNK.randomLocation();
  }
  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You hit a wall, player 1! Press enter to restart.");
  }
  if (ate(newSnake, snake2)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You hit player 2, player 1! Press enter to restart.");
  }

  if (ate2(newSnake2, snake2)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself, player 2! Press enter to restart.");
  }
  if (ate2(newSnake2, [apple])) {
    score2 = score2 + 1;
    document.getElementById("button2").innerText = 'P2 Score: ' + score2;
    newSnake2 = growSnake2(newSnake2);
    apple = CHUNK.randomLocation();
  }
    if (ate2(newSnake2, [apple2])) {
    score2 = score2 + 1;
    document.getElementById("button2").innerText = 'P2 Score: ' + score2;
    newSnake2 = growSnake2(newSnake2);
    apple2 = CHUNK.randomLocation();
  }
  if (ate2(newSnake2, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You hit a wall, player 2! Press enter to restart.");
  }
  if (ate(newSnake2, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You hit player 1, player 2! Press enter to restart.");
  }


  snake = newSnake;
  snake2 = newSnake2;
  draw(snake, apple, snake2, apple2);
}

var changeDirection = function(direction) {
  snake[0].direction = direction;
}

var changeDirection2 = function(direction2) {
  snake2[0].direction = direction2;
}

var apple = CHUNK.randomLocation();
var apple2 = CHUNK.randomLocation();
var snake = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }];
var snake2 = [{ top: 5, left: 0, direction: "S"}, { top: 4, left: 0, direction: "S"}];

CHUNK.executeNTimesPerSecond(advanceGame, 8);
CHUNK.onArrowKey(changeDirection);
CHUNK.onArrowKey2(changeDirection2);