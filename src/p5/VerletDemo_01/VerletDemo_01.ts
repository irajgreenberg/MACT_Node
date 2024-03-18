// VerletDemo_01
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Class Description: 
// Verlet chain hanging form a stationary anchor point
// control postion, lenth and nodeCount


import p5 from "p5";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";

export class VerletDemo_01 {

    // instance fields
    p: p5
    anchorPt: p5.Vector;
    nodeCount: number = 5;
    len: number;
    radius: number;
    col: p5.Color;

    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];


    constructor(p: p5, anchorPt: p5.Vector, nodeCount: number, len: number, radius: number, col: p5.Color) {
        this.p = p;
        this.anchorPt = anchorPt;
        this.nodeCount = nodeCount;
        this.len = len;
        this.radius = radius;
        this.col = col;

        this.create();
    }

    create() {
        let stepLen = this.len / this.nodeCount;
        for (let i = 0; i < this.nodeCount; i++) {
            if (i == 0) {
                this.nodes.push(new VerletNode(this.p, this.anchorPt, this.radius, this.col));
            } else {
                this.nodes.push(new VerletNode(this.p, this.anchorPt.copy().add(new p5.Vector(1, stepLen * i, 1)), this.radius, this.col));
            }

            // connect nodes by sticks, if at least 2 have been created
            if (i > 0) {
                if (i == 1) {
                    this.sticks.push(new VerletStick(this.p, this.nodes[i - 1], this.nodes[i], .3, 1));
                } else {
                    this.sticks.push(new VerletStick(this.p, this.nodes[i - 1], this.nodes[i], .3));
                }
            }
        }
        this.nodes[this.nodes.length - 1].nudge(new p5.Vector(33, 20, 15))
    }

    move(time: number = 0) {
    }

    draw() {
        for (let i = 0; i < this.nodes.length; i++) {
            if (i > 0) {
                this.nodes[i].verlet();
            }
            this.nodes[i].draw();
        }
        for (let i = 0; i < this.sticks.length; i++) {
            this.sticks[i].constrainLen();
            this.sticks[i].draw();
        }

        // this.nodes[0].pos.x = this.p.sin(this.p.frameCount * this.p.PI / this.p.random(180, 300)) * 200;
    }
}


