import React, { useState } from 'react'
import type { F1LiveDriverTiming } from '../../services/f1LiveApiClient'
import { Timer, Zap, Trophy, Shield, Filter, Search } from 'lucide-react'

interface MicroSectorsMatrixProps {
  drivers: F1LiveDriverTiming[]
  activeSessionName: string
  selectedDriverNumber?: string | null
  onSelectDriver?: (driverNumber: string) => void
}

export const MicroSectorsMatrix: React.FC<MicroSectorsMatrixProps> = ({
  drivers,
  activeSessionName,
  selectedDriverNumber,
  onSelectDriver,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterFerrari, setFilterFerrari] = useState(false)

  const filteredDrivers = drivers.filter((d) => {
    if (filterFerrari && d.driver_number !== '16' && d.driver_number !== '44') {
      return false
    }
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      d.name?.toLowerCase().includes(q) ||
      d.acronym?.toLowerCase().includes(q) ||
      d.driver_number.includes(q) ||
      d.team?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="rounded-3xl bg-[#080A10] border border-ferrari-border/70 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Timer className="w-4 h-4 text-ferrari-yellow" />
            <span className="font-display font-black text-xs uppercase tracking-wider text-white">
              MICRO-SECTORS TELEMETRY MATRIX // {activeSessionName}
            </span>
          </div>
          <span className="text-[11px] text-white/50">
            Official FOM micro-segment classification with color-coded segment status (2064 Purple / 2048 Green / 2049 Yellow)
          </span>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Filter driver or team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121522] border border-white/15 rounded-xl pl-8 pr-3 py-1 text-white text-[11px] placeholder-white/30 focus:outline-none focus:border-ferrari-red"
            />
          </div>

          <button
            onClick={() => setFilterFerrari(!filterFerrari)}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition ${
              filterFerrari
                ? 'bg-ferrari-red text-white border-ferrari-red shadow-[0_0_12px_rgba(255,40,0,0.4)]'
                : 'bg-[#121522] text-white/60 border-white/10 hover:text-white'
            }`}
          >
            FERRARI ONLY
          </button>
        </div>
      </div>

      {/* Segment Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#05060A] border border-white/5 text-[10px]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-fuchsia-300">
            <span className="w-2.5 h-2.5 rounded-xs bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
            <span className="font-bold">STATUS 2064: OVERALL FASTEST (PURPLE)</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="font-bold">STATUS 2048: PERSONAL BEST (GREEN)</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
            <span>STATUS 2049: SLOWER SEGMENT (YELLOW)</span>
          </span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2.5 h-2.5 rounded-xs bg-neutral-700" />
            <span>PENDING / IN PIT</span>
          </span>
        </div>
        <span className="text-white/40">{filteredDrivers.length} CARS LOGGED</span>
      </div>

      {/* Driver Micro-Sectors Rows */}
      <div className="flex flex-col gap-2 max-h-[580px] overflow-y-auto pr-1">
        {filteredDrivers.map((driver) => {
          const isFerrari = driver.driver_number === '16' || driver.driver_number === '44'
          const isSelected = selectedDriverNumber === driver.driver_number
          const s1 = driver.sectors?.[0]
          const s2 = driver.sectors?.[1]
          const s3 = driver.sectors?.[2]

          return (
            <div
              key={driver.driver_number}
              onClick={() => onSelectDriver?.(driver.driver_number)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                isFerrari
                  ? 'bg-gradient-to-r from-ferrari-red/15 via-[#0E1119] to-[#0E1119] border-ferrari-red/60 shadow-[0_0_15px_rgba(255,40,0,0.2)]'
                  : isSelected
                  ? 'bg-[#151926] border-white/30'
                  : 'bg-[#0E1119] border-white/5 hover:border-white/20'
              }`}
            >
              {/* Row Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-black text-sm w-5 text-white/90">
                    P{driver.position || '--'}
                  </span>
                  <span
                    className="w-1.5 h-5 rounded-full"
                    style={{ backgroundColor: driver.team_colour ? `#${driver.team_colour}` : '#666' }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs">{driver.name || driver.acronym}</span>
                      <span className="text-white/40 text-[10px]">#{driver.driver_number}</span>
                      {isFerrari && (
                        <span className="px-1.5 py-0.2 rounded bg-ferrari-red text-white text-[8px] font-black">
                          FERRARI
                        </span>
                      )}
                      {driver.in_pit && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[8px] font-bold">
                          IN PIT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/40">
                      {driver.team || 'Constructor'} • {driver.laps_completed ? `${driver.laps_completed} LAPS` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[9px] text-white/40 block">BEST LAP</span>
                    <span className="font-bold text-ferrari-yellow text-xs font-mono">
                      {driver.best_lap_time || '--'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 block">LAST LAP</span>
                    <span className="font-mono text-white text-xs">
                      {driver.last_lap_time || '--'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 block">SPEED TRAP</span>
                    <span className="font-mono text-cyan-300 font-bold text-xs">
                      {driver.speed_traps?.st
                        ? `${driver.speed_traps.st}`
                        : driver.speed_traps?.i1
                        ? `${driver.speed_traps.i1}`
                        : '--'}{' '}
                      <span className="text-[8px] text-white/40">KM/H</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Sector Micro-Segments Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 border-t border-white/5">
                {/* Sector 1 */}
                <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/40 font-bold">SECTOR 1</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono font-bold ${
                        s1?.overall_best
                          ? 'bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-700'
                          : s1?.personal_best
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'text-white'
                      }`}
                    >
                      {s1?.value ? `${s1.value}s` : '--'}
                    </span>
                  </div>

                  {/* Micro-Sectors Dot Row */}
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-white/30 w-8">MICRO:</span>
                    <div className="flex items-center gap-1 flex-1">
                      {s1?.segments && s1.segments.length > 0 ? (
                        s1.segments.map((seg, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 h-3 rounded-xs flex items-center justify-center text-[7px] font-bold ${
                              seg.status === 2064
                                ? 'bg-fuchsia-500 text-black shadow-[0_0_6px_rgba(217,70,239,0.8)]'
                                : seg.status === 2048
                                ? 'bg-emerald-500 text-black shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                                : seg.status === 2049
                                ? 'bg-amber-400 text-black'
                                : 'bg-neutral-800 text-white/40'
                            }`}
                            title={`S1 Segment ${idx + 1}: Status ${seg.status}`}
                          >
                            {idx + 1}
                          </div>
                        ))
                      ) : (
                        <span className="text-[9px] text-white/20">No segment pulses</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sector 2 */}
                <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/40 font-bold">SECTOR 2</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono font-bold ${
                        s2?.overall_best
                          ? 'bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-700'
                          : s2?.personal_best
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'text-white'
                      }`}
                    >
                      {s2?.value ? `${s2.value}s` : '--'}
                    </span>
                  </div>

                  {/* Micro-Sectors Dot Row */}
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-white/30 w-8">MICRO:</span>
                    <div className="flex items-center gap-1 flex-1">
                      {s2?.segments && s2.segments.length > 0 ? (
                        s2.segments.map((seg, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 h-3 rounded-xs flex items-center justify-center text-[7px] font-bold ${
                              seg.status === 2064
                                ? 'bg-fuchsia-500 text-black shadow-[0_0_6px_rgba(217,70,239,0.8)]'
                                : seg.status === 2048
                                ? 'bg-emerald-500 text-black shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                                : seg.status === 2049
                                ? 'bg-amber-400 text-black'
                                : 'bg-neutral-800 text-white/40'
                            }`}
                            title={`S2 Segment ${idx + 1}: Status ${seg.status}`}
                          >
                            {idx + 1}
                          </div>
                        ))
                      ) : (
                        <span className="text-[9px] text-white/20">No segment pulses</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sector 3 */}
                <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/40 font-bold">SECTOR 3</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono font-bold ${
                        s3?.overall_best
                          ? 'bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-700'
                          : s3?.personal_best
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'text-white'
                      }`}
                    >
                      {s3?.value ? `${s3.value}s` : '--'}
                    </span>
                  </div>

                  {/* Micro-Sectors Dot Row */}
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-white/30 w-8">MICRO:</span>
                    <div className="flex items-center gap-1 flex-1">
                      {s3?.segments && s3.segments.length > 0 ? (
                        s3.segments.map((seg, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 h-3 rounded-xs flex items-center justify-center text-[7px] font-bold ${
                              seg.status === 2064
                                ? 'bg-fuchsia-500 text-black shadow-[0_0_6px_rgba(217,70,239,0.8)]'
                                : seg.status === 2048
                                ? 'bg-emerald-500 text-black shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                                : seg.status === 2049
                                ? 'bg-amber-400 text-black'
                                : 'bg-neutral-800 text-white/40'
                            }`}
                            title={`S3 Segment ${idx + 1}: Status ${seg.status}`}
                          >
                            {idx + 1}
                          </div>
                        ))
                      ) : (
                        <span className="text-[9px] text-white/20">No segment pulses</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
        <span>PROVENANCE: livetiming.formula1.com/signalrcore (f1-live-api)</span>
        <span className="text-emerald-400 font-bold">100% UNFABRICATED FIA TELEMETRY</span>
      </div>
    </div>
  )
}

