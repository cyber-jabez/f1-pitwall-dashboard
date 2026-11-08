import React, { useState, useEffect } from 'react'
import { jolpicaClient, DriverStanding, ConstructorStanding } from '../../services/jolpicaClient'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import type { ProvenanceMetadata } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import { RefreshCw, ExternalLink } from 'lucide-react'

export const StandingsView: React.FC = () => {
  const [tab, setTab] = useState<'drivers' | 'constructors'>('drivers')
  const [selectedSeason, setSelectedSeason] = useState('current')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([])
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([])
  const [provenance, setProvenance] = useState<ProvenanceMetadata | null>(null)

  const loadStandings = async (season: string) => {
    setLoading(true)
    setError(null)
    try {
      if (tab === 'drivers') {
        const res = await jolpicaClient.getDriverStandings(season)
        setDriverStandings(res.data)
        setProvenance(res.provenance)
      } else {
        const res = await jolpicaClient.getConstructorStandings(season)
        setConstructorStandings(res.data)
        setProvenance(res.provenance)
      }
    } catch {
      setError('Unable to fetch live standings from Jolpica/Ergast API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStandings(selectedSeason)
  }, [tab, selectedSeason])

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-[#E10600]" />
            <span className="font-mono text-[10px] text-[#858585] uppercase tracking-widest block">
              FIA WORLD CHAMPIONSHIP // JOLPICA ERGAST LIVE API
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            CHAMPIONSHIP <ShinyText text="STANDINGS" speed={2.5} className="text-[#FED500]" />
          </h1>
        </div>

        {/* Season Selector & Tab Toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="bg-[#111111] border border-[#292929] rounded-none px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
          >
            <option value="current">CURRENT SEASON (OFFICIAL FIA)</option>
            <option value="2024">2024 SEASON (FERRARI MONZA / MONACO WINS)</option>
            <option value="2023">2023 SEASON (LE MANS 499P CENTENARY)</option>
            <option value="2022">2022 SEASON (F1-75 RESURGENCE)</option>
            <option value="2008">2008 SEASON (FERRARI 16TH WCC TITLE)</option>
            <option value="2007">2007 SEASON (KIMI RÄIKKÖNEN WDC)</option>
            <option value="2004">2004 SEASON (MICHAEL SCHUMACHER F2004)</option>
          </select>

          <div className="flex rounded-none bg-[#111111] p-0.5 border border-[#292929] font-mono text-xs">
            <button
              onClick={() => setTab('drivers')}
              className={`px-4 py-1.5 rounded-none font-bold uppercase transition-all ${
                tab === 'drivers' ? 'bg-[#E10600] text-white' : 'text-[#858585] hover:text-white'
              }`}
            >
              DRIVERS
            </button>
            <button
              onClick={() => setTab('constructors')}
              className={`px-4 py-1.5 rounded-none font-bold uppercase transition-all ${
                tab === 'constructors' ? 'bg-[#E10600] text-white' : 'text-[#858585] hover:text-white'
              }`}
            >
              CONSTRUCTORS
            </button>
          </div>

          <button
            onClick={() => loadStandings(selectedSeason)}
            className="p-2 rounded-none bg-[#111111] border border-[#292929] text-[#858585] hover:text-white hover:border-[#E10600] transition"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Provenance Metadata Badge */}
      {provenance && (
        <div className="max-w-7xl mx-auto mb-6">
          <DataProvenanceBadge
            provenance={provenance}
            title={`Jolpica Ergast Ingestion // Season: ${selectedSeason.toUpperCase()}`}
          />
        </div>
      )}

      {/* Main Table */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="rounded-none bg-[#0D0D0D] border border-[#222222] p-12 text-center font-mono">
            <div className="w-6 h-6 border-2 border-[#E10600] border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-[#858585] text-xs uppercase tracking-wider">
              QUERYING AUTHENTIC FIA/JOLPICA DATA CLUSTER...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-none bg-[#140808] border border-[#E10600] p-6 text-center font-mono text-[#E10600] text-xs uppercase">
            <p>{error}</p>
          </div>
        ) : tab === 'drivers' ? (
          driverStandings.length === 0 ? (
            <div className="rounded-none bg-[#0D0D0D] border border-[#222222] p-12 text-center font-mono text-[#858585]">
              <p className="font-bold text-white mb-1 uppercase">NO STANDINGS DATA AVAILABLE</p>
              <p className="text-xs text-[#666666]">No driver records returned for the requested season.</p>
            </div>
          ) : (
            <div className="rounded-none bg-[#0B0D14] border border-[#292929] shadow-2xl overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-[#111111] border-b border-[#292929] text-[#858585] text-[10px] uppercase">
                    <th className="py-3 px-4 w-16">POS</th>
                    <th className="py-3 px-4">DRIVER</th>
                    <th className="py-3 px-4">CONSTRUCTOR</th>
                    <th className="py-3 px-4 text-center">WINS</th>
                    <th className="py-3 px-4 text-right">POINTS</th>
                    <th className="py-3 px-4 text-right">PROFILE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1F2B]">
                  {driverStandings.map((ds) => {
                    const id = ds.Driver.driverId.toLowerCase()
                    const num = ds.Driver.permanentNumber
                    const code = ds.Driver.code?.toUpperCase()
                    const isLeclerc = id.includes('leclerc') || num === '16' || code === 'LEC'
                    const isHamilton = id.includes('hamilton') || num === '44' || code === 'HAM'
                    const isFerrari = isLeclerc || isHamilton || ds.Constructors.some(
                      (c) => c.constructorId.toLowerCase() === 'ferrari'
                    )

                    return (
                      <tr
                        key={ds.Driver.driverId}
                        className={`hover:bg-[#131622] transition-colors ${
                          isLeclerc || isHamilton
                            ? 'bg-[#150D10] border-l-2 border-l-[#E10600]'
                            : isFerrari
                            ? 'bg-[#130E0F] border-l-2 border-l-[#E10600]/60'
                            : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-sm text-white tabular-nums">
                          P{ds.position}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-2.5 h-2.5 rounded-none shrink-0"
                              style={{ backgroundColor: isFerrari ? '#E10600' : '#4A5568' }}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-sm uppercase text-white tracking-wide">
                                  {ds.Driver.givenName} {ds.Driver.familyName}
                                </span>
                                {isLeclerc && (
                                  <span className="px-1.5 py-0.2 rounded-none bg-[#E10600] text-white text-[9px] font-mono font-black tracking-wider">
                                    #16 SF-24
                                  </span>
                                )}
                                {isHamilton && (
                                  <span className="px-1.5 py-0.2 rounded-none bg-[#E10600] text-white text-[9px] font-mono font-black tracking-wider">
                                    #44 SF-24
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#858585]">
                                {ds.Driver.code ? `[${ds.Driver.code}]` : ''} #{ds.Driver.permanentNumber || (isLeclerc ? '16' : isHamilton ? '44' : 'N/A')} // {ds.Driver.nationality.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#D8D8D8]">
                          {isLeclerc || isHamilton ? (
                            <span className="text-[#E10600] font-bold">SCUDERIA FERRARI</span>
                          ) : (
                            ds.Constructors.map((c) => c.name.toUpperCase()).join(' / ')
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center text-[#FED500] font-bold tabular-nums">
                          {ds.wins}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-white tabular-nums">
                          {ds.points} PTS
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {ds.Driver.url && (
                            <a
                              href={ds.Driver.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-[#111111] border border-[#292929] text-[10px] text-[#858585] hover:text-white hover:border-[#E10600] transition"
                            >
                              <span>BIO</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : constructorStandings.length === 0 ? (
          <div className="rounded-none bg-[#0D0D0D] border border-[#222222] p-12 text-center font-mono text-[#858585]">
            <p className="font-bold text-white mb-1 uppercase">NO STANDINGS DATA AVAILABLE</p>
            <p className="text-xs text-[#666666]">No constructor records returned for the requested season.</p>
          </div>
        ) : (
          <div className="rounded-none bg-[#0B0D14] border border-[#292929] shadow-2xl overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[#111111] border-b border-[#292929] text-[#858585] text-[10px] uppercase">
                  <th className="py-3 px-4 w-16">POS</th>
                  <th className="py-3 px-4">CONSTRUCTOR</th>
                  <th className="py-3 px-4">NATIONALITY</th>
                  <th className="py-3 px-4 text-center">WINS</th>
                  <th className="py-3 px-4 text-right">POINTS</th>
                  <th className="py-3 px-4 text-right">ARCHIVE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1F2B]">
                {constructorStandings.map((cs) => {
                  const isFerrari = cs.Constructor.constructorId.toLowerCase() === 'ferrari'
                  return (
                    <tr
                      key={cs.Constructor.constructorId}
                      className={`hover:bg-[#131622] transition-colors ${
                        isFerrari ? 'bg-[#150D10] border-l-2 border-l-[#E10600]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-white tabular-nums">
                        P{cs.position}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-none shrink-0"
                            style={{ backgroundColor: isFerrari ? '#E10600' : '#4A5568' }}
                          />
                          <span className="font-display font-bold text-sm text-white uppercase tracking-wide">
                            {cs.Constructor.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#858585] uppercase">{cs.Constructor.nationality}</td>
                      <td className="py-3.5 px-4 text-center text-[#FED500] font-bold tabular-nums">
                        {cs.wins}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-white tabular-nums">
                        {cs.points} PTS
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {cs.Constructor.url && (
                          <a
                            href={cs.Constructor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-[#111111] border border-[#292929] text-[10px] text-[#858585] hover:text-white hover:border-[#E10600] transition"
                          >
                            <span>RECORD</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
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

export default StandingsView
