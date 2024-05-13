// ProtoMorphogenesis
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

import { Group, Material, MeshPhongMaterial, Vector3 } from "three";
import { ProtoOrganism_Test } from "./ProtoOrganism_Test";
import { sin, PI, cos } from "../../libPByte_3/IJGUtils";
import { randFloat } from "three/src/math/MathUtils";

/* Class Description: 
Class for organizing multiple ProtoOrganisms, including environmental factors
Utilizes automated z-indexing to ensure no overlap
*/

export class ProtoPlasm extends Group {

    orgs: ProtoOrganism_Test[] = [];

    /**
     * Min depth of each z-index layer.
    */
    zIndexDepthMin: number;

    /**
     * Ensures each ProtoOrganism occupies its own layer on z-axis.
    */
    zIndices: number[] = [];

    /**
     * Keeps oragnisms.
    */

    bounds: Vector3;
    /**
     * Moves all nodes, default is 0,0,0
    */
    jitterMinMax: Vector3 = new Vector3();

    constructor(orgs: ProtoOrganism_Test | ProtoOrganism_Test[], zIndexDepthMin: number = 100, bounds: Vector3 = new Vector3(1400, 1000, 500)) {
        super();

        // handle single or array organism input
        // after the condtional array type used throughout class
        if (orgs instanceof ProtoOrganism_Test) {
            this.orgs.push(orgs);
        } else if (Array.isArray(orgs)) {
            this.orgs = orgs;
        }

        this.zIndexDepthMin = zIndexDepthMin;
        this.bounds = bounds;
        this._create();

    }

    private _create() {
        for (let i = 0; i < this.orgs.length; i++) {
            this.add(this.orgs[i]);
            this.orgs[i].position.setX(this.orgs[i].pos.x);
            this.orgs[i].position.setY(this.orgs[i].pos.y);
            const zOffset = (this.orgs.length * this.zIndexDepthMin) / 2
            this.orgs[i].position.setZ(-zOffset * 1.6 + this.zIndexDepthMin * i);
        }
    }

    /**
     * Adds org to top layer.
    */
    public addOrg(org: ProtoOrganism_Test): void {
        this.orgs.push(org);
    }

    // Needs to be implemented
    // public swapZIndex(org1: ProtoOrganism_Test, org2: ProtoOrganism_Test) {

    // }

    public start(): void {
        for (let i = 0; i < this.orgs.length; i++) {
            const posX = randFloat(-300, 300);
            const posY = randFloat(-125, 125);

            this.orgs[i].position.x += posX;
            this.orgs[i].position.y += posY;
        }
    }

    public setJitter(vec: Vector3) {
        this.jitterMinMax = vec;
    }

    public run(time: number): void {
        for (let i = 0; i < this.orgs.length; i++) {
            this.orgs[i].verlet();
            //console.log(this.orgs[i].physics.spd);
            this.orgs[i].move(this.orgs[i].physics.spd);
            this.orgs[i].rotate(this.orgs[i].physics.rotSpd);
            this.orgs[i].pulse();
            this.orgs[i].jitter(this.jitterMinMax);

            if (this.orgs[i].position.x > this.bounds.x / 2 - this.orgs[i].body.dim.x) {
                this.orgs[i].position.x = this.bounds.x / 2 - this.orgs[i].body.dim.x;
                this.orgs[i].physics.spd.x *= -1;

            } else if (this.orgs[i].position.x < -this.bounds.x / 2 + this.orgs[i].body.dim.x) {
                this.orgs[i].position.x = -this.bounds.x / 2 + this.orgs[i].body.dim.x;
                this.orgs[i].physics.spd.x *= -1;
            }

            if (this.orgs[i].position.y > this.bounds.y / 2 - this.orgs[i].body.dim.y) {
                this.orgs[i].position.y = this.bounds.y / 2 - this.orgs[i].body.dim.y;
                this.orgs[i].physics.spd.y *= -1;

            } else if (this.orgs[i].position.y < -this.bounds.y / 2 + this.orgs[i].body.dim.y) {
                this.orgs[i].position.y = -this.bounds.y / 2 + this.orgs[i].body.dim.y;
                this.orgs[i].physics.spd.y *= -1;
            }

            // if (this.orgs[i].position.z > this.bounds.z / 2) {
            //     this.orgs[i].position.z = this.bounds.z / 2;
            //     this.orgs[i].physics.spd.z *= -1;

            // } else if (this.orgs[i].position.z < -this.bounds.z / 2) {
            //     this.orgs[i].position.z = -this.bounds.z / 2;
            //     this.orgs[i].physics.spd.z *= -1;
            // }
        }

    }
}