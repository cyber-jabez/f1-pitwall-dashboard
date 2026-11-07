import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Shield, Sparkles, Disc, Wrench, Play, CheckCircle2 } from 'lucide-react'
import Ferrari3DViewer, { CarConfig } from '../3d/Ferrari3DViewer'
import ShinyText from '../reactbits/ShinyText'
import DecryptedText from '../reactbits/DecryptedText'

const PAINTS = [
  { name: 'Rosso Corsa', hex: '#D40000', desc: 'The definitive Maranello scarlet racing legend' },
  { name: 'Giallo Modena', hex: '#FED500', desc: 'The canary yellow shield of Enzo’s birthplace' },
  { name: 'Rosso Scuderia', hex: '#FF2800', desc: 'The vibrant electric crimson of modern F1' },
  { name: 'Nero Daytona', hex: '#0D0E12', desc: 'Deep stealth metallic with carbon flecks' },
  { name: 'Bianco Avus', hex: '#F4F5F0', desc: 'Pure racing pearl white with clear gloss' },
  { name: 'Azzurro Dino', hex: '#1565C0', desc: 'Heritage Le Mans blue of the 1960s' }
]

const CALIPERS = [
  { name: 'Rosso Corsa', hex: '#FF2800' },
  { name: 'Giallo Modena', hex: '#FED500' },
  { name: 'Oro Gold', hex: '#E5A91E' },
  { name: 'Carbon Nero', hex: '#1C1E24' }
]

const RIMS = [
  { id: 'forged', name: 'Forged 5-Spoke', finish: 'Matt Grigio Corsa' },
  { id: 'carbon', name: 'Carbon Aerodisc', finish: 'Exposed Twill Weave' },
  { id: 'diamond', name: 'Diamond Spider', finish: 'Bi-Tone Polished Alloy' }
] as const

interface ConfiguratorSectionProps {
  onStartEngineAudio: () => void
}

export const ConfiguratorSection: React.FC<ConfiguratorSectionProps> = ({ onStartEngineAudio }) => {
  const [config, setConfig] = useState<CarConfig>({
    paintColor: '#D40000',
    paintName: 'Rosso Corsa',
    caliperColor: '#FED500',
    caliperName: 'Giallo Modena',
    rimStyle: 'forged',
    livery: 'none',
    headlightsOn: true,
    activeAero: true,
    autoRotate: true
  })

  return (
    <section id="configurator" className="relative py-20 bg-[#07080C] overflow-hidden border-t border-ferrari-border/40">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-ferrari-red/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-ferrari-yellow/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ferrari-red/10 border border-ferrari-red/30 mb-3">
            <Wrench className="w-3.5 h-3.5 text-ferrari-red" />
            <span className="text-xs font-mono tracking-widest text-white/80 uppercase">
              STUDIO DI CONFIGURAZIONE // MARANELLO
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-wider text-white uppercase mb-3">
            TAILOR MADE <ShinyText text="ATELIER 3D" color="#FED500" shineColor="#FFFFFF" />
          </h2>

          <p className="max-w-2xl text-white/60 font-sans text-sm sm:text-base">
            Craft your bespoke Maranello hypercar. Manipulate the 3D model in real time, customize paint, carbon-ceramic calipers, and active aerodynamics.
          </p>
        </div>

        {/* 3D Canvas + Configuration Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 3D Viewer Container (7 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <Ferrari3DViewer config={config} onConfigChange={setConfig} />

            {/* Quick Specs Strip below 3D */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-ferrari-card border border-ferrari-border/60">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">ACTIVE PAINT</span>
                <span className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.paintColor }} />
                  {config.paintName}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">DOWNFORCE</span>
                <span className="text-sm font-mono font-bold text-ferrari-yellow">
                  <DecryptedText text="1,050 KG @ 250 KM/H" speed={30} />
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">AERO WING</span>
                <span className={`text-sm font-mono font-bold ${config.activeAero ? 'text-ferrari-red' : 'text-white/60'}`}>
                  {config.activeAero ? 'HIGH DOWNFORCE (EXTENDED)' : 'LOW DRAG STOWED'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">IGNITION</span>
                <button
                  onClick={onStartEngineAudio}
                  className="text-xs font-mono font-bold text-white bg-ferrari-red/30 hover:bg-ferrari-red px-2.5 py-1 rounded-md border border-ferrari-red transition-all flex items-center gap-1 mt-0.5 active:scale-95"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>START V12</span>
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Controls Sidebar (4 cols on desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-6 p-6 rounded-2xl bg-ferrari-card border border-ferrari-border/80 shadow-2xl">
            {/* 1. Paint Finishes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-ferrari-red" />
                  EXTERIOR PAINT ({PAINTS.length})
                </span>
                <span className="text-xs font-mono text-ferrari-yellow">{config.paintName}</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {PAINTS.map(p => {
                  const isSelected = config.paintColor === p.hex
                  return (
                    <button
                      key={p.name}
                      onClick={() => setConfig({ ...config, paintColor: p.hex, paintName: p.name })}
                      className={`relative flex flex-col items-center p-2.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-ferrari-red bg-ferrari-red/10 shadow-[0_0_15px_rgba(255,40,0,0.3)]'
                          : 'border-ferrari-border hover:border-white/30 bg-ferrari-dark/50'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full shadow-inner border border-white/20 mb-1.5 flex items-center justify-center"
                        style={{ backgroundColor: p.hex }}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white drop-shadow" />}
                      </span>
                      <span className="text-[10px] font-mono text-white/90 text-center truncate w-full">
                        {p.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Brake Calipers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Disc className="w-4 h-4 text-ferrari-yellow" />
                  BREMBO CALIPERS
                </span>
                <span className="text-xs font-mono text-white/70">{config.caliperName}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {CALIPERS.map(c => {
                  const isSelected = config.caliperColor === c.hex
                  return (
                    <button
                      key={c.name}
                      onClick={() => setConfig({ ...config, caliperColor: c.hex, caliperName: c.name })}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? 'border-ferrari-yellow bg-ferrari-yellow/10'
                          : 'border-ferrari-border hover:border-white/20 bg-ferrari-dark/50'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                      <span className="text-[9px] font-mono text-white/80 truncate w-full text-center">{c.name.split(' ')[0]}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Rim Styles */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  WHEEL FORGINGS
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {RIMS.map(r => {
                  const isSelected = config.rimStyle === r.id
                  return (
                    <button
                      key={r.id}
                      onClick={() => setConfig({ ...config, rimStyle: r.id })}
                      className={`px-3 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-ferrari-red bg-ferrari-red/10 text-white'
                          : 'border-ferrari-border text-white/70 hover:border-white/20 bg-ferrari-dark/40'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-mono font-bold">{r.name}</div>
                        <div className="text-[10px] font-mono text-white/50">{r.finish}</div>
                      </div>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-ferrari-red" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 4. Active Aero & Lighting Toggles */}
            <div className="pt-2 border-t border-ferrari-border/60 flex flex-col gap-2.5">
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-white/5">
                <span className="text-xs font-mono text-white/80">Active DRS Rear Wing</span>
                <input
                  type="checkbox"
                  checked={config.activeAero}
                  onChange={e => setConfig({ ...config, activeAero: e.target.checked })}
                  className="accent-ferrari-red w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-white/5">
                <span className="text-xs font-mono text-white/80">Bi-LED Matrix Headlights</span>
                <input
                  type="checkbox"
                  checked={config.headlightsOn}
                  onChange={e => setConfig({ ...config, headlightsOn: e.target.checked })}
                  className="accent-ferrari-yellow w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConfiguratorSection

