import React, { useState, useEffect } from 'react'
import {
  telemetryDelayService,
  type DelayQueryResult,
} from '../../services/telemetryDelayService'
import {
  Clock,
  Radio,
  RotateCcw,
  Sliders,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

interface TelemetryDelayControllerProps {
  className?: string
  compact?: boolean
  onDelayChange?: (delaySeconds: number) => void
}

export const TelemetryDelayController: React.FC<TelemetryDelayControllerProps> = ({
  className = '',
  compact = false,
  onDelayChange,
}) => {
  const [delaySeconds, setDelaySeconds] = useState<number>(telemetryDelayService.getDelay())
  const [bufferStats, setBufferStats] = useState(telemetryDelayService.getBufferStats())
  const [showGuide, setShowGuide] = useState<boolean>(false)
  const [inputVal, setInputVal] = useState<string>(String(telemetryDelayService.getDelay()))

  // Subscribe to external service changes
  useEffect(() => {
    const unsubscribe = telemetryDelayService.subscribe((newDelay) => {
      setDelaySeconds(newDelay)
      setInputVal(String(newDelay))
      if (onDelayChange) onDelayChange(newDelay)
    })

    // Poll buffer stats every second
    const statsTimer = setInterval(() => {
      setBufferStats(telemetryDelayService.getBufferStats())
    }, 1000)

    return () => {
      unsubscribe()
      clearInterval(statsTimer)
    }
  }, [onDelayChange])

  const handleSetDelay = (val: number) => {
    const clamped = Math.max(0, Math.min(180, Math.round(val)))
    telemetryDelayService.setDelay(clamped)
    setDelaySeconds(clamped)
    setInputVal(String(clamped))
    if (onDelayChange) onDelayChange(clamped)
  }

  const handleAdjust = (delta: number) => {
    handleSetDelay(delaySeconds + delta)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value)
    const parsed = parseInt(e.target.value, 10)
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 180) {
      telemetryDelayService.setDelay(parsed)
      setDelaySeconds(parsed)
      if (onDelayChange) onDelayChange(parsed)
    }
  }

  const isLive = delaySeconds === 0
  const isBuffering = delaySeconds > bufferStats.bufferedSeconds

  return (
    <div
      className={`rounded-2xl bg-[#090C14] border border-white/10 p-3 shadow-xl font-mono text-xs flex flex-col gap-2.5 ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isLive
                ? 'bg-emerald-400 animate-ping'
                : isBuffering
                ? 'bg-cyan-400 animate-pulse'
                : 'bg-amber-400 animate-pulse'
            }`}
          />
          <span className="font-display font-black text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-ferrari-yellow" />
            <span>TELEMETRY VIDEO SYNC DELAY</span>
          </span>

          {/* Sync Status Badge */}
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
              isLive
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                : isBuffering
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                : 'bg-amber-950/80 text-amber-300 border-amber-800'
            }`}
          >
            {isLive
              ? 'LIVE INSTANT (0s)'
              : isBuffering
              ? `BUFFERING (${bufferStats.bufferedSeconds}s / ${delaySeconds}s)`
              : `SYNCED (-${delaySeconds}s DELAY)`}
          </span>
        </div>

        {/* Buffer Health & Help Toggle */}
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-white/40 hidden sm:inline">
            BUFFER: <strong className="text-white">{bufferStats.bufferedSeconds}s</strong>
          </span>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition flex items-center gap-1"
            title="How to sync telemetry with your video stream"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[9px]">HOW TO SYNC</span>
          </button>

          {!isLive && (
            <button
              onClick={() => handleSetDelay(0)}
              className="px-2 py-0.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold transition flex items-center gap-1 text-[10px]"
              title="Reset telemetry delay to 0 (Instantaneous Live)"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET LIVE</span>
            </button>
          )}
        </div>
      </div>

      {/* Sync Guide Explanation Dropdown */}
      {showGuide && (
        <div className="p-2.5 rounded-xl bg-[#0D121F] border border-cyan-500/30 text-cyan-200/90 text-[11px] leading-relaxed flex flex-col gap-1.5 animate-fadeIn">
          <div className="flex items-center gap-1.5 font-bold text-cyan-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>HOW TO MATCH TELEMETRY TO YOUR VIDEO STREAM:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-white/80 text-[10px]">
            <li>
              Live internet video streams (HLS/IPTV/CDN) are usually <strong>15 to 45 seconds</strong> behind real time.
            </li>
            <li>
              Pick a quick preset (e.g. <strong>30s</strong>) to start.
            </li>
            <li>
              Watch for an event on video (a car passing start/finish or setting a purple sector). Use <strong>[+1s] / [-1s]</strong> until the timing tower updates at the exact second the car crosses the line.
            </li>
            <li>
              Once matched, timing positions, sector flags, radio audio, and telemetry will replay in 100% lockstep with your video!
            </li>
          </ol>
        </div>
      )}

      {/* Main Controls: Quick Presets, Steppers, & Direct Input */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-white/40 text-[9px] uppercase mr-1 hidden md:inline">PRESETS:</span>
          {[
            { label: 'LIVE (0s)', val: 0 },
            { label: '15s', val: 15 },
            { label: '30s', val: 30 },
            { label: '45s', val: 45 },
            { label: '60s', val: 60 },
            { label: '90s', val: 90 },
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => handleSetDelay(preset.val)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
                delaySeconds === preset.val
                  ? preset.val === 0
                    ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-black/40 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Nudge Steppers & Manual Second Input */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Stepper Buttons */}
          <div className="flex items-center bg-black/60 rounded-lg border border-white/10 p-0.5">
            <button
              onClick={() => handleAdjust(-5)}
              disabled={delaySeconds <= 0}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white/70 hover:text-white disabled:opacity-30 hover:bg-white/10 transition"
              title="Step -5 seconds"
            >
              -5s
            </button>
            <button
              onClick={() => handleAdjust(-1)}
              disabled={delaySeconds <= 0}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white/70 hover:text-white disabled:opacity-30 hover:bg-white/10 transition"
              title="Step -1 second"
            >
              -1s
            </button>
            <span className="w-px h-3 bg-white/10 mx-0.5" />
            <button
              onClick={() => handleAdjust(1)}
              disabled={delaySeconds >= 180}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white/70 hover:text-white disabled:opacity-30 hover:bg-white/10 transition"
              title="Step +1 second"
            >
              +1s
            </button>
            <button
              onClick={() => handleAdjust(5)}
              disabled={delaySeconds >= 180}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white/70 hover:text-white disabled:opacity-30 hover:bg-white/10 transition"
              title="Step +5 seconds"
            >
              +5s
            </button>
          </div>

          {/* Exact Seconds Input */}
          <div className="flex items-center gap-1 bg-black/60 rounded-lg border border-white/10 px-2 py-0.5">
            <input
              type="number"
              min={0}
              max={180}
              value={inputVal}
              onChange={handleInputChange}
              className="w-8 bg-transparent text-right font-mono font-bold text-xs text-amber-300 focus:outline-none"
            />
            <span className="text-[10px] text-white/40 font-bold">SEC</span>
          </div>
        </div>
      </div>

      {/* Scrub Range Slider */}
      {!compact && (
        <div className="flex items-center gap-3 pt-1">
          <span className="text-[9px] text-white/40 uppercase w-12 shrink-0">0s (LIVE)</span>
          <input
            type="range"
            min={0}
            max={120}
            step={1}
            value={delaySeconds}
            onChange={(e) => handleSetDelay(parseInt(e.target.value, 10))}
            className="flex-1 accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
          <span className="text-[9px] text-white/40 uppercase w-14 shrink-0 text-right">
            120s (2 MIN)
          </span>
        </div>
      )}
    </div>
  )
}
