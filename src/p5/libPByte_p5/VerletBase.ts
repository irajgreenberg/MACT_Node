import P5 from "p5";
import { NodeType } from "./PByte_utils";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";
import { VerletStyle } from "./VerletStyle";
export abstract class VerletBase {

    p: P5;
    dim: P5.Vector;
    elasticity: number;
    fillCol: P5.Color;
    style: VerletStyle;

    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];
    nodes2D: VerletNode[][] = [];

    constructor(p: P5, dim: P5.Vector, elasticity: number, fillCol: P5.Color, style: VerletStyle =
        new VerletStyle(2, p.color(255, 127, 0), 255, NodeType.CIRCLE, p.color(50, 50, 50, 100), .5)) {
        this.p = p;
        this.dim = dim;
        this.elasticity = elasticity;
        this.fillCol = fillCol;
        this.style = style;

    }

    // Required subclass implementation
    abstract init(): void;

    verlet() {
        // for (let i = 0; i < this.nodes.length; i++) {
        //     this.nodes[i].verlet();
        // }

        for (let i = 0; i < this.sticks.length; i++) {
            // this.sticks[i].draw();
            // this.sticks[i].constrainLen();
        }
    }

    draw() {
    }


}