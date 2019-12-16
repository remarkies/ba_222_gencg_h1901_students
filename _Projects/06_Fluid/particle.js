class Particle {
  constructor(vector, screenMultiplier, r, g, b, o) {
    this.vector = vector;
    this.screenMultiplier = screenMultiplier;
    this.diameter = 3;
    this.speed = random(2);
    this.r = r;
    this.g = g;
    this.b = b;
    this.o = o;
  }
  flow() {
    if(this.vector.x >= width)
      this.vector.x = 0;

    this.vector.x += (this.speed * this.screenMultiplier);
  }
  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.o);
    ellipse(this.vector.x, this.vector.y, this.diameter);
  }
}
