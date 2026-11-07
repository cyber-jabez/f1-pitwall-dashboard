import React, { useState, useEffect } from 'react'
import { Activity, Gauge, Zap, Wind, Radio, Shield, ExternalLink, ChevronRight } from 'lucide-react'
import { openf1LiveClient, type LiveStatusState } from '../../services/openf1LiveClient'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'

export const TelemetryDashboard: React.FC = () => {
  const [liveStatus, setLiveStatus] = useState<LiveStatusState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    openf1LiveClient.checkLiveTrackStatus().then((status) => {
      setLiveStatus(status)
      setLoading(false)
    })
  }, [])

  const isLive = liveStatus?.isLive ?? false

  return (
    <section id="telemetry" className="relative py-24 bg-[#08090E] overflow-hidden border-t border-ferrari-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-mono">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 mb-3 text-xs">
            <span className="w-2 h-2 rounded-full bg-neutral-500" />
            <span className="tracking-widest text-neutral-400 uppercase">
              OPENF1 LIVE INGESTION PIPELINE // ZERO FABRICATION
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-wider text-white uppercase mb-3">
            TELEMETRY <ShinyText text="INTELLIGENCE RADAR" color="#FF2800" shineColor="#FED500" />
          </h2>

          <p className="max-w-2xl text-white/60 font-sans text-sm sm:text-base">
            Directly connected to OpenF1 high-frequency track telemetry sensors. Values are only streamed when cars are actively on-track.
          </p>
        </div>

        {/* Status Card: Honest Empty State */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B0D14] border-2 border-neutral-800/80 shadow-2xl text-center max-w-3xl mx-auto flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
            <Activity className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-1">
              TRACK TELEMETRY GATEWAY
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              {isLive ? 'LIVE SESSION ACTIVE' : 'NO LIVE SESSION DATA'}
            </h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed max-w-lg mx-auto">
              {isLive
                ? 'Telemetry channels are streaming live from the active Grand Prix session.'
                : 'Formula 1 cars are currently off-track. In strict accordance with our authentic data policy, simulated hot laps, artificial gauges, and synthetic numbers are never generated. Live telemetry channels (Speed, RPM, Throttle, Brake, DRS) activate only when an official session is underway.'}
            </p>
          </div>

          {/* Direct Navigation Links to Verified Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-left text-xs pt-4 border-t border-neutral-800">
            <a
              href="#live-telemetry"
              className="p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 text-white transition flex items-center justify-between group"
            >
              <div>
                <span className="font-bold block group-hover:text-ferrari-red transition-colors">
                  OpenF1 Workstation
                </span>
                <span className="text-[10px] text-neutral-500 block">Full grid telemetry probe</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
            </a>

            <a
              href="#live-telemetry-ferrari"
              className="p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 text-white transition flex items-center justify-between group"
            >
              <div>
                <span className="font-bold block group-hover:text-ferrari-yellow transition-colors">
                  Ferrari Dual Command
                </span>
                <span className="text-[10px] text-neutral-500 block">Leclerc #16 & Hamilton #44</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
            </a>

            <a
              href="#telemetry-replay"
              className="p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 text-white transition flex items-center justify-between group"
            >
              <div>
                <span className="font-bold block group-hover:text-cyan-400 transition-colors">
                  Historical Replay
                </span>
                <span className="text-[10px] text-neutral-500 block">Authentic recorded sessions</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
            </a>

            <a
              href="#telemetry-compare"
              className="p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 text-white transition flex items-center justify-between group"
            >
              <div>
                <span className="font-bold block group-hover:text-emerald-400 transition-colors">
                  Driver Comparator
                </span>
                <span className="text-[10px] text-neutral-500 block">Official career audit</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TelemetryDashboard
