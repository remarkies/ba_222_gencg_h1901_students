// Global var
let fluid;

function setup() {
  // Canvas setup
  canvas = createCanvas(windowWidth, windowHeight-45);
  canvas.parent("p5Container");
  // Detect screen density (retina)
  var density = displayDensity();
  pixelDensity(density);
  frameRate(60);
  fluid = new Fluid(0.2, 0, 0.000000001);
}

function draw() {
  stroke(51);
  strokeWeight(2);

  let cx = int(0.5*width/SCALE);
  let cy = int(0.5*height/SCALE);
  for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
          fluid.addDensity(cx+i, cy+j, random(50, 150));
      }
  }

  for (let i = 0; i < 2; i++) {
      let angle = noise(t) * TWO_PI * 2;
      let v = p5.Vector.fromAngle(angle);
      v.mult(0.2);
      t += 0.01;
      fluid.addVelocity(cx, cy, v.x, v.y);
  }

  fluid.step();
  fluid.renderD();

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
