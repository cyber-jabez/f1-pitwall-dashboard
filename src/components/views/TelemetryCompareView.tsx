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
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            ADVANCED TELEMETRY COMPARATOR // GENUINE CHANNEL AUDIT
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            DRIVER <ShinyText text="HEAD-TO-HEAD COMPARISON" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>

        <a
          href="#live-telemetry"
          className="px-4 py-2 rounded-xl bg-[#141824] border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider hover:border-ferrari-red transition-all flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN TO WORKSTATION</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Quick Duel Presets */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#090B12] border border-white/10 font-mono text-xs">
          <span className="text-white/40 uppercase tracking-wider text-[11px] mr-2">QUICK DUEL SELECT:</span>
          <button
            onClick={() => {
              setDriverAId('max-verstappen')
              setDriverBId('lewis-hamilton')
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
              driverAId === 'max-verstappen' && driverBId === 'lewis-hamilton'
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            VERSTAPPEN (#1) VS HAMILTON (#44)
          </button>
          <button
            onClick={() => {
              setDriverAId('charles-leclerc')
              setDriverBId('lewis-hamilton')
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
              driverAId === 'charles-leclerc' && driverBId === 'lewis-hamilton'
                ? 'bg-ferrari-red/20 border-ferrari-red/60 text-red-400'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            LECLERC (#16) VS HAMILTON (#44) // FERRARI
          </button>
          <button
            onClick={() => {
              setDriverAId('max-verstappen')
              setDriverBId('lando-norris')
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
              driverAId === 'max-verstappen' && driverBId === 'lando-norris'
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
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
          <div className="p-5 rounded-2xl bg-[#0B0D14] border border-ferrari-red/60 shadow-lg">
            <label className="block text-ferrari-red font-bold uppercase mb-2">
              DRIVER 1 (PRIMARY)
            </label>
            <select
              value={driverAId}
              onChange={(e) => setDriverAId(e.target.value)}
              className="w-full bg-[#151924] border border-white/20 rounded-xl px-4 py-3 text-white font-display font-bold uppercase tracking-wider focus:outline-none focus:border-ferrari-red"
            >
              {DRIVERS.map((d) => (
                <option key={d.id} value={d.id}>
                  #{d.number} {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>

          {/* Driver B Selector */}
          <div className="p-5 rounded-2xl bg-[#0B0D14] border border-ferrari-yellow/60 shadow-lg">
            <label className="block text-ferrari-yellow font-bold uppercase mb-2">
              DRIVER 2 (COMPARISON)
            </label>
            <select
              value={driverBId}
              onChange={(e) => setDriverBId(e.target.value)}
              className="w-full bg-[#151924] border border-white/20 rounded-xl px-4 py-3 text-white font-display font-bold uppercase tracking-wider focus:outline-none focus:border-ferrari-yellow"
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
        <div className="p-6 rounded-3xl bg-[#0A0C14] border border-white/10 shadow-2xl font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-ferrari-red" />
              <h2 className="font-display font-black text-xl text-white uppercase tracking-tight">
                GENUINE CAR SENSOR CHANNELS // {sessionName.toUpperCase()}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>AUTHENTIC FOM SECU / OPENF1 READINGS ONLY</span>
            </div>
          </div>

          {/* Side-by-side Telemetry Channel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Driver A Telemetry Status */}
            <div className="flex flex-col items-center md:items-start p-4 rounded-2xl bg-[#06080D] border border-ferrari-red/30">
              <span className="text-3xl font-display font-black text-ferrari-red">#{driverA.number}</span>
              <h3 className="font-display font-bold text-lg text-white uppercase">{driverA.name}</h3>
              <span className="text-white/40 text-[11px]">{driverA.team}</span>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                  POS: {timingA?.position || 'N/A'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                  TYRE: {timingA?.tyre_compound || 'N/A'}
                </span>
              </div>
            </div>

            {/* Channels & Deltas Center */}
            <div className="flex flex-col gap-2.5">
              {/* Speed */}
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red text-sm">
                  {speedA !== null ? `${speedA} KM/H` : 'N/A'}
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-white/40 uppercase text-[10px]">SPEED</span>
                  {speedDelta !== null && (
                    <span
                      className={`text-[10px] font-bold ${
                        speedDelta > 0 ? 'text-ferrari-red' : speedDelta < 0 ? 'text-ferrari-yellow' : 'text-white/50'
                      }`}
                    >
                      {speedDelta > 0 ? `+${speedDelta} (D1)` : `${speedDelta} (D2)`}
                    </span>
                  )}
                </div>
                <span className="font-bold text-ferrari-yellow text-sm">
                  {speedB !== null ? `${speedB} KM/H` : 'N/A'}
                </span>
              </div>

              {/* Throttle */}
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red text-sm">
                  {throttleA !== null ? `${throttleA}%` : 'N/A'}
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-white/40 uppercase text-[10px]">THROTTLE</span>
                  {throttleDelta !== null && (
                    <span
                      className={`text-[10px] font-bold ${
                        throttleDelta > 0 ? 'text-ferrari-red' : throttleDelta < 0 ? 'text-ferrari-yellow' : 'text-white/50'
                      }`}
                    >
                      {throttleDelta > 0 ? `+${throttleDelta}%` : `${throttleDelta}%`}
                    </span>
                  )}
                </div>
                <span className="font-bold text-ferrari-yellow text-sm">
                  {throttleB !== null ? `${throttleB}%` : 'N/A'}
                </span>
              </div>

              {/* Brake */}
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red text-sm">
                  {brakeA !== null ? (brakeA > 0 ? `${brakeA}%` : 'OFF') : 'N/A'}
                </span>
                <span className="text-white/40 uppercase text-[10px]">BRAKE</span>
                <span className="font-bold text-ferrari-yellow text-sm">
                  {brakeB !== null ? (brakeB > 0 ? `${brakeB}%` : 'OFF') : 'N/A'}
                </span>
              </div>

              {/* Gear */}
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red text-sm">
                  {gearA !== null ? (gearA === 0 ? 'N' : `G${gearA}`) : 'N/A'}
                </span>
                <span className="text-white/40 uppercase text-[10px]">GEAR</span>
                <span className="font-bold text-ferrari-yellow text-sm">
                  {gearB !== null ? (gearB === 0 ? 'N' : `G${gearB}`) : 'N/A'}
                </span>
              </div>

              {/* Engine RPM */}
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red text-sm">
                  {rpmA !== null ? `${rpmA} RPM` : 'N/A'}
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-white/40 uppercase text-[10px]">ENGINE RPM</span>
                  {rpmDelta !== null && (
                    <span
                      className={`text-[10px] font-bold ${
                        rpmDelta > 0 ? 'text-ferrari-red' : rpmDelta < 0 ? 'text-ferrari-yellow' : 'text-white/50'
                      }`}
                    >
                      {rpmDelta > 0 ? `+${rpmDelta}` : `${rpmDelta}`}
                    </span>
                  )}
                </div>
                <span className="font-bold text-ferrari-yellow text-sm">
                  {rpmB !== null ? `${rpmB} RPM` : 'N/A'}
                </span>
              </div>

              {/* DRS */}
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span
                  className={`font-bold text-xs px-2 py-0.5 rounded ${
                    drsA !== null && drsA > 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-white/40'
                  }`}
                >
                  {drsA !== null ? (drsA > 0 ? 'ACTIVE' : 'OFF') : 'N/A'}
                </span>
                <span className="text-white/40 uppercase text-[10px]">DRS STATUS</span>
                <span
                  className={`font-bold text-xs px-2 py-0.5 rounded ${
                    drsB !== null && drsB > 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-white/40'
                  }`}
                >
                  {drsB !== null ? (drsB > 0 ? 'ACTIVE' : 'OFF') : 'N/A'}
                </span>
              </div>

              {/* Best Lap Time */}
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red text-xs">
                  {timingA?.best_lap_time || 'N/A'}
                </span>
                <span className="text-white/40 uppercase text-[10px]">BEST LAP TIME</span>
                <span className="font-bold text-ferrari-yellow text-xs">
                  {timingB?.best_lap_time || 'N/A'}
                </span>
              </div>
            </div>

            {/* Driver B Telemetry Status */}
            <div className="flex flex-col items-center md:items-end p-4 rounded-2xl bg-[#06080D] border border-ferrari-yellow/30">
              <span className="text-3xl font-display font-black text-ferrari-yellow">#{driverB.number}</span>
              <h3 className="font-display font-bold text-lg text-white uppercase">{driverB.name}</h3>
              <span className="text-white/40 text-[11px]">{driverB.team}</span>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                  POS: {timingB?.position || 'N/A'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                  TYRE: {timingB?.tyre_compound || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Head-to-Head Statistics Comparison Card (Preserved Career Metrics) */}
        <div className="p-6 rounded-3xl bg-[#0A0C14] border border-ferrari-border/80 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Driver A Profile */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <span className="text-4xl font-display font-black text-ferrari-red">#{driverA.number}</span>
              <h3 className="font-display font-black text-2xl text-white uppercase">{driverA.name}</h3>
              <span className="font-mono text-xs text-white/50">{driverA.team}</span>
            </div>

            {/* Metrics Center */}
            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red">{driverA.wins}</span>
                <span className="text-white/40 uppercase">GRAND PRIX WINS</span>
                <span className="font-bold text-ferrari-yellow">{driverB.wins}</span>
              </div>
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red">{driverA.poles}</span>
                <span className="text-white/40 uppercase">POLE POSITIONS</span>
                <span className="font-bold text-ferrari-yellow">{driverB.poles}</span>
              </div>
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red">{driverA.podiums}</span>
                <span className="text-white/40 uppercase">PODIUM FINISHES</span>
                <span className="font-bold text-ferrari-yellow">{driverB.podiums}</span>
              </div>
              <div className="flex justify-between items-center bg-[#121520] p-2.5 rounded-xl border border-white/5">
                <span className="font-bold text-ferrari-red">{driverA.careerPoints}</span>
                <span className="text-white/40 uppercase">CAREER POINTS</span>
                <span className="font-bold text-ferrari-yellow">{driverB.careerPoints}</span>
              </div>
            </div>

            {/* Driver B Profile */}
            <div className="text-center md:text-right flex flex-col items-center md:items-end">
              <span className="text-4xl font-display font-black text-ferrari-yellow">#{driverB.number}</span>
              <h3 className="font-display font-black text-2xl text-white uppercase">{driverB.name}</h3>
              <span className="font-mono text-xs text-white/50">{driverB.team}</span>
            </div>
          </div>
        </div>

        {/* Speed vs Distance Overlay Status Card */}
        <div className="p-6 rounded-3xl bg-[#090B12] border border-ferrari-border/80 shadow-2xl font-mono text-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-black text-lg text-white uppercase">
              SPEED TRACE TELEMETRY STATUS
            </h3>
            <span className="text-white/50">STATUS: ZERO SYNTHETIC DATA</span>
          </div>

          <div className="w-full bg-[#040508] rounded-2xl p-8 border border-white/5 text-center flex flex-col items-center gap-3">
            <Activity className="w-8 h-8 text-neutral-600" />
            <span className="font-bold text-white text-sm">
              {isLiveSession
                ? 'CONTINUOUS LIVE CAR SENSOR TELEMETRY STREAMING'
                : 'HISTORICAL SPEED DELTA & SECU CHANNELS DISPLAYED ABOVE'}
            </span>
            <p className="text-neutral-400 text-xs max-w-lg leading-relaxed">
              Car channels (Speed, Throttle, Brake, Gear, RPM, DRS) are sourced directly from verified telemetry feeds ({sessionName}). In strict accordance with the zero-fabrication policy, imaginary continuous curves are never interpolated when discrete sensor telemetry is captured.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TelemetryCompareView
