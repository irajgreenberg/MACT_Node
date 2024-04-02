import P5 from "p5";

export class VerletNode {

	p: P5;
	pos: P5.Vector;
	radius: number | P5.Vector;
	col: P5.Color;
	radiusOld: number | P5.Vector;
	posOld: P5.Vector;

	offset: P5.Vector | undefined;

	isEllipsoid: boolean = false;

	constructor(p: P5, pos: P5.Vector, radius: number | P5.Vector, col: P5.Color) {
		this.p = p;
		this.pos = pos;
		this.radius = radius;
		this.col = col;
		this.radiusOld = this.radius;
		this.posOld = p.createVector(pos.x, pos.y, pos.z); // need new address for refvariable
	}

	nudge(offset: P5.Vector): void {
		this.offset = offset;
		this.pos.add(this.offset);
	}

	//this is where the motion is calculated
	verlet() {
		var posTemp = this.p.createVector(this.pos.x, this.pos.y, this.pos.z);

		this.pos.x += (this.pos.x - this.posOld.x);
		this.pos.y += (this.pos.y - this.posOld.y);
		this.pos.z += (this.pos.z - this.posOld.z);

		this.posOld.set(posTemp);
	}

	draw(detail: number = 10): void {
		this.p.fill(this.col);
		this.p.noStroke();
		this.p.push();
		this.p.translate(this.pos.x, this.pos.y, this.pos.z);
		if (typeof this.radius === "number") {
			let rad =
				this.p.sphere(this.radius, detail, detail);
		} else {
			this.p.ellipsoid(this.radius.x, this.radius.y, this.radius.z, detail, detail);
		}


		//this.p.box(this.radius, this.radius, this.radius);
		this.p.pop();
		//this.p.noFill();
	}

	setStyle(radius: number, col: P5.Color): void {
		this.radius = radius;
		this.col = col;
	}

	boundsCollide(bounds: P5.Vector) {
		if (typeof (this.radius) === "number") {
			if (this.pos.x > bounds.x / 2 - this.radius) {
				this.pos.x = bounds.x / 2 - this.radius;
				this.pos.x -= 1;
			}
			else if (this.pos.x < -bounds.x / 2 + this.radius) {
				this.pos.x = -bounds.x / 2 + this.radius;
				this.pos.x += 1;
			}

			if (this.pos.y > bounds.y / 2 - this.radius) {
				this.pos.y = bounds.y / 2 - this.radius;
				this.pos.y -= 1;
			}
			else if (this.pos.y < -bounds.y / 2 + this.radius) {
				this.pos.y = -bounds.y / 2 + this.radius;
				this.pos.y += 1;
			}

			if (this.pos.z > bounds.z / 2 - this.radius) {
				this.pos.z = bounds.z / 2 - this.radius;
				this.pos.z -= 1;
			}
			else if (this.pos.z < -bounds.z / 2 + this.radius) {
				this.pos.z = -bounds.z / 2 + this.radius;
				this.pos.z += 1;
			}
		} else {
			if (this.pos.x > bounds.x / 2 - this.radius.x) {
				this.pos.x = bounds.x / 2 - this.radius.x;
				this.pos.x -= this.radius.x;
			}
			else if (this.pos.x < -bounds.x / 2 + this.radius.x) {
				this.pos.x = -bounds.x / 2 + this.radius.x;
				this.pos.x += this.radius.x;
			}

			if (this.pos.y > bounds.y / 2 - this.radius.y) {
				this.pos.y = bounds.y / 2 - this.radius.y;
				this.pos.y -= this.radius.y;
			}
			else if (this.pos.y < -bounds.y / 2 + this.radius.y) {
				this.pos.y = -bounds.y / 2 + this.radius.y;
				this.pos.y += this.radius.y;
			}

			if (this.pos.z > bounds.z / 2 - this.radius.z) {
				this.pos.z = bounds.z / 2 - this.radius.z;
				this.pos.z -= this.radius.z;
			}
			else if (this.pos.z < -bounds.z / 2 + this.radius.z) {
				this.pos.z = -bounds.z / 2 + this.radius.z;
				this.pos.z += this.radius.z;
			}

		}
	}

}

