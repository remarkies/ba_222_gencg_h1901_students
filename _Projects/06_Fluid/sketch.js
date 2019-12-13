// Global var
let productionMode = false;
let showFPS = true;

let particles = [];
let holes = [];
let holesCount = 5;

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
  frameRate(60);

  for(let i = 0; i < height; i+=2) {
    particles.push(new Particle(createVector(0, i)));
  }

  for(let j = 0; j < holesCount; j++) {
    holes.push(new Hole(createVector(random(width), random(height)), random(3, 10)));
  }
}

function draw() {

  particles.forEach(particle => {
    particle.flow();
    particle.display();
  })

  holes.forEach(hole => {
    hole.display();
  });

  if(showFPS)
    displayFPS();
}

function displayFPS() {
  let fps = frameRate();
  fill(255);
  stroke(0);
  textSize(window.innerHeight / 50);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
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
