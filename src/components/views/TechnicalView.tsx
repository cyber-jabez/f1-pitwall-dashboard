import React from 'react'
import { TECHNICAL_ARTICLES } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import WindTunnelLab from '../sections/WindTunnelLab'
import { Wind, Zap, Gauge, Layers, Sliders, ChevronRight } from 'lucide-react'

export const TechnicalView: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest block mb-1">
            MOTORSPORT ENGINEERING & REGULATION CENTRE // CFD & POWERTRAIN
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            TECHNICAL <ShinyText text="ANALYSIS & INNOVATION" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        {/* Interactive Aerodynamics Wind Tunnel Particle Lab */}
        <WindTunnelLab />

        {/* Technical Articles Archive */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-ferrari-yellow" />
            <h2 className="font-display font-black text-2xl text-white uppercase">
              TECHNICAL ENGINEERING ANALYSES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TECHNICAL_ARTICLES.map((article) => (
              <div
                key={article.id}
                className="p-6 rounded-3xl bg-[#0B0D14] border border-white/10 hover:border-emerald-500/60 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-white/50 mb-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                      {article.category}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-display font-black text-xl text-white uppercase mb-2">
                    {article.title}
                  </h3>
                  <p className="font-sans text-xs text-white/70 mb-4">{article.summary}</p>
                  <p className="font-sans text-xs text-white/50 leading-relaxed border-t border-white/5 pt-3">
                    {article.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechnicalView

