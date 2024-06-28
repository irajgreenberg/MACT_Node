//'data/ProtoMorph/Proto_Org_001.png'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
let plane: THREE.Mesh, texture: THREE.Texture;
let controls: OrbitControls;
const rows = 20, columns = 20;

// Initialize the scene
function init() {
    // Create the scene
    scene = new THREE.Scene();

    // Create a camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add OrbitControls for rotation
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Load the texture
    const loader = new THREE.TextureLoader();
    texture = loader.load('data/ProtoMorph/Proto_Org_001.png', onTextureLoad);

    // Add light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
}

// Called when the texture is loaded
function onTextureLoad(texture: THREE.Texture) {
    const planeGeometry = new THREE.PlaneGeometry(2, 2, columns - 1, rows - 1);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, wireframe: true, transparent: true });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    addPerpendicularLines(planeGeometry, texture);
}

// Add perpendicular lines to vertices with alpha > 0
function addPerpendicularLines(geometry: THREE.PlaneGeometry, texture: THREE.Texture) {
    const image = texture.image as HTMLImageElement;
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    const vertices = geometry.attributes.position.array;
    const linesMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

    for (let i = 0; i < vertices.length; i += 3) {
        const x = ((vertices[i] + 1) / 2) * image.width;
        const y = ((-vertices[i + 1] + 1) / 2) * image.height;
        const index = (Math.floor(y) * image.width + Math.floor(x)) * 4;

        if (data[index + 3] > 0) {
            const lineGeometry = new THREE.BufferGeometry();
            const lineVertices = new Float32Array([
                vertices[i], vertices[i + 1], vertices[i + 2],
                vertices[i], vertices[i + 1], vertices[i + 2] + 0.1
            ]);
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineVertices, 3));
            const line = new THREE.Line(lineGeometry, linesMaterial);
            scene.add(line);
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Initialize everything
init();
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
