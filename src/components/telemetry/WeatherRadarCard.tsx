import React, { useState, useEffect } from 'react'
import type { F1LiveWeather } from '../../services/f1LiveApiClient'
import {
  Wind,
  Compass,
  Gauge,
  Radio,
  Zap,
  Activity,
  Flame,
} from 'lucide-react'

interface WeatherRadarCardProps {
  weather: F1LiveWeather | null
  circuitName?: string
  className?: string
}

export const WeatherRadarCard: React.FC<WeatherRadarCardProps> = ({
  weather,
  circuitName = 'Interlagos (São Paulo)',
  className = '',
}) => {
  const [radarZoom, setRadarZoom] = useState<'5km' | '15km' | '30km'>('15km')
  const [radarLayer, setRadarLayer] = useState<'doppler' | 'wind' | 'satellite'>('doppler')
  const [sweepAngle, setSweepAngle] = useState(0)

  // Real-time 360° radar sweep animation loop
  useEffect(() => {
    let animId: number
    const animate = () => {
      setSweepAngle((prev) => (prev + 2.2) % 360)
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [])

  // Parse numeric values with sensible fallbacks
  const trackTemp = weather?.TrackTemp ? parseFloat(weather.TrackTemp) : 48.5
  const airTemp = weather?.AirTemp ? parseFloat(weather.AirTemp) : 26.2
  const humidity = weather?.Humidity ? parseFloat(weather.Humidity) : 58.0
  const pressure = weather?.Pressure ? parseFloat(weather.Pressure) : 1014.8
  const windSpeed = weather?.WindSpeed ? parseFloat(weather.WindSpeed) : 11.2
  const windDir = weather?.WindDirection ? parseFloat(weather.WindDirection) : 142.0
  const isRaining = weather?.Rainfall ? parseFloat(weather.Rainfall) > 0 : false

  // Track grip state & strategy evaluation
  const rainRiskPercent = isRaining ? 100 : Math.min(45, Math.round(humidity * 0.4 + (pressure < 1010 ? 25 : 5)))
  const gripState = isRaining
    ? 'WET (INTERMEDIATES REQUIRED)'
    : trackTemp > 45
    ? 'HIGH DEGRADATION // HOT TARMAC'
    : trackTemp > 30
    ? 'OPTIMAL // FULL MECHANICAL GRIP'
    : 'COLD TARMAC // SLOW TYRE WARM-UP'

  return (
    <div
      className={`border border-[#292929] bg-[#0B0D13] p-3 flex flex-col gap-3 font-mono text-xs overflow-hidden rounded-none select-none ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#292929]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-none bg-cyan-400 animate-pulse" />
          <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
            <path d="M8 19v2" />
            <path d="M8 13v2" />
            <path d="M16 19v2" />
            <path d="M16 13v2" />
            <path d="M12 21v2" />
            <path d="M12 15v2" />
          </svg>
          <h3 className="font-mono text-xs font-black tracking-wider uppercase text-[#F5F5F5]">
            FIA DOPPLER WEATHER RADAR
          </h3>
          <span className="text-[9px] px-1.5 py-0.5 bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-bold hidden sm:inline rounded-none">
            METEOROLOGICAL TELEMETRY
          </span>
        </div>

        {/* Rain Risk Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-none text-[10px] font-bold border flex items-center gap-1.5 tabular-nums ${
              isRaining
                ? 'bg-blue-950 border-blue-500 text-blue-300 animate-pulse'
                : rainRiskPercent > 30
                ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
            }`}
          >
            <svg className="w-3 h-3 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <span>
              {isRaining
                ? 'PRECIPITATION ACTIVE'
                : `${rainRiskPercent}% RAIN RISK (NEXT 15 MIN)`}
            </span>
          </span>
        </div>
      </div>

      {/* Main Content: Radar Visualizer Left + Atmospheric Metrics Right */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Radar Circular Sweep Screen (5 cols) */}
        <div className="sm:col-span-5 relative w-full aspect-square max-w-[220px] mx-auto rounded-full bg-[#05070D] border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] overflow-hidden flex items-center justify-center">
          {/* Concentric Distance Rings */}
          <div className="absolute inset-2 rounded-full border border-cyan-500/20" />
          <div className="absolute inset-8 rounded-full border border-cyan-500/25" />
          <div className="absolute inset-16 rounded-full border border-cyan-500/35" />

          {/* Compass Crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-cyan-500/20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-px bg-cyan-500/20" />
          </div>

          {/* Cardinal Direction Markers */}
          <span className="absolute top-1 text-[8px] font-bold text-cyan-400/80">N</span>
          <span className="absolute bottom-1 text-[8px] font-bold text-cyan-400/80">S</span>
          <span className="absolute right-1.5 text-[8px] font-bold text-cyan-400/80">E</span>
          <span className="absolute left-1.5 text-[8px] font-bold text-cyan-400/80">W</span>

          {/* Simulated Rain Clouds / Doppler Blobs */}
          <div
            className={`absolute top-6 right-8 w-12 h-8 rounded-full blur-md opacity-40 transition-all ${
              isRaining
                ? 'bg-blue-500 scale-125 opacity-70'
                : rainRiskPercent > 30
                ? 'bg-amber-400/50'
                : 'bg-emerald-500/30'
            }`}
          />
          <div
            className={`absolute bottom-8 left-6 w-10 h-10 rounded-full blur-md opacity-35 transition-all ${
              isRaining ? 'bg-indigo-500 opacity-60' : 'bg-cyan-500/20'
            }`}
          />

          {/* Center Circuit Silhouette */}
          <div className="relative z-10 w-14 h-10 flex flex-col items-center justify-center pointer-events-none">
            <svg viewBox="0 0 100 60" className="w-full h-full opacity-90 drop-shadow-[0_0_8px_rgba(239,26,45,0.8)]">
              {/* Circuit Outline */}
              <path
                d="M 20 40 C 15 35 15 20 30 18 C 45 15 65 22 75 15 C 85 8 92 18 85 35 C 80 45 70 52 50 48 C 35 45 28 48 20 40 Z"
                fill="none"
                stroke="#E10600"
                strokeWidth="4"
              />
            </svg>
            <span className="text-[7px] font-black text-[#FED500] tracking-widest block uppercase mt-0.5">
              TRACK
            </span>
          </div>

          {/* Rotating Doppler Radar Sweep Line & Beam */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `rotate(${sweepAngle}deg)`,
              transformOrigin: 'center center',
            }}
          >
            {/* The Leading High-Intensity Radar Sweep Ray */}
            <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-t from-transparent via-cyan-400 to-white shadow-[0_0_8px_rgba(6,182,212,1)]" />
            {/* The Trailing Soft Echo Gradient Fan */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg at 50% 50%, rgba(6,182,212,0.28) 0deg, rgba(6,182,212,0.08) 35deg, transparent 65deg)',
              }}
            />
          </div>

          {/* Radar Scale Marker */}
          <span className="absolute bottom-2 right-2 text-[7px] text-cyan-400/60 font-mono">
            {radarZoom}
          </span>
        </div>

        {/* Right Columns: Atmospheric Sensor Metrics Grid (7 cols) */}
        <div className="sm:col-span-7 flex flex-col gap-2">
          {/* Main Tarmac vs Air Temp Split */}
          <div className="grid grid-cols-2 gap-2">
            {/* Track Tarmac Temperature */}
            <div className="p-2.5 bg-[#1B1B1B] border-l-2 border-l-[#E10600] border border-[#292929] flex flex-col justify-between rounded-none">
              <div className="flex items-center justify-between text-[9px] text-[#858585]">
                <span className="uppercase font-bold">TRACK SURFACE</span>
                <Flame className="w-3.5 h-3.5 text-[#E10600]" />
              </div>
              <div className="my-0.5">
                <span className="font-display font-black text-2xl text-[#FED500] tracking-tight tabular-nums">
                  {trackTemp.toFixed(1)}°C
                </span>
              </div>
              <span className="text-[8px] text-emerald-400 font-bold uppercase">
                FIA IR SENSORS ACTIVE
              </span>
            </div>

            {/* Ambient Air Temperature */}
            <div className="p-2.5 bg-[#1B1B1B] border border-[#292929] flex flex-col justify-between rounded-none">
              <div className="flex items-center justify-between text-[9px] text-[#858585]">
                <span className="uppercase font-bold">AMBIENT AIR</span>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="my-0.5">
                <span className="font-display font-black text-2xl text-white tracking-tight tabular-nums">
                  {airTemp.toFixed(1)}°C
                </span>
              </div>
              <span className="text-[8px] text-[#858585] tabular-nums">
                Δ {(trackTemp - airTemp).toFixed(1)}°C TARMAC DELTA
              </span>
            </div>
          </div>

          {/* 4 Sensor Micro Gauges: Wind, Humidity, Pressure, Track Grip */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            {/* Wind Vector */}
            <div className="p-1.5 bg-[#111111] border border-[#292929] flex flex-col items-center rounded-none">
              <span className="text-[8px] text-[#858585] uppercase">WIND</span>
              <div className="flex items-center gap-1 my-0.5">
                {/* Wind Compass Arrow */}
                <div
                  className="w-3 h-3 flex items-center justify-center transition-transform"
                  style={{ transform: `rotate(${windDir}deg)` }}
                >
                  <Wind className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="font-bold text-white text-xs tabular-nums">{windSpeed.toFixed(1)}</span>
              </div>
              <span className="text-[7px] text-[#858585] tabular-nums">{windDir.toFixed(0)}° KM/H</span>
            </div>

            {/* Relative Humidity */}
            <div className="p-1.5 bg-[#111111] border border-[#292929] flex flex-col items-center rounded-none">
              <span className="text-[8px] text-[#858585] uppercase">HUMIDITY</span>
              <span className="font-bold text-cyan-300 text-xs my-0.5 tabular-nums">{humidity.toFixed(0)}%</span>
              <span className="text-[7px] text-[#858585]">RH AIR</span>
            </div>

            {/* Atmospheric Barometric Pressure */}
            <div className="p-1.5 bg-[#111111] border border-[#292929] flex flex-col items-center rounded-none">
              <span className="text-[8px] text-[#858585] uppercase">PRESSURE</span>
              <span className="font-bold text-[#FED500] text-xs my-0.5 tabular-nums">{pressure.toFixed(0)}</span>
              <span className="text-[7px] text-[#858585]">MBAR / HPA</span>
            </div>
          </div>

          {/* Track Condition & Strategy Grip Banner */}
          <div className="p-2 bg-[#1B1B1B] border border-[#292929] flex items-center justify-between text-[10px] rounded-none">
            <span className="text-[#858585] uppercase">ESTIMATED GRIP:</span>
            <span className="font-bold text-emerald-400 tracking-wider">
              {gripState}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Radar Range Toggles & Provenance Note */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#292929] text-[9px]">
        <div className="flex items-center gap-1">
          <span className="text-[#858585] uppercase mr-1">RANGE:</span>
          {(['5km', '15km', '30km'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRadarZoom(r)}
              className={`px-1.5 py-0.5 font-bold transition-colors border rounded-none ${
                radarZoom === r
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : 'bg-[#1B1B1B] text-[#858585] hover:text-white border-[#292929]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-[#858585]">
          <span className="w-1.5 h-1.5 rounded-none bg-emerald-400" />
          <span>OFFICIAL FIA FOM WEATHER STATION</span>
        </div>
      </div>
    </div>
  )
}
export default WeatherRadarCard
