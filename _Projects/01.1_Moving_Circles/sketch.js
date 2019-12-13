// Global var
let productionMode = false;
let drawPointMode = true;

let showFPS = true;
let maxFrames = 60;
let distanceK = 30;
let segmentsX = 10;
let segmentsY = window.innerHeight / (window.innerWidth / segmentsX);

let allowedDistance = (window.innerWidth + window.innerHeight) / distanceK;
let maxStrokeWeight = (window.innerWidth + window.innerHeight) / 500;
let maxStrokeOpacity = 255;

let pointsCount = 300;
let pointDiameter = 20;
let pointSpeedInitial = 2;
let pointSpeedK1 = (window.innerWidth + window.innerHeight) / 50;
let pointSpeedK2 = 4;

let points = [];


function setup() {
  // Canvas setup
  if(productionMode)
    canvas = createCanvas(windowWidth, windowHeight-45);
  else {
    canvas = createCanvas(windowWidth, windowHeight);
  }
  canvas.parent("p5Container");
  // Detect screen density (retina)
  var density = displayDensity();
  pixelDensity(density);

  frameRate(maxFrames);
  createPoints(pointsCount);
}

function getDistanceToPoint(pointA, pointB) {
  var a = pointA.x - pointB.x;
  var b = pointA.y - pointB.y;

  return Math.sqrt( a*a + b*b );
}

function createPoints(amount) {

  for(let i = 0; i < amount; i++) {
    let x = random(windowWidth);
    let y = random(windowHeight);
    let r = random(255);
    let g = random(255);
    let b = random(255);
    let o = random(255);
    let d = random(360);

    points.push({ x: x, y: y, r: r, g: g, b: b, o: o, d: d, s: pointSpeedInitial});
  }
}

function degreeToRadian(degree) {
  return degree*Math.PI / 180;
}

function drawPoint(point) {
  noStroke();
  fill(point.r, point.g, point.b, point.o);
  ellipse(point.x, point.y, pointDiameter);
}

function movePoint(point) {
  if(point.x > window.innerWidth || point.x < 0)
    inverseDirection(point, 0);

  if(point.y > window.innerHeight || point.y < 0)
    inverseDirection(point, 1);

  point.x = point.x + point.s * sin(degreeToRadian(point.d));
  point.y = point.y + point.s * cos(degreeToRadian(point.d));
}

function inverseDirection(point, d) {
  if(d === 0) {
    point.d = 360 - point.d;
  } else {
    point.d = 180 - point.d;
  }
}

function displayFPS() {
  let fps = frameRate();
  fill(255);
  stroke(0);
  textSize(window.innerHeight / 50);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
}

function draw() {
  background(0);

  let quadTree = new QuadTree(new Rectangle(width / 2, height / 2, width / 2, height / 2), 5);

  points.forEach((point) => {
    quadTree.insert(new Point(point.x, point.y, point));
  });

  points.forEach((point) => {
    let range = new Circle(point.x, point.y, allowedDistance);
    let others = quadTree.query(range);
    
    point.s = pointSpeedK1 / ((others.length*pointSpeedK2) + 1);

    if(drawPointMode)
      drawPoint(point);

    movePoint(point);
  });

  //quadTree.show();
  if(showFPS) displayFPS();
}

function keyPressed() {
  if (key == 's' || key == 'S') saveThumb(650, 350);
}

// Tools

// resize canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

// Int conversion
function toInt(value) {
  return ~~value;
}

// Timestamp
function timestamp() {
  return Date.now();
}

// Thumb
function saveThumb(w, h) {
  let img = get( width/2-w/2, height/2-h/2, w, h);
  save(img,'thumb.jpg');
}
