import React, { useState } from 'react'
import { DRIVERS } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import { SlidersHorizontal, Activity, ArrowUp, ChevronLeft } from 'lucide-react'

export const TelemetryCompareView: React.FC = () => {
  const [driverAId, setDriverAId] = useState<string>('charles-leclerc')
  const [driverBId, setDriverBId] = useState<string>('max-verstappen')

  const driverA = DRIVERS.find((d) => d.id === driverAId) || DRIVERS[0]
  const driverB = DRIVERS.find((d) => d.id === driverBId) || DRIVERS[2]

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            ADVANCED TELEMETRY COMPARATOR // DRIVER STATS & LIVE TRACE AUDIT
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            DRIVER <ShinyText text="HEAD-TO-HEAD AUDIT" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>

        <a
          href="#live-telemetry"
          className="px-4 py-2 rounded-xl bg-[#141824] border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider hover:border-ferrari-red transition-all flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN TO WORKSTATION</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Driver Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Driver A Selector */}
          <div className="p-5 rounded-2xl bg-[#0B0D14] border border-ferrari-red/60 shadow-lg">
            <label className="block text-ferrari-red font-bold uppercase mb-2">
              DRIVER 1 (PRIMARY)
            </label>
            <select
              value={driverAId}
              onChange={(e) => setDriverAId(e.target.value)}
              className="w-full bg-[#151924] border border-white/20 rounded-xl px-4 py-3 text-white font-display font-bold uppercase tracking-wider focus:outline-none focus:border-ferrari-red"
            >
              {DRIVERS.map((d) => (
                <option key={d.id} value={d.id}>
                  #{d.number} {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>

          {/* Driver B Selector */}
          <div className="p-5 rounded-2xl bg-[#0B0D14] border border-ferrari-yellow/60 shadow-lg">
            <label className="block text-ferrari-yellow font-bold uppercase mb-2">
              DRIVER 2 (COMPARISON)
            </label>
            <select
              value={driverBId}
              onChange={(e) => setDriverBId(e.target.value)}
              className="w-full bg-[#151924] border border-white/20 rounded-xl px-4 py-3 text-white font-display font-bold uppercase tracking-wider focus:outline-none focus:border-ferrari-yellow"
            >
              {DRIVERS.map((d) => (
                <option key={d.id} value={d.id}>
                  #{d.number} {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Head-to-Head Statistics Comparison Card */}
        <div className="p-6 rounded-3xl bg-[#0A0C14] border border-ferrari-border/80 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Driver A Profile */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <span className="text-4xl font-display font-black text-ferrari-red">#{driverA.number}</span>
              <h3 className="font-display font-black text-2xl text-white uppercase">{driverA.name}</h3>
              <span className="font-mono text-xs text-white/50">{driverA.team}</span>
            </div>

            {/* Metrics Center */}
            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red">{driverA.wins}</span>
                <span className="text-white/40 uppercase">GRAND PRIX WINS</span>
                <span className="font-bold text-ferrari-yellow">{driverB.wins}</span>
              </div>
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red">{driverA.poles}</span>
                <span className="text-white/40 uppercase">POLE POSITIONS</span>
                <span className="font-bold text-ferrari-yellow">{driverB.poles}</span>
              </div>
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red">{driverA.podiums}</span>
                <span className="text-white/40 uppercase">PODIUM FINISHES</span>
                <span className="font-bold text-ferrari-yellow">{driverB.podiums}</span>
              </div>
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red">{driverA.careerPoints}</span>
                <span className="text-white/40 uppercase">CAREER POINTS</span>
                <span className="font-bold text-ferrari-yellow">{driverB.careerPoints}</span>
              </div>
            </div>

            {/* Driver B Profile */}
            <div className="text-center md:text-right flex flex-col items-center md:items-end">
              <span className="text-4xl font-display font-black text-ferrari-yellow">#{driverB.number}</span>
              <h3 className="font-display font-black text-2xl text-white uppercase">{driverB.name}</h3>
              <span className="font-mono text-xs text-white/50">{driverB.team}</span>
            </div>
          </div>
        </div>

        {/* Speed vs Distance Overlay Status Card */}
        <div className="p-6 rounded-3xl bg-[#090B12] border border-ferrari-border/80 shadow-2xl font-mono text-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-black text-lg text-white uppercase">
              LIVE SPEED TRACE COMPARISON (KM/H VS TRACK DISTANCE)
            </h3>
            <span className="text-white/50">STATUS: ZERO SYNTHETIC DATA</span>
          </div>

          <div className="w-full bg-[#040508] rounded-2xl p-10 border border-white/5 text-center flex flex-col items-center gap-3">
            <Activity className="w-10 h-10 text-neutral-600" />
            <span className="font-bold text-white text-sm">NO LIVE SPEED TRACE TELEMETRY AVAILABLE</span>
            <p className="text-neutral-400 text-xs max-w-lg leading-relaxed">
              Real-time sector speed delta curves require both cars actively transmitting telemetry from a live Grand Prix session. In accordance with platform authenticity policy, synthetic or interpolated curves are never generated.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TelemetryCompareView
