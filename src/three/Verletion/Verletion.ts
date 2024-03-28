// Verletion
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

import { Group, Vector3 } from "three";
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, cos, sin } from "../PByte3/IJGUtils";
import { VerletFace4 } from "../PByte3/VerletFace4";

export class Verletion extends Group {

    p1: VerletFace4;
    pos: Vector3;
    dim: Vector3;



    constructor(pos: Vector3, dim: Vector3) {
        super();
        this.pos = pos;
        this.dim = dim;
        let vecs: Vector3[] = [];
        let theta = PI / 4;
        for (let i = 0; i < 4; i++) {
            vecs.push(new Vector3(cos(theta) * this.dim.x, sin(theta) * this.dim.y, 0));
            theta += TWO_PI / 4;
        }
        this.p1 = new VerletFace4(vecs, .03);
        this.add(this.p1);
        this.create();
    }

    create() {
    }

    verlet(): void {
        this.p1.verlet();
        this.p1.constrain(new Vector3(300, 300, 300));
    }
}


