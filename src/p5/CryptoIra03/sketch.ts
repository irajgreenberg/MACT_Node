// CryptoIra
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Project Description: 
// Bright Moments Venezia drop with Crypto Citizens.

import p5 from "p5";
import { CryptoIra } from './CryptoIra';


const sketch = (p: p5) => {

    // window size
    const canvasW = 600;
    const canvasH = 600;

    // background color
    let bgR = p.int(p.random(110, 140));
    let bgG = p.int(p.random(110, 140));
    let bgB = p.int(p.random(110, 140));
    let bgColor: string

    let directLightVector: p5.Vector;

    // declare custom objects
    let ci: CryptoIra;

    p.setup = () => {
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "CryptoIra";

        let cnv = p.createCanvas(canvasW, canvasH, p.WEBGL);


        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        directLightVector = p.createVector(0, 0, 300);

        // ****** Instantiate Custom Geom *******
        p.noStroke();
        ci = new CryptoIra(p);
        // **************************************
    };

    const resizedSketch = (p: p5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(canvasW, canvasH);
        }
    };

    p.draw = () => {
        p.background(bgR, bgG, bgB);
        // p.rotateY(p.PI / 2);

        p.orbitControl();

        let v = p.createVector(directLightVector.x, directLightVector.y, directLightVector.z);

        p.ambientLight(20, 10, 15);

        p.directionalLight(255, 0, 0, v);

        p.shininess(25);
        p.specularColor(255);
        p.specularMaterial(20);

        // Creating the point lights at the
        // given points from the given directions
        p.pointLight(255, 255, 255, -10, 5, 200);
        p.pointLight(255, 255, 255, -60, 500, 380);

        // ********* Animate Custom Geom ********
        p.translate(-150, -150);
        ci.draw();
        // p.noLoop();
        // **************************************
    };

    p.keyTyped = () => {
        if (p.key === 'p') {
            const name = "CryptoIra" + "_" + p.year() + p.month() + p.day() + p.hour() + p.minute() + p.second() + ".png";
            p.save(name);
        }
    }

};

let _instance = new p5(sketch);




