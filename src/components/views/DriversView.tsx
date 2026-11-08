import React, { useState } from 'react'
import { DRIVERS, Driver } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import { SlidersHorizontal } from 'lucide-react'

export const DriversView: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver>(DRIVERS[0])
  const [compareAId, setCompareAId] = useState<string>('charles-leclerc')
  const [compareBId, setCompareBId] = useState<string>('lewis-hamilton')

  const driverA = DRIVERS.find((d) => d.id === compareAId) || DRIVERS[0]
  const driverB = DRIVERS.find((d) => d.id === compareBId) || DRIVERS[1]

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-[#E10600]" />
            <span className="font-mono text-[10px] text-[#858585] uppercase tracking-widest block">
              WORLD DRIVERS CHAMPIONSHIP ARCHIVE // 20 PILOTS
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            FORMULA 1 <ShinyText text="DRIVERS ARCHIVE" speed={2.5} className="text-[#FED500]" />
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Drivers Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DRIVERS.map((driver) => {
            const isSelected = selectedDriver.id === driver.id
            const isFerrari = driver.teamId === 'ferrari'

            return (
              <div
                key={driver.id}
                onClick={() => setSelectedDriver(driver)}
                className={`p-4 rounded-none border cursor-pointer transition-colors flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#150D10] border-[#E10600] border-l-4 border-l-[#E10600]'
                    : isFerrari
                    ? 'bg-[#0E1017] border-[#3B1A1E] border-l-2 border-l-[#E10600] hover:border-[#E10600]'
                    : 'bg-[#0E1017] border-[#292929] hover:border-[#444444]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-black text-xl text-white tabular-nums">#{driver.number}</span>
                    <span className="text-lg">{driver.flag}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white uppercase leading-tight mb-1">
                    {driver.name}
                  </h3>
                  <span className="font-mono text-xs text-[#FED500] font-bold block mb-2 uppercase">
                    {driver.team}
                  </span>
                  <p className="font-sans text-xs text-[#858585] line-clamp-3 mb-3 leading-relaxed">{driver.bio}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-center pt-2.5 border-t border-[#222222] text-xs">
                  <div>
                    <span className="text-[#858585] text-[9px] block uppercase">WINS</span>
                    <span className="font-bold text-[#E10600] tabular-nums">{driver.wins}</span>
                  </div>
                  <div>
                    <span className="text-[#858585] text-[9px] block uppercase">PODIUMS</span>
                    <span className="font-bold text-white tabular-nums">{driver.podiums}</span>
                  </div>
                  <div>
                    <span className="text-[#858585] text-[9px] block uppercase">POINTS</span>
                    <span className="font-bold text-emerald-400 tabular-nums">{driver.seasonPoints}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Head-to-Head Comparison Section */}
        <div className="p-6 rounded-none bg-[#0B0D14] border border-[#292929] shadow-2xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#222222]">
            <SlidersHorizontal className="w-4 h-4 text-[#FED500]" />
            <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              HEAD-TO-HEAD DRIVER COMPARATOR
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block font-mono text-[10px] text-[#858585] mb-1 uppercase tracking-wider">PILOT 1</label>
              <select
                value={compareAId}
                onChange={(e) => setCompareAId(e.target.value)}
                className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
              >
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id}>
                    #{d.number} {d.name.toUpperCase()} ({d.team.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#858585] mb-1 uppercase tracking-wider">PILOT 2</label>
              <select
                value={compareBId}
                onChange={(e) => setCompareBId(e.target.value)}
                className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
              >
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id}>
                    #{d.number} {d.name.toUpperCase()} ({d.team.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center border-t border-[#222222] pt-4">
            <div className="font-display font-bold text-base text-[#E10600] uppercase">#{driverA.number} {driverA.name}</div>
            <div className="text-[#858585] uppercase text-[10px] self-center">METRIC</div>
            <div className="font-display font-bold text-base text-[#FED500] uppercase">#{driverB.number} {driverB.name}</div>

            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverA.championships}</div>
            <div className="p-2.5 text-[#858585] text-[10px] uppercase self-center">WORLD TITLES</div>
            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverB.championships}</div>

            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverA.wins}</div>
            <div className="p-2.5 text-[#858585] text-[10px] uppercase self-center">GRAND PRIX WINS</div>
            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverB.wins}</div>

            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverA.poles}</div>
            <div className="p-2.5 text-[#858585] text-[10px] uppercase self-center">POLE POSITIONS</div>
            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverB.poles}</div>

            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverA.podiums}</div>
            <div className="p-2.5 text-[#858585] text-[10px] uppercase self-center">PODIUMS</div>
            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverB.podiums}</div>

            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverA.fastestLaps}</div>
            <div className="p-2.5 text-[#858585] text-[10px] uppercase self-center">FASTEST LAPS</div>
            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverB.fastestLaps}</div>

            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverA.careerPoints}</div>
            <div className="p-2.5 text-[#858585] text-[10px] uppercase self-center">CAREER POINTS</div>
            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{driverB.careerPoints}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriversView
