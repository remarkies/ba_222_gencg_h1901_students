// sets canvas bottom - 45px if true
let productionMode = false;

// overrides variable values in setup if true
let randomize = true;

// default: 10
let pointsCount = 10;

// in milliseconds, default: 20000
let reset = 20000;

// displays fps bottom-left corner if true
let showFPS = false;

// set max frame rate, default: 60
let maxFrames = 60;

// max: has no effect if < pointsCount, min: 2, default: 4
let maxConnections = 4;

// max: 1, min: > 0, default: 0.2
let range = 0.2;

// min: > 0, default: 3
let maxWeigth = 3;

// default: 100
let strokeOpacity = 100;

// default: 0.2
let moveSpeed = 0.2;

// default: 4
let connectionSpeedInfluence = 4;

// dont modify!
let allowedDistance = (window.innerWidth + window.innerHeight) * range;
let maxStrokeWeight = ((window.innerWidth + window.innerHeight) / 500) * maxWeigth;
let pointSpeedK1 = (window.innerWidth + window.innerHeight) * moveSpeed / 10;
let points = [];
let time;


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
  background(0);
  points = createPoints(pointsCount);
  time = millis();

  if(randomize) {
    randomizeVariables();
  }
}

function randomizeVariables() {

  maxConnections = random(2, 4);
  range = random(0.1, 1);
  maxWeigth = random(0.08, 3);
  moveSpeed = random(0.1, 0.5);
  connectionSpeedInfluence = random(1, 4);

  console.log({
    maxCon: maxConnections,
    range: range,
    maxWeight: maxWeigth,
    moveSpeed: moveSpeed,
    connectionSpeedInfluence: connectionSpeedInfluence
  });

  // dont modify!
  allowedDistance = (window.innerWidth + window.innerHeight) * range;
  maxStrokeWeight = ((window.innerWidth + window.innerHeight) / 500) * maxWeigth;
  pointSpeedK1 = (window.innerWidth + window.innerHeight) * moveSpeed / 10;
}

//creates points to move around
function createPoints(amount) {
  let array = [];
  for(let i = 0; i < amount; i++) {
    let x = random(windowWidth);
    let y = random(windowHeight);
    let r = random(255);
    let g = random(255);
    let b = random(255);
    let o = random(200,255);
    let d = random(360);

    array.push({ x: x, y: y, r: r, g: g, b: b, o: o, d: d, s: 0});
  }
  return array;
}

//calculates distance between pointA & pointB
function getDistanceToPoint(pointA, pointB) {
  var a = pointA.x - pointB.x;
  var b = pointA.y - pointB.y;

  return Math.sqrt( a*a + b*b );
}

//converts degree to radian value
function degreeToRadian(degree) {
  return degree*Math.PI / 180;
}

//sets new x & y value of point depending on speed & direction(0-360)
function movePoint(point) {
  if(point.x > window.innerWidth || point.x < 0)
    inverseDirection(point, 0);

  if(point.y > window.innerHeight || point.y < 0)
    inverseDirection(point, 1);

  point.x = point.x + point.s * sin(degreeToRadian(point.d));
  point.y = point.y + point.s * cos(degreeToRadian(point.d));
}

//inverses direction(0-360) of point depending on wall hitting. d: 0 => x-axis, 1 => y-axis
function inverseDirection(point, d) {
  if(d === 0) {
    point.d = 360 - point.d;
  } else {
    point.d = 180 - point.d;
  }
}

//displays current fps
function displayFPS() {
  let fps = frameRate();
  blendMode(BLEND);
  noStroke();
  fill(0);
  rect(0, height - 75, 400, 75);
  fill(255);
  stroke(0);
  textSize(window.innerHeight / 50);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
}

function draw() {

  //color + color => brighter color
  blendMode(LIGHTEST);

  //reset
  if(millis() - time > reset) setup();


  points.forEach((point) => {

    //holds number of others points in defined range
    let connections = 0;

    points.forEach((other) => {

      //get distance to other point
      let distance = getDistanceToPoint(point, other);

      //is other point within allowed range
      if(distance < allowedDistance) {

        //new connection found
        connections++;

        //calculate percentage of current distance to max distance
        let perc = 100 / allowedDistance * distance;

        //get stroke weight depending on percentage of distance
        let dynamicStrokeWeight = maxStrokeWeight / 100 * (100 - perc);

        //checks if connections don't exceed max allowed (performace improvement)
        if(connections > 1 && connections <= maxConnections) {

          //dynamic stroke weight => faster more interesting color gradient
          strokeWeight(dynamicStrokeWeight);

          //100 = opacity => shouldn't be higher because it will get to bright to fast
          stroke(point.r, point.g, point.b, strokeOpacity);
          line(point.x, point.y, other.x, other.y);
        }
      }
    });

    // speed / connection * influence
    point.s = pointSpeedK1 / ((connections * connectionSpeedInfluence) + 1);

    movePoint(point);
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
