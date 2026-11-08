import React, { useState, useEffect, useMemo } from 'react'
import ClickSpark from './components/reactbits/ClickSpark'
import Navbar from './components/sections/Navbar'
import Footer from './components/sections/Footer'

// Dedicated F1 Dashboard Views
import PitWallCommandView from './components/views/PitWallCommandView'
import LiveRaceView from './components/views/LiveRaceView'
import LiveTelemetryView from './components/views/LiveTelemetryView'
import FerrariTelemetryCommandView from './components/views/FerrariTelemetryCommandView'
import TelemetryCompareView from './components/views/TelemetryCompareView'
import CalendarView from './components/views/CalendarView'
import StandingsView from './components/views/StandingsView'
import ResultsView from './components/views/ResultsView'
import TeamsView from './components/views/TeamsView'
import DriversView from './components/views/DriversView'
import FerrariHubView from './components/views/FerrariHubView'
import NewsView from './components/views/NewsView'
import CircuitsView from './components/views/CircuitsView'
import AdminDashboardView from './components/views/AdminDashboardView'
import FerrariNotFoundView from './components/views/FerrariNotFoundView'
import GlobalSearchModal from './components/ui/GlobalSearchModal'

import { FerrariAudioEngine } from './components/audio/WebAudioEngine'

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [audioStarted, setAudioStarted] = useState(false)
  const audioEngine = useMemo(() => new FerrariAudioEngine(), [])

  // Synchronize route with URL hash on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && hash !== currentRoute) {
        // Valid F1 Dashboard Routes
        const validRoutes = [
          'home',
          'pitwall',
          'live-race',
          'live-telemetry',
          'live-telemetry-ferrari',
          'compare',
          'calendar',
          'standings',
          'results',
          'teams',
          'drivers',
          'ferrari-hub',
          'news',
          'circuits',
          'admin',
          '404',
        ]

        if (validRoutes.includes(hash)) {
          setCurrentRoute(hash)
        } else {
          // Unknown route / broken URL -> route to Ferrari 404 page
          setCurrentRoute('404')
        }
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [currentRoute])

  const navigateTo = (route: string) => {
    setCurrentRoute(route)
    window.location.hash = route
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleSound = () => {
    if (!audioStarted) {
      audioEngine.start()
      setAudioStarted(true)
      setIsMuted(false)
    } else {
      const muted = audioEngine.toggleMute()
      setIsMuted(muted)
    }
  }

  return (
    <ClickSpark
      sparkColor={['#FF2800', '#FED500', '#FFFFFF', '#CD212A', '#E5A91E']}
      sparkSize={18}
      sparkRadius={42}
      sparkCount={14}
      sparkWidth={2.5}
      duration={550}
      glow={0.85}
      ring={true}
      className="bg-[#07080C] min-h-screen text-white"
    >
      <div className="w-full min-h-screen flex flex-col">
        {/* Navigation Command Header */}
        <Navbar
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Global Search Overlay Modal (Ctrl + K) */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={navigateTo}
        />

        {/* Dedicated F1 Dashboard Route Dispatcher */}
        <main className="flex-1 w-full">
          {/* Primary F1 Dashboard (Home) */}
          {currentRoute === 'home' && <PitWallCommandView />}

          {/* Standalone Workstation & Video Stream */}
          {currentRoute === 'pitwall' && <PitWallCommandView />}
          {currentRoute === 'live-race' && <LiveRaceView />}

          {/* Real-time Telemetry Workstations */}
          {currentRoute === 'live-telemetry' && <LiveTelemetryView />}
          {currentRoute === 'live-telemetry-ferrari' && <FerrariTelemetryCommandView />}
          {currentRoute === 'compare' && <TelemetryCompareView />}

          {/* Core F1 Racing Information Hubs */}
          {currentRoute === 'standings' && <StandingsView />}
          {currentRoute === 'calendar' && <CalendarView />}
          {currentRoute === 'circuits' && <CircuitsView />}
          {currentRoute === 'news' && <NewsView />}
          {currentRoute === 'results' && <ResultsView />}
          {currentRoute === 'teams' && <TeamsView />}
          {currentRoute === 'drivers' && <DriversView />}

          {/* Scuderia Ferrari Fan Hub (Lewis Hamilton #44 & Charles Leclerc #16) */}
          {currentRoute === 'ferrari-hub' && <FerrariHubView audioEngine={audioEngine} />}

          {/* Admin & Video Stream Configuration */}
          {currentRoute === 'admin' && <AdminDashboardView />}

          {/* Ferrari 404 Gravel Trap View */}
          {currentRoute === '404' && (
            <FerrariNotFoundView onNavigate={navigateTo} audioEngine={audioEngine} />
          )}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </ClickSpark>
  )
}

export default App
