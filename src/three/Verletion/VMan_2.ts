// VMan2
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

import { Color, Group, Vector3 } from "three";
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, cos, sin } from "../libPByte_3/IJGUtils";
import { VerletFace4 } from "../libPByte_3/VerletFace4";
import { VerletFace3 } from "../libPByte_3/VerletFace3";
import { VerletGeometryBase } from "../libPByte_3/VerletGeometryBase";
import { VerletNode } from "../libPByte_3/VerletNode";
import { VerletStick } from "../libPByte_3/VerletStick";
import { VerletBase } from "../libPByte_3/VerletBase";

export class VMan_2 extends VerletBase {

    // overall position
    pos: Vector3;
    // overall dimensions
    dim: Vector3;

    // vertical body segments
    vSegCount: number;

    // TO DO
    // manType: VManType
    pts: Vector3[] = [
        new Vector3(750, 1137.5, 0),
        new Vector3(707, 1204.5, 0),
        new Vector3(675, 1204.5, 0),
        new Vector3(652, 1162.5, 0),
        new Vector3(702, 1102.5, 0),
        new Vector3(696.16, 1042.88, 0),
        new Vector3(677.5, 945, 0),
        new Vector3(702, 877.5, 0),
        new Vector3(702, 725, 0),
        new Vector3(690, 607.5, 0),
        new Vector3(717, 502.5, 0),
        new Vector3(702, 420.5, 0),
        new Vector3(587, 447.5, 0),
        new Vector3(535, 377.5, 0),
        new Vector3(505, 332.5, 0),
        new Vector3(442, 319.5, 0),
        new Vector3(415, 297.5, 0),
        new Vector3(507.5, 297.5, 0),
        new Vector3(557, 347.5, 0),
        new Vector3(595, 387.5, 0),
        new Vector3(655, 369.5, 0),
        new Vector3(720, 334.5, 0),
        new Vector3(777.5, 332.5, 0),
        new Vector3(777.5, 297.5, 0),
        new Vector3(745, 214.5, 0),
        new Vector3(757, 179.5, 0),
        new Vector3(817, 157.5, 0),
        new Vector3(847, 182.5, 0),
        new Vector3(872.5, 225, 0),
        new Vector3(877, 282.5, 0),
        new Vector3(870, 330, 0),
        new Vector3(947, 369.5, 0),
        new Vector3(1000, 392.5, 0),
        new Vector3(1050, 352.5, 0),
        new Vector3(1077, 309.5, 0),
        new Vector3(1102, 297.5, 0),
        new Vector3(1160, 287.5, 0),
        new Vector3(1172, 309.5, 0),
        new Vector3(1107, 329.5, 0),
        new Vector3(1080, 374.5, 0),
        new Vector3(1015, 454.5, 0),
        new Vector3(932, 444.5, 0),
        new Vector3(910, 499.5, 0),
        new Vector3(920, 612.5, 0),
        new Vector3(932, 704.5, 0),
        new Vector3(920, 874.5, 0),
        new Vector3(942.5, 952.5, 0),
        new Vector3(920, 1079.5, 0),
        new Vector3(925, 1129.5, 0),
        new Vector3(952, 1182.5, 0),
        new Vector3(942.5, 1204.5, 0),
        new Vector3(892.5, 1217.5, 0),
        new Vector3(885, 1154.5, 0),
        new Vector3(882.5, 1070, 0),
        new Vector3(862.52, 952.07, 0),
        new Vector3(849.89, 877.52, 0),
        new Vector3(828.5, 776.91, 0),
        new Vector3(789.5, 764, 0),
        new Vector3(762, 902.5, 0),
        new Vector3(757.14, 955.2, 0),
        new Vector3(750, 1032.5, 0),
        new Vector3(750, 1137.5, 0),
    ];

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

        // let segHt = this.dim.y / this.vSegCount;

        // let x1 = -this.dim.x / 2;
        // let x2 = this.dim.x / 2;
        // let y = this.dim.y / 2;

        for (let i = 0; i < this.pts.length; i++) {
            this.nodes.push(new VerletNode(new Vector3((this.pts[i].x - 787.5) * .45, (-this.pts[i].y + 680.75) * .45, this.pts[i].z), 2, new Color(1, .6, .6)));
        }

        for (let i = 0; i < this.nodes.length; i++) {
            if (i > 0) {
                this.sticks.push(new VerletStick(this.nodes[i - 1], this.nodes[i]));
            } else { this.sticks.push(new VerletStick(this.nodes[this.nodes.length - 1], this.nodes[0], .003)); }

        }

        for (let i = 0, k = 0; i < this.nodes.length; i++) {
            for (let j = i; j < this.nodes.length; j++) {
                if (i != j && k++ % 14 == 0) {
                    this.crossSupports.push(new VerletStick(this.nodes[i], this.nodes[j], .9));
                }
            }
        }

        // for (let i = 0, j = 0; i < this.nodes.length; i++, j += 2) {
        //     if (j > 0 && j < this.nodes.length - 1) {
        //         this.sticks.push(new VerletStick(this.nodes[j - 2], this.nodes[j - 2 + 1]));
        //         this.sticks.push(new VerletStick(this.nodes[j - 2], this.nodes[j]));
        //         this.sticks.push(new VerletStick(this.nodes[j - 1], this.nodes[j + 1]));
        //         this.crossSupports.push(new VerletStick(this.nodes[j - 2], this.nodes[j + 1]));
        //         this.crossSupports.push(new VerletStick(this.nodes[j - 1], this.nodes[j]));
        //     } else if (j > 0 && j <= this.nodes.length) {
        //         this.sticks.push(new VerletStick(this.nodes[j - 2], this.nodes[j - 2 + 1]));
        //     }
        // }


        // // add 1 cross-support
        // this.crossSupports.push(new VerletStick(this.nodes[0], this.nodes[this.nodes.length - 1]));
        // this.crossSupports.push(new VerletStick(this.nodes[1], this.nodes[this.nodes.length - 2]));


        // adds node and stick geometry to scenegraph
        this.draw(false, true, false);

        // start Verlet integration
        for (let i = 0; i < this.nodes.length; i++) {
            this.nudge(i, new Vector3(randFloat(-1.5, 1.5), randFloat(-1.5, 1.5), randFloat(-1.5, 1.5)));
        }
    }

    constrainBounds(bounds: Vector3): void {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].constrainBounds(bounds);
        }

    }

}


