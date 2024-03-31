import P5 from "p5";
import { NodeType } from "./PByte_utils";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";
import { VerletStyle } from "./VerletStyle";
export abstract class VerletBaseMin {

    p: P5;

    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];

    areNodesDrawable: boolean = false;
    areSticksDrawable: boolean = false;


    constructor(p: P5) {
        this.p = p;
    }

    // Required subclass implementation
    abstract init(): void;

    verlet() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].verlet();
            if (this.areNodesDrawable) {
                this.nodes[i].draw();
            }
        }

        for (let i = 0; i < this.sticks.length; i++) {
            this.sticks[i].constrainLen();
            if (this.areSticksDrawable) {
                this.sticks[i].draw();
            }
        }
    }

    draw(areNodesDrawable: boolean = true, areSticksDrawable: boolean = false) {
        this.areNodesDrawable = areNodesDrawable;
        this.areSticksDrawable = areSticksDrawable;
    }


}