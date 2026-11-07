import React, { useState } from 'react'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { ImageIcon, X, Maximize2 } from 'lucide-react'

export const GalleryView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const galleryItems = [
    {
      id: 1,
      title: 'Monza 2024 Podium Euphoria',
      subtitle: 'Charles Leclerc celebrated by 150,000 Tifosi under the scarlet wave',
      category: 'Ferrari',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 2,
      title: 'Lewis Hamilton First Maranello Test',
      subtitle: 'Sir Lewis at Fiorano test track donning the iconic Ferrari overalls',
      category: 'Hamilton',
      image: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 3,
      title: '499P Centenary Victory at Le Mans',
      subtitle: 'Ferrari conquers the Circuit de la Sarthe back-to-back in 2023 & 2024',
      category: 'Historic',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 4,
      title: 'Eau Rouge Raidillon Sunset Ascent',
      subtitle: 'High-downforce compression through Spa-Francorchamps legendary turn',
      category: 'Circuits',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 5,
      title: 'Ferrari Pit Crew Sub-2.0s Execution',
      subtitle: 'Mechanics changing four 18-inch Pirelli tyres in 1.95 seconds flat',
      category: 'Pit Lane',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 6,
      title: 'Michael Schumacher F2004 Screaming V10',
      subtitle: 'The golden era of Maranello dominance at the Temple of Speed',
      category: 'Historic',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    },
  ]

  const categories = ['All', 'Ferrari', 'Hamilton', 'Historic', 'Circuits', 'Pit Lane']

  const filteredItems = galleryItems.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  )

  return (
    <div className="min-h-screen bg-[#06070A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ferrari-border/70 pb-4">
        <div>
          <span className="font-mono text-xs text-white/50 uppercase tracking-widest block mb-1">
            CINEMATIC MOTORSPORT PHOTOGRAPHY // CORSE GALLERIA
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            MOTORSPORT <ShinyText text="GALLERY" speed={2.5} className="text-ferrari-yellow" />
          </h1>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 bg-[#0E1118] p-1.5 rounded-2xl border border-white/10 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all ${
                activeCategory === cat ? 'bg-ferrari-red text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item.image)}
            className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#0E1119] border border-white/10 hover:border-ferrari-red/60 transition-all cursor-pointer shadow-2xl"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
              <span className="px-2 py-0.5 rounded bg-ferrari-red text-white font-mono text-[9px] font-bold uppercase w-max mb-2">
                {item.category}
              </span>
              <h3 className="font-display font-black text-xl text-white uppercase leading-snug">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-white/70 line-clamp-1 mt-1">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-ferrari-red text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <img src={selectedImage} alt="Enlarged" className="max-w-5xl max-h-[85vh] rounded-2xl shadow-2xl object-contain" />
        </div>
      )}
    </div>
  )
}

export default GalleryView

