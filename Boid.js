class Boid {

    x;
    y;
    vx;
    vy;

    trail;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.trail = [];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.updateTrail();
    }

    updateTrail() {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 50) {
            this.trail.shift();
        }
    }

    drawBoid() {
        const c = 1;
        const d = Math.hypot(this.vx, this.vy) / 2;
        const p1 = {x: this.x +  this.vx * c, y: this.y +  this.vy * c};
        const p2 = {x: this.x +  this.vy / d, y: this.y + -this.vx / d};
        const p3 = {x: this.x + -this.vy / d, y: this.y +  this.vx / d};
        triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    }

    setAcceleration(boids) {
        let inRange = this.getInRange(boids);
        this.cohesion(inRange);
        this.avoidance(inRange);
        this.alignment(inRange);
        this.maxSpeed();
        this.walls();
    }

    walls() {
        const padding = 50;
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
        const vLimit = speedSlider.value();
        if (mag > vLimit) {
            this.vx = (this.vx / mag) * vLimit;
            this.vy = (this.vy / mag) * vLimit;
        }
    }

    cohesion(boids) {
        const c = cohesionSlider.value();
        if (boids.length === 0) return;
        let centerX = boids.reduce((acc, cur) => acc + cur.x, 0) / boids.length;
        let centerY = boids.reduce((acc, cur) => acc + cur.y, 0) / boids.length;
        this.vx += (centerX - this.x) * c;
        this.vy += (centerY - this.y) * c;
    }

    alignment(boids) {
        const c = alignmentSlider.value();
        if (boids.length === 0) return;
        let centerX = boids.reduce((acc, cur) => acc + cur.vx, 0) / boids.length;
        let centerY = boids.reduce((acc, cur) => acc + cur.vy, 0) / boids.length;
        this.vx += (centerX - this.vx) * c;
        this.vy += (centerY - this.vy) * c;
    }

    avoidance(boids) {
        const dist = 20;
        const c = avoidanceSlider.value();

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

    getInRange(boids) {
        //TODO edit to account for angle
        let inRange = [];
        for (const boid of boids) {
            if (boid !== this && Math.hypot(boid.x - this.x, boid.y - this.y) < 50) {
                inRange.push(boid);
            }
        }
        return inRange;
    }

}