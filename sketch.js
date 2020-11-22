let boids = [];
let resetButton;

let width = window.innerWidth;
let height = window.innerHeight;

const numBoids = 150;

let cohesionSlider, avoidanceSlider, alignmentSlider, speedSlider, wallsSlider;

function setup() {
    createCanvas(width, height);
    resetButton = createButton('Reset');
    resetButton.position(0, 0);
    resetButton.mousePressed(resetBoids);

    cohesionSlider = createSlider(0, 0.01, 0.005, 0.001);
    cohesionSlider.position(0, 40);

    avoidanceSlider = createSlider(0, 0.1, 0.05, 0.01);
    avoidanceSlider.position(0, 80);

    alignmentSlider = createSlider(0, 0.1, 0.05, 0.01);
    alignmentSlider.position(0, 120);

    wallsSlider = createSlider(0.01, 10, 1, 0);
    wallsSlider.position(0, 160);

    speedSlider = createSlider(1, 20, 12, 1);
    speedSlider.position(0, 200);

    resetBoids();
}

function resetBoids() {
    boids = [];
    for (let i = 0; i < numBoids; i++) {
        boids.push(new Boid(Math.random() * width, Math.random() * height));
    }
}

function draw() {
    background(250);

    noFill();

    for (const boid of boids) {

        noFill();
        stroke(150);
        strokeWeight(0.25);
        beginShape();
        for (const point of boid.trail) {
            vertex(point.x, point.y);
        }
        endShape();

        boid.setAcceleration(boids);

        fill(20);
        //circle(boid.x, boid.y, 15);
        boid.drawBoid();


        boid.update();
    }
}