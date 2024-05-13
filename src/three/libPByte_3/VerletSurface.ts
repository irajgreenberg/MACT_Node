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

    dim: Vector2;
    detail: number | Vector2 | Vector3 | Vector4;
    mat: Material;
    elasticity: number;
    isEgdeAnchored: boolean;

    anchorNodes: VerletNode[] = [];

    // using not null assertion
    // mesh not initialized in cstr
    mesh!: Mesh;

    //needed for uv updates at requestAnimationFrame
    MinMaxXYPos!: Vector4

    counter = 0;

    constructor(dim: Vector2, detail: number | Vector2 | Vector3 | Vector4, mat: Material, elasticity: number = .005, isEgdeAnchored: boolean = true) {
        super();

        this.dim = dim;
        this.detail = detail;
        this.mat = mat;
        this.elasticity = elasticity;
        this.isEgdeAnchored = isEgdeAnchored;


        this._init();
    }

    /**
    * Generates surface mesh
    */
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

        /** Elliptical mesh 
        * created on XY-plane
        * detail0 = arcStep, detail1 = sliceStep, detail2, detail3 
        */
        const thetaStep = TWO_PI / detail0;
        const sliceXStep = this.dim.x / 2.0 / (detail1 - 1);
        const sliceYStep = this.dim.y / 2.0 / (detail1 - 1);
        let _vecs3_2D: Vector3[][] = [];
        let _vecs3_1D: Vector3[] = [];
        let _vecs: number[] = [];
        let _inds: number[] = [];
        let _UVs: number[] = [];
        let theta = 0.0;

        // vertices
        for (let i = 0; i < detail0; i++) {
            _vecs3_2D[i] = [];
            this.verletNodeEdgesAll2D[i] = [];
            this.nodes2D[i] = [];
            for (let j = 1; j < detail1; j++) {
                const x = cos(theta) * sliceXStep * j;
                const y = sin(theta) * sliceYStep * j;
                const z = 0

                _vecs.push(x);
                _vecs.push(y);
                _vecs.push(z);
                // for convenience
                _vecs3_2D[i].push(new Vector3(x, y, z)); // 2D
                _vecs3_1D.push(new Vector3(x, y, z)); // 1D
                const node = new VerletNode(new Vector3(x, y, z), 1, new Color(1, 1, 1));
                this.nodes.push(node);

                this.nodes2D[i].push(node);

                // capture edge nodes
                if (j == detail1 - 1) {
                    this.edgeNodes.push(node);
                    // node.isVerletable = false;
                    let v = new Vector3().copy(node.position).multiplyScalar(1.2);
                    this.armatureNodes.push(new VerletNode(v, 3, new Color(.5, .5, 0)));
                } else {
                    this.bodyNodes.push(node);
                }
                // if (j == i - 1) {
                //this.verletNodeEdgesAll2D[i].push(node);
                //}
            }
            theta += thetaStep;
        }
        // add final center point
        _vecs.push(0);
        _vecs.push(0);
        _vecs.push(0);
        this.centroidNode = new VerletNode(new Vector3(0, 0, 0), 3, new Color(1, 1, 1));
        this.nodes.push(this.centroidNode); // last position
        _vecs3_1D.push(this.centroidNode.position);

        // capture all node positions at creation
        this.captureNodesPosInit();

        // capture deltas of centroid node to all nodes
        this.captureNodesCentroidDist();

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
                        let c = (detail1 - 1) * i + j + (detail1 - 1); //4
                        let d = (detail1 - 1) * i + j; //1
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
                        let c = (detail1 - 1) * 0 + j;
                        let d = (detail1 - 1) * i + j;

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
        geometry.computeVertexNormals();
        geometry.computeTangents();
        this.mesh = new Mesh(geometry, this.mat)
        this.add(this.mesh);


        // capture min, max
        this.MinMaxXYPos = getMinMaxXYPos(_vecs3_1D);
        // To do: rectangular mesh

    }
    public update(): void {
        let pos = this.mesh.geometry.attributes.position;
        pos.needsUpdate = true;

        //update surface vertex date based on node position
        for (let i = 0; i < pos.count; i++) {
            pos.setX(i, this.nodes[i].position.x)
            pos.setY(i, this.nodes[i].position.y)
            pos.setZ(i, this.nodes[i].position.z)
        }
        this.mesh.geometry.computeVertexNormals();
        this.mesh.geometry.computeTangents();
    }

    getEdgeVecs(): Vector3[] {
        const vecs: Vector3[] = [];
        let pos = this.mesh.geometry.attributes.position;

        // ellipticl surface
        let k = 0;
        if (this.detail instanceof Vector2) {
            for (let i = 0; i < this.detail.x; i++) {
                for (let j = 1; j < this.detail.y; j++) {
                    if (j == this.detail.y - 2) {
                        //console.log(pos.getX(k));
                        vecs.push(new Vector3(pos.getX(k), pos.getY(k), pos.getZ(k)));
                    }
                    k++

                }
            }
        }
        return vecs;
    }
}