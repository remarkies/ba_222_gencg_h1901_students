// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

var Mover = function(mass, x, y, r, g, b, o, d, s) {
  this.position = createVector(x, y);
  this.velocity = createVector(1, 0);
  this.acceleration = createVector(0, 0);
  this.mass = mass;
  this.r = r;
  this.g = g;
  this.b = b;
  this.o = o;
  this.d = d;
  this.s = s;

  this.applyForce = function(force) {
    var f = p5.Vector.div(force,this.mass);
    this.acceleration.add(f);
  };

  this.update = function() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  };

  this.display = function() {
    noStroke();
    fill(this.r, this.g, this.b, this.o);
    ellipse(this.position.x, this.position.y, this.mass*16, this.mass*16);

  };

  this.checkEdges = function() {
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if (this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = height;
    }
  };
};
