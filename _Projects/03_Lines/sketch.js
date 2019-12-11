// Global var
let productionMode = false;

let points = [];
let pointSpeed = 2;
let allowedDistance = (window.innerWidth + window.innerHeight) / 20;

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

  noStroke();

  frameRate(60);

  createPoints(200);
}

function getDistanceToPoint(pointA, pointB) {
  var a = pointA.x - pointB.x;
  var b = pointA.y - pointB.y;

  return Math.sqrt( a*a + b*b );
}

function createPoints(amount) {
  for(let i = 0; i < amount; i++) {
    points.push({ x: random(windowWidth), y: random(windowHeight), r: random(255), g: random(255), b: random(255), o: random(255), d: random(360)});
  }
}

function degreeToRadian(degree) {
  return degree*Math.PI / 180;
}

function drawCircle(circle) {
  noStroke();
  fill(circle.r, circle.g, circle.b, circle.o);
  ellipse(circle.x, circle.y, 5);
  stroke(0);
  noFill();
}

function movePoint(point) {
  if(point.x > window.innerWidth || point.x < 0)
    inverseDirection(point, 0);

  if(point.y > window.innerHeight || point.y < 0)
    inverseDirection(point, 1);

  point.x = point.x + pointSpeed * sin(degreeToRadian(point.d));
  point.y = point.y + pointSpeed * cos(degreeToRadian(point.d));

}

function inverseDirection(point, d) {
  if(d == 0) {
    point.d = 360 - point.d;
  } else {
    point.d = 180 - point.d;
  }
}



function draw() {
  background(0);
  stroke(0);
  strokeWeight(3);
  noFill();
  points.forEach((point) => {
    movePoint(point);
    drawCircle(point);

    points.forEach((pointB) => {
      let distance = getDistanceToPoint(point, pointB);

      if(distance < allowedDistance) {

        stroke(point.r, point.g, point.b, point.o);
        strokeWeight(1);
        line(point.x, point.y, pointB.x, pointB.y);
      }
    });
  });

 let fps = frameRate();
 fill(255);
 stroke(0);
 textSize(100);
 //text("FPS: " + fps.toFixed(2), 10, height - 10);
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
