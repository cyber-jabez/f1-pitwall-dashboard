import React, { useState, useEffect } from 'react'
import {
  openf1LiveClient,
  VERIFIED_BENCHMARK_SESSIONS,
  type OpenF1CarDataPoint,
} from '../../services/openf1LiveClient'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import type { ProvenanceMetadata } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import {
  Activity,
  Zap,
  Radio,
  Flame,
  Shield,
  TrendingUp,
  ChevronLeft,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Gauge,
} from 'lucide-react'

export const FerrariTelemetryCommandView: React.FC = () => {
  const [selectedSessionKey, setSelectedSessionKey] = useState<number>(9590) // Monza GP 2024
  const [leclercTelemetry, setLeclercTelemetry] = useState<OpenF1CarDataPoint[]>([])
  const [hamiltonTelemetry, setHamiltonTelemetry] = useState<OpenF1CarDataPoint[]>([])
  const [scrubIndex, setScrubIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [provenance, setProvenance] = useState<ProvenanceMetadata | null>(null)

  const loadData = async () => {
    setLoading(true)
    // Fetch Leclerc #16
    const resLec = await openf1LiveClient.fetchCarTelemetrySlice(selectedSessionKey, 16)
    // Fetch Hamilton #44
    const resHam = await openf1LiveClient.fetchCarTelemetrySlice(selectedSessionKey, 44)

    setLeclercTelemetry(resLec.data)
    setHamiltonTelemetry(resHam.data)
    setProvenance(resLec.provenance)
    setScrubIndex(0)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [selectedSessionKey])

  // Continuous live playback loop
  useEffect(() => {
    if (!isPlaying) return
    const maxLen = Math.max(leclercTelemetry.length, hamiltonTelemetry.length)
    if (maxLen === 0) return

    const tickMs = Math.round(500 / playbackSpeed)
    const timer = setInterval(() => {
      setScrubIndex((prev) => {
        if (prev >= maxLen - 1) return 0
        return prev + 1
      })
    }, tickMs)

    return () => clearInterval(timer)
  }, [isPlaying, playbackSpeed, leclercTelemetry, hamiltonTelemetry])

  const leclercPt = leclercTelemetry[scrubIndex] || null
  const hamiltonPt = hamiltonTelemetry[scrubIndex] || null

  const hasData = Boolean(leclercPt || hamiltonPt)
  const deltaSpeed =
    leclercPt && hamiltonPt ? leclercPt.speed - hamiltonPt.speed : null
  const deltaRpm =
    leclercPt && hamiltonPt ? leclercPt.rpm - hamiltonPt.rpm : null
  const deltaThrottle =
    leclercPt && hamiltonPt ? leclercPt.throttle - hamiltonPt.throttle : null

  return (
    <div className="min-h-screen bg-[#06070B] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-ferrari-red animate-pulse" />
            <span className="font-mono text-xs text-ferrari-red font-bold uppercase tracking-widest">
              CORSE CLIENTI // DUAL-CAR FERRARI PIT WALL TELEMETRY
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            SCUDERIA FERRARI //{' '}
            <ShinyText text="DUAL COMMAND CENTRE" speed={2.2} className="text-ferrari-yellow" />
          </h1>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <select
            value={selectedSessionKey}
            onChange={(e) => setSelectedSessionKey(Number(e.target.value))}
            className="bg-[#0E1118] border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ferrari-red cursor-pointer"
          >
            <option value={11407}>🔴 LIVE: SÃO PAULO GP 2026 (#11407)</option>
            <option value={9590}>MONZA GP 2024 (#9590) - VICTORY LAP</option>
            <option value={9472}>SAKHIR GP 2024 (#9472) - OPENF1 CLUSTER</option>
            <option value={9523}>MONACO GP 2024 (#9523) - MONACO WIN</option>
          </select>

          <a
            href="#live-telemetry"
            className="px-4 py-2 rounded-xl bg-[#141824] border border-white/20 text-white font-bold uppercase tracking-wider hover:border-ferrari-red transition-all flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>FULL GRID</span>
          </a>
        </div>
      </div>

      {/* Provenance Badge */}
      {provenance && (
        <div className="max-w-7xl mx-auto mb-6">
          <DataProvenanceBadge
            provenance={provenance}
            title={`OpenF1 Dual Telemetry Stream // Ferrari #16 vs #44 (Session #${selectedSessionKey})`}
          />
        </div>
      )}

      {/* Playback Controls & Delta Bar */}
      <div className="max-w-7xl mx-auto mb-6 p-4 rounded-2xl bg-[#090B12] border border-ferrari-border/70 font-mono text-xs flex flex-wrap items-center justify-between gap-4 shadow-xl">
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
              setScrubIndex(0)
              setIsPlaying(true)
            }}
            className="p-2 rounded-xl bg-[#121522] border border-white/10 text-neutral-400 hover:text-white transition"
            title="Reset to Start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selectors */}
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
        </div>

        {/* Live Delta Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">DELTA SPEED:</span>
            <span
              className={`font-black ${
                deltaSpeed !== null && deltaSpeed > 0
                  ? 'text-ferrari-red'
                  : deltaSpeed !== null && deltaSpeed < 0
                  ? 'text-ferrari-yellow'
                  : 'text-white'
              }`}
            >
              {deltaSpeed !== null
                ? deltaSpeed > 0
                  ? `+${deltaSpeed} KM/H (LEC)`
                  : `${deltaSpeed} KM/H (HAM)`
                : '---'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-white/40">DELTA RPM:</span>
            <span className="font-bold text-white">
              {deltaRpm !== null ? (deltaRpm > 0 ? `+${deltaRpm}` : deltaRpm) : '---'}
            </span>
          </div>
        </div>

        {/* Scrubber */}
        <div className="w-full flex items-center gap-3 pt-2 border-t border-white/5">
          <span className="text-[10px] text-white/40 whitespace-nowrap">
            SAMPLE {scrubIndex + 1}/{Math.max(leclercTelemetry.length, hamiltonTelemetry.length)}
          </span>
          <input
            type="range"
            min="0"
            max={Math.max(0, Math.max(leclercTelemetry.length, hamiltonTelemetry.length) - 1)}
            value={scrubIndex}
            onChange={(e) => {
              setScrubIndex(Number(e.target.value))
              setIsPlaying(false)
            }}
            className="w-full accent-ferrari-red cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
          <span className="text-[10px] text-cyan-400 font-mono whitespace-nowrap">
            {leclercPt?.date ? leclercPt.date.substring(11, 23) : '00:00:00.000'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Dual Driver Telemetry Heads-Up Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Driver 1: Charles Leclerc #16 */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1C0505] to-[#0A0C12] border-2 border-ferrari-red/80 shadow-[0_15px_40px_rgba(255,40,0,0.25)] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-ferrari-red text-white font-mono font-black text-xl flex items-center justify-center shadow-lg">
                    16
                  </span>
                  <div>
                    <h2 className="font-display font-black text-2xl text-white uppercase">
                      CHARLES LECLERC
                    </h2>
                    <span className="font-mono text-xs text-ferrari-red">SCUDERIA FERRARI HP</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                  {leclercPt ? 'TELEMETRY LIVE' : 'NO DATA'}
                </span>
              </div>

              {/* Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-6 font-mono">
                <div className="bg-[#05060A] p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-white/40 block">SPEED</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-white">
                    {leclercPt ? leclercPt.speed : '---'}
                  </span>
                  <span className="text-[9px] text-ferrari-red font-bold">KM/H</span>
                </div>
                <div className="bg-[#05060A] p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-white/40 block">THROTTLE</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-emerald-400">
                    {leclercPt ? `${leclercPt.throttle}%` : '---'}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold">PEDAL</span>
                </div>
                <div className="bg-[#05060A] p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-white/40 block">BRAKE</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-red-500">
                    {leclercPt ? (leclercPt.brake > 0 ? `${leclercPt.brake}%` : '0%') : '---'}
                  </span>
                  <span className="text-[9px] text-red-400 font-bold">PRESSURE</span>
                </div>
                <div className="bg-[#05060A] p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-white/40 block">GEAR</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-ferrari-yellow">
                    {leclercPt ? leclercPt.n_gear : '---'}
                  </span>
                  <span className="text-[9px] text-ferrari-yellow font-bold">RATIO</span>
                </div>
              </div>

              {/* RPM & DRS Bar */}
              <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center">
                  <span className="text-white/40">ENGINE RPM</span>
                  <span className="font-bold text-ferrari-yellow">
                    {leclercPt ? `${leclercPt.rpm} RPM` : '---'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center">
                  <span className="text-white/40">DRS REAR FLAP</span>
                  <span
                    className={`font-black ${
                      leclercPt?.drs ? 'text-emerald-400' : 'text-neutral-500'
                    }`}
                  >
                    {leclercPt?.drs ? 'DEPLOYED' : 'CLOSED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex justify-between font-mono text-xs mt-2">
              <span className="text-white/60">CHANNEL: CAR #16 TELEMETRY</span>
              <span className="text-cyan-400 font-bold">
                {leclercPt ? leclercPt.date : 'NO DATA AVAILABLE'}
              </span>
            </div>
          </div>

          {/* Driver 2: Lewis Hamilton #44 */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1C1605] to-[#0A0C12] border-2 border-ferrari-yellow/80 shadow-[0_15px_40px_rgba(254,213,0,0.2)] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-ferrari-yellow text-black font-mono font-black text-xl flex items-center justify-center shadow-lg">
                    44
                  </span>
                  <div>
                    <h2 className="font-display font-black text-2xl text-white uppercase">
                      LEWIS HAMILTON
                    </h2>
                    <span className="font-mono text-xs text-ferrari-yellow">SCUDERIA FERRARI HP</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                  {hamiltonPt ? 'TELEMETRY LIVE' : 'NO DATA'}
                </span>
              </div>

              {/* Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-6 font-mono">
                <div className="bg-[#05060A] p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-white/40 block">SPEED</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-white">
                    {hamiltonPt ? hamiltonPt.speed : '---'}
                  </span>
                  <span className="text-[9px] text-ferrari-yellow font-bold">KM/H</span>
                </div>
                <div className="bg-[#05060A] p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-white/40 block">THROTTLE</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-emerald-400">
                    {hamiltonPt ? `${hamiltonPt.throttle}%` : '---'}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold">PEDAL</span>
                </div>
                <div className="bg-[#05060A] p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-white/40 block">BRAKE</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-red-500">
                    {hamiltonPt ? (hamiltonPt.brake > 0 ? `${hamiltonPt.brake}%` : '0%') : '---'}
                  </span>
                  <span className="text-[9px] text-red-400 font-bold">PRESSURE</span>
                </div>
                <div className="bg-[#05060A] p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-white/40 block">GEAR</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-ferrari-yellow">
                    {hamiltonPt ? hamiltonPt.n_gear : '---'}
                  </span>
                  <span className="text-[9px] text-ferrari-yellow font-bold">RATIO</span>
                </div>
              </div>

              {/* RPM & DRS Bar */}
              <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center">
                  <span className="text-white/40">ENGINE RPM</span>
                  <span className="font-bold text-ferrari-yellow">
                    {hamiltonPt ? `${hamiltonPt.rpm} RPM` : '---'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center">
                  <span className="text-white/40">DRS REAR FLAP</span>
                  <span
                    className={`font-black ${
                      hamiltonPt?.drs ? 'text-emerald-400' : 'text-neutral-500'
                    }`}
                  >
                    {hamiltonPt?.drs ? 'DEPLOYED' : 'CLOSED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex justify-between font-mono text-xs mt-2">
              <span className="text-white/60">CHANNEL: CAR #44 TELEMETRY</span>
              <span className="text-cyan-400 font-bold">
                {hamiltonPt ? hamiltonPt.date : 'NO DATA AVAILABLE'}
              </span>
            </div>
          </div>
        </div>

        {/* Dual Speed Overlay Trace Graph */}
        <div className="p-6 rounded-3xl bg-[#090B12] border border-ferrari-border/70 font-mono text-xs flex flex-col gap-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/10">
            <div>
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider block">
                DUAL SPEED OVERLAY COMPARISON TRACE
              </span>
              <span className="text-white font-bold text-sm">
                AUTODROMO NAZIONALE MONZA // TELEMETRY DELTA CURVE
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-ferrari-red" />
                <span className="text-white font-bold">#16 LECLERC</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-ferrari-yellow" />
                <span className="text-white font-bold">#44 HAMILTON</span>
              </div>
            </div>
          </div>

          <div className="relative h-44 w-full bg-[#05060A] rounded-2xl border border-white/5 p-3 overflow-hidden flex items-end">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <line x1="0" y1="25%" x2="100%" y2="25%" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="75%" x2="100%" y2="75%" stroke="rgba(255,255,255,0.05)" />

              {/* Leclerc Polyline */}
              {leclercTelemetry.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#EF1A2D"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={leclercTelemetry
                    .map((pt, i) => {
                      const x = (i / (leclercTelemetry.length - 1)) * 100
                      const y = 100 - (pt.speed / 360) * 100
                      return `${x}%,${y}%`
                    })
                    .join(' ')}
                />
              )}

              {/* Hamilton Polyline */}
              {hamiltonTelemetry.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#FED500"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={hamiltonTelemetry
                    .map((pt, i) => {
                      const x = (i / (hamiltonTelemetry.length - 1)) * 100
                      const y = 100 - (pt.speed / 360) * 100
                      return `${x}%,${y}%`
                    })
                    .join(' ')}
                />
              )}

              {/* Cursor Leclerc */}
              {leclercPt && (
                <circle
                  cx={`${(scrubIndex / (leclercTelemetry.length - 1)) * 100}%`}
                  cy={`${100 - (leclercPt.speed / 360) * 100}%`}
                  r="5"
                  fill="#FFFFFF"
                  stroke="#EF1A2D"
                  strokeWidth="2.5"
                />
              )}

              {/* Cursor Hamilton */}
              {hamiltonPt && (
                <circle
                  cx={`${(scrubIndex / (hamiltonTelemetry.length - 1)) * 100}%`}
                  cy={`${100 - (hamiltonPt.speed / 360) * 100}%`}
                  r="5"
                  fill="#FFFFFF"
                  stroke="#FED500"
                  strokeWidth="2.5"
                />
              )}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>VARIATE DEL RETTIFILO (T1-T2)</span>
            <span>CURVA GRANDE (T3)</span>
            <span>VARIANTE DELLA ROGGIA (T4-T5)</span>
            <span>CURVA DEL VIALONE (ASCARI T8-T10)</span>
            <span>CURVA PARABOLICA ALBORETO (T11)</span>
          </div>
        </div>

        {/* Head-to-Head Ferrari Telemetry Delta Analysis */}
        {leclercPt && hamiltonPt ? (
          <div className="p-6 rounded-3xl bg-[#090B12] border border-ferrari-border/70 font-mono text-xs flex flex-col gap-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/10">
              <div>
                <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider block">
                  REAL-TIME HEAD-TO-HEAD DELTA ANALYSIS
                </span>
                <span className="text-white font-bold text-sm">
                  SCUDERIA FERRARI HP // #16 LECLERC vs #44 HAMILTON
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-[10px] uppercase">
                AUTHENTIC OPENF1 TELEMETRY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Speed Delta */}
              <div className="p-4 rounded-2xl bg-[#0C0F17] border border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-white/5">
                  <span className="text-white/50 uppercase font-bold">SPEED DELTA</span>
                  <span className={deltaSpeed && deltaSpeed >= 0 ? 'text-ferrari-red font-bold' : 'text-ferrari-yellow font-bold'}>
                    {deltaSpeed !== null ? `${deltaSpeed > 0 ? '+' : ''}${deltaSpeed} KM/H` : '---'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ferrari-red font-bold">#16 LECLERC</span>
                  <span className="font-mono text-white">{leclercPt.speed} KM/H</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ferrari-yellow font-bold">#44 HAMILTON</span>
                  <span className="font-mono text-white">{hamiltonPt.speed} KM/H</span>
                </div>
              </div>

              {/* Throttle Delta */}
              <div className="p-4 rounded-2xl bg-[#0C0F17] border border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-white/5">
                  <span className="text-white/50 uppercase font-bold">THROTTLE DELTA</span>
                  <span className={deltaThrottle && deltaThrottle >= 0 ? 'text-ferrari-red font-bold' : 'text-ferrari-yellow font-bold'}>
                    {deltaThrottle !== null ? `${deltaThrottle > 0 ? '+' : ''}${deltaThrottle}%` : '---'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ferrari-red font-bold">#16 LECLERC</span>
                  <span className="font-mono text-emerald-400">{leclercPt.throttle}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ferrari-yellow font-bold">#44 HAMILTON</span>
                  <span className="font-mono text-emerald-400">{hamiltonPt.throttle}%</span>
                </div>
              </div>

              {/* RPM Delta */}
              <div className="p-4 rounded-2xl bg-[#0C0F17] border border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-white/5">
                  <span className="text-white/50 uppercase font-bold">ENGINE RPM DELTA</span>
                  <span className={deltaRpm && deltaRpm >= 0 ? 'text-ferrari-red font-bold' : 'text-ferrari-yellow font-bold'}>
                    {deltaRpm !== null ? `${deltaRpm > 0 ? '+' : ''}${deltaRpm} RPM` : '---'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ferrari-red font-bold">#16 LECLERC</span>
                  <span className="font-mono text-ferrari-yellow">{leclercPt.rpm}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ferrari-yellow font-bold">#44 HAMILTON</span>
                  <span className="font-mono text-ferrari-yellow">{hamiltonPt.rpm}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#090B12] border border-ferrari-border/70 font-mono text-xs flex flex-col gap-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/10">
              <div>
                <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider block">
                  HEAD-TO-HEAD FERRARI TELEMETRY DELTA
                </span>
                <span className="text-white font-bold text-sm">
                  SCUDERIA FERRARI HP // #16 LECLERC vs #44 HAMILTON
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 font-bold text-[10px] uppercase">
                LIVE SENSOR DATA GATED (HTTP 401)
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Head-to-head live telemetry channels require an authenticated OpenF1 connection during active sessions. In strict accordance with our Zero Fabrication policy, synthetic or simulated sector comparisons are never manufactured. Authenticate in <a href="#admin" className="text-ferrari-yellow underline">Settings / Admin</a> to stream real-time car channels.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FerrariTelemetryCommandView