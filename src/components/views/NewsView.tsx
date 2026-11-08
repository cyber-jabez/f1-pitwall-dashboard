import React, { useState } from 'react'
import { NEWS_ARTICLES, NewsArticle } from '../../data/f1Data'
import { DataProvenanceBadge } from '../ui/DataProvenanceBadge'
import { createProvenance } from '../../services/dataProvenance'
import ShinyText from '../reactbits/ShinyText'
import { Clock, X, User } from 'lucide-react'

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
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-[#E10600]" />
            <span className="font-mono text-[10px] text-[#858585] uppercase tracking-widest block">
              MOTORSPORT PADDOCK NEWSWIRE // VERIFIED DISPATCHES & PRESS RELEASES
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            F1 & SCUDERIA <ShinyText text="PADDOCK NEWS" speed={2.5} className="text-[#FED500]" />
          </h1>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#111111] p-1 rounded-none border border-[#292929] font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-none font-bold uppercase transition-all ${
                selectedCategory === cat ? 'bg-[#E10600] text-white' : 'text-[#858585] hover:text-white'
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="p-5 rounded-none bg-[#0E1017] border border-[#292929] hover:border-[#E10600] transition-colors cursor-pointer flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex justify-between items-center text-xs font-mono text-[#858585] mb-2.5">
                <span className="px-2 py-0.5 rounded-none bg-[#1F1215] text-[#E10600] font-bold border border-[#E10600]/40 text-[10px] uppercase">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-[10px]">
                  <Clock className="w-3 h-3" />
                  {article.readingTime}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-white leading-snug group-hover:text-[#FED500] transition-colors mb-2 uppercase">
                {article.title}
              </h3>
              <p className="font-sans text-xs text-[#858585] line-clamp-3 mb-4 leading-relaxed">{article.summary}</p>
            </div>

            <div className="pt-3 border-t border-[#222222] flex justify-between items-center text-[10px] font-mono text-[#858585]">
              <span className="truncate max-w-[180px] font-bold text-[#D8D8D8] uppercase">{article.source}</span>
              <span className="text-[#FED500] font-bold tabular-nums">{article.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0B0D14] border border-[#292929] rounded-none p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-none bg-[#1A1A1A] border border-[#333333] hover:bg-[#E10600] hover:border-[#E10600] text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded-none bg-[#E10600] text-white font-bold text-[10px] uppercase">
                {activeArticle.category}
              </span>
              <span className="text-[#858585] text-[10px] tabular-nums">{activeArticle.date}</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-tight mb-4 pr-10">
              {activeArticle.title}
            </h2>

            <div className="flex items-center gap-3 font-mono text-xs text-[#858585] mb-5 pb-3 border-b border-[#222222]">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#FED500]" />
                BY {activeArticle.author.toUpperCase()}
              </span>
              <span>//</span>
              <span className="text-emerald-400 font-bold uppercase">SOURCE: {activeArticle.source}</span>
            </div>

            <div className="font-sans text-sm sm:text-base text-[#D8D8D8] leading-relaxed space-y-4 mb-6">
              <p className="font-medium text-white text-base sm:text-lg border-l-2 border-[#E10600] pl-4">
                {activeArticle.summary}
              </p>
              <p>{activeArticle.content}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#222222]">
              {activeArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-none bg-[#111111] border border-[#292929] font-mono text-[10px] text-[#858585] uppercase"
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
