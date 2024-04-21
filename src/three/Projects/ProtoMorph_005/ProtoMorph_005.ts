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
import { VerletStrand } from "../../libPByte_3/VerletStrand";
import { VerletStick } from "../../libPByte_3/VerletStick";
import { VerletNode } from "../../libPByte_3/VerletNode";
import { TendrilDataModel } from "./TendrilDataModel";
import { VerletSurface } from "../../libPByte_3/VerletSurface2";
import { ProtoPhysics } from "../../libPByte_3/ProtoPhysics";


/**
 * Used ONLY be this class so didn't want to put into
 * IJGUtils.
 */

export enum NodeSelector {
    TargetNode = 'targetNode',
    TargetNodes = 'targetNodes',
    Centroid = 'centroid',
    SingleRandom = 'singleRandom',
    MultipleRandom = 'multipleRandom',
    All = 'all',
}

export class ProtoMorph_005 extends Group {

    pos: Vector3;
    org: VerletSurface;
    tdm: TendrilDataModel
    col: Color;
    physics: ProtoPhysics;

    tendrils: VerletStrand[] = [];
    tendrilSticks: Mesh[] = [];
    tendrilStickRadii: number[] = [];


    constructor(pos: Vector3, org: VerletSurface, tdm: TendrilDataModel, col: Color, physics: ProtoPhysics) {
        super();
        this.pos = pos;
        this.org = org;
        this.tdm = tdm
        this.col = col;
        this.physics = physics;


        this.add(this.org);
        this.create();
    }

    create() {
        //create tendrils
        for (let i = 0; i < this.org.edgeNodes.length; i++) {
            const head = this.org.edgeNodes[i].position;
            const tail = new Vector3().copy(this.org.edgeNodes[i].position).multiplyScalar(this.tdm.length);
            this.tendrils.push(new VerletStrand(head, tail, 6, AnchorPoint.HEAD, .3));
            //  this.add(this.tendrils[this.tendrils.length - 1]);

            //   this.tendrils[i].setStrandColor(new Color("0xff6666"));
            this.tendrils[i].nodes[0].isVerletable = false;


            const path = new CatmullRomCurve3(this.tendrils[i].getNodeVecs());
            this.tendrilStickRadii.push(randFloat(this.tdm.radiiMinMax.x, this.tdm.radiiMinMax.y));
            const geometry = new TubeGeometry(path, this.tdm.segments, randFloat(this.tdm.radiiMinMax.x, this.tdm.radiiMinMax.y), randInt(this.tdm.radialSegsmentsMinMax.x, this.tdm.radialSegsmentsMinMax.y), false);
            const material = new MeshBasicMaterial({ color: this.col, side: DoubleSide, transparent: true, opacity: .5 });
            const mesh = new Mesh(geometry, material);
            this.tendrilSticks.push(new Mesh(geometry, material));
            this.add(this.tendrilSticks[this.tendrilSticks.length - 1]);
        }

        // //this.org.getEdgeVecs();
        // this.position.x += this.pos.x
        // this.position.y += this.pos.y
        // this.position.z += this.pos.z
    }

    /**
     * Enum Options:
     * TargetNode = 'targetNode',
     * TargetNodes = 'targetNodes',
     * Centroid = 'centroid',
     * SingleRandom = 'singleRandom',
     * MultipleRandom = 'multipleRandom',
     * All = 'all'
     * 
     * note: NodeID only used for targetnode/s options
     */
    start(node: NodeSelector, vec: Vector3, nodeID?: number | number[], randintCount?: number): void {
        if (node === 'centroid') {
            this.org.centroidNode.moveNode(vec);
        } else if (node === 'targetNode') {
            if (typeof nodeID == 'number') {
                this.org.bodyNodes[nodeID].moveNode(vec);
            }
        } else if (node === 'targetNodes') {
            if (nodeID instanceof Array) {
                for (let i = 0; i < nodeID.length; i++) {
                    this.org.bodyNodes[nodeID[i]].moveNode(vec);
                }
            }
        } else if (node === 'singleRandom') {
            const n = randInt(0, this.org.bodyNodes.length - 1);
            this.org.bodyNodes[n].moveNode(vec);
        } else if (node === 'multipleRandom') {
            if (randintCount !== undefined) {
                for (let i = 0; i < randintCount; i++) {
                    const n = randInt(0, this.org.bodyNodes.length - 1);
                    this.org.bodyNodes[n].moveNode(vec);
                }
            }
        } else if (node === 'all') {
            for (let i = 0; i < this.org.bodyNodes.length; i++) {
                this.org.bodyNodes[i].moveNode(vec);
            }
        }
    }

    public setSurfaceDrawable(areNodesDrawable: boolean = false, areSticksDrawable: boolean = false, areCrossSupportsDrawable: boolean = false): void {
        this.org.setDrawable(areNodesDrawable, areSticksDrawable, areCrossSupportsDrawable);
    }

    private _update(): void {
        this.org.update();
        for (let i = 0; i < this.tendrils.length; i++) {
            let input = new Vector3().copy(this.org.edgeNodes[i].position).multiplyScalar(1);
            this.tendrils[i].setHeadPosition(input);
            this.tendrils[i].nodes[this.tendrils[i].nodes.length - 1].position.multiplyScalar(randFloat(1.00005, 1.0004));
            const path = new CatmullRomCurve3(this.tendrils[i].getNodeVecs());
            this.tendrilSticks[i].geometry.dispose();
            const geometry = new TubeGeometry(path, this.tdm.segments, this.tendrilStickRadii[i], 12, false);
            this.tendrilSticks[i].geometry = geometry
        }

    }

    verlet(): void {
        this.org.verlet();
        // move tendrils based on VerletSurface
        this._update();
        for (let i of this.tendrils) {
            i.verlet();
        }
    }

    pulse(): void {
        // just centroid for now
        this.org.centroidNode.position.z = sin(this.physics.theta) * this.physics.amp;
        this.physics.theta += this.physics.freq;
    }

    move(spd?: Vector3): void {
        if (spd) {
            console.log(spd.x);
            this.position.x = this.pos.x + spd.x
            this.position.y = this.pos.y + spd.y
            this.position.z = this.pos.z + spd.z
        }
    }

    rotate(rotSpd: Vector3): void {
        this.rotateX(rotSpd.x);
        this.rotateY(rotSpd.y);
        this.rotateZ(rotSpd.z);
    }
}


