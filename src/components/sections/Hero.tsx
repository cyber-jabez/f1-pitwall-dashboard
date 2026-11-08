import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Compass, ChevronDown, Zap } from 'lucide-react'
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

export const Hero: React.FC<HeroProps> = ({ onRevEngine }) => {
  const [isBoosting, setIsBoosting] = useState(false)

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-28 pb-12 font-mono">
      {/* Background: ReactBits Hyperspeed Shader Light Trails */}
      <div className="absolute inset-0 z-0 opacity-80">
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
          lineColor="#E10600"
          tailColors={['#E10600', '#B80000', '#FED500', '#FF4500']}
          headColors={['#FED500', '#FFFFFF', '#FFAA00']}
          poleColors={['#E10600', '#FED500']}
          interactive={true}
          boosting={isBoosting}
        />
      </div>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/80 pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_40%,#080808_95%)] pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto flex flex-col items-center text-center">
        {/* Top Scuderia Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#111111] border border-[#292929] mb-6"
        >
          <span className="w-2 h-2 rounded-none bg-[#E10600] animate-pulse" />
          <ShinyText
            text="MARANELLO S.p.A. // OFFICIAL TIFOSI INTELLIGENCE"
            color="#FFFFFF"
            shineColor="#FED500"
            speed={3}
            className="text-[10px] font-mono tracking-widest uppercase"
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
            borderColor="#E10600"
            glowColor="rgba(225, 6, 0, 0.7)"
            animationDuration={0.6}
            pauseBetweenAnimations={1.5}
          />
        </motion.div>

        {/* Subtitle: ReactBits BlurText Component */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-10 text-[#D8D8D8] font-sans text-sm sm:text-base leading-relaxed"
        >
          <BlurText
            text="Forged in Maranello. Crowned in Monza. Engineered with zero compromise for mission-critical race operations."
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
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {/* 3D Configurator CTA */}
          <Magnet padding={60} magnetStrength={2.5}>
            <a
              href="#configurator"
              className="relative px-6 py-3 rounded-none font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#E10600] hover:bg-[#B80000] border border-[#E10600] transition-colors flex items-center gap-2 group"
            >
              <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
              <span>ENTER 3D GARAGE</span>
            </a>
          </Magnet>

          {/* Rev Dyno CTA */}
          <Magnet padding={60} magnetStrength={2.5}>
            <button
              onClick={onRevEngine}
              className="relative px-6 py-3 rounded-none font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FED500] bg-[#111111] hover:bg-[#1A1A1A] border border-[#292929] hover:border-[#FED500] transition-colors flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-[#E10600]" />
              <span>REV V12 SOUNDBOARD</span>
            </button>
          </Magnet>

          {/* Hyperspeed Interactive Boost Button (Press & Hold) */}
          <Magnet padding={60} magnetStrength={2.5}>
            <button
              onPointerDown={() => setIsBoosting(true)}
              onPointerUp={() => setIsBoosting(false)}
              onPointerLeave={() => setIsBoosting(false)}
              className={`px-5 py-3 rounded-none font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors select-none flex items-center gap-2 ${
                isBoosting
                  ? 'bg-[#FED500] text-black border border-[#FED500]'
                  : 'bg-[#111111] border border-[#292929] text-[#D8D8D8] hover:border-[#444444]'
              }`}
            >
              <Zap className={`w-4 h-4 ${isBoosting ? 'fill-black' : 'text-[#FED500]'}`} />
              <span>{isBoosting ? 'WARP SPEED ENGAGED' : 'HOLD FOR HYPERSPACE'}</span>
            </button>
          </Magnet>
        </motion.div>

        {/* Maranello Kinetic Statistics Bar with ReactBits CountUp */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-4 rounded-none bg-[#0B0D14] border border-[#292929] shadow-2xl"
        >
          <div className="flex flex-col items-center p-2 border-r border-[#222222] last:border-0">
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#FED500] tabular-nums">
              <CountUp to={16} duration={1.8} />
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#858585] uppercase mt-1">
              CONSTRUCTORS' TITLES
            </span>
          </div>

          <div className="flex flex-col items-center p-2 border-r border-[#222222] last:border-0">
            <span className="text-2xl sm:text-3xl font-mono font-black text-white tabular-nums">
              <CountUp to={15} duration={1.8} />
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#858585] uppercase mt-1">
              DRIVERS' WORLD CUPS
            </span>
          </div>

          <div className="flex flex-col items-center p-2 border-r border-[#222222] last:border-0">
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#E10600] tabular-nums">
              <CountUp to={244} duration={2.2} />
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#858585] uppercase mt-1">
              F1 GRAND PRIX WINS
            </span>
          </div>

          <div className="flex flex-col items-center p-2 border-r border-[#222222] last:border-0">
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#FED500] tabular-nums">
              <CountUp to={1200} duration={2.4} suffix=" CV" />
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#858585] uppercase mt-1">
              F80 FLAGSHIP POWER
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex flex-col items-center p-2">
            <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 tabular-nums">
              <CountUp to={2.15} decimals={2} duration={2} suffix="s" />
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#858585] uppercase mt-1">
              0-100 KM/H LAUNCH
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 flex justify-center mt-6">
        <a
          href="#hypercars"
          className="flex flex-col items-center gap-1 text-[10px] font-mono text-[#858585] hover:text-[#FED500] transition-colors uppercase tracking-wider"
        >
          <span>EXPLORE MARANELLO</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#E10600]" />
        </a>
      </div>
    </section>
  )
}

export default Hero
