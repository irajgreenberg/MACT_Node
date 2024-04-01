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

    // vertical body segments
    vSegCount: number;

    // TO DO
    // manType: VManType

    constructor(pos: Vector3, dim: Vector3, vSegCount: number) {
        super();
        this.pos = pos;
        this.dim = dim;
        this.vSegCount = vSegCount;

        this._init();
    }

    _init(): void {
        // calculate basic man geometry
        // vertices
        let vecs: Vector3[] = [];

        let segHt = this.dim.y / this.vSegCount;

        let x1 = -this.dim.x / 2;
        let x2 = this.dim.x / 2;
        let y = this.dim.y / 2;

        for (let i = 0; i <= this.vSegCount; i++) {
            this.nodes.push(new VerletNode(new Vector3(x1, y - segHt * i, this.dim.z / 2), 4));
            this.nodes.push(new VerletNode(new Vector3(x2, y - segHt * i, this.dim.z / 2), 4));
        }

        for (let i = 0, j = 0; i < this.nodes.length; i++, j += 2) {
            if (j > 0 && j < this.nodes.length - 1) {
                this.sticks.push(new VerletStick(this.nodes[j - 2], this.nodes[j - 2 + 1]));
                this.sticks.push(new VerletStick(this.nodes[j - 2], this.nodes[j]));
                this.sticks.push(new VerletStick(this.nodes[j - 1], this.nodes[j + 1]));
                this.crossSupports.push(new VerletStick(this.nodes[j - 2], this.nodes[j + 1]));
                this.crossSupports.push(new VerletStick(this.nodes[j - 1], this.nodes[j]));
            } else if (j > 0 && j <= this.nodes.length) {
                this.sticks.push(new VerletStick(this.nodes[j - 2], this.nodes[j - 2 + 1]));
            }
        }


        // add 1 cross-support
        this.crossSupports.push(new VerletStick(this.nodes[0], this.nodes[this.nodes.length - 1]));
        this.crossSupports.push(new VerletStick(this.nodes[1], this.nodes[this.nodes.length - 2]));


        // adds node and stick geometry to scenegraph
        this.draw(false, true, false);

        // start Verlet integration
        for (let i = 0; i < this.nodes.length; i++) {
            this.nudge(i, new Vector3(randFloat(-6, 6), randFloat(-6, 6), randFloat(-6, 6)));
        }
    }

    constrainBounds(bounds: Vector3): void {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].constrainBounds(bounds);
        }

    }

}


