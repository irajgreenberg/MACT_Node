import p5 from "p5";
import { VerletBase } from "./VerletBase";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";
import { VerletStrand } from "./VerletStrand";
import { VerletStyle } from "./VerletStyle";

export class VerletBlob extends VerletBase {

    pos: p5.Vector;
    nodeCount: number; // force even
    radius: number
    centroid: p5.Vector;

    crossSupports: VerletStick[] = [];
    strands: VerletStrand[] = [];

    constructor(p: p5, pos: p5.Vector, nodeCount: number, radius: number, elasticity: number, fillCol: p5.Color, style: VerletStyle) {
        super(p, p.createVector(radius * 2, radius * 2, radius * 2), elasticity, fillCol, style);
        this.pos = pos;
        this.nodeCount = (nodeCount % 2) == 0 ? nodeCount : nodeCount + 1; // ensure even
        this.radius = radius;
        this.centroid = p.createVector(0, 0, 0);

        this.init();
    }

    init(): void {
        let theta = 0;
        // create nodes
        //console.log("nodeCount = ", this.nodeCount);
        for (let i = 0; i < this.nodeCount; i++) {
            const x = this.pos.x + this.p.cos(theta) * this.radius;
            const y = this.pos.y + this.p.sin(theta) * this.radius;
            const z = this.pos.z = 0;
            this.nodes.push(new VerletNode(this.p, this.p.createVector(x, y, z), this.style.nodeRadius, this.style.nodeCol));
            theta += this.p.TWO_PI / this.nodeCount;
        }

        // create sticks
        for (let i = 0; i < this.nodes.length - 1; i++) {
            this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[i + 1], .05, 0, this.style.stickCol));
        }
        // close form
        this.sticks.push(new VerletStick(this.p, this.nodes[this.nodes.length - 1], this.nodes[0], this.elasticity, 0, this.style.stickCol));


        // cross-supports
        for (let i = 0; i < this.nodes.length / 2; i++) {
            this.crossSupports.push(new VerletStick(this.p, this.nodes[i], this.nodes[this.nodes.length / 2 + i], this.elasticity, 0, this.p.color(this.p.random(120, 230), this.p.random(120, 230), this.p.random(120, 230), 220)));
        }


        // add tendrils
        for (let i = 0; i < this.nodes.length; i++) {
            this.strands.push(new VerletStrand(this.p, this.nodes[i].pos, this.p.random(50, 600), this.p.random(5, 25), this.p.color(this.p.random(0, 220), this.p.random(0, 220), this.p.random(0, 220), 4), this.p.random(.25, 12), this.p.createVector(.3, .009)));
        }
    }

    draw() {

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].verlet();
            this.nodes[i].draw();

            this.sticks[i].draw();
            this.sticks[i].constrainLen();

            this.strands[i].draw();
            this.strands[i].move();
        }

        for (let i = 0; i < this.crossSupports.length; i++) {
            this.crossSupports[i].draw();
            this.crossSupports[i].constrainLen();
        }

    }

}
