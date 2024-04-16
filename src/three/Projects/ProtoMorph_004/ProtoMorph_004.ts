// ProtoMorph_004
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Class Description: 

import { CatmullRomCurve3, Color, Curve, CurvePath, DoubleSide, Group, Mesh, MeshBasicMaterial, TubeGeometry, Vector3 } from "three";
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos, AnchorPoint, SimplCurve } from "../../libPByte_3/IJGUtils";
import { VerletSurface } from "../../libPByte_3/VerletSurface";
import { VerletStrand } from "../../libPByte_3/VerletStrand";
import { VerletStick } from "../../libPByte_3/VerletStick";
import { VerletNode } from "../../libPByte_3/VerletNode";

export class ProtoMorph_004 extends Group {

    org001: VerletSurface;
    tendrilLen: number;
    tendrils: VerletStrand[] = [];

    tendrilSticks: Mesh[] = [];
    tendrilStickRadii: number[] = [];


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
            this.tendrils.push(new VerletStrand(head, tail, 6, AnchorPoint.HEAD, .3));
            //  this.add(this.tendrils[this.tendrils.length - 1]);

            this.tendrils[i].setStrandColor(new Color(.9, .7, .75));
            this.tendrils[i].nodes[0].isVerletable = false;


            const path = new CatmullRomCurve3(this.tendrils[i].getNodeVecs());
            this.tendrilStickRadii.push(randFloat(.1, 2.5));
            const geometry = new TubeGeometry(path, 5, randFloat(1, 4), 2, false);
            const material = new MeshBasicMaterial({ color: 0x55ccee, side: DoubleSide, transparent: true, opacity: .3 });
            const mesh = new Mesh(geometry, material);
            this.tendrilSticks.push(new Mesh(geometry, material));
            this.add(this.tendrilSticks[this.tendrilSticks.length - 1]);
        }

        //this.org001.getEdgeVecs();

    }


    move(time: number) {
        this.org001.verlet();
        this.org001.update();
        // let edgeVecs = this.org001.getEdgeVecs();

        for (let i = 0; i < this.tendrils.length; i++) {
            this.tendrils[i].setHeadPosition(this.org001.edgeNodes[i].position);
            this.tendrils[i].verlet();

            this.tendrils[i].nodes[this.tendrils[i].nodes.length - 1].position.multiplyScalar(1.0005);

            const path = new CatmullRomCurve3(this.tendrils[i].getNodeVecs());
            this.tendrilSticks[i].geometry.dispose();
            const geometry = new TubeGeometry(path, 15, this.tendrilStickRadii[i], 10, false);
            this.tendrilSticks[i].geometry = geometry
        }
    }
}


