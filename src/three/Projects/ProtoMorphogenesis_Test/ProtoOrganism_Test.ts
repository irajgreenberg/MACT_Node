// ProtoMorphogenesis
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

/* Class Description: 
Class encapsulates a VerletSurface with optionally attached tendrils
*/

import { CatmullRomCurve3, Color, Curve, CurvePath, DoubleSide, Group, LightProbe, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, TubeGeometry, Vector2, Vector3 } from "three";
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos, AnchorPoint, SimplCurve, ProtoAlphaData } from "../../libPByte_3/IJGUtils";
import { VerletStrand } from "../../libPByte_3/VerletStrand";
import { VerletStick } from "../../libPByte_3/VerletStick";
import { VerletNode } from "../../libPByte_3/VerletNode";
import { TendrilDataModel } from "../../libPByte_3/TendrilDataModel";
import { VerletSurface } from "../../libPByte_3/VerletSurface";
import { ProtoPhysics } from "../../libPByte_3/ProtoPhysics";
import { ProtoTubeGeometry } from "../../libPByte_3/ProtoTubeGeometry";


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

export class ProtoOrganism_Test extends Group {

    pos: Vector3;
    body: VerletSurface;
    tdm?: TendrilDataModel;
    col: Color; // for bodies, not tendrils
    physics: ProtoPhysics;

    tendrils: VerletStrand[] = [];
    tendrilSticks: Mesh[] = [];
    tendrilStickRadii: number[] = [];
    tendrilStickRadiiSegments: number[] = [];
    hasTendrilAlpha: boolean[] = [];

    private substructure!: VerletSurface;
    private substructureZIndex: number = 0;
    private substructureZIndexDepth: number = 30;

    alphaTable: boolean[][] = [];

    alphaData!: ProtoAlphaData;

    protoAlphaData!: ProtoAlphaData


    constructor(pos: Vector3, body: VerletSurface, col: Color, physics: ProtoPhysics, tdm?: TendrilDataModel, alphaData?: ProtoAlphaData) {
        super();
        this.pos = pos;
        this.body = body;
        this.col = col;
        this.physics = physics;
        this.add(this.body);

        // check for tendrils
        if (tdm) {
            this.tdm = tdm;

            // check for VerletSurface image alpha data
            // used to enable tendril attachement to Verlet nodes
            // only if non-transparent pixel data.
            if (alphaData) {
                this.alphaData = alphaData;
                this.create();
            }

        }

    }

    private checkNodeAlpha(pos: Vector3): boolean {
        // console.log(pos);
        if (this.alphaData) {
            // console.log(pos.y);
            // console.log('Image Width:', this.alphaData.w);
            //console.log('Image Height:', this.alphaData.h);
            // console.log('Alpha Values:', this.alphaData.alpha_1D);

            // for (let b = 0; b < this.alphaData.h; b++) {
            //     console.log(b);
            // }
            let k = 0;
            for (let i = 0; i < this.alphaData.h; i++) {
                for (let j = 0; j < this.alphaData.w; j++) {
                    k = i * this.alphaData.w + j;
                    const w = this.alphaData.w;
                    const h = this.alphaData.h;
                    console.log(k / (this.alphaData.w * this.alphaData.h));
                    // top row
                    if (i == 0) {
                        // const v = new Vector3().copy(pos).normalize();
                        const v = new Vector3().copy(pos);
                        v.addScalar(350);
                        v.normalize();
                        const px = new Vector3(j / w, i / h, 0);
                        // const px = new Vector3(j, i, 0);
                        // console.log(px);
                        if (v.distanceTo(px) < .533) {
                            //console.log("what's up");
                            // console.log("v = v", v, "px = ", px);
                        }
                        // return true;
                        // bottom row
                    } else if (i === this.alphaData.h - 1) {
                        //  return true;
                        // left column
                    } else if (j === 0) {
                        // return true;
                        // right column
                    } else if (j === this.alphaData.w - 1) {
                        // return true;
                        // bottem edge
                    }

                }
            }
        }
        return false;
    }


    create() {
        //create tendrils
        if (this.tdm) {
            for (let i = 0; i < this.body.edgeNodes.length; i++) {

                if (this.checkNodeAlpha(this.body.edgeNodes[i].position)) {

                } else {

                }
                // only create tendril if Verlet node is on pixel with alpha>0
                const unitNode = new Vector3().copy(this.body.edgeNodes[i].position).normalize();
                // if (unitNode) {

                // }
                const head = this.body.edgeNodes[i].position;
                const tail = new Vector3().copy(this.body.edgeNodes[i].position).multiplyScalar(this.tdm.length);
                this.tendrils.push(new VerletStrand(head, tail, 6, AnchorPoint.HEAD, .3));
                //  this.add(this.tendrils[this.tendrils.length - 1]);

                //   this.tendrils[i].setStrandColor(new Color("0xff6666"));
                this.tendrils[i].nodes[0].isVerletable = false;


                const path = new CatmullRomCurve3(this.tendrils[i].getNodeVecs());
                // for animation loop

                this.tendrilStickRadii.push(randFloat(this.tdm.radiiMinMax.x, this.tdm.radiiMinMax.y));

                this.tendrilStickRadiiSegments.push(randInt(this.tdm.radialSegsmentsMinMax.x, this.tdm.radialSegsmentsMinMax.y));

                // const geometry = new TubeGeometry(path, this.tdm.segments, randFloat(this.tdm.radiiMinMax.x, this.tdm.radiiMinMax.y), randInt(this.tdm.radialSegsmentsMinMax.x, this.tdm.radialSegsmentsMinMax.y), false);

                const geometry = new ProtoTubeGeometry(path, this.tdm.segments, this.tendrilStickRadiiSegments[i], false, { func: FuncType.SINUSOIDAL, min: 2, max: 3, periods: 3 });


                const material = new MeshPhongMaterial({ color: this.tdm.tendrilCol, specular: 0xffdddd, shininess: 30, transparent: true, opacity: .6 });
                const mesh = new Mesh(geometry, material);

                this.tendrilSticks.push(new Mesh(geometry, material));
                this.add(this.tendrilSticks[this.tendrilSticks.length - 1]);
            }
        }
        // //this.body.getEdgeVecs();
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
            this.body.centroidNode.moveNode(vec);
        } else if (node === 'targetNode') {
            if (typeof nodeID == 'number') {
                this.body.bodyNodes[nodeID].moveNode(vec);
            }
        } else if (node === 'targetNodes') {
            if (nodeID instanceof Array) {
                for (let i = 0; i < nodeID.length; i++) {
                    this.body.bodyNodes[nodeID[i]].moveNode(vec);
                }
            }
        } else if (node === 'singleRandom') {
            const n = randInt(0, this.body.bodyNodes.length - 1);
            this.body.bodyNodes[n].moveNode(vec);
        } else if (node === 'multipleRandom') {
            if (randintCount !== undefined) {
                for (let i = 0; i < randintCount; i++) {
                    const n = randInt(0, this.body.bodyNodes.length - 1);
                    this.body.bodyNodes[n].moveNode(vec);
                }
            }
        } else if (node === 'all') {
            for (let i = 0; i < this.body.bodyNodes.length; i++) {
                this.body.bodyNodes[i].moveNode(vec);
            }
        }
    }

    public setSurfaceDrawable(areNodesDrawable: boolean = false, areSticksDrawable: boolean = false, areCrossSupportsDrawable: boolean = false): void {
        this.body.setDrawable(areNodesDrawable, areSticksDrawable, areCrossSupportsDrawable);
    }

    private _update(): void {
        this.body.update();
        if (this.substructure) {
            this.substructure.update();
        }

        if (this.tdm) {
            for (let i = 0; i < this.tendrils.length; i++) {
                let input = new Vector3().copy(this.body.edgeNodes[i].position).multiplyScalar(.99);
                this.tendrils[i].setHeadPosition(input);
                this.tendrils[i].nodes[this.tendrils[i].nodes.length - 1].position.multiplyScalar(randFloat(1.00005, 1.0004));
                const path = new CatmullRomCurve3(this.tendrils[i].getNodeVecs());
                this.tendrilSticks[i].geometry.dispose();
                // const geometry = new TubeGeometry(path, this.tdm.segments, this.tendrilStickRadii[i], this.tendrilStickRadiiSegments[i], false);


                const geometry = new ProtoTubeGeometry(path, this.tdm.segments, this.tendrilStickRadiiSegments[i], false, { func: FuncType.SINUSOIDAL, min: 2, max: 4, periods: 1 });


                this.tendrilSticks[i].geometry = geometry
            }
        }

    }

    verlet(): void {
        this.body.verlet();
        if (this.substructure) {
            this.substructure.verlet();
        }
        // move tendrils based on VerletSurface
        this._update();
        for (let i of this.tendrils) {
            i.verlet();
        }
    }


    /**
    * just centroid for now
    */
    pulse(): void {
        this.body.centroidNode.position.z = sin(this.physics.theta * .5) * this.physics.amp;

        if (this.substructure) {
            this.substructure.centroidNode.position.z = sin(this.physics.theta * 1.5) * this.physics.amp;
        }
        this.physics.theta += this.physics.freq;
    }

    /**
    * Randomly jiggle all bodynodes
    * with optional fixed passed values
    */
    jitter(vecMax?: Vector3 | Vector3[]): void {
        if (vecMax instanceof Vector3) {
            for (let i = 0; i < this.body.nodes.length; i++) {
                const v = new Vector3(randFloat(-vecMax.x, vecMax.x), randFloat(-vecMax.y, vecMax.y), randFloat(-vecMax.z, vecMax.z));
                this.body.nodes[i].position.add(v);
            }
        } else {

        }
    }

    move(spd?: Vector2 | Vector3): void {
        if (spd instanceof Vector3) {
            this.position.x = this.pos.x + spd.x;
            this.position.y = this.pos.y + spd.y;
            this.position.z = this.pos.z + spd.z;
        } else if (spd instanceof Vector2) {
            this.position.x += this.physics.spd.x;
            this.position.y += this.physics.spd.y;
        }

    }

    rotate(rotSpd: Vector3): void {
        this.rotateX(rotSpd.x);
        this.rotateY(rotSpd.y);
        this.rotateZ(rotSpd.z);
    }

    public addSubStructure(substructure: VerletSurface): void {
        // increase with each substructure addition
        this.substructureZIndex++;
        // add to scenegraph
        this.substructure = substructure;
        this.add(substructure);
        substructure.scale.x = .8
        substructure.scale.y = .8

        substructure.position.x = this.position.x;
        substructure.position.y = this.position.y;
        substructure.position.z = this.position.z + this.substructureZIndexDepth * this.substructureZIndex;

    }

    setZIndexDepth(depth: number) {
        this.substructureZIndexDepth = depth;

    }


    // setAlphaLookUpTable(alphaTable: boolean[][]): void {
    //     this.alphaTable = alphaTable;
    //     // console.log(this.alphaTable);
    // }

    setAlphaData(alphaData: ProtoAlphaData) {

        this.alphaData = alphaData;
        // for(let i=0; i<this.alphaData.alpha_1D.length; i++){
        //    // if(this.alphaData.alpha_1D[i]>0){
        //         this.hasTendrilAlpha.

        //    // }

        // }
        // // console.log(this.alphaData);
        console.log(this.alphaData);
    }

}


