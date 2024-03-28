// Quad Verlet surface


import { BufferGeometry, Color, Group, Material, Mesh, MeshPhongMaterial, Vector3 } from "three";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";
import { randFloat } from "three/src/math/MathUtils";

export class VerletFace4 extends Group {

    vecs: Vector3[] = [];
    elasticity: number;

    nodes: VerletNode[] = []; // no edge nodes
    sticks: VerletStick[] = [];

    planeMesh: Mesh;

    constructor(vecs: Vector3[], elasticity: number = .03) {
        super();
        this.vecs = vecs;
        this.elasticity = elasticity;

        this.nodes.push(new VerletNode(this.vecs[0], 10, new Color(0xff0022)));
        this.nodes.push(new VerletNode(this.vecs[1], 10, new Color(0xff0022)));
        this.nodes.push(new VerletNode(this.vecs[2], 10, new Color(0xff0022)));
        this.nodes.push(new VerletNode(this.vecs[3], 10, new Color(0xff0022)));

        this.sticks.push(new VerletStick(this.nodes[0], this.nodes[1], this.elasticity));
        this.sticks.push(new VerletStick(this.nodes[1], this.nodes[2], this.elasticity));
        this.sticks.push(new VerletStick(this.nodes[2], this.nodes[3], this.elasticity));
        this.sticks.push(new VerletStick(this.nodes[3], this.nodes[0], this.elasticity));

        // cross-support
        this.sticks.push(new VerletStick(this.nodes[0], this.nodes[2], this.elasticity));


        // face rendering data
        let planeGeom = new BufferGeometry().setFromPoints(this.vecs);
        let planeMat = new MeshPhongMaterial({
            color: new Color(randFloat(.8, 1),
                randFloat(.8, 1), randFloat(.8, 1)),
        });
        this.planeMesh = new Mesh(planeGeom, planeMat);
        this.add(this.planeMesh);

        this.nodes[0].position.setX(115);
    }

    verlet(): void {
        for (var n of this.nodes) {
            n.verlet();
        }

        let buffPos = this.planeMesh.geometry.attributes.position;
        buffPos.needsUpdate = true;
        for (let i = 0; i < buffPos.count; i++) {
            buffPos.setX(i, this.nodes[i].position.x);
            buffPos.setY(i, this.nodes[i].position.y);
            buffPos.setZ(i, this.nodes[i].position.z);
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

    draw(): void {

    }


}