import { Color, IcosahedronGeometry, Mesh, MeshPhongMaterial, PolyhedronGeometry, Vector2, Vector3 } from "three";
import { randFloat } from "three/src/math/MathUtils";
import { rand2 } from "./IJGUtils";
import { ProtoIcosahedronGeometry } from "./ProtoIcosahedronGeometry";
import { VerletGeometryBase } from "./VerletGeometryBase";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";
import { VerletStrand } from "./VerletStrand";

export class VerletIcosahedron extends VerletGeometryBase {

    radius: number;
    detail: number;
    bodyNodesRadiusRange: Vector2;
    elasticityRange: Vector2;
    colorRange: Vector3[] = [];

    // guts
    icoGeom: PolyhedronGeometry;
    picoGeom: ProtoIcosahedronGeometry;
    icoMat: MeshPhongMaterial;
    icoMesh: Mesh;
    tendrils: VerletStrand[] = [];

    icoNodes: Mesh[] = [];

    stickColor: Color;

    constructor(radius: number, detail: number, bodyNodesRadiusRange: Vector2,
        elasticityRange: Vector2, colorRange: Vector3[]) {
        super();
        this.radius = radius;
        this.detail = detail;
        this.bodyNodesRadiusRange = bodyNodesRadiusRange;
        this.elasticityRange = elasticityRange;
        this.colorRange = colorRange;

        this.icoGeom = new IcosahedronGeometry(this.radius, this.detail);
        this.picoGeom = new ProtoIcosahedronGeometry(this.radius, this.detail);

        // console.log("indices = ", PolyhedronGeometry.fromJSON(this.icoGeom));

        const col = new Color((colorRange[0].x + colorRange[1].x) / 2, (colorRange[0].y + colorRange[1].y) / 2, (colorRange[0].z + colorRange[1].z) / 2)
        this.icoMat = new MeshPhongMaterial(
            { color: col, wireframe: true });
        this.icoMesh = new Mesh(this.icoGeom, this.icoMat);
        //this.add(this.icoMesh);

        this.stickColor = new Color(.5, .5, .5);

        // console.log("indices = ", this.picoGeom.parameters.indices);
        // console.log("vertices = ", this.picoGeom.parameters.vertices);
        this._init();
    }

    _init(): void {
        let pos = this.icoMesh.geometry.attributes.position;
        const inds = this.picoGeom.indices;

        for (let i = 0, j = 0; i < this.picoGeom.parameters.vertices.length; i += 3) {
            const x = this.picoGeom.parameters.vertices[i] * this.radius * .5;
            const y = this.picoGeom.parameters.vertices[i + 1] * this.radius * .5;
            const z = this.picoGeom.parameters.vertices[i + 2] * this.radius * .5;

            const col = new Color((this.colorRange[0].x + this.colorRange[1].x) / 2, (this.colorRange[0].y + this.colorRange[1].y) / 2, (this.colorRange[0].z + this.colorRange[1].z) / 2)


            this.nodes[j] = new VerletNode(
                new Vector3(x, y, z), randFloat(2, 6),
                col
            );
            this.add(this.nodes[j]);
            j++
        }

        for (let i = 0; i < this.picoGeom.parameters.indices.length - 1; i += 2) {
            const n1 = this.picoGeom.parameters.indices[i]
            const n2 = this.picoGeom.parameters.indices[i + 1]
            this.sticks.push(new VerletStick(this.nodes[n1], this.nodes[n2], rand2(this.elasticityRange.x, this.elasticityRange.y)));
            this.add(this.sticks[this.sticks.length - 1])
        }

        this.crossSupports.push(new VerletStick(this.nodes[5], this.nodes[6], rand2(this.elasticityRange.x, this.elasticityRange.y)))
        this.crossSupports.push(new VerletStick(this.nodes[4], this.nodes[7], rand2(this.elasticityRange.x, this.elasticityRange.y)))
        this.crossSupports.push(new VerletStick(this.nodes[0], this.nodes[3], rand2(this.elasticityRange.x, this.elasticityRange.y)))
        this.crossSupports.push(new VerletStick(this.nodes[1], this.nodes[2], rand2(this.elasticityRange.x, this.elasticityRange.y)))
        this.crossSupports.push(new VerletStick(this.nodes[11], this.nodes[9], rand2(this.elasticityRange.x, this.elasticityRange.y)))
        this.crossSupports.push(new VerletStick(this.nodes[10], this.nodes[8], rand2(this.elasticityRange.x, this.elasticityRange.y)))
        for (let i = 0; i < this.crossSupports.length; i++) {
            this.add(this.crossSupports[i])
        }

        // this.nodes[0].moveNode(new Vector3(randFloat(-100.3, 100.3), randFloat(-100.3, 100.3), randFloat(-100.3, 100.3)));
    }

    move(ids: number[], vecs: Vector3[]): void {
        for (let i = 0; i < ids.length; i++) {
            this.nodes[ids[i]].moveNode(vecs[i]);
        }
    }

    verlet(): void {

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].verlet();
        }

        for (let i = 0; i < this.sticks.length; i++) {
            this.sticks[i].constrainLen();
            this.sticks[i].setColor(this.stickColor);
            this.sticks[i].setOpacity(.5);
        }

        for (let i = 0; i < this.crossSupports.length; i++) {
            this.crossSupports[i].constrainLen();
            this.crossSupports[i].setColor(this.stickColor)
            this.crossSupports[i].setOpacity(.5);
        }
    }

    constrainBounds(bounds: Vector3, offset: number = 30): void {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].constrainBounds(bounds, offset, true);
        }
    }

    setStickColor(col: Color) {
        this.stickColor = col;
    }

}