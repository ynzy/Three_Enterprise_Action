import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const gui = new dat.GUI();

// 目标: 05-运用数学知识打造复杂形状臂旋星系01


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
// 设置场景颜色
// scene.background = new THREE.Color(0xffffff);


// 加载纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("../../assets/textures/particles/1.png");

const params = {
  count: 10000, // 点的数量
  size: 0.1, // 点的大小
  radius: 5, // 半径
  branch: 5, // 分支数
  startColor: "#ff6030", // 起点颜色
  endColor: "#1b3984", // 终点颜色
  rotateScale: 0.5, // 弯曲成都
  rotateSpeed: 0.5, // 旋转速度
}

let geometry = null
let material = null
let points = null
const generateGalaxy = () => {
  geometry = new THREE.BufferGeometry();
  // 设置顶点
  const positions = new Float32Array(params.count * 3);
  // 设置顶点颜色
  const colors = new Float32Array(params.count * 3);
  const startColor = new THREE.Color(params.startColor);
  const endColor = new THREE.Color(params.endColor);
  // 循环生成点和颜色
  for (let i = 0; i < params.count; i++) {
    // 计算当前点的角度 = 当前的点在哪一条分支上 * 2π / 分支数
    const branchAngle = (i % params.branch) * ((Math.PI * 2) / params.branch);
    // 当前点距离圆心的距离,越靠近0越密集，越靠近1越稀疏
    const distance =Math.random() * params.radius * Math.pow(Math.random(), 3);
    const cur = i * 3;
    // 随机xyz位置,越靠近0越密集，越靠近1越稀疏 
    const randomX = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) /5;
    const randomY = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) /5;
    const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) /5;


    // const randomX = (Math.pow(Math.random() * 2 - 1, 3) * (distance)) /5;
    // const randomY = (Math.pow(Math.random() * 2 - 1, 3) * (distance)) /5;
    // const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (distance)) /5;

    // 随机生成点
    positions[cur] = Math.cos(branchAngle + distance * params.rotateScale) * distance + randomX; // 随机生成点的x坐标 = cos(当前点的角度 + 当前点距离圆心的距离 * 弯曲程度) * 当前点距离圆心的距离 + 随机数
    positions[cur + 1] = 0 + randomY;  // 随机生成点的y坐标
    positions[cur + 2] = Math.sin(branchAngle + distance * params.rotateScale) * distance + randomZ;  // 随机生成点的z坐标

    // 混合颜色形成渐变色
    const mixedColor = startColor.clone();
    mixedColor.lerp(endColor, distance / params.radius);
    colors[cur] = mixedColor.r; // 设置点的颜色
    colors[cur+1] = mixedColor.g; // 设置点的颜色
    colors[cur+2] = mixedColor.b; // 设置点的颜色
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // 设置点材质
  material = new THREE.PointsMaterial({
    size: params.size,
    // color: new THREE.Color(params.startColor),
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    map: texture,
    alphaMap: texture,
    transparent: true,
  });
  points = new THREE.Points(geometry, material);
  scene.add(points);
}


generateGalaxy()




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
  points.rotation.y = time * params.rotateSpeed
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
