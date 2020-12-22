let boids = [];
let oldQuads = [];
const numBoids = 300;
const boidRange = 50;

let vertices = [];
let edges = [];
const numVertices = 300;
const theta = 1.0;
const C = 3;
const K = 7.5;
const G = 1 / 15;
let stepSize = 0.01;


let width = window.innerWidth;
let height = window.innerHeight;

let resetButton, cohesionSlider, avoidanceSlider, alignmentSlider, speedSlider, wallsSlider;

const cohesion = 0.005;
const avoidance = 0.05;
const alignment = 0.05;
const walls = 1;
const speed = 6;


function setup() {
    createCanvas(width, height);

    // cohesionSlider = createSlider(0, 0.01, 0.005, 0.001);
    // cohesionSlider.position(0, 40);
    //
    // avoidanceSlider = createSlider(0, 0.1, 0.05, 0.01);
    // avoidanceSlider.position(0, 80);
    //
    // alignmentSlider = createSlider(0, 0.1, 0.05, 0.01);
    // alignmentSlider.position(0, 120);
    //
    // wallsSlider = createSlider(0.01, 10, 1, 0);
    // wallsSlider.position(0, 160);
    //
    // speedSlider = createSlider(0, 20, 6, 1);
    // speedSlider.position(0, 200);

    resetBoids();
    resetGraph();
}

function draw() {
    background("#fafaf7");
    let root = createQuadTree();
    //drawQuadtree(root); //TODO save as graphic

    drawTrails();
    drawBoids();
    drawGraph();


    if (speed > 0) {
        updateBoids(root);
        updateForces(root);
        applyForces();
    }


    stepSize = getStepSize(Vertex.getEnergy(vertices));
}

function reset() {
    resetBoids();
    resetGraph();
}

function resetBoids() {
    boids = [];
    for (let i = 0; i < numBoids; i++) {
        boids.push(new Boid(Math.random() * width, Math.random() * height));
    }
}

function resetGraph() {
    vertices = [];
    edges = [];

    for (let i = 0; i < numVertices; i++) {
        vertices.push(new Vertex());
    }

    for (const v of vertices) {
        v.randPosition(width, height);
    }

    for (let i = 0; i < vertices.length; i++) {
        let r = Math.floor(Math.random() * (vertices.length));
        if (r !== i && !vertices[i].neighbors.includes(vertices[r])) {
            vertices[i].addNeighbor(vertices[r]);
            edges.push({
                u: vertices[i],
                v: vertices[r]
            });
        }
    }


    // g.xSorted = this.sortVerticesX(g.vertices);
    // g.ySorted = this.sortVerticesY(g.vertices);
    // g.extremes = this.getExtremes(g.xSorted, g.ySorted);
}

function drawQuadtree(root) {
    let rects = root.draw();

    if (oldQuads.length > 9) {
        oldQuads.shift();
    }
    oldQuads.push(rects);

    let quadsDrawn = new Set();

    noFill();
    strokeWeight(1);
    for (let i = oldQuads.length - 1; i >= 0; i--) {
        const opacity = i / 9.0;
        stroke(220, opacity * 255);
        for (const q of oldQuads[i]) {
            if (quadsDrawn.has(q)) {
                continue;
            }
            quadsDrawn.add(q);

            rect(q.x, q.y, q.r * 2, q.r * 2);
        }
    }
}

function drawTrails() {
    for (const boid of boids) {
        noFill();
        stroke(150);
        strokeWeight(0.5);
        beginShape();
        for (const point of boid.trail) {
            vertex(point.x, point.y);
        }
        endShape();
    }
}

function drawBoids() {
    fill(150);
    for (const boid of boids) {
        boid.drawBoid();
    }

    // noFill();
    // for (const boid of boids) {
    //     circle(boid.x, boid.y, boidRange);
    // }
}

function drawGraph() {
    for (const v of vertices) {
        v.draw();
    }

    stroke(150);
    for (const e of edges) {
        line(e.u.x, e.u.y, e.v.x, e.v.y);
    }
}

function updateBoids(root) {
    for (const boid of boids) {
        boid.setAcceleration(boids, root);
        boid.update();
    }
}

function createQuadTree() {
    let maxDim = Math.max(window.innerHeight, window.innerWidth);
    let root = new QuadTree(maxDim * 2, window.innerWidth / 2, window.innerHeight / 2);

    for (const boid of boids) {
        root.insert(boid)
    }

    for (const v of vertices) {
        root.insert(v);
    }

    root.getCenterOfMass();

    return root;
}

function getStepSize(energy) {
    return Math.max(Math.min(512 / energy, Math.min(2 ** -16 * energy, 0.01)), 0);
}

function updateForces(root) {
    for (const v of vertices) {
        if (stepSize <= 0) break;
        let f = {x: 0, y: 0};

        for (const u of v.neighbors) {
            const fa = Vertex.attractiveForce(u, v, K);
            f.x += fa.x;
            f.y += fa.y;
        }

        const fr = Vertex.repulsiveForce(v, C, K, theta, root);

        const gravity = {x: width / 2 - v.x, y: height / 2 - v.y};

        f.x += fr.x + gravity.x * G;
        f.y += fr.y + gravity.y * G;
        v.f = f;
    }
}

function applyForces() {
    for (const v of vertices) {
        v.applyForce(stepSize);
    }
}


window.onmousedown = (e) => {
    if (e.button === 1) {
        e.preventDefault();
        reset();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    width = windowWidth;
    height = windowHeight;
}