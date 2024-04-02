import P5 from "p5";
import { VerletNode } from "./VerletNode";

export class VerletStick {
    p: P5;
    start: VerletNode;
    end: VerletNode;
    stickTension: number;
    anchorTerminal: number;
    col: P5.Color;

    len: number;

    constructor(p: P5, start: VerletNode, end: VerletNode, stickTension: number = .5, anchorTerminal: number = 0, col: P5.Color = p.color(200, 225, 200)) {
        this.p = p;
        this.start = start;
        this.end = end;
        this.len = this.start.pos.dist(this.end.pos);
        this.stickTension = stickTension;
        this.anchorTerminal = anchorTerminal;
        this.col = col;
    }

    constrainLen(): void {
        let accuracyCount = 10;
        for (let i = 0; i < accuracyCount; i++) {
            let delta = this.p.createVector(
                this.end.pos.x - this.start.pos.x,
                this.end.pos.y - this.start.pos.y,
                this.end.pos.z - this.start.pos.z
            );
            let deltaLength = delta.mag();
            let node1ConstrainFactor = 0;
            let node2ConstrainFactor = 0;

            switch (this.anchorTerminal) {
                case 0:
                    node1ConstrainFactor = 0.5;
                    node2ConstrainFactor = 0.5;
                    break;
                case 1:
                    node1ConstrainFactor = 0.0;
                    node2ConstrainFactor = 1.0;
                    break;
                case 2:
                    node1ConstrainFactor = 1.0;
                    node2ConstrainFactor = 0.0;
                    break;
                case 3:
                    node1ConstrainFactor = 0.0;
                    node2ConstrainFactor = 0.0;
                    break;
                default:
                    node1ConstrainFactor = 0.5;
                    node2ConstrainFactor = 0.5;
            }

            let difference = (deltaLength - this.len) / deltaLength;
            this.start.pos.x += delta.x * (node1ConstrainFactor * this.stickTension * difference);
            this.start.pos.y += delta.y * (node1ConstrainFactor * this.stickTension * difference);
            this.start.pos.z += delta.z * (node1ConstrainFactor * this.stickTension * difference);
            this.end.pos.x -= delta.x * (node2ConstrainFactor * this.stickTension * difference);
            this.end.pos.y -= delta.y * (node2ConstrainFactor * this.stickTension * difference);
            this.end.pos.z -= delta.z * (node2ConstrainFactor * this.stickTension * difference);
        }
    }

    nudge(index: number, offset: P5.Vector): void {
        if (index == 0) {
            this.start.nudge(offset);
        } else {
            this.end.nudge(offset);
        }
    }

    draw(): void {
        //draw stick
        this.p.stroke(this.col);
        this.p.noFill();
        this.p.beginShape();
        this.p.vertex(this.start.pos.x, this.start.pos.y, this.start.pos.z);
        this.p.vertex(this.end.pos.x, this.end.pos.y, this.end.pos.z);
        this.p.endShape();
    }

    boundsCollide(bounds: P5.Vector): void {
        this.start.boundsCollide(bounds);
        this.end.boundsCollide(bounds);
    }

    setColor(col: P5.Color): void {
        this.col = col;
    }

    setOpacity(alpha: number): void {
        // to do
    }

    setVisibility(isVisible: boolean) {
        // to do
    }

    reinitializeLen(): void {
        this.len = this.start.pos.dist(this.end.pos);
    }

}