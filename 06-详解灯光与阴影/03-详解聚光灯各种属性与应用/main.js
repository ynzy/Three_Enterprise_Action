import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const gui = new dat.GUI();

// 目标: 03-详解聚光灯各种属性与应用


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


// 添加一个球体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// 物体开启投射阴影
sphere.castShadow = true;
scene.add(sphere);

// 添加一个平面
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshStandardMaterial();
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 物体开启接收阴影 
plane.receiveShadow = true;
scene.add(plane);



// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
scene.add(ambientLight);
// 添加聚光灯
const spotLight = new THREE.SpotLight(0xffffff, 0.5);
spotLight.position.set(5, 5, 5);
// 开启阴影计算
spotLight.castShadow = true;
scene.add(spotLight);

// 设置阴影贴图模糊度
spotLight.shadow.radius = 20;
// 设置阴影贴图的分辨率
spotLight.shadow.mapSize.set(4096,4096);

// 将聚光灯的目标设置为sphere对象
spotLight.target = sphere;

// 设置聚光灯的角度为π/6
spotLight.angle = Math.PI / 6;

// 设置聚光灯的照射距离为0，表示没有限制
spotLight.distance = 0;

// 设置聚光灯的半影大小为0，表示没有半影效果
spotLight.penumbra = 0;

// 设置聚光灯的衰减因子为0，表示光强度不会随距离衰减
spotLight.decay = 0;

// 设置聚光灯的强度为1
spotLight.intensity = 1;

// 在图形用户界面（gui）中添加sphere位置的x轴控制项
// 允许用户在-5到5的范围内以0.1的步长调整sphere的位置
gui.add(sphere.position, "x").min(-5).max(5).step(0.1);

// 在gui中添加聚光灯角度的控制项
// 允许用户在0到π/2的范围内以0.01的步长调整聚光灯的角度
gui.add(spotLight, "angle").min(0).max(Math.PI / 2).step(0.01);

// 在gui中添加聚光灯照射距离的控制项
// 允许用户在0到10的范围内以0.01的步长调整聚光灯的照射距离
gui.add(spotLight, "distance").min(0).max(10).step(0.01);

// 在gui中添加聚光灯半影大小的控制项
// 允许用户在0到1的范围内以0.01的步长调整聚光灯的半影大小
gui.add(spotLight, "penumbra").min(0).max(1).step(0.01);

// 在gui中添加聚光灯衰减因子的控制项
// 允许用户在0到5的范围内以0.01的步长调整聚光灯的衰减因子
gui.add(spotLight, "decay").min(0).max(5).step(0.01);



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
