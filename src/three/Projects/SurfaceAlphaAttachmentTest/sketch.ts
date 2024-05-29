//'data/ProtoMorph/Proto_Org_001.png'


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(120, 120, 20, 20);
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('data/ProtoMorph/Proto_Org_001.png', (texture) => {
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const plane = new THREE.Mesh(planeGeometry, material);
    scene.add(plane);
    addContourLines(planeGeometry, texture);
});

function addContourLines(geometry: THREE.PlaneGeometry, texture: THREE.Texture) {
    const alphaData = getAlphaData(texture.image as HTMLImageElement);
    const vertices = geometry.attributes.position.array as Float32Array;
    const contourGroup = new THREE.Group();

    const width = texture.image.width;
    const height = texture.image.height;

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const alpha = getAlphaAtPosition(alphaData, x, y, width, height);

        if (alpha > 0 && isEdge(alphaData, x, y, width, height)) {
            const normal = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]).normalize();
            const direction = new THREE.Vector3(normal.x, normal.y, 0).normalize();
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x, y, 0),
                new THREE.Vector3(x + direction.x, y + direction.y, 1)
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            contourGroup.add(line);
        }
    }
    scene.add(contourGroup);
}

function getAlphaData(image: HTMLImageElement): Uint8ClampedArray {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('Failed to get 2D context');
    }
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, image.width, image.height);
    return imageData.data;
}

function getAlphaAtPosition(alphaData: Uint8ClampedArray, x: number, y: number, width: number, height: number): number {
    const row = Math.floor((y + 10) / 20 * height);
    const col = Math.floor((x + 10) / 20 * width);
    const index = (row * width + col) * 4 + 3;  // Alpha value is the 4th element in the RGBA array
    return alphaData[index];
}

function isEdge(alphaData: Uint8ClampedArray, x: number, y: number, width: number, height: number): boolean {
    const row = Math.floor((y + 10) / 20 * height);
    const col = Math.floor((x + 10) / 20 * width);

    const alphaAtCurrent = getAlphaAtPosition(alphaData, x, y, width, height);
    if (alphaAtCurrent === 0) return false;

    const neighbors = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    for (const [dx, dy] of neighbors) {
        const newRow = row + dy;
        const newCol = col + dx;
        if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
            const neighborAlpha = alphaData[(newRow * width + newCol) * 4 + 3];
            if (neighborAlpha === 0) {
                return true;
            }
        }
    }
    return false;
}

// Add OrbitControls for better view manipulation
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 50;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
