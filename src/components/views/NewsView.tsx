import React, { useState } from 'react'
import { NEWS_ARTICLES, NewsArticle } from '../../data/f1Data'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import { createProvenance } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import { Radio, Clock, ShieldCheck, X, ChevronRight, User, ExternalLink } from 'lucide-react'

export const NewsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null)

  const categories = ['All', 'Breaking', 'Ferrari', 'Technical', 'Driver Transfers', 'FIA', 'F1 Academy']

  const filteredArticles = NEWS_ARTICLES.filter((article) => {
    if (selectedCategory === 'All') return true
    return article.category === selectedCategory
  })

  const newsProvenance = createProvenance(
    'Scuderia Ferrari Official',
    'https://www.ferrari.com/en-EN/formula1/articles',
    'HISTORICAL',
    'OFFICIALLY_VERIFIED'
  )

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            MOTORSPORT PADDOCK NEWSWIRE // VERIFIED DISPATCHES & PRESS RELEASES
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            F1 & SCUDERIA <ShinyText text="PADDOCK NEWS" speed={2.5} className="text-ferrari-red" />
          </h1>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-[#0E1118] p-1.5 rounded-2xl border border-white/10 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all ${
                selectedCategory === cat ? 'bg-ferrari-red text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Provenance Badge */}
      <div className="max-w-7xl mx-auto mb-6">
        <DataProvenanceBadge
          provenance={newsProvenance}
          title="Official Press Release Ingestion // Scuderia Ferrari & FIA"
        />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="p-6 rounded-3xl bg-[#0B0D14] border border-white/10 hover:border-ferrari-red/60 transition-all cursor-pointer flex flex-col justify-between group shadow-xl hover:-translate-y-1"
          >
            <div>
              <div className="flex justify-between items-center text-xs font-mono text-white/50 mb-3">
                <span className="px-2 py-0.5 rounded bg-ferrari-red/20 text-ferrari-red font-bold border border-ferrari-red/30">
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readingTime}
                </span>
              </div>
              <h3 className="font-display font-black text-lg text-white leading-snug group-hover:text-ferrari-yellow transition-colors mb-2">
                {article.title}
              </h3>
              <p className="font-sans text-xs text-white/60 line-clamp-3 mb-4">{article.summary}</p>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/40">
              <span className="truncate max-w-[180px] font-bold text-white/70">{article.source}</span>
              <span className="text-ferrari-yellow font-bold">{article.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0E1119] border-2 border-ferrari-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-ferrari-red text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-ferrari-red text-white font-bold">
                {activeArticle.category}
              </span>
              <span className="text-white/40">{activeArticle.date}</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-tight mb-4">
              {activeArticle.title}
            </h2>

            <div className="flex items-center gap-3 font-mono text-xs text-white/50 mb-6 pb-4 border-b border-white/10">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-ferrari-yellow" />
                BY {activeArticle.author.toUpperCase()}
              </span>
              <span>//</span>
              <span className="text-emerald-400 font-bold">VERIFIED SOURCE: {activeArticle.source}</span>
            </div>

            <div className="font-sans text-sm sm:text-base text-white/80 leading-relaxed space-y-4 mb-6">
              <p className="font-medium text-white text-base sm:text-lg border-l-2 border-ferrari-red pl-4">
                {activeArticle.summary}
              </p>
              <p>{activeArticle.content}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
              {activeArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-[#161924] border border-white/10 font-mono text-xs text-white/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsView
