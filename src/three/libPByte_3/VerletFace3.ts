import { Color, Group, Vector3 } from "three";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";

export class VerletFace3 extends Group {

    vecs: Vector3[] = [];
    elasticity: number;

    nodes: VerletNode[] = []; // no edge nodes
    sticks: VerletStick[] = [];

    constructor(vecs: Vector3[], elasticity: number) {
        super();
        this.vecs = vecs;
        this.elasticity = elasticity;

        this.nodes.push(new VerletNode(this.vecs[0], 1, new Color(0xff0022)));
        this.nodes.push(new VerletNode(this.vecs[1], 1, new Color(0xff0022)));
        this.nodes.push(new VerletNode(this.vecs[2], 1, new Color(0xff0022)));

        this.sticks.push(new VerletStick(this.nodes[0], this.nodes[1], this.elasticity));
        this.sticks.push(new VerletStick(this.nodes[1], this.nodes[2], this.elasticity));
        this.sticks.push(new VerletStick(this.nodes[2], this.nodes[0], this.elasticity));

        // for (let n of this.nodes) {
        //    // this.add(n);
        // }

        // for (let s of this.sticks) {
        //     //  this.add(s);
        // }
    }

    verlet(): void {
        for (var n of this.nodes) {
            n.verlet();
        }
    }

    constrain(bounds: Vector3, offset: Vector3 = new Vector3()): void {
        for (var s of this.sticks) {
            s.constrainLen();
        }

        for (var n of this.nodes) {
            n.constrainBounds(bounds, 1);
        }
    }

    constrainBoundsVec(bounds: Vector3, repulsion: Vector3 = new Vector3(), isSphere: boolean = false): void {
        for (var s of this.sticks) {
            s.constrainLen();
        }

        for (var n of this.nodes) {
            n.constrainBoundsVec(bounds, repulsion);
        }

    }

    getCentroid(): Vector3 {
        const v = this.nodes[0].position.clone();
        v.add(this.nodes[1].position);
        v.add(this.nodes[2].position);
        return v.divideScalar(3);
    }


}