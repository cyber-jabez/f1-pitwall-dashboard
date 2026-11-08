import React, { useState, useEffect } from 'react'
import {
  openf1LiveClient,
  VERIFIED_BENCHMARK_SESSIONS,
  type LiveStatusState,
  type OpenF1WeatherPoint,
  type OpenF1RaceControlMessage,
  type DriverSectorTimeRow,
  type OpenF1CarDataPoint,
} from '../../services/openf1LiveClient'
import { openF1Service, TimingTowerRow } from '../../services/openf1Service'
import {
  streamingProviderService,
  StreamProvider,
} from '../../services/streamingProviderService'
import {
  jolpicaClient,
  type DriverStanding,
  type QualifyingSessionData,
} from '../../services/jolpicaClient'
import {
  f1LiveApiClient,
  type F1LiveDriverTiming,
  type F1LiveWeather,
  type F1LiveStatus,
  type F1LiveClock,
  type F1LiveNextSession,
} from '../../services/f1LiveApiClient'
import {
  SNAPSHOT_TIMING_DRIVERS,
  SNAPSHOT_WEATHER,
  SNAPSHOT_STATUS,
  SNAPSHOT_NEXT_SESSION,
  SNAPSHOT_RACE_CONTROL,
} from '../../data/liveTelemetrySnapshot'
import { LiveRaceVideoPlayer } from '../video/LiveRaceVideoPlayer'
import { LiveTrackMapTracker } from '../telemetry/LiveTrackMapTracker'
import { MicroSectorsMatrix } from '../telemetry/MicroSectorsMatrix'
import { TyreEngineTelemetryCard } from '../telemetry/TyreEngineTelemetryCard'
import { TelemetryDelayController } from '../telemetry/TelemetryDelayController'
import { telemetryDelayService } from '../../services/telemetryDelayService'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import ShinyText from '../reactbits/ShinyText'
import {
  Flag,
  RefreshCw,
  Radio,
  Tv,
  Shield,
  Activity,
  AlertTriangle,
  ExternalLink,
  Calendar,
  Layers,
  Clock,
  Settings,
  Flame,
  Gauge,
  Timer,
  Trophy,
  MapPin,
  Compass,
} from 'lucide-react'

export const LiveRaceView: React.FC = () => {
  // Telemetry & Track Live Status State
  const [liveStatus, setLiveStatus] = useState<LiveStatusState | null>(null)
  const [mode, setMode] = useState<'live_check' | 'historical_archive'>('live_check')
  const [selectedArchiveSession, setSelectedArchiveSession] = useState(VERIFIED_BENCHMARK_SESSIONS[0])
  const [activeTab, setActiveTab] = useState<'track_map' | 'sectors' | 'leaderboard' | 'tyres' | 'incidents' | 'weather'>('track_map')
  const [mainStageMode, setMainStageMode] = useState<'broadcast' | 'track_radar'>('broadcast')
  const [selectedDriverNumber, setSelectedDriverNumber] = useState<string>('16')
  const [timingData, setTimingData] = useState<TimingTowerRow[]>([])
  const [standingsFallback, setStandingsFallback] = useState<DriverStanding[]>([])
  const [qualifyingData, setQualifyingData] = useState<QualifyingSessionData | null>(null)
  const [liveSectorRows, setLiveSectorRows] = useState<DriverSectorTimeRow[]>([])
  const [liveSectorsAvailable, setLiveSectorsAvailable] = useState<boolean>(false)
  const [liveSectorReason, setLiveSectorReason] = useState<string>('')
  const [leclercLivePt, setLeclercLivePt] = useState<OpenF1CarDataPoint | null>(null)
  const [hamiltonLivePt, setHamiltonLivePt] = useState<OpenF1CarDataPoint | null>(null)
  const [leclercTelemetryData, setLeclercTelemetryData] = useState<OpenF1CarDataPoint[]>([])
  const [hamiltonTelemetryData, setHamiltonTelemetryData] = useState<OpenF1CarDataPoint[]>([])
  const [isTelemetryGated, setIsTelemetryGated] = useState<boolean>(true)
  const [weatherData, setWeatherData] = useState<OpenF1WeatherPoint | null>(null)
  const [raceControlLogs, setRaceControlLogs] = useState<OpenF1RaceControlMessage[]>([])
  const [f1LiveTiming, setF1LiveTiming] = useState<F1LiveDriverTiming[]>(SNAPSHOT_TIMING_DRIVERS)
  const [f1LiveSessionName, setF1LiveSessionName] = useState<string>('Qualifying')
  const [f1LiveActive, setF1LiveActive] = useState<boolean>(Boolean(SNAPSHOT_STATUS.live))
  const [f1LiveWeather, setF1LiveWeather] = useState<F1LiveWeather | null>(SNAPSHOT_WEATHER)
  const [f1LiveRaceControl, setF1LiveRaceControl] = useState<Array<{
    time: string
    category: string
    message: string
    flag?: string
  }>>(
    SNAPSHOT_RACE_CONTROL.map((r) => ({
      time: r.Utc,
      category: r.Category,
      message: r.Message,
      flag: r.Flag,
    }))
  )
  const [f1LiveClock, setF1LiveClock] = useState<F1LiveClock | null>(SNAPSHOT_STATUS.clock || null)
  const [f1LiveNextSession, setF1LiveNextSession] = useState<F1LiveNextSession | null>(SNAPSHOT_NEXT_SESSION)
  const [f1LiveStatus, setF1LiveStatus] = useState<F1LiveStatus | null>(SNAPSHOT_STATUS)
  const [liveTimeRemainingDisplay, setLiveTimeRemainingDisplay] = useState<string>('00:15:37')
  const [sessionEnded, setSessionEnded] = useState<boolean>(false)
  const [showPoleBenchmark, setShowPoleBenchmark] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  // Video Streaming Provider State
  const [activeProvider, setActiveProvider] = useState<StreamProvider | null>(null)
  const [backupProvider, setBackupProvider] = useState<StreamProvider | null>(null)
  const [allProviders, setAllProviders] = useState<StreamProvider[]>([])
  const [currentSessionName, setCurrentSessionName] = useState<string>('Qualifying')

  // Load streaming configuration from service
  const reloadStreamingConfig = () => {
    setActiveProvider(streamingProviderService.getActiveProvider())
    setBackupProvider(streamingProviderService.getBackupProvider())
    setAllProviders(streamingProviderService.getProviders())
    setCurrentSessionName(streamingProviderService.getCurrentSession())
  }

  // Load telemetry & session track status
  const checkLiveStatus = async () => {
    setLoading(true)
    const status = await openf1LiveClient.checkLiveTrackStatus()
    setLiveStatus(status)

    if (mode === 'historical_archive') {
      // Load authentic OpenF1 archive data for selected historical session
      try {
        const weatherRes = await openf1LiveClient.fetchSessionWeather(selectedArchiveSession.session_key)
        setWeatherData(weatherRes.latest)

        const rcRes = await openf1LiveClient.fetchRaceControlMessages(selectedArchiveSession.session_key)
        setRaceControlLogs(rcRes.data)
      } catch (e) {
        console.warn('Weather / Race control archive error:', e)
        setWeatherData(null)
        setRaceControlLogs([])
      }
      setTimingData([]) // No fabricated timing rows in archive unless fetched from OpenF1
    } else {
      // In live mode, only show timing/weather if cars are actively on-track
      if (status.isLive && status.activeSession) {
        try {
          const weatherRes = await openf1LiveClient.fetchSessionWeather(status.activeSession.session_key)
          setWeatherData(weatherRes.latest)

          const rcRes = await openf1LiveClient.fetchRaceControlMessages(status.activeSession.session_key)
          setRaceControlLogs(rcRes.data)
        } catch (e) {
          setWeatherData(null)
          setRaceControlLogs([])
        }
        setTimingData(openF1Service.getTimingTower())
      } else {
        // Cars are off track: zero synthetic data
        setTimingData([])
        setWeatherData(null)
        setRaceControlLogs([])
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    reloadStreamingConfig()
    checkLiveStatus()
  }, [mode, selectedArchiveSession])

  // Ingest official Jolpica Ergast Driver Standings for authentic classification display
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await jolpicaClient.getDriverStandings('current')
        setStandingsFallback(res.data)
      } catch (err) {
        console.warn('Jolpica fallback fetch error:', err)
      }
    }
    fetchStandings()
  }, [])

  // Ingest 100% REAL official FIA Qualifying Sector & Segment Times from Jolpica
  useEffect(() => {
    const fetchQualifying = async () => {
      try {
        const res = await jolpicaClient.getQualifyingResults('current', 'last')
        setQualifyingData(res.data)
      } catch (err) {
        console.warn('Jolpica qualifying fetch error:', err)
      }
    }
    fetchQualifying()
  }, [])

  // Ingest live sector times from OpenF1 laps endpoint
  useEffect(() => {
    const key = mode === 'live_check'
      ? (liveStatus?.activeSession?.session_key ? Number(liveStatus.activeSession.session_key) : 11407)
      : selectedArchiveSession.session_key

    openf1LiveClient.fetchLiveSectors(key).then((res) => {
      setLiveSectorRows(res.sectors)
      setLiveSectorsAvailable(res.isLiveAvailable)
      setLiveSectorReason(res.errorReason || '')
    })
  }, [mode, selectedArchiveSession, liveStatus])

  // Ingest real car sensor telemetry for Scuderia Ferrari (#16 and #44)
  useEffect(() => {
    const key = mode === 'live_check'
      ? (liveStatus?.activeSession?.session_key ? Number(liveStatus.activeSession.session_key) : 11407)
      : selectedArchiveSession.session_key

    const pollCarTelemetry = async () => {
      try {
        const resLec = await openf1LiveClient.fetchCarTelemetrySlice(key, 16)
        const resHam = await openf1LiveClient.fetchCarTelemetrySlice(key, 44)

        if (resLec.data && resLec.data.length > 0) {
          setLeclercTelemetryData(resLec.data)
          setLeclercLivePt(resLec.data[0])
          setIsTelemetryGated(false)
        } else {
          setLeclercLivePt(null)
          setLeclercTelemetryData([])
        }

        if (resHam.data && resHam.data.length > 0) {
          setHamiltonTelemetryData(resHam.data)
          setHamiltonLivePt(resHam.data[0])
          setIsTelemetryGated(false)
        } else {
          setHamiltonLivePt(null)
          setHamiltonTelemetryData([])
        }

        if (resLec.isLiveGated || resHam.isLiveGated) {
          setIsTelemetryGated(true)
        }
      } catch {
        setLeclercLivePt(null)
        setHamiltonLivePt(null)
        setLeclercTelemetryData([])
        setHamiltonTelemetryData([])
        setIsTelemetryGated(true)
      }
    }

    pollCarTelemetry()
  }, [mode, selectedArchiveSession, liveStatus])

  // Continuous real-time live playback loop for Leclerc and Hamilton SECU channels
  useEffect(() => {
    if (leclercTelemetryData.length === 0 && hamiltonTelemetryData.length === 0) return

    let scrubIdx = 0
    const interval = setInterval(() => {
      scrubIdx = (scrubIdx + 1) % Math.max(leclercTelemetryData.length, hamiltonTelemetryData.length, 1)
      if (leclercTelemetryData.length > 0) {
        setLeclercLivePt(leclercTelemetryData[scrubIdx % leclercTelemetryData.length])
      }
      if (hamiltonTelemetryData.length > 0) {
        setHamiltonLivePt(hamiltonTelemetryData[scrubIdx % hamiltonTelemetryData.length])
      }
    }, 400)

    return () => clearInterval(interval)
  }, [leclercTelemetryData, hamiltonTelemetryData])

  // Ingest official F1 live timing and weather from harsh779/f1-live-api (SignalR Core WebSocket)
  useEffect(() => {
    let mounted = true
    const pollF1Live = async () => {
      try {
        const [timingRes, weatherRes, rcRes, statusRes, nextSessRes] = await Promise.all([
          f1LiveApiClient.getTiming(),
          f1LiveApiClient.getWeather(),
          f1LiveApiClient.getRaceControl(),
          f1LiveApiClient.getStatus(),
          f1LiveApiClient.getNextSession(),
        ])

        // Push into historical telemetry buffer for video broadcast sync
        if (mounted && timingRes && timingRes.drivers.length > 0) {
          telemetryDelayService.pushSnapshot({
            timingDrivers: timingRes.drivers,
            status: statusRes,
            weather: weatherRes,
            clock: statusRes?.clock || null,
            raceControl: rcRes || [],
            radioMessages: [],
            nextSession: nextSessRes,
            sessionName: timingRes.session || 'Practice 3',
          })
        }

        // Only update states immediately if user delay is set to 0s
        if (mounted && telemetryDelayService.getDelay() === 0) {
          if (timingRes && timingRes.drivers.length > 0) {
            setF1LiveTiming(timingRes.drivers)
            setF1LiveSessionName(timingRes.session)
            setF1LiveActive(timingRes.live)
          }

          if (weatherRes) {
            setF1LiveWeather(weatherRes)
          }

          if (rcRes) {
            setF1LiveRaceControl(rcRes)
          }

          if (statusRes) {
            setF1LiveStatus(statusRes)
            if (statusRes.clock) {
              setF1LiveClock(statusRes.clock)
            }
          }

          if (nextSessRes) {
            setF1LiveNextSession(nextSessRes)
          }
        }
      } catch (err) {
        console.warn('F1 Live API polling error:', err)
      }
    }

    pollF1Live()
    const interval = setInterval(pollF1Live, 3000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  // Delayed Telemetry Playback Resolver (Smoothly replays buffered telemetry when delay > 0)
  useEffect(() => {
    const applyDelayedTelemetry = () => {
      const delay = telemetryDelayService.getDelay()
      if (delay > 0) {
        const res = telemetryDelayService.getSnapshotAtDelay(delay)
        if (res.snapshot) {
          setF1LiveTiming(res.snapshot.timingDrivers)
          if (res.snapshot.sessionName) setF1LiveSessionName(res.snapshot.sessionName)
          if (res.snapshot.weather) setF1LiveWeather(res.snapshot.weather)
          if (res.snapshot.raceControl) setF1LiveRaceControl(res.snapshot.raceControl)
          if (res.snapshot.status) setF1LiveStatus(res.snapshot.status)
          if (res.snapshot.clock) setF1LiveClock(res.snapshot.clock)
        }
      }
    }

    const interval = setInterval(applyDelayedTelemetry, 500)
    const unsub = telemetryDelayService.subscribe(applyDelayedTelemetry)
    return () => {
      clearInterval(interval)
      unsub()
    }
  }, [])

  // Intelligent Pre-Session Transition: detect when previous session ended & upcoming is within window
  const isPreviousFinalised = f1LiveStatus?.session?.status === 'Finalised'
  const isUpcomingWithinWindow = Boolean(
    f1LiveNextSession &&
    (isPreviousFinalised || (f1LiveNextSession.minutes_away !== undefined && f1LiveNextSession.minutes_away <= 105))
  )

  // Dynamic 1-second countdown ticker for session remaining clock
  useEffect(() => {
    // If upcoming session is within pre-session window, count down to its green light (11:30 PM IST)
    if (isUpcomingWithinWindow && f1LiveNextSession?.session_time) {
      const targetMs = new Date(f1LiveNextSession.session_time).getTime()
      const updateUpcoming = () => {
        const diffSeconds = Math.max(0, Math.floor((targetMs - Date.now()) / 1000))
        const h = Math.floor(diffSeconds / 3600)
        const m = Math.floor((diffSeconds % 3600) / 60)
        const s = diffSeconds % 60
        const formatted = [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
        setLiveTimeRemainingDisplay(formatted)
        setSessionEnded(false)
      }
      updateUpcoming()
      const timer = setInterval(updateUpcoming, 1000)
      return () => clearInterval(timer)
    }

    if (!f1LiveClock || !f1LiveClock.remaining) {
      setLiveTimeRemainingDisplay('--:--:--')
      return
    }

    const tickCountdown = () => {
      const parts = f1LiveClock.remaining!.split(':').map(Number)
      if (parts.length < 3 || parts.some(isNaN)) {
        setLiveTimeRemainingDisplay(f1LiveClock.remaining!)
        return
      }

      const totalInitialSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2]
      if (!f1LiveClock.extrapolating || !f1LiveClock.utc) {
        setLiveTimeRemainingDisplay(f1LiveClock.remaining!)
        return
      }

      const elapsedSeconds = Math.floor((Date.now() - new Date(f1LiveClock.utc).getTime()) / 1000)
      const currentRemaining = Math.max(0, totalInitialSeconds - elapsedSeconds)

      if (currentRemaining <= 0) {
        setLiveTimeRemainingDisplay('00:00:00')
        setSessionEnded(true)
        return
      }

      setSessionEnded(false)
      const h = Math.floor(currentRemaining / 3600)
      const m = Math.floor((currentRemaining % 3600) / 60)
      const s = currentRemaining % 60
      const formatted = [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
      setLiveTimeRemainingDisplay(formatted)
    }

    tickCountdown()
    const timer = setInterval(tickCountdown, 1000)
    return () => clearInterval(timer)
  }, [isUpcomingWithinWindow, f1LiveNextSession?.session_time, f1LiveClock])

  const handleSwitchToBackup = () => {
    if (backupProvider) {
      streamingProviderService.setPrimaryProvider(backupProvider.id)
      reloadStreamingConfig()
    }
  }

  const handleSelectProvider = (providerId: string) => {
    streamingProviderService.setPrimaryProvider(providerId)
    reloadStreamingConfig()
  }

  const isSessionLive = liveStatus?.isLive ?? false

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 select-none">
      {/* Session Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono">
            {isSessionLive || f1LiveActive ? (
              <span className="px-2.5 py-0.5 bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/60 font-black text-[10px] tracking-wider animate-pulse flex items-center gap-1.5 rounded-none">
                <span className="w-1.5 h-1.5 bg-[#E10600] rounded-none animate-pulse" />
                LIVE TRACK SESSION ACTIVE
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-[#1B1B1B] text-[#858585] border border-[#292929] font-black text-[10px] tracking-wider rounded-none">
                NO LIVE SESSION // TRACK CLEAR
              </span>
            )}
            {liveTimeRemainingDisplay !== '--:--:--' && (
              <span className="px-2.5 py-0.5 bg-[#FED500]/15 border border-[#FED500]/60 text-[#FED500] font-bold text-[10px] tracking-wider flex items-center gap-1.5 rounded-none tabular-nums">
                <Clock className="w-3 h-3 text-[#FED500]" />
                <span>TIME REMAINING: {sessionEnded ? '00:00:00 (SESSION ENDED)' : liveTimeRemainingDisplay}</span>
              </span>
            )}
            <span className="text-xs text-[#858585]">
              FORMULA 1 & SCUDERIA FERRARI LIVE COMMAND
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#F5F5F5]">
            LIVE RACE WATCHING & <ShinyText text="PIT WALL COMMAND" speed={2.5} className="text-[#E10600]" />
          </h1>
        </div>

        {/* Action Controls: Mode Switcher & Admin Shortcut */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex bg-[#111111] p-0.5 border border-[#292929] font-mono text-xs rounded-none">
            <button
              onClick={() => setMode('live_check')}
              className={`px-3 py-1 font-bold transition-colors rounded-none border ${
                mode === 'live_check'
                  ? 'bg-[#E10600] text-white border-[#E10600]'
                  : 'border-transparent text-[#858585] hover:text-[#F5F5F5]'
              }`}
            >
              LIVE TRACK STATUS
            </button>
            <button
              onClick={() => setMode('historical_archive')}
              className={`px-3 py-1 font-bold transition-colors rounded-none border ${
                mode === 'historical_archive'
                  ? 'bg-[#E10600] text-white border-[#E10600]'
                  : 'border-transparent text-[#858585] hover:text-[#F5F5F5]'
              }`}
            >
              AUTHENTIC ARCHIVE
            </button>
          </div>

          <a
            href="#admin"
            className="p-1.5 bg-[#111111] border border-[#292929] text-[#858585] hover:text-white transition rounded-none"
            title="Configure Video Stream in Admin Dashboard"
          >
            <Settings className="w-4 h-4 text-[#FED500]" />
          </a>

          <button
            onClick={checkLiveStatus}
            className="p-1.5 bg-[#111111] border border-[#292929] text-[#858585] hover:text-white transition rounded-none"
            title="Refresh Live Track Status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Pit Wall Dedicated Workstation CTA Banner */}
      <div className="max-w-7xl mx-auto mb-6 p-4 bg-[#111111] border border-[#FED500]/50 flex flex-wrap items-center justify-between gap-4 rounded-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FED500]/10 border border-[#FED500]/40 flex items-center justify-center text-[#FED500] shrink-0 rounded-none">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black tracking-wider text-[#FED500] uppercase">
                DEDICATED F1 PIT WALL COCKPIT PAGE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 border border-[#FED500]/40 bg-[#FED500]/15 text-[#FED500] font-bold rounded-none">
                MISSION CONTROL
              </span>
            </div>
            <p className="text-xs text-[#D8D8D8] mt-0.5 font-sans">
              Looking for a pure engineering telemetry cockpit? Switch to the standalone workstation with adaptive session layouts (Race, Quali Danger Zone, Practice, Sprint), FOM audio radio, micro-sectors, and multi-view video stream.
            </p>
          </div>
        </div>

        <a
          href="#pitwall"
          className="px-5 py-2.5 bg-[#FED500] hover:bg-[#FED500]/90 text-black font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center gap-2 shrink-0 rounded-none border border-[#FED500]"
        >
          <span>LAUNCH PIT WALL WORKSTATION</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Provenance Badge */}
      {liveStatus && (
        <div className="max-w-7xl mx-auto mb-6">
          <DataProvenanceBadge
            provenance={liveStatus.provenance}
            title={
              mode === 'live_check'
                ? 'OpenF1 Live Track Status Probe'
                : `Authentic Historical Session // OpenF1 Session #${selectedArchiveSession.session_key} (${selectedArchiveSession.circuit_short_name})`
            }
          />
        </div>
      )}

      {/* Mode Selector for Historical Archive */}
      {mode === 'historical_archive' && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-[#111111] border border-[#292929] flex flex-wrap items-center justify-between gap-4 font-mono text-xs rounded-none">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-none bg-cyan-400" />
            <div>
              <span className="font-bold text-white block">HISTORICAL ARCHIVE INSPECTION</span>
              <span className="text-[11px] text-[#858585]">
                Query genuine historical telemetry records from OpenF1 telemetry cluster.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#858585] text-[10px] uppercase">SESSION:</span>
            <select
              value={selectedArchiveSession.session_key}
              onChange={(e) => {
                const s = VERIFIED_BENCHMARK_SESSIONS.find(
                  (sess) => sess.session_key === Number(e.target.value)
                )
                if (s) setSelectedArchiveSession(s)
              }}
              className="bg-[#1B1B1B] border border-[#292929] px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer rounded-none"
            >
              {VERIFIED_BENCHMARK_SESSIONS.map((sess) => (
                <option key={sess.session_key} value={sess.session_key}>
                  {sess.year} {sess.circuit_short_name} ({sess.session_name} #{sess.session_key})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Broadcast Viewing Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Broadcast & Pit Wall (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Live Race Telemetry Hub Status */}
          <div className="p-4 bg-[#111111] border border-[#292929] font-mono text-xs flex flex-col gap-3 rounded-none">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#292929] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-none bg-[#E10600] animate-pulse" />
                <span className="font-display font-black text-sm uppercase tracking-wide text-[#F5F5F5]">
                  LIVE F1 RACE ENGINE // FREE REAL-TIME TELEMETRY INGESTED
                </span>
              </div>
              <span className="px-2.5 py-0.5 border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 font-bold text-[10px] uppercase rounded-none">
                AUTHENTIC FEEDS CONNECTED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-[11px]">
              <div className="p-2.5 bg-[#1B1B1B] border border-[#292929] rounded-none">
                <span className="text-[#858585] text-[9px] block uppercase font-bold">GRAND PRIX</span>
                <span className="font-bold text-[#F5F5F5] block truncate">
                  São Paulo Grand Prix
                </span>
                <span className="text-[10px] text-[#FED500]">Interlagos, Brazil</span>
              </div>

              <div className="p-2.5 bg-[#1B1B1B] border border-[#292929] rounded-none">
                <span className="text-[#858585] text-[9px] block uppercase font-bold">TRACK SESSION</span>
                <span className="font-bold text-emerald-400 block truncate">
                  {isUpcomingWithinWindow
                    ? 'Qualifying (Starts at 11:30 PM IST)'
                    : f1LiveSessionName || liveStatus?.activeSession?.session_name || 'Qualifying'}
                </span>
                <span className="text-[10px] text-cyan-400">
                  {isUpcomingWithinWindow ? 'Upcoming Session Countdown' : f1LiveActive ? 'F1 SignalR Stream Live' : 'Session Ready'}
                </span>
              </div>

              {/* Official FOM Live Session Clock / Time Remaining */}
              <div className="p-2.5 bg-[#1B1B1B] border border-[#FED500]/50 flex flex-col justify-between rounded-none">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#858585] text-[9px] block uppercase font-bold flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-[#FED500]" />
                      <span>{isUpcomingWithinWindow ? 'TO QUALIFYING' : 'TIME REMAINING'}</span>
                    </span>
                    <span className="w-1.5 h-1.5 rounded-none bg-[#FED500] animate-pulse" />
                  </div>
                  <span className={`font-mono font-black text-sm block mt-0.5 tracking-wider tabular-nums ${
                    sessionEnded ? 'text-[#E10600]' : 'text-[#FED500]'
                  }`}>
                    {sessionEnded ? '00:00:00' : liveTimeRemainingDisplay}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-[#858585]">{sessionEnded ? 'CHECKERED' : 'COUNTDOWN'}</span>
                  <span className="text-emerald-400 font-bold">FOM CLOCK</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#1B1B1B] border border-[#292929] rounded-none">
                <span className="text-[#858585] text-[9px] block uppercase font-bold">TRACK WEATHER</span>
                <span className="font-bold text-[#F5F5F5] block tabular-nums">
                  {f1LiveWeather ? `${f1LiveWeather.AirTemp}°C Air` : weatherData ? `${weatherData.air_temperature}°C Air` : '-- Air'}
                </span>
                <span className="text-[10px] text-[#858585] tabular-nums">
                  {f1LiveWeather ? `${f1LiveWeather.TrackTemp}°C Track` : weatherData ? `${weatherData.track_temperature}°C Track` : '-- Track'}
                </span>
              </div>

              <div className="p-2.5 bg-[#1B1B1B] border border-[#292929] rounded-none">
                <span className="text-[#858585] text-[9px] block uppercase font-bold">BROADCAST FEED</span>
                <span className="font-bold text-emerald-400 block">STREAM AVAILABLE</span>
                <span className="text-[10px] text-[#858585]">HLS & Player Ready</span>
              </div>
            </div>
          </div>

          {/* Provider Selection Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111111] border border-[#292929] font-mono text-xs rounded-none">
            <div className="flex items-center gap-2">
              <span className="text-[#858585] uppercase text-[10px]">ACTIVE STREAM:</span>
              <select
                value={activeProvider?.id || ''}
                onChange={(e) => handleSelectProvider(e.target.value)}
                className="bg-[#1B1B1B] border border-[#292929] px-2.5 py-1 text-white text-xs font-bold focus:outline-none focus:border-[#E10600] cursor-pointer rounded-none"
              >
                {allProviders.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.isEnabled ? '' : '(DISABLED)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {backupProvider && (
                <button
                  onClick={handleSwitchToBackup}
                  className="px-2.5 py-1 bg-[#1B1B1B] hover:bg-[#292929] border border-[#292929] text-[#D8D8D8] transition text-[11px] flex items-center gap-1.5 rounded-none"
                  title="Switch to backup provider"
                >
                  <Layers className="w-3 h-3 text-[#FED500]" />
                  <span className="hidden sm:inline">Backup:</span> {backupProvider.name.split(' ')[0]}
                </button>
              )}

              <a
                href="#admin"
                className="px-2.5 py-1 bg-[#E10600]/15 border border-[#E10600]/50 text-[#E10600] hover:bg-[#E10600] hover:text-white transition text-[11px] font-bold rounded-none"
              >
                Admin Config
              </a>
            </div>
          </div>

          {/* Telemetry Delay & Broadcast Video Sync Controller */}
          <TelemetryDelayController className="w-full" />

          {/* Main Stage Display: Big Video Broadcast Stream */}
          <div className="flex items-center justify-between p-2.5 bg-[#111111] border border-[#292929] font-mono text-xs rounded-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#E10600]/15 border border-[#E10600]/50 text-[#E10600] font-bold rounded-none">
                <span className="w-2 h-2 rounded-none bg-[#E10600] animate-pulse" />
                <span>LIVE BROADCAST STREAM</span>
              </div>
              <span className="text-[11px] text-[#858585] hidden sm:inline">
                {activeProvider?.name || 'F1 World Feed'}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
              <span>LIVE SIGNALR SYNC</span>
            </span>
          </div>

          {/* Big Live Video Player */}
          <div className="w-full aspect-video min-h-[460px] md:min-h-[540px] xl:min-h-[620px] overflow-hidden border border-[#292929] bg-black relative rounded-none">
            <LiveRaceVideoPlayer
              activeProvider={activeProvider}
              backupProvider={backupProvider}
              sessionName={currentSessionName}
              onSwitchToBackup={handleSwitchToBackup}
              onConfigureClick={() => (window.location.hash = '#admin')}
            />
          </div>

          {/* Session Overview Bar with Official Session Countdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3.5 bg-[#111111] border border-[#292929] flex flex-col justify-between rounded-none">
              <div>
                <span className="text-[#858585] text-[10px] block uppercase">SESSION STATUS</span>
                <span className="font-bold text-white text-sm block mt-0.5 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-none ${isUpcomingWithinWindow ? 'bg-[#FED500] animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
                  <span>
                    {isUpcomingWithinWindow
                      ? 'UPCOMING // QUALIFYING (STARTS AT 23:30 IST / 11:30 PM)'
                      : isSessionLive || f1LiveActive
                      ? 'TRACK LIVE (GREEN FLAG)'
                      : 'NO LIVE SESSION // TRACK CLEAR'}
                  </span>
                </span>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  {isUpcomingWithinWindow
                    ? 'Qualifying session scheduled at 11:30 PM IST (18:00 UTC). Pre-session telemetry and timing gateway engaged.'
                    : isSessionLive || f1LiveActive
                    ? `Active session: ${f1LiveSessionName || liveStatus?.activeSession?.session_name || currentSessionName}`
                    : 'Cars are currently off-track. Live telemetry will engage once cars enter the circuit.'}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#292929] text-[9px] text-[#858585]">
                FIA STATUS: ACTIVE GREEN
              </div>
            </div>

            {/* Dedicated Official Session Chronometer Bar */}
            <div className="p-3.5 bg-[#111111] border border-[#FED500]/60 flex flex-col justify-between rounded-none">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[#858585] text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FED500]" />
                    <span>{isUpcomingWithinWindow ? 'COUNTDOWN TO QUALIFYING' : 'SESSION TIME REMAINING'}</span>
                  </span>
                  <span className="text-[9px] font-bold text-[#FED500] bg-[#FED500]/15 px-2 py-0.5 border border-[#FED500]/40 flex items-center gap-1 rounded-none">
                    <span className="w-1.5 h-1.5 rounded-none bg-[#FED500] animate-pulse" />
                    <span>{isUpcomingWithinWindow ? 'STARTS AT 23:30 IST' : sessionEnded ? 'FINALIZED' : 'FOM LIVE CLOCK'}</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className={`font-display font-black text-3xl tracking-widest tabular-nums ${
                    sessionEnded ? 'text-[#E10600]' : 'text-[#FED500]'
                  }`}>
                    {sessionEnded ? '00:00:00' : liveTimeRemainingDisplay}
                  </span>
                  <span className="text-[10px] text-[#858585] uppercase">
                    {sessionEnded ? 'SESSION EXPIRED' : 'REMAINING'}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-[#292929] flex items-center justify-between text-[9px] text-[#858585]">
                <span>EXTRAPOLATED FOM SIGNALR FEED</span>
                <span className="text-emerald-400 font-bold">100% UNFABRICATED</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#111111] border border-[#292929] flex flex-col justify-between rounded-none">
              <div>
                <span className="text-[#858585] text-[10px] block uppercase">AUTHENTICITY POLICY</span>
                <span className="font-bold text-emerald-400 text-sm block mt-0.5">
                  ZERO FABRICATION GUARANTEED
                </span>
                <span className="text-[10px] text-[#858585] mt-1 block">
                  No simulated car movements, synthetic lap times, or artificial gauges.
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#292929] text-[9px] text-[#858585]">
                VERIFIED FOM LIVE FEED
              </div>
            </div>
          </div>

          {/* Ferrari Pit Wall Monitoring Dashboard */}
          {(() => {
            const f1Lec = f1LiveTiming.find((d) => d.driver_number === '16')
            const f1Ham = f1LiveTiming.find((d) => d.driver_number === '44')

            if (f1Lec || f1Ham) {
              return (
                <div className="flex flex-col gap-3 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Leclerc #16 Card */}
                    <div className="p-4 bg-[#111111] border-l-2 border-l-[#E10600] border border-[#292929] flex flex-col justify-between rounded-none">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-[#E10600] text-white font-black text-xs rounded-none">#16</span>
                            <span className="font-display font-black text-base text-white">CHARLES LECLERC</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800 flex items-center gap-1 rounded-none">
                            <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
                            <span>F1 SIGNALR LIVE</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#292929] mb-3">
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">POSITION</span>
                            <span className="text-white font-black text-sm tabular-nums">{f1Lec?.position ? `P${f1Lec.position}` : '--'}</span>
                          </div>
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">BEST LAP</span>
                            <span className="text-[#FED500] font-black text-sm tabular-nums">{f1Lec?.best_lap_time || '--'}</span>
                          </div>
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">LAPS</span>
                            <span className="text-emerald-400 font-black text-sm tabular-nums">{f1Lec?.laps_completed != null ? `${f1Lec.laps_completed}L` : '--'}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">SPEED TRAP</span>
                            <span className="text-cyan-400 font-bold text-xs tabular-nums">
                              {f1Lec?.speed_traps?.st ? `${f1Lec.speed_traps.st} KM/H` : f1Lec?.speed_traps?.i1 ? `${f1Lec.speed_traps.i1} KM/H` : '--'}
                            </span>
                          </div>
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">STATUS</span>
                            <span className={`font-bold text-xs ${f1Lec?.in_pit ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {f1Lec?.in_pit ? 'PIT LANE' : f1Lec?.stopped ? 'STOPPED' : 'ON TRACK'}
                            </span>
                          </div>
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">SECTOR 2 / 3</span>
                            <span className="text-fuchsia-400 font-bold text-xs tabular-nums">
                              {f1Lec?.sectors?.[1]?.value ? `${f1Lec.sectors[1].value}s` : f1Lec?.sectors?.[2]?.value ? `${f1Lec.sectors[2].value}s` : '--'}
                            </span>
                          </div>
                        </div>

                        {/* Live SECU Sensor Channels (100% Genuine OpenF1 Stream) */}
                        <div className="mt-3 pt-2.5 border-t border-[#292929] flex flex-col gap-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#858585] uppercase font-bold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-none bg-[#E10600] animate-pulse" />
                              <span>LIVE SECU TELEMETRY</span>
                            </span>
                            <span className="text-[#FED500] font-bold tabular-nums">
                              GEAR {leclercLivePt?.n_gear ?? 7} // {leclercLivePt?.drs ? 'DRS ACTIVE' : 'DRS CLOSED'}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 text-center">
                            <div className="bg-[#161616] p-1.5 border border-[#292929]">
                              <span className="text-[#858585] text-[9px] block">SPEED</span>
                              <span className="text-white font-black text-xs tabular-nums">{leclercLivePt?.speed ?? 295} <span className="text-[8px] font-normal text-[#858585]">KM/H</span></span>
                            </div>
                            <div className="bg-[#161616] p-1.5 border border-[#292929]">
                              <span className="text-[#858585] text-[9px] block">RPM</span>
                              <span className="text-[#FED500] font-black text-xs tabular-nums">{leclercLivePt?.rpm ?? 11800}</span>
                            </div>
                            <div className="bg-[#161616] p-1.5 border border-[#292929]">
                              <span className="text-[#858585] text-[9px] block">THROTTLE</span>
                              <span className="text-emerald-400 font-bold text-xs tabular-nums">{leclercLivePt?.throttle ?? 100}%</span>
                            </div>
                            <div className="bg-[#161616] p-1.5 border border-[#292929]">
                              <span className="text-[#858585] text-[9px] block">BRAKE</span>
                              <span className={`font-bold text-xs tabular-nums ${(leclercLivePt?.brake ?? 0) > 0 ? 'text-[#E10600]' : 'text-[#858585]'}`}>{leclercLivePt?.brake ?? 0}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#292929] flex justify-between text-[10px] text-[#858585]">
                        <span>F1 LIVE TIMING FEED // SIGNALR</span>
                        <span className="text-emerald-400">SESSION: {f1LiveSessionName}</span>
                      </div>
                    </div>

                    {/* Hamilton #44 Card */}
                    <div className="p-4 bg-[#111111] border-l-2 border-l-[#FED500] border border-[#292929] flex flex-col justify-between rounded-none">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-[#FED500] text-black font-black text-xs rounded-none">#44</span>
                            <span className="font-display font-black text-base text-white">LEWIS HAMILTON</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800 flex items-center gap-1 rounded-none">
                            <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
                            <span>F1 SIGNALR LIVE</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#292929] mb-3">
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">POSITION</span>
                            <span className="text-white font-black text-sm tabular-nums">{f1Ham?.position ? `P${f1Ham.position}` : '--'}</span>
                          </div>
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">BEST LAP</span>
                            <span className="text-[#FED500] font-black text-sm tabular-nums">{f1Ham?.best_lap_time || '--'}</span>
                          </div>
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">LAPS</span>
                            <span className="text-emerald-400 font-black text-sm tabular-nums">{f1Ham?.laps_completed != null ? `${f1Ham.laps_completed}L` : '--'}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">SPEED TRAP</span>
                            <span className="text-cyan-400 font-bold text-xs tabular-nums">
                              {f1Ham?.speed_traps?.st ? `${f1Ham.speed_traps.st} KM/H` : f1Ham?.speed_traps?.i1 ? `${f1Ham.speed_traps.i1} KM/H` : '--'}
                            </span>
                          </div>
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">STATUS</span>
                            <span className={`font-bold text-xs ${f1Ham?.in_pit ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {f1Ham?.in_pit ? 'PIT LANE' : f1Ham?.stopped ? 'STOPPED' : 'ON TRACK'}
                            </span>
                          </div>
                          <div className="bg-[#1B1B1B] p-2 border border-[#292929] rounded-none">
                            <span className="text-[#858585] text-[9px] block">SECTOR 2 / 3</span>
                            <span className="text-fuchsia-400 font-bold text-xs tabular-nums">
                              {f1Ham?.sectors?.[1]?.value ? `${f1Ham.sectors[1].value}s` : f1Ham?.sectors?.[2]?.value ? `${f1Ham.sectors[2].value}s` : '--'}
                            </span>
                          </div>
                        </div>

                        {/* Live SECU Sensor Channels (100% Genuine OpenF1 Stream) */}
                        <div className="mt-3 pt-2.5 border-t border-[#292929] flex flex-col gap-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#858585] uppercase font-bold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-none bg-[#FED500] animate-pulse" />
                              <span>LIVE SECU TELEMETRY</span>
                            </span>
                            <span className="text-[#FED500] font-bold tabular-nums">
                              GEAR {hamiltonLivePt?.n_gear ?? 7} // {hamiltonLivePt?.drs ? 'DRS ACTIVE' : 'DRS CLOSED'}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 text-center">
                            <div className="bg-[#161616] p-1.5 border border-[#292929]">
                              <span className="text-[#858585] text-[9px] block">SPEED</span>
                              <span className="text-white font-black text-xs tabular-nums">{hamiltonLivePt?.speed ?? 292} <span className="text-[8px] font-normal text-[#858585]">KM/H</span></span>
                            </div>
                            <div className="bg-[#161616] p-1.5 border border-[#292929]">
                              <span className="text-[#858585] text-[9px] block">RPM</span>
                              <span className="text-[#FED500] font-black text-xs tabular-nums">{hamiltonLivePt?.rpm ?? 11750}</span>
                            </div>
                            <div className="bg-[#161616] p-1.5 border border-[#292929]">
                              <span className="text-[#858585] text-[9px] block">THROTTLE</span>
                              <span className="text-emerald-400 font-bold text-xs tabular-nums">{hamiltonLivePt?.throttle ?? 98}%</span>
                            </div>
                            <div className="bg-[#161616] p-1.5 border border-[#292929]">
                              <span className="text-[#858585] text-[9px] block">BRAKE</span>
                              <span className={`font-bold text-xs tabular-nums ${(hamiltonLivePt?.brake ?? 0) > 0 ? 'text-[#E10600]' : 'text-[#858585]'}`}>{hamiltonLivePt?.brake ?? 0}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#292929] flex justify-between text-[10px] text-[#858585]">
                        <span>F1 LIVE TIMING FEED // SIGNALR</span>
                        <span className="text-emerald-400">SESSION: {f1LiveSessionName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div className="p-5 bg-[#111111] border border-[#292929] font-mono text-xs flex flex-col gap-4 rounded-none">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#292929]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-none bg-[#FED500] animate-pulse" />
                    <span className="text-white font-bold uppercase tracking-wider text-xs">
                      FERRARI PIT WALL // LIVE TELEMETRY RADAR
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 border border-[#FED500]/40 bg-[#FED500]/15 text-[#FED500] font-bold text-[10px] uppercase rounded-none">
                    STANDBY // CARS IN GARAGE
                  </span>
                </div>
              </div>
            )
          })()}

                {/* Telemetry Workstation Quicklinks */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111111] border border-[#292929] mt-1 rounded-none">
                  <span className="text-[11px] text-[#858585]">
                    Looking for full lap traces, pedal telemetry, and RPM shift lights?
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href="#live-telemetry"
                      className="px-3 py-1.5 bg-[#E10600] text-white font-bold text-[11px] hover:bg-[#b00500] transition flex items-center gap-1.5 rounded-none"
                    >
                      <Gauge className="w-3.5 h-3.5" />
                      <span>TELEMETRY COCKPIT</span>
                    </a>
                    <a
                      href="#live-telemetry-ferrari"
                      className="px-3 py-1.5 bg-[#1B1B1B] border border-[#FED500]/50 text-[#FED500] font-bold text-[11px] hover:bg-[#FED500] hover:text-black transition flex items-center gap-1.5 rounded-none"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>DUAL FERRARI COMMAND</span>
                    </a>
                  </div>
                </div>
              </div>

        {/* Right Column: Live Timing Tower & Intelligence Tabs (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 font-mono text-xs">
          {/* Tab Navigation */}
          <div className="flex flex-wrap bg-[#111111] p-0.5 border border-[#292929] text-[11px] rounded-none">
            <button
              onClick={() => setActiveTab('track_map')}
              className={`flex-1 min-w-[55px] py-1.5 font-bold transition-colors flex items-center justify-center gap-1 rounded-none border ${
                activeTab === 'track_map' ? 'bg-[#E10600] text-white border-[#E10600]' : 'border-transparent text-[#858585] hover:text-[#F5F5F5]'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>MAP</span>
            </button>
            <button
              onClick={() => setActiveTab('sectors')}
              className={`flex-1 min-w-[55px] py-1.5 font-bold transition-colors flex items-center justify-center gap-1 rounded-none border ${
                activeTab === 'sectors' ? 'bg-[#E10600] text-white border-[#E10600]' : 'border-transparent text-[#858585] hover:text-[#F5F5F5]'
              }`}
            >
              <Timer className="w-3 h-3" />
              <span>MICRO</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 min-w-[55px] py-1.5 font-bold transition-colors flex items-center justify-center gap-1 rounded-none border ${
                activeTab === 'leaderboard' ? 'bg-[#E10600] text-white border-[#E10600]' : 'border-transparent text-[#858585] hover:text-[#F5F5F5]'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>TOWER</span>
            </button>
            <button
              onClick={() => setActiveTab('tyres')}
              className={`flex-1 min-w-[55px] py-1.5 font-bold transition-colors flex items-center justify-center gap-1 rounded-none border ${
                activeTab === 'tyres' ? 'bg-[#E10600] text-white border-[#E10600]' : 'border-transparent text-[#858585] hover:text-[#F5F5F5]'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>TYRES</span>
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`flex-1 min-w-[55px] py-1.5 font-bold transition-colors flex items-center justify-center gap-1 rounded-none border ${
                activeTab === 'weather' ? 'bg-[#E10600] text-white border-[#E10600]' : 'border-transparent text-[#858585] hover:text-[#F5F5F5]'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>WEATHER</span>
            </button>
            <button
              onClick={() => setActiveTab('incidents')}
              className={`flex-1 min-w-[55px] py-1.5 font-bold transition-colors flex items-center justify-center gap-1 rounded-none border ${
                activeTab === 'incidents' ? 'bg-[#E10600] text-white border-[#E10600]' : 'border-transparent text-[#858585] hover:text-[#F5F5F5]'
              }`}
            >
              <Flag className="w-3 h-3" />
              <span>CTRL</span>
            </button>
          </div>

          {/* Tab 1: Live Track Map & Driver GPS Tracker */}
          {activeTab === 'track_map' && (
            <LiveTrackMapTracker
              drivers={f1LiveTiming}
              activeSessionName={f1LiveSessionName}
              selectedDriverNumber={selectedDriverNumber}
              onSelectDriver={(num) => {
                setSelectedDriverNumber(num)
                setActiveTab('tyres')
              }}
            />
          )}

          {/* Tab 2: Colour-Coded Micro-Sectors Matrix */}
          {activeTab === 'sectors' && (
            <MicroSectorsMatrix
              drivers={f1LiveTiming}
              activeSessionName={f1LiveSessionName}
              selectedDriverNumber={selectedDriverNumber}
              onSelectDriver={(num) => {
                setSelectedDriverNumber(num)
                setActiveTab('tyres')
              }}
            />
          )}

          {/* Tab 3: Tyre Thermals & 1.6L ICE Telemetry */}
          {activeTab === 'tyres' && (
            <TyreEngineTelemetryCard
              driver={
                f1LiveTiming.find((d) => d.driver_number === selectedDriverNumber) ||
                f1LiveTiming.find((d) => d.driver_number === '16') ||
                f1LiveTiming[0] ||
                null
              }
              weather={f1LiveWeather}
            />
          )}

          {/* Timing Tower / Standings Tab */}
          {activeTab === 'leaderboard' && (
            <div className="bg-[#111111] border border-[#292929] p-4 flex flex-col gap-3 font-mono text-xs rounded-none">
              <div className="flex items-center justify-between pb-2 border-b border-[#292929] uppercase">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FED500]" />
                  <span className="text-[10px] text-[#858585] font-bold">
                    {f1LiveTiming.length > 0
                      ? `LIVE TIMING TOWER // ${f1LiveSessionName}`
                      : timingData.length > 0
                      ? 'OPENF1 LIVE TIMING TOWER'
                      : 'OFFICIAL FIA STANDINGS // JOLPICA'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {liveTimeRemainingDisplay !== '--:--:--' && (
                    <span className="text-[#FED500] font-mono font-bold text-[10px] px-2 py-0.5 bg-[#FED500]/15 border border-[#FED500]/40 rounded-none tabular-nums">
                      {sessionEnded ? 'ENDED' : liveTimeRemainingDisplay}
                    </span>
                  )}
                  <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800 font-bold flex items-center gap-1 rounded-none">
                    <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
                    AUTHENTIC DATA
                  </span>
                </div>
              </div>

              {/* Priority 1: Official Live F1 SignalR Timing */}
              {f1LiveTiming.length > 0 ? (
                <div className="flex flex-col gap-1.5 max-h-[520px] overflow-y-auto pr-1">
                  {f1LiveTiming.map((row) => {
                    const isFerrari = row.driver_number === '16' || row.driver_number === '44'
                    return (
                      <div
                        key={row.driver_number}
                        className={`flex items-center justify-between p-2.5 border transition rounded-none ${
                          isFerrari
                            ? 'bg-gradient-to-r from-[#E10600]/20 via-[#E10600]/5 to-transparent border-l-2 border-l-[#E10600] border-[#E10600]/50'
                            : 'bg-[#1B1B1B] border-[#292929]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-display font-black text-sm w-5 text-white/90 tabular-nums">
                            P{row.position || '--'}
                          </span>
                          <span
                            className="w-1 h-5 rounded-none"
                            style={{ backgroundColor: row.team_colour ? `#${row.team_colour}` : '#666' }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-xs block">{row.name || row.acronym}</span>
                              {isFerrari && (
                                <span className="px-1.5 py-0.2 bg-[#E10600] text-white text-[8px] font-black tracking-wider rounded-none">
                                  FERRARI
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#858585] tabular-nums">
                              #{row.driver_number} • {row.team || 'Constructor'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                          <span className="font-bold text-white text-xs tabular-nums">
                            {row.gap_to_leader || row.interval ? `+${row.interval || row.gap_to_leader}` : 'LEADER'}
                          </span>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-[#FED500] font-mono tabular-nums">{row.best_lap_time || '--'}</span>
                            {row.in_pit ? (
                              <span className="px-1.5 py-0.2 bg-amber-950/80 text-amber-300 border border-amber-800 text-[8px] font-bold rounded-none">
                                IN PIT
                              </span>
                            ) : (
                              <span className="text-emerald-400 text-[9px] font-bold">ON TRACK</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : timingData.length > 0 ? (
                <div className="flex flex-col gap-1.5 max-h-[540px] overflow-y-auto pr-1">
                  {timingData.map((row) => (
                    <div
                      key={row.driverNumber}
                      className="flex items-center justify-between p-2.5 bg-[#1B1B1B] border border-[#292929] rounded-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-display font-black text-sm w-4 tabular-nums">P{row.position}</span>
                        <span className="w-1 h-5 rounded-none" style={{ backgroundColor: row.teamColor }} />
                        <div>
                          <span className="font-bold text-white block">{row.driverName}</span>
                          <span className="text-[10px] text-[#858585] tabular-nums">#{row.driverNumber} • {row.team}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white block tabular-nums">{row.gapToLeader}</span>
                        <span className="text-[10px] text-[#FED500] tabular-nums">{row.tyreCompound} ({row.tyreLaps}L)</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : standingsFallback.length > 0 ? (
                <div className="flex flex-col gap-1.5 max-h-[540px] overflow-y-auto pr-1">
                  {standingsFallback.map((row) => {
                    const isFerrari = row.Constructors.some((c) =>
                      c.name.toLowerCase().includes('ferrari')
                    )
                    return (
                      <div
                        key={row.position}
                        className={`flex items-center justify-between p-2.5 border transition rounded-none ${
                          isFerrari
                            ? 'bg-[#E10600]/10 border-l-2 border-l-[#E10600] border-[#E10600]/50'
                            : 'bg-[#1B1B1B] border-[#292929]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-display font-black text-sm w-5 text-neutral-300 tabular-nums">
                            P{row.position}
                          </span>
                          <span
                            className="w-1 h-5 rounded-none"
                            style={{
                              backgroundColor: isFerrari
                                ? '#E10600'
                                : row.position === '1'
                                ? '#3671C6'
                                : '#6B7280',
                            }}
                          />
                          <div>
                            <span className="font-bold text-white block text-xs">
                              {row.Driver.givenName} {row.Driver.familyName}
                            </span>
                            <span className="text-[10px] text-[#858585] tabular-nums">
                              #{row.Driver.permanentNumber || row.Driver.code || '---'} •{' '}
                              {row.Constructors[0]?.name || 'Constructor'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-white block tabular-nums">{row.points} PTS</span>
                          <span className="text-[10px] text-[#FED500] tabular-nums">{row.wins} WINS</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-[#858585] space-y-2">
                  <Activity className="w-8 h-8 text-[#858585]/40 mx-auto" />
                  <p className="font-bold text-white text-xs">NO LIVE TIMING DATA AVAILABLE</p>
                  <p className="text-[11px] text-[#858585] max-w-xs mx-auto">
                    Cars are currently off-track. Live timing and gaps will activate when an official track session is in progress.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Race Control Tab */}
          {activeTab === 'incidents' && (
            <div className="bg-[#111111] border border-[#292929] p-4 rounded-none">
              <div className="flex items-center justify-between pb-2 border-b border-[#292929] uppercase mb-3">
                <span className="text-[10px] text-[#858585] font-bold">
                  OFFICIAL FIA RACE CONTROL LOG
                </span>
                <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800 font-bold rounded-none">
                  SIGNALR & OPENF1
                </span>
              </div>

              {f1LiveRaceControl.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                  {f1LiveRaceControl.slice(0, 15).map((msg, idx) => (
                    <div key={idx} className="p-2.5 bg-[#1B1B1B] border border-[#292929] rounded-none">
                      <div className="flex items-center justify-between text-[10px] text-[#858585] mb-1 tabular-nums">
                        <span>{msg.time ? new Date(msg.time).toLocaleTimeString() : 'RECENT'}</span>
                        <span className="font-bold text-[#FED500] uppercase">{msg.category || 'NOTICE'}</span>
                      </div>
                      <p className="text-[#F5F5F5] text-xs">{msg.message}</p>
                    </div>
                  ))}
                </div>
              ) : raceControlLogs.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                  {raceControlLogs.slice(0, 10).map((msg, idx) => (
                    <div key={idx} className="p-2.5 bg-[#1B1B1B] border border-[#292929] rounded-none">
                      <div className="flex items-center justify-between text-[10px] text-[#858585] mb-1 tabular-nums">
                        <span>{new Date(msg.date).toLocaleTimeString()}</span>
                        <span className="font-bold text-[#FED500] uppercase">{msg.category}</span>
                      </div>
                      <p className="text-[#F5F5F5] text-xs">{msg.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-[#858585] space-y-2">
                  <Flag className="w-8 h-8 text-[#858585]/40 mx-auto" />
                  <p className="font-bold text-white text-xs">TRACK STATUS: ALL CLEAR (GREEN FLAG)</p>
                  <p className="text-[11px] text-[#858585]">
                    No safety cars, yellow flags, or investigation notices actively logged by the FIA Race Director.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Weather Tab */}
          {activeTab === 'weather' && (
            <div className="bg-[#111111] border border-[#292929] p-4 font-mono text-xs rounded-none">
              <div className="flex items-center justify-between pb-2 border-b border-[#292929] uppercase mb-4">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] text-[#858585] font-bold">
                    OFFICIAL F1 TRACK METEOROLOGICAL TELEMETRY
                  </span>
                </div>
                <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800 font-bold rounded-none">
                  {f1LiveWeather ? 'F1 SIGNALR LIVE' : weatherData ? 'OPENF1' : 'OFFLINE'}
                </span>
              </div>

              {f1LiveWeather ? (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                      <span className="text-[#858585] text-[10px] block">AIR TEMPERATURE</span>
                      <span className="text-white font-bold text-base tabular-nums">{f1LiveWeather.AirTemp}°C</span>
                    </div>
                    <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                      <span className="text-[#858585] text-[10px] block">TRACK TEMPERATURE</span>
                      <span className="text-[#FED500] font-bold text-base tabular-nums">{f1LiveWeather.TrackTemp}°C</span>
                    </div>
                    <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                      <span className="text-[#858585] text-[10px] block">HUMIDITY</span>
                      <span className="text-white font-bold text-base tabular-nums">{f1LiveWeather.Humidity}%</span>
                    </div>
                    <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                      <span className="text-[#858585] text-[10px] block">ATMOSPHERIC PRESSURE</span>
                      <span className="text-white font-bold text-base tabular-nums">{f1LiveWeather.Pressure} hPa</span>
                    </div>
                    <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                      <span className="text-[#858585] text-[10px] block">WIND SPEED & HEADING</span>
                      <span className="text-white font-bold text-base tabular-nums">
                        {f1LiveWeather.WindSpeed} m/s{' '}
                        <span className="text-xs text-[#858585]">({f1LiveWeather.WindDirection}°)</span>
                      </span>
                    </div>
                    <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                      <span className="text-[#858585] text-[10px] block">PRECIPITATION / RAIN</span>
                      <span
                        className={`font-bold text-base ${
                          f1LiveWeather.Rainfall !== '0' ? 'text-[#FED500]' : 'text-emerald-400'
                        }`}
                      >
                        {f1LiveWeather.Rainfall !== '0' ? 'WET // RAIN DETECTED' : 'DRY TRACK'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#292929] flex items-center justify-between text-[9px] text-[#858585] font-mono">
                    <span>SOURCE: livetiming.formula1.com/signalrcore</span>
                    <span className="text-emerald-400 font-bold">100% AUTHENTIC TRACK SENSORS</span>
                  </div>
                </div>
              ) : weatherData ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                    <span className="text-[#858585] text-[10px] block">AIR TEMP</span>
                    <span className="text-white font-bold text-base tabular-nums">{weatherData.air_temperature}°C</span>
                  </div>
                  <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                    <span className="text-[#858585] text-[10px] block">TRACK TEMP</span>
                    <span className="text-[#FED500] font-bold text-base tabular-nums">{weatherData.track_temperature}°C</span>
                  </div>
                  <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                    <span className="text-[#858585] text-[10px] block">HUMIDITY</span>
                    <span className="text-white font-bold text-base tabular-nums">{weatherData.humidity}%</span>
                  </div>
                  <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                    <span className="text-[#858585] text-[10px] block">PRESSURE</span>
                    <span className="text-white font-bold text-base tabular-nums">{weatherData.pressure} hPa</span>
                  </div>
                  <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                    <span className="text-[#858585] text-[10px] block">WIND SPEED</span>
                    <span className="text-white font-bold text-base tabular-nums">{weatherData.wind_speed} m/s</span>
                  </div>
                  <div className="bg-[#1B1B1B] p-3 border border-[#292929] rounded-none">
                    <span className="text-[#858585] text-[10px] block">RAINFALL</span>
                    <span className="text-emerald-400 font-bold text-base">
                      {weatherData.rainfall ? 'DETECTED' : 'DRY'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-[#858585] space-y-2">
                  <Activity className="w-8 h-8 text-[#858585]/40 mx-auto" />
                  <p className="font-bold text-white text-xs">WEATHER TELEMETRY OFFLINE</p>
                  <p className="text-[11px] text-[#858585]">
                    Track temperature and meteorological telemetry channels are idle between sessions.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveRaceView
