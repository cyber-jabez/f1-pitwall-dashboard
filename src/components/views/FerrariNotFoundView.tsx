import React, { useState } from 'react'
import { FerrariAudioEngine } from '../audio/WebAudioEngine'
import ShinyText from '../reactbits/ShinyText'
import {
  AlertTriangle,
  Flag,
  Radio,
  RotateCcw,
  Compass,
  Tv,
  Calendar,
  Trophy,
  Gauge,
  Sliders,
  Volume2,
  ChevronRight,
  Flame,
  Zap,
  Shield,
} from 'lucide-react'

interface FerrariNotFoundViewProps {
  onNavigate: (route: string) => void
  audioEngine?: FerrariAudioEngine
}

export const FerrariNotFoundView: React.FC<FerrariNotFoundViewProps> = ({
  onNavigate,
  audioEngine,
}) => {
  const [isEscaping, setIsEscaping] = useState(false)
  const [escapeProgress, setEscapeProgress] = useState(0)
  const [radioTransmitting, setRadioTransmitting] = useState(false)

  // Play Ferrari Pit Wall Radio Audio
  const handlePlayRadio = () => {
    setRadioTransmitting(true)
    if (audioEngine) {
      audioEngine.playRadioBeep()
      audioEngine.playPitRadio(
        'We are checking... Charles, Lewis, stay calm. The page has run wide into the gravel trap. Box now, box for fresh softs!'
      )
    }
    setTimeout(() => setRadioTransmitting(false), 5500)
  }

  // Interactive Easter Egg: Clutch Dump Rock Out of Gravel
  const handleGravelRecovery = () => {
    setIsEscaping(true)
    if (audioEngine) {
      audioEngine.playPaddleShiftSound('down')
      audioEngine.playTurboFlutter()
      audioEngine.playExhaustPop()
      audioEngine.setRpm(8500)
    }

    let progress = 0
    const interval = setInterval(() => {
      progress += 20
      setEscapeProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        if (audioEngine) {
          audioEngine.playPaddleShiftSound('up')
          audioEngine.playOvertakeBoost()
        }
        setTimeout(() => {
          onNavigate('home')
        }, 400)
      }
    }, 250)
  }

  return (
    <div className="min-h-screen bg-[#05060A] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative overflow-hidden font-mono">
      {/* Italian Tricolore Top Accent Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 flex z-30">
        <div className="w-1/3 bg-[#009246]" />
        <div className="w-1/3 bg-[#FFFFFF]" />
        <div className="w-1/3 bg-[#CE2B37]" />
      </div>

      {/* Atmospheric Background Carbon Fiber Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,26,45,0.18)_0%,rgba(5,6,10,0.95)_70%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.2) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col items-center text-center">
        {/* FIA Double Waved Yellow Alert Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/80 text-amber-300 font-bold text-xs uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
          <Flag className="w-4 h-4 text-ferrari-yellow fill-ferrari-yellow" />
          <span>FIA CODE: DOUBLE WAVED YELLOW // CAR IN THE GRAVEL TRAP</span>
          <Flag className="w-4 h-4 text-ferrari-yellow fill-ferrari-yellow" />
        </div>

        {/* Big Stylized 404 Display */}
        <div className="relative mb-2 select-none">
          <span className="font-display font-black text-8xl sm:text-9xl md:text-[13rem] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/10 leading-none drop-shadow-[0_0_35px_rgba(239,26,45,0.6)]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-display font-black text-2xl sm:text-3xl uppercase tracking-widest text-ferrari-red bg-black/80 px-4 py-1 rounded-xl border border-ferrari-red/60 shadow-xl">
              OFF-TRACK EXCURSION
            </span>
          </div>
        </div>

        {/* Main Headline & Lore */}
        <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white mt-2 mb-3">
          MISSING APEX // <ShinyText text="URL OUT OF BOUNDS" speed={2.5} className="text-ferrari-yellow" />
        </h1>

        <p className="text-sm sm:text-base text-white/70 max-w-xl mb-8 leading-relaxed">
          Scuderia Ferrari Mission Control reports telemetry loss. The requested page has run wide at Variante Ascari and is beached in the gravel trap outside track limits.
        </p>

        {/* Scuderia Team Radio Transmission Box */}
        <div className="w-full max-w-2xl bg-[#0A0D15] border border-ferrari-red/40 rounded-2xl p-4 sm:p-5 shadow-2xl mb-8 text-left relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <Radio className="w-4 h-4 text-ferrari-red" />
              <span className="font-bold text-xs uppercase text-white tracking-wider">
                MARANELLO PIT WALL TEAM RADIO // CHANNEL 16
              </span>
            </div>
            <button
              onClick={handlePlayRadio}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                radioTransmitting
                  ? 'bg-red-950 text-red-300 border-red-700 animate-pulse'
                  : 'bg-black/60 text-white/80 hover:text-white border-white/20 hover:border-ferrari-yellow'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-ferrari-yellow" />
              <span>{radioTransmitting ? 'TRANSMITTING...' : 'PLAY RADIO AUDIO'}</span>
            </button>
          </div>

          <div className="text-xs sm:text-sm text-white/90 space-y-2">
            <p className="font-sans italic text-white/80">
              <strong className="text-ferrari-yellow font-mono not-italic font-bold">RACE ENGINEER:</strong>{' '}
              "Charles, Lewis... we are checking. We see zero downforce on this endpoint. The page does not exist on the telemetry server. Plan B: abort lap and box immediately."
            </p>
          </div>

          {/* Telemetry Diagnostics Mini HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/10 text-[10px]">
            <div className="p-2 rounded-lg bg-black/50 border border-white/5">
              <span className="text-white/40 block uppercase">CAR STATUS</span>
              <span className="text-red-400 font-bold block mt-0.5">BEACHED IN GRAVEL</span>
            </div>
            <div className="p-2 rounded-lg bg-black/50 border border-white/5">
              <span className="text-white/40 block uppercase">VELOCITY</span>
              <span className="text-white font-bold block mt-0.5">0.0 KM/H</span>
            </div>
            <div className="p-2 rounded-lg bg-black/50 border border-white/5">
              <span className="text-white/40 block uppercase">DELTA TO LEADER</span>
              <span className="text-amber-400 font-bold block mt-0.5">+99.999s</span>
            </div>
            <div className="p-2 rounded-lg bg-black/50 border border-white/5">
              <span className="text-white/40 block uppercase">STRATEGY CALL</span>
              <span className="text-emerald-400 font-bold block mt-0.5">RETURN TO PADDOCK</span>
            </div>
          </div>
        </div>

        {/* Interactive Gravel Recovery Button */}
        <div className="mb-8 w-full max-w-md">
          {isEscaping ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950 to-neutral-900 border border-red-600/70 text-center space-y-2 shadow-[0_0_30px_rgba(239,26,45,0.4)]">
              <div className="flex items-center justify-between text-xs font-bold text-red-300">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-ferrari-yellow animate-bounce" />
                  <span>DUMPING CLUTCH // 8,500 RPM TIRE SPIN...</span>
                </span>
                <span>{escapeProgress}%</span>
              </div>
              <div className="w-full bg-black/80 rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className="bg-gradient-to-r from-ferrari-yellow to-ferrari-red h-full transition-all duration-200"
                  style={{ width: `${escapeProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-white/60 block">RECOVERING TRACTION TOWARDS PADDOCK...</span>
            </div>
          ) : (
            <button
              onClick={handleGravelRecovery}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-ferrari-red via-red-600 to-ferrari-red hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(239,26,45,0.5)] flex items-center justify-center gap-2 group"
            >
              <Zap className="w-4 h-4 text-ferrari-yellow group-hover:scale-125 transition-transform" />
              <span>DUMP CLUTCH & RECOVER TO PADDOCK (INTERACTIVE)</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Emergency Pit Wall Navigation Hub */}
        <div className="w-full max-w-3xl">
          <span className="text-white/40 text-xs uppercase tracking-widest block mb-3 font-bold">
            SCUDERIA FERRARI EMERGENCY RE-ENTRY CHANNELS
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => onNavigate('home')}
              className="p-3 rounded-xl bg-[#0D1019] hover:bg-[#151A28] border border-white/10 hover:border-ferrari-red text-left transition flex flex-col justify-between group shadow-lg"
            >
              <Shield className="w-5 h-5 text-ferrari-red mb-2 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xs text-white block">PADDOCK HOME</span>
                <span className="text-[9px] text-white/40 block mt-0.5">Atelier & Heritage</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('pitwall')}
              className="p-3 rounded-xl bg-[#0D1019] hover:bg-[#151A28] border border-white/10 hover:border-amber-400 text-left transition flex flex-col justify-between group shadow-lg"
            >
              <Sliders className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xs text-white block">PIT WALL COCKPIT</span>
                <span className="text-[9px] text-white/40 block mt-0.5">Engineering Station</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('live-race')}
              className="p-3 rounded-xl bg-[#0D1019] hover:bg-[#151A28] border border-white/10 hover:border-cyan-400 text-left transition flex flex-col justify-between group shadow-lg"
            >
              <Tv className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xs text-white block">LIVE RACE STREAM</span>
                <span className="text-[9px] text-white/40 block mt-0.5">Broadcast & Timing</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('calendar')}
              className="p-3 rounded-xl bg-[#0D1019] hover:bg-[#151A28] border border-white/10 hover:border-emerald-400 text-left transition flex flex-col justify-between group shadow-lg"
            >
              <Calendar className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xs text-white block">RACE CALENDAR</span>
                <span className="text-[9px] text-white/40 block mt-0.5">2026 Season Schedule</span>
              </div>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-white/60">
            <span>Also explore:</span>
            <button
              onClick={() => onNavigate('standings')}
              className="hover:text-ferrari-yellow underline transition"
            >
              Driver Standings
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('results')}
              className="hover:text-ferrari-yellow underline transition"
            >
              Race Results
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('ferrari-hub')}
              className="hover:text-ferrari-yellow underline transition"
            >
              Ferrari Hub
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('technical')}
              className="hover:text-ferrari-yellow underline transition"
            >
              Technical Specs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FerrariNotFoundView
