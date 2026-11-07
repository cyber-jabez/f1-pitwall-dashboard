import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Zap, Trophy, Timer, AlertCircle, Play, RotateCcw, Flame } from 'lucide-react'
import { FerrariAudioEngine } from '../audio/WebAudioEngine'
import ShinyText from '../reactbits/ShinyText'
import DecryptedText from '../reactbits/DecryptedText'

interface LaunchControlProps {
  audioEngine: FerrariAudioEngine
}

type Stage = 'idle' | 'holding' | 'lights' | 'launched' | 'result'

export const LaunchControl: React.FC<LaunchControlProps> = ({ audioEngine }) => {
  const [stage, setStage] = useState<Stage>('idle')
  const [lightsCount, setLightsCount] = useState(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [zeroHundredTime, setZeroHundredTime] = useState<number | null>(null)
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [gForce, setGForce] = useState(0)
  const [bestTime, setBestTime] = useState<number>(2.18)

  const lightsOutTimeRef = useRef<number>(0)
  const lightsTimerRef = useRef<number[]>([])

  const startSequence = () => {
    setStage('lights')
    setLightsCount(0)
    setReactionTime(null)
    setZeroHundredTime(null)
    setCurrentSpeed(0)
    setGForce(0)
    audioEngine.setRpm(4500) // Launch boost build

    // Clear previous timers
    lightsTimerRef.current.forEach(t => clearTimeout(t))
    lightsTimerRef.current = []

    // Light up 1 to 5 lights sequentially
    for (let i = 1; i <= 5; i++) {
      const timer = window.setTimeout(() => {
        setLightsCount(i)
        // Short beep
      }, i * 700)
      lightsTimerRef.current.push(timer)
    }

    // Random lights out between 4.2s and 5.5s
    const randomDelay = 3500 + 800 + Math.random() * 1200
    const outTimer = window.setTimeout(() => {
      setLightsCount(0)
      lightsOutTimeRef.current = performance.now()
    }, randomDelay)
    lightsTimerRef.current.push(outTimer)
  }

  const handleLaunchClick = () => {
    // If lights haven't gone out yet -> False Start!
    if (stage === 'lights' && lightsCount > 0) {
      lightsTimerRef.current.forEach(t => clearTimeout(t))
      setStage('result')
      setReactionTime(-999) // False start indicator
      return
    }

    // Valid Launch!
    if (stage === 'lights' && lightsCount === 0 && lightsOutTimeRef.current > 0) {
      const reaction = Math.round(performance.now() - lightsOutTimeRef.current)
      setReactionTime(reaction)
      setStage('launched')
      audioEngine.setRpm(9200)

      // Simulate 0-100 km/h launch
      const startTime = performance.now()
      let launchAnim = 0

      const runLaunch = (now: number) => {
        const elapsed = (now - startTime) / 1000
        const speed = Math.min(Math.round((elapsed / 2.15) * 100), 100)
        setCurrentSpeed(speed)
        setGForce(Math.min(1.85, 0.4 + (speed / 100) * 1.45))

        if (speed < 100) {
          launchAnim = requestAnimationFrame(runLaunch)
        } else {
          const finalTime = parseFloat((2.05 + reaction / 1000).toFixed(2))
          setZeroHundredTime(finalTime)
          setStage('result')

          // If fast, trigger confetti!
          if (finalTime <= 2.30) {
            if (finalTime < bestTime) setBestTime(finalTime)
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FF2800', '#FED500', '#FFFFFF', '#CD212A']
            })
          }
        }
      }

      launchAnim = requestAnimationFrame(runLaunch)
    }
  }

  const reset = () => {
    lightsTimerRef.current.forEach(t => clearTimeout(t))
    setStage('idle')
    setLightsCount(0)
    setCurrentSpeed(0)
    setGForce(0)
    setReactionTime(null)
    setZeroHundredTime(null)
    audioEngine.setRpm(1000)
  }

  return (
    <section id="launch-control" className="relative py-20 bg-[#06070B] overflow-hidden border-t border-ferrari-border/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ferrari-yellow/10 border border-ferrari-yellow/30 mb-3">
            <Zap className="w-3.5 h-3.5 text-ferrari-yellow" />
            <span className="text-xs font-mono tracking-widest text-ferrari-yellow uppercase">
              SCUDERIA RACE START SIMULATOR
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-wider text-white uppercase mb-2">
            FORMULA 1 <ShinyText text="LAUNCH CONTROL" color="#FED500" shineColor="#FFFFFF" />
          </h2>

          <p className="max-w-xl text-white/60 font-sans text-xs sm:text-sm">
            Engage launch control, wait for all 5 red gantry lights, and release the moment they go out! Test your reaction time against Charles Leclerc.
          </p>
        </div>

        {/* The Starting Lights Gantry */}
        <div className="flex flex-col items-center p-8 rounded-3xl bg-ferrari-card border border-ferrari-border/90 shadow-2xl">
          {/* F1 Gantry Housing */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-[#030406] border-2 border-zinc-800 shadow-inner mb-8">
            {[1, 2, 3, 4, 5].map(i => {
              const isRed = i <= lightsCount
              return (
                <div key={i} className="flex flex-col items-center gap-2 p-2 rounded-xl bg-zinc-900/90 border border-zinc-700/50">
                  {/* Top Red Light */}
                  <div
                    className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full transition-all duration-100 ${
                      isRed
                        ? 'bg-red-600 shadow-[0_0_25px_#FF0000,inset_0_0_8px_#FFF]'
                        : 'bg-red-950/40 border border-red-900/30'
                    }`}
                  />
                  {/* Bottom Red Light */}
                  <div
                    className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full transition-all duration-100 ${
                      isRed
                        ? 'bg-red-600 shadow-[0_0_25px_#FF0000,inset_0_0_8px_#FFF]'
                        : 'bg-red-950/40 border border-red-900/30'
                    }`}
                  />
                </div>
              )
            })}
          </div>

          {/* Telemetry Display during launch */}
          <div className="w-full grid grid-cols-3 gap-4 mb-8 text-center">
            <div className="p-3 rounded-xl bg-ferrari-dark border border-ferrari-border/60">
              <span className="text-[10px] font-mono text-white/40 uppercase block">VELOCITÀ</span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-ferrari-yellow">
                {currentSpeed} <span className="text-xs font-normal text-white/60">KM/H</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-ferrari-dark border border-ferrari-border/60">
              <span className="text-[10px] font-mono text-white/40 uppercase block">ACCELERAZIONE</span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                {gForce.toFixed(2)} <span className="text-xs font-normal text-white/60">G</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-ferrari-dark border border-ferrari-border/60">
              <span className="text-[10px] font-mono text-white/40 uppercase block">PERSONAL BEST</span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
                {bestTime}s
              </span>
            </div>
          </div>

          {/* Interactive Trigger Button Area */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            {stage === 'idle' && (
              <button
                onClick={startSequence}
                className="w-full py-4 rounded-2xl font-mono font-black text-sm uppercase tracking-wider text-black bg-gradient-to-r from-ferrari-yellow to-ferrari-gold hover:shadow-[0_0_30px_rgba(254,213,0,0.6)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>ARM LAUNCH CONTROL SEQUENCE</span>
              </button>
            )}

            {stage === 'lights' && (
              <button
                onClick={handleLaunchClick}
                className="w-full py-5 rounded-2xl font-mono font-black text-base uppercase tracking-wider text-white bg-ferrari-red hover:bg-[#E60000] border-2 border-white/40 shadow-[0_0_40px_rgba(255,40,0,0.8)] animate-pulse flex items-center justify-center gap-2 active:scale-95 select-none"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>{lightsCount > 0 ? 'WAIT FOR LIGHTS OUT!' : 'RELEASE BRAKE! LAUNCH NOW!'}</span>
              </button>
            )}

            {stage === 'launched' && (
              <div className="text-center py-3">
                <span className="font-mono font-bold text-ferrari-red animate-pulse tracking-widest text-sm uppercase">
                  LAUNCHING... FULL THROTTLE ACCELERATION!
                </span>
              </div>
            )}

            {stage === 'result' && (
              <div className="flex flex-col items-center gap-3 w-full">
                {reactionTime === -999 ? (
                  <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-center w-full">
                    <span className="text-red-400 font-mono font-bold text-sm block">FALSE START! 5 SECOND PENALTY!</span>
                    <span className="text-white/60 text-xs font-sans">You launched before the lights went out.</span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center w-full flex flex-col items-center gap-1">
                    <span className="text-xs font-mono text-emerald-400">
                      REACTION TIME: <strong className="text-white font-mono">{reactionTime} ms</strong>
                    </span>
                    <span className="text-lg font-mono font-black text-ferrari-yellow">
                      0-100 KM/H: {zeroHundredTime}s
                    </span>
                    <span className="text-xs font-sans text-white/70">
                      {reactionTime! < 220 ? '🏆 Sensational reaction! F1 Champion tier!' : 'Great launch, Tifoso!'}
                    </span>
                  </div>
                )}

                <button
                  onClick={reset}
                  className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>TRY AGAIN</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LaunchControl

