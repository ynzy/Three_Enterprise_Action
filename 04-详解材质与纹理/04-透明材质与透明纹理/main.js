import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";
// 目标: 05-环境遮挡贴图与强度

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
camera.position.set(0, 0, 10);
// 将相机添加到场景中
scene.add(camera);

// 导入纹理
const textureLoader = new THREE.TextureLoader();
const doorTexture = textureLoader.load("../../assets/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("../../assets/textures/door/alpha.jpg");

// 创建几何体
const geometry = new THREE.BoxGeometry();
// 创建材质
const material = new THREE.MeshBasicMaterial({ 
  color: "#ffff00",
  // 设置纹理
  map: doorTexture,
  // 设置透明材质
  alphaMap: doorAlphaTexture,
  // 设置透明
  transparent: true,
 });

const mesh = new THREE.Mesh(geometry, material);
// 将几何体添加到场景中
scene.add(mesh);

// 添加一个平面
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({
  // color: "#20d400",
  map: doorTexture,
  // 设置透明材质
  alphaMap: doorAlphaTexture,
  // 设置透明
  transparent: true,
  // 设置双面显示
  side: THREE.DoubleSide,
  // 设置透明度
  opacity: 0.5,
 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(3, 0, 0);
scene.add(plane);


// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
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

// 循环渲染
function render() {
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
