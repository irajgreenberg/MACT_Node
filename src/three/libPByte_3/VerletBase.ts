// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// PByte3.js Library
// Supports protoByte development
// Generative softbody, virtual organisms
// Primary Language: Typescript
// Library Dependency: Three.js

// VerletBase.ts
// Simple Base Verlet class

import { Group, Vector3 } from "three";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";

export abstract class VerletBase extends Group {

    sticks: VerletStick[] = [];
    nodes: VerletNode[] = [];
    crossSupports: VerletStick[] = [];

    areNodesDrawable: boolean = false;
    areSticksDrawable: boolean = false;
    areCrossSupportsDrawable: boolean = false;

    constructor() {
        super();
    }

    protected abstract _init(): void;

    draw(areNodesDrawable: boolean = true, areSticksDrawable: boolean = true, areCrossSupportsDrawable: boolean = false): void {
        this.areNodesDrawable = areNodesDrawable;
        this.areSticksDrawable = areSticksDrawable;
        this.areCrossSupportsDrawable = areCrossSupportsDrawable;

        if (this.areNodesDrawable) {
            for (let i = 0; i < this.nodes.length; i++) {
                this.add(this.nodes[i]);
            }
        }

        if (this.areSticksDrawable) {
            for (let i = 0; i < this.sticks.length; i++) {
                this.add(this.sticks[i]);
            }
        }

        if (this.areCrossSupportsDrawable) {
            for (let i = 0; i < this.crossSupports.length; i++) {
                this.add(this.crossSupports[i]);
            }
        }
    }

    // starts Verlet Integration
    nudge(nodeID: number, offset: Vector3): void {
        this.nodes[nodeID].position.add(offset);
    }

    // starts Verlet Integration
    jitter(offset: Vector3): void {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].position.add(offset);
        }
    }

    verlet(): void {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].verlet();
        }

        for (let i = 0; i < this.sticks.length; i++) {
            this.sticks[i].constrainLen();
        }

        for (let i = 0; i < this.crossSupports.length; i++) {
            this.crossSupports[i].constrainLen();
        }
    }

}