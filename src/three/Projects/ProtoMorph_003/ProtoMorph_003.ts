// ProtoMorph_003
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Class Description: 

import { Color, Group, Vector3 } from "three";
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos, AnchorPoint } from "../../libPByte_3/IJGUtils";
import { VerletSurface } from "../../libPByte_3/VerletSurface";
import { VerletStrand } from "../../libPByte_3/VerletStrand";
import { VerletStick } from "../../libPByte_3/VerletStick";
import { VerletNode } from "../../libPByte_3/VerletNode";

export class ProtoMorph_003 extends Group {

    org001: VerletSurface;
    tendrilLen: number;
    tendrils: VerletStrand[] = [];

    tendrilStick!: VerletStick;


    constructor(org001: VerletSurface, tendrilLen: number = 0) {
        super();

        this.org001 = org001;
        this.tendrilLen = tendrilLen;

        this.create();
    }

    create() {
        this.add(this.org001);
        for (let i = 0; i < this.org001.edgeNodes.length; i++) {
            const head = this.org001.edgeNodes[i].position;
            const tail = new Vector3().copy(this.org001.edgeNodes[i].position).multiplyScalar(this.tendrilLen);
            this.tendrils.push(new VerletStrand(head, tail, 15, AnchorPoint.HEAD));
            this.add(this.tendrils[this.tendrils.length - 1]);

            this.tendrils[i].setStrandColor(new Color(.9, .7, .75));
            this.tendrils[i].nodes[0].isVerletable = false;
            // this.tendrils[i].segments[0].setStickTension(1);
            if (i == 0) {

                let tempVec = new Vector3().copy(this.org001.edgeNodes[i].position);
                tempVec.multiplyScalar(5);
                this.tendrilStick = new VerletStick(this.org001.edgeNodes[i], new VerletNode(tempVec), .7, 10);
                this.add(this.tendrilStick);
            }
        }

        //this.org001.getEdgeVecs();

    }

    move(time: number) {
        this.org001.verlet();
        this.org001.update();


        let edgeVecs = this.org001.getEdgeVecs();

        for (let i = 0; i < this.tendrils.length; i++) {
            this.tendrils[i].setHeadPosition(this.org001.edgeNodes[i].position);
            // this.tendrils[i].setHeadPosition(this.org001.verletNodeEdgesAll2D[0][i].position);
            // this.tendrils[i].setHeadPosition(edgeVecs[i]);
            this.tendrils[i].verlet();
            // this.tendrils[i].nodes[0].position = this.org001.verletNodeEdgesAll2D[0][i].position;
            // this.tendrils[i].nodes[0].position = this.org001.verletNodeEdgesAll2D[0][i].position;
            // this.tendrils[i].nodes[0].position = this.org001.verletNodeEdgesAll2D[0][i].position;

            //console.log("this.org001.edgeNodes[i].position = ", this.org001.edgeNodes[i].position);

        }
        // this.tendrilStick.start.position.setX(this.org001.verletNodeEdgesAll2D[0][0].position.x);
        // this.tendrilStick.start.position.setY(this.org001.verletNodeEdgesAll2D[0][0].position.y);
        // this.tendrilStick.start.position.setZ(this.org001.verletNodeEdgesAll2D[0][0].position.z);
        // const p = this.org001.nodes[0].position

        // this.tendrilStick.constrainLen();
        // let p = this.org001.mesh.geometry.attributes.position

        // let anchor = new Vector3(p.getX(5), p.getY(5), p.getZ(5));
        //this.tendrilStick.line.geometry.attributes.position.setXYZ(0, edgeVecs[0].x, edgeVecs[0].y, edgeVecs[0].z);

    }
}


