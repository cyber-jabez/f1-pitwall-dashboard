import React, { useState, useEffect } from 'react'
import { jolpicaClient, RaceResultItem } from '../../services/jolpicaClient'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import type { ProvenanceMetadata } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import { Trophy, RefreshCw, Clock, Award } from 'lucide-react'

export const ResultsView: React.FC = () => {
  const [season, setSeason] = useState('2024')
  const [round, setRound] = useState('16') // Monza 2024
  const [results, setResults] = useState<RaceResultItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [provenance, setProvenance] = useState<ProvenanceMetadata | null>(null)

  const loadResults = async (targetSeason: string, targetRound: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await jolpicaClient.getRaceResults(targetSeason, targetRound)
      setResults(res.data)
      setProvenance(res.provenance)
    } catch (e: any) {
      setError('Unable to fetch official FIA Grand Prix classifications from Jolpica/Ergast.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResults(season, round)
  }, [season, round])

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            OFFICIAL FIA GRAND PRIX CLASSIFICATIONS // JOLPICA ERGAST ARCHIVE
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            RACE <ShinyText text="RESULTS & CLASSIFICATIONS" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>

        {/* Filters: Season and Grand Prix Round */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="bg-[#0E1118] border border-white/20 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-ferrari-red cursor-pointer"
          >
            <option value="2024">2024 SEASON</option>
            <option value="2023">2023 SEASON</option>
            <option value="2022">2022 SEASON</option>
          </select>

          <select
            value={round}
            onChange={(e) => setRound(e.target.value)}
            className="bg-[#0E1118] border border-white/20 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-ferrari-red cursor-pointer"
          >
            <option value="16">ROUND 16 - ITALIAN GP (MONZA - FERRARI WIN)</option>
            <option value="8">ROUND 8 - MONACO GP (MONTE CARLO - LECLERC WIN)</option>
            <option value="3">ROUND 3 - AUSTRALIAN GP (MELBOURNE - FERRARI 1-2)</option>
            <option value="19">ROUND 19 - UNITED STATES GP (AUSTIN - FERRARI 1-2)</option>
            <option value="20">ROUND 20 - MEXICO CITY GP (FERRARI WIN)</option>
            <option value="1">ROUND 1 - BAHRAIN GP (SAKHIR)</option>
            <option value="last">LAST COMPLETED GRAND PRIX</option>
          </select>

          <button
            onClick={() => loadResults(season, round)}
            className="p-2 rounded-xl bg-[#0E1118] border border-white/10 text-white/60 hover:text-white transition"
            title="Refresh Results"
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
            title={`FIA Classification Ingestion // Season: ${season} Round: ${round}`}
          />
        </div>
      )}

      {/* Main Table */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="rounded-3xl bg-[#0B0D14] border border-ferrari-border/80 p-12 text-center font-mono">
            <div className="w-8 h-8 border-2 border-ferrari-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/70 text-sm">RETRIEVING OFFICIAL FIA TIMING CLASSIFICATION...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-[#140808] border border-rose-800/80 p-8 text-center font-mono text-rose-400">
            <p>{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-3xl bg-[#0B0D14] border border-white/10 p-12 text-center font-mono text-neutral-400">
            <p>DATA UNAVAILABLE FOR THIS ROUND</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-[#0B0D14] border border-ferrari-border/80 p-6 shadow-2xl overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase pb-3">
                  <th className="pb-3 px-3">POS</th>
                  <th className="pb-3 px-3">DRIVER</th>
                  <th className="pb-3 px-3">CONSTRUCTOR</th>
                  <th className="pb-3 px-3 text-center">GRID</th>
                  <th className="pb-3 px-3 text-center">LAPS</th>
                  <th className="pb-3 px-3">TIME / STATUS</th>
                  <th className="pb-3 px-3 text-center">FASTEST LAP</th>
                  <th className="pb-3 px-3 text-right">POINTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((r) => {
                  const isFerrari = r.Constructor.constructorId.toLowerCase() === 'ferrari'
                  const hasFastestLap = r.FastestLap?.rank === '1'
                  return (
                    <tr
                      key={r.position + r.Driver.driverId}
                      className={`hover:bg-white/5 transition-colors ${
                        isFerrari ? 'bg-ferrari-red/15 font-semibold border-l-2 border-ferrari-red' : ''
                      }`}
                    >
                      <td className="py-4 px-3 font-display font-black text-base text-white">
                        P{r.positionText}
                      </td>
                      <td className="py-4 px-3">
                        <span className="font-display font-black text-sm text-white block">
                          {r.Driver.givenName} {r.Driver.familyName}
                        </span>
                        <span className="text-[10px] text-white/40">
                          #{r.number} • {r.Driver.nationality}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-white/70">{r.Constructor.name}</td>
                      <td className="py-4 px-3 text-center text-white/60">P{r.grid}</td>
                      <td className="py-4 px-3 text-center text-white/80">{r.laps}</td>
                      <td className="py-4 px-3 font-bold text-white">
                        {r.Time?.time || r.status}
                      </td>
                      <td className="py-4 px-3 text-center">
                        {r.FastestLap ? (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              hasFastestLap
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                                : 'text-neutral-400'
                            }`}
                          >
                            {r.FastestLap.Time.time} (L{r.FastestLap.lap})
                          </span>
                        ) : (
                          <span className="text-neutral-600">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-right font-display font-black text-base text-emerald-400">
                        +{r.points} PTS
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsView
