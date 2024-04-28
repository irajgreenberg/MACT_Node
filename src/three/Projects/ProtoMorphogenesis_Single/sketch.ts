// ProtoMorphogenesis
// Ira Greenberg
// Santa Fe, NM | Dallas, TX
// 2024

/* Project Description: 
*/

import { AmbientLight, Color, DirectionalLight, DoubleSide, FogExp2, HemisphereLight, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, OrthographicCamera, PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, PointLight, RGBAFormat, Scene, SpotLight, Texture, TextureLoader, Vector2, Vector3, WebGLRenderTarget, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { FuncType, saveImage, PI, TWO_PI, sin, cos, AnchorPlane } from "../../libPByte_3/IJGUtils";
import { NodeSelector, ProtoOrganism_Single } from './ProtoOrganism_Single';
import { VerletPlane2 } from '../../libPByte_3/VerletPlane2';
import { VerletSurface } from '../../libPByte_3/VerletSurface';
import { TendrilDataModel } from '../../libPByte_3/TendrilDataModel';
import { ProtoPhysics } from '../../libPByte_3/ProtoPhysics';
import { ProtoPlasm } from './ProtoPlasm';
import { Camera } from 'p5';

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
camera.position.z = 800;

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
window.onload = (): void => {
    const canvas = document.getElementById('pixelCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error('Unable to get canvas context');
        return;
    }

    // Load the image
    const image = new Image();
    image.src = 'data/ProtoMorph/Proto_Org_001.png'; // Set the path to your image
    image.onload = () => {
        // Resize the canvas to the image dimensions
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the image onto the canvas
        ctx.drawImage(image, 0, 0);

        // Access the image's pixel data
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const pixels = imageData.data; // Pixel data: RGBA values in a Uint8ClampedArray

        // Example: Log the RGBA values of the first pixel
        console.log("pixels.length = ", pixels.length);
        for (let i = 0; i < pixels.length / 10; i += 4) {
            console.log('pixel alpha data:', pixels[3 + i]);
        }

    };
};







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




