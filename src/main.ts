import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLElement;
if (!canvas) {
  throw new Error("No canvas found");
}

// Scene
const scene = new THREE.Scene();

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTextureObj: Record<number, THREE.Texture> = {};
for (let i = 1; i < 9; ++i) {
  matcapTextureObj[i] = textureLoader.load(`textures/matcaps/${i}.png`);
}

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // Material
  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTextureObj[1],
  });
  // Text
  const textGeometry = new TextGeometry("Hello Threejs", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  // just the same as center()
  textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox!.max.x + textGeometry.boundingBox!.min.x) / 2,
  //   -(textGeometry.boundingBox!.max.y + textGeometry.boundingBox!.min.y) / 2,
  //   -(textGeometry.boundingBox!.max.z + textGeometry.boundingBox!.min.z) / 2
  // );

  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  const wireFrame = new THREE.WireframeGeometry(textGeometry);
  const line = new THREE.LineSegments(wireFrame);
  // line.material.depthTest = false;
  // line.material.opacity = 0.9;
  // line.material.transparent = true;
  line.position.set(
    0,
    textGeometry.boundingBox!.max.y +
      (textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y) / 2,
    0
  );
  scene.add(line);

  gui.add(text, "visible").name("text visibility");
  gui.add(line, "visible").name("wireframe visibility");
  gui.add(material, "matcap", matcapTextureObj).name("matcap choices");

  // Donuts
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
// const clock = new THREE.Clock();

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
