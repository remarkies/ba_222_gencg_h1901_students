class Hole {
  constructor(vector, mass) {
    this.vector = vector;
    this.mass = mass;
  }
  display() {
    noStroke();
    fill(0);
    ellipse(this.vector.x, this.vector.y, this.mass*2);
  }
}
