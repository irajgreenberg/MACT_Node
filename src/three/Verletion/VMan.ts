// VMan
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

import { BufferAttribute, BufferGeometry, Color, Group, MeshBasicMaterial, Vector2, Vector3, Vector4 } from "three";
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, cos, sin } from "../libPByte_3/IJGUtils";
import { VerletFace4 } from "../libPByte_3/VerletFace4";
import { VerletFace3 } from "../libPByte_3/VerletFace3";
import { VerletGeometryBase } from "../libPByte_3/VerletGeometryBase";
import { VerletNode } from "../libPByte_3/VerletNode";
import { VerletStick } from "../libPByte_3/VerletStick";
import { VerletBase } from "../libPByte_3/VerletBase";

export class VMan extends VerletBase {

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

    //vecs: Float32Array | undefined;

    indices: number[] =
        [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 60,
            4, 5, 60,
            60, 5, 6,
            60, 6, 59,
            59, 6, 7,
            59, 7, 58,
            58, 7, 57,
            57, 7, 8,
            57, 8, 44,
            44, 8, 9,
            44, 9, 43,
            43, 9, 10,
            43, 10, 42,
            42, 10, 11,
            42, 11, 41,
            // left arm
            11, 21, 22,
            11, 20, 21,
            11, 12, 19,
            11, 19, 20,
            12, 13, 18,
            12, 18, 19,
            13, 14, 18,
            18, 14, 17,
            14, 15, 16,
            14, 16, 17,
            //neck
            11, 22, 30,
            11, 30, 41,
            //head
            30, 22, 23,
            30, 23, 29,
            29, 23, 24,
            29, 24, 28,
            28, 24, 25,
            28, 25, 27,
            27, 25, 26,
            //Right arm
            41, 30, 31,
            41, 31, 40,
            40, 31, 32,
            40, 32, 33,
            40, 33, 39,
            39, 33, 34,
            39, 34, 38,
            38, 34, 35,
            38, 35, 36,
            38, 36, 37,
            //right leg
            57, 44, 56,
            56, 44, 55,
            55, 44, 45,
            54, 55, 45,
            54, 45, 46,
            53, 54, 46,
            53, 46, 47,
            52, 53, 47,
            52, 47, 48,
            51, 52, 48,
            51, 48, 49,
            51, 49, 50
        ];


    constructor(pos: Vector3, dim: Vector3, vSegCount: number) {
        super();
        this.pos = pos;
        this.dim = dim;
        this.vSegCount = vSegCount;

        this._init();
    }


    _init(): void {

        for (let i = 0; i < this.pts.length - 1; i++) {
            this.nodes.push(new VerletNode(new Vector3((this.pts[i].x - 787.5) * .45, (-this.pts[i].y + 680.75) * .45, this.pts[i].z), 5, new Color(.3, .3, 1)));
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

        // adds node and stick geometry to scenegraph
        this.draw(false, false, false);

        let pts: number[] = [];

        // start Verlet integration
        for (let i = 0; i < this.nodes.length; i++) {
            this.nudge(i, new Vector3(randFloat(-.8, .8), randFloat(-.8, .8), randFloat(-.8, .8)));
        }

        this.nodes[0].setNodeColor(new Color(1, .5, 0));
        this.nodes[this.nodes.length - 1].setNodeColor(new Color(1, .5, 0));

    }

    constrainBounds(bounds: Vector3): void {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].constrainBounds(bounds);
        }
    }

    // returns xMin, xMax, yMin, yMax
    getMinMaxNodeXYPos(): Vector4 {
        // just begin with suitably high and low vals
        let xMin = 10000, xMax = -10000, yMin = 10000, yMax = -10000;

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].position.x < xMin) {
                xMin = this.nodes[i].position.x
            }

            if (this.nodes[i].position.x > xMax) {
                xMax = this.nodes[i].position.x
            }

            if (this.nodes[i].position.y < yMin) {
                yMin = this.nodes[i].position.y
            }

            if (this.nodes[i].position.y > yMax) {
                yMax = this.nodes[i].position.y
            }
        }
        return new Vector4(xMin, xMax, yMin, yMax);
    }

    drawMan() {

    }

}


