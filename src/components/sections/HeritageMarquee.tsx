import React from 'react'
import LogoLoop, { LogoLoopItem } from '../reactbits/LogoLoop'
import { Trophy, Flag, Flame, Zap, Award } from 'lucide-react'

export const HeritageMarquee: React.FC = () => {
  const heritageItems: LogoLoopItem[] = [
    {
      label: '16 CONSTRUCTORS CHAMPIONSHIPS',
      subtitle: 'ALL-TIME FORMULA 1 RECORD',
      badge: 'F1 RECORD',
      icon: <Trophy className="w-5 h-5 text-ferrari-yellow" />,
    },
    {
      label: '248 GRAND PRIX WINS',
      subtitle: 'FIRST WIN: SILVERSTONE 1951',
      badge: 'HISTORIC',
      icon: <Flag className="w-5 h-5 text-ferrari-red" />,
    },
    {
      label: '10 LE MANS 24H VICTORIES',
      subtitle: 'CENTENARY & BACK-TO-BACK (499P)',
      badge: 'HYPERCAR',
      icon: <Flame className="w-5 h-5 text-ferrari-yellow" />,
    },
    {
      label: '15 DRIVERS CHAMPIONSHIPS',
      subtitle: 'ASCARI TO SCHUMACHER & RAIKKONEN',
      badge: 'LEGENDS',
      icon: <Award className="w-5 h-5 text-emerald-400" />,
    },
    {
      label: '805 FORMULA 1 PODIUMS',
      subtitle: 'MOST IN MOTORSPORT HISTORY',
      badge: 'DOMINANCE',
      icon: <Trophy className="w-5 h-5 text-ferrari-yellow" />,
    },
    {
      label: '253 F1 POLE POSITIONS',
      subtitle: 'MONZA // SPA // SUZUKA // SILVERSTONE',
      badge: 'QUALIFYING',
      icon: <Zap className="w-5 h-5 text-ferrari-red" />,
    },
  ]

  return (
    <div className="py-6 bg-[#090B10] border-y border-ferrari-border/70 relative z-20 overflow-hidden">
      <LogoLoop items={heritageItems} speed={35} gap={28} pauseOnHover={true} />
    </div>
  )
}

export default HeritageMarquee

