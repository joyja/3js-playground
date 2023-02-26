import type { BoxGeometry, ExtrudeGeometry, Mesh, MeshPhysicalMaterial, Shape } from "three";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import type { Threnvironment } from "./threnvironment";

interface Nameplate {
  threnv:Threnvironment
  text:NameplateText
  base:NameplateBase
  material: MeshPhysicalMaterial
}

interface NameplateText {
  font: Font | null
  geo: TextGeometry | null
  mesh: Mesh | null
  content:string
}

interface NameplateBase {
  shape: Shape | null
  geo: ExtrudeGeometry | null
  mesh: Mesh | null
}

class Nameplate {
  constructor(threnv:Threnvironment, text:string, font:string, color:string) {
    this.text = {
      content: text,
      font: null,
      geo: null,
      mesh: null
    }
    this.base = {
      shape: null,
      geo: null,
      mesh: null
    }
    this.threnv = threnv
    this.initialize(font, color)
  }
  async initialize(font:string, color:string) {
    this.text.font = await this.getFont(font)
    this.material = new THREE.MeshPhysicalMaterial({ color: 0x8200E5 })
    this.getText()
    this.getBase()
    this.addToScene()
  }
  getFont(font:string){
    const loader = new TTFLoader()
    return new Promise<Font>((resolve) => {
      loader.load(
        `/${font}.ttf`,
        (json) => {
          resolve(new Font(json))
        }
      )
    })
  }
  getText() {
    this.getTextGeometry()
    this.getTextMesh()
  }
  getBase() {
    this.getBaseShape()
    this.getBaseGeometry()
    this.getBaseMesh()
  }
  getTextGeometry() {
    this.text.geo = new TextGeometry( this.text.content, {
      font: this.text.font!,
      size: 25.4,
      height: 12.7,
      bevelThickness: 1
    })  
  }
  getTextMesh() {
    this.text.geo!.computeBoundingBox()
    const centerOffset = - 0.5 * ( this.text.geo!.boundingBox!.max.x - this.text.geo!.boundingBox!.min.x )
    this.text.mesh = new THREE.Mesh( this.text.geo!, this.material );
    this.text.mesh.position.set(centerOffset, 5.35, 0)
  }
  getBaseShape() {
    this.base.shape = new THREE.Shape()
    let height = 7.35, width = this.text.geo!.boundingBox!.max.x - this.text.geo!.boundingBox!.min.x + 5, depth = 25.4
    let radius = 1
    this.base.shape.absarc( radius, radius, radius, -Math.PI / 2, -Math.PI, true )
    this.base.shape.absarc( radius, height -  radius * 2, radius, Math.PI, Math.PI / 2, true )
    this.base.shape.absarc( width - radius * 2, height -  radius * 2, radius, Math.PI / 2, 0, true )
    this.base.shape.absarc( width - radius * 2, radius, radius, 0, -Math.PI / 2, true )
  }
  getBaseGeometry() {
    const extrudeSettings = { depth: 25.4, bevelEnabled: false, steps: 1 }
    this.base.geo = new THREE.ExtrudeGeometry( this.base.shape!, extrudeSettings )
    this.base.geo.computeBoundingBox()
  }
  getBaseMesh() {
    this.base.mesh = new THREE.Mesh( this.base.geo!, this.material)
    const baseCenterOffset = - 0.5 * ( this.base.geo!.boundingBox!.max.x - this.base.geo!.boundingBox!.min.x )
    this.base.mesh.position.set( baseCenterOffset ,0,0)
  }
  addToScene() {
    this.threnv.scene.add(this.text.mesh!)
    this.threnv.scene.add(this.base.mesh!)
  }
  removeFromScene() {
    this.threnv.scene.remove(this.text.mesh!)
    this.threnv.scene.remove(this.base.mesh!)
  }
  setTextContent(content:string) {
    this.removeFromScene()
    this.text.geo!.dispose()
    this.text.content = content
    this.base.geo!.dispose()
    this.getText()
    this.getBase()
    this.addToScene()
  }
  setColor(color:string) {
    this.material.color.set(color)
  }
}

export {
  Nameplate
}