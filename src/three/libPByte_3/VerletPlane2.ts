import { timeStamp } from "console";
import { BufferAttribute, BufferGeometry, Color, DoubleSide, Group, InterleavedBufferAttribute, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, PlaneGeometry, Texture, TextureLoader, Triangle, Vector3 } from "three";
import { AnchorPlane, AxesPlane } from "./IJGUtils";
import { VerletGeometryBase } from "./VerletGeometryBase";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";

// includes mapped texture
// VerletPlane just includes Verlet grid

export class VerletPlane2 extends VerletGeometryBase {

    width: number;
    height: number;
    widthSegs: number;
    heightSegs: number;
    diffuseImage: string;
    anchor: AnchorPlane;
    elasticity: number;
    axisPlane: AxesPlane;

    planeGeom: PlaneGeometry;
    planeMat: MeshPhongMaterial;
    // planeMesh: Mesh;

    //positions: InterleavedBufferAttribute;

    rowCount: number;
    colCount: number;

    // conveneince node refernces to ensure 
    // verlet doesn't explode form
    bodyNodes: VerletNode[] = [];
    edgeNodes: VerletNode[] = [];
    cornerNodes: VerletNode[] = [];

    nodes2D: VerletNode[][] = [];
    nodes1D: VerletNode[] = []; // for convenience
    sticks: VerletStick[] = [];

    // for convenience
    rowSticks: VerletStick[] = [];
    colSticks: VerletStick[] = [];

    // collect triangles for collisions
    tris: Triangle[] = [];

    //normal for testing
    lineNorm: Line | undefined;
    lineNorms: Line[] = [];

    constructor(width: number, height: number, widthSegs: number, heightSegs: number, diffuseImage: string, anchor: AnchorPlane = AnchorPlane.NONE, elasticity: number = .5, axisPlane: AxesPlane = AxesPlane.ZX_AXIS) {
        super();

        this.width = width;
        this.height = height;
        this.widthSegs = widthSegs;
        this.heightSegs = heightSegs;
        this.diffuseImage = diffuseImage;
        this.anchor = anchor;
        this.elasticity = elasticity;
        this.axisPlane = axisPlane;


        this.planeGeom = new PlaneGeometry(width, height, widthSegs, heightSegs);
        const tex = new TextureLoader().load(diffuseImage);
        this.planeMat = new MeshPhongMaterial({ map: tex, side: DoubleSide, wireframe: true, specular: 0xffffff, shininess: 250 });
        this.colCount = widthSegs + 1;
        this.rowCount = heightSegs + 1;
        this.geometry = this.planeGeom;
        this.material = this.planeMat;

        this._init();
    }

    _init(): void {
        // this.positions = this.planeGeom.attributes.position;
        let position = this.geometry.attributes.position;
        for (let i = 0; i < position.count; i++) {
            //console.log(position.getX(i));
            const n = new Vector3(position.getX(i), position.getY(i), position.getZ(i));
            this.nodes.push(new VerletNode(n, 3, new Color(1, .5, .2)));
        }
        // console.log("len = ", this.nodes.length)
        // console.log("len = ", this.colCount * this.rowCount)

        for (let i = 0, k = 0; i < this.colCount; i++) {
            let v1D: VerletNode[] = [];
            for (let j = 0; j < this.rowCount; j++) {
                const n = new Vector3(position.getX(k), position.getY(k), position.getZ(k));
                let node: VerletNode = new VerletNode(n, 3, new Color(1, .5, .2));
                //v1D.push(node)
                this.nodes1D.push(node);
                v1D.push(node);


                if (i > 0 && i < this.colCount - 1 &&
                    j > 0 && j < this.rowCount - 1) {
                    this.bodyNodes.push(node);
                } else {
                    this.edgeNodes.push(node);

                    // corners (TL, BL, BR, TR)
                    if (i === 0 && j === 0) {
                        this.cornerNodes.push(node);
                    } else if (i === this.colCount - 1 && j === 0) {
                        this.cornerNodes.push(node);
                    } else if (i === this.colCount - 1 && j === this.rowCount - 1) {
                        this.cornerNodes.push(node);
                    } else if (i === 0 && j === this.rowCount - 1) {
                        this.cornerNodes.push(node);
                    }
                }
                k++
            }
            this.nodes2D.push(v1D);
            //console.log("i  = ", i)
        }
        // console.log("len = ", this.nodes2D.length)

        // calc VerletSticks
        let vs: VerletStick;

        for (var i = 0; i < this.nodes2D.length; i++) {
            for (var j = 0; j < this.nodes2D[i].length; j++) {
                // connects down along columns
                if (j < this.nodes2D[i].length - 1) {
                    vs = new VerletStick(this.nodes2D[i][j], this.nodes2D[i][j + 1]);
                    this.sticks.push(vs);
                    this.add(vs);

                    this.colSticks.push(vs);
                    // connects right along rows
                    if (i < this.nodes2D.length - 1) {
                        vs = new VerletStick(this.nodes2D[i][j], this.nodes2D[i + 1][j]);
                        this.sticks.push(vs);
                        this.add(vs);

                        this.rowSticks.push(vs);
                    }
                } else {
                    // connects right along last row
                    if (i < this.nodes2D.length - 1) {
                        vs = new VerletStick(this.nodes2D[i][j], this.nodes2D[i + 1][j]);
                        this.sticks.push(vs);
                        this.add(vs);

                        this.rowSticks.push(vs);
                    }
                }
            }
        }

        //collect triangles
        for (let i = 0, k = 0; i < this.nodes2D.length - 1; i++) {
            for (let j = 0; j < this.nodes2D[i].length - 1; j++) {
                this.tris.push(
                    new Triangle(
                        this.nodes2D[i][j].position,
                        this.nodes2D[i + 1][j].position,
                        this.nodes2D[i + 1][j + 1].position
                    )
                );
                this.tris.push(
                    new Triangle(
                        this.nodes2D[i][j].position,
                        this.nodes2D[i + 1][j + 1].position,
                        this.nodes2D[i][j + 1].position
                    )
                );
            }
        }

        // create normals for testing
        // for (var t of this.tris) {
        //     let no = new Vector3();
        //     let norm = t.getNormal(no);
        //     norm.multiplyScalar(25);
        //     const lineMat = new LineBasicMaterial({
        //         color: 0xFF9911
        //     });

        //     const points = [];
        //     let mp = new Vector3();
        //     mp = t.getMidpoint(mp);
        //     points.push(new Vector3(mp.x, mp.y, mp.z));
        //     points.push(new Vector3(mp.x + norm.x, mp.y + norm.y, mp.z + norm.z));

        //     const lineGeom = new BufferGeometry().setFromPoints(points);
        //     let ln = new Line(lineGeom, lineMat);
        //     this.lineNorms.push(ln)
        //     //  this.add(ln);
        // }


        // let no = new Vector3();
        // let norm = this.tris[150].getNormal(no);
        // norm.multiplyScalar(220);
        // const lineMat = new LineBasicMaterial({
        //     color: 0xFF9911
        // });

        // const points = [];
        // points.push(new Vector3(this.tris[150].a.x, this.tris[150].a.y, this.tris[150].a.z));
        // points.push(new Vector3(this.tris[150].a.x + norm.x, this.tris[150].a.y + norm.y, this.tris[150].a.z + norm.z));

        // const lineGeom = new BufferGeometry().setFromPoints(points);

        // this.lineNorm = new Line(lineGeom, lineMat);
        // this.add(this.lineNorm);
    }



    // Lock select nodes
    setNodesOff(nodesOff: AnchorPlane) {
        switch (nodesOff) {
            case AnchorPlane.CORNER_ALL:
                for (let i = 0; i < this.nodes2D.length; i++) {
                    for (let j = 0; j < this.nodes2D[i].length; j++) {
                        // TURN OFF NODES
                        //top left corner
                        if (i == 0 && j == 0) {
                            this.nodes2D[i][j].isVerletable = false;
                        } else if (i == 0 && j == this.nodes2D[i].length - 1) {
                            this.nodes2D[i][j].isVerletable = false;
                        } else if (i == this.nodes2D.length - 2 && j == 0) {
                            this.nodes2D[i][j].isVerletable = false;
                        } else if (i == this.nodes2D.length - 2 && j == this.nodes2D[i].length - 1) {
                            this.nodes2D[i][j].isVerletable = false;
                        }
                    }
                    //TURN OFF STICKS
                    // top left sticks
                    this.colSticks[0].anchorTerminal = 1;
                    this.rowSticks[0].anchorTerminal = 1;

                    // top right sticks
                    this.colSticks[this.heightSegs * this.widthSegs].anchorTerminal = 1;
                    this.rowSticks[this.rowSticks.length - 1 - this.heightSegs].anchorTerminal = 2;

                    // bottem left sticks
                    this.colSticks[this.heightSegs - 1].anchorTerminal = 2;
                    this.rowSticks[this.widthSegs].anchorTerminal = 1;

                    // bottem right sticks
                    this.colSticks[this.colSticks.length - 1].anchorTerminal = 2;
                    this.rowSticks[this.rowSticks.length - 1].anchorTerminal = 2;

                    // this.rowSticks[19].lineMaterial.opacity = 0;
                }
                break;

            case AnchorPlane.EDGE_LEFT:
                for (let i = 0; i < this.rowSticks.length; i += this.heightSegs + 1) {
                    //  this.rowSticks[i].lineMaterial.opacity = 0;
                    this.rowSticks[i].anchorTerminal = 2;
                }
                for (let i = 0; i < this.colSticks.length; i += this.heightSegs) {
                    // this.colSticks[i].lineMaterial.opacity = 0;
                    this.colSticks[i].anchorTerminal = 1;
                }
                break;

            case AnchorPlane.EDGE_BOTTOM:
                for (let i = (this.heightSegs + 1) * (this.widthSegs - 1); i < this.rowSticks.length; i++) {
                    // this.rowSticks[i].lineMaterial.opacity = 0;
                    this.rowSticks[i].anchorTerminal = 2;
                }

                //console.log(this.heightSegs);
                for (let i = this.widthSegs * this.heightSegs; i < this.colSticks.length; i++) {
                    // this.colSticks[i].lineMaterial.opacity = 0;
                    this.colSticks[i].anchorTerminal = 1;
                }
                break;

            case AnchorPlane.EDGE_RIGHT:
                for (let i = this.heightSegs; i < this.rowSticks.length; i += this.heightSegs + 1) {
                    //this.rowSticks[i].lineMaterial.opacity = 0;
                    this.rowSticks[i].anchorTerminal = 1;
                }
                for (let i = this.heightSegs - 1; i < this.colSticks.length; i += this.heightSegs) {
                    //this.colSticks[i].lineMaterial.opacity = 0;
                    this.colSticks[i].anchorTerminal = 2;
                }
                break;

            case AnchorPlane.EDGE_TOP:
                for (let i = 0; i < this.heightSegs + 1; i++) {
                    // this.rowSticks[i].lineMaterial.opacity = 0;
                    this.rowSticks[i].anchorTerminal = 1;
                }
                for (let i = 0; i < this.heightSegs; i++) {
                    //  this.colSticks[i].lineMaterial.opacity = 0;
                    this.colSticks[i].anchorTerminal = 2;
                }
                break;

            case AnchorPlane.EDGES_ALL:
                //top edge
                for (let i = 0; i < this.rowSticks.length; i += this.heightSegs + 1) {
                    //  this.rowSticks[i].lineMaterial.opacity = 0;
                    this.rowSticks[i].anchorTerminal = 2;
                }
                for (let i = 0; i < this.colSticks.length; i += this.heightSegs) {
                    // this.colSticks[i].lineMaterial.opacity = 0;
                    this.colSticks[i].anchorTerminal = 1;
                }

                //right edge
                for (let i = (this.heightSegs + 1) * (this.widthSegs - 1); i < this.rowSticks.length; i++) {
                    // this.rowSticks[i].lineMaterial.opacity = 0;
                    this.rowSticks[i].anchorTerminal = 2;
                }

                //console.log(this.heightSegs);
                for (let i = this.widthSegs * this.heightSegs; i < this.colSticks.length; i++) {
                    // this.colSticks[i].lineMaterial.opacity = 0;
                    this.colSticks[i].anchorTerminal = 1;
                }

                //bottom edge
                for (let i = this.heightSegs; i < this.rowSticks.length; i += this.heightSegs + 1) {
                    //this.rowSticks[i].lineMaterial.opacity = 0;
                    this.rowSticks[i].anchorTerminal = 1;
                }
                for (let i = this.heightSegs - 1; i < this.colSticks.length; i += this.heightSegs) {
                    //this.colSticks[i].lineMaterial.opacity = 0;
                    this.colSticks[i].anchorTerminal = 2;
                }

                //left edge
                for (let i = 0; i < this.heightSegs + 1; i++) {
                    // this.rowSticks[i].lineMaterial.opacity = 0;
                    this.rowSticks[i].anchorTerminal = 1;
                }
                for (let i = 0; i < this.heightSegs; i++) {
                    //  this.colSticks[i].lineMaterial.opacity = 0;
                    this.colSticks[i].anchorTerminal = 2;
                }
                break;
        }
    }

    // move individual node - NOTE:: uses union
    moveNode(node: VerletNode | number, vec: Vector3): void {
        if (typeof node === "number") {
            // console.log(node)
            this.nodes1D[node].position.x += vec.x;
            this.nodes1D[node].position.y += vec.y;
            this.nodes1D[node].position.z += vec.z;
        } else {
            node.position.x += vec.x;
            node.position.y += vec.y;
            node.position.z += vec.z;
        }
    }

    // move random body nodes
    jitter(nodeCount: number, vecMax: Vector3): void {
        for (let i = 0; i < nodeCount; i++) {
            const id = Math.floor(Math.random() * (this.bodyNodes.length - 1))
            this.moveNode(this.bodyNodes[id], new Vector3(Math.random() * vecMax.x, Math.random() * vecMax.y, Math.random() * vecMax.z));
        }
    }

    renderVerletGeometry(areNodesVisible: boolean = true, areSticksVisible: boolean = true): void {
        let v = true;
        if (areNodesVisible) {
            v = true;
        } else {
            v = false;
        }
        for (var n of this.nodes1D) {
            n.setNodeVisible(v);
        }

        if (areSticksVisible) {
            v = true;
        } else {
            v = false;
        }
        for (var s of this.sticks) {
            s.setVisibility(false);
        }


    }

    verlet(): void {
        for (var n of this.bodyNodes) {
            //for (var n of this.nodes1D) {
            n.verlet();
        }

        for (var s of this.sticks) {
            s.constrainLen();
        }
        this.updatePlaneGeom();
    }

    // updates plane geometry based on verlet nodes
    updatePlaneGeom() {
        let position = this.geometry.attributes.position;
        position.needsUpdate = true;
        for (let i = 0; i < position.count; i++) {
            position.setXYZ(i, this.nodes1D[i].position.x, this.nodes1D[i].position.y, this.nodes1D[i].position.z);
        }


        // for (let i = 0; i < this.tris.length; i++) {
        //     // create normal for testing
        //     let no = new Vector3();
        //     let norm = this.tris[i].getNormal(no);
        //     norm.multiplyScalar(40);

        //     const points = [];
        //     let mp = new Vector3();
        //     mp = this.tris[i].getMidpoint(mp);
        //     points.push(new Vector3(mp.x, mp.y, mp.z));
        //     points.push(new Vector3(mp.x + norm.x, mp.y + norm.y, mp.z + norm.z));
        //     const lineGeom = new BufferGeometry().setFromPoints(points);
        //     this.lineNorms[i].geometry = lineGeom
        //     this.lineNorms[i].geometry.attributes.position.needsUpdate = true;
        // }
    }

    getTris(): Triangle[] {
        return this.tris;
    }

    // ensure passed pos is not on plane edge
    isEdgeNode(pos: Vector3): boolean {
        for (let i = 0; i < this.edgeNodes.length; i++) {
            if (pos.distanceTo(this.edgeNodes[i].position) < 1) {
                return true;
            }
        }
        return false;
    }

}