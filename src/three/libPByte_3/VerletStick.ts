// This class supports development
// of an 'independent' softbody organism.
// Project is being produced in collaboration with
// Courtney Brown, Melanie Clemmons & Brent Brimhall
// help from: https://sbcode.net/threejs/geometry-to-buffergeometry/

// Simple verlet Stick
// manages constraint of verlet nodes

// Original Author: Ira Greenberg, 11/2020
// Center of Creative Computation, SMU
//----------------------------------------------

import * as THREE from 'three';
import { BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, Group, Line, LineBasicMaterial, Vector3 } from 'three';
import { VerletNode } from './VerletNode';

// Verlet stick terminal anchoring
export enum AnchorPoint {
  NONE,
  HEAD,
  TAIL,
  HEAD_TAIL,
  MOD2,
  RAND
}

export class VerletStick extends Group {

  stickTension: number;
  // anchor stick detail
  anchorTerminal: AnchorPoint;
  start: VerletNode;
  end: VerletNode;
  len: number;
  line: Line
  lineGeometry: BufferGeometry;
  lineColor: Color;
  lineMaterial: LineBasicMaterial;
  isVisible: boolean
  points: Vector3[] = [];
  alpha = 1.0;

  curve = new CatmullRomCurve3();


  constructor(start: VerletNode, end: VerletNode, stickTension: number = .05, anchorTerminal: AnchorPoint = AnchorPoint.NONE, isVisible: boolean = true) {
    super();
    this.start = start;
    this.end = end;
    this.len = this.start.position.distanceTo(this.end.position);
    this.stickTension = stickTension;
    this.anchorTerminal = anchorTerminal;
    this.isVisible = isVisible;
    //this.lineMaterial = new LineBasicMaterial({ color: 0xcc55cc });

    // this.points.push(this.start.position);
    // this.points.push(this.end.position);
    const pointsF32 = new Float32Array([
      this.start.position.x, this.start.position.y, this.start.position.z, // Start point
      this.end.position.x, this.end.position.y, this.end.position.z,       // End point
    ]);

    this.lineGeometry = new BufferGeometry();
    this.lineGeometry.setAttribute('position', new BufferAttribute(pointsF32, 3));

    this.lineColor = new Color(1, 1, 1);
    this.lineMaterial = new LineBasicMaterial({ color: this.lineColor });

    this.curve = new CatmullRomCurve3([
      this.start.position,  // Start point
      new THREE.Vector3(     // Mid control point for the curve
        (this.start.position.x + this.end.position.x) / 2,
        (this.start.position.y + this.end.position.y) / 2 + 1,  // Adjust this value to control the curve height
        (this.start.position.z + this.end.position.z) / 2,
      ),
      this.end.position     // End point
    ]);

    const points = this.curve.getPoints(50); // 50 points for smoothness
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

    // this.line = new Line(this.lineGeometry, this.lineMaterial);
    this.lineMaterial.transparent = true;
    this.lineMaterial.opacity = 1;
    this.lineMaterial.linewidth = 15;
    this.line = new Line(curveGeometry, this.lineMaterial);

    this.add(this.line);

  }
  // setHeadNode(startstart: VerletNode){

  // }

  constrainLen(accuracyCount: number = 1): void {
    // accuracy factor
    let x1 = 0; let y1 = 0; let z1 = 0;
    let x2 = 0; let y2 = 0; let z2 = 0;
    // ensure integer
    for (let i = 0; i < 1; i++) {

      let delta: Vector3 = new Vector3(
        this.end.position.x - this.start.position.x,
        this.end.position.y - this.start.position.y,
        this.end.position.z - this.start.position.z);

      //   console.log(this.end.position);

      let deltaLength: number = delta.length();

      // nodeConstrainFactors optionally anchor stick on one side
      let node1ConstrainFactor: number = 0.5;
      let node2ConstrainFactor: number = 0.5;

      if (this.anchorTerminal === AnchorPoint.NONE) {
        node1ConstrainFactor = 0.5;
        node2ConstrainFactor = 0.5;
      } else if (this.anchorTerminal === AnchorPoint.TAIL) {
        node1ConstrainFactor = 0.0;
        node2ConstrainFactor = 1.0;
      } else if (this.anchorTerminal === AnchorPoint.HEAD) {
        node1ConstrainFactor = 1.0;
        node2ConstrainFactor = 0.0;
      } else if (this.anchorTerminal === AnchorPoint.HEAD_TAIL) {
        node1ConstrainFactor = 0.0;
        node2ConstrainFactor = 0.0;
      } else if (this.anchorTerminal === AnchorPoint.RAND) {
        node1ConstrainFactor = Math.random();
        node2ConstrainFactor = 1.0 - node1ConstrainFactor;
      }

      let difference: number = (deltaLength - this.len) / deltaLength;
      this.start.position.x += delta.x * (node1ConstrainFactor * this.stickTension * difference);
      this.start.position.y += delta.y * (node1ConstrainFactor * this.stickTension * difference);
      this.start.position.z += delta.z * (node1ConstrainFactor * this.stickTension * difference);
      this.end.position.x -= delta.x * (node2ConstrainFactor * this.stickTension * difference);
      this.end.position.y -= delta.y * (node2ConstrainFactor * this.stickTension * difference);
      this.end.position.z -= delta.z * (node2ConstrainFactor * this.stickTension * difference);
    }



    // const positionAttribute = this.line.geometry.attributes.position;
    // positionAttribute.setXYZ(0, this.start.position.x, this.start.position.y, this.start.position.z);
    // positionAttribute.setXYZ(1, this.end.position.x, this.end.position.y, this.end.position.z);
    // positionAttribute.needsUpdate = true;


    //curve code
    const points = this.curve.getPoints(1);
    this.line.geometry.setFromPoints(points);
    this.line.geometry.attributes.position.needsUpdate = true;


    if (!this.isVisible) {
      this.line.visible = false;
    }
  }

  setColor(col: Color): void {
    this.lineMaterial.color = col; // does this do anything??
    // this.line.material = new LineBasicMaterial({ color: col, transparent: true, opacity: this.alpha });

  }

  setOpacity(alpha: number): void {
    this.alpha = alpha;
    this.lineMaterial.opacity = alpha;
  }

  setVisibility(isVisible: boolean): void {
    this.isVisible = isVisible;
  }

  setStickTension(stickTension: number): void {
    this.stickTension = stickTension;
  }


  reinitializeLen(): void {
    this.len = this.start.position.distanceTo(this.end.position);
  }

  setShadowEnabled(isShadowEnabled: boolean) {
    this.line.castShadow = isShadowEnabled;

  }
}

