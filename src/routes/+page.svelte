<script lang="ts">
  import * as THREE from "three"
	import { onMount } from "svelte"
  import { Threnvironment } from '$lib/threnvironment'
  import { Font } from 'three/examples/jsm/loaders/FontLoader'
  import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js'
  import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
  import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
	import { BoxGeometry } from "three";
  import { CSG } from 'three-csg-ts';
	import { Nameplate } from "$lib/nameplate";

  let threnv:Threnvironment
  let link:HTMLAnchorElement
  let nameplateText:string = 'James'
  let nameplateColor:string = 'lightBlue'
  let nameplate:Nameplate
  const exporter = new STLExporter()

  $: setNameplateText(nameplateText)
  $: setNameplateColor(nameplateColor)

  function setNameplateText(content:string) {
    if (nameplate) {
      nameplate.setTextContent(content)
    }
  }

  function setNameplateColor(content:string) {
    if (nameplate) {
      nameplate.setColor(content)
    }
  }

  function saveASCII() {
    const text = exporter.parse(threnv.scene)
    const blob = new Blob( [ text ], { type: 'text/plain' } )
    link.href = URL.createObjectURL( blob );
    link.download = 'James.stl';
    link.click()
  }

  onMount(() => {
    link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link );
    
    threnv = new Threnvironment("threed")
    nameplate = new Nameplate(threnv, 'James', 'PermanentMarker', '0x8200E5')
        
    threnv.animate(() => {
      // mesh.rotation.x += 0.01
      // mesh.rotation.y += 0.01
    })
  })
</script>

<div>
  <div class="controls">
    <div style="text-align: center">Configuration</div>
    <label for="text">Text</label>
    <input type="text" id="text" name="text" bind:value={nameplateText}/>
    <label for="color"></label>
    <input type="dropdown" id="color" name="color" bind:value={nameplateColor}>
    <button class="button--exportstl" on:click={saveASCII} id="exportstl">Export STL</button>
  </div>
  
  <canvas id="threed" style="height: 100vh; width: 100vw; overflow:hidden;"></canvas>
</div>

<style>
:global(body) { 
  margin: 0;
  overflow: hidden;
}
.controls {
  border-radius: 5px;
  background-color: gainsboro;
  font-family: sans-serif;
  position: absolute;
  right: 0;
  z-index: 20;
  margin: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
.button--exportstl {
  color: black;
}
</style>
