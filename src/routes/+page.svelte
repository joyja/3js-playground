<script lang="ts">
  import * as THREE from "three";
	import { onMount } from "svelte";

  onMount(() => {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    camera.position.z = 96
    const canvas = document.getElementById('threed')!
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
  })
</script>
<div>
  <canvas id="threed"></canvas>
</div>
