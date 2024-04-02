// Verletion
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

import { BufferAttribute, BufferGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, cos, sin } from "../libPByte_3/IJGUtils";
import { VerletFace4 } from "../libPByte_3/VerletFace4";
import { VerletFace3 } from "../libPByte_3/VerletFace3";
import { VMan } from "./VMan";

export class Verletion extends Group {

    man1: VMan;
    vecs: Float32Array;
    mesh: Mesh

    constructor(man1: VMan) {
        super();
        this.man1 = man1;


        let pts: number[] = [];

        // start Verlet integration
        for (let i = 0; i < this.man1.nodes.length; i++) {
            //populate vecs
            pts.push(this.man1.nodes[i].position.x);
            pts.push(this.man1.nodes[i].position.y);
            pts.push(this.man1.nodes[i].position.z);
        }

        this.vecs = new Float32Array(pts);
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(this.vecs, 3));
        geometry.setIndex(this.man1.indices);
        // geometry.setAttribute('uv', new BufferAttribute(uvs, 2));

        // geometry.setAttribute('position', new BufferAttribute(this.vecs, 3));
        const material = new MeshBasicMaterial({ color: 0xff0000, side: DoubleSide });
        this.mesh = new Mesh(geometry, material);
        this.add(this.mesh);
    }
    draw(): void {
        // start Verlet integration
        let pts: number[] = [];
        for (let i = 0; i < this.man1.nodes.length; i++) {
            //populate vecs
            pts.push(this.man1.nodes[i].position.x);
            pts.push(this.man1.nodes[i].position.y);
            pts.push(this.man1.nodes[i].position.z);
        }

        this.vecs = new Float32Array(pts);
        const geometry = new BufferGeometry();
        this.mesh.geometry.setAttribute('position', new BufferAttribute(this.vecs, 3));

    }

}


