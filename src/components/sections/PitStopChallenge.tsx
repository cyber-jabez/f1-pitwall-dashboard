import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Wrench, Timer, Disc, AlertTriangle, CheckCircle2, RotateCcw, Flame, Radio, Zap } from 'lucide-react'
import { FerrariAudioEngine } from '../audio/WebAudioEngine'
import ShinyText from '../reactbits/ShinyText'
import StarBorder from '../reactbits/StarBorder'

interface PitStopChallengeProps {
  audioEngine: FerrariAudioEngine
}

type Compound = 'soft' | 'medium' | 'hard' | 'wet'

export const PitStopChallenge: React.FC<PitStopChallengeProps> = ({ audioEngine }) => {
  const [gameState, setGameState] = useState<'idle' | 'in_pit' | 'completed'>('idle')
  const [compound, setCompound] = useState<Compound>('soft')
  const [wheelStatus, setWheelStatus] = useState({
    fl: false,
    fr: false,
    rl: false,
    rr: false
  })
  const [timerMs, setTimerMs] = useState(0)
  const [bestTime, setBestTime] = useState(2.08)
  const startTimeRef = useRef<number>(0)
  const timerIntervalRef = useRef<number | null>(null)

  const startPitStop = () => {
    audioEngine.playPitRadio('Box box, box box for tyres! Crew ready!')
    setGameState('in_pit')
    setWheelStatus({ fl: false, fr: false, rl: false, rr: false })
    setTimerMs(0)

    startTimeRef.current = performance.now()
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    timerIntervalRef.current = window.setInterval(() => {
      setTimerMs(Math.round(performance.now() - startTimeRef.current))
    }, 16)
  }

  const handleGunWheel = (wheel: 'fl' | 'fr' | 'rl' | 'rr') => {
    if (gameState !== 'in_pit' || wheelStatus[wheel]) return

    audioEngine.playWheelGunSound()
    const updated = { ...wheelStatus, [wheel]: true }
    setWheelStatus(updated)

    // Check if all 4 wheels changed!
    if (updated.fl && updated.fr && updated.rl && updated.rr) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      const finalTimeMs = Math.round(performance.now() - startTimeRef.current)
      const finalSec = parseFloat((finalTimeMs / 1000).toFixed(2))
      setTimerMs(finalTimeMs)
      setGameState('completed')

      // Drop jacks sound
      setTimeout(() => {
        audioEngine.playJackDropSound()
      }, 100)

      if (finalSec < bestTime) {
        setBestTime(finalSec)
      }

      if (finalSec <= 2.3) {
        audioEngine.playPitRadio('Incredible pit stop boys! Outstanding work!')
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#FF2800', '#FED500', '#008C45', '#FFF']
        })
      }
    }
  }

  const resetGame = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    setGameState('idle')
    setWheelStatus({ fl: false, fr: false, rl: false, rr: false })
    setTimerMs(0)
  }

  const getCompoundColor = (c: Compound) => {
    switch (c) {
      case 'soft':
        return '#FF2800'
      case 'medium':
        return '#FED500'
      case 'hard':
        return '#FFFFFF'
      case 'wet':
        return '#008C45'
    }
  }

  return (
    <section id="pitstop" className="relative py-24 bg-[#08090E] overflow-hidden border-t border-ferrari-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ferrari-red/10 border border-ferrari-red/30 mb-3">
            <Wrench className="w-3.5 h-3.5 text-ferrari-red animate-spin" />
            <span className="text-xs font-mono tracking-widest text-white/80 uppercase">
              MONZA PIT LANE // PIT CREW CHIEF CHALLENGE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-wider text-white uppercase mb-3">
            SUB-2 SECOND <ShinyText text="F1 PIT STOP CHALLENGE" color="#FF2800" shineColor="#FED500" />
          </h2>

          <p className="max-w-2xl text-white/60 font-sans text-sm sm:text-base">
            Can you change all 4 wheels faster than Scuderia Ferrari’s pit crew? Click the 4 wheel nuts as fast as possible to beat the record!
          </p>
        </div>

        {/* The Pit Box Station Canvas */}
        <div className="p-6 sm:p-10 rounded-3xl bg-ferrari-card border-2 border-ferrari-border/80 shadow-2xl relative overflow-hidden">
          {/* Top Bar: Live Stopwatch & Compound Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-ferrari-border/60">
            {/* Live Pit Clock */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-ferrari-dark border border-ferrari-border">
                <Timer className="w-5 h-5 text-ferrari-yellow" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">PIT TIME</span>
                <span className="text-3xl sm:text-4xl font-mono font-black text-ferrari-yellow">
                  {(timerMs / 1000).toFixed(2)}s
                </span>
              </div>
            </div>

            {/* Tyre Compound Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-white/60 hidden sm:inline">COMPOUND:</span>
              {(['soft', 'medium', 'hard', 'wet'] as Compound[]).map(c => {
                const color = getCompoundColor(c)
                const isSelected = compound === c
                return (
                  <button
                    key={c}
                    onClick={() => setCompound(c)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-white/10 border-2 shadow-lg'
                        : 'bg-ferrari-dark border border-ferrari-border text-white/50 hover:text-white'
                    }`}
                    style={{ borderColor: isSelected ? color : undefined }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span style={{ color: isSelected ? color : undefined }}>{c}</span>
                  </button>
                )
              })}
            </div>

            {/* Best Pit Record */}
            <div className="text-right">
              <span className="text-[10px] font-mono text-white/40 uppercase block">PIT RECORD</span>
              <span className="text-xl font-mono font-black text-emerald-400">{bestTime}s</span>
            </div>
          </div>

          {/* Pit Box Car Layout with 4 Wheel Gun Nodes */}
          <div className="relative w-full max-w-2xl mx-auto h-80 sm:h-96 rounded-2xl bg-[#08090D] border border-ferrari-border/60 flex items-center justify-center p-6 select-none">
            {/* Pit Box Markings */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-44 border-2 border-dashed border-ferrari-yellow/20 rounded-2xl pointer-events-none" />
            <div className="absolute top-4 left-4 text-[10px] font-mono text-ferrari-yellow/40">
              BOX // SF-24 PIT STOP POSITION
            </div>

            {/* Central Ferrari SF-24 F1 Car Silhouette */}
            <div className="relative w-28 sm:w-36 h-64 sm:h-80 bg-gradient-to-b from-[#8B0000] via-[#FF2800] to-[#8B0000] rounded-3xl border-2 border-ferrari-yellow/40 shadow-[0_0_40px_rgba(255,40,0,0.4)] flex flex-col items-center justify-between p-3">
              {/* Front Wing */}
              <div className="w-36 sm:w-44 -mt-2 h-4 bg-zinc-900 border border-white/20 rounded-md flex items-center justify-center text-[8px] font-mono font-bold text-white">
                SCUDERIA FERRARI
              </div>

              {/* Cockpit Halo & Driver Helmet */}
              <div className="w-12 h-14 rounded-full border-2 border-white/40 bg-zinc-900 flex items-center justify-center shadow-inner">
                <span className="w-6 h-6 rounded-full bg-ferrari-yellow border border-black flex items-center justify-center text-[10px] font-black text-black">
                  16
                </span>
              </div>

              {/* Rear Wing & Exhaust */}
              <div className="w-32 sm:w-40 -mb-2 h-5 bg-zinc-900 border border-white/20 rounded-md flex items-center justify-center text-[8px] font-mono text-ferrari-yellow">
                PIRELLI P-ZERO
              </div>
            </div>

            {/* 4 Wheel Stations (Clickable Impact Gun Target Buttons) */}
            {/* Front Left */}
            <button
              onClick={() => handleGunWheel('fl')}
              className={`absolute top-10 left-6 sm:left-16 p-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all active:scale-90 ${
                wheelStatus.fl
                  ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_20px_#00E676]'
                  : gameState === 'in_pit'
                  ? 'bg-ferrari-red/30 border-ferrari-red animate-pulse shadow-[0_0_20px_#FF2800] cursor-pointer'
                  : 'bg-zinc-900/60 border-zinc-700 opacity-60'
              }`}
            >
              <Disc className={`w-8 h-8 ${wheelStatus.fl ? 'text-emerald-400' : 'text-ferrari-yellow'}`} />
              <span className="text-[10px] font-mono font-bold text-white">FRONT LEFT</span>
              {wheelStatus.fl ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="text-[9px] font-mono text-white/50">CLICK GUN</span>
              )}
            </button>

            {/* Front Right */}
            <button
              onClick={() => handleGunWheel('fr')}
              className={`absolute top-10 right-6 sm:right-16 p-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all active:scale-90 ${
                wheelStatus.fr
                  ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_20px_#00E676]'
                  : gameState === 'in_pit'
                  ? 'bg-ferrari-red/30 border-ferrari-red animate-pulse shadow-[0_0_20px_#FF2800] cursor-pointer'
                  : 'bg-zinc-900/60 border-zinc-700 opacity-60'
              }`}
            >
              <Disc className={`w-8 h-8 ${wheelStatus.fr ? 'text-emerald-400' : 'text-ferrari-yellow'}`} />
              <span className="text-[10px] font-mono font-bold text-white">FRONT RIGHT</span>
              {wheelStatus.fr ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="text-[9px] font-mono text-white/50">CLICK GUN</span>
              )}
            </button>

            {/* Rear Left */}
            <button
              onClick={() => handleGunWheel('rl')}
              className={`absolute bottom-10 left-6 sm:left-16 p-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all active:scale-90 ${
                wheelStatus.rl
                  ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_20px_#00E676]'
                  : gameState === 'in_pit'
                  ? 'bg-ferrari-red/30 border-ferrari-red animate-pulse shadow-[0_0_20px_#FF2800] cursor-pointer'
                  : 'bg-zinc-900/60 border-zinc-700 opacity-60'
              }`}
            >
              <Disc className={`w-8 h-8 ${wheelStatus.rl ? 'text-emerald-400' : 'text-ferrari-yellow'}`} />
              <span className="text-[10px] font-mono font-bold text-white">REAR LEFT</span>
              {wheelStatus.rl ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="text-[9px] font-mono text-white/50">CLICK GUN</span>
              )}
            </button>

            {/* Rear Right */}
            <button
              onClick={() => handleGunWheel('rr')}
              className={`absolute bottom-10 right-6 sm:right-16 p-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all active:scale-90 ${
                wheelStatus.rr
                  ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_20px_#00E676]'
                  : gameState === 'in_pit'
                  ? 'bg-ferrari-red/30 border-ferrari-red animate-pulse shadow-[0_0_20px_#FF2800] cursor-pointer'
                  : 'bg-zinc-900/60 border-zinc-700 opacity-60'
              }`}
            >
              <Disc className={`w-8 h-8 ${wheelStatus.rr ? 'text-emerald-400' : 'text-ferrari-yellow'}`} />
              <span className="text-[10px] font-mono font-bold text-white">REAR RIGHT</span>
              {wheelStatus.rr ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="text-[9px] font-mono text-white/50">CLICK GUN</span>
              )}
            </button>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col items-center justify-center mt-8">
            {gameState === 'idle' && (
              <StarBorder color="#FF2800" speed="3s" onClick={startPitStop}>
                <Wrench className="w-4 h-4 text-ferrari-red" />
                <span className="font-mono font-black text-sm uppercase text-white tracking-wider">
                  CALL "BOX BOX" // START PIT STOP
                </span>
              </StarBorder>
            )}

            {gameState === 'in_pit' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-ferrari-red/20 border border-ferrari-red text-ferrari-red font-mono font-black text-sm uppercase animate-pulse">
                <Flame className="w-5 h-5 fill-ferrari-red" />
                <span>GUN ALL 4 WHEEL NUTS NOW!</span>
              </div>
            )}

            {gameState === 'completed' && (
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500 text-center">
                  <span className="text-xs font-mono text-emerald-400 uppercase block mb-1">
                    PIT STOP COMPLETED // GREEN LIGHT GIVEN!
                  </span>
                  <div className="text-3xl font-mono font-black text-white">
                    {(timerMs / 1000).toFixed(2)} SECONDS
                  </div>
                  <span className="text-xs font-sans text-ferrari-yellow mt-1 block">
                    {(timerMs / 1000) <= 2.2 ? '🏆 WORLD-CLASS FERRARI PIT CREW!' : 'Solid pit stop! Practice to break 2.0s!'}
                  </span>
                </div>

                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>AGAIN</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PitStopChallenge

