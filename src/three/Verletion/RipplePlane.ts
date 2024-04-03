// RipplePlane
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

import { BufferAttribute, BufferGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, Texture, TextureLoader, Vector3, Vector4 } from "three";
import { mapLinear, randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, cos, sin } from "../libPByte_3/IJGUtils";
import { VerletFace4 } from "../libPByte_3/VerletFace4";
import { VerletFace3 } from "../libPByte_3/VerletFace3";
import { VMan } from "./VMan";
import { VerletPlane } from "../libPByte_3/VerletPlane";

export class RipplePlane extends Group {

    // man1: VMan;
    // vPlane: VerletPlane;
    // vecs: Float32Array;
    // uvs: Float32Array;
    // mesh: Mesh
    // texture: Texture;

    // constructor(vPlane: VerletPlane) {
    //     super();
    //     this.vPlane = vPlane;


    //     let _vecs: number[] = [];
    //     let _uvs: number[] = [];

    //     let xyMinMax: Vector4 = man1.getMinMaxNodeXYPos();

    //     // start Verlet integration
    //     for (let i = 0; i < this.man1.nodes.length; i++) {
    //         //populate vecs
    //         _vecs.push(this.man1.nodes[i].position.x);
    //         _vecs.push(this.man1.nodes[i].position.y);
    //         _vecs.push(this.man1.nodes[i].position.z);

    //         const x = mapLinear(this.man1.nodes[i].position.x, xyMinMax.x, xyMinMax.y, 0, 1);
    //         const y = mapLinear(this.man1.nodes[i].position.y, xyMinMax.z, xyMinMax.w, 0, 1)
    //         _uvs.push(x);
    //         _uvs.push(y);
    //     }

    //     this.vecs = new Float32Array(_vecs);
    //     this.uvs = new Float32Array(_uvs);
    //     const geometry = new BufferGeometry();
    //     geometry.setAttribute('position', new BufferAttribute(this.vecs, 3));
    //     geometry.setIndex(this.man1.indices);
    //     geometry.setAttribute('uv', new BufferAttribute(this.uvs, 2));

    //     this.texture = new TextureLoader().load('data/woman_001_UV_map.png');
    //     // immediately use the texture for material creation 

    //     // geometry.setAttribute('position', new BufferAttribute(this.vecs, 3));
    //     const material = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .99, side: DoubleSide, map: this.texture });
    //     this.mesh = new Mesh(geometry, material);
    //     this.add(this.mesh);
    // }
    // draw(): void {
    //     // start Verlet integration
    //     let pts: number[] = [];

    //     for (let i = 0; i < this.man1.nodes.length; i++) {
    //         //populate vecs
    //         pts.push(this.man1.nodes[i].position.x);
    //         pts.push(this.man1.nodes[i].position.y);
    //         pts.push(this.man1.nodes[i].position.z);
    //     }
    //     // this.mesh.material.needsUpdate
    //     this.vecs = new Float32Array(pts);
    //     const geometry = new BufferGeometry();
    //     this.mesh.geometry.setAttribute('position', new BufferAttribute(this.vecs, 3));
    // }

}


