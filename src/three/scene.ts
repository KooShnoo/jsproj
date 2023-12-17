// preliminary work

import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
const threeContainer = document.getElementById('three');
if(!threeContainer) throw new Error("No container for three.js!");
threeContainer.appendChild(renderer.domElement);

const fbx = new FBXLoader;
const pikaScene = await fbx.loadAsync('pika/pikaRun.fbx');
scene.add(pikaScene);
scene.getObjectByName('Armature')?.scale.setScalar(.5);

const mixer = new THREE.AnimationMixer(pikaScene);
const action = mixer.clipAction(pikaScene.animations[0]);
action.play();


const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 15);
scene.add(light);

camera.position.set(200, 50, 200);
camera.lookAt(0, 10, 0);
// window.scene = scene;
// window.camera = camera;
// window.THREE = THREE;

let frameTimestamp = 0;
function animate(timestamp: number) {
  mixer.update((frameTimestamp - timestamp)/2000);
  
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  frameTimestamp = timestamp;
}
animate(0);
