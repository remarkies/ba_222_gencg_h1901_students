// Global var
let productionMode = false;
let fps = 60;

let drawPointMode = false;
let pointsCount = 300;
let pointDiameter = 20;

let showFPS = false;
let maxFrames = 60;

let drawLineMode = true;
let maxConnections = 10;
let distanceK = 30;

let allowedDistance = (window.innerWidth + window.innerHeight) / distanceK;
let maxStrokeWeight = (window.innerWidth + window.innerHeight) / 500;
let maxStrokeOpacity = 255;


let pointSpeedInitial = 2;
let pointSpeedK1 = (window.innerWidth + window.innerHeight) / 50;
let pointSpeedK2 = 4;

let points = [];

let startTime;


function setup() {
  var density = displayDensity();
  pixelDensity(density);

  // Canvas setup
  createCanvas(6480 / density, 3840 / density);

  // this is optional, but lets us see how the animation will look in browser.
  frameRate(fps);

  createPoints(pointsCount);
  background(0);


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

    if(drawLineMode) {
      let counter = 0;
      others.forEach((other) => {
        counter++;
        if(counter < maxConnections) {
          let distance = getDistanceToPoint(point, other);
          let perc = 100 / allowedDistance * distance;
          let dynamicStrokeOpacity = maxStrokeOpacity / 100 * (100 - perc);
          let dynamicStrokeWeight = maxStrokeWeight / 100 * (100 - perc);
          strokeWeight(dynamicStrokeWeight);
          stroke(point.r, point.g, point.b, dynamicStrokeOpacity);
          line(point.x, point.y, other.x, other.y);
        }
      });
    }
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
