import React, { useState, useEffect } from 'react'
import { jolpicaClient, RaceScheduleItem } from '../../services/jolpicaClient'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import type { ProvenanceMetadata } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, RefreshCw, ExternalLink } from 'lucide-react'

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
    } catch (e: any) {
      setError('Unable to load official race schedule from Jolpica/Ergast API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCalendar(season)
  }, [season])

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            FIA FORMULA ONE WORLD CHAMPIONSHIP // JOLPICA ERGAST OFFICIAL CALENDAR
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            RACE <ShinyText text="CALENDAR" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>

        {/* Season Selector */}
        <div className="flex items-center gap-3">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="bg-[#0E1118] border border-white/20 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-ferrari-red cursor-pointer"
          >
            <option value="current">CURRENT SEASON (OFFICIAL FIA)</option>
            <option value="2024">2024 SEASON (24 RACES)</option>
            <option value="2023">2023 SEASON (22 RACES)</option>
            <option value="2022">2022 SEASON (22 RACES)</option>
          </select>

          <button
            onClick={() => loadCalendar(season)}
            className="p-2 rounded-xl bg-[#0E1118] border border-white/10 text-white/60 hover:text-white transition"
            title="Refresh Calendar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#0B0D14] border border-ferrari-border/80 p-12 text-center font-mono">
          <div className="w-8 h-8 border-2 border-ferrari-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/70 text-sm">LOADING CONFIRMED FIA GRAND PRIX SCHEDULE...</p>
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#140808] border border-rose-800/80 p-8 text-center font-mono text-rose-400">
          <p>{error}</p>
        </div>
      ) : races.length === 0 ? (
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#0B0D14] border border-white/10 p-12 text-center font-mono text-neutral-400">
          <p className="font-bold text-white mb-1">NO RACE CALENDAR DATA AVAILABLE</p>
          <p className="text-xs text-neutral-500">No confirmed race events returned for this season schedule.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Race List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {races.map((race) => {
              const isSelected = selectedRace?.round === race.round
              const hasSprint = Boolean(race.Sprint)
              return (
                <div
                  key={race.round}
                  onClick={() => setSelectedRace(race)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-ferrari-red/20 to-[#10131D] border-ferrari-red shadow-[0_0_20px_rgba(255,40,0,0.3)]'
                      : 'bg-[#0A0C12] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 font-mono font-black text-sm flex items-center justify-center text-ferrari-yellow">
                      R{race.round}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-white/50">
                          {race.Circuit.Location.country.toUpperCase()}
                        </span>
                        {hasSprint && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-500/40">
                            SPRINT
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-black text-base text-white leading-tight">
                        {race.raceName}
                      </h3>
                      <span className="font-mono text-xs text-white/60">
                        {race.Circuit.circuitName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center font-mono text-xs">
                    <div className="text-right">
                      <span className="text-white/40 block text-[10px]">DATE</span>
                      <span className="text-white font-bold">{race.date}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected Race Details (5 cols) */}
          <div className="lg:col-span-5">
            {selectedRace && (
              <div className="sticky top-28 rounded-3xl bg-[#0B0E16] border-2 border-ferrari-border/80 p-6 shadow-2xl flex flex-col gap-6 font-mono">
                <div>
                  <span className="px-2.5 py-1 rounded bg-ferrari-yellow text-black font-mono font-black text-[10px] uppercase tracking-wider inline-block mb-2">
                    ROUND {selectedRace.round} // {selectedRace.Circuit.Location.country}
                  </span>
                  <h2 className="font-display font-black text-2xl text-white uppercase leading-tight">
                    {selectedRace.raceName}
                  </h2>
                  <p className="text-xs text-white/60 mt-1">
                    {selectedRace.Circuit.circuitName}, {selectedRace.Circuit.Location.locality}
                  </p>
                </div>

                {/* Circuit Geo Coordinates */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#121622] p-3 rounded-xl border border-white/5">
                    <span className="text-white/40 text-[10px] block">COORDINATES</span>
                    <span className="text-white font-bold text-xs truncate block">
                      {selectedRace.Circuit.Location.lat}, {selectedRace.Circuit.Location.long}
                    </span>
                  </div>
                  <div className="bg-[#121622] p-3 rounded-xl border border-white/5">
                    <span className="text-white/40 text-[10px] block">RACE DATE</span>
                    <span className="text-ferrari-yellow font-bold text-xs block">
                      {selectedRace.date} {selectedRace.time ? `(${selectedRace.time})` : ''}
                    </span>
                  </div>
                </div>

                {/* Verified Session Timing */}
                <div className="flex flex-col gap-2 text-xs">
                  <span className="text-white/50 text-[10px] uppercase font-bold tracking-wider">
                    CONFIRMED SCHEDULE (UTC)
                  </span>

                  {selectedRace.FirstPractice && (
                    <div className="flex justify-between p-2 rounded-lg bg-[#121622] border border-white/5">
                      <span>PRACTICE 1 (FP1)</span>
                      <span className="text-white font-bold">
                        {selectedRace.FirstPractice.date} {selectedRace.FirstPractice.time || ''}
                      </span>
                    </div>
                  )}

                  {selectedRace.SecondPractice && (
                    <div className="flex justify-between p-2 rounded-lg bg-[#121622] border border-white/5">
                      <span>PRACTICE 2 (FP2)</span>
                      <span className="text-white font-bold">
                        {selectedRace.SecondPractice.date} {selectedRace.SecondPractice.time || ''}
                      </span>
                    </div>
                  )}

                  {selectedRace.Sprint && (
                    <div className="flex justify-between p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 font-bold">
                      <span>SPRINT</span>
                      <span>
                        {selectedRace.Sprint.date} {selectedRace.Sprint.time || ''}
                      </span>
                    </div>
                  )}

                  {selectedRace.Qualifying && (
                    <div className="flex justify-between p-2 rounded-lg bg-[#121622] border border-white/5">
                      <span>QUALIFYING</span>
                      <span className="text-ferrari-yellow font-bold">
                        {selectedRace.Qualifying.date} {selectedRace.Qualifying.time || ''}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between p-2.5 rounded-lg bg-gradient-to-r from-ferrari-red/30 to-transparent border border-ferrari-red font-bold text-white">
                    <span>MAIN GRAND PRIX</span>
                    <span className="text-ferrari-yellow">
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
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/30 text-xs text-neutral-300 hover:text-white transition"
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
