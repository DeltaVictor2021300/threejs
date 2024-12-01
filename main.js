import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

camera.position.x = -170;
camera.position.y = 70;
camera.position.z = 200;
camera.rotation.y = 60 * Math.PI / 180;

/*
const texLoader = new THREE.TextureLoader();
texLoader.load('/textures/ffca18a6-9079-4cd9-9555-faac81d603b5.jpg' , function(texture)
            {
            	scene.background = texture;  
            });
*/

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );


const loader = new GLTFLoader();

loader.load( '/models/lowpoly_stylized_rx-7_free.glb', function ( gltf ) {
	gltf.scene.scale.set(3, 3, 3);
	gltf.scene.position.set(-180, 64, 200)
	gltf.scene.rotation.y = 0.1;
	gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
	scene.add( gltf.scene );
    console.log("loaded")
}, undefined, function ( error ) {
	console.error( error );
} );

loader.load( '/models/cybercity_2099_v2/scene.gltf', function ( gltf ) {
	gltf.scene.scale.set(0.01, 0.01, 0.01);
	gltf.scene.position.set(-300, 0, 0)
	gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
	scene.add( gltf.scene );
    console.log("loaded")
}, undefined, function ( error ) {
	console.error( error );
} );

var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const light_2 = new THREE.DirectionalLight(0xCBC3E3);
light_2.position.set(2, 2, 0);
light_2.intensity = 0.5;
light_2.castShadow = true;
light_2.shadow.mapSize.width = 2048;
light_2.shadow.mapSize.height = 1024;
light_2.shadow.camera.near = 0.5;
light_2.shadow.camera.far = 1000;
light_2.shadow.camera.left = -1000;
light_2.shadow.camera.right = 1000;
light_2.shadow.camera.top = 1000;
light_2.shadow.camera.bottom = -1000;
scene.add(light_2);

const headlightR = new THREE.AmbientLight(0xFFFFFF);
headlightR.position.set(-180, 64, 200);
headlightR.intensity = 0.01;
scene.add(headlightR);

const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = 0;
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const fps = new FirstPersonControls(camera, renderer.domElement);

let materialArray = []
let texture_ft = new THREE.TextureLoader().load('/textures/front.png');
let texture_bk = new THREE.TextureLoader().load('/textures/back.png');
let texture_up = new THREE.TextureLoader().load('/textures/up.png');
let texture_dn = new THREE.TextureLoader().load('/textures/down.png');
let texture_rt = new THREE.TextureLoader().load('/textures/right.png');
let texture_lf = new THREE.TextureLoader().load('/textures/left.png');

materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}));

for(let i=0;i<6;i++){
	materialArray[i].side = THREE.BackSide;
}

let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);

function animate() {
    fps.update(1.0);
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );