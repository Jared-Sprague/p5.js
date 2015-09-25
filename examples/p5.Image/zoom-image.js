var proverbs,
  RECT_WIDTH,
  RECT_HEIGHT,
  rectX,
  rectY,
  isZoomed = false;

function setup() {
  proverbs = loadImage('netherlandish_proverbs.jpg', function () {
    createCanvas(proverbs.width, proverbs.height);
    RECT_WIDTH = floor(proverbs.width * 0.05);
    RECT_HEIGHT = floor(RECT_WIDTH / (proverbs.width / proverbs.height));
  });
}

function draw() {
  clear();
  noFill();
  stroke('#FFFFF');
  strokeWeight(2);

  var dHeight = window.innerWidth / (proverbs.width / proverbs.height);
  image(proverbs, 0, 0, window.innerWidth, dHeight);

  if (isZoomed) {
    // Draw a zoomed image of the current rect
    var dWidth = window.innerWidth - 200;
    image(proverbs, rectX, rectY, RECT_WIDTH, RECT_HEIGHT, 0, 0, proverbs.width, proverbs.height);
    //rect(100, 100, dWidth, dHeight - 200);
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
  isZoomed = !isZoomed;
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
