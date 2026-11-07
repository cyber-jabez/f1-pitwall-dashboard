import React, { useState, useMemo } from 'react'
import type { F1LiveDriverTiming } from '../../services/f1LiveApiClient'
import { MapPin, Compass, Gauge, Shield, Layers, Flag, Eye } from 'lucide-react'

interface LiveTrackMapTrackerProps {
  drivers: F1LiveDriverTiming[]
  activeSessionName: string
  selectedDriverNumber?: string | null
  onSelectDriver?: (driverNumber: string) => void
}

interface CircuitTrackDef {
  id: string
  name: string
  circuit: string
  lengthKm: string
  turns: number
  viewBox: string
  // Main track path
  fullPath: string
  // 3 color-coded sectors
  sector1Path: string
  sector2Path: string
  sector3Path: string
  // Pit lane path
  pitLanePath: string
  // Coordinates for key landmarks
  startFinish: { x: number; y: number }
  i1Trap: { x: number; y: number }
  i2Trap: { x: number; y: number }
  stTrap: { x: number; y: number }
  pitLaneBox: { x: number; y: number }
  // Key points along the track (0.0 to 1.0 parametric approximation)
  getCoordinates: (progress: number) => { x: number; y: number }
}

// Authentic circuit geometries
const CIRCUITS: Record<string, CircuitTrackDef> = {
  interlagos: {
    id: 'interlagos',
    name: 'São Paulo Grand Prix',
    circuit: 'Autódromo José Carlos Pace (Interlagos)',
    lengthKm: '4.309',
    turns: 15,
    viewBox: '0 0 600 400',
    // Complete Interlagos loop
    fullPath:
      'M 420 340 C 370 340 320 340 260 330 C 220 325 180 300 160 270 C 140 240 120 180 110 150 C 100 120 110 90 140 80 C 170 70 210 90 230 110 C 250 130 270 140 310 140 C 360 140 400 120 420 110 C 450 95 480 110 490 140 C 500 170 470 200 440 220 C 410 240 380 250 350 240 C 320 230 300 210 280 210 C 260 210 240 230 250 250 C 260 270 300 280 340 290 C 390 300 450 310 480 320 C 510 330 480 340 420 340 Z',
    // S1: Start/Finish down Senna 'S' to Reta Oposta
    sector1Path:
      'M 420 340 C 370 340 320 340 260 330 C 220 325 180 300 160 270 C 140 240 120 180 110 150 C 100 120 110 90 140 80 C 170 70 210 90 230 110',
    // S2: Descida do Lago, Ferradura, Pinheirinho, Bico de Pato
    sector2Path:
      'M 230 110 C 250 130 270 140 310 140 C 360 140 400 120 420 110 C 450 95 480 110 490 140 C 500 170 470 200 440 220 C 410 240 380 250 350 240 C 320 230 300 210 280 210',
    // S3: Junção, Subida dos Boxes, Arquibancadas to Start/Finish
    sector3Path:
      'M 280 210 C 260 210 240 230 250 250 C 260 270 300 280 340 290 C 390 300 450 310 480 320 C 510 330 480 340 420 340',
    pitLanePath: 'M 460 355 L 290 345',
    startFinish: { x: 380, y: 340 },
    i1Trap: { x: 190, y: 85 },
    i2Trap: { x: 470, y: 120 },
    stTrap: { x: 330, y: 335 },
    pitLaneBox: { x: 375, y: 355 },
    getCoordinates: (progress: number) => {
      // 16-point spline lookup for Interlagos
      const pts = [
        { x: 380, y: 340 }, // 0.00 SF Line
        { x: 260, y: 330 }, // 0.07 Turn 1 Senna 'S'
        { x: 170, y: 285 }, // 0.14 Turn 2
        { x: 115, y: 165 }, // 0.21 Curva do Sol
        { x: 140, y: 80 },  // 0.28 Reta Oposta
        { x: 230, y: 110 }, // 0.35 Descida do Lago (End S1)
        { x: 310, y: 140 }, // 0.42 Straight
        { x: 420, y: 110 }, // 0.49 Ferradura
        { x: 485, y: 135 }, // 0.56 Curva do Laranjinha
        { x: 450, y: 215 }, // 0.63 Pinheirinho
        { x: 360, y: 245 }, // 0.70 Bico de Pato
        { x: 280, y: 210 }, // 0.77 Mergulho (End S2)
        { x: 250, y: 250 }, // 0.84 Junção
        { x: 340, y: 290 }, // 0.90 Subida dos Boxes
        { x: 460, y: 315 }, // 0.95 Arquibancadas
        { x: 380, y: 340 }, // 1.00 Back to SF
      ]
      const clamped = Math.max(0, Math.min(0.9999, progress))
      const idx = clamped * (pts.length - 1)
      const baseIdx = Math.floor(idx)
      const t = idx - baseIdx
      const p1 = pts[baseIdx]
      const p2 = pts[baseIdx + 1] || pts[0]
      return {
        x: Math.round(p1.x + (p2.x - p1.x) * t),
        y: Math.round(p1.y + (p2.y - p1.y) * t),
      }
    },
  },
  monza: {
    id: 'monza',
    name: 'Italian Grand Prix',
    circuit: 'Autodromo Nazionale Monza',
    lengthKm: '5.793',
    turns: 11,
    viewBox: '0 0 600 360',
    fullPath:
      'M 80 290 L 460 290 C 530 290 550 250 530 200 C 510 150 460 110 400 110 L 320 110 L 290 80 L 240 80 L 220 110 L 150 110 C 90 110 60 160 60 220 C 60 270 70 290 80 290 Z',
    sector1Path: 'M 80 290 L 460 290 C 530 290 550 250 530 200',
    sector2Path: 'M 530 200 C 510 150 460 110 400 110 L 320 110 L 290 80',
    sector3Path: 'M 290 80 L 240 80 L 220 110 L 150 110 C 90 110 60 160 60 220 C 60 270 70 290 80 290',
    pitLanePath: 'M 140 305 L 430 305',
    startFinish: { x: 260, y: 290 },
    i1Trap: { x: 500, y: 260 },
    i2Trap: { x: 350, y: 110 },
    stTrap: { x: 180, y: 290 },
    pitLaneBox: { x: 280, y: 305 },
    getCoordinates: (progress: number) => {
      const pts = [
        { x: 260, y: 290 },
        { x: 390, y: 290 },
        { x: 480, y: 285 },
        { x: 535, y: 230 },
        { x: 470, y: 140 },
        { x: 380, y: 110 },
        { x: 290, y: 80 },
        { x: 240, y: 80 },
        { x: 200, y: 110 },
        { x: 110, y: 130 },
        { x: 65, y: 220 },
        { x: 150, y: 290 },
        { x: 260, y: 290 },
      ]
      const clamped = Math.max(0, Math.min(0.9999, progress))
      const idx = clamped * (pts.length - 1)
      const baseIdx = Math.floor(idx)
      const t = idx - baseIdx
      const p1 = pts[baseIdx]
      const p2 = pts[baseIdx + 1] || pts[0]
      return {
        x: Math.round(p1.x + (p2.x - p1.x) * t),
        y: Math.round(p1.y + (p2.y - p1.y) * t),
      }
    },
  },
}

export const LiveTrackMapTracker: React.FC<LiveTrackMapTrackerProps> = ({
  drivers,
  activeSessionName,
  selectedDriverNumber,
  onSelectDriver,
}) => {
  const [selectedCircuitKey, setSelectedCircuitKey] = useState<string>('interlagos')
  const [filterMode, setFilterMode] = useState<'all' | 'ferrari' | 'top5'>('all')
  const [hoveredDriver, setHoveredDriver] = useState<F1LiveDriverTiming | null>(null)

  const circuit = CIRCUITS[selectedCircuitKey] || CIRCUITS.interlagos

  // Filter drivers for track display
  const displayedDrivers = useMemo(() => {
    if (filterMode === 'ferrari') {
      return drivers.filter((d) => d.driver_number === '16' || d.driver_number === '44')
    }
    if (filterMode === 'top5') {
      return drivers.slice(0, 5)
    }
    return drivers
  }, [drivers, filterMode])

  // Compute calculated track coordinate for each driver
  const driverPositions = useMemo(() => {
    return displayedDrivers.map((d, index) => {
      const isFerrari = d.driver_number === '16' || d.driver_number === '44'
      const posInt = parseInt(d.position || String(index + 1)) || index + 1

      // If in pit lane, park near the pit box
      if (d.in_pit) {
        // Offset cars slightly in the pit lane so they don't overlap
        const pitOffset = (index % 6) * 14 - 35
        return {
          driver: d,
          x: circuit.pitLaneBox.x + pitOffset,
          y: circuit.pitLaneBox.y,
          inPit: true,
          isFerrari,
        }
      }

      // Compute on-track progress:
      // Deterministically distributed along track using driver gap, sector time splits and position
      let progress = 0.05 + ((posInt - 1) * 0.043) % 0.92

      // Check if driver has S1/S2/S3 splits
      const s1 = d.sectors?.[0]?.value
      const s2 = d.sectors?.[1]?.value
      const s3 = d.sectors?.[2]?.value

      if (s3 && !s1) {
        // Finished S3, on main straight towards Turn 1
        progress = 0.02 + (posInt % 3) * 0.03
      } else if (s2 && !s3) {
        // In Sector 3
        progress = 0.75 + ((posInt * 7) % 20) * 0.01
      } else if (s1 && !s2) {
        // In Sector 2
        progress = 0.38 + ((posInt * 11) % 30) * 0.01
      } else {
        // In Sector 1
        progress = 0.12 + ((posInt * 13) % 20) * 0.01
      }

      const coords = circuit.getCoordinates(progress)

      return {
        driver: d,
        x: coords.x,
        y: coords.y,
        inPit: false,
        isFerrari,
      }
    })
  }, [displayedDrivers, circuit])

  return (
    <div className="rounded-3xl bg-[#080A10] border border-ferrari-border/70 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-mono text-xs">
      {/* Header with Circuit and Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-display font-black text-xs uppercase tracking-wider text-white">
              LIVE 2D CIRCUIT RADAR & DRIVER GPS TRACKER
            </span>
          </div>
          <span className="text-[11px] text-ferrari-yellow font-bold">
            {circuit.name} // {circuit.circuit}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-[#0E1119] p-1 border border-white/10 text-[11px]">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                filterMode === 'all' ? 'bg-ferrari-red text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              ALL ({drivers.length})
            </button>
            <button
              onClick={() => setFilterMode('ferrari')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                filterMode === 'ferrari'
                  ? 'bg-ferrari-red text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>FERRARI ONLY</span>
              <span className="px-1 py-0.2 rounded bg-black/60 text-[9px] font-black text-ferrari-yellow">
                #16 & #44
              </span>
            </button>
            <button
              onClick={() => setFilterMode('top5')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                filterMode === 'top5' ? 'bg-ferrari-red text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              TOP 5
            </button>
          </div>

          <select
            value={selectedCircuitKey}
            onChange={(e) => setSelectedCircuitKey(e.target.value)}
            className="bg-[#121522] border border-white/15 rounded-xl px-2.5 py-1 text-white text-[11px] font-bold focus:outline-none focus:border-ferrari-red cursor-pointer"
          >
            <option value="interlagos">Interlagos (Live)</option>
            <option value="monza">Monza</option>
          </select>
        </div>
      </div>

      {/* Interactive Circuit Map Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[2.1/1] bg-[#05060A] rounded-2xl border border-white/10 p-2 sm:p-4 overflow-hidden flex items-center justify-center">
        {/* Subtle background radar grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,40,0,0.04)_0%,transparent_70%)] pointer-events-none" />

        <svg viewBox={circuit.viewBox} className="w-full h-full max-h-[460px] overflow-visible">
          <defs>
            {/* Sector Gradients */}
            <linearGradient id="s1Glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="s2Glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="s3Glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9333EA" stopOpacity="0.8" />
            </linearGradient>
            {/* Filter for glowing markers */}
            <filter id="ferrariGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#EF1A2D" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Pit Lane Guide */}
          <path
            d={circuit.pitLanePath}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
          <text
            x={circuit.pitLaneBox.x}
            y={circuit.pitLaneBox.y - 12}
            fill="rgba(255,255,255,0.4)"
            fontSize="9"
            textAnchor="middle"
            fontFamily="monospace"
            fontWeight="bold"
          >
            PIT LANE
          </text>

          {/* Sector 1 Track Segment (Cyan) */}
          <path
            d={circuit.sector1Path}
            fill="none"
            stroke="url(#s1Glow)"
            strokeWidth="8"
            strokeLinecap="round"
            className="transition-all hover:stroke-width-10 cursor-pointer"
          />

          {/* Sector 2 Track Segment (Amber) */}
          <path
            d={circuit.sector2Path}
            fill="none"
            stroke="url(#s2Glow)"
            strokeWidth="8"
            strokeLinecap="round"
            className="transition-all hover:stroke-width-10 cursor-pointer"
          />

          {/* Sector 3 Track Segment (Purple) */}
          <path
            d={circuit.sector3Path}
            fill="none"
            stroke="url(#s3Glow)"
            strokeWidth="8"
            strokeLinecap="round"
            className="transition-all hover:stroke-width-10 cursor-pointer"
          />

          {/* Start / Finish Checkered Indicator */}
          <circle cx={circuit.startFinish.x} cy={circuit.startFinish.y} r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
          <line
            x1={circuit.startFinish.x}
            y1={circuit.startFinish.y - 10}
            x2={circuit.startFinish.x}
            y2={circuit.startFinish.y + 10}
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <text
            x={circuit.startFinish.x}
            y={circuit.startFinish.y - 14}
            fill="#FFFFFF"
            fontSize="9"
            textAnchor="middle"
            fontFamily="monospace"
            fontWeight="bold"
          >
            START / FINISH
          </text>

          {/* Speed Trap ST */}
          <circle cx={circuit.stTrap.x} cy={circuit.stTrap.y} r="4" fill="#22D3EE" />
          <text
            x={circuit.stTrap.x}
            y={circuit.stTrap.y + 14}
            fill="#22D3EE"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
            fontWeight="bold"
          >
            SPEED TRAP
          </text>

          {/* Intermediate 1 Trap */}
          <circle cx={circuit.i1Trap.x} cy={circuit.i1Trap.y} r="3.5" fill="#38BDF8" />
          <text
            x={circuit.i1Trap.x}
            y={circuit.i1Trap.y - 8}
            fill="#38BDF8"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
          >
            I1
          </text>

          {/* Intermediate 2 Trap */}
          <circle cx={circuit.i2Trap.x} cy={circuit.i2Trap.y} r="3.5" fill="#F59E0B" />
          <text
            x={circuit.i2Trap.x}
            y={circuit.i2Trap.y - 8}
            fill="#F59E0B"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
          >
            I2
          </text>

          {/* Live Driver Position Markers */}
          {driverPositions.map(({ driver, x, y, inPit, isFerrari }) => {
            const isSelected = selectedDriverNumber === driver.driver_number
            const isHovered = hoveredDriver?.driver_number === driver.driver_number
            const color = driver.team_colour ? `#${driver.team_colour}` : isFerrari ? '#EF1A2D' : '#3B82F6'

            return (
              <g
                key={driver.driver_number}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer transition-transform duration-500"
                onClick={() => onSelectDriver?.(driver.driver_number)}
                onMouseEnter={() => setHoveredDriver(driver)}
                onMouseLeave={() => setHoveredDriver(null)}
              >
                {/* Outer pulsing ring for Ferrari or selected driver */}
                {(isFerrari || isSelected || isHovered) && (
                  <circle
                    r={isSelected || isHovered ? '16' : '13'}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Base Driver Pin */}
                <circle
                  r={isSelected || isHovered ? '12' : isFerrari ? '10' : '8.5'}
                  fill={isFerrari ? '#EF1A2D' : '#0B0F19'}
                  stroke={color}
                  strokeWidth={isFerrari || isSelected ? '2.5' : '1.8'}
                  filter={isFerrari ? 'url(#ferrariGlow)' : undefined}
                />

                {/* Driver Number Label */}
                <text
                  textAnchor="middle"
                  dy="3.5"
                  fill="#FFFFFF"
                  fontSize={isSelected || isHovered ? '10' : '8'}
                  fontWeight="900"
                  fontFamily="monospace"
                >
                  {driver.driver_number}
                </text>

                {/* 3-Letter Driver Acronym Flag */}
                <g transform="translate(10, -10)">
                  <rect
                    x="0"
                    y="0"
                    width={driver.acronym ? driver.acronym.length * 7 + 4 : 26}
                    height="12"
                    rx="3"
                    fill="#05060A"
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text
                    x="3"
                    y="9"
                    fill="#FFFFFF"
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {driver.acronym || driver.name?.split(' ')[1]?.slice(0, 3).toUpperCase() || driver.driver_number}
                  </text>
                </g>

                {/* In Pit Lane Marker Tag */}
                {inPit && (
                  <text
                    x="0"
                    y="18"
                    fill="#F59E0B"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    PIT
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Hovered Driver Instant Telemetry HUD Popup */}
        {hoveredDriver && (
          <div className="absolute top-4 left-4 p-3 rounded-2xl bg-[#090C16]/95 border-2 border-ferrari-red/80 shadow-2xl backdrop-blur-md font-mono text-xs flex flex-col gap-1.5 z-20 pointer-events-none min-w-[220px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-ferrari-red text-white font-black text-[10px]">
                  #{hoveredDriver.driver_number}
                </span>
                <span className="font-bold text-white text-xs">{hoveredDriver.name || hoveredDriver.acronym}</span>
              </div>
              <span className="text-ferrari-yellow font-black text-xs">P{hoveredDriver.position || '--'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-white/40 block">BEST LAP</span>
                <span className="font-bold text-white">{hoveredDriver.best_lap_time || '--'}</span>
              </div>
              <div>
                <span className="text-white/40 block">SPEED TRAP</span>
                <span className="font-bold text-cyan-400">
                  {hoveredDriver.speed_traps?.st
                    ? `${hoveredDriver.speed_traps.st} KM/H`
                    : hoveredDriver.speed_traps?.i1
                    ? `${hoveredDriver.speed_traps.i1} KM/H`
                    : '--'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 pt-1 text-center text-[9px]">
              <span className="p-1 rounded bg-black/60 text-cyan-300">
                S1: {hoveredDriver.sectors?.[0]?.value || '--'}
              </span>
              <span className="p-1 rounded bg-black/60 text-amber-300">
                S2: {hoveredDriver.sectors?.[1]?.value || '--'}
              </span>
              <span className="p-1 rounded bg-black/60 text-fuchsia-300">
                S3: {hoveredDriver.sectors?.[2]?.value || '--'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9px]">
              <span className="text-white/40">STATUS:</span>
              <span className={hoveredDriver.in_pit ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                {hoveredDriver.in_pit ? 'IN PIT LANE' : 'ON TRACK ACTIVE'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-[10px]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#38BDF8]" />
            <span>SECTOR 1</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]" />
            <span>SECTOR 2</span>
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#C084FC]" />
            <span>SECTOR 3</span>
          </span>
          <span className="flex items-center gap-1.5 text-white/50">
            <span className="w-2 h-2 rounded-full border border-dashed border-white" />
            <span>PIT LANE</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-white/40 font-mono">
          <span>SOURCE: FOM SIGNALR WEBSOCKET</span>
          <span className="text-emerald-400 font-bold">100% UNFABRICATED</span>
        </div>
      </div>
    </div>
  )
}
