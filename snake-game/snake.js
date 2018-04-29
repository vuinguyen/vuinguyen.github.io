var draw = function(snakeToDraw, apple) {
  var drawableSnake = { color: "green", pixels: snakeToDraw };
  var drawableApple = { color: "red", pixels: [apple] };
  var drawableObjects = [drawableSnake, drawableApple]
  CHUNK.draw(drawableObjects);
}

var moveSegment = function(segment) {
  /*
  if (segment.direction === "down") {
    return { top: segment.top + 1, left: segment.left }
  } else if (segment.direction === "up") {
    return { top: segment.top - 1, left: segment.left }
  } else if (segment.direction === "right") {
;    return { top: segment.top, left: segment.left + 1 }
  } else if (segment.direction === "left") {
    return { top: segment.top, left: segment.left - 1 }
  }
  return segment;
  */
  switch (segment.direction) {
    case 'down':
      return { top: segment.top + 1, left: segment.left }
    case 'up':
      return { top: segment.top - 1, left: segment.left }
    case 'right':
      return { top: segment.top, left: segment.left + 1 }
    case 'left':
      return { top: segment.top, left: segment.left - 1 }
    default:
      return segment;
  }
}

var segmentFurtherForwardThen = function(index, snake) {
  if (snake[index - 1] === undefined) {
    return snake[index];
  } else {
    return snake[index -1];
  }
}

var moveSnake = function(snake) {
  //var newSnake = [];
  /*
  snake.forEach(function(oldSegment) {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = oldSegment.direction;
    newSnake.push(newSegment);
  });
  */
  /*
  newSnake = snake.map(oldSegment => {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = oldSegment.direction;
    return newSegment;
  });
  return newSnake;
  */
  return snake.map(function(oldSegment, segmentIndex) {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = segmentFurtherForwardThen(segmentIndex, snake).direction;
    return newSegment;
  });
}

var growSnake = function(snake) {
  var tipOfTailIndex = snake.length - 1;
  var tipOfTail = snake[tipOfTailIndex];
  var indexOfLastSegment = snake.length - 1;
  snake.push({ top: tipOfTail.top, left: tipOfTail.left });
  return snake;
}

var ate = function(snake, otherThing) {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

var advanceGame = function() {
  var newSnake = moveSnake(snake);

  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself!");
  }

  if (ate(newSnake, [apple])) {
    newSnake = growSnake(newSnake);
    apple = CHUNK.randomLocation();
  }

  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! you hit a wall!");
  }

  snake = newSnake;
  draw(snake, apple);
}

var changeDirection = function(direction) {
  snake[0].direction = direction
}

var apple = CHUNK.randomLocation();
var snake = [{ top: 1, left: 0 , direction: "down" }, { top: 0, left: 0 , direction: "down" } ];
CHUNK.executeNTimesPerSecond(advanceGame, 2);
CHUNK.onArrowKey(changeDirection);
