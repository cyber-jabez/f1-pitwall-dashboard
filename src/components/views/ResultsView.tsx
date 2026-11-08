import React, { useState, useEffect } from 'react'
import { jolpicaClient, RaceResultItem } from '../../services/jolpicaClient'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import type { ProvenanceMetadata } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import { RefreshCw } from 'lucide-react'

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
    } catch {
      setError('Unable to fetch official FIA Grand Prix classifications from Jolpica/Ergast.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResults(season, round)
  }, [season, round])

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-[#E10600]" />
            <span className="font-mono text-[10px] text-[#858585] uppercase tracking-widest block">
              OFFICIAL FIA GRAND PRIX CLASSIFICATIONS // JOLPICA ERGAST ARCHIVE
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            RACE <ShinyText text="RESULTS & CLASSIFICATIONS" speed={2.5} className="text-[#FED500]" />
          </h1>
        </div>

        {/* Filters: Season and Grand Prix Round */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="bg-[#111111] border border-[#292929] rounded-none px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
          >
            <option value="2024">2024 SEASON</option>
            <option value="2023">2023 SEASON</option>
            <option value="2022">2022 SEASON</option>
          </select>

          <select
            value={round}
            onChange={(e) => setRound(e.target.value)}
            className="bg-[#111111] border border-[#292929] rounded-none px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
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
            className="p-2 rounded-none bg-[#111111] border border-[#292929] text-[#858585] hover:text-white hover:border-[#E10600] transition"
            title="Refresh Results"
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
            title={`FIA Classification Ingestion // Season: ${season} Round: ${round}`}
          />
        </div>
      )}

      {/* Main Table */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="rounded-none bg-[#0D0D0D] border border-[#222222] p-12 text-center font-mono">
            <div className="w-6 h-6 border-2 border-[#E10600] border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-[#858585] text-xs uppercase tracking-wider">
              RETRIEVING OFFICIAL FIA TIMING CLASSIFICATION...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-none bg-[#140808] border border-[#E10600] p-6 text-center font-mono text-[#E10600] text-xs uppercase">
            <p>{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-none bg-[#0D0D0D] border border-[#222222] p-12 text-center font-mono text-[#858585]">
            <p className="font-bold text-white mb-1 uppercase">DATA UNAVAILABLE FOR THIS ROUND</p>
            <p className="text-xs text-[#666666]">No classification records returned for the requested session.</p>
          </div>
        ) : (
          <div className="rounded-none bg-[#0B0D14] border border-[#292929] shadow-2xl overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[#111111] border-b border-[#292929] text-[#858585] text-[10px] uppercase">
                  <th className="py-3 px-4 w-16">POS</th>
                  <th className="py-3 px-4">DRIVER</th>
                  <th className="py-3 px-4">CONSTRUCTOR</th>
                  <th className="py-3 px-4 text-center">GRID</th>
                  <th className="py-3 px-4 text-center">LAPS</th>
                  <th className="py-3 px-4">TIME / STATUS</th>
                  <th className="py-3 px-4 text-center">FASTEST LAP</th>
                  <th className="py-3 px-4 text-right">POINTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1F2B]">
                {results.map((r) => {
                  const isFerrari = r.Constructor.constructorId.toLowerCase() === 'ferrari'
                  const hasFastestLap = r.FastestLap?.rank === '1'
                  return (
                    <tr
                      key={r.position + r.Driver.driverId}
                      className={`hover:bg-[#131622] transition-colors ${
                        isFerrari ? 'bg-[#150D10] border-l-2 border-l-[#E10600]' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-sm text-white tabular-nums">
                        P{r.positionText}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-none shrink-0"
                            style={{ backgroundColor: isFerrari ? '#E10600' : '#4A5568' }}
                          />
                          <div>
                            <span className="font-display font-bold text-sm text-white uppercase block">
                              {r.Driver.givenName} {r.Driver.familyName}
                            </span>
                            <span className="text-[10px] text-[#858585]">
                              #{r.number} // {r.Driver.nationality.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#D8D8D8] uppercase">{r.Constructor.name}</td>
                      <td className="py-3 px-4 text-center text-[#858585] tabular-nums">P{r.grid}</td>
                      <td className="py-3 px-4 text-center text-[#D8D8D8] tabular-nums">{r.laps}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                        {r.Time?.time || r.status}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {r.FastestLap ? (
                          <span
                            className={`px-1.5 py-0.5 rounded-none text-[10px] font-mono tabular-nums ${
                              hasFastestLap
                                ? 'bg-[#C084FC]/15 text-[#C084FC] border border-[#C084FC]/40 font-bold'
                                : 'text-[#858585]'
                            }`}
                          >
                            {r.FastestLap.Time.time} (L{r.FastestLap.lap})
                          </span>
                        ) : (
                          <span className="text-[#555555]">--</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-sm text-emerald-400 tabular-nums">
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
