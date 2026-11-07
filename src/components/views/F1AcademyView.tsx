import React, { useState } from 'react'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { Trophy, Award, Flag, Users, Sparkles, ChevronRight } from 'lucide-react'

export const F1AcademyView: React.FC = () => {
  const [activeSeries, setActiveSeries] = useState<'f1-academy' | 'f2' | 'f3'>('f1-academy')

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            FEEDER SERIES & JUNIOR FORMULA ECOSYSTEM
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            F1 ACADEMY & <ShinyText text="SUPPORT SERIES" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>

        {/* Series Switcher */}
        <div className="flex rounded-xl bg-[#0E1118] p-1.5 border border-white/10 font-mono text-xs">
          {(['f1-academy', 'f2', 'f3'] as const).map((series) => (
            <button
              key={series}
              onClick={() => setActiveSeries(series)}
              className={`px-4 py-1.5 rounded-lg font-bold uppercase transition-all ${
                activeSeries === series ? 'bg-ferrari-red text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {series === 'f1-academy' ? 'F1 ACADEMY' : series.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Ferrari Driver Academy Spotlight Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#220404] via-[#10121C] to-[#0A0C12] border-2 border-ferrari-red/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ferrari-red/20 border border-ferrari-red/40 w-max">
              <span className="w-2 h-2 rounded-full bg-ferrari-red animate-ping" />
              <span className="font-mono text-xs text-white uppercase font-bold">
                FERRARI DRIVER ACADEMY SPOTLIGHT
              </span>
            </div>
            <h2 className="font-display font-black text-3xl text-white uppercase">
              MAYA WEUG // FDA F1 ACADEMY PILOT
            </h2>
            <p className="font-sans text-sm text-white/70 max-w-xl">
              First female member of the Ferrari Driver Academy, competing in F1 Academy with Prema Racing under the iconic Scuderia Ferrari crest.
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono text-center">
            <div className="bg-black/50 p-4 rounded-2xl border border-white/10">
              <span className="text-white/40 text-[10px] block">POLES</span>
              <span className="font-display font-black text-2xl text-ferrari-yellow">3</span>
            </div>
            <div className="bg-black/50 p-4 rounded-2xl border border-white/10">
              <span className="text-white/40 text-[10px] block">PODIUMS</span>
              <span className="font-display font-black text-2xl text-white">7</span>
            </div>
            <div className="bg-black/50 p-4 rounded-2xl border border-white/10">
              <span className="text-white/40 text-[10px] block">STANDINGS</span>
              <span className="font-display font-black text-2xl text-emerald-400">P2</span>
            </div>
          </div>
        </div>

        {/* Support Series Standings Table */}
        <div className="rounded-3xl bg-[#0B0D14] border border-white/10 p-6 shadow-xl">
          <h3 className="font-display font-black text-xl text-white uppercase mb-4">
            {activeSeries === 'f1-academy' ? 'F1 ACADEMY DRIVER STANDINGS' : `${activeSeries.toUpperCase()} CHAMPIONSHIP LEADERBOARD`}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase pb-2">
                  <th className="pb-3 px-3">POS</th>
                  <th className="pb-3 px-3">DRIVER</th>
                  <th className="pb-3 px-3">TEAM</th>
                  <th className="pb-3 px-3 text-center">WINS</th>
                  <th className="pb-3 px-3 text-center">PODIUMS</th>
                  <th className="pb-3 px-3 text-right">POINTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { pos: 1, name: 'Abbi Pulling', team: 'Rodin Motorsport (Alpine)', wins: 7, podiums: 12, pts: 268 },
                  { pos: 2, name: 'Maya Weug', team: 'MP Motorsport (Ferrari)', wins: 2, podiums: 8, pts: 172, isFerrari: true },
                  { pos: 3, name: 'Doriane Pin', team: 'Prema Racing (Mercedes)', wins: 2, podiums: 6, pts: 165 },
                  { pos: 4, name: 'Chloe Chambers', team: 'Campos Racing (Haas)', wins: 1, podiums: 4, pts: 112 },
                ].map((row) => (
                  <tr key={row.pos} className={`hover:bg-white/5 ${row.isFerrari ? 'bg-ferrari-red/15 font-bold' : ''}`}>
                    <td className="py-3 px-3 font-display font-black text-sm">P{row.pos}</td>
                    <td className="py-3 px-3 font-display font-bold text-white">{row.name}</td>
                    <td className="py-3 px-3 text-white/60">{row.team}</td>
                    <td className="py-3 px-3 text-center text-ferrari-yellow">{row.wins}</td>
                    <td className="py-3 px-3 text-center text-white/80">{row.podiums}</td>
                    <td className="py-3 px-3 text-right font-display font-black text-sm text-white">{row.pts} PTS</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default F1AcademyView

