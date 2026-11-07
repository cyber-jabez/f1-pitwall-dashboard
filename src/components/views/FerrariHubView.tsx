import React, { useState } from 'react'
import { HISTORIC_FERRARI_CARS, DRIVERS } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { FerrariAudioEngine } from '../audio/WebAudioEngine'
import Ferrari3DViewer, { CarConfig } from '../3d/Ferrari3DViewer'
import SteeringWheelSimulator from '../sections/SteeringWheelSimulator'
import { Trophy, Flame, Shield, Award, Sparkles, ChevronRight, Zap } from 'lucide-react'

interface FerrariHubViewProps {
  audioEngine: FerrariAudioEngine
}

export const FerrariHubView: React.FC<FerrariHubViewProps> = ({ audioEngine }) => {
  const [selectedHistoricCar, setSelectedHistoricCar] = useState(HISTORIC_FERRARI_CARS[0])
  const [carConfig, setCarConfig] = useState<CarConfig>({
    paintColor: '#FF2800',
    paintName: 'Rosso Corsa',
    caliperColor: '#FED500',
    caliperName: 'Giallo Modena',
    rimStyle: 'forged',
    livery: 'tricolore',
    headlightsOn: true,
    activeAero: true,
    autoRotate: true,
    viewMode: 'exterior',
    manettino: 'race',
  })

  const leclerc = DRIVERS.find((d) => d.id === 'charles-leclerc')!
  const hamilton = DRIVERS.find((d) => d.id === 'lewis-hamilton')!

  return (
    <div className="min-h-screen bg-[#06070B] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-ferrari-red animate-ping" />
            <span className="font-mono text-xs text-ferrari-yellow font-bold uppercase tracking-widest">
              CORSE CLIENTI // MARANELLO SANCTUARY
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white flex items-center gap-3">
            SCUDERIA <ShinyText text="FERRARI HUB" speed={2.2} className="text-ferrari-red" />
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#live-telemetry-ferrari"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-ferrari-red to-[#B80000] text-white font-mono text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,40,0,0.5)] transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>FERRARI LIVE TELEMETRY</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Ferrari Driver Lineup: Leclerc & Hamilton Side-by-Side */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-ferrari-red" />
            <h2 className="font-display font-black text-2xl text-white uppercase">
              2025/2026 SCUDERIA PILOTI LINEUP
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Charles Leclerc */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1E0505] via-[#0E1017] to-[#08090E] border-2 border-ferrari-red/80 shadow-[0_15px_40px_rgba(255,40,0,0.25)] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="w-14 h-14 rounded-2xl bg-ferrari-red text-white font-mono font-black text-2xl flex items-center justify-center shadow-lg">
                    16
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800">
                    IL PREDESTINATO
                  </span>
                </div>
                <h3 className="font-display font-black text-3xl text-white uppercase mb-1">
                  CHARLES LECLERC
                </h3>
                <span className="font-mono text-xs text-ferrari-yellow font-bold uppercase block mb-3">
                  MONZA GP WINNER (2019 & 2024) // 26 POLE POSITIONS
                </span>
                <p className="font-sans text-sm text-white/70 leading-relaxed mb-6">
                  {leclerc.bio}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono text-center pt-4 border-t border-white/10 text-xs">
                <div className="bg-black/40 p-2 rounded-xl">
                  <span className="text-white/40 text-[9px] block">WINS</span>
                  <span className="font-bold text-ferrari-red text-base">{leclerc.wins}</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl">
                  <span className="text-white/40 text-[9px] block">PODIUMS</span>
                  <span className="font-bold text-white text-base">{leclerc.podiums}</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl">
                  <span className="text-white/40 text-[9px] block">POLES</span>
                  <span className="font-bold text-ferrari-yellow text-base">{leclerc.poles}</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl">
                  <span className="text-white/40 text-[9px] block">POINTS</span>
                  <span className="font-bold text-emerald-400 text-base">{leclerc.seasonPoints}</span>
                </div>
              </div>
            </div>

            {/* Lewis Hamilton */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1E0505] via-[#0E1017] to-[#08090E] border-2 border-ferrari-yellow/80 shadow-[0_15px_40px_rgba(254,213,0,0.2)] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="w-14 h-14 rounded-2xl bg-ferrari-yellow text-black font-mono font-black text-2xl flex items-center justify-center shadow-lg">
                    44
                  </span>
                  <span className="font-mono text-xs font-bold text-ferrari-yellow bg-amber-950/40 px-3 py-1 rounded-full border border-amber-800">
                    7x WORLD CHAMPION
                  </span>
                </div>
                <h3 className="font-display font-black text-3xl text-white uppercase mb-1">
                  LEWIS HAMILTON
                </h3>
                <span className="font-mono text-xs text-ferrari-yellow font-bold uppercase block mb-3">
                  105 WINS // 201 PODIUMS // 104 POLE POSITIONS
                </span>
                <p className="font-sans text-sm text-white/70 leading-relaxed mb-6">
                  {hamilton.bio}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono text-center pt-4 border-t border-white/10 text-xs">
                <div className="bg-black/40 p-2 rounded-xl">
                  <span className="text-white/40 text-[9px] block">TITLES</span>
                  <span className="font-bold text-ferrari-yellow text-base">{hamilton.championships}</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl">
                  <span className="text-white/40 text-[9px] block">WINS</span>
                  <span className="font-bold text-ferrari-red text-base">{hamilton.wins}</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl">
                  <span className="text-white/40 text-[9px] block">PODIUMS</span>
                  <span className="font-bold text-white text-base">{hamilton.podiums}</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl">
                  <span className="text-white/40 text-[9px] block">POINTS</span>
                  <span className="font-bold text-emerald-400 text-base">{hamilton.seasonPoints}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Atelier Configurator Embed */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-ferrari-yellow" />
            <h2 className="font-display font-black text-2xl text-white uppercase">
              MARANELLO 3D ATELIER // TAILOR MADE CONFIGURATOR
            </h2>
          </div>
          <div className="h-[520px] rounded-3xl overflow-hidden border-2 border-ferrari-border shadow-2xl">
            <Ferrari3DViewer config={carConfig} onConfigChange={setCarConfig} />
          </div>
        </div>

        {/* Steering Wheel Simulator Embed */}
        <SteeringWheelSimulator audioEngine={audioEngine} />

        {/* Historic Ferrari Cars Archive */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-ferrari-yellow" />
            <h2 className="font-display font-black text-2xl text-white uppercase">
              HISTORIC FERRARI CARS ARCHIVE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HISTORIC_FERRARI_CARS.map((car) => (
              <div
                key={car.name}
                onClick={() => setSelectedHistoricCar(car)}
                className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedHistoricCar.name === car.name
                    ? 'bg-gradient-to-br from-[#1C0505] to-[#0A0D14] border-ferrari-red shadow-[0_0_25px_rgba(255,40,0,0.3)] scale-[1.02]'
                    : 'bg-[#0B0D14] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <span className="font-mono text-xs text-ferrari-yellow font-bold block mb-1">
                    SEASON {car.season}
                  </span>
                  <h3 className="font-display font-black text-xl text-white uppercase mb-2">
                    {car.name}
                  </h3>
                  <p className="font-sans text-xs text-white/60 mb-4 line-clamp-3">
                    {car.historicalSignificance}
                  </p>
                </div>

                <div className="font-mono text-[10px] text-white/50 pt-3 border-t border-white/10">
                  <span className="text-white block font-bold truncate">{car.engine}</span>
                  <span className="text-emerald-400 block mt-1">{car.championshipsWon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FerrariHubView
