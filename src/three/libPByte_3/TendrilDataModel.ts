import { Color, Vector2 } from "three";

export class TendrilDataModel {

    length: number;
    segments: number;
    radiiMinMax: Vector2;
    radialSegsmentsMinMax: Vector2;
    tendrilCol: Color;

    constructor(length: number, segments: number, radiiMinMax: Vector2, radialSegsmentsMinMax: Vector2, tendrilCol: Color = new Color(.5)) {
        this.length = length;
        this.segments = segments;
        this.radiiMinMax = radiiMinMax;
        this.radialSegsmentsMinMax = radialSegsmentsMinMax;
        this.tendrilCol = tendrilCol;

    }

}