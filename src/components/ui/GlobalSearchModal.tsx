import React, { useState, useEffect } from 'react'
import { DRIVERS, TEAMS, GRAND_PRIX_CALENDAR, NEWS_ARTICLES, F1_GLOSSARY } from '../../data/f1Data'
import { Search, X, User, Shield, MapPin, FileText, BookOpen } from 'lucide-react'

interface GlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (route: string) => void
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else onNavigate(window.location.hash.replace('#', '') || 'home')
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onNavigate])

  if (!isOpen) return null

  const q = query.toLowerCase().trim()

  const matchedDrivers = q ? DRIVERS.filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)) : []
  const matchedTeams = q ? TEAMS.filter((t) => t.name.toLowerCase().includes(q) || t.principal.toLowerCase().includes(q)) : []
  const matchedCircuits = q ? GRAND_PRIX_CALENDAR.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.circuitName.toLowerCase().includes(q)) : []
  const matchedNews = q ? NEWS_ARTICLES.filter((n) => n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)) : []
  const matchedGlossary = q ? F1_GLOSSARY.filter((g) => g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q)) : []

  const totalResults = matchedDrivers.length + matchedTeams.length + matchedCircuits.length + matchedNews.length + matchedGlossary.length

  const handleSelect = (route: string) => {
    onNavigate(route)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0B0D14] border border-[#292929] rounded-none p-5 shadow-2xl overflow-hidden flex flex-col gap-3 font-mono">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#E10600] absolute left-3.5" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drivers, teams, circuits, news, telemetry..."
            className="w-full bg-[#111111] border border-[#292929] rounded-none py-2.5 pl-10 pr-9 text-white font-mono text-xs focus:outline-none focus:border-[#E10600]"
          />
          <button
            onClick={onClose}
            className="absolute right-2.5 w-6 h-6 rounded-none bg-[#1A1A1A] hover:bg-[#E10600] border border-[#333333] text-white flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-1.5 font-mono text-xs pr-1">
          {q && totalResults === 0 && (
            <div className="py-8 text-center text-[#858585] text-xs uppercase">
              No matching Formula 1 results found for "{query}".
            </div>
          )}

          {/* Matched Drivers */}
          {matchedDrivers.map((d) => (
            <div
              key={d.id}
              onClick={() => handleSelect('drivers')}
              className="p-2.5 rounded-none bg-[#111111] hover:bg-[#150D10] border border-[#222222] hover:border-[#E10600] cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-3.5 h-3.5 text-[#E10600]" />
                <span className="text-white font-bold uppercase">{d.name} (#{d.number})</span>
                <span className="text-[#858585] text-[10px] uppercase">// {d.team}</span>
              </div>
              <span className="text-[9px] text-[#FED500] font-bold uppercase">DRIVER</span>
            </div>
          ))}

          {/* Matched Teams */}
          {matchedTeams.map((t) => (
            <div
              key={t.id}
              onClick={() => handleSelect('teams')}
              className="p-2.5 rounded-none bg-[#111111] hover:bg-[#150D10] border border-[#222222] hover:border-[#E10600] cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-3.5 h-3.5 text-[#FED500]" />
                <span className="text-white font-bold uppercase">{t.name}</span>
                <span className="text-[#858585] text-[10px] uppercase">// {t.chassis}</span>
              </div>
              <span className="text-[9px] text-[#FED500] font-bold uppercase">CONSTRUCTOR</span>
            </div>
          ))}

          {/* Matched Circuits */}
          {matchedCircuits.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelect('circuits')}
              className="p-2.5 rounded-none bg-[#111111] hover:bg-[#150D10] border border-[#222222] hover:border-[#E10600] cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-bold uppercase">{c.circuitName}</span>
                <span className="text-[#858585] text-[10px] uppercase">// {c.country}</span>
              </div>
              <span className="text-[9px] text-emerald-400 font-bold uppercase">CIRCUIT</span>
            </div>
          ))}

          {/* Matched News */}
          {matchedNews.map((n) => (
            <div
              key={n.id}
              onClick={() => handleSelect('news')}
              className="p-2.5 rounded-none bg-[#111111] hover:bg-[#150D10] border border-[#222222] hover:border-[#E10600] cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate max-w-[450px]">
                <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-white font-bold truncate uppercase">{n.title}</span>
              </div>
              <span className="text-[9px] text-cyan-400 font-bold shrink-0 uppercase">{n.category}</span>
            </div>
          ))}

          {/* Matched Glossary */}
          {matchedGlossary.map((g) => (
            <div
              key={g.term}
              onClick={() => handleSelect('f1-explained')}
              className="p-2.5 rounded-none bg-[#111111] hover:bg-[#150D10] border border-[#222222] hover:border-[#E10600] cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate max-w-[450px]">
                <BookOpen className="w-3.5 h-3.5 text-[#FED500] shrink-0" />
                <span className="text-white font-bold uppercase">{g.term}:</span>
                <span className="text-[#858585] text-[10px] truncate">{g.definition}</span>
              </div>
              <span className="text-[9px] text-[#FED500] font-bold shrink-0 uppercase">GLOSSARY</span>
            </div>
          ))}
        </div>

        {/* Footer shortcuts info */}
        <div className="flex justify-between items-center pt-2.5 border-t border-[#222222] text-[10px] font-mono text-[#858585]">
          <span>NAVIGATION: PRESS <kbd className="px-1 py-0.2 rounded-none bg-[#1A1A1A] border border-[#333333] text-white">ESC</kbd> TO CLOSE</span>
          <span><kbd className="px-1 py-0.2 rounded-none bg-[#1A1A1A] border border-[#333333] text-white">CTRL + K</kbd> COMMAND PALETTE</span>
        </div>
      </div>
    </div>
  )
}

export default GlobalSearchModal
