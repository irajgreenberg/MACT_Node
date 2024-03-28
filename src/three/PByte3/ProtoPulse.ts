import { pseudoRandomBytes } from "crypto";
import { Box3, BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, DoubleSide, Euler, Group, InterleavedBufferAttribute, Line, LineBasicMaterial, Mesh, MeshPhongMaterial, RepeatWrapping, TextureLoader, Vector2, Vector3 } from "three";
import { randFloat } from "three/src/math/MathUtils";
import { cos, FuncType, Particle, PI, sin, TWO_PI } from "./IJGUtils";
import { ProtoTubeGeometry } from "./ProtoTubeGeometry";

// pulse intensity calculated using PulseFunction based on inverse dist from center pt
export namespace Proto {
    export enum PulseExp {
        DEFAULT,
        LINEAR,
        QUADRATIC,
        CUBIC
    }
}
export class ProtoPulse extends Group {

    protoTubeGeom: ProtoTubeGeometry;
    protoTubeMat: MeshPhongMaterial;
    protoTubeMesh: Mesh;
    boundingBox:Box3;

    pos: Vector3;
    ptCount: number;
    size: Vector3;
    pathSpirals: number;
    parts: Particle[] = [];
    thetas: number[] = [];
    radius: number[] = [];
    frqs: number[] = [];

    pathCWWinding: number = 0;


    tubeMin = 0;
    tubeMax = 0;
    tubePeriods = 0;
    tubeMinTheta = 0;
    tubeMaxTheta = 0;
    tubePeriodsTheta = 0;
    tubeMaxAmp = 0;

    tubeMinFreq = 0;
    tubeMaxFreq = 0;
    tubePeriodsFreq = 0;

    //verticesInit: BufferAttribute | InterleavedBufferAttribute;
    spineVecs: Vector3[] = [];
    verticesDelta: Vector3[] = [];

    // tubeRotationVals: Vector3;
    skin: string;

    // general dynamics
    spd:Vector3;
    grav = -.04;
    damp = .5;
    
    
    // pulse dynamics
    pulseAmps: number[] = [];
    pulseThetas: number[] = [];
    pulseFreq: number;
    pulseFreqs: number[] = [];
    pulseFaucet: number = 0;
    pulseFaucetEmissionRate = .25;

    // const pulse intensity 
    pulseFunc: Proto.PulseExp = Proto.PulseExp.DEFAULT;


    constructor(pos: Vector3, ptCount: number, size: Vector3, pathSpirals: number,
        tubeMinMax: Vector2, tubePeriods: number, skin: string) {
        super();
        this.pos = pos;
        this.ptCount = ptCount;
        this.size = size;
        this.pathSpirals = pathSpirals;
        this.tubeMin = tubeMinMax.x;
        this.tubeMax = tubeMinMax.y;
        this.tubePeriods = tubePeriods;
        this.skin = skin + ".jpg";

        this.spd = new Vector3(0, -.3, );
        this.pulseFreq = randFloat(PI / 1280, PI / 60);

        const vecs: Vector3[] = [];
        const step = this.size.y / this.ptCount;
        let theta = 0;
        this.pathCWWinding = Math.round(Math.random());
        for (let i = 0; i < this.ptCount; i++) {
            //const amp = randFloat(30, 45);
            //this.radius[i] = randFloat(78, 85);
            const x = sin(theta) * this.size.x;
            const y = -this.size.y / 2 + step * i;
            const z = cos(theta) * this.size.z;
            vecs.push(new Vector3(x, y, z));
            if (this.pathCWWinding == 0) {
                theta += TWO_PI * this.pathSpirals / ptCount;
            } else {
                theta -= TWO_PI * this.pathSpirals / ptCount;
            }
        }
        const texture = new TextureLoader().load("textures/" + this.skin);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(this.pathSpirals * 4, 1);

        const path = new CatmullRomCurve3(vecs);
        this.protoTubeGeom = new ProtoTubeGeometry(path, 40, 20, false, { func: FuncType.SINUSOIDAL, min: this.tubeMin, max: this.tubeMax, periods: this.tubePeriods });
        this.protoTubeMat = new MeshPhongMaterial({
            wireframe: false,
            color: Math.random() * 0xffffff,
            specular: 0xDDDDDD + Math.random() * 0x333333,
            reflectivity: 1,
            //shininess: randFloat(10, 70),
            shininess: 20.4,
            side: DoubleSide,
            map: texture,
            transparent: true,
            opacity: .9,
            bumpMap: texture,
            bumpScale: randFloat(2, 4),

        });
        this.protoTubeMesh = new Mesh(this.protoTubeGeom, this.protoTubeMat);
        this.add(this.protoTubeMesh);
        this.boundingBox = new Box3().setFromObject(this.protoTubeMesh);
        this.position.add(this.pos);


        let pts = this.protoTubeMesh.geometry.attributes.position;

        for (let i = 0, k = 0; i < this.protoTubeGeom.tubularSegments + 1; i++) {
            this.pulseAmps[i] = this.tubeMax;
            this.pulseThetas[i] = (PI / (this.protoTubeGeom.tubularSegments + 1)) * i;
            //this.pulseThetas[i] = 0;
            //this.pulseFreqs[i] = randFloat(TWO_PI / 880.0, TWO_PI / 60.0);
            this.pulseFreqs[i] = this.pulseFreq;


            this.spineVecs[i] = new Vector3();
            for (let j = 0; j < this.protoTubeGeom.radialSegments + 1; j++) {
                k = i * (this.protoTubeGeom.radialSegments + 1) + j;
                this.spineVecs[i].add(new Vector3(pts.getX(k), pts.getY(k), pts.getZ(k)));
            }
            this.spineVecs[i].divideScalar(this.protoTubeGeom.radialSegments + 1);
        }

        for (let i = 0, k = 0; i < this.protoTubeGeom.tubularSegments + 1; i++) {
            for (let j = 0; j < this.protoTubeGeom.radialSegments + 1; j++) {
                k = i * (this.protoTubeGeom.radialSegments + 1) + j;
                this.verticesDelta[k] = new Vector3(pts.getX(k) - this.spineVecs[i].x, pts.getY(k) - this.spineVecs[i].y, pts.getZ(k) - this.spineVecs[i].z);
                this.verticesDelta[k].normalize();
            }
        }

        // Test of amplitude calc based on path vertices form path origin
        const d = this.spineVecs[0].distanceTo(this.spineVecs[this.spineVecs.length - 1])
        for (let i = 0; i < this.protoTubeGeom.tubularSegments; i++) {
            this.pulseAmps[i] = this.tubeMin * (this.size.y / 2 - Math.abs(this.spineVecs[i].y - this.pos.y)) * .05;
            // console.log((this.size.y / 2 - Math.abs(this.spineVecs[i].y - this.pos.y)) * .1);
        }
    }

    // this.pulseAmps[i]
    // this.pulseThetas[i]
    // this.pulseFreqs[i]

    pulse(time: number): void {
        //this.protoTubeMesh.rotateY(.01);
        let meshPos = this.protoTubeMesh.geometry.attributes.position;
        meshPos.needsUpdate = true;
        // by default loop avoids pulsing end segments
        for (let i = 1, k = 0; i < this.protoTubeGeom.tubularSegments; i++) {
            for (let j = 0; j < this.protoTubeGeom.radialSegments + 1; j++) {
                k = i * (this.protoTubeGeom.radialSegments + 1) + j;
                // meshPos.setXYZ(k, this.spineVecs[i].x + this.verticesDelta[k].x * (this.protoTubeGeom.exposedRadii[i] + Math.abs(sin(time * PI / 18) * 15)), this.spineVecs[i].y + this.verticesDelta[k].y * (this.protoTubeGeom.exposedRadii[i] + Math.abs(sin(time * PI / 18) * 15)), this.spineVecs[i].z + this.verticesDelta[k].z * (this.protoTubeGeom.exposedRadii[i] + Math.abs(sin(time * PI / 18) * 15)))

                meshPos.setXYZ(k,
                    this.spineVecs[i].x + this.verticesDelta[k].x * (this.protoTubeGeom.exposedRadii[i] + Math.abs(sin(this.pulseThetas[i]) * this.pulseAmps[i])),
                    this.spineVecs[i].y + this.verticesDelta[k].y * (this.protoTubeGeom.exposedRadii[i] + Math.abs(sin(this.pulseThetas[i]) * this.pulseAmps[i])),
                    this.spineVecs[i].z + this.verticesDelta[k].z * (this.protoTubeGeom.exposedRadii[i] + Math.abs(sin(this.pulseThetas[i]) * this.pulseAmps[i]))
                )

            }
            this.pulseThetas[i] += this.pulseFreqs[i];
            // console.log(this.pulseThetas[i]);
        }

        // if (this.pulseFaucet < this.protoTubeGeom.tubularSegments + this.pulseFaucetEmissionRate) {
        //     this.pulseFaucet += this.pulseFaucetEmissionRate;
        // } else {
        //     this.pulseFaucet = Math.floor(Math.random() * this.protoTubeGeom.tubularSegments);
        // }
    }

    // NOTE: the move, collide, etc should probs eventually 
    // be abstracted into interface or somethinanotha
    move(): void{
        this.spd.y += this.grav;
        this.protoTubeMesh.position.add(this.spd);
        const e = new Euler(0, 0, PI/2);
        this.protoTubeMesh.setRotationFromEuler(e);
       console.log(this.boundingBox);
    }
    
    collide(pos:Vector3): void {
        this.boundingBox = new Box3().setFromObject(this.protoTubeMesh);
        if (this.boundingBox.min.y<=pos.y){
            this.spd.y *= -1;
            //this.protoTubeMesh.position.y = 
        }
        // const pts = this.protoTubeMesh.geometry.attributes.position;
        // for(let i=0; i< pts.count; i++){
        //     if (pts.getY(i)<=pos.y){


        //     }
        // }
    }
}