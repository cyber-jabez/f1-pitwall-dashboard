import React, { useState, useEffect } from 'react'
import { jolpicaClient, RaceScheduleItem } from '../../services/jolpicaClient'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import type { ProvenanceMetadata } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import { ChevronRight, RefreshCw, ExternalLink } from 'lucide-react'

export const CalendarView: React.FC = () => {
  const [season, setSeason] = useState('current')
  const [races, setRaces] = useState<RaceScheduleItem[]>([])
  const [selectedRace, setSelectedRace] = useState<RaceScheduleItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [provenance, setProvenance] = useState<ProvenanceMetadata | null>(null)

  const loadCalendar = async (targetSeason: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await jolpicaClient.getRaceSchedule(targetSeason)
      setRaces(res.data)
      setProvenance(res.provenance)
      if (res.data.length > 0) {
        setSelectedRace(res.data[0])
      } else {
        setSelectedRace(null)
      }
    } catch {
      setError('Unable to load official race schedule from Jolpica/Ergast API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCalendar(season)
  }, [season])

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-[#E10600]" />
            <span className="font-mono text-[10px] text-[#858585] uppercase tracking-widest block">
              FIA FORMULA ONE WORLD CHAMPIONSHIP // JOLPICA ERGAST OFFICIAL CALENDAR
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            RACE <ShinyText text="CALENDAR" speed={2.5} className="text-[#FED500]" />
          </h1>
        </div>

        {/* Season Selector */}
        <div className="flex items-center gap-2.5">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="bg-[#111111] border border-[#292929] rounded-none px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
          >
            <option value="current">CURRENT SEASON (OFFICIAL FIA)</option>
            <option value="2024">2024 SEASON (24 RACES)</option>
            <option value="2023">2023 SEASON (22 RACES)</option>
            <option value="2022">2022 SEASON (22 RACES)</option>
          </select>

          <button
            onClick={() => loadCalendar(season)}
            className="p-2 rounded-none bg-[#111111] border border-[#292929] text-[#858585] hover:text-white hover:border-[#E10600] transition"
            title="Refresh Calendar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Provenance Badge */}
      {provenance && (
        <div className="max-w-7xl mx-auto mb-6">
          <DataProvenanceBadge
            provenance={provenance}
            title={`Jolpica Ergast Calendar // Season: ${season.toUpperCase()}`}
          />
        </div>
      )}

      {loading ? (
        <div className="max-w-7xl mx-auto rounded-none bg-[#0D0D0D] border border-[#222222] p-12 text-center font-mono">
          <div className="w-6 h-6 border-2 border-[#E10600] border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-[#858585] text-xs uppercase tracking-wider">
            LOADING CONFIRMED FIA GRAND PRIX SCHEDULE...
          </p>
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto rounded-none bg-[#140808] border border-[#E10600] p-6 text-center font-mono text-[#E10600] text-xs uppercase">
          <p>{error}</p>
        </div>
      ) : races.length === 0 ? (
        <div className="max-w-7xl mx-auto rounded-none bg-[#0D0D0D] border border-[#222222] p-12 text-center font-mono text-[#858585]">
          <p className="font-bold text-white mb-1 uppercase">NO RACE CALENDAR DATA AVAILABLE</p>
          <p className="text-xs text-[#666666]">No confirmed race events returned for this season schedule.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Race List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            {races.map((race) => {
              const isSelected = selectedRace?.round === race.round
              const hasSprint = Boolean(race.Sprint)
              return (
                <div
                  key={race.round}
                  onClick={() => setSelectedRace(race)}
                  className={`p-3.5 rounded-none border cursor-pointer transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#150D10] border-[#E10600] border-l-4 border-l-[#E10600]'
                      : 'bg-[#0E1017] border-[#292929] hover:border-[#444444]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-9 h-9 rounded-none bg-[#1A1A1A] border border-[#333333] font-mono font-black text-xs flex items-center justify-center text-[#FED500] shrink-0 tabular-nums">
                      R{race.round}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] font-bold text-[#858585] uppercase tracking-wider">
                          {race.Circuit.Location.country}
                        </span>
                        {hasSprint && (
                          <span className="px-1.5 py-0.2 rounded-none bg-emerald-950/60 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-500/40">
                            SPRINT
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-black text-base text-white leading-tight uppercase">
                        {race.raceName}
                      </h3>
                      <span className="font-mono text-[11px] text-[#A0A0A0]">
                        {race.Circuit.circuitName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center font-mono text-xs">
                    <div className="text-right">
                      <span className="text-[#858585] block text-[9px] uppercase">RACE DATE</span>
                      <span className="text-white font-bold tabular-nums">{race.date}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#E10600]' : 'text-[#555555]'}`} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected Race Details (5 cols) */}
          <div className="lg:col-span-5">
            {selectedRace && (
              <div className="sticky top-24 rounded-none bg-[#0B0D14] border border-[#292929] p-5 shadow-2xl flex flex-col gap-5 font-mono">
                <div>
                  <span className="px-2 py-0.5 rounded-none bg-[#FED500] text-black font-mono font-black text-[10px] uppercase tracking-wider inline-block mb-2">
                    ROUND {selectedRace.round} // {selectedRace.Circuit.Location.country.toUpperCase()}
                  </span>
                  <h2 className="font-display font-black text-2xl text-white uppercase leading-tight">
                    {selectedRace.raceName}
                  </h2>
                  <p className="text-xs text-[#858585] mt-1">
                    {selectedRace.Circuit.circuitName}, {selectedRace.Circuit.Location.locality}
                  </p>
                </div>

                {/* Circuit Geo Coordinates */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#111111] p-2.5 rounded-none border border-[#222222]">
                    <span className="text-[#858585] text-[9px] block uppercase">COORDINATES</span>
                    <span className="text-white font-bold text-xs truncate block tabular-nums">
                      {selectedRace.Circuit.Location.lat}, {selectedRace.Circuit.Location.long}
                    </span>
                  </div>
                  <div className="bg-[#111111] p-2.5 rounded-none border border-[#222222]">
                    <span className="text-[#858585] text-[9px] block uppercase">RACE DATE</span>
                    <span className="text-[#FED500] font-bold text-xs block tabular-nums">
                      {selectedRace.date} {selectedRace.time ? `(${selectedRace.time})` : ''}
                    </span>
                  </div>
                </div>

                {/* Verified Session Timing */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <span className="text-[#858585] text-[10px] uppercase font-bold tracking-wider mb-1">
                    CONFIRMED SCHEDULE (UTC)
                  </span>

                  {selectedRace.FirstPractice && (
                    <div className="flex justify-between p-2 rounded-none bg-[#111111] border border-[#222222]">
                      <span className="text-[#A0A0A0]">PRACTICE 1 (FP1)</span>
                      <span className="text-white font-bold tabular-nums">
                        {selectedRace.FirstPractice.date} {selectedRace.FirstPractice.time || ''}
                      </span>
                    </div>
                  )}

                  {selectedRace.SecondPractice && (
                    <div className="flex justify-between p-2 rounded-none bg-[#111111] border border-[#222222]">
                      <span className="text-[#A0A0A0]">PRACTICE 2 (FP2)</span>
                      <span className="text-white font-bold tabular-nums">
                        {selectedRace.SecondPractice.date} {selectedRace.SecondPractice.time || ''}
                      </span>
                    </div>
                  )}

                  {selectedRace.Sprint && (
                    <div className="flex justify-between p-2 rounded-none bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 font-bold">
                      <span>SPRINT</span>
                      <span className="tabular-nums">
                        {selectedRace.Sprint.date} {selectedRace.Sprint.time || ''}
                      </span>
                    </div>
                  )}

                  {selectedRace.Qualifying && (
                    <div className="flex justify-between p-2 rounded-none bg-[#111111] border border-[#222222]">
                      <span className="text-[#A0A0A0]">QUALIFYING</span>
                      <span className="text-[#FED500] font-bold tabular-nums">
                        {selectedRace.Qualifying.date} {selectedRace.Qualifying.time || ''}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between p-2.5 rounded-none bg-[#1A0E10] border border-[#E10600] font-bold text-white">
                    <span className="text-[#E10600]">MAIN GRAND PRIX</span>
                    <span className="text-[#FED500] tabular-nums">
                      {selectedRace.date} {selectedRace.time || ''}
                    </span>
                  </div>
                </div>

                {/* Circuit Link */}
                {selectedRace.Circuit.url && (
                  <a
                    href={selectedRace.Circuit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-none bg-[#111111] border border-[#292929] hover:border-[#E10600] text-xs text-[#D8D8D8] hover:text-white transition"
                  >
                    <span>OFFICIAL CIRCUIT ARCHIVE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarView
