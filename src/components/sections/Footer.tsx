import React from 'react'
import { ArrowUp, MapPin, Heart, Shield } from 'lucide-react'
import ShinyText from '../reactbits/ShinyText'

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-[#040508] border-t border-ferrari-border/60 pt-16 pb-12 overflow-hidden text-white/70 font-sans">
      {/* Tricolore Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="w-1/3 bg-[#008C45]" />
        <div className="w-1/3 bg-[#FFFFFF]" />
        <div className="w-1/3 bg-[#CD212A]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Maranello Coordinates */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-10 bg-ferrari-yellow rounded-sm border border-black flex items-center justify-center font-display font-black text-black text-sm">
                SF
              </div>
              <div>
                <span className="font-display font-black text-lg text-white uppercase tracking-wider block">
                  SCUDERIA FERRARI
                </span>
                <span className="text-[10px] font-mono text-ferrari-yellow tracking-widest uppercase">
                  MARANELLO S.p.A. // TIFOSI TRIBUTE
                </span>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed max-w-md">
              A tribute to 95+ years of unyielding motorsport passion, 16 World Constructors’ Championships, and the iconic screaming naturally aspirated engines of Maranello.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-white/50">
              <MapPin className="w-3.5 h-3.5 text-ferrari-red" />
              <span>VIA ABETONE INFERIORE 4, MARANELLO (MO) ITALY // 44.5323° N, 10.8640° E</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-2 font-mono text-xs">
            <span className="text-white font-bold uppercase tracking-wider mb-2">F1 DASHBOARD HUBS</span>
            <a href="#live-race" className="text-white/60 hover:text-ferrari-yellow transition-colors">01 // Live Race Stream & Tower</a>
            <a href="#pitwall" className="text-white/60 hover:text-ferrari-yellow transition-colors">02 // Pit Wall Cockpit Telemetry</a>
            <a href="#standings" className="text-white/60 hover:text-ferrari-yellow transition-colors">03 // Standings & Constructors</a>
            <a href="#calendar" className="text-white/60 hover:text-ferrari-yellow transition-colors">04 // Official Race Calendar</a>
            <a href="#circuits" className="text-white/60 hover:text-ferrari-yellow transition-colors">05 // Grand Prix Circuit Maps</a>
            <a href="#news" className="text-white/60 hover:text-ferrari-yellow transition-colors">06 // Paddock & Scuderia News</a>
          </div>

          {/* Col 3: Legal & Back to Top */}
          <div className="flex flex-col justify-between items-start md:items-end">
            <button
              onClick={scrollToTop}
              className="px-4 py-2.5 rounded-xl border border-ferrari-border/80 bg-ferrari-card hover:bg-ferrari-red hover:border-ferrari-red text-white text-xs font-mono transition-all flex items-center gap-2"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            <div className="text-[11px] font-mono text-white/40 text-left md:text-right mt-6">
              <span>UNOFFICIAL FAN MONOLITH</span>
              <span className="block text-[10px]">ALL LOGOS & TRADEMARKS BELONG TO FERRARI S.p.A.</span>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-ferrari-border/40 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white/40 gap-3">
          <div>
            ESSERE FERRARI // FORZA CAVALLINO RAMPANTE FOREVER
          </div>

          <div className="flex items-center gap-1.5 text-white/60">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-ferrari-red fill-ferrari-red" />
            <span>for Ferrari Fans Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

