import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 3);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;

// Music
const audio = new Audio('/lamore.mp3');
audio.loop = true;


const playBtn = document.createElement('button');
playBtn.textContent = 'Play Music';
playBtn.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #ffffff22;
  color: white;
  border: 1px solid white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  z-index: 10;
`;
document.body.appendChild(playBtn);

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = 'Mute';
  } else {
    audio.pause();
    playBtn.textContent = 'Play Music';
  }
});

// Load model
const loader = new GLTFLoader();
loader.load('/CardNDice.glb', function(gltf) {
  const cat = gltf.scene;
  scene.add(cat);

  const box = new THREE.Box3().setFromObject(cat);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  camera.position.set(center.x, center.y, size.length() * 1.5);
  camera.lookAt(center);
  controls.target.copy(center);

}, undefined, function(error) {
  console.error(error);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});