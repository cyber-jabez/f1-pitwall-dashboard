import React, { useState } from 'react'
import { GRAND_PRIX_CALENDAR, GrandPrix } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import { MapPin, ChevronRight } from 'lucide-react'

export const CircuitsView: React.FC = () => {
  const [selectedCircuit, setSelectedCircuit] = useState<GrandPrix>(GRAND_PRIX_CALENDAR[0])

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-[#E10600]" />
            <span className="font-mono text-[10px] text-[#858585] uppercase tracking-widest block">
              CIRCUIT DATABASE // 24 GLOBAL RACING SANCTUARIES
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            FORMULA 1 <ShinyText text="CIRCUITS ATLAS" speed={2.5} className="text-[#FED500]" />
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Circuits Selector List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-2 max-h-[750px] overflow-y-auto pr-1">
          {GRAND_PRIX_CALENDAR.map((gp) => {
            const isSelected = selectedCircuit.id === gp.id

            return (
              <div
                key={gp.id}
                onClick={() => setSelectedCircuit(gp)}
                className={`p-3.5 rounded-none border cursor-pointer transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#150D10] border-[#E10600] border-l-4 border-l-[#E10600]'
                    : 'bg-[#0E1017] border-[#292929] hover:border-[#444444]'
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] text-[#858585] uppercase block tracking-wider">
                    {gp.country}
                  </span>
                  <h3 className="font-display font-bold text-base text-white uppercase">{gp.circuitName}</h3>
                  <span className="font-mono text-xs text-[#FED500] tabular-nums">
                    {gp.circuitLengthKm} KM <span className="text-[#555555]">//</span> {gp.turns} TURNS
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#E10600]' : 'text-[#555555]'}`} />
              </div>
            )
          })}
        </div>

        {/* Selected Circuit Detailed Showcase (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-none bg-[#0B0D14] border border-[#292929] shadow-2xl flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
                <span className="font-mono text-[10px] text-[#858585] uppercase tracking-wider">
                  {selectedCircuit.city}, {selectedCircuit.country}
                </span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-tight">
                {selectedCircuit.circuitName}
              </h2>
              <span className="font-mono text-xs text-[#FED500] font-bold mt-1 block uppercase">
                {selectedCircuit.name}
              </span>
            </div>

            {/* Circuit Track Geometry Visualizer */}
            <div className="relative w-full aspect-[2.4/1] bg-[#05060A] rounded-none p-6 flex items-center justify-center border border-[#222222]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,6,0,0.03)_0%,transparent_70%)] pointer-events-none" />
              <svg viewBox="0 0 600 220" className="w-full h-full max-h-56">
                <path
                  d="M 60 160 L 260 160 Q 280 160 290 145 L 340 70 Q 355 50 380 50 L 510 50 Q 560 50 560 100 Q 560 150 510 150 L 410 150 L 370 120 L 330 150 L 120 150 Q 70 150 60 160 Z"
                  fill="none"
                  stroke="#E10600"
                  strokeWidth="3.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
            </div>

            {/* Technical Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
              <div className="p-3 bg-[#111111] rounded-none border border-[#222222]">
                <span className="text-[9px] text-[#858585] block uppercase">LENGTH</span>
                <span className="font-bold text-white text-sm tabular-nums">{selectedCircuit.circuitLengthKm} KM</span>
              </div>
              <div className="p-3 bg-[#111111] rounded-none border border-[#222222]">
                <span className="text-[9px] text-[#858585] block uppercase">TURNS</span>
                <span className="font-bold text-white text-sm tabular-nums">{selectedCircuit.turns}</span>
              </div>
              <div className="p-3 bg-[#111111] rounded-none border border-[#222222]">
                <span className="text-[9px] text-[#858585] block uppercase">DRS ZONES</span>
                <span className="font-bold text-cyan-400 text-sm tabular-nums">{selectedCircuit.drsZones} ZONES</span>
              </div>
              <div className="p-3 bg-[#111111] rounded-none border border-[#222222]">
                <span className="text-[9px] text-[#858585] block uppercase">RACE DISTANCE</span>
                <span className="font-bold text-[#FED500] text-sm tabular-nums">{selectedCircuit.raceDistanceKm} KM</span>
              </div>
            </div>

            {/* Lap Record Callout */}
            <div className="p-3.5 rounded-none bg-[#15120D] border border-[#FED500]/40 flex justify-between items-center font-mono text-xs">
              <div>
                <span className="text-[#858585] text-[9px] uppercase block tracking-wider">
                  OFFICIAL ALL-TIME LAP RECORD
                </span>
                <span className="text-white font-bold uppercase">{selectedCircuit.lapRecord.driver}</span>
              </div>
              <span className="font-mono font-black text-lg text-[#FED500] tabular-nums">
                {selectedCircuit.lapRecord.time}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircuitsView
