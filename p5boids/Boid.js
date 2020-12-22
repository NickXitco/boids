class Boid {

    x;
    y;
    vx;
    vy;

    trail;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.trail = [];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.updateTrail();
    }

    updateTrail() {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 20) {
            this.trail.shift();
        }
    }

    getHeadPoints() {
        const v = new p5.Vector(this.vx, this.vy);
        const size = 10;
        v.normalize();
        v.mult(size);
        const sharpness = 1 / 20;
        const mod = sharpness * size;
        const p0 = new p5.Vector(this.x + mod * (-v.x + v.y), this.y + mod * (-v.y - v.x));
        const p1 = new p5.Vector(this.x, this.y);
        const p2 = new p5.Vector(this.x + mod * (-v.x - v.y), this.y + mod * (-v.y + v.x));
        const p3 = new p5.Vector(this.x + v.x, this.y + v.y);

        return [p0, p1, p2, p3];
    }

    drawBoid() {
        const p = this.getHeadPoints();
        beginShape();
        vertex(p[0].x, p[0].y);
        vertex(p[1].x, p[1].y);
        vertex(p[2].x, p[2].y);
        vertex(p[3].x, p[3].y);
        vertex(p[0].x, p[0].y);
        endShape();
    }

    setAcceleration(boids, root) {
        let inRange = this.getInRange(boids, root);
        this.avoidance(inRange);
        inRange = inRange.filter(node => node.trail);
        this.cohesion(inRange);
        this.alignment(inRange);
        this.maxSpeed();
        this.walls();
    }

    walls() {
        const padding = -50;
        const c = 1;

        if (this.x < padding) {
            this.vx += c;
        }
        if (this.x > width - padding) {
            this.vx -= c;
        }
        if (this.y < padding) {
            this.vy += c;
        }
        if (this.y > height - padding) {
            this.vy -= c;
        }
    }

    maxSpeed() {
        const mag = Math.hypot(this.vx, this.vy);
        const vLimit = speed;
        if (mag > vLimit) {
            this.vx = (this.vx / mag) * vLimit;
            this.vy = (this.vy / mag) * vLimit;
        }
    }

    cohesion(boids) {
        const c = cohesion;
        if (boids.length === 0) return;
        let centerX = boids.reduce((acc, cur) => acc + cur.x, 0) / boids.length;
        let centerY = boids.reduce((acc, cur) => acc + cur.y, 0) / boids.length;
        this.vx += (centerX - this.x) * c;
        this.vy += (centerY - this.y) * c;
    }

    alignment(boids) {
        const c = alignment;
        if (boids.length === 0) return;
        let centerX = boids.reduce((acc, cur) => acc + cur.vx, 0) / boids.length;
        let centerY = boids.reduce((acc, cur) => acc + cur.vy, 0) / boids.length;
        this.vx += (centerX - this.vx) * c;
        this.vy += (centerY - this.vy) * c;
    }

    avoidance(boids) {
        const dist = 20;
        const c = avoidance;

        let centerX = 0;
        let centerY = 0;

        for (const boid of boids) {
            if (Boid.distance(this, boid) < dist) {
                centerX += this.x - boid.x;
                centerY += this.y - boid.y;
            }
        }

        this.vx += centerX * c;
        this.vy += centerY * c;
    }

    static distance(b1, b2) {
        return Math.hypot(b1.x - b2.x, b1.y - b2.y);
    }

    getInRange(boids, root) {
        //TODO edit to account for angle

        const l1 = {x: this.x - boidRange, y: this.y - boidRange};
        const r1 = {x: this.x + boidRange, y: this.y + boidRange};

        const near = root.getNodesInRange(l1, r1);

        const inRange = [];
        for (const boid of near) {
            if (boid !== this && Math.hypot(boid.x - this.x, boid.y - this.y) < boidRange) {
                inRange.push(boid);
            }
        }
        return inRange;
    }

}