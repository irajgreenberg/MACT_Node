// ProtoMorph_001
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Project Description: 

import { AmbientLight, Color, DirectionalLight, FogExp2, HemisphereLight, PCFSoftShadowMap, PerspectiveCamera, PointLight, Scene, SpotLight, Texture, TextureLoader, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos } from "../../libPByte_3/IJGUtils";
import { ProtoMorph_001 } from './ProtoMorph_001';
import { VerletPlane2 } from '../../libPByte_3/VerletPlane2';

// create and position camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 400;

const scene = new Scene();

let greyColR = randFloat(.01, .05);
let greyColG = randFloat(.01, .05);
let greyColB = randFloat(.01, .05);
let colVal = (greyColR + greyColG + greyColB) / 3
const myColor = new Color(greyColR, greyColG, greyColB);
scene.background = myColor;
document.body.style.backgroundColor = '#' + myColor.getHexString();
let fogFactor = 0.00004;
scene.fog = new FogExp2('#' + myColor.getHexString(), fogFactor)

// main renderer
let renderer = new WebGLRenderer({ alpha: true, antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
document.title = "[Proto]morphogenesis] | Ira Greenberg.2024"

const controls = new OrbitControls(camera, renderer.domElement);

/****************** Enter Custom Geometry *******************/
// let bounds = new Vector3().copy(new Vector3(1200, 800, 0));
// bounds.x *= 10.2
// bounds.y *= 1.9
// bounds.z *= 18

const skins = ["Proto_BG_005.png", "Proto_Org_005.png"];

let peopleCount = randInt(1, skins.length)
peopleCount = 1;

let planes: VerletPlane2[] = [];
planes.push(new VerletPlane2(4200, 2500, 30, 30, "data/ProtoMorph_001/" + skins[0]));
planes.push(new VerletPlane2(700, 500, 40, 40, "data/ProtoMorph_001/" + skins[1]));
planes[0].position.setZ(-600);
planes[1].position.setZ(150);
planes[0].receiveShadow = true;
planes[1].castShadow = true;



planes[1].moveNode(50, new Vector3(randFloat(30, 60), randFloat(30, 60), randFloat(30, 60)));
for (let i = 0; i < 2; i++) {
    scene.add(scene.add(planes[i]));
    // planes[i].position.setX(randFloat(-650, 650));
    planes[i].renderVerletGeometry(false, false);
}

console.log(planes[1].nodes.length);

scene.position.setZ(-300);
/************************************************************/

const ambientTexturesLight = new AmbientLight(new Color(randFloat(.75, .9), randFloat(.75, .9), randFloat(.75, .9)), randFloat(.01, .6));
scene.add(ambientTexturesLight);

const hemiLt = new HemisphereLight(new Color(randFloat(.5, 1), randFloat(.5, 1), randFloat(.5, 1)), new Color(randFloat(.5, 1), randFloat(.5, 1), randFloat(.5, 1)), randFloat(.01, .3));
scene.add(hemiLt);

const col2 = new Color(1, 1, 1);
const intensity = .2;
const light = new DirectionalLight(col2, intensity);
light.position.set(0, 0, 600);
light.castShadow = true;
scene.add(light);

const spot = new SpotLight(new Color(randFloat(.5, 1), randFloat(.5, 1), randFloat(.5, 1)), randFloat(.3, 1.5));
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
scene.add(pointLt);

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
    // controls.autoRotate = true;
    const time = Date.now() * 0.007;


    for (let i = 0; i < planes.length; i++) {
        planes[i].verlet();
        // planes[i].moveNode(randInt(0, planes[i].nodes.length - 1), new Vector3(randFloat(.1, .9), randFloat(.1, .9), randFloat(.1, .9)));
    }

    planes[0].moveNode(randInt(0, planes[0].nodes.length - 1), new Vector3(randFloat(.02, .75), randFloat(.02, .75), randFloat(.02, .75)));
    planes[1].moveNode(randInt(0, planes[1].nodes.length - 1), new Vector3(randFloat(.1, 1.2), randFloat(.1, 1.2), randFloat(.1, 1.2)));

    //  planes[1].moveNode(randInt(0, planes[1].nodes.length - 1), new Vector3(randFloat(.5, 2.5), randFloat(.5, 2.5), randFloat(.5, 2.5)));
    //planes[1].moveNode(Math.round(planes[1].nodes.length / 2 + planes[1].colCount / 2), new Vector3(0, 0, sin(renderer.info.render.frame * PI / 90) * randFloat(.7, 1.2)));
    planes[1].moveNode(800, new Vector3(0, 0, sin(renderer.info.render.frame * PI / 90) * randFloat(.7, 1.2)));


    planes[1].position.setX(sin(renderer.info.render.frame * PI / 2780) * 150);
    planes[1].position.setY(sin(renderer.info.render.frame * PI / 2280) * 105);
    planes[1].position.setZ(sin(renderer.info.render.frame * PI / 3780) * 245 + 100);
    planes[1].rotateZ(sin(.05 * PI / 180) * 1);

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




