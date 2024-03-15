// <FTName>
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// [DATE_NOW('yyyy')]

// Project Description: 

import p5 from "p5";
import { <FTName> } from './<FTName>';


const sketch = (p: p5) => {

    // window size
    const canvasW = 800;
    const canvasH = 600;

    // background color
    let bgR = p.int(p.random(110, 140));
    let bgG = p.int(p.random(110, 140));
    let bgB = p.int(p.random(110, 140));
    let bgColor: string

    p.setup = () => {
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "<FTName>";

        let cnv = p.createCanvas(canvasW, canvasH);

        p.setAttributes('antialias', true);
        cnv.style('display', 'block');


        // ****** Instantiate Custom Geom *******


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

        // ********* Animate Custom Geom ********


        // **************************************
    };

    p.keyTyped = () => {
        if (p.key === 'p') {
            const name = "<FTName>" + "_" + p.year() + p.month() + p.day() + p.hour() + p.minute() + p.second() + ".png";
            p.save(name);
        }
    }
};

let _instance = new p5(sketch);




