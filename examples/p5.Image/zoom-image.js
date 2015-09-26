var proverbs,
  RECT_WIDTH,
  RECT_HEIGHT,
  rectX,
  rectY,
  dx,
  dy,
  dWidth,
  dHeight,
  isZoomed = false,
  destTopLeft,
  destBottomRight,
  particleA,
  particleB,
  extraSpeed = 1.5,
  FRAME_RATE = 30;

function setup() {
  frameRate(FRAME_RATE);

  proverbs = loadImage('netherlandish_proverbs.jpg', function () {
    createCanvas(proverbs.width, proverbs.height);
    image(proverbs, 0, 0);
    RECT_WIDTH = floor(proverbs.width * 0.075);
    RECT_HEIGHT = floor(RECT_WIDTH / (proverbs.width / proverbs.height));
    dWidth = RECT_WIDTH * 10;
    dHeight = RECT_HEIGHT * 10;
    dx = floor((proverbs.width / 2) - (dWidth / 2));
    dy = floor((proverbs.height / 2) - (dHeight / 2));
    destTopLeft = createVector(dx, dy);
    destBottomRight = createVector(dx + dWidth, dy + dHeight);
  });
}

function draw() {
  clear();
  noFill();
  stroke('#FFFFF');
  strokeWeight(2);

  image(proverbs, 0, 0);

  if (isZoomed) {
    particleA.update();
    particleB.update();

    var rect_x = particleA.position.x;
    var rect_y = particleA.position.y;
    var rect_width = particleB.position.x - particleA.position.x;
    var rect_height = particleB.position.y - particleA.position.y;

    rect(rect_x, rect_y, rect_width, rect_height);

    // Draw a zoomed image of the current rect
    image(proverbs, rectX, rectY, RECT_WIDTH, RECT_HEIGHT, rect_x, rect_y,
      rect_width, rect_height);

    return;
  }

  // keep the rect within the bounds of the image
  rectX = mouseX - floor(RECT_WIDTH / 2);
  rectY = mouseY - floor(RECT_HEIGHT / 2);
  rectX = applyCoordBoundary(rectX, RECT_WIDTH, proverbs.width);
  rectY = applyCoordBoundary(rectY, RECT_HEIGHT, proverbs.height);

  // Draw the zoom rect
  rect(rectX, rectY, RECT_WIDTH, RECT_HEIGHT);
}

function mouseClicked() {
  console.log(touchX, touchY);
  var origin = createVector(mouseX, mouseY);
  var topLeftDist = p5.Vector.dist(destTopLeft, origin);
  var bottomRightDist = p5.Vector.dist(destBottomRight, origin);
  var multiplierA;
  var multiplierB;

  if (topLeftDist < bottomRightDist) {
    multiplierA = topLeftDist / FRAME_RATE;
    multiplierB = multiplierA * (bottomRightDist / topLeftDist);
  } else if (bottomRightDist < topLeftDist) {
    multiplierB = bottomRightDist / FRAME_RATE;
    multiplierA = multiplierB * (topLeftDist / bottomRightDist);
  } else {
    multiplierB = multiplierA = topLeftDist / FRAME_RATE;
  }

  particleA = new Particle(origin, destTopLeft, multiplierA * extraSpeed);
  particleB = new Particle(origin, destBottomRight, multiplierB * extraSpeed);

  isZoomed = !isZoomed;
  return false;
}

/**
 * Prevents the rect from drawing outside the canvas boundary
 */
function applyCoordBoundary(coord, sideLength, boundary) {
  if (coord < 0) {
    return 0;
  }
  if ((coord + sideLength) > boundary) {
    return boundary - sideLength;
  }
  return coord;
}

// A simple Particle class
var Particle = function (position, dest, speed) {
  this.position = position.copy();
  this.dest = dest.copy();
  this.acceleration = createVector(0.00, 0.00);
  this.direction = p5.Vector.sub(dest, position);
  this.direction.normalize();
  this.direction.mult(speed);
  this.velocity = createVector(this.direction.x, this.direction.y); //createVector(0, 0);
};

// Method to update position
Particle.prototype.update = function () {
  this.velocity.add(this.acceleration);
  if (p5.Vector.dist(this.dest, this.position) < 15) {
    this.velocity = createVector(0, 0);
  }
  this.position.add(this.velocity);
};
