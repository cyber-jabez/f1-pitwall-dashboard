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
      className={`bg-[#0B0D13] border border-[#292929] p-3 font-mono text-xs flex flex-col gap-2.5 rounded-none select-none ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-none ${
              isLive
                ? 'bg-emerald-400 animate-pulse'
                : isBuffering
                ? 'bg-cyan-400 animate-pulse'
                : 'bg-[#FED500] animate-pulse'
            }`}
          />
          <span className="font-display font-black text-xs uppercase tracking-wider text-[#F5F5F5] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#FED500]" />
            <span>TELEMETRY VIDEO SYNC DELAY</span>
          </span>

          {/* Sync Status Badge */}
          <span
            className={`px-2 py-0.5 rounded-none text-[10px] font-bold border uppercase tracking-wider tabular-nums ${
              isLive
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                : isBuffering
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                : 'bg-[#FED500]/15 text-[#FED500] border-[#FED500]/60'
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
          <span className="text-[#858585] hidden sm:inline tabular-nums">
            BUFFER: <strong className="text-white">{bufferStats.bufferedSeconds}s</strong>
          </span>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="p-1 bg-[#1B1B1B] hover:bg-[#292929] border border-[#292929] text-[#858585] hover:text-white transition-colors flex items-center gap-1 rounded-none"
            title="How to sync telemetry with your video stream"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[9px]">HOW TO SYNC</span>
          </button>

          {!isLive && (
            <button
              onClick={() => handleSetDelay(0)}
              className="px-2 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold transition-colors flex items-center gap-1 text-[10px] rounded-none"
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
        <div className="p-2.5 bg-[#111625] border border-cyan-500/30 text-cyan-200/90 text-[11px] leading-relaxed flex flex-col gap-1.5 rounded-none">
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
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#292929]">
        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[#858585] text-[9px] uppercase mr-1 hidden md:inline">PRESETS:</span>
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
              className={`px-2.5 py-1 text-[10px] font-bold tracking-wider transition-colors border rounded-none ${
                delaySeconds === preset.val
                  ? preset.val === 0
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-[#FED500] text-black font-black border-[#FED500]'
                  : 'bg-[#1B1B1B] text-[#858585] hover:text-white border-[#292929]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Nudge Steppers & Manual Second Input */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Stepper Buttons */}
          <div className="flex items-center bg-[#1B1B1B] border border-[#292929] p-0.5 rounded-none">
            <button
              onClick={() => handleAdjust(-5)}
              disabled={delaySeconds <= 0}
              className="px-2 py-0.5 text-[10px] font-bold text-[#D8D8D8] hover:text-white disabled:opacity-30 hover:bg-[#292929] transition-colors rounded-none"
              title="Step -5 seconds"
            >
              -5s
            </button>
            <button
              onClick={() => handleAdjust(-1)}
              disabled={delaySeconds <= 0}
              className="px-2 py-0.5 text-[10px] font-bold text-[#D8D8D8] hover:text-white disabled:opacity-30 hover:bg-[#292929] transition-colors rounded-none"
              title="Step -1 second"
            >
              -1s
            </button>
            <span className="w-px h-3 bg-[#292929] mx-0.5" />
            <button
              onClick={() => handleAdjust(1)}
              disabled={delaySeconds >= 180}
              className="px-2 py-0.5 text-[10px] font-bold text-[#D8D8D8] hover:text-white disabled:opacity-30 hover:bg-[#292929] transition-colors rounded-none"
              title="Step +1 second"
            >
              +1s
            </button>
            <button
              onClick={() => handleAdjust(5)}
              disabled={delaySeconds >= 180}
              className="px-2 py-0.5 text-[10px] font-bold text-[#D8D8D8] hover:text-white disabled:opacity-30 hover:bg-[#292929] transition-colors rounded-none"
              title="Step +5 seconds"
            >
              +5s
            </button>
          </div>

          {/* Exact Seconds Input */}
          <div className="flex items-center gap-1 bg-[#1B1B1B] border border-[#292929] px-2 py-0.5 rounded-none">
            <input
              type="number"
              min={0}
              max={180}
              value={inputVal}
              onChange={handleInputChange}
              className="w-8 bg-transparent text-right font-mono font-bold text-xs text-[#FED500] focus:outline-none tabular-nums rounded-none"
            />
            <span className="text-[10px] text-[#858585] font-bold">SEC</span>
          </div>
        </div>
      </div>

      {/* Scrub Range Slider */}
      {!compact && (
        <div className="flex items-center gap-3 pt-1">
          <span className="text-[9px] text-[#858585] uppercase w-12 shrink-0">0s (LIVE)</span>
          <input
            type="range"
            min={0}
            max={120}
            step={1}
            value={delaySeconds}
            onChange={(e) => handleSetDelay(parseInt(e.target.value, 10))}
            className="flex-1 accent-[#FED500] cursor-pointer h-1.5 bg-[#1B1B1B] rounded-none"
          />
          <span className="text-[9px] text-[#858585] uppercase w-14 shrink-0 text-right">
            120s (2 MIN)
          </span>
        </div>
      )}
    </div>
  )
}
