import { Vector2, Vector3 } from "three";

export class ProtoPhysics {

    /**
     * Public properties.
    */
    amp: number = 0.0;
    freq: number = 0.0;

    /**
     * 2D Speed along X and Y axes.
    */
    spd: Vector2;

    /**
     * 3D rotation speed around X, Y, and Z axes.
    */
    rotSpd: Vector3;

    /**
     * Uniform scaling speed.
    */
    sclSpd: number;


    // internal fields
    theta = 0.0;
    phu = 0.0;
    psi = 0.0;


    constructor(amp: number, freq: number, spd: Vector2 = new Vector2(0, 0), rotSpd: Vector3 = new Vector3(0, 0, 0), sclSpd: number = 0) {
        this.amp = amp;
        this.freq = freq;

        this.spd = spd;
        this.rotSpd = rotSpd;
        this.sclSpd = sclSpd;
    }

    pulse(): void {
        this.theta += this.freq;
    }



}