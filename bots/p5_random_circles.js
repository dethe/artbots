function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  colorMode(HSL)
  noStroke();
}

function draw() {
  var radius = random(20,75);
  var center_radius = max(width, height) / 2
  var angle = frameCount / 30
  var x = cos(angle) * center_radius + width / 2
  var y = sin(angle) * center_radius + height / 2
  fill(random(360), 50, 50, .1);
  ellipse(x, y, radius, radius);
}
