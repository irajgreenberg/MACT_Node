// ProtoMorphogenesis
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

/* Project Description: 
*/

import { AmbientLight, Color, DirectionalLight, DoubleSide, FogExp2, HemisphereLight, MeshBasicMaterial, MeshPhongMaterial, PCFSoftShadowMap, PerspectiveCamera, PointLight, Scene, SpotLight, Texture, TextureLoader, Vector2, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos, AnchorPlane } from "../../libPByte_3/IJGUtils";
import { NodeSelector, ProtoOrganism } from './ProtoOrganism';
import { VerletPlane2 } from '../../libPByte_3/VerletPlane2';
import { VerletSurface } from '../../libPByte_3/VerletSurface2';
import { TendrilDataModel } from '../../libPByte_3/TendrilDataModel';
import { ProtoPhysics } from '../../libPByte_3/ProtoPhysics';
import { ProtoPlasm } from './ProtoPlasm';

// enum HasTendrils {
//     NO,
//     EDGES,
//     EDGES_INNER,
//     CENTER
// }

// create and position camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 10000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 400;

const scene = new Scene();

// dark
let greyColR = randFloat(.01, .05);
let greyColG = randFloat(.01, .05);
let greyColB = randFloat(.01, .05);

//light
// let greyColR = randFloat(.4, .8);
// let greyColG = randFloat(.4, .8);
// let greyColB = randFloat(.4, .8);

let colVal = (greyColR + greyColG + greyColB) / 3
const myColor = new Color(greyColR, greyColG, greyColB);
scene.background = myColor;
document.body.style.backgroundColor = '#' + myColor.getHexString();
let fogFactor = 0.0005;
//scene.fog = new FogExp2('#' + myColor.getHexString(), fogFactor)
scene.fog = new FogExp2(0x8888AA, fogFactor)

// main renderer
let renderer = new WebGLRenderer({ alpha: true, antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
document.title = "[Proto]morphogenesis_005] | Ira Greenberg.2024"

const controls = new OrbitControls(camera, renderer.domElement);

/************************Custom code*************************/
// single organism
// const texture = new TextureLoader().load('data/ProtoMorph/Proto_Org_010.png');

// const mat = new MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: false, opacity: .95, side: DoubleSide, map: texture })
// const vSurf = new VerletSurface(new Vector2(100, 100), new Vector2(36, 30), mat, .3, true);
// const pPhys = new ProtoPhysics(15.3, PI / 75);
// const tdm = new TendrilDataModel(1.2, 24, new Vector2(.1, .3), new Vector2(4, 6));

// let protoOrg = new ProtoOrganism(new Vector3(randFloat(-300, 300), randFloat(-100, 100), randFloat(-50, 50)), vSurf, new Color(.7, .6, .6), pPhys, tdm);
// //scene.add(protoOrg);
// protoOrg.start(NodeSelector.Centroid, new Vector3(30, 30, 40));

// multiple organisms
// const ORG_COUNT = 17;
// const textureStrs = ["Proto_Org_001.png", "Proto_Org_002.png", "Proto_Org_003.png", "Proto_Org_004.png", "Proto_Org_005.png", "Proto_Org_006.png", "Proto_Org_007.png", "Proto_Org_008.png", "Proto_Org_009.png", "Proto_Org_010.png", "Proto_Org_011.png", "Proto_Org_012.png", "Proto_Org_013.png", "Proto_Org_014.png", "Proto_Org_015.png", "Proto_Org_016.png", "Proto_Org_017.png", "Proto_Org_018.png"]
// const hasTendrils = [];

interface ImageMap {
    imageStr: string;
    hasTendrils: boolean;
}
const imageMaps: ImageMap[] = [];
imageMaps.push({ imageStr: "Proto_Org_001.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_002.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_003.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_004.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_005.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_006.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_007.png", hasTendrils: true });
imageMaps.push({ imageStr: "Proto_Org_008.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_009.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_010.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_011.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_012.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_013.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_014.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_015.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_016.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_017.png", hasTendrils: true });
imageMaps.push({ imageStr: "Proto_Org_018.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_019.png", hasTendrils: false });
imageMaps.push({ imageStr: "Proto_Org_020.png", hasTendrils: true });
imageMaps.push({ imageStr: "Proto_Org_021.png", hasTendrils: true });
imageMaps.push({ imageStr: "Proto_Org_022.png", hasTendrils: true });

const protoOrgs: ProtoOrganism[] = [];
for (let i = 0; i < imageMaps.length / 3; i++) {
    const texture = new TextureLoader().load('data/ProtoMorph/' + imageMaps[i].imageStr);
    // const mat = new MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: false, opacity: randFloat(.49, .6), side: DoubleSide, map: texture })
    const mat = new MeshPhongMaterial({ color: 0xffffff, transparent: true, flatShading: true, wireframe: false, opacity: randFloat(.95, .99), specular: 0x444444, side: DoubleSide, map: texture })
    const sz = randFloat(170, 280);
    const detail01 = randInt(16, 24);
    const detail02 = randInt(8, 12);
    const vSurf = new VerletSurface(new Vector2(sz, sz), new Vector2(detail01, detail02), mat, randFloat(.1, .8), true);
    const pPhys = new ProtoPhysics(
        randFloat(10, 15), //amp
        PI / randFloat(20, 90), //freq
        new Vector2(randFloat(-.35, .35), randFloat(-.35, .35)), //spd
        new Vector3(randFloat(PI / -1200, PI / 1200), randFloat(PI / -1200, PI / 1200), randFloat(PI / -1200, PI / 1200)) //rotSpd
    );
    const tdm = new TendrilDataModel(randFloat(1, 1.5), randInt(12, 24), new Vector2(.1, .8), new Vector2(4, 6));

    const posX = randFloat(100, 400);
    const posY = randFloat(50, 125);
    const posZ = 0;
    if (imageMaps[i].hasTendrils) {
        protoOrgs[i] = new ProtoOrganism(new Vector3(randFloat(-posX, posX), randFloat(-posY, posY), randFloat(-posZ, posZ)), vSurf, new Color(.7, .6, .6), pPhys, tdm);
    } else {
        protoOrgs[i] = new ProtoOrganism(new Vector3(randFloat(-posX, posX), randFloat(-posY, posY), randFloat(-posZ, posZ)), vSurf, new Color(.7, .6, .6), pPhys);
    }

    //scene.add(protoOrgs[i]);
    //protoOrgs[i].start(NodeSelector.Centroid, new Vector3(30, 30, 40));

}
const pp = new ProtoPlasm(protoOrgs, 65, new Vector3(1000, 600, 100));
pp.start();

scene.add(pp);


// background
let env = new VerletPlane2(5200, 2500, 30, 30, "data/ProtoMorph/Proto_BG_006.png", AnchorPlane.EDGES_ALL);
env.position.setZ(-1200);
env.moveNode(50, new Vector3(randFloat(30, 60), randFloat(30, 60), randFloat(30, 60)));
scene.add(env);
env.renderVerletGeometry(false, false);
env.setNodesOff(AnchorPlane.EDGES_ALL);


/************************************************************/


const ambientTexturesLight = new AmbientLight(new Color(randFloat(.75, .9), randFloat(.75, .9), randFloat(.75, .9)), randFloat(.01, .1));
//scene.add(ambientTexturesLight);

const hemiLt = new HemisphereLight(new Color(randFloat(.5, 1), randFloat(.5, 1), randFloat(.5, 1)), new Color(randFloat(.5, 1), randFloat(.5, 1), randFloat(.5, 1)), randFloat(.01, .3));
scene.add(hemiLt);

const col2 = new Color(1, 1, 1);
const intensity = .9;
const light = new DirectionalLight(col2, intensity);
light.position.set(0, 0, 600);
light.castShadow = true;
scene.add(light);

const spot = new SpotLight(new Color(randFloat(.5, 1), randFloat(.5, 1), randFloat(.5, 1)), randFloat(.5, .5));
spot.position.set(randFloat(-10, 10), randFloat(50, 160), randFloat(500, 550));
spot.castShadow = true;
spot.shadow.radius = 12; //doesn't work with PCFsoftshadows
spot.shadow.bias = -0.0001;
spot.shadow.mapSize.width = 1024 * 4;
spot.shadow.mapSize.height = 1024 * 4;
scene.add(spot);

const pointLt = new PointLight(new Color(randFloat(.3, 1), randFloat(.3, 1), randFloat(.3, 1)), randFloat(.5, 1.2), randFloat(4000, 4000));
pointLt.translateX(randFloat(0, 0));
pointLt.translateY(randFloat(0, 0));
pointLt.translateZ(randFloat(0, 0));
pointLt.castShadow = true;
//scene.add(pointLt);

// creates spotlight on floor
const pointLt2 = new PointLight(new Color(randFloat(.8, 1), randFloat(.8, 1), randFloat(.8, 1)), randFloat(.8, 1.5), randFloat(3000, 3000));
pointLt2.translateX(randFloat(0, 0));
pointLt2.translateY(randFloat(0, 0));
pointLt2.translateZ(800);
pointLt2.castShadow = true;
//scene.add(pointLt2);


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    //controls.autoRotate = true;
    const time = Date.now();

    /************************Custom code*************************/
    // protoOrg.verlet();
    // protoOrg.move(
    //     new Vector3(
    //         sin(time * PI / 10780) * 250,
    //         cos(time * PI / 12780) * 150,
    //         sin(time * PI / 11780) * 75
    //     ));
    // protoOrg.rotate(new Vector3(PI / 860, PI / 780, PI / 820));
    // protoOrg.pulse();

    // for (let i = 0; i < ORG_COUNT; i++) {
    //     protoOrgs[i].verlet();
    //     protoOrgs[i].move(
    //         new Vector3(
    //             sin(time * PI / 10780) * 250,
    //             cos(time * PI / 12780) * 150,
    //             sin(time * PI / 11780) * 75
    //         ));
    //     protoOrgs[i].rotate(new Vector3(PI / 860, PI / 780, PI / 820));
    //     protoOrgs[i].pulse();
    // }


    pp.run(time);

    env.verlet();
    env.jitterNodes(new Vector2(-2, 2));
    /************************************************************/


    render();
}

function render() {
    renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", onWindowResize)
function onWindowResize() {
    (camera.aspect = window.innerWidth / window.innerHeight),
        camera.updateProjectionMatrix(),
        renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('keydown', (event) => {
    if (event.key == 'p') {
        const uid = new Date().getTime();
        saveImage(renderer, scene, camera, "[Proto]morphogenesis" + uid, 1, 1);
    }
})




