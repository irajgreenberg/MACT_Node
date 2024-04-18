// ProtoMorph_005
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

/* Class Description: 
ProtoMorph class encapsulates a VerletSurface optionally attached tendrils
*/

import { CatmullRomCurve3, Color, Curve, CurvePath, DoubleSide, Group, Material, Mesh, MeshBasicMaterial, TubeGeometry, Vector2, Vector3 } from "three";
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos, AnchorPoint, SimplCurve } from "../../libPByte_3/IJGUtils";
import { VerletSurface } from "../../libPByte_3/VerletSurface";
import { VerletStrand } from "../../libPByte_3/VerletStrand";
import { VerletStick } from "../../libPByte_3/VerletStick";
import { VerletNode } from "../../libPByte_3/VerletNode";
import { TendrilDataModel } from "./TendrilDataModel";

export class ProtoMorph_005 extends Group {

    pos: Vector3;
    org: VerletSurface;
    tdm: TendrilDataModel
    col: Color;

    tendrils: VerletStrand[] = [];
    tendrilSticks: Mesh[] = [];
    tendrilStickRadii: number[] = [];


    constructor(pos: Vector3, org: VerletSurface, tdm: TendrilDataModel, col: Color) {
        super();
        this.pos = pos;
        this.org = org;
        this.tdm = tdm
        this.col = col;


        this.add(this.org);
        this.org.draw(true);
        this.create();
    }

    create() {

        //create tendrils
        for (let i = 0; i < this.org.edgeNodes.length; i++) {
            const head = this.org.edgeNodes[i].position;
            const tail = new Vector3().copy(this.org.edgeNodes[i].position).multiplyScalar(this.tendrilLen);
            this.tendrils.push(new VerletStrand(head, tail, 6, AnchorPoint.HEAD, .3));
            //  this.add(this.tendrils[this.tendrils.length - 1]);

            //   this.tendrils[i].setStrandColor(new Color("0xff6666"));
            this.tendrils[i].nodes[0].isVerletable = false;


            const path = new CatmullRomCurve3(this.tendrils[i].getNodeVecs());
            this.tendrilStickRadii.push(randFloat(this.tendrilRadiiMinMax.x, this.tendrilRadiiMinMax.y));
            const geometry = new TubeGeometry(path, this.tendrilSegments, randFloat(this.tendrilRadiiMinMax.x, this.tendrilRadiiMinMax.y), 2, false);
            const material = new MeshBasicMaterial({ color: this.col, side: DoubleSide, transparent: true, opacity: .8 });
            const mesh = new Mesh(geometry, material);
            this.tendrilSticks.push(new Mesh(geometry, material));
            this.add(this.tendrilSticks[this.tendrilSticks.length - 1]);
        }

        //this.org.getEdgeVecs();
        this.position.x += this.pos.x
        this.position.y += this.pos.y
        this.position.z += this.pos.z


    }


    move(time: number, spd?: Vector3): void {
        this.org.verlet();
        this.org.update();
        // let edgeVecs = this.org.getEdgeVecs();

        for (let i = 0; i < this.tendrils.length; i++) {
            let input = new Vector3().copy(this.org.edgeNodes[i].position).multiplyScalar(1);
            this.tendrils[i].setHeadPosition(input);
            this.tendrils[i].verlet();

            // this.tendrils[i].nodes[this.tendrils[i].nodes.length - 1].position.multiplyScalar(1.0005);

            const path = new CatmullRomCurve3(this.tendrils[i].getNodeVecs());
            this.tendrilSticks[i].geometry.dispose();
            const geometry = new TubeGeometry(path, this.tendrilSegments, this.tendrilStickRadii[i], 12, false);
            this.tendrilSticks[i].geometry = geometry
        }

        if (spd) {
            this.position.x = spd.x
            this.position.y = spd.y
            this.position.z = spd.z

        }
    }

    rotate(rotSpd: Vector3): void {
        this.rotateX(rotSpd.x);
        this.rotateY(rotSpd.y);
        this.rotateZ(rotSpd.z);
    }
}


