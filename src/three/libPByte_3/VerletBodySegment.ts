import { BoxGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, MeshPhongMaterial, Vector3, BufferGeometry, BufferAttribute, Float32BufferAttribute, Color, TextureLoader, RepeatWrapping } from 'three';
import { clamp, randFloat } from "three/src/math/MathUtils";
//import { Ticks } from "tone";
import { BlockFace, cos, EnvironmentPhysics, PhysTrig, PI, sin } from "./IJGUtils";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";



export class VerletBodySegment extends Group {

    bodyPos: Vector3;
    bodyDim: Vector3;
    color: Color;
    skinName: string;
    physObj?: EnvironmentPhysics;
    whichFaceAttach?: BlockFace;
    faceNodes?: VerletNode[];
    taper?: Vector3;
    faceNodes2?: VerletNode[];  // for closing loop

    bodyNodes: VerletNode[] = [];
    frontNodes: VerletNode[] = [];
    backNodes: VerletNode[] = [];
    leftNodes: VerletNode[] = [];
    rightNodes: VerletNode[] = [];
    topNodes: VerletNode[] = [];
    bottomNodes: VerletNode[] = [];

    bodySticks: VerletStick[] = [];

    bodyNodeRad = 3;
    bodyTension = .1;
    diagTension = .5;

    isStructureViewable = false;

    mover = 0;

    phys?: PhysTrig;
    counter = 0;

    // ensures no double adjacency
    // FRONT,BACK,LEFT,RIGHT,TOP,BOTTOM
    isAdjacent = { front: false, back: false, left: false, right: false, top: false, bottom: false };


    // skinning test
    //boxGeom: BoxGeometry;
    //boxMat: MeshPhongMaterial;
    // boxMesh: Mesh;

    indices = [0, 3, 2, 0, 2, 1, 1, 2, 6, 1, 6, 5, 5, 6, 7, 5, 7, 4, 4, 7, 3, 4, 3, 0, 4, 0, 1, 4, 1, 5, 6, 2, 3, 6, 3, 7];
    //  boxData: BufferGeometry;
    //  vertices: Float32Array;

    inds2D = [
        [0, 3, 2],
        [0, 2, 1],
        [1, 2, 6],
        [1, 6, 5],
        [5, 6, 7],
        [5, 7, 4],
        [4, 7, 3],
        [4, 3, 0],
        [4, 0, 1],
        [4, 1, 5],
        [6, 2, 3],
        [6, 3, 7]
    ];
    norms = [
        [0, 0, -1],
        [0, 0, -1],
        [1, 0, 0],
        [1, 0, 0],
        [0, 0, 1],
        [0, 0, 1],
        [-1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, -1, 0]
    ];
    faces: Mesh[] = [];




    constructor(bodyPos: Vector3 = new Vector3(), bodyDim: Vector3, color: Color, skinName: string = "", physObj?: EnvironmentPhysics, whichFaceAttach?: BlockFace, faceNodes?: VerletNode[], taper?: Vector3, faceNodes2?: VerletNode[], phys?: PhysTrig) {
        super();
        //console.log(faceNodes2);
        this.bodyPos = bodyPos;
        this.bodyDim = bodyDim;
        this.color = color;
        this.skinName = skinName;
        this.physObj = physObj;
        this.whichFaceAttach = whichFaceAttach;
        this.faceNodes = faceNodes;
        this.taper = taper;
        this.phys = phys;
        this.faceNodes2 = faceNodes2; // option closed path
        if (this.physObj) {
            this.physObj.gravity = -.001
        }

        /*
             4--------5
        0----|---1    |
        |    |   |    |
        |    7---|----6
        3--------2
        */
        // if (faceNodes2) {
        //     //  if (faceNodes2.length == 4) {
        //     console.log("at last segment")
        //     //  }

        // }
        switch (whichFaceAttach) {
            case BlockFace.FRONT:
                //F 0123
                // Create Nodes
                if (faceNodes && faceNodes2) {
                    // front
                    this.bodyNodes.push(faceNodes[1]);
                    this.bodyNodes.push(faceNodes[0]);
                    this.bodyNodes.push(faceNodes[3]);
                    this.bodyNodes.push(faceNodes[2]);
                    // back  CHECK winding
                    this.bodyNodes.push(faceNodes2[2]);
                    this.bodyNodes.push(faceNodes2[3]);
                    this.bodyNodes.push(faceNodes2[0]);
                    this.bodyNodes.push(faceNodes2[1]);
                } else if (faceNodes) {
                    const shim = faceNodes[1].position.z - this.bodyDim.z;
                    // front
                    this.bodyNodes.push(faceNodes[1]);
                    this.bodyNodes.push(faceNodes[0]);
                    this.bodyNodes.push(faceNodes[3]);
                    this.bodyNodes.push(faceNodes[2]);
                    // back
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[1].position.x, faceNodes[1].position.y, shim), this.bodyNodeRad));
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[0].position.x, faceNodes[0].position.y, shim), this.bodyNodeRad));
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[3].position.x, faceNodes[3].position.y, shim), this.bodyNodeRad));
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[2].position.x, faceNodes[2].position.y, shim), this.bodyNodeRad));

                }
                break;
            case BlockFace.BACK:
                // B 5476
                // Create Nodes
                if (faceNodes && faceNodes2) {
                    // front // CHECK winding here
                    this.bodyNodes.push(faceNodes2[3]);
                    this.bodyNodes.push(faceNodes2[2]);
                    this.bodyNodes.push(faceNodes2[1]);
                    this.bodyNodes.push(faceNodes2[0]);

                    // back
                    this.bodyNodes.push(faceNodes[0]);
                    this.bodyNodes.push(faceNodes[1]);
                    this.bodyNodes.push(faceNodes[2]);
                    this.bodyNodes.push(faceNodes[3]);
                } else if (faceNodes) {
                    const shim = faceNodes[1].position.z + this.bodyDim.z;
                    // front
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[0].position.x, faceNodes[0].position.y, shim), this.bodyNodeRad));
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[1].position.x, faceNodes[1].position.y, shim), this.bodyNodeRad));
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[2].position.x, faceNodes[2].position.y, shim), this.bodyNodeRad));
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[3].position.x, faceNodes[3].position.y, shim), this.bodyNodeRad));

                    // back
                    this.bodyNodes.push(faceNodes[0]);
                    this.bodyNodes.push(faceNodes[1]);
                    this.bodyNodes.push(faceNodes[2]);
                    this.bodyNodes.push(faceNodes[3]);
                }
                break;
            case BlockFace.LEFT:
                // Create Nodes
                // 4, 0, 3, 7
                if (faceNodes && faceNodes2) {
                    // front
                    this.bodyNodes.push(faceNodes[0]);  //0
                    this.bodyNodes.push(faceNodes2[1]);
                    this.bodyNodes.push(faceNodes2[2]);
                    this.bodyNodes.push(faceNodes[3]); //3

                    // back
                    this.bodyNodes.push(faceNodes[1]); //4
                    this.bodyNodes.push(faceNodes2[0]);
                    this.bodyNodes.push(faceNodes2[3]);
                    this.bodyNodes.push(faceNodes[2]);  //7
                } else if (faceNodes) {
                    const shim = faceNodes[1].position.x + this.bodyDim.x;
                    // front
                    this.bodyNodes.push(faceNodes[0]);  //0
                    this.bodyNodes.push(new VerletNode(new Vector3(shim, faceNodes[0].position.y, faceNodes[0].position.z), this.bodyNodeRad));  //1
                    this.bodyNodes.push(new VerletNode(new Vector3(shim, faceNodes[3].position.y, faceNodes[3].position.z), this.bodyNodeRad)); //2
                    this.bodyNodes.push(faceNodes[3]); //3

                    // back
                    this.bodyNodes.push(faceNodes[1]); //4
                    this.bodyNodes.push(new VerletNode(new Vector3(shim, faceNodes[1].position.y, faceNodes[1].position.z), this.bodyNodeRad));  //5
                    this.bodyNodes.push(new VerletNode(new Vector3(shim, faceNodes[2].position.y, faceNodes[2].position.z), this.bodyNodeRad)); //6
                    this.bodyNodes.push(faceNodes[2]);  //7
                }
                break;
            case BlockFace.RIGHT:
                if (faceNodes && faceNodes2) {
                    // front
                    this.bodyNodes.push(faceNodes2[0]);
                    this.bodyNodes.push(faceNodes[1]);
                    this.bodyNodes.push(faceNodes[2]);
                    this.bodyNodes.push(faceNodes2[3]);

                    // back
                    this.bodyNodes.push(faceNodes2[1]);
                    this.bodyNodes.push(faceNodes[0]);
                    this.bodyNodes.push(faceNodes[3]);
                    this.bodyNodes.push(faceNodes2[2]);
                } else if (faceNodes) {
                    const shim = faceNodes[1].position.x - this.bodyDim.x;
                    //R 1562
                    // front
                    this.bodyNodes.push(new VerletNode(new Vector3(shim, faceNodes[1].position.y, faceNodes[2].position.z), this.bodyNodeRad));
                    this.bodyNodes.push(faceNodes[1]);
                    this.bodyNodes.push(faceNodes[2]);
                    this.bodyNodes.push(new VerletNode(new Vector3(shim, faceNodes[2].position.y, faceNodes[1].position.z), this.bodyNodeRad));

                    // back
                    this.bodyNodes.push(new VerletNode(new Vector3(shim, faceNodes[0].position.y, faceNodes[3].position.z), this.bodyNodeRad));
                    this.bodyNodes.push(faceNodes[0]);
                    this.bodyNodes.push(faceNodes[3]);
                    this.bodyNodes.push(new VerletNode(new Vector3(shim, faceNodes[3].position.y, faceNodes[0].position.z), this.bodyNodeRad));
                }
                break;
            case BlockFace.TOP:
                //T 4510
                if (faceNodes && faceNodes2) {
                    this.bodyNodes.push(faceNodes[3]);
                    this.bodyNodes.push(faceNodes[2]);
                    this.bodyNodes.push(faceNodes2[0]);
                    this.bodyNodes.push(faceNodes2[1]);

                    // back
                    this.bodyNodes.push(faceNodes[0]);
                    this.bodyNodes.push(faceNodes[1]);
                    this.bodyNodes.push(faceNodes2[3]);
                    this.bodyNodes.push(faceNodes2[2]);
                } else if (faceNodes) {
                    const shim = faceNodes[0].position.y - this.bodyDim.y;

                    this.bodyNodes.push(faceNodes[0]);
                    this.bodyNodes.push(faceNodes[1]);
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[1].position.x, shim, faceNodes[1].position.z), this.bodyNodeRad));
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[0].position.x, shim, faceNodes[0].position.z), this.bodyNodeRad));

                    // back
                    this.bodyNodes.push(faceNodes[3]);
                    this.bodyNodes.push(faceNodes[2]);
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[2].position.x, shim, faceNodes[2].position.z), this.bodyNodeRad));
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[3].position.x, shim, faceNodes[3].position.z), this.bodyNodeRad));
                }
                break;
            case BlockFace.BOTTOM:
                // B 3267
                if (faceNodes && faceNodes2) {
                    const shim = faceNodes[0].position.y + this.bodyDim.y;
                    this.bodyNodes.push(faceNodes2[0]);
                    this.bodyNodes.push(faceNodes2[1]);
                    this.bodyNodes.push(faceNodes[2]);
                    this.bodyNodes.push(faceNodes[3]);

                    // back
                    this.bodyNodes.push(faceNodes2[2]);
                    this.bodyNodes.push(faceNodes2[3]);
                    this.bodyNodes.push(faceNodes[1]);
                    this.bodyNodes.push(faceNodes[0]);
                } else if (faceNodes) {
                    const shim = faceNodes[0].position.y + this.bodyDim.y;
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[3].position.x, shim, faceNodes[3].position.z), this.bodyNodeRad));
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[2].position.x, shim, faceNodes[2].position.z), this.bodyNodeRad));
                    this.bodyNodes.push(faceNodes[2]);
                    this.bodyNodes.push(faceNodes[3]);

                    // back
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[0].position.x, shim, faceNodes[0].position.z), this.bodyNodeRad));
                    this.bodyNodes.push(new VerletNode(new Vector3(faceNodes[1].position.x, shim, faceNodes[1].position.z), this.bodyNodeRad));
                    this.bodyNodes.push(faceNodes[1]);
                    this.bodyNodes.push(faceNodes[0]);
                }
                break;
            default:
                // Initial block
                // Create Nodes
                // front
                this.bodyNodes.push(new VerletNode(new Vector3(bodyPos.x - this.bodyDim.x / 2, bodyPos.y + this.bodyDim.y / 2, bodyPos.z + this.bodyDim.z / 2), this.bodyNodeRad));
                this.bodyNodes.push(new VerletNode(new Vector3(bodyPos.x + this.bodyDim.x / 2, bodyPos.y + this.bodyDim.y / 2, bodyPos.z + this.bodyDim.z / 2), this.bodyNodeRad));
                this.bodyNodes.push(new VerletNode(new Vector3(bodyPos.x + this.bodyDim.x / 2, bodyPos.y - this.bodyDim.y / 2, bodyPos.z + this.bodyDim.z / 2), this.bodyNodeRad));
                this.bodyNodes.push(new VerletNode(new Vector3(bodyPos.x - this.bodyDim.x / 2, bodyPos.y - this.bodyDim.y / 2, bodyPos.z + this.bodyDim.z / 2), this.bodyNodeRad));

                // back
                this.bodyNodes.push(new VerletNode(new Vector3(bodyPos.x - this.bodyDim.x / 2, bodyPos.y + this.bodyDim.y / 2, bodyPos.z - this.bodyDim.z / 2), this.bodyNodeRad));
                this.bodyNodes.push(new VerletNode(new Vector3(bodyPos.x + this.bodyDim.x / 2, bodyPos.y + this.bodyDim.y / 2, bodyPos.z - this.bodyDim.z / 2), this.bodyNodeRad));
                this.bodyNodes.push(new VerletNode(new Vector3(bodyPos.x + this.bodyDim.x / 2, bodyPos.y - this.bodyDim.y / 2, bodyPos.z - this.bodyDim.z / 2), this.bodyNodeRad));
                this.bodyNodes.push(new VerletNode(new Vector3(bodyPos.x - this.bodyDim.x / 2, bodyPos.y - this.bodyDim.y / 2, bodyPos.z - this.bodyDim.z / 2), this.bodyNodeRad));
        }


        const colSym = 0xDDDDDD + Math.random() * 0x333333;
        const texture = new TextureLoader().load(this.skinName);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        // const textureRatio = randFloat(1, 2.5);
        // texture.repeat.set(5 * textureRatio, 1 * textureRatio);
        texture.repeat.set(2, 2);


        // 12 faces separately
        for (let i = 0; i < 12; i++) {
            //each face has 9 floats
            const c = new Color(this.color.r * randFloat(.2, .5) + .8, this.color.g * randFloat(.2, .5) + .8, this.color.b * randFloat(.2, .5) + .8);
            const material = new MeshPhongMaterial({
                color: c,// new Color(randFloat(.8, 1), randFloat(.8, 1), randFloat(.8, 1)),
                specular: this.color,
                reflectivity: 1,
                shininess: randFloat(2, 20),
                //shininess: randFloat(.5, 1),
                wireframe: false,
                // side: DoubleSide,
                map: texture,
                bumpMap: texture,
                bumpScale: randFloat(.75, 25),
            });

            const verts = new Float32Array(9);
            const norms = new Float32Array(9);
            const uvs = new Float32Array(9);
            for (let j = 0, k = 0, l = 0; j < 9; j += 3) {
                verts[j] = (this.bodyNodes[this.inds2D[i][k]].position.x)
                verts[j + 1] = (this.bodyNodes[this.inds2D[i][k]].position.y)
                verts[j + 2] = (this.bodyNodes[this.inds2D[i][k]].position.z)
                norms[j] = this.inds2D[i][l]
                norms[j + 1] = this.inds2D[i][l + 1]
                norms[j + 2] = this.inds2D[i][l + 2]
                k++;
            }

            // 0,1,1,1,0,0,0,0,1,1,1,0
            for (let i = 0; i < 72; i += 12) {
                uvs[i] = 0
                uvs[i + 1] = 1
                uvs[i + 2] = 1
                uvs[i + 3] = 1
                uvs[i + 4] = 0
                uvs[i + 5] = 0
                uvs[i + 6] = 0
                uvs[i + 7] = 0
                uvs[i + 8] = 1
                uvs[i + 9] = 1
                uvs[i + 10] = 1
                uvs[i + 11] = 0
            }


            const geomData = new BufferGeometry();
            geomData.setAttribute('position', new BufferAttribute(verts, 3));
            geomData.setAttribute('uv', new BufferAttribute(uvs, 2));
            geomData.computeVertexNormals();
            this.faces.push(new Mesh(geomData, material))
            this.faces[this.faces.length - 1].castShadow = true;
            this.add(this.faces[this.faces.length - 1]);
        }

        // faces: Mesh[] = [];





        /* Attachment face nodes
        Relative TL corner with CW winding
        F 0123
        B 5476
        L 4037
        R 1562
        T 4510
        B 3267
        */
        const nodeIndices = [0, 1, 2, 3, 5, 4, 7, 6, 4, 0, 3, 7, 1, 5, 6, 2, 4, 5, 1, 0, 3, 2, 6, 7];
        for (let i = 0; i < 4; i++) {
            this.frontNodes[i] = this.bodyNodes[nodeIndices[i]]
            this.backNodes[i] = this.bodyNodes[nodeIndices[i + 4]]
            this.leftNodes[i] = this.bodyNodes[nodeIndices[i + 8]]
            this.rightNodes[i] = this.bodyNodes[nodeIndices[i + 12]]
            this.topNodes[i] = this.bodyNodes[nodeIndices[i + 16]]
            this.bottomNodes[i] = this.bodyNodes[nodeIndices[i + 20]]
        }


        // Create body frame Sticks
        // Note: winding doesn't matter for this
        // front
        this.bodySticks.push(new VerletStick(this.bodyNodes[0], this.bodyNodes[1], this.bodyTension));
        this.bodySticks.push(new VerletStick(this.bodyNodes[1], this.bodyNodes[2], this.bodyTension));
        this.bodySticks.push(new VerletStick(this.bodyNodes[2], this.bodyNodes[3], this.bodyTension));
        this.bodySticks.push(new VerletStick(this.bodyNodes[3], this.bodyNodes[0], this.bodyTension));

        // left 
        this.bodySticks.push(new VerletStick(this.bodyNodes[0], this.bodyNodes[4], this.bodyTension));
        this.bodySticks.push(new VerletStick(this.bodyNodes[4], this.bodyNodes[7], this.bodyTension));
        this.bodySticks.push(new VerletStick(this.bodyNodes[7], this.bodyNodes[3], this.bodyTension));

        // back
        this.bodySticks.push(new VerletStick(this.bodyNodes[4], this.bodyNodes[5], this.bodyTension));
        this.bodySticks.push(new VerletStick(this.bodyNodes[5], this.bodyNodes[6], this.bodyTension));
        this.bodySticks.push(new VerletStick(this.bodyNodes[6], this.bodyNodes[7], this.bodyTension));

        // right
        this.bodySticks.push(new VerletStick(this.bodyNodes[5], this.bodyNodes[1], this.bodyTension));
        this.bodySticks.push(new VerletStick(this.bodyNodes[6], this.bodyNodes[2], this.bodyTension));

        // Create diagonal support Sticks
        this.bodySticks.push(new VerletStick(this.bodyNodes[0], this.bodyNodes[6], this.bodyTension, 0, false));
        this.bodySticks.push(new VerletStick(this.bodyNodes[1], this.bodyNodes[7], this.bodyTension, 0, false));
        this.bodySticks.push(new VerletStick(this.bodyNodes[2], this.bodyNodes[4], this.bodyTension, 0, false));
        this.bodySticks.push(new VerletStick(this.bodyNodes[3], this.bodyNodes[5], this.bodyTension, 0, false));

        this.bodySticks.push(new VerletStick(this.bodyNodes[0], this.bodyNodes[7], this.bodyTension, 0, false));
        this.bodySticks.push(new VerletStick(this.bodyNodes[1], this.bodyNodes[6], this.bodyTension, 0, false));

        this.bodySticks.push(new VerletStick(this.bodyNodes[4], this.bodyNodes[3], this.bodyTension, 0, false));
        this.bodySticks.push(new VerletStick(this.bodyNodes[2], this.bodyNodes[5], this.bodyTension, 0, false));

        this.bodySticks.push(new VerletStick(this.bodyNodes[0], this.bodyNodes[2], this.bodyTension, 0, false));
        this.bodySticks.push(new VerletStick(this.bodyNodes[1], this.bodyNodes[3], this.bodyTension, 0, false));

        this.bodySticks.push(new VerletStick(this.bodyNodes[4], this.bodyNodes[6], this.bodyTension, 0, false));
        this.bodySticks.push(new VerletStick(this.bodyNodes[5], this.bodyNodes[7], this.bodyTension, 0, false));

        // top diags
        this.bodySticks.push(new VerletStick(this.bodyNodes[0], this.bodyNodes[5], this.bodyTension, 0, false));
        this.bodySticks.push(new VerletStick(this.bodyNodes[4], this.bodyNodes[1], this.bodyTension, 0, false));

        // bottom diags
        this.bodySticks.push(new VerletStick(this.bodyNodes[3], this.bodyNodes[6], this.bodyTension, 0, false));
        this.bodySticks.push(new VerletStick(this.bodyNodes[7], this.bodyNodes[2], this.bodyTension, 0, false));



        for (let i = 0; i < this.bodySticks.length; i++) {
            // this.add(this.bodySticks[i]);
        }

    }



    collide(bounds: Vector3) {
        for (let i = 0; i < this.bodyNodes.length; i++) {
            // this.bodyNodes[i].constrainBounds(bounds, 15.5);
            this.bodyNodes[i].constrainBoundsNoCorrection(bounds);
        }
    }


    setPhysTrig(phys: PhysTrig) {
        this.phys = phys;
    }

    move(time: number) {

        for (let i = 0; i < 12; i++) {
            let boxPos = this.faces[i].geometry.attributes.position;
            // let n = this.faces[i].geometry.attributes.normal
            boxPos.needsUpdate = true;
            for (let j = 0; j < boxPos.count; j++) {
                boxPos.setXYZ(j,
                    this.bodyNodes[this.inds2D[i][j]].position.x,
                    this.bodyNodes[this.inds2D[i][j]].position.y,
                    this.bodyNodes[this.inds2D[i][j]].position.z
                )

            }
        }



        for (let i = 0; i < this.bodyNodes.length; i++) {
            this.bodyNodes[i].verlet();
            //  console.log(this.bodyNodes);


            // interactive dynamics
            // ensure physObj is defined
            if (this.physObj && this.phys) {
                this.bodyNodes[i].position.y += this.physObj.gravity + sin(this.phys.theta3.y) * this.phys.amp3.y;
                this.bodyNodes[i].position.x += this.physObj.wind.x + sin(this.phys.theta3.x) * this.phys.amp3.x;
                this.bodyNodes[i].position.z += this.physObj.wind.z + cos(this.phys.theta3.z) * this.phys.amp3.z;

                this.bodyNodes[i].position.x += randFloat(-this.physObj.turbulence.x, this.physObj.turbulence.x);
                this.bodyNodes[i].position.y += randFloat(-this.physObj.turbulence.y, this.physObj.turbulence.y);
                this.bodyNodes[i].position.z += randFloat(-this.physObj.turbulence.z, this.physObj.turbulence.z);
            }
        }

        for (let i = 0; i < this.bodySticks.length; i++) {
            this.bodySticks[i].constrainLen();
            this.bodySticks[i].visible = true;
            this.bodySticks[i].setStickTension(this.bodyTension);
        }
        this.phys?.theta3.add(this.phys?.freq3);
    }


    getFaceNodes(face: BlockFace): VerletNode[] {
        switch (face) {
            case BlockFace.FRONT:
                return this.frontNodes;
                break;
            case BlockFace.BACK:
                return this.backNodes;
                break;
            case BlockFace.LEFT:
                return this.leftNodes;
                break;
            case BlockFace.RIGHT:
                return this.rightNodes;
                break;
            case BlockFace.TOP:
                return this.topNodes;
                break;
            case BlockFace.BOTTOM:
                return this.bottomNodes;
                break;
            default:
                return this.frontNodes;

        }

    }

    getBodyNodes(): VerletNode[] {
        return this.bodyNodes;
    }

    changeGravity(val: number) {
        if (this.physObj) {
            this.physObj.gravity += val;
        }
    }

    reset() {
        if (this.physObj) {
            this.physObj.turbulence.multiplyScalar(0);
            this.physObj.gravity = 0;
            this.physObj.wind.multiplyScalar(0);
        }

    }

    changeTurbulence(val: number) {
        if (this.physObj) {
            let t = this.physObj.turbulence.x;
            t += val;
            this.physObj.turbulence.x = clamp(t, 0, 10);
            this.physObj.turbulence.y = clamp(t, 0, 10);
            this.physObj.turbulence.z = clamp(t, 0, 10);
            console.log(this.physObj.turbulence);
        }
    }

    changeNSWind(val: number) {
        if (this.physObj) {
            this.physObj.wind.z += val;
        }
    }

    changeEWWind(val: number) {
        if (this.physObj) {
            this.physObj.wind.x += val;
        }
    }

    changeBodyTension(val: number) {
        if (this.bodyTension - val > .1 && val + this.bodyTension < .99) {
            this.bodyTension += val;
        }
    }

    showStructure(isStructureViewable: boolean) {
        this.isStructureViewable = isStructureViewable;
    }

}