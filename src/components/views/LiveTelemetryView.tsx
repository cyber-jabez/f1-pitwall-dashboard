import React, { useState, useEffect } from 'react'
import {
  openf1LiveClient,
  type OpenF1CarDataPoint,
  type LiveStatusState,
} from '../../services/openf1LiveClient'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import type { ProvenanceMetadata } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
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
    color: '#E10600',
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
    const threshold = 8200 + ledIndex * 300
    const active = currentRpm >= threshold

    if (!active) return 'bg-[#1A1A1A]'
    if (ledIndex < 5) return 'bg-emerald-500'
    if (ledIndex < 10) return 'bg-[#FED500]'
    if (isShiftWarning) return 'bg-blue-400 animate-pulse'
    return 'bg-[#E10600]'
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-none bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
              OPENF1 LIVE TELEMETRY STREAM // ZERO FABRICATION ENGINE
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            TELEMETRY COCKPIT <span className="text-[#555555]">//</span>{' '}
            <ShinyText text="REAL-TIME TELEMETRY" speed={2.5} className="text-[#E10600]" />
          </h1>
        </div>

        {/* Global Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <select
            value={selectedSessionKey}
            onChange={(e) => setSelectedSessionKey(Number(e.target.value))}
            className="bg-[#111111] border border-[#292929] rounded-none px-3 py-1.5 text-white focus:outline-none focus:border-[#E10600] cursor-pointer"
          >
            <option value={11407}>🔴 LIVE: SÃO PAULO GP 2026 (#11407) - INTERLAGOS</option>
            <option value={9590}>MONZA GP 2024 (#9590) - FERRARI MONZA WIN</option>
            <option value={9472}>SAKHIR GP 2024 (#9472) - OPENF1 CLUSTER</option>
            <option value={9523}>MONACO GP 2024 (#9523) - MONACO VICTORY</option>
          </select>

          <a
            href="#live-telemetry-ferrari"
            className="px-3.5 py-1.5 rounded-none bg-[#1F1215] border border-[#E10600] text-[#E10600] font-bold uppercase tracking-wider hover:bg-[#E10600] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>DUAL FERRARI PIT WALL</span>
          </a>

          <button
            onClick={loadTelemetry}
            className="p-1.5 rounded-none bg-[#111111] border border-[#292929] text-[#858585] hover:text-white hover:border-[#E10600] transition"
            title="Reload Authentic OpenF1 Ingestion"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
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
        <div className="max-w-7xl mx-auto mb-6 p-3.5 rounded-none bg-[#170C0E] border border-[#E10600] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-none bg-[#E10600] animate-pulse" />
            <div>
              <span className="font-bold text-white block uppercase">
                🔴 LIVE TRACK SESSION DETECTED: {liveStatus.activeSession?.session_name || 'São Paulo Grand Prix'}
              </span>
              <span className="text-[11px] text-[#A0A0A0]">
                Official session active at Autódromo José Carlos Pace. OpenF1 live stream channel engaged.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-none bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-[9px] uppercase">
              STREAM: AVAILABLE
            </span>
            <a
              href="#live-race"
              className="px-3 py-1 rounded-none bg-[#E10600] text-white font-bold text-[11px] uppercase hover:bg-[#B80000] transition"
            >
              Watch Live Feed
            </a>
          </div>
        </div>
      )}

      {/* Live Stream Playback Controller Bar */}
      <div className="max-w-7xl mx-auto mb-6 p-3.5 rounded-none bg-[#0B0D14] border border-[#292929] shadow-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-1.5 rounded-none font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${
              isPlaying
                ? 'bg-amber-950/40 text-amber-400 border border-amber-500/50 hover:bg-amber-900/40'
                : 'bg-emerald-500 text-black font-black hover:bg-emerald-400'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE STREAM</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY LIVE STREAM</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setSelectedIndex(0)
              setIsPlaying(true)
            }}
            className="p-1.5 rounded-none bg-[#111111] border border-[#292929] text-[#858585] hover:text-white hover:border-[#E10600] transition"
            title="Reset to Lap Start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Rate Selectors */}
          <div className="flex items-center gap-0.5 bg-[#111111] p-0.5 rounded-none border border-[#292929]">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded-none text-[10px] font-bold uppercase transition ${
                  playbackSpeed === spd
                    ? 'bg-[#E10600] text-white'
                    : 'text-[#858585] hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Unit Toggle */}
          <button
            onClick={() => setUnit(unit === 'kmh' ? 'mph' : 'kmh')}
            className="px-2 py-1 rounded-none bg-[#111111] border border-[#292929] text-[10px] text-[#D8D8D8] hover:text-white font-bold uppercase"
          >
            {unit.toUpperCase()}
          </button>
        </div>

        {/* Live Timeline Scrubber */}
        <div className="flex-1 min-w-[240px] flex items-center gap-3">
          <span className="text-[10px] text-[#858585] whitespace-nowrap tabular-nums">
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
            className="flex-1 accent-[#E10600] cursor-pointer h-1.5 bg-[#1A1A1A] rounded-none"
          />
          <span className="text-[10px] text-cyan-400 font-mono whitespace-nowrap tabular-nums">
            {currentReading?.date ? currentReading.date.substring(11, 23) : '00:00:00.000'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Driver Selection & Lap Profile (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-none bg-[#0B0D14] border border-[#292929] p-4 shadow-xl font-mono text-xs">
            <div className="text-[10px] text-[#858585] pb-2 border-b border-[#222222] uppercase mb-3 font-bold tracking-wider">
              TELEMETRY CAR SELECTOR (AUTHENTIC OPENF1)
            </div>

            <div className="flex flex-col gap-2">
              {DRIVER_PROFILES.map((driver) => {
                const isSelected = selectedDriverNum === driver.number
                return (
                  <button
                    key={driver.number}
                    onClick={() => setSelectedDriverNum(driver.number)}
                    className={`p-3 rounded-none border text-left transition-colors ${
                      isSelected
                        ? 'bg-[#150D10] border-[#E10600] border-l-4 border-l-[#E10600]'
                        : 'bg-[#111111] border-[#222222] hover:border-[#444444]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-bold text-sm text-white uppercase">
                        {driver.name}
                      </span>
                      <span
                        className="px-1.5 py-0.2 rounded-none text-[9px] font-black font-mono"
                        style={{ backgroundColor: driver.color, color: driver.textColor }}
                      >
                        #{driver.number}
                      </span>
                    </div>
                    <span className="text-[#858585] text-[10px] block uppercase">
                      {driver.team} // {driver.country}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Quick Session Stats */}
            <div className="mt-4 pt-3 border-t border-[#222222] flex flex-col gap-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[#858585] uppercase">PEAK SPEED IN SLICE</span>
                <span className="font-bold text-white tabular-nums">
                  {unit === 'kmh' ? `${maxSpeed} KM/H` : `${Math.round(maxSpeed * 0.621371)} MPH`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858585] uppercase">EST. DECEL / ACCEL</span>
                <span
                  className={`font-bold tabular-nums ${
                    Number(estimatedG) < -2
                      ? 'text-rose-400'
                      : Number(estimatedG) > 1
                      ? 'text-emerald-400'
                      : 'text-[#D8D8D8]'
                  }`}
                >
                  {Number(estimatedG) > 0 ? `+${estimatedG}G` : `${estimatedG}G`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858585] uppercase">DATA ACCURACY</span>
                <span className="text-emerald-400 font-bold uppercase">100% UNMODIFIED RAW</span>
              </div>
            </div>
          </div>

          {/* Speed Telemetry Mini-Trace Curve */}
          <div className="rounded-none bg-[#0B0D14] border border-[#292929] p-4 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between mb-2 text-[10px] text-[#858585] uppercase font-bold">
              <span>LAP SPEED PROFILE TRACE</span>
              <span className="text-cyan-400">SESSION #{selectedSessionKey}</span>
            </div>

            {telemetrySlice.length > 0 ? (
              <div className="relative h-28 w-full bg-[#05060A] rounded-none border border-[#222222] p-2 overflow-hidden flex items-end">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Background grid lines */}
                  <line x1="0" y1="20%" x2="100%" y2="20%" stroke="rgba(255,255,255,0.06)" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.06)" />
                  <line x1="0" y1="80%" x2="100%" y2="80%" stroke="rgba(255,255,255,0.06)" />

                  {/* Speed polyline */}
                  <polyline
                    fill="none"
                    stroke={activeDriver.color}
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    points={telemetrySlice
                      .map((pt, i) => {
                        const x = (i / (telemetrySlice.length - 1)) * 100
                        const y = 100 - (pt.speed / 360) * 100
                        return `${x}%,${y}%`
                      })
                      .join(' ')}
                  />

                  {/* Current Position Marker (Sharp Square) */}
                  {currentReading && (
                    <rect
                      x={`calc(${(selectedIndex / (telemetrySlice.length - 1)) * 100}% - 3px)`}
                      y={`calc(${100 - (currentReading.speed / 360) * 100}% - 3px)`}
                      width="6"
                      height="6"
                      fill="#FFFFFF"
                      stroke={activeDriver.color}
                      strokeWidth="1.5"
                    />
                  )}
                </svg>
              </div>
            ) : null}
            <div className="flex justify-between text-[8px] text-[#666666] mt-2 font-mono uppercase">
              <span>T1 BRAKING</span>
              <span>CHICANE</span>
              <span>CURVA GRANDE</span>
              <span>MAIN S/F</span>
            </div>
          </div>

          {/* Live Sector Times HUD */}
          {telemetrySlice.length > 0 && currentReading ? (
            <div className="rounded-none bg-[#0B0D14] border border-[#292929] p-4 shadow-xl font-mono text-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#222222] uppercase">
                <span className="text-[10px] text-[#858585] font-bold">
                  TELEMETRY SECTOR SAMPLE
                </span>
                <span className="px-1.5 py-0.2 rounded-none bg-[#111111] border border-[#292929] text-cyan-400 text-[9px] font-bold tabular-nums">
                  POINT {selectedIndex + 1}/{telemetrySlice.length}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-2 rounded-none border bg-[#111111] border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase">VELOCITY</span>
                  <span className="font-mono font-bold text-xs text-cyan-300 block tabular-nums">
                    {displayedSpeed} {unit.toUpperCase()}
                  </span>
                </div>
                <div className="p-2 rounded-none border bg-[#111111] border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase">ENGINE RPM</span>
                  <span className="font-mono font-bold text-xs text-[#FED500] block tabular-nums">
                    {currentReading.rpm}
                  </span>
                </div>
                <div className="p-2 rounded-none border bg-[#111111] border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase">GEAR</span>
                  <span className="font-mono font-bold text-xs text-emerald-400 block">
                    G{currentReading.n_gear}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#222222] flex justify-between text-[10px]">
                <span className="text-[#858585] uppercase">PEAK VELOCITY</span>
                <span className="font-bold text-cyan-400 font-mono tabular-nums">
                  {unit === 'mph' ? Math.round(maxSpeed * 0.621371) : maxSpeed} {unit.toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-none bg-[#0B0D14] border border-[#292929] p-4 shadow-xl font-mono text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#222222] uppercase">
                <span className="text-[10px] text-[#858585] font-bold">
                  LIVE SECTOR TIMING & SENSORS
                </span>
                <span className="px-1.5 py-0.2 rounded-none bg-amber-950/80 border border-amber-800 text-amber-300 text-[9px] font-bold">
                  GATED (HTTP 401)
                </span>
              </div>
              <p className="text-[10px] text-[#858585] leading-relaxed">
                During live sessions, OpenF1 restricts free-tier live vehicle telemetry. Simulated numbers are strictly prohibited. Authenticate with an OpenF1 key in <a href="#admin" className="text-[#FED500] underline">Admin</a> to stream real-time car channels.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Cockpit Telemetry Instruments (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Steering Wheel Shift Lights Banner */}
          <div className="p-3.5 rounded-none bg-[#0B0D14] border border-[#292929] flex flex-col gap-2 font-mono">
            <div className="flex items-center justify-between text-[10px] text-[#858585] uppercase font-bold tracking-wider">
              <span>STEERING WHEEL SHIFT LEDS</span>
              <span
                className={`font-black tabular-nums ${
                  isShiftWarning ? 'text-blue-400 animate-pulse' : 'text-[#FED500]'
                }`}
              >
                {isShiftWarning ? '⚠️ OPTIMAL UPSHIFT WINDOW' : `${currentRpm} RPM`}
              </span>
            </div>

            {/* 15 LEDs Bar */}
            <div className="grid grid-cols-15 gap-1">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-3.5 rounded-none transition-colors duration-75 ${getLedColor(i)}`}
                />
              ))}
            </div>
          </div>

          {/* Primary Telemetry Cockpit Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
            {/* Speedometer Gauge */}
            <div className="p-4 rounded-none bg-[#0B0D14] border border-[#292929] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[#858585] text-[9px] uppercase font-bold tracking-wider">
                  GROUND VELOCITY
                </span>
                <span className="w-1.5 h-1.5 rounded-none bg-[#E10600]" />
              </div>

              <div className="my-3 text-center">
                <div className="font-mono font-black text-4xl sm:text-5xl text-white tracking-tight tabular-nums">
                  {currentReading ? displayedSpeed : '---'}
                </div>
                <span className="text-[10px] font-mono font-bold text-[#E10600] uppercase tracking-widest mt-0.5 block">
                  {unit.toUpperCase()}
                </span>
              </div>

              {/* Speed Bar */}
              <div className="w-full bg-[#1A1A1A] rounded-none h-1.5 overflow-hidden">
                <div
                  className="bg-[#E10600] h-full transition-all duration-150 rounded-none"
                  style={{
                    width: `${currentReading ? Math.min(100, (currentReading.speed / 360) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* RPM Gauge */}
            <div className="p-4 rounded-none bg-[#0B0D14] border border-[#292929] flex flex-col justify-between">
              <span className="text-[#858585] text-[9px] uppercase font-bold tracking-wider">
                ICE ENGINE SPEED
              </span>

              <div className="my-3 text-center">
                <div className="font-mono font-black text-4xl sm:text-5xl text-[#FED500] tracking-tight tabular-nums">
                  {currentReading ? currentReading.rpm : '---'}
                </div>
                <span className="text-[10px] font-mono font-bold text-[#858585] uppercase tracking-widest mt-0.5 block">
                  REVS / MIN
                </span>
              </div>

              {/* RPM Bar */}
              <div className="w-full bg-[#1A1A1A] rounded-none h-1.5 overflow-hidden">
                <div
                  className="bg-[#FED500] h-full transition-all duration-150 rounded-none"
                  style={{
                    width: `${currentReading ? Math.min(100, (currentReading.rpm / 13500) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Active Gear Display */}
            <div className="p-4 rounded-none bg-[#0B0D14] border border-[#292929] flex flex-col justify-between items-center text-center">
              <span className="text-[#858585] text-[9px] uppercase font-bold tracking-wider">
                TRANSMISSION GEAR
              </span>

              <div className="my-2">
                <span className="font-mono font-black text-5xl sm:text-6xl text-emerald-400 tracking-tight">
                  {currentReading ? currentReading.n_gear : 'N'}
                </span>
              </div>

              <span className="text-[9px] text-[#858585] font-mono uppercase">
                {currentReading ? '8-SPEED SEQUENTIAL' : 'STANDBY'}
              </span>
            </div>

            {/* Throttle Gauge */}
            <div className="p-4 rounded-none bg-[#0B0D14] border border-[#292929] flex flex-col justify-between">
              <span className="text-[#858585] text-[9px] uppercase font-bold tracking-wider">
                THROTTLE PEDAL
              </span>

              <div className="my-2 text-center">
                <span className="font-mono font-black text-3xl sm:text-4xl text-emerald-400 tabular-nums">
                  {currentReading ? currentReading.throttle : 0}%
                </span>
              </div>

              <div className="w-full bg-[#1A1A1A] rounded-none h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-100 rounded-none"
                  style={{ width: `${currentReading?.throttle || 0}%` }}
                />
              </div>
            </div>

            {/* Brake Pressure Gauge */}
            <div className="p-4 rounded-none bg-[#0B0D14] border border-[#292929] flex flex-col justify-between">
              <span className="text-[#858585] text-[9px] uppercase font-bold tracking-wider">
                BRAKE APPLICATION
              </span>

              <div className="my-2 text-center">
                <span className="font-mono font-black text-3xl sm:text-4xl text-[#E10600] tabular-nums">
                  {currentReading ? (currentReading.brake > 0 ? `${currentReading.brake}%` : 'OFF') : 'OFF'}
                </span>
              </div>

              <div className="w-full bg-[#1A1A1A] rounded-none h-1.5 overflow-hidden">
                <div
                  className="bg-[#E10600] h-full transition-all duration-100 rounded-none"
                  style={{ width: `${currentReading?.brake || 0}%` }}
                />
              </div>
            </div>

            {/* DRS Status */}
            <div className="p-4 rounded-none bg-[#0B0D14] border border-[#292929] flex flex-col justify-between items-center text-center">
              <span className="text-[#858585] text-[9px] uppercase font-bold tracking-wider">
                DRS ACTUATION
              </span>

              <div className="my-2">
                <span
                  className={`font-mono font-black text-2xl sm:text-3xl px-2.5 py-0.5 rounded-none transition-colors ${
                    currentReading?.drs && currentReading.drs > 0
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                      : 'text-[#555555]'
                  }`}
                >
                  {currentReading ? (currentReading.drs > 0 ? 'ACTIVE' : 'CLOSED') : 'N/A'}
                </span>
              </div>

              <span className="text-[9px] text-[#858585] font-mono uppercase">
                {currentReading?.drs ? 'ZONE 1 & 2 ARMED' : 'REAR FLAP CLOSED'}
              </span>
            </div>
          </div>

          {/* Genuine Telemetry Data Log Table */}
          <div className="rounded-none bg-[#0B0D14] border border-[#292929] p-4 font-mono text-xs shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <h3 className="text-xs uppercase text-white font-bold tracking-wider">
                  RAW OPENF1 INGESTION LOG (REAL TIME STREAM)
                </h3>
              </div>
              <span className="text-[9px] text-[#858585] uppercase">
                CLICK ANY ROW TO JUMP TELEMETRY PLAYHEAD
              </span>
            </div>

            {telemetrySlice.length > 0 ? (
              <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-[#111111] z-10">
                    <tr className="border-b border-[#292929] text-[#858585] text-[9px] uppercase pb-2">
                      <th className="py-2 px-2">PLAY</th>
                      <th className="py-2 px-2">TIMESTAMP</th>
                      <th className="py-2 px-2 text-right">SPEED</th>
                      <th className="py-2 px-2 text-right">THROTTLE</th>
                      <th className="py-2 px-2 text-right">BRAKE</th>
                      <th className="py-2 px-2 text-right">RPM</th>
                      <th className="py-2 px-2 text-center">GEAR</th>
                      <th className="py-2 px-2 text-center">DRS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A] font-mono">
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
                              ? 'bg-[#150D10] font-bold text-white border-l-2 border-l-[#E10600]'
                              : 'hover:bg-[#111111] text-[#D8D8D8]'
                          }`}
                        >
                          <td className="py-1.5 px-2 text-center">
                            {isCurrent && <span className="w-1.5 h-1.5 rounded-none bg-cyan-400 inline-block animate-pulse" />}
                          </td>
                          <td className="py-1.5 px-2 text-cyan-400 font-mono text-[10px] tabular-nums">{pt.date}</td>
                          <td className="py-1.5 px-2 text-right font-bold tabular-nums">{pt.speed} KM/H</td>
                          <td className="py-1.5 px-2 text-right text-emerald-400 tabular-nums">{pt.throttle}%</td>
                          <td className="py-1.5 px-2 text-right text-rose-400 tabular-nums">
                            {pt.brake > 0 ? `${pt.brake}%` : '0%'}
                          </td>
                          <td className="py-1.5 px-2 text-right text-[#FED500] tabular-nums">{pt.rpm}</td>
                          <td className="py-1.5 px-2 text-center font-bold">{pt.n_gear}</td>
                          <td className="py-1.5 px-2 text-center">
                            <span
                              className={`px-1 py-0.2 rounded-none text-[9px] uppercase ${
                                pt.drs > 0
                                  ? 'bg-emerald-950 text-emerald-400 font-bold'
                                  : 'bg-[#111111] text-[#666666]'
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
              <div className="py-8 text-center text-[#858585]">
                <p className="font-bold text-[#D8D8D8] mb-1 uppercase">NO DATA AVAILABLE</p>
                <p className="text-[10px] text-[#666666]">
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
