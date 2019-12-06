let direction;
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;
let stepSize, rideDuration, startTime;

let options = {
  Background: '#2E3440',
  Color1: '#8FBCBB',
  Color2: '#88C0D0',
  Color3: '#81A1C1',
};

let palette = {
  blade: {
    body: '#A3BE8C',
    head: '#BF616A'
  },
  monster: {
    shell: '#EBCB8B'
  }

};

var blades = [];
let monsters = [];

function setup() {

  // Canvas setup
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5Container");
  p5.disableFriendlyErrors = true; // disables FES

  // Colors and drawing modes
  smooth();
  noStroke();
  direction = 'unknown';
  startTime = new Date();
  rideDuration = getRideDuration(2);
  console.log('Ride duration: ' + rideDuration);

  createCanvas(windowWidth, windowHeight);

  for(let i = 0; i < 200; i++) {
    blades.push(new Blade());
  }

  monsters.push(new Monster(new createVector(windowWidth / 2, windowHeight / 2)));
}

function draw(){
    background(options.Background);
    noStroke();
    smooth();

    blades.forEach((blade) => {
      blade.move();
      blade.display();
    });


    monsters.forEach((monster) => {
      monster.move();
      monster.display();
    });

}


function getPointsFromCircleWithDiameter(center, diameter, amount) {
  angle = 0;
  step  = TWO_PI/amount;

  let points = [];


  for(let i = 0; i < amount; i++) {
    var x = center.x + diameter * sin(angle);
    var y = center.y + diameter * cos(angle);

    points.push(new createVector(x, y));
    angle += step;
  }

  return points;
}

function getAngleToPoint(pointA, pointB) {
    return pointA.angleBetween(pointB);
}

function Leg(position) {
  this.pos = position;
  this.length = 100;
  this.points = [];
  this.speed = 10;
  this.legParts = 10;
  this.maxHeadDistance = 1000;

  this.createLeg = function(direction) {

    let locDirection = direction;
    this.points = [];
    this.points.push(this.pos);

    let blade = getClosestBladeHead(this.pos);
    let distance = getDistanceToPoint(this.pos, blade.head.pos);
    if(distance < this.maxHeadDistance) {
        locDirection = degrees(this.pos.angleBetween(blade.head.pos));

        stroke(255);
        line(this.pos.x, this.pos.y, blade.head.pos.x, blade.head.pos.y);
        console.log(locDirection);
    }

    for(let i = 0; i < this.legParts; i++) {
      //var x = this.pos.x + ((this.length / this.legParts) * sin(random(direction - directionRan, direction + directionRan)));
      //var y = this.pos.y + ((this.length / this.legParts) * cos(random(direction - directionRan, direction + directionRan)));
      let lastPos = this.points[this.points.length - 1];
      var x = lastPos.x + ((this.length / this.legParts) * sin(degreeToRadian(locDirection)));
      var y = lastPos.y + ((this.length / this.legParts) * cos(degreeToRadian(locDirection)));

      this.points.push(new createVector(x, y));
    }
  }

  this.display = function(direction) {


    this.createLeg(direction);

    noFill();
    stroke(palette.monster.shell);

    beginShape();
    curveVertex(this.points[0].x, this.points[0].y);
    for(let p = 0; p < this.points.length; p++) {
      curveVertex(this.points[p].x, this.points[p].y);
      ellipse(this.points[p].x, this.points[p].y, 3, 3);
    }
    curveVertex(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
    endShape();

  }

}

function degreeToRadian(degree) {
  return degree*Math.PI / 180;
}

function Shell(pos, legs) {
  this.pos = pos;
  this.oldPos = null;
  this.diameter = 50;
  this.points = getPointsFromCircleWithDiameter(this.pos, this.diameter, legs);
  this.legs = [];

  for(let i = 0; i < this.points.length; i++) {
    this.legs.push(new Leg(this.points[i]));
  }

  this.moveTo = function(position) {
    this.oldPos = this.pos;
    this.pos = position;
    this.display();
  }

  this.display = function() {
    let xDif = this.oldPos.x - this.pos.x;
    let yDif = this.oldPos.y - this.pos.y;
    this.points.forEach((point) => {
      point.x += xDif;
      point.y += yDif;
    });



    noFill();
    stroke(palette.monster.shell);
    strokeWeight(1);
    beginShape();

    for(let p = 0; p < this.points.length; p++) {
      curveVertex(this.points[p].x, this.points[p].y);
      //ellipse(this.points[p].x, this.points[p].y, 5, 5);
    }
    endShape(CLOSE);

    this.legs = [];
    for(let i = 0; i < this.points.length; i++) {
      this.legs.push(new Leg(this.points[i]));
    }

    for(let l = 0; l < this.legs.length; l++) {
      this.legs[l].display(360 / this.legs.length * l);
    }
  }
}

function getClosestBladeHead(point) {

  let closestBlade = null;
  let closestDistance = null;

  blades.forEach((blade) => {
    let distance = getDistanceToPoint(point, blade.head.pos);

    if(closestDistance === null) {
      closestBlade = blade;
      closestDistance = distance;
    }

    if(distance < closestDistance) {
      closestBlade = blade;
      closestDistance = distance;
    }
  });

  return closestBlade;
}

function getDistanceToPoint(pointA, pointB) {
  var a = pointA.x - pointB.x;
  var b = pointA.y - pointB.y;

  return Math.sqrt( a*a + b*b );
}

function Monster(position) {

  this.pos = position;
  this.legsCount = 4;
  this.Shell = new Shell(this.pos, this.legsCount);
  this.monsterSpeed = 0.5;

  this.move = function() {
    let blade = getClosestBladeHead(this.pos);

    if(this.pos.x < blade.head.pos.x) {
      this.pos.x += this.monsterSpeed;
    } else {
      this.pos.x -= this.monsterSpeed;
    }
    this.Shell.moveTo(new createVector(this.pos.x, this.pos.y));
  }

  this.display = function() {
    this.Shell.display();
  }
}

function Head(pos) {
  this.pos = pos;
  this.size = 10;

  this.display = function() {
    stroke(palette.blade.head);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

function isPointInAllowedRange(fixedPointNo, pointNo, range) {
  return fixedPointNo - range < pointNo && fixedPointNo + range > pointNo;
}

function isTooFarRight(fixedPointNo, pointNo, range) {
  return fixedPointNo + range < pointNo;
}

function isTooFarLeft(fixedPointNo, pointNo, range) {
  return fixedPointNo - range > pointNo;
}

function Blade() {
  this.height = random(windowHeight / 4, windowHeight / 2);

  let posX = random(0, windowWidth);
  this.pos1 = new createVector(posX, windowHeight);
  this.pos2 = new createVector(posX, windowHeight - (this.height * 1/4));
  this.pos3 = new createVector(posX, windowHeight - (this.height * 2/4));
  this.pos4 = new createVector(posX, windowHeight - (this.height * 3/4));

  this.moveSpeed = 0.2;

  this.pos2d = random(-1, 1) >= 0? 1 : -1;
  this.pos3d = random(-1, 1) >= 0? 1 : -1;
  this.pos4d = random(-1, 1) >= 0? 1 : -1;

  //settings start speed of blade parts
  this.pos2Speed = this.pos2d * this.moveSpeed;
  this.pos3Speed = this.pos3d * this.moveSpeed;
  this.pos4Speed = this.pos4d * this.moveSpeed;

  this.stiffness = 1.5 + (1 / windowHeight * this.height);
  this.acceleration = 0.005;
  this.maxSpeed = 0.8;
  this.maxMove = 10;

  this.move = function() {
    function getBladeSpeed(fixedPointNo, pointNo, speed, acceleration, accIncrease, maxMove, maxSpeed, stiffness) {
      if(!isPointInAllowedRange(fixedPointNo, pointNo, maxMove)) {
        if(isTooFarRight(fixedPointNo, pointNo, maxMove)) {
          speed -= (acceleration * accIncrease * stiffness);
        } else if(isTooFarLeft(fixedPointNo, pointNo, maxMove)) {
          speed += (acceleration * accIncrease * stiffness);
        }
      }

      if(speed > maxSpeed) {
        speed = maxSpeed;
      } else if(speed < maxSpeed * -1) {
        speed = maxSpeed * -1;
      }
      return speed;
    }

    this.pos2Speed = getBladeSpeed(this.pos1.x, this.pos2.x, this.pos2Speed, this.acceleration, 1, this.maxMove, this.maxSpeed, this.stiffness);
    this.pos3Speed = getBladeSpeed(this.pos2.x, this.pos3.x, this.pos3Speed, this.acceleration, 1.1, this.maxMove, this.maxSpeed, this.stiffness);
    this.pos4Speed = getBladeSpeed(this.pos3.x, this.pos4.x, this.pos4Speed, this.acceleration, 2.5, this.maxMove, this.maxSpeed, this.stiffness);

    this.pos2.x += this.pos2Speed;
    this.pos3.x += this.pos3Speed;
    this.pos4.x += this.pos4Speed;
  }

  this.head = new Head(this.pos4);

  this.display = function() {
    noFill();
    stroke(palette.blade.body);
    strokeWeight(3);
    bezier(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y, this.pos3.x, this.pos3.y, this.pos4.x, this.pos4.y);

    this.head.display();

    /*
    stroke(255);
    ellipse(this.pos1.x, this.pos1.y, 5, 5);
    ellipse(this.pos2.x, this.pos2.y, 5, 5);
    ellipse(this.pos3.x, this.pos3.y, 5, 5);
    ellipse(this.pos4.x, this.pos4.y, 5, 5);
    */
  }
}


function keyPressed() {

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
