import { Color, PlaneGeometry } from "three";

import {
    BufferGeometry,
    Float32BufferAttribute,
    Vector2,
    Vector3,
} from "three";
import { cos, PI } from "./IJGUtils";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";



export class VerletPlaneGeometry extends BufferGeometry {

    width: number;
    height: Number;
    widthSegments: number;
    heightSegments: number;

    // Verlet Guts
    nodes: VerletNode[] = [];
    nodes1D: VerletNode[] = []; // for convenience
    nodes2D: VerletNode[][] = [[]];
    sticks: VerletStick[] = [];
    bodyNodes: VerletNode[] = []; // no edge nodes


    // for convenience
    rowSticks: VerletStick[] = [];
    colSticks: VerletStick[] = [];

    constructor(width: number = 1, height: number = 1, widthSegments: number = 1, heightSegments: number = 1) {
        super();
        this.width = width;
        this.height = height;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;

        const width_half = width / 2;
        const height_half = height / 2;

        const gridX = Math.floor(widthSegments);
        const gridY = Math.floor(heightSegments);

        const gridX1 = gridX + 1;
        const gridY1 = gridY + 1;

        const segment_width = width / gridX;
        const segment_height = height / gridY;

        //

        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];

        for (let iy = 0; iy < gridY1; iy++) {
            let v1D: VerletNode[] = [];
            this.nodes2D.push(v1D);
            const y = iy * segment_height - height_half;

            for (let ix = 0; ix < gridX1; ix++) {

                const x = ix * segment_width - width_half;

                vertices.push(x, - y, 0);

                normals.push(0, 0, 1);

                uvs.push(ix / gridX);
                uvs.push(1 - (iy / gridY));

                let v = new VerletNode(new Vector3(x, -y, 0));
                v.setNodeColor(new Color(.2, .05, .4));
                //populate nodes array
                this.nodes2D[iy].push(v);
                this.nodes1D.push(v);

                // fill bodyNodes array.
                // used for perturbing surface
                // while avoiding edges
                if (iy > 0 && iy < gridY1 - 1 &&
                    ix > 0 && ix < gridX1 - 1) {
                    this.bodyNodes.push(v);
                }

                // this.add(v);
            }

        }

        for (let iy = 0; iy < gridY; iy++) {

            for (let ix = 0; ix < gridX; ix++) {

                const a = ix + gridX1 * iy;
                const b = ix + gridX1 * (iy + 1);
                const c = (ix + 1) + gridX1 * (iy + 1);
                const d = (ix + 1) + gridX1 * iy;

                indices.push(a, b, d);
                indices.push(b, c, d);

            }

        }

        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

    }

    verlet(): void {

        for (let n of this.nodes) {
            n.verlet();
        }
        for (let s of this.sticks) {
            s.constrainLen();
        }
    }

}