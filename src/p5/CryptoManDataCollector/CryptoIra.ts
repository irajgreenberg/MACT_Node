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

    colW: number;
    colH: number;


    // ira: p5.Image;
    srcImg: p5.Image;
    blocksPos2D: p5.Vector[][] = [];
    cols2D: p5.Color[][] = [];

    constructor(p: p5, freqW: number, freqH: number, srcImg: p5.Image) {
        this.p = p;
        this.freqW = freqW;
        this.freqH = freqH;
        this.srcImg = srcImg;

        // for data
        let unitH = 1.0;
        let unitW = 9.0 / 16.0
        this.cellH = unitH / freqH;
        this.cellW = unitW / freqW;

        // for color
        this.colH = this.srcImg.height / freqH;
        this.colW = this.srcImg.width / freqW;




        for (let i = 0, k = 0; i < freqW; i++) {
            this.blocksPos2D[i] = [];
            for (let j = 0; j < freqH; j++) {
                k = i * freqH + j;
                this.blocksPos2D[i][j] = new p5.Vector(
                    -unitW / 2 + i * this.cellW,
                    -unitH / 2 + j * this.cellH,
                    0
                );
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
                let c = this.srcImg.get(i * this.colW, j * this.colH);
                if (this.p.brightness(c) < 10) {
                } else {
                    data += this.blocksPos2D[i][j].x.toPrecision(3) + ", ";
                    data += this.blocksPos2D[i][j].y.toPrecision(3) + ", ";
                    data += this.blocksPos2D[i][j].z.toPrecision(3) + ", \n";

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