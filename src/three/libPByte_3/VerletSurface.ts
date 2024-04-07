import { timeStamp } from "console";
import { BufferAttribute, BufferGeometry, Color, DoubleSide, Group, InterleavedBufferAttribute, Line, LineBasicMaterial, Material, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, PlaneGeometry, Texture, TextureLoader, Triangle, Vector2, Vector3 } from "three";
import { AnchorPlane, AxesPlane } from "./IJGUtils";
import { VerletGeometryBase } from "./VerletGeometryBase";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";
import { VerletBase } from "./VerletBase";

// includes mapped texture
// VerletPlane just includes Verlet grid

export class VerletSurface extends VerletBase {

    pos: Vector3;
    dim: Vector2;
    detail: number | Vector2 | Vector3;
    mat: Material;
    anchor: AnchorPlane;
    elasticity: number;
    axisPlane: AxesPlane;

    anchorNodes: VerletNode[] = [];

    // using not null assertion
    // mesh not initialized in cstr
    mesh!: Mesh;


    constructor(pos: Vector3, dim: Vector2, detail: number | Vector2 | Vector3, mat: Material, anchor: AnchorPlane = AnchorPlane.NONE, elasticity: number = .05, axisPlane: AxesPlane = AxesPlane.ZX_AXIS) {

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
        let segs1 = 0;
        let segs2 = 0;
        let extra = 0;

        if (this.detail instanceof Vector2) {
            segs1 = this.detail.x;
            segs2 = this.detail.y;
        } else if (this.detail instanceof Vector3) {
            segs1 = this.detail.x;
            segs2 = this.detail.y;
            extra = this.detail.z;
        } else {
            segs1 = segs2 = this.detail;
        }

        // elliptical
        for (let i = 0; i < segs1; i++) {
            for (let j = 0; j < segs2; j++) {
            }
        }

        // rectangular
        const stepW = this.dim.x / segs1;
        const stepH = this.dim.y / segs2;
        const _vecs: number[] = [];
        for (let i = 0; i < segs1; i++) {
            for (let j = 0; j < segs2; j++) {
                _vecs.push(stepW * i);
                _vecs.push(stepH * j);
                _vecs.push(0);
            }
        }
        let rectVerts = new Float32Array(_vecs);
        this.mesh = new Mesh();
        this.mesh.geometry.setAttribute('position', new BufferAttribute(rectVerts, 3));
        this.mesh.material = this.mat;

        // disk

    }