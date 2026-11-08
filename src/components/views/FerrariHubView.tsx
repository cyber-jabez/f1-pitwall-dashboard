import React, { useState } from 'react'
import { HISTORIC_FERRARI_CARS, DRIVERS } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import { FerrariAudioEngine } from '../audio/WebAudioEngine'
import Ferrari3DViewer, { CarConfig } from '../3d/Ferrari3DViewer'
import SteeringWheelSimulator from '../sections/SteeringWheelSimulator'
import { Trophy, Shield, Sparkles, Zap } from 'lucide-react'

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
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-[#E10600] animate-pulse" />
            <span className="font-mono text-[10px] text-[#FED500] font-bold uppercase tracking-widest">
              CORSE CLIENTI // MARANELLO SANCTUARY
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white flex items-center gap-3">
            SCUDERIA <ShinyText text="FERRARI HUB" speed={2.2} className="text-[#E10600]" />
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#live-telemetry-ferrari"
            className="px-4 py-2 rounded-none bg-[#E10600] hover:bg-[#B80000] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>FERRARI LIVE TELEMETRY</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Ferrari Driver Lineup: Leclerc & Hamilton Side-by-Side */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#222222]">
            <Shield className="w-4 h-4 text-[#E10600]" />
            <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              2025/2026 SCUDERIA PILOTI LINEUP
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Charles Leclerc */}
            <div className="p-6 rounded-none bg-[#0B0D14] border border-[#292929] border-t-4 border-t-[#E10600] shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="w-12 h-12 rounded-none bg-[#E10600] text-white font-mono font-black text-2xl flex items-center justify-center">
                    16
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-none border border-emerald-800 uppercase">
                    IL PREDESTINATO
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase mb-1">
                  CHARLES LECLERC
                </h3>
                <span className="font-mono text-xs text-[#FED500] font-bold uppercase block mb-3">
                  MONZA GP WINNER (2019 & 2024) // 26 POLE POSITIONS
                </span>
                <p className="font-sans text-xs sm:text-sm text-[#858585] leading-relaxed mb-6">
                  {leclerc.bio}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono text-center pt-3 border-t border-[#222222] text-xs">
                <div className="bg-[#111111] p-2 rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase">WINS</span>
                  <span className="font-bold text-[#E10600] text-base tabular-nums">{leclerc.wins}</span>
                </div>
                <div className="bg-[#111111] p-2 rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase">PODIUMS</span>
                  <span className="font-bold text-white text-base tabular-nums">{leclerc.podiums}</span>
                </div>
                <div className="bg-[#111111] p-2 rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase">POLES</span>
                  <span className="font-bold text-[#FED500] text-base tabular-nums">{leclerc.poles}</span>
                </div>
                <div className="bg-[#111111] p-2 rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase">POINTS</span>
                  <span className="font-bold text-emerald-400 text-base tabular-nums">{leclerc.seasonPoints}</span>
                </div>
              </div>
            </div>

            {/* Lewis Hamilton */}
            <div className="p-6 rounded-none bg-[#0B0D14] border border-[#292929] border-t-4 border-t-[#FED500] shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="w-12 h-12 rounded-none bg-[#FED500] text-black font-mono font-black text-2xl flex items-center justify-center">
                    44
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#FED500] bg-amber-950/40 px-2.5 py-0.5 rounded-none border border-amber-800 uppercase">
                    7x WORLD CHAMPION
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase mb-1">
                  LEWIS HAMILTON
                </h3>
                <span className="font-mono text-xs text-[#FED500] font-bold uppercase block mb-3">
                  105 WINS // 201 PODIUMS // 104 POLE POSITIONS
                </span>
                <p className="font-sans text-xs sm:text-sm text-[#858585] leading-relaxed mb-6">
                  {hamilton.bio}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono text-center pt-3 border-t border-[#222222] text-xs">
                <div className="bg-[#111111] p-2 rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase">TITLES</span>
                  <span className="font-bold text-[#FED500] text-base tabular-nums">{hamilton.championships}</span>
                </div>
                <div className="bg-[#111111] p-2 rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase">WINS</span>
                  <span className="font-bold text-[#E10600] text-base tabular-nums">{hamilton.wins}</span>
                </div>
                <div className="bg-[#111111] p-2 rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase">PODIUMS</span>
                  <span className="font-bold text-white text-base tabular-nums">{hamilton.podiums}</span>
                </div>
                <div className="bg-[#111111] p-2 rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase">POINTS</span>
                  <span className="font-bold text-emerald-400 text-base tabular-nums">{hamilton.seasonPoints}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Atelier Configurator Embed */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#222222]">
            <Sparkles className="w-4 h-4 text-[#FED500]" />
            <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              MARANELLO 3D ATELIER // TAILOR MADE CONFIGURATOR
            </h2>
          </div>
          <div className="h-[520px] rounded-none overflow-hidden border border-[#292929] bg-[#05060A] shadow-2xl">
            <Ferrari3DViewer config={carConfig} onConfigChange={setCarConfig} />
          </div>
        </div>

        {/* Steering Wheel Simulator Embed */}
        <SteeringWheelSimulator audioEngine={audioEngine} />

        {/* Historic Ferrari Cars Archive */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#222222]">
            <Trophy className="w-4 h-4 text-[#FED500]" />
            <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              HISTORIC FERRARI CARS ARCHIVE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HISTORIC_FERRARI_CARS.map((car) => {
              const isSelected = selectedHistoricCar.name === car.name

              return (
                <div
                  key={car.name}
                  onClick={() => setSelectedHistoricCar(car)}
                  className={`p-5 rounded-none border cursor-pointer transition-colors flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#150D10] border-[#E10600] border-l-4 border-l-[#E10600]'
                      : 'bg-[#0E1017] border-[#292929] hover:border-[#444444]'
                  }`}
                >
                  <div>
                    <span className="font-mono text-[10px] text-[#FED500] font-bold block mb-1 uppercase tracking-wider">
                      SEASON {car.season}
                    </span>
                    <h3 className="font-display font-bold text-lg text-white uppercase mb-2">
                      {car.name}
                    </h3>
                    <p className="font-sans text-xs text-[#858585] mb-4 line-clamp-3 leading-relaxed">
                      {car.historicalSignificance}
                    </p>
                  </div>

                  <div className="font-mono text-[10px] text-[#858585] pt-3 border-t border-[#222222]">
                    <span className="text-white block font-bold truncate uppercase">{car.engine}</span>
                    <span className="text-emerald-400 block mt-1 uppercase">{car.championshipsWon}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FerrariHubView
