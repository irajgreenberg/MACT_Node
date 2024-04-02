// CryptoIra
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Project Description: 
// Bright Moments Venezia drop with Crypto Citizens.

import p5 from "p5";
import { CryptoUomo } from './CryptoUomo';
import { Random } from './Random';


const sketch = (p: p5) => {

    // Seeded random form Bright Moments
    let rand_BM = new Random();

    // window size
    let canvasH = p.windowHeight;
    let canvasW = canvasH * 9 / 16;;


    // background color
    // let h = rand_BM.random_num(0, 5);
    let bgG = p.int(rand_BM.random_num(0, 45));
    let bgB = p.int(rand_BM.random_num(0, 45));
    let bgR = p.int(rand_BM.random_num(0, 45));
    let bgColor: string

    let directLightVector: p5.Vector;

    // declare custom objects
    let ci: CryptoUomo;

    // control north-south movement
    let boundary: p5.Vector;

    let lightColorModulation: number;
    let isClicked: boolean = true;

    p.setup = () => {
        p.pixelDensity(1);
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "CryptoIra";

        // added Sun 3/17

        canvasH = p.windowHeight;
        canvasW = canvasH * 9 / 16;

        let cnv = p.createCanvas(canvasW, canvasH, p.WEBGL);
        //boundary = new p5.Vector(p.width, p.height, 100);
        boundary = new p5.Vector(9 / 16, 1, .3);


        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        directLightVector = p.createVector(0, 0, 300);

        // ****** Instantiate Custom Geom *******
        p.noStroke();
        ci = new CryptoUomo(p, 30, boundary, rand_BM);
        // **************************************

        lightColorModulation = rand_BM.random_num(0, 150);
    };

    const resizedSketch = (p: p5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(canvasW, canvasH);
        }
    };

    p.draw = () => {
        p.background(bgR, bgG, bgB);

        p.orbitControl();

        let v = p.createVector(directLightVector.x, directLightVector.y, directLightVector.z);

        p.ambientLight(100, 100, 100);

        p.directionalLight(175, 175, 175, v);

        p.shininess(10);
        p.specularColor(255);
        p.specularMaterial(100);

        // Creating the point lights at the
        // given points from the given directions
        // p.pointLight(105 + lightColorModulation, 255, 255, -100, -100, 200);
        p.pointLight(255, 255, 255, -100, -100, 200);
        p.pointLight(rand_BM.random_num(30, 60), rand_BM.random_num(30, 60), rand_BM.random_num(30, 90), p.sin(p.frameCount * p.PI / 90) * 600, p.cos(p.frameCount * p.PI / 90) * 500, 380);

        // ********* Animate Custom Geom ********
        p.scale(new p5.Vector(canvasW, canvasH, (canvasH + canvasW) / 2));
        ci.draw();
        // **************************************

        if (isClicked) {

        }
    };

    p.keyTyped = () => {
        if (p.key === 'p') {
            const name = "CryptoIra" + "_" + p.year() + p.month() + p.day() + p.hour() + p.minute() + p.second() + ".png";
            p.save(name);
        }
    }

    p.mousePressed = () => {
        ci.nudge();
    }

};

let _instance = new p5(sketch);




