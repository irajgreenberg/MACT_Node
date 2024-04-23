// ProtoMorphogenesis
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

import { Group } from "three";
import { ProtoOrganism } from "./ProtoOrganism";

/* Class Description: 
Class for organizing multiple ProtoOrganisms, including environmental factors
*/

export class ProtoPlasm extends Group {

    orgs: ProtoOrganism[] = [];

    /**
     * Min depth of each z-index layer.
    */
    zIndexDepthMin: number;

    /**
     * Ensures each ProtoOrganism occupies it's own layer on z-axis.
    */
    zIndices: number[] = [];


    constructor(orgs: ProtoOrganism[], zIndexDepthMin: number) {
        super();
        this.orgs = orgs;
        this.zIndexDepthMin = zIndexDepthMin;
        this._create();
    }

    private _create() {
    }

    public move(): void {

    }
}