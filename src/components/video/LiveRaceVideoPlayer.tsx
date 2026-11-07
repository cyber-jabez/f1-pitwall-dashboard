import React, { useState, useEffect, useRef } from 'react'
import type { StreamProvider } from '../../services/streamingProviderService'
import {
  Tv,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Shield,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Settings,
  Layers,
  Play,
  Pause,
} from 'lucide-react'

interface LiveRaceVideoPlayerProps {
  activeProvider: StreamProvider | null
  backupProvider?: StreamProvider | null
  sessionName: string
  onSwitchToBackup?: () => void
  onConfigureClick?: () => void
}

export const LiveRaceVideoPlayer: React.FC<LiveRaceVideoPlayerProps> = ({
  activeProvider,
  backupProvider,
  sessionName,
  onSwitchToBackup,
  onConfigureClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsInstanceRef = useRef<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isPipSupported, setIsPipSupported] = useState<boolean>(false)
  const [isPipActive, setIsPipActive] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)

  // Check Picture-in-Picture support
  useEffect(() => {
    if (typeof document !== 'undefined' && 'pictureInPictureEnabled' in document) {
      setIsPipSupported(Boolean(document.pictureInPictureEnabled))
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Initialize or clean up video playback based on active provider
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    setErrorMessage('')

    if (!activeProvider || !activeProvider.isEnabled) {
      setIsLoading(false)
      return
    }

    // Clean up previous HLS instance if any
    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy()
      hlsInstanceRef.current = null
    }

    if (activeProvider.type === 'hls' && videoRef.current) {
      const video = videoRef.current
      const streamUrl = activeProvider.streamUrl

      const getHls = async (): Promise<any> => {
        if ((window as any).Hls) return (window as any).Hls
        return new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js'
          script.onload = () => resolve((window as any).Hls)
          script.onerror = () => resolve(null)
          document.head.appendChild(script)
        })
      }

      getHls().then((Hls) => {
        if (Hls && Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 60,
          })
          hlsInstanceRef.current = hls
          hls.loadSource(streamUrl)
          hls.attachMedia(video)

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false)
            video.play().catch(() => {
              // Autoplay blocked without user gesture or mute
              setIsPlaying(false)
            })
          })

          hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
            if (data.fatal) {
              console.warn('[LiveRaceVideoPlayer] Fatal HLS error:', data)
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad()
                  break
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError()
                  break
                default:
                  hls.destroy()
                  setHasError(true)
                  setErrorMessage('HLS stream network error or source offline.')
                  break
              }
            }
          })
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native Safari HLS
          video.src = streamUrl
          video.addEventListener('loadedmetadata', () => {
            setIsLoading(false)
            video.play().catch(() => setIsPlaying(false))
          })
          video.addEventListener('error', () => {
            setHasError(true)
            setErrorMessage('Native video playback error.')
          })
        } else {
          setHasError(true)
          setErrorMessage('HLS playback is not supported in this browser environment.')
          setIsLoading(false)
        }
      })
    } else {
      // Non-HLS streams (embed, portal, iframe)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 700)
      return () => clearTimeout(timer)
    }

    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy()
        hlsInstanceRef.current = null
      }
    }
  }, [activeProvider?.id, activeProvider?.streamUrl, activeProvider?.type, activeProvider?.isEnabled])

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err)
      })
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Exit fullscreen failed:', err)
      })
    }
  }

  // Picture-in-Picture toggle handler
  const handleTogglePip = async () => {
    if (!videoRef.current) return
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
        setIsPipActive(false)
      } else {
        await videoRef.current.requestPictureInPicture()
        setIsPipActive(true)
      }
    } catch (e) {
      console.warn('Picture-in-Picture error:', e)
    }
  }

  // Mute toggle handler
  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    } else {
      setIsMuted(!isMuted)
    }
  }

  // Play/Pause toggle
  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Player Outer Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border-2 border-ferrari-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.95)] group select-none flex flex-col justify-center items-center"
      >
        {/* CASE 1: No Authorized Live Stream Available */}
        {(!activeProvider || !activeProvider.isEnabled) && (
          <div className="p-8 sm:p-12 text-center max-w-xl mx-auto flex flex-col items-center gap-4 font-mono">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
              <Tv className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-1">
                STREAMING CONTROLLER // ZERO SIMULATION POLICY
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                NO AUTHORIZED LIVE STREAM AVAILABLE
              </h2>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                No verified broadcaster embed or authorized streaming URL is currently active for{' '}
                <strong className="text-white">{sessionName}</strong>. This platform enforces authentic licensing and does not inject placeholder videos.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              {onConfigureClick && (
                <button
                  onClick={onConfigureClick}
                  className="px-4 py-2 rounded-xl bg-ferrari-red text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure Provider in Admin</span>
                </button>
              )}

              {backupProvider && onSwitchToBackup && (
                <button
                  onClick={onSwitchToBackup}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-700 transition flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-ferrari-yellow" />
                  <span>Switch to {backupProvider.name}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* CASE 2: Unverified Third-Party Stream Authorization Gate */}
        {activeProvider &&
          activeProvider.isEnabled &&
          activeProvider.authorizationStatus === 'UNVERIFIED_THIRD_PARTY' && (
            <div className="p-8 sm:p-12 text-center max-w-xl mx-auto flex flex-col items-center gap-4 font-mono">
              <div className="w-16 h-16 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] text-amber-400 uppercase tracking-widest block mb-1">
                  SECURITY & BROADCAST COMPLIANCE WARNING
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                  UNVERIFIED THIRD-PARTY STREAM // AUTHORIZATION REQUIRED
                </h2>
                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                  The requested provider reference (<code className="text-cyan-400">{activeProvider.streamUrl}</code>) is an unverified external source. Per platform policy, external streams are never automatically embedded without administrator licensing verification.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                {onConfigureClick && (
                  <button
                    onClick={onConfigureClick}
                    className="px-4 py-2 rounded-xl bg-ferrari-red text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Manage Authorization in Admin</span>
                  </button>
                )}

                {backupProvider && onSwitchToBackup && (
                  <button
                    onClick={onSwitchToBackup}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-700 transition flex items-center gap-2"
                  >
                    <span>Switch to Authorized Backup</span>
                  </button>
                )}
              </div>
            </div>
          )}

        {/* CASE 3: Active HLS Stream Playback */}
        {activeProvider &&
          activeProvider.isEnabled &&
          activeProvider.type === 'hls' &&
          activeProvider.authorizationStatus !== 'UNVERIFIED_THIRD_PARTY' && (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                playsInline
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Loading Spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 font-mono text-xs gap-3">
                  <div className="w-10 h-10 border-2 border-ferrari-red border-t-transparent rounded-full animate-spin" />
                  <span className="text-white/80">CONNECTING TO HLS MASTER MANIFEST...</span>
                </div>
              )}

              {/* Error Overlay */}
              {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 font-mono text-xs p-6 text-center gap-3">
                  <AlertTriangle className="w-10 h-10 text-rose-500" />
                  <span className="text-rose-400 font-bold uppercase">{errorMessage || 'STREAM PLAYBACK ERROR'}</span>
                  {backupProvider && onSwitchToBackup && (
                    <button
                      onClick={onSwitchToBackup}
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
                    >
                      Failover to Backup: {backupProvider.name}
                    </button>
                  )}
                </div>
              )}
            </>
          )}

        {/* CASE 4: Authorized Broadcaster Embed (e.g. YouTube / Broadcaster Player) */}
        {activeProvider &&
          activeProvider.isEnabled &&
          activeProvider.type === 'embed' &&
          activeProvider.authorizationStatus !== 'UNVERIFIED_THIRD_PARTY' && (
            <iframe
              src={activeProvider.streamUrl}
              title={activeProvider.name}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true)
                setErrorMessage('Unable to embed authorized broadcaster stream.')
              }}
            />
          )}

        {/* CASE 5: Authorized Broadcaster Portal Link Card */}
        {activeProvider &&
          activeProvider.isEnabled &&
          activeProvider.type === 'authorized_portal' &&
          activeProvider.authorizationStatus !== 'UNVERIFIED_THIRD_PARTY' && (
            <div className="p-8 sm:p-12 text-center max-w-lg mx-auto flex flex-col items-center gap-4 font-mono">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-ferrari-red">
                <Tv className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-1">
                  OFFICIALLY AUTHORIZED BROADCAST FEED
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                  {activeProvider.name}
                </h2>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {activeProvider.notes}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                <a
                  href={activeProvider.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-ferrari-red text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition flex items-center gap-2 shadow-lg"
                >
                  <span>Launch Official Broadcast Stream</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {backupProvider && onSwitchToBackup && (
                  <button
                    onClick={onSwitchToBackup}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-700 transition"
                  >
                    Switch to Backup Stream
                  </button>
                )}
              </div>
            </div>
          )}

        {/* Top HUD: Session & Provider Badges */}
        {activeProvider && activeProvider.isEnabled && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
              <span className="w-2 h-2 rounded-full bg-ferrari-red animate-pulse" />
              <span className="font-mono text-xs font-bold text-white tracking-wider">
                {sessionName.toUpperCase()}
              </span>
            </div>

            <span
              className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-xl border uppercase backdrop-blur-md ${
                activeProvider.authorizationStatus === 'OFFICIALLY_AUTHORIZED'
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                  : activeProvider.authorizationStatus === 'REQUIRES_AUTHENTICATION'
                  ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                  : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
              }`}
            >
              {activeProvider.authorizationStatus.replace(/_/g, ' ')}
            </span>
          </div>
        )}

        {/* Top Right Controls (Fullscreen, PiP, Mute) */}
        {activeProvider && activeProvider.isEnabled && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {activeProvider.type === 'hls' && (
              <>
                <button
                  onClick={handleTogglePlay}
                  className="p-2 rounded-xl bg-black/80 hover:bg-black text-white border border-white/20 transition"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleToggleMute}
                  className="p-2 rounded-xl bg-black/80 hover:bg-black text-white border border-white/20 transition"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {isPipSupported && (
                  <button
                    onClick={handleTogglePip}
                    className="p-2 rounded-xl bg-black/80 hover:bg-black text-white border border-white/20 transition text-xs font-mono"
                    title="Picture-in-Picture"
                  >
                    PiP
                  </button>
                )}
              </>
            )}

            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl bg-black/80 hover:bg-black text-white border border-white/20 transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Ad Transparency & Compliance Notice */}
      <div className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-neutral-500">
        <span>
          🛡️ <strong>Platform Guarantee:</strong> Zero injected ads, pop-ups, or third-party tracking scripts.
        </span>
        <span className="italic">
          * Note: External broadcaster transmissions may feature their own scheduled commercial breaks.
        </span>
      </div>
    </div>
  )
}

export default LiveRaceVideoPlayer

