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
async function loadModel(modelPath: string) {
  const model = await glb.loadAsync(modelPath);
  scene.add(model.scene);
  model.scene.children[0].scale.setScalar(1);
  const modelMesh = scene.children[0].children[0].children[0];
  // @ts-expect-error three isn't type-safe
  modelMesh.children.forEach((child) => child.material.metalness = 0);
  model.scene.visible = false;
  return model;
}



const pika = await loadModel('pika.glb');
pika.scene.visible = true;
const sable = await loadModel('sableye.glb');

const pikaMixer = new THREE.AnimationMixer(pika.scene);
const sableMixer = new THREE.AnimationMixer(sable.scene);
const action = pikaMixer.clipAction(pika.animations[4]);
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
// //@ts-expect-error modifying window
// window.mixer = mixer;
//@ts-expect-error modifying window
window.pika = pika;

const pikaActs = pika.animations.map(anim => pikaMixer.clipAction(anim));
const sableActs = sable.animations.map(anim => pikaMixer.clipAction(anim));

let level = 0;
export async function upgrade() {
  switch (level) {
  case 0: {
    pikaMixer.stopAllAction();
    pikaActs[0].play();
    break;
  }
  case 1: {
    pikaMixer.stopAllAction();
    pikaActs[3].play();
    break;
  }
  case 2: {
    pika.scene.visible = false;
    sable.scene.visible = true;
    sableMixer.stopAllAction();
    sableActs[0].play();
    break;
  }
  }
  level++;
}

export function dance() {
  if  (level < 2 ) {
    pikaMixer.stopAllAction();
    pikaActs[5].play();
  } else {
    sableMixer.stopAllAction();
    sableActs[5].play();
  }
}

export function idle() {
  if  (level < 2 ) {
    pikaMixer.stopAllAction();
    pikaActs[0].play();
  } else {
    sableMixer.stopAllAction();
    sableActs[0].play();
  }
}

let frameTimestamp = 0;
function animate(timestamp: number) {
  pika.scene.rotation.y += .025;
  pikaMixer.update((frameTimestamp - timestamp)/1000);
  sableMixer.update((frameTimestamp - timestamp)/1000);
  
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  frameTimestamp = timestamp;
}
animate(0);
