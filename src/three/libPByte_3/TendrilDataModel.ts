import { Vector2 } from "three";

export class TendrilDataModel {

    length: number;
    segments: number;
    radiiMinMax: Vector2;
    radialSegsmentsMinMax: Vector2;

    constructor(length: number, segments: number, radiiMinMax: Vector2, radialSegsmentsMinMax: Vector2) {
        this.length = length;
        this.segments = segments;
        this.radiiMinMax = radiiMinMax;
        this.radialSegsmentsMinMax = radialSegsmentsMinMax;

    }

}