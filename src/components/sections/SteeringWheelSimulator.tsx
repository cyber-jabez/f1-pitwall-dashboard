import React, { useState, useEffect } from 'react'
import { FerrariAudioEngine } from '../audio/WebAudioEngine'
import StarBorder from '../reactbits/StarBorder'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { Zap, Radio, Volume2, Shield, Activity, BatteryCharging, ChevronLeft, ChevronRight, Sliders } from 'lucide-react'

interface SteeringWheelSimulatorProps {
  audioEngine: FerrariAudioEngine
}

export const SteeringWheelSimulator: React.FC<SteeringWheelSimulatorProps> = ({ audioEngine }) => {
  const [gear, setGear] = useState(6)
  const [speed, setSpeed] = useState(284)
  const [rpm, setRpm] = useState(11200)
  const [drsActive, setDrsActive] = useState(false)
  const [overtakeActive, setOvertakeActive] = useState(false)
  const [stratMode, setStratMode] = useState(2) // STRAT 2 (Race)
  const [brakeBias, setBrakeBias] = useState(57.5)
  const [diffEntry, setDiffEntry] = useState(6)
  const [ersCharge, setErsCharge] = useState(88)
  const [radioActive, setRadioActive] = useState(false)
  const [radioMessage, setRadioMessage] = useState('RADIO STANDBY // FREQ 456.800 MHz')
  const [screenFlicker, setScreenFlicker] = useState(false)

  // Shift LEDs logic based on RPM (up to 13,000 RPM)
  const shiftLeds = Array.from({ length: 15 }, (_, i) => {
    const threshold = 9000 + i * 260
    const active = rpm >= threshold
    let color = 'bg-emerald-500 shadow-[0_0_8px_#10B981]'
    if (i >= 5 && i < 10) color = 'bg-ferrari-red shadow-[0_0_8px_#FF2800]'
    if (i >= 10) color = 'bg-blue-500 shadow-[0_0_8px_#3B82F6]'
    return { active, color }
  })

  // Static cockpit control values based on driver inputs (No synthetic random jitter)

  // Gear Shift Up
  const handleShiftUp = () => {
    audioEngine.playPaddleShiftSound('up')
    if (gear < 8) {
      setGear((g) => g + 1)
      setRpm((r) => Math.max(9000, r - 1800))
      setSpeed((s) => Math.min(352, s + 18))
    }
  }

  // Gear Shift Down
  const handleShiftDown = () => {
    audioEngine.playPaddleShiftSound('down')
    if (gear > 1) {
      setGear((g) => g - 1)
      setRpm((r) => Math.min(12800, r + 1600))
      setSpeed((s) => Math.max(80, s - 22))
    }
  }

  // Overtake 120kW Push Button
  const handleOvertake = () => {
    audioEngine.playOvertakeBoost()
    setOvertakeActive(true)
    setScreenFlicker(true)
    setSpeed((s) => Math.min(355, s + 24))
    setRpm(12600)
    setErsCharge((e) => Math.max(10, e - 15))
    setTimeout(() => setScreenFlicker(false), 200)
    setTimeout(() => setOvertakeActive(false), 2500)
  }

  // DRS Button
  const handleDRS = () => {
    audioEngine.playMechanicalClick()
    setDrsActive((d) => !d)
  }

  // Brake Bias Adjust
  const handleBrakeBias = (delta: number) => {
    audioEngine.playMechanicalClick()
    setBrakeBias((prev) => parseFloat(Math.min(62.0, Math.max(54.0, prev + delta)).toFixed(1)))
  }

  // Strat Mode Rotary Cycle
  const handleStratCycle = () => {
    audioEngine.playMechanicalClick()
    setStratMode((m) => (m >= 9 ? 1 : m === 1 ? 2 : m === 2 ? 5 : m === 5 ? 7 : 9))
  }

  // Radio Broadcast
  const quotes = [
    { text: 'Charles: "YESSS! FORZA FERRARI! MAMMA MIA!"', speech: 'Forza Ferrari! Mamma Mia!' },
    { text: 'Bozzi: "Charles, mode push, mode push, DRS enabled."', speech: 'Charles, mode push, DRS enabled.' },
    { text: 'Sainz: "Smooth operator... check."', speech: 'Smooth operator, check.' },
    { text: 'Pit Wall: "Box this lap, box for softs."', speech: 'Box this lap, box for soft tyres.' },
  ]

  const handleRadio = () => {
    const selected = quotes[Math.floor(Math.random() * quotes.length)]
    setRadioMessage(selected.text)
    setRadioActive(true)
    audioEngine.playPitRadio(selected.speech)
    setTimeout(() => setRadioActive(false), 3500)
  }

  return (
    <section id="cockpit-wheel" className="py-24 px-4 relative overflow-hidden bg-[#06070A] border-t border-ferrari-border/60">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-ferrari-red/10 via-ferrari-yellow/5 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ferrari-red/10 border border-ferrari-red/30 mb-3">
            <Sliders className="w-4 h-4 text-ferrari-red animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-ferrari-red font-semibold">
              SCUDERIA SF-24 COCKPIT CONTROLS
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-3">
            INTERACTIVE F1 <ShinyText text="STEERING WHEEL" speed={2.5} className="text-ferrari-yellow" />
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base font-sans">
            Take full command of the Scuderia Ferrari Formula 1 steering wheel. Pull the carbon paddle shifters, deploy 120kW of MGU-K overtake battery power, flip DRS, and communicate with the pit wall.
          </p>
        </div>

        {/* Steering Wheel Main Rig Container */}
        <div className="relative max-w-4xl mx-auto p-4 sm:p-8 rounded-3xl bg-gradient-to-b from-[#14161D] to-[#0A0B0E] border-2 border-[#242838] shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          {/* Carbon Fiber Weave Texture Overlay */}
          <div
            className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, #2A2E3D 10%, transparent 11%), radial-gradient(circle at 0% 0%, #2A2E3D 10%, transparent 11%)',
              backgroundSize: '12px 12px',
            }}
          />

          {/* Top Shift LED Cluster */}
          <div className="relative z-10 mb-6 bg-[#0B0C10] border border-[#232736] p-2.5 rounded-2xl flex items-center justify-between max-w-xl mx-auto shadow-inner">
            <span className="font-mono text-[10px] text-white/40 tracking-wider pl-2">FIA REV LIMITER</span>
            <div className="flex items-center gap-1 sm:gap-2">
              {shiftLeds.map((led, idx) => (
                <div
                  key={idx}
                  className={`w-3 sm:w-4 h-3 sm:h-4 rounded-full transition-all duration-75 ${
                    led.active ? led.color : 'bg-[#1C1F2B]'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] text-ferrari-yellow tracking-wider pr-2">{rpm} RPM</span>
          </div>

          {/* Central Section: Left Controls, Central OLED Display, Right Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center relative z-10">
            {/* Left Button Wing */}
            <div className="flex flex-col gap-4 items-center md:items-end order-2 md:order-1">
              {/* Overtake 120kW Push Button */}
              <Magnet padding={50} magnetStrength={3}>
                <button
                  onClick={handleOvertake}
                  className={`relative group w-24 h-24 rounded-full font-display font-black text-xs uppercase tracking-wider flex flex-col items-center justify-center border-4 transition-all duration-200 active:scale-95 shadow-xl ${
                    overtakeActive
                      ? 'bg-emerald-500 text-black border-white shadow-[0_0_30px_#10B981] animate-pulse'
                      : 'bg-gradient-to-b from-[#D40000] to-[#7B0000] text-white border-[#FF4444] hover:shadow-[0_0_20px_#FF2800]'
                  }`}
                >
                  <Zap className="w-6 h-6 mb-1 text-white group-hover:scale-110 transition-transform" />
                  <span>OT</span>
                  <span className="text-[9px] font-mono text-white/80">OVERTAKE</span>
                </button>
              </Magnet>

              {/* Brake Bias Fine Tune BB- / BB+ */}
              <div className="bg-[#12141C] border border-[#232736] p-3 rounded-2xl flex flex-col items-center gap-2 w-36">
                <span className="font-mono text-[10px] text-white/50 tracking-wider">BRAKE BIAS</span>
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => handleBrakeBias(-0.5)}
                    className="w-8 h-8 rounded-lg bg-[#1F2332] text-white font-mono font-bold hover:bg-ferrari-red transition-colors active:scale-90"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm text-ferrari-yellow">{brakeBias}%</span>
                  <button
                    onClick={() => handleBrakeBias(+0.5)}
                    className="w-8 h-8 rounded-lg bg-[#1F2332] text-white font-mono font-bold hover:bg-ferrari-red transition-colors active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Left Paddle Shifter Downshift */}
              <Magnet padding={60} magnetStrength={2.5}>
                <button
                  onClick={handleShiftDown}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E2230] to-[#141620] border-2 border-white/20 text-white font-display font-black text-sm uppercase tracking-wider hover:border-ferrari-red flex items-center gap-2 active:scale-95 shadow-lg"
                >
                  <ChevronLeft className="w-4 h-4 text-ferrari-red" />
                  <span>PADDLE DOWN</span>
                </button>
              </Magnet>
            </div>

            {/* Central OLED Telemetry Display (Spans 2 cols) */}
            <div className="md:col-span-2 order-1 md:order-2">
              <div
                className={`relative bg-[#020305] border-4 border-[#24283A] rounded-2xl p-4 sm:p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-150 ${
                  screenFlicker ? 'brightness-150 ring-4 ring-emerald-400' : ''
                }`}
              >
                {/* Screen Scanlines */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '100% 4px',
                  }}
                />

                {/* Top Status Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-mono text-xs text-white font-bold tracking-widest">SF-24 #16 LECLERC</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                    DELTA -0.342s
                  </div>
                </div>

                {/* Main Telemetry Readout Grid */}
                <div className="grid grid-cols-3 gap-3 items-center text-center my-3">
                  {/* Speed */}
                  <div className="bg-[#0A0D14] border border-white/10 p-3 rounded-xl">
                    <span className="font-mono text-[10px] text-white/40 block">SPEED</span>
                    <span className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                      {speed}
                    </span>
                    <span className="font-mono text-[9px] text-ferrari-yellow">KM/H</span>
                  </div>

                  {/* Gear Highlight */}
                  <div className="bg-gradient-to-b from-[#1C0404] to-[#0A0000] border-2 border-ferrari-red/80 p-3 rounded-2xl shadow-[0_0_20px_rgba(255,40,0,0.3)]">
                    <span className="font-mono text-[10px] text-ferrari-red font-bold block">GEAR</span>
                    <span className="font-display font-black text-5xl sm:text-6xl text-white">
                      {gear}
                    </span>
                    <span className="font-mono text-[9px] text-emerald-400">OPTIMAL</span>
                  </div>

                  {/* ERS & Battery */}
                  <div className="bg-[#0A0D14] border border-white/10 p-3 rounded-xl flex flex-col justify-center">
                    <span className="font-mono text-[10px] text-white/40 block">ERS MGU-K</span>
                    <span className="font-display font-black text-2xl sm:text-3xl text-emerald-400">
                      {ersCharge}%
                    </span>
                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${ersCharge}%` }} />
                    </div>
                  </div>
                </div>

                {/* Sub Telemetry Info */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center font-mono text-[10px]">
                  <div className="bg-[#0A0D14] p-1.5 rounded">
                    <span className="text-white/40 block">TYRES</span>
                    <span className="text-ferrari-yellow font-bold">SOFT (C4)</span>
                  </div>
                  <div className="bg-[#0A0D14] p-1.5 rounded">
                    <span className="text-white/40 block">TYRE FL</span>
                    <span className="text-emerald-400 font-bold">103°C</span>
                  </div>
                  <div className="bg-[#0A0D14] p-1.5 rounded">
                    <span className="text-white/40 block">ENGINE</span>
                    <span className="text-ferrari-red font-bold">STRAT {stratMode}</span>
                  </div>
                  <div className="bg-[#0A0D14] p-1.5 rounded">
                    <span className="text-white/40 block">DRS</span>
                    <span className={`font-bold ${drsActive ? 'text-emerald-400 animate-pulse' : 'text-white/40'}`}>
                      {drsActive ? 'OPEN' : 'ARMED'}
                    </span>
                  </div>
                </div>

                {/* Pit Radio Message Banner */}
                <div className="mt-3 bg-[#080B12] border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Radio className={`w-4 h-4 ${radioActive ? 'text-ferrari-yellow animate-pulse' : 'text-white/30'}`} />
                  <span className="font-mono text-xs text-white/80 truncate">
                    {radioMessage}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Button Wing */}
            <div className="flex flex-col gap-4 items-center md:items-start order-3">
              {/* DRS Push Button */}
              <Magnet padding={50} magnetStrength={3}>
                <button
                  onClick={handleDRS}
                  className={`relative group w-24 h-24 rounded-full font-display font-black text-xs uppercase tracking-wider flex flex-col items-center justify-center border-4 transition-all duration-200 active:scale-95 shadow-xl ${
                    drsActive
                      ? 'bg-emerald-500 text-black border-white shadow-[0_0_30px_#10B981]'
                      : 'bg-gradient-to-b from-[#1C2230] to-[#0E1118] text-white border-[#3B82F6] hover:shadow-[0_0_20px_#3B82F6]'
                  }`}
                >
                  <Activity className="w-6 h-6 mb-1 text-white group-hover:scale-110 transition-transform" />
                  <span>DRS</span>
                  <span className="text-[9px] font-mono text-white/80">{drsActive ? 'OPEN' : 'WING'}</span>
                </button>
              </Magnet>

              {/* Pit Radio Push-To-Talk Button */}
              <button
                onClick={handleRadio}
                className="bg-[#12141C] border border-[#232736] hover:border-ferrari-yellow p-3 rounded-2xl flex items-center justify-center gap-2 w-36 text-white font-mono text-xs font-bold transition-all active:scale-95"
              >
                <Radio className="w-4 h-4 text-ferrari-yellow" />
                <span>PIT RADIO</span>
              </button>

              {/* Right Paddle Shifter Upshift */}
              <Magnet padding={60} magnetStrength={2.5}>
                <button
                  onClick={handleShiftUp}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#141620] to-[#1E2230] border-2 border-white/20 text-white font-display font-black text-sm uppercase tracking-wider hover:border-emerald-400 flex items-center gap-2 active:scale-95 shadow-lg"
                >
                  <span>PADDLE UP</span>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>
              </Magnet>
            </div>
          </div>

          {/* Bottom Rotary Switch Rack */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {/* Strat Mode Dial */}
            <div className="flex flex-col items-center cursor-pointer group" onClick={handleStratCycle}>
              <span className="font-mono text-[10px] text-white/50 tracking-wider mb-2">ENGINE STRAT</span>
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#2B3042] to-[#151722] border-2 border-ferrari-yellow flex items-center justify-center relative shadow-lg group-hover:border-white transition-all">
                <div
                  className="w-1.5 h-5 bg-ferrari-yellow rounded-full absolute -top-1 transition-transform"
                  style={{ transform: `rotate(${(stratMode - 1) * 36}deg)` }}
                />
                <span className="font-mono font-black text-xs text-white">{stratMode}</span>
              </div>
              <span className="font-mono text-[9px] text-ferrari-yellow mt-1">CLICK TO ROTATE</span>
            </div>

            {/* Differential Rotary Dial */}
            <div
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => {
                audioEngine.playMechanicalClick()
                setDiffEntry((d) => (d >= 10 ? 1 : d + 1))
              }}
            >
              <span className="font-mono text-[10px] text-white/50 tracking-wider mb-2">DIFF ENTRY</span>
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#2B3042] to-[#151722] border-2 border-ferrari-red flex items-center justify-center relative shadow-lg group-hover:border-white transition-all">
                <div
                  className="w-1.5 h-5 bg-ferrari-red rounded-full absolute -top-1 transition-transform"
                  style={{ transform: `rotate(${diffEntry * 32}deg)` }}
                />
                <span className="font-mono font-black text-xs text-white">{diffEntry}</span>
              </div>
              <span className="font-mono text-[9px] text-ferrari-red mt-1">CLICK TO ROTATE</span>
            </div>

            {/* Cavallino Shield Center Badge */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-14 bg-ferrari-yellow rounded-b-xl border-2 border-black flex items-center justify-center shadow-lg">
                <span className="font-serif font-black text-black text-xl">🐎</span>
              </div>
              <span className="font-mono text-[9px] text-white/40 uppercase mt-1">MARANELLO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SteeringWheelSimulator

