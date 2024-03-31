import p5 from "p5";

import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";
import { ProtoStyle } from "./ProtoStyle";

export class VerletStrand_2N {
    p: p5;
    head: p5.Vector;
    tail: p5.Vector | undefined;
    nodeCount: number;
    style: ProtoStyle;
    // col: p5.Color;
    // strokeWt: number;

    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];

    stickTensionRange: p5.Vector;

    //Hydrozoa(p, 30, new p5.Vector(-50, 0, 0), new p5.Vector(50, 0, 0), new p5.Vector(.6, .8), new ProtoStyle(p, p.color(150, 75, 20), p.color(255, 200, 200), 2, 2));


    constructor(p: p5, head: p5.Vector, tail: p5.Vector, nodeCount: number, stickTensionRange: p5.Vector = p.createVector(.01, .3), style: ProtoStyle = new ProtoStyle(p, p.color(127, 127, 127), p.color(25, 25, 25), 1, 3)) {
        this.p = p;
        this.head = head;
        this.tail = tail;
        this.stickTensionRange = stickTensionRange;
        this.style = style;

        let strandVector = this.tail.copy().sub(this.head);

        let strandVectorNormalized = strandVector.copy().normalize();
        let len = this.tail.copy().sub(this.head).mag();
        this.nodeCount = nodeCount;
        // this.col = col;
        // this.strokeWt = strokeWt;



        const lenSeg = len / nodeCount;
        for (let i = 0; i <= nodeCount; i++) {
            let n: p5.Vector | undefined;
            if (i == 0) {
                n = head;
            } else if (i == this.nodeCount) {
                n = tail;
            } else {
                const x = this.head.x + strandVectorNormalized.x * lenSeg * i;
                const y = this.head.y + strandVectorNormalized.y * lenSeg * i;
                const z = this.head.z + strandVectorNormalized.z * lenSeg * i;
                n = p.createVector(x, y, z);
            }
            this.nodes[i] = new VerletNode(p, n, this.style.radius, this.style.fillCol);
            if (i > 0) {
                this.sticks.push(new VerletStick(p, this.nodes[i - 1], this.nodes[i], p.random(this.stickTensionRange.x, this.stickTensionRange.y), 0, this.style.strokeCol));
            }
        }

        // for (let i = 0; i < this.nodes.length - 1; i++) {
        //     this.sticks.push(new VerletStick(p, this.nodes[i], this.nodes[i + 1], p.random(this.stickTension.x, this.stickTension.y), 0, this.style.strokeCol));
        // }
    }

    // this doesn't due anything if I don't update Sticks
    setStickTensionRange(stickTensionRange: p5.Vector): void {
        this.stickTensionRange = stickTensionRange;
    }



    // move(bounds?: p5.Vector): void {
    //     let lockedNode = 0;
    //     for (let i = 0; i < this.nodeCount; i++) {
    //         // this.nodes[i].verlet();
    //         if (lockedNode == 0) {
    //             if (i > 0) {
    //                 this.nodes[i].verlet();
    //                 this.sticks[i - 1].constrainLen();

    //             }
    //             if (bounds) {
    //                 this.nodes[i].boundsCollide(bounds);
    //             }
    //         }
    //         else if (lockedNode == 1) {
    //             if (i < this.nodes.length - 2) {
    //                 this.nodes[i].verlet();
    //                 this.sticks[i].constrainLen();

    //             }
    //             if (bounds) {
    //                 this.nodes[i].boundsCollide(bounds);
    //             }
    //         }

    //     }
    // }
    move(bounds?: p5.Vector): void {
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes[i].verlet();
            if (bounds) {
                this.nodes[i].boundsCollide(bounds);
            }
        }

        for (let i = 0; i < this.sticks.length; i++) {
            this.sticks[i].constrainLen();
        }
    }

    move2(bounds?: p5.Vector): void {
        for (let i = 0; i < this.nodeCount; i++) {
            if (i > 0) {
                this.nodes[i].verlet();
            }
            if (bounds) {
                this.nodes[i].boundsCollide(bounds);
            }
        }

        for (let i = 0; i < this.sticks.length; i++) {
            this.sticks[i].constrainLen();
        }
    }


    draw(isNodeDrawable: boolean = false, isStickDrawable: boolean = true,
        style: ProtoStyle = new ProtoStyle(this.p, this.p.color(150, 75, 20), this.p.color(255, 200, 200), .85, 2)): void {
        //  this.p.strokeWeight(this.style.strokeWt);
        for (let i = 0; i < this.nodeCount; i++) {
            if (isNodeDrawable) {
                this.p.fill(style.fillCol);
                this.p.noStroke();
                this.nodes[i].draw();
                // this.nodes[i].set
            }
            if (i > 0 && isStickDrawable) {
                this.p.stroke(style.strokeCol);
                this.p.strokeWeight(style.strokeWt);
                this.p.noFill();
                this.sticks[i - 1].draw();
            }
        }
    }

}