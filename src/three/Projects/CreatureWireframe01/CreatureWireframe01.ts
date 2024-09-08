// CreatureWireframe01
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Class Description: 

import { Color, Group, Vector3 } from "three";
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos } from "../../libPByte_3/IJGUtils";
import { VerletNode } from "../../libPByte_3/VerletNode";
import { VerletStick } from "../../libPByte_3/VerletStick";
import { node } from "webpack";

export class CreatureWireframe01 extends Group {
    pos: Vector3;
    dim: Vector3;

    nodeCount: number = 20;
    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];

    constructor(pos: Vector3, dim: Vector3, nodeCount: number) {
        super();
        this.pos = pos;
        this.dim = dim;
        this.nodeCount = nodeCount;
        this.create();
    }

    create() {
        for (let i = 0; i < this.nodeCount; i++) {
            for (let j = i + 1; j < this.nodeCount; j++) {
                this.nodes.push(new VerletNode(new Vector3(randFloat(-this.dim.x / 2, this.dim.x / 2), randFloat(-this.dim.y / 2, this.dim.y / 2), randFloat(-this.dim.z / 2, this.dim.z / 2)), 2, new Color(1.0, 1.0, 1.0)));
                const k = i * this.nodeCount + j;
                // console.log(k);
                // this.nodes[this.nodes.length - 1].setNodeColor(new Color(.8, .4, .7));
                // this.nodes[this.nodes.length - 1].setNodeAlpha(1.0);
                this.add(this.nodes[this.nodes.length - 1])
                //  if (k % Math.floor(Math.random() * 3) === 0) {
                const m = this.nodes.length - 1;
                const n = randInt(0, this.nodes.length - 2);
                if (m !== n) {
                    this.sticks.push(new VerletStick(this.nodes[m], this.nodes[n], randFloat(.05, .07), randInt(0, 5)));
                    this.add(this.sticks[this.sticks.length - 1]);
                }
                //  }
            }
        }
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes[randInt(0, this.nodes.length - 1)].moveNode(new Vector3(randFloat(-60.5, 60.5), randFloat(-60.5, 60.5), randFloat(-60.5, 60.5)));
        }
    }

    move(time: number) {
        for (let n of this.nodes) {
            n.verlet();
            n.constrainBoundsNoCorrection(new Vector3(300, 300, 300));
        }

        for (let s of this.sticks) {
            s.constrainLen();
        }
    }
}


