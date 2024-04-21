// ProtoMorph_002
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Project Description: 

import { AmbientLight, Color, DirectionalLight, DoubleSide, FogExp2, HemisphereLight, MeshBasicMaterial, MeshPhongMaterial, PCFSoftShadowMap, PerspectiveCamera, PointLight, Scene, SpotLight, Texture, TextureLoader, Vector2, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos } from "../../libPByte_3/IJGUtils";
import { ProtoMorph_002 } from './ProtoMorph_002';
import { VerletPlane2 } from '../../libPByte_3/VerletPlane2';
import { VerletSurface } from '../../libPByte_3/VerletSurface';

// create and position camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 10000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 400;

const scene = new Scene();

// dark
// let greyColR = randFloat(.01, .05);
// let greyColG = randFloat(.01, .05);
// let greyColB = randFloat(.01, .05);

//light
let greyColR = randFloat(.4, .8);
let greyColG = randFloat(.4, .8);
let greyColB = randFloat(.4, .8);

let colVal = (greyColR + greyColG + greyColB) / 3
const myColor = new Color(greyColR, greyColG, greyColB);
scene.background = myColor;
document.body.style.backgroundColor = '#' + myColor.getHexString();
let fogFactor = 0.00004;
//scene.fog = new FogExp2('#' + myColor.getHexString(), fogFactor)

// main renderer
let renderer = new WebGLRenderer({ alpha: true, antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
document.title = "[Proto]morphogenesis_02] | Ira Greenberg.2024"

const controls = new OrbitControls(camera, renderer.domElement);

/****************** Enter Custom Geometry *******************/
// let bounds = new Vector3().copy(new Vector3(1200, 800, 0));
// bounds.x *= 10.2
// bounds.y *= 1.9
// bounds.z *= 18

const skins = ["Proto_BG_006.png", "Proto_Org_006.png"];


scene.position.setZ(0);

// VerletSurface test
//const texture = new TextureLoader().load('data/ProtoMorph/Proto_Org_005.png');
const texture = new TextureLoader().load('data/ProtoMorph/Proto_Org_007.png');

let mat = new MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, wireframe: false, opacity: 1, side: DoubleSide, map: texture })

// let mat = new MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: .9, transparent: true, wireframe: false, opacity: .9, side: DoubleSide, map: texture });

let vs = new VerletSurface(new Vector3(0, 0, 0), new Vector2(300, 300), new Vector2(36, 16), mat, .9);
scene.add(vs);
vs.draw(true, true, true);

// start surface deformation
//vs.centroidNode.moveNode(new Vector3(0, 0, 12));
//console.log(vs.sticks.length);
/************************************************************/



const ambientTexturesLight = new AmbientLight(new Color(randFloat(.75, .9), randFloat(.75, .9), randFloat(.75, .9)), randFloat(.01, .1));
scene.add(ambientTexturesLight);

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
    const time = Date.now() * 0.007;

    vs.verlet();
    vs.update();
    //vs.rotateZ(.075 * PI / 180);

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




