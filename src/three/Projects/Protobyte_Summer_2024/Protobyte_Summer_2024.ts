// Protobyte_Summer_2024
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Class Description: 

import { CatmullRomCurve3, Color, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos } from "../../libPByte_3/IJGUtils";
import { ProtoTubeGeometry } from "../../libPByte_3/ProtoTubeGeometry";

export class Protobyte_Summer_2024 extends Group {

    pbShell00!: Mesh;
    pbShell01!: Mesh;
    pbShell02!: Mesh;
    pbShell03!: Mesh;

    strands: Mesh[] = [];

    constructor() {
        super();
        this.create();
    }

    create() {


        let curvePts: Vector3[] = [];
        let theta = 0.0;
        const sentinal0 = 20;
        let orgHt = 350;

        for (let i = 0; i < sentinal0; i++) {
            let step = orgHt / sentinal0;
            curvePts.push(new Vector3(sin(theta) * 1, -orgHt / 2 + step * i, cos(theta) * 1));
            theta += TWO_PI / sentinal0;
        }

        let curve = new CatmullRomCurve3(curvePts);
        let creatureGeom = new ProtoTubeGeometry(curve, 30, 18, false, { func: FuncType.SINUSOIDAL, min: randFloat(0, 0), max: randFloat(160, 200), periods: randFloat(1, 1) });

        this.pbShell00 = new Mesh(creatureGeom, new MeshBasicMaterial({ color: "#ee9999", wireframe: true, transparent: true, opacity: .3 }));
        this.add(this.pbShell00);

        curvePts = [];
        theta = 0.0;
        let sentinal1 = 20;
        orgHt = 300;

        for (let i = 0; i < sentinal1; i++) {
            let step = orgHt / sentinal1;
            curvePts.push(new Vector3(sin(theta) * 7, -orgHt / 2 + step * i, cos(theta) * 15));
            theta += TWO_PI / sentinal1;
        }

        curve = new CatmullRomCurve3(curvePts);
        creatureGeom = new ProtoTubeGeometry(curve, 30, 18, false, { func: FuncType.SINUSOIDAL, min: randFloat(.2, 1), max: randFloat(100, 130), periods: randFloat(1, 1) });

        this.pbShell01 = new Mesh(creatureGeom, new MeshBasicMaterial({ color: "#6633aa", wireframe: true }));
        this.add(this.pbShell01);


        curvePts = [];
        theta = 0.0;
        const sentinal2 = 20;

        for (let i = 0; i < sentinal2; i++) {
            let step = 200 / sentinal2;
            curvePts.push(new Vector3(sin(theta) * 30, -100 + step * i, cos(theta) * 30));
            theta += TWO_PI * 3 / sentinal2;
        }

        curve = new CatmullRomCurve3(curvePts);
        creatureGeom = new ProtoTubeGeometry(curve, 100, 8, false, { func: FuncType.SINUSOIDAL, min: randFloat(.2, 1), max: randFloat(1, 8), periods: randFloat(1, 1) });

        this.pbShell02 = new Mesh(creatureGeom, new MeshBasicMaterial({ color: "#eedd44", wireframe: true, transparent: true, opacity: .8 }));
        this.add(this.pbShell02);

        curvePts = [];
        theta = 0.0;
        const sentinal3 = 10;

        for (let i = 0; i < sentinal3; i++) {
            let step = 200 / sentinal3;
            curvePts.push(new Vector3(sin(theta) * 30, -100 + step * i, cos(theta) * 30));
            theta += TWO_PI * 3 / sentinal3;
        }

        curve = new CatmullRomCurve3(curvePts);
        creatureGeom = new ProtoTubeGeometry(curve, 100, 8, false, { func: FuncType.SINUSOIDAL, min: randFloat(.2, 1), max: randFloat(20, 40), periods: randFloat(10, 15) });

        this.pbShell03 = new Mesh(creatureGeom, new MeshBasicMaterial({ color: new Color(Math.random(), Math.random(), Math.random()), wireframe: true, transparent: true, opacity: .9 }));
        this.add(this.pbShell03);


        // strands
        let strandLoops = randInt(2, 6);
        let strandLoopSegs = 100;


        for (let h = 0; h < strandLoops; h++) {
            curvePts = [];
            // Initial point
            let theta = Math.random() * 2 * Math.PI; // Random angle in the xy-plane
            let phi = Math.random() * Math.PI; // Random angle from z-axis
            let radius = randFloat(165, 230);
            let x = radius * Math.sin(phi) * Math.cos(theta);
            let y = radius * Math.sin(phi) * Math.sin(theta);
            let z = radius * Math.cos(phi);

            curvePts.push(new Vector3(x, y, z));

            // Generate subsequent curvePts
            for (let i = 1; i < randInt(60, 475); i++) { // Increased to 1000 for a more complete winding around the sphere
                // Small random perturbation
                theta += (Math.random() - 0.5) * 2; // Small random perturbation
                phi += (Math.random() - 0.5) * 2; // Small random perturbation

                // Ensure phi stays within bounds
                phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));

                // Spherical to Cartesian conversion
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);

                curvePts.push(new Vector3(x, y, z));
            }

            let curve = new CatmullRomCurve3(curvePts);
            let creatureGeom = new ProtoTubeGeometry(curve, 8000, 16, false, { func: FuncType.SINUSOIDAL, min: randFloat(.1, .2), max: randFloat(.2, randFloat(.2, 1)), periods: randFloat(20, 60) });

            this.strands[h] = new Mesh(creatureGeom, new MeshBasicMaterial({ color: new Color(Math.random(), Math.random(), Math.random()), wireframe: true, transparent: true, opacity: randFloat(.05, .75) }));
            this.add(this.strands[h]);
        }



    }

    move(time: number) {
    }
}


