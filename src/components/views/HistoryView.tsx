import React, { useState } from 'react'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { Trophy, Award, Flag, Flame, ChevronRight } from 'lucide-react'

export const HistoryView: React.FC = () => {
  const [selectedDecade, setSelectedDecade] = useState('2000s')

  const champions = [
    { year: 2024, driver: 'Max Verstappen', team: 'Red Bull Racing' },
    { year: 2023, driver: 'Max Verstappen', team: 'Red Bull Racing' },
    { year: 2022, driver: 'Max Verstappen', team: 'Red Bull Racing' },
    { year: 2021, driver: 'Max Verstappen', team: 'Red Bull Racing' },
    { year: 2020, driver: 'Lewis Hamilton', team: 'Mercedes' },
    { year: 2019, driver: 'Lewis Hamilton', team: 'Mercedes' },
    { year: 2018, driver: 'Lewis Hamilton', team: 'Mercedes' },
    { year: 2017, driver: 'Lewis Hamilton', team: 'Mercedes' },
    { year: 2007, driver: 'Kimi Räikkönen', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 2004, driver: 'Michael Schumacher', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 2003, driver: 'Michael Schumacher', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 2002, driver: 'Michael Schumacher', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 2001, driver: 'Michael Schumacher', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 2000, driver: 'Michael Schumacher', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 1979, driver: 'Jody Scheckter', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 1977, driver: 'Niki Lauda', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 1975, driver: 'Niki Lauda', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 1964, driver: 'John Surtees', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 1961, driver: 'Phil Hill', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 1958, driver: 'Mike Hawthorn', team: 'Scuderia Ferrari', isFerrari: true },
    { year: 1956, driver: 'Juan Manuel Fangio', team: 'Ferrari', isFerrari: true },
    { year: 1953, driver: 'Alberto Ascari', team: 'Ferrari', isFerrari: true },
    { year: 1952, driver: 'Alberto Ascari', team: 'Ferrari', isFerrari: true },
  ]

  const records = [
    { title: 'MOST CONSTRUCTORS TITLES', holder: 'Scuderia Ferrari', stat: '16 Titles', isFerrari: true },
    { title: 'MOST DRIVERS TITLES', holder: 'Michael Schumacher / Lewis Hamilton', stat: '7 Titles' },
    { title: 'MOST GRAND PRIX WINS', holder: 'Lewis Hamilton', stat: '105 Wins' },
    { title: 'MOST POLE POSITIONS', holder: 'Lewis Hamilton', stat: '104 Poles' },
    { title: 'MOST PODIUMS', holder: 'Lewis Hamilton', stat: '201 Podiums' },
    { title: 'MOST FERRARI WINS', holder: 'Michael Schumacher', stat: '72 Wins', isFerrari: true },
    { title: 'FASTEST F1 LAP EVER', holder: 'Lewis Hamilton (Monza 2020)', stat: '264.362 km/h' },
  ]

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            MOTORSPORT HISTORICAL ARCHIVE // 1950 - 2026
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            F1 & FERRARI <ShinyText text="HALL OF FAME & RECORDS" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* All-Time Records Grid */}
        <div>
          <h2 className="font-display font-black text-xl text-white uppercase mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-ferrari-yellow" />
            ALL-TIME FORMULA ONE PINNACLE RECORDS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {records.map((rec) => (
              <div
                key={rec.title}
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  rec.isFerrari
                    ? 'bg-gradient-to-br from-[#200505] to-[#0A0C12] border-ferrari-red/60 shadow-[0_0_20px_rgba(255,40,0,0.3)]'
                    : 'bg-[#0B0D14] border-white/10'
                }`}
              >
                <span className="font-mono text-[10px] text-white/40 uppercase mb-2">{rec.title}</span>
                <span className="font-display font-black text-2xl text-white uppercase mb-1">{rec.stat}</span>
                <span className="font-mono text-xs text-ferrari-yellow">{rec.holder}</span>
              </div>
            ))}
          </div>
        </div>

        {/* World Champions Chronology */}
        <div className="rounded-3xl bg-[#0B0D14] border border-white/10 p-6 shadow-2xl">
          <h2 className="font-display font-black text-xl text-white uppercase mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            WORLD DRIVERS CHAMPIONS CHRONOLOGY
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {champions.map((c) => (
              <div
                key={c.year}
                className={`p-3.5 rounded-xl border flex items-center justify-between font-mono text-xs ${
                  c.isFerrari
                    ? 'bg-gradient-to-r from-ferrari-red/20 to-[#0F1118] border-ferrari-red/50 text-white font-bold'
                    : 'bg-[#0E1119] border-white/5 text-white/80'
                }`}
              >
                <span className="font-display font-black text-sm text-ferrari-yellow">{c.year}</span>
                <span className="font-bold text-white">{c.driver}</span>
                <span className="text-[10px] text-white/40 truncate max-w-[100px]">{c.team}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryView

