import { timeStamp } from "console";
import { BufferAttribute, BufferGeometry, Color, DoubleSide, Group, InterleavedBufferAttribute, Line, LineBasicMaterial, Material, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, PlaneGeometry, Texture, TextureLoader, Triangle, Vector2, Vector3, Vector4 } from "three";
import { AnchorPlane, AxesPlane, TWO_PI, cos, sin } from "./IJGUtils";
import { VerletGeometryBase } from "./VerletGeometryBase";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";
import { VerletBase } from "./VerletBase";

// includes mapped texture
// VerletPlane just includes Verlet grid

export class VerletSurface extends VerletBase {

    pos: Vector3;
    dim: Vector2;
    detail: number | Vector2 | Vector3 | Vector4;
    mat: Material;
    anchor: AnchorPlane;
    elasticity: number;
    axisPlane: AxesPlane;

    anchorNodes: VerletNode[] = [];

    // using not null assertion
    // mesh not initialized in cstr
    mesh!: Mesh;


    constructor(pos: Vector3, dim: Vector2, detail: number | Vector2 | Vector3 | Vector4, mat: Material, anchor: AnchorPlane = AnchorPlane.NONE, elasticity: number = .05, axisPlane: AxesPlane = AxesPlane.ZX_AXIS) {

        // constructor(width: number, height: number, widthSegs: number, heightSegs: number, diffuseImage: string, anchor: AnchorPlane = AnchorPlane.NONE, elasticity: number = .5, axisPlane: AxesPlane = AxesPlane.ZX_AXIS) {
        super();

        this.pos = pos;
        this.dim = dim;
        this.detail = detail;
        this.mat = mat;
        this.anchor = anchor;
        this.elasticity = elasticity;
        this.axisPlane = axisPlane;


        this._init();
    }

    _init(): void {
        let detail0 = 0;
        let detail1 = 0;
        let detail2 = 0;
        let detail3 = 0;

        if (this.detail instanceof Vector2) {
            detail0 = this.detail.x;
            detail1 = this.detail.y;
        } else if (this.detail instanceof Vector3) {
            detail0 = this.detail.x;
            detail1 = this.detail.y;
            detail2 = this.detail.z;
        } else if (this.detail instanceof Vector4) {
            detail0 = this.detail.x;
            detail1 = this.detail.y;
            detail2 = this.detail.z;
            detail3 = this.detail.w;
        } else {
            detail0 = detail1 = this.detail;
        }

        // elliptical
        // created on XY-plane
        /* detail0 = arcStep, detail1 = sliceStep, detail2, detail3 
         */


        const thetaStep = TWO_PI / detail0;
        const sliceXStep = this.dim.x / 2.0 / detail1;
        const sliceYStep = this.dim.y / 2.0 / detail1;
        let _vecs3: Vector3[][] = [];
        let _vecs: number[] = [];
        let _inds3: Vector3[] = [];
        let _inds: number[] = [];
        let theta = 0.0;


        // vertices
        for (let i = 0; i < detail0; i++) {
            _vecs3[i] = [];
            for (let j = 1; j < detail1; j++) {
                const x = this.pos.x + cos(theta) * sliceXStep * j;
                const y = this.pos.y + sin(theta) * sliceYStep * j;
                const z = 0.0;

                _vecs.push(x);
                _vecs.push(y);
                _vecs.push(z);
                // for convenience
                _vecs3[i].push(new Vector3(x, y, z));
            }
            theta += thetaStep;

        }


        let _verts = new Float32Array(_vecs);
        this.mesh = new Mesh();
        this.mesh.geometry.setAttribute('position', new BufferAttribute(_verts, 3));
        this.mesh.material = this.mat;
        this.add(this.mesh);

        // indices
        const slices = _vecs3[0].length;
        for (let i = 0, k = 0; i < _vecs3.length; i++) {
            _inds3[i] = [];
            for (let j = 0; j < _vecs3[i].length; j++) {
                // tri 1
                const ind0 = slices * k;
                const ind1 = slices * k + k;
                const ind2 = slices * k + k + 1;
                _inds3.push(new Vector3(ind0, ind1, ind2));

                // tri 2
                const ind3 = slices * k;
                const ind4 = slices * k + k + 1;
                const ind5 = slices * k + 1;
                _inds3.push(new Vector3(ind3, ind4, ind5));
                console.log(_inds[k]);
                k += slices;

            }
        }


        // rectangular
        // const stepW = this.dim.x / detail0;
        // const stepH = this.dim.y / detail1;
        // const _vecs: number[] = [];
        // for (let i = 0; i < detail0; i++) {
        //     for (let j = 0; j < detail1; j++) {
        //         _vecs.push(stepW * i);
        //         _vecs.push(stepH * j);
        //         _vecs.push(0);
        //     }
        // }
        // let rectVerts = new Float32Array(_vecs);
        // this.mesh = new Mesh();
        // this.mesh.geometry.setAttribute('position', new BufferAttribute(rectVerts, 3));
        // this.mesh.material = this.mat;

        // disk

    }
}