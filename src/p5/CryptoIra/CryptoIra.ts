// CryptoIra
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Class Description: 

import p5 from "p5";

export class CryptoIra {
    p: p5;
    freqW: number;
    freqH: number;
    cellW: number;
    cellH: number;

    ira: p5.Image;
    extrudes: number[] = [];

    constructor(p: p5, freqW: number, freqH: number) {
        this.p = p;
        this.freqW = freqW;
        this.freqH = freqH;
        this.ira = p.loadImage("data/CryptoIra/ira_photo_matte.png");
        this.ira.resize(600, 600);

        this.cellW = this.ira.width / freqW;
        this.cellH = this.ira.height / freqH;

        for (let i = 0, k = 0; i < freqW; i++) {
            for (let j = 0; j < freqH; j++) {
                k = i * freqH + j;
                this.extrudes[k] = p.random(2, 8);
            }
        }
        this.ira.loadPixels();
    }

    draw(): void {
        //this.p.image(this.ira, -this.ira.width / 2, -this.ira.height / 2);

        for (let i = 0, k = 0; i < this.freqW; i++) {
            for (let j = 0; j < this.freqH; j++) {
                k = i * this.freqH + j;
                let c = this.ira.get(i * this.cellW, j * this.cellH);
                if (this.p.brightness(c) < 10) {
                } else {
                    this.p.fill(c);
                    this.p.push();
                    this.p.translate(-this.ira.width / 2 + i * this.cellW, -this.ira.height / 2 + j * this.cellH, this.extrudes[k]);
                    this.p.scale(1, 1, this.extrudes[k]);
                    this.p.box(this.cellW, this.cellH, 5);
                    this.p.pop();
                }
            }
        }
    }

}