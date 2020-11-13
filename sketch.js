let boids = [];
let resetButton;

function setup() {
    createCanvas(800, 800);
    resetButton = createButton('Reset');
    resetButton.position(0, 800);
    resetButton.mousePressed(resetBoids);
    resetBoids();
}

const numBoids = 100;

function resetBoids() {
    boids = [];
    for (let i = 0; i < numBoids; i++) {
        boids.push(new Boid(Math.random() * 800, Math.random() * 800));
    }
}

function draw() {
    background(255, 255, 242);

    let newVelocities = [];

    for (const boid of boids) {
        newVelocities.push(boid.getAcceleration(boids));
    }

    for (let i = 0; i < boids.length; i++) {
        const boid = boids[i];
        const v = newVelocities[i];

        noFill();
        beginShape();
        for (const point of boid.trail) {
            vertex(point.x, point.y);
        }
        endShape();

        fill('white');
        boid.vx += v.x;
        boid.vy += v.y;
        //triangle(boid.x + boid.vx * 3, boid.y + boid.vy * 3, boid.x + 1, boid.y + 1, boid.x - 1, boid.y - 1);
        circle(boid.x, boid.y, 10);
        boid.update();
    }
}