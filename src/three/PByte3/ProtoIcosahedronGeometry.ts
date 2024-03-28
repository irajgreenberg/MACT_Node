import { IcosahedronGeometry, PolyhedronGeometry, Vector2, Vector3 } from "three";


export class ProtoIcosahedronGeometry extends PolyhedronGeometry {
    indices: number[];

    constructor(radius: number, detail: number) {

        const t = (1 + Math.sqrt(5)) / 2;

        let vertices = [
            - 1, t, 0, 1, t, 0, - 1, - t, 0, 1, - t, 0,
            0, - 1, t, 0, 1, t, 0, - 1, - t, 0, 1, - t,
            t, 0, - 1, t, 0, 1, - t, 0, - 1, - t, 0, 1
        ];

        // let indices = [
        //     0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
        //     1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8,
        //     3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
        //     4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
        // ];

        let indices = [
            0, 1,
            0, 5,
            5, 1,
            0, 11,
            11, 5,
            5, 9,
            1, 9,
            11, 2,
            11, 4,
            2, 4,
            2, 3,
            3, 4,
            3, 9,
            0, 7,
            1, 7,
            6, 3,
            6, 2,
            7, 6,
            11, 10,
            9, 4,
            9, 8,
            10, 7,
            6, 8,
            6, 10,
            1, 8,
            7, 8,
            10, 2,
            8, 3,
            5, 4,
            0, 10
        ];


        super(vertices, indices, radius, detail);
        this.indices = indices

        // this.type = 'ProtoIcosahedronGeometry';

        // const parameters = {
        //     radius: radius,
        //     detail: detail
        // };

    }

    // static fromJSON(data: any) {

    //     return new ProtoIcosahedronGeometry(data.radius, data.detail);

    // }

}