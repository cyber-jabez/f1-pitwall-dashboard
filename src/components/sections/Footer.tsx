import React from 'react'
import { ArrowUp, MapPin, Heart } from 'lucide-react'

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-[#060608] border-t border-[#292929] pt-14 pb-10 overflow-hidden text-[#858585] font-mono">
      {/* Tricolore Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 flex">
        <div className="w-1/3 bg-[#008C45]" />
        <div className="w-1/3 bg-[#FFFFFF]" />
        <div className="w-1/3 bg-[#E10600]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Maranello Coordinates */}
          <div className="md:col-span-2 flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-9 bg-[#FED500] rounded-none border border-black flex items-center justify-center font-display font-black text-black text-sm">
                SF
              </div>
              <div>
                <span className="font-display font-black text-lg text-white uppercase tracking-wider block">
                  SCUDERIA FERRARI
                </span>
                <span className="text-[10px] font-mono text-[#FED500] tracking-widest uppercase">
                  MARANELLO S.p.A. // TIFOSI INTELLIGENCE
                </span>
              </div>
            </div>

            <p className="text-xs text-[#858585] leading-relaxed max-w-md font-sans">
              95+ years of motorsport passion, 16 World Constructors' Championships, and the iconic screaming naturally aspirated engines of Maranello.
            </p>

            <div className="flex items-center gap-2 text-[10px] font-mono text-[#666666]">
              <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
              <span>VIA ABETONE INFERIORE 4, MARANELLO (MO) ITALY // 44.5323° N, 10.8640° E</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-2 font-mono text-xs">
            <span className="text-white font-bold uppercase tracking-wider mb-1 text-[11px]">RACE OPERATIONS</span>
            <a href="#live-race" className="text-[#858585] hover:text-[#FED500] transition-colors">01 // Live Race Stream & Tower</a>
            <a href="#pitwall" className="text-[#858585] hover:text-[#FED500] transition-colors">02 // Pit Wall Telemetry Station</a>
            <a href="#standings" className="text-[#858585] hover:text-[#FED500] transition-colors">03 // Standings & Constructors</a>
            <a href="#calendar" className="text-[#858585] hover:text-[#FED500] transition-colors">04 // Official Race Calendar</a>
            <a href="#circuits" className="text-[#858585] hover:text-[#FED500] transition-colors">05 // Grand Prix Circuit Maps</a>
            <a href="#news" className="text-[#858585] hover:text-[#FED500] transition-colors">06 // Paddock & Scuderia News</a>
          </div>

          {/* Col 3: Legal & Back to Top */}
          <div className="flex flex-col justify-between items-start md:items-end">
            <button
              onClick={scrollToTop}
              className="px-4 py-2 rounded-none border border-[#292929] bg-[#111111] hover:bg-[#E10600] hover:border-[#E10600] text-white text-xs font-mono transition-colors flex items-center gap-2 uppercase font-bold"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            <div className="text-[10px] font-mono text-[#666666] text-left md:text-right mt-6">
              <span className="uppercase block font-bold text-[#858585]">COMMUNITY FAN PLATFORM</span>
              <span className="block">ALL LOGOS & TRADEMARKS BELONG TO FERRARI S.p.A.</span>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-5 border-t border-[#1C1F2B] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#666666] gap-2">
          <div>
            ESSERE FERRARI // FORZA CAVALLINO RAMPANTE FOREVER
          </div>

          <div className="flex items-center gap-1.5 text-[#858585]">
            <span>Engineered for Scuderia Ferrari Fans Worldwide</span>
            <Heart className="w-3 h-3 text-[#E10600] fill-[#E10600]" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
