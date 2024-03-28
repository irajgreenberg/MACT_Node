// VerletDemo_02
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Class Description: 
// simple Verlet creature

import p5 from "p5";
import { VerletBaseMin } from "../../libPByte_p5/VerletBaseMin";

export class VerletDemo_02 extends VerletBaseMin {

    p: p5


    constructor(p: p5) {
        super(p);
        this.p = p;

        this.init();
    }

    init() {

    }

    move(time: number = 0) {
    }

    draw() {
    }
}


