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
} from 'lucide-react'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'

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
  const [telemetryDropdownOpen, setTelemetryDropdownOpen] = useState(false)
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = (route: string) => {
    onNavigate(route)
    setMobileMenuOpen(false)
    setTelemetryDropdownOpen(false)
    setMoreDropdownOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07080C]/95 backdrop-blur-2xl border-b border-ferrari-border/70 py-2.5 shadow-2xl'
          : 'bg-[#07080C]/80 backdrop-blur-xl border-b border-white/5 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Ferrari Cavallino Rampante Crest & Scuderia Branding */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-8 h-10 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 100 125" className="w-full h-full drop-shadow-[0_0_12px_rgba(254,213,0,0.4)]">
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
            <span className="font-display font-black tracking-widest text-white text-sm sm:text-base uppercase leading-none flex items-center gap-1.5">
              SCUDERIA <span className="text-ferrari-red">FERRARI</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-ferrari-yellow/90 uppercase mt-0.5">
              F1 COMMAND CENTRE // 2026
            </span>
          </div>
        </div>

        {/* Primary Desktop Navigation Bar */}
        <div className="hidden xl:flex items-center gap-1 text-[11px] font-mono tracking-wider">
          <button
            onClick={() => handleNav('home')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors ${
              currentRoute === 'home' ? 'text-ferrari-yellow font-bold bg-white/5' : 'text-white/70 hover:text-white'
            }`}
          >
            HOME
          </button>

          {/* Dedicated Pit Wall Command Cockpit Link */}
          <button
            onClick={() => handleNav('pitwall')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentRoute === 'pitwall'
                ? 'text-white font-bold bg-amber-500/90 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'text-amber-300 hover:text-white bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>PIT WALL</span>
          </button>

          {/* Live Race Watch Page Link (With live indicator) */}
          <button
            onClick={() => handleNav('live-race')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentRoute === 'live-race'
                ? 'text-white font-bold bg-ferrari-red shadow-[0_0_15px_rgba(255,40,0,0.5)]'
                : 'text-white/90 hover:text-white bg-ferrari-red/20 border border-ferrari-red/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>LIVE RACE</span>
          </button>

          {/* Telemetry Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setTelemetryDropdownOpen(!telemetryDropdownOpen)
                setMoreDropdownOpen(false)
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                currentRoute.includes('telemetry')
                  ? 'text-ferrari-yellow font-bold bg-white/5'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>TELEMETRY</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {telemetryDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-[#0E1119] border border-ferrari-border/80 shadow-2xl p-2 flex flex-col gap-1 z-50">
                <button
                  onClick={() => handleNav('pitwall')}
                  className="w-full text-left px-3 py-2 rounded-xl text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-2 font-bold"
                >
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  <span>PIT WALL COMMAND</span>
                </button>
                <button
                  onClick={() => handleNav('live-telemetry')}
                  className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OPENF1 WORKSTATION</span>
                </button>
                <button
                  onClick={() => handleNav('live-telemetry-ferrari')}
                  className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-ferrari-red/20 transition-colors flex items-center gap-2 font-bold text-ferrari-red"
                >
                  <Shield className="w-3.5 h-3.5 text-ferrari-red" />
                  <span>FERRARI DUAL COMMAND</span>
                </button>
                <button
                  onClick={() => handleNav('telemetry-compare')}
                  className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-ferrari-yellow" />
                  <span>DRIVER COMPARATOR</span>
                </button>
                <button
                  onClick={() => handleNav('telemetry-replay')}
                  className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Tv className="w-3.5 h-3.5 text-sky-400" />
                  <span>HISTORICAL REPLAY</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav('calendar')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors ${
              currentRoute === 'calendar' ? 'text-ferrari-yellow font-bold bg-white/5' : 'text-white/70 hover:text-white'
            }`}
          >
            CALENDAR
          </button>

          <button
            onClick={() => handleNav('standings')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors ${
              currentRoute === 'standings' ? 'text-ferrari-yellow font-bold bg-white/5' : 'text-white/70 hover:text-white'
            }`}
          >
            STANDINGS
          </button>

          <button
            onClick={() => handleNav('circuits')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors ${
              currentRoute === 'circuits' ? 'text-ferrari-yellow font-bold bg-white/5' : 'text-white/70 hover:text-white'
            }`}
          >
            CIRCUITS
          </button>

          <button
            onClick={() => handleNav('news')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors ${
              currentRoute === 'news' ? 'text-ferrari-yellow font-bold bg-white/5' : 'text-white/70 hover:text-white'
            }`}
          >
            NEWS
          </button>

          {/* Ferrari Hub Highlight */}
          <button
            onClick={() => handleNav('ferrari-hub')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1.5 ${
              currentRoute === 'ferrari-hub'
                ? 'text-white bg-ferrari-red shadow-[0_0_12px_rgba(239,26,45,0.6)]'
                : 'text-ferrari-yellow hover:text-white bg-ferrari-yellow/10 border border-ferrari-yellow/30'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-ferrari-red fill-ferrari-red" />
            <span>FERRARI HUB (#16 & #44)</span>
          </button>

          <button
            onClick={() => handleNav('admin')}
            className={`p-2 rounded-xl transition-colors text-white/50 hover:text-white ${
              currentRoute === 'admin' ? 'text-ferrari-yellow bg-white/10' : ''
            }`}
            title="Stream & Dashboard Settings"
          >
            <Settings className="w-4 h-4 text-ferrari-yellow" />
          </button>
        </div>

        {/* Right Tools HUD: Search, Sound Toggle, Launch Control, Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#121520] border border-white/15 text-white/70 hover:text-white hover:border-ferrari-red transition-all text-xs font-mono"
            title="Global Search (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-ferrari-red" />
            <span className="hidden sm:inline">SEARCH</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white/50 border border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-full border transition-all ${
              !isMuted
                ? 'bg-ferrari-red/20 border-ferrari-red text-ferrari-red shadow-[0_0_15px_rgba(255,40,0,0.4)]'
                : 'bg-ferrari-card border-white/15 text-white/60 hover:text-white'
            }`}
            title={!isMuted ? 'Mute V12 Engine Sound' : 'Enable Ferrari V12 Sound Engine'}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#141824] border border-white/15 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#07080C] border-b border-ferrari-border p-6 flex flex-col gap-3 font-mono text-xs max-h-[80vh] overflow-y-auto animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNav('home')}
            className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/10 font-bold"
          >
            HOME
          </button>
          <button
            onClick={() => handleNav('pitwall')}
            className="text-left py-2 px-3 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>PIT WALL WORKSTATION</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </button>
          <button
            onClick={() => handleNav('live-race')}
            className="text-left py-2 px-3 rounded-lg bg-ferrari-red text-white font-bold flex items-center justify-between"
          >
            <span>LIVE RACE (AD-FREE WATCH)</span>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </button>
          <button
            onClick={() => handleNav('live-telemetry')}
            className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/10"
          >
            OPENF1 TELEMETRY WORKSTATION
          </button>
          <button
            onClick={() => handleNav('live-telemetry-ferrari')}
            className="text-left py-2 px-3 rounded-lg text-ferrari-yellow hover:bg-white/10 font-bold"
          >
            FERRARI DUAL COMMAND CENTRE
          </button>
          <button
            onClick={() => handleNav('telemetry-compare')}
            className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/10"
          >
            DRIVER TELEMETRY COMPARE
          </button>
          <button
            onClick={() => handleNav('telemetry-replay')}
            className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/10"
          >
            HISTORICAL TELEMETRY REPLAY
          </button>
          <button
            onClick={() => handleNav('calendar')}
            className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/10"
          >
            RACE CALENDAR (24 GRANDS PRIX)
          </button>
          <button
            onClick={() => handleNav('standings')}
            className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/10"
          >
            CHAMPIONSHIP STANDINGS (DRIVERS & CONSTRUCTORS)
          </button>
          <button
            onClick={() => handleNav('circuits')}
            className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/10"
          >
            CIRCUITS ATLAS & MAPS
          </button>
          <button
            onClick={() => handleNav('news')}
            className="text-left py-2 px-3 rounded-lg text-white hover:bg-white/10"
          >
            LATEST F1 & SCUDERIA NEWS
          </button>
          <button
            onClick={() => handleNav('ferrari-hub')}
            className="text-left py-2 px-3 rounded-lg bg-ferrari-red text-white font-bold flex items-center justify-between"
          >
            <span>SCUDERIA FERRARI (#16 & #44)</span>
            <Shield className="w-3.5 h-3.5 text-white" />
          </button>
          <button
            onClick={() => handleNav('admin')}
            className="text-left py-2 px-3 rounded-lg text-ferrari-yellow font-bold hover:bg-white/10 border-t border-white/10 pt-3 flex items-center justify-between"
          >
            <span>STREAM SETTINGS & ADMIN</span>
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tricolore Ribbon Stripe on bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] flex">
        <div className="w-1/3 bg-[#008C45]" />
        <div className="w-1/3 bg-[#F4F5F0]" />
        <div className="w-1/3 bg-[#CD212A]" />
      </div>
    </nav>
  )
}

export default Navbar
