import React, { useState } from 'react'
import { GRAND_PRIX_CALENDAR, GrandPrix } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { MapPin, Flag, ChevronRight, Gauge } from 'lucide-react'

export const CircuitsView: React.FC = () => {
  const [selectedCircuit, setSelectedCircuit] = useState<GrandPrix>(GRAND_PRIX_CALENDAR[0])

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            CIRCUIT DATABASE // 24 GLOBAL RACING SANCTUARIES
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            FORMULA 1 <ShinyText text="CIRCUITS ATLAS" speed={2.5} className="text-ferrari-red" />
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Circuits Selector List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 max-h-[750px] overflow-y-auto pr-2">
          {GRAND_PRIX_CALENDAR.map((gp) => (
            <div
              key={gp.id}
              onClick={() => setSelectedCircuit(gp)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedCircuit.id === gp.id
                  ? 'bg-gradient-to-r from-ferrari-red/20 to-[#10131E] border-ferrari-red shadow-[0_0_20px_rgba(255,40,0,0.3)]'
                  : 'bg-[#0B0D14] border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <span className="font-mono text-[10px] text-white/50 uppercase block">{gp.country}</span>
                <h3 className="font-display font-black text-base text-white">{gp.circuitName}</h3>
                <span className="font-mono text-xs text-ferrari-yellow">{gp.circuitLengthKm} KM // {gp.turns} TURNS</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" />
            </div>
          ))}
        </div>

        {/* Selected Circuit Detailed Showcase (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-[#090B12] border-2 border-ferrari-border/80 shadow-2xl flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-ferrari-red" />
                <span className="font-mono text-xs text-white/60 uppercase">{selectedCircuit.city}, {selectedCircuit.country}</span>
              </div>
              <h2 className="font-display font-black text-3xl text-white uppercase">{selectedCircuit.circuitName}</h2>
              <span className="font-mono text-xs text-ferrari-yellow font-bold mt-1 block">{selectedCircuit.name}</span>
            </div>

            {/* Circuit Track Geometry Visualizer */}
            <div className="relative w-full aspect-[2.4/1] bg-[#040508] rounded-2xl p-6 flex items-center justify-center border border-white/5">
              <svg viewBox="0 0 600 220" className="w-full h-full max-h-56">
                <path
                  d="M 60 160 L 260 160 Q 280 160 290 145 L 340 70 Q 355 50 380 50 L 510 50 Q 560 50 560 100 Q 560 150 510 150 L 410 150 L 370 120 L 330 150 L 120 150 Q 70 150 60 160 Z"
                  fill="none"
                  stroke="#FF2800"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Technical Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
              <div className="p-3 bg-[#111420] rounded-xl border border-white/5">
                <span className="text-[10px] text-white/40 block">LENGTH</span>
                <span className="font-bold text-white text-base">{selectedCircuit.circuitLengthKm} KM</span>
              </div>
              <div className="p-3 bg-[#111420] rounded-xl border border-white/5">
                <span className="text-[10px] text-white/40 block">TURNS</span>
                <span className="font-bold text-white text-base">{selectedCircuit.turns}</span>
              </div>
              <div className="p-3 bg-[#111420] rounded-xl border border-white/5">
                <span className="text-[10px] text-white/40 block">DRS ZONES</span>
                <span className="font-bold text-emerald-400 text-base">{selectedCircuit.drsZones} ZONES</span>
              </div>
              <div className="p-3 bg-[#111420] rounded-xl border border-white/5">
                <span className="text-[10px] text-white/40 block">RACE DISTANCE</span>
                <span className="font-bold text-ferrari-yellow text-base">{selectedCircuit.raceDistanceKm} KM</span>
              </div>
            </div>

            {/* Lap Record Callout */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-ferrari-yellow/15 to-transparent border border-ferrari-yellow/40 flex justify-between items-center font-mono text-xs">
              <div>
                <span className="text-white/40 text-[10px] uppercase block">OFFICIAL ALL-TIME LAP RECORD</span>
                <span className="text-white font-bold">{selectedCircuit.lapRecord.driver}</span>
              </div>
              <span className="font-display font-black text-xl text-ferrari-yellow">{selectedCircuit.lapRecord.time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircuitsView

