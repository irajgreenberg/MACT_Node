import p5 from "p5";

export class ProtoStyle {
    p: p5;
    fillCol: p5.Color;
    strokeCol: p5.Color;
    strokeWt: number;
    radius: number;

    constructor(
        p: p5,
        fillCol: p5.Color = p.color(128),
        strokeCol: p5.Color = p.color(45),
        strokeWt: number = 1,
        radius: number = 2
    ) {
        this.p = p;
        this.fillCol = fillCol;
        this.strokeCol = strokeCol;
        this.strokeWt = strokeWt;
        this.radius = radius;
    }
}