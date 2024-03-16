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
    // let h = p.random(0, 5);
    let bgG = p.int(p.random(0, 45));
    let bgB = p.int(p.random(0, 45));
    let bgR = p.int(p.random(0, 45));
    let bgColor: string

    let directLightVector: p5.Vector;

    // declare custom objects
    let ci: CryptoIra;

    // control north-south movement
    let boundary = new p5.Vector(325, 325, 150);

    let lightColorModulation: number;
    let isClicked: boolean = true;

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
        ci = new CryptoIra(p, 30, boundary);
        // **************************************

        lightColorModulation = p.random(0, 150);
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
        p.pointLight(p.random(30, 60), p.random(30, 60), p.random(30, 90), p.sin(p.frameCount * p.PI / 90) * 600, p.cos(p.frameCount * p.PI / 90) * 500, 380);

        // ********* Animate Custom Geom ********
        // p.rotateX(p.frameCount * p.PI / 1440);
        // p.rotateY(p.frameCount * p.PI / 2880);
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




