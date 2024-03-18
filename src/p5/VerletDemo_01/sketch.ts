// VerletDemo_01
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Project Description: 

import p5 from "p5";
import { VerletDemo_01 } from './VerletDemo_01';


const sketch = (p: p5) => {

    // window size
    const canvasW = p.windowWidth;
    const canvasH = p.windowHeight;

    // background color
    let bgR = p.int(p.random(110, 140));
    let bgG = p.int(p.random(110, 140));
    let bgB = p.int(p.random(110, 140));
    let bgColor: string

    let directLightVector: p5.Vector;

    let vd01: VerletDemo_01;

    p.setup = () => {
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "VerletDemo_01";

        let cnv = p.createCanvas(canvasW, canvasH, p.WEBGL);

        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        directLightVector = p.createVector(0, 0, 300);

        // ****** Instantiate Custom Geom *******
        //constructor(p: p5, anchorPt: p5.Vector, nodeCount: number, len: number, radius: number, col: p5.Color)
        vd01 = new VerletDemo_01(p, new p5.Vector(0, 0, 0), 30, 300, 4, p.color(127, 200, 45));
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

        p.orbitControl();

        let v = p.createVector(directLightVector.x, directLightVector.y, directLightVector.z);

        p.ambientLight(20, 10, 15);

        p.directionalLight(255, 0, 0, v);

        p.shininess(255);
        p.specularColor(189);
        p.specularMaterial(250);

        // Creating the point lights at the
        // given points from the given directions
        p.pointLight(255, 255, 255, -10, 5, 200);
        p.pointLight(255, 255, 255, -60, 500, 380);

        // ********* Animate Custom Geom ********
        vd01.draw();
        // **************************************
    };

    p.keyTyped = () => {
        if (p.key === 'p') {
            const name = "VerletDemo_01" + "_" + p.year() + p.month() + p.day() + p.hour() + p.minute() + p.second() + ".png";
            p.save(name);
        }
    }

};

let _instance = new p5(sketch);




