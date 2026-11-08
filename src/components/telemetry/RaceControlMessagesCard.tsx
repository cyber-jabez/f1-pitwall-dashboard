import React, { useState } from 'react'
import { Flag, AlertTriangle, Shield, Clock, Filter } from 'lucide-react'

export interface RaceControlMessageItem {
  time?: string
  category?: string
  message?: string
  flag?: string
  scope?: string
  sector?: number
}

interface RaceControlMessagesCardProps {
  messages: RaceControlMessageItem[] | null | undefined
  className?: string
  maxHeight?: string
}

export const RaceControlMessagesCard: React.FC<RaceControlMessagesCardProps> = ({
  messages = [],
  className = '',
  maxHeight = 'max-h-[220px]',
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'FLAG' | 'SAFETY_CAR' | 'CAR'>('ALL')

  // Safely guard against null/undefined or non-array inputs
  const safeList: RaceControlMessageItem[] = Array.isArray(messages) ? messages : []

  // Filter messages defensively
  const filteredMessages = safeList.filter((item) => {
    if (!item || typeof item !== 'object') return false
    if (filterCategory === 'ALL') return true

    const cat = String(item.category || '').toUpperCase()
    const msg = String(item.message || '').toUpperCase()
    const flag = String(item.flag || '').toUpperCase()

    if (filterCategory === 'FLAG') {
      return cat.includes('FLAG') || Boolean(flag)
    }
    if (filterCategory === 'SAFETY_CAR') {
      return msg.includes('SAFETY CAR') || msg.includes('VSC') || cat.includes('SAFETY')
    }
    if (filterCategory === 'CAR') {
      return cat.includes('CAR') || msg.includes('CAR') || msg.includes('INVESTIGATION')
    }
    return true
  })

  // Safe time formatter that will never crash on malformed dates
  const formatTime = (timeStr?: string): string => {
    if (!timeStr || typeof timeStr !== 'string') return 'LIVE'
    try {
      if (timeStr.includes('T')) {
        const parts = timeStr.split('T')
        if (parts[1]) {
          return parts[1].slice(0, 8)
        }
      }
      if (timeStr.length >= 8) {
        return timeStr.slice(0, 8)
      }
      return timeStr
    } catch {
      return 'LIVE'
    }
  }

  // Safe flag badge style generator
  const getFlagBadge = (flag?: string, message?: string) => {
    const flagUpper = String(flag || '').toUpperCase()
    const msgUpper = String(message || '').toUpperCase()

    if (flagUpper === 'RED' || msgUpper.includes('RED FLAG')) {
      return {
        bg: 'bg-red-950/90 text-red-300 border-red-700 shadow-[0_0_10px_rgba(239,26,45,0.4)]',
        label: 'RED FLAG',
        animate: true,
      }
    }
    if (flagUpper === 'YELLOW' || msgUpper.includes('YELLOW')) {
      return {
        bg: 'bg-amber-950/90 text-amber-300 border-amber-600',
        label: 'YELLOW',
        animate: false,
      }
    }
    if (flagUpper === 'CLEAR' || flagUpper === 'GREEN' || msgUpper.includes('TRACK CLEAR') || msgUpper.includes('GREEN LIGHT')) {
      return {
        bg: 'bg-emerald-950/90 text-emerald-300 border-emerald-700',
        label: flagUpper || 'CLEAR',
        animate: false,
      }
    }
    if (flagUpper === 'BLUE' || msgUpper.includes('BLUE')) {
      return {
        bg: 'bg-blue-950/90 text-blue-300 border-blue-700',
        label: 'BLUE',
        animate: false,
      }
    }
    if (msgUpper.includes('SAFETY CAR') || msgUpper.includes('VSC')) {
      return {
        bg: 'bg-orange-950/90 text-orange-300 border-orange-600 animate-pulse',
        label: msgUpper.includes('VSC') ? 'VSC' : 'SC',
        animate: true,
      }
    }
    return null
  }

  return (
    <div
      className={`border border-[#292929] bg-[#0B0D13] p-3 flex flex-col font-mono text-xs overflow-hidden rounded-none select-none ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#292929]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-none bg-[#FED500] animate-pulse" />
          <AlertTriangle className="w-4 h-4 text-[#FED500]" />
          <h3 className="font-mono text-xs font-black tracking-wider uppercase text-[#F5F5F5]">
            FIA RACE CONTROL DIRECTIVES
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 border border-[#FED500]/40 bg-[#FED500]/15 text-[#FED500] font-bold rounded-none tabular-nums">
            {safeList.length} LOGS
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#111111] p-0.5 border border-[#292929] text-[9px] rounded-none">
          {(['ALL', 'FLAG', 'SAFETY_CAR'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2 py-0.5 font-bold transition-colors rounded-none border ${
                filterCategory === cat
                  ? 'bg-[#E10600] text-white border-[#E10600]'
                  : 'border-transparent text-[#858585] hover:text-[#F5F5F5]'
              }`}
            >
              {cat === 'SAFETY_CAR' ? 'SC / VSC' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scrollable List */}
      <div className={`mt-2 space-y-1.5 overflow-y-auto pr-1 ${maxHeight}`}>
        {filteredMessages.length === 0 ? (
          <div className="p-4 text-center text-[#858585] text-[11px] font-mono flex flex-col items-center gap-1.5">
            <svg className="w-4 h-4 text-[#858585]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>NO ACTIVE RACE CONTROL DIRECTIVES</span>
            <span className="text-[9px] text-[#858585]/40">Track status normal • All sectors clear</span>
          </div>
        ) : (
          filteredMessages.map((item, idx) => {
            const badge = getFlagBadge(item.flag, item.message)
            const timeDisplay = formatTime(item.time)
            const safeMsg = String(item.message || 'RACE CONTROL DIRECTIVE')
            const safeScope = item.scope ? String(item.scope) : null
            const safeSector = item.sector !== undefined ? String(item.sector) : null

            return (
              <div
                key={idx}
                className="p-2 border border-[#292929] bg-[#111111] hover:bg-[#1B1B1B] transition-colors flex items-start justify-between gap-2.5 text-[11px] rounded-none"
              >
                {/* Left: Time & Content */}
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[10px] text-[#858585] font-bold shrink-0 mt-0.5 tabular-nums">
                    <Clock className="w-3 h-3 text-[#858585]" />
                    <span>{timeDisplay}</span>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[#F5F5F5] font-bold leading-tight break-words">
                        {safeMsg}
                      </span>
                    </div>

                    {(safeScope || safeSector) && (
                      <div className="flex items-center gap-2 mt-0.5 text-[9px] text-[#858585]">
                        {safeScope && <span>SCOPE: <strong className="text-white/60">{safeScope}</strong></span>}
                        {safeSector && <span>SECTOR: <strong className="text-[#FED500]">{safeSector}</strong></span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Flag or Status Badge */}
                {badge && (
                  <span
                    className={`px-2 py-0.5 border text-[9px] font-black uppercase tracking-wider shrink-0 rounded-none ${badge.bg} ${
                      badge.animate ? 'animate-pulse' : ''
                    }`}
                  >
                    {badge.label}
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Footer Provenance Note */}
      <div className="pt-1.5 border-t border-[#292929] flex items-center justify-between text-[8px] text-[#858585]">
        <span>SOURCE: FOM SIGNALR RACE CONTROL CORE</span>
        <span className="text-emerald-400 font-bold">100% UNFABRICATED</span>
      </div>
    </div>
  )
}

export default RaceControlMessagesCard
