// ProtoMorphogenesis
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

/* Project Description: 
*/

import { AmbientLight, Color, DirectionalLight, DoubleSide, FogExp2, HemisphereLight, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, PCFSoftShadowMap, PerspectiveCamera, PointLight, Scene, SpotLight, Texture, TextureLoader, Vector2, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos, AnchorPlane, getAlphaValues, getProtoAlphaData, ProtoAlphaData } from "../../libPByte_3/IJGUtils";
import { NodeSelector, ProtoOrganism_Single } from './ProtoOrganism_Single';
import { VerletPlane2 } from '../../libPByte_3/VerletPlane2';
import { VerletSurface } from '../../libPByte_3/VerletSurface';
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
camera.position.z = 600;

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
let fogFactor = 0.0002;
//scene.fog = new FogExp2('#' + myColor.getHexString(), fogFactor)
//scene.fog = new FogExp2(0x8888AA, fogFactor)



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

interface ImageMap {
    imageStr: string;
    hasTendrils: boolean;
}

const imageMaps: ImageMap[] = [
    { imageStr: "Proto_Org_001.png", hasTendrils: false },
    { imageStr: "Proto_Org_002.png", hasTendrils: false },
    { imageStr: "Proto_Org_003.png", hasTendrils: false },
    { imageStr: "Proto_Org_004.png", hasTendrils: false },
    { imageStr: "Proto_Org_005.png", hasTendrils: false },
    { imageStr: "Proto_Org_006.png", hasTendrils: false },
    { imageStr: "Proto_Org_007.png", hasTendrils: true },
    { imageStr: "Proto_Org_008.png", hasTendrils: false },
    { imageStr: "Proto_Org_009.png", hasTendrils: false },
    { imageStr: "Proto_Org_010.png", hasTendrils: false },
    { imageStr: "Proto_Org_011.png", hasTendrils: false },
    { imageStr: "Proto_Org_012.png", hasTendrils: false },
    { imageStr: "Proto_Org_013.png", hasTendrils: false },
    { imageStr: "Proto_Org_014.png", hasTendrils: false },
    { imageStr: "Proto_Org_015.png", hasTendrils: false },
    { imageStr: "Proto_Org_016.png", hasTendrils: false },
    { imageStr: "Proto_Org_017.png", hasTendrils: true },
    { imageStr: "Proto_Org_018.png", hasTendrils: false },
    { imageStr: "Proto_Org_019.png", hasTendrils: false },
    { imageStr: "Proto_Org_020.png", hasTendrils: true },
    { imageStr: "Proto_Org_021.png", hasTendrils: true },
    { imageStr: "Proto_Org_022.png", hasTendrils: true }
];

let protoOrg: ProtoOrganism_Single;


const textureMid = new TextureLoader().load('data/ProtoMorph/Proto_Org_Single_Middle_001.png');
//const textureMid = new TextureLoader().load('data/ProtoMorph/Proto_Org_004.png');

//const textureTop = new TextureLoader().load('data/ProtoMorph/Proto_Org_Single_Top_001.png');

const matMid = new MeshPhongMaterial({ color: 0xffffff, transparent: true, wireframe: false, flatShading: false, specular: 0x334433, shininess: 250, opacity: randFloat(1, 1), side: DoubleSide, map: textureMid, bumpScale: 5, bumpMap: textureMid });

// const matTop = new MeshPhongMaterial({ color: 0xffffff, specular: 0xAA8855, transparent: true, wireframe: false, opacity: randFloat(1, 1), side: DoubleSide, map: textureTop, bumpScale: 5, bumpMap: textureTop });


const sz = randFloat(700, 700);
const detail01 = randInt(36, 48);
const detail02 = randInt(12, 16);
const vSurfMid = new VerletSurface(new Vector2(sz, sz), new Vector2(detail01, detail02), matMid, randFloat(.01, .08), true);

const pPhys = new ProtoPhysics(
    randFloat(14, 20), //amp
    PI / randFloat(30, 60), //freq
    new Vector2(randFloat(-.35, .35), randFloat(-.35, .35)), //spd
    new Vector3(randFloat(PI / -1200, PI / 1200), randFloat(PI / -1200, PI / 1200), randFloat(PI / -1900, PI / 1900)) //rotSpd
);

const vSurfTop = new VerletSurface(new Vector2(sz, sz), new Vector2(detail01, detail02), matTop, randFloat(.1, .8), true);
// const tdm = new TendrilDataModel(randFloat(.5, 3.5), randInt(16, 24), new Vector2(.1, .4), new Vector2(4, 6));

const posX = randFloat(0, 0);
const posY = randFloat(0, 0);
const posZ = 0;

const tdm = new TendrilDataModel(randFloat(.5, 1.5), randInt(16, 24), new Vector2(5.6, 10.4), new Vector2(6, 8), new Color(1, .4, .4));


let isDataLoaded: boolean = false;
let pp: ProtoPlasm;

async function processImageData(url: string): Promise<void> {
    try {
        const data: ProtoAlphaData = await getProtoAlphaData(url);
        // console.log('Image Width:', data.w);
        // console.log('Image Height:', data.h);
        // console.log('Alpha Values:', data.alpha_1D);

        isDataLoaded = true;


        protoOrg = new ProtoOrganism_Single(new Vector3(randFloat(-posX, posX), randFloat(-posY, posY), randFloat(-posZ, posZ)), vSurfMid, new Color(1, .6, .6), pPhys, tdm, data);
        protoOrg.setZIndexDepth(75);
        protoOrg.addSubStructure(vSurfTop);
        // protoOrg.setAlphaData(getProtoAlphaData("data/ProtoMorph/Proto_Org_004.png"));

        // hack fix, needs better integration in OOP design
        //protoOrg.setAlphaLookUpTable(getAlphaLookUpTable("data/ProtoMorph/alpha_test_100_pixels.png"));

        //console.log(getAlphaValues("data/ProtoMorph/alpha_test_100_pixels.png"));

        //protoOrg.setSurfaceDrawable(false, true, false)

        pp = new ProtoPlasm(protoOrg, 100, new Vector3(2400, 1500, 100));
        pp.setJitter(new Vector3(.5, .5, .1));
        pp.start();
        scene.add(pp);

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error loading image:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

// Call the function
processImageData("data/ProtoMorph/Proto_Org_004.png");


// const pad = getProtoAlphaData("data/ProtoMorph/Proto_Org_004.png");
// console.log(data);


// protoOrg = new ProtoOrganism_Single(new Vector3(randFloat(-posX, posX), randFloat(-posY, posY), randFloat(-posZ, posZ)), vSurfMid, new Color(1, .6, .6), pPhys, tdm);
// protoOrg.setZIndexDepth(75);
// protoOrg.addSubStructure(vSurfTop);
// // protoOrg.setAlphaData(getProtoAlphaData("data/ProtoMorph/Proto_Org_004.png"));

// // hack fix, needs better integration in OOP design
// //protoOrg.setAlphaLookUpTable(getAlphaLookUpTable("data/ProtoMorph/alpha_test_100_pixels.png"));

// //console.log(getAlphaValues("data/ProtoMorph/alpha_test_100_pixels.png"));

// //protoOrg.setSurfaceDrawable(false, true, false)

// const pp = new ProtoPlasm(protoOrg, 100, new Vector3(2400, 1500, 100));
// pp.setJitter(new Vector3(.5, .5, .1));
// pp.start();
// scene.add(pp);


// background
let env = new VerletPlane2(10200, 7500, 10, 10, "data/ProtoMorph/Proto_BG_Single_001.jpg", AnchorPlane.EDGES_ALL);
env.position.setZ(-1900);
env.moveNode(50, new Vector3(randFloat(30, 60), randFloat(30, 60), randFloat(30, 60)));
scene.add(env);
env.renderVerletGeometry(false, false);
env.setNodesOff(AnchorPlane.EDGES_ALL);


// testing alpha image
// console.log(getProtoAlphaData("data/ProtoMorph/alpha_test_100_pixels.png"));



/************************************************************/


const ambientTexturesLight = new AmbientLight(new Color(randFloat(.75, .9), randFloat(.75, .9), randFloat(.75, .9)), randFloat(.7, .9));
scene.add(ambientTexturesLight);

const hemiLt = new HemisphereLight(new Color(randFloat(.5, 1), randFloat(.5, 1), randFloat(.5, 1)), new Color(randFloat(.5, 1), randFloat(.5, 1), randFloat(.5, 1)), randFloat(.01, .3));
scene.add(hemiLt);

const col2 = new Color(1, 1, 1);
const intensity = 1;
const light = new DirectionalLight(col2, intensity);
light.position.set(0, 0, 400);
//light.castShadow = true;
scene.add(light);

const spot = new SpotLight(new Color(1, 1, 1), 1, 1000);
spot.position.set(-500, 0, 400);
spot.castShadow = true;
// spot.shadow.radius = 12; //doesn't work with PCFsoftshadows
// spot.shadow.bias = -0.0001;
// spot.shadow.mapSize.width = 1024 * 4;
// spot.shadow.mapSize.height = 1024 * 4;
scene.add(spot);

const pointLt = new PointLight(new Color(randFloat(.3, 1), randFloat(.3, 1), randFloat(.3, 1)), randFloat(.5, 1.2), randFloat(4000, 4000));
pointLt.translateX(randFloat(0, 0));
pointLt.translateY(randFloat(0, 0));
pointLt.translateZ(randFloat(0, 0));
//pointLt.castShadow = true;
////scene.add(pointLt);

// creates spotlight on floor
const pointLt2 = new PointLight(new Color(randFloat(.8, 1), randFloat(.8, 1), randFloat(.8, 1)), randFloat(.8, 1.5), randFloat(300, 300));
pointLt2.translateX(randFloat(0, 0));
pointLt2.translateY(randFloat(0, 0));
pointLt2.translateZ(800);
//pointLt2.castShadow = true;
//scene.add(pointLt2);


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    //controls.autoRotate = true;
    const time = Date.now();

    /************************Custom code*************************/

    if (isDataLoaded) {
        pp.run(time);
    }

    env.verlet();
    env.jitterNodes(new Vector2(-.2, .2));
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




