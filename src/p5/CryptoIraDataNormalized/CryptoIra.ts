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
                // create unit sized output, to be scaled in final application
                // limit floating point accuracy (to maintain small file size)
                this.blocksPos2D[i][j] = new p5.Vector(Number.parseFloat(((i * this.cellW) / srcImg.width).toFixed(2)), Number.parseFloat(((j * this.cellH) / srcImg.height).toFixed(2)), 0);
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
                    data += this.blocksPos2D[i][j].x + ", ";
                    data += this.blocksPos2D[i][j].y + ", ";
                    data += this.blocksPos2D[i][j].y + ", \n";

                    colData += c[0] + ", ";
                    colData += c[1] + ", ";
                    colData += c[2] + ", ";
                }
            }
        }
        data += "]";
        colData += "]";

        console.log(data);
        console.log(colData);

    }


}