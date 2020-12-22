let two = null;
let group = null;
const numBoids = 200;

let boids = [];
let cohesion = 0.005;
let avoidance = 0.05;
let alignment = 0.05;
let speed = 8;

let background = null;

function setup() {
    two = new Two({ fullscreen:true, autostart: true, type: Two.Types.canvas});
    two.appendTo(document.getElementById("main"));

    background = two.makeRectangle(0, 0, window.innerWidth * 2, window.innerHeight * 2);
    background.fill = "#fafaf7"

    resetBoids();
}

function resetBoids() {
    boids = [];

    for (let i = 0; i < numBoids; i++) {
        const b = new Boid(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        const p = b.getHeadPoints();
        b.drawing = two.makePath(p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y, false);
        b.drawing.fill = '#bbb';
        b.drawing.stroke = '#bbb';

        boids.push(b);
    }
}

function loop(frameCount) {
    for (const boid of boids) {

        boid.setAcceleration(boids);
        boid.drawing.translation.set(boid.x, boid.y);
        boid.drawing.rotation = Math.atan2(boid.vy, boid.vx) + Math.PI / 2;

        if (!boid.trailDrawing) {
            const trail = [];
            for (let i = 0; i < 15; i++) {
                trail.push(new Two.Anchor(0, 0, 0, 0, 0, 0));
            }

            boid.trailDrawing = two.makePath(trail, true, true);
            boid.trailDrawing.stroke = '#bbb';
            boid.trailDrawing.noFill();
        }



        // Update path by adding on another anchor and removing the first in the list
        const collection = boid.trailDrawing.vertices;
        collection.push(new Two.Anchor(boid.x, boid.y, boid.x, boid.y, boid.x, boid.y))
        collection.shift();


        boid.update();
    }
}

setup();
two.bind('update', loop)