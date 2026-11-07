import React, { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Heart, Flag, Award, Sparkles, User, ShieldCheck, Download, Flame } from 'lucide-react'
import DecryptedText from '../reactbits/DecryptedText'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import TifosiPassportModal from './TifosiPassportModal'

const QUOTES = [
  {
    quote: 'Ask a child to draw a car, and certainly he will draw it red.',
    context: 'Enzo Ferrari, on why Rosso Corsa is imprinted in humanity'
  },
  {
    quote: 'Aerodynamics are for people who can’t build engines.',
    context: 'Enzo Ferrari, 1960'
  },
  {
    quote: 'The most important victory is the one which has yet to arrive.',
    context: 'Enzo Ferrari’s eternal obsession with perfection'
  },
  {
    quote: 'I have never gone on a real vacation. The best vacation for me is spent in my workshops.',
    context: 'Enzo Ferrari on the devotion of Maranello'
  }
]

export const TifosiWall: React.FC = () => {
  const [tifosiName, setTifosiName] = useState('Enzo Rossi')
  const [selectedDriver, setSelectedDriver] = useState('#16 Charles Leclerc')
  const [chapter, setChapter] = useState('Maranello Official Chapter')
  const [serialCode] = useState(() => `SF-${Math.floor(100000 + Math.random() * 900000)}`)
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false)

  const celebrateTifosi = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.7 },
      colors: ['#008C45', '#FFFFFF', '#CD212A', '#FED500']
    })
  }

  return (
    <section id="tifosi" className="relative py-24 bg-[#07080C] overflow-hidden border-t border-ferrari-border/40">
      {/* Background Italian Tricolore Ambient Glow */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#008C45]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#CD212A]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ferrari-red/10 border border-ferrari-red/30 mb-3">
            <Heart className="w-3.5 h-3.5 text-ferrari-red fill-ferrari-red" />
            <span className="text-xs font-mono tracking-widest text-white/80 uppercase">
              IL CUORE ROSSO // TIFOSI MONOLITH
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-wider text-white uppercase mb-3">
            TIFOSI WALL OF <ShinyText text="SCARLET PASSION" color="#FED500" shineColor="#FFFFFF" />
          </h2>

          <p className="max-w-2xl text-white/60 font-sans text-sm sm:text-base">
            Ferrari is not just a constructor. It is a secular faith held by millions across the globe. Generate your official Scuderia Tifosi Pass.
          </p>
        </div>

        {/* Enzo Quotes Grid with DecryptedText */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {QUOTES.map((q, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-ferrari-card border border-ferrari-border/70 hover:border-ferrari-red/50 transition-all flex flex-col justify-between group"
            >
              <div className="mb-4">
                <span className="text-ferrari-red font-mono text-2xl font-bold leading-none block mb-2">“</span>
                <p className="text-base sm:text-lg font-serif italic text-white/90 leading-relaxed">
                  <DecryptedText text={q.quote} speed={25} />
                </p>
              </div>

              <div className="pt-3 border-t border-ferrari-border/50 text-[11px] font-mono text-ferrari-yellow/80">
                — {q.context}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Holographic Tifosi Pass Badge Studio */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#10121A] via-[#0C0E14] to-[#07080B] border border-ferrari-border shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Customizer (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-ferrari-red" />
                  TIFOSO MEMBER NAME
                </span>
                <input
                  type="text"
                  value={tifosiName}
                  onChange={e => setTifosiName(e.target.value)}
                  maxLength={24}
                  className="w-full px-4 py-2.5 rounded-xl bg-ferrari-dark border border-ferrari-border text-white font-mono text-sm focus:outline-none focus:border-ferrari-red"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white block mb-1">
                  PATRON DRIVER
                </span>
                <select
                  value={selectedDriver}
                  onChange={e => setSelectedDriver(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ferrari-dark border border-ferrari-border text-white font-mono text-xs focus:outline-none focus:border-ferrari-red cursor-pointer"
                >
                  <option value="#16 Charles Leclerc">#16 Charles Leclerc (Il Predestinato)</option>
                  <option value="#44 Lewis Hamilton">#44 Lewis Hamilton (Scuderia 2025)</option>
                  <option value="#55 Carlos Sainz">#55 Carlos Sainz (Smooth Operator)</option>
                  <option value="#1 Michael Schumacher">#1 Michael Schumacher (The Kaiser)</option>
                  <option value="#27 Gilles Villeneuve">#27 Gilles Villeneuve (Pure Spirit)</option>
                </select>
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white block mb-1">
                  GLOBAL CHAPTER
                </span>
                <select
                  value={chapter}
                  onChange={e => setChapter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ferrari-dark border border-ferrari-border text-white font-mono text-xs focus:outline-none focus:border-ferrari-red cursor-pointer"
                >
                  <option value="Maranello Official Chapter">Maranello Official Chapter</option>
                  <option value="Monza Autodromo Curva Sud">Monza Autodromo Curva Sud</option>
                  <option value="London Club Ferrari">London Club Ferrari</option>
                  <option value="Tokyo Scuderia Guild">Tokyo Scuderia Guild</option>
                  <option value="New York Tifosi Legion">New York Tifosi Legion</option>
                </select>
              </div>

              {/* Buttons: Celebrate & Download Pass */}
              <div className="flex flex-col sm:flex-row gap-3 mt-3">
                <button
                  onClick={celebrateTifosi}
                  className="flex-1 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white bg-ferrari-red hover:bg-[#E60000] border border-ferrari-red/60 shadow-[0_0_20px_rgba(255,40,0,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  <span>FORZA FERRARI!</span>
                </button>

                <Magnet padding={40} magnetStrength={2.5}>
                  <button
                    onClick={() => setIsPassportModalOpen(true)}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-ferrari-yellow bg-[#161924] hover:bg-[#1E2333] border border-ferrari-yellow/50 shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Download className="w-4 h-4 text-ferrari-yellow" />
                    <span>EXPORT PASS (PNG)</span>
                  </button>
                </Magnet>
              </div>
            </div>

            {/* Live Rendered Holographic Pass Card (7 cols) */}
            <div className="lg:col-span-7 flex justify-center">
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="relative w-full max-w-md h-64 rounded-2xl p-6 bg-gradient-to-tr from-[#13151D] via-[#1A1C26] to-[#0A0B10] border-2 border-ferrari-red/60 shadow-[0_0_40px_rgba(255,40,0,0.35)] flex flex-col justify-between overflow-hidden select-none"
              >
                {/* Holographic Carbon Fiber Sheen */}
                <div className="absolute inset-0 bg-carbon-mesh opacity-20 pointer-events-none" />
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-ferrari-yellow/15 rounded-full blur-2xl pointer-events-none" />

                {/* Top Badge Strip */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-7 bg-ferrari-yellow rounded-sm border border-black flex items-center justify-center font-display font-black text-black text-xs">
                      SF
                    </div>
                    <div>
                      <span className="font-display font-black text-xs text-white uppercase tracking-wider block">
                        SCUDERIA FERRARI
                      </span>
                      <span className="text-[9px] font-mono text-white/50 tracking-widest uppercase">
                        TIFOSI PASSPORT // 2025-2026
                      </span>
                    </div>
                  </div>

                  {/* Italian Flag Strip */}
                  <div className="flex h-4 w-7 rounded overflow-hidden border border-white/20">
                    <div className="w-1/3 bg-[#008C45]" />
                    <div className="w-1/3 bg-[#FFFFFF]" />
                    <div className="w-1/3 bg-[#CD212A]" />
                  </div>
                </div>

                {/* Center Member Name */}
                <div className="relative z-10 my-auto">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">HONORARY TIFOSO</span>
                  <span className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide">
                    {tifosiName || 'TIFOSO SUPREMO'}
                  </span>
                  <div className="text-xs font-mono text-ferrari-yellow font-bold mt-0.5">
                    {selectedDriver}
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/60">
                  <div>
                    <span className="block text-white/40 text-[8px] uppercase">AFFILIATION</span>
                    <span className="text-white font-medium">{chapter}</span>
                  </div>

                  <div className="text-right">
                    <span className="block text-white/40 text-[8px] uppercase">SERIAL PASS</span>
                    <span className="text-ferrari-red font-bold font-mono">{serialCode}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Exportable Official Tifosi Passport Modal */}
      <TifosiPassportModal
        isOpen={isPassportModalOpen}
        onClose={() => setIsPassportModalOpen(false)}
      />
    </section>
  )
}

export default TifosiWall

