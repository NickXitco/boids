class QuadTree {
    a
    b
    c
    d

    r
    x
    y

    node

    centerOfMass

    constructor(r, x, y) {
        this.a = null;
        this.b = null;
        this.c = null;
        this.d = null;

        this.r = r;
        this.x = x;
        this.y = y;

        this.node = null;

        this.centerOfMass = {x: 0, y: 0, s: 0};
    }

    insert(node) {
        if (!this.inBounds(node)) {
            return false;
        }

        if (!this.node && !this.a) {
            this.node = node;
            return true;
        }

        if (!this.a) {
            this.split();
        }

        if (this.a.insert(node)) return true;
        if (this.b.insert(node)) return true;
        if (this.c.insert(node)) return true;
        if (this.d.insert(node)) return true;        // noinspection RedundantIfStatementJS

        return false;
    }

    split() {
        const half = this.r / 2;
        this.a = new QuadTree(half, this.x - half, this.y - half);
        this.b = new QuadTree(half, this.x + half, this.y - half);
        this.c = new QuadTree(half, this.x - half, this.y + half);
        this.d = new QuadTree(half, this.x + half, this.y + half);

        this.a.insert(this.node);
        this.b.insert(this.node);
        this.c.insert(this.node);
        this.d.insert(this.node);

        this.node = null;
    }

    getNodesInRange(l1, r1) {
        let points = [];
        if (!this.boundaryIntersect(l1, r1)) {
            return points;
        }

        if (this.node) {
            points.push(this.node);
        }

        if (!this.a) {
            return points;
        }

        points = points.concat(this.a.getNodesInRange(l1, r1));
        points = points.concat(this.b.getNodesInRange(l1, r1));
        points = points.concat(this.c.getNodesInRange(l1, r1));
        points = points.concat(this.d.getNodesInRange(l1, r1));

        return points;
    }

    inBounds(node) {
        return node.x < this.x + this.r && node.y < this.y + this.r && node.x >= this.x - this.r && node.y >= this.y - this.r;
    }

    boundaryIntersect(l1, r1) {
        const l2 = {x: this.x - this.r, y: this.y - this.r};
        const r2 = {x: this.x + this.r, y: this.y + this.r};

        return !((l1.x >= r2.x || l2.x >= r1.x) || (l1.y > r2.y || l2.y > r1.y));
    }

    draw() {
        let rects = [{x: this.x - this.r, y: this.y - this.r, r: this.r}];
        if (this.a) {
            rects = rects.concat(this.a.draw());
            rects = rects.concat(this.b.draw());
            rects = rects.concat(this.c.draw());
            rects = rects.concat(this.d.draw());
        }
        return rects;
    }


    getCenterOfMass() {
        if (!this.a) {
            if (this.node === null) {
                return this.centerOfMass;
            }
            this.centerOfMass = {x: this.node.x, y: this.node.y, s: 1};
        } else {
            const aMass = this.a.getCenterOfMass();
            const bMass = this.b.getCenterOfMass();
            const cMass = this.c.getCenterOfMass();
            const dMass = this.d.getCenterOfMass();

            this.centerOfMass.s = aMass.s + bMass.s + cMass.s + dMass.s;
            this.centerOfMass.x = (aMass.x * aMass.s + bMass.x * bMass.s + cMass.x * cMass.s + dMass.x * dMass.s) / this.centerOfMass.s;
            this.centerOfMass.y = (aMass.y * aMass.s + bMass.y * bMass.s + cMass.y * cMass.s + dMass.y * dMass.s) / this.centerOfMass.s;

            // if (aMass.s > 0) line(this.centerOfMass.x, this.centerOfMass.y, aMass.x, aMass.y);
            // if (bMass.s > 0) line(this.centerOfMass.x, this.centerOfMass.y, bMass.x, bMass.y);
            // if (cMass.s > 0) line(this.centerOfMass.x, this.centerOfMass.y, cMass.x, cMass.y);
            // if (dMass.s > 0) line(this.centerOfMass.x, this.centerOfMass.y, dMass.x, dMass.y);
        }

        // fill(0, 127, 255, 50);
        // stroke(0, 127, 255, 75);
        // circle(this.centerOfMass.x, this.centerOfMass.y, 1.5 * this.centerOfMass.s);
        // fill(255, 255, 255, 255);
        // textSize(0.3 * this.centerOfMass.s);
        // textAlign(CENTER, CENTER);
        // text(this.centerOfMass.s, this.centerOfMass.x, this.centerOfMass.y);

        return this.centerOfMass;
    }

    getSupernodes(v, theta, supernodes) {

        if (!this.a && this.node === null) {return;}
        if (this.node === v) {return;}
        if (!this.a && this.node !== null) {supernodes.push(this); return;}

        const diameter = this.r * 2;
        const distance = Math.sqrt((v.x - this.centerOfMass.x) ** 2 + (v.y - this.centerOfMass.y) ** 2);

        if (diameter / distance <= theta) {
            supernodes.push(this);
            return;
        }

        this.a.getSupernodes(v, theta, supernodes);
        this.b.getSupernodes(v, theta, supernodes);
        this.c.getSupernodes(v, theta, supernodes);
        this.d.getSupernodes(v, theta, supernodes);
    }

    static getSupernodes(v, theta, root) {
        let supernodes = [];
        root.getSupernodes(v, theta, supernodes);
        return supernodes;
    }
}