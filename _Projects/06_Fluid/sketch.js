// Global var
let productionMode = false;
let showFPS = false;
let fade = 40;

let particles = [];
let screenRatio;

function setup() {
  screenRatio = window.windowWidth / 500;

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


  for(let i = 0; i < height / 2; i+=2) {

    //Set color range
    let red = random(0);
    let green = random(100);
    let blue = random(255);
    let opacity = 255;

    particles.push(new Particle(createVector(0, random(height)), screenRatio, red, green, blue, opacity));
  }

  background(0);
}

function draw() {


  fill(0, 0, 0, fade);
  rect(0, 0, width, height);

  particles.forEach(particle => {
    particle.flow();
    particle.display();
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
