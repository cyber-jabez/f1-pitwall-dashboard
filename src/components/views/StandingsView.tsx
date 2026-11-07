import React, { useState, useEffect } from 'react'
import { jolpicaClient, DriverStanding, ConstructorStanding } from '../../services/jolpicaClient'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import type { ProvenanceMetadata } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import { Trophy, RefreshCw, ExternalLink, Award } from 'lucide-react'

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
    } catch (err: any) {
      setError('Unable to fetch live standings from Jolpica/Ergast API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStandings(selectedSeason)
  }, [tab, selectedSeason])

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            FIA WORLD CHAMPIONSHIP STANDINGS // JOLPICA ERGAST LIVE API
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            CHAMPIONSHIP <ShinyText text="STANDINGS" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>

        {/* Season Selector & Tab Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="bg-[#0E1118] border border-white/20 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-ferrari-red cursor-pointer"
          >
            <option value="current">CURRENT SEASON (OFFICIAL FIA)</option>
            <option value="2024">2024 SEASON (FERRARI MONZA / MONACO WINS)</option>
            <option value="2023">2023 SEASON (LE MANS 499P CENTENARY)</option>
            <option value="2022">2022 SEASON (F1-75 RESURGENCE)</option>
            <option value="2008">2008 SEASON (FERRARI 16TH WCC TITLE)</option>
            <option value="2007">2007 SEASON (KIMI RÄIKKÖNEN WDC)</option>
            <option value="2004">2004 SEASON (MICHAEL SCHUMACHER F2004)</option>
          </select>

          <div className="flex rounded-xl bg-[#0E1118] p-1 border border-white/10 font-mono text-xs">
            <button
              onClick={() => setTab('drivers')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                tab === 'drivers' ? 'bg-ferrari-red text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              DRIVERS
            </button>
            <button
              onClick={() => setTab('constructors')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                tab === 'constructors' ? 'bg-ferrari-red text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              CONSTRUCTORS
            </button>
          </div>

          <button
            onClick={() => loadStandings(selectedSeason)}
            className="p-2 rounded-xl bg-[#0E1118] border border-white/10 text-white/60 hover:text-white transition"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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
          <div className="rounded-3xl bg-[#0B0D14] border border-ferrari-border/80 p-12 text-center font-mono">
            <div className="w-8 h-8 border-2 border-ferrari-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/70 text-sm">QUERYING AUTHENTIC FIA/JOLPICA DATA CLUSTER...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-[#140808] border border-rose-800/80 p-8 text-center font-mono text-rose-400">
            <p>{error}</p>
          </div>
        ) : tab === 'drivers' ? (
          driverStandings.length === 0 ? (
            <div className="rounded-3xl bg-[#0B0D14] border border-white/10 p-12 text-center font-mono text-neutral-400">
              <p className="font-bold text-white mb-1">NO STANDINGS DATA AVAILABLE</p>
              <p className="text-xs text-neutral-500">No driver records returned for the requested season.</p>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#0B0D14] border border-ferrari-border/80 p-6 shadow-2xl overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase pb-3">
                  <th className="pb-3 px-3">POS</th>
                  <th className="pb-3 px-3">DRIVER</th>
                  <th className="pb-3 px-3">CONSTRUCTOR</th>
                  <th className="pb-3 px-3 text-center">WINS</th>
                  <th className="pb-3 px-3 text-right">POINTS</th>
                  <th className="pb-3 px-3 text-right">PROFILE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
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
                      className={`hover:bg-white/5 transition-all ${
                        isLeclerc || isHamilton
                          ? 'bg-gradient-to-r from-ferrari-red/35 via-ferrari-red/15 to-transparent border-l-4 border-l-ferrari-red shadow-[0_0_15px_rgba(239,26,45,0.25)]'
                          : isFerrari
                          ? 'bg-ferrari-red/15 font-semibold border-l-2 border-ferrari-red'
                          : ''
                      }`}
                    >
                      <td className="py-4 px-3 font-display font-black text-base text-white">
                        P{ds.position}
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-display font-black text-sm block ${
                                isLeclerc || isHamilton ? 'text-white font-black' : 'text-white'
                              }`}>
                                {ds.Driver.givenName} {ds.Driver.familyName}
                              </span>
                              {isLeclerc && (
                                <span className="px-2 py-0.5 rounded-full bg-ferrari-red text-white text-[9px] font-mono font-black shadow-[0_0_10px_rgba(239,26,45,0.8)] tracking-wider">
                                  #16 FERRARI SF-24
                                </span>
                              )}
                              {isHamilton && (
                                <span className="px-2 py-0.5 rounded-full bg-ferrari-red text-white text-[9px] font-mono font-black shadow-[0_0_10px_rgba(239,26,45,0.8)] tracking-wider">
                                  #44 FERRARI SF-24
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-white/50">
                              {ds.Driver.code ? `[${ds.Driver.code}]` : ''} #{ds.Driver.permanentNumber || (isLeclerc ? '16' : isHamilton ? '44' : 'N/A')} • {ds.Driver.nationality}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-white/80">
                        {isLeclerc || isHamilton ? (
                          <span className="text-ferrari-red font-bold">Scuderia Ferrari</span>
                        ) : (
                          ds.Constructors.map((c) => c.name).join(' / ')
                        )}
                      </td>
                      <td className="py-4 px-3 text-center text-ferrari-yellow font-bold">
                        {ds.wins}
                      </td>
                      <td className="py-4 px-3 text-right font-display font-black text-lg text-white">
                        {ds.points} PTS
                      </td>
                      <td className="py-4 px-3 text-right">
                        {ds.Driver.url && (
                          <a
                            href={ds.Driver.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white"
                          >
                            <span>BIO</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) ) : constructorStandings.length === 0 ? (
          <div className="rounded-3xl bg-[#0B0D14] border border-white/10 p-12 text-center font-mono text-neutral-400">
            <p className="font-bold text-white mb-1">NO STANDINGS DATA AVAILABLE</p>
            <p className="text-xs text-neutral-500">No constructor records returned for the requested season.</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-[#0B0D14] border border-ferrari-border/80 p-6 shadow-2xl overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase pb-3">
                  <th className="pb-3 px-3">POS</th>
                  <th className="pb-3 px-3">CONSTRUCTOR</th>
                  <th className="pb-3 px-3">NATIONALITY</th>
                  <th className="pb-3 px-3 text-center">WINS</th>
                  <th className="pb-3 px-3 text-right">POINTS</th>
                  <th className="pb-3 px-3 text-right">ARCHIVE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {constructorStandings.map((cs) => {
                  const isFerrari = cs.Constructor.constructorId.toLowerCase() === 'ferrari'
                  return (
                    <tr
                      key={cs.Constructor.constructorId}
                      className={`hover:bg-white/5 transition-all ${
                        isFerrari ? 'bg-gradient-to-r from-ferrari-red/35 via-ferrari-red/15 to-transparent font-bold border-l-4 border-l-ferrari-red shadow-[0_0_15px_rgba(239,26,45,0.25)]' : ''
                      }`}
                    >
                      <td className="py-4 px-3 font-display font-black text-base text-white">
                        P{cs.position}
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: isFerrari ? '#FF2800' : '#888' }}
                          />
                          <span className="font-display font-black text-sm text-white">
                            {cs.Constructor.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-white/70">{cs.Constructor.nationality}</td>
                      <td className="py-4 px-3 text-center text-ferrari-yellow font-bold">
                        {cs.wins}
                      </td>
                      <td className="py-4 px-3 text-right font-display font-black text-lg text-white">
                        {cs.points} PTS
                      </td>
                      <td className="py-4 px-3 text-right">
                        {cs.Constructor.url && (
                          <a
                            href={cs.Constructor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white"
                          >
                            <span>RECORD</span>
                            <ExternalLink className="w-3 h-3" />
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
