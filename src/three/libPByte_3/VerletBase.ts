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

import { Group, Triangle, Vector3 } from "three";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";

export abstract class VerletBase extends Group {

    sticks: VerletStick[] = [];
    nodes: VerletNode[] = [];
    crossSupports: VerletStick[] = [];
    // outer node cage to control overall deformation
    armatureNodes: VerletNode[] = [];

    // capture original node positions
    nodesPosInit: Vector3[] = [];

    // capture distance of all nodes from centroid, to determine 
    // fall-off curves for form deformation
    nodesCentroidDist: number[] = [];

    // conveneince node refernces
    bodyNodes: VerletNode[] = [];
    edgeNodes: VerletNode[] = [];
    cornerNodes: VerletNode[] = [];

    // collect cols or concentric rings
    verletNodeEdgesAll2D: VerletNode[][] = [];

    nodes2D: VerletNode[][] = [];
    rowSticks: VerletStick[] = [];
    colSticks: VerletStick[] = [];
    centroidNode!: VerletNode;


    // triangles for collisions
    tris: Triangle[] = [];

    areNodesDrawable: boolean = false;
    areSticksDrawable: boolean = false;
    areCrossSupportsDrawable: boolean = false;

    constructor() {
        super();
    }

    protected abstract _init(): void;

    draw(areNodesDrawable: boolean = false, areSticksDrawable: boolean = false, areCrossSupportsDrawable: boolean = false): void {
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
            for (let i = 0; i < this.armatureNodes.length; i++) {
                this.add(this.armatureNodes[i]);
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

    // record original node position
    // used during animation
    captureNodesPosInit(): void {
        for (let n of this.nodes) {
            this.nodesPosInit.push(n.position);
        }

    }

    captureNodesCentroidDist(): void {
        for (let i = 0; i < this.nodes.length - 1; i++) {
            this.nodesCentroidDist.push(this.centroidNode.position.distanceTo(this.nodes[i].position));
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