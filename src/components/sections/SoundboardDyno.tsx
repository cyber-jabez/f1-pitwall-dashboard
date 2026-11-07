import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Gauge, Radio, Volume2, Sparkles, AlertTriangle, Zap, Activity, Wind } from 'lucide-react'
import { FerrariAudioEngine } from '../audio/WebAudioEngine'
import ShinyText from '../reactbits/ShinyText'
import DecryptedText from '../reactbits/DecryptedText'
import StarBorder from '../reactbits/StarBorder'

interface SoundboardDynoProps {
  audioEngine: FerrariAudioEngine
  isMuted: boolean
  onToggleSound: () => void
}

const RADIOS = [
  {
    title: 'Monza Victory 2024',
    speaker: 'Charles Leclerc #16',
    quote: 'Mamma Mia! Grazia a tutti! We won in Monza!! For the Tifosi!',
    accent: '#FF2800'
  },
  {
    title: 'Smooth Operator',
    speaker: 'Carlos Sainz #55',
    quote: 'Smooth operator... stop inventing, let’s win this race!',
    accent: '#FED500'
  },
  {
    title: 'Pit Wall Strategy',
    speaker: 'Scuderia Engineer',
    quote: 'Box box, box box for hard tyres. We are checking, stay focused.',
    accent: '#008C45'
  },
  {
    title: 'Il Commendatore',
    speaker: 'Enzo Ferrari',
    quote: 'I have always held that the engine is the heart of the automobile.',
    accent: '#FFF'
  }
]

export const SoundboardDyno: React.FC<SoundboardDynoProps> = ({ audioEngine, isMuted, onToggleSound }) => {
  const [rpm, setRpm] = useState(1000)
  const [isPressingThrottle, setIsPressingThrottle] = useState(false)
  const [gear, setGear] = useState(1)
  const [activeEngine, setActiveEngine] = useState<'v12' | 'v10' | 'v6_hybrid'>('v12')
  const [showFlame, setShowFlame] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Web Audio Analyser Visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dataArray = new Uint8Array(32)
    let animId = 0

    const draw = () => {
      animId = requestAnimationFrame(draw)
      audioEngine.getFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const barWidth = (canvas.width / 32) * 0.8
      let x = 0

      for (let i = 0; i < 32; i++) {
        // If engine is revving, add energetic baseline
        const val = Math.max(dataArray[i], (rpm / 9500) * 180 + Math.random() * 20)
        const barHeight = (val / 255) * canvas.height

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0)
        gradient.addColorStop(0, '#FF2800')
        gradient.addColorStop(0.7, '#FED500')
        gradient.addColorStop(1, '#FFFFFF')

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 2
      }
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [audioEngine, rpm])

  // Throttle physics loop
  useEffect(() => {
    let animId = 0

    const loop = () => {
      setRpm(prevRpm => {
        let nextRpm = prevRpm
        if (isPressingThrottle) {
          nextRpm = Math.min(prevRpm + 140, 9500)
          if (nextRpm >= 9400 && Math.random() < 0.3) {
            nextRpm = 9150
            setShowFlame(true)
            setTimeout(() => setShowFlame(false), 120)
          }
        } else {
          nextRpm = Math.max(prevRpm - 110, 1000)
        }
        audioEngine.setRpm(nextRpm)
        return nextRpm
      })
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [isPressingThrottle, audioEngine])

  // Keyboard shortcut: hold Space or W to rev!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'KeyW' || e.code === 'Space') && !isPressingThrottle) {
        if (document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault()
          setIsPressingThrottle(true)
        }
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'Space') {
        setIsPressingThrottle(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isPressingThrottle])

  const needleAngle = -120 + ((rpm - 1000) / 8500) * 240
  const totalLeds = 15
  const activeLeds = Math.floor(((rpm - 2500) / 7000) * totalLeds)

  return (
    <section id="soundboard" className="relative py-24 bg-[#090A0F] overflow-hidden border-t border-ferrari-border/40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-ferrari-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ferrari-red/10 border border-ferrari-red/30 mb-3">
            <Gauge className="w-3.5 h-3.5 text-ferrari-red animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-white/80 uppercase">
              MARANELLO DYNO TEST CELL // REAL-TIME FFT SYNTHESIZER
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-wider text-white uppercase mb-3">
            SOUND OF <ShinyText text="THE V12 OPERA" color="#FF2800" shineColor="#FED500" />
          </h2>

          <p className="max-w-2xl text-white/60 font-sans text-sm sm:text-base">
            Press and hold the throttle pedal (or hold <span className="text-ferrari-yellow font-mono">SPACE / W</span>) to wind the engine to its 9,500 RPM rev limiter. Watch the live audio spectrum visualizer respond in real time!
          </p>
        </div>

        {/* Dyno Cell Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Engine Sound Selectors & FFT Spectrum Visualizer */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Live FFT Audio Spectrum Visualizer Box */}
            <div className="p-4 rounded-2xl bg-[#0B0C12] border border-ferrari-border/80 shadow-inner flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                <span className="flex items-center gap-1 text-ferrari-yellow font-bold uppercase">
                  <Activity className="w-3.5 h-3.5 text-ferrari-red" />
                  LIVE EXHAUST ACOUSTICS FFT
                </span>
                <span>32 BANDS</span>
              </div>
              <canvas
                ref={canvasRef}
                width={280}
                height={64}
                className="w-full h-16 rounded-lg bg-black/60 border border-white/5"
              />
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/70">
              SELECT POWERTRAIN CALIBRATION
            </span>

            {[
              {
                id: 'v12',
                name: '6.5L Naturally Aspirated V12',
                car: 'Ferrari Daytona SP3 // 840 CV',
                revLimit: '9,500 RPM',
                desc: 'Pure atmospheric Maranello crescendo, 65° cylinder bank angle.'
              },
              {
                id: 'v10',
                name: '3.0L Tipo 053 Formula 1 V10',
                car: 'Ferrari F2004 // Michael Schumacher',
                revLimit: '19,000 RPM (Scaled)',
                desc: 'The most ferocious scream in motorsport history.'
              },
              {
                id: 'v6_hybrid',
                name: '3.0L Twin-Turbo V6 Hybrid',
                car: 'Ferrari F80 // 1,200 CV Flagship',
                revLimit: '9,200 RPM + E-Motors',
                desc: 'Electric turbo spooling with 800V MGU-K motor boost.'
              }
            ].map(eng => {
              const isSelected = activeEngine === eng.id
              return (
                <button
                  key={eng.id}
                  onClick={() => {
                    setActiveEngine(eng.id as 'v12' | 'v10' | 'v6_hybrid')
                    audioEngine.setEngineType(eng.id as 'v12' | 'v10' | 'v6_hybrid')
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-ferrari-red/10 border-ferrari-red shadow-[0_0_20px_rgba(255,40,0,0.3)]'
                      : 'bg-ferrari-card/70 border-ferrari-border/70 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-white uppercase">{eng.name}</span>
                    <span className="text-[10px] font-mono text-ferrari-yellow font-bold">{eng.revLimit}</span>
                  </div>
                  <div className="text-xs font-sans text-ferrari-red font-medium mb-1">{eng.car}</div>
                  <div className="text-[11px] font-sans text-white/50">{eng.desc}</div>
                </button>
              )
            })}

            {/* Turbo Compressor Flutter Button */}
            <button
              onClick={() => audioEngine.playTurboFlutter()}
              className="py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-ferrari-yellow bg-ferrari-dark/80 hover:bg-ferrari-dark border border-ferrari-yellow/40 hover:border-ferrari-yellow transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Wind className="w-4 h-4 text-ferrari-yellow" />
              <span>DUMP TURBO SPOOL (STUTUTU FLUTTER)</span>
            </button>
          </div>

          {/* Center: Digital Tachometer HUD & Shift Lights */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Formula 1 Shift Lights Ribbon */}
            <div className="w-full max-w-sm flex items-center justify-between gap-1.5 p-2 rounded-xl bg-[#0D0E14] border border-ferrari-border/80 mb-6 shadow-inner">
              {Array.from({ length: 15 }).map((_, i) => {
                const isLit = i <= activeLeds
                const color = i < 5 ? '#00E676' : i < 10 ? '#FF1744' : '#2979FF'
                return (
                  <div
                    key={i}
                    className={`flex-1 h-3 rounded-full transition-all duration-75 ${
                      isLit ? 'shadow-lg' : 'opacity-20'
                    }`}
                    style={{
                      backgroundColor: color,
                      boxShadow: isLit ? `0 0 10px ${color}` : 'none'
                    }}
                  />
                )
              })}
            </div>

            {/* Circular Tachometer Dial */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-b from-[#13151D] via-[#0A0B0F] to-[#050608] border-4 border-ferrari-border/90 p-4 shadow-[0_0_50px_rgba(0,0,0,0.9),inset_0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
                {Array.from({ length: 10 }).map((_, i) => {
                  const angle = -120 + i * (240 / 9)
                  const rad = (angle * Math.PI) / 180
                  const x1 = 100 + Math.cos(rad) * 82
                  const y1 = 100 + Math.sin(rad) * 82
                  const x2 = 100 + Math.cos(rad) * 92
                  const y2 = 100 + Math.sin(rad) * 92
                  const isRedline = i >= 8
                  return (
                    <g key={i}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isRedline ? '#FF2800' : '#FFF'}
                        strokeWidth={isRedline ? '3' : '2'}
                        opacity={isRedline ? '1' : '0.4'}
                      />
                      <text
                        x={100 + Math.cos(rad) * 70}
                        y={100 + Math.sin(rad) * 70 + 3}
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill={isRedline ? '#FF2800' : '#FFF'}
                        textAnchor="middle"
                        opacity={isRedline ? '1' : '0.7'}
                      >
                        {i}
                      </text>
                    </g>
                  )
                })}
              </svg>

              <div className="flex flex-col items-center justify-center z-10">
                <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">GEAR</span>
                <span className="text-4xl sm:text-5xl font-mono font-black text-ferrari-yellow drop-shadow-[0_0_15px_rgba(254,213,0,0.5)]">
                  {gear}
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">
                  {Math.round(rpm)}
                </div>
                <span className="text-[10px] font-mono tracking-widest text-ferrari-red font-bold">RPM x 1000</span>
              </div>

              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75"
                style={{ transform: `rotate(${needleAngle}deg)` }}
              >
                <div className="w-1 h-36 bg-gradient-to-t from-transparent via-ferrari-red to-ferrari-yellow rounded-full shadow-[0_0_12px_#FF2800] -translate-y-16" />
                <div className="absolute w-5 h-5 rounded-full bg-ferrari-red border-2 border-white shadow-lg" />
              </div>
            </div>

            {/* Exhaust Backfire Flame Display */}
            <div className="relative mt-6 flex items-center justify-center h-12">
              <AnimatePresence>
                {showFlame && (
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 1.1], opacity: [1, 0.9, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-1 text-ferrari-red font-mono font-black text-sm uppercase drop-shadow-[0_0_20px_#FF2800]"
                  >
                    <Flame className="w-6 h-6 fill-ferrari-yellow text-ferrari-red animate-flame" />
                    <span className="text-ferrari-yellow">EXHAUST POP! // OVERRUN FLAME</span>
                    <Flame className="w-6 h-6 fill-ferrari-yellow text-ferrari-red animate-flame" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Gear Selector Buttons */}
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(g => (
                <button
                  key={g}
                  onClick={() => {
                    setGear(g)
                    audioEngine.playExhaustPop()
                  }}
                  className={`w-7 h-7 rounded-lg font-mono font-bold text-xs transition-all ${
                    gear === g
                      ? 'bg-ferrari-red text-white shadow-[0_0_10px_rgba(255,40,0,0.5)]'
                      : 'bg-ferrari-dark/80 border border-ferrari-border/70 text-white/50 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Interactive Throttle Pedal + Team Radio Quotes */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-ferrari-card border border-ferrari-border/90 shadow-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/70 mb-2">
                ACCELERATORE // THROTTLE
              </span>

              <button
                onPointerDown={() => setIsPressingThrottle(true)}
                onPointerUp={() => setIsPressingThrottle(false)}
                onPointerLeave={() => setIsPressingThrottle(false)}
                className={`relative w-full h-44 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 select-none cursor-pointer transition-all active:scale-95 ${
                  isPressingThrottle
                    ? 'bg-gradient-to-b from-ferrari-red via-ferrari-darkRed to-black border-ferrari-yellow shadow-[0_0_35px_rgba(255,40,0,0.7)] translate-y-2'
                    : 'bg-gradient-to-b from-[#1C1E26] via-[#101217] to-[#0A0B0E] border-ferrari-border/80 hover:border-ferrari-red/60'
                }`}
              >
                <div className="flex flex-col gap-1.5 w-16 mb-2">
                  <div className="h-1 bg-white/20 rounded-full" />
                  <div className="h-1 bg-white/20 rounded-full" />
                  <div className="h-1 bg-white/20 rounded-full" />
                  <div className="h-1 bg-white/20 rounded-full" />
                </div>

                <Flame className={`w-8 h-8 ${isPressingThrottle ? 'text-ferrari-yellow fill-ferrari-yellow animate-pulse' : 'text-white/40'}`} />

                <span className="font-mono font-black text-sm uppercase tracking-wider text-white text-center">
                  {isPressingThrottle ? 'REDLINING 9,500 RPM!' : 'PRESS & HOLD THROTTLE'}
                </span>

                <span className="text-[10px] font-mono text-white/40">
                  (Or hold SPACE / W key)
                </span>
              </button>
            </div>

            {/* Pit Wall Radio Soundboard */}
            <div className="p-5 rounded-2xl bg-ferrari-card border border-ferrari-border/70 flex flex-col gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-ferrari-red" />
                PIT WALL RADIO TRANSMISSIONS
              </span>

              <div className="flex flex-col gap-2">
                {RADIOS.map((rad, idx) => (
                  <button
                    key={idx}
                    onClick={() => audioEngine.playPitRadio(rad.quote)}
                    className="p-2.5 rounded-xl border border-ferrari-border/60 bg-ferrari-dark/60 hover:bg-ferrari-dark hover:border-ferrari-yellow/40 transition-all text-left flex items-start gap-2.5 group active:scale-98"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-ferrari-yellow shrink-0 mt-0.5 group-hover:scale-110" />
                    <div>
                      <div className="text-[11px] font-mono font-bold text-white flex items-center gap-2">
                        {rad.title}
                        <span className="text-[9px] font-normal text-white/40">({rad.speaker})</span>
                      </div>
                      <div className="text-[10px] font-sans text-white/70 line-clamp-1 italic mt-0.5">
                        "{rad.quote}"
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SoundboardDyno
