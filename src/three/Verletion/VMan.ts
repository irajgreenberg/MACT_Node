// VMan
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

import { Group, Vector3 } from "three";
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, cos, sin } from "../libPByte_3/IJGUtils";
import { VerletFace4 } from "../libPByte_3/VerletFace4";
import { VerletFace3 } from "../libPByte_3/VerletFace3";
import { VerletGeometryBase } from "../libPByte_3/VerletGeometryBase";
import { VerletNode } from "../libPByte_3/VerletNode";
import { VerletStick } from "../libPByte_3/VerletStick";
import { VerletBase } from "../libPByte_3/VerletBase";

export class Vman extends VerletBase {

    // overall position
    pos: Vector3;
    // overall dimensions
    dim: Vector3;

    // TO DO
    // manType: VManType

    constructor(pos: Vector3, dim: Vector3) {
        super();
        this.pos = pos;
        this.dim = dim;
        this._init();
    }

    _init(): void {
        // calculate basic man geometry
        // vertices
        let vecs: Vector3[] = [];
        let theta = PI / 4;
        for (let i = 0; i < 4; i++) {
            vecs.push(new Vector3(cos(theta) * this.dim.x, sin(theta) * this.dim.y, 0));
            this.nodes.push(new VerletNode(vecs[i], 4));

            if (i > 0) {
                this.sticks.push(new VerletStick(this.nodes[i - 1], this.nodes[i]));
            }
            theta += TWO_PI / 4;
        }
        // close form
        this.sticks.push(new VerletStick(this.nodes[this.nodes.length - 1], this.nodes[0]));

        // add 1 cross-support
        this.crossSupports.push(new VerletStick(this.nodes[this.nodes.length - 1], this.nodes[1]));

        // adds node and stick geometry to scenegraph
        this.draw(false, true, true);

        // start Verlet integration
        this.nudge(0, new Vector3(.5, 0, 0));
    }

}


