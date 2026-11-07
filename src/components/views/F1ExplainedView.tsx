import React, { useState } from 'react'
import { F1_GLOSSARY } from '../../data/f1Data'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { BookOpen, Search, Flag, HelpCircle, Layers } from 'lucide-react'

export const F1ExplainedView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Aerodynamics', 'Race Control', 'Strategy', 'Chassis & Engine', 'Sporting']

  const filteredGlossary = F1_GLOSSARY.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            BEGINNERS GUIDE // MOTORSPORT CODEX & RULES
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            F1 <ShinyText text="EXPLAINED & GLOSSARY" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search F1 terms (e.g. DRS, Undercut)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121520] border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-ferrari-red pl-9"
          />
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Core Rules Primer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0B0D14] border border-white/10 shadow-xl">
            <span className="text-xs font-mono text-ferrari-red font-bold uppercase block mb-2">01 // RACE FORMAT</span>
            <h3 className="font-display font-black text-xl text-white uppercase mb-2">GRAND PRIX DISTANCE</h3>
            <p className="font-sans text-xs text-white/70 leading-relaxed">
              Every Grand Prix (except Monaco) covers the fewest laps exceeding 305 kilometres (189.5 miles) with a strict two-hour active racing time limit.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B0D14] border border-white/10 shadow-xl">
            <span className="text-xs font-mono text-ferrari-yellow font-bold uppercase block mb-2">02 // POINTS SYSTEM</span>
            <h3 className="font-display font-black text-xl text-white uppercase mb-2">25-18-15-12-10-8-6-4-2-1</h3>
            <p className="font-sans text-xs text-white/70 leading-relaxed">
              Points are awarded to the top 10 finishers. In sprint races, points are awarded to the top 8 finishers (8 down to 1 point).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B0D14] border border-white/10 shadow-xl">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase block mb-2">03 // TYRE MANDATE</span>
            <h3 className="font-display font-black text-xl text-white uppercase mb-2">TWO DRY COMPOUNDS</h3>
            <p className="font-sans text-xs text-white/70 leading-relaxed">
              In dry races, each driver must run at least two different slick tyre compounds (Soft, Medium, Hard), mandating at least one pit stop.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all ${
                selectedCategory === cat ? 'bg-ferrari-red text-white' : 'bg-[#10131E] text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Searchable Glossary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGlossary.map((item) => (
            <div
              key={item.term}
              className="p-6 rounded-3xl bg-[#0B0D14] border border-white/10 hover:border-ferrari-yellow/60 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-ferrari-yellow font-mono text-[9px] font-bold uppercase inline-block mb-3">
                  {item.category}
                </span>
                <h3 className="font-display font-black text-xl text-white uppercase mb-2">
                  {item.term}
                </h3>
                <p className="font-sans text-xs text-white/70 leading-relaxed">{item.definition}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default F1ExplainedView

