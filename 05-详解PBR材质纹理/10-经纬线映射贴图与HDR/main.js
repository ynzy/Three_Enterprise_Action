import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";


// 目标: 08-纹理加载进度情况

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

var div = document.createElement("div");
div.style.width="200px"
div.style.height="100px"
div.style.position = "fixed";
div.style.top = "0px";
div.style.left = "0px";
div.style.color = "white";
document.body.appendChild(div);

// 设置加载管理器
const loadingManager = new THREE.LoadingManager(
  () => {
    console.log("所有纹理加载完成了");
  },
  (url, itemsLoaded, itemsTotal) => {
    console.log("纹理加载中...", url, itemsLoaded, itemsTotal);
    // 计算加载进度
    const progress = (itemsLoaded / itemsTotal) * 100;
    let value = `${progress.toFixed(2)}%`
    console.log(`加载进度: ${value}`);
    // div.appendChild(document.createTextNode(`加载进度: ${value}`));
    div.innerHTML = `加载进度: ${value}`;
  },
  (url) => {
    console.log("纹理加载失败了", url);
  }
);

const envMapName = {
  "街道": 0,
  "草原": 1,
  "街区": 2,
  "商场": 3,
}
const type = envMapName["草原"];

// 设置cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
const envMapTexture = cubeTextureLoader.load([
  `../../assets/textures/environmentMaps/${type}/px.jpg`,
  `../../assets/textures/environmentMaps/${type}/nx.jpg`,
  `../../assets/textures/environmentMaps/${type}/py.jpg`,
  `../../assets/textures/environmentMaps/${type}/ny.jpg`,
  `../../assets/textures/environmentMaps/${type}/pz.jpg`,
  `../../assets/textures/environmentMaps/${type}/nz.jpg`, 
])

// 创建一个球体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
// 创建标准网格材质
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.1,
  // envMap: envMapTexture,
});
// 创建一个球
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// 将球体添加到场景中
scene.add(sphere);


// 加载hdr环境图
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync("../../assets/textures/hdr/002.hdr").then((texture)=>{
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

// // 给场景所有物体添加默认的环境贴图
// scene.environment = envMapTexture;
// 给场景添加背景
// scene.background = envMapTexture;


// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
// 添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

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
