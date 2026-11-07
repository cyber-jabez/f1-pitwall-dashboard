import React, { useState } from 'react'
import { DRIVERS, Driver } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { Trophy, Award, SlidersHorizontal, Flag, Zap } from 'lucide-react'

export const DriversView: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver>(DRIVERS[0])
  const [compareAId, setCompareAId] = useState<string>('charles-leclerc')
  const [compareBId, setCompareBId] = useState<string>('lewis-hamilton')

  const driverA = DRIVERS.find((d) => d.id === compareAId) || DRIVERS[0]
  const driverB = DRIVERS.find((d) => d.id === compareBId) || DRIVERS[1]

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            2025/2026 WORLD DRIVERS GRID // 20 PILOTS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            FORMULA 1 <ShinyText text="DRIVERS ARCHIVE" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Drivers Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DRIVERS.map((driver) => (
            <div
              key={driver.id}
              onClick={() => setSelectedDriver(driver)}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedDriver.id === driver.id
                  ? 'bg-gradient-to-br from-[#1C1F2E] to-[#0A0D14] border-ferrari-red shadow-[0_0_25px_rgba(255,40,0,0.3)] scale-[1.02]'
                  : driver.teamId === 'ferrari'
                  ? 'bg-gradient-to-br from-[#1A0505] to-[#090B10] border-ferrari-red/40 hover:border-ferrari-red'
                  : 'bg-[#0B0D14] border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-display font-black text-2xl text-white">#{driver.number}</span>
                  <span className="text-xl">{driver.flag}</span>
                </div>
                <h3 className="font-display font-black text-xl text-white uppercase leading-tight mb-1">
                  {driver.name}
                </h3>
                <span className="font-mono text-xs text-ferrari-yellow font-bold block mb-3">
                  {driver.team}
                </span>
                <p className="font-sans text-xs text-white/60 line-clamp-3 mb-4">{driver.bio}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-center pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-white/40 text-[9px] block">WINS</span>
                  <span className="font-bold text-ferrari-red">{driver.wins}</span>
                </div>
                <div>
                  <span className="text-white/40 text-[9px] block">PODIUMS</span>
                  <span className="font-bold text-white">{driver.podiums}</span>
                </div>
                <div>
                  <span className="text-white/40 text-[9px] block">POINTS</span>
                  <span className="font-bold text-emerald-400">{driver.seasonPoints}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Head-to-Head Comparison Section */}
        <div className="p-8 rounded-3xl bg-[#090B12] border border-ferrari-border/80 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="w-5 h-5 text-ferrari-yellow" />
            <h2 className="font-display font-black text-xl text-white uppercase">
              HEAD-TO-HEAD DRIVER COMPARATOR
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-mono text-xs text-white/60 mb-1">PILOT 1</label>
              <select
                value={compareAId}
                onChange={(e) => setCompareAId(e.target.value)}
                className="w-full bg-[#121520] border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
              >
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id}>
                    #{d.number} {d.name} ({d.team})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs text-white/60 mb-1">PILOT 2</label>
              <select
                value={compareBId}
                onChange={(e) => setCompareBId(e.target.value)}
                className="w-full bg-[#121520] border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
              >
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id}>
                    #{d.number} {d.name} ({d.team})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center border-t border-white/10 pt-4">
            <div className="font-display font-bold text-base text-ferrari-red">#{driverA.number} {driverA.name}</div>
            <div className="text-white/40 uppercase">METRIC</div>
            <div className="font-display font-bold text-base text-ferrari-yellow">#{driverB.number} {driverB.name}</div>

            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverA.championships}</div>
            <div className="p-2 text-white/50">WORLD TITLES</div>
            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverB.championships}</div>

            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverA.wins}</div>
            <div className="p-2 text-white/50">GRAND PRIX WINS</div>
            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverB.wins}</div>

            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverA.poles}</div>
            <div className="p-2 text-white/50">POLE POSITIONS</div>
            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverB.poles}</div>

            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverA.podiums}</div>
            <div className="p-2 text-white/50">PODIUMS</div>
            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverB.podiums}</div>

            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverA.fastestLaps}</div>
            <div className="p-2 text-white/50">FASTEST LAPS</div>
            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverB.fastestLaps}</div>

            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverA.careerPoints}</div>
            <div className="p-2 text-white/50">CAREER POINTS</div>
            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{driverB.careerPoints}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriversView

