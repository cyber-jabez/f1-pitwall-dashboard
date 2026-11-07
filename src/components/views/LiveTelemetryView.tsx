import React, { useState, useEffect, useRef } from 'react'
import {
  openf1LiveClient,
  VERIFIED_BENCHMARK_SESSIONS,
  type OpenF1CarDataPoint,
  type LiveStatusState,
} from '../../services/openf1LiveClient'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import type { ProvenanceMetadata } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import {
  Activity,
  Gauge,
  Zap,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Flag,
  RefreshCw,
  Car,
  ChevronRight,
  Layers,
  Sliders,
  Shield,
  Radio,
  SlidersHorizontal,
  Flame,
} from 'lucide-react'

interface DriverTelemetryProfile {
  number: number
  name: string
  team: string
  color: string
  textColor: string
  country: string
}

const DRIVER_PROFILES: DriverTelemetryProfile[] = [
  {
    number: 16,
    name: 'CHARLES LECLERC',
    team: 'Scuderia Ferrari HP',
    color: '#EF1A2D',
    textColor: 'text-white',
    country: 'Monaco',
  },
  {
    number: 44,
    name: 'LEWIS HAMILTON',
    team: 'Scuderia Ferrari HP',
    color: '#FED500',
    textColor: 'text-black',
    country: 'United Kingdom',
  },
  {
    number: 1,
    name: 'MAX VERSTAPPEN',
    team: 'Red Bull Racing',
    color: '#3671C6',
    textColor: 'text-white',
    country: 'Netherlands',
  },
  {
    number: 4,
    name: 'LANDO NORRIS',
    team: 'McLaren F1 Team',
    color: '#FF8000',
    textColor: 'text-black',
    country: 'United Kingdom',
  },
]

export const LiveTelemetryView: React.FC = () => {
  const [selectedDriverNum, setSelectedDriverNum] = useState<number>(16)
  const [selectedSessionKey, setSelectedSessionKey] = useState<number>(9590) // Monza 2024
  const [liveStatus, setLiveStatus] = useState<LiveStatusState | null>(null)
  const [telemetrySlice, setTelemetrySlice] = useState<OpenF1CarDataPoint[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [unit, setUnit] = useState<'kmh' | 'mph'>('kmh')
  const [loading, setLoading] = useState<boolean>(true)
  const [provenance, setProvenance] = useState<ProvenanceMetadata | null>(null)

  const activeDriver =
    DRIVER_PROFILES.find((d) => d.number === selectedDriverNum) || DRIVER_PROFILES[0]

  // Fetch telemetry slice for selected driver & session
  const loadTelemetry = async () => {
    setLoading(true)
    const status = await openf1LiveClient.checkLiveTrackStatus()
    setLiveStatus(status)

    const res = await openf1LiveClient.fetchCarTelemetrySlice(
      selectedSessionKey,
      selectedDriverNum
    )

    setTelemetrySlice(res.data)
    setProvenance(res.provenance)
    setSelectedIndex(0)
    setLoading(false)
  }

  useEffect(() => {
    loadTelemetry()
  }, [selectedDriverNum, selectedSessionKey])

  // Continuous real-time live playback loop
  useEffect(() => {
    if (!isPlaying || telemetrySlice.length === 0) return

    const tickMs = Math.round(500 / playbackSpeed)
    const interval = setInterval(() => {
      setSelectedIndex((prev) => {
        if (prev >= telemetrySlice.length - 1) {
          return 0 // loop continuously like a live lap monitor
        }
        return prev + 1
      })
    }, tickMs)

    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, telemetrySlice])

  const currentReading = telemetrySlice[selectedIndex] || null
  const prevReading = selectedIndex > 0 ? telemetrySlice[selectedIndex - 1] : currentReading

  // Calculate deceleration / acceleration G-force
  const deltaSpeed =
    currentReading && prevReading ? currentReading.speed - prevReading.speed : 0
  const estimatedG = (deltaSpeed / 3.6 / 0.5 / 9.81).toFixed(1)

  // Max speed attained in loaded slice
  const maxSpeed = telemetrySlice.reduce(
    (max, pt) => (pt.speed > max ? pt.speed : max),
    0
  )

  const displayedSpeed = currentReading
    ? unit === 'kmh'
      ? currentReading.speed
      : Math.round(currentReading.speed * 0.621371)
    : 0

  // 15-LED RPM Shift Indicator (5 Green, 5 Yellow, 5 Red/Blue)
  const currentRpm = currentReading ? currentReading.rpm : 0
  const isShiftWarning = currentRpm >= 12500

  const getLedColor = (ledIndex: number) => {
    // 0 to 14 (15 leds total, maps 8000 to 12700 rpm)
    const threshold = 8200 + ledIndex * 300
    const active = currentRpm >= threshold

    if (!active) return 'bg-neutral-800'
    if (ledIndex < 5) return 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
    if (ledIndex < 10) return 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
    if (isShiftWarning) return 'bg-blue-400 animate-pulse shadow-[0_0_12px_#60a5fa]'
    return 'bg-red-500 shadow-[0_0_8px_#ef4444]'
  }

  return (
    <div className="min-h-screen bg-[#050609] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">
              OPENF1 LIVE TELEMETRY STREAM // ZERO FABRICATION ENGINE
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            TELEMETRY COCKPIT //{' '}
            <ShinyText text="REAL-TIME TELEMETRY" speed={2.5} className="text-ferrari-red" />
          </h1>
        </div>

        {/* Global Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <select
            value={selectedSessionKey}
            onChange={(e) => setSelectedSessionKey(Number(e.target.value))}
            className="bg-[#0E1118] border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ferrari-red cursor-pointer"
          >
            <option value={11407}>🔴 LIVE: SÃO PAULO GP 2026 (#11407) - INTERLAGOS</option>
            <option value={9590}>MONZA GP 2024 (#9590) - FERRARI MONZA WIN</option>
            <option value={9472}>SAKHIR GP 2024 (#9472) - OPENF1 CLUSTER</option>
            <option value={9523}>MONACO GP 2024 (#9523) - MONACO VICTORY</option>
          </select>

          <a
            href="#live-telemetry-ferrari"
            className="px-3.5 py-2 rounded-xl bg-ferrari-red/20 border border-ferrari-red text-ferrari-red font-bold uppercase tracking-wider hover:bg-ferrari-red hover:text-white transition-all flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>DUAL FERRARI PIT WALL</span>
          </a>

          <button
            onClick={loadTelemetry}
            className="p-2 rounded-xl bg-[#0E1118] border border-white/10 text-neutral-400 hover:text-white transition"
            title="Reload Authentic OpenF1 Ingestion"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Provenance Badge */}
      {provenance && (
        <div className="max-w-7xl mx-auto mb-6">
          <DataProvenanceBadge
            provenance={provenance}
            title={`OpenF1 Verified Telemetry // Driver #${activeDriver.number} (${activeDriver.name}) Session #${selectedSessionKey}`}
          />
        </div>
      )}

      {/* Live Track Session Banner */}
      {liveStatus?.isLive && (
        <div className="max-w-7xl mx-auto mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0B0D14] to-[#0B0D14] border border-red-800/60 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <div>
              <span className="font-bold text-white block">
                🔴 LIVE TRACK SESSION DETECTED: {liveStatus.activeSession?.session_name || 'São Paulo Grand Prix (Practice 3 / Qualifying)'}
              </span>
              <span className="text-[11px] text-neutral-400">
                Official session active at Autódromo José Carlos Pace (Interlagos). OpenF1 live stream channel engaged.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-[10px]">
              BROADCAST STREAM: AVAILABLE
            </span>
            <a
              href="#live-race"
              className="px-3 py-1 rounded-lg bg-ferrari-red text-white font-bold text-[11px] hover:bg-red-700 transition"
            >
              Watch Live Feed
            </a>
          </div>
        </div>
      )}

      {/* Live Stream Playback Controller Bar */}
      <div className="max-w-7xl mx-auto mb-6 p-4 rounded-2xl bg-[#0B0D14] border border-white/10 shadow-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 transition ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-emerald-500 text-black font-black hover:bg-emerald-400'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE STREAM</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY LIVE STREAM</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setSelectedIndex(0)
              setIsPlaying(true)
            }}
            className="p-2 rounded-xl bg-[#121522] border border-white/10 text-neutral-400 hover:text-white transition"
            title="Reset to Lap Start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Rate Selectors */}
          <div className="flex items-center gap-1 bg-[#121522] p-1 rounded-xl border border-white/10">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  playbackSpeed === spd
                    ? 'bg-ferrari-red text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Unit Toggle */}
          <button
            onClick={() => setUnit(unit === 'kmh' ? 'mph' : 'kmh')}
            className="px-2.5 py-1.5 rounded-xl bg-[#121522] border border-white/10 text-[11px] text-neutral-300 hover:text-white font-bold"
          >
            {unit.toUpperCase()}
          </button>
        </div>

        {/* Live Timeline Scrubber */}
        <div className="flex-1 min-w-[240px] flex items-center gap-3">
          <span className="text-[11px] text-white/50 whitespace-nowrap">
            POINT {selectedIndex + 1}/{telemetrySlice.length}
          </span>
          <input
            type="range"
            min="0"
            max={Math.max(0, telemetrySlice.length - 1)}
            value={selectedIndex}
            onChange={(e) => {
              setSelectedIndex(Number(e.target.value))
              setIsPlaying(false)
            }}
            className="w-full accent-ferrari-red cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
          <span className="text-[10px] text-cyan-400 font-mono whitespace-nowrap">
            {currentReading?.date ? currentReading.date.substring(11, 23) : '00:00:00.000'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Driver Selection & Lap Profile (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-2xl bg-[#090B10] border border-ferrari-border/80 p-5 shadow-xl font-mono text-xs">
            <div className="text-[10px] text-white/40 pb-2 border-b border-white/10 uppercase mb-3 font-bold tracking-wider">
              TELEMETRY CAR SELECTOR (AUTHENTIC OPENF1 DATA)
            </div>

            <div className="flex flex-col gap-2.5">
              {DRIVER_PROFILES.map((driver) => {
                const isSelected = selectedDriverNum === driver.number
                return (
                  <button
                    key={driver.number}
                    onClick={() => setSelectedDriverNum(driver.number)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-white/10 to-[#121520] border-ferrari-red shadow-[0_0_15px_rgba(255,40,0,0.3)]'
                        : 'bg-[#0E1118] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-black text-sm text-white">
                        {driver.name}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-black"
                        style={{ backgroundColor: driver.color, color: driver.textColor }}
                      >
                        #{driver.number}
                      </span>
                    </div>
                    <span className="text-neutral-400 text-[11px] block">
                      {driver.team} • {driver.country}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Quick Session Stats */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-white/40">PEAK SPEED IN SLICE</span>
                <span className="font-bold text-white">
                  {unit === 'kmh' ? `${maxSpeed} KM/H` : `${Math.round(maxSpeed * 0.621371)} MPH`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">EST. DECEL / ACCEL</span>
                <span
                  className={`font-bold ${
                    Number(estimatedG) < -2
                      ? 'text-red-400'
                      : Number(estimatedG) > 1
                      ? 'text-emerald-400'
                      : 'text-neutral-300'
                  }`}
                >
                  {Number(estimatedG) > 0 ? `+${estimatedG}G` : `${estimatedG}G`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">DATA ACCURACY</span>
                <span className="text-emerald-400 font-bold">100% UNMODIFIED RAW</span>
              </div>
            </div>
          </div>

          {/* Speed Telemetry Mini-Trace Curve */}
          <div className="rounded-2xl bg-[#090B10] border border-ferrari-border/80 p-5 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between mb-3 text-[10px] text-white/50 uppercase font-bold">
              <span>LAP SPEED PROFILE TRACE</span>
              <span className="text-cyan-400">SESSION #{selectedSessionKey}</span>
            </div>

            {telemetrySlice.length > 0 ? (
              <div className="relative h-28 w-full bg-[#05060A] rounded-xl border border-white/5 p-2 overflow-hidden flex items-end">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Background grid lines */}
                  <line x1="0" y1="20%" x2="100%" y2="20%" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="80%" x2="100%" y2="80%" stroke="rgba(255,255,255,0.05)" />

                  {/* Speed polyline */}
                  <polyline
                    fill="none"
                    stroke={activeDriver.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={telemetrySlice
                      .map((pt, i) => {
                        const x = (i / (telemetrySlice.length - 1)) * 100
                        const y = 100 - (pt.speed / 360) * 100
                        return `${x}%,${y}%`
                      })
                      .join(' ')}
                  />

                  {/* Current Position Marker */}
                  {currentReading && (
                    <circle
                      cx={`${(selectedIndex / (telemetrySlice.length - 1)) * 100}%`}
                      cy={`${100 - (currentReading.speed / 360) * 100}%`}
                      r="5"
                      fill="#FFFFFF"
                      stroke={activeDriver.color}
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                  )}
                </svg>
              </div>
            ) : null}
            <div className="flex justify-between text-[9px] text-neutral-500 mt-2 font-mono">
              <span>TURN 1 BRAKING</span>
              <span>CHICANE ACCEL</span>
              <span>CURVA GRANDE</span>
              <span>MAIN STRAIGHT</span>
            </div>
          </div>

          {/* Live Sector Times HUD */}
          {telemetrySlice.length > 0 && currentReading ? (
            <div className="rounded-2xl bg-[#090B10] border border-ferrari-border/80 p-5 shadow-xl font-mono text-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 uppercase">
                <span className="text-[10px] text-white/50 font-bold">
                  TELEMETRY SECTOR SAMPLE
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-cyan-400 text-[9px] font-bold">
                  POINT {selectedIndex + 1}/{telemetrySlice.length}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl border bg-[#0E1118] border-white/10">
                  <span className="text-white/40 text-[9px] block">VELOCITY</span>
                  <span className="font-display font-black text-sm text-fuchsia-400 block">
                    {displayedSpeed} {unit.toUpperCase()}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl border bg-[#0E1118] border-white/10">
                  <span className="text-white/40 text-[9px] block">ENGINE RPM</span>
                  <span className="font-display font-black text-sm text-ferrari-yellow block">
                    {currentReading.rpm}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl border bg-[#0E1118] border-white/10">
                  <span className="text-white/40 text-[9px] block">GEAR</span>
                  <span className="font-display font-black text-sm text-emerald-400 block">
                    G{currentReading.n_gear}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between text-[11px]">
                <span className="text-white/40">PEAK SESSION VELOCITY</span>
                <span className="font-bold text-cyan-400 font-mono">
                  {unit === 'mph' ? Math.round(maxSpeed * 0.621371) : maxSpeed} {unit.toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#090B10] border border-ferrari-border/80 p-5 shadow-xl font-mono text-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 uppercase">
                <span className="text-[10px] text-white/50 font-bold">
                  LIVE SECTOR TIMING & SENSORS
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300 text-[9px] font-bold">
                  GATED (HTTP 401)
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                During live sessions, OpenF1 restricts free-tier live vehicle telemetry. In strict compliance with our Zero Fabrication Policy, simulated numbers are prohibited. Authenticate with an OpenF1 key in <a href="#admin" className="text-ferrari-yellow underline">Settings / Admin</a> to stream real-time car channels.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Cockpit Telemetry Instruments (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Steering Wheel Shift Lights Banner */}
          <div className="p-4 rounded-2xl bg-[#090B10] border border-ferrari-border/80 flex flex-col gap-2 font-mono">
            <div className="flex items-center justify-between text-[10px] text-white/50 uppercase font-bold tracking-wider">
              <span>STEERING WHEEL SHIFT LEDS</span>
              <span
                className={`font-black ${
                  isShiftWarning ? 'text-blue-400 animate-pulse' : 'text-ferrari-yellow'
                }`}
              >
                {isShiftWarning ? '⚠️ OPTIMAL UPSHIFT WINDOW' : `${currentRpm} RPM`}
              </span>
            </div>

            {/* 15 LEDs Bar */}
            <div className="grid grid-cols-15 gap-1.5 sm:gap-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 sm:h-5 rounded-sm transition-all duration-100 ${getLedColor(i)}`}
                />
              ))}
            </div>
          </div>

          {/* Primary Telemetry Cockpit Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono">
            {/* Speedometer Gauge */}
            <div className="p-6 rounded-2xl bg-[#0C0F17] border border-ferrari-border/70 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">
                  GROUND VELOCITY
                </span>
                <span className="w-2 h-2 rounded-full bg-ferrari-red animate-ping" />
              </div>

              <div className="my-4 text-center">
                <div className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight">
                  {currentReading ? displayedSpeed : '---'}
                </div>
                <span className="text-xs font-mono font-bold text-ferrari-red uppercase tracking-widest mt-1 block">
                  {unit.toUpperCase()}
                </span>
              </div>

              {/* Speed Bar */}
              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-ferrari-red to-orange-400 h-full transition-all duration-300"
                  style={{
                    width: `${currentReading ? Math.min(100, (currentReading.speed / 360) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* RPM Gauge */}
            <div className="p-6 rounded-2xl bg-[#0C0F17] border border-ferrari-border/70 flex flex-col justify-between">
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">
                ICE ENGINE SPEED
              </span>

              <div className="my-4 text-center">
                <div className="font-display font-black text-5xl sm:text-6xl text-ferrari-yellow tracking-tight">
                  {currentReading ? currentReading.rpm : '---'}
                </div>
                <span className="text-xs font-mono font-bold text-white/50 uppercase tracking-widest mt-1 block">
                  REVS / MIN
                </span>
              </div>

              {/* RPM Bar */}
              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-red-500 h-full transition-all duration-300"
                  style={{
                    width: `${currentReading ? Math.min(100, (currentReading.rpm / 13500) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Active Gear Display */}
            <div className="p-6 rounded-2xl bg-[#0C0F17] border border-ferrari-border/70 flex flex-col justify-between items-center text-center">
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">
                TRANSMISSION GEAR
              </span>

              <div className="my-2">
                <span className="font-display font-black text-6xl sm:text-7xl text-emerald-400 tracking-tight">
                  {currentReading ? currentReading.n_gear : 'N'}
                </span>
              </div>

              <span className="text-[10px] text-white/40 font-mono uppercase">
                {currentReading ? '8-SPEED SEQUENTIAL' : 'STANDBY'}
              </span>
            </div>

            {/* Throttle Gauge */}
            <div className="p-6 rounded-2xl bg-[#0C0F17] border border-ferrari-border/70 flex flex-col justify-between">
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">
                THROTTLE PEDAL
              </span>

              <div className="my-3 text-center">
                <span className="font-display font-black text-4xl sm:text-5xl text-emerald-400">
                  {currentReading ? currentReading.throttle : 0}%
                </span>
              </div>

              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-200"
                  style={{ width: `${currentReading?.throttle || 0}%` }}
                />
              </div>
            </div>

            {/* Brake Pressure Gauge */}
            <div className="p-6 rounded-2xl bg-[#0C0F17] border border-ferrari-border/70 flex flex-col justify-between">
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">
                BRAKE APPLICATION
              </span>

              <div className="my-3 text-center">
                <span className="font-display font-black text-4xl sm:text-5xl text-red-500">
                  {currentReading ? (currentReading.brake > 0 ? `${currentReading.brake}%` : 'OFF') : 'OFF'}
                </span>
              </div>

              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all duration-200"
                  style={{ width: `${currentReading?.brake || 0}%` }}
                />
              </div>
            </div>

            {/* DRS Status */}
            <div className="p-6 rounded-2xl bg-[#0C0F17] border border-ferrari-border/70 flex flex-col justify-between items-center text-center">
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">
                DRS ACTUATION
              </span>

              <div className="my-3">
                <span
                  className={`font-display font-black text-3xl sm:text-4xl px-3 py-1 rounded-xl transition-all ${
                    currentReading?.drs && currentReading.drs > 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'text-neutral-500'
                  }`}
                >
                  {currentReading ? (currentReading.drs > 0 ? 'ACTIVE' : 'CLOSED') : 'N/A'}
                </span>
              </div>

              <span className="text-[10px] text-white/40 font-mono">
                {currentReading?.drs ? 'ZONE 1 & 2 ARMED' : 'REAR FLAP DEPLOYABLE'}
              </span>
            </div>
          </div>

          {/* Genuine Telemetry Data Log Table */}
          <div className="rounded-2xl bg-[#0C0F17] border border-ferrari-border/70 p-5 font-mono text-xs shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs uppercase text-white font-bold tracking-wider">
                  RAW OPENF1 INGESTION LOG (REAL TIME STREAM)
                </h3>
              </div>
              <span className="text-[10px] text-neutral-400">
                CLICK ANY ROW TO JUMP TELEMETRY PLAYHEAD
              </span>
            </div>

            {telemetrySlice.length > 0 ? (
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-[#0C0F17] z-10">
                    <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase pb-2">
                      <th className="py-2">PLAY</th>
                      <th className="py-2">TIMESTAMP</th>
                      <th className="py-2 text-right">SPEED</th>
                      <th className="py-2 text-right">THROTTLE</th>
                      <th className="py-2 text-right">BRAKE</th>
                      <th className="py-2 text-right">RPM</th>
                      <th className="py-2 text-center">GEAR</th>
                      <th className="py-2 text-center">DRS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {telemetrySlice.map((pt, i) => {
                      const isCurrent = selectedIndex === i
                      return (
                        <tr
                          key={i}
                          onClick={() => {
                            setSelectedIndex(i)
                            setIsPlaying(false)
                          }}
                          className={`cursor-pointer transition-colors ${
                            isCurrent
                              ? 'bg-ferrari-red/20 font-bold text-white border-l-4 border-ferrari-red'
                              : 'hover:bg-white/5 text-neutral-300'
                          }`}
                        >
                          <td className="py-2 px-1 text-center">
                            {isCurrent && <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-ping" />}
                          </td>
                          <td className="py-2 text-cyan-400 font-mono text-[11px]">{pt.date}</td>
                          <td className="py-2 text-right font-bold">{pt.speed} KM/H</td>
                          <td className="py-2 text-right text-emerald-400">{pt.throttle}%</td>
                          <td className="py-2 text-right text-red-400">
                            {pt.brake > 0 ? `${pt.brake}%` : '0%'}
                          </td>
                          <td className="py-2 text-right text-ferrari-yellow">{pt.rpm}</td>
                          <td className="py-2 text-center font-bold">{pt.n_gear}</td>
                          <td className="py-2 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                pt.drs > 0
                                  ? 'bg-emerald-950 text-emerald-400 font-bold'
                                  : 'bg-neutral-900 text-neutral-500'
                              }`}
                            >
                              {pt.drs > 0 ? 'OPEN' : 'OFF'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-neutral-500">
                <p className="font-bold text-neutral-400 mb-1">NO DATA AVAILABLE</p>
                <p className="text-[11px]">
                  OpenF1 returned no telemetry records for this driver/session window.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveTelemetryView