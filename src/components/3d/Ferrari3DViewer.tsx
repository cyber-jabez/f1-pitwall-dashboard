import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RotateCcw, Lightbulb, Wind, Eye, Compass, Zap } from 'lucide-react'

export type ManettinoMode = 'wet' | 'sport' | 'race' | 'ct_off' | 'esc_off'

export interface CarConfig {
  paintColor: string
  paintName: string
  caliperColor: string
  caliperName: string
  rimStyle: 'forged' | 'carbon' | 'diamond'
  livery: 'none' | 'tricolore' | 'giallo' | 'carbon'
  headlightsOn: boolean
  activeAero: boolean
  autoRotate: boolean
  viewMode?: 'exterior' | 'cockpit'
  manettino?: ManettinoMode
}

interface Ferrari3DViewerProps {
  config: CarConfig
  onConfigChange: (config: CarConfig) => void
}

export const Ferrari3DViewer: React.FC<Ferrari3DViewerProps> = ({ config, onConfigChange }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const carBodyMeshRef = useRef<THREE.Mesh | null>(null)
  const wingMeshRef = useRef<THREE.Group | null>(null)
  const caliperMeshesRef = useRef<THREE.Mesh[]>([])
  const headlightsRef = useRef<THREE.SpotLight[]>([])

  const isDraggingRef = useRef(false)
  const prevMouseRef = useRef({ x: 0, y: 0 })
  const sphericalRef = useRef({ radius: 7.2, theta: 0.9, phi: 1.15 })

  const viewMode = config.viewMode || 'exterior'
  const manettino = config.manettino || 'race'

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.fog = new THREE.FogExp2('#070709', 0.025)

    // Camera
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(4.8, 2.2, 5.2)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.8)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.8)
    keyLight.position.set(5, 8, 5)
    keyLight.castShadow = true
    scene.add(keyLight)

    const redRimLight = new THREE.DirectionalLight('#FF2800', 3.2)
    redRimLight.position.set(-6, 4, -5)
    scene.add(redRimLight)

    const yellowAccentLight = new THREE.DirectionalLight('#FED500', 2.0)
    yellowAccentLight.position.set(6, 3, -6)
    scene.add(yellowAccentLight)

    // Turntable Ground
    const floorGeo = new THREE.CircleGeometry(7.5, 64)
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#0A0B0E',
      roughness: 0.3,
      metalness: 0.8
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Glowing Ring
    const ringGeo = new THREE.RingGeometry(4.2, 4.25, 64)
    const ringMat = new THREE.MeshBasicMaterial({ color: '#FF2800', side: THREE.DoubleSide })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.005
    scene.add(ring)

    // Car Root
    const carRoot = new THREE.Group()
    scene.add(carRoot)

    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.paintColor),
      metalness: 0.85,
      roughness: 0.15
    })

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: '#111215',
      roughness: 0.4,
      metalness: 0.7
    })

    const glassMaterial = new THREE.MeshStandardMaterial({
      color: '#0A0E17',
      metalness: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.85
    })

    const caliperMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.caliperColor),
      metalness: 0.7,
      roughness: 0.2
    })

    // Fuselage
    const bodyGeo = new THREE.BoxGeometry(1.9, 0.45, 4.3, 16, 8, 32)
    const pos = bodyGeo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i)
      const y = pos.getY(i)
      const x = pos.getX(i)

      if (z > 0.5) {
        pos.setY(i, y * (1 - (z - 0.5) * 0.35) - 0.08)
        pos.setX(i, x * (1 - (z - 0.5) * 0.15))
      }
      if (z < -0.8) {
        pos.setX(i, x * (1 - Math.abs(z + 0.8) * 0.12))
      }
    }
    bodyGeo.computeVertexNormals()

    const carBody = new THREE.Mesh(bodyGeo, bodyMaterial)
    carBody.position.y = 0.55
    carBody.castShadow = true
    carBody.receiveShadow = true
    carRoot.add(carBody)
    carBodyMeshRef.current = carBody

    // Cockpit Canopy
    const canopyGeo = new THREE.ConeGeometry(0.85, 1.8, 16)
    canopyGeo.rotateX(Math.PI / 2)
    canopyGeo.scale(1.1, 0.45, 1.4)
    const canopy = new THREE.Mesh(canopyGeo, glassMaterial)
    canopy.position.set(0, 0.85, -0.15)
    carRoot.add(canopy)

    // Cockpit Interior Elements (Steering wheel, halo, dashboard)
    const cockpitGroup = new THREE.Group()
    cockpitGroup.position.set(0, 0.75, 0.1)

    // Carbon Steering Wheel
    const wheelTorus = new THREE.TorusGeometry(0.18, 0.025, 12, 24)
    const steerMat = new THREE.MeshStandardMaterial({ color: '#181A22', roughness: 0.3 })
    const steerMesh = new THREE.Mesh(wheelTorus, steerMat)
    steerMesh.position.set(0, 0.02, 0.28)
    cockpitGroup.add(steerMesh)

    // Steering Wheel LED Bar
    const ledBarGeo = new THREE.BoxGeometry(0.14, 0.015, 0.02)
    const ledBarMat = new THREE.MeshStandardMaterial({
      color: manettino === 'race' ? '#FF2800' : '#FED500',
      emissive: manettino === 'race' ? '#FF2800' : '#FED500',
      emissiveIntensity: 2.0
    })
    const ledBar = new THREE.Mesh(ledBarGeo, ledBarMat)
    ledBar.position.set(0, 0.18, 0.28)
    cockpitGroup.add(ledBar)

    carRoot.add(cockpitGroup)

    // Splitter
    const splitterGeo = new THREE.BoxGeometry(2.05, 0.06, 0.7)
    const splitter = new THREE.Mesh(splitterGeo, carbonMaterial)
    splitter.position.set(0, 0.22, 2.15)
    splitter.castShadow = true
    carRoot.add(splitter)

    // Skirts
    const skirtGeo = new THREE.BoxGeometry(0.12, 0.12, 2.6)
    const skirtL = new THREE.Mesh(skirtGeo, carbonMaterial)
    skirtL.position.set(1.02, 0.24, 0)
    const skirtR = skirtL.clone()
    skirtR.position.x = -1.02
    carRoot.add(skirtL, skirtR)

    // Diffuser
    const diffuserGeo = new THREE.BoxGeometry(1.85, 0.18, 0.8)
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMaterial)
    diffuser.position.set(0, 0.26, -2.15)
    diffuser.rotation.x = -0.15
    carRoot.add(diffuser)

    // Exhausts
    const exhaustGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16)
    exhaustGeo.rotateX(Math.PI / 2)
    const exhaustMat = new THREE.MeshStandardMaterial({
      color: '#3A4250',
      metalness: 0.95,
      roughness: 0.1
    })
    const exhaustL = new THREE.Mesh(exhaustGeo, exhaustMat)
    exhaustL.position.set(0.24, 0.55, -2.2)
    const exhaustR = exhaustL.clone()
    exhaustR.position.x = -0.24
    carRoot.add(exhaustL, exhaustR)

    // Active Aero Rear Wing
    const wingGroup = new THREE.Group()
    wingGroup.position.set(0, 0.82, -1.95)

    const wingBladeGeo = new THREE.BoxGeometry(1.9, 0.04, 0.42)
    const wingBlade = new THREE.Mesh(wingBladeGeo, carbonMaterial)
    wingBlade.castShadow = true
    wingGroup.add(wingBlade)

    const pylonGeo = new THREE.BoxGeometry(0.05, 0.28, 0.25)
    const pylonL = new THREE.Mesh(pylonGeo, carbonMaterial)
    pylonL.position.set(0.55, -0.14, 0)
    const pylonR = pylonL.clone()
    pylonR.position.x = -0.55
    wingGroup.add(pylonL, pylonR)

    carRoot.add(wingGroup)
    wingMeshRef.current = wingGroup

    // Headlights
    const headlightGeo = new THREE.BoxGeometry(0.35, 0.08, 0.2)
    const headlightMat = new THREE.MeshStandardMaterial({
      color: config.headlightsOn ? '#E6F0FF' : '#555',
      emissive: config.headlightsOn ? '#E6F0FF' : '#000',
      emissiveIntensity: config.headlightsOn ? 2.5 : 0
    })
    const headlightL = new THREE.Mesh(headlightGeo, headlightMat)
    headlightL.position.set(0.68, 0.54, 1.85)
    headlightL.rotation.y = 0.25
    const headlightR = headlightL.clone()
    headlightR.position.x = -0.68
    headlightR.rotation.y = -0.25
    carRoot.add(headlightL, headlightR)

    const spotL = new THREE.SpotLight('#FFF', config.headlightsOn ? 4.5 : 0, 15, Math.PI / 6, 0.4)
    spotL.position.set(0.68, 0.54, 1.9)
    spotL.target.position.set(0.68, 0.1, 7)
    scene.add(spotL)
    scene.add(spotL.target)

    const spotR = new THREE.SpotLight('#FFF', config.headlightsOn ? 4.5 : 0, 15, Math.PI / 6, 0.4)
    spotR.position.set(-0.68, 0.54, 1.9)
    spotR.target.position.set(-0.68, 0.1, 7)
    scene.add(spotR)
    scene.add(spotR.target)
    headlightsRef.current = [spotL, spotR]

    // Wheels & Calipers
    caliperMeshesRef.current = []
    const wheelPositions = [
      { x: 1.0, y: 0.38, z: 1.35 },
      { x: -1.0, y: 0.38, z: 1.35 },
      { x: 1.03, y: 0.40, z: -1.35 },
      { x: -1.03, y: 0.40, z: -1.35 }
    ]

    wheelPositions.forEach(p => {
      const wheelGroup = new THREE.Group()
      wheelGroup.position.set(p.x, p.y, p.z)

      const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 32)
      tireGeo.rotateZ(Math.PI / 2)
      const tireMat = new THREE.MeshStandardMaterial({
        color: '#161719',
        roughness: 0.85,
        metalness: 0.1
      })
      const tire = new THREE.Mesh(tireGeo, tireMat)
      wheelGroup.add(tire)

      const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.282, 16)
      rimGeo.rotateZ(Math.PI / 2)
      const rimMat = new THREE.MeshStandardMaterial({
        color: config.rimStyle === 'carbon' ? '#181A20' : config.rimStyle === 'diamond' ? '#D8E0EC' : '#2A2E38',
        metalness: config.rimStyle === 'diamond' ? 0.95 : 0.7,
        roughness: 0.2
      })
      const rim = new THREE.Mesh(rimGeo, rimMat)
      wheelGroup.add(rim)

      const caliperGeo = new THREE.BoxGeometry(0.08, 0.16, 0.12)
      const caliper = new THREE.Mesh(caliperGeo, caliperMaterial)
      caliper.position.set(p.x > 0 ? 0.06 : -0.06, 0.12, 0.05)
      wheelGroup.add(caliper)
      caliperMeshesRef.current.push(caliper)

      carRoot.add(wheelGroup)
    })

    // Mouse Drag & Wheel Orbit handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      prevMouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const dx = e.clientX - prevMouseRef.current.x
      const dy = e.clientY - prevMouseRef.current.y
      prevMouseRef.current = { x: e.clientX, y: e.clientY }

      sphericalRef.current.theta -= dx * 0.007
      sphericalRef.current.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, sphericalRef.current.phi - dy * 0.007))
    }

    const onMouseUp = () => {
      isDraggingRef.current = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      sphericalRef.current.radius = Math.max(3.8, Math.min(10.5, sphericalRef.current.radius + e.deltaY * 0.005))
    }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    container.addEventListener('wheel', onWheel, { passive: false })

    // Animation Loop
    let animId = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)

      if (viewMode === 'cockpit') {
        // Cockpit POV view
        camera.position.set(0, 0.88, 0.1)
        camera.lookAt(0, 0.72, 3.0)
      } else {
        // Exterior Orbit view
        if (config.autoRotate && !isDraggingRef.current) {
          sphericalRef.current.theta += 0.004
        }
        const { radius, theta, phi } = sphericalRef.current
        camera.position.x = radius * Math.sin(phi) * Math.sin(theta)
        camera.position.y = radius * Math.cos(phi)
        camera.position.z = radius * Math.sin(phi) * Math.cos(theta)
        camera.lookAt(0, 0.45, 0)
      }

      // Active aero smooth pitch animation
      if (wingMeshRef.current) {
        const targetRot = config.activeAero ? 0.22 : 0
        const targetY = config.activeAero ? 0.95 : 0.82
        wingMeshRef.current.rotation.x += (targetRot - wingMeshRef.current.rotation.x) * 0.1
        wingMeshRef.current.position.y += (targetY - wingMeshRef.current.position.y) * 0.1
      }

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('wheel', onWheel)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [viewMode, manettino])

  useEffect(() => {
    if (carBodyMeshRef.current) {
      const mat = carBodyMeshRef.current.material as THREE.MeshStandardMaterial
      mat.color.set(config.paintColor)
    }
  }, [config.paintColor])

  useEffect(() => {
    caliperMeshesRef.current.forEach(c => {
      const mat = c.material as THREE.MeshStandardMaterial
      mat.color.set(config.caliperColor)
    })
  }, [config.caliperColor])

  useEffect(() => {
    headlightsRef.current.forEach(light => {
      light.intensity = config.headlightsOn ? 4.5 : 0
    })
  }, [config.headlightsOn])

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] rounded-2xl overflow-hidden border border-ferrari-border/60 bg-gradient-to-b from-[#0D0E14] via-[#070709] to-[#040406] shadow-2xl">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Controls HUD */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-ferrari-dark/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-ferrari-border/80">
        <span className="w-2 h-2 rounded-full bg-ferrari-red animate-pulse" />
        <span className="text-xs font-mono font-medium text-white/90 tracking-wider">
          FERRARI CONFIGURATOR // {viewMode === 'cockpit' ? 'COCKPIT POV' : '3D EXTERIOR'}
        </span>
      </div>

      {/* Right HUD Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Toggle Exterior vs Cockpit View */}
        <button
          onClick={() =>
            onConfigChange({
              ...config,
              viewMode: viewMode === 'exterior' ? 'cockpit' : 'exterior'
            })
          }
          className={`px-3 py-2 rounded-xl border backdrop-blur-md font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
            viewMode === 'cockpit'
              ? 'bg-ferrari-red text-white border-ferrari-red shadow-[0_0_15px_rgba(255,40,0,0.5)]'
              : 'bg-ferrari-dark/80 border-ferrari-border text-white/70 hover:text-white'
          }`}
          title="Switch to Driver Cockpit View"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{viewMode === 'cockpit' ? 'COCKPIT POV' : 'EXTERIOR 360°'}</span>
        </button>

        <button
          onClick={() => onConfigChange({ ...config, autoRotate: !config.autoRotate })}
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
            config.autoRotate
              ? 'bg-ferrari-red/20 border-ferrari-red text-ferrari-red'
              : 'bg-ferrari-dark/70 border-ferrari-border text-white/70 hover:text-white'
          }`}
          title="Toggle 360 Auto Orbit"
        >
          <RotateCcw className={`w-4 h-4 ${config.autoRotate ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => onConfigChange({ ...config, headlightsOn: !config.headlightsOn })}
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
            config.headlightsOn
              ? 'bg-ferrari-yellow/20 border-ferrari-yellow text-ferrari-yellow'
              : 'bg-ferrari-dark/70 border-ferrari-border text-white/70 hover:text-white'
          }`}
          title="Toggle Bi-LED Matrix Projectors"
        >
          <Lightbulb className="w-4 h-4" />
        </button>

        <button
          onClick={() => onConfigChange({ ...config, activeAero: !config.activeAero })}
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
            config.activeAero
              ? 'bg-ferrari-red/20 border-ferrari-red text-ferrari-red'
              : 'bg-ferrari-dark/70 border-ferrari-border text-white/70 hover:text-white'
          }`}
          title="Toggle DRS / Active High Downforce Aero"
        >
          <Wind className="w-4 h-4" />
        </button>
      </div>

      {/* Manettino Switcher in Bottom Center */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 font-mono text-[11px]">
        <Zap className="w-3.5 h-3.5 text-ferrari-red" />
        <span className="text-white/40 uppercase mr-1 hidden sm:inline">MANETTINO:</span>
        {(['wet', 'sport', 'race', 'ct_off'] as ManettinoMode[]).map(m => (
          <button
            key={m}
            onClick={() => onConfigChange({ ...config, manettino: m })}
            className={`px-2 py-0.5 rounded uppercase font-bold transition-all ${
              manettino === m
                ? 'bg-ferrari-red text-white shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {m.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-4 z-20 text-[11px] font-mono text-white/50 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-md border border-white/5">
        <Eye className="w-3.5 h-3.5 text-ferrari-yellow" />
        <span>Drag to Orbit // Scroll to Zoom // Toggle Cockpit POV</span>
      </div>
    </div>
  )
}

export default Ferrari3DViewer
