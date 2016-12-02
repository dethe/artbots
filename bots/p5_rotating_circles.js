function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  ellipseMode(CENTER);
  colorMode(HSL);
  noStroke();
}

function draw() {
  var radius = random(20,75);
  var center_radius = random(30, sqrt(width * width +  height * height) / 2);
  var angle = (frameCount) % 360;
  var x = cos(angle) * center_radius + width / 2;
  var y = sin(angle) * center_radius + height / 2;
  fill(angle + random(-15, 15), 75, 50, .1);
  ellipse(x, y, radius, radius);
}
