// Global var
let productionMode = false;

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

  noStroke();

  frameRate(10);

  createPoints(100);
}

function createPoints(amount) {
  for(let i = 0; i < amount; i++) {
    points.push({ x: random(windowWidth), y: random(windowHeight), diameter: random(100), r: random(255), g: random(255), b: random(255), o: random(255)});
  }
}

function drawCircle(circle) {
  noStroke();
  fill(circle.r, circle.g, circle.b, circle.o);
  ellipse(circle.x, circle.y, 75);
  stroke(0);
  noFill();
}

function draw() {
  background(255);

  points.shift();
  stroke(0);
  strokeWeight(3);
  noFill();
  beginShape(LINES);
  points.forEach((point) => {
    vertex(point.x, point.y);
    //drawCircle(point);
  });
  endShape();

  createPoints(1);
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
