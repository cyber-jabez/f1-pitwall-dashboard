import React, { useState } from 'react'
import { TEAMS, Team } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { Trophy, Wrench, Flag, Users, ChevronRight, SlidersHorizontal } from 'lucide-react'

export const TeamsView: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team>(TEAMS[0])
  const [compareTeamA, setCompareTeamA] = useState<string>('ferrari')
  const [compareTeamB, setCompareTeamB] = useState<string>('mclaren')

  const teamA = TEAMS.find((t) => t.id === compareTeamA) || TEAMS[0]
  const teamB = TEAMS.find((t) => t.id === compareTeamB) || TEAMS[1]

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            CONSTRUCTORS CHAMPIONSHIP // 10 CONTENDERS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            FORMULA 1 <ShinyText text="TEAMS & CONSTRUCTORS" speed={2.5} className="text-ferrari-red" />
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Teams Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAMS.map((team) => (
            <div
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedTeam.id === team.id
                  ? 'bg-gradient-to-br from-[#181D2B] to-[#0A0C12] border-ferrari-red shadow-[0_0_25px_rgba(255,40,0,0.3)] scale-[1.02]'
                  : 'bg-[#0B0D14] border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-xs text-white/50 uppercase tracking-wider">{team.base}</span>
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team.color }} />
                </div>
                <h3 className="font-display font-black text-2xl text-white uppercase mb-2">{team.name}</h3>
                <p className="font-sans text-xs text-white/60 mb-4 line-clamp-2">{team.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-center pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-white/40 text-[9px] block">TITLES</span>
                  <span className="font-bold text-ferrari-yellow">{team.championships}</span>
                </div>
                <div>
                  <span className="text-white/40 text-[9px] block">WINS</span>
                  <span className="font-bold text-white">{team.wins}</span>
                </div>
                <div>
                  <span className="text-white/40 text-[9px] block">POINTS</span>
                  <span className="font-bold text-emerald-400">{team.seasonPoints}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Team Head-to-Head Comparison Tool */}
        <div className="p-8 rounded-3xl bg-[#090B12] border border-ferrari-border/80 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="w-5 h-5 text-ferrari-red" />
            <h2 className="font-display font-black text-xl text-white uppercase">
              INTERACTIVE TEAM HEAD-TO-HEAD COMPARISON
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-mono text-xs text-white/60 mb-1">SELECT TEAM 1</label>
              <select
                value={compareTeamA}
                onChange={(e) => setCompareTeamA(e.target.value)}
                className="w-full bg-[#121520] border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
              >
                {TEAMS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs text-white/60 mb-1">SELECT TEAM 2</label>
              <select
                value={compareTeamB}
                onChange={(e) => setCompareTeamB(e.target.value)}
                className="w-full bg-[#121520] border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
              >
                {TEAMS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center border-t border-white/10 pt-4">
            <div className="font-display font-bold text-base text-ferrari-red">{teamA.name}</div>
            <div className="text-white/40 uppercase">METRIC</div>
            <div className="font-display font-bold text-base text-ferrari-yellow">{teamB.name}</div>

            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{teamA.championships}</div>
            <div className="p-2 text-white/50">WORLD TITLES</div>
            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{teamB.championships}</div>

            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{teamA.wins}</div>
            <div className="p-2 text-white/50">GRAND PRIX WINS</div>
            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{teamB.wins}</div>

            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{teamA.podiums}</div>
            <div className="p-2 text-white/50">PODIUMS</div>
            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{teamB.podiums}</div>

            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{teamA.powerUnit}</div>
            <div className="p-2 text-white/50">POWER UNIT</div>
            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{teamB.powerUnit}</div>

            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{teamA.principal}</div>
            <div className="p-2 text-white/50">TEAM PRINCIPAL</div>
            <div className="p-2 bg-[#0E1119] rounded-lg font-bold">{teamB.principal}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamsView

