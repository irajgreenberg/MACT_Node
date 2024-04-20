import { Vector2 } from "three";
import { ProtoPhysics } from "../../libPByte_3/ProtoPhysics";

export class TendrilDataModel {

    length: number;
    segments: number;
    radiiMinMax: Vector2;
    radialSegsmentsMinMax: Vector2;
    physics: ProtoPhysics;

    constructor(length: number, segments: number, radiiMinMax: Vector2, radialSegsmentsMinMax: Vector2, physics: ProtoPhysics) {
        this.length = length;
        this.segments = segments;
        this.radiiMinMax = radiiMinMax;
        this.radialSegsmentsMinMax = radialSegsmentsMinMax;
        this.physics = physics;
    }

}