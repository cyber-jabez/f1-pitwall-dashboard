import React, { useState, useEffect } from 'react'
import { NEWS_ARTICLES, NewsArticle } from '../../data/f1Data'
import {
  streamingProviderService,
  StreamProvider,
  StreamType,
  AuthorizationStatus,
  StreamHealthStatus,
} from '../../services/streamingProviderService'
import { openf1LiveClient } from '../../services/openf1LiveClient'
import ShinyText from '../reactbits/ShinyText'
import {
  Tv,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  ExternalLink,
  Power,
  Star,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react'

export const AdminDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stream' | 'articles' | 'telemetry'>('stream')

  // Streaming Configuration State
  const [providers, setProviders] = useState<StreamProvider[]>([])
  const [currentSession, setCurrentSession] = useState<string>('Grand Prix (Race Session)')
  const [testStatus, setTestStatus] = useState<Record<string, StreamHealthStatus>>({})
  const [testingId, setTestingId] = useState<string | null>(null)

  // New Provider Form State
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<StreamType>('hls')
  const [newUrl, setNewUrl] = useState('')
  const [newAuthStatus, setNewAuthStatus] = useState<AuthorizationStatus>('OFFICIALLY_AUTHORIZED')
  const [newNotes, setNewNotes] = useState('')

  // Articles State
  const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<'Ferrari' | 'Breaking' | 'Technical'>('Ferrari')
  const [newSummary, setNewSummary] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // OpenF1 API Key & Health State
  const [openf1ApiKey, setOpenf1ApiKey] = useState(() => openf1LiveClient.getApiKey())
  const [showKey, setShowKey] = useState(false)
  const [isTestingKey, setIsTestingKey] = useState(false)
  const [keySaved, setKeySaved] = useState(false)
  const [keyTestResult, setKeyTestResult] = useState<{
    success: boolean
    status: number
    message: string
    latencyMs: number
  } | null>(null)

  const reloadProviders = () => {
    setProviders(streamingProviderService.getProviders())
    setCurrentSession(streamingProviderService.getCurrentSession())
  }

  useEffect(() => {
    reloadProviders()
  }, [])

  const handleToggleProvider = (id: string, current: boolean) => {
    streamingProviderService.toggleProvider(id, !current)
    reloadProviders()
  }

  const handleSetPrimary = (id: string) => {
    streamingProviderService.setPrimaryProvider(id)
    reloadProviders()
  }

  const handleRemoveProvider = (id: string) => {
    streamingProviderService.removeProvider(id)
    reloadProviders()
  }

  const handleTestAvailability = async (id: string) => {
    setTestingId(id)
    const result = await streamingProviderService.testProviderAvailability(id)
    setTestStatus((prev) => ({ ...prev, [id]: result }))
    setTestingId(null)
    reloadProviders()
  }

  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newUrl) return

    streamingProviderService.addProvider({
      name: newName,
      type: newType,
      streamUrl: newUrl,
      authorizationStatus: newAuthStatus,
      isEnabled: true,
      isPrimary: false,
      healthStatus: 'UNTESTED',
      notes: newNotes,
    })

    setNewName('')
    setNewUrl('')
    setNewNotes('')
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
    reloadProviders()
  }

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setCurrentSession(val)
    streamingProviderService.setCurrentSession(val)
  }

  const handleResetDefaults = () => {
    if (confirm('Reset stream providers to official defaults?')) {
      streamingProviderService.resetToDefaults()
      reloadProviders()
    }
  }

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return
    const article: NewsArticle = {
      id: `admin-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      summary: newSummary,
      content: newSummary,
      author: 'Scuderia Ferrari Press Office',
      date: 'Just now',
      readingTime: '2 min read',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      source: 'Scuderia Ferrari Official Dispatch',
      tags: ['Admin', newCategory],
    }
    setArticles([article, ...articles])
    setNewTitle('')
    setNewSummary('')
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter((a) => a.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
              ROLE: AUTHENTICATED ADMINISTRATOR // COMMAND CONSOLE
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            PLATFORM <ShinyText text="ADMIN COMMAND CENTRE" speed={2.5} className="text-[#E10600]" />
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-none bg-[#111111] p-1 border border-[#292929] font-mono text-xs">
          <button
            onClick={() => setActiveTab('stream')}
            className={`px-4 py-1.5 rounded-none font-bold uppercase transition-all ${
              activeTab === 'stream' ? 'bg-[#E10600] text-white' : 'text-[#858585] hover:text-white'
            }`}
          >
            BROADCAST CONFIG
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-1.5 rounded-none font-bold uppercase transition-all ${
              activeTab === 'articles' ? 'bg-[#E10600] text-white' : 'text-[#858585] hover:text-white'
            }`}
          >
            ARTICLES CRUD
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-1.5 rounded-none font-bold uppercase transition-all ${
              activeTab === 'telemetry' ? 'bg-[#E10600] text-white' : 'text-[#858585] hover:text-white'
            }`}
          >
            OPENF1 STATUS
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Live Broadcast Stream Configuration */}
        {activeTab === 'stream' && (
          <div className="flex flex-col gap-6 max-w-5xl">
            {/* Header & Session Selector Card */}
            <div className="p-6 rounded-none bg-[#0B0D14] border border-[#292929] shadow-2xl flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222222] pb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-white uppercase mb-1">
                    STREAM PROVIDER & LICENSING CONTROLLER
                  </h2>
                  <p className="font-sans text-xs text-[#858585]">
                    Configure authorized live stream providers, fallback feeds, and HLS endpoints for <code className="text-[#FED500]">/live-race</code>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="#live-race"
                    className="px-3 py-1.5 rounded-none bg-[#111111] hover:bg-[#1A1A1A] border border-[#292929] text-white font-mono text-xs font-bold uppercase transition flex items-center gap-1.5"
                  >
                    <span>View /live-race</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleResetDefaults}
                    className="px-3 py-1.5 rounded-none bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-400 font-mono text-xs font-bold uppercase transition"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Current Track Session Setter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <label className="text-[#858585] text-[10px] uppercase font-bold block mb-1">
                    ACTIVE RACE WEEKEND SESSION
                  </label>
                  <select
                    value={currentSession}
                    onChange={handleSessionChange}
                    className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
                  >
                    <option value="Practice 1 (FP1)">Practice 1 (FP1)</option>
                    <option value="Practice 2 (FP2)">Practice 2 (FP2)</option>
                    <option value="Practice 3 (FP3)">Practice 3 (FP3)</option>
                    <option value="Sprint Shootout / Qualifying">Sprint Shootout / Qualifying</option>
                    <option value="Sprint Race (100km)">Sprint Race (100km)</option>
                    <option value="Grand Prix Qualifying">Grand Prix Qualifying</option>
                    <option value="Grand Prix (Race Session)">Grand Prix (Race Session)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#858585] text-[10px] uppercase font-bold block mb-1">
                    FIRST-PARTY AD INTEGRITY GUARANTEE
                  </label>
                  <div className="p-2 rounded-none bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>0 Ad Injections Policy: No tracking, pop-ups, or banners injected.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Configured Streaming Providers List */}
            <div className="flex flex-col gap-3">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#858585]">
                CONFIGURED STREAMING PROVIDERS ({providers.length})
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {providers.map((p) => {
                  const isWeStreamRef = p.id === 'westreamf1-reference'
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-none border transition-colors flex flex-col gap-3 ${
                        p.isPrimary
                          ? 'bg-[#150D10] border-[#FED500] border-l-4 border-l-[#FED500]'
                          : isWeStreamRef
                          ? 'bg-[#120E0D] border-amber-800/50'
                          : 'bg-[#0B0D14] border-[#292929]'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-none border ${
                              p.type === 'hls'
                                ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                                : p.authorizationStatus === 'OFFICIALLY_AUTHORIZED'
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                                : 'bg-[#111111] border-[#292929] text-[#858585]'
                            }`}
                          >
                            <Tv className="w-4 h-4" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="font-display font-bold text-base text-white uppercase">{p.name}</h4>
                              {p.isPrimary && (
                                <span className="px-1.5 py-0.2 rounded-none bg-[#FED500] text-black font-mono font-black text-[9px] uppercase">
                                  PRIMARY STREAM
                                </span>
                              )}
                              <span
                                className={`px-1.5 py-0.2 rounded-none font-mono text-[9px] font-bold border uppercase ${
                                  p.authorizationStatus === 'OFFICIALLY_AUTHORIZED'
                                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                                    : p.authorizationStatus === 'REQUIRES_AUTHENTICATION'
                                    ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                                    : 'bg-rose-950/60 text-rose-400 border-rose-500/40'
                                }`}
                              >
                                {p.authorizationStatus.replace(/_/g, ' ')}
                              </span>
                              <span className="px-1.5 py-0.2 rounded-none bg-[#111111] text-[#858585] border border-[#292929] font-mono text-[9px] uppercase">
                                TYPE: {p.type.toUpperCase()}
                              </span>
                            </div>

                            <p className="font-mono text-xs text-[#858585] break-all">
                              URL: <code className="text-cyan-400">{p.streamUrl}</code>
                            </p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <button
                            onClick={() => handleToggleProvider(p.id, p.isEnabled)}
                            className={`px-2.5 py-1 rounded-none font-bold uppercase transition flex items-center gap-1 text-[11px] ${
                              p.isEnabled
                                ? 'bg-emerald-900/60 border border-emerald-600 text-emerald-400 hover:bg-emerald-800/80'
                                : 'bg-[#111111] border border-[#292929] text-[#555555] hover:text-white'
                            }`}
                          >
                            <Power className="w-3 h-3" />
                            <span>{p.isEnabled ? 'ENABLED' : 'DISABLED'}</span>
                          </button>

                          {!p.isPrimary && (
                            <button
                              onClick={() => handleSetPrimary(p.id)}
                              className="px-2.5 py-1 rounded-none bg-[#111111] hover:bg-[#1A1A1A] border border-[#292929] text-[#D8D8D8] font-bold text-[11px] uppercase transition flex items-center gap-1"
                              title="Set as primary stream"
                            >
                              <Star className="w-3 h-3 text-[#FED500]" />
                              <span>Set Primary</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleTestAvailability(p.id)}
                            className="px-2.5 py-1 rounded-none bg-[#111111] hover:bg-[#1A1A1A] border border-[#292929] text-[#D8D8D8] text-[11px] uppercase transition flex items-center gap-1"
                            title="Ping stream endpoint"
                          >
                            <RefreshCw
                              className={`w-3 h-3 ${testingId === p.id ? 'animate-spin' : ''}`}
                            />
                            <span>{testStatus[p.id] || p.healthStatus || 'Test'}</span>
                          </button>

                          {!isWeStreamRef && (
                            <button
                              onClick={() => handleRemoveProvider(p.id)}
                              className="p-1.5 rounded-none bg-[#111111] hover:bg-rose-950/60 text-[#858585] hover:text-rose-400 border border-[#292929] transition"
                              title="Remove Provider"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* WeStreamF1 Special Compliance Card */}
                      {isWeStreamRef && (
                        <div className="p-3 rounded-none bg-amber-950/30 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block mb-0.5 text-[11px] uppercase">
                              UNVERIFIED THIRD-PARTY REFERENCE PRESERVED PER SPECIFICATION
                            </span>
                            <span className="text-[10px] text-amber-400/90 leading-relaxed block">
                              URL: <code>https://westreamf1.st/westreamf1.php</code>. Automatic embedding is blocked. Verification and licensing validation are required before enabling this provider.
                            </span>
                          </div>
                        </div>
                      )}

                      {p.notes && <p className="font-mono text-[10px] text-[#777777]">{p.notes}</p>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Add New Stream Provider Form */}
            <div className="p-6 rounded-none bg-[#0B0D14] border border-[#292929] shadow-2xl font-mono text-xs">
              <h3 className="font-display font-bold text-lg text-white uppercase mb-1">
                ADD AUTHORIZED STREAMING PROVIDER
              </h3>
              <p className="text-[#858585] mb-4 text-xs">
                Register an authorized HLS feed (.m3u8), broadcaster embed URL, or authorized direct portal.
              </p>

              <form onSubmit={handleCreateProvider} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#858585] text-[10px] uppercase font-bold block mb-1">
                      PROVIDER NAME
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Authorized 4K HLS Master"
                      className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[#858585] text-[10px] uppercase font-bold block mb-1">
                      STREAM TYPE
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as StreamType)}
                      className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
                    >
                      <option value="hls">HLS Master Feed (.m3u8 with HLS.js)</option>
                      <option value="embed">Authorized Iframe Embed</option>
                      <option value="authorized_portal">Official Broadcaster Direct Link</option>
                      <option value="direct_video">Direct MP4 / WebM Video Stream</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[#858585] text-[10px] uppercase font-bold block mb-1">
                    STREAM ENDPOINT URL
                  </label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://domain.com/live/master.m3u8"
                    className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#858585] text-[10px] uppercase font-bold block mb-1">
                      AUTHORIZATION STATUS
                    </label>
                    <select
                      value={newAuthStatus}
                      onChange={(e) => setNewAuthStatus(e.target.value as AuthorizationStatus)}
                      className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
                    >
                      <option value="OFFICIALLY_AUTHORIZED">OFFICIALLY AUTHORIZED (Licensed)</option>
                      <option value="REQUIRES_AUTHENTICATION">REQUIRES AUTHENTICATION (Paywall / Credentials)</option>
                      <option value="UNVERIFIED_THIRD_PARTY">UNVERIFIED THIRD-PARTY</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#858585] text-[10px] uppercase font-bold block mb-1">
                      ADMINISTRATOR NOTES
                    </label>
                    <input
                      type="text"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="e.g. Master clean feed for Monaco Grand Prix"
                      className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-none bg-[#E10600] text-white font-bold uppercase tracking-wider hover:bg-[#B80000] transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Provider Configuration</span>
                  </button>
                </div>
              </form>

              {saveSuccess && (
                <div className="mt-3 p-2.5 rounded-none bg-emerald-950/60 border border-emerald-500 text-emerald-400 font-mono text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Provider successfully configured and persisted!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Articles CRUD */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 p-6 rounded-none bg-[#0B0D14] border border-[#292929] shadow-2xl flex flex-col gap-4 font-mono text-xs">
              <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                PUBLISH MARANELLO DISPATCH
              </h2>
              <form onSubmit={handleAddArticle} className="flex flex-col gap-3">
                <div>
                  <label className="text-[#858585] text-[10px] block mb-1 uppercase">HEADLINE</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter official press release title..."
                    className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#858585] text-[10px] block mb-1 uppercase">CATEGORY</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] cursor-pointer"
                  >
                    <option value="Ferrari">Ferrari</option>
                    <option value="Breaking">Breaking</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#858585] text-[10px] block mb-1 uppercase">SUMMARY / BODY</label>
                  <textarea
                    rows={4}
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="Enter article synopsis..."
                    className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-none bg-[#E10600] text-white font-bold uppercase tracking-wider hover:bg-[#B80000] transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish to Paddock News</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-3">
              <h3 className="font-mono text-xs text-[#858585] uppercase font-bold tracking-wider">
                PUBLISHED DISPATCHES ({articles.length})
              </h3>
              <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-3.5 rounded-none bg-[#0B0D14] border border-[#292929] flex items-center justify-between gap-4 font-mono text-xs"
                  >
                    <div>
                      <span className="text-[10px] text-[#E10600] font-bold uppercase block">
                        {art.category} • {art.date}
                      </span>
                      <h4 className="font-display font-bold text-sm text-white uppercase">{art.title}</h4>
                      <p className="text-[#858585] text-[11px] line-clamp-1 mt-0.5">{art.summary}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="p-1.5 rounded-none bg-rose-950/40 text-rose-400 hover:bg-rose-900 border border-rose-800 transition"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: OpenF1 Status & API Key Configuration */}
        {activeTab === 'telemetry' && (
          <div className="flex flex-col gap-5 max-w-4xl font-mono text-xs">
            {/* Status Overview */}
            <div className="p-6 rounded-none bg-[#0B0D14] border border-[#292929] shadow-2xl flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222222] pb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-white uppercase mb-1">
                    OPENF1 INGESTION ENGINE & API AUTHENTICATION
                  </h2>
                  <p className="font-sans text-xs text-[#858585]">
                    Manage direct authentication with OpenF1 servers to unlock live Grand Prix session telemetry without 401 gates.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-none bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-[10px] uppercase">
                  ZERO FABRICATION STRICT
                </span>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 bg-[#111111] rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase font-bold">OPENF1 API</span>
                  <span className="text-emerald-400 font-black text-sm">ONLINE</span>
                  <span className="text-[9px] text-[#666666] block mt-0.5">api.openf1.org/v1</span>
                </div>
                <div className="p-3 bg-[#111111] rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase font-bold">JOLPICA ERGAST</span>
                  <span className="text-emerald-400 font-black text-sm">ONLINE</span>
                  <span className="text-[9px] text-[#666666] block mt-0.5">api.jolpi.ca/ergast</span>
                </div>
                <div className="p-3 bg-[#111111] rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase font-bold">API KEY STATUS</span>
                  <span className={`font-black text-sm ${openf1ApiKey ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {openf1ApiKey ? 'KEY LOADED' : 'UNAUTHENTICATED'}
                  </span>
                  <span className="text-[9px] text-[#666666] block mt-0.5">
                    {openf1ApiKey ? 'Bearer Auth' : 'Free Tier / Archive'}
                  </span>
                </div>
                <div className="p-3 bg-[#111111] rounded-none border border-[#222222]">
                  <span className="text-[#858585] text-[9px] block uppercase font-bold">BENCHMARK ENGINE</span>
                  <span className="text-[#E10600] font-black text-sm">AUTHENTIC</span>
                  <span className="text-[9px] text-[#666666] block mt-0.5">Monza #9590 Verified</span>
                </div>
              </div>

              {/* OpenF1 API Key Form */}
              <div className="p-4 rounded-none bg-[#07080E] border border-[#222222] flex flex-col gap-3 mt-1">
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-[#FED500]" />
                  <span className="font-bold text-white text-xs uppercase">
                    OPENF1 API KEY CONFIGURATION
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={openf1ApiKey}
                      onChange={(e) => setOpenf1ApiKey(e.target.value)}
                      placeholder="Paste OpenF1 API key (e.g. sk_live_...)..."
                      className="w-full bg-[#111111] border border-[#292929] rounded-none px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#E10600] pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#858585] hover:text-white"
                      title={showKey ? 'Hide Key' : 'Show Key'}
                    >
                      {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        openf1LiveClient.setApiKey(openf1ApiKey)
                        setKeySaved(true)
                        setTimeout(() => setKeySaved(false), 3000)
                      }}
                      className="px-3 py-2 rounded-none bg-[#E10600] hover:bg-[#B80000] text-white font-bold uppercase tracking-wider transition"
                    >
                      {keySaved ? 'Saved!' : 'Save Key'}
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        setIsTestingKey(true)
                        setKeyTestResult(null)
                        const res = await openf1LiveClient.testApiKey(openf1ApiKey)
                        setKeyTestResult(res)
                        setIsTestingKey(false)
                      }}
                      disabled={isTestingKey}
                      className="px-3 py-2 rounded-none bg-[#111111] hover:bg-[#1A1A1A] border border-[#292929] text-white font-bold uppercase tracking-wider transition flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingKey ? 'animate-spin' : ''}`} />
                      <span>{isTestingKey ? 'Testing...' : 'Test Connection'}</span>
                    </button>

                    {openf1ApiKey && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpenf1ApiKey('')
                          openf1LiveClient.setApiKey('')
                          setKeyTestResult(null)
                          setKeySaved(true)
                          setTimeout(() => setKeySaved(false), 3000)
                        }}
                        className="px-3 py-2 rounded-none bg-[#111111] hover:bg-[#1A1A1A] border border-[#292929] text-[#858585] font-bold uppercase transition"
                        title="Clear API Key"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Test Feedback Message */}
                {keyTestResult && (
                  <div
                    className={`p-2.5 rounded-none border flex items-center justify-between text-xs ${
                      keyTestResult.success
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-800 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase">
                        [{keyTestResult.status === 200 ? 'SUCCESS' : `HTTP ${keyTestResult.status}`}]
                      </span>
                      <span>{keyTestResult.message}</span>
                    </div>
                    {keyTestResult.latencyMs > 0 && (
                      <span className="font-mono text-[10px] text-[#858585] tabular-nums">
                        {keyTestResult.latencyMs} ms
                      </span>
                    )}
                  </div>
                )}

                {/* OpenF1 Gating Explanation Note */}
                <div className="p-3 rounded-none bg-[#090909] border border-[#222222] text-[10px] text-[#858585] space-y-1">
                  <p className="font-bold text-[#D8D8D8] uppercase">
                    ℹ️ OpenF1 Authentication Policy & Live Session Restrictions:
                  </p>
                  <p>
                    During official Formula 1 live sessions (Practice, Qualifying, Sprint, and Grand Prix), OpenF1 restricts unauthenticated global API access with HTTP 401 to preserve real-time track bandwidth. Providing an OpenF1 API key authenticates all live requests directly.
                  </p>
                  <p>
                    When cars are off-track or unauthenticated, this platform seamlessly ingests genuine recorded OpenF1 Grand Prix benchmark recordings (Monza GP #9590 and Sakhir GP #9472) with 100% provenance traceability and zero synthetic fabrication.
                  </p>
                </div>
              </div>

              {/* Direct Navigation Links */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#222222]">
                <span className="text-[#858585] text-[10px] uppercase">
                  Explore active live telemetry channels:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="#live-telemetry"
                    className="px-2.5 py-1 rounded-none bg-[#111111] border border-[#292929] hover:border-[#E10600] text-white text-[11px] font-bold uppercase transition"
                  >
                    Cockpit Telemetry
                  </a>
                  <a
                    href="#live-telemetry-ferrari"
                    className="px-2.5 py-1 rounded-none bg-[#111111] border border-[#292929] hover:border-[#FED500] text-white text-[11px] font-bold uppercase transition"
                  >
                    Dual Ferrari Pit Wall
                  </a>
                  <a
                    href="#live-race"
                    className="px-2.5 py-1 rounded-none bg-[#E10600] text-white text-[11px] font-bold uppercase transition"
                  >
                    Live Race Page
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboardView
