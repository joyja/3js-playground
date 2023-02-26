import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

class Threnvironment {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  canvas: HTMLElement
  renderer: THREE.Renderer
  ambientLight: THREE.AmbientLight
  spotLight: THREE.SpotLight
  controls: OrbitControls
  width:number
  height:number
  stats: Stats
	constructor(id:string) {
    this.scene = new THREE.Scene()
    this.canvas = document.getElementById(id)!
    this.width = window.innerWidth*2
    this.height = window.innerHeight*2
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.canvas.clientWidth / this.canvas.clientHeight,
      1,
      1000
    )
    this.camera.position.z = 360
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
   
    document.body.appendChild(this.renderer.domElement)
    
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight)

    this.spotLight = new THREE.SpotLight(0xffffff, 0.5)
    this.spotLight.castShadow = true
    this.spotLight.position.set(0, 50, 128)
    this.scene.add(this.spotLight)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.stats = Stats()
    document.body.appendChild(this.stats.dom)
	}
  animate(operation:Function) {
    const animate = () => {
      
      if (this.canvas.clientWidth !== this.width || this.canvas.clientHeight !== this.height) {
        this.camera.aspect = this.canvas.clientWidth/this.canvas.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.canvas.clientHeight*2, this.canvas.clientWidth*2, false)
        this.width = this.canvas.clientWidth
        this.height = this.canvas.clientHeight
        console.log('this happend')
      }
      operation()
      this.stats.update()
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
      window.requestAnimationFrame(animate)
    }
    animate()
  }
}

export {
  Threnvironment
}