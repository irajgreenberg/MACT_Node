import { timeStamp } from "console";
import { BufferAttribute, BufferGeometry, Color, DoubleSide, Group, InterleavedBufferAttribute, Line, LineBasicMaterial, Material, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, PlaneGeometry, Texture, TextureLoader, Triangle, Vector2, Vector3, Vector4 } from "three";
import { AnchorPlane, AxesPlane, PI, TWO_PI, cos, getMinMaxXYPos, getNormalizedUVArr, sin } from "./IJGUtils";
import { VerletGeometryBase } from "./VerletGeometryBase";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";
import { VerletBase } from "./VerletBase";
import { mapLinear, randFloat, randInt } from "three/src/math/MathUtils";

// includes mapped texture
// VerletPlane just includes Verlet grid

export class VerletSurface extends VerletBase {

    pos: Vector3;
    dim: Vector2;
    detail: number | Vector2 | Vector3 | Vector4;
    mat: Material;
    elasticity: number;

    anchorNodes: VerletNode[] = [];

    // using not null assertion
    // mesh not initialized in cstr
    mesh!: Mesh;

    //needed for uv updates at requestAnimationFrame
    MinMaxXYPos!: Vector4

    counter = 0;

    constructor(pos: Vector3, dim: Vector2, detail: number | Vector2 | Vector3 | Vector4, mat: Material, elasticity: number = .005) {

        // constructor(width: number, height: number, widthSegs: number, heightSegs: number, diffuseImage: string, anchor: AnchorPlane = AnchorPlane.NONE, elasticity: number = .5, axisPlane: AxesPlane = AxesPlane.ZX_AXIS) {
        super();

        this.pos = pos;
        this.dim = dim;
        this.detail = detail;
        this.mat = mat;
        this.elasticity = elasticity;


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
        let _vecs3_2D: Vector3[][] = [];
        let _vecs3_1D: Vector3[] = [];
        let _vecs: number[] = [];
        let _inds: number[] = [];
        let _UVs: number[] = [];
        let theta = 0.0;

        // vertices
        for (let i = 0; i < detail0; i++) {
            _vecs3_2D[i] = [];
            this.nodes2D[i] = [];
            for (let j = 1; j < detail1; j++) {
                const x = this.pos.x + cos(theta) * sliceXStep * j;
                const y = this.pos.y + sin(theta) * sliceYStep * j;
                const z = this.pos.z;

                _vecs.push(x);
                _vecs.push(y);
                _vecs.push(z);
                // for convenience
                _vecs3_2D[i].push(new Vector3(x, y, z)); // 2D
                _vecs3_1D.push(new Vector3(x, y, z)); // 1D
                const node = new VerletNode(new Vector3(x, y, z), 3, new Color(1, 1, 1));
                this.nodes.push(node);

                this.nodes2D[i].push(node);

                // capture edge nodes and turn off their verlet
                if (j == detail1 - 1) {
                    // node.isVerletable = false;
                    this.edgeNodes.push(node);

                    let v = new Vector3().copy(node.position).multiplyScalar(1.2);
                    this.armatureNodes.push(new VerletNode(v, 3, new Color(.5, .5, 0)));
                } else {
                    this.bodyNodes.push(node);
                }
            }
            theta += thetaStep;
        }
        // add final center point
        _vecs.push(this.pos.x);
        _vecs.push(this.pos.y);
        _vecs.push(this.pos.z);
        this.centroidNode = new VerletNode(new Vector3(this.pos.x, this.pos.y, this.pos.z), 3, new Color(1, 1, 1));
        this.nodes.push(this.centroidNode);
        _vecs3_1D.push(this.centroidNode.position);


        // indices
        for (let i = 0; i < detail0; i++) {
            for (let j = 0; j < detail1 - 2; j++) {
                if (i < detail0 - 1) {
                    let a = (detail1 - 1) * i + j; //0
                    let b = (detail1 - 1) * i + j + (detail1 - 1); //3
                    let c = (detail1 - 1) * i + j + (detail1); //4
                    let d = (detail1 - 1) * i + j + 1; //1

                    //tri1                    
                    _inds.push(c);
                    _inds.push(b);
                    _inds.push(a);
                    //tri2
                    _inds.push(d);
                    _inds.push(c);
                    _inds.push(a);

                    // close center
                    //if (j == detail1 - 3) {
                    if (j == 0) {
                        // console.log("test");
                        _inds.push(c);
                        _inds.push(_vecs.length / 3 - 1);
                        _inds.push(d);
                    }
                } else {
                    let a = (detail1 - 1) * i + j;
                    let b = (detail1 - 1) * 0 + j + 0;
                    let c = (detail1 - 1) * 0 + j + 1;
                    let d = (detail1 - 1) * i + j + 1;

                    //tri1
                    _inds.push(c);
                    _inds.push(b);
                    _inds.push(a);
                    //tri2
                    _inds.push(d);
                    _inds.push(c);
                    _inds.push(a);

                    // close center
                    if (j == 0) {
                        _inds.push(c);
                        _inds.push(_vecs.length / 3 - 1);
                        _inds.push(d);

                    }
                }
            }
        }

        for (let i = 0; i < this.nodes2D.length; i++) {
            for (let j = 0; j < this.nodes2D[i].length; j++) {
                // perimeter sticks
                if (i < this.nodes2D.length - 1) {
                    this.sticks.push(new VerletStick(this.nodes2D[i][j], this.nodes2D[i + 1][j], randFloat(this.elasticity, this.elasticity)));
                    this.sticks[this.sticks.length - 1].setColor(new Color(.2, .3, .4));

                    // diagonals
                    if (j > 0) {
                        this.sticks.push(new VerletStick(this.nodes2D[i][j - 1], this.nodes2D[i + 1][j], this.elasticity));
                        this.sticks[this.sticks.length - 1].setColor(new Color(.2, .3, .4));
                        this.sticks.push(new VerletStick(this.nodes2D[i][j], this.nodes2D[i + 1][j - 1], this.elasticity));
                        this.sticks[this.sticks.length - 1].setColor(new Color(.2, .3, .4));
                    }
                    // close perimeter
                } else {
                    this.sticks.push(new VerletStick(this.nodes2D[i][j], this.nodes2D[0][j], randFloat(this.elasticity, this.elasticity)));
                    this.sticks[this.sticks.length - 1].setColor(new Color(.2, .3, .4));

                    // diagonals
                    if (j > 0) {
                        this.sticks.push(new VerletStick(this.nodes2D[i][j - 1], this.nodes2D[0][j], this.elasticity));
                        this.sticks[this.sticks.length - 1].setColor(new Color(.2, .3, .4));
                        this.sticks.push(new VerletStick(this.nodes2D[i][j], this.nodes2D[0][j - 1], this.elasticity));
                        this.sticks[this.sticks.length - 1].setColor(new Color(.2, .3, .4));
                    }
                }
                // slices
                if (j > 0) {
                    this.sticks.push(new VerletStick(this.nodes2D[i][j - 1], this.nodes2D[i][j], randFloat(this.elasticity, this.elasticity)));
                    this.sticks[this.sticks.length - 1].setColor(new Color(.2, .3, .4));
                } else {
                    this.sticks.push(new VerletStick(this.nodes2D[i][0], this.centroidNode, randFloat(this.elasticity, this.elasticity)));
                    this.sticks[this.sticks.length - 1].setColor(new Color(.2, .3, .4));
                }
            }
        }

        // attach edge nodes to armature
        for (let i = 0; i < this.edgeNodes.length; i++) {
            this.crossSupports.push(new VerletStick(this.edgeNodes[i], this.armatureNodes[i], randFloat(.001, .7), 2));
        }

        // create surface geometry
        const verts = new Float32Array(_vecs);
        const _uvs = getNormalizedUVArr(_vecs3_1D);
        const UVs = new Float32Array(_uvs);

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(verts, 3));
        geometry.setAttribute('uv', new BufferAttribute(UVs, 2));
        geometry.setIndex(_inds);
        this.mesh = new Mesh(geometry, this.mat)
        this.add(this.mesh);

        // capture min, max
        this.MinMaxXYPos = getMinMaxXYPos(_vecs3_1D);
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


    update(): void {

        this.centroidNode.position.y = sin(this.counter * PI / 125) * 40;

        for (let i = 0; i < this.nodes.length; i++) {
            if (i % 17 == 0) {
                this.nodes[i].moveNode(new Vector3(randFloat(-2.5, 2.5), randFloat(-2.5, 2.5), randFloat(-2.5, 2.5)));
            }

            if (i < this.nodes.length - 1) {
                const delta = this.centroidNode.position.distanceTo(this.nodes[i].position);
                const deltaMapped = mapLinear(delta, 0, this.dim.y / 2, 1, 0);
                this.nodes[i].position.z += sin(this.counter * PI / 125) * 40 * deltaMapped * randFloat(.001, .01);
                // this.nodes[i].position.x += cos(this.counter * PI / 125) * 40 * deltaMapped * randFloat(.001, .01);
            }
        }

        this.centroidNode.position.z = sin(this.counter * PI / 45) * 90;
        // this.centroidNode.position.y = sin(this.counter * PI / 125) * 340;
        //this.nodes[randInt(0, this.nodes.length - 1)].position.z = sin(this.counter * PI / 45) * 50;


        this.counter++;
        // get geom data form mesh
        let pos = this.mesh.geometry.attributes.position;
        pos.needsUpdate = true;

        //update surface vertex date based on node position
        const tempVecs: Vector3[] = [];
        for (let i = 0; i < pos.count; i++) {
            pos.setX(i, this.nodes[i].position.x)
            pos.setY(i, this.nodes[i].position.y)
            pos.setZ(i, this.nodes[i].position.z)

            tempVecs.push(new Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
        }

        // const xyMinMax = getMinMaxXYPos(tempVecs);
        let uvs = this.mesh.geometry.attributes.uv;

        // this.MinMaxXYPos
        //update surface vertex date based on node position
        for (let i = 0; i < uvs.count; i++) {
            const u = mapLinear(this.nodes[i].position.x, this.MinMaxXYPos.x, this.MinMaxXYPos.y, 0, 1);
            const v = mapLinear(this.nodes[i].position.y, this.MinMaxXYPos.z, this.MinMaxXYPos.w, 0, 1);

            // const u = mapLinear(this.nodes[i].position.x, xyMinMax.x, xyMinMax.y, 0, 1);
            // const v = mapLinear(this.nodes[i].position.y, xyMinMax.z, xyMinMax.w, 0, 1);
            //uvs.setXY(i, u, v);
        }
        // uvs.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
        this.mesh.geometry.computeTangents()

    }
}