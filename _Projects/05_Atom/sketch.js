// Global var
let productionMode = false;
let showFPS = false;
let maxFrames = 60;
let distanceK = 50;
let segmentsX = 10;
let segmentsY = window.innerHeight / (window.innerWidth / segmentsX);

let allowedDistance = (window.innerWidth + window.innerHeight) / distanceK;
let maxStrokeWeight = (window.innerWidth + window.innerHeight) / 1000;
let maxStrokeOpacity = 255;

let pointsCount = 100;
let pointDiameter = window.innerWidth / 2000;
let pointSpeedInitial = 2;

let points = [];
var movers = [];
let attractors = [];
let attractorsCount = 1;
let attractor;
let fade = 10;
let gravity;

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
  gravity = window.windowWidth / 500;

  attractors.push(new Attractor(new createVector(windowWidth / 2, windowHeight / 2), gravity));
  /*
  for(let i = 0; i < attractorsCount; i++) {
    attractors.push(new Attractor(new createVector(random(windowWidth), random(windowHeight))));
  }
*/
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
    let m = random(50);

    movers[i] = new Mover(random(0.1, pointDiameter), x, y, r, g, b, o, d, pointSpeedInitial);
  }
}

function degreeToRadian(degree) {
  return degree*Math.PI / 180;
}

function drawPoint(point) {
  noStroke();
  fill(point.r, point.g, point.b, point.o);
  ellipse(point.x, point.y, point.m);
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

    fill(0, 0, 0, fade);
    rect(0, 0, width, height);
  //background(0);

  for(let i = 0; i < movers.length; i ++) {
    for(let j = 0; j < attractors.length; j++) {
      //attractors[j].display();
      var force = attractors[j].calculateAttraction(movers[i]);
      movers[i].applyForce(force);
      movers[i].update();
      movers[i].display();
    }
  }

  let quadTree = new QuadTree(new Rectangle(width / 2, height / 2, width / 2, height / 2), 20);

  movers.forEach((mover) => {
    quadTree.insert(new Point(mover.position.x, mover.position.y, mover));
  });

  movers.forEach((mover) => {
    let range = new Circle(mover.position.x, mover.position.y, allowedDistance);
    let others = quadTree.query(range);

    let countLine = 0;
    others.forEach((other) => {
      let distance = getDistanceToPoint(mover.position, other.position);


        let perc = 100 / allowedDistance * distance;
        let dynamicStrokeOpacity = maxStrokeOpacity / 100 * (100 - perc);
        let dynamicStrokeWeight = maxStrokeWeight / 100 * (100 - perc);


        strokeWeight(dynamicStrokeWeight);
        stroke(mover.r, mover.g, mover.b, dynamicStrokeOpacity);

        if(countLine < 3) {
          line(mover.position.x, mover.position.y, other.position.x, other.position.y);
          countLine++;
        }

    });

  });

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
