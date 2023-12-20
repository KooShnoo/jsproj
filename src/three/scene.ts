// preliminary work

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const three_container = document.getElementById('three')!;
const threeWidth = three_container.getBoundingClientRect().width;
const threeHeight = three_container.getBoundingClientRect().height;

window.addEventListener('resize', () => {
  const threeWidth = three_container.getBoundingClientRect().width;
  const threeHeight = three_container.getBoundingClientRect().height;
  camera.aspect = threeWidth / threeHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(threeWidth, threeHeight);
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, threeWidth / threeHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(threeWidth, threeHeight);
three_container.appendChild(renderer.domElement);


const glb = new GLTFLoader();
let pika = await glb.loadAsync('sableye.glb');
scene.add(pika.scene);
pika.scene.children[0].scale.setScalar(1);
const pikaMesh = scene.children[0].children[0].children[0];
// @ts-expect-error three isn't type-safe
pikaMesh.children.forEach((child) => child.material.metalness = 0);

// const mixer = new THREE.AnimationMixer(pika_scene);
// const action = mixer.clipAction(pika_scene.animations[0]);
// action.play();

const mixer = new THREE.AnimationMixer(pika.scene);
const action = mixer.clipAction(pika.animations[4]);
action.play();

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 3);
// light.position.setScalar(20);
scene.add(light);

camera.position.set(100, 50, 100);
camera.lookAt(0, 10, 0);

//@ts-expect-error modifying window
window.scene = scene;
//@ts-expect-error modifying window
window.camera = camera;
window.THREE = THREE;
//@ts-expect-error modifying window
window.mixer = mixer;
//@ts-expect-error modifying window
window.pika = pika;

const acts = pika.animations.map(anim => mixer.clipAction(anim));
export function dance() {
  mixer.stopAllAction();
  acts[5].play();
}

export function idle() {
  mixer.stopAllAction();
  acts[0].play();
}

export async function upgrade() {
  scene.remove(scene.children[0]);
  pika = await glb.loadAsync('pika.glb');
  scene.add(pika.scene);
  pika.scene.children[0].scale.setScalar(1);
  const pikaMesh = scene.children[1].children[0].children[0];
  // @ts-expect-error three isn't type-safe
  pikaMesh.children.forEach((child) => child.material.metalness = 0);
}

let frameTimestamp = 0;
function animate(timestamp: number) {
  pika.scene.rotation.y += .025;
  mixer.update((frameTimestamp - timestamp)/1000);
  
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  frameTimestamp = timestamp;
}
animate(0);
