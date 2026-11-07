import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Compass, Gauge, Trophy, ChevronDown, Zap, Radio, Sparkles } from 'lucide-react'
import Hyperspeed from '../reactbits/Hyperspeed'
import ShinyText from '../reactbits/ShinyText'
import TrueFocus from '../reactbits/TrueFocus'
import BlurText from '../reactbits/BlurText'
import CountUp from '../reactbits/CountUp'
import Magnet from '../reactbits/Magnet'

interface HeroProps {
  onRevEngine: () => void
  onOpenLaunchControl: () => void
}

export const Hero: React.FC<HeroProps> = ({ onRevEngine, onOpenLaunchControl }) => {
  const [isBoosting, setIsBoosting] = useState(false)

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-28 pb-12">
      {/* Background: ReactBits Hyperspeed Shader Light Trails */}
      <div className="absolute inset-0 z-0 opacity-85">
        <Hyperspeed
          curve="racing"
          curvature={1.4}
          speed={1.6}
          boost={3.8}
          fov={85}
          boostFov={135}
          lanes={4}
          roadWidth={12}
          density={50}
          trailLength={1.8}
          lightSize={1.3}
          poles={22}
          dust={130}
          glow={0.9}
          reflections={0.65}
          roadColor="#060709"
          lineColor="#FF2800"
          tailColors={['#FF2800', '#D40000', '#FED500', '#FF4500']}
          headColors={['#FED500', '#FFFFFF', '#FFAA00']}
          poleColors={['#FF2800', '#FED500']}
          interactive={true}
          boosting={isBoosting}
        />
      </div>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#07080C] via-transparent to-[#07080C]/80 pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_40%,#07080C_95%)] pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto flex flex-col items-center text-center">
        {/* Top Scuderia Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-ferrari-red/10 border border-ferrari-red/30 backdrop-blur-md mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-ferrari-red animate-ping" />
          <ShinyText
            text="MARANELLO S.p.A. // OFFICIAL TIFOSI EXPERIENCE"
            color="#FFFFFF"
            shineColor="#FED500"
            speed={3}
            className="text-xs font-mono tracking-widest uppercase"
          />
        </motion.div>

        {/* Headline: TrueFocus ReactBits Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 w-full max-w-4xl"
        >
          <TrueFocus
            sentence="ESSERE FERRARI FOREVER"
            blurAmount={5}
            borderColor="#FF2800"
            glowColor="rgba(255, 40, 0, 0.7)"
            animationDuration={0.6}
            pauseBetweenAnimations={1.5}
          />
        </motion.div>

        {/* Subtitle: ReactBits BlurText Component */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-10 text-white/80 font-sans text-sm sm:text-base md:text-lg leading-relaxed"
        >
          <BlurText
            text="Forged in Maranello. Crowned in Monza. Driven by sheer scarlet adrenaline and 12-cylinder naturally aspirated opera."
            delay={30}
            direction="bottom"
            className="justify-center text-center"
          />
        </motion.div>

        {/* Interactive Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          {/* 3D Configurator CTA */}
          <Magnet padding={60} magnetStrength={2.5}>
            <a
              href="#configurator"
              className="relative px-7 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-ferrari-red via-[#E60000] to-ferrari-deepRed hover:shadow-[0_0_30px_rgba(255,40,0,0.6)] border border-ferrari-red/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
            >
              <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
              <span>ENTER 3D GARAGE</span>
            </a>
          </Magnet>

          {/* Rev Dyno CTA */}
          <Magnet padding={60} magnetStrength={2.5}>
            <button
              onClick={onRevEngine}
              className="relative px-7 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-ferrari-yellow bg-ferrari-dark/80 hover:bg-ferrari-card border border-ferrari-yellow/40 hover:border-ferrari-yellow hover:shadow-[0_0_25px_rgba(254,213,0,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-ferrari-red animate-pulse" />
              <span>REV V12 SOUNDBOARD</span>
            </button>
          </Magnet>

          {/* Hyperspeed Interactive Boost Button (Press & Hold) */}
          <Magnet padding={60} magnetStrength={2.5}>
            <button
              onPointerDown={() => setIsBoosting(true)}
              onPointerUp={() => setIsBoosting(false)}
              onPointerLeave={() => setIsBoosting(false)}
              className={`px-6 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all select-none flex items-center gap-2 ${
                isBoosting
                  ? 'bg-gradient-to-r from-ferrari-yellow to-ferrari-red text-black shadow-[0_0_40px_rgba(254,213,0,0.8)] scale-105'
                  : 'bg-white/5 border border-white/15 text-white/90 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <Zap className={`w-4 h-4 ${isBoosting ? 'fill-black' : 'text-ferrari-yellow'}`} />
              <span>{isBoosting ? 'WARP SPEED ENGAGED!!' : 'HOLD FOR HYPERSPACE'}</span>
            </button>
          </Magnet>
        </motion.div>

        {/* Maranello Kinetic Statistics Bar with ReactBits CountUp */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 sm:p-5 rounded-2xl bg-ferrari-card/75 backdrop-blur-xl border border-ferrari-border/70 shadow-2xl"
        >
          <div className="flex flex-col items-center p-2 border-r border-ferrari-border/40 last:border-0">
            <span className="text-2xl sm:text-3xl font-mono font-black text-ferrari-yellow drop-shadow-[0_0_10px_rgba(254,213,0,0.3)]">
              <CountUp to={16} duration={1.8} />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase mt-1">
              CONSTRUCTORS' TITLES
            </span>
          </div>

          <div className="flex flex-col items-center p-2 border-r border-ferrari-border/40 last:border-0">
            <span className="text-2xl sm:text-3xl font-mono font-black text-white">
              <CountUp to={15} duration={1.8} />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase mt-1">
              DRIVERS' WORLD CUPS
            </span>
          </div>

          <div className="flex flex-col items-center p-2 border-r border-ferrari-border/40 last:border-0">
            <span className="text-2xl sm:text-3xl font-mono font-black text-ferrari-red drop-shadow-[0_0_10px_rgba(255,40,0,0.4)]">
              <CountUp to={244} duration={2.2} />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase mt-1">
              F1 GRAND PRIX WINS
            </span>
          </div>

          <div className="flex flex-col items-center p-2 border-r border-ferrari-border/40 last:border-0">
            <span className="text-2xl sm:text-3xl font-mono font-black text-ferrari-yellow">
              <CountUp to={1200} duration={2.4} suffix=" CV" />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase mt-1">
              F80 FLAGSHIP POWER
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex flex-col items-center p-2">
            <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
              <CountUp to={2.15} decimals={2} duration={2} suffix="s" />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase mt-1">
              0-100 KM/H LAUNCH
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 flex justify-center mt-6">
        <a
          href="#hypercars"
          className="flex flex-col items-center gap-1 text-[11px] font-mono text-white/40 hover:text-ferrari-yellow transition-colors"
        >
          <span>EXPLORE MARANELLO</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-ferrari-red" />
        </a>
      </div>
    </section>
  )
}

export default Hero

