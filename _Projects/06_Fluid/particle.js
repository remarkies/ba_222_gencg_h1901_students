class Particle {
  constructor(vector) {
    this.vector = vector;
    this.diameter = 3;
    this.speed = random(2);
    this.r = random(255);
    this.g = random(10);
    this.b = random(10);
    this.o = random(255);
  }
  flow() {
    if(this.vector.x >= width)
      this.vector.x = 0;

    this.vector.x += this.speed;
  }
  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.o);
    ellipse(this.vector.x, this.vector.y, this.diameter);
  }
}
