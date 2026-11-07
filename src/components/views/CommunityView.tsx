import React, { useState } from 'react'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { Users, Award, Flame, MessageSquare, Check, Sparkles } from 'lucide-react'

export const CommunityView: React.FC = () => {
  const [selectedDriverVote, setSelectedDriverVote] = useState<string>('charles-leclerc')
  const [voted, setVoted] = useState(false)
  const [predictionWinner, setPredictionWinner] = useState('Charles Leclerc')

  const handleVote = () => {
    setVoted(true)
  }

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            GLOBAL TIFOSI & F1 FAN SANCTUARY // TRIBUNE DISCUSSIONS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            FAN <ShinyText text="COMMUNITY & PREDICTIONS" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Driver of the Day Poll & Race Predictions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Driver of the Day Voting Card */}
          <div className="p-8 rounded-3xl bg-[#0B0D14] border-2 border-ferrari-border/80 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="px-2.5 py-1 rounded bg-ferrari-red text-white font-mono font-bold text-xs uppercase">
                OFFICIAL FAN POLL
              </span>
              <span className="font-mono text-xs text-emerald-400 font-bold">14,280 VOTES RECORDED</span>
            </div>

            <h2 className="font-display font-black text-2xl text-white uppercase mb-2">
              DRIVER OF THE DAY // MONZA GRAND PRIX
            </h2>
            <p className="font-sans text-xs text-white/60 mb-6">
              Vote for the driver who displayed supreme racecraft, tire preservation, and courage at the Temple of Speed.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {[
                { id: 'charles-leclerc', name: 'Charles Leclerc (#16)', team: 'Ferrari', pct: '64%' },
                { id: 'lewis-hamilton', name: 'Lewis Hamilton (#44)', team: 'Ferrari', pct: '21%' },
                { id: 'oscar-piastri', name: 'Oscar Piastri (#81)', team: 'McLaren', pct: '9%' },
                { id: 'lando-norris', name: 'Lando Norris (#4)', team: 'McLaren', pct: '6%' },
              ].map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => setSelectedDriverVote(cand.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedDriverVote === cand.id
                      ? 'bg-gradient-to-r from-ferrari-red/25 to-[#131622] border-ferrari-red'
                      : 'bg-[#121520] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                      {selectedDriverVote === cand.id && <span className="w-2.5 h-2.5 rounded-full bg-ferrari-red" />}
                    </span>
                    <div>
                      <span className="font-display font-black text-sm text-white block">{cand.name}</span>
                      <span className="font-mono text-[10px] text-white/40">{cand.team}</span>
                    </div>
                  </div>
                  {voted && <span className="font-mono font-bold text-xs text-ferrari-yellow">{cand.pct}</span>}
                </div>
              ))}
            </div>

            <Magnet padding={40} magnetStrength={2.5}>
              <button
                onClick={handleVote}
                disabled={voted}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ferrari-red to-[#B80000] text-white font-display font-black text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,40,0,0.5)] transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" />
                <span>{voted ? 'VOTE RECORDED // GRAZIE TIFOSO!' : 'SUBMIT OFFICIAL VOTE'}</span>
              </button>
            </Magnet>
          </div>

          {/* Grand Prix Winner Prediction */}
          <div className="p-8 rounded-3xl bg-[#0B0D14] border border-white/10 shadow-2xl">
            <h3 className="font-display font-black text-xl text-white uppercase mb-2">
              COMMUNITY GRAND PRIX WINNER PREDICTOR
            </h3>
            <p className="font-sans text-xs text-white/60 mb-4">
              Lock in your prediction for the next race to climb the global Tifosi leaderboard.
            </p>

            <div className="flex gap-3">
              <select
                value={predictionWinner}
                onChange={(e) => setPredictionWinner(e.target.value)}
                className="flex-1 bg-[#141824] border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-ferrari-red"
              >
                <option value="Charles Leclerc">Charles Leclerc (Ferrari)</option>
                <option value="Lewis Hamilton">Lewis Hamilton (Ferrari)</option>
                <option value="Max Verstappen">Max Verstappen (Red Bull)</option>
                <option value="Lando Norris">Lando Norris (McLaren)</option>
              </select>

              <button
                onClick={() => alert(`Prediction locked in for ${predictionWinner}!`)}
                className="px-6 py-2.5 rounded-xl bg-ferrari-yellow text-black font-display font-black text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(254,213,0,0.5)] transition-all"
              >
                LOCK IN
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Debate of the Week & Comments (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#090B12] border border-ferrari-border/80 shadow-2xl">
            <span className="font-mono text-xs text-ferrari-yellow font-bold uppercase tracking-wider block mb-2">
              DEBATE OF THE WEEK
            </span>
            <h3 className="font-display font-black text-xl text-white uppercase leading-snug mb-3">
              "WILL HAMILTON OR LECLERC SECURE FERRARI\'S 16TH WORLD DRIVERS TITLE FIRST?"
            </h3>
            <p className="font-sans text-xs text-white/70 leading-relaxed mb-6">
              With Lewis Hamilton joining Charles Leclerc in Maranello, who possesses the ultimate championship edge across a 24-race calendar?
            </p>

            {/* Comment Thread Sample */}
            <div className="flex flex-col gap-3 font-mono text-xs pt-4 border-t border-white/10">
              <div className="p-3 bg-[#111420] rounded-xl border border-white/5">
                <div className="flex justify-between text-[10px] text-white/40 mb-1">
                  <span className="text-ferrari-red font-bold">@TifosiCurvaNord</span>
                  <span>12m ago</span>
                </div>
                <p className="text-white/80">Leclerc has one-lap qualifying pace unmatched by anyone. If the SF-25 gives him pole, he controls the race pace.</p>
              </div>

              <div className="p-3 bg-[#111420] rounded-xl border border-white/5">
                <div className="flex justify-between text-[10px] text-white/40 mb-1">
                  <span className="text-ferrari-yellow font-bold">@SilverstoneScarlet</span>
                  <span>45m ago</span>
                </div>
                <p className="text-white/80">Hamilton\'s race management and Sunday tire preservation over a full 50-lap stint is where championships are clinched.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityView

