import React, { useState, useEffect, useMemo } from 'react'
import { DRIVERS, type Driver } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import { f1LiveApiClient, type F1LiveDriverTiming, type F1LiveTimingResponse } from '../../services/f1LiveApiClient'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import type { ProvenanceMetadata } from '../../services/dataProvenance'
import {
  SlidersHorizontal,
  Activity,
  ArrowUp,
  ChevronLeft,
  Gauge,
  Zap,
  Flame,
  Radio,
  Clock,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react'

export const TelemetryCompareView: React.FC = () => {
  const [driverAId, setDriverAId] = useState<string>('max-verstappen')
  const [driverBId, setDriverBId] = useState<string>('lewis-hamilton')

  const [timingResponse, setTimingResponse] = useState<F1LiveTimingResponse | null>(null)
  const [carDataA, setCarDataA] = useState<{
    rpm: number | null
    speed: number | null
    gear: number | null
    throttle: number | null
    brake: number | null
    drs: number | null
  } | null>(null)
  const [carDataB, setCarDataB] = useState<{
    rpm: number | null
    speed: number | null
    gear: number | null
    throttle: number | null
    brake: number | null
    drs: number | null
  } | null>(null)
  const [provenance, setProvenance] = useState<ProvenanceMetadata | null>(null)
  const [sessionName, setSessionName] = useState<string>('Qualifying')
  const [isLiveSession, setIsLiveSession] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const driverA: Driver = DRIVERS.find((d) => d.id === driverAId) || DRIVERS[2] // Max Verstappen
  const driverB: Driver = DRIVERS.find((d) => d.id === driverBId) || DRIVERS[1] // Lewis Hamilton

  // Match driver timing in the session by number, acronym, or surname
  const findDriverTiming = (driver: Driver, drivers: F1LiveDriverTiming[]): F1LiveDriverTiming | null => {
    if (!drivers || drivers.length === 0) return null
    const targetNum = String(driver.number)
    const targetCode = driver.code.toUpperCase()
    const surname = driver.name.split(' ').pop()?.toUpperCase() || ''

    return (
      drivers.find(
        (d) =>
          d.driver_number === targetNum ||
          (d.acronym && d.acronym.toUpperCase() === targetCode) ||
          (surname && d.name && d.name.toUpperCase().includes(surname))
      ) || null
    )
  }

  // Load genuine session telemetry
  useEffect(() => {
    let mounted = true
    const loadTelemetry = async () => {
      setLoading(true)
      try {
        const timing = await f1LiveApiClient.getTiming()
        if (!mounted) return

        if (timing) {
          setTimingResponse(timing)
          setProvenance(timing.provenance)
          setSessionName(timing.session || 'Qualifying')
          setIsLiveSession(Boolean(timing.live))

          const matchedA = findDriverTiming(driverA, timing.drivers)
          const matchedB = findDriverTiming(driverB, timing.drivers)

          // Fetch individual SECU sensor channels
          const [carA, carB] = await Promise.all([
            f1LiveApiClient.getCarTelemetry(matchedA?.driver_number || driverA.number),
            f1LiveApiClient.getCarTelemetry(matchedB?.driver_number || driverB.number),
          ])

          if (!mounted) return
          setCarDataA(carA?.telemetry || matchedA?.telemetry || null)
          setCarDataB(carB?.telemetry || matchedB?.telemetry || null)
        }
      } catch (err) {
        console.warn('[TelemetryCompareView] Failed to load telemetry:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadTelemetry()
    return () => {
      mounted = false
    }
  }, [driverAId, driverBId])

  const timingA = useMemo(
    () => (timingResponse ? findDriverTiming(driverA, timingResponse.drivers) : null),
    [timingResponse, driverA]
  )
  const timingB = useMemo(
    () => (timingResponse ? findDriverTiming(driverB, timingResponse.drivers) : null),
    [timingResponse, driverB]
  )

  // Channel readings (Zero Fabrication: If unavailable, outputs null)
  const speedA = carDataA?.speed ?? timingA?.telemetry?.speed ?? null
  const speedB = carDataB?.speed ?? timingB?.telemetry?.speed ?? null

  const throttleA = carDataA?.throttle ?? timingA?.telemetry?.throttle ?? null
  const throttleB = carDataB?.throttle ?? timingB?.telemetry?.throttle ?? null

  const brakeA = carDataA?.brake ?? timingA?.telemetry?.brake ?? null
  const brakeB = carDataB?.brake ?? timingB?.telemetry?.brake ?? null

  const rpmA = carDataA?.rpm ?? timingA?.telemetry?.rpm ?? null
  const rpmB = carDataB?.rpm ?? timingB?.telemetry?.rpm ?? null

  const gearA = carDataA?.gear ?? timingA?.telemetry?.gear ?? null
  const gearB = carDataB?.gear ?? timingB?.telemetry?.gear ?? null

  const drsA = carDataA?.drs ?? timingA?.telemetry?.drs ?? null
  const drsB = carDataB?.drs ?? timingB?.telemetry?.drs ?? null

  // Delta helpers
  const speedDelta = speedA !== null && speedB !== null ? speedA - speedB : null
  const throttleDelta = throttleA !== null && throttleB !== null ? throttleA - throttleB : null
  const rpmDelta = rpmA !== null && rpmB !== null ? rpmA - rpmB : null

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <span className="font-mono text-xs text-[#858585] uppercase tracking-widest block mb-1">
            ADVANCED TELEMETRY COMPARATOR // GENUINE CHANNEL AUDIT
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-[#F5F5F5] flex items-center gap-3">
            DRIVER <ShinyText text="HEAD-TO-HEAD COMPARISON" speed={2.5} className="text-[#FED500]" />
          </h1>
        </div>

        <a
          href="#pitwall"
          className="px-4 py-2 bg-[#1B1B1B] border border-[#292929] text-[#F5F5F5] font-mono text-xs font-bold uppercase tracking-wider hover:border-[#E10600] transition-colors flex items-center gap-1.5 rounded-none"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN TO WORKSTATION</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Quick Duel Presets */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-[#111111] border border-[#292929] font-mono text-xs rounded-none">
          <span className="text-[#858585] uppercase tracking-wider text-[11px] mr-2">QUICK DUEL SELECT:</span>
          <button
            onClick={() => {
              setDriverAId('max-verstappen')
              setDriverBId('lewis-hamilton')
            }}
            className={`px-3 py-1.5 border text-xs font-bold transition-colors rounded-none ${
              driverAId === 'max-verstappen' && driverBId === 'lewis-hamilton'
                ? 'bg-[#FED500]/15 border-[#FED500] text-[#FED500]'
                : 'bg-[#1B1B1B] border-[#292929] text-[#858585] hover:text-[#F5F5F5]'
            }`}
          >
            VERSTAPPEN (#1) VS HAMILTON (#44)
          </button>
          <button
            onClick={() => {
              setDriverAId('charles-leclerc')
              setDriverBId('lewis-hamilton')
            }}
            className={`px-3 py-1.5 border text-xs font-bold transition-colors rounded-none ${
              driverAId === 'charles-leclerc' && driverBId === 'lewis-hamilton'
                ? 'bg-[#E10600]/15 border-[#E10600] text-[#E10600]'
                : 'bg-[#1B1B1B] border-[#292929] text-[#858585] hover:text-[#F5F5F5]'
            }`}
          >
            LECLERC (#16) VS HAMILTON (#44) // FERRARI
          </button>
          <button
            onClick={() => {
              setDriverAId('max-verstappen')
              setDriverBId('lando-norris')
            }}
            className={`px-3 py-1.5 border text-xs font-bold transition-colors rounded-none ${
              driverAId === 'max-verstappen' && driverBId === 'lando-norris'
                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400'
                : 'bg-[#1B1B1B] border-[#292929] text-[#858585] hover:text-[#F5F5F5]'
            }`}
          >
            VERSTAPPEN (#1) VS NORRIS (#4)
          </button>
        </div>

        {/* Provenance Badge */}
        {provenance && (
          <DataProvenanceBadge
            provenance={provenance}
            title={`Session Comparison // ${sessionName} (${isLiveSession ? 'LIVE STREAM' : 'HISTORICAL SESSION SNAPSHOT'})`}
          />
        )}

        {/* Driver Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Driver A Selector */}
          <div className="p-4 bg-[#111111] border-l-2 border-l-[#E10600] border border-[#292929] rounded-none">
            <label className="block text-[#E10600] font-bold uppercase mb-2">
              DRIVER 1 (PRIMARY)
            </label>
            <select
              value={driverAId}
              onChange={(e) => setDriverAId(e.target.value)}
              className="w-full bg-[#1B1B1B] border border-[#292929] px-4 py-2.5 text-white font-display font-bold uppercase tracking-wider focus:outline-none focus:border-[#E10600] rounded-none cursor-pointer"
            >
              {DRIVERS.map((d) => (
                <option key={d.id} value={d.id}>
                  #{d.number} {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>

          {/* Driver B Selector */}
          <div className="p-4 bg-[#111111] border-l-2 border-l-[#FED500] border border-[#292929] rounded-none">
            <label className="block text-[#FED500] font-bold uppercase mb-2">
              DRIVER 2 (COMPARISON)
            </label>
            <select
              value={driverBId}
              onChange={(e) => setDriverBId(e.target.value)}
              className="w-full bg-[#1B1B1B] border border-[#292929] px-4 py-2.5 text-white font-display font-bold uppercase tracking-wider focus:outline-none focus:border-[#FED500] rounded-none cursor-pointer"
            >
              {DRIVERS.map((d) => (
                <option key={d.id} value={d.id}>
                  #{d.number} {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Genuine Telemetry Channels Comparison Card */}
        <div className="p-6 bg-[#111111] border border-[#292929] font-mono text-xs rounded-none">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#292929] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-[#E10600]" />
              <h2 className="font-display font-black text-xl text-[#F5F5F5] uppercase tracking-tight">
                GENUINE CAR SENSOR CHANNELS // {sessionName.toUpperCase()}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#858585]">
              <span className="w-2 h-2 rounded-none bg-emerald-500" />
              <span>AUTHENTIC FOM SECU / OPENF1 READINGS ONLY</span>
            </div>
          </div>

          {/* Side-by-side Telemetry Channel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Driver A Telemetry Status */}
            <div className="flex flex-col items-center md:items-start p-4 bg-[#1B1B1B] border border-[#292929] rounded-none">
              <span className="text-3xl font-display font-black text-[#E10600] tabular-nums">#{driverA.number}</span>
              <h3 className="font-display font-bold text-lg text-white uppercase">{driverA.name}</h3>
              <span className="text-[#858585] text-[11px]">{driverA.team}</span>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 bg-[#111111] border border-[#292929] text-[#D8D8D8] rounded-none tabular-nums">
                  POS: {timingA?.position || 'N/A'}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#111111] border border-[#292929] text-[#D8D8D8] rounded-none">
                  TYRE: {timingA?.tyre_compound || 'N/A'}
                </span>
              </div>
            </div>

            {/* Channels & Deltas Center */}
            <div className="flex flex-col gap-2">
              {/* Speed */}
              <div className="flex justify-between items-center bg-[#1B1B1B] p-2.5 border border-[#292929] rounded-none">
                <span className="font-bold text-[#E10600] text-sm tabular-nums">
                  {speedA !== null ? `${speedA} KM/H` : 'N/A'}
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-[#858585] uppercase text-[10px]">SPEED</span>
                  {speedDelta !== null && (
                    <span
                      className={`text-[10px] font-bold tabular-nums ${
                        speedDelta > 0 ? 'text-[#E10600]' : speedDelta < 0 ? 'text-[#FED500]' : 'text-[#858585]'
                      }`}
                    >
                      {speedDelta > 0 ? `+${speedDelta} (D1)` : `${speedDelta} (D2)`}
                    </span>
                  )}
                </div>
                <span className="font-bold text-[#FED500] text-sm tabular-nums">
                  {speedB !== null ? `${speedB} KM/H` : 'N/A'}
                </span>
              </div>

              {/* Throttle */}
              <div className="flex justify-between items-center bg-[#1B1B1B] p-2.5 border border-[#292929] rounded-none">
                <span className="font-bold text-[#E10600] text-sm tabular-nums">
                  {throttleA !== null ? `${throttleA}%` : 'N/A'}
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-[#858585] uppercase text-[10px]">THROTTLE</span>
                  {throttleDelta !== null && (
                    <span
                      className={`text-[10px] font-bold tabular-nums ${
                        throttleDelta > 0 ? 'text-[#E10600]' : throttleDelta < 0 ? 'text-[#FED500]' : 'text-[#858585]'
                      }`}
                    >
                      {throttleDelta > 0 ? `+${throttleDelta}%` : `${throttleDelta}%`}
                    </span>
                  )}
                </div>
                <span className="font-bold text-[#FED500] text-sm tabular-nums">
                  {throttleB !== null ? `${throttleB}%` : 'N/A'}
                </span>
              </div>

              {/* Brake */}
              <div className="flex justify-between items-center bg-[#1B1B1B] p-2.5 border border-[#292929] rounded-none">
                <span className="font-bold text-[#E10600] text-sm tabular-nums">
                  {brakeA !== null ? (brakeA > 0 ? `${brakeA}%` : 'OFF') : 'N/A'}
                </span>
                <span className="text-[#858585] uppercase text-[10px]">BRAKE</span>
                <span className="font-bold text-[#FED500] text-sm tabular-nums">
                  {brakeB !== null ? (brakeB > 0 ? `${brakeB}%` : 'OFF') : 'N/A'}
                </span>
              </div>

              {/* Gear */}
              <div className="flex justify-between items-center bg-[#1B1B1B] p-2.5 border border-[#292929] rounded-none">
                <span className="font-bold text-[#E10600] text-sm tabular-nums">
                  {gearA !== null ? (gearA === 0 ? 'N' : `G${gearA}`) : 'N/A'}
                </span>
                <span className="text-[#858585] uppercase text-[10px]">GEAR</span>
                <span className="font-bold text-[#FED500] text-sm tabular-nums">
                  {gearB !== null ? (gearB === 0 ? 'N' : `G${gearB}`) : 'N/A'}
                </span>
              </div>

              {/* Engine RPM */}
              <div className="flex justify-between items-center bg-[#1B1B1B] p-2.5 border border-[#292929] rounded-none">
                <span className="font-bold text-[#E10600] text-sm tabular-nums">
                  {rpmA !== null ? `${rpmA} RPM` : 'N/A'}
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-[#858585] uppercase text-[10px]">ENGINE RPM</span>
                  {rpmDelta !== null && (
                    <span
                      className={`text-[10px] font-bold tabular-nums ${
                        rpmDelta > 0 ? 'text-[#E10600]' : rpmDelta < 0 ? 'text-[#FED500]' : 'text-[#858585]'
                      }`}
                    >
                      {rpmDelta > 0 ? `+${rpmDelta}` : `${rpmDelta}`}
                    </span>
                  )}
                </div>
                <span className="font-bold text-[#FED500] text-sm tabular-nums">
                  {rpmB !== null ? `${rpmB} RPM` : 'N/A'}
                </span>
              </div>

              {/* DRS */}
              <div className="flex justify-between items-center bg-[#1B1B1B] p-2.5 border border-[#292929] rounded-none">
                <span
                  className={`font-bold text-xs px-2 py-0.5 rounded-none ${
                    drsA !== null && drsA > 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-[#858585]'
                  }`}
                >
                  {drsA !== null ? (drsA > 0 ? 'ACTIVE' : 'OFF') : 'N/A'}
                </span>
                <span className="text-[#858585] uppercase text-[10px]">DRS STATUS</span>
                <span
                  className={`font-bold text-xs px-2 py-0.5 rounded-none ${
                    drsB !== null && drsB > 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-[#858585]'
                  }`}
                >
                  {drsB !== null ? (drsB > 0 ? 'ACTIVE' : 'OFF') : 'N/A'}
                </span>
              </div>

              {/* Best Lap Time */}
              <div className="flex justify-between items-center bg-[#1B1B1B] p-2.5 border border-[#292929] rounded-none">
                <span className="font-bold text-[#E10600] text-xs tabular-nums">
                  {timingA?.best_lap_time || 'N/A'}
                </span>
                <span className="text-[#858585] uppercase text-[10px]">BEST LAP TIME</span>
                <span className="font-bold text-[#FED500] text-xs tabular-nums">
                  {timingB?.best_lap_time || 'N/A'}
                </span>
              </div>
            </div>

            {/* Driver B Telemetry Status */}
            <div className="flex flex-col items-center md:items-end p-4 bg-[#1B1B1B] border border-[#292929] rounded-none">
              <span className="text-3xl font-display font-black text-[#FED500] tabular-nums">#{driverB.number}</span>
              <h3 className="font-display font-bold text-lg text-white uppercase">{driverB.name}</h3>
              <span className="text-[#858585] text-[11px]">{driverB.team}</span>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 bg-[#111111] border border-[#292929] text-[#D8D8D8] rounded-none tabular-nums">
                  POS: {timingB?.position || 'N/A'}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#111111] border border-[#292929] text-[#D8D8D8] rounded-none">
                  TYRE: {timingB?.tyre_compound || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Head-to-Head Statistics Comparison Card (Preserved Career Metrics) */}
        <div className="p-6 bg-[#111111] border border-[#292929] rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Driver A Profile */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <span className="text-4xl font-display font-black text-[#E10600] tabular-nums">#{driverA.number}</span>
              <h3 className="font-display font-black text-2xl text-white uppercase">{driverA.name}</h3>
              <span className="font-mono text-xs text-[#858585]">{driverA.team}</span>
            </div>

            {/* Metrics Center */}
            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between items-center bg-[#1B1B1B] p-2.5 border border-[#292929] rounded-none">
                <span className="font-bold text-[#E10600] tabular-nums">{driverA.wins}</span>
                <span className="text-[#858585] uppercase">GRAND PRIX WINS</span>
                <span className="font-bold text-[#FED500] tabular-nums">{driverB.wins}</span>
              </div>
              <div className="flex justify-between items-center bg-[#1B1B1B] p-2.5 border border-[#292929] rounded-none">
                <span className="font-bold text-[#E10600] tabular-nums">{driverA.poles}</span>
                <span className="text-[#858585] uppercase">POLE POSITIONS</span>
                <span className="font-bold text-[#FED500] tabular-nums">{driverB.poles}</span>
              </div>
              <div className="flex justify-between items-center bg-[#1B1B1B] p-2.5 border border-[#292929] rounded-none">
                <span className="font-bold text-[#E10600] tabular-nums">{driverA.podiums}</span>
                <span className="text-[#858585] uppercase">PODIUM FINISHES</span>
                <span className="font-bold text-[#FED500] tabular-nums">{driverB.podiums}</span>
              </div>
              <div className="flex justify-between items-center bg-[#1B1B1B] p-2.5 border border-[#292929] rounded-none">
                <span className="font-bold text-[#E10600] tabular-nums">{driverA.careerPoints}</span>
                <span className="text-[#858585] uppercase">CAREER POINTS</span>
                <span className="font-bold text-[#FED500] tabular-nums">{driverB.careerPoints}</span>
              </div>
            </div>

            {/* Driver B Profile */}
            <div className="text-center md:text-right flex flex-col items-center md:items-end">
              <span className="text-4xl font-display font-black text-[#FED500] tabular-nums">#{driverB.number}</span>
              <h3 className="font-display font-black text-2xl text-white uppercase">{driverB.name}</h3>
              <span className="font-mono text-xs text-[#858585]">{driverB.team}</span>
            </div>
          </div>
        </div>

        {/* Speed vs Distance Overlay Status Card */}
        <div className="p-6 bg-[#111111] border border-[#292929] font-mono text-xs rounded-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-black text-lg text-white uppercase">
              SPEED TRACE TELEMETRY STATUS
            </h3>
            <span className="text-[#858585]">STATUS: ZERO SYNTHETIC DATA</span>
          </div>

          <div className="w-full bg-[#1B1B1B] p-8 border border-[#292929] text-center flex flex-col items-center gap-3 rounded-none">
            <Activity className="w-8 h-8 text-[#858585]/40" />
            <span className="font-bold text-white text-sm">
              {isLiveSession
                ? 'CONTINUOUS LIVE CAR SENSOR TELEMETRY STREAMING'
                : 'HISTORICAL SPEED DELTA & SECU CHANNELS DISPLAYED ABOVE'}
            </span>
            <p className="text-[#858585] text-xs max-w-lg leading-relaxed">
              Car channels (Speed, Throttle, Brake, Gear, RPM, DRS) are sourced directly from verified telemetry feeds ({sessionName}). In strict accordance with the zero-fabrication policy, imaginary continuous curves are never interpolated when discrete sensor telemetry is captured.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TelemetryCompareView
