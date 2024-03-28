import { trace } from "console";
import { BufferGeometry, Color, DynamicDrawUsage, Group, InstancedMesh, Line, Matrix4, MeshBasicMaterial, Vector2, Vector3 } from "three";
import { damp, randFloat } from "three/src/math/MathUtils";
import { Bounds, BoundsType, PI, rand1, rand2 } from "./IJGUtils";

export class ProtoDust extends Group {
    // floating dust
    dustCount: number;
    pos: Vector3[] = [];
    spd: Vector3[] = [];
    damping: Vector3;
    turbulance: Vector3;
    bounds: Bounds;

    rot: Vector3[] = [];
    rotSpd: Vector3[] = [];
    spdInit: Vector3[] = []; // capture initial speed to reset after turbulance

    dustGeom: BufferGeometry;
    dustScale: number;
    col: Color;
    dustIMesh: InstancedMesh;
    m: Matrix4[] = [];


    constructor(dustCount: number, posMinMax: Vector2, dustScale: number = 1, col: Color = new Color(.5, .5, .5), spdMinMax: Vector2 = new Vector2(-2, 2), damping: Vector3 = new Vector3(.75, .75, .75), turbulance: Vector3 = new Vector3(0, 0, 0), bounds: Bounds = new Bounds(new Vector3(1, 1, 1), BoundsType.INFINITE)) {
        super();

        this.dustCount = dustCount;
        this.col = col;
        this.dustScale = dustScale;
        this.damping = damping;
        this.turbulance = turbulance;
        this.bounds = bounds;

        // dust pt geometry
        const pts: Vector3[] = [];
        const dustRad = dustScale;
        for (let i = 0; i < 3; i++) {
            pts[i] = new Vector3(rand2(-dustRad, dustRad), rand2(-dustRad, dustRad), rand2(-dustRad, dustRad));
        }
        this.dustGeom = new BufferGeometry().setFromPoints(pts);
        const dustMat = new MeshBasicMaterial({ color: this.col, wireframe: true, transparent: true, opacity: .4 })
        this.dustIMesh = new InstancedMesh(this.dustGeom, dustMat, this.dustCount);
        this.dustIMesh.instanceMatrix.setUsage(DynamicDrawUsage);


        // collect parallel values for instanced array
        for (let i = 0; i < dustCount; i++) {
            this.pos[i] = new Vector3(rand2(posMinMax.x, posMinMax.y), rand2(posMinMax.x, posMinMax.y), rand2(posMinMax.x, posMinMax.y));
            this.spd[i] = new Vector3(rand2(spdMinMax.x, spdMinMax.y), rand2(spdMinMax.x, spdMinMax.y), rand2(spdMinMax.x, spdMinMax.y));
            this.rot[i] = new Vector3(rand2(-PI, PI), rand2(-PI, PI), rand2(-PI, PI));
            this.rotSpd[i] = new Vector3(rand2(-PI / 15, PI / 15), rand2(-PI / 15, PI / 15), rand2(-PI / 15, PI / 15));
            this.spdInit[i] = this.spd[i].clone();
            this.m[i] = new Matrix4();
            this.m[i].setPosition(this.pos[i]);
            this.m[i].makeRotationX(this.rot[i].x);
            this.m[i].makeRotationY(this.rot[i].y);
            this.m[i].makeRotationZ(this.rot[i].z);
            const c = Math.random() * 2;
            // const colFactor = rand2(.8, .9);
            this.dustIMesh.setColorAt(i, new Color(c * rand2(.5, 1.5), c * rand2(.5, 1.5), c * rand2(.5, 1.5)));
        }
        // dust pt geometry
        // const pts: Vector3[] = [];
        // const dustRad = 1;
        // for (let i = 0; i < 3; i++) {
        //     pts[i] = new Vector3(rand2(-dustRad, dustRad), rand2(-dustRad, dustRad), rand2(-dustRad, dustRad));
        // }
        // this.dustGeom = new BufferGeometry().setFromPoints(pts);
        // const dustMat = new MeshBasicMaterial({ color: this.col, wireframe: true, transparent: true, opacity: .4 })
        // this.dustIMesh = new InstancedMesh(this.dustGeom, dustMat, this.dustCount);
        // this.dustIMesh.instanceMatrix.setUsage(DynamicDrawUsage);

        this.add(this.dustIMesh);

        // console.log(this.bounds.dim);
    }

    start(isBounded: boolean = true): void {
        this.dustIMesh.instanceMatrix.needsUpdate = true;
        this.dustIMesh.instanceColor!.needsUpdate = true;
        for (let i = 0; i < this.dustCount; i++) {
            let p = this.dustIMesh.getObjectById(i);
            this.m[i].makeRotationX(this.rot[i].x);
            this.m[i].makeRotationY(this.rot[i].y);
            this.m[i].makeRotationZ(this.rot[i].z);
            this.m[i].setPosition(this.pos[i]);


            this.dustIMesh.setMatrixAt(i, this.m[i]);
            // this.dustIMesh.instanceMatrix.needsUpdate = true;
            // this.dustIMesh.instanceColor.needsUpdate = true;

            // this.dustIMesh.setColorAt(i, new Color(Math.random()));

            this.spd[i].x = this.spdInit[i].x + rand2(-2, 2);
            this.spd[i].y = this.spdInit[i].y + rand2(-2, 2);
            this.spd[i].z = this.spdInit[i].z + rand2(-2, 2);
            this.pos[i].add(this.spd[i]);


            if (isBounded) {
                // console.log("pbGroup = ", pbGroup.position);
                // if (this.pos[i].distanceTo(pbGroup.position) < 230) {
                // this.turbulance.x = randFloat(-particulateTurbulance, particulateTurbulance);
                // this.turbulance.y = randFloat(-particulateTurbulance, particulateTurbulance);
                // this.turbulance.z = randFloat(-particulateTurbulance, particulateTurbulance);

                //  }
                // if (this.spd[i].length() >= this.spdInit[i].length()) {
                //     this.spd[i].multiplyScalar(this.damping);
                // } else {
                // spd[i].set(spdInit[i].x, spdInit[i].y, spdInit[i].z);
                //}


                if (this.bounds.boundsType == BoundsType.CUBE) {
                } else if (this.bounds.boundsType == BoundsType.SPHERE) {

                } else if (this.bounds.boundsType == BoundsType.INFINITE) {
                    if (this.pos[i].x > this.bounds.dim.x) {
                        this.pos[i].x = -this.bounds.dim.x
                    } else if (this.pos[i].x < -this.bounds.dim.x) {
                        this.pos[i].x = this.bounds.dim.x
                    }

                    if (this.pos[i].y > this.bounds.dim.y) {
                        this.pos[i].y = -this.bounds.dim.y
                    } else if (this.pos[i].y < -this.bounds.dim.y) {
                        this.pos[i].y = this.bounds.dim.y
                    }

                    if (this.pos[i].z > this.bounds.dim.z) {
                        this.pos[i].z = -this.bounds.dim.z
                    } else if (this.pos[i].z < -this.bounds.dim.z) {
                        this.pos[i].z = this.bounds.dim.z
                    }
                }
                this.rot[i].add(this.rotSpd[i]);

            }
        }
    }
}
