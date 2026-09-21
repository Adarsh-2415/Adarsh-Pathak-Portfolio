import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { AmbientFallbackBackground } from './AmbientFallbackBackground'

interface Ambient3DBackgroundProps {
  isDimmed?: boolean
}

// Custom Vertex Shader with ultra-slow flowing wave harmonics
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormalVec;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Layered slow-drifting sinusoidal waves
    float wave1 = sin(pos.x * 0.45 + uTime * 0.35) * cos(pos.y * 0.35 + uTime * 0.28) * 0.75;
    float wave2 = sin(pos.x * 0.85 - uTime * 0.22 + pos.y * 0.6) * 0.35;
    float wave3 = cos((pos.x + pos.y) * 0.55 + uTime * 0.18) * 0.25;

    // Parallax displacement (subtle 2-5px normalized shift)
    float mouseInfluence = (sin(pos.x * 0.5 + uMouse.x) * uMouse.y) * 0.15;

    float elevation = wave1 + wave2 + wave3 + mouseInfluence;
    pos.z += elevation;

    vElevation = elevation;
    vNormalVec = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Custom Fragment Shader: Deep Mica slate palette with center readability suppression
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDimmed;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormalVec;

  void main() {
    // Distance from center of screen (0.0 at center, ~0.7 at corners)
    vec2 centeredUv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float distFromCenter = length(centeredUv);

    // Deep, restrained Windows 11-inspired slate palette
    vec3 colorDeepSlate = vec3(0.024, 0.035, 0.065); // #060911
    vec3 colorMidnight = vec3(0.045, 0.08, 0.16);   // #0b1429
    vec3 colorIndigo = vec3(0.08, 0.09, 0.22);     // #141738
    vec3 colorCyanAccent = vec3(0.22, 0.74, 0.97); // #38bdf8 (restrained highlight)

    // Base elevation gradient
    float t = smoothstep(-1.2, 1.4, vElevation);
    vec3 baseColor = mix(colorDeepSlate, colorMidnight, t);
    baseColor = mix(baseColor, colorIndigo, smoothstep(0.2, 0.9, t) * 0.6);

    // Subtle edge highlight along wave crests
    float crestGlow = smoothstep(0.45, 1.1, vElevation) * 0.14;
    baseColor += colorCyanAccent * crestGlow;

    // Center Readability Mask: Keep central 40% calm and dark for Sign-In text
    float centerCalmness = smoothstep(0.18, 0.68, distFromCenter);
    vec3 finalColor = mix(colorDeepSlate, baseColor, clamp(centerCalmness, 0.25, 1.0));

    // Outer edge soft vignette
    float edgeVignette = smoothstep(1.3, 0.45, distFromCenter);
    finalColor *= edgeVignette;

    // Dimming factor when workspace is sleeping or shutting down
    finalColor = mix(finalColor, vec3(0.012, 0.018, 0.03), uDimmed * 0.85);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export const Ambient3DBackground: React.FC<Ambient3DBackgroundProps> = ({ isDimmed = false }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasWebGL, setHasWebGL] = useState<boolean>(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false)

  // WebGL & Motion Preference Pre-check
  useEffect(() => {
    // Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas')
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) {
        setHasWebGL(false)
      }
    } catch {
      setHasWebGL(false)
    }

    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

  useEffect(() => {
    if (!hasWebGL || prefersReducedMotion) return
    const container = containerRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, -1.8, 6.5)
    camera.lookAt(0, 0.2, 0)

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false, // Performance: antialiasing not needed for soft procedural waves
        powerPreference: 'high-performance',
        alpha: false,
      })
    } catch {
      setHasWebGL(false)
      return
    }

    // DPR clamped to 1.5 for crisp performance across mobile and Retina laptops
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    // Curved wave geometry
    const geometry = new THREE.PlaneGeometry(16, 12, 72, 54)
    geometry.rotateX(-0.55)

    // Material Uniforms
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uDimmed: { value: isDimmed ? 1.0 : 0.0 },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      wireframe: false,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 0.2, 0)
    scene.add(mesh)

    // Mouse Parallax (subtle 2-5px displacement, disabled on touch/coarse pointers)
    const targetMouse = new THREE.Vector2(0, 0)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

    const handlePointerMove = (e: PointerEvent) => {
      if (isTouchDevice) return
      // Normalized between -0.5 and 0.5
      targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 0.4
      targetMouse.y = (e.clientY / window.innerHeight - 0.5) * 0.4
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    // Resize handling
    const handleResize = () => {
      if (!renderer) return
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      uniforms.uResolution.value.set(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Visibility-aware Render Loop (Pauses when tab is backgrounded)
    let animationFrameId: number
    let clock = new THREE.Clock()
    let isVisible = true

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible'
      if (isVisible) clock.start()
      else clock.stop()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible || !renderer) return

      const delta = clock.getDelta()
      // Ultra-slow smooth time advancement
      uniforms.uTime.value += delta * 0.65

      // Smooth mouse lerping
      uniforms.uMouse.value.lerp(targetMouse, 0.04)

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
        renderer.dispose()
      }
      geometry.dispose()
      material.dispose()
    }
  }, [hasWebGL, prefersReducedMotion])

  // Update dimming uniform smoothly
  useEffect(() => {
    // If fallback is used, fallback handles dimming via CSS
  }, [isDimmed])

  if (!hasWebGL || prefersReducedMotion) {
    return <AmbientFallbackBackground />
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Central vignette overlay to guarantee high-contrast legibility for text & UI cards */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.65)_100%)]" />

      {/* Dimmed state overlay for sleep or shutdown transitions */}
      <div
        className="absolute inset-0 bg-[#03050a] transition-opacity duration-700 ease-in-out z-10"
        style={{ opacity: isDimmed ? 0.92 : 0 }}
      />
    </div>
  )
}
