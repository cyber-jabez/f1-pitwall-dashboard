import React, { useState } from 'react'
import { TEAMS, Team } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import { SlidersHorizontal } from 'lucide-react'

export const TeamsView: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team>(TEAMS[0])
  const [compareTeamA, setCompareTeamA] = useState<string>('ferrari')
  const [compareTeamB, setCompareTeamB] = useState<string>('mclaren')

  const teamA = TEAMS.find((t) => t.id === compareTeamA) || TEAMS[0]
  const teamB = TEAMS.find((t) => t.id === compareTeamB) || TEAMS[1]

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-[#E10600]" />
            <span className="font-mono text-[10px] text-[#858585] uppercase tracking-widest block">
              WORLD CONSTRUCTORS CHAMPIONSHIP // 10 ENTRANTS
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            FORMULA 1 <ShinyText text="TEAMS & CONSTRUCTORS" speed={2.5} className="text-[#FED500]" />
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Teams Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAMS.map((team) => {
            const isSelected = selectedTeam.id === team.id
            const isFerrari = team.id === 'ferrari'

            return (
              <div
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={`p-5 rounded-none border cursor-pointer transition-colors flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#150D10] border-[#E10600] border-l-4 border-l-[#E10600]'
                    : isFerrari
                    ? 'bg-[#0E1017] border-[#3B1A1E] border-l-2 border-l-[#E10600] hover:border-[#E10600]'
                    : 'bg-[#0E1017] border-[#292929] hover:border-[#444444]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-[10px] text-[#858585] uppercase tracking-wider">{team.base}</span>
                    <span className="w-3 h-3 rounded-none shrink-0" style={{ backgroundColor: team.color }} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white uppercase mb-1 tracking-wide">{team.name}</h3>
                  <p className="font-sans text-xs text-[#858585] mb-4 line-clamp-2 leading-relaxed">{team.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-center pt-3 border-t border-[#222222] text-xs">
                  <div>
                    <span className="text-[#858585] text-[9px] block uppercase">TITLES</span>
                    <span className="font-bold text-[#FED500] tabular-nums">{team.championships}</span>
                  </div>
                  <div>
                    <span className="text-[#858585] text-[9px] block uppercase">WINS</span>
                    <span className="font-bold text-white tabular-nums">{team.wins}</span>
                  </div>
                  <div>
                    <span className="text-[#858585] text-[9px] block uppercase">POINTS</span>
                    <span className="font-bold text-emerald-400 tabular-nums">{team.seasonPoints}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Interactive Team Head-to-Head Comparison Tool */}
        <div className="p-6 rounded-none bg-[#0B0D14] border border-[#292929] shadow-2xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#222222]">
            <SlidersHorizontal className="w-4 h-4 text-[#FED500]" />
            <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              INTERACTIVE TEAM HEAD-TO-HEAD COMPARISON
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block font-mono text-[10px] text-[#858585] mb-1 uppercase tracking-wider">SELECT TEAM 1</label>
              <select
                value={compareTeamA}
                onChange={(e) => setCompareTeamA(e.target.value)}
                className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
              >
                {TEAMS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#858585] mb-1 uppercase tracking-wider">SELECT TEAM 2</label>
              <select
                value={compareTeamB}
                onChange={(e) => setCompareTeamB(e.target.value)}
                className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
              >
                {TEAMS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center border-t border-[#222222] pt-4">
            <div className="font-display font-bold text-base text-[#E10600] uppercase">{teamA.name}</div>
            <div className="text-[#858585] uppercase text-[10px] self-center">METRIC</div>
            <div className="font-display font-bold text-base text-[#FED500] uppercase">{teamB.name}</div>

            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{teamA.championships}</div>
            <div className="p-2.5 text-[#858585] text-[10px] uppercase self-center">WORLD TITLES</div>
            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{teamB.championships}</div>

            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{teamA.wins}</div>
            <div className="p-2.5 text-[#858585] text-[10px] uppercase self-center">GRAND PRIX WINS</div>
            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{teamB.wins}</div>

            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{teamA.podiums}</div>
            <div className="p-2.5 text-[#858585] text-[10px] uppercase self-center">PODIUMS</div>
            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold tabular-nums">{teamB.podiums}</div>

            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold uppercase">{teamA.powerUnit}</div>
            <div className="p-2.5 text-[#858585] text-[10px] uppercase self-center">POWER UNIT</div>
            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold uppercase">{teamB.powerUnit}</div>

            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold uppercase">{teamA.principal}</div>
            <div className="p-2.5 text-[#858585] text-[10px] uppercase self-center">TEAM PRINCIPAL</div>
            <div className="p-2.5 bg-[#111111] rounded-none border border-[#222222] font-bold uppercase">{teamB.principal}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamsView
