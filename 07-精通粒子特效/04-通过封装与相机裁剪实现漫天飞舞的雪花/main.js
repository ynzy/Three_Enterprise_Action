import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const gui = new dat.GUI();

// 目标: 04-通过封装与相机裁剪实现漫天飞舞的雪花


// 创建场景
const scene = new THREE.Scene();
// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 0, 40);
// 将相机添加到场景中
scene.add(camera);
// 设置场景颜色
// scene.background = new THREE.Color(0xffffff);


// // 创建5000个随机顶点
// const particlesGeometry = new THREE.BufferGeometry();
// const count = 5000;
// const positions = new Float32Array(count * 3);
// // 设置顶点颜色
// const colors = new Float32Array(count * 3);
// for (let i = 0; i < count * 3; i++) {
//   positions[i] = (Math.random() - 0.5) * 100; // 设置点位范围 -50~50
//   colors[i] = Math.random();
// }
// particlesGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(positions, 3)
// );

// particlesGeometry.setAttribute(
//   "color",
//   new THREE.BufferAttribute(colors, 3)
// );

const options = {
  textureUrl: "../../assets/textures/particles/xh.png",
  size: 0.5,
}
function createSnowParticles(options) {
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 5000;
  const positions = new Float32Array(count * 3);
  // 设置顶点颜色
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100; // 设置点位范围 -50~50
    colors[i] = Math.random();
  }
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  particlesGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3)
  );

  const pointsMaterial = new THREE.PointsMaterial({
    // 黄色
    color: 0xfff000
  });
  pointsMaterial.size =options.size || 0.5;
  // pointsMaterial.sizeAttenuation = false
  
  // 加载纹理
  const textureLoader = new THREE.TextureLoader();
  // const texture = textureLoader.load("../../assets/textures/particles/xh.png");
  const texture = textureLoader.load(options.textureUrl);
  pointsMaterial.map = texture; // 纹理贴图
  pointsMaterial.alphaMap = texture; // 透明贴图
  pointsMaterial.transparent = true; // 开启透明
  pointsMaterial.depthWrite = false; // 禁止写入深度缓冲区
  pointsMaterial.blending  = THREE.AdditiveBlending; // 混合模式
  pointsMaterial.vertexColors = true; // 开启顶点颜色
  
  const points = new THREE.Points(particlesGeometry, pointsMaterial);
  scene.add(points);
  return points;
}



const points1 = createSnowParticles({
  textureUrl: "../../assets/textures/particles/xh.png",
  size: 0.5,
});
const points2 = createSnowParticles({
  textureUrl: "../../assets/textures/particles/zh.png",
  size: 0.3
});




// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果，必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const clock = new THREE.Clock();

// 循环渲染
function render() {
  const time = clock.getElapsedTime();
  points1.rotation.x = time * 0.3
  points2.rotation.x = time * 0.2
  controls.update();
  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}
render();


// 监听窗口变化,更新渲染器渲染的尺寸
window.addEventListener("resize", () => {
  // 更新渲染器大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
  // 更新相机的长宽比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();

});
