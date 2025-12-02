"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

// Canvas2D fallback that mimics the WebGL chromatic wave effect
function Canvas2DFallback() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const animate = () => {
      if (!ctx || !canvas) return
      
      const width = canvas.width
      const height = canvas.height
      
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      const centerY = height / 2
      time += 0.01

      // Draw the chromatic aberration wave effect
      for (let x = 0; x < width; x++) {
        const normalizedX = (x / width) * 2 - 1
        const distortion = 0.05

        // Calculate wave positions with chromatic aberration
        const baseWave = Math.sin((normalizedX + time) * 1.0) * 0.5
        const rWave = Math.sin((normalizedX * (1 + distortion * Math.abs(normalizedX)) + time) * 1.0) * 0.5
        const bWave = Math.sin((normalizedX * (1 - distortion * Math.abs(normalizedX)) + time) * 1.0) * 0.5

        const yR = centerY + rWave * height * 0.3
        const yG = centerY + baseWave * height * 0.3
        const yB = centerY + bWave * height * 0.3

        // Draw glowing lines
        const drawGlow = (y: number, color: string, intensity: number) => {
          for (let spread = 30; spread > 0; spread--) {
            const alpha = (intensity / spread) * 0.8
            ctx.fillStyle = color.replace('1)', `${alpha})`)
            ctx.fillRect(x, y - spread, 1, spread * 2)
          }
        }

        drawGlow(yR, 'rgba(255, 50, 50, 1)', 1)
        drawGlow(yG, 'rgba(255, 255, 255, 1)', 1.2)
        drawGlow(yB, 'rgba(50, 50, 255, 1)', 1)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block"
    />
  )
}

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [useFallback, setUseFallback] = useState(false)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: any
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    if (!canvasRef.current || useFallback) return

    // Check WebGL support
    const testCanvas = document.createElement('canvas')
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
    if (!gl) {
      setUseFallback(true)
      return
    }

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        float d = length(p) * distortion;
        
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
        
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `

    const initScene = () => {
      try {
        refs.scene = new THREE.Scene()
        refs.renderer = new THREE.WebGLRenderer({ canvas })
        refs.renderer.setPixelRatio(window.devicePixelRatio)
        refs.renderer.setClearColor(new THREE.Color(0x000000))

        refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

        refs.uniforms = {
          resolution: { value: [window.innerWidth, window.innerHeight] },
          time: { value: 0.0 },
          xScale: { value: 1.0 },
          yScale: { value: 0.5 },
          distortion: { value: 0.05 },
        }

        const position = [
          -1.0, -1.0, 0.0,
           1.0, -1.0, 0.0,
          -1.0,  1.0, 0.0,
           1.0, -1.0, 0.0,
          -1.0,  1.0, 0.0,
           1.0,  1.0, 0.0,
        ]

        const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute("position", positions)

        const material = new THREE.RawShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: refs.uniforms,
          side: THREE.DoubleSide,
        })

        refs.mesh = new THREE.Mesh(geometry, material)
        refs.scene.add(refs.mesh)

        handleResize()
        return true
      } catch (e) {
        console.warn('WebGL failed, using Canvas2D fallback')
        setUseFallback(true)
        return false
      }
    }

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.01
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    const success = initScene()
    if (success) {
      animate()
      window.addEventListener("resize", handleResize)
    }

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [useFallback])

  if (useFallback) {
    return <Canvas2DFallback />
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block"
    />
  )
}
