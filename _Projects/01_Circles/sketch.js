// Global var
let productionMode = false;

let circles = [];

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

  frameRate(100);

  createCircles(500);
}

function createCircles(amount) {
  for(let i = 0; i < amount; i++) {
    circles.push({ x: random(windowWidth), y: random(windowHeight), diameter: random(100), r: random(255), g: random(255), b: random(255), o: random(255)});
  }
}

function drawCircle(circle) {
  fill(circle.r, circle.g, circle.b, circle.o);
  ellipse(circle.x, circle.y, circle.diameter);
}

function draw() {
  background(255);

  circles.shift();
  createCircles(1);

  circles.forEach((circle) => {
    drawCircle(circle);
  });
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
