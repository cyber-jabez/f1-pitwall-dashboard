import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  f1LiveApiClient,
  type F1LiveDriverTiming,
  type F1LiveWeather,
  type F1LiveStatus,
  type F1LiveClock,
  type F1LiveTeamRadioMessage,
  type F1LiveNextSession,
} from '../../services/f1LiveApiClient'
import {
  streamingProviderService,
  type StreamProvider,
} from '../../services/streamingProviderService'
import { createProvenance } from '../../services/dataProvenance'
import { LiveRaceVideoPlayer } from '../video/LiveRaceVideoPlayer'
import { TyreEngineTelemetryCard } from '../telemetry/TyreEngineTelemetryCard'
import { MicroSectorsMatrix } from '../telemetry/MicroSectorsMatrix'
import { TelemetryDelayController } from '../telemetry/TelemetryDelayController'
import { WeatherRadarCard } from '../telemetry/WeatherRadarCard'
import { RaceControlMessagesCard } from '../telemetry/RaceControlMessagesCard'
import { telemetryDelayService } from '../../services/telemetryDelayService'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import ShinyText from '../reactbits/ShinyText'
import {
  Tv,
  Radio,
  Activity,
  Flame,
  Gauge,
  Compass,
  Flag,
  AlertTriangle,
  RefreshCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronDown,
  Play,
  Pause,
  Clock,
  Layers,
  Shield,
  Zap,
  Sliders,
  Filter,
  CheckCircle2,
  Search,
} from 'lucide-react'

// Official FIA session formats supported with adaptive layouts
export type PitWallSessionFormat =
  | 'AUTO'
  | 'RACE'
  | 'QUALIFYING'
  | 'PRACTICE'
  | 'SPRINT'
  | 'SPRINT_QUALIFYING'

export type ViewLayoutMode =
  | 'SPLIT' // Big Video & Comms left (7 cols) + Tower right (5 cols)
  | 'CINEMA' // Full-width Big Video (12 cols) across top + Telemetry below
  | 'TOWER_FOCUS' // Leaderboard expanded across full width
  | 'COCKPIT_HUD' // Selected Driver full telemetry + video + radio

export const PitWallCommandView: React.FC = () => {
  // Session Format & View Layout State
  const [selectedFormat, setSelectedFormat] = useState<PitWallSessionFormat>('AUTO')
  const [layoutMode, setLayoutMode] = useState<ViewLayoutMode>('SPLIT')
  const [videoMode, setVideoMode] = useState<'big' | 'theater'>('big')
  const [selectedDriverNumber, setSelectedDriverNumber] = useState<string>('16') // Default Charles Leclerc
  const [filterQuery, setFilterQuery] = useState<string>('')
  const [ferrariOnlyFilter, setFerrariOnlyFilter] = useState<boolean>(false)

  // Real-time F1 SignalR Data
  const [status, setStatus] = useState<F1LiveStatus | null>(null)
  const [nextSession, setNextSession] = useState<F1LiveNextSession | null>(null)
  const [timingDrivers, setTimingDrivers] = useState<F1LiveDriverTiming[]>([])
  const [weather, setWeather] = useState<F1LiveWeather | null>(null)
  const [clock, setClock] = useState<F1LiveClock | null>(null)
  const [remainingTimeDisplay, setRemainingTimeDisplay] = useState<string>('--:--:--')
  const [raceControlLogs, setRaceControlLogs] = useState<Array<{
    time: string
    category: string
    message: string
    flag?: string
    scope?: string
  }>>([])
  const [radioMessages, setRadioMessages] = useState<F1LiveTeamRadioMessage[]>([])
  const [activeRadioAudio, setActiveRadioAudio] = useState<{
    url: string
    driverNumber: string | null
    name: string | null
  } | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [lastHeartbeat, setLastHeartbeat] = useState<Date>(new Date())

  // Streaming Video Provider
  const [activeStreamProvider, setActiveStreamProvider] = useState<StreamProvider | null>(null)
  const [backupStreamProvider, setBackupStreamProvider] = useState<StreamProvider | null>(null)
  const [sessionName, setSessionName] = useState<string>('Practice 3')

  // Audio element reference for real FOM radio stream
  const radioAudioRef = useRef<HTMLAudioElement | null>(null)

  // 1. Initial Load & Streaming Provider Sync
  useEffect(() => {
    setActiveStreamProvider(streamingProviderService.getActiveProvider())
    setBackupStreamProvider(streamingProviderService.getBackupProvider())
    setSessionName(streamingProviderService.getCurrentSession())
  }, [])

  // 2. Poll F1 Live Timing Daemon every 1 second
  useEffect(() => {
    let isMounted = true

    const fetchLiveTelemetry = async () => {
      try {
        const [stat, timing, wx, rc, radio, nextSess] = await Promise.all([
          f1LiveApiClient.getStatus(),
          f1LiveApiClient.getTiming(),
          f1LiveApiClient.getWeather(),
          f1LiveApiClient.getRaceControl(),
          f1LiveApiClient.getTeamRadio(),
          f1LiveApiClient.getNextSession(),
        ])

        if (!isMounted) return

        // Push into historical telemetry buffer for video broadcast sync
        if (timing?.drivers && timing.drivers.length > 0) {
          telemetryDelayService.pushSnapshot({
            timingDrivers: timing.drivers,
            status: stat,
            weather: wx,
            clock: stat?.clock || null,
            raceControl: rc || [],
            radioMessages: radio?.messages || [],
            nextSession: nextSess,
            sessionName: stat?.session?.name || timing.session || 'Practice 3',
          })
        }

        // Only update UI immediately if delay is 0s (Live Instantaneous Mode)
        if (telemetryDelayService.getDelay() === 0) {
          if (stat) {
            setStatus(stat)
            if (stat.clock) setClock(stat.clock)
            if (stat.session?.name) setSessionName(stat.session.name)
          }
          if (nextSess) {
            setNextSession(nextSess)
          }
          if (timing?.drivers && timing.drivers.length > 0) {
            setTimingDrivers(timing.drivers)
          }
          if (wx) setWeather(wx)
          if (rc) setRaceControlLogs(rc)
          if (radio?.messages && radio.messages.length > 0) {
            setRadioMessages(radio.messages)
          }
        }

        setLastHeartbeat(new Date())
        setIsLoading(false)
      } catch (err) {
        console.warn('[PitWallCommandView] Telemetry sync error:', err)
        if (isMounted) setIsLoading(false)
      }
    }

    fetchLiveTelemetry()
    const interval = setInterval(fetchLiveTelemetry, 1000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  // 2b. Delayed Telemetry Playback Resolver (Smoothly replays buffered telemetry when delay > 0)
  useEffect(() => {
    const applyDelayedTelemetry = () => {
      const delay = telemetryDelayService.getDelay()
      if (delay > 0) {
        const res = telemetryDelayService.getSnapshotAtDelay(delay)
        if (res.snapshot) {
          setTimingDrivers(res.snapshot.timingDrivers)
          if (res.snapshot.weather) setWeather(res.snapshot.weather)
          if (res.snapshot.clock) setClock(res.snapshot.clock)
          if (res.snapshot.raceControl) setRaceControlLogs(res.snapshot.raceControl)
          if (res.snapshot.radioMessages) setRadioMessages(res.snapshot.radioMessages)
          if (res.snapshot.status) setStatus(res.snapshot.status)
        }
      }
    }

    const interval = setInterval(applyDelayedTelemetry, 500)
    const unsubscribe = telemetryDelayService.subscribe(() => {
      applyDelayedTelemetry()
    })

    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, [])

  // Intelligent Pre-Session Transition Engine
  // Automatically switches to the upcoming session format if:
  // 1. Previous session is Finalised (e.g. Practice 3 completed), OR
  // 2. We are within 105 minutes of upcoming start (e.g. at least by 10:00 PM IST for 11:30 PM IST Qualifying, "like this for all sessions")
  const isCurrentFinalised = status?.session?.status === 'Finalised'
  const isUpcomingWithinWindow = Boolean(
    nextSession &&
    (isCurrentFinalised || (nextSession.minutes_away !== undefined && nextSession.minutes_away <= 105))
  )

  // 3. Extrapolate session countdown timer
  useEffect(() => {
    // If upcoming session is within pre-session window, count down to its green light
    if (isUpcomingWithinWindow && nextSession?.session_time) {
      const targetMs = new Date(nextSession.session_time).getTime()
      const updateUpcomingCountdown = () => {
        const diffSeconds = Math.max(0, Math.floor((targetMs - Date.now()) / 1000))
        const h = String(Math.floor(diffSeconds / 3600)).padStart(2, '0')
        const m = String(Math.floor((diffSeconds % 3600) / 60)).padStart(2, '0')
        const s = String(diffSeconds % 60).padStart(2, '0')
        setRemainingTimeDisplay(`${h}:${m}:${s}`)
      }

      updateUpcomingCountdown()
      const timer = setInterval(updateUpcomingCountdown, 1000)
      return () => clearInterval(timer)
    }

    // Otherwise, extrapolate live on-track session clock
    if (!clock?.remaining) return

    const match = clock.remaining.match(/^(\d{2}):(\d{2}):(\d{2})$/)
    if (!match) {
      setRemainingTimeDisplay(clock.remaining)
      return
    }

    let totalSeconds =
      parseInt(match[1], 10) * 3600 +
      parseInt(match[2], 10) * 60 +
      parseInt(match[3], 10)

    const timer = setInterval(() => {
      if (clock.extrapolating && totalSeconds > 0) {
        totalSeconds -= 1
      }
      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
      const s = String(totalSeconds % 60).padStart(2, '0')
      setRemainingTimeDisplay(`${h}:${m}:${s}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [isUpcomingWithinWindow, nextSession?.session_time, clock?.remaining, clock?.extrapolating])

  // 4. Derive effective session format (Auto detect or user forced)
  const effectiveSessionFormat: 'RACE' | 'QUALIFYING' | 'PRACTICE' | 'SPRINT' | 'SPRINT_QUALIFYING' =
    useMemo(() => {
      if (selectedFormat !== 'AUTO') return selectedFormat

      // Automatic pre-session transition: map upcoming session
      if (isUpcomingWithinWindow && nextSession?.session) {
        const nextKey = nextSession.session.toLowerCase()
        if (nextKey === 'qualifying') return 'QUALIFYING'
        if (nextKey === 'race') return 'RACE'
        if (nextKey === 'sprint') return 'SPRINT'
        if (nextKey === 'sprint_qualifying' || nextKey.includes('shootout')) return 'SPRINT_QUALIFYING'
        if (nextKey.startsWith('fp') || nextKey.includes('practice')) return 'PRACTICE'
      }

      const rawName = (status?.session?.name || sessionName || '').toLowerCase()
      const rawType = (status?.session?.type || '').toLowerCase()

      if (rawName.includes('sprint shootout') || rawName.includes('sprint qual')) {
        return 'SPRINT_QUALIFYING'
      }
      if (rawName.includes('sprint') && !rawName.includes('qual')) {
        return 'SPRINT'
      }
      if (rawName.includes('qualifying') || rawType.includes('qual')) {
        return 'QUALIFYING'
      }
      if (rawName.includes('practice') || rawType.includes('practice') || rawName.includes('fp')) {
        return 'PRACTICE'
      }
      if (rawName.includes('race') || rawName.includes('grand prix')) {
        return 'RACE'
      }
      return 'QUALIFYING' // Sensible default when upcoming is active
    }, [selectedFormat, isUpcomingWithinWindow, nextSession?.session, status?.session?.name, status?.session?.type, sessionName])

  // Human-readable session display name
  const effectiveSessionDisplayName = useMemo(() => {
    if (isUpcomingWithinWindow && nextSession) {
      const sessTitle =
        nextSession.session === 'qualifying'
          ? 'Qualifying'
          : nextSession.session === 'race'
          ? 'Grand Prix Race'
          : nextSession.session === 'sprint'
          ? 'Sprint (100km)'
          : nextSession.session === 'sprint_qualifying'
          ? 'Sprint Qualifying'
          : nextSession.session.toUpperCase()

      return `${sessTitle} (Starts at 11:30 PM IST)`
    }
    return status?.session?.name || sessionName || 'Qualifying'
  }, [isUpcomingWithinWindow, nextSession, status?.session?.name, sessionName])

  // Handle Radio MP3 playback
  const handlePlayRadio = (msg: F1LiveTeamRadioMessage) => {
    if (!msg.audio_url) return

    if (activeRadioAudio?.url === msg.audio_url && isAudioPlaying) {
      // Toggle pause
      radioAudioRef.current?.pause()
      setIsAudioPlaying(false)
      return
    }

    setActiveRadioAudio({
      url: msg.audio_url,
      driverNumber: msg.driver_number,
      name: msg.name,
    })

    if (radioAudioRef.current) {
      radioAudioRef.current.src = msg.audio_url
      radioAudioRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch((e) => console.warn('Radio audio autoplay blocked:', e))
    }
  }

  // Selected driver object from leaderboard
  const selectedDriver = useMemo(() => {
    return (
      timingDrivers.find((d) => d.driver_number === selectedDriverNumber) ||
      timingDrivers[0] ||
      null
    )
  }, [timingDrivers, selectedDriverNumber])

  // Filtered leaderboard drivers
  const displayedDrivers = useMemo(() => {
    let list = [...timingDrivers]
    if (ferrariOnlyFilter) {
      list = list.filter((d) => d.team?.toLowerCase().includes('ferrari'))
    }
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim()
      list = list.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.acronym?.toLowerCase().includes(q) ||
          d.team?.toLowerCase().includes(q) ||
          d.driver_number.includes(q)
      )
    }
    return list
  }, [timingDrivers, ferrariOnlyFilter, filterQuery])

  // Track Status Color Helper
  const trackStatusCode = status?.track_status?.status || '1'
  const trackStatusMessage = status?.track_status?.message || 'Track Clear'

  const trackStatusBadge = useMemo(() => {
    if (isUpcomingWithinWindow) {
      return {
        bg: 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold animate-pulse',
        label: `UPCOMING // ${effectiveSessionFormat} GREEN LIGHT AT 11:30 PM IST (23:30 IST) • PADDOCK PREPARATION`,
      }
    }
    switch (trackStatusCode) {
      case '1':
        return { bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400', label: 'GREEN FLAG // TRACK ALL CLEAR' }
      case '2':
        return { bg: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400 animate-pulse', label: 'YELLOW FLAG // HAZARD ON TRACK' }
      case '4':
        return { bg: 'bg-amber-500/20 border-amber-500/60 text-amber-300 animate-pulse', label: 'SAFETY CAR DEPLOYED (SC)' }
      case '5':
        return { bg: 'bg-red-500/20 border-red-500/60 text-red-400 animate-pulse', label: 'RED FLAG // SESSION SUSPENDED' }
      case '6':
        return { bg: 'bg-amber-500/20 border-amber-500/50 text-amber-400 animate-pulse', label: 'VIRTUAL SAFETY CAR (VSC)' }
      case '7':
        return { bg: 'bg-neutral-800 border-white/20 text-white', label: 'CHEQUERED FLAG // SESSION COMPLETED' }
      default:
        return { bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400', label: trackStatusMessage }
    }
  }, [trackStatusCode, trackStatusMessage])

  // Sector status badge helper
  const renderSectorTime = (sector: { value: string | null; personal_best: boolean; overall_best: boolean }) => {
    if (!sector?.value) return <span className="text-white/20">--.---</span>
    let colorClass = 'text-white/80'
    if (sector.overall_best) colorClass = 'text-[#D070FF] font-bold drop-shadow-[0_0_8px_rgba(208,112,255,0.6)]'
    else if (sector.personal_best) colorClass = 'text-emerald-400 font-bold'
    else colorClass = 'text-yellow-400/90 font-medium'

    return <span className={colorClass}>{sector.value}</span>
  }

  // Tyre badge helper
  const renderTyreBadge = (compound: string | null | undefined, laps: number | null | undefined, isNew?: boolean | string | null) => {
    if (!compound) return <span className="text-white/30 text-[10px]">--</span>
    const c = compound.toUpperCase()
    let bg = 'bg-neutral-700 text-white border-neutral-600'
    let letter = c[0] || '?'
    if (c.includes('SOFT')) bg = 'bg-red-600/20 text-red-400 border-red-500/60'
    else if (c.includes('MEDIUM')) bg = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/60'
    else if (c.includes('HARD')) bg = 'bg-neutral-100/10 text-white border-neutral-300/60'
    else if (c.includes('INTER')) bg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/60'
    else if (c.includes('WET')) bg = 'bg-blue-500/20 text-blue-400 border-blue-500/60'

    return (
      <div className="flex items-center gap-1">
        <span className={`w-5 h-5 rounded-full border text-[10px] font-black flex items-center justify-center ${bg}`}>
          {letter}
        </span>
        <span className="text-[10px] font-mono text-white/70">
          {laps !== null && laps !== undefined ? `${laps}L` : ''}
        </span>
        {isNew === true && (
          <span className="text-[8px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-400 uppercase">
            N
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#06080D] text-white flex flex-col font-sans select-none overflow-x-hidden pt-16">
      {/* Hidden audio element for team radio clips */}
      <audio
        ref={radioAudioRef}
        onEnded={() => setIsAudioPlaying(false)}
        onError={() => setIsAudioPlaying(false)}
        className="hidden"
      />

      {/* Top Mission Control Masthead */}
      <header className="border-b border-white/10 bg-[#090C14]/90 backdrop-blur-xl px-4 py-2.5 z-40 sticky top-16">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Branding & Session Name */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-xs font-bold tracking-widest">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>LIVE PIT WALL</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-wider uppercase font-display text-white">
                  {status?.session?.meetingName || 'Formula 1 Grand Prix'}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono">
                  {effectiveSessionDisplayName}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/10">
                  {status?.session?.circuitName || 'Interlagos Autódromo'}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Session Adaptive Format Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 overflow-x-auto">
            <button
              onClick={() => setSelectedFormat('AUTO')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold tracking-wider transition-all ${
                selectedFormat === 'AUTO'
                  ? 'bg-ferrari-red text-white shadow-[0_0_12px_rgba(239,26,45,0.6)]'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Automatically detect session format from official FOM feed"
            >
              AUTO ({effectiveSessionFormat})
            </button>
            <button
              onClick={() => setSelectedFormat('RACE')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold tracking-wider transition-all ${
                effectiveSessionFormat === 'RACE' && selectedFormat !== 'AUTO'
                  ? 'bg-ferrari-red text-white shadow-[0_0_12px_rgba(239,26,45,0.6)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              RACE
            </button>
            <button
              onClick={() => setSelectedFormat('QUALIFYING')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold tracking-wider transition-all ${
                effectiveSessionFormat === 'QUALIFYING' && selectedFormat !== 'AUTO'
                  ? 'bg-ferrari-red text-white shadow-[0_0_12px_rgba(239,26,45,0.6)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              QUALIFYING (Q1/2/3)
            </button>
            <button
              onClick={() => setSelectedFormat('PRACTICE')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold tracking-wider transition-all ${
                effectiveSessionFormat === 'PRACTICE' && selectedFormat !== 'AUTO'
                  ? 'bg-ferrari-red text-white shadow-[0_0_12px_rgba(239,26,45,0.6)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              PRACTICE (FP1/2/3)
            </button>
            <button
              onClick={() => setSelectedFormat('SPRINT')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold tracking-wider transition-all ${
                effectiveSessionFormat === 'SPRINT' && selectedFormat !== 'AUTO'
                  ? 'bg-ferrari-red text-white shadow-[0_0_12px_rgba(239,26,45,0.6)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              SPRINT (100KM)
            </button>
            <button
              onClick={() => setSelectedFormat('SPRINT_QUALIFYING')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold tracking-wider transition-all ${
                effectiveSessionFormat === 'SPRINT_QUALIFYING' && selectedFormat !== 'AUTO'
                  ? 'bg-ferrari-red text-white shadow-[0_0_12px_rgba(239,26,45,0.6)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              SPRINT QUALI
            </button>
          </div>

          {/* Right: Countdown Clock, Weather Sensors & Layout Modes */}
          <div className="flex items-center gap-3">
            {/* Session Countdown Clock */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/50 border border-white/10 font-mono">
              <Clock className="w-3.5 h-3.5 text-ferrari-yellow animate-spin-slow" />
              <div className="flex flex-col">
                <span className="text-[9px] text-white/50 tracking-widest uppercase">
                  {isUpcomingWithinWindow
                    ? `COUNTDOWN TO ${effectiveSessionFormat} (11:30 PM IST)`
                    : clock?.extrapolating
                    ? 'SESSION REMAINING'
                    : 'SESSION CLOCK'}
                </span>
                <span className="text-sm font-bold text-ferrari-yellow tracking-wider">
                  {remainingTimeDisplay}
                </span>
              </div>
            </div>

            {/* Weather Sensor Mini Pill */}
            {weather && (
              <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
                <div className="flex items-center gap-1 text-white/80">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>TRK: <strong className="text-white">{weather.TrackTemp}°C</strong></span>
                </div>
                <div className="flex items-center gap-1 text-white/80">
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  <span>AIR: <strong className="text-white">{weather.AirTemp}°C</strong></span>
                </div>
                <div className="flex items-center gap-1 text-white/80">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WIND: <strong className="text-white">{weather.WindSpeed}km/h</strong></span>
                </div>
              </div>
            )}

            {/* Layout Mode Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/10">
              <button
                onClick={() => {
                  setLayoutMode('SPLIT')
                  setVideoMode('big')
                }}
                title="Big Video & Timing Split (7 cols / 5 cols)"
                className={`p-1.5 rounded ${
                  layoutMode === 'SPLIT' && videoMode !== 'theater'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setLayoutMode('CINEMA')
                  setVideoMode('theater')
                }}
                title="Cinematic Big Video (Full 12 Columns Across Top)"
                className={`p-1.5 rounded ${
                  layoutMode === 'CINEMA' || videoMode === 'theater'
                    ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/50'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <Tv className="w-4 h-4 text-ferrari-yellow" />
              </button>
              <button
                onClick={() => setLayoutMode('TOWER_FOCUS')}
                title="Timing Tower Expanded"
                className={`p-1.5 rounded ${
                  layoutMode === 'TOWER_FOCUS' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('COCKPIT_HUD')}
                title="Single Driver Cockpit HUD"
                className={`p-1.5 rounded ${
                  layoutMode === 'COCKPIT_HUD' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                <Gauge className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Track Status & Active Audio Banner */}
        <div className="max-w-[1920px] mx-auto mt-2 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-0.5 rounded border text-[11px] font-bold tracking-wider ${trackStatusBadge.bg}`}>
              {trackStatusBadge.label}
            </div>
            {raceControlLogs.length > 0 && (
              <div className="text-white/70 flex items-center gap-1.5 truncate max-w-xl">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span className="text-white/40">
                  [{raceControlLogs[0]?.time ? (raceControlLogs[0].time.includes('T') ? raceControlLogs[0].time.split('T')[1]?.slice(0, 8) : raceControlLogs[0].time.slice(0, 8)) : 'LIVE'}]:
                </span>
                <span className="text-white/90 truncate">{raceControlLogs[0]?.message}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {/* Live Playing Radio Indicator */}
            {activeRadioAudio && (
              <div className="flex items-center gap-2 px-2.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300">
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                <span>
                  TRANSMITTING: #{activeRadioAudio.driverNumber} {activeRadioAudio.name}
                </span>
                <button
                  onClick={() => {
                    if (radioAudioRef.current) {
                      if (isAudioPlaying) {
                        radioAudioRef.current.pause()
                        setIsAudioPlaying(false)
                      } else {
                        radioAudioRef.current.play()
                        setIsAudioPlaying(true)
                      }
                    }
                  }}
                  className="ml-1 p-0.5 hover:text-white"
                >
                  {isAudioPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>
            )}

            <DataProvenanceBadge
              provenance={
                status?.provenance ||
                createProvenance(
                  'livetiming.formula1.com',
                  'https://livetiming.formula1.com/signalrcore (f1-live-api)',
                  'LIVE',
                  'OFFICIALLY_VERIFIED'
                )
              }
            />
          </div>
        </div>
      </header>

      {/* Telemetry Delay & Broadcast Video Sync Controller */}
      <div className="max-w-[1920px] w-full mx-auto px-3 pt-2">
        <TelemetryDelayController />
      </div>

      {/* Main Multi-Pane Viewport Grid */}
      <div className="flex-1 max-w-[1920px] w-full mx-auto p-3 grid grid-cols-1 xl:grid-cols-12 gap-3">
        {/* LEFT / TOP STAGE: Big Broadcast Video & Comms & Thermals */}
        {(layoutMode === 'SPLIT' || layoutMode === 'CINEMA' || layoutMode === 'COCKPIT_HUD') && (
          <div
            className={`flex flex-col gap-3 ${
              layoutMode === 'CINEMA' || videoMode === 'theater'
                ? 'xl:col-span-12'
                : layoutMode === 'COCKPIT_HUD'
                ? 'xl:col-span-6'
                : 'xl:col-span-7'
            }`}
          >
            {/* Big Video Stage Controls */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B0F19] border border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>LIVE BROADCAST FEED</span>
                </div>

                <button
                  onClick={() => {
                    setVideoMode('big')
                    if (layoutMode === 'CINEMA') setLayoutMode('SPLIT')
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                    videoMode === 'big' && layoutMode !== 'CINEMA'
                      ? 'bg-ferrari-red text-white shadow-lg'
                      : 'text-white/60 hover:text-white bg-white/5'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>BIG VIDEO (SPLIT)</span>
                </button>

                <button
                  onClick={() => {
                    setVideoMode('theater')
                    setLayoutMode('CINEMA')
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                    videoMode === 'theater' || layoutMode === 'CINEMA'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-lg'
                      : 'text-white/60 hover:text-white bg-white/5'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>THEATER CINEMA (FULL WIDTH)</span>
                </button>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px]">
                {backupStreamProvider && (
                  <button
                    onClick={() => {
                      const temp = activeStreamProvider
                      setActiveStreamProvider(backupStreamProvider)
                      setBackupStreamProvider(temp)
                    }}
                    className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 transition text-[10px] flex items-center gap-1.5"
                    title="Switch to backup stream provider"
                  >
                    <Layers className="w-3 h-3 text-ferrari-yellow" />
                    <span>BACKUP FEED</span>
                  </button>
                )}
                <span className="text-white/40 hidden sm:inline">
                  ACTIVE DRIVER: #{selectedDriver?.driver_number || '16'} {selectedDriver?.acronym || 'LEC'}
                </span>
              </div>
            </div>

            {/* BIG LIVE VIDEO DISPLAY (Full Width, No 2D tracker side-by-side) */}
            <div
              className={`rounded-2xl overflow-hidden border border-white/10 bg-black w-full shadow-2xl relative ${
                layoutMode === 'CINEMA' || videoMode === 'theater'
                  ? 'aspect-[21/9] min-h-[500px] lg:min-h-[640px]'
                  : 'aspect-video min-h-[460px] md:min-h-[520px] xl:min-h-[580px]'
              }`}
            >
              <LiveRaceVideoPlayer
                activeProvider={activeStreamProvider}
                backupProvider={backupStreamProvider}
                sessionName={status?.session?.name || sessionName}
                onSwitchToBackup={() => {
                  const temp = activeStreamProvider
                  setActiveStreamProvider(backupStreamProvider)
                  setBackupStreamProvider(temp)
                }}
              />
            </div>

            {/* Team Radio Stations & Cockpit Powertrain Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
              {/* Left Column: FOM LIVE TEAM RADIO STATION + WEATHER RADAR DIRECTLY BELOW */}
              <div className="flex flex-col gap-3">
                {/* FOM LIVE TEAM RADIO STATION */}
                <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-3 flex flex-col min-h-[260px]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-ferrari-yellow" />
                      <h3 className="font-mono text-xs font-black tracking-wider uppercase text-white">
                        FOM LIVE TEAM RADIO COMMS
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      {radioMessages.length} CAPTURES
                    </span>
                  </div>

                  <div className="mt-2 space-y-1.5 overflow-y-auto max-h-[260px] pr-1">
                    {radioMessages.length === 0 ? (
                      <div className="p-6 text-center text-white/40 text-xs font-mono">
                        Awaiting live team radio broadcasts from F1 race control...
                      </div>
                    ) : (
                      radioMessages.map((msg, idx) => {
                        const isThisPlaying =
                          activeRadioAudio?.url === msg.audio_url && isAudioPlaying
                        return (
                          <div
                            key={msg.audio_url || idx}
                            onClick={() => handlePlayRadio(msg)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isThisPlaying
                                ? 'bg-purple-900/30 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                                : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <button className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white shrink-0">
                                {isThisPlaying ? (
                                  <Pause className="w-3.5 h-3.5 text-purple-400" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-white/80" />
                                )}
                              </button>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-xs text-white">
                                    #{msg.driver_number} {msg.acronym || msg.name}
                                  </span>
                                  <span className="text-[10px] font-mono px-1 rounded bg-white/10 text-white/60">
                                    {msg.team}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-white/40">
                                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'RECENT'}
                                </span>
                              </div>
                            </div>

                            {isThisPlaying && (
                              <div className="flex items-center gap-0.5">
                                <span className="w-1 h-3 bg-purple-400 animate-pulse rounded-full" />
                                <span className="w-1 h-5 bg-purple-400 animate-pulse delay-75 rounded-full" />
                                <span className="w-1 h-2 bg-purple-400 animate-pulse delay-150 rounded-full" />
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                {/* FIA RACE CONTROL DIRECTIVES (BELOW RADIOS, ABOVE WEATHER) */}
                <RaceControlMessagesCard messages={raceControlLogs} />

                {/* LIVE FIA METEOROLOGICAL & TRACK WEATHER RADAR (BELOW RACE CONTROL) */}
                <WeatherRadarCard
                  weather={weather}
                  circuitName={status?.session?.circuitName}
                />
              </div>

              {/* 4-WHEEL TYRE THERMALS & ICE COCKPIT */}
              <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-3 flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500" />
                    <h3 className="font-mono text-xs font-black tracking-wider uppercase text-white">
                      DRIVER HUD // #{selectedDriver?.driver_number || '16'} {selectedDriver?.acronym || 'LEC'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-ferrari-yellow">
                    {selectedDriver?.team || 'Ferrari'}
                  </span>
                </div>

                <div className="mt-2 flex-1">
                  <TyreEngineTelemetryCard
                    driver={selectedDriver}
                    weather={weather}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT / LOWER STAGE: ADAPTIVE TIMING TOWER WORKSTATION */}
        <div
          className={`flex flex-col gap-3 ${
            layoutMode === 'CINEMA' || videoMode === 'theater'
              ? 'xl:col-span-12'
              : layoutMode === 'TOWER_FOCUS'
              ? 'xl:col-span-12'
              : layoutMode === 'COCKPIT_HUD'
              ? 'xl:col-span-6'
              : 'xl:col-span-5'
          }`}
        >
          {/* Header & Leaderboard Filters */}
          <div className="p-3 rounded-2xl bg-[#0B0F19] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-mono text-sm font-black tracking-wider uppercase text-white">
                OFFICIAL FIA TIMING TOWER
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                {displayedDrivers.length} CARS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ferrari-red/20 text-ferrari-red font-bold uppercase">
                {effectiveSessionFormat} FORMAT
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Driver */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Filter driver/team..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-ferrari-red"
                />
              </div>

              {/* Ferrari Tifosi Filter */}
              <button
                onClick={() => setFerrariOnlyFilter(!ferrariOnlyFilter)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                  ferrariOnlyFilter
                    ? 'bg-ferrari-red text-white shadow-[0_0_12px_rgba(239,26,45,0.6)]'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                FERRARI ONLY
              </button>
            </div>
          </div>

          {/* ADAPTIVE TABLE WORKSTATION */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0D15] overflow-hidden shadow-2xl flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left font-mono border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0E1321] text-white/60 text-[10px] tracking-wider uppercase border-b border-white/10 sticky top-0 z-20">
                    <th className="py-2.5 px-2 text-center w-12">POS</th>
                    <th className="py-2.5 px-2">DRIVER</th>
                    {effectiveSessionFormat === 'SPRINT' && (
                      <th className="py-2.5 px-2 text-center">PTS</th>
                    )}
                    <th className="py-2.5 px-2">TYRE</th>
                    {effectiveSessionFormat === 'RACE' && (
                      <>
                        <th className="py-2.5 px-2 text-right">GAP</th>
                        <th className="py-2.5 px-2 text-right">INT</th>
                        <th className="py-2.5 px-2 text-right">LAST LAP</th>
                      </>
                    )}
                    {(effectiveSessionFormat === 'QUALIFYING' ||
                      effectiveSessionFormat === 'SPRINT_QUALIFYING') && (
                      <>
                        <th className="py-2.5 px-2 text-right">BEST LAP</th>
                        <th className="py-2.5 px-2 text-right">GAP TO P1</th>
                        <th className="py-2.5 px-2 text-right">CUTOFF DELTA</th>
                      </>
                    )}
                    {effectiveSessionFormat === 'PRACTICE' && (
                      <>
                        <th className="py-2.5 px-2 text-right">BEST LAP</th>
                        <th className="py-2.5 px-2 text-right">GAP TO P1</th>
                        <th className="py-2.5 px-2 text-center">LAPS</th>
                      </>
                    )}
                    <th className="py-2.5 px-2 text-right">S1</th>
                    <th className="py-2.5 px-2 text-right">S2</th>
                    <th className="py-2.5 px-2 text-right">S3</th>
                    <th className="py-2.5 px-2 text-center">MICRO SECTORS</th>
                    {effectiveSessionFormat === 'RACE' && (
                      <th className="py-2.5 px-2 text-center">PITS</th>
                    )}
                    <th className="py-2.5 px-2 text-right">SPEED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayedDrivers.map((driver, index) => {
                    const posNum = parseInt(driver.position || String(index + 1), 10) || (index + 1)
                    const isSelected = driver.driver_number === selectedDriverNumber
                    const isLeclerc = driver.driver_number === '16' || driver.acronym === 'LEC'
                    const isHamilton = driver.driver_number === '44' || driver.acronym === 'HAM'
                    const isFerrari = isLeclerc || isHamilton || Boolean(driver.team?.toLowerCase().includes('ferrari'))

                    // QUALIFYING DANGER ZONE COMPUTATION
                    const isQualiCutoffRow =
                      effectiveSessionFormat === 'QUALIFYING' &&
                      (posNum === 15 || posNum === 10) // Q1 cutoff is P15/P16, Q2 is P10/P11
                    const isDangerZone =
                      effectiveSessionFormat === 'QUALIFYING' && posNum >= 16

                    // SPRINT POINTS ZONE COMPUTATION
                    const isSprintPointsCutoffRow =
                      effectiveSessionFormat === 'SPRINT' && posNum === 8
                    const sprintPoints =
                      effectiveSessionFormat === 'SPRINT'
                        ? posNum <= 8
                          ? 9 - posNum
                          : 0
                        : 0

                    return (
                      <React.Fragment key={driver.driver_number}>
                        <tr
                          onClick={() => setSelectedDriverNumber(driver.driver_number)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-ferrari-red/25 border-l-4 border-l-ferrari-red shadow-[0_0_15px_rgba(239,26,45,0.4)]'
                              : isFerrari
                              ? 'bg-gradient-to-r from-red-600/35 via-red-950/20 to-transparent border-l-4 border-l-ferrari-red hover:bg-red-900/30 font-bold'
                              : isDangerZone
                              ? 'bg-rose-950/10 hover:bg-rose-950/25'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          {/* POS */}
                          <td className="py-2.5 px-2 text-center font-bold">
                            <span
                              className={`inline-block w-6 text-center ${
                                isFerrari
                                  ? 'text-white font-black'
                                  : posNum === 1
                                  ? 'text-ferrari-yellow font-black'
                                  : posNum <= 3
                                  ? 'text-white font-bold'
                                  : isDangerZone
                                  ? 'text-red-400 font-bold'
                                  : 'text-white/70'
                              }`}
                            >
                              {posNum}
                            </span>
                          </td>

                          {/* DRIVER */}
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-1.5 h-4 rounded-full shrink-0"
                                style={{
                                  backgroundColor: isFerrari
                                    ? '#EF1A2D'
                                    : driver.team_colour
                                    ? `#${driver.team_colour}`
                                    : '#555',
                                }}
                              />
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-bold tracking-wider ${isFerrari ? 'text-white font-black' : 'text-white'}`}>
                                    {driver.acronym || driver.name}
                                  </span>
                                  <span className={`text-[10px] ${isFerrari ? 'text-white/90 font-mono font-bold' : 'text-white/40'}`}>
                                    #{driver.driver_number}
                                  </span>
                                  {isFerrari && (
                                    <span className="px-1.5 py-0.2 rounded bg-ferrari-red text-white text-[8px] font-mono font-black shadow-[0_0_8px_rgba(239,26,45,0.8)] tracking-wider">
                                      FERRARI
                                    </span>
                                  )}
                                  {driver.in_pit && (
                                    <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] uppercase font-bold">
                                      IN PIT
                                    </span>
                                  )}
                                  {driver.retired && (
                                    <span className="px-1 py-0.2 rounded bg-red-600/30 text-red-400 text-[9px] uppercase font-bold">
                                      OUT
                                    </span>
                                  )}
                                </div>
                                <span className={`text-[9px] truncate max-w-[130px] ${isFerrari ? 'text-ferrari-yellow font-bold' : 'text-white/50'}`}>
                                  {isFerrari ? 'Scuderia Ferrari' : driver.team}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* SPRINT POINTS */}
                          {effectiveSessionFormat === 'SPRINT' && (
                            <td className="py-2.5 px-2 text-center">
                              {sprintPoints > 0 ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                                  +{sprintPoints}
                                </span>
                              ) : (
                                <span className="text-white/20 text-[10px]">0</span>
                              )}
                            </td>
                          )}

                          {/* TYRE COMPOUND & LAPS */}
                          <td className="py-2.5 px-2">
                            {renderTyreBadge(
                              driver.tyre_compound,
                              driver.tyre_laps,
                              driver.tyre_new
                            )}
                          </td>

                          {/* RACE SPECIFIC METRICS */}
                          {effectiveSessionFormat === 'RACE' && (
                            <>
                              <td className="py-2.5 px-2 text-right font-medium">
                                {driver.gap_to_leader ? (
                                  <span className="text-white/80">{driver.gap_to_leader}</span>
                                ) : posNum === 1 ? (
                                  <span className="text-ferrari-yellow font-bold">LEADER</span>
                                ) : (
                                  <span className="text-white/20">--</span>
                                )}
                              </td>
                              <td className="py-2.5 px-2 text-right text-white/60">
                                {driver.interval || '--'}
                              </td>
                              <td className="py-2.5 px-2 text-right">
                                <span
                                  className={
                                    driver.last_lap_overall_best
                                      ? 'text-[#D070FF] font-bold'
                                      : driver.last_lap_personal_best
                                      ? 'text-emerald-400 font-bold'
                                      : 'text-white/80'
                                  }
                                >
                                  {driver.last_lap_time || '--.---'}
                                </span>
                              </td>
                            </>
                          )}

                          {/* QUALIFYING SPECIFIC METRICS */}
                          {(effectiveSessionFormat === 'QUALIFYING' ||
                            effectiveSessionFormat === 'SPRINT_QUALIFYING') && (
                            <>
                              <td className="py-2.5 px-2 text-right font-bold text-white">
                                {driver.best_lap_time || '--.---'}
                              </td>
                              <td className="py-2.5 px-2 text-right text-white/70">
                                {posNum === 1 ? (
                                  <span className="text-ferrari-yellow font-black">POLE</span>
                                ) : driver.gap_to_leader ? (
                                  driver.gap_to_leader
                                ) : (
                                  '--'
                                )}
                              </td>
                              <td className="py-2.5 px-2 text-right">
                                {isDangerZone ? (
                                  <span className="text-red-400 font-bold">DANGER ZONE</span>
                                ) : (
                                  <span className="text-emerald-400 font-medium">SAFE</span>
                                )}
                              </td>
                            </>
                          )}

                          {/* PRACTICE SPECIFIC METRICS */}
                          {effectiveSessionFormat === 'PRACTICE' && (
                            <>
                              <td className="py-2.5 px-2 text-right font-bold text-white">
                                {driver.best_lap_time || '--.---'}
                              </td>
                              <td className="py-2.5 px-2 text-right text-white/70">
                                {posNum === 1 ? 'P1' : driver.gap_to_leader || '--'}
                              </td>
                              <td className="py-2.5 px-2 text-center text-white/70">
                                {driver.laps_completed ?? '--'}
                              </td>
                            </>
                          )}

                          {/* SECTOR 1, 2, 3 */}
                          <td className="py-2.5 px-2 text-right">
                            {renderSectorTime(driver.sectors[0])}
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            {renderSectorTime(driver.sectors[1])}
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            {renderSectorTime(driver.sectors[2])}
                          </td>

                          {/* MICRO SECTORS SEGMENT BAR */}
                          <td className="py-2.5 px-2">
                            <div className="flex items-center justify-center gap-0.5">
                              {driver.sectors.flatMap((sec, sIdx) =>
                                (sec?.segments || []).map((seg, segIdx) => {
                                  let bg = 'bg-neutral-800'
                                  if (seg.status === 2064) bg = 'bg-[#C048FF]' // Session fastest (Purple)
                                  else if (seg.status === 2048) bg = 'bg-[#00D084]' // Personal best (Green)
                                  else if (seg.status === 2049) bg = 'bg-[#FFD000]' // Normal (Yellow)
                                  return (
                                    <span
                                      key={`${sIdx}-${segIdx}`}
                                      className={`w-1.5 h-3 rounded-[1px] ${bg}`}
                                    />
                                  )
                                })
                              )}
                            </div>
                          </td>

                          {/* PITS */}
                          {effectiveSessionFormat === 'RACE' && (
                            <td className="py-2.5 px-2 text-center text-white/70">
                              {driver.stint_number ? `${driver.stint_number - 1}` : '0'}
                            </td>
                          )}

                          {/* SPEED TRAP */}
                          <td className="py-2.5 px-2 text-right text-white/60">
                            {driver.speed_traps?.st ? `${driver.speed_traps.st} km/h` : '--'}
                          </td>
                        </tr>

                        {/* QUALIFYING DANGER ZONE CUT-OFF LINE DIVIDER */}
                        {isQualiCutoffRow && (
                          <tr className="bg-red-500/10 border-y border-red-500/40">
                            <td
                              colSpan={13}
                              className="py-1 px-4 text-center font-mono font-bold text-[10px] tracking-widest text-red-400 uppercase"
                            >
                              ▼ ELIMINATION CUT-OFF LINE // DRIVERS BELOW FACE KNOCKOUT ▼
                            </td>
                          </tr>
                        )}

                        {/* SPRINT POINTS ZONE CUT-OFF LINE DIVIDER */}
                        {isSprintPointsCutoffRow && (
                          <tr className="bg-emerald-500/10 border-y border-emerald-500/40">
                            <td
                              colSpan={13}
                              className="py-1 px-4 text-center font-mono font-bold text-[10px] tracking-widest text-emerald-400 uppercase"
                            >
                              ▲ SPRINT POINTS THRESHOLD (TOP 8 CARS RECEIVE FIA POINTS) ▲
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Micro-Sectors Matrix Component Expandable Drawer */}
            <div className="p-3 border-t border-white/10 bg-[#080B12]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-white/70 uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-ferrari-yellow" />
                  DETAILED MICRO-SECTOR SECTOR METRICS (PURPLE = 2064, GREEN = 2048, YELLOW = 2049)
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  REAL-TIME FOM DATA STREAM
                </span>
              </div>
              <MicroSectorsMatrix
                drivers={timingDrivers}
                activeSessionName={status?.session?.name || sessionName}
                selectedDriverNumber={selectedDriverNumber}
                onSelectDriver={(num) => setSelectedDriverNumber(num)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PitWallCommandView
