import React, { useState, useEffect } from 'react'
import {
  openf1LiveClient,
  VERIFIED_BENCHMARK_SESSIONS,
  type OpenF1CarDataPoint,
} from '../../services/openf1LiveClient'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import type { ProvenanceMetadata } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import { Play, Pause, RotateCcw, ChevronLeft, FastForward, Clock, Activity, RefreshCw } from 'lucide-react'

export const TelemetryReplayView: React.FC = () => {
  const [sessionKey, setSessionKey] = useState<number>(9590) // Monza 2024
  const [driverNumber, setDriverNumber] = useState<number>(16) // Leclerc
  const [isPlaying, setIsPlaying] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [telemetry, setTelemetry] = useState<OpenF1CarDataPoint[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [provenance, setProvenance] = useState<ProvenanceMetadata | null>(null)

  const loadData = async () => {
    setLoading(true)
    const res = await openf1LiveClient.fetchCarTelemetrySlice(sessionKey, driverNumber)
    setTelemetry(res.data)
    setProvenance(res.provenance)
    setCurrentIndex(0)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [sessionKey, driverNumber])

  useEffect(() => {
    if (!isPlaying || telemetry.length === 0) return
    const intervalTime = Math.max(100, 600 / playbackSpeed)
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= telemetry.length - 1) {
          return 0 // loop continuously
        }
        return prev + 1
      })
    }, intervalTime)
    return () => clearInterval(timer)
  }, [isPlaying, playbackSpeed, telemetry])

  const currentPt = telemetry[currentIndex] || null

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            OPENF1 HISTORICAL TELEMETRY ENGINE // AUTHENTIC REPLAY
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            HISTORICAL <ShinyText text="TELEMETRY REPLAY" speed={2.5} className="text-ferrari-red" />
          </h1>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <select
            value={sessionKey}
            onChange={(e) => setSessionKey(Number(e.target.value))}
            className="bg-[#0E1118] border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ferrari-red cursor-pointer"
          >
            <option value={9472}>SAKHIR GP 2024 (#9472)</option>
            <option value={9590}>MONZA GP 2024 (#9590)</option>
            <option value={9523}>MONACO GP 2024 (#9523)</option>
          </select>

          <select
            value={driverNumber}
            onChange={(e) => setDriverNumber(Number(e.target.value))}
            className="bg-[#0E1118] border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-ferrari-red cursor-pointer"
          >
            <option value={16}>#16 CHARLES LECLERC</option>
            <option value={44}>#44 LEWIS HAMILTON</option>
          </select>

          <a
            href="#live-telemetry"
            className="px-4 py-2 rounded-xl bg-[#141824] border border-white/20 text-white font-bold uppercase tracking-wider hover:border-ferrari-red transition-all flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>WORKSTATION</span>
          </a>
        </div>
      </div>

      {provenance && (
        <div className="max-w-7xl mx-auto mb-6">
          <DataProvenanceBadge
            provenance={provenance}
            title={`OpenF1 Historical Replay // Session #${sessionKey} Driver #${driverNumber}`}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {telemetry.length > 0 ? (
          <>
            {/* Playback Controls Card */}
            <div className="p-6 rounded-3xl bg-[#0B0D14] border border-ferrari-border/80 shadow-2xl flex flex-col gap-4 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Play/Pause/Reset Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-2xl bg-ferrari-red hover:bg-[#E60000] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false)
                      setCurrentIndex(0)
                    }}
                    className="w-10 h-10 rounded-xl bg-[#151924] hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                    title="Rewind to start"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Speed Multiplier */}
                  <div className="flex items-center gap-1 bg-[#121520] p-1 rounded-xl border border-white/10">
                    {[1, 2, 4].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${
                          playbackSpeed === spd ? 'bg-ferrari-red text-white font-bold' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {spd}X
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-neutral-400">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>RECORDED TIME:</span>
                  <span className="font-bold text-white">{currentPt?.date || 'N/A'}</span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="flex items-center gap-4 pt-2">
                <input
                  type="range"
                  min="0"
                  max={telemetry.length - 1}
                  value={currentIndex}
                  onChange={(e) => {
                    setIsPlaying(false)
                    setCurrentIndex(Number(e.target.value))
                  }}
                  className="w-full accent-ferrari-red cursor-pointer"
                />
                <span className="text-white/40 whitespace-nowrap">
                  {currentIndex + 1} / {telemetry.length}
                </span>
              </div>
            </div>

            {/* Ingested Live Readings HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
              <div className="p-5 rounded-2xl bg-[#0B0D14] border border-white/10">
                <span className="text-white/40 text-[10px] block uppercase">SPEED</span>
                <span className="font-display font-black text-3xl sm:text-4xl text-white">
                  {currentPt ? currentPt.speed : 'N/A'}
                </span>
                <span className="text-[10px] text-ferrari-yellow block mt-1">KM/H</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B0D14] border border-white/10">
                <span className="text-white/40 text-[10px] block uppercase">THROTTLE</span>
                <span className="font-display font-black text-3xl sm:text-4xl text-emerald-400">
                  {currentPt ? `${currentPt.throttle}%` : 'N/A'}
                </span>
                <span className="text-[10px] text-white/40 block mt-1">POSITION</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B0D14] border border-white/10">
                <span className="text-white/40 text-[10px] block uppercase">BRAKE</span>
                <span className="font-display font-black text-3xl sm:text-4xl text-red-500">
                  {currentPt ? (currentPt.brake > 0 ? `${currentPt.brake}%` : 'OFF') : 'N/A'}
                </span>
                <span className="text-[10px] text-white/40 block mt-1">PRESSURE</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B0D14] border border-white/10">
                <span className="text-white/40 text-[10px] block uppercase">ENGINE RPM</span>
                <span className="font-display font-black text-3xl sm:text-4xl text-ferrari-yellow">
                  {currentPt ? currentPt.rpm : 'N/A'}
                </span>
                <span className="text-[10px] text-white/40 block mt-1">GEAR {currentPt?.n_gear ?? 'N/A'}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="p-16 rounded-3xl bg-[#0B0D14] border border-white/10 text-center font-mono">
            <Activity className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="font-bold text-white text-lg mb-1">NO HISTORICAL TELEMETRY LOG LOADED</h3>
            <p className="text-neutral-400 text-xs max-w-md mx-auto">
              OpenF1 returned no recorded points for this session filter. Try selecting another session key from the dropdown above.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TelemetryReplayView
