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
    <div className="bg-[#0B0D13] border border-[#292929] p-4 sm:p-5 flex flex-col gap-4 font-mono text-xs rounded-none select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#292929]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Timer className="w-4 h-4 text-[#FED500]" />
            <span className="font-display font-black text-xs uppercase tracking-wider text-[#F5F5F5]">
              MICRO-SECTORS TELEMETRY MATRIX // {activeSessionName}
            </span>
          </div>
          <span className="text-[11px] text-[#858585]">
            Official FOM micro-segment classification with color-coded segment status (2064 Purple / 2048 Green / 2049 Yellow)
          </span>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858585]" />
            <input
              type="text"
              placeholder="Filter driver or team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1B1B1B] border border-[#292929] pl-8 pr-3 py-1 text-white text-[11px] placeholder-[#858585] focus:outline-none focus:border-[#E10600] rounded-none"
            />
          </div>

          <button
            onClick={() => setFilterFerrari(!filterFerrari)}
            className={`px-3 py-1 text-[11px] font-bold border transition-colors rounded-none ${
              filterFerrari
                ? 'bg-[#E10600] text-white border-[#E10600]'
                : 'bg-[#1B1B1B] text-[#858585] border-[#292929] hover:text-white'
            }`}
          >
            FERRARI ONLY
          </button>
        </div>
      </div>

      {/* Segment Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#111111] border border-[#292929] text-[10px] rounded-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-fuchsia-300">
            <span className="w-2.5 h-2.5 rounded-none bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
            <span className="font-bold">STATUS 2064: OVERALL FASTEST (PURPLE)</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-none bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="font-bold">STATUS 2048: PERSONAL BEST (GREEN)</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-none bg-amber-500" />
            <span>STATUS 2049: SLOWER SEGMENT (YELLOW)</span>
          </span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2.5 h-2.5 rounded-none bg-[#292929]" />
            <span>PENDING / IN PIT</span>
          </span>
        </div>
        <span className="text-[#858585] tabular-nums">{filteredDrivers.length} CARS LOGGED</span>
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
              className={`p-3 border transition-colors cursor-pointer flex flex-col gap-2.5 rounded-none ${
                isFerrari
                  ? 'bg-gradient-to-r from-[#E10600]/20 via-[#111111] to-[#111111] border-l-2 border-l-[#E10600] border-[#E10600]/50'
                  : isSelected
                  ? 'bg-[#181D2A] border-white/30 border-l-2 border-l-white'
                  : 'bg-[#111111] border-[#292929] hover:border-[#858585]/40 hover:bg-[#1B1B1B]'
              }`}
            >
              {/* Row Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-black text-sm w-5 text-white/90 tabular-nums">
                    P{driver.position || '--'}
                  </span>
                  <span
                    className="w-1 h-4 rounded-none"
                    style={{ backgroundColor: driver.team_colour ? `#${driver.team_colour}` : '#666' }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs">{driver.name || driver.acronym}</span>
                      <span className="text-[#858585] text-[10px] tabular-nums">#{driver.driver_number}</span>
                      {isFerrari && (
                        <span className="px-1.5 py-0.2 bg-[#E10600] text-white text-[8px] font-black tracking-wider rounded-none">
                          FERRARI
                        </span>
                      )}
                      {driver.in_pit && (
                        <span className="px-1.5 py-0.2 bg-amber-950/80 text-amber-300 border border-amber-800 text-[8px] font-bold rounded-none">
                          IN PIT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#858585]">
                      {driver.team || 'Constructor'} • {driver.laps_completed ? `${driver.laps_completed} LAPS` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[9px] text-[#858585] block">BEST LAP</span>
                    <span className="font-bold text-[#FED500] text-xs font-mono tabular-nums">
                      {driver.best_lap_time || '--'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#858585] block">LAST LAP</span>
                    <span className="font-mono text-white text-xs tabular-nums">
                      {driver.last_lap_time || '--'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#858585] block">SPEED TRAP</span>
                    <span className="font-mono text-cyan-300 font-bold text-xs tabular-nums">
                      {driver.speed_traps?.st
                        ? `${driver.speed_traps.st}`
                        : driver.speed_traps?.i1
                        ? `${driver.speed_traps.i1}`
                        : '--'}{' '}
                      <span className="text-[8px] text-[#858585]">KM/H</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Sector Micro-Segments Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 border-t border-[#292929]">
                {/* Sector 1 */}
                <div className="p-2 bg-[#1B1B1B] border border-[#292929] flex flex-col gap-1.5 rounded-none">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#858585] font-bold">SECTOR 1</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-none font-mono font-bold tabular-nums ${
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
                    <span className="text-[8px] text-[#858585] w-8">MICRO:</span>
                    <div className="flex items-center gap-1 flex-1">
                      {s1?.segments && s1.segments.length > 0 ? (
                        s1.segments.map((seg, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 h-3 rounded-none flex items-center justify-center text-[7px] font-bold ${
                              seg.status === 2064
                                ? 'bg-fuchsia-500 text-black shadow-[0_0_6px_rgba(217,70,239,0.8)]'
                                : seg.status === 2048
                                ? 'bg-emerald-500 text-black shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                                : seg.status === 2049
                                ? 'bg-amber-400 text-black'
                                : 'bg-[#292929] text-[#858585]'
                            }`}
                            title={`S1 Segment ${idx + 1}: Status ${seg.status}`}
                          >
                            {idx + 1}
                          </div>
                        ))
                      ) : (
                        <span className="text-[9px] text-[#858585]/40">No segment pulses</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sector 2 */}
                <div className="p-2 bg-[#1B1B1B] border border-[#292929] flex flex-col gap-1.5 rounded-none">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#858585] font-bold">SECTOR 2</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-none font-mono font-bold tabular-nums ${
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
                    <span className="text-[8px] text-[#858585] w-8">MICRO:</span>
                    <div className="flex items-center gap-1 flex-1">
                      {s2?.segments && s2.segments.length > 0 ? (
                        s2.segments.map((seg, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 h-3 rounded-none flex items-center justify-center text-[7px] font-bold ${
                              seg.status === 2064
                                ? 'bg-fuchsia-500 text-black shadow-[0_0_6px_rgba(217,70,239,0.8)]'
                                : seg.status === 2048
                                ? 'bg-emerald-500 text-black shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                                : seg.status === 2049
                                ? 'bg-amber-400 text-black'
                                : 'bg-[#292929] text-[#858585]'
                            }`}
                            title={`S2 Segment ${idx + 1}: Status ${seg.status}`}
                          >
                            {idx + 1}
                          </div>
                        ))
                      ) : (
                        <span className="text-[9px] text-[#858585]/40">No segment pulses</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sector 3 */}
                <div className="p-2 bg-[#1B1B1B] border border-[#292929] flex flex-col gap-1.5 rounded-none">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#858585] font-bold">SECTOR 3</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-none font-mono font-bold tabular-nums ${
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
                    <span className="text-[8px] text-[#858585] w-8">MICRO:</span>
                    <div className="flex items-center gap-1 flex-1">
                      {s3?.segments && s3.segments.length > 0 ? (
                        s3.segments.map((seg, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 h-3 rounded-none flex items-center justify-center text-[7px] font-bold ${
                              seg.status === 2064
                                ? 'bg-fuchsia-500 text-black shadow-[0_0_6px_rgba(217,70,239,0.8)]'
                                : seg.status === 2048
                                ? 'bg-emerald-500 text-black shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                                : seg.status === 2049
                                ? 'bg-amber-400 text-black'
                                : 'bg-[#292929] text-[#858585]'
                            }`}
                            title={`S3 Segment ${idx + 1}: Status ${seg.status}`}
                          >
                            {idx + 1}
                          </div>
                        ))
                      ) : (
                        <span className="text-[9px] text-[#858585]/40">No segment pulses</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-2 border-t border-[#292929] flex items-center justify-between text-[10px] text-[#858585]">
        <span>PROVENANCE: livetiming.formula1.com/signalrcore (f1-live-api)</span>
        <span className="text-emerald-400 font-bold">100% UNFABRICATED FIA TELEMETRY</span>
      </div>
    </div>
  )
}

