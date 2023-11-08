import * as THREE from './three.min.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer(
  { canvas: document.querySelector('#bg') }
);

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.z = 50;


//LIGHTS
const pointLight = new THREE.PointLight(0xFFFFFF, 1000, 1000);
pointLight.position.set(0, 0, 50)

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1)

scene.add(pointLight);
scene.add(ambientLight);

//HELPERS
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
const axesHelper = new THREE.AxesHelper(20, 20, 20);
scene.add(lightHelper, gridHelper, axesHelper);

const geoPog = new THREE.CylinderGeometry(41.37, 41.37, 6, 32);
const texturePog = new THREE.TextureLoader().load('eevee.png');
const matPog = new THREE.MeshStandardMaterial(
  {
    color: 0xFFFFFF,
    wireframe: false,
    map: texturePog
  }
);
const pog = new THREE.Mesh( geoPog, matPog );
pog.rotation.x = 45;

scene.add(pog);

const controls = new OrbitControls(camera, renderer.domElement);

function animate(time) {
  requestAnimationFrame( animate );

  // pog.rotation.y += 0.01;
  pog.rotation.x += 0.01;
  pog.rotation.y += 0.005;
  pog.rotation.z += 0.01;

  controls.update();

  renderer.render( scene, camera );
}

animate();