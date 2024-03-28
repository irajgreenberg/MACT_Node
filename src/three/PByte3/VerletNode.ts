// This class supports development
// of an 'independent' softbody organism.
// Project is being produced in collaboration with
// Courtney Brown, Melanie Clemmons & Brent Brimhall

// Simple verlet node
// Original Author: Ira Greenberg, 11/2020
// Center of Creative Computation, SMU
//----------------------------------------------

import * as THREE from 'three';
import { BoxGeometry, CircleGeometry, Color, DodecahedronGeometry, DoubleSide, IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, OctahedronGeometry, SphereGeometry, TetrahedronGeometry, Vector3 } from 'three';
import { randFloat } from 'three/src/math/MathUtils';
import { GeometryDetail } from './IJGUtils';

export class VerletNode extends Mesh {

  private posOld: Vector3;
  private radius: number; //for conveneince
  color: Color;
  isNodeVisible: boolean;
  isVerletable: boolean;
  verletDamping: Vector3;

  constructor(pos: Vector3, radius: number = 1, color: Color = new Color(.5, .5, .5), geomDetail: GeometryDetail = GeometryDetail.SPHERE_LOW, isNodeVisible: boolean = true, isVerletable = true) {

    // determine node geometry
    let geom;
    let mat;
    switch (geomDetail) {
      case GeometryDetail.TRI:
        geom = new CircleGeometry(radius, GeometryDetail.TRI);
        mat = new MeshBasicMaterial({ color: color });
        break;
      case GeometryDetail.QUAD:
        geom = new CircleGeometry(radius, GeometryDetail.QUAD);
        mat = new MeshBasicMaterial({ color: color });
        break;
      case GeometryDetail.PENT:
        geom = new CircleGeometry(radius, GeometryDetail.PENT);
        mat = new MeshBasicMaterial({ color: color });
        break;
      case GeometryDetail.HEX:
        geom = new CircleGeometry(radius, GeometryDetail.HEX);
        mat = new MeshBasicMaterial({ color: color });
        break;
      case GeometryDetail.HEP:
        geom = new CircleGeometry(radius, GeometryDetail.HEP);
        mat = new MeshBasicMaterial({ color: color });
        break;
      case GeometryDetail.OCT:
        geom = new CircleGeometry(radius, GeometryDetail.OCT);
        mat = new MeshBasicMaterial({ color: color });
        break;
      case GeometryDetail.DEC:
        geom = new CircleGeometry(radius, GeometryDetail.DEC);
        mat = new MeshBasicMaterial({ color: color });
        break;
      case GeometryDetail.DODEC:
        geom = new CircleGeometry(radius, GeometryDetail.DODEC);
        mat = new MeshBasicMaterial({ color: color });
        break;
      case GeometryDetail.TETRA:
        geom = new TetrahedronGeometry(radius);
        mat = new MeshPhongMaterial({ color: color });
        break;
      case GeometryDetail.CUBE:
        geom = new BoxGeometry(radius, radius, radius);
        mat = new MeshPhongMaterial({ color: color });
        break;
      case GeometryDetail.OCTA:
        geom = new OctahedronGeometry(radius);
        mat = new MeshPhongMaterial({ color: color });
        break;
      case GeometryDetail.ICOSA:
        geom = new IcosahedronGeometry(radius);
        mat = new MeshPhongMaterial({ color: color, wireframe: true });
        // mat = new MeshPhongMaterial({ color: color });
        break;
      case GeometryDetail.DODECA:
        geom = new DodecahedronGeometry(radius);
        break;
      case GeometryDetail.SPHERE_LOW:
        geom = new SphereGeometry(radius, 8, 8);
        mat = new MeshPhongMaterial({ color: color });
        break;
      case GeometryDetail.SPHERE_MED:
        geom = new SphereGeometry(radius, 12, 12);
        mat = new MeshPhongMaterial({ color: color });
        break;
      case GeometryDetail.SPHERE_HIGH:
        geom = new SphereGeometry(radius, 18, 18);
        mat = new MeshPhongMaterial({ color: color });
        break;
      case GeometryDetail.SPHERE_SUPERHIGH:
        geom = new SphereGeometry(radius, 24, 24);
        mat = new MeshPhongMaterial({ color: color });
        break;
      case GeometryDetail.SPHERE_SUPERDUPERHIGH:
        geom = new SphereGeometry(radius, 32, 32);
        mat = new MeshPhongMaterial({ color: color });
        break;
      default:
        geom = new CircleGeometry(radius, GeometryDetail.TRI);
        mat = new MeshBasicMaterial({ color: color });
    }

    //super(geom, new MeshBasicMaterial({ color: color }));
    super(geom, mat);
    this.verletDamping = new Vector3(1, 1, 1);
    if (geomDetail < 13) { // show backs of poly nodes
      let mat = this.material as MeshBasicMaterial;
      mat.side = DoubleSide;
    }
    this.radius = radius;
    this.color = color;
    this.isNodeVisible = isNodeVisible;
    this.position.set(pos.x, pos.y, pos.z);
    this.posOld = this.position.clone();
    this.isVerletable = isVerletable;
  }

  // Start motion with node offset
  moveNode(vec: Vector3): void {
    this.position.add(vec);
  }

  // Motion determined by position comparison between current and previus frames
  verlet(): void {
    if (this.isVerletable) { // enables nodes to be inactive
      let posTemp1: Vector3 = new Vector3(this.position.x, this.position.y, this.position.z);
      this.position.x += (this.position.x - this.posOld.x) * this.verletDamping.x;
      this.position.y += (this.position.y - this.posOld.y) * this.verletDamping.y;
      this.position.z += (this.position.z - this.posOld.z) * this.verletDamping.z;
      this.posOld.copy(posTemp1);
    }
  }

  resetVerlet(): void {
    this.posOld = this.position.clone();
  }

  constrainBoundsVec(bounds: Vector3, repulsion: Vector3 = new Vector3(), isSphere: boolean = false): void {
    if (!isSphere) {
      if (this.position.x > bounds.x / 2 - this.radius) {
        this.position.x = bounds.x / 2 - this.radius;
        this.position.x -= repulsion.x;
      } else if (this.position.x < -bounds.x / 2 + this.radius) {
        this.position.x = -bounds.x / 2 + this.radius;
        this.position.x += repulsion.x;
      }

      if (this.position.y > bounds.y / 2 - this.radius) {
        this.position.y = bounds.y / 2 - this.radius;
        this.position.y -= repulsion.y;
        this.position.x += randFloat(-repulsion.x, repulsion.x);
        this.position.z += randFloat(-repulsion.z, repulsion.z);
        repulsion.multiplyScalar(.3)

      } else if (this.position.y < -bounds.y / 2 + this.radius) {
        this.position.y = -bounds.y / 2 + this.radius;
        this.position.y += repulsion.y;
        this.position.x += randFloat(-repulsion.x, repulsion.x);
        this.position.z += randFloat(-repulsion.z, repulsion.z);
        repulsion.multiplyScalar(.3)
      }

      if (this.position.z > bounds.z / 2 - this.radius) {
        this.position.z = bounds.z / 2 - this.radius;
        this.position.z -= repulsion.z;
      } else if (this.position.z < -bounds.z / 2 + this.radius) {
        this.position.z = -bounds.z / 2 + this.radius;
        this.position.z += repulsion.z;
      }
    } else {
      if (this.position.length() >= bounds.x) {
        this.position.normalize();
        this.position.multiplyScalar(bounds.x - repulsion.x);
        //this.spd[i].multiplyScalar(-1);
      }
    }
  }


  constrainBounds(bounds: Vector3, repulsion: number = 0, isSphere: boolean = false): void {
    if (!isSphere) {
      if (this.position.x > bounds.x / 2 - this.radius) {
        this.position.x = bounds.x / 2 - this.radius;
        this.position.x -= repulsion;
      } else if (this.position.x < -bounds.x / 2 + this.radius) {
        this.position.x = -bounds.x / 2 + this.radius;
        this.position.x += repulsion;
      }

      if (this.position.y > bounds.y / 2 - this.radius) {
        this.position.y = bounds.y / 2 - this.radius;
        this.position.y -= repulsion;
      } else if (this.position.y < -bounds.y / 2 + this.radius) {
        this.position.y = -bounds.y / 2 + this.radius;
        this.position.y += repulsion;
      }

      if (this.position.z > bounds.z / 2 - this.radius) {
        this.position.z = bounds.z / 2 - this.radius;
        this.position.z -= repulsion;
      } else if (this.position.z < -bounds.z / 2 + this.radius) {
        this.position.z = -bounds.z / 2 + this.radius;
        this.position.z += repulsion;
      }
    } else {
      if (this.position.length() >= bounds.x) {
        this.position.normalize();
        this.position.multiplyScalar(bounds.x - repulsion);
        //this.spd[i].multiplyScalar(-1);
      }
    }
  }

  constrainBoundsNoCorrection(bounds: Vector3,): void {
    if (this.position.x > bounds.x / 2 - this.radius) {
      this.position.x = bounds.x / 2 - this.radius;
      this.position.x -= .1;
    } else if (this.position.x < -bounds.x / 2 + this.radius) {
      this.position.x = -bounds.x / 2 + this.radius;
      this.position.x += .1;
    }

    if (this.position.y > bounds.y / 2 - this.radius) {

      this.position.y = bounds.y / 2 - this.radius;
      this.position.y -= .1;
    } else if (this.position.y < -bounds.y / 2 + this.radius) {
      this.position.y = -bounds.y / 2 + this.radius;
      this.position.y += .1;
    }

    if (this.position.z > bounds.z / 2 - this.radius) {
      this.position.z = bounds.z / 2 - this.radius;
      this.position.z -= .1;

    } else if (this.position.z < -bounds.z / 2 + this.radius) {
      this.position.z = -bounds.z / 2 + this.radius;
      this.position.z += .1;

    }
  }


  setNodeColor(color: Color): void {
    let mat = this.material as MeshPhongMaterial;
    mat.color = color;
  }

  setNodeAlpha(alpha: number): void {
    let mat = this.material as MeshPhongMaterial;
    mat.transparent = true;
    mat.opacity = alpha;
  }

  // redundant and should probably be changed not adding/removing nodes to/from scene
  setNodeVisible(isNodeVisible: boolean): void {
    let mat = this.material as MeshPhongMaterial;
    if (isNodeVisible) {
      mat.transparent = false;
      mat.opacity = 1.0;
    } else {
      mat.transparent = true;
      mat.opacity = 0.0;
    }

  }
}