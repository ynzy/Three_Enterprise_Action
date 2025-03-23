import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";
// 目标: 调用js接口控制画布全屏和退出全屏

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

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(geometry, material);
// 将几何体添加到场景中
scene.add(cube);
console.log(cube);

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

window.addEventListener("dblclick", () => {
  // 判断是否全屏
  if (document.fullscreenElement) {
    // 退出全屏
    document.exitFullscreen();
  } else {
    // 全屏
    document.body.requestFullscreen();
  }
})

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

const gui = new dat.GUI();

gui.add(cube.position, "x").min(0).max(5).step(0.01).name("x轴位置")
.onChange((value)=>{
  console.log('onChange',value)
})
.onFinishChange((value)=>{
  console.log('onFinishChange',value)
})

// 修改物体颜色
gui.addColor({color:0x00ff00},"color").name("物体颜色")
.onChange((value)=>{
  cube.material.color.set(value)
})


// 设置文件夹
const folder = gui.addFolder("设置立方体")
// 默认展开文件夹
folder.open()
// 设置物体是否显示
folder.add(cube,"visible").name("是否显示")
// 显示线框
folder.add(cube.material,"wireframe").name("显示线框")
// 设置按钮触发事件
folder.add({
  animate: null,
  moveTo(){
    if(this.animate && this.animate.isActive()){
      this.animate.kill()
    }
    this.animate = gsap.to(cube.position, {
      x: 5,
      duration: 5,
      ease: "power1.inOut",
      // 重复次数, -1表示无限循环
      repeat: 0,
    });
    return this.animate.isActive()
  }
},"moveTo").name("立方体移动").onFinishChange(()=>{
  cube.position.set(0,0,0)
})