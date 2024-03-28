import { BoxGeometry, Face, ImageLoader, Line3, MeshBasicMaterial, PerspectiveCamera, Plane, Scene, TetrahedronGeometry, Triangle, Vector2, WebGLRenderer } from 'three';

import {
    Color, BufferGeometry, Group, Line, LineBasicMaterial,
    Mesh, MeshPhongMaterial, SphereGeometry, Vector3, BufferAttribute, DoubleSide
} from 'three';
import { randFloat } from 'three/src/math/MathUtils';
//import { Frequency } from 'tone';

export function simpleSaveImage(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, fileName: string, w: number, h: number) {
    camera.aspect = w / h;
    camera.setViewOffset(w, h, w * 0, h * 0, w, h);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    const name = fileName + ".png";
    const a = window.document.createElement("a");
    a.download = name;
    a.href = renderer.domElement.toDataURL("image/png", 1.0);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // restore screen based rendering
    camera.aspect = w / h;
    camera.setViewOffset(w, h, 0, 0, w, h);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.render(scene, camera);
}

export function saveImage(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, fileName: string, xScaleFactor: number, yScaleFactor: number) {

    const newSizeW = window.innerWidth * xScaleFactor;
    const newSizeH = window.innerHeight * yScaleFactor;
    camera.aspect = newSizeW / newSizeH;
    for (let i = 0; i < xScaleFactor; i++) {
        for (let j = 0; j < yScaleFactor; j++) {
            camera.setViewOffset(newSizeW, newSizeH, window.innerWidth * i, window.innerHeight * j, window.innerWidth, window.innerHeight);
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
            // add for hi-rez stitcher
            // const fileName = 'PByteHiRezScreenCapture' + i + j + ".png";
            const name = fileName + i + j + ".png";
            const a = window.document.createElement("a");
            a.download = name;
            a.href = renderer.domElement.toDataURL("image/png", 1.0);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    // restore screen based rendering
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.setViewOffset(window.innerWidth, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

// export function stitchImage(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, fileName: string, xScaleFactor: number, yScaleFactor: number): void {
// }

export function cutUpSkyBoxImage(renderer: WebGLRenderer, url: string, dirName: string) {

    let k = 0
    const loader = new ImageLoader();
    const fileNames = ['py', 'nx', 'nz', 'px', 'pz', 'ny'];
    const isDrawable = [
        [false, true, false, false],
        [true, true, true, true],
        [false, true, false, false]];

    // load a image resource
    loader.load(
        // resource URL
        url,
        // onLoad callback
        function (image) {
            const tileWidth = image.height / 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 4; j++) {


                    const canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    canvas.height = tileWidth;
                    canvas.width = tileWidth;
                    if (context) {
                        if (isDrawable[i][j]) {

                            const name = fileNames[k];

                            context.drawImage(image, tileWidth * j, tileWidth * i, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
                            const a = window.document.createElement("a");
                            a.download = name;
                            a.href = canvas.toDataURL("image/png", 1.0);
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            k++;
                        }

                    }
                }
            }
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function () {
            console.error('An error happened.');
        }
    );
}

// convenience class to get Mesh faces for use in collisions
export class MeshFace {
    vecs: Vector3[] = []

    constructor(a: Vector3, b: Vector3, c: Vector3) {
        this.vecs[0] = a;
        this.vecs[1] = b;
        this.vecs[2] = c;
    }

    getNormal(): Vector3 {
        const v0 = new Vector3().copy(this.vecs[1]);
        const v1 = new Vector3().copy(this.vecs[2]);
        v0.sub(this.vecs[0])
        v1.sub(this.vecs[0])
        const n = v0.cross(v1);
        return n;
    }

    getCentroid(): Vector3 {
        const c = new Vector3().copy(this.vecs[0]);
        c.add(this.vecs[1])
        c.add(this.vecs[2])
        return c.divideScalar(3);
    }

    getAttributes() {

    }
}

export class MeshBufferFace {
    vecs: Vector3[] = [];
    norms: Vector3[] = [];
    uvs: Vector2[] = [];

    constructor(a: Vector3, b: Vector3, c: Vector3, na: Vector3, nb: Vector3, nc: Vector3, uva: Vector2, uvb: Vector2, uvc: Vector2) {
        this.vecs[0] = a;
        this.vecs[1] = b;
        this.vecs[2] = c;

        this.norms[0] = na;
        this.norms[1] = nb;
        this.norms[2] = nc;

        this.uvs[0] = uva;
        this.uvs[1] = uvb;
        this.uvs[2] = uvc;
    }

    getNormal(): Vector3 {
        const v0 = new Vector3().copy(this.vecs[1]);
        const v1 = new Vector3().copy(this.vecs[2]);
        v0.sub(this.vecs[0])
        v1.sub(this.vecs[0])
        const n = v0.cross(v1);
        return n;
    }

    getCentroid(): Vector3 {
        const c = new Vector3().copy(this.vecs[0]);
        c.add(this.vecs[1])
        c.add(this.vecs[2])
        return c.divideScalar(3);
    }

    getAttributes() {

    }
}

// convenience function to get Mesh faces for use in collisions
export function getMeshBufferFaces(mesh: Mesh): MeshBufferFace[] {

    const pos = mesh.geometry.attributes.position;
    const norm = mesh.geometry.attributes.normal;
    const uv = mesh.geometry.attributes.uv;
    const indices = mesh.geometry.index;

    const vecs: Vector3[] = [];
    const norms: Vector3[] = [];
    const uvs: Vector2[] = [];

    const bufferFaces: MeshBufferFace[] = [];


    if (indices) {
        const vs: number[] = [];
        for (let i = -3; i < indices.count - 3; i++) {
            vecs.push(new Vector3(pos.getX(indices.getW(i)), pos.getY(indices.getW(i)), pos.getZ(indices.getW(i))));
            norms.push(new Vector3(norm.getX(indices.getW(i)), norm.getY(indices.getW(i)), norm.getZ(indices.getW(i))));
            uvs.push(new Vector2(uv.getX(indices.getW(i)), uv.getY(indices.getW(i))));
        }

        for (let i = 0; i < vecs.length; i += 3) {
            bufferFaces.push(new MeshBufferFace(vecs[i], vecs[i + 1], vecs[i + 2], norms[i], norms[i + 1], norms[i + 2], uvs[i], uvs[i + 1], uvs[i + 2]));
        }
    }
    return bufferFaces;
}

// convenience function to get Mesh faces for use in collisions
export function getMeshFaces(mesh: Mesh): MeshFace[] {

    const pos = mesh.geometry.attributes.position;
    // const uv = mesh.geometry.attributes.uv;
    // const norm = mesh.geometry.attributes.normal;
    const indices = mesh.geometry.index;
    const vecs: Vector3[] = [];
    // const uvs: Vector2[] = [];
    // const norms: Vector3[] = [];
    const faces: MeshFace[] = [];

    // console.log("UV's", uv.count);
    // console.log("Pos", pos.count);
    // console.log("Normal", norms.count);

    if (indices) {
        const vs: number[] = [];
        for (let i = -3; i < indices.count - 3; i++) {
            vecs.push(new Vector3(pos.getX(indices.getW(i)), pos.getY(indices.getW(i)), pos.getZ(indices.getW(i))));
            // uvs.push(new Vector2(uv.getX(indices.getW(i)), uv.getY(indices.getW(i))));
            // norms.push(new Vector3(norm.getX(indices.getW(i)), norm.getY(indices.getW(i)), norm.getZ(indices.getW(i))));
        }

        for (let i = 0; i < vecs.length; i += 3) {
            faces.push(new MeshFace(vecs[i], vecs[i + 1], vecs[i + 2]));
        }
    }
    return faces;
}




export function isMeshFaceCollision(meshFace: MeshFace, pt: Vector3, radius: number): boolean {
    const tri: Triangle = new Triangle(meshFace.vecs[0], meshFace.vecs[1], meshFace.vecs[2]);
    let line1 = new Line3(tri.a, tri.b);
    let line2 = new Line3(tri.a, tri.c);
    let line3 = new Line3(tri.b, tri.c);

    // then I find the closest point from each of these 3 lines, to the center of the sphere :

    let closestPoint1 = new Vector3();
    line1.closestPointToPoint(pt, true, closestPoint1);

    let closestPoint2 = new Vector3();
    line2.closestPointToPoint(pt, true, closestPoint2);

    let closestPoint3 = new Vector3();
    line3.closestPointToPoint(pt, true, closestPoint3);

    // then I calculate the distance of that point to the center:

    // code for 1 line only

    let distToCenter = closestPoint1.distanceTo(pt);
    if (distToCenter <= radius) {
        return true;
    }

    distToCenter = closestPoint2.distanceTo(pt);
    if (distToCenter <= radius) {
        return true;
    }

    distToCenter = closestPoint3.distanceTo(pt);
    if (distToCenter <= radius) {
        return true;
    }

    //phase 2
    let plane = new Plane();
    tri.getPlane(plane);
    let pp = new Vector3();
    let cp: boolean;

    var dp = Math.abs(plane.distanceToPoint(pt));

    if (dp <= radius) {
        plane.projectPoint(pt, pp);
        cp = tri.containsPoint(pp);

        if (cp === true) {
            // console.log(pp.x - pt.x, pp.y - pt.y, pp.z - pt.z);
            // let spdVec = new Vector3().copy(spd);
            // spdVec.normalize();
            // spdVec.multiplyScalar(radius);
            // pt.x = pp.x;
            // pt.y = pp.y;
            // pt.z = pp.z;
            return true;
        }
    }
    return false;
}


// convenience functions
export function cos(t: number) {
    return Math.cos(t);
}
export function sin(t: number) {
    return Math.sin(t);
}
export function tan(t: number) {
    return Math.tan(t);
}

export function rand1(val: number = 1): number {
    return Math.random() * val;
}

export function rand2(low: number = 0, high: number = 1): number {
    return randFloat(low, high);
}
// For convenience
export let PI = 3.14159265359;
export let TWO_PI = PI * 2;
export let HALF_PI = PI / 2;


export enum BlockFace {
    FRONT,
    BACK,
    LEFT,
    RIGHT,
    TOP,
    BOTTOM
}

export enum FuncType {
    //  Specifies Cross-section transform functions
    NONE,
    LINEAR,
    LINEAR_INVERSE,
    SINUSOIDAL,
    SINUSOIDAL_INVERSE,
    SINUSOIDAL_RANDOM
};

export class SizeMinMaxRange {
    min: Vector3;
    max: Vector3;
    constructor(min: Vector3, max: Vector3) {
        this.min = min;
        this.max = max;
    }
}

// Simple class for environment physics
export class EnvironmentPhysics {
    gravity: number;
    damping: number;
    friction: number;
    wind: Vector3;
    turbulence: Vector3;

    constructor(gravity: number, damping: number, friction: number, wind: Vector3, turbulence: Vector3 = new Vector3()) {
        this.gravity = gravity;
        this.damping = damping;
        this.friction = friction;
        this.wind = wind;
        this.turbulence = turbulence;
    }
}

export interface iCurveExpression {
    func: FuncType;
    min: number;
    max: number;
    periods: number;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// get random floating point range like in Processing
// maximum exclusive, minimum inclusive
export class PBMath {

    // expects Vector3[]
    static getCentroid(vecs: Vector3[]): Vector3 {
        let c = new Vector3();
        for (let i = 0; i < vecs.length; i++) {
            c.add(vecs[i]);
        }
        c.divideScalar(vecs.length);
        return c;
    }

    // returns random float between min-max

    static rand(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
    // returns random int between min-max
    static randInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    // returns radii values for ProtoGeometry based on
    // mathematical expressions. NONE FuncType return array of uniform
    // radii vals.
    static expression(expType: FuncType, count: number, min: number, max: number, periods: number): number[] {
        let vals: number[] = [];
        let theta = 0;
        let freq = 0;
        let step = 0;
        let octives = 0;
        switch (expType) {
            case FuncType.NONE:
                for (let i = 0; i < count; i++) {
                    vals[i] = max;
                }
                break;
            case FuncType.LINEAR:
                octives = count / periods;
                step = (max - min) / octives;
                for (let i = 0; i < periods; i++) {
                    let step = (max - min) / octives;
                    for (let j = 0; j < octives; j++) {
                        vals.push(min + step * j);
                    }
                }
                break;
            case FuncType.LINEAR_INVERSE:
                octives = count / periods;
                step = (max - min) / octives;
                for (let i = 0; i < periods; i++) {
                    let step = (max - min) / octives;
                    for (let j = 0; j < octives; j++) {
                        vals.push(max - step * j);
                    }
                }
                break;
            case FuncType.SINUSOIDAL:
                theta = 0;
                freq = Math.PI * periods / count;
                for (let i = 0; i <= count; i++) {
                    vals[i] = min + Math.abs(Math.sin(theta)) * max;
                    theta += freq;
                }
                break;
            case FuncType.SINUSOIDAL_INVERSE:
                theta = 0;
                freq = Math.PI * periods / count;
                for (let i = 0; i <= count; i++) {
                    vals[i] = Math.max(min, Math.abs(Math.cos(theta)) * max);
                    theta += freq;
                }
                break;
            case FuncType.SINUSOIDAL_RANDOM:
                theta = 0;
                freq = Math.PI * periods / count;
                let rMax = max;
                for (let i = 0; i <= count; i++) {
                    //  if (i % periods == 0) {
                    rMax = PBMath.rand(min, max);
                    //   }
                    vals[i] = Math.max(min, Math.abs(Math.cos(theta)) * rMax);
                    theta += freq;
                }
                break;
            default: // returns uniform radii
                for (let i = 0; i < count; i++) {
                    vals[i] = max;
                }
                break;

        }
        return vals;
    }


}

export class Particle extends Group {
    pos: Vector3;
    spd: Vector3;
    rad: number;
    col: Color;
    partMesh: Mesh;

    constructor(pos: Vector3 = new Vector3(0, 0, 0), spd: Vector3 = new Vector3(0, 0, 0), rad: number = 1, col: Color = new Color(.5, .5, .5)) {
        super();

        this.pos = pos;
        this.spd = spd;
        this.rad = rad;
        this.col = col;

        let geom = new BoxGeometry(this.rad * 2, this.rad * 2, this.rad * 2);
        let mat = new MeshBasicMaterial({ color: this.col });
        this.partMesh = new Mesh(geom, mat);
        this.add(this.partMesh);
    }

    move(): void {
        this.spd.y -= PByteGlobals.gravity;
        this.pos.add(this.spd);
        this.partMesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    }

}

export class ProtoTubeExtrusionFunction {


}
export class FrenetFrame extends Group {

    nodePos: Vector3;

    len: number = 0;

    tan?: Vector3;
    norm?: Vector3;
    biNorm?: Vector3;

    tLine?: Line;
    nLine?: Line;
    bLine?: Line;

    /* eventually maybe add control to these props
    this.lineMaterial.transparent = true;
    this.lineMaterial.opacity = 1;
    this.lineMaterial.linewidth = 5;
    */

    tGeom?: BufferGeometry;
    nGeom?: BufferGeometry;
    bGeom?: BufferGeometry;

    tMat?: LineBasicMaterial;
    nMat?: LineBasicMaterial;
    bMat?: LineBasicMaterial;

    constructor(v0: Vector3, v1: Vector3, v2: Vector3, len: number) {
        super();
        this.len = len;

        // node being acted on
        this.nodePos = v1;

        // calculate Tangenet, Normal & biNormal
        this.tan = new Vector3();
        this.tan.subVectors(v2, v0);
        this.tan.normalize();

        this.norm = new Vector3();
        this.norm.crossVectors(v2, v0);
        this.norm.normalize();

        this.biNorm = new Vector3();
        this.biNorm.crossVectors(this.tan, this.norm);
        this.biNorm.normalize();

        // generate line meshes
        let tPoints: Vector3[] = [];
        let nPoints: Vector3[] = [];
        let bPoints: Vector3[] = [];

        tPoints.push(v1);
        tPoints.push(this.tan.multiplyScalar(this.len));
        this.tGeom = new BufferGeometry().setFromPoints(tPoints);

        nPoints.push(v1);
        nPoints.push(this.norm.multiplyScalar(this.len));
        this.nGeom = new BufferGeometry().setFromPoints(nPoints);

        bPoints.push(v1);
        bPoints.push(this.biNorm.multiplyScalar(this.len));
        this.bGeom = new BufferGeometry().setFromPoints(bPoints);

        this.tMat = new LineBasicMaterial({ color: 0xFF0000 });
        this.nMat = new LineBasicMaterial({ color: 0xFFFF00 });
        this.bMat = new LineBasicMaterial({ color: 0x0000FF });

        this.tLine = new Line(this.tGeom, this.tMat);
        this.nLine = new Line(this.nGeom, this.nMat);
        this.bLine = new Line(this.bGeom, this.bMat);

        // add lines to Group
        this.add(this.tLine);
        this.add(this.nLine);
        this.add(this.bLine);
    }

    // update frame
    update(v0: Vector3, v1: Vector3, v2: Vector3) {

        // ensure already instantiated
        if (this.tan && this.norm && this.biNorm) {

            this.nodePos = v1;

            this.tan.subVectors(v2, v0);
            this.tan.normalize();

            this.norm.crossVectors(v2, v0);
            this.norm.normalize();

            this.biNorm.crossVectors(this.tan, this.norm);
            this.biNorm.normalize();

            (this.tLine?.geometry as BufferGeometry).attributes.position.needsUpdate = true;
            (this.nLine?.geometry as BufferGeometry).attributes.position.needsUpdate = true;
            (this.bLine?.geometry as BufferGeometry).attributes.position.needsUpdate = true;

            this.tLine?.geometry.attributes.position.setXYZ(0, v1.x, v1.y, v1.z);
            let tv = this.tan.multiplyScalar(this.len);
            this.tLine?.geometry.attributes.position.setXYZ(1, v1.x + tv.x, v1.y + tv.y, v1.z + tv.z);

            this.nLine?.geometry.attributes.position.setXYZ(0, v1.x, v1.y, v1.z);
            let nv = this.norm.multiplyScalar(this.len);
            this.nLine?.geometry.attributes.position.setXYZ(1, v1.x + nv.x, v1.y + nv.y, v1.z + nv.z);

            this.bLine?.geometry.attributes.position.setXYZ(0, v1.x, v1.y, v1.z);
            let bv = this.biNorm.multiplyScalar(this.len);
            this.bLine?.geometry.attributes.position.setXYZ(1, v1.x + bv.x, v1.y + bv.y, v1.z + bv.z);

        }

    }
    getTangent(): Vector3 {
        if (this.tan) {
            return this.tan;
        }
        return new Vector3();
    }

    getNormal(): Vector3 {
        if (this.norm) {
            return this.norm;
        }
        return new Vector3();
    }

    getBiNormal(): Vector3 {
        if (this.biNorm) {
            return this.biNorm;
        }
        return new Vector3();
    }

}
// returns a line
export function line(start: Vector3, end: Vector3, stroke: Color = new Color(0xaa6611)): Line {
    const geometry = new BufferGeometry();
    const vertices = new Float32Array(
        [start.x, start.y, start.z,
        end.x, end.y, end.z]
    );
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    const material = new LineBasicMaterial({ color: stroke });

    return new Line(geometry, material);
}


export function trace(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
        console.log(args[i]);
    }
}
export enum Corner {
    TL,
    TR,
    BR,
    BL
}

// Hair Density
// custom needs to be explicitly set
export enum HairDensity {
    BALDING = 0,
    LIGHT = 1,
    MEDIUM = 2,
    HEAVY = 3,
    BIG_FOOT = 4,
    CUSTOM = -1
}

// Verlet stick terminal anchoring
export enum AnchorPoint {
    NONE,
    HEAD,
    TAIL,
    HEAD_TAIL,
    MOD2,
    RAND
}

// Axes for drawing plane
export enum AxesPlane {
    XY_AXIS,
    YZ_AXIS,
    ZX_AXIS
}


// Verlet plane edge/corner anchoring
export enum AnchorPlane {
    NONE,
    CORNER_ALL,
    CORNER_0,
    CORNER_1,
    CORNER_2,
    CORNER_3,
    CORNER_02,
    CORNER_13,
    EDGES_ALL,
    EDGE_LEFT,
    EDGE_RIGHT,
    EDGE_TOP,
    EDGE_BOTTOM,
    RAND_VERT
}

// For bounds collision
export enum BoundsType {
    SPHERE,
    CUBE,
    INFINITE
} export class Bounds {
    dim: Vector3;
    boundsType: BoundsType;
    constructor(dim: Vector3, boundsType: BoundsType) {
        this.dim = dim;
        this.boundsType = boundsType;
    }
}

// Verlet stick terminal anchoring
export enum GeometryDetail {
    TRI = 3,
    QUAD = 4,
    PENT = 5,
    HEX = 6,
    HEP = 7,
    OCT = 8,
    DEC = 10,
    DODEC = 12,
    TETRA,
    CUBE,
    OCTA,
    ICOSA,
    DODECA,
    SPHERE_LOW,
    SPHERE_MED,
    SPHERE_HIGH,
    SPHERE_SUPERHIGH,
    SPHERE_SUPERDUPERHIGH
}

export enum Knot {
    EAR,
    EAR_MULTI_TEXTURE,
    CLOVER,
    TORUS_43,
    TORUS_52,
    TORUS_47,
    TORUS_611,
    GALAXY,
    ATOM,
    EIGHT,
    HELIX_01,
    BUNDLE_01,
    GRANNY,
    CINQUEFOIL,
    FIGURE_8
}


// Organism propulsion
export class Propulsion {
    direction: Vector3;
    force: Vector3;
    frequency: Vector3;

    constructor(direction: Vector3 = new Vector3(0, 1, 0),
        force: Vector3 = new Vector3(0, 0, 0),
        frequency: Vector3 = new Vector3(0, 0, 0)) {
        this.direction = direction;
        this.force = force;
        this.frequency = frequency;
    }
}

// Organism Materials
export class VerletMaterials {
    spineNodeColor: Color = new Color(.5, .5, .5);
    spineColor: Color = new Color(.5, .5, .5);
    spineAlpha: number = 1.0;
    sliceColor: Color = new Color(.5, .5, .5);
    sliceAlpha: number = 1.0;
    tendrilNodeColor: Color = new Color(.5, .5, .5);
    tendrilColor: Color = new Color(.5, .5, .5);
    tendrilAlpha: number = 1.0;
    ciliaNodeColor: Color = new Color(.5, .5, .5);
    ciliaColor: Color = new Color(.5, .5, .5);
    ciliaAlpha: number = 1.0;

    constructor(
        spineNodeColor: Color = new Color(.5, .5, .5),
        spineColor: Color = new Color(.5, .5, .5),
        spineAlpha: number = .5,
        sliceColor: Color = new Color(.5, .5, .5),
        sliceAlpha: number = .5,
        tendrilNodeColor: Color = new Color(.5, .5, .5),
        tendrilColor: Color = new Color(.5, .5, .5),
        tendrilAlpha: number = .5,
        ciliaNodeColor: Color = new Color(.5, .5, .5),
        ciliaColor: Color = new Color(.5, .5, .5),
        ciliaAlpha: number = .5) {

        this.spineNodeColor = spineNodeColor;
        this.spineColor = spineColor;
        this.spineAlpha = spineAlpha;
        this.sliceColor = sliceColor;
        this.sliceAlpha = sliceAlpha;
        this.tendrilNodeColor = tendrilNodeColor;
        this.tendrilColor = tendrilColor;
        this.tendrilAlpha = tendrilAlpha;
        this.ciliaNodeColor = ciliaNodeColor;
        this.ciliaColor = ciliaColor;
        this.ciliaAlpha = ciliaAlpha;
    }
}

// Convenience class to group 3 vectors
// includes tri centroid and normal
export class Tri extends Group {
    v0: Vector3;
    v1: Vector3;
    v2: Vector3;
    isDrawable: boolean;

    // used internally for normal calucations
    private side0: Vector3 = new Vector3();
    private side1: Vector3 = new Vector3();
    private norm: Vector3 = new Vector3();

    private isNormalVisible: boolean = false;
    private normalAlpha: number = 0;

    // for centroid
    private cntr: Vector3 = new Vector3();

    lineGeometry?: BufferGeometry;
    lineMaterial = new LineBasicMaterial({ color: 0x000000 });
    line: Line | undefined;

    faceGeometry: BufferGeometry;
    faceMaterial = new MeshBasicMaterial({ color: 0xFFFFFF, side: DoubleSide });
    face: Mesh;

    constructor(v0: Vector3, v1: Vector3, v2: Vector3, isDrawable: boolean = true) {
        super();
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
        this.isDrawable = isDrawable;

        // drawing face
        let points = [];
        points.push(this.v2);
        points.push(this.v1);
        points.push(this.v0);

        this.faceGeometry = new BufferGeometry().setFromPoints(points);

        this.face = new Mesh(this.faceGeometry, this.faceMaterial);
        this.add(this.face);


        //for drawing normal
        let linePts = [];
        linePts.push(this.getCentroid());
        linePts.push(this.getNormal());
        this.lineGeometry = new BufferGeometry().setFromPoints(linePts);

        this.line = new Line(this.lineGeometry, this.lineMaterial);
        this.lineMaterial.transparent = true;
        this.lineMaterial.opacity = .75;
        if (isDrawable) {
            this.add(this.line);
        }
    }


    // returns normalized vector
    // centered to face
    getNormal(): Vector3 {
        //reset normals
        this.side0.setScalar(0);
        this.side1.setScalar(0);
        this.norm.setScalar(1); // may not need

        // calc 2 quad side sides
        this.side0.subVectors(this.v1, this.v0);
        this.side1.subVectors(this.v2, this.v0);

        // calc normal
        this.norm.crossVectors(this.side0, this.side1)
        this.norm.normalize().multiplyScalar(-100);
        this.norm.add(this.getCentroid());

        //return quad normalized normal
        return this.norm;
    }

    setIsNormalVisible(isNormalVisible: boolean, normalAlpha: number = .25): void {
        this.isNormalVisible = isNormalVisible;
        this.normalAlpha = normalAlpha;
    }

    // dynamically recalculates normal
    updateNormal(): void {
        if (this.isNormalVisible) {
            this.lineMaterial.opacity = this.normalAlpha;
        } else {
            this.lineMaterial.opacity = 0;
        }
        this.lineMaterial.needsUpdate = true;

        // this.lineGeometry.vertices = [];
        // this.lineGeometry.vertices.push(this.getCentroid());
        // this.lineGeometry.vertices.push(this.getNormal());

        // this.lineGeometry.verticesNeedUpdate = true;
        (this.lineGeometry as BufferGeometry).attributes.position.needsUpdate = true

    }

    // returns center point
    getCentroid(): Vector3 {
        this.cntr.setScalar(0);
        this.cntr.add(this.v0);
        this.cntr.add(this.v1);
        this.cntr.add(this.v2);
        this.cntr.divideScalar(3);
        return this.cntr;
    }

    getEdges(): Vector3[] {
        let edges = [new Vector3(), new Vector3(),
        new Vector3(), new Vector3()];
        edges[0].subVectors(this.v1, this.v0);
        edges[1].subVectors(this.v2, this.v1);
        edges[2].subVectors(this.v0, this.v2);
        return edges;
    }

    getArea(): number {
        // returns magnitude of cross product
        let c = new Vector3();
        c.copy(this.getEdges()[0]);
        c.cross(this.getEdges()[1]);
        return c.length() / 2;
    }
}
// end tri class

// Convenience class to group 4 vectors
// includes quad centroid and normal
// Assists in simple collisions
export class Quad extends Group {
    v0: Vector3;
    v1: Vector3;
    v2: Vector3;
    v3: Vector3;
    isDrawable: boolean;

    // used internally for normal calculations
    private side0: Vector3 = new Vector3();
    private side1: Vector3 = new Vector3();
    private norm: Vector3 = new Vector3();

    private isNormalVisible: boolean = false;
    private normalAlpha: number = 0;

    // for centroid
    private cntr: Vector3 = new Vector3();

    lineGeometry: BufferGeometry;
    lineMaterial = new LineBasicMaterial({ color: 0xFF9900 });
    line: Line;

    constructor(v0: Vector3, v1: Vector3, v2: Vector3, v3: Vector3, isDrawable: boolean = true) {
        super();
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.isDrawable = isDrawable;

        let points = [];
        points.push(this.getCentroid());
        points.push(this.getNormal());
        this.lineGeometry = new BufferGeometry().setFromPoints(points);

        this.line = new Line(this.lineGeometry, this.lineMaterial);
        this.lineMaterial.transparent = true;
        this.lineMaterial.opacity = 0;
        if (isDrawable) {
            this.add(this.line);
        }
    }

    // returns normalized vector
    // centered to face
    getNormal(): Vector3 {
        //reset normals
        this.side0.setScalar(0);
        this.side1.setScalar(0);
        this.norm.setScalar(1); // may not need

        // calc 2 quad side sides
        this.side0.subVectors(this.v1, this.v0);
        this.side1.subVectors(this.v3, this.v0);

        // calc normal
        this.norm.crossVectors(this.side0, this.side1)
        this.norm.normalize().multiplyScalar(-.07);
        this.norm.add(this.getCentroid());

        //return quad normalized normal
        return this.norm;
    }

    setIsNormalVisible(isNormalVisible: boolean, normalAlpha: number = .25): void {
        this.isNormalVisible = isNormalVisible;
        this.normalAlpha = normalAlpha;
    }

    // dynamically recalculates normal
    updateNormal(): void {
        if (this.isNormalVisible) {
            this.lineMaterial.opacity = this.normalAlpha;
        } else {
            this.lineMaterial.opacity = 0;
        }
        this.lineMaterial.needsUpdate = true;

        // this.lineGeometry.vertices = [];
        // this.lineGeometry.vertices.push(this.getCentroid());
        // this.lineGeometry.vertices.push(this.getNormal());

        // this.lineGeometry.verticesNeedUpdate = true;
        (this.lineGeometry as BufferGeometry).attributes.position.needsUpdate = true

    }

    // returns center point
    getCentroid(): Vector3 {
        this.cntr.setScalar(0);
        this.cntr.add(this.v0);
        this.cntr.add(this.v1);
        this.cntr.add(this.v2);
        this.cntr.add(this.v3);
        this.cntr.divideScalar(4);
        return this.cntr;
    }

    getEdges(): Vector3[] {
        let edges = [new Vector3(), new Vector3(),
        new Vector3(), new Vector3()];
        edges[0].subVectors(this.v1, this.v0);
        edges[1].subVectors(this.v2, this.v1);
        edges[2].subVectors(this.v3, this.v2);
        edges[3].subVectors(this.v0, this.v3);
        return edges;
    }

    getArea(): number {
        // returns magnitude of cross product
        let c = new Vector3();
        c.copy(this.getEdges()[0]);
        c.cross(this.getEdges()[1]);
        return c.length();
    }
}
// end quad class


// BEGIN Orb class
export class Orb extends Group {
    radius: number;
    pos: Vector3;
    posInit: Vector3;
    speed: Vector3;
    speedInit: Vector3;
    color: Color;
    sphere: Mesh;
    isDrawable: boolean = true;

    constructor(radius: number, pos: Vector3, speed: Vector3, color: Color, isDrawable: boolean = true) {
        super();
        this.radius = radius;
        this.pos = pos;
        this.posInit = new Vector3().set(this.pos.x, this.pos.y, this.pos.z)
        this.speed = speed;
        this.speedInit = new Vector3().set(this.speed.x, this.speed.y, this.speed.z)
        this.color = color;
        this.isDrawable = isDrawable;


        const geometry = new SphereGeometry(this.radius, 6, 6);
        const material = new MeshPhongMaterial({ color: this.color });
        this.sphere = new Mesh(geometry, material);
        this.sphere.position.x = this.pos.x;
        this.sphere.position.y = this.pos.y;
        this.sphere.position.z = this.pos.z;
        this.add(this.sphere);
        // if (this.isDrawable) {
        //     this.add(this.sphere);
        // }
    }

    move(time: number) {
        this.speed.y += PByteGlobals.gravity;
        this.pos.add(this.speed);
        if (this.isDrawable) {
            this.sphere.position.x = this.pos.x;
            this.sphere.position.y = this.pos.y;
            this.sphere.position.z = this.pos.z;
        }
    }

    collide(responseVector: number) {

    }
}
// END Orb class


// for VereltBodySegment
export class PhysTrig {
    theta3: Vector3;
    freq3: Vector3;
    amp3: Vector3;

    constructor(theta3: Vector3, freq3: Vector3, amp3: Vector3) {
        this.theta3 = theta3;
        this.freq3 = freq3;
        this.amp3 = amp3;
    }
}

export class DynamicSphere {
    pos: Vector3;
    spd: Vector3;
    rad: number;

    constructor(pos: Vector3, spd: Vector3, rad: number) {
        this.pos = pos;
        this.spd = spd;
        this.rad = rad;
    }

    move(gravity: number = 0) {
        this.pos.y += gravity;
        this.pos.add(this.spd);
    }
}



// only the phys part
export class PhysOrb {
    radius: Vector3;
    pos: Vector3;
    posInit: Vector3;
    speed: Vector3;
    speedInit: Vector3;
    rot: Vector3;
    rotSpeed: Vector3;

    constructor(radius: Vector3, pos: Vector3, speed: Vector3, rot: Vector3, rotSpeed: Vector3) {
        this.radius = radius;
        this.pos = pos;
        this.posInit = new Vector3().set(this.pos.x, this.pos.y, this.pos.z)
        this.speed = speed;
        this.speedInit = new Vector3().set(this.speed.x, this.speed.y, this.speed.z);
        this.rot = rot;
        this.rotSpeed = rotSpeed;
    }

    move() {
        this.pos.add(this.speed);
        this.rot.add(this.rotSpeed);
    }

    collide(responseVector: number) {
    }
}

//global variables
//global variable - eventually implement 'more better'.
export class PByteGlobals {
    static gravity: number = 0;
};


// Fisher Yates shuffle algoirthm
// from: https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj#:~:text=The%20first%20and%20simplest%20way,)%20%3D%3E%200.5%20%2D%20Math. 
export function shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}




