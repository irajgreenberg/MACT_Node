// ProtoMorph_004
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

// Project Description: 

import { AmbientLight, Color, DirectionalLight, DoubleSide, FogExp2, HemisphereLight, MeshBasicMaterial, MeshPhongMaterial, PCFSoftShadowMap, PerspectiveCamera, PointLight, Scene, SpotLight, Texture, TextureLoader, Vector2, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos, AnchorPlane } from "../../libPByte_3/IJGUtils";
import { ProtoMorph_004 } from './ProtoMorph_004';
import { VerletPlane2 } from '../../libPByte_3/VerletPlane2';
import { VerletSurface } from '../../libPByte_3/VerletSurface';

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
let fogFactor = 0.0011;
//scene.fog = new FogExp2('#' + myColor.getHexString(), fogFactor)
scene.fog = new FogExp2(0xfaa6666, fogFactor)

// main renderer
let renderer = new WebGLRenderer({ alpha: true, antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
document.title = "[Proto]morphogenesis_004] | Ira Greenberg.2024"

const controls = new OrbitControls(camera, renderer.domElement);

/****************** Enter Custom Geometry *******************/
// let bounds = new Vector3().copy(new Vector3(1200, 800, 0));
// bounds.x *= 10.2
// bounds.y *= 1.9
// bounds.z *= 18

const skins = ["Proto_BG_006.png", "Proto_Org_006.png"];


scene.position.setZ(0);

// Organisms
const texture = new TextureLoader().load('data/ProtoMorph/Proto_Org_010.png');

//let mat = new MeshBasicMaterial({ color: 0xffaaaa, transparent: true, wireframe: false, opacity: .95, side: DoubleSide, map: texture })
// let vs = new VerletSurface(new Vector3(0, 0, 0), new Vector2(200, 200), new Vector2(36, 12), mat, .3);
//let proto004 = new ProtoMorph_004(vs, 2.3, 20, new Vector2(.1, 1.5), new Color('#ffbbbb'));
//vs.draw(false, false, false);

const orgCount = 1;
const spds: Vector3[] = [];
const rotSpds: Vector3[] = [];
let orgs: ProtoMorph_004[] = [];
for (let i = 0; i < orgCount; i++) {
    const col = new Color(randFloat(.7, 1), randFloat(.3, .5), randFloat(.3, .5))
    let mat = new MeshBasicMaterial({ color: col.getHex(), transparent: true, wireframe: false, opacity: .75, side: DoubleSide, map: texture })
    const rad = randFloat(50, 200);
    let vs = new VerletSurface(new Vector3(randFloat(-300, 300), randFloat(-230, 230), randFloat(-400, 100)), new Vector2(rad, rad), new Vector2(randInt(6, 12), randInt(6, 12)), mat, randFloat(.8, .9));
    orgs.push(new ProtoMorph_004(vs, randFloat(.01, .03), 20, new Vector2(.1, .3), col));
    scene.add(orgs[orgs.length - 1]);

    rotSpds.push(new Vector3(randFloat(-.1, .1) * PI / 180, randFloat(-.1, .1) * PI / 180, randFloat(-.1, .1) * PI / 180));
}

// scene.add(proto004);

// background
let env = new VerletPlane2(4200, 2500, 30, 30, "data/ProtoMorph/Proto_BG_010.png", AnchorPlane.EDGES_ALL);
env.position.setZ(-800);
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
    const time = Date.now() * 0.007;

    for (let i = 0; i < orgCount; i++) {

        orgs[i].move(time, new Vector3(30 * i, 0, sin(time * PI / 180) * 150));
        // orgs[i].rotate(rotSpds[i]);
        // orgs[i].position.set(30 * i, 0, sin(time * PI / 180) * 150)


    }



    // vs.verlet();
    // vs.update();

    env.verlet();
    // env.moveNode(randInt(0, env.bodyNodes.length - 1), new Vector3(randFloat(.3, 15), randFloat(.3, 15), randFloat(.01, .10)));

    env.jitterNodes(new Vector2(-2, 2));


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




