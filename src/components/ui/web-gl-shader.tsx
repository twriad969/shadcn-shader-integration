"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

function CSSFallback() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background">
        <div 
          className="absolute w-[200%] h-1 top-1/2 -left-1/2 bg-gradient-to-r from-transparent via-foreground/80 to-transparent blur-sm animate-wave"
          style={{ 
            animation: 'wave 3s ease-in-out infinite',
            boxShadow: '0 0 40px 20px hsl(var(--foreground) / 0.3)'
          }}
        />
        <div 
          className="absolute w-[200%] h-0.5 top-1/2 -left-1/2 bg-gradient-to-r from-transparent via-red-500/60 to-transparent blur-[2px]"
          style={{ 
            animation: 'wave 3s ease-in-out infinite',
            animationDelay: '-0.05s',
            transform: 'translateY(-2px)'
          }}
        />
        <div 
          className="absolute w-[200%] h-0.5 top-1/2 -left-1/2 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent blur-[2px]"
          style={{ 
            animation: 'wave 3s ease-in-out infinite',
            animationDelay: '0.05s',
            transform: 'translateY(2px)'
          }}
        />
      </div>
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-10%) scaleY(1.5); }
        }
      `}</style>
    </div>
  )
}

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglSupported, setWebglSupported] = useState(true)
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
    if (!canvasRef.current) return

    // Check WebGL support first
    const testCanvas = document.createElement('canvas')
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
    if (!gl) {
      setWebglSupported(false)
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
        refs.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
        console.warn('WebGL initialization failed, using fallback', e)
        setWebglSupported(false)
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
  }, [])

  if (!webglSupported) {
    return <CSSFallback />
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block"
    />
  )
}
