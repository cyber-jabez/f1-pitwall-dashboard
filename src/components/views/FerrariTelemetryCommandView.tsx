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
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 select-none">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono">
            <span className="w-2 h-2 rounded-none bg-[#E10600] animate-pulse" />
            <span className="text-xs text-[#E10600] font-bold uppercase tracking-widest">
              CORSE CLIENTI // DUAL-CAR FERRARI PIT WALL TELEMETRY
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            SCUDERIA FERRARI //{' '}
            <ShinyText text="DUAL COMMAND CENTRE" speed={2.2} className="text-[#FED500]" />
          </h1>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <select
            value={selectedSessionKey}
            onChange={(e) => setSelectedSessionKey(Number(e.target.value))}
            className="bg-[#111111] border border-[#292929] px-3 py-2 text-white focus:outline-none focus:border-[#E10600] cursor-pointer rounded-none"
          >
            <option value={11407}>SÃO PAULO GP (#11407) - QUALIFYING ARCHIVE</option>
            <option value={9590}>MONZA GP 2024 (#9590) - VICTORY LAP</option>
            <option value={9472}>SAKHIR GP 2024 (#9472) - OPENF1 CLUSTER</option>
            <option value={9523}>MONACO GP 2024 (#9523) - MONACO WIN</option>
          </select>

          <a
            href="#live-telemetry"
            className="px-4 py-2 bg-[#1B1B1B] border border-[#292929] text-white font-bold uppercase tracking-wider hover:border-[#E10600] transition-colors flex items-center gap-1.5 rounded-none"
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
      <div className="max-w-7xl mx-auto mb-6 p-4 bg-[#111111] border border-[#292929] font-mono text-xs flex flex-wrap items-center justify-between gap-4 rounded-none">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors rounded-none border ${
              isPlaying
                ? 'bg-[#FED500]/15 text-[#FED500] border-[#FED500]/50 hover:bg-[#FED500]/25'
                : 'bg-emerald-500 text-black font-black hover:bg-emerald-400 border-emerald-500'
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
            className="p-2 bg-[#1B1B1B] border border-[#292929] text-[#858585] hover:text-white transition rounded-none"
            title="Reset to Start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selectors */}
          <div className="flex items-center gap-0.5 bg-[#1B1B1B] p-0.5 border border-[#292929] rounded-none">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-1 text-[11px] font-bold transition-colors rounded-none ${
                  playbackSpeed === spd
                    ? 'bg-[#E10600] text-white'
                    : 'text-[#858585] hover:text-white'
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
            <span className="text-[#858585]">DELTA SPEED:</span>
            <span
              className={`font-black tabular-nums ${
                deltaSpeed !== null && deltaSpeed > 0
                  ? 'text-[#E10600]'
                  : deltaSpeed !== null && deltaSpeed < 0
                  ? 'text-[#FED500]'
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
            <span className="text-[#858585]">DELTA RPM:</span>
            <span className="font-bold text-white tabular-nums">
              {deltaRpm !== null ? (deltaRpm > 0 ? `+${deltaRpm}` : deltaRpm) : '---'}
            </span>
          </div>
        </div>

        {/* Scrubber */}
        <div className="w-full flex items-center gap-3 pt-2 border-t border-[#292929]">
          <span className="text-[10px] text-[#858585] whitespace-nowrap tabular-nums">
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
            className="w-full accent-[#E10600] cursor-pointer h-1.5 bg-[#1B1B1B] rounded-none"
          />
          <span className="text-[10px] text-cyan-400 font-mono whitespace-nowrap tabular-nums">
            {leclercPt?.date ? leclercPt.date.substring(11, 23) : '00:00:00.000'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Dual Driver Telemetry Heads-Up Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Driver 1: Charles Leclerc #16 */}
          <div className="p-6 bg-[#111111] border-l-2 border-l-[#E10600] border border-[#292929] flex flex-col justify-between rounded-none">
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#292929]">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 bg-[#E10600] text-white font-mono font-black text-xl flex items-center justify-center rounded-none">
                    16
                  </span>
                  <div>
                    <h2 className="font-display font-black text-2xl text-white uppercase">
                      CHARLES LECLERC
                    </h2>
                    <span className="font-mono text-xs text-[#E10600]">SCUDERIA FERRARI HP</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 border border-emerald-800 rounded-none">
                  {leclercPt ? 'TELEMETRY LIVE' : 'NO DATA'}
                </span>
              </div>

              {/* Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-6 font-mono">
                <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                  <span className="text-[10px] text-[#858585] block">SPEED</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-white tabular-nums">
                    {leclercPt ? leclercPt.speed : '---'}
                  </span>
                  <span className="text-[9px] text-[#E10600] font-bold">KM/H</span>
                </div>
                <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                  <span className="text-[10px] text-[#858585] block">THROTTLE</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-emerald-400 tabular-nums">
                    {leclercPt ? `${leclercPt.throttle}%` : '---'}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold">PEDAL</span>
                </div>
                <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                  <span className="text-[10px] text-[#858585] block">BRAKE</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-red-500 tabular-nums">
                    {leclercPt ? (leclercPt.brake > 0 ? `${leclercPt.brake}%` : '0%') : '---'}
                  </span>
                  <span className="text-[9px] text-red-400 font-bold">PRESSURE</span>
                </div>
                <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                  <span className="text-[10px] text-[#858585] block">GEAR</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-[#FED500] tabular-nums">
                    {leclercPt ? leclercPt.n_gear : '---'}
                  </span>
                  <span className="text-[9px] text-[#FED500] font-bold">RATIO</span>
                </div>
              </div>

              {/* RPM & DRS Bar */}
              <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                <div className="p-3 bg-[#1B1B1B] border border-[#292929] flex justify-between items-center rounded-none">
                  <span className="text-[#858585]">ENGINE RPM</span>
                  <span className="font-bold text-[#FED500] tabular-nums">
                    {leclercPt ? `${leclercPt.rpm} RPM` : '---'}
                  </span>
                </div>
                <div className="p-3 bg-[#1B1B1B] border border-[#292929] flex justify-between items-center rounded-none">
                  <span className="text-[#858585]">DRS REAR FLAP</span>
                  <span
                    className={`font-black ${
                      leclercPt?.drs ? 'text-emerald-400' : 'text-[#858585]'
                    }`}
                  >
                    {leclercPt?.drs ? 'DEPLOYED' : 'CLOSED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#1B1B1B] border border-[#292929] flex justify-between font-mono text-xs mt-2 rounded-none">
              <span className="text-[#858585]">CHANNEL: CAR #16 TELEMETRY</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {leclercPt ? leclercPt.date : 'NO DATA AVAILABLE'}
              </span>
            </div>
          </div>

          {/* Driver 2: Lewis Hamilton #44 */}
          <div className="p-6 bg-[#111111] border-l-2 border-l-[#FED500] border border-[#292929] flex flex-col justify-between rounded-none">
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#292929]">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 bg-[#FED500] text-black font-mono font-black text-xl flex items-center justify-center rounded-none">
                    44
                  </span>
                  <div>
                    <h2 className="font-display font-black text-2xl text-white uppercase">
                      LEWIS HAMILTON
                    </h2>
                    <span className="font-mono text-xs text-[#FED500]">SCUDERIA FERRARI HP</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 border border-emerald-800 rounded-none">
                  {hamiltonPt ? 'TELEMETRY LIVE' : 'NO DATA'}
                </span>
              </div>

              {/* Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-6 font-mono">
                <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                  <span className="text-[10px] text-[#858585] block">SPEED</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-white tabular-nums">
                    {hamiltonPt ? hamiltonPt.speed : '---'}
                  </span>
                  <span className="text-[9px] text-[#FED500] font-bold">KM/H</span>
                </div>
                <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                  <span className="text-[10px] text-[#858585] block">THROTTLE</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-emerald-400 tabular-nums">
                    {hamiltonPt ? `${hamiltonPt.throttle}%` : '---'}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold">PEDAL</span>
                </div>
                <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                  <span className="text-[10px] text-[#858585] block">BRAKE</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-red-500 tabular-nums">
                    {hamiltonPt ? (hamiltonPt.brake > 0 ? `${hamiltonPt.brake}%` : '0%') : '---'}
                  </span>
                  <span className="text-[9px] text-red-400 font-bold">PRESSURE</span>
                </div>
                <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                  <span className="text-[10px] text-[#858585] block">GEAR</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-[#FED500] tabular-nums">
                    {hamiltonPt ? hamiltonPt.n_gear : '---'}
                  </span>
                  <span className="text-[9px] text-[#FED500] font-bold">RATIO</span>
                </div>
              </div>

              {/* RPM & DRS Bar */}
              <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                <div className="p-3 bg-[#1B1B1B] border border-[#292929] flex justify-between items-center rounded-none">
                  <span className="text-[#858585]">ENGINE RPM</span>
                  <span className="font-bold text-[#FED500] tabular-nums">
                    {hamiltonPt ? `${hamiltonPt.rpm} RPM` : '---'}
                  </span>
                </div>
                <div className="p-3 bg-[#1B1B1B] border border-[#292929] flex justify-between items-center rounded-none">
                  <span className="text-[#858585]">DRS REAR FLAP</span>
                  <span
                    className={`font-black ${
                      hamiltonPt?.drs ? 'text-emerald-400' : 'text-[#858585]'
                    }`}
                  >
                    {hamiltonPt?.drs ? 'DEPLOYED' : 'CLOSED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#1B1B1B] border border-[#292929] flex justify-between font-mono text-xs mt-2 rounded-none">
              <span className="text-[#858585]">CHANNEL: CAR #44 TELEMETRY</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {hamiltonPt ? hamiltonPt.date : 'NO DATA AVAILABLE'}
              </span>
            </div>
          </div>
        </div>

        {/* Dual Speed Overlay Trace Graph */}
        <div className="p-6 bg-[#111111] border border-[#292929] font-mono text-xs flex flex-col gap-4 rounded-none">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#292929]">
            <div>
              <span className="text-[#858585] text-[10px] uppercase font-bold tracking-wider block">
                DUAL SPEED OVERLAY COMPARISON TRACE
              </span>
              <span className="text-white font-bold text-sm">
                AUTODROMO NAZIONALE MONZA // TELEMETRY DELTA CURVE
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-none bg-[#E10600]" />
                <span className="text-white font-bold">#16 LECLERC</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-none bg-[#FED500]" />
                <span className="text-white font-bold">#44 HAMILTON</span>
              </div>
            </div>
          </div>

          <div className="relative h-44 w-full bg-[#080808] border border-[#292929] p-3 overflow-hidden flex items-end rounded-none">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <line x1="0" y1="25%" x2="100%" y2="25%" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="75%" x2="100%" y2="75%" stroke="rgba(255,255,255,0.05)" />

              {/* Leclerc Polyline */}
              {leclercTelemetry.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#E10600"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
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
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
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
                <rect
                  x={`${(scrubIndex / (leclercTelemetry.length - 1)) * 100}%`}
                  y={`${100 - (leclercPt.speed / 360) * 100}%`}
                  width="8"
                  height="8"
                  transform="translate(-4, -4)"
                  fill="#FFFFFF"
                  stroke="#E10600"
                  strokeWidth="2"
                />
              )}

              {/* Cursor Hamilton */}
              {hamiltonPt && (
                <rect
                  x={`${(scrubIndex / (hamiltonTelemetry.length - 1)) * 100}%`}
                  y={`${100 - (hamiltonPt.speed / 360) * 100}%`}
                  width="8"
                  height="8"
                  transform="translate(-4, -4)"
                  fill="#FFFFFF"
                  stroke="#FED500"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-[#858585] font-mono">
            <span>VARIANTE DEL RETTIFILO (T1-T2)</span>
            <span>CURVA GRANDE (T3)</span>
            <span>VARIANTE DELLA ROGGIA (T4-T5)</span>
            <span>CURVA DEL VIALONE (ASCARI T8-T10)</span>
            <span>CURVA PARABOLICA ALBORETO (T11)</span>
          </div>
        </div>

        {/* Head-to-Head Ferrari Telemetry Delta Analysis */}
        {leclercPt && hamiltonPt ? (
          <div className="p-6 bg-[#111111] border border-[#292929] font-mono text-xs flex flex-col gap-4 rounded-none">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#292929]">
              <div>
                <span className="text-[#858585] text-[10px] uppercase font-bold tracking-wider block">
                  REAL-TIME HEAD-TO-HEAD DELTA ANALYSIS
                </span>
                <span className="text-white font-bold text-sm">
                  SCUDERIA FERRARI HP // #16 LECLERC vs #44 HAMILTON
                </span>
              </div>
              <span className="px-2.5 py-0.5 border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 font-bold text-[10px] uppercase rounded-none">
                AUTHENTIC OPENF1 TELEMETRY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Speed Delta */}
              <div className="p-4 bg-[#1B1B1B] border border-[#292929] flex flex-col gap-2 rounded-none">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#292929]">
                  <span className="text-[#858585] uppercase font-bold">SPEED DELTA</span>
                  <span className={deltaSpeed && deltaSpeed >= 0 ? 'text-[#E10600] font-bold tabular-nums' : 'text-[#FED500] font-bold tabular-nums'}>
                    {deltaSpeed !== null ? `${deltaSpeed > 0 ? '+' : ''}${deltaSpeed} KM/H` : '---'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#E10600] font-bold">#16 LECLERC</span>
                  <span className="font-mono text-white tabular-nums">{leclercPt.speed} KM/H</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#FED500] font-bold">#44 HAMILTON</span>
                  <span className="font-mono text-white tabular-nums">{hamiltonPt.speed} KM/H</span>
                </div>
              </div>

              {/* Throttle Delta */}
              <div className="p-4 bg-[#1B1B1B] border border-[#292929] flex flex-col gap-2 rounded-none">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#292929]">
                  <span className="text-[#858585] uppercase font-bold">THROTTLE DELTA</span>
                  <span className={deltaThrottle && deltaThrottle >= 0 ? 'text-[#E10600] font-bold tabular-nums' : 'text-[#FED500] font-bold tabular-nums'}>
                    {deltaThrottle !== null ? `${deltaThrottle > 0 ? '+' : ''}${deltaThrottle}%` : '---'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#E10600] font-bold">#16 LECLERC</span>
                  <span className="font-mono text-emerald-400 tabular-nums">{leclercPt.throttle}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#FED500] font-bold">#44 HAMILTON</span>
                  <span className="font-mono text-emerald-400 tabular-nums">{hamiltonPt.throttle}%</span>
                </div>
              </div>

              {/* RPM Delta */}
              <div className="p-4 bg-[#1B1B1B] border border-[#292929] flex flex-col gap-2 rounded-none">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#292929]">
                  <span className="text-[#858585] uppercase font-bold">ENGINE RPM DELTA</span>
                  <span className={deltaRpm && deltaRpm >= 0 ? 'text-[#E10600] font-bold tabular-nums' : 'text-[#FED500] font-bold tabular-nums'}>
                    {deltaRpm !== null ? `${deltaRpm > 0 ? '+' : ''}${deltaRpm} RPM` : '---'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#E10600] font-bold">#16 LECLERC</span>
                  <span className="font-mono text-[#FED500] tabular-nums">{leclercPt.rpm}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#FED500] font-bold">#44 HAMILTON</span>
                  <span className="font-mono text-[#FED500] tabular-nums">{hamiltonPt.rpm}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-[#111111] border border-[#292929] font-mono text-xs flex flex-col gap-4 rounded-none">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#292929]">
              <div>
                <span className="text-[#858585] text-[10px] uppercase font-bold tracking-wider block">
                  HEAD-TO-HEAD FERRARI TELEMETRY DELTA
                </span>
                <span className="text-white font-bold text-sm">
                  SCUDERIA FERRARI HP // #16 LECLERC vs #44 HAMILTON
                </span>
              </div>
              <span className="px-2.5 py-0.5 border border-[#FED500]/40 bg-[#FED500]/15 text-[#FED500] font-bold text-[10px] uppercase rounded-none">
                LIVE SENSOR DATA GATED (HTTP 401)
              </span>
            </div>
            <p className="text-[11px] text-[#858585] leading-relaxed">
              Head-to-head live telemetry channels require an authenticated OpenF1 connection during active sessions. In strict accordance with our Zero Fabrication policy, synthetic or simulated sector comparisons are never manufactured. Authenticate in <a href="#admin" className="text-[#FED500] underline">Settings / Admin</a> to stream real-time car channels.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FerrariTelemetryCommandView