import React, { useState, useEffect } from 'react'
import { Activity, Shield, Zap, Flame, CheckCircle2, ChevronRight } from 'lucide-react'

interface MotorsportSplashScreenProps {
  onComplete: () => void
}

interface BootStep {
  label: string
  code: string
  detail: string
}

const BOOT_STEPS: BootStep[] = [
  {
    code: 'BUS_INIT',
    label: 'SECU HARNESS & CORE ARCHITECTURE INITIALIZED',
    detail: 'Telemetry buffers, data provenance protocols and clock sync online.',
  },
  {
    code: 'SIGNALR_SYNC',
    label: 'FOM SIGNALR LIVE TIMING DAEMON SYNCHRONIZED',
    detail: 'Connecting to livetiming.formula1.com/signalrcore on port 3001.',
  },
  {
    code: 'RADAR_CALIBRATE',
    label: 'AUTÓDROMO JOSÉ CARLOS PACE 2D GPS SPLINE CALIBRATED',
    detail: 'S1, S2, S3 coordinates & speed trap intermediate telemetry mapped.',
  },
  {
    code: 'POWERTRAIN_ENGAGE',
    label: 'PIRELLI 4-WHEEL THERMAL & 1.6L TURBO ICE ENGINE ENGAGED',
    detail: 'Brembo carbon-carbon brake and powertrain heat dissipation calibrated.',
  },
  {
    code: 'COCKPIT_READY',
    label: 'CORSE CLIENTI RACE OPERATIONS COMMAND CENTER ENGAGED',
    detail: 'All telemetry workstations, audio radio streams, and live video ready.',
  },
]

export const MotorsportSplashScreen: React.FC<MotorsportSplashScreenProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [progress, setProgress] = useState<number>(10)
  const [isFinishing, setIsFinishing] = useState<boolean>(false)

  // Step-by-step diagnostic sequence
  useEffect(() => {
    const stepDuration = 450 // ms per diagnostic check
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1
        if (next < BOOT_STEPS.length) {
          setProgress(Math.round(((next + 1) / BOOT_STEPS.length) * 100))
          return next
        } else {
          clearInterval(interval)
          setProgress(100)
          setIsFinishing(true)
          setTimeout(() => {
            onComplete()
          }, 350)
          return prev
        }
      });
    }, stepDuration)

    return () => clearInterval(interval)
  }, [onComplete])

  // Allow instant skip with keyboard (Space / Enter / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        onComplete()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#07080C] text-white flex flex-col justify-between p-6 sm:p-12 font-mono select-none transition-opacity duration-500 ${
        isFinishing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#E10600] flex items-center justify-center font-display font-black text-white text-base shadow-[0_0_12px_rgba(225,6,0,0.6)] rounded-none">
            SF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E10600] animate-pulse rounded-none" />
              <span className="text-[10px] text-[#E10600] font-black uppercase tracking-widest">
                SCUDERIA FERRARI // CORSE CLIENTI
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-display font-black text-white tracking-wider uppercase">
              F1 PIT WALL TELEMETRY COCKPIT
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#111111] border border-[#292929] rounded-none">
            <span className="text-[#858585] text-[10px] uppercase">BUILD:</span>
            <span className="text-[#FED500] font-bold text-[10px] tabular-nums">2026.11.ENGINEERING</span>
          </div>

          <button
            onClick={onComplete}
            className="px-3 py-1 bg-[#1B1B1B] hover:bg-[#E10600] border border-[#292929] text-[#D8D8D8] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 rounded-none cursor-pointer"
          >
            <span>SKIP BOOT</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Center Console / Diagnostic Boot Readout */}
      <div className="relative z-10 max-w-3xl mx-auto w-full my-auto py-8">
        <div className="flex items-center gap-2 mb-2 font-display text-xs text-[#FED500] font-bold tracking-widest uppercase">
          <Activity className="w-4 h-4 text-[#FED500] animate-pulse" />
          <span>DIAGNOSTIC BOOT SEQUENCE // STEP {currentStepIndex + 1} OF {BOOT_STEPS.length}</span>
        </div>

        <div className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight mb-6">
          {BOOT_STEPS[currentStepIndex]?.label || 'RACE TELEMETRY READY'}
        </div>

        {/* Progress Bar with Racing Red & Yellow Accent */}
        <div className="w-full bg-[#111111] border border-[#292929] p-1 mb-3 rounded-none">
          <div
            className="h-3 bg-gradient-to-r from-[#E10600] via-[#CD212A] to-[#FED500] transition-all duration-300 shadow-[0_0_10px_rgba(225,6,0,0.5)] rounded-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#858585] mb-8">
          <span className="uppercase tracking-widest text-[10px]">
            {BOOT_STEPS[currentStepIndex]?.detail || 'All systems verified.'}
          </span>
          <span className="font-display font-black text-white text-base tabular-nums">
            {progress}%
          </span>
        </div>

        {/* Diagnostic Check Item List */}
        <div className="bg-[#0B0D13] border border-[#232736] p-4 flex flex-col gap-2 rounded-none">
          <div className="text-[10px] text-[#858585] uppercase tracking-wider pb-2 border-b border-[#1E2230] flex justify-between">
            <span>SUBSYSTEM DIAGNOSTICS LOG</span>
            <span className="text-emerald-400 font-bold">STATUS: OK</span>
          </div>

          {BOOT_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex
            const isPending = idx > currentStepIndex

            return (
              <div
                key={step.code}
                className={`flex items-center justify-between text-xs py-1 px-2 border transition-colors rounded-none ${
                  isDone
                    ? 'border-[#1E2230] bg-[#111319]/80 text-[#D8D8D8]'
                    : isCurrent
                    ? 'border-[#E10600] bg-[#E10600]/10 text-white font-bold'
                    : 'border-transparent text-[#555555]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#858585] tabular-nums">
                    [{String(idx + 1).padStart(2, '0')}]
                  </span>
                  <span className="text-[11px] uppercase tracking-wider">{step.code}</span>
                  <span className="text-[11px] text-[#858585] hidden sm:inline">// {step.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isDone ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>INITIALIZED</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[10px] font-bold text-[#FED500] animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#FED500] rounded-none animate-ping" />
                      <span>CHECKING...</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#444444]">STANDBY</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#292929] pt-4 text-[10px] text-[#858585]">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold uppercase">CORSE CLIENTI PROTOCOL</span>
          <span>//</span>
          <span>AUTONOMOUS TELEMETRY PIPELINE</span>
        </div>

        <div className="flex items-center gap-2">
          <span>PRESS</span>
          <kbd className="px-1.5 py-0.5 bg-[#1B1B1B] text-white border border-[#292929] font-bold rounded-none">
            SPACE
          </kbd>
          <span>OR</span>
          <kbd className="px-1.5 py-0.5 bg-[#1B1B1B] text-white border border-[#292929] font-bold rounded-none">
            ENTER
          </kbd>
          <span>TO LAUNCH IMMEDIATELY</span>
        </div>
      </div>
    </div>
  )
}

