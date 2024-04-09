import { timeStamp } from "console";
import { BufferAttribute, BufferGeometry, Color, DoubleSide, Group, InterleavedBufferAttribute, Line, LineBasicMaterial, Material, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, PlaneGeometry, Texture, TextureLoader, Triangle, Vector2, Vector3, Vector4 } from "three";
import { AnchorPlane, AxesPlane, TWO_PI } from "./IJGUtils";
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
        let detailX = 0;
        let detailY = 0;
        let detailZ = 0;
        let detailW = 0;

        if (this.detail instanceof Vector2) {
            detailX = this.detail.x;
            detailY = this.detail.y;
        } else if (this.detail instanceof Vector3) {
            detailX = this.detail.x;
            detailY = this.detail.y;
            detailZ = this.detail.z;
        } else if (this.detail instanceof Vector4) {
            detailX = this.detail.x;
            detailY = this.detail.y;
            detailZ = this.detail.z;
            detailW = this.detail.w;
        } else {
            detailX = detailY = this.detail;
        }

        // elliptical
        const stepArc = TWO_PI / detailX;
        const stepSlice = this.dim.y / detailY;
        const _vecs: number[] = [];
        for (let i = 0; i < detailX; i++) {
            for (let j = 0; j < detailY; j++) {
            }
        }

        // rectangular
        const stepW = this.dim.x / detailX;
        const stepH = this.dim.y / detailY;
        const _vecs: number[] = [];
        for (let i = 0; i < detailX; i++) {
            for (let j = 0; j < detailY; j++) {
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