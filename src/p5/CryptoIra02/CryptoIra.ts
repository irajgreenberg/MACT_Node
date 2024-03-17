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

    // ira: p5.Image;
    srcImg: p5.Image;
    extrudes: number[] = [];
    blocksPos2D: p5.Vector[][] = [];
    cols2D: p5.Color[][] = [];

    constructor(p: p5, freqW: number, freqH: number, srcImg: p5.Image) {
        this.p = p;
        this.freqW = freqW;
        this.freqH = freqH;
        this.srcImg = srcImg;
        // this.ira = p.loadImage(srcImg);
        // console.log("srcImg = ", srcImg);
        this.cellW = srcImg.width / freqW;
        this.cellH = srcImg.height / freqH;

        for (let i = 0, k = 0; i < freqW; i++) {
            this.blocksPos2D[i] = [];
            for (let j = 0; j < freqH; j++) {
                k = i * freqH + j;
                this.extrudes[k] = p.random(2, 8);
                this.blocksPos2D[i][j] = new p5.Vector(i * this.cellW, j * this.cellH, this.extrudes[k]);
            }
        }
        this.srcImg.loadPixels();
    }

    collectData(): void {
        let data = "let blockPosData = [\n";
        let colData = "let blockCols = [\n";
        for (let i = 0, k = 0, l = 0; i < this.freqW; i++) {
            this.cols2D[i] = [];
            for (let j = 0; j < this.freqH; j++) {
                k = i * this.freqH + j;
                let c = this.srcImg.get(i * this.cellW, j * this.cellH);
                if (this.p.brightness(c) < 10) {
                } else {
                    this.p.fill(c);
                    this.p.push();
                    //this.p.translate(-this.ira.width / 2 + i * this.cellW, -this.ira.height / 2 + j * this.cellH, this.extrudes[k]);
                    this.p.translate(this.blocksPos2D[i][j].x, this.blocksPos2D[i][j].y, this.blocksPos2D[i][j].z);
                    this.p.scale(1, 1, this.extrudes[k]);
                    this.p.box(this.cellW, this.cellH, 5);
                    this.p.pop();
                    data += this.blocksPos2D[i][j].x + ", ";
                    data += this.blocksPos2D[i][j].y + ", ";
                    // data += this.blocksPos2D[i][j].z + ", \n";
                    data += 0 + ", \n";

                    colData += c[0] + ", ";
                    colData += c[1] + ", ";
                    colData += c[2] + ", ";
                    //colData += c[3] + ", ";
                }
            }
        }
        data += "]";
        colData += "]";

        console.log(data);
        console.log(colData);

    }


}