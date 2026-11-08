import React, { useState, useEffect } from 'react'
import {
  Volume2,
  VolumeX,
  Search,
  Radio,
  Tv,
  Calendar,
  Trophy,
  Users,
  Shield,
  Layers,
  ChevronDown,
  X,
  Activity,
  Sliders,
  Settings,
  Zap,
  Flag,
  Gauge,
  Compass,
  FileText,
} from 'lucide-react'

interface NavbarProps {
  currentRoute: string
  onNavigate: (route: string) => void
  isMuted: boolean
  onToggleSound: () => void
  onOpenSearch: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  isMuted,
  onToggleSound,
  onOpenSearch,
}) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [opsDropdownOpen, setOpsDropdownOpen] = useState(false)
  const [champDropdownOpen, setChampDropdownOpen] = useState(false)
  const [intelDropdownOpen, setIntelDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = (route: string) => {
    onNavigate(route)
    setMobileMenuOpen(false)
    setOpsDropdownOpen(false)
    setChampDropdownOpen(false)
    setIntelDropdownOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isOpsActive = ['home', 'pitwall', 'live-race', 'live-telemetry', 'live-telemetry-ferrari', 'compare'].includes(currentRoute)
  const isChampActive = ['standings', 'results', 'calendar', 'drivers', 'teams'].includes(currentRoute)
  const isIntelActive = ['news', 'circuits', 'ferrari-hub'].includes(currentRoute)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ${
        scrolled
          ? 'bg-[#080808]/95 backdrop-blur-md border-b border-[#292929] py-2 shadow-2xl'
          : 'bg-[#080808]/90 backdrop-blur-sm border-b border-[#1E2230] py-2.5'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand & Crest */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer select-none group border-r border-[#292929] pr-6"
        >
          {/* Square technical crest container */}
          <div className="w-8 h-10 border border-[#292929] bg-[#111111] p-0.5 flex items-center justify-center transition-colors group-hover:border-[#E10600]">
            <svg viewBox="0 0 100 125" className="w-full h-full">
              <path
                d="M 50 5 L 92 18 C 92 75 50 115 50 115 C 50 115 8 75 8 18 Z"
                fill="#FED500"
                stroke="#000000"
                strokeWidth="3.5"
              />
              <rect x="18" y="10" width="21" height="8" fill="#008C45" />
              <rect x="39" y="10" width="22" height="8" fill="#FFFFFF" />
              <rect x="61" y="10" width="21" height="8" fill="#CD212A" />
              <path
                d="M 52 35 C 52 32 50 28 47 28 C 45 28 44 30 45 32 C 45 35 48 37 49 40 C 49 43 45 46 45 49 C 43 48 42 45 40 45 C 38 45 37 47 38 49 C 40 52 43 55 45 58 C 44 62 42 66 38 72 C 37 74 38 76 40 76 C 42 76 45 72 47 67 C 48 68 50 71 52 75 C 53 77 55 77 56 75 C 57 73 54 68 52 64 C 55 62 58 57 58 52 C 58 46 54 41 52 35 Z"
                fill="#050505"
              />
              <text x="32" y="94" fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#000">
                S
              </text>
              <text x="56" y="94" fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#000">
                F
              </text>
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-display font-black tracking-wider text-white text-base sm:text-lg uppercase leading-none">
              SCUDERIA <span className="text-[#E10600]">FERRARI</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#D8D8D8]/70 uppercase mt-0.5">
              PIT WALL MISSION CONTROL // 2026
            </span>
          </div>
        </div>

        {/* Grouped Professional Navigation */}
        <div className="hidden xl:flex items-center gap-1 font-mono text-xs tracking-wider">
          {/* Section: RACE OPERATIONS */}
          <div className="relative">
            <button
              onClick={() => {
                setOpsDropdownOpen(!opsDropdownOpen)
                setChampDropdownOpen(false)
                setIntelDropdownOpen(false)
              }}
              className={`px-3 py-2 border flex items-center gap-1.5 transition-all ${
                isOpsActive
                  ? 'border-[#E10600] text-white bg-[#1B1B1B] font-bold'
                  : 'border-transparent text-[#D8D8D8] hover:text-white hover:bg-[#161616]'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-[#E10600]" />
              <span className="font-bold">RACE OPERATIONS</span>
              <ChevronDown className="w-3 h-3 text-[#858585]" />
            </button>

            {opsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-[#0E1017] border border-[#292929] shadow-2xl p-1 flex flex-col gap-0.5 z-50">
                <div className="px-3 py-1.5 text-[9px] font-mono uppercase text-[#858585] tracking-widest border-b border-[#1E2230]">
                  TELEMETRY & COMMAND
                </div>
                <button
                  onClick={() => handleNav('pitwall')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center justify-between text-xs ${
                    currentRoute === 'pitwall' || currentRoute === 'home'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-[#E10600] font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-[#E10600]" />
                    <span>PIT WALL COMMAND</span>
                  </span>
                  <span className="text-[10px] px-1 bg-[#292929] text-white">#01</span>
                </button>
                <button
                  onClick={() => handleNav('live-race')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center justify-between text-xs ${
                    currentRoute === 'live-race'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-[#E10600] font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Tv className="w-3.5 h-3.5 text-[#FED500]" />
                    <span>LIVE RACE VIEW</span>
                  </span>
                  <span className="text-[10px] px-1 bg-[#292929] text-white">BROADCAST</span>
                </button>
                <button
                  onClick={() => handleNav('live-telemetry')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center justify-between text-xs ${
                    currentRoute === 'live-telemetry'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-[#E10600] font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>GRID TELEMETRY</span>
                  </span>
                  <span className="text-[10px] px-1 bg-[#292929] text-white">20 CARS</span>
                </button>
                <button
                  onClick={() => handleNav('live-telemetry-ferrari')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center justify-between text-xs ${
                    currentRoute === 'live-telemetry-ferrari'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-[#E10600] font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#E10600]" />
                    <span>FERRARI DUAL COMMAND</span>
                  </span>
                  <span className="text-[10px] px-1 bg-[#E10600] text-white">#16 & #44</span>
                </button>
                <button
                  onClick={() => handleNav('compare')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center justify-between text-xs ${
                    currentRoute === 'compare'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-[#E10600] font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-[#FED500]" />
                    <span>DRIVER COMPARATOR</span>
                  </span>
                  <span className="text-[10px] px-1 bg-[#292929] text-white">VER VS HAM</span>
                </button>
              </div>
            )}
          </div>

          {/* Section: CHAMPIONSHIP */}
          <div className="relative">
            <button
              onClick={() => {
                setChampDropdownOpen(!champDropdownOpen)
                setOpsDropdownOpen(false)
                setIntelDropdownOpen(false)
              }}
              className={`px-3 py-2 border flex items-center gap-1.5 transition-all ${
                isChampActive
                  ? 'border-[#E10600] text-white bg-[#1B1B1B] font-bold'
                  : 'border-transparent text-[#D8D8D8] hover:text-white hover:bg-[#161616]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#FED500]" />
              <span className="font-bold">CHAMPIONSHIP</span>
              <ChevronDown className="w-3 h-3 text-[#858585]" />
            </button>

            {champDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#0E1017] border border-[#292929] shadow-2xl p-1 flex flex-col gap-0.5 z-50">
                <div className="px-3 py-1.5 text-[9px] font-mono uppercase text-[#858585] tracking-widest border-b border-[#1E2230]">
                  FIA WORLD CHAMPIONSHIP
                </div>
                <button
                  onClick={() => handleNav('standings')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center gap-2 text-xs ${
                    currentRoute === 'standings'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-white font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-[#FED500]" />
                  <span>STANDINGS</span>
                </button>
                <button
                  onClick={() => handleNav('results')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center gap-2 text-xs ${
                    currentRoute === 'results'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-white font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5 text-white" />
                  <span>RACE RESULTS</span>
                </button>
                <button
                  onClick={() => handleNav('calendar')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center gap-2 text-xs ${
                    currentRoute === 'calendar'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-white font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2026 CALENDAR</span>
                </button>
                <button
                  onClick={() => handleNav('drivers')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center gap-2 text-xs ${
                    currentRoute === 'drivers'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-white font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-white" />
                  <span>DRIVERS GRID</span>
                </button>
                <button
                  onClick={() => handleNav('teams')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center gap-2 text-xs ${
                    currentRoute === 'teams'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-white font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span>CONSTRUCTORS</span>
                </button>
              </div>
            )}
          </div>

          {/* Section: INTELLIGENCE */}
          <div className="relative">
            <button
              onClick={() => {
                setIntelDropdownOpen(!intelDropdownOpen)
                setOpsDropdownOpen(false)
                setChampDropdownOpen(false)
              }}
              className={`px-3 py-2 border flex items-center gap-1.5 transition-all ${
                isIntelActive
                  ? 'border-[#E10600] text-white bg-[#1B1B1B] font-bold'
                  : 'border-transparent text-[#D8D8D8] hover:text-white hover:bg-[#161616]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">INTELLIGENCE</span>
              <ChevronDown className="w-3 h-3 text-[#858585]" />
            </button>

            {intelDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#0E1017] border border-[#292929] shadow-2xl p-1 flex flex-col gap-0.5 z-50">
                <div className="px-3 py-1.5 text-[9px] font-mono uppercase text-[#858585] tracking-widest border-b border-[#1E2230]">
                  ANALYSIS & DISPATCHES
                </div>
                <button
                  onClick={() => handleNav('news')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center gap-2 text-xs ${
                    currentRoute === 'news'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-white font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>PADDOCK NEWS</span>
                </button>
                <button
                  onClick={() => handleNav('circuits')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center gap-2 text-xs ${
                    currentRoute === 'circuits'
                      ? 'border-[#E10600] bg-[#1B1B1B] text-white font-bold'
                      : 'border-transparent text-[#D8D8D8] hover:bg-[#181B24] hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-white" />
                  <span>CIRCUITS ATLAS</span>
                </button>
                <button
                  onClick={() => handleNav('ferrari-hub')}
                  className={`w-full text-left px-3 py-2 border transition-all flex items-center gap-2 text-xs font-bold text-[#E10600] ${
                    currentRoute === 'ferrari-hub'
                      ? 'border-[#E10600] bg-[#1B1B1B]'
                      : 'border-transparent hover:bg-[#181B24]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-[#E10600]" />
                  <span>FERRARI HUB (#16 / #44)</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Direct Link: Standalone Pit Wall */}
          <button
            onClick={() => handleNav('pitwall')}
            className={`px-3 py-2 border transition-all flex items-center gap-1.5 font-bold ${
              currentRoute === 'pitwall'
                ? 'border-[#E10600] bg-[#E10600] text-white'
                : 'border-[#292929] bg-[#111111] text-[#FED500] hover:border-[#FED500] hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>PIT WALL HUD</span>
          </button>
        </div>

        {/* Right Tools HUD: Search, Sound Toggle, Admin, Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 border border-[#292929] bg-[#111111] hover:border-[#E10600] text-[#D8D8D8] hover:text-white transition-all text-xs font-mono"
            title="Global Search (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-[#E10600]" />
            <span className="hidden sm:inline font-bold">SEARCH</span>
            <kbd className="hidden md:inline px-1 py-0.2 bg-[#1B1B1B] text-[9px] text-[#858585] border border-[#292929]">
              ⌘K
            </kbd>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 border transition-all ${
              !isMuted
                ? 'bg-[#E10600] border-[#E10600] text-white'
                : 'bg-[#111111] border-[#292929] text-[#858585] hover:text-white hover:border-[#858585]'
            }`}
            title={!isMuted ? 'Mute Ferrari V6 Sound Engine' : 'Enable Ferrari V6 Sound Engine'}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Admin / Stream Configuration */}
          <button
            onClick={() => handleNav('admin')}
            className={`p-2 border transition-all ${
              currentRoute === 'admin'
                ? 'bg-[#1B1B1B] border-[#E10600] text-[#FED500]'
                : 'bg-[#111111] border-[#292929] text-[#858585] hover:text-white hover:border-[#858585]'
            }`}
            title="Telemetry Stream & Dashboard Administration"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 border border-[#292929] bg-[#111111] text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#080808] border-b border-[#292929] p-4 flex flex-col gap-1 font-mono text-xs max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-150">
          <div className="px-2 py-1 text-[10px] text-[#858585] uppercase tracking-widest border-b border-[#1E2230] mb-1">
            RACE OPERATIONS
          </div>
          <button
            onClick={() => handleNav('pitwall')}
            className="text-left py-2.5 px-3 border border-[#E10600] bg-[#1B1B1B] text-[#E10600] font-bold flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#E10600]" />
              <span>PIT WALL WORKSTATION</span>
            </span>
            <span className="w-2 h-2 bg-[#E10600]" />
          </button>
          <button
            onClick={() => handleNav('live-race')}
            className="text-left py-2.5 px-3 border border-[#292929] bg-[#111111] text-white font-bold flex items-center justify-between"
          >
            <span>LIVE RACE VIDEO & TELEMETRY</span>
            <span className="w-2 h-2 bg-[#FED500]" />
          </button>
          <button
            onClick={() => handleNav('live-telemetry')}
            className="text-left py-2 px-3 border border-[#1E2230] text-[#D8D8D8] hover:bg-[#161616]"
          >
            GRID TELEMETRY (20 CARS)
          </button>
          <button
            onClick={() => handleNav('live-telemetry-ferrari')}
            className="text-left py-2 px-3 border border-[#1E2230] text-[#E10600] font-bold hover:bg-[#161616]"
          >
            FERRARI DUAL COMMAND (#16 & #44)
          </button>
          <button
            onClick={() => handleNav('compare')}
            className="text-left py-2 px-3 border border-[#1E2230] text-[#FED500] hover:bg-[#161616]"
          >
            DRIVER COMPARISON (VER VS HAM)
          </button>

          <div className="px-2 py-1 text-[10px] text-[#858585] uppercase tracking-widest border-b border-[#1E2230] mt-3 mb-1">
            CHAMPIONSHIP
          </div>
          <button
            onClick={() => handleNav('standings')}
            className="text-left py-2 px-3 border border-[#1E2230] text-[#D8D8D8] hover:bg-[#161616]"
          >
            STANDINGS (DRIVERS & CONSTRUCTORS)
          </button>
          <button
            onClick={() => handleNav('results')}
            className="text-left py-2 px-3 border border-[#1E2230] text-[#D8D8D8] hover:bg-[#161616]"
          >
            RACE RESULTS
          </button>
          <button
            onClick={() => handleNav('calendar')}
            className="text-left py-2 px-3 border border-[#1E2230] text-[#D8D8D8] hover:bg-[#161616]"
          >
            2026 RACE CALENDAR
          </button>
          <button
            onClick={() => handleNav('drivers')}
            className="text-left py-2 px-3 border border-[#1E2230] text-[#D8D8D8] hover:bg-[#161616]"
          >
            DRIVERS GRID
          </button>
          <button
            onClick={() => handleNav('teams')}
            className="text-left py-2 px-3 border border-[#1E2230] text-[#D8D8D8] hover:bg-[#161616]"
          >
            CONSTRUCTORS TEAMS
          </button>

          <div className="px-2 py-1 text-[10px] text-[#858585] uppercase tracking-widest border-b border-[#1E2230] mt-3 mb-1">
            INTELLIGENCE & SYSTEM
          </div>
          <button
            onClick={() => handleNav('news')}
            className="text-left py-2 px-3 border border-[#1E2230] text-[#D8D8D8] hover:bg-[#161616]"
          >
            PADDOCK NEWS & PRESS
          </button>
          <button
            onClick={() => handleNav('circuits')}
            className="text-left py-2 px-3 border border-[#1E2230] text-[#D8D8D8] hover:bg-[#161616]"
          >
            CIRCUITS ATLAS
          </button>
          <button
            onClick={() => handleNav('ferrari-hub')}
            className="text-left py-2 px-3 border border-[#E10600] bg-[#111111] text-white font-bold"
          >
            SCUDERIA FERRARI SANCTUARY (#16 & #44)
          </button>
          <button
            onClick={() => handleNav('admin')}
            className="text-left py-2 px-3 border border-[#292929] bg-[#161616] text-[#FED500] font-bold mt-2"
          >
            SYSTEM ADMINISTRATION & STREAM SETTINGS
          </button>
        </div>
      )}

      {/* Tricolore Ribbon Stripe on bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] flex">
        <div className="w-1/3 bg-[#008C45]" />
        <div className="w-1/3 bg-[#F4F5F0]" />
        <div className="w-1/3 bg-[#E10600]" />
      </div>
    </nav>
  )
}

export default Navbar
