import p5 from "p5";

export enum NodeType {
    RECT,
    CIRCLE,
    TRIANGLE,
    HEXAGON,
    OCTAGON,
    CUBE,
    SPHERE,
    ICOSAHEDRON,
    TOROID,
}

export enum ColorFamily {
    HOT_PINK,
    NEON_GREEN,
    LIGHT_RED,
    MEDIUM_RED,
    DARK_RED,
    LIGHT_GREEN,
    MEDIUM_GREEN,
    DARK_GREEN,
    LIGHT_BLUE,
    MEDIUM_BLUE,
    DARK_BLUE,
    LIGHT_YELLOW,
    MEDIUM_YELLOW,
    DARK_YELLOW,
    LIGHT_ORANGE,
    MEDIUM_ORANGE,
    DARK_ORANGE,
    LIGHT_PURPLE,
    MEDIUM_PURPLE,
    DARK_PURPLE,
    WHITE,
    BLACK,
    LIGHT_BROWN,
    MEDIUM_BROWN,
    DARK_BROWN,
    LIGHT_GRAY,
    MEDIUM_GRAY,
    DARK_GRAY,
}

export class PByte_globals {
    static grav: number = 0;
}

export class Phys {
    amplitude: number;
    freqency: number;
    elasticity: number;
    damping: number;
    friction: number;

    constructor(amplitude: number = 1, freqency: number = 1, elasticity: number = .5, damping: number = .75, friction: number = .75) {
        this.amplitude = amplitude;
        this.freqency = freqency;
        this.elasticity = elasticity;
        this.damping = damping;
        this.friction = friction;
    }
}

export class Dimension4 {

    minX: number;
    maxX: number;
    minY: number;
    maxY: number;

    constructor(minX: number, maxX: number, minY: number, maxY: number) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }
}
export class Box {
    pos: p5.Vector;
    dim: p5.Vector;

    constructor(pos: p5.Vector, dim: p5.Vector) {
        this.pos = pos;
        this.dim = dim;
    };
}

export class Part {
    p: p5
    pos: p5.Vector;
    posInit: p5.Vector;
    spd: p5.Vector;
    radius: number;
    spdInit: p5.Vector;
    damp: p5.Vector;
    turb: p5.Vector;
    amp: p5.Vector;
    freq: p5.Vector;

    theta: p5.Vector;

    constructor(p: p5, pos: p5.Vector, spd: p5.Vector, radius: number, damp: p5.Vector, turb: p5.Vector, amp: p5.Vector, freq: p5.Vector) {
        this.p = p;
        this.pos = pos;
        this.posInit = pos.copy();
        this.spd = spd;
        this.spdInit = spd.copy();
        this.radius = radius;
        this.damp = damp;
        this.turb = turb;
        this.amp = amp;
        this.freq = freq;
        this.theta = p.createVector(0, 0, 0)
    }

    move(): void {
        this.spd.x = this.spdInit.x + this.p.sin(this.theta.x) * this.amp.x;
        this.spd.y = this.spdInit.y + this.p.sin(this.theta.y) * this.amp.y;
        this.spd.z = this.spdInit.z + this.p.sin(this.theta.z) * this.amp.z;
        this.spd.y += PByte_globals.grav;
        this.pos.add(this.spd);
    }

    draw(): void {
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y, this.pos.z)
        this.p.pop();
    }

    collide(boundary: Box): void {
        if (this.pos.x > boundary.pos.x + boundary.dim.x / 2) {
            this.pos.x = boundary.pos.x + boundary.dim.x / 2;
            this.spd.x *= -1;
            this.spd.x *= this.damp.x;
        } else if (this.pos.x < boundary.pos.x - boundary.dim.x / 2) {
            this.pos.x = boundary.pos.x - boundary.dim.x / 2;
            this.spd.x *= -1;
            this.spd.x *= this.damp.x;
        }

        if (this.pos.y > boundary.pos.y + boundary.dim.y / 2) {
            this.pos.y = boundary.pos.y + boundary.dim.y / 2;
            this.spd.y *= -1;
            this.spd.y *= this.damp.y;
        } else if (this.pos.y < boundary.pos.y - boundary.dim.y / 2) {
            this.pos.y = boundary.pos.y - boundary.dim.y / 2;
            this.spd.y *= -1;
            this.spd.y *= this.damp.y;
        }

        if (this.pos.z > boundary.pos.z + boundary.dim.z / 2) {
            this.pos.z = boundary.pos.z + boundary.dim.z / 2;
            this.spd.z *= -1;
            this.spd.z *= this.damp.z;
        } else if (this.pos.z < boundary.pos.z - boundary.dim.z / 2) {
            this.pos.z = boundary.pos.z - boundary.dim.z / 2;
            this.spd.z *= -1;
            this.spd.z *= this.damp.z;
        }
    }
}