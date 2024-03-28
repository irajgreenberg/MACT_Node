// Verletion
// Ira Greenberg
// Santa Fe, NM | Dallas, TX

// Project Description: 
// Verletion explores...

import { AmbientLight, Color, DirectionalLight, FogExp2, HemisphereLight, PCFSoftShadowMap, PerspectiveCamera, PointLight, Scene, SpotLight, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI } from "../PByte3/IJGUtils";
import { Verletion } from './Verletion';

// create and position camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 400;

const scene = new Scene();
let greyCol = randFloat(.1, .3);
let greyColR = randFloat(.01, .15);
let greyColG = randFloat(.01, .15);
let greyColB = randFloat(.01, .15);
let colVal = (greyColR + greyColG + greyColB) / 3
const myColor = new Color(greyColR, greyColG, greyColB);
scene.background = myColor;
document.body.style.backgroundColor = '#' + myColor.getHexString();
let fogFactor = 0.00024;
scene.fog = new FogExp2('#' + myColor.getHexString(), fogFactor)

// main renderer
let renderer = new WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
document.title = "Verletion | Ira Greenberg.2024"

const controls = new OrbitControls(camera, renderer.domElement);


/****************** Enter Custom Geometry *******************/
let v: Verletion = new Verletion(new Vector3(0, 0, 0), new Vector3(100, 100, 0));
scene.add(v);
/************************************************************/


const ambientTexturesLight = new AmbientLight(new Color(randFloat(.75, .9), randFloat(.75, .9), randFloat(.75, .9)), randFloat(.01, .6));
scene.add(ambientTexturesLight);

const hemiLt = new HemisphereLight(new Color(randFloat(.5, 1), randFloat(.5, 1), randFloat(.5, 1)), new Color(randFloat(.5, 1), randFloat(.5, 1), randFloat(.5, 1)), randFloat(.01, .3));
scene.add(hemiLt);

const col2 = new Color(randFloat(.3, .8), randFloat(.3, .8), randFloat(.3, .8));
const intensity = randFloat(.2, .6);
const light = new DirectionalLight(col2, intensity);
light.position.set(randFloat(-30, 30), randFloat(400, 900), randFloat(-50, 50));
light.castShadow = true;
scene.add(light);


const spot = new SpotLight(new Color(randFloat(.5, 1), randFloat(.5, 1), randFloat(.5, 1)), randFloat(.3, 1.5));
spot.position.set(randFloat(-10, 10), randFloat(50, 160), randFloat(500, 550));
spot.castShadow = true;
spot.shadow.radius = 12; //doesn't work with PCFsoftshadows
spot.shadow.bias = -0.0001;
spot.shadow.mapSize.width = 1024 * 4;
spot.shadow.mapSize.height = 1024 * 4;
//scene.add(spot);

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
pointLt2.translateZ(randFloat(0, 0));
pointLt2.castShadow = true;
scene.add(pointLt2);


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    controls.autoRotate = true;

    const time = Date.now() * 0.007;
    // ascent.move(time, new Vector3(1000, 3500, 1000));
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
        saveImage(renderer, scene, camera, "Verletion" + uid, 1, 1);
    }
})




