class Boid {

    x;
    y;
    vx;
    vy;

    drawing;
    trail;
    trailDrawing;

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
        //this.updateTrail();
    }

    // updateTrail() {
    //     this.trail.push(new Two.Anchor(this.x, this.y, this.x, this.y, this.x, this.y));
    //     if (this.trail.length > 15) {
    //         this.trail.shift();
    //     }
    // }

    getHeadPoints() {
        const v = new Two.Vector(this.vx, this.vy);
        v.normalize();
        v.multiplySelf(10);
        const sharpness = 4;
        const p0 = new Two.Vector(sharpness, sharpness);
        const p1 = new Two.Vector(0, 0);
        const p2 = new Two.Vector(-sharpness, sharpness);
        const p3 = new Two.Vector(0, -10);

        return [p0, p1, p2, p3];
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
        if (this.x > innerWidth - padding) {
            this.vx -= c;
        }
        if (this.y < padding) {
            this.vy += c;
        }
        if (this.y > innerHeight - padding) {
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