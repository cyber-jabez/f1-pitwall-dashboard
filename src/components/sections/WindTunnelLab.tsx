import React, { useRef, useEffect, useState } from 'react'
import ShinyText from '../reactbits/ShinyText'
import StarBorder from '../reactbits/StarBorder'
import Magnet from '../reactbits/Magnet'
import { Wind, Gauge, Activity, Zap, RotateCcw } from 'lucide-react'

export const WindTunnelLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [speedKmh, setSpeedKmh] = useState(250)
  const [drsOpen, setDrsOpen] = useState(false)
  const [groundEffect, setGroundEffect] = useState(true)
  const [smokeColor, setSmokeColor] = useState<'cyan' | 'red' | 'yellow'>('cyan')
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1, y: -1, active: false })

  // Calculated Aero Metrics based on physics
  const speedMs = speedKmh / 3.6
  const rho = 1.225 // kg/m^3 air density at sea level
  const frontalArea = 1.85 // m^2
  const cd = drsOpen ? 0.38 : 0.68
  const cl = (groundEffect ? 2.4 : 1.7) * (drsOpen ? 0.65 : 1.0)

  // Drag in Newtons & Downforce in kg (9.81 m/s^2)
  const dragNewtons = Math.round(0.5 * rho * Math.pow(speedMs, 2) * cd * frontalArea)
  const downforceKg = Math.round((0.5 * rho * Math.pow(speedMs, 2) * cl * frontalArea) / 9.81)
  const aeroEfficiency = (cl / cd).toFixed(2)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const numParticles = 800

    // Particle object
    interface Particle {
      x: number
      y: number
      baseY: number
      vx: number
      vy: number
      size: number
      alpha: number
      life: number
    }

    const particles: Particle[] = []

    const initParticle = (p?: Partial<Particle>): Particle => {
      const w = canvas.width
      const h = canvas.height
      const laneY = Math.random() * (h * 0.85) + h * 0.05
      return {
        x: p?.x ?? Math.random() * w,
        y: laneY,
        baseY: laneY,
        vx: (speedKmh / 20) * (0.8 + Math.random() * 0.4),
        vy: 0,
        size: 1 + Math.random() * 1.8,
        alpha: 0.2 + Math.random() * 0.7,
        life: Math.random() * 100,
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(initParticle())
    }

    // Car silhouette boundary points (relative to canvas width & height)
    const render = () => {
      const w = canvas.width
      const h = canvas.height

      // Fade canvas for particle motion blur streaks
      ctx.fillStyle = 'rgba(7, 8, 12, 0.25)'
      ctx.fillRect(0, 0, w, h)

      // Car position coordinates (centered)
      const carX = w * 0.28
      const carY = h * 0.52
      const carW = w * 0.46
      const carH = h * 0.22

      // Draw Car Silhouette
      ctx.save()
      ctx.fillStyle = '#0E1118'
      ctx.strokeStyle = '#2B3245'
      ctx.lineWidth = 2
      ctx.beginPath()

      // Front splitter
      ctx.moveTo(carX, carY + carH * 0.75)
      // Front nose cone
      ctx.lineTo(carX + carW * 0.08, carY + carH * 0.6)
      // Front hood curve
      ctx.quadraticCurveTo(carX + carW * 0.2, carY + carH * 0.4, carX + carW * 0.35, carY + carH * 0.2)
      // Windshield & roofline
      ctx.quadraticCurveTo(carX + carW * 0.5, carY - carH * 0.05, carX + carW * 0.68, carY + carH * 0.1)
      // Engine cover / rear deck
      ctx.lineTo(carX + carW * 0.85, carY + carH * 0.3)

      // Rear Wing & DRS
      if (drsOpen) {
        // DRS Flat Wing
        ctx.lineTo(carX + carW * 0.98, carY + carH * 0.25)
      } else {
        // High Downforce Wing
        ctx.lineTo(carX + carW * 0.97, carY + carH * 0.08)
      }

      // Rear Diffuser
      ctx.lineTo(carX + carW, carY + carH * 0.75)
      // Flat Floor & Venturi Tunnels
      ctx.lineTo(carX, carY + carH * 0.75)
      ctx.closePath()

      // Fill car body with carbon dark gradient
      const carGrad = ctx.createLinearGradient(carX, carY, carX + carW, carY + carH)
      carGrad.addColorStop(0, '#1E2330')
      carGrad.addColorStop(0.5, '#0B0D13')
      carGrad.addColorStop(1, '#1A0404')
      ctx.fillStyle = carGrad
      ctx.fill()
      ctx.stroke()

      // Ferrari Tricolore Accent on Roof
      ctx.fillStyle = '#008C45'
      ctx.fillRect(carX + carW * 0.45, carY + carH * 0.05, carW * 0.04, 3)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(carX + carW * 0.49, carY + carH * 0.05, carW * 0.04, 3)
      ctx.fillStyle = '#CD212A'
      ctx.fillRect(carX + carW * 0.53, carY + carH * 0.05, carW * 0.04, 3)

      // Wheels
      ctx.fillStyle = '#0A0C10'
      ctx.strokeStyle = '#E5A91E'
      ctx.lineWidth = 3
      // Front Wheel
      ctx.beginPath()
      ctx.arc(carX + carW * 0.18, carY + carH * 0.75, carH * 0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      // Rear Wheel
      ctx.beginPath()
      ctx.arc(carX + carW * 0.82, carY + carH * 0.75, carH * 0.32, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      ctx.restore()

      // Particle Color Scheme
      const colorMap = {
        cyan: 'rgba(56, 189, 248, ',
        red: 'rgba(255, 40, 0, ',
        yellow: 'rgba(254, 213, 0, ',
      }
      const baseRgb = colorMap[smokeColor]

      // Update & Draw Wind Particles
      particles.forEach((p) => {
        p.vx = (speedKmh / 18) * (0.85 + Math.sin(p.life) * 0.1)
        p.x += p.vx

        // Deflection by Car Body Aerodynamics
        if (p.x > carX - 40 && p.x < carX + carW + 80) {
          const relX = (p.x - carX) / carW
          if (relX >= 0 && relX <= 1) {
            // Airflow above car
            if (p.y > carY - carH * 0.1 && p.y < carY + carH * 0.7) {
              const upwardCurve = Math.sin(relX * Math.PI) * (carH * 0.45)
              p.y -= upwardCurve * 0.08
            }
            // Airflow under car (Venturi Ground Effect)
            if (groundEffect && p.y >= carY + carH * 0.65 && p.y <= carY + carH * 0.85) {
              p.vx *= 1.35 // Venturi suction velocity acceleration
            }
          }

          // Rear Wake Turbulence & Separation
          if (p.x > carX + carW * 0.88) {
            if (!drsOpen) {
              // High turbulence swirl behind rear wing
              p.y += Math.sin(p.x * 0.05 + p.life) * 3.5
              p.alpha *= 0.96
            } else {
              // Smooth laminar flow with DRS open
              p.y += Math.sin(p.x * 0.02) * 0.8
            }
          }
        }

        // Mouse turbulence deflection
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x
          const dy = p.y - mouseRef.current.y
          const dist = Math.hypot(dx, dy)
          if (dist < 120 && dist > 1) {
            const force = (120 - dist) / 120
            p.y += (dy / dist) * force * 6
            p.x += (dx / dist) * force * 4
          }
        }

        // Return toward baseline
        p.y += (p.baseY - p.y) * 0.03
        p.life += 0.05

        // Reset if offscreen
        if (p.x > w + 20) {
          p.x = -10
          p.y = p.baseY = Math.random() * (h * 0.85) + h * 0.05
          p.alpha = 0.3 + Math.random() * 0.6
        }

        // Draw particle streak
        ctx.fillStyle = `${baseRgb}${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animationId)
  }, [speedKmh, drsOpen, groundEffect, smokeColor])

  // Mouse interaction handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 960,
      y: ((e.clientY - rect.top) / rect.height) * 440,
      active: true,
    }
  }

  const handleMouseLeave = () => {
    mouseRef.current.active = false
  }

  return (
    <section id="aero-lab" className="py-24 px-4 relative overflow-hidden bg-[#050608] border-t border-ferrari-border/60">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-3">
            <Wind className="w-4 h-4 text-emerald-400 animate-spin" />
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              MARANELLO WIND TUNNEL FACILITY // CFD LAB
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-3">
            AERODYNAMICS <ShinyText text="PARTICLE LAB" speed={2.2} className="text-ferrari-red" />
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base font-sans">
            Simulate real-time fluid dynamics inside Ferrari's Maranello wind tunnel. Adjust tunnel airspeed, open the DRS flap to reduce drag, test ground-effect Venturi tunnels, and interact with the airflow using your cursor.
          </p>
        </div>

        {/* Wind Tunnel Simulation Canvas */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-ferrari-border/80 bg-[#07080C] shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          {/* Top HUD Bar */}
          <div className="bg-[#0B0D14] border-b border-ferrari-border/70 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs text-white tracking-widest uppercase font-bold">
                CFD STREAMLINE VISUALIZER // 800 AIR PARTICLES
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-white/50">SMOKE TRACER:</span>
              {(['cyan', 'red', 'yellow'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setSmokeColor(color)}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    smokeColor === color ? 'scale-125 border-white' : 'opacity-50 border-transparent'
                  } ${
                    color === 'cyan' ? 'bg-sky-400' : color === 'red' ? 'bg-ferrari-red' : 'bg-ferrari-yellow'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Interactive HTML5 Canvas */}
          <div className="relative w-full aspect-[2.1/1]">
            <canvas
              ref={canvasRef}
              width={960}
              height={440}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full cursor-crosshair block"
            />
            {/* Interactive hint overlay */}
            <div className="absolute bottom-4 left-6 pointer-events-none text-white/40 font-mono text-[11px] bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
              ⚡ DRAG OR HOVER CURSOR OVER STREAMLINES TO INDUCE BOUNDARY LAYER TURBULENCE
            </div>
          </div>

          {/* Bottom Telemetry & Controls Dashboard */}
          <div className="p-6 bg-[#090B10] border-t border-ferrari-border/70 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Airspeed Control Slider */}
            <div className="flex flex-col justify-center">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs text-white/60">WIND SPEED</span>
                <span className="font-mono font-bold text-sm text-ferrari-yellow">{speedKmh} KM/H</span>
              </div>
              <input
                type="range"
                min={120}
                max={360}
                step={5}
                value={speedKmh}
                onChange={(e) => setSpeedKmh(Number(e.target.value))}
                className="w-full accent-ferrari-red cursor-pointer"
              />
              <span className="font-mono text-[10px] text-white/40 mt-1">SPEED OF SOUND: 1,235 KM/H (0.29 MACH)</span>
            </div>

            {/* Calculated Downforce Metric */}
            <div className="bg-[#0E1118] border border-ferrari-border/80 p-4 rounded-2xl flex flex-col justify-center">
              <span className="font-mono text-[10px] text-white/50 uppercase">TOTAL DOWNFORCE</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display font-black text-3xl text-emerald-400">{downforceKg}</span>
                <span className="font-mono text-xs text-white/60">KG @ {speedKmh} KM/H</span>
              </div>
              <span className="font-mono text-[9px] text-emerald-500/80 mt-1">
                {(downforceKg * 9.81).toLocaleString()} N NORMAL LOAD
              </span>
            </div>

            {/* Aerodynamic Drag Metric */}
            <div className="bg-[#0E1118] border border-ferrari-border/80 p-4 rounded-2xl flex flex-col justify-center">
              <span className="font-mono text-[10px] text-white/50 uppercase">AERODYNAMIC DRAG</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display font-black text-3xl text-ferrari-red">{dragNewtons}</span>
                <span className="font-mono text-xs text-white/60">NEWTONS</span>
              </div>
              <span className="font-mono text-[9px] text-ferrari-yellow mt-1">
                DRAG COEFF (Cd): {cd} // L/D: {aeroEfficiency}
              </span>
            </div>

            {/* Aero Modes: DRS & Ground Effect */}
            <div className="flex flex-col gap-2 justify-center">
              <button
                onClick={() => setDrsOpen((d) => !d)}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-between ${
                  drsOpen
                    ? 'bg-emerald-500 text-black border-white shadow-[0_0_20px_#10B981]'
                    : 'bg-[#151924] text-white border-ferrari-border/80 hover:border-emerald-500'
                }`}
              >
                <span>DRS WING FLAP</span>
                <span>{drsOpen ? 'OPEN (-35% DRAG)' : 'CLOSED (HIGH DF)'}</span>
              </button>

              <button
                onClick={() => setGroundEffect((g) => !g)}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-between ${
                  groundEffect
                    ? 'bg-ferrari-red text-white border-white shadow-[0_0_20px_#FF2800]'
                    : 'bg-[#151924] text-white border-ferrari-border/80 hover:border-ferrari-red'
                }`}
              >
                <span>VENTURI GROUND EFFECT</span>
                <span>{groundEffect ? 'ACTIVE' : 'SEAL OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WindTunnelLab

