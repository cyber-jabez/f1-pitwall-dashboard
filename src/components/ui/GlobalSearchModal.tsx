import React, { useState, useEffect } from 'react'
import { DRIVERS, TEAMS, GRAND_PRIX_CALENDAR, NEWS_ARTICLES, F1_GLOSSARY } from '../../data/f1Data'
import { Search, X, ChevronRight, User, Shield, MapPin, FileText, BookOpen } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0D0F17] border-2 border-ferrari-border rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col gap-4">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-ferrari-red absolute left-4" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drivers, teams, circuits, news, telemetry..."
            className="w-full bg-[#141824] border border-white/20 rounded-2xl py-3 pl-12 pr-10 text-white font-mono text-sm focus:outline-none focus:border-ferrari-red"
          />
          <button
            onClick={onClose}
            className="absolute right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-ferrari-red text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-2 font-mono text-xs pr-1">
          {q && totalResults === 0 && (
            <div className="py-12 text-center text-white/40">
              No matching Formula 1 results found for "{query}".
            </div>
          )}

          {/* Matched Drivers */}
          {matchedDrivers.map((d) => (
            <div
              key={d.id}
              onClick={() => handleSelect('drivers')}
              className="p-3 rounded-xl bg-[#121520] hover:bg-ferrari-red/20 border border-white/5 hover:border-ferrari-red cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-ferrari-red" />
                <span className="text-white font-bold">{d.name} (#{d.number})</span>
                <span className="text-white/40 text-[10px]">{d.team}</span>
              </div>
              <span className="text-[10px] text-ferrari-yellow font-bold">DRIVER ARCHIVE</span>
            </div>
          ))}

          {/* Matched Teams */}
          {matchedTeams.map((t) => (
            <div
              key={t.id}
              onClick={() => handleSelect('teams')}
              className="p-3 rounded-xl bg-[#121520] hover:bg-ferrari-red/20 border border-white/5 hover:border-ferrari-red cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-ferrari-yellow" />
                <span className="text-white font-bold">{t.name}</span>
                <span className="text-white/40 text-[10px]">{t.chassis}</span>
              </div>
              <span className="text-[10px] text-ferrari-yellow font-bold">CONSTRUCTOR</span>
            </div>
          ))}

          {/* Matched Circuits */}
          {matchedCircuits.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelect('circuits')}
              className="p-3 rounded-xl bg-[#121520] hover:bg-ferrari-red/20 border border-white/5 hover:border-ferrari-red cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-bold">{c.circuitName}</span>
                <span className="text-white/40 text-[10px]">{c.country}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">CIRCUIT</span>
            </div>
          ))}

          {/* Matched News */}
          {matchedNews.map((n) => (
            <div
              key={n.id}
              onClick={() => handleSelect('news')}
              className="p-3 rounded-xl bg-[#121520] hover:bg-ferrari-red/20 border border-white/5 hover:border-ferrari-red cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3 truncate max-w-[450px]">
                <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-white font-bold truncate">{n.title}</span>
              </div>
              <span className="text-[10px] text-sky-400 font-bold shrink-0">{n.category}</span>
            </div>
          ))}

          {/* Matched Glossary */}
          {matchedGlossary.map((g) => (
            <div
              key={g.term}
              onClick={() => handleSelect('f1-explained')}
              className="p-3 rounded-xl bg-[#121520] hover:bg-ferrari-red/20 border border-white/5 hover:border-ferrari-red cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3 truncate max-w-[450px]">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white font-bold">{g.term}:</span>
                <span className="text-white/60 text-[10px] truncate">{g.definition}</span>
              </div>
              <span className="text-[10px] text-amber-400 font-bold shrink-0">GLOSSARY</span>
            </div>
          ))}
        </div>

        {/* Footer shortcuts info */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10 text-[10px] font-mono text-white/40">
          <span>NAVIGATION: PRESS ESC TO CLOSE</span>
          <span>CTRL + K SHORTCUT</span>
        </div>
      </div>
    </div>
  )
}

export default GlobalSearchModal

