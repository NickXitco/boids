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
        if (this.trail.length > 75) {
            this.trail.shift();
        }
    }

    getAcceleration(boids) {
        let vx = 0;
        let vy = 0;

        let inRange = this.getInRange(boids);
        if (inRange.length === 0) return {x: vx, y: vy};

        let cohesion = this.cohesion(inRange);
        let alignment = this.alignment(inRange);
        let avoidance = this.avoidance(inRange);

        vx += cohesion.x;
        vy += cohesion.y;

        vx += alignment.x;
        vy += alignment.y;

        vx += avoidance.x;
        vy += avoidance.y;

        const mag = Math.hypot(vx, vy);
        const vLimit = 5;
        if (mag > vLimit) {
            vx = (vx / mag) * vLimit;
            vy = (vy / mag) * vLimit;
        }

        if (this.x < 10) {
            vx += 0.5;
        }
        if (this.x > 790) {
            vx -= 0.5;
        }
        if (this.y < 10) {
            vy += 0.5;
        }
        if (this.y > 790) {
            vy -= 0.5;
        }



        return {x: vx, y: vy};
    }

    cohesion(boids) {
        let centerX = boids.reduce((acc, cur) => acc + cur.x, 0) / boids.length;
        let centerY = boids.reduce((acc, cur) => acc + cur.y, 0) / boids.length;
        return {x: (centerX - this.x) / 1000, y: (centerY - this.y) / 1000};
    }

    alignment(boids) {
        let centerX = boids.reduce((acc, cur) => acc + cur.vx, 0) / boids.length;
        let centerY = boids.reduce((acc, cur) => acc + cur.vy, 0) / boids.length;
        return {x: (centerX - this.vx) / 8, y: (centerY - this.vy) / 8};
    }

    avoidance(boids) {
        let centerX = boids.reduce((acc, cur) => acc + (-(cur.x - this.x)), 0);
        let centerY = boids.reduce((acc, cur) => acc + (-(cur.y - this.y)), 0);

        return {x: centerX / 5000, y: centerY / 5000};
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